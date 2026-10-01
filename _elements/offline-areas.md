---
layout: element
title: "Offline areas"
tool_group: page
summary: "Save the tiles of an area so the map works without a connection, and choose whether tiles come from the download or the network."
categories: [OFFLINE, CAPABILITIES]
api:
  - key: OFFLINE
    tags: ['getCacheableLayers', 'estimateTileCountForLayers', 'checkStorageQuota', 'suggestMaxZoom', 'downloadArea', 'listAreas', 'deleteArea', 'setServingPolicy', 'getServingPolicy', 'reloadMapTiles', 'verifyAreaServed', 'exportAreaAsZip', 'importAreaFromZip']
type: Element
try:
  - "Press \"How many tiles is this view?\": the label counts the tiles of this view over three zoom levels."
  - "Pan or zoom the map and press it again: the estimate follows the current view."
  - "Use `zoom + 4` instead of `zoom + 2` in `estimate`: the count grows about fourfold per extra level."
key_params:
  - name: "getCacheableLayers"
    example: "ExtjsUtils.OFFLINE.getCacheableLayers()"
    does: "Lists the layers on the map whose tiles can be saved. Pass the list, or part of it, as `layers`."
  - name: "estimateTileCountForLayers"
    example: "ExtjsUtils.OFFLINE.estimateTileCountForLayers(map.getExtent(), 10, 13, layers)"
    does: "Counts the tiles an area would need, without downloading anything. Check it before every download."
  - name: "downloadArea"
    example: "ExtjsUtils.OFFLINE.downloadArea({ name: \"Farm 4711\", extent: map.getExtent(), zoomMin: 10, zoomMax: 13 })"
    does: "Downloads the tiles of an extent and zoom range into the browser; resolves with the area's record."
  - name: "setServingPolicy"
    example: "ExtjsUtils.OFFLINE.setServingPolicy({ mode: \"CacheOnly\" })"
    does: "Chooses whether tiles come from the download or the network. The map reloads its tiles at once."
  - name: "listAreas"
    example: "ExtjsUtils.OFFLINE.listAreas()"
    does: "Resolves with every area saved in this browser: id, name, status, tile count and size."
  - name: "deleteArea"
    example: "ExtjsUtils.OFFLINE.deleteArea(area.id)"
    does: "Removes an area's tiles and record from the browser."
---
{% raw %}
### The steps

1. Choose the layers: `getCacheableLayers()` lists the ones that can be saved.
2. Estimate: `estimateTileCountForLayers(extent, zoomMin, zoomMax, layers)` counts the tiles,
   and `checkStorageQuota()` tells how much space the browser grants.
3. Download: `downloadArea({...})` saves the tiles in the browser.

```javascript
var map = ExtjsUtils.JS.getMap();
ExtjsUtils.OFFLINE.downloadArea({
  name: "Farm 4711",
  extent: map.getExtent(),
  zoomMin: map.getZoom(),
  zoomMax: map.getZoom() + 3,
  layers: ExtjsUtils.OFFLINE.getCacheableLayers(),
  onProgress: function (p) { console.log(p.done + " / " + p.total); },
}).then(function (area) {
  console.log(area.status, area.tileCount + " tiles");
});
```

Run this from a button handler or another callback, after the map has loaded.

### Which layers can be saved

Tiled catalogue maps and tile basemaps such as OpenStreetMap and XYZ layers. Calculated layers
that use an `operation` cannot, because their images depend on the view rather than on a
tile grid, and neither can Google or Bing basemaps, whose terms forbid it. Call
`getCacheableLayers` after the query's layers are on the map; in code that runs right after
loading, wait for `ExtjsUtils.OFFLINE.whenLayersReady()` first.

### Size limits

Each extra zoom level multiplies the tiles by about four. An area may hold at most 20,000
tiles: above that, `downloadArea` refuses with "Area too large" before downloading anything.
Pass `maxTiles` to change the limit for one call.

### How saved tiles are served

A policy chosen by the page; changing it reloads the tiles on screen, so the difference shows
at once:

| `mode` | Behaviour |
|---|---|
| `CacheFirst` (default) | The saved tile if there is one, the network otherwise |
| `NetworkFirst` | The live tile; the saved one only when the network fails |
| `CacheOnly` | Only saved tiles - never the network |
| `NetworkOnly` | Only the network - ignore saved tiles |

When a tile at the current zoom was not saved, the nearest coarser saved zoom is cropped to
fill it, so zooming past the saved range blurs instead of leaving holes.

### Managing areas

- Download again with the same `id` to resume or extend an area: tiles already saved are not
  fetched again.
- An aborted download, or one with failed tiles, ends with status `partial`.
- `listAreas()` and `deleteArea(id)` list and remove areas.
- `exportAreaAsZip(id)` packs an area into one file, and `importAreaFromZip(blob)` rebuilds it
  on another device without downloading the tiles again.

### Check that it really works offline

Saved tiles are served by the browser's service worker, which only takes control of a page
from its next load. `verifyAreaServed(id)` re-requests a sample of an area's tiles and
reports whether they really came from the download.
{% endraw %}
