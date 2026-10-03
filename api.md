---
docs_nav: true
layout: page-uncentered
title: API
permalink: /api/
apiConfig:
  startPropertiesOpen: true
---
<div class="container">
  <div class="api-start">
    <p><b>Where to look.</b> What you write <b>in a layer</b> is under <i>Layers</i> and <i>Kinds of layer</i>; <b>in a group</b>, under <i>Groups</i>; <b>before the list</b>, joined with <code>&amp;&amp;</code>, under <i>Query setup</i>; <b>in the link</b>, under <i>Map links and embedding</i>. Functions your code calls are the <i>ExtjsUtils helpers</i>, or the layer's own methods (<code>this.</code>, under <i>Kinds of layer</i>).</p>
    <p class="api-start__words"><b>property</b>: a key you write &middot; <b>callback</b>: a function you write and the platform calls &middot; <b>method</b>: a function the layer has, called on <code>this</code> &middot; <b>helper</b>: <code>ExtjsUtils.NAME.member</code> &middot; <b>setting</b>: applies to the whole query &middot; <b>link parameter</b>: <code>?name=value</code> of a map link</p>
    <p><b>Find anything:</b> press <kbd>/</kbd> and type a name (<code>opacity</code>), the way code writes it (<code>ExtjsUtils.ALERTIFY.confirmChoice</code>, <code>this.setCalculateLegend</code>, <code>&#123;&#123;slider</code>, <code>?queryid</code>) or a few words; <kbd>Enter</kbd> opens the entry. Every entry has a link (<b>#</b>) you can share. Not sure where something lives? Read <a href="{{ '/reference/where-to-look/' | relative_url }}">Where to find it: layers, settings and links</a>.</p>
  </div>
  <style>
    .api-start { margin: 16px 0 8px; padding: 14px 18px; border-left: 4px solid #277cea; background: rgba(39, 124, 234, 0.07); border-radius: 6px; }
    .api-start p { margin: 0 0 6px; }
    .api-start p:last-child { margin-bottom: 0; }
    .api-start__words { font-size: 14px; opacity: .9; }
    .api-start kbd { font: 12px Consolas, monospace; padding: 0 5px; border: 1px solid #c9ced6; border-radius: 4px; background: #fff; }
  </style>
  {% assign api = '' | split: '' %}
  {% for apiHash in site.data.api %}
    {% assign api = api | push: apiHash[0] %}
  {% endfor %}
  {% include api.html api=api %}
</div>
