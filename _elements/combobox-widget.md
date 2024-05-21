---
layout: element
title: Combobox
summary: Combobox to select one or multiple values from a list.
categories: [Combobox, Opacity, LegendHtml]
featured-img: combobox-widget
type: Element
examples:
    - title: Simple Combobox Example
      map-link: tools=layerchooser,zoomextent,customzoom,getfeature&options=enablequeries,scale,startopened,capabilities&extent=&visiblelayers=1&zoomlevels=10&queryid=466
      featured-img: combobox-widget-simple-example
    - title: Filter Style
      map-link: lang=eng&map=&queryid=115&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=10
      featured-img: combobox-widget
api: 
  - key: Combobox
  - key: LegendHtml
  - key: ConfigLayer
    tags: ['opacity']
---
A component that combines a button or editable field and a drop-down list. The user can select a value from the drop-down list, which appears at the user's request. If you make the combo box editable, then the combo box includes an editable field into which the user can type a value.

Usage: "\{\{combobox\|id=ANY_UNIQUE_ID\|data={Array}\}\}"
