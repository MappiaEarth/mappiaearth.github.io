---
layout: element
title: Pickpoint
tool_group: map
markup_tags: [pickpoint]
summary: "Click the map to pick a point and get what every map of the layer holds there, for notifications, charts or the calculation."
categories: [PickPoint, Highcharts]
featured-img: pickpoint-widget
type: Element
examples:
    - title: PickPoint from map to analyse
      map-link: lang=eng&map=&queryid=116&extent=-443.628,-16.847,-407.373,3.294&tools=helpintro,layerchooser,zoomextent,customzoom,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,enablequeries,capabilities&visiblelayers=custom
      featured-img: pickpoint-widget
api: 
    - key: PickPoint
    - key: Highcharts
try:
  - "Click a state on the map: its first four attributes appear in a notification."
  - "The switch turns off after the click; turn \"Click a state on the map\" on again to pick another state."
key_params:
  - name: "onMark"
    example: "onPicked"
    does: "Name of a function in `functions`, called after each click with `evt.features[mapIndex]`: what each map holds at that point."
  - name: "onefeature"
    example: "true"
    does: "Keep only the last picked point. Without it, each click adds to the selection and clicking a picked feature again removes it."
  - name: "unselect"
    example: "false"
    does: "By default the tool switches itself off after each click; `unselect=false` keeps it on for several clicks."
  - name: "checked"
    example: "true"
    does: "Start with the tool switched on, so the first click on the map already picks."
  - name: "id"
    example: "pick_state"
    does: "Names the tool: `inputs.id[\"pick_state\"]` holds the selection; read it with `getAttributes(mapIndex)` in `beforeCalc`."
  - name: "label"
    example: "Region ${Name}"
    does: "Text drawn on the map next to each picked feature; `${attribute}` is replaced by that feature's value."
---
{% raw %}
### Read what was picked

`onMark` receives one object per click:

- `evt.type` is `"add"` when the click picked something and `"remove"` when it unpicked it.
- `evt.features[i]` is what map `i` of `name` returned at that point: an array whose first
  entry has the attributes in `.data`. It is empty on a removal.

Inside `onMark`, `this` is the tool, so `this.value.getAttributes(i)` lists the attributes of
every picked point on map `i`, in click order (`{}` where the click hit nothing on that map).
`runOnClick` is an alias of `onMark`; when you write both, `onMark` wins.

### Use the selection in the calculation

The layer recalculates after every click, once every map has answered, so `beforeCalc` always
sees the current selection:

```javascript
beforeCalc: function (inputs) {
  var picked = inputs.id["pick_state"].getAttributes(0); // one object per picked point
  var names = picked.map(function (attrs) { return attrs.name; }); // an attribute of your map
  // use the plain values here, e.g. to swap a map with this.changeLayers(...)
}
```

Turn the selection into plain values in `beforeCalc`. Never hand the tool's value itself to
`expression`: it holds map features, and `expression` runs in a worker that only receives plain
data (see [the execution model](/reference/execution-model/)).

### Change what the tool draws

- `geometryColor=#FF00FF` colours the picked geometry; without it each click gets a random colour.
- `markLayerInd=1` chooses which map of `name` has its clicked geometry drawn.
- `pointVisibility=false` hides the marker at the clicked point; `lat=-15.8|lon=-47.9` places
  it before the first click.
- `text=...` is the label of the switch. Without it, the switch shows the coordinates of the last click.
- `notify=false` hides the "click on the map" notification shown when the tool is switched on.

### Control it from code

- `Ext.getCmp("pick_state").toggle(true)` switches the tool on, `false` off; no argument inverts it.
- `inputs.id["pick_state"].removeAll()` clears the selection, for example from a
  `{{button}}` handler (there `this` is the layer: `this.getInputs().id["pick_state"]`).
  `removeAttribute(index)` removes one picked point.
- `getPointPos()` gives `[lon, lat]` of the last click, in degrees.
- `searchAttribute(mapIndex, "code", "3106200")` returns the attributes of a picked feature
  whose attribute matches, or `null`.

### Charts from picked values

Highcharts is loaded on the map pages. Put a container such as
`<div id="pick_chart" style="height:220px"></div>` in `descriptionHtml` and draw or update the
chart from `onMark`. The pattern is on the [Charts](/elements/charts/) page.

### Pitfalls

- The tool asks the map server what lies under the click, so `onMark` runs a moment after the
  click, once every map in `name` has answered.
- The tool lives on a `source: "calculate"` layer, as in the example, and queries every map in `name`.
- Write callbacks as regular `function`s, not arrow functions: the tool sets `this` for them.
{% endraw %}
