/**
 * MappiaProbe - lets a page read back what the live map shows after a query, with no change to
 * the Mappia platform. Used by MappiaLive.session() (assets/js/mappia-live.js), so by the tutorial
 * wizard and the MappiaIO playground.
 *
 *   var text = MappiaProbe.prefix("apply-7", { css: {...}, keepView: true }) + queryText + "\n";
 *   mappia.applyQuery(text);   // then, from the map:
 *   // "mappia__queryApplied", then {operation: "tutorial__snapshot", applyId: "apply-7", layers: [...],
 *   //  view, zoom, errors, warnings, servers, globals, background}, then {operation: "tutorial__drawn", ...}
 *
 * The prefix is ONE ExtjsUtils.QUERY.decorate({...}) && call on ONE line (no line break), so the
 * reader's line numbers do not move. Its `run` function runs when the query is evaluated, before
 * the reader's part:
 * - once per map it installs window.__mappiaProbe: snapshot(); a listener for what the reader does
 *   in the map (a layer switched or faded in the menus or the panel, the map moved), each posted as
 *   {operation: "tutorial__reader", kind: "visibility" | "opacity" | "move", layer, snapshot}; and a
 *   private channel - window messages {tutorial_probe: {applyId}} answered with a snapshot - that
 *   neither the platform nor the query's own MappiaIO callback sees (no mappia_iframe key);
 * - it collects console.error / console.warn (the platform reports a broken query only there, and
 *   still confirms it) until the platform's QUERY_LOADED event, then posts the snapshot;
 * - it puts the view back (keepView) or shows a given region (view) AFTER the platform's own zoom
 *   to the layers (a zoom done earlier is overridden by it);
 * - it reports "drawn" once no visible layer has tiles loading any more.
 * A query that does not parse never runs the prefix: then only mappia__queryApplied arrives.
 * Internals it relies on: ExtjsUtils.QUERY.decorate / postMessage / __globalNames / remoteSources,
 * CustomEvents + CUSTOM_EVENTS_NAMES.QUERY_LOADED, app.mapPanel.layers, the app's
 * initialConfig.map.layers (path / viewPath: the groups), OpenLayers map events. The tutorial's
 * step tests (MappiaExplorer scripts/test-tutorial-steps.js) exercise all of them.
 */
