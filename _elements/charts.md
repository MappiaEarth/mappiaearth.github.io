---
layout: element
title: "Charts"
tool_group: results
summary: "Draw Highcharts charts - bars, lines, pies, Sankey transitions - inside a layer's panel or a window, and update them as results arrive."
categories: [Highcharts, Sankey, AsyncLoader, Window]
api:
  - key: Highcharts
  - key: Sankey
  - key: Extjs
    tags: ['getHighchartById']
  - key: AsyncLoader
type: Element
try:
  - "Look at the layer panel: a pie chart shows the area of each geological era."
  - "Hover a slice: the tooltip shows that era's share of the total area, in percent."
key_params:
  - name: "chart"
    example: "Highcharts.chart(\"era_chart\", { chart: { type: \"pie\" }, series: [{ data: data }] })"
    does: "Draws a chart into the element with that id. Declare the element in `descriptionHtml` first."
  - name: "getHighchartById"
    example: "ExtjsUtils.HIGHCHART.getById(\"era_chart\")"
    does: "Returns the chart already drawn in that element, or `null`. Update or destroy it before drawing again."
  - name: "loadScriptOnce"
    example: "AsyncLoader.loadScriptOnce(\"/theme/app/js/highcharts/latest/sankey.js\", drawSankey)"
    does: "Loads an extra Highcharts module once, then calls your function. Needed for Sankey diagrams."
---
{% raw %}
### Where to draw

Highcharts is already loaded on the map pages. Put a container with a fixed size in
`descriptionHtml` (the layer panel is about 300 pixels wide), then draw from a callback, once
the panel exists: `afterCalc`, `beforeCalc`, `onInputsReady` or a button handler. Never draw
inside `expression`: it runs in a worker, where there is no page.

`afterCalc` runs only for a layer that has an `expression`. That is why the example has one,
even though it only returns the map's own value (`return layersVals[0]`).

### Update instead of starting over

`afterCalc` runs after every calculation round, so a chart drawn there must deal with the
previous one. Either destroy it, as the example does, or keep it and swap the data:

```javascript
var chart = ExtjsUtils.HIGHCHART.getById("era_chart");
if (chart) {
  chart.series[0].setData(data);        // same chart, new values
} else {
  Highcharts.chart("era_chart", { chart: { type: "pie" }, series: [{ name: "Area", data: data }] });
}
```

### Data for the chart

The example reads its numbers from a JSON file loaded with
[`{{loadjson}}`](/elements/loadjson-widget/); a CSV works the same way with
[`{{loadcsv}}`](/elements/loadcsv-widget/). To reuse the map's colors, read
`this.getLegendEntries()`: each entry has `color` (`[R, G, B]`), `title` and `isNull`. It has
no counts or areas, so the numbers must come from your data.

### Sankey diagrams

A Sankey (flows between categories, such as land-use transitions) needs its module first.
Each data row is one transition, `[from, to, weight]`:

```javascript
AsyncLoader.loadScriptOnce("/theme/app/js/highcharts/latest/sankey.js", function () {
  Highcharts.chart("transitions_chart", {
    title: { text: "Land use transitions" },
    series: [{ type: "sankey", keys: ["from", "to", "weight"],
               data: [["Forest", "Pasture", 120], ["Pasture", "Crop", 45]] }],
  });
});
```

### Pitfalls

- Ids are page-wide: two layers cannot use the same container id.
- A chart too large for the panel fits well in a [Window](/elements/window-widget/).
- The standard chart types are built in. Other Highcharts modules, like Sankey, must be loaded
  with `AsyncLoader.loadScriptOnce` before you draw.
{% endraw %}
