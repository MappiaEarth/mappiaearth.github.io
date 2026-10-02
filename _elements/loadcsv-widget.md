---
layout: element
title: Loadcsv
tool_group: data
markup_tags: [loadcsv]
summary: "Download a CSV table with the layer and read it from your callbacks - to draw charts, look up values or fill labels."
categories: [LoadCsv, Slider, Label, Highcharts, HTML]
featured-img: loadcsv-widget
type: Element
examples:
    - title: Interacting Map and CSV
      map-link: lang=eng&map=&queryid=113&extent=-443.628,-16.847,-407.373,3.294&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,capabilities&visiblelayers=custom
      featured-img: loadcsv-widget
api: 
    - key: LoadCsv
    - key: Slider
    - key: Label
    - key: Highcharts
    - key: HTML
try:
  - "Read the panel: the chart plots carbon loss, in gigatonnes, against the share of forest lost."
  - "Hover a point of the line: the tooltip shows the carbon loss at that share."
  - "Point `url` at your own two-column CSV and run it again: the chart redraws from your numbers."
key_params:
  - name: "url"
    example: "/theme/app/data/emissoesco2.csv"
    does: "Where the CSV is downloaded from; relative paths resolve on the Mappia server. Write `=` inside a query string as `\\=`."
  - name: "id"
    example: "emissions"
    does: "Names the table: your callbacks read it as `inputs.id[\"emissions\"]`."
  - name: "removeEmptyLines"
    example: "true"
    does: "Drops blank lines, such as a final newline, so they are not counted as data lines."
  - name: "cors"
    example: "true"
    does: "Downloads through the Mappia proxy, for servers that do not send CORS headers."
  - name: "getValue"
    example: "table.getValue(1, line)"
    does: "Reads one cell as text: column index first, then line. Line 0 is the first line after the header."
  - name: "getLineCount"
    example: "table.getLineCount()"
    does: "Number of data lines, header excluded. Loop from 0 up to it."
---
{% raw %}
### Where you can read the table

The table is available as `inputs.id["emissions"]` (the `id` you chose) in `beforeCalc`,
`onInputsReady` and `afterCalc`, and as `this.getInputs().id["emissions"]` in the layer's
`functions`. The layer waits for the download before it calculates, so you never see a
half-loaded table.

Two rules catch most people:

- `afterCalc` runs only for a layer that has an `expression`. Without one nothing is
  calculated and `afterCalc` never runs - that is why the example has an `expression` that
  just returns `layersVals[0]`.
- `expression` runs in a worker, where `inputs.id` does not exist. Work with the table in the
  page callbacks above.

### The table methods

| Method | Returns |
|---|---|
| `getLineCount()` | The number of data lines (the header is not counted) |
| `getValue(column, line)` | One cell as text, trimmed. `line` 0 is the first data line |
| `getLines()` | Every data line, each an array of cell texts |
| `getLines(columns, values)` | Only the lines whose `columns` hold `values`, e.g. `getLines(["state"], ["MG"])` |
| `columnNameToInd(name)` | The index of a header, or `-1` when there is none |
| `getColunsInd()` | The header row. The misspelling is the real name: `getColumnsInd` does not exist |
| `createIndexes(columns)` | Speeds up repeated `getLines` calls on the same columns |

Columns can be given by index or by header name. Look a value up by name like this:

```javascript
afterCalc: function (inputs) {
  var table = inputs.id["prices"];
  var price = table.columnNameToInd("price");
  var lines = table.getLines(["state"], ["MG"]);   // lines whose "state" cell is "MG"
  if (price >= 0 && lines.length) {
    Ext.getCmp("price_label").setText("MG: " + lines[0][price]);
  }
},
```

### Every cell is text

Convert with `parseFloat` before you calculate or compare, or `"9" > "10"` will surprise you.
`getLines` compares values as text too.

Cells keep the spaces written in the file. `getValue` trims the cell it returns, but header
names are never trimmed, so `columnNameToInd` needs the exact header text. In the example's
file the second header is ` carbon_loss`, with a leading space - which is why the example
reads its columns by index. `trim=true` is accepted but does nothing.

### Redraw, do not stack

`afterCalc` can run many times: once after every calculation round. Clear what the previous
round drew before you draw again, as the example does by destroying the old chart. A chart
larger than the panel fits well in a [Window](/elements/window-widget/).

### It counts as an input

`{{loadcsv}}` takes a position among the layer's inputs, in markup order. If a slider comes
after it, `expression` reads the slider as `inputs[1]`, not `inputs[0]`. See
[the widget markup language](/reference/markup-widgets/) for the full order rules.

### Files on other servers

If the server does not send CORS headers, add `cors=true`. Inside a URL, write every `=` as
`\=` (`\\=` inside a JavaScript string), or the markup reads it as a new parameter:
`{{loadcsv|id=tbl|url=https://example.com/data.csv?v\=2|cors=true}}`.
{% endraw %}
