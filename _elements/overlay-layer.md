---
layout: element
title: "Overlay layer for markers and highlights"
tool_group: data
summary: "Draw markers, highlights and search results on the map without adding a row to the layer panel."
categories: [LayerAdditional, GEOMETRY, PROJECTION]
api:
  - key: LayerAdditional
type: Element
try:
  - "Find the red dot over Belo Horizonte: the overlay draws it once the map has loaded."
  - "Look at the layer panel: only States is listed - the dot has no row and no switch."
  - "Change the coordinates in `createPoint` and run it again: the dot moves to the new place."
key_params:
  - name: "LayerAdditional"
    example: "new Ext.LayerAdditional({}, ExtjsUtils.JS.getMap())"
    does: "Creates the overlay on the map. Create it once and reuse it for every marker."
  - name: "createPoint"
    example: "overlay.createPoint(-43.94, -19.92, \"EPSG:4326\")"
    does: "A point from coordinates in the projection you name, converted to the map's. Longitude comes first."
  - name: "createFeature"
    example: "overlay.createFeature(point)"
    does: "Wraps a geometry, or an array of them, into a feature you can style and draw."
  - name: "drawFeature"
    example: "overlay.drawFeature(city, { fillColor: \"#e74c3c\", fillOpacity: 1, pointRadius: 11 })"
    does: "Styles and draws a feature in one call. Without `fillOpacity: 1` the fill stays translucent."
  - name: "removeFeatures"
    example: "overlay.removeFeatures()"
    does: "Clears the overlay. With no argument every feature is removed; pass features to remove only those."
---
{% raw %}
### Run it once the map is ready

The overlay needs the map, so create it in code that runs after loading. `runNow` is the one
global the platform calls by itself, once, after the query loads; declare it with
`ExtjsUtils.QUERY.setQueryGlobalProperties`, as the example does. A button handler, a click
callback or a message from the page that embeds the map ([MappiaIO](/elements/mappia-io/))
work too.

### Keep one overlay and redraw it

To move a marker, clear the overlay and draw again. Keep the overlay in a query global so
every call reuses it:

```javascript
ExtjsUtils.QUERY.setQueryGlobalProperties({
  spotOverlay: null,
  markSpot: function (lon, lat) {
    if (!window.spotOverlay) window.spotOverlay = new Ext.LayerAdditional({}, ExtjsUtils.JS.getMap());
    var overlay = window.spotOverlay;
    overlay.removeFeatures();                                  // clear the previous marker
    var spot = overlay.createFeature(overlay.createPoint(lon, lat, "EPSG:4326"));
    overlay.drawFeature(spot, { graphicName: "circle", pointRadius: 9, fillColor: "#e74c3c",
      fillOpacity: 1, strokeColor: "#ffffff", strokeWidth: 2 });
  },
}) && [{ name: "CSR:estados", title: "States", visibility: true }];
```

Then any callback can call `window.markSpot(-43.94, -19.92)`.

### More than points

- `createPolygon([p1, p2, p3])` makes a polygon from points made with `createPoint`; the ring
  closes by itself.
- `drawLatLongExtents([west, south, east, north], color)` outlines a longitude/latitude box,
  the way the interface highlights a layer's extent.
- GeoJSON goes in with `overlay.addFeatures(ExtjsUtils.GEOJSON.geojson2Features(geojson, "EPSG:4326"))`.
  Name the projection: without it the data is read as Web Mercator metres and lands in the
  wrong place.

### Style

`drawFeature` takes OpenLayers style properties: `fillColor`, `fillOpacity`, `strokeColor`,
`strokeWidth`, `pointRadius`, `graphicName` (`"circle"`, `"square"`, `"star"`...),
`externalGraphic` (an image URL) and `label`. Features added with `addFeatures` use the
overlay's own style instead: a plain grey and white one, unless you create the overlay first
with `overlay.createLayer({ styleMap: new OpenLayers.StyleMap({...}) })`.

### Show, hide and remove

The overlay does not follow any other layer: `overlay.setVisibility(false)` hides it and
`setVisibility(true)` shows it again. `removeLayer()` takes it off the map entirely.

### When to use a file layer instead

The overlay is deliberately invisible to the layer panel: the user cannot turn it off, and
it has no click callbacks of its own. For data the user should see listed, switch on and off
and click, use a [file layer](/elements/file-source-layer/).
{% endraw %}
