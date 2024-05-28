---
layout: element
title: Range Slider
summary: Create a slider that has a maximum and a minimum values.
categories: [Slider]
featured-img: ranged-slider-widget
type: Element
examples:
    - title: Range Slider Example
      map-link: options=idemetadata,disabledownload,hidestylechooser,overview,capabilities&extent=-443.628,-16.847,-407.373,3.294&visiblelayers=custom&zoomlevels=10&queryid=464
      featured-img: ranged-slider-widget
api: 
  - key: Slider
---
The Range Slider is a variation of the Slider Tool that has a minimum and maximum values and the user can change this interval with the 'drag' controls.

The Range Slider uses the same tag as the Slider, but needs the 'values' attribute defined to be set as the Range type.

Usage: '\\\{\\\{slider\|id=SLIDER_ID\|increment=step\|values=[min_value, max_value]\|args...\\\}\\\}'
