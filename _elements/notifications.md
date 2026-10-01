---
layout: element
title: "Notifications and choices"
tool_group: results
summary: "Show the user a short message, a non-blocking alert, or a choice between options, from any callback."
categories: [Alertify, LayersFunctions]
api:
  - key: Alertify
    tags: ['log', 'alert', 'confirmChoice', 'toggle', 'isEnabled']
type: Element
try:
  - "Press Choose a region, then pick Northeast in the list: the dialog closes at once."
  - "Watch the bottom right of the map: a notification says \"You picked NE\"."
key_params:
  - name: "confirmChoice"
    example: "ExtjsUtils.ALERTIFY.confirmChoice(\"Which region?\", [{ label: \"North\", value: \"N\" }, \"South\"], onPick)"
    does: "Asks the user to choose. Your function receives `(value, index, choice)` for the picked option."
  - name: "log"
    example: "ExtjsUtils.ALERTIFY.log(\"Calculation finished\", { delay: 6000 })"
    does: "Shows a short notification at the bottom right. It closes by itself after 4 seconds, or `delay` milliseconds."
  - name: "alert"
    example: "ExtjsUtils.ALERTIFY.alert(\"<b>No data</b> for the selected year.\")"
    does: "Shows a message with an OK button. Your code keeps running while it is open."
  - name: "isEnabled"
    example: "ExtjsUtils.ALERTIFY.isEnabled()"
    does: "Tells whether the user still allows notifications. When `false`, `log` shows nothing unless you pass `{ force: true }`."
---
{% raw %}
### Choices: how many options, which dialog

`choices` is a list of strings, or of `{ label, value }` objects. The dialog depends on how
many you give:

| Choices | What the user sees |
|---|---|
| 1 | No dialog: your function runs at once with that choice. |
| 2 | Two buttons, one per choice. There is no Cancel. |
| 3 or more | A list with OK and Cancel. Picking an option confirms it at once. |

The list starts on the first option, so picking that one does not close the dialog: the user
presses OK instead. The fourth argument, `config`, changes the rest:

```javascript
ExtjsUtils.ALERTIFY.confirmChoice("Which year?", ["2000", "2010", "2020"], onYear, {
  autoConfirmOnSelect: false,          // wait for OK instead of closing on pick
  okLabel: "Apply",
  cancelLabel: "Not now",              // default: Cancel, in the page language
  onCancel: function () { ExtjsUtils.ALERTIFY.log("Nothing changed"); },
});
```

### Notification options

`log(message, config)` takes HTML and these options:

| Option | Effect |
|---|---|
| `delay` | Milliseconds before the notification closes. Default 4000. |
| `force` | Show it even if the user turned notifications off. |
| `onlyMsg` | Show the message alone, without the close button and the "stop notifications" box. |
| `func` | Function called when the user clicks the notification. |
| `spamTime` | Milliseconds during which the same text is not shown again. Default 10000. |

### Pitfalls

- Only one notification shows at a time. The same text logged again within 10 seconds is dropped.
- Messages logged while the map is still loading wait until it has loaded, and then only the
  last one stays on screen.
- Users can switch notifications off from the notification itself. `toggle(true)` switches them
  back on for this browser; use it sparingly.
- `alert` and `confirmChoice` ignore that setting: they always show.
{% endraw %}
