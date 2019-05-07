---
layout: example
title: AMAZONES - Economic Valuation
summary: Realtime analysis given any scenary selected by user showing the forest value.
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
This map shows the economic value of each cell in the Amazon Forest where the user can select the simulation parameters and see the result in real time. In this simulation many products are analysed together like: timber exploitation, biodiversity dinamics, fire costs, Soy cultivation, livestock price, carbon stocks and others, and the result is a good aproximation of the amazon economic service value as explained in the project {{ site.data.urls.AMAZONES }}.
