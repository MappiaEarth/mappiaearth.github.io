# Embedding a map and talking to it

> How a page embeds a Mappia map in an iframe with mappia_io.js, applies a query into it at runtime, and exchanges messages with the query running inside — the envelope, the handshake, the queueing and the failure modes.

Mappia reference, section "Integration". Page: https://mappia.earth/reference/embedding-and-messages/
Generated API entries: MappiaIO.MappiaIO, MappiaIO.applyQuery, MappiaIO.send, MappiaIO.addOnMessageCallback, MappiaIO.addReadyCallback, QUERY.setMappiaIoCallback, MappiaIO.postMessage, QUERY.setQueryGlobalProperties, QueryState, QUERY.addLayer, QUERY.removeLayer, URLProperties, URLOptions (https://mappia.earth/assets/api.json)

A Mappia map can be a page of its own, or a component inside somebody else's
application — an Angular dashboard, a plain HTML site, a CMS page. Embedded, it is an
`<iframe>`, and the host talks to the map by exchanging messages with it through the small
library the platform serves for that purpose, **`mappia_io.js`**.

Two halves have to agree: the **parent page**, which creates the connection and sends
messages, and the **query** inside the iframe, which receives them and answers. This page
describes both, and the contract between them. Worked examples - applying queries, both
message directions, request and answer, start-up order, progress, files - a complete page you
can copy ([/mappia-io/host-page.html](/mappia-io/host-page.html)), sites that run on it and a
live playground are on the [MappiaIO tool page](/elements/mappia-io/).

## 1. The two routes

| URL | What it is |
|---|---|
| `{origin}/calculator/?queryid=<id>` | The end-user view: the map, its layers and its widgets |
| `{origin}/editor/?queryid=<id>` | The same query in the developer view, with the query text and the editor tools |

Both accept the same URL parameters (`queryid`, `options`, `extent`, `lang`, `visiblelayers`,
…), documented in the [API reference](/api/) under **Sharing Maps**. The two pages do **not**
share live state: applying a query in the editor does not change an open calculator page.

## 2. Connecting from the parent page

```html
<iframe id="mappia" src="https://maps.csr.ufmg.br/calculator/?queryid=417&options=scale"></iframe>
<script src="https://maps.csr.ufmg.br/mappia_io.js"></script>
<script>
  var mappia = MappiaIO("mappia", true);
</script>
```

`MappiaIO(target, keepAfterReady)`:

| Argument | Meaning |
|---|---|
| `target` | The iframe's `id`, the iframe element itself, or the window object returned by `window.open` — the map can equally well live in a separate window |
| `keepAfterReady` | `true` keeps listening after the initial handshake. For an embed that keeps talking to the map, pass `true`; `false` is for a one-shot message |

The returned object is the connection. Its methods, all chainable:

| Method | What it does |
|---|---|
| `send(message[, forceSend])` | Sends a message to the query. Until the iframe reports ready, messages are **queued**, not dropped — `forceSend` skips the queue and is rarely needed |
| `applyQuery(text)` | Applies query text into the running iframe, replacing what it shows |
| `applyQueryFromUrl(url)` | Fetches the text and applies it (subject to the usual cross-origin rules) |
| `addOnMessageCallback(fn)` | Registers a handler for messages coming **from** the query |
| `addReadyCallback(fn)` | Runs `fn` when the iframe is ready (immediately, if it already is) |
| `isDomLoaded()` / `isDomAttached()` | The state of the connection |
| `remove()` | Stops listening — call it when the component holding the iframe is destroyed |
| `addOnRemoveCallback(fn)` | Notified when the connection is removed |

> **`noopener` and `noreferrer` break the connection.** They sever the window reference the
> messages travel on. Do not put them on the iframe, and do not pass them to `window.open`
> for a map window.

## 3. Loading a query into the frame

Two independent mechanisms, which can be combined:

| Mechanism | How | When to use it |
|---|---|---|
| Saved query | `?queryid=<number>` in the iframe URL | The query lives on the Mappia server |
| Runtime query | `mappia.applyQuery(text)` from the parent | The query text belongs to the host: generated per user, per selection, kept in the host's own repository |

A common shape is both: the iframe opens a saved query so something is on screen at once,
and the parent then applies a more specific query.

## 4. The message envelope

Every message is one JSON object. Only `operation` is structural; what it means is for the
parent and the query to agree on.

```javascript
{
  operation: "show_property",     // required: your own name for the action
  message: { id: 4711 },          // your payload
  type: "geojson",                // optional, your own
  overwrite: { title: "Farm 4711", visibility: true },  // optional layer overrides
  layerDefinitionsMode: false     // optional
}
```

The platform does not define an action vocabulary: `show_property`, `clear_selection`,
`export_png` are names **you** invent and implement in the query. The only reserved names
are the handshake ones in §6, all prefixed `mappia__`.

## 5. The query side

Inside the iframe, the query registers a handler and answers with `postMessage`:

```javascript
ExtjsUtils.QUERY.setQueryGlobalProperties({
  handleParentMessage: function (msg) {
    if (msg.operation === "show_property") {
      ExtjsUtils.QUERY.addLayer({
        name: "CSR:municipios",
        title: (msg.overwrite && msg.overwrite.title) || "Municipalities",
        visibility: true,
      });
      // answer the parent
      ExtjsUtils.QUERY.postMessage({ operation: "property_shown", message: msg.message });
    }
  },
}) &&
  ExtjsUtils.QUERY.setMappiaIoCallback(window.handleParentMessage) && [
    { name: "CSR:estados", visibility: true },
  ];
```

- `ExtjsUtils.QUERY.setMappiaIoCallback(fn)` registers the handler. (`setMessageCallback` is
  an older alias of the same function.)
- `ExtjsUtils.QUERY.postMessage(obj)` sends to the parent — to the containing page when
  embedded, to the opener when the map is a separate window. Objects are serialized for you.
- The parent receives it in every handler registered with `addOnMessageCallback`.

Because the handler is a function the query needs by name, it belongs in the query's globals
rather than in a top-level variable — see [the query language](/reference/query-language/) §3.

## 6. The handshake, and why nothing is lost

The two sides synchronise themselves before application messages flow. These `operation`
values are the platform's own; **never send them from application code**:

`mappia__checkDOM`, `mappia__confirmDOM`, `mappia__checkQueryListening`,
`mappia__confirmQueryListening`, `mappia__applyQuery`, `mappia__queryApplied`.

What the two sides guarantee:

- **Parent side**: `send` before the iframe reports ready is queued and flushed on ready.
- **Query side**: a message that arrives while a query is being applied is queued and handed
  to the handler once the load finishes.

So `applyQuery(...)` immediately followed by `send(...)` is safe: the message is delivered
after the new query is in place, not against the old one. Neither side silently drops
messages — they delay them.

Two of those platform messages also reach the parent's `addOnMessageCallback` handlers, as
plain strings: `mappia__queryApplied` after every `applyQuery` — the way to know the new
query is in place — and `mappia__confirmQueryListening` whenever a query registers its
callback. Handlers should skip strings starting with `mappia__` they do not use. The waiting mechanism is the same one described in
[the execution model](/reference/execution-model/) §5.

## 7. A complete parent-side integration

```javascript
var mappia = MappiaIO("mappia", true);

// Receive first, so nothing sent below can outrun the handler.
mappia.addOnMessageCallback(function (msg) {
  if (msg.operation === "property_shown") {
    document.getElementById("status").textContent = "Showing " + msg.message.id;
  }
});

mappia.addReadyCallback(function () {
  fetch("/queries/properties.js")
    .then(function (response) { return response.text(); })
    .then(function (queryText) {
      mappia.applyQuery(queryText);
      mappia.send({ operation: "show_property", message: { id: 4711 } });
    });
});

// When the component is destroyed
// mappia.remove();
```

Worth wrapping `send` in one small module per integration, with a function per operation
name, so the host's UI code never repeats a raw string and the contract is written down in
one place.

A complete, copyable page in this shape - its own buttons driving the map, the map's panel
button and clicks reporting back, a log of every message - is published at
[/mappia-io/host-page.html](/mappia-io/host-page.html).

## 8. Failure modes

| Symptom | Cause |
|---|---|
| Nothing arrives, in either direction | `noopener` / `noreferrer` on the iframe or the opened window (§2) |
| Messages arrive before the query is ready, and are ignored | The query registered no handler — `setMappiaIoCallback` is what makes it listen (§5) |
| The map answers the first message and then goes quiet | The connection was created with `keepAfterReady = false` |
| Re-used iframe never answers again | The connection was removed and the iframe was not loaded afresh; create the connection again after a real load |
| A handler runs with the previous query's layers | The message was sent without waiting; the handshake covers `applyQuery`, but a message sent during a user-triggered reload of the whole frame is a different race — wait for ready (§2) |
| A query that registers no callback still answers like the previous one | The callback set by `setMappiaIoCallback` is kept when another query is applied, until a query registers its own. A handler should check that what it works on still exists |
| The parent receives raw events it cannot read | Messages travel wrapped; read them through the callback rather than listening on `window` yourself |

Operation names seen in an existing integration are that integration's choices, not platform
API. When in doubt, the reserved prefix is `mappia__`, and everything else is yours.
