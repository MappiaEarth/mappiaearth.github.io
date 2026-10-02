---
layout: example
title: AMAZONES - Fire
summary: "Click municipalities or protected areas to compare their potential and effective economic losses from fire and their burned area."
categories: [Combobox, PickPoint, Highcharts, changeLayers, beforeCalc]
featured-img: amazones_fire
type: Example
project: Amazon Ecoservices (AMAZONES)
project-url: http://csr.ufmg.br/amazones/
map-link: lang=eng&map=&queryid=10&extent=-443.628,-16.847,-407.373,3.294&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,capabilities,mobile&visiblelayers=-1
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
    tags: ['updateAutomatically', 'legendTitle']
---
This map belongs to [Amazon Ecoservices (AMAZONES)](http://csr.ufmg.br/amazones/) and is shown on its
[fire page](https://csr.ufmg.br/amazones/fire/). The "Fire" group maps simulated fire recurrence, simulated
and observed fire scars, and effective and potential losses. Three query layers turn these into comparisons
between places: "Potential economic losses (US$/ha)", "Effective economic losses (US$/ha/year)" and "Total
burned area (ha)". In each one, choose municipalities or protected areas (and, for the two loss layers,
the mean or the total), then click areas on the map: each click adds or removes an area, and a column chart
compares the selection. The code is query 10.

### How it is built

- **Comboboxes per layer.** Each query layer has its own `combobox` for the kind of region, and the two loss
  layers a second one for mean or total losses. See [Combobox](/elements/combobox-widget/).
- **Pickpoints collect the clicked areas.** Three `pickpoint` widgets (`markLayerInd=1`) store the clicked
  polygons' attributes; `beforeCalc` reads them with `getAttributes(1)` and clears them when the region type
  or item changes. See [PickPoint](/elements/pickpoint-widget/).
- **changeLayers swaps the map.** A combobox change loads the municipalities or protected-areas map, with
  the style of the chosen item. See [the execution model](/reference/execution-model/).
- **Column charts.** Each layer draws one Highcharts column per picked area, in the area's map colour. See
  [charts](/elements/charts/).
- **Same pattern, three times.** The three layers repeat the same `beforeCalc` with different map names and
  attribute columns, which makes this query a compact reference for the pattern also used in the
  [rubber map](/examples/amazones_rubber/).
- **Groups** are arrays whose first item gives the `title` and `color`. See
  [the layer and group model](/reference/layer-and-group-model/).

### Try this

- In "Total burned area (ha)", choose Protected Areas and click three of them.
- In "Effective economic losses (US$/ha/year)", switch from mean to total losses: the selection is cleared
  and the map takes the style of the new item.
