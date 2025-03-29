import { LitElement, html, unsafeCSS } from "lit";
// @ts-ignore
import styles from "./Slide.styles.css?inline";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import {booleanConverter} from "./util/converters";

@customElement("ilw-slide")
export default class Slide extends LitElement {
    @property()
    theme = "";

    @property({
        type: Boolean,
        converter: booleanConverter,
    })
    overlay = false;

    @property({
        type: Boolean,
        converter: booleanConverter,
    })
    single = false;

    @property()
    controls: "" | "compact" | "none" = "";

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    render() {
        const classes = {
            "slide-inner": true,
            overlay: this.overlay,
            single: this.single,
            compact: this.controls === "compact"
        };

        return html`
            <div class=${classMap(classes)}>
                <div class="content-wrap">
                    <div class="content">
                        <slot></slot>
                    </div>
                    <div class="overlay-buttons">
                        <slot name="buttons"></slot>
                    </div>
                </div>
                <div class="image">
                    <slot name="image"></slot>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-slide": Slide;
    }
}
