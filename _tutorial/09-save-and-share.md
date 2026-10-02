---
title: Save, share and embed a map
step: 9
permalink: /tutorial/save-and-share/
summary: "Save a query in the Mappia editor to get its number, open it with a link whose parameters set the tools and options, and embed it in any page."
learn:
  - "How a query is saved and gets its number, the `queryid`."
  - "The parameters of a map link: tools, options, language."
  - "How to embed the map in another page."
try:
  - "Paste the query of step 5 into the editor, apply it and save it; open `/calculator/?queryid=` with its number."
  - "Add `&tools=measure,getfeature` to the link: only those two optional buttons appear."
  - "Add `capabilities` to `options=`: the map opens faster, reading only the maps your query uses."
more:
  - { title: "Map tools", url: "/elements/map-tools/", why: "the tools and options of a link, running" }
  - { title: "URL parameters in the API reference", url: "/api/#category_URLProperties" }
  - { title: "Page options in the API reference", url: "/api/#category_URLOptions" }
---
{% raw %}
### Save it

Open the [Mappia editor]({{ site.maps.editor }}), paste your query and press **Apply** to see
it. **Save** keeps it on the map server and gives it a number - its **`queryid`**. From then on
the map is a link:

```text
https://maps.csr.ufmg.br/calculator/?queryid=123
```

The editor writes and saves; the calculator shows. Opening the editor with `?queryid=123` loads
the saved query to edit it again.

### Shape the map with the link

The link takes parameters, each `&name=value`:

| Parameter | What it does |
|---|---|
| `queryid` | The saved query to show |
| `lang` | `eng` or `pt`: the language of the interface |
| `tools` | The optional buttons of the toolbar, separated by commas: `legend`, `measure`, `getfeature`, `hovershowlegend`, `zoomextent`, `customzoom`, `metadata`, `helpintro` |
| `options` | Page options, separated by commas: `scale` (a scale bar), `startopened` (the layer panel opens), `hidestylechooser`, `hidemetadata`, `disabledownload`, `capabilities`... |
| `visiblelayers` | Which layers start visible |

`options=capabilities` is worth adding to every link of a saved query: the map reads a catalogue
of **only the maps your query uses** instead of the server's whole catalogue, and opens much
faster. Each tool and option is described in the [API reference](/api/#category_URLOptions), and
the [map tools](/elements/map-tools/) page shows them on a live map.

### Embed it

Any page can show the map in an `<iframe>`:

```html
<iframe src="https://maps.csr.ufmg.br/calculator/?queryid=123&lang=eng&tools=zoomextent&options=scale,capabilities"
        width="100%" height="600" style="border: 0"></iframe>
```

That map lives on its own inside the page. To make the page and the map work together - your
buttons driving it, the map reporting clicks - there is MappiaIO, the last step.
{% endraw %}
