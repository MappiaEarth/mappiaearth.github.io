---
layout: example
title: Rio Doce basin - Priority areas for restoration
summary: "Compare vulnerability indices, land suitability and priority maps for restoring native vegetation in the Rio Doce basin."
categories: [GroupProperties, LayersProperties, priority, visibility, map tools]
featured-img: rio_doce_restoration
type: Example
project: Priority areas for environmental restoration of the Rio Doce basin
project-url: https://csr.ufmg.br/restaurariodoce/
map-link: lang=&map=&queryid=184&extent=&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,capabilities&visiblelayers=custom
api:
  - key: GroupProperties
    tags: ['title', 'color', 'elements']
  - key: LayersProperties
    tags: ['name', 'priority', 'visibility']
  - key: URLProperties
    tags: ['tools', 'options', 'visiblelayers']
---
The map from [Identification of priority areas for environmental restoration of the Rio Doce
basin](https://csr.ufmg.br/restaurariodoce/) gathers the project's results for the basin: priority areas for
water supply sources (mananciais), an environmental and a social vulnerability index, the land's
suitability ("vocação") for natural regeneration, for planting without an economic purpose and for planting
with one, and the matching priority maps for each of these three ways of restoring vegetation. Base maps
give the basin limit, its municipalities and its drainage network. Turn layers on and off, read the value
under the cursor, and click the map to identify what lies there. Query 184 is under 1 KB: it shows how far
plain layer definitions and the map address go before any widget or function is needed.

### How it is built

- **Two groups.** "Mapas base" and "Resultados" are each written as `title`, `color` and `elements`. See
  [the layer and group model](/reference/layer-and-group-model/).
- **Layers by name only.** Each layer is a published map (`CSR:...`); its title, legend and styles come
  from the map server, not from the query.
- **Order and start state.** `priority` (100 down to 45) fixes the order in the panel, and `visibility: true`
  turns on the basin limit and the environmental vulnerability index at start.
- **Tools from the address.** `tools=...getfeature,hovershowlegend` adds the identify button and the legend
  value under the pointer, and `options=scale,startopened,capabilities` adds a scale bar, opens the layer
  panel and loads only the maps the query names. See [map toolbar tools and page options](/elements/map-tools/).

### Try this

- Turn on the three "vocação" layers one after the other and compare them with the priority maps.
- Hover over the social vulnerability index to read its value under the pointer.
