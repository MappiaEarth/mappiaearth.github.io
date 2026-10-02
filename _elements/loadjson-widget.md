---
layout: element
title: Loadjson
tool_group: data
markup_tags: [loadjson]
summary: "Download a JSON file with the layer and use the parsed object in your callbacks - for lookups, lists and labels."
categories: [LoadJson, HTML]
featured-img: loadjson-widget
type: Element
examples:
    - title: Remote Javascript Object Transfer
      map-link: lang=eng&map=&queryid=114&extent=-443.628,-16.847,-407.373,3.294&tools=zoomextent,getfeature,hovershowlegend&options=scale,startopened,hidestylechooser,capabilities&visiblelayers=1
      featured-img: loadjson-widget
api: 
    - key: LoadJson
    - key: HTML
try:
  - "Read the panel: each geological era in the JSON is listed with its area, largest first."
  - "In `afterCalc`, change the sort to `areas[a] - areas[b]` and run it again: the smallest era comes first."
  - "Point `url` at your own JSON of names and numbers and run it again: the list shows your data."
key_params:
  - name: "url"
    example: "/theme/app/data/geologia_area.json"
    does: "Where the JSON is downloaded from; relative paths resolve on the Mappia server. Write `=` inside a query string as `\\=`."
  - name: "id"
    example: "areas"
    does: "Names the result: your callbacks read the parsed object as `inputs.id[\"areas\"]`."
  - name: "cors"
    example: "true"
    does: "Downloads through the Mappia proxy, for servers that do not send CORS headers."
  - name: "value"
    example: "inputs.id[\"areas\"]"
    does: "What the callbacks receive: the parsed JSON, an object or an array. An empty response gives `[]`."
  - name: "content"
    example: "<div id=\"area_list\"></div>"
    does: "HTML next to the tag. Give an element an `id` so your callback can write the result into it."
---
{% raw %}
### Where you can read the object

The parsed JSON is available as `inputs.id["areas"]` (the `id` you chose) in `beforeCalc`,
`onInputsReady` and `afterCalc`, and as `this.getInputs().id["areas"]` in the layer's
`functions`. The layer waits for the download before it calculates, so the object is always
complete when you read it.

`afterCalc` runs only for a layer that has an `expression`. Without one nothing is calculated
and `afterCalc` never runs - that is why the example has an `expression` that just returns
`layersVals[0]`.

### What arrives

Exactly what `JSON.parse` makes of the file: an object or an array. JSON carries only plain
data, so a date arrives as a string and there are no functions. If the server answers with an
empty body, the value is `[]`.

### Write the result into the panel

Put an empty element with an `id` in `descriptionHtml`, next to the tag, and fill it from your
callback. `afterCalc` runs again after every calculation round, so replace the content
(`innerHTML = ...`) instead of appending to it, as the example does.

### Use the data inside the calculation

`expression` runs in a worker, where `inputs.id` does not exist. The inputs reach it as a
plain array in markup order, and `{{loadjson}}` takes a position like any other input:

```javascript
descriptionHtml: "{{loadjson|id=weights|url=/data/weights.json}}",  // { "1": 0.5, "2": 2 }
expression: function (layersVals, inputs) {
  var weights = inputs[0];               // the parsed JSON, read by position
  return weights[layersVals[0]];
},
```

This works because parsed JSON is plain data; keep such tables small, since they are copied
into the worker together with the pixel values. A `{{loadcsv}}` table, by contrast, is an
object with methods and cannot be used there. The rules are in
[the execution model](/reference/execution-model/).

### Files on other servers

If the server does not send CORS headers, add `cors=true`. Inside a URL, write every `=` as
`\=` (`\\=` inside a JavaScript string), or the markup reads it as a new parameter. For a
table rather than an object, use [Loadcsv](/elements/loadcsv-widget/).
{% endraw %}
