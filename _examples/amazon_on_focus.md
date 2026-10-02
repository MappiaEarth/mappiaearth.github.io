---
layout: example
title: Amazon on focus - Deforestation and fires by land category
summary: "Hover over a municipality, protected area, indigenous land, settlement or undesignated area to chart its burned and deforested area and its land-use transitions."
categories: [Hoverpixel, LoadCsv, Highcharts, Sankey diagram, Window, AsyncLoader, LegendHtml]
featured-img: amazon_on_focus
type: Example
project: Amazon on focus
project-url: https://csr.ufmg.br/amazoniaemfoco/
map-link: lang=&map=&queryid=411&extent=&tools=zoomextent&options=scale,startopened,mobile,capabilities&visiblelayers=custom
api:
  - key: QUERY
    tags: ['setQueryGlobalProperties']
  - key: Hoverpixel
    tags: ['runOnHover', 'runOnClick']
  - key: LoadCsv
    tags: ['getLines']
  - key: Highcharts
    tags: ['chart']
  - key: AsyncLoader
    tags: ['loadScriptOnce']
  - key: Window
    tags: ['startVisible', 'ignoreVisibility']
  - key: LegendHtml
    tags: ['preventClick']
  - key: Button
  - key: GroupProperties
    tags: ['viewTitle']
---
The map from [Amazon on focus](https://csr.ufmg.br/amazoniaemfoco/) (in Portuguese) shows where
deforestation and fires happened in the Amazon, split by land category: municipalities, conservation units,
indigenous lands, rural settlements and undesignated public areas. Turn on one of these five layers and
move the cursor over the map: a window shows the area's infraction notices and embargoes (2009 to 2020),
its burned and deforested area, whether fire led to deforestation or the reverse, a column chart of burned
against deforested area per year (2009-2020) and a Sankey diagram of land-use transitions from 2009 to
2019. For municipalities it adds Forest Code figures and a link to the X-ray of the CAR. The window opens on
Manaus; click the map to keep it on one area. The code is query 411.

### How it is built

- **Hover and click on a raster.** Each of the five layers has a `hoverpixel` widget with `runOnHover` and
  `runOnClick`; `onHover` fills the window for the area under the cursor and `onClick` freezes it. See
  [Hoverpixel](/elements/hoverpixel-widget/).
- **Two CSV files per category.** `loadcsv` reads a table of figures and a table of land-use transitions
  for each category; `beforeCalc` turns them into data keyed by area. See [LoadCsv](/elements/loadcsv-widget/).
- **Column and Sankey charts.** Highcharts draws the yearly columns and a `sankey` series; the Sankey module
  is loaded on demand with `AsyncLoader.loadScriptOnce`. See [charts](/elements/charts/).
- **Windows.** A chart window and an introduction window (with the data sources) are `window` widgets
  that open at start. See [Window](/elements/window-widget/).
- **Legends and layer options.** Base and input maps show `legendhtml`, and a hidden `button` anchors each
  layer's options menu. See [LegendHtml](/elements/legend_opacityslider-widget/) and
  [layer panel buttons](/elements/layer-buttons/).
- **Groups.** Four `viewTitle` groups: the five interactive layers, base maps, input maps (rural
  properties, the land categories, deforestation, land use in 2009 and 2019) and a composition map of the
  fire-deforestation relation. See [the layer and group model](/reference/layer-and-group-model/).

### Try this

- With municipalities on, hover from Pará into Mato Grosso and watch the Sankey diagram change.
- Turn on indigenous lands and compare burned and deforested area in two neighbouring lands.
