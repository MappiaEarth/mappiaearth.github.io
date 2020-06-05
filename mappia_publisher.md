---
layout: mappia_publisher
title: Mappia publish your maps as a professional.
tagline: Your maps online 24/7 for free.

permalink: /mappia_publisher/
apiConfig:
  startPropertiesOpen: true
---
<div class="container"> 
  {% assign api = '' | split: '' %}
  {% for apiHash in site.data.api %}
    {% assign api = api | push: apiHash[0] %}
  {% endfor %}
  {% include api.html api=api %}
</div>

