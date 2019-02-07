---
layout: page-uncentered
title: Categories
permalink: /categories/
---
<div class="category-section">
  <div class="container">
    <h2 class="post-category">Examples</h2>
    <div>
    {% assign examplesCategories = "" | split: ',' %}
    {% for example in site.examples %}
      {% assign examplesCategories = examplesCategories | concat: example.categories %}
    {% endfor %}
    {% assign examplesCategories = examplesCategories | uniq | sort %}
    {% for category in examplesCategories %}
      <div class="archive-group">
        <div id="{{ category | slugize | append:'_Example'}}"></div>
        <p></p>
        <h3 class="category-head">{{ category }}</h3>
        <a name="{{ category | slugize }}"></a>
        {% assign categoryExamples = site.examples | where_exp: "example", "example.categories contains category" | sort %}
        {% for example in categoryExamples %}
          <article class="archive-item">
            <h4><a href="{{ site.baseurl }}{{ example.url }}">{{example.title}}</a></h4>
          </article>
        {% endfor %}
      </div>
    {% endfor %}
    </div>
  </div>
</div>

<div class="category-section">
  <div class="container">
    <h2 class="post-category">Elements</h2>
    <div>
    {% assign elementsCategories = "" | split: ',' %}
    {% for element in site.elements %}
      {% assign elementsCategories = elementsCategories | concat: element.categories %}
    {% endfor %}
    {% assign elementsCategories = elementsCategories | uniq | sort %}
    {% for category in elementsCategories %}
      <div class="archive-group">
        <div id="{{ category | slugize | append:'_Element'}}"></div>
        <p></p>
        <h3 class="category-head">{{ category }}</h3>
        <a name="{{ category | slugize }}"></a>
        {% assign categoryElements = site.elements | where_exp: "element", "element.categories contains category" | sort %}
        {% for element in categoryElements %}
          <article class="archive-item">
            <h4><a href="{{ site.baseurl }}{{ element.url }}">{{element.title}}</a></h4>
          </article>
        {% endfor %}
      </div>
    {% endfor %}
    </div>
  </div>
</div>

<div class="category-section">
  <div class="container">
    <h2 class="post-category">Raw Maps</h2>
    <div>
    {% assign rawMapsCategories = "" | split: ',' %}
    {% for rawMap in site.raw_maps %}
      {% assign rawMapsCategories = rawMapsCategories | concat: rawMap.categories %}
    {% endfor %}
    {% assign rawMapsCategories = rawMapsCategories | uniq | sort %}
    {% for category in rawMapsCategories %}
      <div class="archive-group">
        <div id="{{ category | slugize | append:'_Raw'}}"></div>
        <p></p>
        <h3 class="category-head">{{ category }}</h3>
        <a name="{{ category | slugize }}"></a>
        {% assign categoryRawMaps = site.raw_maps | where_exp: "rawMap", "rawMap.categories contains category" | sort %}
        {% for rawMap in categoryRawMaps %}
          <article class="archive-item">
            <h4><a href="{{ site.baseurl }}{{ rawMap.url }}">{{rawMap.title}}</a></h4>
          </article>
        {% endfor %}
      </div>
    {% endfor %}
    </div>
  </div>
</div>