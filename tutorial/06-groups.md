---
layout: tutorial
docs_nav: true
title: Organising layers in groups
step: 6
permalink: /tutorial/groups/
wizard:
  step: menu-group
  covers_try: true
summary: "Groups with a title become entries of the top menu; viewTitle groups become headings in the layer panel; defaultProperties is shared by every layer inside."
learn:
  - "The two kinds of group: top-menu entries (`title`) and panel headings (`viewTitle`)."
  - "How `elements` nests layers and groups."
  - "How `defaultProperties` saves repeating the same property on every layer."
try:
  - "Open *Relief* in the top menu and turn on *Slope (Cerrado)*: it joins *Elevation* under the *Terrain* heading in the panel."
  - "Add `{ title: \"Municipalities\", name: \"CSR:municipios\" }` to *Boundaries*."
  - "Change `opacity` in `defaultProperties`: both terrain layers change, unless a layer sets its own."
more:
  - { title: "The layer and group model - groups and reserved slots", url: "/reference/layer-and-group-model/" }
  - { title: "GroupProperties in the API reference", url: "/api/#category_GroupProperties" }
---
{% raw %}
A real map has dozens of layers. Groups organise them, at two levels:

- A top-level group with **`title`** and **`elements`** is an entry of the **top menu** - like
  *Maps*, the entry the platform makes for layers outside any group. Opening it lists all its
  layers, each with a switch.
- A group with **`viewTitle`** and **`elements`** is a **heading in the layer panel**, above
  those of its layers that are on.

They nest: `elements` holds layers, or further groups.
{% endraw %}

{% include live-example.html id="tutorial-06-groups" chrome=false %}

{% raw %}
### Sharing properties

`defaultProperties` is applied to every layer inside the group that does not set the property
itself. Above, both terrain layers get `opacity: 0.7` and start off - except *Elevation*, which
sets `visibility: true` itself. Use it for what a whole theme shares: a source, an opacity, a set
of buttons.

`openGroup: true` starts a `viewTitle` heading expanded. The `color` of a top-level group colours
its menu entry and the rows of all its layers; a nested group's `color` colours its heading.

### A reserved group

`group: "background"` on a layer (not a group of `elements`) makes it a **basemap**: it goes
under everything and into the map's background picker instead of the layer list - see the
[background selector](/elements/background-selector/).
{% endraw %}
