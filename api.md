---
layout: page-uncentered
title: API
permalink: /api/
---
<div class="container">
  {% assign api = '' | split: '' %}
  {% for apiHash in site.data.api %}
    {% assign api = api | push: apiHash[0] %}
  {% endfor %}
  {% include api.html api=api %}
</div>
