---
layout: element
title: Slider and Label
summary: Using a scroll bar to switch between multiple values.
categories: [Slider, Label]
featured-img: slider-widget
type: Element
examples:
    - title: Losses of biodiversity filter
      map-link: lang=eng&map=&queryid=111&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries&visiblelayers=custom
      featured-img: slider_losses_filter
api: 
    - key: Slider
    - key: Label
---
The Slider Control is used to display a continuous or discrete range of valid numeric choices and allows the user to interact with the control. It is typically represented visually as having a "track" and a "knob" or "thumb" which is dragged within the track.

Usage: \\\{\\\{slider\|plugins=tip=Filter {0}% of total cells\|width=200px\|id=ANY_UNIQUE_ID\|value=20\|increment=5\|keyincrement=5\|minValue=0\|maxValue=100\\\}\\\}
