---
layout: example
title: Panorama of Brazil's Forest Code
summary: "Hover over Brazil, a biome, a state or a municipality to read its forest balance, and click a rural property for its Forest Code report."
categories: [Hoverpixel, LoadCsv, LoadJson, Window, LegendHtml, Button, Request, page decoration]
featured-img: forest_code_panorama
type: Example
project: Panorama of Brazil's Forest Code
project-url: https://csr.ufmg.br/radiografia_do_cf/en/
map-link: lang=eng&map=&queryid=501&extent=-98.30566401220523,-33.70738418730141,-13.93066401220522,6.029730906304815&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,capabilities,mobile&visiblelayers=custom
api:
  - key: QUERY
    tags: ['decorate', 'setQueryGlobalProperties']
  - key: Hoverpixel
    tags: ['runOnHover', 'runOnClick', 'runOnHoverOutside', 'runOnClickOutside']
  - key: LoadCsv
    tags: ['getLines', 'getColunsInd']
  - key: LoadJson
  - key: Window
    tags: ['startVisible', 'ignoreVisibility']
  - key: LegendHtml
    tags: ['preventClick']
  - key: Button
  - key: Request
    tags: ['getParameterByName', 'post']
  - key: GroupProperties
    tags: ['viewTitle']
  - key: LayersFunctions
    tags: ['beforeCalc', 'functions']
---
The map from [Panorama of Brazil's Forest Code](https://csr.ufmg.br/radiografia_do_cf/en/) shows the
forest balance - the level of compliance with the Forest Code - of each private rural property registered
in the CAR (Rural Environmental Registry), and the same figures added up for Brazil, biomes, states and
municipalities. Choose a coverage area in the side panel and move the cursor over the map: a popup shows
the area's figures and its outline. Click, and the report window lists the number of rural properties and
their legal reserve (LR) surplus and deficit, APP deficit and deforestation after 2008. Clicking a single
rural property fetches that property's report. Query 501 serves both the English and the Portuguese site.

### How it is built

- **Hover and click on a raster.** Each coverage layer gets a `hoverpixel` widget whose `runOnHover` and
  `runOnClick` pass the area code under the cursor to the layer's `onHover` (popup) and `onClick` (report)
  functions. See [Hoverpixel](/elements/hoverpixel-widget/).
- **One data pair per coverage level.** A `loadcsv` reads the figures of Brazil, biomes, states or
  municipalities, and a `loadjson` loads the matching GeoJSON so the hovered area's outline can be drawn.
  See [LoadCsv](/elements/loadcsv-widget/) and [LoadJson](/elements/loadjson-widget/).
- **Floating windows.** A report window and an introduction window are `window` widgets that open at
  start. See [Window](/elements/window-widget/).
- **A server request per property.** On the rural-property layer, `onClick` sends the clicked point with
  `ExtjsUtils.REQUEST.post` and writes the answer into the report window.
- **Two languages.** `setQueryGlobalProperties` holds a Portuguese and an English text dictionary; the
  `lang` URL parameter, read with `ExtjsUtils.REQUEST.getParameterByName`, picks the dictionary, the CSV
  folder and the English or Portuguese version of each map.
- **Legends and layer options.** Base and input maps show `legendhtml` (with `preventClick`); a hidden
  `button` anchors each layer's options menu. See [LegendHtml](/elements/legend_opacityslider-widget/),
  [Button](/elements/button-widget/) and [layer panel buttons](/elements/layer-buttons/).
- **Groups and branding.** Four `viewTitle` groups (interactive forest balance, base maps, input maps,
  results), and `ExtjsUtils.QUERY.decorate` adds a footer with the partners' logos. See
  [the layer and group model](/reference/layer-and-group-model/).

### Try this

- Switch the coverage area to states, then hover across the Amazon and the Cerrado.
- Choose rural properties, zoom in and click inside one property.
- Change `lang=eng` to `lang=pt` in the map address to get the Portuguese version.
