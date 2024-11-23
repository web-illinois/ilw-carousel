import { LitElement, html, unsafeCSS } from "lit";
// @ts-ignore
import styles from './Carousel.styles.css?inline';
// @ts-ignore
import "./ilw-carousel.css";
import { customElement, property, query, queryAssignedElements } from "lit/decorators.js";
import Slide from "./Slide";

@customElement('ilw-carousel')
export default class Carousel extends LitElement {

    @property()
    theme = '';

    @property()
    label = '';

    @property({reflect: true, type: Boolean})
    playing = true;

    @property({state: true})
    private slideCount = 0;

    @queryAssignedElements({selector: "ilw-slide"})
    slidesSlot!: Array<Slide>;

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    private onSlotChange() {
        let count = this.slidesSlot.length;
        let i = 0;
        for (let it of this.slidesSlot) {
            it.slideCount = count;
            it.slidePosition = i++;
        }
    }

    render() {
        return html`
            <section class="carousel-inner">
                <div class="play-control">
                    <button type="button" class="play-pause"
                    aria-label=${this.playing ? "Stop slides" : "Start slides"}>
                        ${this.playing ? "⏸" : "⏵"}
                    </button>
                </div>
                <div class="previous">
                    <button type="button" class="previous"
                            aria-label="Previous Slide"
                            aria-controls="carousel-items">
                        <ilw-icon icon="back"></ilw-icon>
                    </button>
                </div>
                <div class="next">
                    <button type="button" class="next"
                            aria-label="Next Slide"
                            aria-controls="carousel-items">
                        <ilw-icon icon="back"></ilw-icon>
                    </button>
                </div>
                <div id="carousel-items" aria-live="off">
                    <slot @slotchange=${this.onSlotChange}></slot>
                </div>
            </section>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ilw-carousel': Carousel
    }
}
