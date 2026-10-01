---
layout: element
title: "Clicking and hovering on features"
tool_group: map
summary: "React when users click or hover features of a vector layer: run your function, restyle the feature, cluster dense points."
categories: [VectorLayer, CustomSelectFeature, FileLayer]
api:
  - key: VectorLayer
    tags: ['onClick', 'onHover', 'onSelectionToggle', 'onClickCfg', 'popupTemplate', 'popupCallback', 'defaultStyle', 'selectStyle', 'hoverStyle', 'hoverSelectedStyle', 'styleMap', 'cluster', 'clusterDistance', 'selectController']
  - key: CustomSelectFeature
    tags: ['click', 'hover', 'multiple', 'selectedStyle', 'hoverStyle', 'selectHoverStyle', 'defaultStyle']
type: Element
try:
  - "Move the pointer over a blue point: it grows and turns orange, and the panel says which point it is."
  - "Click it: the point turns red and the panel shows its name and coordinates."
  - "Click another point: the first one turns blue again and the new one turns red."
key_params:
  - name: "onClick"
    example: "function (feature) { Ext.getCmp(\"clicked_point\").setText(feature.attributes.name); }"
    does: "Runs when the user selects a feature; `feature.attributes` holds its properties and `this` is the layer."
  - name: "defaultStyle"
    example: "{ graphicName: \"circle\", pointRadius: 12, fillColor: \"#2980b9\" }"
    does: "How every feature is drawn: OpenLayers style properties such as `fillColor`, `strokeWidth`, `pointRadius`, `label`."
  - name: "selectStyle"
    example: "{ pointRadius: 15, fillColor: \"#e74c3c\" }"
    does: "Style of the selected feature. Only the properties that change are needed; the rest comes from `defaultStyle`."
  - name: "onHover"
    example: "function (feature, entering) { }"
    does: "Runs when the pointer enters (`entering` true) or leaves (`entering` false) a feature. Also switches on the hover style."
  - name: "hoverStyle"
    example: "{ pointRadius: 15, fillColor: \"#f39c12\" }"
    does: "Style of the feature under the pointer. Shown only when the layer also has `onHover`."
  - name: "clusterDistance"
    example: "40"
    does: "Groups points closer than this many pixels into one symbol; `0` (the default) never clusters."
---
{% raw %}
### Show the attributes

`onClick(feature, source, inputs)` runs when a feature is selected; `feature.attributes` holds
its properties. `popupTemplate` and `popupCallback` are accepted but never read, so no popup
opens. Show what you need from `onClick`, with a notification (`ExtjsUtils.ALERTIFY.log`) or
your own HTML.

### Selection

- Clicking a feature selects it and unselects the previous one; clicking an empty part of the
  map unselects it.
- `onClickCfg: { multiple: true }` keeps several features selected at once;
  `onClickCfg: { toggle: true }` unselects a feature when it is clicked again.
- `onClick` runs only on select. When you also need to know about the unselect, use
  `onSelectionToggle` in its place: the same function runs for both, its fourth argument is
  `"select"` or `"unselect"`, and clicking a selected feature again unselects it.
- From code, `this.selectController` selects for you: `select(feature)`, `unselect(feature)`,
  `unselectAll()`, for example to highlight a feature chosen in a list
  (`this.findFeatureById(id)` finds it).

### Hover

The hover highlight is switched on only when the layer has an `onHover` callback, so a
`hoverStyle` alone never shows. An empty function is enough:

```javascript
onHover: function (feature, state) {
  // state: true when the pointer enters the feature, false when it leaves
},
hoverStyle: { pointRadius: 11, fillColor: "#f39c12" },
```

`hoverSelectedStyle` styles a selected feature under the pointer; it needs both `onClick` and `onHover`.

### Styles from the data

A `${name}` placeholder in a style is replaced by the feature's `name` attribute, so
`label: "${name}"` writes each name on the map. With a `context`, placeholders are taken from
the context instead: functions that receive the feature and return the value.

```javascript
defaultStyle: {
  pointRadius: 8,
  fillColor: "${colorOf}",
  context: {
    colorOf: function (feature) { return feature.attributes.lon < -50 ? "#16a085" : "#2980b9"; }
  }
},
```

### Many points: clusters

With `clusterDistance`, a click on a group passes the cluster itself: `feature.attributes.count`
is the number of points in it and `feature.cluster` the points. To group by an attribute or
change the distance with the zoom, use `cluster` with `distance` and `clusterKey` functions; see
[File source layers](/elements/file-source-layer/).

### Pitfalls

- Write the callbacks as regular `function`s, not arrow functions: `this` is the layer.
- The callbacks belong to `source: "file"` layers (GeoJSON, JSON, CSV, drawn shapes). For maps
  served as images, use [Pickpoint](/elements/pickpoint-widget/) or
  [Hoverpixel](/elements/hoverpixel-widget/).
{% endraw %}
