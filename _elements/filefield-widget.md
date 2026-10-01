---
layout: element
title: FileField
tool_group: inputs
markup_tags: [filefield]
summary: "Let the user pick a file from their computer and hand it to your code, for example to draw a shapefile on the map."
categories: [FileField, GEOJSON, VectorLayer]
type: Element
api:
  - key: FileField
try:
  - "Click the Shapefile field and pick a .shp file in latitude/longitude (EPSG:4326): its shapes are drawn on the map."
key_params:
  - name: "id"
    example: "loadshp"
    does: "Names the field: `inputs.id['loadshp']()` returns the chosen File, or undefined before the user picks one."
  - name: "eventNames"
    example: "_onChange=onSelectFile"
    does: "Runs a function on a field event: write `_on` plus the event name. `_onChange` fires when the user picks a file."
  - name: "fieldLabel"
    example: "Shapefile (.shp)"
    does: "Label shown at the left of the file picker."
  - name: "ignoreUpdate"
    example: "true"
    does: "Stops a new file from recalculating the layer. Your `_onChange` function still runs."
  - name: "value"
    example: "inputs.id['loadshp']()"
    does: "What the input holds: a function that returns the file, not the file itself. Call it on the page only."
---
{% raw %}
### Read the file

Call the input: `inputs.id["loadshp"]()` in `beforeCalc`, or `this.getInputs().id["loadshp"]()`
in a function of the layer (an `_onChange` callback, a button handler). `this` is the layer in
both. You get the browser's own `File` object, the first one selected, or `undefined`.

### Draw a shapefile

`ExtjsUtils.GEOJSON.shapefile2GeojsonAsync(file, options)` reads the file and adds its shapes
to the layer given as `options.layer`, as in the example. Things to know:

- It reads a bare `.shp` file. It does not open a `.zip`.
- The coordinates must be in EPSG:4326 (latitude/longitude) or EPSG:900913, and `fromProj` says
  which. A `.shp` file does not carry its projection; a wrong `fromProj` puts the shapes in the
  wrong place.
- To keep the attributes, let the user pick the `.dbf` in a second file field and pass that
  file as `dbf`.
- `limitCount` caps how many shapes are read.

### Other kinds of file

For a CSV, a JSON file or an image, read the `File` yourself with the browser's file API in
the callback, for example `file.text().then(function (text) { ... })`. To load a CSV or JSON
from a URL instead, use [LoadCsv](/elements/loadcsv-widget/) or
[LoadJson](/elements/loadjson-widget/).

### Pitfalls

- `inputs.id["loadshp"]` without `()` is the function, not the file.
- The file never reaches `expression`. The field still takes a position in `inputs`, so count
  it when you read other inputs by position there.
- `_on<event>` names ignore case: `_onchange` and `_onChange` are the same. Any event of the
  field works, for example `_onFocus`.
{% endraw %}
