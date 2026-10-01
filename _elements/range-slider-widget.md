---
layout: element
title: Range Slider
tool_group: inputs
markup_tags: [slider]
summary: "A slider with two thumbs that hands the layer a [low, high] pair, to keep only the values inside a band."
categories: [Slider]
featured-img: ranged-slider-widget
type: Element
examples:
    - title: Range Slider Example
      map-link: options=idemetadata,disabledownload,hidestylechooser,overview,capabilities&extent=-443.628,-16.847,-407.373,3.294&visiblelayers=custom&zoomlevels=10&queryid=464
      featured-img: ranged-slider-widget
api: 
  - key: Slider
try:
  - "Drag the right thumb up to 1500: after the countdown, every place with 800 to 1500 mm of rain a year is blue."
  - "Drag the left thumb to 300: the drier places join the band and the legend reads Between 300 and 1500 mm."
key_params:
  - name: "values"
    example: "[800,1100]"
    does: "Turns the slider into a range and sets where the two thumbs start. The value becomes a `[low, high]` array."
  - name: "id"
    example: "band"
    does: "Names the pair: `inputs.id['band']` in beforeCalc, and by position (`inputs[0]` here, still an array) inside expression."
  - name: "minValue"
    example: "300"
    does: "Lowest value either thumb can reach (default 0)."
  - name: "maxValue"
    example: "2100"
    does: "Highest value either thumb can reach (default 100)."
  - name: "increment"
    example: "50"
    does: "Step both thumbs snap to while the user drags them."
  - name: "width"
    example: "250"
    does: "Width of the slider in pixels. A wider track makes small steps easier to hit."
---
{% raw %}
### Read the band

The value is always a pair. On the page `inputs.id["band"]` is `[low, high]`; inside
`expression` the same pair is `inputs[0]`, so `inputs[0][0]` is the low end and `inputs[0][1]`
the high end. From any other code, `Ext.getCmp("band").getValues()` returns the pair.

### Show both ends while dragging

The tooltip format of `plugins=tip=` gets the dragged thumb as `{0}`, the first thumb as `{1}`
and the second as `{2}`:

```javascript
"{{slider|id=band|minValue=300|maxValue=2100|increment=50|values=[800,1100]|plugins=tip={1} to {2} mm|width=250}}"
```

The other slider options (`fieldLabel`, `hideLabel`, `disabled`, `cls`...) work as on the
[Slider](/elements/slider-widget/) page.

### Set the band from code

`setValue(thumbIndex, value, false, true)` moves one thumb and fires the same change as a drag.
Index `0` is the low thumb, `1` the high one:

```javascript
functions: {
  showWettest: function () {
    var band = Ext.getCmp("band");
    band.setValue(1, 2100, false, true);
    band.setValue(0, 1600, false, true);
  },
},
```

### Recalculate without the countdown

After a thumb is released the layer waits about 2.5 seconds, showing a countdown button, before
it recalculates. Set `updateAutomatically: true` on the layer to recalculate right away.

### Pitfalls

- Write `values`, with an s. `value` is the starting point of a one-thumb slider.
- Whether the ends are included is up to your `expression`: the example keeps both
  (`>=` and `<=`).
- Inside `expression` there is no `inputs.id`; read the pair by position. Legend colours in
  `setCalculateLegend` are `[R, G, B]` arrays, never CSS strings.
{% endraw %}
