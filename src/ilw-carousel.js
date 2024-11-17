import { LitElement, html, unsafeCSS } from "lit";
import styles from './ilw-carousel.styles.css?inline';
import './ilw-carousel.css';

class Carousel extends LitElement {

    static get properties() {
        return {
            theme: { type: String, attribute: true }
        };
    }

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
        this.theme = '';
    }

    render() {
        return html`
            <div>
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('ilw-carousel', Carousel);