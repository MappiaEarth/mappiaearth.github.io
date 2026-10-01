---
layout: element
title: ZoomLevel
tool_group: inputs
markup_tags: [zoomlevel]
summary: A hidden input carrying the map's current zoom into the calculation.
categories: [ZoomLevel, LayersFunctions]
type: Element
api:
  - key: ZoomLevel
try:
  - "Read the label in the layer's panel: it shows the current zoom level."
  - "Zoom in to level 7 or deeper: the coarse 500 m elevation classes give way to full detail."
  - "Zoom back out below 7: the elevation returns to 500 m steps."
key_params:
  - name: "id"
    example: "z"
    does: "Required. Names the zoom: read it as `inputs.id['z']` in beforeCalc, and by position (`inputs[0]` here) inside expression."
  - name: "value"
    example: "7"
    does: "What the input holds: the map's current zoom level as a number, refreshed when the map stops moving."
---
{% raw %}
### When it changes

The value is refreshed each time the map stops moving, but only a change of zoom counts as an
input change. Panning alone does not start a new calculation round for it; tiles that come into
view are still computed as usual. A zoom change then follows the usual rule for inputs: the
layer recalculates after a short countdown, or right away with `updateAutomatically: true`.

### Swap maps by zoom

`beforeCalc` can read the zoom and change the map the layer reads. Here the layer shows
municipalities when zoomed in and states when zoomed out:

```javascript
descriptionHtml: "{{zoomlevel|id=z}}",
beforeCalc: function (inputs) {
  var zoomedIn = inputs.id["z"] > 10;
  this.changeLayers({ name: zoomedIn ? "CSR:municipalities" : "CSR:estados", index: 0 });
},
```

### Write the zoom on screen

The example sets a label's text in `beforeCalc`. Check that the label exists before using it,
as the example does, because `Ext.getCmp` returns `undefined` for an id it cannot find.

### Pitfalls

- `{{zoomlevel}}` renders nothing, so nothing on screen tells you it is there. Give it an `id`
  or you cannot read it by name.
- It is an input: it takes a position in `inputs`, in `descriptionHtml` order. Count it when you
  read other inputs by position inside `expression`.
- Inside `expression` there is no `inputs.id`; read the zoom by position.
{% endraw %}
