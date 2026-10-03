---
layout: tutorial
docs_nav: true
title: Layers and their properties
step: 2
permalink: /tutorial/layers/
wizard:
  step: second-layer
  covers_try: true
summary: "Several maps in one query, each a layer with its own title, opacity and starting state."
learn:
  - "How several layers make one map."
  - "The properties you use on almost every layer: `title`, `visibility`, `opacity`."
  - "Where to find every other property of a layer."
try:
  - "Open *Maps* in the top menu and switch on *Forest biomass (Amazon)* - it covers the Amazon only."
  - "Set the Elevation's `opacity` to `0.3`: the basemap shows through it."
  - "Add a fourth layer, `{ name: \"CSR:geologia\", title: \"Geology\", visibility: true, opacity: 0.6 }`, after the others."
more:
  - { title: "Layer and group property catalogue", url: "/reference/property-catalogue/", why: "every property a layer accepts" }
  - { title: "Where to find it", url: "/reference/where-to-look/", why: "which part of the API to open" }
  - { title: "The layer and group model", url: "/reference/layer-and-group-model/", why: "presentation properties, in one place" }
---
A map is usually several maps on top of each other - the relief, the borders, a theme. In a
query, each one is a **layer**: one entry of the list, between `{ }`, separated by commas.

{% include live-example.html id="tutorial-02-layers" chrome=false %}

{% raw %}
### The properties you will use most

| Property | What it does | In the example |
|---|---|---|
| `name` | The published map (step 3 says where names come from) | `"CSR:altimetria"` - elevation |
| `title` | The name of the layer in the menus | `"Elevation"` |
| `visibility` | `true`: drawn when the map opens. `false`: off, until the reader switches it on in the top menu | The biomass layer starts off |
| `opacity` | From `0` (invisible) to `1` (opaque) | The states at `0.5` let the relief show through |

The reader decides too. The **top menu** lists every layer with a switch - layers that are not in
a group are under *Maps* (step 6 makes groups) - and the **panel** on the left lists the layers
switched on there, each with an eye button that hides it without taking it off the panel.

### And the rest

A layer accepts many more properties - a thumbnail for the layer list (`thumbUrl`), the scale
range where it is drawn (`minscale`, `maxscale`), which of its styles to use (`styles`). You do
not need them to start. Some belong to one kind of layer only: the calculated, file and tile
layers of steps 4 and 5 also get a panel of their own, with text, controls and row buttons,
which a published map like these does not have. Every property is listed, with its type and an
example, in the [property catalogue](/reference/property-catalogue/) and the
[API reference](/api/).
{% endraw %}
