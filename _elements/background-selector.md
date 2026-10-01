---
layout: element
title: "Background map picker"
tool_group: data
summary: "Offer several basemaps - OpenStreetMap, satellite, topographic - and let the user switch between them from floating thumbnails."
categories: [CONFIGURATION, LayersProperties, ConfigLayer]
api:
  - key: CONFIGURATION
    tags: ['setOptions']
  - key: LayersProperties
    tags: ['source', 'visibility']
  - key: ConfigLayer
    tags: ['group']
type: Element
try:
  - "Click the Topographic thumbnail at the top right: the basemap under the States layer changes."
  - "Click OpenStreetMap to switch back: only one basemap is visible at a time."
  - "Move `visibility: true` from OpenStreetMap to Topographic and run it again: the map starts topographic."
key_params:
  - name: "group"
    example: "background"
    does: "Makes the layer a basemap: it sits under every other layer, leaves the layer list and joins the picker."
  - name: "setOptions"
    example: "ExtjsUtils.CONFIGURATION.setOptions({ backgroundSelector: true })"
    does: "Shows the floating picker, one thumbnail per basemap, when the query loads."
  - name: "source"
    example: "osm"
    does: "Where the basemap comes from: `osm` for OpenStreetMap, `arcgisrest` for ArcGIS basemaps."
  - name: "name"
    example: "mapnik"
    does: "Which map of that source: `mapnik` for OpenStreetMap; `Topographic` in the ArcGIS example."
  - name: "title"
    example: "Topographic"
    does: "The label under the basemap's thumbnail."
  - name: "visibility"
    example: "true"
    does: "The basemap the map starts with. Set it on one basemap only."
---
{% raw %}
### How a basemap behaves

A layer with `group: "background"` is drawn under everything else and is not listed in the
layer panel. Only one basemap is visible at a time: choosing a thumbnail hides the others.
Your data layers stay on top and keep their own visibility.

### The default basemap

When no layer of the query declares `group: "background"`, the platform adds OpenStreetMap
by itself. As soon as you declare a basemap of your own, that default is left out - so list
OpenStreetMap among yours if you still want it, as the example does.

### Turning the picker on

`setOptions` goes before the layer list, joined with `&&`, because a query is a single
expression ([how a query is evaluated](/reference/query-language/)). The setting belongs to
the query: it is cleared when another query loads.

To show the picker only when there really is a choice, pass an object instead of `true`:

```javascript
ExtjsUtils.CONFIGURATION.setOptions({ backgroundSelector: { minCount: 2 } }) && [
  { name: "CSR:estados", title: "States", visibility: true },
  { name: "mapnik", source: "osm", title: "OpenStreetMap", group: "background", visibility: true },
  { name: "Topographic", source: "arcgisrest", title: "Topographic", group: "background" },
];
```

### Labels

Each thumbnail is labelled with the layer's `title`, or its `name` when there is no title.
Keep titles short: long ones are cut off under the thumbnail.

### Related

For tiles from any z/x/y tile service, see the [XYZ layer](/elements/xyz-layer/).
OpenStreetMap tiles can also be saved for use without a connection - see
[offline areas](/elements/offline-areas/).
{% endraw %}
