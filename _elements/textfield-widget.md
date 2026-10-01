---
layout: element
title: Textfield
tool_group: inputs
markup_tags: [textfield]
summary: "A one-line text box whose text feeds the layer's calculation; isnumeric flags anything that is not a number."
categories: [Textfield, ConfigLayer]
featured-img: textfield-widget
type: Element
examples:
    - title: Simple Textfield Example
      map-link: tools=layerchooser,zoomextent,customzoom,getfeature&options=enablequeries,scale,startopened,capabilities&extent=&visiblelayers=custom&zoomlevels=10&queryid=468
      featured-img: textfield-widget-simple-example
    - title: Text to filter height
      map-link: lang=eng&map=&queryid=112&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=custom
      featured-img: textfield-widget
api:
  - key: Textfield
  - key: LayersProperties
    tags: ['hideLegendButton']
try:
  - "Replace 15 with 25: after the countdown, only the slopes steeper than 25 degrees stay orange."
  - "Type abc instead: the field is flagged as not a number."
key_params:
  - name: "id"
    example: "minimum"
    does: "Names the text: read it as `inputs.id['minimum']` in beforeCalc, and by position (`inputs[0]` here) inside expression."
  - name: "value"
    example: "15"
    does: "The starting text. The input always holds a string, so convert it with `parseFloat` before comparing."
  - name: "isnumeric"
    example: "true"
    does: "Marks the field invalid when the text is not a number. It only validates: the value still arrives as text."
  - name: "fieldLabel"
    example: "Min. slope (°)"
    does: "Label shown at the left of the box, about 100 pixels wide: a longer text wraps."
  - name: "style"
    example: "text-align:right;"
    does: "CSS for the box, for example to right-align numbers."
---
{% raw %}
### Convert the text

The value is the text exactly as typed, a string even with `isnumeric`. Convert it where you use
it: `parseFloat(inputs[0])` inside `expression`, or `parseFloat(inputs.id["minimum"]) || 0` in
`beforeCalc` to fall back to 0 when the field is empty.

`isnumeric` does not stop the user from typing letters, and invalid text still reaches the
layer. `parseFloat("abc")` is `NaN`, and every comparison with `NaN` is false. Guard against it:

```javascript
expression: function (layersVals, inputs) {
  var minimum = parseFloat(inputs[0]);
  if (isNaN(minimum)) return this.nullValue;
  return layersVals[0] >= minimum ? 1 : this.nullValue;
},
```

### Typing and recalculation

Every keystroke counts as a change, and the layer recalculates after the usual countdown (about
2.5 seconds, shown on a button). With `updateAutomatically: true` on the layer there is no
countdown and each keystroke starts a new calculation, so leave it off for text boxes.

For work that should run once per edit, use the `afteredit` event: it fires when the field
loses focus with changed text. Attach it from a label placed after the field:

```javascript
descriptionHtml:
  "{{textfield|id=minimum|fieldLabel=Min. slope (°)|value=15|isnumeric=true}}" +
  "{{label|id=minimum_echo|getid=minimum|getid=on_afteredit=Ext.getCmp('minimum_echo').setText('Last value: ' + this.getRawValue())}}",
```

From code, `Ext.getCmp("minimum").on("afteredit", function (field) { ... })` does the same.

### Change the text from code

`Ext.getCmp("minimum").setRawValue("25")` replaces the text, and `getRawValue()` reads it.
Setting the text does not count as a change, so the layer does not recalculate. Add an
[InputManager](/elements/inputmanager-widget/) to the layer and call its `forceRecalc()` after.

### Show only your inputs

`hideLegendButton: true` on the layer hides its generated legend and opacity slider, so the
panel shows only your `descriptionHtml`.

### Pitfalls

- Inside `expression` there is no `inputs.id`; read the text by position.
- Several text fields are `inputs[0]`, `inputs[1]`... in the order they appear in
  `descriptionHtml`. Labels and buttons take no position.
{% endraw %}
