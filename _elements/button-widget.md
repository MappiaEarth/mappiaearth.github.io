---
layout: element
title: Button
tool_group: inputs
markup_tags: [button]
summary: "A button that runs one of your functions when clicked, or switches on and off as a toggle."
categories: [Button, LayersFunctions, Alertify]
featured-img: button-widget
type: Element
examples:
    - title: Button Example
      map-link: lang=eng&map=&queryid=119&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=2
      featured-img: button-widget
    - title: Simple Toggle Button Example
      map-link: tools=layerchooser,zoomextent,customzoom,getfeature&options=enablequeries,scale,startopened,capabilities&extent=&visiblelayers=1&zoomlevels=10&queryid=471
      featured-img: toggle-button-simple-example
api:
  - key: Button
  - key: Alertify
    tags: ['log']
    exclude: ['_completeAPI']
  - key: LayersFunctions
    tags: ['functions']
try:
  - "Click Show a message: a notification appears with the layer's name in bold."
key_params:
  - name: "handler"
    example: "sayHello"
    does: "Function run on each click, with `this` = the layer. Looked up in `functions`, then among globals, then run as inline code."
  - name: "text"
    example: "Show a message"
    does: "The caption on the button."
  - name: "id"
    example: "say_hello"
    does: "Lets your code find the button: `Ext.getCmp('say_hello')` to hide, disable or relabel it."
  - name: "enableToggle"
    example: "true"
    does: "Makes a toggle button that stays pressed until clicked again; `toggleHandler` then runs on each change."
  - name: "toggleHandler"
    example: "onDetails"
    does: "Function run as `(button, pressed)` each time a toggle button changes state."
  - name: "pressed"
    example: "true"
    does: "Starts a toggle button pressed."
---
{% raw %}
### Toggle buttons

With `enableToggle=true` the button stays pressed until clicked again, and `toggleHandler`
receives the new state. If you give only `handler`, it is used as the toggle handler.

```javascript
descriptionHtml:
  "{{button|id=details|text=Details|enableToggle=true|pressed=true|toggleHandler=onDetails}}",
functions: {
  onDetails: function (button, pressed) {
    ExtjsUtils.ALERTIFY.log(pressed ? "Details on" : "Details off");
  },
},
```

### Change the calculation from a button

A button is not an input: a click does not recalculate the layer. To drive the calculation,
store a value in an [InputManager](/elements/inputmanager-widget/) from the handler;
`setValues` recalculates. To rerun the layer with the current inputs, call
`this.generateNewLegend()`. `this.getInputs()` reads the other widgets of the layer.

### Look and behaviour

Every other Ext JS 3.4 button option written in the markup is passed through, for example
`iconCls`, `tooltip`, `cls`, `width`, `disabled` or `scale`. See the
[Ext.Button options](https://docs.sencha.com/extjs/3.4.0/#!/api/Ext.Button). `hidden=true`
creates it hidden; show it later with `Ext.getCmp(id).show()`.

### Notifications

`ExtjsUtils.ALERTIFY.log(message, config)` shows a short HTML message. Useful `config` keys:
`delay` (milliseconds on screen), `force: true` (show it even when the user turned
notifications off) and `func` (run when the message is clicked). Messages sent before the
layers finish loading are held back, and only the last one is shown. See
[Notifications](/elements/notifications/).

### Pitfalls

- Write handlers as regular `function`s, not arrow functions, or `this` is not the layer.
- A handler name that matches no function is run as code. A typo is not reported when the map
  opens; it fails on the first click.
- Keep code in `functions`, not inline in the markup: `|` and `=` have a meaning in the markup
  and break inline code.
{% endraw %}
