---
layout: element
title: LegendHtml and OpacitySlider
tool_group: results
markup_tags: [legendhtml, opacityslider]
summary: "Show the layer's legend inside its panel, plus a slider that changes how transparent the layer is."
categories: [LegendHtml, OpacitySlider, QUERY, GroupProperties, LayersFunctions]
featured-img: legend_opacityslider-widget
type: Element
examples:
    - title: LegendHTML and OpacitySlider Simple Example
      map-link: lang=eng&map=&queryid=120&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=2
      featured-img: legendhtml_example
api:
  - key: LegendHtml
  - key: OpacitySlider
  - key: QUERY
    tags: ['setQueryGlobalProperties']
  - key: LayersFunctions
    tags: ['beforeCalc']
  - key: GroupProperties
try:
  - "Drag the opacity slider to the left: the geology map fades and the base map shows through."
  - "Click an entry in the legend: that class disappears from the map. Click it again to bring it back."
key_params:
  - name: "filterLayers"
    example: "[0]"
    does: "For a layer with several maps in `name`, shows only the legends of these positions (0 is the first map)."
  - name: "reverseLegend"
    example: "true"
    does: "Lists the legend entries in decreasing order."
  - name: "preventClick"
    example: "true"
    does: "Stops users from hiding a class by clicking its legend entry."
  - name: "value"
    example: "50"
    does: "Starting opacity of the slider, in percent. Used only when the layer has no `opacity` of its own."
  - name: "aggressive"
    example: "true"
    does: "Changes the opacity while the slider is being dragged, not only when it is released."
  - name: "inverse"
    example: "true"
    does: "Makes the slider set transparency instead of opacity: 100 means invisible."
---
{% raw %}
### Where they go

Put both tags anywhere in `descriptionHtml`, in any order, next to your other widgets. Neither
one is an input: they never start a recalculation and take no position in `inputs`. Without
`{{legendhtml}}` the legend is still there, behind the layer's legend button; the tag puts it
right in the panel, where users see it while they work with your widgets.

### Starting opacity

The slider starts at the layer's own `opacity` (0 to 1). The example sets `opacity: 0.8`, so
the slider starts at 80. The slider's `value` counts only when the layer has no `opacity`.
Limit the range with `minValue` and `maxValue` (in percent). Add `changeVisibility=true` to
hide the layer when the slider reaches its minimum.

### A title above the legend

Set `legendTitle` on the layer to show a line of text above `{{legendhtml}}`.

### Your own legend entries

On a calculated layer with an `expression`, you can set the entries yourself in `beforeCalc`.
`{{legendhtml}}` then shows your entries:

```javascript
beforeCalc: function () {
  this.setCalculateLegend([
    { color: [0, 0, 255], value: 500, title: "Up to 500 m" },
    { color: [255, 0, 0], value: 3000, title: "Above 500 m" },
  ]);
},
```

Each `value` is the highest number that gets that color. Sort the entries by `value`, lowest
first: entries out of order are ignored.

### Pitfalls

- Colors in `setCalculateLegend` are `[R, G, B]` arrays. A CSS string such as `"#c0392b"`
  breaks the legend with `color.join is not a function`.
- `filterLayers` is a list, even for a single map: write `filterLayers=[0]`, not `filterLayers=0`.
- `legendId` is a parameter of `{{legendhtml}}`. Written on the layer, it does nothing.
- `complementaryLayer` needs a layer object, so you cannot set it in the markup.
{% endraw %}
