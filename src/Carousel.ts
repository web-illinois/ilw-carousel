import { LitElement, html, unsafeCSS, TemplateResult, nothing, PropertyValues } from "lit";
// @ts-ignore
import styles from "./Carousel.styles.css?inline";
// @ts-ignore
import "./ilw-carousel.css";
import { customElement, property, query, queryAll } from "lit/decorators.js";
import { ManualSlotController } from "./util/ManualSlotController";
import { classMap } from "lit/directives/class-map.js";
import "@illinois-toolkit/ilw-icon";
import { styleMap } from "lit/directives/style-map.js";
import { booleanConverter } from "./util/converters";

@customElement("ilw-carousel")
export default class Carousel extends LitElement {
    static shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, slotAssignment: "manual" };

    static get styles() {
        return unsafeCSS(styles);
    }

    /**
     * Label for the whole carousel.
     */
    @property()
    label = "Highlighted content";

    /**
     * Control play/pause state on the carousel. Defaults to false.
     *
     * This value is updated on the component, so it can be used for reading as well.
     */
    @property({
        reflect: true,
        type: Boolean,
        converter: booleanConverter,
    })
    playing = true;

    /**
     * Time in seconds to stay on each slide.
     */
    @property({ type: Number })
    time = 10;

    /**
     * 1-based active slide.
     */
    @property({ type: Number, reflect: true })
    activeslide = 1;

    @property()
    width: "" | "full" = "";

    @property()
    controls: "" | "compact" | "none" = "";

    @property()
    height = "500px";

    @property({ type: Boolean })
    overlay = false;

    // Not in state, we don't want these to be reactive. They're used in the animation
    // and don't affect the render function. They may be referenced in render to keep
    // the state consistent.
    private hasHover = false;
    private userStarted = false;
    private hasControlFocus = false;
    private hasTabFocus = false;
    private hasPlayFocus = false;
    private timer = 0;
    private updateTime = 0;
    private animationRequest = 0;

    private manual = new ManualSlotController(this);

    @query("#progress")
    private progress!: HTMLDivElement;

    @query("#progress-wrap")
    private progressWrapper!: HTMLDivElement;

    @query(".play-pause")
    private playPause!: HTMLButtonElement;

    @queryAll("[role=tab]")
    private tabs!: Array<HTMLButtonElement>;

    @query("#carousel-items")
    private carouselItems!: HTMLDivElement;

    constructor() {
        super();
    }

    /**
     * Toggle between playing and paused states.
     *
     * If this function is called to play, it is considered to be the user
     * who started it.
     */
    public togglePlay() {
        this.playing = !this.playing;
        if (this.playing) {
            this.userStarted = true;
        }
    }

    /**
     * Advance the carousel to the next slide.
     */
    public next() {
        this.activeslide = this.activeslide === this.children.length ? 1 : this.activeslide + 1;
    }

    /**
     * Back the carousel to the previous slide.
     */
    public previous() {
        this.activeslide = this.activeslide === 1 ? this.children.length : this.activeslide - 1;
    }

    /**
     * Set the active slide.
     *
     * @param slide 1-based index for the new active slide
     */
    public activateSlide(slide: number) {
        if (slide < 1 || slide > this.children.length) {
            throw new Error("ilw-carousel: attempted to set invalid slide: " + slide);
        }
        this.activeslide = slide;
        this.playing = false;
    }

    /**
     * Go to next slide and stop playback due to interaction.
     */
    protected nextClick() {
        this.playing = false;
        this.next();
    }

    /**
     * Go to previous slide and stop playback due to interaction.
     */
    protected previousClick() {
        this.playing = false;
        this.previous();
    }

    /**
     * Stop slides from advancing when mouse is over the carousel.
     */
    protected mouseOver(event: MouseEvent) {
        if (event.target instanceof Node && this.playPause.contains(event.target)) {
            // If the mouse is in the play button, keep playing
            return;
        }
        this.hasHover = true;
    }

    protected mouseOut() {
        this.hasHover = false;
    }

    protected onTabFocus() {
        this.hasTabFocus = true;
    }

    protected offTabFocus() {
        this.hasTabFocus = false;
    }

    protected onPlayFocus() {
        this.hasPlayFocus = true;
    }

    protected offPlayFocus() {
        this.hasPlayFocus = false;
    }

    /**
     * Focus on the next and previous controls will pause the slides.
     */
    protected onControlFocus = () => {
        this.hasControlFocus = true;
    };

    protected offControlFocus = () => {
        this.hasControlFocus = false;
    };

    /**
     * Handle key events for the tabs to use arrow keys and home/end.
     */
    protected tabsKeyDown(event: KeyboardEvent) {
        let flag = false;

        switch (event.key) {
            case "ArrowRight":
                this.next();
                flag = true;
                break;

            case "ArrowLeft":
                this.previous();
                flag = true;
                break;

            case "Home":
                this.activateSlide(1);
                flag = true;
                break;

            case "End":
                this.activateSlide(this.children.length);
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            // We need to also move the focus, since it doesn't move automatically
            this.tabs[this.activeslide - 1].focus();
            event.stopPropagation();
            event.preventDefault();
        }
    }

    protected hasFocus() {
        return this.hasControlFocus || this.hasTabFocus || this.hasPlayFocus;
    }

    /**
     * Move the animated progress bar and activate the next slide when appropriate.
     *
     * Animation requests are needed for smooth progress, and we utilize this function
     * to also activate the next slide when time's up.
     */
    protected animationRequestCallback = () => {
        if (this.playing) {
            const now = Date.now();

            // This effectively pauses the timer in certain conditions
            if ((!this.hasHover && !this.hasControlFocus && !this.hasTabFocus)) {
                const timeMs = this.time * 1000;
                this.timer += now - this.updateTime;

                if (this.timer >= timeMs) {
                    this.next();
                    this.timer = 0;
                }
                this.updateTime = now;
                if (this.progress) {
                    this.progress.style.width = (this.progressWrapper.clientWidth * this.timer) / timeMs + "px";
                }
            } else {
                this.updateTime = now;
            }

            requestAnimationFrame(this.animationRequestCallback);
        }
    };

    connectedCallback() {
        super.connectedCallback();

        // Never autoplay with prefers reduced motion
        let hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (hasReducedMotion.matches) {
            this.playing = false;
        }
        if (this.playing) {
            this.animationRequest = requestAnimationFrame(this.animationRequestCallback);
        }
    }

    protected update(changedProperties: PropertyValues) {
        super.update(changedProperties);

        // If playing state changed, and it's now true, start playing
        if (changedProperties.has("playing") && this.playing) {
            if (this.animationRequest) {
                cancelAnimationFrame(this.animationRequest);
            }
            this.updateTime = Date.now();
            this.animationRequest = requestAnimationFrame(this.animationRequestCallback);
        }
    }

    protected updated(changedProperties: PropertyValues) {
        console.log(changedProperties);
        super.updated(changedProperties);

        // Listen to focus events on links inside the carousel content so we can pause progress
        for (let it of Array.from(this.querySelectorAll("ilw-slide a"))) {
            it.addEventListener("focus", this.onControlFocus);
            it.addEventListener("focusout", this.offControlFocus);
        }
    }

    render() {
        let count = this.children.length;
        const tabs: TemplateResult[] = [];
        const items: TemplateResult[] = [];
        const active = this.activeslide; // activeSlide is 1-based
        const { prev, next } = this.determinePrevNext(count, active);
        let previousHeading: string | null = "";
        let activeHeading: string | null = "";
        let nextHeading: string | null = "";

        for (let i = 1; i <= count; i++) {
            const slide = this.children.item(i-1) as HTMLElement;
            slide.setAttribute("overlay", this.overlay ? "true" : "false");
            slide.setAttribute("controls", this.controls);
            if (i === active) {
                slide.setAttribute("aria-hidden", "false");
            } else {
                slide.setAttribute("aria-hidden", "true");
            }
            slide.removeAttribute("single");

            // Lambda function that keeps the index in scope for each tab.
            // Note the tabindex value - it's -1 for all tabs except the active one, which makes the
            // tablist receive focus once, like a radio group.
            let activateSlide = () => this.activateSlide(i);

            // Find the headings in the slide and get the text content
            // to use as the tab label.
            let heading = slide.querySelector("h2, h3, h4, h5, h6");
            let label = heading ? heading.textContent : "";
            if (active === i) {
                activeHeading = label;
            } else if (prev === i) {
                previousHeading = label;
            } else if (next === i) {
                nextHeading = label;
            }

            tabs.push(
                html` <button
                    id="tab-${i}"
                    type="button"
                    role="tab"
                    aria-label="Slide ${activeHeading}"
                    aria-controls="slide-${i}"
                    aria-selected=${i === active}
                    class=${i === active ? "selected" : nothing}
                    tabindex=${i === active ? nothing : "-1"}
                    @click=${activateSlide}
                    @focusin=${this.onTabFocus}
                    @focusout=${this.offTabFocus}
                    @keydown=${this.tabsKeyDown}
                >
                    <span aria-hidden="true">${i}</span>
                </button>`,
            );
            let classes = {
                slide: true,
                active: i === active,
                prev: i === prev,
                next: i === next,
            };
            items.push(
                html` <div
                    id="slide-${i}"
                    class=${classMap(classes)}
                    role="tabpanel"
                    aria-roledescription="slide"
                    aria-label=${`${i} of ${count}`}
                >
                    <slot></slot>
                </div>`,
            );
        }

        // If there's one or zero slides, render a simpler component, basically a hero component.
        if (items.length < 2) {
            return this.renderOne(items);
        }

        const classes = {
            "carousel-inner": true,
            fixed: this.width === "full",
            compact: this.controls === "compact"
        };
        const style = {
            "--ilw-carousel--height": this.height,
        };

        return html`
            <section
                style=${styleMap(style)}
                class=${classMap(classes)}
                aria-roledescription="carousel"
                aria-label=${this.label}
                @mouseover=${this.mouseOver}
                @mouseout=${this.mouseOut}
            >
                <div class="control-position">
                    <div class="control">
                        <div id="progress-wrap">
                            <div id="progress"></div>
                        </div>
                        <div class="control-inner">
                            <button
                                type="button"
                                class="play-pause"
                                aria-label=${this.playing ? "Stop slides" : "Start slides"}
                                @click=${this.togglePlay}
                                @focusin=${this.onPlayFocus}
                                @focusout=${this.offPlayFocus}
                            >
                                ${this.playing ? "⏸" : "⏵"}
                            </button>
                            <div class="tabs" role="tablist" aria-label="Slide Selector">${tabs}</div>
                        </div>
                    </div>
                </div>
                <div class="previous-wrap">
                    <button
                        type="button"
                        class="previous-button"
                        aria-label="Previous Slide ${previousHeading}"
                        aria-controls="carousel-items"
                        @click=${this.previousClick}
                        @focusin=${this.onControlFocus}
                        @focusout=${this.offControlFocus}
                    >
                        <ilw-icon icon="back" size="32px"></ilw-icon>
                    </button>
                </div>
                <div class="next-wrap">
                    <button
                        type="button"
                        class="next-button"
                        aria-label="Next Slide ${nextHeading}"
                        aria-controls="carousel-items"
                        @click=${this.nextClick}
                        @focusin=${this.onControlFocus}
                        @focusout=${this.offControlFocus}
                    >
                        <ilw-icon icon="next" size="32px"></ilw-icon>
                    </button>
                </div>
                <div id="carousel-items">${items}</div>
            </section>
        `;
    }

    protected renderOne(items: TemplateResult[]) {
        for (let slide of this.children) {
            slide.setAttribute("single", "true");
        }
        const classes = {
            "carousel-inner-single": true,
            fixed: this.width === "full",
        };
        const style = {
            "--ilw-carousel--height": this.height,
        };
        return html`
            <div class=${classMap(classes)} style=${styleMap(style)}>
                <div id="carousel-items">
                    <slot></slot>
                </div>
            </div>
        `;
    }

    protected determinePrevNext(count: number, active: number) {
        if (count < 2) {
            // If we only have 1 slide, there's no prev or next
            return {
                prev: 0,
                next: 0,
            };
        }
        if (count === 2) {
            // If active is 1, this is 2. If active is 2, this is 1.
            return {
                prev: 3 - active,
                next: 3 - active,
            };
        }
        // Loop around if active is the first or last
        return {
            prev: active === 1 ? count : active - 1,
            next: active === count ? 1 : active + 1,
        };
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ilw-carousel": Carousel;
    }
}
