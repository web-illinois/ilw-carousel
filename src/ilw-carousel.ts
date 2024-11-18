import { LitElement, html, unsafeCSS } from "lit";
// @ts-ignore
import styles from './ilw-carousel.styles.css?inline';
// @ts-ignore
import "./ilw-carousel.css";
import { customElement, property } from "lit/decorators.js";

@customElement('ilw-carousel')
class Carousel extends LitElement {

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
            <div>
                <slot></slot>
                <p>Oh my lovely carousel</p>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ilw-carousel': Carousel
    }
}
