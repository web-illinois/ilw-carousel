# ilw-carousel

Links: **[ilw-carousel in Builder](https://builder3.toolkit.illinois.edu/component/ilw-carousel/index.html)** | 
[Illinois Web Theme](https://webtheme.illinois.edu/) | 
[Toolkit Development](https://github.com/web-illinois/toolkit-management)

## Overview

A carousel component that displays a changing image and some associated content for each. It allows for
displaying multiple highlighted items in the same prominent place, with the drawback that users may not
see all of them.

This component emphasizes giving the user a clear view of the state of the carousel, and includes multiple
ways of interaction:

- Buttons on the left and right to move backward and forward between carousel items.
- Buttons at the bottom for jumping to specific slides. These behave like a radio control and can be changed
  with keyboard arrow buttons.
- A button to pause and continue automatic progression. Progression also automatically pauses when the user's
  mouse is hovering over it, or any of the controls are focused.
  - One exception is the play/pause button, because if the user is hovering or focusing on that, they're may be
    attempting to play it. In that case it may be confusing if activating the button appears to do nothing when
    it's already paused by the hover.

Additionally, there is a visual progress bar showing how soon the next slide will appear. This keeps the user
informed of the carousel's behavior, making it easier to understand.

The following attributes can control `ilw-carousel`:

- `controls="compact"` reduces the size of the controls.
- `playing="true"` or `playing="false"` controls if the carousel should autoplay. Note that users who
  have `prefers-reduced-motion` configured, the carousel will never autoplay.
- `time` in seconds for how long autoplay takes per slide.
- `activeslide` can be set to control which slide is shown initially.
- `label` for the accessible name of the carousel, and should describe what kinds of items the carousel has.
  This defaults to "Highlighted content", but setting a more specific one is highly recommended.
- `width="full"` will make the carousel expand horizontally to fill the viewport.
- `height` takes a CSS value for the height of the carousel images. Defaults to `500px`.
- `overlay` moves the text content to be overlaid on top of the image.
- `theme="blue"` makes the controls have a blue background.

Both `playing` and `activeslide` are fully reactive, so the HTML attribute updates when the state of the
carousel changes internally.

## Slots

The image is set using the `slot="image"` on an `<img>` element.

Buttons can be added below the content with `slot="buttons"`, which will be shown below the
black box in overlay mode.

## Code Examples

```html
<ilw-carousel label="Selected natural scenes">
  <ilw-slide>
    <h3>Northern Lights</h3>
    <p>Also known as <a href="#">aurora borealis</a>, they illuminate the sky.</p>
    <div class="ilw-buttons" slot="buttons">
      <button class="ilw-button">Learn More</button>
    </div>
    <img src="https://fastly.picsum.photos/id/724/1920/768.jpg?hmac=oaOY1Ja3q32qdCoUGuVXUNvp6bQq3WSNi1Fbp6KbmAc"
         alt="Red and green lights in the night sky with evergreen trees in the foreground."
         slot="image">
  </ilw-slide>
  <ilw-slide>
    <h3>Tundra</h3>
    <p>Tundra is a type of biome where tree growth is hindered by frigid temperatures and short growing
      seasons.</p>
    <img src="https://fastly.picsum.photos/id/547/1920/768.jpg?hmac=QK_aYd-IVY12I8ZvvuSMbzgFNFxaXGLobEAeaPLTQEA"
         alt="Landscape photo of wooded hills with patches of snow, and mountains in the distance."
         slot="image">
  </ilw-slide>
  <ilw-slide>
    <h3>Blue Flowers</h3>
    <p>Clusters of blue flowers with vivid colors.</p>
    <img src="https://fastly.picsum.photos/id/701/1920/768.jpg?hmac=CO7UTJncYibcckG8WC6NI4QGf0ZRd7bXwmukliNyYDc"
         alt="Close-up photo of a field of blue flowers."
         slot="image">
  </ilw-slide>
</ilw-carousel>
```

## Accessibility Notes

When using the component, follow these guidelines:

- Give the `ilw-carousel` a descriptive `label`, it will be used as the carousel's accessible name.
- The image should generally have an alt text, as it is a major component of the content.
- Avoid using more than 5 slides, very few people are likely to ever see all of them.
- Give each slide a heading, it will be used as a label for controls.

The carousel is a design that historically hasn't been accessible, and there are some inherent challenges to
a component that's primarily a visual feature. This implementation tries to be easy to use for everyone:

- The carousel's first element is a `section` with the role description "carousel".
- In the HTML, all controls appear before the slide contents, in the following order:
  1. Progress bar
  2. Play/pause button
  3. Tabs for each slide
  4. Previous - Next
  5. Slide contents:
     - Slide text is above the image so any heading in the text is the first element.
- The buttons controlling slide selection have the role `tab` and work like a radio button group. Focus only lands
  on the active button, and then the selection is changed with arrows when using a keyboard.
  - The label for a slide is "Slide <heading text>".
- Each slide has the role `tabpanel`, and role description "slide".
  - The label for a slide is: (number) of (slide count), e.g. "1 of 3", which is announced
    with the role description "slide".
- If the slide has been controlled manually, has mouse hover or focus in any element except play/pause,
  the slide progression is immediately paused. If the user presses play intentionally, the automatic
  pausing no longer happens.
- Previous and next buttons have the labels "Previous Slide" and "Next Slide" respectively, with the title
  of the appropriate slide concatenated.

## External References

- https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- https://www.nngroup.com/articles/designing-effective-carousels/
