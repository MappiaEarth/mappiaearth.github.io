---
layout: example
title: BrasilPec - Beef cattle intensification scenarios
summary: "Play scenario maps of pasture, pasture reform, herd, stocking rate, feedlots and profit margin year by year up to 2030."
categories: [Timeline, InputManager, LayerInternal, changeLayers, setCalculateLegend, beforeCalc]
featured-img: brasilpec_cattle
type: Example
project: Scenarios for the intensification of beef cattle in Brazil
project-url: http://csr.ufmg.br/brasilpec/
map-link: lang=pt&map=&queryid=144&extent=&tools=zoomextent,hovershowlegend&options=scale,startopened,hidestylechooser,capabilities&visiblelayers=custom
api:
  - key: Timeline
    tags: ['steps', 'nextStepInterval']
  - key: InputManager
    tags: ['getValue', 'setValues']
  - key: LayerInternal
    tags: ['changeLayers', 'setCalculateLegend']
  - key: LayersFunctions
    tags: ['beforeCalc']
  - key: LayersProperties
    tags: ['styles', 'updateAutomatically']
  - key: QUERY
    tags: ['setQueryGlobalProperties']
---
The map from [Scenarios for the intensification of beef cattle in Brazil](http://csr.ufmg.br/brasilpec/)
(in Portuguese) projects Brazilian cattle ranching year by year up to 2030. Six groups - Pastagem
(pasture), Reforma de Pasto (pasture reform), Rebanho (herd), Taxa de Lotação (stocking rate),
Confinamento (feedlots) and Margem de Lucro (profit margin) - hold one layer per scenario: baseline and
intensificação for pasture, and base, mixpast, mixsup and mixsup2 for the others. Each of the 22 scenario
layers has its own timeline: press play, or drag it, to step from 2012 (2013 for pasture reform) to 2030,
one year per second. Query 144 shows how to animate many yearly maps without loading them all at once.

### How it is built

- **One timeline per layer.** Each layer's panel holds a `timeline` whose steps are the years, with
  `nextStepInterval=1000`; the layer row's button is tied to it. See [timeline panel](/elements/timeline-panel/)
  and [layer panel buttons](/elements/layer-buttons/).
- **A few years loaded at a time.** Each year is a style of the scenario map. The layer lists the map five
  times with five styles; when the timeline leaves the years currently loaded, `beforeCalc` calls
  `changeLayers` to load the next ones, then shows only the selected year. See
  [the execution model](/reference/execution-model/).
- **Remembering state between rounds.** An `inputmanager` widget stores the last block of years, so
  `changeLayers` runs only when the block changes. See [InputManager](/elements/inputmanager-widget/).
- **Fixed legend classes.** The feedlot layers call `setCalculateLegend` with eight classes, from 0 up to
  150,000-360,000 (150,000-380,000 for mixsup2). See [LegendHtml](/elements/legend_opacityslider-widget/).
- **Shared helpers.** `setQueryGlobalProperties` defines the year bookkeeping (`MapManager`,
  `showOnlyOneLayer`) used by all 22 layers.
- **Groups.** Each group is an array whose first item gives its `title` and `color`. See
  [the layer and group model](/reference/layer-and-group-model/).

### Try this

- Open Confinamento, turn on two scenarios and play both timelines.
- Drag the pasture timeline straight from 2012 to 2030 and watch the map reload.
