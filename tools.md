---
layout: page-uncentered
title: Tools
permalink: /tools/
docs_nav: true
description: Every interaction tool a Mappia map can offer - widgets, map interactions, charts, layers and page options - each with a working example.
---

<div class="container tools-page">
  <p class="tools-page__lead">
    Everything a map built with Mappia can offer its users, grouped by what it is for. Each page
    shows a working example - the query and a picture of what it produces - and the tool's
    complete parameter list.
  </p>

  {% for group in site.data.tool_groups %}
    {% assign tools = site.elements | where: "tool_group", group.id | where_exp: "e", "e.disabled != true" | sort: "title" %}
    {% if tools.size > 0 %}
      <section class="category-section" id="{{ group.id }}">
        <h2 class="post-category">{{ group.title }}</h2>
        <p class="tools-page__intro">{{ group.intro }}</p>
        <div class="post-list" itemscope="" itemtype="http://schema.org/Blog">
          {% for post in tools %}
            {% include card.html %}
          {% endfor %}
        </div>
      </section>
    {% endif %}
  {% endfor %}

  {% comment %}
    Every widget tag the markup accepts (the Mark.create switch in the platform), with the page
    that documents it. Built from the markup_tags each widget page declares; publish-docs.js
    fails the publish if a tag of the switch has no page.
  {% endcomment %}
  {% assign tagRows = "" | split: "" %}
  {% for element in site.elements %}
    {% for tag in element.markup_tags %}
      {% assign row = tag | append: "|" | append: element.url | append: "|" | append: element.title %}
      {% if element.disabled %}{% assign row = row | append: " (not available right now)" %}{% endif %}
      {% assign tagRows = tagRows | push: row %}
    {% endfor %}
  {% endfor %}
  {% assign tagRows = tagRows | sort %}
  {% assign unavailable = site.elements | where: "disabled", true | sort: "title" %}
  {% if unavailable.size > 0 %}
  <section class="category-section" id="unavailable">
    <h2 class="post-category">Not available right now</h2>
    <p class="tools-page__intro">These tools exist in the platform but cannot run in this documentation at the moment. Their pages keep the description and the reference.</p>
    <ul class="tools-unavailable">
      {% for element in unavailable %}
        <li><a href="{{ element.url | relative_url }}">{{ element.title }}</a> - {{ element.disabled_reason }}</li>
      {% endfor %}
    </ul>
  </section>
  {% endif %}

  <section class="category-section" id="markup-tags">
    <h2 class="post-category">Every markup tag</h2>
    <p class="tools-page__intro">
      Widgets are written inside a layer's <code>descriptionHtml</code> as
      <code>&#123;&#123;tag|param=value&#125;&#125;</code>. Every tag, and the page that documents it.
      The complete parameter lists are in the <a href="{{ '/reference/widget-catalogue/' | relative_url }}">widget catalogue</a>.
    </p>
    <table class="widget-tags">
      <thead><tr><th>Markup tag</th><th>Documented in</th></tr></thead>
      <tbody>
        {% for row in tagRows %}
          {% assign cells = row | split: "|" %}
          <tr>
            <td><code>&#123;&#123;{{ cells[0] }}&#125;&#125;</code></td>
            <td><a href="{{ cells[1] | relative_url }}">{{ cells[2] }}</a></td>
          </tr>
        {% endfor %}
      </tbody>
    </table>
  </section>
</div>

<style>
  .tools-page__lead { max-width: 46em; font-size: 17px; margin-top: 26px; }
  /* The API-group chips are for the tool page itself; over a light screenshot they are noise. */
  .tools-page .post-card__label { display: none; }
  .tools-page__intro { max-width: 46em; color: #4b5563; margin-top: -6px; }
  .widget-tags { max-width: 40em; margin: 8px 0 18px; font-size: 15px; }
  .widget-tags td, .widget-tags th { padding: 3px 14px 3px 0; text-align: left; }
  .post-card__tags { margin: 4px 0 0; font-size: 13px; }
</style>
