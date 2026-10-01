---
docs_nav: true
layout: page-uncentered
title: Reference
permalink: /reference/
description: How Mappia reads a query — the language, the execution model, the layer vocabulary, the widget markup and the pitfalls.
---

<div class="container reference-index">
  <p class="reference-index__lead">
    A Mappia map is defined by a <strong>query</strong>: one JavaScript expression that lists the
    layers to show, the widgets the user gets and the arithmetic that runs over the pixels.
    These pages explain how the platform reads that query. They are meant to be read in order
    inside each section, rather than looked up alphabetically — the generated
    <a href="{{ '/api/' | relative_url }}">API reference</a> is the alphabetical list, and this is
    the explanation of it.
  </p>

  {% assign sections = site.data.reference_sections %}
  {% for section in sections %}
    {% assign chapters = site.reference | where: "section", section | sort: "order" %}
    {% if chapters.size > 0 %}
      <h2 class="post-category" id="{{ section | slugify }}">{{ section }}</h2>
      <ol class="reference-index__list">
        {% for chapter in chapters %}
          <li>
            <a href="{{ chapter.url | relative_url }}"><strong>{{ chapter.title }}</strong></a>
            <span class="reference-index__summary">{{ chapter.summary }}</span>
          </li>
        {% endfor %}
      </ol>
    {% endif %}
  {% endfor %}

  <h2 class="post-category">For machines</h2>
  <p>
    Everything above is also published as plain text, so an AI assistant or a script can read it
    without parsing this page:
  </p>
  <ul class="reference-index__list">
    <li><a href="{{ '/llms.txt' | relative_url }}"><strong>/llms.txt</strong></a>
      <span class="reference-index__summary">The index: every chapter with a one-line summary and a link to its markdown.</span></li>
    <li><a href="{{ '/llms-full.txt' | relative_url }}"><strong>/llms-full.txt</strong></a>
      <span class="reference-index__summary">The whole reference concatenated into one file.</span></li>
    <li><a href="{{ '/assets/api.json' | relative_url }}"><strong>/assets/api.json</strong></a>
      <span class="reference-index__summary">Every documented member of the query API, generated from the platform source.</span></li>
  </ul>
  <p>
    Each chapter is also served as markdown at
    <code>/assets/reference/&lt;chapter&gt;.md</code>.
  </p>
</div>

<style>
  .reference-index__lead { max-width: 46em; }
  .reference-index__list { max-width: 60em; }
  .reference-index__list li { margin-bottom: 10px; }
  .reference-index__summary { display: block; color: #4b5563; }
</style>
