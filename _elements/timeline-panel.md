---
layout: element
title: Timeline Panel
tool_group: results
markup_tags: [timeline]
summary: "Play a map through time: a panel at the bottom of the map steps through one style per year, period or scenario."
categories: [Timeline]
featured-img: timeline-panel
type: Element
examples:
    - title: Simple Timeline Example
      map-link: tools=zoomextent,getfeature&options=scale,startopened,capabilities&extent=&visiblelayers=custom&zoomlevels=10&queryid=465
      featured-img: timeline-panel
api:
    - key: Timeline
try:
  - "Press play in the panel at the bottom of the map: land use steps through 1992, 2000, 2008 and 2015."
  - "Drag the slider's main handle to 2008: the map switches to the 2008 land use."
  - "Press Hide timeline in the layer panel: the bottom panel goes away. Press it again to bring it back."
key_params:
  - name: "steps"
    example: "[[1992, \"land_use_1992_2015_1\"], [2000, \"land_use_1992_2015_9\"], [2015, \"land_use_1992_2015_24\"]]"
    does: "One `[key, \"style_name\"]` pair per step. The key labels the step; the style is what the map shows."
  - name: "nextStepInterval"
    example: "1500"
    does: "Milliseconds each step stays on screen while playing, counted after its map has loaded. Default 2100."
  - name: "id"
    example: "land_use_years"
    does: "Names the current step for your code, `inputs.id[\"land_use_years\"]`, and the timeline button, `Ext.getCmp(\"land_use_years\")`."
  - name: "preloadTiles"
    example: "true"
    does: "Loads the tiles of the next steps in advance, for smoother playback."
  - name: "renderHidden"
    example: "true"
    does: "Starts with the bottom panel hidden. Users open it with the timeline button in the layer panel."
  - name: "onPlayToggle"
    example: "onPlay"
    does: "Function called before play or stop starts. It must return a truthy value; a falsy one cancels the click."
---
{% raw %}
### What you get

The tag renders a Show/Hide timeline button in the layer panel. The timeline itself is a panel
at the bottom of the map, with a play button and a slider that has one stop per step. The
panel only shows while its layer is visible. The map covers whatever area its maps cover: the
example only shows Mozambique because that is where its land-use maps exist.

### Use the current step in your code

`inputs.id[ID]` holds the key of the current step, **as text** (`"1992"`, not `1992`). Every
step triggers a recalculation of the layer, after the step's style is applied, so `beforeCalc`
sees each new value:

```javascript
beforeCalc: function (inputs) {
  var year = parseInt(inputs.id["land_use_years"], 10);   // "1992" -> 1992
  ExtjsUtils.ALERTIFY.log("Showing " + year);
},
```

Inside `expression`, read the step by position (`inputs[0]` for the first input widget) and
convert it too.

### Switch maps, not only styles

A step can also change the map itself: give `{style, name}` instead of the style name, as in
`[["2010", {style: "s2010", name: "CSR:my_map_2010"}]]`.

### Control it from code

`Ext.getCmp(id)` is the button; `getTimeline()` gives you the panel:

```javascript
var timeline = Ext.getCmp("land_use_years").getTimeline();
timeline.updateMainThumbValue(2);                 // jump to the third step
if (!timeline.playing) timeline.startAnimationStep();
timeline.stopAnimation();
timeline.setSteps({ 2000: "land_use_1992_2015_9", 2015: "land_use_1992_2015_24" });
```

`getValue()` returns the current key, `nextAnimationStep()` advances one step, and
`setDesiredVisibility(false)` hides the panel.

### Pitfalls

- Each style in `steps` must be one the map is published with: the map name without its
  namespace, plus `_` and an index (`land_use_1992_2015_9`).
- Steps are stored by key. A repeated key keeps only its last style, and whole-number keys
  always play in ascending order.
- `onPlayToggle` must return a truthy value. A function that returns nothing cancels play.
- `showTimelineButton` and `timelineConfig` written on the layer do nothing. Configure the
  timeline with the tag's own parameters.
{% endraw %}
