---
title: Layers and their properties
step: 2
permalink: /tutorial/layers/
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
that are on, each with an eye button to hide it.

### And the rest

A layer accepts many more properties - a description and a thumbnail for the layer list, the
zoom levels where it shows, which of its styles to use (`styles`), the buttons of its row. You
do not need them to start; they are all listed, with their type and an example, in the
[property catalogue](/reference/property-catalogue/) and the [API reference](/api/).
{% endraw %}
