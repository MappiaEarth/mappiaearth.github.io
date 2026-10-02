---
layout: example
title: AMAZONES - Non-timber rubber
summary: "Click municipalities or protected areas to compare their rubber production, productivity or rent in a chart."
categories: [Combobox, PickPoint, Highcharts, changeLayers, beforeCalc]
featured-img: amazones_rubber
type: Example
project: Amazon Ecoservices (AMAZONES)
project-url: http://csr.ufmg.br/amazones/
map-link: lang=eng&map=&queryid=3&extent=-443.628,-16.847,-407.373,3.294&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,capabilities,mobile&visiblelayers=-1
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
[rubber page](https://csr.ufmg.br/amazones/non-timber-rubber/). The "Rubber" group maps the
favourability, yield and rent of rubber across the Amazon. The query layer "Rubber values per region"
turns that into a comparison: choose whether to work with municipalities or protected areas, choose the item
- total potential production (kg), mean productivity (kg/ha) or mean rent (US$/ha/year) - then click areas
on the map. Each click adds or removes an area, and a column chart compares the areas you picked. The code
is query 3.

### How it is built

- **Two comboboxes.** One picks the kind of region, the other the item to compare. See
  [Combobox](/elements/combobox-widget/).
- **Collecting clicked areas.** A `pickpoint` widget with `markLayerInd=1` gathers the attributes of each
  clicked polygon; `beforeCalc` reads them with `getAttributes(1)` and clears them with `removeAttribute`
  when a combobox changes. See [PickPoint](/elements/pickpoint-widget/).
- **Switching the map.** When either combobox changes, `beforeCalc` calls `changeLayers` to put the
  municipalities or protected-areas map in the layer, with the style of the chosen item. See
  [the execution model](/reference/execution-model/).
- **The chart.** Highcharts draws one column per picked area, in the colour the area has on the map. See
  [charts](/elements/charts/).
- **No pixel calculation.** The layer's `expression` is `null`: the query only reacts to widgets and
  redraws the chart, while the maps come straight from the server.
- **Groups.** "Base Maps", "Rubber" and "Queries" are arrays whose first item gives the group `title` and
  `color`. See [the layer and group model](/reference/layer-and-group-model/).

### Try this

- Choose Protected Areas and "Mean rent (US$/ha/year)", click three protected areas and compare the bars.
- Click one of them again to drop it from the chart.
