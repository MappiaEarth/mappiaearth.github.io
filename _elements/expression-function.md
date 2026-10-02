---
layout: element
title: Expression
tool_group: results
summary: "Compute a new map pixel by pixel: a JavaScript function combines the values of the layer's maps and widgets into one value."
categories: [LayersFunctions]
featured-img: expression-simple-example
type: Element
examples:
    - title: Simple Expression Example
      map-link: tools=zoomextent,getfeature&options=scale,startopened,capabilities&extent=&visiblelayers=1&zoomlevels=10&queryid=469
      featured-img: expression-simple-example
    - title: Simple layerVals Example
      map-link: tools=zoomextent,getfeature&options=scale,startopened,capabilities&extent=&visiblelayers=1&zoomlevels=10&queryid=470
      featured-img: layervals-simple-example
api:
  - key: LayersFunctions
    tags: ['expression']
try:
  - "Look at the legend in the layer panel: three elevation classes in green, yellow and brown."
  - "Zoom into a mountain range: land above 1000 m is painted brown, lowlands green."
key_params:
  - name: "expression"
    example: "function (layersVals, inputs) { return layersVals[0] < 300 ? 1 : 2; }"
    does: "Runs once per pixel and returns the pixel's value, or `this.nullValue` to leave it transparent."
  - name: "beforeCalc"
    example: "function (inputs) { this.setCalculateLegend([{ color: [39, 174, 96], value: 1, title: \"Low\" }]); }"
    does: "Runs on the page before each calculation: read widgets with `inputs.id[ID]`, set the legend, swap maps."
  - name: "legendColor"
    example: "function (color, inputs, lastValue, value) { return [0, value * 255 / 1830, 0]; }"
    does: "Returns the `[R, G, B]` colour of each value of the automatic legend."
  - name: "afterCalc"
    example: "function (inputs) { ExtjsUtils.ALERTIFY.log(\"Map updated\"); }"
    does: "Runs on the page after each calculation; only for a layer that has an `expression`."
---
{% raw %}
### The rules of `expression`

- The layer is `source: "calculate"`; `name` lists the maps it reads.
- `expression` runs in a background worker, once per pixel. It sees only its arguments and
  `this`: no variables from the code around it, no `window`, no page, no map.
- `layersVals[i]` is the value of the i-th map of `name`. With
  `name: "CSR:geologia,CSR:altimetria"`, `layersVals[0]` is geology and `layersVals[1]` elevation.
- `inputs` is a plain array of the widget values, in the order the widgets appear in
  `descriptionHtml`: `inputs[0]` is the first. `inputs.id[ID]` does not exist here; it works in
  `beforeCalc`, `afterCalc`, `onInputsReady` and `functions`.
- Return the pixel's value, or `this.nullValue` for no data (a transparent pixel).
- Write it as a regular `function`: `this.isNumeric(v)` and `this.nullValue` come from `this`.

### Where the values come from

An ordinary map gives the value of its legend entry: a number label becomes the number, a range
such as "10 - 20" becomes its middle (15), and a text label such as "Floresta" stays text. Check
with `this.isNumeric(v)` before doing arithmetic. For the original cell values, read maps
published as raw maps with an `operation` (`raw`, `sum`, `average`, `area`...), one token per
map of `name`; see [the property catalogue](/reference/property-catalogue/).

### Use a widget value

```javascript
descriptionHtml: "Minimum elevation {{slider|id=min_elev|minValue=0|maxValue=2000|value=800}}",
expression: function (layersVals, inputs) {
  var elevation = layersVals[0];
  if (!this.isNumeric(elevation) || elevation < inputs[0]) return this.nullValue;
  return elevation;
},
```

Moving the slider recalculates the layer. Anything else the expression needs (a table, a
picked feature, a value from another layer) must be turned into plain data in `beforeCalc` and
passed as an input: an [InputManager](/elements/inputmanager-widget/) arrives as
`inputs[i].global`.

### Build the legend yourself

By default the platform builds the legend from the values the expression returns: ranges
coloured from blue to red, or one entry per value with `categorical: true`. To fix the classes
and colours, call `this.setCalculateLegend(entries)` in `beforeCalc`, as the example does:

- sort the entries by `value`, ascending; `value` is the highest value that maps to the entry;
- `color` is an `[R, G, B]` array. A CSS string such as `"#c0392b"` throws `color.join is not a function`;
- add `{{legendhtml}}` to `descriptionHtml` to show the legend in the panel.

To keep the automatic classes and only choose their colours, use `legendColor`.

### Before and after the calculation

`onInputsReady(inputs)` runs once, when every widget has a value. `beforeCalc(inputs)` runs on
the page before each calculation, even without an `expression`. `afterCalc` runs after it, and
only when the layer has an `expression`. The order and what each one may touch are in
[the execution model](/reference/execution-model/).

### Pitfalls

- A map not published with the requested `operation` leaves the layer empty; the console says
  `Operation X is not defined for layer Y`.
- A value that is `undefined` only inside `expression` came from a variable, the page or a
  global: compute it in `beforeCalc` and pass it as an input.
- More traps are listed in [pitfalls](/reference/pitfalls/).
{% endraw %}
