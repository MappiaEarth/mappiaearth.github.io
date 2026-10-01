---
layout: element
title: Combobox
tool_group: inputs
markup_tags: [combobox]
summary: "A drop-down list: the user picks one value and the layer recalculates with it."
categories: [Combobox, OpacitySlider, LegendHtml]
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
  - key: LayersProperties
    tags: ['opacity']
try:
  - "Open the list and pick 300: after the countdown, only the forest above 300 t/ha of biomass stays teal."
  - "Pick 100: lighter forest joins in, and the legend reads Above 100 t/ha."
key_params:
  - name: "data"
    example: "[[\"200\"],[\"100\"],[\"300\"]]"
    does: "The entries, each a one-element array. The text shown is the value stored; a second element is ignored."
  - name: "id"
    example: "level"
    does: "Names the choice: read it as `inputs.id['level']` in beforeCalc, and by position (`inputs[0]` here) inside expression."
  - name: "fieldLabel"
    example: "Above (t/ha)"
    does: "Label shown at the left of the list."
  - name: "editable"
    example: "true"
    does: "Lets the user type to jump to an entry. Only values in the list are accepted (default false)."
  - name: "width"
    example: "160"
    does: "Width of the list in pixels (default 190). The layer panel is about 300 pixels wide, label included."
  - name: "onSelect"
    example: "onLevelPicked"
    does: "A function in the layer's `functions`, run on each pick with `(combo, record, index)`. The layer recalculates anyway."
---
{% raw %}
### Values are text

The value is the selected entry as a string, `"300"`, so convert it with `parseFloat` before
comparing numbers. The first entry is selected when the map opens: put the default first. The
list picks one value; there is no multiple selection.

### Show names, compute with numbers

Because the text shown is the value stored, list readable names and translate them inside
`expression`. A literal written inside the function is fine there:

```javascript
descriptionHtml:
  '{{combobox|id=forest|fieldLabel=Forest|editable=false|data=[["Sparse"],["Dense"]]}}',
expression: function (layersVals, inputs) {
  var limits = { Sparse: [0, 150], Dense: [250, 99999] }; // t/ha
  var range = limits[inputs[0]];
  return layersVals[0] >= range[0] && layersVals[0] <= range[1] ? 1 : this.nullValue;
},
```

### Run code when the user picks

`onSelect` names a function in the layer's `functions`. It runs on every pick with
`(combo, record, index)` and `this` = the layer; `record.get("value")` is the chosen text. Use it
for side effects, for example swapping the map the layer reads when the list holds map names:

```javascript
functions: {
  onRegionSelected: function (combo, record, index) {
    this.changeLayers({ name: "CSR:" + record.get("value"), index: 0 });
  },
},
```

### Select from code

`Ext.getCmp("level").getValue()` reads the selection and `Ext.getCmp("level").setValue("300")`
changes it. Setting it from code does not count as a pick, so the layer does not recalculate:
add an [InputManager](/elements/inputmanager-widget/) and call its `forceRecalc()` after.

### Add the legend and the opacity

`{{legendhtml}}` puts the map legend in the panel, next to the list, and the layer's
`opacity` (0 to 1) sets how transparent it starts. See
[Legend and opacity slider](/elements/legend_opacityslider-widget/).

### Pitfalls

- `data=[["01", "January"]]` shows and stores `01`: the second element is ignored.
- `onSelect` is looked up only in the layer's `functions`, never among global functions.
- Inside `expression` there is no `inputs.id`; read the choice by position. Legend colours in
  `setCalculateLegend` are `[R, G, B]` arrays.
{% endraw %}
