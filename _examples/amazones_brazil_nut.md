---
layout: example
title: AMAZONES - Brazil nut
summary: "Click municipalities or protected areas to compare their Brazil nut production, productivity or rent in a chart."
categories: [Combobox, PickPoint, Highcharts, changeLayers, beforeCalc]
featured-img: amazones_brazil_nut
type: Example
project: Amazon Ecoservices (AMAZONES)
project-url: http://csr.ufmg.br/amazones/
map-link: lang=eng&map=&queryid=4&extent=-443.628,-16.847,-407.373,3.294&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,capabilities,mobile&visiblelayers=-1
api:
  - key: Combobox
    tags: ['data', 'editable']
  - key: PickPoint
    tags: ['getAttributes', 'removeAttribute', 'markLayerInd']
  - key: Highcharts
    tags: ['chart']
  - key: LayerInternal
    tags: ['changeLayers']
  - key: LayersFunctions
    tags: ['beforeCalc']
  - key: LayersProperties
    tags: ['updateAutomatically', 'opacity']
---
This map belongs to [Amazon Ecoservices (AMAZONES)](http://csr.ufmg.br/amazones/) and is shown on its
[Brazil nut page](https://csr.ufmg.br/amazones/non-timber-brazil-nut/). The "Brazil Nut" group maps the
favourability, yield and rent of Brazil nut collection across the Amazon. The query layer "Brazil nut values
per region" compares places: pick municipalities or protected areas, pick total potential production (kg),
mean productivity (kg/ha) or mean rent (US$/ha/year), then click areas on the map. Each click adds or
removes an area, and a column chart compares the selection. The code is query 4; it is built the same way
as the [rubber map](/examples/amazones_rubber/), so the two are a good pair for seeing how one query is
reused for another product by renaming its maps and widget ids.

### How it is built

- **Two comboboxes** choose the kind of region and the item. See [Combobox](/elements/combobox-widget/).
- **A pickpoint collects the clicked areas.** With `markLayerInd=1` it stores each clicked polygon's
  attributes; `beforeCalc` reads them with `getAttributes(1)` and clears them when a combobox changes. See
  [PickPoint](/elements/pickpoint-widget/).
- **changeLayers swaps the map.** A combobox change makes `beforeCalc` load the municipalities or the
  protected-areas map with the style of the chosen item. See [the execution model](/reference/execution-model/).
- **A Highcharts column chart** shows one column per picked area, in that area's map colour. See
  [charts](/elements/charts/).
- **Groups** are arrays whose first item gives the `title` and `color`. See
  [the layer and group model](/reference/layer-and-group-model/).

### Try this

- Keep Municipalities, choose "Total potential production (kg)" and click four municipalities in Acre and
  Pará.
- Switch to Protected Areas: the selection is cleared and the map changes.
