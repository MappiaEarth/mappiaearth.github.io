# The layer and group model

> The vocabulary a query is written in — the kinds of layer, how groups nest them, how a calculated layer reads several maps at once, and where the full property list lives.

Mappia reference, section "Model". Page: https://mappia.earth/reference/layer-and-group-model/
Generated API entries: LayersProperties, LayersFunctions, GroupProperties, GroupFunctions, ConfigLayer, VectorLayer, FileLayer, XYZLayer, SourceConfig, ConfigLayer.operation, FileLayer.type, LayersProperties.source, RawMaps.operations, paramsButtonConfigProperties (https://mappia.earth/assets/api.json)

Everything a query says is said about a **layer definition**: a plain object. Groups nest
those objects and pass properties down to them. This page is the vocabulary: the kinds of
layer that exist, what distinguishes them, and which property list applies to each. The
exhaustive, generated list of properties lives in the
[API reference](/api/) — this page is the map of it.

## 1. A layer definition

```javascript
{
  name: "CSR:estados",      // which map(s) — the only property with no default
  title: "States",          // what the layer panel shows
  visibility: true,         // starts visible
  opacity: 0.8,
  group: "background",      // optional: a reserved slot, see §4
}
```

Two properties decide how everything else is read:

| Property | Decides |
|---|---|
| `source` | Where the pixels come from: the catalogue, a calculation, a file, a tile service |
| `name` | Which map, or — for a calculated layer — which maps, comma-separated, in order |

## 2. The kinds of layer

| `source` | What it is | The properties that matter | Property group in the API reference |
|---|---|---|---|
| *(absent)* or `"local"` | One published map, drawn as WMS tiles | `styles`, `extents`, `minscale` / `maxscale`, `startLegendOpen`, `hideStyleChooser` | `LayersProperties`, `ConfigLayer` |
| `"calculate"` | Several maps read together; your `expression` produces a new map from their pixels | `name` (list), `operation`, `expression`, `beforeCalc`, `legendColor`, `insideOpacity`, `categorical`, `maxZoom`, `otherNames` | `LayersProperties`, `ConfigLayer`, `LayersFunctions`, `LayerInternal` |
| `"file"` | Vector features from a file, an inline object or your own loader — with `type` choosing which | `type`, `url`, `json`, `loadData`, `styleMap`, `onClick`, `onHover`, `cluster` | `FileLayer`, `VectorLayer` |
| `"xyz"` | A tile service addressed by z/x/y | `url`, `name` | `XYZLayer` |
| `"osm"`, `"google"`, `"arcgisrest"` | A ready-made basemap | `name` selects the variant (for example `mapnik`, `SATELLITE`) | `LayersProperties` |

A layer registered through `addRemoteWMSServer` behaves as a catalogue layer; the
registration says where its server is and whether it needs a proxy.

Only calculated, file and tile (xyz) layers have a **panel** in the layer list:
`descriptionHtml` (text and widgets), `paramsButtonConfig` (row buttons) and
`exclusiveGroupDetails` are ignored on published maps, basemaps and servers added with
`addRemoteWMSServer`, while `startLegendOpen` and `hideStyleChooser` work on published maps only.
`maxZoom` set in the query is read only by calculated layers; a published map takes it from
its catalogue entry.

### 2.1 `type`, for file layers

`type` chooses how a `source: "file"` layer obtains its features (case-insensitive):

| `type` | Source of the features |
|---|---|
| `load` | Your `loadData(inputs, config)` callback loads them; it must announce the load with the layer's `startLoadingLayer` / `endLoadingLayer` events |
| `csv` | The CSV at `url`, one feature per line |
| `json` | The inline `json` property: GeoJSON, or an array of plain objects |
| `jsonurl` | JSON fetched from `url` (also the fallback for an unrecognised `type`) |
| `geojsonurl` | GeoJSON fetched from `url` |
| `empty` | No features; the query adds them later |

A GeoJSON without a declared CRS is guessed from its first coordinate: EPSG:4326 when it
looks like longitude/latitude, otherwise EPSG:3857. CSV and lists of plain objects use the
query's `ExtjsUtils.CONFIGURATION.setOptions({ defaultFromProj })`, then the link's
`defaultFromProj`, then the map projection. Declare `crs` in the GeoJSON, or `fromProj` on
the layer, whenever the data is in anything else (UTM, for example) — a silent misalignment
is the usual symptom.

### 2.2 `operation`, for calculated layers

A calculated layer's `name` lists several maps; `operation` is a comma-separated list with
**one token per map, in the same order**, saying how each map's pixels are turned into the
numbers `expression` receives. An empty token leaves that map on the default.

```javascript
{
  source: "calculate",
  name: "CSR:pop_density_estimate_2015,CSR:estados,CSR:pop_density_estimate_2015",
  operation: "average,,area",   // map 1 averaged, map 2 default, map 3 as area
}
```

| Token | The value `expression` receives |
|---|---|
| *(empty)* | The regular WMS image: the pixel's legend colour/category |
| `raw` | The value of the most central original cell under the pixel |
| `rgba` | The pixel's RGBA bytes packed into one integer |
| `sum` / `average` | Area-weighted sum / mean of the cells under the pixel |
| `max` / `min` | Largest / smallest cell at least partly under the pixel |
| `integral` | Summed-area table: the sum over a rectangle from its four corners |
| `areaintegral` | Summed-area table of the covered areas |
| `area` | Original map area inside the pixel |
| `cells` | Weighted count of original cells inside the pixel |

Tokens are case- and whitespace-insensitive. Every token except the default and `rgba`
requires the map to be **published with that operation available**; if it is not, the
console reports `Operation X is not defined for layer Y` and the layer produces nothing.

## 3. Groups

Groups come in two kinds, and nest. A top-level group with **`title`** and `elements` becomes an
entry of the **top menu**, which lists all its layers for the reader to turn on (`GroupProperties.title`).
A group with **`viewTitle`** and `elements` becomes a **heading in the layer panel**, above the
layers of it that are on:

```javascript
[
  {
    viewTitle: "Boundaries",
    color: "#8b0000",
    openGroup: true,
    defaultProperties: { visibility: false, source: "local" },
    elements: [
      { title: "States", name: "CSR:estados", visibility: true },
      { title: "Municipalities", name: "CSR:municipios" },
    ],
  },
]
```

| Property | Effect |
|---|---|
| `viewTitle` | The group's row in the layer panel; groups may nest by nesting `elements` |
| `elements` | The layers, or further groups, inside it |
| `defaultProperties` | Applied to every descendant that does not set the property itself |
| `openGroup` | The `viewTitle` heading starts expanded (also available per layer, where it expands the layer's headings) |
| `color` | The colour of the group's `viewTitle` heading; on a top-level group, also of its top-menu entry and of the rows of all its layers. A `color` written on a layer is replaced by its groups' colours |
| `viewColor` | Accepted on a group, but it has no visible effect today |
| `onClickViewGroup`, `onToggleViewGroup` | Called when the group row is clicked or toggled, with `this` = the node. These need a real group: attached to a layer that is not inside a `viewTitle`, they never fire |
| `global` | Declares query globals while this group is interpreted |

Interpretation flattens all of this into an ordered list of layers, each remembering its
group path. Order inside a group is declaration order unless `priority` reorders it
(higher first).

## 4. Reserved and special slots

| Slot | Meaning |
|---|---|
| `group: "background"` | The layer is a basemap: it goes under everything and joins the background picker instead of the layer list |
| `group: "<any other value>"` | Ignored: only `"background"` is read. To let one of several layers be visible at a time, use `toggleGroup` |
| `paramsButtonConfig` | Extra buttons on the layer's row — query, download, tooltip and toggle buttons; a bare object is treated as one entry of type `query`. Calculated, file and tile layers only |
| `descriptionHtml` | The layer's panel content: free HTML plus the widget markup of [the widget markup language](/reference/markup-widgets/). Calculated, file and tile layers only |

## 5. Presentation properties, in one place

These do not change what the layer computes, only how it appears. All are documented
individually in the [API reference](/api/) under `LayersProperties` and `ConfigLayer`.
Unless noted, they apply to every kind of layer:

- **In the panel**: `title`, `startListed`, `hideListing`, `hideMetadata`,
  `hideLegendButton`, `showRemoveBtn`, `useLayerTooltip`, `customLayerClass`, `verticalMenu`;
  `startLegendOpen` and `hideStyleChooser` (published maps only); `description` (file and
  tile layers only); `thumbUrl` (published maps and tile layers only); `legendTitle`
  (calculated layers only).
- **On the map**: `visibility`, `opacity`; `minscale`, `maxscale` and `hideTilePlaceholder`
  (published maps and calculated layers); `insideOpacity` and `maxZoom` (calculated layers
  only). The map's extent and attribution come from its catalogue entry, not from the query:
  limit the area with `extents`.
- **In the legend of a calculated layer**: `categorical`, `categoricalPalette`,
  `maxQntEntries`, `showLoadingModal` (also on file layers).

## 6. How to find a property

[Where to find it](/reference/where-to-look/) shows, for anything you want to change, where it is
written (in a layer, in a group, before the layer list or in the map's link) and which part of
the [API reference](/api/) lists it. If a property appears in an old query and does nothing,
check [pitfalls and properties that do nothing](/reference/pitfalls/) before trusting it.
