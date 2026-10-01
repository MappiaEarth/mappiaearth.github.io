---
layout: element
title: "MappiaIO (embed a map, talk to it)"
tool_group: page
playground: true
# The card on /tools/ shows the host page (the page and the map talking), not the bare map.
example_picture: mappia-io-host-page
summary: "Put a Mappia map inside your own page and make them work together: your buttons drive the map, the map tells your page what the user did."
categories: [MappiaIO, QUERY]
api:
  - key: MappiaIO
  - key: QUERY
    tags: ['setMappiaIoCallback', 'setQueryGlobalProperties', 'getMappiaMessage']
type: Element
---
A Mappia map can live inside any page - a dashboard, a store front, a form, a plain HTML file -
and work with it. **MappiaIO** is the small library that connects the two: your page loads
`https://maps.csr.ufmg.br/mappia_io.js`, embeds the calculator in an `<iframe>`, and from then on
its buttons, lists and forms drive the map, while the map tells the page what the user clicked,
hovered or drew. The page decides what the map shows (`applyQuery`); the two exchange plain
objects (`send` one way, `ExtjsUtils.QUERY.postMessage` the other).

<figure class="io-hero">
  <a href="{{ '/mappia-io/host-page.html' | relative_url }}" target="_blank" rel="noopener" title="Open this page live">
    <img src="{{ '/assets/img/examples/mappia-io-host-page_thumb.jpg' | relative_url }}"
         srcset="{{ '/assets/img/examples/mappia-io-host-page_thumb.jpg' | relative_url }} 800w, {{ '/assets/img/examples/mappia-io-host-page.jpg' | relative_url }} 1600w"
         sizes="(max-width: 900px) 100vw, 900px"
         alt="A web page with its own buttons and a message log on the left and an embedded Mappia map on the right. The map's panel says what the page asked; the page shows the cities the map reported.">
  </a>
  <figcaption>
    A page with a map in it, mid-conversation. On the left, <strong>your page</strong>: its
    buttons asked the map to show Belo Horizonte, and its log lists every message both ways. On
    the right, <strong>the map</strong>: its panel says what the page asked, a click on Rio de
    Janeiro and the panel's own button reported back to the page.
    <a href="{{ '/mappia-io/host-page.html' | relative_url }}" target="_blank" rel="noopener">Open it live</a> ·
    <a href="#a-complete-page">read its source</a>
  </figcaption>
</figure>

<nav class="tool-onpage io-onpage" aria-label="On this page">
  <a href="#how-a-message-travels">How a message travels</a>
  <a href="#try-it">Try it</a>
  <a href="#a-complete-page">A complete page</a>
  <a href="#build-it-step-by-step">Step by step</a>
  <a href="#in-production">In production</a>
  <a href="#things-to-know">Things to know</a>
</nav>

## How a message travels

Two windows - your page and the map inside its iframe - can only talk through the browser's
`window.postMessage`. MappiaIO wraps every message as `{mappia_iframe: "<JSON text>"}` and handles
the start-up, so you only deal with your own objects:

<ol class="io-flow" aria-label="The messages between your page and the map, in order">
  <li class="io-flow__head"><span>Your page (<code>mappia_io.js</code>)</span><span></span><span>The map (platform and your query)</span></li>
  <li><span><code>MappiaIO("mappia", true)</code></span><span class="io-flow__wire is-right">mappia__checkDOM</span><span>The platform hears the greeting</span></li>
  <li><span>Queued messages go out; <code>addReadyCallback</code> functions run</span><span class="io-flow__wire is-left">mappia__confirmDOM</span><span>The platform answers: listening</span></li>
  <li><span><code>applyQuery(text)</code></span><span class="io-flow__wire is-right">mappia__applyQuery</span><span>The platform loads your query</span></li>
  <li><span>A <code>mappia__...</code> string: a platform notice</span><span class="io-flow__wire is-left">mappia__confirmQueryListening</span><span>The query calls <code>ExtjsUtils.QUERY.setMappiaIoCallback(fn)</code></span></li>
  <li><span>The new layers are in place</span><span class="io-flow__wire is-left">mappia__queryApplied</span><span>The platform finished applying</span></li>
  <li class="is-yours"><span><code>send({operation, message})</code></span><span class="io-flow__wire is-right">your object</span><span><code>fn(object)</code> runs in the query</span></li>
  <li class="is-yours"><span><code>addOnMessageCallback(fn)</code>: <code>fn(object)</code></span><span class="io-flow__wire is-left">your object</span><span><code>ExtjsUtils.QUERY.postMessage(object)</code></span></li>
