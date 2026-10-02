---
layout: example
title: AMAZONES - Carbon stocks and CO2 emissions
summary: "Choose a deforestation level and a CO2 price to see which forest would be lost and how much CO2 and money that represents."
categories: [Slider, Textfield, Label, LoadCsv, Highcharts, changeLayers, MarkupSyntax]
featured-img: amazones_carbon
type: Example
project: Amazon Ecoservices (AMAZONES)
project-url: http://csr.ufmg.br/amazones/
map-link: lang=eng&map=&queryid=6&extent=-443.628,-16.847,-407.373,3.294&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,modified,capabilities,mobile&visiblelayers=-1
api:
  - key: Slider
    tags: ['minValue', 'maxValue', 'increment', 'value']
  - key: Textfield
    tags: ['isnumeric', 'value']
  - key: Label
    tags: ['html']
  - key: MarkupSyntax
    tags: ['getid']
  - key: LoadCsv
    tags: ['getLines', 'getValue']
  - key: Highcharts
    tags: ['chart']
  - key: LayerInternal
    tags: ['changeLayers']
  - key: LayersFunctions
    tags: ['beforeCalc']
---
This map belongs to [Amazon Ecoservices (AMAZONES)](http://csr.ufmg.br/amazones/) and is shown on its
[carbon stocks page](https://csr.ufmg.br/amazones/carbon-stocks/). The "Carbon Stocks" group maps
above-ground biomass and the threat of deforestation. The query layer "Amazon CO2 Emission by Deforestation"
simulates losing 20% to 60% of the forest: the areas cleared in each scenario are chosen by deforestation
threat, and the emissions follow from the biomass. Move the slider to choose the share deforested, type the
price paid per tonne of CO2 (US$ 5.60 by default), and the map shows the cleared areas while a chart gives
the CO2 emitted and its value for every scenario, with the chosen one in red. The code is query 6.

### How it is built

- **A slider with a live label.** The `slider` goes from 20 to 60 in steps of 5; a `label` uses `getid`
  with `on_change` to rewrite "Deforested by N%" while you drag. See [Slider](/elements/slider-widget/) and
  [markup syntax](/elements/markup-syntax/).
- **A numeric text field** (`isnumeric`) holds the price per tonne. See [Textfield](/elements/textfield-widget/).
- **A data file.** `loadcsv` reads the CO2 emitted in each scenario; `beforeCalc` takes the value of each
  row to build the chart. See [LoadCsv](/elements/loadcsv-widget/).
- **Switching the map.** `beforeCalc` calls `changeLayers` to show the deforestation map of the chosen
  percentage. See [the execution model](/reference/execution-model/).
- **The chart.** A Highcharts spline chart with two series, CO2 emissions and CO2 value lost, over the nine
  scenarios. See [charts](/elements/charts/).
- **Pictures in the panel.** The layer description embeds thumbnails of the threat and biomass maps next
  to the explanation.

### Try this

- Drag the slider from 20% to 60% and watch the cleared area grow on the map.
- Change the price to 10 and compare the "CO2 Value Lost" line.
