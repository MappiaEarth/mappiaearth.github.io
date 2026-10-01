---
layout: page-uncentered
title: Examples
permalink: /examples/
docs_nav: true
description: Real maps built with Mappia - interactive analyses and raw-data maps - each opened live.
---

<div class="container examples-page">
  <p class="examples-page__lead">
    Real maps built with Mappia. Each one opens live, with the query behind it visible in the
    editor - the quickest way to see a feature used at full scale.
  </p>

  <section class="category-section">
    <h2 class="post-category" id="interactive">Interactive analyses</h2>
    <div class="post-list" itemscope="" itemtype="http://schema.org/Blog">
      {% assign sortedExamples = site.examples | sort: 'title' %}
      {% for post in sortedExamples %}
        {% include card.html %}
      {% endfor %}
    </div>
  </section>

  <section class="category-section">
    <h2 class="post-category" id="raw-maps">Raw maps</h2>
    <p class="examples-page__intro">
      Maps published with their original cell values, so a query can read them as numbers and not
      only as colours - the basis of area sums and integrals. The decodings are explained in
      <a href="{{ '/reference/layer-and-group-model/' | relative_url }}">the layer and group model</a>.
    </p>
    <div class="post-list" itemscope="" itemtype="http://schema.org/Blog">
      {% assign sortedRawMaps = site.raw_maps | sort: 'title' %}
      {% for post in sortedRawMaps %}
        {% include card.html %}
      {% endfor %}
    </div>
  </section>
</div>

<style>
  .examples-page__lead { max-width: 46em; font-size: 17px; }
  .examples-page__intro { max-width: 46em; color: #4b5563; margin-top: -6px; }
  .post-card__tags { margin: 4px 0 0; font-size: 13px; }
</style>
