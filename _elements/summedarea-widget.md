---
layout: element
title: SummedArea
tool_group: map
markup_tags: [summedarea]
summary: "Draw a polygon on the map and get the sum of the cells inside it, for each map of the layer."
categories: [SummedArea, RawMaps, LayersFunctions]
type: Element
# Switched off in the documentation: left out of /tools/, no picture, no live run (see _layouts/element.html).
disabled: true
disabled_reason: "It reads raw map cells through a map-server service that is not answering at the moment, so it can neither run here nor be pictured. The description below still applies to a working server."
api:
  - key: SummedArea
try:
  - "Turn on \"Draw an area to sum\" in the layer panel."
  - "Click on the map to place the corners of a polygon; double-click to close it."
  - "A notification shows the area with data inside your polygon; turn the switch on again to draw another."
key_params:
  - name: "runOnClick"
    example: "onAreaSummed"
    does: "Name of a function in `functions`, called when the polygon is closed, with `(layersValues, inputs, feature)`; `this` is the layer."
  - name: "text"
    example: "Draw an area to sum"
    does: "Label of the switch in the layer panel."
  - name: "id"
    example: "area_sum"
    does: "Names the tool, e.g. to call `Ext.getCmp(\"area_sum\").items.get(0).getSummedLayerValues(layer, feature)` from code."
  - name: "notify"
    example: "false"
    does: "Hide the notification shown when the user switches the tool on."
---
{% raw %}
### What the callback receives

`layersValues` has one sum per map in `name`, in the same order, followed by two extra
entries: the number of cells read, and an array with the count of cells with data for each
map. Cells without data are skipped. The layer's `expression` result is not summed. `feature`
is the drawn polygon, and `this` is the layer.

The example reads the same map twice with `operation: "average,area"`: `layersValues[0]` adds
up the average density of each cell, `layersValues[1]` the area each cell covers, which is the
number the notification shows.

### Choose the operation

The tool adds up the cells drawn on screen, so with an ordinary map the total changes with the
zoom. Maps published as raw maps solve this: read with `area`, each cell carries the original
area it covers; read with `sum`, the total of the original cells it covers. Their sums stay the
same at any zoom. The layer must use an `operation` the map is published with, plus the map's
`name` and `styles`, exactly as in the example; the tokens are listed in
[the property catalogue](/reference/property-catalogue/).

### Use the sums in the calculation

The tool never fills `inputs.id[ID]`: the sums reach only your callback. To feed them to the
calculation, store them in an [InputManager](/elements/inputmanager-widget/), whose `setValues`
also recalculates the layer:

```javascript
descriptionHtml: "{{summedarea|id=area_sum|text=Draw an area to sum|runOnClick=onAreaSummed}}" +
  "{{inputmanager|id=sums}}",
functions: {
  onAreaSummed: function (layersValues, inputs) {
    inputs.id["sums"].setValues({ area: layersValues[1] }); // recalculates the layer
  },
},
```

### Pitfalls

- The sum reads the map tiles the browser has loaded, so draw the polygon inside the visible
  part of the map.
- The tool switches itself off after every polygon; `unselect` only changes the message shown
  when it is switched on.
- For a rectangle, [AreaIntegral](/elements/areaintegral-widget/) is faster: it needs four
  reads whatever the size, on a map published with the `integral` operation.
{% endraw %}
