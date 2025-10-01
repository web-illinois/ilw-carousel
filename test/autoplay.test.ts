import { expect, test } from "vitest";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "../src/ilw-carousel";
import { vi } from "vitest";
import "@illinois-toolkit/ilw-core/expect";

const content = html`
    <ilw-carousel time="0.5">
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
    </ilw-carousel>
`;

test("renders first slide by default", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const element = screen.getByText("Cosmic Cliffs");
    await expect.element(element).toBeInViewport();
});

test("hides second slide by default", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const element = screen.getByText("Tundra Pic");
    await expect.element(element).not.toBeInViewport();
});

test("shows second slide after timer", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    vi.advanceTimersToNextTimer();
    const element = screen.getByText("Tundra Pic");
    await expect.element(element).toBeInViewport();
});

test("hides first slide after timer", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    vi.advanceTimersToNextTimer();
    const element = screen.getByText("Cosmic Cliffs");
    await expect.element(element).not.toBeInViewport();
});

test("pausing stops slide change", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Stop slides" });
    await button.click();
    vi.advanceTimersToNextTimer();
    vi.advanceTimersToNextTimer();
    const element = screen.getByText("Cosmic Cliffs");
    await expect.element(element).toBeInViewport();
});

test("resuming starts slide change", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    await screen.getByRole("button", { name: "Stop slides" }).click();
    vi.advanceTimersToNextTimer();
    await screen.getByRole("button", { name: "Start slides" }).click();
    await vi.advanceTimersByTimeAsync(600);
    const element = screen.getByText("Tundra Pic");
    await expect.element(element).toBeInViewport();
});

test("pausing changes button label", async () => {
    vi.useFakeTimers();
    const screen = render(content);
    const button = screen.getByRole("button", { name: "Stop slides" });
    await button.click();
    const element = screen.getByRole("button", { name: "Start slides" });
    await expect.element(element).toBeInTheDocument();
});

