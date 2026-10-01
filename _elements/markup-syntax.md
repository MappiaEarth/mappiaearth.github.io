---
layout: element
title: Markup syntax
tool_group: page
summary: "The rules every widget tag shares: parameters, escaping, nested keys, references."
categories: [MarkupSyntax, HTML]
type: Element
api:
  - key: MarkupSyntax
  - key: HTML
try:
  - "Read the panel: plain HTML, a label with an = sign, a number field and a list sit together."
  - "Type letters into \"A number\": the field is marked invalid, because `isnumeric=true` accepts only numbers."
  - "Open \"From a JSON list\": its choices, First and Second, come from the JSON written in `data`."
key_params:
  - name: "defaultParsing"
    example: "value=42"
    does: "A number becomes a number; anything else stays text, so `param=true` is the text \"true\"."
  - name: "falseValue"
    example: "notify=false"
    does: "Becomes an empty, false value: the way to switch off a parameter that is on by default."
  - name: "escapedEquals"
    example: "url=https://example.com/data.csv?v\\=2"
    does: "Puts a literal `=` in a value. Inside a JavaScript string, write it `\\\\=`."
  - name: "html"
    example: "html=A label with <i>raw HTML</i> and a = sign"
    does: "Taken as written up to the next `|`: equals signs and HTML need no escaping."
  - name: "getid"
    example: "getid=year"
    does: "Refers to an element created earlier in the same description, for example to listen to its events."
  - name: "content"
    example: "<b>Plain HTML</b> sits next to the widgets.<br>"
    does: "Everything outside the double braces is passed through as HTML, so headings and containers mix with widgets."
---
{% raw %}
### The shape of a tag

```text
{{widgetName|param=value|other=value}}
```

The tag name comes first, then parameters separated by `|`. An unknown tag name renders
nothing; the browser console shows `{{MARKUP}} INVALID OBJECT NAME`. The tag names are listed
in [the widget catalogue](/reference/widget-catalogue/).

### Values

| You write | The widget receives |
|---|---|
| `value=42` | The number `42` |
| `text=Hello` | The text `"Hello"` |
| `pressed=true` | The text `"true"`, which counts as on |
| `notify=false` | An empty value, which counts as off |
| `param=` or a bare `param` | An empty value (a bare `isnumeric` is the exception: it switches the check on) |
| `data=[["First"],["Second"]]` | Text the widget reads as JSON (lists such as `data`, `steps`, `values`) |
| `a=b=c` | A nested object, `{ a: { b: "c" } }` - `plugins=tip={0}%` gives a slider its value tip this way |

A combobox's `data` is a list of one-element lists: each value is both what the list shows
and what the input holds. A second element in a pair is ignored.

### Escaping

- `\=` puts a literal `=` inside a value, which URLs with query strings need. The markup is
  usually written inside a JavaScript string, where the backslash itself must be doubled:
  `"{{loadcsv|id=tbl|url=/data/fires.csv?year\\=2020}}"`.
- `html=` is the exception: its value is taken as written up to the next `|`, so HTML and
  `=` signs need no escaping.
- The `|` always separates parameters, inside `html=` too.

### Repeated parameters

The last one wins, except `cls`, whose values are joined with no separator - start the
second one with a space, or list all the classes in one `cls`.

### Callbacks

Parameters such as `handler=`, `runOnClick=` and `onSelect=` name a function. The name is
looked up first in the layer's `functions`, then among the query's globals; failing both, the
text itself is run as the function's body. Prefer `functions` on the layer:

```javascript
descriptionHtml: "{{button|id=apply|text=Apply|handler=onApply}}",
functions: {
  onApply: function () {
    ExtjsUtils.ALERTIFY.log("Applied");   // this = the layer
  },
},
```

### Referring to other elements

`getid=ID` points to an element created earlier in the same description, and
`getid=ID|getid=on_<event>=<code>` attaches a listener to it. Order matters: the element must
come first. The complete rules are in
[the widget markup language](/reference/markup-widgets/).
{% endraw %}
