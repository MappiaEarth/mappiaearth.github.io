---
layout: example
title: REDD Brazil - Deforestation, emissions and credits
summary: "Hover over Brazil, a biome, a state or a municipality to chart its yearly deforestation and CO2 emissions, and estimate REDD+ credits with your own parameters."
categories: [Hoverpixel, LoadCsv, Highcharts, Window, LegendHtml, Button, page decoration]
featured-img: redd_brazil
type: Example
project: REDD Brazil
project-url: https://csr.ufmg.br/csr/2024/10/15/redd-brazil/
map-link: lang=pt&map=&queryid=502&extent=&tools=measure,zoomextent,getfeature&options=scale,startopened,capabilities&visiblelayers=custom
api:
  - key: QUERY
    tags: ['decorate', 'setQueryGlobalProperties']
  - key: Hoverpixel
    tags: ['runOnHover', 'runOnClick']
  - key: LoadCsv
    tags: ['getLines', 'getColunsInd']
  - key: Highcharts
    tags: ['chart']
  - key: Window
    tags: ['startVisible', 'ignoreVisibility']
  - key: LegendHtml
    tags: ['preventClick']
  - key: Button
  - key: GroupProperties
    tags: ['viewTitle']
  - key: LayersFunctions
    tags: ['beforeCalc', 'functions']
---
The map from [REDD Brazil](https://csr.ufmg.br/csr/2024/10/15/redd-brazil/) (in Portuguese) shows yearly
deforestation and the CO2 emissions it causes for Brazil, its biomes, states and municipalities. Choose the
coverage area and the scenario (Histórico / Referência or PPCDs) in the side panel, then move the cursor over
the map: a chart window shows the area's yearly deforestation and CO2 emissions against a baseline. Under
PPCDs, a credit calculator following the ART (Architecture for REDD+ Transactions) methodology takes a price
per tonne of CO2, a buffer pool, an uncertainty and a leakage, and the chart adds the discounts and the
emission-reduction credits accumulated between 2024 and 2030. Click the map to hold the chart on one place.
The code is query 502.

### How it is built

- **Hover and click on a raster.** Each coverage layer carries a `hoverpixel` widget with `runOnHover` and
  `runOnClick`; `onHover` redraws the window for the area under the cursor and `onClick` pauses it. See
  [Hoverpixel](/elements/hoverpixel-widget/).
- **Two data files per level.** Each coverage layer loads a historical and an intermediate CSV with
  `loadcsv`; `beforeCalc` reads them once into tables keyed by area code. See [LoadCsv](/elements/loadcsv-widget/).
- **Mixed charts.** Highcharts combines columns (yearly values, discounts, credits) with a spline for the
  baseline, one chart for deforestation and one for emissions. See [charts](/elements/charts/).
- **Windows.** A chart window and an introduction window (with the data sources) are `window` widgets
  that open at start. See [Window](/elements/window-widget/).
- **Plain HTML inputs.** The calculator fields are ordinary inputs written by the query, not Mappia
  widgets; typing in them redraws the window.
- **Legends, buttons and groups.** Base maps show `legendhtml`, a hidden `button` anchors each layer's
  options menu, three `viewTitle` groups organise the panel (including two 2030 land-use maps under
  "Resultado"), and `ExtjsUtils.QUERY.decorate` adds a footer with the partners' logos. See [LegendHtml](/elements/legend_opacityslider-widget/),
  [layer panel buttons](/elements/layer-buttons/) and [the layer and group model](/reference/layer-and-group-model/).

### Try this

- Choose Estados, hover over Pará and then Mato Grosso.
- Switch the scenario to PPCDs, click a state to hold its chart, and raise "Valor por ton/CO₂" from 10 to
  20 USD to compare the credits.
