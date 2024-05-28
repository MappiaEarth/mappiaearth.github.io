---
layout: element
title: Textfield
summary: Textfield to input text or number ensuring input validity.
categories: [Textfield, ConfigLayer]
featured-img: textfield-widget
type: Element
examples:
    - title: Simple Textfield Example
      map-link: tools=layerchooser,zoomextent,customzoom,getfeature&options=enablequeries,scale,startopened,capabilities&extent=&visiblelayers=custom&zoomlevels=10&queryid=468
      featured-img: textfield-widget-simple-example
    - title: Text to filter height
      map-link: lang=eng&map=&queryid=112&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=custom
      featured-img: textfield-widget
api: 
    - key: Textfield
    - key: ConfigLayer
      tags: ['hideLegendButton']
---
TextField is a tool that allows editing of a single line of text.

Usage: '\{\{textfield\|value=300\|isnumeric\|fieldLabel=Higth height visible\|id=ANY_UNIQUE_ID\|style=text-align:right;\|labelStyle=text-align:center;\}\}'
