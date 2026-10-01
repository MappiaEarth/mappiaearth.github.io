---
layout: element
title: AreaIntegral
tool_group: map
markup_tags: [areaintegral]
summary: "Two clicks on the map define a rectangle; the tool sums the map's values inside it and passes the totals to your function."
categories: [AreaIntegral, RawMaps, LayersFunctions]
type: Element
# Switched off in the documentation: left out of /tools/, no picture, no live run (see _layouts/element.html).
disabled: true
disabled_reason: "It reads raw map cells through a map-server service that is not answering at the moment, so it can neither run here nor be pictured. The description below still applies to a working server."
api:
  - key: AreaIntegral
try:
  - "Turn on \"Sum a rectangle (two clicks)\" in the layer panel."
  - "Click one corner, then the opposite one: a yellow rectangle appears and a notification shows the sum inside."
  - "The switch turns off after each rectangle; turn it on again to sum another one."
key_params:
  - name: "runOnClick"
    example: "onRectangle"
    does: "Name of a function in `functions`, called after the second click with `(layersValues, inputs, bbox, pixel, lastInfo)`; `this` is the layer."
  - name: "text"
    example: "Sum a rectangle (two clicks)"
    does: "Label of the switch in the layer panel."
  - name: "id"
    example: "rectangle_sum"
    does: "Names the tool: `inputs.id[\"rectangle_sum\"]` holds the sums of the last rectangle, one per map."
  - name: "notify"
    example: "false"
    does: "Hide the notification shown when the user switches the tool on."
---
{% raw %}
### The layer it needs

The tool does not add cells up one by one. It reads the map as a summed-area table, where each
cell holds the total of everything above and to the left of it, so four reads at the corners
give the sum of any rectangle, however large. That only works when the layer reads a map
published with that table: `operation: "integral"` together with the map's `name` and `styles`,
exactly as in the example. Keep those three keys together. With an ordinary map the number
means nothing, and with a map that does not offer the operation the layer stays empty and the
console shows `Operation integral is not defined for layer ...`.

### What the callback receives

- `layersValues`: one sum per map in `name`, in the same order.
- `bbox`: the rectangle as `[minLon, minLat, maxLon, maxLat]`, in degrees.
- `pixel`: the `{x, y}` screen position of the second click.
- `lastInfo`: `{first, second}`, the two clicks as `{lon, lat}` in degrees.

`this` is the layer. Sums get large quickly; `ExtjsUtils.NUMBER.abbreviateNumber(value)`
shortens them for display, as the example does.

### Use the sums in the calculation

The tool keeps the last sums in `inputs.id[ID]`, but it does not recalculate the layer by
itself. When `beforeCalc` must see the new sums, call
`Ext.getCmp("rectangle_sum").items.get(0).forceUpdateLayer()` at the end of your callback.

### Pitfalls

- Both corners must fall on the map's data. A corner outside it has no value to read, and no
  sum is reported.
- After the first click the tool shows a short notification (in Portuguese) asking for the
  second corner.
- The tool switches itself off after every rectangle; `unselect` only changes the message shown
  when it is switched on.
- For a free shape instead of a rectangle, use [SummedArea](/elements/summedarea-widget/): the
  user draws a polygon.
{% endraw %}
