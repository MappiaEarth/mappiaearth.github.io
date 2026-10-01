---
layout: element
title: XYZ Layer
tool_group: data
summary: "Show any z/x/y tile service - OpenTopoMap, a satellite mosaic, your own tiles - as a layer of the map."
categories: [XYZLayer]
featured-img: XYZ-layer-example
type: Element
examples:
    - title: Simple XYZ Layer Example
      map-link: tools=hovershowlegend,layerchooser,helpintro&options=onlyfirstvisible,startopened,hidemetadata,disabledownload,hidestylechooser,overview,capabilities&extent=-443.628,-16.847,-407.373,3.294&visiblelayers=1&zoomlevels=10&queryid=473
      featured-img: XYZ-layer-example
api:
  - key: LayersProperties
    tags: ['source']
  - key: XYZLayer
    tags: ['url']
try:
  - "Zoom in on the topographic map: more detailed OpenTopoMap tiles load at each zoom level."
  - "Turn OpenTopoMap off with the eye button in the layer panel: the basemap shows underneath."
  - "Replace `url` with another service's ${z}/${x}/${y} address and run it again."
key_params:
  - name: "source"
    example: "xyz"
    does: "Makes the layer fetch ready-made tiles, addressed by zoom, column and row, from `url`."
  - name: "url"
    example: "https://a.tile.opentopomap.org/${z}/${x}/${y}.png"
    does: "The tile address. `${z}`, `${x}` and `${y}` are replaced by the zoom, column and row of each tile."
  - name: "name"
    example: "opentopomap"
    does: "A unique identifier for the layer: any text no other layer of the query uses."
  - name: "opacity"
    example: "0.9"
    does: "From 0 (invisible) to 1 (solid); lower it to see the layers underneath."
  - name: "visibility"
    example: "true"
    does: "Starts the layer turned on. The user can still switch it in the layer panel."
---
{% raw %}
### Write the placeholders as `${z}`, `${x}`, `${y}`

The dollar sign and the braces are both needed. Older examples wrote `$z/$x/$y`, which is not
replaced, so every tile request fails. Put each placeholder where the service expects it - some
services put the row before the column:

```javascript
{
  title: "Satellite imagery",
  name: "esri_imagery",
  source: "xyz",
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}",
  visibility: true,
}
```

### Which services work

Any service that serves square tiles in the usual web scheme - Web Mercator, row 0 at the
top - the scheme of OpenStreetMap and most online basemaps. A TMS service that counts rows
from the bottom shows its tiles in the wrong places.

### Services that need a key

Put the key in `url`, as the service documents it. Anyone who opens the map can read the
query and its key, so use a key restricted to your site. Check each service's terms of use
and attribution rules before publishing a map with it.

### Use it offline

The tiles of an XYZ layer can be downloaded for use without a connection - see
[offline areas](/elements/offline-areas/).

### Related layers

To offer several basemaps the user can switch between, see the
[background map picker](/elements/background-selector/). For vector data (points, lines,
polygons) rather than images, use a [file layer](/elements/file-source-layer/).
{% endraw %}
