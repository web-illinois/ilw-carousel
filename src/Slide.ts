import { LitElement, html, unsafeCSS } from "lit";
// @ts-ignore
import styles from './Slide.styles.css?inline';
import { customElement, property } from "lit/decorators.js";

@customElement('ilw-slide')
export default class Slide extends LitElement {

    @property()
    theme = '';

    @property({type: Number})
    slideCount = 0;

    @property({type: Number})
    slidePosition = 0;

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    render() {
        let label = `${this.slidePosition + 1} of ${this.slideCount}`
        return html`
            <div class="slide" role="group" aria-roledescription="slide" aria-label=${label}>
                <div class="image">
                    <slot name="image"></slot>
                </div>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ilw-slide': Slide
    }
}
