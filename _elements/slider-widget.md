---
layout: element
title: Slider and Label
tool_group: inputs
markup_tags: [slider, label]
summary: "A draggable slider that feeds a number into the layer's calculation, with a label that tells the user what the number means."
categories: [Slider, Label]
featured-img: slider-widget
type: Element
examples:
    - title: Simple Slider Example
      map-link: lang=eng&map=&queryid=472&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=custom
      featured-img: slider-widget
api: 
    - key: Slider
    - key: Label
try:
  - "Drag the slider to 250 and let go: after a short countdown, only the forest storing more than 250 tC/ha stays green."
  - "Drag it down to 50: much more forest turns green, and the legend changes to Above 50 tC/ha."
key_params:
  - name: "id"
    example: "threshold"
    does: "Names the value: read it as `inputs.id['threshold']` in beforeCalc, and by position (`inputs[0]` here) inside expression."
  - name: "value"
    example: "150"
    does: "Where the thumb starts. Without it the slider starts at 100."
  - name: "minValue"
    example: "0"
    does: "Lowest value the slider can reach (default 0)."
  - name: "maxValue"
    example: "300"
    does: "Highest value the slider can reach (default 100)."
  - name: "increment"
    example: "25"
    does: "Step the thumb snaps to while the user drags it."
  - name: "text"
    example: "Minimum carbon stock (tC/ha)"
    does: "Text of the label placed before the slider. It is shown as plain text; use `html` for bold or links."
---
{% raw %}
### Show the value while dragging

Add `plugins=tip=<text>` to show a tooltip above the thumb while the user drags it. `{0}` is
replaced by the thumb's value:

```javascript
descriptionHtml:
  "{{label|text=Minimum carbon stock (tC/ha)}}" +
  "{{slider|id=threshold|minValue=0|maxValue=300|increment=25|value=150|plugins=tip={0} tC/ha|width=250}}",
```

To keep a label in step after each recalculation, give the label an `id` and set its text in
`beforeCalc`: `Ext.getCmp("threshold_label").setText("Above " + inputs.id["threshold"] + " tC/ha")`.

### Colour the track

`backgroundColors` paints the filled part of the track by value, and `gradient=true` blends the
colours into each other. Each colour starts at its `startValue`; the order of the entries does
not matter. Here CSS colours are fine:

```javascript
'{{slider|id=threshold|minValue=0|maxValue=300|value=150|backgroundColors=[{color: "khaki", startValue: 0}, {color: "darkgreen", startValue: 150}]|gradient=true|width=250}}'
```

### More options

- `fieldLabel` puts a label at the left of the slider; `hideLabel=true` removes it and the space
  kept for it.
- `disabled=true` shows the slider greyed out. Enable it later with `Ext.getCmp(id).enable()`.
- `cls` and `thumbStyle` add CSS classes to the slider and to its thumb.
- Any other Ext JS slider option, such as `keyIncrement`, is passed through unchanged.

### Move it from code

`Ext.getCmp(id).setValue(thumbIndex, value, false, true)` moves the thumb and fires the same
change as a drag, so the layer recalculates. A plain slider has one thumb, index `0`.
`Ext.getCmp(id).getValue()` reads the current value.

```javascript
descriptionHtml:
  "{{slider|id=threshold|minValue=0|maxValue=300|increment=25|value=150}}" +
  "{{button|id=reset|text=Back to 150 tC/ha|handler=resetThreshold}}",
functions: {
  resetThreshold: function () {
    Ext.getCmp("threshold").setValue(0, 150, false, true);
  },
},
```

### Recalculate without the countdown

After the user releases the thumb, the layer waits about 2.5 seconds, showing a countdown
button, so several changes end in one recalculation. Set `updateAutomatically: true` on the
layer to recalculate right away.

### Pitfalls

- Inside `expression` there is no `inputs.id`. Read `inputs[0]`, `inputs[1]`... in the order the
  input widgets appear in `descriptionHtml`; labels and buttons take no position. The
  [execution model](/reference/execution-model/) explains why.
- `setCalculateLegend` takes colours as `[R, G, B]` arrays. A CSS string such as `"#c0392b"`
  throws `color.join is not a function`. Only the slider's own `backgroundColors` take CSS colours.
- A variable defined outside `expression` is `undefined` inside it. Pass the value through an
  input instead.
{% endraw %}
