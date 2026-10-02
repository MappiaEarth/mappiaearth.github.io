---
layout: page-uncentered
title: Tutorial
permalink: /tutorial/
docs_nav: true
description: Learn Mappia in ten short steps - from a one-line map to calculated layers, groups, globals, the ExtjsUtils helpers and embedding with MappiaIO, each with a map you run in the page.
---

<div class="container tutorial-index">
  <p class="tutorial-index__lead">
    Ten short steps, from a one-line map to a map that talks to your own page. Each step teaches
    one idea, with an example you run right in the page - nothing to install, nothing saved - and
    a few changes to try. About 45 minutes in all; you only need a browser.
  </p>

  <div class="tutorial-index__how">
    <div><strong>1. Read</strong><span>A short explanation of one idea.</span></div>
    <div><strong>2. Run</strong><span>Click the picture: the example runs in a live map.</span></div>
    <div><strong>3. Change</strong><span>Copy it, change it in the playground, run it again.</span></div>
  </div>

  {% comment %} site.tutorial is empty on a Jekyll server started before the collection was added to _config.yml (restart it) {% endcomment %}
  {% assign steps = site.tutorial %}{% if steps %}{% assign steps = steps | sort: "step" %}{% else %}{% assign steps = "" | split: "," %}{% endif %}
  <ol class="tutorial-index__steps">
    {% for step in steps %}
    <li>
      <a href="{{ step.url | relative_url }}">
        <span class="tutorial-index__number">{{ step.step }}</span>
        <span class="tutorial-index__text">
          <strong>{{ step.title }}</strong>
          <span>{{ step.summary }}</span>
        </span>
      </a>
    </li>
    {% endfor %}
  </ol>

  {% assign firstStep = steps | first %}
  <p class="tutorial-index__start"><a class="tutorial-index__button" href="{{ firstStep.url | relative_url }}">Start with step 1 &rarr;</a></p>

  <p class="tutorial-index__after">
    After the tutorial: the <a href="{{ '/tools/' | relative_url }}">tools</a> (every widget and
    layer type, each with runnable examples), the <a href="{{ '/examples/' | relative_url }}">real
    maps</a> built with Mappia, and the <a href="{{ '/reference/' | relative_url }}">reference</a>.
  </p>
</div>

<style>
  .tutorial-index { max-width: 860px; }
  .tutorial-index__lead { font-size: 18px; }
  .tutorial-index__how { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 22px 0; }
  .tutorial-index__how div { padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa; }
  .tutorial-index__how strong { display: block; color: #277cea; }
  .tutorial-index__how span { font-size: 14px; color: #4b5563; }
  .tutorial-index__steps { list-style: none; margin: 26px 0; padding: 0; }
  .tutorial-index__steps li { margin: 0 0 10px; }
  .tutorial-index__steps a { display: flex; gap: 16px; align-items: flex-start; padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 8px; color: inherit; }
  .tutorial-index__steps a:hover { border-color: #277cea; background: #f8fbff; }
  .tutorial-index__number { flex: none; width: 34px; height: 34px; border-radius: 50%; background: #277cea; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .tutorial-index__text strong { display: block; color: #111827; }
  .tutorial-index__text span { color: #4b5563; font-size: 15px; }
  .tutorial-index__button { display: inline-block; padding: 10px 22px; border-radius: 24px; background: #277cea; color: #fff; font-weight: 600; }
  .tutorial-index__button:hover { background: #1f66c4; color: #fff; }
  .tutorial-index__after { color: #4b5563; }
  @media (max-width: 700px) { .tutorial-index__how { grid-template-columns: 1fr; } }
</style>
