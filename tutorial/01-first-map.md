---
layout: tutorial
docs_nav: true
title: Your first map
step: 1
permalink: /tutorial/first-map/
wizard:
  step: turn-it-on
  covers_try: true
summary: "A Mappia map is described by a query: one JavaScript expression whose value is the list of layers to show."
learn:
  - "What a query is: one JavaScript expression whose value is the list of layers."
  - "How a layer points at a published map: its `name`."
  - "Where you write and run a query: in these pages, in the playground and in the Mappia editor."
try:
  - "Copy the query, open it in the playground and change `title` to `\"Brazil\"`: the layer list shows the new title."
  - "Set `visibility: false`: the layer is not drawn, but it stays in the top menu - open *Maps* and switch it on."
  - "Change the name to `\"CSR:does_not_exist\"`: the map shows no layer. A name must exist in the catalogue - step 3 shows where names come from."
more:
  - { title: "How a query is evaluated", url: "/reference/query-language/", why: "the rules behind one expression" }
  - { title: "The layer and group model", url: "/reference/layer-and-group-model/" }
---
Mappia shows maps that are described in text. That text is a **query**: a short piece of
JavaScript that says which layers the map has and how each one looks. The platform reads the
query and builds the map - the layer list, the legends, the controls.

Here is the smallest query that shows something: one layer, the states of Brazil.

{% include live-example.html id="tutorial-01-first-map" chrome=false %}

{% raw %}
### What each line does

- **`[ ... ]`** - the query is a list (an array) of layers. This one has a single layer.
- **`name: "CSR:estados"`** - the published map to show, written `WORKSPACE:map`: the map
  `estados` of the workspace `CSR` of the Mappia map server. This is the one property every layer
  needs.
- **`title`** - the name of the layer in the menus. Without it, they show the map's own title from
  the server.
- **`visibility: true`** - the layer is drawn as soon as the map opens.

### One expression, not a program

The platform does not run a query line by line: it **evaluates it as one expression** and keeps
its value, which must be that list of layers. That is why the query above has no `var` and no
statements - a line like `var x = 1;` before the list breaks the whole query, and the map opens
without your layers. Step 7 shows how to add setup code and shared values the right way.

### Where to run a query

- **Here**: click the picture of an example. A live map opens in the page and runs the query.
- **In the playground** ("Edit it in the playground"): change the text and apply it again, as
  many times as you like.
- **In the [Mappia editor]({{ site.maps.editor }})**: paste a query, press *Apply* to see it,
  and *Save* to keep it on the server with a number of its own (step 9).
{% endraw %}
