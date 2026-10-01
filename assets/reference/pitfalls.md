# Pitfalls, and properties that do nothing

> The mistakes that make a query fail silently, the keys that have been copied between queries for years without ever being read, and the handful of parameters the platform accepts but does not honour.

Mappia reference, section "Practical guidance". Page: https://mappia.earth/reference/pitfalls/
Generated API entries: GroupProperties.openGroup, GroupFunctions.onClickViewGroup, URLOptions, LoadCsv.trim, SummedArea, Hoverpixel, LayersProperties.maxQntEntries, ConfigLayer.type, QUERY.setQueryGlobalProperties (https://mappia.earth/assets/api.json)

A query almost never fails loudly. It shows a map with one layer missing, or a panel with no
widget, or a legend that never appears — and the cause is usually one of the items below.
The list is short because it is the result of reading the whole body of queries running in
production: these are the things that actually go wrong.

## 1. The query produced nothing

| Symptom | Cause | Fix |
|---|---|---|
| Only the default background is shown | The query text is not a single expression (a top-level `var`, a statement, a stray semicolon), so it threw before producing a value | See [the query language](/reference/query-language/) §1 |
| Same, with no error in the console | The expression evaluated, but its value was not an array of layer definitions | End the expression with the array |
| One layer missing, others fine | Its `name` is not in the catalogue, or its server was registered after the array that uses it | Check the name; put `addRemoteWMSServer` before the array |
| A calculated layer stays empty | A map in `name` is not published with the `operation` the query asks for; the console says `Operation X is not defined for layer Y` | Use a decoding the map offers |
| `this.something is not a function` | An arrow function where the platform binds `this` to the layer | Regular `function` for `beforeCalc`, `handler`, `functions.*`, the vector callbacks |
| A value is `undefined` only inside `expression` | It came from a closure, a global or the DOM, none of which exist in the calculation worker | Compute it in `beforeCalc`, pass it as an input |
| `Cannot read properties of undefined (reading '<id>')` from `expression` | `inputs.id[ID]` used inside `expression`: the inputs reach the worker as JSON, which keeps only the array's elements, so the `id` map is gone | Read by position: `inputs[0]` is the first input widget in `descriptionHtml`. `inputs.id[ID]` works only on the page (`beforeCalc`, `functions`, ...) |
| `filterLegends[...].color.join is not a function` | `setCalculateLegend` given a CSS colour (`"#c0392b"`): the legend entries take `[R, G, B]` | `{ color: [192, 57, 43], value: 1, title: "Above 800 m" }`. Layer and group `color` properties do take CSS colours |
| Works once, then breaks on re-apply | State kept outside the query's globals | `setQueryGlobalProperties` |
| "Global variable can't be redefined" | A global name collides with one the page already had | Rename it |
| A widget's tag renders as nothing | Unknown tag name; the console shows `{{MARKUP}} INVALID OBJECT NAME` | Use the exact tag from [the widget markup language](/reference/markup-widgets/) |

## 2. Keys that are silently ignored

These appear in real queries — some in dozens of them — and have no reader in the platform.
Nothing warns about them, which is exactly why they spread by copy-paste. Remove them; they
document an intent the map never had.

| Key | Where it is written | What people expect | What happens |
|---|---|---|---|
| `closedGroup` | On a group | Start the group collapsed | Nothing. Groups start collapsed by default; use `openGroup: true` to start one expanded |
| `disableDownload` | On a layer | Hide that layer's download button | Nothing. It only exists as a page option (`options=disabledownload` in the URL), which applies to the whole page |
| `hideBottomButton` | On a layer | Hide the query button under the layer row | Nothing at layer level. It works only inside a `paramsButtonConfig` entry of type `query` |
| `legendId` | On a layer | Point the layer at a legend | Nothing. It is a parameter of the `legendhtml` widget |
| `maxZoomReal` | On a layer | A second maximum zoom | Nothing. `maxZoom` is the one that is read |
| `showTimelineButton`, `timelineConfig` | On a layer | Configure a timeline | Nothing. The timeline is the `{{timeline}}` widget, configured by its own parameters |
| `priority`, `visible`, `layerGroup`, `startOpen`, `startOpened` | On a **group** | Ordering and initial state | Nothing at group level. `priority` and `visibility` are layer properties; `openGroup` is the group one |
| `popupTemplate`, `popupCallback` | On a file (vector) layer | A popup with the clicked feature's attributes | Nothing. They are accepted and never read - no popup opens. Show the attributes from `onClick`, e.g. with `ExtjsUtils.ALERTIFY.log` |
| `selectSource` | Anywhere | Choose a source per layer name | Nothing. No part of the platform reads it |

## 3. Accepted, but not honoured

Different case: the platform takes the value, and then does not do what the name promises.

| Parameter | Reality |
|---|---|
| `{{loadcsv\|trim=true}}` | The flag is passed to the CSV parser, which never reads it. Trim the cells yourself when you use them |
| `maxQntEntries` on a calculated layer | Stored, and clamped to the palette size, but the legend grouping uses its own default instead. To control the entries exactly, build the legend yourself with `setCalculateLegend` |
| `{{summedarea}}` input value | Never filled. The sums reach `runOnClick`, not `inputs.id[ID]` |
| `{{hoverpixel}}` | Moving or clicking never recalculates the layer. Its `lastInfo` value is always current, so read it in a callback — or force a recalculation yourself |
| `onClickViewGroup` / `onToggleViewGroup` on a layer | They only fire for a real group row (a `viewTitle` node). On a layer that is not inside a group, they bind to the invisible root and never run |

## 4. Embedding

| Mistake | Effect |
|---|---|
| `noopener` or `noreferrer` on the iframe or the opened window | Messages between the parent and the map stop working |
| Re-using an iframe after tearing the connection down, without setting `src` again | The parent-side helper is gone; the map never answers |
| Treating one integration's operation names as platform API | Operation names are a contract between one parent page and one query, not a platform feature |

## 5. Data

| Mistake | Effect |
|---|---|
| GeoJSON without a `crs` (and no `fromProj` on the layer) | The data is assumed to be in the platform's default projection, and silently lands in the wrong place |
| Coordinates in latitude/longitude order where the format wants longitude/latitude | Features appear mirrored around the diagonal, or off the map |
| A CSV whose numeric column arrives as text | Comparisons in `expression` behave like string comparisons; convert before comparing |

## 6. Style

Two habits worth dropping:

- **A full setup chain on every query.** `[{ name: "…" }]` is a complete query. Add
  `setOptions`, `decorate`, `setQueryGlobalProperties` only where the map needs them.
- **Code hidden in a made-up `decorate` key.** Any key that `decorate` does not know is
  installed as a CSS rule, so writing `noTop: (function () { … })()` "works" — the function
  runs while the object is being built, and its return value becomes a stylesheet entry.
  Use `run` for code and keep `decorate` for chrome.

## 7. Layers age

The most frequent cause of an old query breaking is not the query: a published map was
renamed or withdrawn, and the layer that referenced it now resolves to nothing. When
reviving an old map, check its layer names against the current catalogue before looking for
anything else.
