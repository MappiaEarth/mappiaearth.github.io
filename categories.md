---
layout: page
title: Categories
permalink: /categories/
---
<h2 class="post-category">Elements</h2>
<div>
{% for category in site.categories %}
  {% assign categoryPostExists = false %}
  <div class="archive-group">
    {% capture category_name %}{{ category | first }}{% endcapture %}
    {% for post in site.categories[category_name] %}
      {% if post.type == "Element" %}
        {% if categoryPostExists == false %}
          <div id="{{ category_name | slugize | append:'_Element'}}"></div>
          <p></p>
          <h3 class="category-head">{{ category_name }}</h3>
          <a name="{{ category_name | slugize }}"></a>
          {% assign categoryPostExists = true %}
        {% endif %}
        <article class="archive-item">
          <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
        </article>
      {% endif %}
    {% endfor %}
  </div>
{% endfor %}
</div>

<h2 class="post-category">Examples</h2>
<div>
{% for category in site.categories %}
  {% assign categoryPostExists = false %}
  <div class="archive-group">
    {% capture category_name %}{{ category | first }}{% endcapture %}
    {% for post in site.categories[category_name] %}
      {% if post.type == "Example" %}
        {% if categoryPostExists == false %}
          <div id="{{ category_name | slugize | append:'_Example'}}"></div>
          <p></p>
          <h3 class="category-head">{{ category_name }}</h3>
          <a name="{{ category_name | slugize }}"></a>
          {% assign categoryPostExists = true %}
        {% endif %}
        <article class="archive-item">
          <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
        </article>
      {% endif %}
    {% endfor %}
  </div>
{% endfor %}
</div>