# Where to find it: layers, settings and links

> Everything you change in a Mappia map is written in a layer, before the list of layers, or in the map's link. Find the place first: it tells you which part of the API reference to open.

Mappia reference, section "Writing a query". Page: https://mappia.earth/reference/where-to-look/
Generated API entries: LayersProperties, ConfigLayer, LayersFunctions, paramsButtonConfigProperties, LayerInternal, ValuesCalculation, FileLayer, VectorLayer, XYZLayer, GroupProperties, GroupProperties.defaultProperties, MarkupSyntax, QUERY.addRemoteWMSServer, QUERY.setQueryGlobalProperties, CONFIGURATION.setOptions, URLProperties, URLTools, URLOptions, LayersProperties.hideMetadata, URLOptions.disabledownload, URLProperties.visiblelayers, URLOptions.keeponleave, VectorLayer.fromProj (https://mappia.earth/assets/api.json)

Everything you change in a Mappia map is written in one of three places: **in a layer**,
**before the list of layers**, or **in the map's link**. Find the place first. It tells you
where to look in the [API reference](/api/). This page is the map of that reference, written for
someone who has done the [tutorial](/tutorial/).

## 1. Three places

```javascript
ExtjsUtils.CONFIGURATION.setOptions({ backgroundSelector: true }) && // 2. before the list: the whole map
[
  {                                                                  // 1. in a layer: this layer only
    name: "CSR:altimetria",
    title: "Elevation",
    styles: "altimetria_1",
    opacity: 0.6,
    visibility: true,
  },
];
```

```text
https://maps.csr.ufmg.br/calculator/?queryid=123&tools=measure&options=scale
                                                    3. in the link: this link only
```

1. **In a layer** `{ }` - layer properties. They change that layer only.
2. **Before the list, joined with `&&`** - query settings. They change the whole map, for as long
   as this query is applied.
3. **In the map's link** - link parameters. They change how this one link opens the map.

## 2. In a layer: layer properties

A layer is one entry of the list, between `{ }`. Its properties are read once, when the layer
is created. To change a layer later, call its methods (below).

### The kind of layer decides which keys work

`source` sets the kind of a layer. Some keys work on several kinds: `name`, `title`,
`visibility`, `opacity`. Others belong to one kind:

| Kind | `source` | Typical keys | API groups |
|---|---|---|---|
| Published map | none (the same as `"local"`), or a server's key | `styles`, `extents`, `startLegendOpen` | [Layer properties](/api/#category_LayersProperties), [Published maps: styles from QGIS](/api/#category_QGIS) |
| Calculated layer | `"calculate"` | `expression`, `beforeCalc`, `operation`, `categorical` | [Layer callbacks: functions you write](/api/#category_LayersFunctions), [Calculated layers: methods (this.)](/api/#category_LayerInternal), [Calculated layers: raw maps and operation tokens](/api/#category_RawMaps) |
| File layer | `"file"` | `type`, `json`, `url`, `loadData`, `fromProj`, `defaultStyle`, `onClick` | [File layers: data](/api/#category_FileLayer), [File layers: style, events, drawing](/api/#category_VectorLayer) |
| Tile layer | `"xyz"` | `url` with `${z}`, `${x}`, `${y}` | [Tile layers (xyz)](/api/#category_XYZLayer) |

[More layer properties](/api/#category_ConfigLayer) holds the rest: scale limits, `toggleGroup`,
the layout of the layer's row. When a key seems to do nothing, check that your kind of layer
reads it - see [Pitfalls](/reference/pitfalls/).

### The panel and the row buttons

**Calculated, file and tile layers** have a panel, which shows the text and widgets of
`descriptionHtml`, and buttons on their row, set with `paramsButtonConfig`. A **published map**
has neither: its row shows its legend, its styles and an opacity slider, and those two keys are
ignored.

```javascript
{
  title: "Land above an elevation",
  name: "CSR:altimetria",
  source: "calculate",
  paramsButtonConfig: [{ type: "query", pressed: true }], // the panel starts open
  descriptionHtml: "{{slider|id=minimum|minValue=0|maxValue=2000|value=1000}}",
}
```

Look in [Row buttons (paramsButtonConfig)](/api/#category_paramsButtonConfigProperties) for the
buttons. Widgets are in the **Panel widgets** section: start with
[Markup rules for every widget](/api/#category_MarkupSyntax), then the group of your tag, such as
[slider](/api/#category_Slider). The [widget markup language](/reference/markup-widgets/) explains them.

### Two kinds of functions

- **Functions you write.** The platform calls them: `expression` for each pixel, `beforeCalc`
  before each calculation, and your own functions in `functions`, called by buttons. Look in
  [Layer callbacks: functions you write](/api/#category_LayersFunctions).
- **Functions the layer already has.** You call them with `this.` inside your functions:
  `this.setCalculateLegend(...)`, `this.getInputs()`. Look in
  [Calculated layers: methods (this.)](/api/#category_LayerInternal).

A file layer keeps both kinds - `onClick`, `onHover` and its methods - in
[File layers: style, events, drawing](/api/#category_VectorLayer).

```javascript
beforeCalc: function (inputs) {             // you write it; the platform calls it
  this.setCalculateLegend([                 // the layer has it; you call it
    { color: [192, 57, 43], value: 1, title: "Above " + inputs.id["minimum"] + " m" },
  ]);
},
expression: function (layersVals, inputs) { // you write it; it runs for each pixel
  return layersVals[0] >= inputs[0] ? 1 : this.nullValue;
},
```

Inside these functions, `this` is the layer. `expression` is the exception: it runs in a
separate worker, and there `this` is the calculation
([Calculated layers: this inside expression](/api/#category_ValuesCalculation)). Write
`function`s, not arrow functions: an arrow function has no `this` of its own. When each
function runs is in the [execution model](/reference/execution-model/). The platform's helpers that your
functions call, `ExtjsUtils.NAME.member(...)`, are in part 6.

## 3. In a group: group properties

A group is an entry with `elements`. It organises layers:

- `title`, on a group at the top level of the list, makes an entry of the top menu;
- `viewTitle` makes a heading in the layer panel;
- `defaultProperties` holds layer properties and passes them to the layers inside.

Look in [Group properties](/api/#category_GroupProperties) and
[Group callbacks (viewTitle groups)](/api/#category_GroupFunctions). How groups nest is in
[the layer and group model](/reference/layer-and-group-model/).

`group: "background"` looks like a group, but it is a layer property: it makes that layer a
basemap.

## 4. Before the list: query settings

Calls joined with `&&` before the list change the **whole map**. They last until another query
is applied. Each call returns `true`, so the expression goes on to the list
([how a query is evaluated](/reference/query-language/)).

| Call | What it sets | Look in |
|---|---|---|
| `ExtjsUtils.QUERY.addRemoteWMSServer({ ... })` | Another map server for your layers | [QUERY · setup calls and the running query](/api/#category_QUERY), [Server definition (addRemoteWMSServer)](/api/#category_SourceConfig) |
| `ExtjsUtils.QUERY.setQueryGlobalProperties({ ... })` | Values and functions the whole query shares, and `runNow` | [QUERY · setup calls and the running query](/api/#category_QUERY) |
| `ExtjsUtils.CONFIGURATION.setOptions({ ... })` | Map-wide behaviour: `keepOnLeave`, `defaultFromProj`, `backgroundSelector` | [CONFIGURATION · query-wide settings (setOptions)](/api/#category_CONFIGURATION) |
| `ExtjsUtils.PROJECTION.setProjectionOptions([ ... ])` | Extra coordinate systems, and the choices offered when a reader uploads a file | [PROJECTION · CRS codes and upload choices](/api/#category_PROJECTION) |

This is what "configuration" means in `ExtjsUtils.CONFIGURATION`: settings for the whole query,
not for one layer.

## 5. In the link: link parameters

The address that opens a saved map takes parameters, each `&name=value`. They belong to the
page, not to the query: another link can open the same saved query with other buttons.

| Parameter | Example | Look in |
|---|---|---|
| `queryid`, `lang`, `extent`, `visiblelayers` | `?queryid=123&lang=eng` | [Link parameters (?name=value)](/api/#category_URLProperties) |
| `tools` | `&tools=measure,legend` | [Toolbar buttons (tools=)](/api/#category_URLTools) |
| `options` | `&options=scale,capabilities` | [Page options (options=)](/api/#category_URLOptions) |

The `tools` of a link are toolbar buttons. They are not the widgets of a layer's panel. Listing
tools replaces the default set of optional buttons.

A page that shows the map in an iframe and talks to it uses
[MappiaIO · your page and the map](/api/#category_MappiaIO); see
[embedding a map](/reference/embedding-and-messages/).

## 6. Where to look in the API

| You are writing | Section | Groups |
|---|---|---|
| A key of a layer | Layers: what you write in a layer | [Layer properties](/api/#category_LayersProperties), [More layer properties](/api/#category_ConfigLayer) |
| A function of a layer | Layers: what you write in a layer | [Layer callbacks: functions you write](/api/#category_LayersFunctions) |
| A row button, in `paramsButtonConfig` | Layers: what you write in a layer | [Row buttons (paramsButtonConfig)](/api/#category_paramsButtonConfigProperties), [Row button callbacks](/api/#category_paramsButtonConfigFunctions) |
| A key one kind of layer reads, or a `this.` method | Kinds of layer: what each source adds | [Calculated layers: methods (this.)](/api/#category_LayerInternal), [File layers: data](/api/#category_FileLayer), [Tile layers (xyz)](/api/#category_XYZLayer)... |
| A key of a group | Groups: what you write in a group | [Group properties](/api/#category_GroupProperties) |
| A widget, `{{slider}}`, in `descriptionHtml` | Panel widgets | [Markup rules for every widget](/api/#category_MarkupSyntax), then one group per tag |
| A call before the list | Query setup: calls before the layer list | [QUERY](/api/#category_QUERY), [CONFIGURATION](/api/#category_CONFIGURATION), [PROJECTION](/api/#category_PROJECTION) |
| `ExtjsUtils.NAME.member(...)` in a function | ExtjsUtils helpers (A-Z) | the group named like `NAME`: [ALERTIFY · messages and questions](/api/#category_Alertify), [LAYER · find layers, extents, legends, pixels](/api/#category_Layer), [JS · the map and the app](/api/#category_JS)... |
| A parameter of the link | Map links and embedding | [Link parameters](/api/#category_URLProperties), [Toolbar buttons](/api/#category_URLTools), [Page options](/api/#category_URLOptions) |

## 7. The same setting in two places

A few settings can be written in two places. These are the cases checked in the code. There is
no general rule, so do not guess for other settings.

| Setting | Written where | What happens |
|---|---|---|
| Metadata button | `hideMetadata` on a layer; `options=hidemetadata` in the link | Either one hides it. A layer cannot bring it back when the link hides it. On calculated, file and tile layers, the button exists only with a `paramsButtonConfig` entry of `type: "metadata"`. |
| Download button | A `paramsButtonConfig` entry of `type: "download"` (published maps have the button already); `options=disabledownload` in the link | The link wins: it removes the button. |
| Which layers start visible | `visibility` on each layer; `visiblelayers` or `options=onlyfirstvisible` in the link | The link wins when it is there: the layers start hidden, then `visiblelayers=2` shows the first two, `-1` the last one and `0` none. Without it, or with `visiblelayers=custom`, each layer's `visibility` applies. |
| Mouse wheel when the map is inside an iframe | `setOptions({ keepOnLeave })` in the query; `options=keeponleave` in the link | The query wins. Only the editor page reads the link option (without it, the editor uses `false`). The calculator ignores it and uses `true`. |
| A key in `defaultProperties` | A group's `defaultProperties`; the same key on the layer | The layer's own value wins. Between nested groups, the nearer group wins. |
| The coordinate system of a file layer's data | `fromProj` on the layer; `crs` in the data; `setOptions({ defaultFromProj })` in the query; `defaultFromProj` in the link | See below. |

The coordinate system of a file layer is chosen in this order:

- **GeoJSON** (in `json`, or `type: "geojsonurl"`): the layer's `fromProj`, then the data's
  `crs`, then a guess from the first coordinate. Numbers within ±180 and ±90 mean longitude
  and latitude (EPSG:4326). Larger numbers, up to about 20 million, mean Web Mercator metres
  (EPSG:3857). Only when the guess fails does the query's `defaultFromProj` apply, then the
  link's, then EPSG:900913.
- **CSV and lists of plain objects**: the layer's `fromProj`, then the query's
  `defaultFromProj`, then the link's, then EPSG:900913.

So a GeoJSON in UTM metres with no `crs` is read as Web Mercator, even with
`setOptions({ defaultFromProj: "EPSG:31983" })`. Give such a layer its own `fromProj`.

## 8. Older names you will meet

Some API texts are older than the tutorial and use other names for the same things:

| In older API texts | In the tutorial |
|---|---|
| Legend Window | the layer panel, on the left |
| the group's sub menu, Group List | the top menu |
| composed layer, Composed | a calculated layer (`source: "calculate"`) |
| `source: 'local'` | a published map; the same as writing no `source` |
| Query section, query panel, "Exibir Consulta" | a layer's panel (`descriptionHtml`), opened by its query button |
| VectorLayer | a file layer (`source: "file"`) |
| tool, inside `descriptionHtml` | a panel widget |

## 9. How to look something up

1. Decide where you would write it: in a layer, in a group, before the list, or in the link.
2. For a layer, note its kind (its `source`). The table in part 2 names its groups.
3. On the [API page](/api/), type the name, or part of it, in *Filter members*: `setOptions`,
   `fromproj`. Capitals do not matter.
4. To read a whole list at once, open the
   [property catalogue](/reference/property-catalogue/) (the keys of layers and groups, as
   tables) or the [widget catalogue](/reference/widget-catalogue/) (each widget and its
   parameters).
5. Many API examples put the layer inside a group (`title`, `color`, `elements`). The key works
   the same in a plain list, as in the tutorial.
6. If a key does nothing, check the kind of layer (part 2), then [Pitfalls](/reference/pitfalls/).
