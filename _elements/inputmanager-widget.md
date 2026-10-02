---
layout: element
title: InputManager
tool_group: inputs
markup_tags: [inputmanager]
summary: "A hidden store of named values that buttons and callbacks fill; storing a value recalculates the layer."
categories: [InputManager, LayersFunctions, Highcharts, HTML, QUERY]
featured-img: inputmanager-widget
type: Element
examples:
    - title: Random Value Input
      map-link: lang=eng&map=&queryid=117&extent=-443.628,-16.847,-407.373,3.294&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,capabilities&visiblelayers=custom
      featured-img: inputmanager_random
api:
  - key: InputManager
  - key: Highcharts
  - key: QUERY
    tags: ['runOnceLayerVisible']
  - key: LayersFunctions
    tags: ['beforeCalc', 'expression']
try:
  - "Click Woodland (above 50 t/ha): after the countdown, only the woodland is green and the legend reads Woodland."
  - "Click Open savanna (below 10 t/ha) to go back to the open savanna."
key_params:
  - name: "id"
    example: "preset"
    does: "Required. Names the store: `inputs.id['preset']` on the page; inside expression, `inputs[0].global` (its position among the inputs)."
  - name: "setValues"
    example: "setValues({ min: 50, max: 99999 })"
    does: "Stores the values and recalculates the layer. Pass `true` as second argument to store without recalculating."
  - name: "setDefaultValues"
    example: "setDefaultValues({ min: 0, max: 10 })"
    does: "Fills only keys that are still empty. Never overwrites, never recalculates: call it in onInputsReady."
  - name: "getValue"
    example: "getValue(\"title\")"
    does: "Reads a stored value on the page. A stored 0, false or empty text comes back undefined: read `.global.key` instead."
  - name: "forceRecalc"
    example: "forceRecalc()"
    does: "Recalculates the layer with the values already stored, for example after several silent `setValues` calls."
---
{% raw %}
### Read it in each place

- On the page (`beforeCalc`, `afterCalc`, `onInputsReady`, the `functions`):
  `inputs.id["preset"].getValue("min")` or `inputs.id["preset"].global.min`. In a handler that
  has no `inputs`, use `this.getInputs().id["preset"]`.
- Inside `expression`: `inputs[0].global.min`. The manager arrives as its plain `global` values,
  without methods, at its position among the input widgets. Buttons, checkboxes and labels take
  no position.

### Two buckets: sent and page-only

By default `setValues` writes to `global`, which is sent to `expression`: keep it to numbers,
text, arrays and plain objects. Pass `true` as the third argument to keep a value on the page
only. That bucket may hold anything: an Ext component, a DOM element, a function, a timer, a
[chart](/elements/charts/) you drew.

```javascript
var store = this.getInputs().id["preset"];
store.setValues({ min: 50, max: 99999, title: "Woodland" }, true); // stored, no recalculation
store.setValues({ button: Ext.getCmp("preset_wood") }, true, true); // page only
store.forceRecalc();                                                  // one recalculation
```

`getValue(key)` looks in `global` first, then in the page-only bucket.

### Fill it from anywhere

Any code on the page can write to it: a [Button](/elements/button-widget/) handler, as in the
example; a [Checkbox](/elements/checkbox-widget/) handler; a combobox `onSelect`; a map click
callback. This is how widgets that are not inputs still drive a calculation.

### Pitfalls

- Inside `expression`, `inputs.id` and the methods do not exist. `inputs[0].getValue("min")`
  fails there; read `inputs[0].global.min`.
- `getValue` treats a stored `0`, `false` or `""` as missing. Read `.global.key` when the value
  can be one of those.
- Applying the query again rebuilds the widgets, so the store starts empty. Put starting
  values in `setDefaultValues`.
- After `setValues` the layer waits about 2.5 seconds, showing a countdown button, before it
  recalculates. Set `updateAutomatically: true` on the layer to recalculate right away.
{% endraw %}
