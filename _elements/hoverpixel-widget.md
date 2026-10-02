---
layout: element
title: Hoverpixel
tool_group: map
markup_tags: [hoverpixel]
summary: "Read the value of each map under the cursor as it moves, or where the user clicks, and pass it to your function."
categories: [Hoverpixel, LayersFunctions, TooltipHelper, RawMaps]
featured-img: hoverpixel-widget
type: Element
examples:
    - title: Simple Hoverpixel Example
      map-link: tools=zoomextent,getfeature&options=scale,startopened,capabilities&extent=&visiblelayers=custom&zoomlevels=10&queryid=467
      featured-img: hoverpixel-widget-simple-example
    - title: Hoverpixel - View pixel value on Hovering
      map-link: lang=eng&map=&queryid=118&extent=-443.628,-16.847,-407.373,3.294&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,capabilities&visiblelayers=custom
      featured-img: hoverpixel_hovering
    - title: Total burned area (ha)
      map-link: lang=eng&map=&queryid=101&extent=-443.628,-16.847,-407.373,3.294&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,capabilities&visiblelayers=custom
      featured-img: hoverpixel_total_burned_area
api:
  - key: Hoverpixel
  - key: TooltipHelper
  - key: RawMaps
  - key: LayersFunctions
    tags: ['functions']
try:
  - "Move the cursor over the map: a notification shows the elevation in metres and the position in degrees."
  - "Turn off \"Show the elevation under the cursor\" in the layer panel to stop the readings."
key_params:
  - name: "runOnHover"
    example: "onHover"
    does: "Name of a function in `functions`, called on every mouse move with `(layerVals, inputs, coordinates, event, lastInfo)`; `this` is the layer."
  - name: "runOnClick"
    example: "onMapClick"
    does: "The same, but called only when the user clicks the map."
  - name: "checked"
    example: "true"
    does: "Start with the tool switched on. By default the user switches it on in the layer panel."
  - name: "runOnHoverOutside"
    example: "true"
    does: "Also call `runOnHover` where the map has no data; `layerVals` is then `null`. `runOnClickOutside` does the same for clicks."
  - name: "text"
    example: "Show the elevation under the cursor"
    does: "Label of the switch in the layer panel."
  - name: "id"
    example: "elevation_hover"
    does: "Names the tool: `inputs.id[\"elevation_hover\"]` holds the last click and hover positions, in degrees."
---
{% raw %}
### What the callback receives

- `layerVals`: one value per map in `name`, in the same order. When the layer has an
  `expression`, one more entry at the end holds its result for that pixel.
- `inputs`: the layer's widget values; `inputs.id[ID]` works here.
- `coordinates`: the position in the map's projection (metres), despite its `lat`/`lon`
  names. For degrees use
  `coordinates.clone().transform(ExtjsUtils.JS.getMap().getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))`,
  as the example does.
- `event`: the mouse event.
- `lastInfo`: `{click, hover}`, the previous click and hover as `{lon, lat}` in degrees. The
  current position is stored only after your callback returns, so use `coordinates` for it.

### Show the value in the panel instead of notifications

A notification on every mouse move gets noisy. Put an element in `descriptionHtml` and write into it:

```javascript
descriptionHtml: "{{hoverpixel|id=elevation_hover|checked=true|runOnHover=onHover}}" +
  "<p>Elevation: <b id='elevation_value'>-</b></p>",
functions: {
  onHover: function (layerVals) {
    var target = document.getElementById("elevation_value");
    if (target) target.innerHTML = Math.round(layerVals[0]) + " m";
  },
},
```

### What the values are

The tool reads the colour each map draws under the cursor and turns it into a value through
the map's legend. On a classified map you get the value of the class: a range such as
"10 - 20" gives its middle, 15, and a text class stays text. For the original cell values,
read a map published as a raw map with an `operation` such as `raw` (see
[the property catalogue](/reference/property-catalogue/)).

### Recalculating the layer

Moving or clicking never recalculates the layer. `inputs.id[ID]` is always current, but nothing
runs `beforeCalc` again. React inside `runOnHover` / `runOnClick`, which already receive the
values, or trigger a recalculation yourself, for example with `forceRecalc()` on an
[InputManager](/elements/inputmanager-widget/).

### Pitfalls

- Outside the map's data the callbacks are not called, unless you set `runOnHoverOutside` /
  `runOnClickOutside`; then `layerVals` is `null`, so check it first.
- The tool reads the maps of its own layer, a `source: "calculate"` layer as in the example. It
  pauses while the layer is hidden and resumes in the same state when it is shown again.
- `unselect` only changes the message shown when the tool is switched on; the tool never
  switches itself off after a click.
- Write callbacks as regular `function`s, not arrow functions: `this` is the layer.
{% endraw %}