(function (root) {
    "use strict";

    /* In the map. No line comments in install() and run(): their source is joined onto one line. */
    function install() {
        if (window.__mappiaProbe && window.__mappiaProbe.version === 2) return window.__mappiaProbe;
        var probe = { version: 2, applying: false, currentApply: null };
        var app = ExtjsUtils.JS.getApp();
        var map = ExtjsUtils.JS.getMap();
        function isOwn(record) { return record && record.get && record.get("name") && !ExtjsUtils.LAYER.isBackgroundLayerOrRecord(record); }
        function groupsOf(record) {
            var defs = app.initialConfig.map.layers || [];
            var def = defs.filter(function (d) { return d.name === record.get("name") && d.title === record.get("title"); })[0] || {};
            function titles(path) { return (path || []).map(function (g) { return g && g.title; }).filter(Boolean); }
            return { menu: titles(def.path), panel: titles(def.viewPath) };
        }
        function layerOf(record) {
            var layer = record.getLayer();
            return { name: record.get("name"), title: record.get("title"), source: record.get("source"), visible: !!layer.getVisibility(),
                opacity: layer.opacity == null ? 1 : +layer.opacity, inRange: !!layer.inRange, groups: groupsOf(record) };
        }
        probe.snapshot = function () {
            var records = app.mapPanel.layers.getRange();
            var extent = map.getExtent().transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
            return {
                layers: records.filter(isOwn).map(layerOf).reverse(),
                background: records.filter(function (r) { return ExtjsUtils.LAYER.isBackgroundLayerOrRecord(r) && r.getLayer().getVisibility(); })
                    .map(function (r) { return r.get("name"); }),
                view: extent.toArray().map(function (v) { return Math.round(v * 100) / 100; }),
                zoom: map.getZoom(),
                globals: ExtjsUtils.QUERY.__globalNames.slice(),
                servers: ExtjsUtils.QUERY.remoteSources.slice(),
            };
        };
        probe.post = function (message) { ExtjsUtils.QUERY.postMessage(message); };
        map.events.register("changelayer", null, function (event) {
            if (probe.applying || !event || !event.layer || (event.property !== "visibility" && event.property !== "opacity")) return;
            var record = app.mapPanel.layers.getRange().filter(function (r) { return r.getLayer() === event.layer; })[0];
            if (!isOwn(record)) return;
            probe.post({ operation: "tutorial__reader", kind: event.property, layer: layerOf(record), snapshot: probe.snapshot() });
        });
        var moveTimer = null;
        map.events.register("moveend", null, function () {
            if (probe.applying) return;
            clearTimeout(moveTimer);
            moveTimer = setTimeout(function () { probe.post({ operation: "tutorial__reader", kind: "move", snapshot: probe.snapshot() }); }, 300);
        });
        window.addEventListener("message", function (event) {
            var ask = event.data && event.data.tutorial_probe;
            if (!ask) return;
            var reply = { operation: "tutorial__snapshot", applyId: ask.applyId || null, onRequest: true };
            try { var s = probe.snapshot(); for (var k in s) reply[k] = s[k]; } catch (e) { reply.probeError = String(e); }
            probe.post(reply);
        });
        probe.watchDrawn = function (applyId) {
            var started = Date.now(), quiet = 0;
            var timer = setInterval(function () {
                if (probe.currentApply !== applyId || Date.now() - started > 30000) { clearInterval(timer); return; }
                var loading = app.mapPanel.layers.getRange().filter(function (r) {
                    var layer = r.getLayer();
                    return layer && layer.getVisibility() && layer.inRange !== false && layer.numLoadingTiles > 0;
                }).length;
                quiet = loading ? 0 : quiet + 1;
                if (quiet >= 2) {
                    clearInterval(timer);
                    probe.post({ operation: "tutorial__drawn", applyId: applyId, ms: Date.now() - started });
                }
            }, 250);
        };
        window.__mappiaProbe = probe;
        return probe;
    }

    function run(applyId, keepView, box) {
        var probe = install();
        var map = ExtjsUtils.JS.getMap();
        var before = keepView ? map.getExtent().clone() : null;
        var errors = [], warnings = [];
        var originalError = console.error, originalWarn = console.warn, originalLog = console.log;
        probe.applying = true;
        probe.currentApply = applyId;
        function describe(value) {
            if (value && value.stack) {
                var where = /<anonymous>:(\d+):(\d+)/.exec(value.stack);
                return value.name + ": " + value.message + (where ? " (line " + where[1] + ", col " + where[2] + ")" : "");
            }
            return typeof value === "string" ? value : JSON.stringify(value);
        }
        console.error = function () {
            try { errors.push(Array.prototype.map.call(arguments, describe).join(" ").slice(0, 400)); } catch (e) {}
            return originalError.apply(console, arguments);
        };
        console.warn = function (text) {
            try { warnings.push(String(text).slice(0, 300)); } catch (e) {}
            return originalWarn.apply(console, arguments);
        };
        console.log = function (text) {
            if (/^Error loading Source|will be ignored/.test(String(text))) warnings.push(String(text));
            return originalLog.apply(console, arguments);
        };
        function onError(event) { errors.push("Uncaught " + (event.error && event.error.stack ? describe(event.error) : event.message)); }
        window.addEventListener("error", onError);
        function onLoaded() {
            setTimeout(function () {
                CustomEvents.remove(CUSTOM_EVENTS_NAMES.QUERY_LOADED, onLoaded);
                console.error = originalError; console.warn = originalWarn; console.log = originalLog;
                window.removeEventListener("error", onError);
                try {
                    if (box) {
                        map.zoomToExtent(new OpenLayers.Bounds(box[0], box[1], box[2], box[3])
                            .transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()));
                    } else if (before) {
                        map.zoomToExtent(before, true);
                    }
                } catch (e) {}
                setTimeout(function () { probe.applying = false; }, 500);
                var reply = { operation: "tutorial__snapshot", applyId: applyId, errors: errors, warnings: warnings };
                try { var s = probe.snapshot(); for (var k in s) reply[k] = s[k]; } catch (e) { reply.probeError = String(e); }
                probe.post(reply);
                probe.watchDrawn(applyId);
            }, 0);
        }
        CustomEvents.register(CUSTOM_EVENTS_NAMES.QUERY_LOADED, onLoaded);
    }

    /**
     * The text to put in front of the reader's query: `prefix(id, opts) + query + "\n"`. One line.
     * @param {String} applyId Echoed in the snapshot, to match it to this apply.
     * @param {Object} [opts] {css: {selector: rules} (e.g. the lean look), keepView: true to put the
     *   reader's view back after the apply, view: [minLon, minLat, maxLon, maxLat] to show instead}.
     * @returns {String}
     */
    function prefix(applyId, opts) {
        opts = opts || {};
        var css = opts.css || {};
        var box = opts.view && opts.view.length === 4 ? opts.view.map(Number) : null;
        var parts = Object.keys(css).map(function (selector) { return JSON.stringify(selector) + ": " + JSON.stringify(css[selector]); });
        parts.push("run: function () { var install = " + install.toString() + "; (" + run.toString() + ")(" +
            JSON.stringify(String(applyId)) + ", " + (opts.keepView && !box ? "true" : "false") + ", " + JSON.stringify(box) + "); }");
        return ("ExtjsUtils.QUERY.decorate({ " + parts.join(", ") + " }) && ").replace(/\s*\n\s*/g, " ");
    }

    /** "ReferenceError: x is not defined (line 4, col 12)" -> {name, message, line, column}; line 1 columns corrected. */
    function parseError(text, prefixLength) {
        var where = /\(line (\d+), col (\d+)\)\s*$/.exec(text);
        var head = /^(?:Uncaught\s+)?([A-Za-z]*Error):\s*([\s\S]*?)(?:\s*\(line \d+, col \d+\))?\s*$/.exec(text);
        var line = where ? +where[1] : null;
        var column = where ? +where[2] - 1 : null;
        if (line === 1 && column !== null) column = Math.max(0, column - (prefixLength || 0) - WRAP_LENGTH);
        return { name: head ? head[1] : "Error", message: head ? head[2] : text, line: line, column: column, raw: text };
    }
    /* The platform evaluates "(function(){return true && " + text + "})()": its first line holds that much more. */
    var WRAP_LENGTH = "(function(){return true && ".length;

    root.MappiaProbe = { prefix: prefix, parseError: parseError };
})(window);
