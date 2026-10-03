---
layout: tutorial
docs_nav: true
title: The ExtjsUtils toolbox
step: 8
permalink: /tutorial/extjsutils/
summary: "ExtjsUtils holds the platform's helpers your code calls: messages, layers and legends, the map, requests, GeoJSON, page styles and more."
learn:
  - "The groups of helpers in `ExtjsUtils`, and what each is for."
  - "How to reach the map itself (OpenLayers) and move it."
  - "Where to look up any helper."
try:
  - "Add a region to `REGIONS`, for example `Southeast: [-53, -25, -39, -14]`."
  - "Show the legend in a dialog: `ExtjsUtils.ALERTIFY.alert(...)` instead of `log`."
  - "Log the map's zoom after choosing a region: `ExtjsUtils.JS.getMap().getZoom()`."
more:
  - { title: "API reference", url: "/api/", why: "every helper, with its parameters and an example" }
  - { title: "Where to find it", url: "/reference/where-to-look/", why: "which part of the API to open" }
  - { title: "Notifications and choices", url: "/elements/notifications/" }
---
The functions in your query reach the platform through **`ExtjsUtils`**, a toolbox of helpers
grouped by subject. This example uses three of them: messages and questions, a layer's legend,
and the map itself.

{% include live-example.html id="tutorial-08-extjsutils" %}

{% raw %}
### The helpers you will use most

| Group | For | Examples |
|---|---|---|
| `ExtjsUtils.QUERY` | The query and its layers | `setQueryGlobalProperties`, `addLayer`, `removeLayer`, `addRemoteWMSServer`, `decorate`, `setMappiaIoCallback`, `postMessage` |
| `ExtjsUtils.ALERTIFY` | Talking to the reader | `log` (a passing message), `alert`, `confirmChoice` (a question with options) |
| `ExtjsUtils.LAYER` | Layers and legends | `getLayerByName`, `getLayerLegend` |
| `ExtjsUtils.JS` | The page's main objects | `getMap()` - the map, an OpenLayers map |
| `ExtjsUtils.ZOOM` | Zooming | `zoomToExtent` |
| `ExtjsUtils.REQUEST` | The page address and the network | `getParameterByName` (a parameter of the page URL), `advToolsOptions` (a page option) |
| `ExtjsUtils.GEOJSON` | Vector data | `geojson2Features`, `shapefile2GeojsonAsync` |
| `ExtjsUtils.CSS` | Page styles | `defineClass` |
| `ExtjsUtils.CONFIGURATION` | Query-wide settings | `setOptions` |

### The map itself

`ExtjsUtils.JS.getMap()` returns the map, an **OpenLayers 2** map: `setCenter`, `zoomToExtent`,
`getZoom`, its `layers`. Its coordinates are in the map's projection (metres), so a longitude and
latitude are converted first, as the example does:

```javascript
var map = ExtjsUtils.JS.getMap();
var box = new OpenLayers.Bounds(-48, -18, -34, -1)            // west, south, east, north, in degrees
  .transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
map.zoomToExtent(box);
```

Every helper, with its parameters and an example, is in the [API reference](/api/).
`ExtjsUtils.QUERY` and `ExtjsUtils.CONFIGURATION` are under *Query setup*, because they are
mostly called before the list; the others are under *ExtjsUtils helpers*, by name -
*ALERTIFY*, *LAYER*, *JS*... A layer's own settings are not helpers: they are its properties
(step 2).
{% endraw %}
