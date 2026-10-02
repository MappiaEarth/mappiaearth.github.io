---
title: Calculated maps and controls
step: 5
permalink: /tutorial/calculated-maps/
summary: "A calculated layer computes a new map from the values of published maps, and controls in its panel feed the calculation."
learn:
  - "How `expression` computes a new map, pixel by pixel."
  - "How a widget in `descriptionHtml` becomes an input of the calculation."
  - "Why the same input is read by id in `beforeCalc` and by position in `expression`."
try:
  - "Drag the slider: after a short countdown the map is computed again, and the legend follows."
  - "Change the legend colour to green, `[39, 174, 96]` - colours are `[R, G, B]` lists here, not CSS strings."
  - "Use two maps: `name: \"CSR:altimetria,CSR:bioma_cerrado_declividade\"` gives each pixel two values, `layersVals[0]` and `layersVals[1]` - see the two-slider example of the Slider page."
more:
  - { title: "Execution model", url: "/reference/execution-model/", why: "the full cycle of a calculation" }
  - { title: "Expression", url: "/elements/expression-function/" }
  - { title: "Slider", url: "/elements/slider-widget/", why: "and every other input widget in the tools" }
  - { title: "The widget markup language", url: "/reference/markup-widgets/" }
---
{% raw %}
A calculated layer (`source: "calculate"`) does not show a published map as it is: it reads the
**values** of the maps in its `name` - an elevation in metres, a biomass in tonnes - and an
**`expression`** turns them into a new map. Controls placed in the layer's panel (sliders, lists,
text boxes) are **inputs** of that calculation.
{% endraw %}

{% include live-example.html id="tutorial-05-calculated-map" %}

{% raw %}
### The cycle

1. **The panel**: `descriptionHtml` holds text and widgets, written in a small markup -
   `{{slider|id=minimum|...}}` is a slider whose value is the input `minimum`.
2. **The reader moves the slider.** After a short countdown (so several changes make one
   calculation) the layer is calculated again.
3. **`beforeCalc(inputs)`** runs first, on the page: here it sets the legend with
   `this.setCalculateLegend([...])`. On the page, an input is read by its id:
   `inputs.id["minimum"]`.
4. **`expression(layersVals, inputs)`** runs for every pixel, in a separate worker, so the page
   stays responsive. `layersVals[0]` is the value of the first map in `name` at that pixel. There,
   inputs are read **by position**: `inputs[0]` is the first input of the panel. The value it
   returns is coloured by the legend; `this.nullValue` leaves the pixel transparent.

Because `expression` runs in the worker, it only sees its two arguments: a variable or function
of the page is not there. Values it needs come in as inputs.

The legend title carries the slider's value. Besides telling the reader what is shown, a legend
that changes is what makes the map redraw - see the [pitfalls](/reference/pitfalls/).
{% endraw %}
