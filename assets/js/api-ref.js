/* The API reference's behaviour: /api/ (_includes/api.html) and the tool pages' "Reference"
   block (_includes/api-groups.html). The markup reads and links without it (native <details>,
   real <a href="#...">, every text in the HTML); this adds:
   - on every page: open the entry the address names (#Group.key), keep the address on the
     entry the reader opens (replaceState: no history step), "Copy link" / "Copy" buttons, and a
     double-click on a key that selects the word without closing the entry;
   - on /api/: the search box ("/" or Ctrl+K; a name, ExtjsUtils.LAYER.x, this.x, {{slider,
     ?queryid or words; arrows and Enter), the contents that follow the reading position, the
     "Section > Group > entry" line, "Expand group", the contents drawer on phones, and old
     links that named an entry as a group (#category_changeLayers) sent to the entry.
   No jQuery or DocUtils: it does not wait for the async bundle. */
(function () {
    "use strict";
    var search = document.getElementById("api-search");
    var fullPage = !!search;
    var root = document.documentElement;

    function esc(text) {
        return String(text == null ? "" : text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function byId(id) { return document.getElementById(id); }
    function setAddress(hash) {
        history.replaceState(history.state, "", location.pathname + location.search + hash);
    }

    /* ---------------- copy buttons and toast ---------------- */
    function toast(message) {
        var t = document.createElement("div");
        t.className = "api-toast";
        t.setAttribute("role", "status");
        t.textContent = message;
        document.body.appendChild(t);
        setTimeout(function () { t.remove(); }, 1500);
    }
    function copy(text, message) {
        var done = function () { toast(message); };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { window.prompt("Copy:", text); });
        else window.prompt("Copy:", text);
    }
    function addCopyButtons(entry) {
        var body = entry.querySelector(".api-entry__body");
        if (body && !body.querySelector(".api-entry__actions")) {
            body.insertAdjacentHTML("afterbegin", '<div class="api-entry__actions"><button type="button" data-copy-link="' + esc(entry.id) + '">Copy link</button></div>');
        }
        entry.querySelectorAll("pre.api-example").forEach(function (pre) {
            if (!pre.querySelector(".api-copy")) pre.insertAdjacentHTML("afterbegin", '<button type="button" class="api-copy">Copy</button>');
        });
    }

    /* ---------------- entries opened by the reader ---------------- */
    var bulk = false;
    document.addEventListener("toggle", function (event) {
        var el = event.target;
        if (!el.classList) return;
        if (el.classList.contains("api-entry") && el.open) {
            addCopyButtons(el);
            /* the address names the open entry, ready to share; no history step */
            if (!bulk && location.hash !== "#" + el.id) setAddress("#" + el.id);
            if (fullPage) spy(true);
        } else if (el.classList.contains("api-example-block") && el.open) {
            el.querySelectorAll("pre.api-example").forEach(function (pre) {
                if (!pre.querySelector(".api-copy")) pre.insertAdjacentHTML("afterbegin", '<button type="button" class="api-copy">Copy</button>');
            });
        }
    }, true);

    document.addEventListener("click", function (event) {
        var target = event.target;
        /* a double click on a key selects the word to copy it and keeps the entry as it was */
        if (event.detail > 1 && target.closest(".api-entry__head") && !target.closest("a")) { event.preventDefault(); return; }
        var link = target.closest("[data-copy-link]");
        if (link) { copy(location.origin + location.pathname + "#" + link.getAttribute("data-copy-link"), "Link copied"); return; }
        var button = target.closest(".api-copy");
        if (button) { copy(button.parentNode.querySelector("code").textContent, "Example copied"); return; }
        /* on a tool page, a link to /api/#X whose entry is on this page stays on the page */
        var a = target.closest("a[href^='/api/#']");
        if (a && !fullPage && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) {
            var id = decodeURIComponent(a.getAttribute("href").slice(6));
            if (byId(id)) { event.preventDefault(); location.hash = id; }
        }
    });

    /* ---------------- the address names a place: open it ---------------- */
    function flash(el) {
        el.classList.add("api-flash");
        setTimeout(function () { el.classList.remove("api-flash"); }, 1600);
    }
    function show(id, scroll) {
        var el = byId(id);
        if (!el) return false;
        if (el.classList.contains("api-entry")) {
            el.open = true;
            addCopyButtons(el);
        }
        if (scroll) el.scrollIntoView({ block: "start" });
        flash(el);
        if (fullPage) spy(true);
        return true;
    }
    function fromHash(scroll) {
        var id = decodeURIComponent(location.hash.slice(1));
        if (!id || id.indexOf(":~:") === 0) return;
        if (show(id, scroll) || !fullPage) return;
        /* an old or hand-written link: #category_changeLayers, #visiblelayers, #Getlegend */
        var found = resolveWord(id.replace(/^category_/, ""));
        if (found) {
            setAddress("#" + found);
            show(found, true);
        } else {
            openSearch(id.replace(/^category_/, ""));
        }
    }
    window.addEventListener("hashchange", function () { fromHash(false); });

    if (!fullPage) {
        fromHash(false);
        return;
    }

    /* ======================= /api/ only ======================= */
    var results = byId("api-search-results");
    var crumbs = byId("api-crumbs");
    var toc = byId("api-toc");
    var tocButton = byId("api-toc-btn");
    var expandButton = byId("api-expand");
    var groups = [].slice.call(document.querySelectorAll(".api-main .api-group"));
    var index = [];

    /* ---------------- the index: sections, groups, entries (built from the page) ---------------- */
    function text(el) { return el ? el.textContent.replace(/\s+/g, " ").trim() : ""; }
    function buildIndex() {
        var titles = {};
        document.querySelectorAll(".api-main .api-section").forEach(function (s) {
            var title = text(s.querySelector(".api-section__title"));
            titles[s.getAttribute("data-section")] = title;
            index.push({ kind: "section", id: s.id, key: s.getAttribute("data-section"), name: title, where: "", type: "section",
                alias: "", group: "", sum: text(s.querySelector(".api-section__intro")).slice(0, 300), desc: "", ex: "" });
        });
        groups.forEach(function (g) {
            var key = g.getAttribute("data-group"), name = text(g.querySelector(".api-group__title"));
            var tag = g.getAttribute("data-markup");
            index.push({ kind: "group", id: g.id, key: key, name: name, where: titles[g.getAttribute("data-section")] || "", type: "group " + key,
                alias: tag ? "{{" + tag : "", group: key + " " + name, sum: text(g.querySelector(".api-group__intro")).slice(0, 400), desc: "", ex: "" });
            g.querySelectorAll(".api-entry").forEach(function (e) {
                index.push({ kind: "entry", id: e.id, key: e.getAttribute("data-key"), name: e.getAttribute("data-key"), where: name,
                    type: text(e.querySelector(".api-entry__type")), alias: e.getAttribute("data-alias") || (tag ? "{{" + tag + "|" + e.getAttribute("data-key") : ""),
                    group: key + " " + name, sum: text(e.querySelector(".api-entry__summary")),
                    desc: text(e.querySelector(".api-entry__desc")) + " " + text(e.querySelector(".api-entry__params")) + " " + text(e.querySelector(".api-entry__returns")),
                    ex: [].map.call(e.querySelectorAll("pre.api-example"), function (p) { return p.textContent; }).join(" ") });
            });
        });
        index.forEach(function (r, i) {
            r.i = i;
            r.k = r.key.toLowerCase(); r.a = r.alias.toLowerCase(); r.idl = r.id.toLowerCase(); r.n = r.name.toLowerCase();
            r.g = r.group.toLowerCase(); r.s = r.sum.toLowerCase(); r.d = r.desc.toLowerCase(); r.x = r.ex.toLowerCase();
            /* word starts inside a key: maxZoom -> max, zoom; MAX_TILES_PER_AREA -> max, tiles, per, area */
            r.words = r.key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ").toLowerCase().split(" ");
        });
    }

    /* ---------------- ranking: every word must match; names first, then text ---------------- */
    function score(r, t) {
        var qualified = /[.{?=|]/.test(t);
        if (r.kind === "entry") {
            if (r.k === t) return 100;
            if (qualified) {
                if (r.a === t || r.idl === t) return 110;
                if (r.a.indexOf(t) !== -1 || r.idl.indexOf(t) !== -1) return 75;
                var last = t.split(/[.?=|{}]+/).filter(Boolean).pop();
                if (last && last !== t) {
                    if (r.k === last) return 70;
                    if (r.k.indexOf(last) === 0) return 50;
                }
            }
            if (r.k.indexOf(t) === 0) return 80;
            for (var i = 1; i < r.words.length; i++) if (r.words[i].indexOf(t) === 0) return 65;
            if (r.k.indexOf(t) !== -1) return 55;
            if (r.a.indexOf(t) !== -1) return 45;
            if (r.g.indexOf(t) !== -1) return 22;
            if (r.s.indexOf(t) !== -1) return 15;
            if (r.d.indexOf(t) !== -1) return 6;
            if (r.x.indexOf(t) !== -1) return 3;
            return 0;
        }
        /* a group or a section: below an entry whose own name holds the word */
        if (r.k === t || r.a === t) return 95;
        if (qualified && r.a && r.a.indexOf(t) === 0) return 90;
        if (r.n.indexOf(t) !== -1 || r.k.indexOf(t) !== -1) return 50;
        if (r.s.indexOf(t) !== -1) return 10;
        return 0;
    }
    var STOP_WORDS = { a: 1, an: 1, the: 1, of: 1, in: 1, on: 1, at: 1, to: 1, for: 1, and: 1, or: 1, is: 1, it: 1, by: 1, with: 1, from: 1, as: 1, how: 1, what: 1, that: 1 };
    function byScore(a, b) { return b.m - a.m || b.s - a.s || a.r.key.length - b.r.key.length || a.r.i - b.r.i; }
    /* Every word must match. When that leaves fewer than 3 results ("hidden in the menu"), the
       entries matching some of the words follow, the most matched words first. */
    function find(query) {
        var words = query.toLowerCase().split(/\s+/).filter(Boolean), all = [], some = [];
        if (!words.length) return all;
        var meaningful = words.filter(function (w) { return !STOP_WORDS[w]; });
        if (!meaningful.length) meaningful = words;
        for (var i = 0; i < index.length; i++) {
            var r = index[i], total = 0, matched = 0;
            for (var j = 0; j < meaningful.length; j++) {
                var s = score(r, meaningful[j]);
                if (s) { matched++; total += s; }
            }
            if (matched === meaningful.length) all.push({ r: r, s: total, m: matched });
            else if (matched > 0 && meaningful.length > 1) some.push({ r: r, s: total, m: matched });
        }
        all.sort(byScore);
        if (all.length >= 3) return all;
        some.sort(byScore);
        return all.concat(some.map(function (h) { h.partial = true; return h; }));
    }
    function distance(a, b) {
        var m = a.length, n = b.length, d = [], i, j;
        for (i = 0; i <= m; i++) d[i] = [i];
        for (j = 1; j <= n; j++) d[0][j] = j;
        for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        return d[m][n];
    }
    function suggestions(query) {
        var t = query.toLowerCase().trim().split(/[.\s=?{|]+/).filter(Boolean).pop() || "", seen = {}, out = [];
        index.forEach(function (r) {
            if (r.kind !== "entry" || seen[r.k]) return;
            seen[r.k] = true;
            var d = distance(t, r.k);
            if (d <= Math.max(2, Math.floor(t.length / 3))) out.push({ k: r.key, d: d });
        });
        return out.sort(function (a, b) { return a.d - b.d; }).slice(0, 4).map(function (x) { return x.k; });
    }
    function highlight(value, words) {
        var html = esc(value);
        words.forEach(function (w) {
            if (w.length > 1) html = html.replace(new RegExp("(" + esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
        });
        return html;
    }
    /* a word as an old link wrote it: a group, else the one entry with that key (exact, then any case) */
    function resolveWord(word) {
        var lower = word.toLowerCase(), exact = [], anyCase = [], group = null;
        index.forEach(function (r) {
            if (r.kind === "group" && r.k === lower) group = r;
            else if (r.kind === "entry") { if (r.key === word) exact.push(r); else if (r.k === lower) anyCase.push(r); }
        });
        var hit = group || (exact.length === 1 ? exact[0] : (!exact.length && anyCase.length === 1 ? anyCase[0] : null));
        return hit ? hit.id : null;
    }

    /* ---------------- the result list ---------------- */
    var shown = [], selected = -1;
    function render() {
        var query = search.value.trim();
        if (!query) { results.hidden = true; search.setAttribute("aria-expanded", "false"); search.removeAttribute("aria-activedescendant"); return; }
        var hits = find(query), words = query.toLowerCase().split(/\s+/).filter(function (w) { return !STOP_WORDS[w]; });
        var complete = hits.filter(function (h) { return !h.partial; }).length;
        shown = hits.slice(0, 50).map(function (h) { return h.r; });
        var html = '<li class="rhead" role="presentation">' + complete + (complete === 1 ? " match" : " matches") +
            (hits.length > 50 ? " &middot; the best 50" : "") + " &middot; &uarr;&darr; to choose, Enter to open</li>";
        if (!complete) {
            var maybe = suggestions(query);
            if (maybe.length) {
                html += '<li class="rhead" role="presentation">Did you mean: ' + maybe.map(function (s) {
                    return '<a href="#" data-suggest="' + esc(s) + '">' + esc(s) + "</a>";
                }).join(", ") + "</li>";
            }
        }
        html += hits.slice(0, 50).map(function (h, i) {
            var r = h.r;
            return (h.partial && (i === 0 || !hits[i - 1].partial) ? '<li class="rhead" role="presentation">Matching some of the words</li>' : "") +
                '<li role="option" id="api-option-' + i + '" data-i="' + i + '" aria-selected="false"><div class="r1"><span class="rk">' + highlight(r.name, words) +
                '</span><span class="rt">' + esc(r.type) + '</span><span class="rg">' + esc(r.where) + '</span></div><div class="rs">' + highlight(r.sum, words) + "</div></li>";
        }).join("");
        results.innerHTML = html;
        results.hidden = false;
        search.setAttribute("aria-expanded", "true");
        select(shown.length ? 0 : -1);
    }
    function select(i) {
        selected = i;
        results.querySelectorAll("[role=option]").forEach(function (li) { li.setAttribute("aria-selected", String(+li.getAttribute("data-i") === i)); });
        var option = byId("api-option-" + i);
        if (option) { search.setAttribute("aria-activedescendant", option.id); option.scrollIntoView({ block: "nearest" }); }
        else search.removeAttribute("aria-activedescendant");
    }
    function choose(i) {
        var r = shown[i];
        if (!r) return;
        results.hidden = true;
        search.setAttribute("aria-expanded", "false");
        setDrawer(false);
        /* the link to share is the entry's, without the search that found it */
        if (location.search) history.replaceState(history.state, "", location.pathname + location.hash);
        if (location.hash === "#" + r.id) show(r.id, true);
        else location.hash = r.id;   /* one history step: Back returns to where the search started */
        /* the keyboard continues from the result: Tab goes into the entry, Enter toggles it */
        var target = byId(r.id), focusable = target && target.querySelector("summary, .api-group__title a, .api-section__title");
        if (focusable) {
            if (!focusable.matches("summary, a")) focusable.setAttribute("tabindex", "-1");
            focusable.focus({ preventScroll: true });
        }
    }
    function openSearch(query) {
        search.value = query;
        render();
        search.focus({ preventScroll: true });
    }
    search.addEventListener("input", render);
    search.addEventListener("focus", function () { if (search.value.trim()) render(); });
    search.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") { select(Math.min(selected + 1, shown.length - 1)); event.preventDefault(); }
        else if (event.key === "ArrowUp") { select(Math.max(selected - 1, 0)); event.preventDefault(); }
        else if (event.key === "Enter") { choose(selected < 0 ? 0 : selected); event.preventDefault(); }
        else if (event.key === "Escape") { if (search.value) { search.value = ""; render(); } else search.blur(); }
    });
    results.addEventListener("mousedown", function (event) {
        var suggestion = event.target.closest("[data-suggest]");
        if (suggestion) { event.preventDefault(); openSearch(suggestion.getAttribute("data-suggest")); return; }
        var option = event.target.closest("[role=option]");
        if (option) { event.preventDefault(); choose(+option.getAttribute("data-i")); }
    });
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".api-search")) { results.hidden = true; search.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (event) {
        var active = document.activeElement, typing = active && (/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName) || active.isContentEditable);
        if ((event.key === "/" && !typing) || (event.key === "k" && (event.ctrlKey || event.metaKey))) {
            event.preventDefault();
            search.focus();
            search.select();
        } else if (event.key === "Escape" && root.classList.contains("api-toc-open")) {
            setDrawer(false);
        }
    });

    /* ---------------- contents: drawer on phones, sections that open ---------------- */
    function setDrawer(open) {
        root.classList.toggle("api-toc-open", open);
        if (tocButton) tocButton.setAttribute("aria-expanded", String(open));
    }
    if (tocButton) tocButton.addEventListener("click", function () { setDrawer(!root.classList.contains("api-toc-open")); });
    var userOpened = {};
    toc.addEventListener("click", function (event) {
        if (event.target.closest(".api-toc__close")) { setDrawer(false); return; }
        var sectionLink = event.target.closest(".api-toc__section > summary a");
        if (sectionLink) {
            /* a section title jumps there and opens its groups in the contents; on a phone the drawer stays open to pick one */
            var details = sectionLink.closest("details");
            details.open = true;
            userOpened[details.getAttribute("data-section")] = true;
            return;
        }
        var summary = event.target.closest(".api-toc__section > summary");
        if (summary) { userOpened[summary.parentNode.getAttribute("data-section")] = !summary.parentNode.open; return; }
        if (event.target.closest("li a")) setDrawer(false);
    });

    /* ---------------- where you are: contents, breadcrumbs (never the address) ---------------- */
    var sections = [].slice.call(document.querySelectorAll(".api-main .api-section"));
    var current = null, currentSection = null;
    function barHeight() {
        return parseInt(getComputedStyle(byId("api-ref")).getPropertyValue("--api-bar-h"), 10) || 56;
    }
    function lastAbove(list, line) {
        var best = null;
        for (var i = 0; i < list.length; i++) {
            if (list[i].getBoundingClientRect().top <= line) best = list[i]; else break;
        }
        return best;
    }
    function spy(force) {
        var line = barHeight() + 16;
        var section = lastAbove(sections, line) || sections[0];
        var group = lastAbove(groups, line);
        /* between a section's title and its first group, the reader is in the section, not in
           the last group of the section before */
        if (group && section && group.getAttribute("data-section") !== section.getAttribute("data-section")) group = null;
        if (!section || (group === current && section === currentSection && !force)) return;
        current = group;
        currentSection = section;
        var s = section.getAttribute("data-section"), g = group ? group.getAttribute("data-group") : null;
        toc.querySelectorAll("a[aria-current]").forEach(function (a) { a.removeAttribute("aria-current"); });
        toc.querySelectorAll(".api-toc__section").forEach(function (d) {
            var mine = d.getAttribute("data-section") === s;
            if (mine) d.open = true;
            else if (!userOpened[d.getAttribute("data-section")]) d.open = false;
        });
        var link = g ? toc.querySelector('li a[data-group="' + g + '"]') : toc.querySelector('.api-toc__section[data-section="' + s + '"] > summary a');
        if (link) {
            link.setAttribute("aria-current", "location");
            var lr = link.getBoundingClientRect(), tr = toc.getBoundingClientRect();
            if (lr.top < tr.top + 40 || lr.bottom > tr.bottom - 20) toc.scrollTop += lr.top - tr.top - tr.height / 3;
        }
        var sectionTitle = esc(text(section.querySelector(".api-section__title")));
        if (!group) {
            crumbs.innerHTML = '<span class="cur">' + sectionTitle + "</span>";
        } else {
            var hash = decodeURIComponent(location.hash.slice(1));
            var entry = hash.indexOf(g + ".") === 0 && byId(hash) ? hash.slice(g.length + 1) : null;
            var groupName = esc(text(group.querySelector(".api-group__title")));
            crumbs.innerHTML = '<a href="#' + esc(section.id) + '">' + sectionTitle + '</a><span class="sep">&rsaquo;</span>' +
                (entry ? '<a href="#category_' + esc(g) + '">' + groupName + '</a><span class="sep">&rsaquo;</span><span class="cur">' + esc(entry) + "</span>"
                    : '<span class="cur">' + groupName + "</span>");
        }
        updateExpand();
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; spy(false); }); }
    }, { passive: true });

    /* ---------------- "Expand group": every entry of the group being read ---------------- */
    function updateExpand() {
        expandButton.disabled = !current;
        if (!current) { expandButton.textContent = "Expand group"; return; }
        var entries = current.querySelectorAll(".api-entry");
        var allOpen = entries.length > 0 && [].every.call(entries, function (d) { return d.open; });
        expandButton.textContent = allOpen ? "Collapse group" : "Expand group";
    }
    expandButton.addEventListener("click", function () {
        if (!current) return;
        var entries = current.querySelectorAll(".api-entry");
        var open = [].some.call(entries, function (d) { return !d.open; });
        bulk = true;
        entries.forEach(function (d) { d.open = open; });
        setTimeout(function () { bulk = false; updateExpand(); }, 50);
    });

    /* ---------------- start ---------------- */
    buildIndex();
    var query = new URLSearchParams(location.search).get("q");
    if (query) openSearch(query);
    fromHash(true);
    spy(true);
    /* main.css arrives after the first paint and moves the page: land on the target again,
       unless the reader has already scrolled */
    var landed = window.scrollY;
    window.addEventListener("load", function () {
        if (location.hash && Math.abs(window.scrollY - landed) < 4) {
            var target = byId(decodeURIComponent(location.hash.slice(1)));
            if (target) target.scrollIntoView({ block: "start" });
        }
        spy(true);
    });
})();
