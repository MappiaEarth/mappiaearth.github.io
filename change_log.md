---
layout: page
title: Change log
permalink: /changelog/
---

{% assign sorted_change_logs = site.change_logs | sort: 'date' | reverse %}
{% include change-log.html change_log=sorted_change_logs %}
