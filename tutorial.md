---
layout: tutorial-wizard
title: Tutorial
permalink: /tutorial/
docs_nav: true
description: Learn Mappia step by step on one live map - change a query, press Run, and the tutorial checks the map shows what the step asked for. Then the chapter notes, from a one-line map to calculated layers, groups, globals, the ExtjsUtils helpers and MappiaIO.
---
{% comment %}
  /tutorial/ is the wizard (_layouts/tutorial-wizard.html, data in _data/tutorial.json). This
  content follows it: the chapter notes - the ten pages tutorial/NN-slug.md (layout tutorial),
  the same ideas written out, with their tables and examples.
{% endcomment %}
{% assign notes = site.pages | where: "layout", "tutorial" | sort: "step" %}
<section class="tutorial-notes" aria-labelledby="tutorial-notes-title">
  <h2 id="tutorial-notes-title">The chapter notes</h2>
  <p class="tutorial-notes__lead">
    Every idea of the tutorial, written out with its tables and a full example you can run - for
    reading, printing, or going further than the steps. {% unless site.data.tutorial %}The live,
    step-by-step version of this page is being prepared.{% endunless %}
  </p>
  <ol class="tutorial-notes__list">
    {% for note in notes %}
    <li>
      <a href="{{ note.url | relative_url }}">
        <span class="tutorial-notes__number">{{ note.step }}</span>
        <span class="tutorial-notes__text"><strong>{{ note.title }}</strong><span>{{ note.summary }}</span></span>
      </a>
    </li>
    {% endfor %}
  </ol>
  <p class="tutorial-notes__after">
    After the tutorial: the <a href="{{ '/tools/' | relative_url }}">tools</a> (every widget and
    layer type, each with runnable examples), the <a href="{{ '/examples/' | relative_url }}">real
    maps</a> built with Mappia, and the <a href="{{ '/reference/' | relative_url }}">reference</a>.
  </p>
</section>

<style>
  .tutorial-notes { max-width: 860px; margin: 18px 0 30px; }
  .tutorial-notes h2 { font-size: 22px; }
  .tutorial-notes__lead { color: #4b5563; }
  .tutorial-notes__list { list-style: none; margin: 18px 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
  .tutorial-notes__list a { display: flex; gap: 12px; align-items: flex-start; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; color: inherit; height: 100%; }
  .tutorial-notes__list a:hover { border-color: #277cea; background: #f8fbff; }
  .tutorial-notes__number { flex: none; width: 28px; height: 28px; border-radius: 50%; background: #e5edfb; color: #277cea; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .tutorial-notes__text strong { display: block; color: #111827; }
  .tutorial-notes__text span { color: #4b5563; font-size: 14px; }
  .tutorial-notes__after { color: #4b5563; }
</style>
