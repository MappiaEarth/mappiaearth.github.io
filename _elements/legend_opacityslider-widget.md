---
layout: element
title: LegendHtml and OpacitySlider
summary: View legend together with the query and change the layer opacity.
categories: [LegendHtml, OpacitySlider, SetQueryGlobalProperties, Group, BeforeCalc]
featured-img: legend_opacityslider-widget
type: Element
examples:
    - title: LegendHTML and OpacitySlider Simple Example
      map-link: lang=eng&map=&queryid=120&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries&visiblelayers=2
      featured-img: legendhtml_example
api: 
    - key: LegendHtml
    - key: OpacitySlider
    - key: QUERY
      tags: ['setQueryGlobalProperties']
    - key: ConfigLayer
      tags: ['beforeCalc', 'Group']
---
LegendHtml and OpacitySlider are by default visible only inside layer description panel, but they can be added to any arbitrary place using the 'legendHtml' and the OpacitySlider. The legendHtml add a representation of the map legends, and the OpacitySlider add a tool to change the map opacity.

Usage legend html: "\\\{\\\{legendHtml\\\}\\\}"
Usage opacity slider: "\\\{\\\{opacityslider\\\}\\\}"