</ol>

- **Before the handshake nothing is lost**: `send` and `applyQuery` called right away wait in a
  queue and go out, in order, once the map answers.
- **Your messages are plain objects.** They travel as JSON, so numbers, text, arrays and nested
  objects arrive intact; functions and dates do not. By convention an object names an
  `operation` and carries a `message`, plus a `requestId` when the page waits for an answer.
- **Strings starting with `mappia__` belong to the platform.** Your page receives them too
  (`mappia__queryApplied` is the useful one); never send them.
- The page and the map may be on different sites - this page, on mappia.earth, talks to
  maps.csr.ufmg.br - and a message takes about 150 ms to arrive.

## Try it

The playground below is a page talking to an embedded map exactly as yours would. Pick any
example of this documentation and apply it with `applyQuery`, edit it and apply it again, or
pick **MappiaIO** - the cities example of this page - and send it messages. The cities example
also talks back: click a city, or press **Send the cities in view to the page** in the map's
panel, and watch the message arrive.

<div class="io-playground" id="io-playground">
  <div class="io-playground__map">
    <iframe title="Live map driven by the playground"></iframe>
    <button type="button" class="io-playground__start">&#9654; Start the live map</button>
  </div>
  <div class="io-playground__panel">
    <h3>1. Apply a query <code>applyQuery(text)</code></h3>
    <label class="io-playground__label" for="io-example">Example</label>
    <select id="io-example">
      {% for entry in site.data.widget_examples %}
        {% assign exampleTitle = entry[0] %}
        {% assign examplePage = site.elements | where: "slug", entry[0] | first %}
        {% if examplePage %}{% assign exampleTitle = examplePage.title %}{% endif %}
        <option value="{{ entry[0] }}"{% if entry[0] == "mappia-io" %} selected{% endif %}>{{ exampleTitle }}</option>
      {% endfor %}
    </select>
    <label class="io-playground__label" for="io-query">Query text - edit it freely</label>
    <textarea id="io-query" rows="9" spellcheck="false"></textarea>
    <button type="button" id="io-apply" disabled>applyQuery</button>

    <h3>2. Send a message <code>send(object)</code></h3>
    <p class="io-playground__note">The cities example answers these; other examples ignore them. Its own button in the map's panel talks back.</p>
    <div class="io-playground__quick">
      <button type="button" data-message='{"operation":"list_cities","requestId":"r1"}'>list_cities</button>
      <button type="button" data-message='{"operation":"show_city","message":{"name":"Belo Horizonte"}}'>show_city</button>
      <button type="button" data-message='{"operation":"add_city","message":{"name":"Recife","lon":-34.88,"lat":-8.05,"population":1488920}}'>add_city</button>
    </div>
    <textarea id="io-message" rows="3" spellcheck="false">{"operation":"show_city","message":{"name":"Manaus"}}</textarea>
    <button type="button" id="io-send" disabled>send</button>

    <h3>3. Messages</h3>
    <ol class="io-playground__log" id="io-log" aria-live="polite">
      <li class="is-note">Start the live map, then apply a query.</li>
    </ol>
  </div>
