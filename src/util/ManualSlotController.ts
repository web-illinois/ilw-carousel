import { LitElement, ReactiveController, ReactiveControllerHost } from "lit";

/**
 * A simple Lit reactive controller to apply manual slotting to a component.
 *
 * Using manual slotting gives us the ability to surround the child nodes with additional
 * elements without resorting to manipulating the page's DOM. This is important for
 * elements with strict parent-child relationships, like `ul` and `li`, since otherwise
 * they would require the component's user to add those elements.
 *
 * When using this:
 * - Make sure your component has `slotAssignment: "manual"` in its shadowRootOptions.
 * - Add the `_observer = new ManualSlotController(this)` property to your component's class.
 * - In your component's render, map over children to create the slots. Something like:
 *
 * ```
 * ${map(Array.from(this.children), () => html`<li><slot></slot></li>`)}
 * ```
 */
export class ManualSlotController implements ReactiveController {
    host: LitElement;

    private observer: MutationObserver;

    constructor(host: ReactiveControllerHost) {
        this.host = host as LitElement;
        this.host.addController(this);
        this.observer = new MutationObserver(() => {
            this.host.requestUpdate();
        });
    }

    /**
     * Find the child nodes and slots, and assign the children to each slot.
     *
     * The render of the host component is expected to create the slots, but this
     * function will take care of assigning the elements to them.
     * @private
     */
    _refreshInternal() {
        let items = Array.from(this.host.children);
        if (this.host?.shadowRoot) {
            let slots = Array.from(this.host.shadowRoot.querySelectorAll("slot"));
            for (let slot of slots) {
                if (items.length > 0) {
                    let item = items.shift();
                    if (item) {
                        slot.assign(item);
                    }
                }
            }
        }
    }

    hostUpdated() {
        // Called by Lit after the host component's render.
        this._refreshInternal();
    }

    hostConnected() {
        this.observer.observe(this.host, { childList: true });
    }

    disconnect() {
        this.observer.disconnect();
    }
}
