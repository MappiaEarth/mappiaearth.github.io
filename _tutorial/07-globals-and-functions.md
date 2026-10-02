---
title: The && chain, globals and functions
step: 7
permalink: /tutorial/globals-and-functions/
summary: "Setup calls joined with && before the layers, setQueryGlobalProperties for shared values and functions, runNow, and functions called from buttons."
learn:
  - "How setup code joins the query with `&&`."
  - "How `ExtjsUtils.QUERY.setQueryGlobalProperties` declares values and functions the query shares."
  - "`runNow`, and how buttons find the function they call."
try:
  - "Change `CAPITAL` to another city - Manaus is at longitude -60.02, latitude -3.12."
  - "Add a third button that calls `goToCapital` too: two buttons, one function."
  - "Write `var x = 1;` before `ExtjsUtils.QUERY...` and run it: the map opens without your layers - a statement breaks the expression."
  - "Turn `sayTitle` into an arrow function, `sayTitle: () => ...`: `this` is no longer the layer, and the title is lost."
more:
  - { title: "How a query is evaluated - the && chain, state and functions", url: "/reference/query-language/" }
  - { title: "Button", url: "/elements/button-widget/" }
  - { title: "Pitfalls", url: "/reference/pitfalls/" }
---
{% raw %}
A query is one expression (step 1), so it cannot declare variables or run statements before the
list of layers. Setup is done with **calls joined by `&&`**: each call does its work and returns
`true`, so the expression goes on, and the last value - the list - is what the platform keeps.

```javascript
SetupCall(...) && OtherSetupCall(...) && [ /* the layers */ ];
```

`addRemoteWMSServer` (step 3) was one. The most useful one is
**`ExtjsUtils.QUERY.setQueryGlobalProperties`**: each key of the object becomes a name the whole
query can use - a value, a list, a function - for as long as this query is applied. Applying
another query removes them.
{% endraw %}

{% include live-example.html id="tutorial-07-globals-and-functions" %}

{% raw %}
### What happens

- **`CAPITAL`** is a shared value; **`goToCapital`** a shared function that uses it.
- **`runNow`** is the one name the platform calls by itself: once, when the query is applied,
  after the globals are in place - here, to greet the reader.
- **Buttons name the function they call**: `{{button|handler=goToCapital}}`. The platform looks
  for the name first in the layer's own **`functions`** - where `this` is the layer, as in
  `sayTitle` - and then among the globals.
- Write these as regular `function`s: an arrow function has no `this` of its own, so a layer
  function written as one cannot reach its layer.

Globals cannot reuse a name the page already has (`map`, `app`, `Ext`...): pick names of your
own.
{% endraw %}
