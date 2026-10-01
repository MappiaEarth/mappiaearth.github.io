---
layout: element
title: "Layer panel buttons"
tool_group: page
summary: "The buttons on each layer and group row: open the query panel, download, metadata, custom buttons, and group callbacks."
categories: [paramsButtonConfigProperties, paramsButtonConfigFunctions, GroupFunctions, LayersProperties]
api:
  - key: paramsButtonConfigProperties
  - key: paramsButtonConfigFunctions
  - key: GroupFunctions
  - key: LayersProperties
    tags: ['hideLegendButton', 'hideStyleChooser', 'hideMetadata', 'showRemoveBtn', 'startLegendOpen']
  - key: ConfigLayer
    tags: ['useLayerTooltip', 'toggleGroup']
type: Element
try:
  - "Rest the mouse on each button of the Geology row: the tooltips set in `paramsButtonConfig` appear."
  - "Click the \"About this map\" button: a window describes the published geology map."
  - "Click \"Show the controls\" to close the panel, and click it again to reopen it."
key_params:
  - name: "type"
    example: "download"
    does: "Which button the entry adds or configures: `query` (the panel), `download`, `metadata`, or `associated` for your own."
  - name: "pressed"
    example: "true"
    does: "On a `query` entry, opens the panel when the map loads, instead of the legend."
  - name: "tooltip"
    example: "Download this map"
    does: "The text shown when the mouse rests on the button."
  - name: "hideButton"
    example: "true"
    does: "Hides the button of a `query` entry."
  - name: "toggleGroup"
    example: "main_panels"
    does: "Buttons that share this name act together: opening one layer's panel closes the others."
  - name: "handler"
    example: "function (button, clickEvent) { ... }"
    does: "Your own code, run when the button is clicked."
---
{% raw %}
### The button types

`paramsButtonConfig` is a list of entries, and each entry's `type` chooses the button. The
`query` entry configures the panel button; list `download` or `metadata` to add those
buttons to the layer's row:

| `type` | Button |
|---|---|
| `query` | Shows or hides the layer's panel, where its `descriptionHtml` and widgets live |
| `download` | Lets the user download the layer's data |
| `metadata` | Opens the published information about the layer's maps |
| `associated` | A row button linked to a button in `descriptionHtml` |

A single object instead of a list counts as one `query` entry, so
`paramsButtonConfig: { pressed: true }` simply opens the panel at start. An entry without a
`type` inside a list is ignored.

### One panel open at a time

Give the `query` entries of several layers the same `toggleGroup`: opening one panel closes
the others. On the layer itself (outside `paramsButtonConfig`), `toggleGroup` means something
else: layers that share it are never visible together.

### Run your own code

`handler(button, clickEvent)` runs on a click; `toggleHandler(button, state)` runs when a
toggle button changes state, with `state` `true` when pressed.

### A row button tied to a panel button

An `associated` entry adds a button to the row that mirrors a toggle button declared in the
panel: pressing one presses the other.

```javascript
descriptionHtml: "{{button|id=pick_btn|text=Pick a point|enableToggle=true}}",
paramsButtonConfig: [
  { type: "query", pressed: true },
  { type: "associated", associatedButtonID: "pick_btn", tooltip: "Pick a point" },
],
```

### Switches on the layer itself

These go directly on the layer, not inside `paramsButtonConfig`: `hideLegendButton` hides the
legend, `hideMetadata` the metadata button, `hideStyleChooser` the style list of a catalogue
layer, `showRemoveBtn` adds a remove button, `startLegendOpen` opens the layer's window at
start, and `useLayerTooltip: false` turns off the layer's tooltip.

### Group rows

A group (a definition with `viewTitle` and `elements`) can react to its own row:
`onClickViewGroup` runs when its title is clicked and `onToggleViewGroup` when it opens or
closes. Both receive the group's row as their first argument, `view`, and `view.expanded`
tells whether the group is open. On a layer that is not inside a `viewTitle` group these
callbacks never run.

### Settings that do nothing

`hideBottomButton` works only inside a `query` entry, not on the layer. A per-layer
`disableDownload` is never read: hide download buttons for the whole page with
`options=disabledownload` in the map's URL (see [map tools](/elements/map-tools/)).
{% endraw %}
