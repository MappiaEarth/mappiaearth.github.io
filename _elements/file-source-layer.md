---
layout: element
title: JSON file source Layer
summary: Creating a Layer with a JSON file as source.
categories: [Source, File, Type, JSON]
featured-img: simple-example-file-source
type: Element
examples:
    - title: Simple File Source Layer Example
      map-link: queryid=480&tools=legend,measure,hovershowlegend,getfeature,customzoom,zoomextent,helpintro&options=capabilities,scale,disabledownload,hidemetadata
      featured-img: simple-example-file-source
api: 
  - key: LayersProperties
    tags: ['source', 'type', 'json']
---
You can use a GeoJSON file as a source for a map in Mappia. For this, you need to set a few properties. First, you need to define the Layer 'source' as 'file'. Then the 'type' property needs to be 'json'. At last, the 'json' property needs to be a string with the file content.