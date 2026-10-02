---
layout: example
title: SimAmazoniaINFRA - Deforestation and CO2 scenarios
summary: "Pick an Amazon region and a scenario to chart its deforestation and CO2 emissions up to 2050, and estimate emission-reduction credits."
categories: [FileLayer, VectorLayer, LoadCsv, Highcharts, Window, Timeline, Combobox, LegendHtml]
featured-img: simamazoniainfra
type: Example
project: SimAmazoniaINFRA
project-url: https://csr.ufmg.br/simamazoniainfra/
map-link: lang=pt&map=&queryid=575&extent=-99.66796872844522,-25.799891201499232,-15.292968728440716,14.987239504947565&tools=zoomextent,getfeature&options=scale,startopened,capabilities,mobile&visiblelayers=custom
api:
  - key: QUERY
    tags: ['setQueryGlobalProperties']
  - key: FileLayer
    tags: ['url']
  - key: VectorLayer
    tags: ['onClick', 'onHover', 'selectStyle', 'hoverStyle', 'selectController']
  - key: LoadCsv
    tags: ['getLines', 'getColunsInd']
  - key: Highcharts
    tags: ['chart']
  - key: Window
    tags: ['btnID', 'startVisible']
  - key: Timeline
    tags: ['steps', 'nextStepInterval', 'updateMainThumbValue']
  - key: Combobox
  - key: LegendHtml
  - key: GroupProperties
    tags: ['viewTitle', 'defaultProperties']
  - key: LayersFunctions
    tags: ['beforeCalc', 'functions', 'onInputsReady', 'onVisibilityChange']
---
This map from [SimAmazoniaINFRA](https://csr.ufmg.br/simamazoniainfra/) (in Portuguese) shows simulated
deforestation, CO2 emissions, biodiversity loss and transport infrastructure in the Amazon up to 2050.
Click an Amazon region on the map, or pick it in the list, choose the Meta (target) or Tendencial (trend)
scenario, and a floating window charts the region's annual deforestation and CO2 emissions from 2019 to
2050 against a baseline, with the emission-reduction credits given by a small calculator (price per tonne
of CO2, buffer pool, uncertainty, leakage). Other groups hold deforestation, biodiversity-loss, road and
export-route results. The code is query 575.

### How it is built

- **A GeoJSON file layer you click.** The regions are a `source: "file"` layer (`type: "geojsonurl"`) with
  its own default, hover and selected styles; its `onClick` stores the region and redraws the charts. See
  [JSON file source layer](/elements/file-source-layer/) and [clicking and hovering on features](/elements/feature-interaction/).
- **Data files.** Two `loadcsv` widgets read the per-region series of each scenario; the biodiversity and
  ports layers load their own CSV files. See [LoadCsv](/elements/loadcsv-widget/).
- **Charts in a window.** Highcharts mixes columns (deforestation or emissions, discounts, credits) with a
  baseline line, drawn inside a `window` widget; a second window holds the introduction and data sources.
  See [charts](/elements/charts/) and [Window](/elements/window-widget/).
- **Timeline and combobox together.** The kernel density layers (2019-2050) and the road simulation
  (2025-2050, every 5 years) pair a `timeline` with a `combobox` of years; `beforeCalc` keeps both in step
  and shows only the chosen year. See [timeline panel](/elements/timeline-panel/) and [Combobox](/elements/combobox-widget/).
- **Legends in the panel.** The 2050 deforestation maps and the road simulation use `legendHtml`. See
  [LegendHtml](/elements/legend_opacityslider-widget/).
- **Groups and shared code.** Five `viewTitle` groups pass common settings through `defaultProperties`;
  `setQueryGlobalProperties` holds helpers such as closing the other result layers when one is turned on.
  See [the layer and group model](/reference/layer-and-group-model/).

### Try this

- Click another region, switch between Meta and Tendencial, then change "Valor por ton/CO₂" (10 USD by
  default) and watch the accumulated credits.
- In "Resultados - Desmatamento", open "Densidade de kernel (2019 a 2050)", choose a scenario and press play.
