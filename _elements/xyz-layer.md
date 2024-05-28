---
layout: element
title: XYZ Layer
summary: Creating a Layer that uses XYZ Tiles as their map.
categories: [XYZ, URL]
featured-img: XYZ-layer-example
type: Element
examples:
    - title: Simple XYZ Layer Example
      map-link: tools=hovershowlegend,layerchooser,helpintro&options=onlyfirstvisible,startopened,hidemetadata,disabledownload,hidestylechooser,overview,capabilities&extent=-443.628,-16.847,-407.373,3.294&visiblelayers=1&zoomlevels=10&queryid=473
      featured-img: XYZ-layer-example
api: 
  - key: LayersProperties
    tags: ['source', 'url']
---
You can define Layers that will load their map based on XYZ-Tiles. For this, you need to define the map 'source' property as 'xyz' and pass its 'url'. You also need to define a unique name for the Layer.

<pre>
  <code>
  // Example of how to load a map with the XYZ source
  // The XYZ source is used to load a map from a URL that contains the z, x and y placeholders
  // The z is the zoom level, x is the longitude and y is the latitude

  [
    {
      title: 'Map rendered by a XYZ source',
      color: '#666699',
      elements: [
        {
          title: 'Base map loaded by XYZ source',
          // The name of the map that will be added. This name must be unique
          name: 'planet:planet',
          source: 'xyz',
          // The url of the map that will be loaded. The $z, $x and $y placeholders will be replaced by the map library
          url: 'https://tiles.planet.com/basemaps/v1/planet-tiles/planet_medres_visual_2021-09_mosaic/gmap/$z/$x/$y.png?api_key=PLAK78456687760442eaa3d3da16aaac5f2d',
          visibility: true,
        },
      ],
    },
  ]
  </code>
</pre>
