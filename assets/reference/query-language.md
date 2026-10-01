# How a query is evaluated

> A query is plain JavaScript - one expression whose value is the list of layers to show. This page is the contract around it: how the platform evaluates it, where state lives, and which parts of it run in a worker instead of on the page.

Mappia reference, section "Writing a query". Page: https://mappia.earth/reference/query-language/
Generated API entries: QUERY.setQueryGlobalProperties, QUERY.runNow, CONFIGURATION.setOptions, QUERY.decorate, QUERY.addRemoteWMSServer, QUERY.addLayer, LayersFunctions.expression, MarkupSyntax (https://mappia.earth/assets/api.json)

A **query** is the text that defines one Mappia map: which layers it shows, how they are
grouped, which widgets the user gets, and what arithmetic runs over the pixels. A query is
stored on the server under a numeric id (`?queryid=417`) or handed to a page at runtime by
its parent document.

**There is no Mappia language.** A query is plain JavaScript, evaluated by the browser. What
the platform adds is an **API**: the objects, the layer and group properties, the widgets and
the callbacks that this reference declares — the layer and group properties in
[the property catalogue](property-catalogue), the widgets in
[the widget catalogue](widget-catalogue), and all of it, generated from the platform source,
in the [API reference](/api/).

What this page describes is the *contract* around that JavaScript: it is evaluated as a
single expression, part of it runs in a worker rather than on the page, and state does not
survive a re-apply. Almost every surprise a query author meets comes from one of those
three facts.

## 1. One expression, one value

The platform does not run a query as a program. It evaluates it as a single expression,
equivalent to:

```javascript
true && ( your query text )
```

and keeps **the value the expression produced**. That value must be an array of layer
definitions. The smallest complete query is therefore one line:

```javascript
[{ name: "CSR:estados" }];
```

Two consequences follow, and they explain most "my query did nothing" reports:

| If you write | What happens |
|---|---|
| A top-level statement (`var x = 1; [ … ]`) | A syntax error inside the expression. The map falls back to its default background and the array is never read. |
| An expression whose value is not an array (a function declaration, an assignment, a `console.log`) | The query is discarded as "no layers", with the same visible result. |

So state and setup cannot be introduced with statements. They are introduced with
operators — which is what the next section is about.

## 2. The `&&` chain: setup before the value

Several platform calls exist to be used as the left-hand side of `&&`. Each performs a
side effect and returns `true`, so the expression continues and still ends with the layer
array:

```javascript
ExtjsUtils.CONFIGURATION.setOptions({ keepOnLeave: true }) && [
  { name: "CSR:estados", visibility: true },
];
```

| Call | Side effect | Use it when |
|---|---|---|
| `ExtjsUtils.CONFIGURATION.setOptions({…})` | Query-level behaviour: mouse-wheel policy when embedded, the default projection for vector data, the background picker | The map needs behaviour that is not a layer property |
| `ExtjsUtils.QUERY.setQueryGlobalProperties({…})` | Copies each key onto `window` for the lifetime of this query | You need named functions or shared state (see §3) |
| `ExtjsUtils.QUERY.setMappiaIoCallback(fn)` | Registers the handler for messages sent by the parent document | The map is embedded and the parent talks to it |
| `ExtjsUtils.QUERY.decorate({…})` | Page chrome: `header`, `footer`, `run`; any other key is installed as a CSS rule | Branded or stripped-down pages |
| `ExtjsUtils.QUERY.addRemoteWMSServer({…})` | Registers extra WMS endpoints before the layers that use them are read | Layers come from a server outside the default catalogue |
| `ExtjsUtils.PROJECTION.setProjectionOptions({…})` | Adds coordinate systems to the upload dialog | Users upload data in an unusual CRS |

Chain only what the map needs. A query that opens with five setup calls it does not use is
harder to read and no more capable than `[{ name: "…" }]`.

Two details worth knowing:

- **Order matters where data depends on it.** `addRemoteWMSServer` must come before the
  array that references its layers, otherwise those layers are skipped with a
  "source not found by name" message in the console.
- **Setup calls do not run during a syntax check.** When the editor only parses a query to
  validate it, side-effect calls are suppressed; only the layer array is produced. Code
  that must run exactly once after setup belongs in `runNow` (§3), not in a bare call.

## 3. Where state lives

A query is re-evaluated whenever it is applied again — by the editor, by the parent
document, by a user pressing *Apply*. Anything held in a top-level variable is lost, and
top-level variables are not even syntactically available (§1). All shared state goes
through one call:

```javascript
ExtjsUtils.QUERY.setQueryGlobalProperties({
  PALETTE: ["#ffffcc", "#c2e699", "#78c679", "#238443"],
  toTitle: function (name) { return name.replace(/_/g, " "); },
  handleParentMessage: function (msg) { /* … */ },
}) && [ /* layers */ ];
```

- Each key becomes a property of `window` until the next query replaces it.
- A name that already exists on `window` and was not created by a query is **refused**,
  with "Global variable can't be redefined" in the console. Choose names that cannot
  collide with the platform's own globals.
- Exactly one name has a meaning to the platform: **`runNow`**. If the query defines it,
  the platform calls it once, after the globals are registered. Everything else is a
  private name that only your own query code reads.
- A `global: { … }` object on a group or on a layer is an equivalent, narrower way to
  declare globals while that node is being interpreted.

## 4. Names, and where a layer comes from

A layer definition identifies its data by `name`:

```javascript
[{ name: "CSR:estados", visibility: true }]
```

That name is looked up in the catalogue the platform already knows (its WMS
capabilities). A name that is not in the catalogue produces no layer — and this is the
single most common reason a query that "worked last year" shows an empty map: the published
layer was renamed or withdrawn. Layers from elsewhere need their server registered first
(`addRemoteWMSServer`), and layers that are not WMS at all (a GeoJSON file, an XYZ tile
service, an uploaded CSV) declare a `source` or a `type` instead. The layer and group
vocabulary is a chapter of its own: [the layer and group model](/reference/layer-and-group-model/).

## 5. Functions inside a query

Layer definitions hold functions: what to do before a calculation, what to draw for a
legend, what a button does. Three rules cover all of them.

**5.1 `this` is the layer, so use a regular function.** The platform calls these callbacks
with `this` bound to the layer (or, for tree callbacks, to the node). An arrow function
keeps the `this` of the surrounding scope, where none of the layer's methods exist:

```javascript
// correct
beforeCalc: function (inputs) { this.changeLayers([{ index: 0, name: inputs.id["pick"] }]); }

// broken: this.changeLayers is undefined
beforeCalc: (inputs) => { this.changeLayers(/* … */); }
```

This applies to `beforeCalc`, `afterCalc`, `onVisibilityChange`, `onInputsReady`, the
entries of a layer's `functions` map, widget `handler` / `toggleHandler`, vector callbacks
such as `onClick` / `onHover` / `loadData`, and the group callbacks.

**5.2 A handler named by a string is resolved in a fixed order.** Widgets take their
callbacks as text (`{{button|handler=applyFilter}}`). The platform resolves that name:

1. the layer's own `functions` map — `functions: { applyFilter: function () { … } }`;
2. a global of that name (typically one declared with `setQueryGlobalProperties`);
3. failing both, the string itself is evaluated: a string starting with `function` becomes
   that function, and any other text is treated as the *body* of a function.

Prefer (1). It keeps the callback next to the layer it belongs to, and it cannot collide
with anything else on the page.

**5.3 `expression` is not evaluated on the page.** A calculated layer's `expression` is
serialized with `toString()` and rebuilt inside a WebWorker, where the page does not
exist: no closures over your variables, no `window`, no DOM, no platform objects.

```javascript
// broken: `factor` and `document` do not exist in the worker
expression: function (layersVals) { return layersVals[0] * factor; }

// broken: inputs.id is undefined in the worker
expression: function (layersVals, inputs) { return layersVals[0] * inputs.id["factor"]; }

// correct: the widget values arrive as a plain array, in the order the widgets appear
expression: function (layersVals, inputs) { return layersVals[0] * inputs[0]; }
```

Inside `expression` you have: `layersVals` (the pixel values of the layers, in order),
`inputs`, and `this`, which is the calculation object — so `this.isNumeric(v)`,
`this.getValueFromLegend(...)` and `this.nullValue` are available.

**`inputs` is a plain array inside `expression`.** On the page, `inputs` also carries a map by
widget id — `inputs.id["factor"]` — but the inputs reach the worker as JSON, and JSON keeps only
an array's elements, so that map is gone there. Read values by **position**: `inputs[0]` is the
first input widget in `descriptionHtml`, `inputs[1]` the second, and so on (labels, buttons and
checkboxes are not inputs and take no position). Name-based access, `inputs.id[ID]`, works in
`beforeCalc`, `onInputsReady`, `afterCalc` and the `functions` map, which all run on the page.

Anything else must be computed in `beforeCalc` and passed in. How that works, and when each
callback runs, is the next chapter: [the execution model](/reference/execution-model/).

## 6. Widgets are text, not JavaScript

Interface elements are written as markup inside a layer's `descriptionHtml`, in double
braces, parameters separated by pipes:

```javascript
descriptionHtml: "Year {{slider|id=year|minValue=2000|maxValue=2024|value=2020}}"
```

This is a second, smaller language with its own escaping and parameter conventions, and it
has its own chapter: [the widget markup language](/reference/markup-widgets/).

## 7. Which JavaScript is available

A query is evaluated by the browser's own `eval`, so the language available is whatever the
visitor's browser supports — `let`, template literals, arrow functions (outside the
`this`-bound callbacks of §5.1), destructuring. There is no transpilation step and no
"write ES5" rule. The real constraints are the three above: one expression (§1), no page
context inside `expression` (§5.3), and regular functions where `this` matters (§5.1).

