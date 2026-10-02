---
layout: example
title: FIP Cerrado - Fire monitoring (current map)
summary: "Open the Cerrado or one of eight protected areas to see daily fire-propagation risk, fire history and burned-area charts."
categories: [Timeline, Hoverpixel, LoadCsv, Highcharts, Window, Button, Alertify, GroupFunctions]
featured-img: fip_cerrado_monitoring
type: Example
project: FIP - Cerrado monitoring
project-url: http://csr.ufmg.br/fipcerrado/
map-link: lang=pt&map=&queryid=301&extent=&tools=measure,getfeature&options=scale,startopened,capabilities&visiblelayers=custom
api:
  - key: QUERY
    tags: ['decorate', 'setQueryGlobalProperties']
  - key: Timeline
    tags: ['steps', 'nextStepInterval', 'onPlayToggle']
  - key: Hoverpixel
    tags: ['runOnHover', 'runOnClick']
  - key: LoadCsv
    tags: ['getLines']
  - key: Highcharts
    tags: ['chart']
  - key: Window
    tags: ['onBeforeHide', 'underButtons']
  - key: Button
    tags: ['handler', 'toggleHandler']
  - key: Alertify
    tags: ['log']
  - key: GroupProperties
    tags: ['viewTitle', 'elements']
  - key: GroupFunctions
    tags: ['onToggleViewGroup']
  - key: Request
    tags: ['getParameterByName', 'get']
---
This is the fire-monitoring map now on the [FIP - Cerrado monitoring](http://csr.ufmg.br/fipcerrado/) site
(in Portuguese); the older [Fip Cerrado project](/examples/fip_cerrado_geral/) card shows an earlier map.
The layer panel has one group per area: the whole Cerrado and eight protected areas, from Chapada dos
Veadeiros and Serra da Canastra to Jalapão and the Serra do Rola-Moça state park.
Opening an area zooms to it, closes the others and reports how many fire spots were recorded there. Each
area holds base maps, a Planet basemap, MODIS or Sentinel imagery, its fire history (burned area 2001-2020)
and the products: heat spots, fire-propagation risk, time of the fire front and the propagation risk of the
last 15 days. For the Cerrado, three interactive layers (biome, conservation units, municipalities) chart
the burned area and CO2 emissions of the place under the cursor. The code is query 301.

### How it is built

- **Nested groups built by a function.** One helper builds each area's `viewTitle` group with five
  sub-groups; its `onToggleViewGroup` zooms, closes the other areas and shows the totals. See
  [the layer and group model](/reference/layer-and-group-model/).
- **Timelines.** Land use (2000-2019) and burned area step through yearly styles; the 15-day risk timeline
  builds its steps from the dates of the last 15 days, ending yesterday. See [timeline panel](/elements/timeline-panel/).
- **Hover charts.** On the interactive layers a `hoverpixel` passes the area under the cursor to `onHover`,
  which fills a window from fire and emissions CSV files read with `loadcsv`; a click freezes it. See
  [Hoverpixel](/elements/hoverpixel-widget/) and [LoadCsv](/elements/loadcsv-widget/).
- **Charts in windows.** Highcharts draws burned area and emissions per year, monthly burned area against
  the historical mean, and the total area at risk over the 15 days, in `window` widgets. See
  [charts](/elements/charts/) and [Window](/elements/window-widget/).
- **Downloads.** Hidden `button` widgets serve the KMZ and spreadsheet downloads. See [Button](/elements/button-widget/).
- **Notification and branding.** `ExtjsUtils.ALERTIFY.log` reports the fire spots, and
  `ExtjsUtils.QUERY.decorate` adds a footer with the partners' logos. See [notifications](/elements/notifications/).

### Try this

- Open "PARNA da Chapada dos Veadeiros" and play the 15-day risk timeline in "Produtos".
- In the Cerrado group, hover over a municipality and switch between the monthly and the yearly history.
- Add `&area=canastra` to the map address: the map opens on Serra da Canastra.
