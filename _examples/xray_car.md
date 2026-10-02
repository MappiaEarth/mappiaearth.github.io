---
layout: example
title: X-ray of the CAR - Forest Code balance per property
summary: "Hover over a rural property to read its legal reserve balance, and click it for a full Forest Code report."
categories: [Hoverpixel, PickPoint, Window, LoadCsv, Button, LegendHtml, OpacitySlider]
featured-img: xray_car
type: Example
project: X-ray of the CAR (Brazil's environmental registry)
project-url: http://csr.ufmg.br/radiografia_do_car/
map-link: lang=eng&map=&queryid=195&extent=-78.28067264569455,-18.312036501995436,-40.475718839078915,-1.525800346207267&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,capabilities&visiblelayers=custom
api:
  - key: QUERY
    tags: ['setQueryGlobalProperties']
  - key: Hoverpixel
    tags: ['runOnHover', 'runOnHoverOutside', 'runOnClickOutside']
  - key: PickPoint
    tags: ['getAttributes', 'onefeature', 'markLayerInd']
  - key: Window
    tags: ['btnID', 'startVisible', 'underButtons']
  - key: LoadCsv
    tags: ['getLines', 'getColunsInd']
  - key: Button
    tags: ['enableToggle', 'pressed', 'toggleHandler']
  - key: LegendHtml
    tags: ['filterLayers', 'preventClick', 'reverseLegend']
  - key: OpacitySlider
  - key: LayersProperties
    tags: ['insideOpacity', 'updateAutomatically']
  - key: Request
    tags: ['getParameterByName']
  - key: GroupProperties
    tags: ['viewTitle']
---
The English map of the [X-ray of the CAR](http://csr.ufmg.br/radiografia_do_car/) shows the Forest Code
balance of the private rural properties registered in the CAR, Brazil's Rural Environmental Registry, in
the Amazon and the Cerrado. Move the cursor over a property: a popup gives its legal reserve debt or
surplus, its municipality and its state. Click a property: the "Property report" window lists its area,
legal reserve surplus and debt (2008 and 2018), APP debt and deforestation after 2008 (potentially legal
and potentially illegal), under a heading that classes it as potentially illegal deforestation, potentially
legal deforestation or deforestation-free. This is query 195; query 189 is the Portuguese version, and
query 190 an earlier English variant linked from the methodology page.

### How it is built

- **Hidden helper maps.** The interactive layer reads three maps at once; `insideOpacity: [1, 0.0, 0.0]`
  shows the first and hides the two others, which supply the property's balance and its municipality code
  under the cursor. See [the layer and group model](/reference/layer-and-group-model/).
- **Hover popup.** A `hoverpixel` widget with `runOnHover` calls the layer's `onHover`, which fills the popup
  from those values and from a municipal CSV. See [Hoverpixel](/elements/hoverpixel-widget/).
- **Click report.** A `pickpoint` widget with `onefeature=true` keeps one selected property; `beforeCalc`
  reads its attributes with `getAttributes` and writes the report into a `window` widget. See
  [PickPoint](/elements/pickpoint-widget/) and [Window](/elements/window-widget/).
- **Data files.** Two `loadcsv` widgets load the municipal analysis and a table of state codes. See
  [LoadCsv](/elements/loadcsv-widget/).
- **On/off switch.** A toggle `button` turns click and hover interaction on and off; it and the report
  window are also tied to buttons on the layer row. See [Button](/elements/button-widget/) and
  [layer panel buttons](/elements/layer-buttons/).
- **Legend and opacity.** `legendhtml` (only the first map, reversed) and `opacityslider` sit in the panel.
  See [LegendHtml and OpacitySlider](/elements/legend_opacityslider-widget/).
- **Links that open one layer.** The query reads an extra `option` URL parameter: the methodology page
  links to the map with, for example, `&option=prodes_legal_amazon_2018` so that only that layer starts
  visible.

### Try this

- Zoom into Mato Grosso, hover across several properties, then click one with a legal reserve debt.
- Use the button in the panel to turn the interaction off and pan freely.
