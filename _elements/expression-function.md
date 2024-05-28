---
layout: element
title: Expression
summary: Combobox to select one or multiple values from a list.
categories: [Expression]
featured-img: expression-simple-example
type: Element
examples:
    - title: Simple Expression Example
      map-link: tools=layerchooser,zoomextent,customzoom,getfeature&options=enablequeries,scale,startopened,capabilities&extent=&visiblelayers=1&zoomlevels=10&queryid=469
      featured-img: expression-simple-example
    - title: Simple layerVals Example
      map-link: tools=layerchooser,zoomextent,customzoom,getfeature&options=enablequeries,scale,startopened,capabilities&extent=&visiblelayers=1&zoomlevels=10&queryid=470
      featured-img: layervals-simple-example
api: 
  - key: LayersProperties
    tags: ['expression']
---
This function is only available for Layers that has the 'source' as 'calculated'.

The 'expression()' function is executed for every pixel in the map. In this function, you can filter, combine or handle the map information however you would like. It uses JavaScript syntax and has access to all of its functionalities.

Besides that, the function receives two parameters: 'layerVals' and 'inputs'.

<b>layerVals:</b> Is an array of values of the actual pixels being processed. The values are in the same order as they were defined in the 'name' property.
For example, if the name property is: “name: 'CSR:geologia,CSR:solos'”, the 'layerVals[0]' has the value of the 'CSR:geologia' map and the 'layerVals[1]' has the value of the 'CSR:solos' map.

<b>inputs:</b> Is an array of values of the tools defined in the 'descriptionHtml'. Likewise the 'layerVals', the 'inputs' values are in the same order as the tools were declared at the 'descriptionHtml'. 
For example, if the descriptionHtml has 2 Textfield. the 'inputs[0]' will be the value of the first input and the 'inputs[1]' is the value of the second.

<pre>
  <code>
  [
    {
      title: 'Example of expression function',
      color: '#FFA500',
      elements: [
        {
          title: 'This Layer is the result of the calculation of two maps',
          name: 'CSR:geologia,CSR:altimetria',
          source: 'calculate',
          legendTitle: 'All geologys above 800m',
          visibility: true,
          expression: function(layerVals, inputs) {
            let geologyValue = layerVals[0];
            let altitudeValue = layerVals[1];

            // Hide all values lower than 800
            if (altitudeValue < 800) {
              return undefined;
            }

            return geologyValue;
          },
        },
      ],
    },
  ]
  </code>
</pre>
