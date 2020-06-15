---
layout: example
title: Economic valuation
summary: Real-time display of ecosystem services values given a combination of inputs and weights.
categories: [Slider, Label, Textfield, isNumeric, visibleLayers, priority, LegendTitle, Title]
featured-img: amazones-panel
type: Example
map-link: lang=eng&map=&queryid=19&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=-1
api: 
  - key: Slider
  - key: Label
  - key: Textfield
  - key: ConfigUrl
    tags: ['visibleLayers']
  - key: ConfigLayer
    tags: ['priority', 'LegendTitle', 'Title']
---
This map shows the economic value for each cell in the Amazon Forest. User can select different parameters and see results in real-time. In this simulation many products are analysed together including timber harvesting, biodiversity, costs of fire, losses on soy cultivation, livestock, carbon stocks and others due to deforestation, as a means to value the ecosystem services provided by the Amazon forests as explained in the project {{ site.data.urls.AMAZONES }}.
