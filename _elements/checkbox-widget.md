---
layout: element
title: Checkbox
tool_group: inputs
markup_tags: [checkbox]
summary: A switch that runs code when the user turns it on or off.
categories: [Checkbox, LayersFunctions, InputManager]
type: Element
api:
  - key: Checkbox
try:
  - "Turn the switch off: after the countdown, the soils below 50 Mg/ha appear in yellow beside the brown carbon-rich ones."
  - "Turn it back on: only the brown soils above 50 Mg/ha remain."
key_params:
  - name: "handler"
    example: "onToggle"
    does: "Function run on every change as `handler(checkbox, checked)`, with `this` = the layer. Looked up in `functions` first."
  - name: "checked"
    example: "true"
    does: "Starts the switch on. The handler does not run for this starting state."
  - name: "text"
    example: "Only soils above 50 Mg/ha"
    does: "Text shown next to the switch. Change it later with `setBoxLabel`."
  - name: "id"
    example: "only_rich"
    does: "Lets your code find the switch: `Ext.getCmp('only_rich')`."
  - name: "toggle"
    example: "Ext.getCmp('only_rich').toggle(false)"
    does: "Turns the switch on or off from code and runs the handler, as a click would. Without an argument it flips."
---
{% raw %}
### Make the state reach the calculation

A checkbox is not an input: its state never reaches `expression` by itself, and it takes no
position in `inputs`. The example uses the usual three steps:

1. The handler stores the state in an [InputManager](/elements/inputmanager-widget/) with
   `setValues`, which also recalculates the layer.
2. `onInputsReady` calls `setDefaultValues` with the same state as `checked=true`, because the
   handler does not run for the starting state.
3. `expression` reads the stored value by the manager's position: `inputs[0].global.onlyRich`.

### Use it without a calculation

The handler can do anything on the page, for example show or hide another layer of the map:

```javascript
descriptionHtml: "{{checkbox|id=show_states|text=Show state borders|handler=onShowStates}}",
functions: {
  onShowStates: function (checkbox, checked) {
    var states = ExtjsUtils.LAYER.getLayerByName("CSR:estados");
    if (states) states.setVisibility(checked);
  },
},
```

### Change its look

- `labelBefore=true` puts the text before the switch instead of after it.
- `fieldLabel` adds a label at the left of the whole field; `hideLabel=true` removes it.
- `iconCls` replaces the CSS class of the switch icon, to restyle it.
- `Ext.getCmp(id).setBoxLabel("Show details (3)")` changes the text after the map opened.

### Pitfalls

- The handler also runs once with `checked = false` when the layer is removed. Undo there
  whatever turning it on did.
- Write the handler as a regular `function`, not an arrow function, or `this` is not the layer.
- `notify` and `unselect` are accepted for symmetry with the map-picking switches, but do
  nothing on a plain checkbox.
{% endraw %}
