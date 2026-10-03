---
layout: tutorial
docs_nav: true
title: Where maps come from
step: 3
permalink: /tutorial/where-maps-come-from/
wizard:
  step: catalogue-name
summary: "Layer names come from a map server's catalogue (WMS); addRemoteWMSServer brings in maps from other servers, such as INPE's deforestation maps."
learn:
  - "What a WMS map server is, and how its catalogue gives each map a name."
  - "How to find the name of a map."
  - "How `ExtjsUtils.QUERY.addRemoteWMSServer` registers another server, and `source` points a layer at it."
try:
  - "Add the indigenous lands of the same server: `{ name: \"indigenous_area_legal_amazon\", source: \"prodes\", title: \"Indigenous lands\", visibility: true }`."
  - "Remove `source: \"prodes\"` from a layer: the map is looked up in the Mappia catalogue instead, where it does not exist, and is not shown."
  - "Rename the server - `prodes` to `inpe` - in the registration and in every `source`. The name is yours to choose."
more:
  - { title: "How a query is evaluated - names, and where a layer comes from", url: "/reference/query-language/" }
  - { title: "QUERY.addRemoteWMSServer in the API reference", url: "/api/#category_QUERY" }
  - { title: "Publish maps yourself", url: "/mappia_publisher/", why: "publish your own maps from QGIS to GitHub" }
---
{% raw %}
### The catalogue

The maps of Mappia live on a **map server** (GeoServer) that speaks **WMS**, the standard way to
serve maps on the web: the browser asks for a piece of a map - a tile, at a zoom level - and the
server draws it. The server also publishes a **catalogue** (its *capabilities* document) that
lists every map it serves, each with:

- a **name**, `WORKSPACE:map` - what goes in a layer's `name`, like `CSR:estados`;
- a **title**, the human name the layer list shows by default;
- its **styles**, the ways it can be drawn - usually `<map>_1` (`altimetria_1`), chosen with the
  layer property `styles`.

When the calculator starts, it reads that catalogue. A layer whose `name` is not in it is not
shown - the first thing to check when a layer is missing. To find names, look at the queries of
the [examples](/examples/) and the [tools](/tools/), or at the catalogue itself:
`https://maps.csr.ufmg.br/geoserver/wms?request=GetCapabilities` (large: every map).
{% endraw %}

### Maps from another server

Maps from elsewhere come in two steps: **register the server** under a name of your choice, then
point layers at it with **`source`**. This example shows the deforestation monitoring of INPE
(PRODES), served by TerraBrasilis, INPE's own map server, on top of a Mappia map:

{% include live-example.html id="tutorial-03-other-servers" %}

{% raw %}
- `ExtjsUtils.QUERY.addRemoteWMSServer({ ... })` registers each server by a key - here `prodes` -
  with the address of its WMS service as `url`.
- Each layer that says `source: "prodes"` is looked up in that server's catalogue, not in
  Mappia's, and its tiles are drawn by that server. `CSR:estados` has no `source`: it still
  comes from Mappia. One map can mix as many servers as you need.
- The address is not the whole server but one **workspace** of it, `prodes-legal-amz`. Its
  catalogue lists a dozen maps instead of hundreds, so the map opens faster - the catalogue is
  read every time. Inside a workspace's own address, GeoServer lists the maps without the
  workspace prefix: the name is `yearly_deforestation`, not `prodes-legal-amz:yearly_deforestation`.
  Open the catalogue to be sure:
  `https://terrabrasilis.dpi.inpe.br/geoserver/prodes-legal-amz/ows?service=WMS&request=GetCapabilities`.
- The registration comes **before** the list, joined with `&&`. The platform reads the query left
  to right, so the server is known when the layers are read; the call returns `true`, so the
  expression goes on to the list (step 7 explains this `&&` chain).

Any WMS server is registered the same way. Another one, IBGE's - its catalogue does use the
`WORKSPACE:map` form:

```javascript
ExtjsUtils.QUERY.addRemoteWMSServer({
  ibge: { url: "https://geoservicos.ibge.gov.br/geoserver/CCAR/wms?" },
}) && [
  { name: "CCAR:Hidrografia_2016", source: "ibge", title: "Hydrography (IBGE)", visibility: true },
];
```

INPE and IBGE let the browser read their maps directly. A server that does not can be read
through Mappia's proxy instead, with `cors: true` in its registration. Maps you publish yourself
with the Mappia QGIS plugin live in a GitHub repository and are registered the same way, with
`storage: "github"` - see [Publish maps yourself](/mappia_publisher/).
{% endraw %}
