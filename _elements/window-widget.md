---
layout: element
title: Window
tool_group: results
markup_tags: [window]
summary: "A floating window with a button that opens and closes it."
categories: [Window, HTML, LayersFunctions]
type: Element
api:
  - key: Window
try:
  - "The About this map window opens with the map. Drag its title bar, or resize it from a corner."
  - "Press About this map in the layer panel: the window closes. Press it again to reopen it."
  - "Hide the States layer: the window closes too, and comes back when you show the layer again."
key_params:
  - name: "html"
    example: "<p style='padding:10px'>Brazilian states.</p>"
    does: "Starting content of the window. It may contain `=`, but not `|` or `}}`."
  - name: "startVisible"
    example: "true"
    does: "Opens the window as soon as the layer loads. Otherwise users open it with the button."
  - name: "text"
    example: "About this map"
    does: "Label of the button that opens and closes the window. Default: Show/Hide Window."
  - name: "title"
    example: "About this map"
    does: "Text in the window's title bar."
  - name: "x"
    example: "380"
    does: "Pixels from the left edge of the page. A negative value counts from the right edge. `y` works the same from the top."
  - name: "id"
    example: "about_window"
    does: "Id of the content area inside the window. `Ext.getCmp(id).update(html)` replaces its content."
---
{% raw %}
### What you get

The tag renders as the button, so it sits in the layer panel while the window floats over the
map. Use the window for anything that does not fit in the panel: a chart, a longer text, extra
controls.

### Size and position

`width` and `height` are plain numbers, in pixels. Without them the window is at most 250 wide
and 300 high, and users can always resize it. With neither `x` nor `y`, or with
`underButtons=true`, the window opens under the buttons at the top right of the map.

### Follow the layer, or not

The window closes when its layer is hidden and reopens when the layer is shown again, if it
was open before. Add `ignoreVisibility=true` to keep it independent of the layer. Closing it
with its X releases the button.

### Change it from code

Give the button an id with `btnID`. Then you can fill and open the window from any callback:

```javascript
descriptionHtml:
  "{{button|id=make_report|text=Make report|handler=showReport}}" +
  "{{window|id=report|btnID=report_btn|title=Report|text=Report|html=Loading...}}",
functions: {
  showReport: function () {
    Ext.getCmp("report").update("<b>27</b> states");   // the content area (markup id)
    Ext.getCmp("report_btn").toggle(true);             // open it; the button stays in sync
  },
},
```

Prefer `toggle()` on the button over `show()` and `hide()` on the window, so the button stays
in sync. The window also adds a handle to the layer's inputs, with `getWindow()`,
`getButton()` and `getContainer()`. It is stored under the **button's** id, so set `btnID` and
read `inputs.id["report_btn"]` - the markup `id` does not find it. It holds page components, so
read it in `beforeCalc` or a handler, never inside `expression`.

### Pitfalls

- `items` is ignored: the window always has one content area. Fill it with `html` or from code.
- `html` takes everything up to the next `|`. For content built at runtime, write into the
  content area instead.
- Ids are page-wide. Two windows, or a window and a chart, cannot share an id.
- `onBeforeHide` runs before the window hides; return `false` from it to keep the window open.
{% endraw %}
