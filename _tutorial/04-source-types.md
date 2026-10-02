---
title: Source types
step: 4
permalink: /tutorial/source-types/
summary: "source decides where a layer's pixels come from: a published map, a calculation, a file of features, a tile service or a basemap."
learn:
  - "The kinds of layer, chosen with `source`."
  - "Which properties each kind needs."
  - "That they all mix freely in one map."
try:
  - "Swap the tile service for OpenStreetMap: `url: \"https://tile.openstreetmap.org/${z}/${x}/${y}.png\"`."
  - "Add a third city to the file layer, with its longitude and latitude."
  - "In the calculated layer, change `1000` to `500` in the expression and in the legend title."
more:
  - { title: "The layer and group model - the kinds of layer", url: "/reference/layer-and-group-model/" }
  - { title: "File layers", url: "/elements/file-source-layer/", why: "GeoJSON, CSV and your own loader" }
  - { title: "XYZ layers", url: "/elements/xyz-layer/" }
  - { title: "Expression", url: "/elements/expression-function/", why: "calculated layers in depth" }
  - { title: "Background selector", url: "/elements/background-selector/", why: "basemaps" }
---
{% raw %}
So far every layer was a published map from a catalogue. A layer can also be computed, read
from a file of features or drawn from a tile service. The property **`source`** says which:

| `source` | What the layer is | What else it needs |
|---|---|---|
| *(none)* | A published map of the catalogue, drawn by the map server | `name` |
| a server's key | A published map of a registered server (step 3) | `name` |
| `"calculate"` | A new map, computed in the browser from the values of the maps in `name` | `expression` (step 5) |
| `"file"` | Features (points, lines, areas) from GeoJSON, a CSV or JSON list, or your own code | `type`, and `json` or `url` |
| `"xyz"` | Tiles from a tile service, addressed by zoom, column and row | `url` with `${z}`, `${x}`, `${y}` |
| `"osm"`, `"google"`, `"arcgisrest"` | A ready-made basemap | `name` (for example `mapnik`) |
{% endraw %}

All of them in one map:

{% include live-example.html id="tutorial-04-source-types" %}

{% raw %}
### What to notice

- **The tile layer** has no catalogue: its `url` is a pattern, and the map fills in `${z}`, `${x}`
  and `${y}` for every tile it needs.
- **The calculated layer** reads the elevation map pixel by pixel and keeps only what is higher
  than 1000 m - with a legend of its own. Step 5 is about these.
- **The file layer** holds its features right in the query (`type: "json"`), in longitude and
  latitude (`fromProj: "EPSG:4326"`). Its style can write an attribute on the map: `"${name}"`.
  With `type: "geojsonurl"` or `"csv"` and a `url`, the features come from a file instead.
- **Basemaps** are the layers below everything: a layer with `group: "background"` joins the
  background picker of the map instead of the layer list.
{% endraw %}
