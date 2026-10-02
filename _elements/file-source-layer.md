---
layout: element
title: JSON file source Layer
tool_group: data
summary: "Show vector features - inline GeoJSON, or a GeoJSON or CSV file - as a map layer with its own style and click handling."
categories: [FileLayer, VectorLayer, ConfigLayer]
featured-img: simple-example-file-source
type: Element
examples:
    - title: Simple File Source Layer Example
      map-link: queryid=480&tools=legend,measure,hovershowlegend,getfeature,zoomextent&options=capabilities,scale,disabledownload,hidemetadata
      featured-img: simple-example-file-source
api:
  - key: LayersProperties
    tags: ['source']
  - key: ConfigLayer
    tags: ['type']
  - key: FileLayer
    tags: ['json']
  - key: VectorLayer
    tags: ['fromProj', 'onClick', 'defaultStyle', 'onAdded']
try:
  - "Find the two orange areas and point C drawn over Brazil from the inline GeoJSON."
  - "Change a coordinate inside `json` and run it again: that shape moves on the map."
  - "Delete the `fromProj` line and run it again: the shapes are no longer over Brazil."
key_params:
  - name: "source"
    example: "file"
    does: "Makes the layer hold vector features drawn in the browser, instead of map images from a server."
  - name: "type"
    example: "json"
    does: "How features are loaded: `json` inline, `geojsonurl` or `csv` from `url`, `empty` to fill later, `load` with your own loader."
  - name: "json"
    example: "{ type: \"FeatureCollection\", features: [...] }"
    does: "The inline data for `type: \"json\"`: a GeoJSON object, or an array of plain objects with `lon` and `lat`."
  - name: "url"
    example: "https://example.com/data/areas.geojson"
    does: "The file fetched by the `geojsonurl`, `csv` and `jsonurl` types; relative paths resolve on the Mappia server."
  - name: "name"
    example: "inline_areas"
    does: "A unique identifier for the layer; use it to find the layer again from your code."
---
{% raw %}
### Always say which projection the data uses

GeoJSON without a `crs` member is read in the platform's default projection, Web Mercator
metres (EPSG:900913). Longitude and latitude read that way land in the wrong place, with no
error. Add `fromProj: "EPSG:4326"` to the layer for longitude/latitude data, as the example
does, or put a `crs` in the GeoJSON. To set it once for every vector layer of the query, chain
`ExtjsUtils.CONFIGURATION.setOptions({ defaultFromProj: "EPSG:4326" })` before the layer list.

GeoJSON coordinates go longitude first: `[-44, -19]`, not `[-19, -44]`.

### Load features from a file

| `type` | Where the features come from |
|---|---|
| `json` (the default) | The inline `json`: GeoJSON, or an array of plain objects |
| `geojsonurl` | A GeoJSON file at `url` |
| `csv` | A CSV file at `url`, one point per line |
| `jsonurl` | A JSON array of plain objects at `url` |
| `empty` | Nothing yet; you add features later from code |
| `load` | Your own `loadData(inputs, config)` function |

For CSV lines and plain objects, each entry becomes a point read from its `lon` and `lat`
fields, and the other fields become its attributes. If your fields have other names, map them
with `coordinates: { x: "longitude", y: "latitude" }`.

### Style the features

`defaultStyle` takes OpenLayers style properties: `fillColor`, `fillOpacity`, `strokeColor`,
`strokeWidth`, `pointRadius`. `selectStyle` styles a clicked feature and needs an `onClick`
callback; `hoverStyle` styles a hovered one and needs an `onHover` callback.

### React to a click

`popupTemplate` and `popupCallback` are accepted but never read: no popup opens. Use
`onClick`, which receives the clicked feature with its GeoJSON properties in `attributes`:

```javascript
{
  name: "farms",
  source: "file",
  type: "geojsonurl",
  url: "https://example.com/data/farms.geojson",
  fromProj: "EPSG:4326",
  onClick: function (feature) {
    ExtjsUtils.ALERTIFY.log("You clicked " + feature.attributes.name);
  },
  onAdded: function () {
    ExtjsUtils.JS.getMap().zoomToExtent(this.getDataExtent());   // zoom to the data
  },
}
```

`onAdded` runs once the layer is on the map and its features are loaded, which makes it the
place to zoom to them.

### Many points

Set `clusterDistance: 40` to group points closer than 40 pixels into one symbol. Each cluster
carries the number of points it holds in `attributes.count`.

### Change the data later

Start with `type: "empty"` and add features when you have them, for example from a message
sent by the page that embeds the map ([MappiaIO](/elements/mappia-io/)):

```javascript
ExtjsUtils.LAYER.getLayerByName("farms").loadGeojson(geojson, "EPSG:4326");
```

To draw a marker or a highlight that should not appear in the layer panel, use an
[overlay layer](/elements/overlay-layer/) instead.
{% endraw %}
