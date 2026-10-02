---
title: Where maps come from
step: 3
permalink: /tutorial/where-maps-come-from/
summary: "Layer names come from a map server's catalogue (WMS); addRemoteWMSServer brings in maps from other servers, such as maps published to GitHub."
learn:
  - "What a WMS map server is, and how its catalogue gives each map a name."
  - "How to find the name of a map."
  - "How `ExtjsUtils.QUERY.addRemoteWMSServer` registers another server, and `source` points a layer at it."
try:
  - "Add the municipalities of the same repository: `{ name: \"GH:municipalities_am\", source: \"example_repo\", title: \"Municipalities\", visibility: true }`."
  - "Remove `source: \"example_repo\"` from a layer: the map is looked up in the Mappia catalogue instead, where it does not exist, and is not shown."
  - "Rename the server - `example_repo` to `my_maps` - in the registration and in every `source`. The name is yours to choose."
more:
  - { title: "Publish maps yourself", url: "/mappia_publisher/", why: "publish your own maps from QGIS to GitHub" }
  - { title: "How a query is evaluated - names, and where a layer comes from", url: "/reference/query-language/" }
  - { title: "QUERY.addRemoteWMSServer in the API reference", url: "/api/#category_QUERY" }
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
point layers at it with **`source`**. This example uses maps published to a GitHub repository
with the Mappia QGIS plugin - an ordinary repository becomes a map server:

{% include live-example.html id="tutorial-03-other-servers" %}

{% raw %}
- `ExtjsUtils.QUERY.addRemoteWMSServer({ ... })` registers each server by a key - here
  `example_repo`. `storage: "github"` says the maps are files in a GitHub repository; Mappia
  reads them from there.
- Each layer says `source: "example_repo"`: its `name` is looked up in that server's catalogue,
  not in Mappia's.
- The registration comes **before** the list, joined with `&&`. The platform reads the query left
  to right, so the server is known when the layers are read; the call returns `true`, so the
  expression goes on to the list (step 7 explains this `&&` chain).

A classic WMS server is registered the same way, by the address of its WMS service. A server on
another site that does not allow the browser to read its catalogue directly is read through
Mappia's proxy, with `cors: true`:

```javascript
ExtjsUtils.QUERY.addRemoteWMSServer({
  ibge: { url: "https://geoservicos.ibge.gov.br/geoserver/CCAR/wms?", cors: true },
}) && [
  { name: "CCAR:Hidrografia_2016", source: "ibge", title: "Hydrography (IBGE)", visibility: true },
];
```

Prefer a server's smallest catalogue - a single workspace, as above - over the whole server: it
is read every time the map opens.
{% endraw %}
