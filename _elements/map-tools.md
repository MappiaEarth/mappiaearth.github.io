---
layout: element
title: "Map toolbar tools and page options"
tool_group: page
summary: "Choose the toolbar buttons (measure, identify, legend under the cursor...) and page options (scale, grid, start open...) through the map's URL."
categories: [URLTools, URLOptions, URLProperties]
api:
  - key: URLTools
  - key: URLOptions
  - key: URLProperties
    tags: ['tools', 'options', 'visiblelayers', 'extent', 'lang']
type: Element
try:
  - "Click the ruler button, then click two points on the map: the distance between them appears."
  - "Turn on the identify button and click a state: the attributes of that state appear."
  - "In your own map's address, set `tools=measure`: of the optional buttons, only the ruler remains."
key_params:
  - name: "measure"
    example: "tools=legend,measure,getfeature"
    does: "Adds the ruler, for measuring distances on the map."
  - name: "getfeature"
    example: "tools=getfeature,zoomextent"
    does: "Adds the identify button: click the map to see the attributes of what is under the click."
  - name: "legend"
    example: "tools=legend,measure"
    does: "Adds the button that opens the legend of the visible layers."
  - name: "scale"
    example: "options=scale,grid,overview"
    does: "Shows a scale bar at the bottom left of the map."
  - name: "startopened"
    example: "options=scale,startopened"
    does: "Opens the layer panel when the map loads, instead of leaving it closed behind its button."
  - name: "capabilities"
    example: "options=scale,capabilities"
    does: "Loads only the maps the query names, for a faster start. Needs a saved query id."
---
{% raw %}
### They live in the address, not in the query

The toolbar and the page options are chosen by the address of the page that shows the map,
so the same query can have a full toolbar in one place and a bare map in another:

```text
https://maps.csr.ufmg.br/calculator/?queryid=YOUR_QUERY_ID&tools=legend,measure,getfeature,zoomextent,customzoom,metadata&options=scale,grid,overview
```

Lists are comma-separated, without spaces.

### Toolbar buttons: `tools=`

| Token | Button |
|---|---|
| `legend` | Opens the legend of the visible layers |
| `zoomextent` | Zooms to the visible layers |
| `customzoom` | Drag a box to zoom into it |
| `getfeature` | Identify: click the map to read the attributes under the click |
| `measure` | Ruler for distances |
| `metadata` | Shows the published description of the visible maps |
| `hovershowlegend` | Shows the legend value under the mouse pointer |
| `helpintro` | A short guided tour of the interface |

Without `tools=` every button is shown. With it, only the listed ones are. The zoom buttons
and a few platform buttons are always there, whatever the list says.

### Page options: `options=`

| Token | Effect |
|---|---|
| `scale` | A scale bar at the bottom left |
| `grid` | Lines of latitude and longitude |
| `overview` | A small overview map at the bottom right |
| `startopened` | The layer panel starts open |
| `hidestylechooser` | Hides the style list of every layer |
| `hidemetadata` | Hides the metadata button of every layer |
| `disabledownload` | Hides the download button of every layer |
| `onlyfirstvisible` | Only the first layer starts visible |
| `capabilities` | Loads only the maps the query names (needs a real `queryid`) |
| `keeponleave` | Controls mouse-wheel zoom when the map is embedded in another page |

### Use a single `options=`

Put every option in one comma-separated `options=` parameter. Repeating `options=` in the
same address froze the page in our tests.

### Other useful parameters

- `visiblelayers=custom` starts each layer as its own `visibility` says; a number `N` starts
  the first `N` layers visible.
- `extent=minX,minY,maxX,maxY` sets the starting view, in longitude and latitude.
- `lang=eng` shows the interface in English (`pt` is the default).

### Tokens that do nothing

Many shared links carry `tools=layerchooser` and `options=enablequeries`. Neither has any
effect: they are harmless in old links, but leave them out of new ones. Options for single
layers - such as hiding one layer's buttons - are layer properties: see
[layer panel buttons](/elements/layer-buttons/).
{% endraw %}
