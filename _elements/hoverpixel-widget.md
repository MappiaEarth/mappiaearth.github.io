---
layout: element
title: Hoverpixel
summary: Hover inspection of map cell values.
categories: [Hoverpixel, Functions, TooltipHelper, RawMap, GetCmp]
featured-img: hoverpixel-widget
type: Element
examples:
    - title: Simple Hoverpixel Example
      map-link: tools=layerchooser,zoomextent,customzoom,getfeature&options=enablequeries,scale,startopened,capabilities&extent=&visiblelayers=custom&zoomlevels=10&queryid=467
      featured-img: hoverpixel-widget-simple-example
    - title: Hoverpixel - View pixel value on Hovering
      map-link: lang=eng&map=&queryid=118&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=custom
      featured-img: hoverpixel_hovering
    - title: Total burned area (ha)
      map-link: lang=eng&map=&queryid=101&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=custom
      featured-img: hoverpixel_total_burned_area
api: 
  - key: Hoverpixel
  - key: ConfigLayer
    tags: ['functions']
  - key: TooltipHelper
  - key: Extjs
    tags: ['getCmp']
  - key: RawMaps
---
A component that combines a button or editable field and a drop-down list. The user can select a value from the drop-down list, which appears at the user's request. If you make the combo box editable, then the combo box includes an editable field into which the user can type a value.

Usage: "\\\{\\\{hoverpixel\|id=ANY_UNIQUE_ID\|runOnClick={Function}\|runOnHover={Function}\|args\\\}\\\}"

