import { expect, test } from "vitest";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "../src/ilw-carousel";
import "../src/ilw-colors.css";
import { vi } from "vitest";
import "./util";

const content = html`
    <ilw-carousel>
        <ilw-slide>
            <img src="data:image/bmp;base64,Qk1aBAAAAAAAADYAAAAoAAAABAAAAAMAAAABABgAAAAAACQAAAATCwAAEwsAAAAAAAAAAAAAMVFyPUhtZGqNYXKYVFlrWE5gg21ziXqHUCIdTQAQfjUPkE8v"
                 alt="Cosmic cliffs gradient."
                 slot="image">
            <h3>Cosmic Cliffs</h3>
            <p>Imagine the nebula in gradient form.</p>
        </ilw-slide>
        <ilw-slide>
            <h3>Tundra Pic</h3>
            <p>Tundra is a type of biome where tree growth is hindered by frigid temperatures and short growing
                seasons.</p>
            <img src="data:image/bmp;base64,Qk1aBAAAAAAAADYAAAAoAAAABAAAAAMAAAABABgAAAAAACQAAAATCwAAEwsAAAAAAAAAAAAAAGBKAI6CPKyiAIx+QlxBa42Ff6ypYIl+hzscn3dsq5CLl2lg"
                 alt="Landscape gradient."
                 slot="image">
        </ilw-slide>
        <ilw-slide>
            <h3>Third</h3>
            <p>Some more text with the same gradient.</p>
            <img src="data:image/bmp;base64,Qk1aBAAAAAAAADYAAAAoAAAABAAAAAMAAAABABgAAAAAACQAAAATCwAAEwsAAAAAAAAAAAAAAGBKAI6CPKyiAIx+QlxBa42Ff6ypYIl+hzscn3dsq5CLl2lg"
                 alt="Landscape gradient."
                 slot="image">
        </ilw-slide>
    </ilw-carousel>
`;

test("next button shows second slide", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Next slide" });
    await button.click();
    const element = screen.getByText("Tundra Pic");
    await expect.element(element).toBeInViewport();
});

test("next button hides first slide", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Next slide" });
    await button.click();
    const element = screen.getByText("Cosmic Cliffs");
    await expect.element(element).not.toBeInViewport();
});

test("slide 2 button is active when on second slide", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Next slide" });
    await button.click();
    const slide2Button = screen.getByRole("tab", { name: "Slide Tundra Pic" });
    await expect.element(slide2Button).toHaveClass("selected");
});

test("next button twice shows third slide", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Next slide" });
    await button.click();
    await button.click();
    const element = screen.getByText("Third");
    await expect.element(element).toBeInViewport();
});

test("slide 3 button is active when on third slide", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Next slide" });
    await button.click();
    await button.click();
    const slide3Button = screen.getByRole("tab", { name: "Slide Third" });
    await expect.element(slide3Button).toHaveClass("selected");
});

test("next button thrice shows first slide", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Next slide" });
    await button.click();
    await button.click();
    await button.click();
    const element = screen.getByText("Cosmic Cliffs");
    await expect.element(element).toBeInViewport();
});

test("previous button shows third slide", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Previous slide" });
    await button.click();
    const element = screen.getByText("Third");
    await expect.element(element).toBeInViewport();
});

test("previous button hides first slide", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Previous slide" });
    await button.click();
    const element = screen.getByText("Cosmic Cliffs");
    await expect.element(element).not.toBeInViewport();
});

test("slide 3 button is active when on third slide via previous button", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Previous slide" });
    await button.click();
    const slide3Button = screen.getByRole("tab", { name: "Slide Third" });
    await expect.element(slide3Button).toHaveClass("selected");
});