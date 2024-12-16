import { LitElement, html, unsafeCSS } from "lit";
// @ts-ignore
import styles from './Slide.styles.css?inline';
import { customElement, property } from "lit/decorators.js";

@customElement('ilw-slide')
export default class Slide extends LitElement {

    @property()
    theme = '';

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="slide-inner">
                <div class="content">
                    <slot></slot>
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
        'ilw-slide': Slide
    }
}