## 8. A complete query, annotated

```javascript
ExtjsUtils.QUERY.setQueryGlobalProperties({
  // Shared helper, reachable from every callback below.
  labelFor: function (value) { return value + " m"; },
}) &&
  ExtjsUtils.CONFIGURATION.setOptions({ backgroundSelector: true }) && [
    // A background layer: same array, marked by its group.
    { name: "mapnik", source: "osm", group: "background", visibility: true },

    // A named group with one calculated layer inside it.
    {
      viewTitle: "Elevation",
      color: "#8b0000",
      elements: [
        {
          title: "Terrain above the threshold",
          name: "CSR:altimetria",
          source: "calculate",
          visibility: true,
          descriptionHtml:
            "Minimum {{slider|id=threshold|minValue=0|maxValue=2000|value=800}}",
          // Runs on the page: may read the map, the DOM, other layers.
          beforeCalc: function (inputs) {
            this.setCalculateLegend([
              { color: [139, 0, 0], value: 1, title: window.labelFor(inputs.id["threshold"]) },
            ]);
          },
          // Runs in a worker: only layersVals, inputs and this.
          expression: function (layersVals, inputs) {
            return layersVals[0] >= inputs[0] ? 1 : this.nullValue; // inputs[0]: the slider
          },
        },
      ],
    },
  ];
```

## 9. When a query does not work

| Symptom | Almost always |
|---|---|
| Only the default background appears | The expression threw, or its value was not an array (§1) |
| A layer silently missing | Its `name` is not in the catalogue, or its server was registered after the array (§4) |
| `this.something is not a function` | An arrow function where the platform binds `this` (§5.1) |
| A value is `undefined` only inside `expression` | It came from a closure, the DOM or a global; pass it through `inputs` (§5.3) |
| Works once, breaks when re-applied | State kept outside `setQueryGlobalProperties` (§3) |
| "Global variable can't be redefined" | A global name collides with an existing page global (§3) |

The console is the primary instrument: the platform logs the reason it skipped a layer or
refused a global. A longer list, including properties that look meaningful but are ignored,
is in [pitfalls and properties that do nothing](/reference/pitfalls/).
