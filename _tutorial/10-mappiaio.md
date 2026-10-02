---
title: Your page and the map - MappiaIO
step: 10
permalink: /tutorial/mappiaio/
summary: "MappiaIO connects a page to an embedded map: the page applies queries and sends messages, the query answers and reports what the reader does."
learn:
  - "How a page loads a query into an embedded map with `applyQuery`."
  - "How messages travel both ways: `send` from the page, `ExtjsUtils.QUERY.postMessage` from the map."
  - "Where to find a complete page to start from."
try:
  - "Open the [complete page](/mappia-io/host-page.html), press its buttons and click a city on its map: every message shows in its log."
  - "In the [playground](/elements/mappia-io/#try-it), pick *MappiaIO* and send `{\"operation\":\"show_city\",\"message\":{\"name\":\"Manaus\"}}`."
  - "Copy the complete page from the MappiaIO page and open it from your computer: it works as it is."
more:
  - { title: "MappiaIO", url: "/elements/mappia-io/", why: "every step, the complete page, sites that use it" }
  - { title: "Embedding a map and talking to it", url: "/reference/embedding-and-messages/", why: "the full contract" }
---
{% raw %}
A map in an `<iframe>` (step 9) is a separate page. **MappiaIO** is the small library that lets
your page and the map work together. Your page loads it from the map server and connects to the
iframe:

```html
<iframe id="mappia" src="https://maps.csr.ufmg.br/calculator/?lang=eng"></iframe>
<script src="https://maps.csr.ufmg.br/mappia_io.js"></script>
<script>
  var mappia = MappiaIO("mappia", true);        // true: keep talking after connecting
  mappia.applyQuery('[{ name: "CSR:estados", visibility: true }]');
  mappia.send({ operation: "show_city", message: { name: "Belo Horizonte" } });
  mappia.addOnMessageCallback(function (msg) { console.log("the map says", msg); });
</script>
```

- **`applyQuery(text)`** loads a query into the map - any query of this tutorial, built by your
  page or kept in your own files. Every live example of these pages runs this way.
- **`send(object)`** delivers an object to the query, which receives it in the function it
  registered with **`ExtjsUtils.QUERY.setMappiaIoCallback`**.
- The query answers, or reports a click, with **`ExtjsUtils.QUERY.postMessage(object)`**; the page
  receives it in **`addOnMessageCallback`**.

Here is the map side of such a conversation: a query that lists, shows and adds cities when the
page asks, and tells the page which city the reader clicked. Its panel shows what the page asked
last.
{% endraw %}

{% include live-example.html id="mappia-io" %}

{% raw %}
On its own, as here, the map has no page to talk to. The [MappiaIO page](/elements/mappia-io/)
runs it with a page: a playground that sends it messages, a complete page you can copy, and real
sites built this way - a real-estate search and a tool for offline maps.

### You are done

You now know the parts every Mappia map is made of: layers and their names, sources and servers,
calculations and controls, groups, the `&&` chain and globals, the `ExtjsUtils` helpers, saving
and sharing, and MappiaIO. From here, the [tools](/tools/) show each widget and layer type with
runnable examples, and the [real maps](/examples/) show them together, at full scale.
{% endraw %}
