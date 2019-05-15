---
layout: element
title: Button
summary: Create a custom button to use in a query.
categories: [Button, functions, Alertify]
featured-img: button-widget
type: Element
examples:
    - title: Button Example
      map-link: lang=eng&map=&queryid=119&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries&visiblelayers=2
      featured-img: button-widget
api: 
  - key: Button
  - key: ConfigLayer
    tags: ['functions']
  - key: Alertify
    tags: ['log']
    exclude: ['_completeAPI']
---
Simple button class that run a callback function on a button click. Extends the <a target='_blank' href='https://docs.sencha.com/extjs/3.4.0/#!/api/Ext.Button'>Ext.Button from the Extjs version 3.4</a>.

Usage: '\\\{\\\{button\|id=ANY_UNIQUE_ID\|handler={Function}\|toggleHandler={function}\|enableToggle={Boolean}\|args...\\\}\\\}'
