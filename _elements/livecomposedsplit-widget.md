---
layout: element
title: "LiveComposedSplit (split view)"
tool_group: results
markup_tags: [livecomposedsplit]
summary: "Compare two styles of the same map side by side, with a divider the user drags across the map - the Compare button."
categories: [LiveComposedSplit, LayersProperties, LayerInternal]
type: Element
api:
  - key: LiveComposedSplit
try:
  - "Press Compare months, then drag the divider: January on the left, August on the right."
  - "While comparing, pick November in the Right list: the right side of the map switches to November."
  - "Press the swap button (⇄): the two months change sides and the divider stays where it is."
key_params:
  - name: "layerNames"
    example: "precip_monthly_average_1,precip_monthly_average_4,precip_monthly_average_8,precip_monthly_average_11"
    does: "Styles offered on each side, matched by position with `displayNames`."
  - name: "displayNames"
    example: "January,April,August,November"
    does: "Labels shown in the Left and Right lists. Same count and order as `layerNames`."
  - name: "leftDefault"
    example: "January"
    does: "Starting choice on the left. Must be one of `displayNames`."
  - name: "rightDefault"
    example: "August"
    does: "Starting choice on the right. Must be one of `displayNames` and differ from `leftDefault`."
  - name: "baseName"
    example: "CSR:precip_monthly_average"
    does: "The map both sides show. Defaults to the layer's own map."
  - name: "text"
    example: "Compare months"
    does: "Label of the Compare button. While comparing, the button reads Close comparison."
---
{% raw %}
### How it works

The tag needs a **composed layer**: a `source: "calculate"` layer whose `name` lists the same
map twice, with one entry in `styles` for each copy. Before Compare is pressed, only the Left
list is active and the whole map shows the left choice. When the user presses Compare, the
left copy takes the left style, the right copy takes the right style, and each copy is clipped
to its side of the divider. Pressing the button again, or hiding the layer, goes back to a
single style.

Open the layer's panel with `paramsButtonConfig: [{ type: "query", pressed: true }]`,
otherwise users do not see the button.

### More options

| Parameter | Use |
|---|---|
| `id` | Id of the Compare button. The panel around it is `id + "_container"`. |
| `layout` | `compact` (default, stacked to fit the layer card) or `inline` (one row). |
| `composedLayerName` | The layer to split. Without it, the first calculated layer on the map is used, so set it when your map has several. |
| `cls` | Extra CSS class for the Compare button. |

### Control it from code

The methods belong to the **panel**, `Ext.getCmp(id + "_container")`, not to the button:

```javascript
var split = Ext.getCmp("example_split_container");
if (split.isComparisonActive()) {
  split.swapSides();                        // exchange left and right
}
split.setComparisonEditingEnabled(false);   // lock the Right list and swap while data loads
split.refreshActiveSplit();                 // after your own changeLayers on the layer
```

`destroySplitControl()` removes the divider for good. It comes back the next time Compare is
pressed.

### Pitfalls

- `displayNames` and `layerNames` must have the same number of items, in the same order.
- Every name in `layerNames` must be a style the map is published with.
- While comparing, the two sides cannot show the same choice.
- Both sides show `baseName` with different styles. The tool does not compare two different
  maps.
{% endraw %}