</div>
<script type="application/json" id="io-examples">{{ site.data.widget_examples | jsonify }}</script>
<script src="{{ '/assets/js/mappia-live.js' | relative_url }}"></script>
<script>
  (function () {
    var root = document.getElementById("io-playground");
    var examples = JSON.parse(document.getElementById("io-examples").textContent);
    var frame = root.querySelector("iframe");
    var start = root.querySelector(".io-playground__start");
    var select = document.getElementById("io-example");
    var queryBox = document.getElementById("io-query");
    var messageBox = document.getElementById("io-message");
    var applyButton = document.getElementById("io-apply");
    var sendButton = document.getElementById("io-send");
    var log = document.getElementById("io-log");
    var live = null;

    function write(kind, label, payload) {
      var item = document.createElement("li");
      item.className = "is-" + kind;
      var head = document.createElement("strong");
      head.textContent = label;
      item.appendChild(head);
      if (payload !== undefined) {
        var body = document.createElement("code");
        body.textContent = typeof payload === "string" ? payload : JSON.stringify(payload);
        item.appendChild(body);
      }
      log.insertBefore(item, log.firstChild);
    }

    function showExample() {
      queryBox.value = (examples[select.value] || { query: "" }).query;
    }
    select.addEventListener("change", showExample);
    // ?example=<page id>: a tool page's "edit it in the playground" link opens with its example
    var requested = /[?&]example=([^&#]+)/.exec(window.location.search);
    if (requested && examples[decodeURIComponent(requested[1])]) {
      select.value = decodeURIComponent(requested[1]);
    }
    showExample();

    start.addEventListener("click", function () {
      start.hidden = true;
      root.classList.add("is-live");
      log.innerHTML = "";
      write("note", "Loading the map...");
      MappiaLive.connect(frame).then(function (connection) {
        live = connection;
        live.onMessage(function (msg) {
          var isPlatform = typeof msg === "string" && msg.indexOf("mappia__") === 0;
          write(isPlatform ? "platform" : "in", isPlatform ? "← platform" : "← from the map", msg);
        });
        applyButton.disabled = false;
        sendButton.disabled = false;
        write("note", "Connected to " + live.origin + ". Applying the selected example...");
        applyButton.click();
      }).catch(function (error) {
        write("error", "The live map did not answer: " + error.message);
        start.hidden = false;
        root.classList.remove("is-live");
      });
    });

    applyButton.addEventListener("click", function () {
      if (!live) return;
      applyButton.disabled = true;
      write("out", "→ applyQuery", queryBox.value.length + " characters");
      live.apply(queryBox.value).then(function () {
        write("note", "Query applied.");
      }).catch(function (error) {
        write("error", error.message);
      }).then(function () {
        applyButton.disabled = false;
      });
    });

    function sendText(text) {
      var message;
      try {
        message = JSON.parse(text);
      } catch (e) {
        write("error", "Not JSON: " + e.message);
        return;
      }
      write("out", "→ send", message);
      live.send(message);
    }
    sendButton.addEventListener("click", function () { if (live) sendText(messageBox.value); });
    Array.prototype.forEach.call(root.querySelectorAll("[data-message]"), function (button) {
      button.addEventListener("click", function () {
        messageBox.value = button.getAttribute("data-message");
        if (live) sendText(messageBox.value);
      });
    });
  })();
</script>
<style>
  .io-playground { display: grid; grid-template-columns: minmax(0, 3fr) minmax(280px, 2fr); gap: 18px; margin: 10px 0 34px; }
  .io-playground__map { position: relative; min-height: 460px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;
    background: #eef2f7 url("{{ '/assets/img/examples/mappia-io_thumb.jpg' | relative_url }}") center / cover no-repeat; }
  .io-playground__map iframe { display: none; width: 100%; height: 100%; min-height: 460px; border: 0; }
  .io-playground.is-live .io-playground__map iframe { display: block; }
  .io-playground__start { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); padding: 11px 22px; border: 0;
    border-radius: 24px; background: #277cea; color: #fff; font-weight: 600; font-size: 16px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(39, 124, 234, .35); }
  .io-playground__start:focus-visible { outline: 3px solid #f39c12; outline-offset: 2px; }
  .io-playground__panel h3 { font-size: 16px; margin: 0 0 8px; }
  .io-playground__panel h3:not(:first-child) { margin-top: 20px; }
  .io-playground__panel h3 code { font-size: 13px; font-weight: 400; }
  .io-playground__label { display: block; font-size: 13px; color: #4b5563; margin: 6px 0 2px; }
  .io-playground__panel select, .io-playground__panel textarea { width: 100%; box-sizing: border-box; font-size: 13px; }
  .io-playground__panel textarea { font-family: Menlo, Consolas, monospace; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; }
  .io-playground__panel button { margin-top: 6px; padding: 5px 14px; border: 1px solid #277cea; border-radius: 6px; background: #fff;
    color: #277cea; font-weight: 600; cursor: pointer; }
  .io-playground__panel button:disabled { opacity: .45; cursor: default; }
  .io-playground__quick button { margin-right: 4px; font-family: Menlo, Consolas, monospace; font-weight: 400; font-size: 13px; }
  .io-playground__note { font-size: 13px; color: #6b7280; margin: -4px 0 4px; }
  .io-playground__log { list-style: none; margin: 0; padding: 0; max-height: 260px; overflow-y: auto; font-size: 13px;
    border: 1px solid #e5e7eb; border-radius: 6px; }
  .io-playground__log li { padding: 5px 8px; border-bottom: 1px solid #f1f5f9; }
  .io-playground__log li code { display: block; white-space: pre-wrap; word-break: break-word; background: none; padding: 0; }
  .io-playground__log .is-in strong { color: #15803d; }
  .io-playground__log .is-out strong { color: #277cea; }
  .io-playground__log .is-platform { color: #6b7280; }
  .io-playground__log .is-error { color: #b91c1c; }
  .io-playground__log .is-note { color: #4b5563; font-style: italic; }
  @media (max-width: 900px) { .io-playground { grid-template-columns: 1fr; } }
</style>

## A complete page

The page in the picture above is one HTML file you can copy and open as it is. Its parts, in the
order a page needs them:

1. **The map and the library**: an `<iframe>` with the calculator, and `mappia_io.js` from the
   map server.
2. **The connection**: `MappiaIO("mappia", true)` - `true` because the page keeps talking to the
   map after the start-up.
3. **The page's buttons** call `send` (show a city, add one) or `ask` - a `send` with a
   `requestId` that resolves when the map answers with the same id (list the cities).
4. **One `addOnMessageCallback`** handles everything the map says: the answers to `ask`, the
   city the user clicked, the cities the panel's button reported, and `mappia__queryApplied`,
   which enables the buttons.
5. **`addReadyCallback`** applies the query - `applyQueryFromUrl("cities-query.js")`, a file
   next to the page - as soon as the map listens.

The map side is the **MappiaIO** example of the playground: a query that registers its
listener with `ExtjsUtils.QUERY.setMappiaIoCallback`, answers with
`ExtjsUtils.QUERY.postMessage`, and has its own button in the panel.

{% capture hostPage %}{% include mappia-io-host-page.html %}{% endcapture %}
<details class="io-source">
  <summary>The whole page - <code>host-page.html</code> ({{ hostPage | newline_to_br | split: '<br />' | size }} lines)</summary>
  <pre class="io-source__code"><code>{{ hostPage | xml_escape }}</code></pre>
</details>

{% raw %}
## Build it step by step

### 1. Embed a map and apply a query

`applyQuery` sends query text - the same text you would type in the editor - into the map.
Called before the map has finished loading, it waits: MappiaIO queues it until the map
answers the handshake.

```html
<iframe id="mappia" src="https://maps.csr.ufmg.br/calculator/?lang=eng&options=scale"
        width="100%" height="600"></iframe>
<script src="https://maps.csr.ufmg.br/mappia_io.js"></script>
<script>
  // true: keep listening after the handshake (needed to receive messages later)
  var mappia = MappiaIO("mappia", true);
  mappia.applyQuery('[{ name: "CSR:estados", title: "States", visibility: true }]');
</script>
```

The query does not have to be saved on the server: it can be built by your page, kept in your
own repository, or fetched - `mappia.applyQueryFromUrl("/queries/states.js")` fetches the text
and applies it.

### 2. One map, many queries

The same connection can apply one query after another, and every apply replaces what the map
shows. The map confirms each one with the message `mappia__queryApplied`, which is how the
page knows the new layers are in place. Every "Run it live" button of this documentation works
this way.

```html
<button data-query="states">States</button>
<button data-query="elevation">Elevation</button>
<span id="status"></span>
<script>
  var queries = {
    states: '[{ name: "CSR:estados", title: "States", visibility: true }]',
    elevation: '[{ name: "CSR:altimetria", title: "Elevation", opacity: 0.8, visibility: true }]'
  };
  var mappia = MappiaIO("mappia", true);
  mappia.addOnMessageCallback(function (msg) {
    if (msg === "mappia__queryApplied") {
      document.getElementById("status").textContent = "Map updated";
    }
  });
  document.querySelectorAll("button[data-query]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.getElementById("status").textContent = "Loading...";
      mappia.applyQuery(queries[button.getAttribute("data-query")]);
    });
  });
</script>
```

### 3. Your page's buttons drive the map

A button, a list, a form field of your page sends an object with `send`. Its shape is yours to
choose; by convention it names an `operation` and carries a `message`:

```html
<select id="city"><option>Belo Horizonte</option><option>Manaus</option></select>
<button id="show">Show on the map</button>
<script>
  document.getElementById("show").addEventListener("click", function () {
    mappia.send({ operation: "show_city", message: { name: document.getElementById("city").value } });
  });
</script>
```

Inside the map, the query registers the function that receives them with
`ExtjsUtils.QUERY.setMappiaIoCallback`. The function has to be reachable by name, so it is
declared as a query global (the complete query is in the playground above - pick **MappiaIO**):

```javascript
ExtjsUtils.QUERY.setQueryGlobalProperties({
  citiesLayer: null, // set by the layer's onAdded
  onPageMessage: function (msg) {
    var layer = window.citiesLayer;
    if (!msg || !msg.operation || !layer) return;
    if (msg.operation === "show_city") {
      var city = layer.features.filter(function (f) { return f.attributes.name === msg.message.name; })[0];
      if (city) layer.map.setCenter(city.geometry.getBounds().getCenterLonLat(), 7);
      ExtjsUtils.QUERY.postMessage({ operation: "city_shown", message: { name: msg.message.name, found: !!city } });
    }
  }
}) && ExtjsUtils.QUERY.setMappiaIoCallback(window.onPageMessage) && [
  { title: "Cities", name: "cities", source: "file", type: "json", fromProj: "EPSG:4326", json: { /* ... */ },
    onAdded: function (event) { window.citiesLayer = (event && event.layer) || this; } }
]
```

The page can also drive the map's own widgets: a message that moves a slider recalculates the
layer exactly as a drag would, so a field of your page can set a threshold on the map.

```javascript
// map side, in onPageMessage
if (msg.operation === "set_threshold") {
  Ext.getCmp("threshold").setValue(0, msg.message.value, false, true); // the slider of the layer panel
}
```

### 4. The map's buttons and clicks report to your page

`ExtjsUtils.QUERY.postMessage(object)` goes the other way. Anything in the query can call it: a
click on a feature, a hover, a drawing finished, a button of the layer panel.

```javascript
// map side: a button in the layer panel, and a click on a city
descriptionHtml: "{{button|id=send_view|text=Send the cities in view to the page|handler=sendViewToPage}}",
onClick: function (feature) {
  ExtjsUtils.QUERY.postMessage({ operation: "city_clicked", message: feature.attributes });
},
// ...and sendViewToPage, a query global:
sendViewToPage: function () {
  var view = window.citiesLayer.map.getExtent();
  var inView = window.citiesLayer.features.filter(function (f) {
    return view.containsLonLat(f.geometry.getBounds().getCenterLonLat());
  });
  ExtjsUtils.QUERY.postMessage({ operation: "cities_in_view",
    message: { cities: inView.map(function (f) { return f.attributes.name; }) } });
}
```

```javascript
// page side: one listener for everything the map says
mappia.addOnMessageCallback(function (msg) {
  if (msg && msg.operation === "city_clicked") {
    document.getElementById("details").textContent =
      msg.message.name + ": " + msg.message.population + " inhabitants";
  } else if (msg && msg.operation === "cities_in_view") {
    document.getElementById("details").textContent = msg.message.cities.join(", ");
  }
});
```

### 5. Ask and wait for the answer

Messages are one-way. For a question with an answer, send an id and have the query echo it back,
then match the two in the page:

```javascript
var waiting = {}, lastId = 0;
mappia.addOnMessageCallback(function (msg) {
  if (msg && msg.requestId && waiting[msg.requestId]) {
    waiting[msg.requestId](msg);
    delete waiting[msg.requestId];
  }
});
function ask(operation, message) {
  var requestId = "request-" + (++lastId);
  return new Promise(function (resolve) {
    waiting[requestId] = resolve;
    mappia.send({ operation: operation, message: message, requestId: requestId });
  });
}

ask("list_cities").then(function (answer) {
  console.log(answer.message.length + " cities on the map", answer.message);
});
```

```javascript
// map side: answer with the same requestId
ExtjsUtils.QUERY.postMessage({ operation: "cities", requestId: msg.requestId, message: names });
```

### 6. Start in the right order

A page that sends its starting state - the filters of the URL, the record being edited - needs
the map listening and the query applied first. `addReadyCallback` runs once the map has
answered the handshake; apply the query there, then send the state:

```javascript
var mappia = MappiaIO("mappia", true);
mappia.addOnMessageCallback(onMapMessage);
mappia.addReadyCallback(function () {
  mappia.applyQueryFromUrl("/js/my-map-query.js").then(function () {
    mappia.send({ operation: "setFilters", message: currentFilters });
    if (sharedView) mappia.send({ operation: "flyTo", message: sharedView }); // a shared link reopens the same view
  });
});
```

Messages sent right after `applyQuery` reach the new query: it registers its listener while it
is applied, and the platform holds the messages until then.

### 7. Let the map report on its own

The map does not have to wait to be asked. A long job reports its progress, a pan reports
what is now in view, a request to your server reports that it started and ended - the page
keeps its own list, counters and spinners in step:

```javascript
// map side: progress of a download, tagged with the request it belongs to
ExtjsUtils.OFFLINE.downloadArea({
  name: msg.message.name, extent: msg.message.extent,
  onProgress: function (progress) {
    ExtjsUtils.QUERY.postMessage({ operation: "download.progress", requestId: msg.requestId, message: progress });
  }
}).then(function (area) {
  ExtjsUtils.QUERY.postMessage({ operation: "download.result", requestId: msg.requestId, message: area });
});
```

```javascript
// page side: progress updates the bar; the result settles the request
mappia.addOnMessageCallback(function (msg) {
  if (msg && msg.operation === "download.progress") {
    progressBar.value = msg.message.done / msg.message.total;
  }
});
```

### 8. Send a file

A file the user picked in your page can go to the map as it is - for the query to read,
import or upload:

```javascript
fileInput.addEventListener("change", function () {
  mappia.send({ operation: "importFromFile", message: { file: fileInput.files[0], name: "My area" } });
});
```

A message that carries a `File` or `Blob` is not turned into JSON: the browser copies the file
along with it. This needs the next release of `mappia_io.js`; the version on maps.csr.ufmg.br
today still turns a file into `{}`.
{% endraw %}

## In production

MappiaIO is how Mappia maps are put to work inside other products. Three of them:

<div class="io-cases">
  <article class="io-case">
    <a class="io-case__shot" href="https://larbh.com.br/mapa/" target="_blank" rel="noopener" title="Open larbh.com.br/mapa">
      <img src="{{ '/assets/img/examples/mappia-io-larbh_thumb.jpg' | relative_url }}" loading="lazy"
           alt="LarBH: a list of listings with prices on the left, a map of Belo Horizonte with clusters of listings on the right">
    </a>
    <div class="io-case__text">
      <h3><a href="https://larbh.com.br/mapa/" target="_blank" rel="noopener">LarBH - real-estate search in Belo Horizonte</a></h3>
      <p>The whole search is a page around a Mappia map. Its query starts with no layers at all:
      it draws the listings from code, coloured by price, and the page and the map keep each other
      in step - the map understands <strong>17 operations</strong> from the page and sends
      <strong>11</strong> back. The count "111.197 imóveis na área", the listing column and the
      neighbourhood list are built from what the map reports after every pan and zoom. A listing's
      detail has a second, small map with the places nearby: one page, two maps, a connection each.</p>
      <table class="io-case__messages">
        <thead><tr><th>Page → map</th><th>Map → page</th></tr></thead>
        <tbody>
          <tr><td><code>setFilters</code> - the page's filters</td><td><code>viewportData</code> - the listings, counts and neighbourhoods in view</td></tr>
          <tr><td><code>flyTo</code>, <code>flyToExtent</code> - the search box, a shared link</td><td><code>pinClicked</code> - opens the listing in the page</td></tr>
          <tr><td><code>highlightListing</code> - the list row under the pointer</td><td><code>hoverCluster</code> - marks the same listings in the list</td></tr>
          <tr><td><code>showNearbyPois</code>, <code>selectPoiCategory</code> - places near a listing, on its small map</td><td><code>openGroup</code>, <code>groupClusterDeselected</code> - a cluster's listings</td></tr>
          <tr><td><code>setEscala</code> - the price colour scale</td><td><code>fetchStart</code>, <code>fetchEnd</code> - the page's loading bar</td></tr>
          <tr><td><code>setLastVisit</code>, <code>markLastViewed</code> - what is new since the last visit</td><td><code>mapPointerDown</code> - closes the page's address suggestions</td></tr>
        </tbody>
      </table>
      {% raw %}
      <pre class="io-case__code"><code>// how it starts (simplified)
var mappia = new MappiaIO("mappia-frame", true);
mappia.addOnMessageCallback(onTenantMessage);
mappia.addReadyCallback(function () {
  fetch("/js/imoveis-tenant-query.js")             // the query lives in the site's own code
    .then(function (r) { return r.text(); })
    .then(function (text) {
      mappia.applyQuery(text);
      mappia.send({ operation: "setEscala", message: { escala: LARBH_ESCALA } });
      mappia.send({ operation: "setFilters", message: filters });
    });
});</code></pre>
      {% endraw %}
    </div>
  </article>

  <article class="io-case">
    <div class="io-case__shot">
      <img src="{{ '/assets/img/examples/mappia-io-offline-areas_thumb.jpg' | relative_url }}" loading="lazy"
           alt="The offline areas page: a panel with the service worker status, a live feed of tiles and the map's layers on the left, the embedded map with a property boundary over satellite imagery on the right">
    </div>
    <div class="io-case__text">
      <h3>Offline map areas - a whole tool outside the platform</h3>
      <p>Choosing which layers and which area to download for use without a network, estimating
      the size, downloading with progress, switching areas on and off, importing a zip: a
      complete tool, built as an ordinary page around the map (MappiaExplorer's
      <code>examples/offline-areas-demo</code>). The page holds every control; the map does the
      work with <code>ExtjsUtils.OFFLINE</code> and answers - <strong>23 operations</strong>,
      each a question with a <code>requestId</code>.</p>
      <ul>
        <li>The layer list is the map's answer to <code>offlineAreas.listAvailableLayers</code>;
          the area is <code>offlineAreas.getImovelView</code> - the property's own boundary.</li>
        <li><code>offlineAreas.download</code> answers many times: <code>.progress</code> while
          it runs, then <code>.result</code> or <code>.error</code>, all with the request's id.</li>
        <li>The tile feed under the status is pushed by the map without being asked
          (<code>offlineAreas.mapCacheDebug</code>): how each tile was served, as it happens.</li>
        <li>Importing sends the zip the user picked, as a file (<code>offlineAreas.importFromFile</code>).</li>
      </ul>
    </div>
  </article>

  <article class="io-case">
    <div class="io-case__text io-case__text--wide">
      <h3>This documentation</h3>
      <p>Every <strong>Run it live</strong> button of these pages and the playground above load
      the calculator in an iframe and send the example with <code>applyQuery</code>, waiting for
      <code>mappia__queryApplied</code> before saying the map is ready
      (<code>assets/js/mappia-live.js</code> of this site).</p>
    </div>
  </article>
</div>

{% raw %}
## Things to know

- **Pass `true` as the second argument** whenever the page keeps talking to the map. With
  `false` MappiaIO stops listening after the handshake, and nothing from the map arrives.
- **One listener, many operations.** Register one `addOnMessageCallback` and branch on
  `operation`, as the complete page does; each registered function receives every message.
- **The page also receives the platform's own notices**, as plain strings starting with
  `mappia__`: `mappia__queryApplied` after every `applyQuery`, `mappia__confirmQueryListening`
  when a query registers its callback. Use the first; skip the rest. Never send them yourself.
- **`applyQuery` returns no promise.** Wait for `mappia__queryApplied` to know the layers are in
  place (`applyQueryFromUrl` returns one, but it settles when the text was sent).
- **A query's message callback outlives it.** When a later query registers no callback of its
  own, messages still reach the previous one - so a handler should check that what it works on
  still exists, as `onPageMessage` does with `citiesLayer` above.
- **`noopener` and `noreferrer` break the connection**, on the iframe or in `window.open`.
  MappiaIO works with a separate window too: `MappiaIO(window.open(url), true)`.
- **Drop the connection with the map**: when your page removes the iframe (a closed panel, a
  route change), call `remove()` so the old connection stops receiving messages.
{% endraw %}

<style>
  .io-hero { margin: 18px 0 8px; }
  .io-hero img { display: block; width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 8px; }
  .io-hero figcaption { margin-top: 8px; font-size: 14px; color: #4b5563; }
  .io-onpage { margin: 14px 0 6px; }
  .io-flow { list-style: none; margin: 14px 0 18px; padding: 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; font-size: 14px; }
  .io-flow li { display: grid; grid-template-columns: minmax(0, 1fr) 210px minmax(0, 1fr); gap: 12px; align-items: center;
    padding: 8px 12px; border-top: 1px solid #f1f5f9; }
  .io-flow li:first-child { border-top: 0; }
  .io-flow li > span:last-child { text-align: right; }
  .io-flow .io-flow__head { background: #f8fafc; font-weight: 700; color: #374151; }
  .io-flow .is-yours { background: #f0f7ff; }
  .io-flow__wire { position: relative; display: block; padding: 2px 0 6px; text-align: center; font: 12px/1.3 Menlo, Consolas, monospace;
    color: #6b7280; border-bottom: 2px solid #9ca3af; }
  .io-flow .is-yours .io-flow__wire { color: #1d4ed8; border-bottom-color: #277cea; font-weight: 600; }
  .io-flow__wire::after { content: ""; position: absolute; bottom: -6px; width: 0; height: 0; border: 5px solid transparent; }
  .io-flow__wire.is-right::after { right: -2px; border-left: 8px solid #9ca3af; border-right: 0; }
  .io-flow__wire.is-left::after { left: -2px; border-right: 8px solid #9ca3af; border-left: 0; }
  .io-flow .is-yours .io-flow__wire.is-right::after { border-left-color: #277cea; }
  .io-flow .is-yours .io-flow__wire.is-left::after { border-right-color: #277cea; }
  .io-source { margin: 10px 0 26px; }
  .io-source summary { cursor: pointer; font-weight: 600; }
  .io-source__code { max-height: 520px; overflow: auto; font-size: 12.5px; }
  .io-cases { display: grid; gap: 22px; margin: 14px 0 30px; }
  .io-case { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: 18px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 10px; }
  .io-case__shot img { display: block; width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 6px; }
  .io-case__text h3 { margin: 0 0 8px; font-size: 18px; }
  .io-case__text--wide { grid-column: 1 / -1; }
  .io-case__text p, .io-case__text li { font-size: 14.5px; }
  .io-case__messages { width: 100%; border-collapse: collapse; font-size: 13px; margin: 10px 0; }
  .io-case__messages th, .io-case__messages td { text-align: left; vertical-align: top; padding: 5px 6px; border-bottom: 1px solid #f1f5f9; }
  .io-case__messages th { color: #374151; }
  .io-case__code { font-size: 12.5px; overflow-x: auto; }
  @media (max-width: 900px) {
    .io-flow li { grid-template-columns: 1fr; gap: 4px; }
    .io-flow li > span:last-child { text-align: left; }
    .io-flow .io-flow__head span:nth-child(2) { display: none; }
    .io-case { grid-template-columns: 1fr; }
  }
</style>
