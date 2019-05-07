---
layout: example
title: AMAZONES - Biodiversity
summary: Compare deforestation in regions of different relevance.
categories: [LegendHtml, getid, LoadCsv, Slider, RunOnceLayerVisible, changeLayers, Label, Highcharts]
featured-img: amazones_biodiversity-panel
type: Example
map-link: lang=eng&map=&queryid=5&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=-1
api: 
  - key: LegendHtml
  - key: Extjs
    tags: ['getId']
  - key: LoadCsv
  - key: Slider
  - key: ConfigLayer
    tags: ['expression', 'runOnceLayerVisible']
  - key: LayerInternal
    tags: ['changeLayers']
  - key: Label
  - key: Highcharts
---
Shows the biodiversity dynamics and relative importance of each area of the Amazon Forest for the biodiversity conservation, this analysis is part of a bigger project {{ site.data.urls.AMAZONES }}.
