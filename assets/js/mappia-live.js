/**
 * Runs Mappia queries in an embedded calculator through MappiaIO (mappia_io.js) - the same
 * library, and the same calls, a site embedding a Mappia map uses. Shared by the tool pages
 * ("Run it live") and the MappiaIO page's playground.
 *
 *   MappiaLive.connect(iframe).then(function (live) {
 *     live.onMessage(function (msg) { ... });   // everything the map sends
 *     return live.apply(queryText);              // resolves on "mappia__queryApplied"
 *   });
 *
 * The map is opened lean, so an example shows quickly and on its own:
 * - tools=zoomextent: none of the optional toolbar buttons but "zoom to the layers";
 * - the top bar and the always-on toolbar buttons are hidden, zoom +/- excepted - a style rule
 *   applied together with the example (ExtjsUtils.QUERY.decorate), never shown in its text;
 * - apply(query, {view: [minLon, minLat, maxLon, maxLat]}) opens the map on the example's region
 *   (the one its picture shows) - a run function of the same decorate call;
 * - with the documentation's map catalogue (data-catalogue on this script's tag, the id of a
 *   saved query declaring every map the examples use - see _config.yml maps.catalogue_queryid),
 *   ?queryid=<id>&options=capabilities,waitmessage: the calculator reads a capabilities document
 *   of a few kB with those maps instead of the whole server catalogue (about 600 kB, 5 s), and
 *   waits for the example instead of loading that query.
 * A page whose example needs more passes its own settings: connect(frame, {tools, options,
 * chrome: false, catalogue: false}).
 *
 * ?mappia_origin=https://localhost on the page URL runs everything against a development
 * server instead of maps.csr.ufmg.br.
 */
(function (window, document) {
    "use strict";

    var DEFAULT_ORIGIN = "https://maps.csr.ufmg.br";
    var QUERY_APPLIED = "mappia__queryApplied";
    var DEFAULT_TOOLS = "zoomextent";
    var DEFAULT_OPTIONS = ["scale"];
    var CATALOGUE_QUERY_ID = (document.currentScript && document.currentScript.getAttribute("data-catalogue")) || "";
    // Applied with the example (CSS rules, by selector): the top bar and the toolbar, zoom +/- kept.
    var LEAN_CHROME = {
        "#topbar": "display: none !important",
        "#RightButtons": "visibility: hidden",
        "#GxpZoomInButton, #GxpZoomOutButton": "visibility: visible",
    };
    // A server that does not answer must fail the page quickly, not leave it waiting: a script
    // or frame request to a host that accepts the connection and never replies has no timeout
    // of its own in the browser.
    var SCRIPT_TIMEOUT_MS = 15000;
    var LOAD_TIMEOUT_MS = 45000;
    var APPLY_RETRY_MS = 30000;
    var APPLY_TIMEOUT_MS = 90000;
    var scripts = {};

    function mapOrigin(fallback) {
        var match = /[?&]mappia_origin=([^&#]+)/.exec(window.location.search);
        return (match ? decodeURIComponent(match[1]) : (fallback || DEFAULT_ORIGIN)).replace(/\/+$/, "");
    }

    function loadScriptOnce(src) {
        if (!scripts[src]) {
            scripts[src] = new Promise(function (resolve, reject) {
                var script = document.createElement("script");
                var timer = setTimeout(function () { fail("did not answer in " + (SCRIPT_TIMEOUT_MS / 1000) + " s"); }, SCRIPT_TIMEOUT_MS);
                function fail(why) {
                    clearTimeout(timer);
                    script.onload = script.onerror = null;
                    if (script.parentNode) script.parentNode.removeChild(script);
                    delete scripts[src]; // the next attempt tries again
                    reject(new Error("the map server " + src.replace(/\/mappia_io\.js$/, "") + " " + why));
                }
                script.src = src;
                script.onload = function () { clearTimeout(timer); resolve(); };
                script.onerror = function () { fail("could not be reached"); };
                document.head.appendChild(script);
            });
        }
        return scripts[src];
    }

    function listOf(value, fallback) {
        if (value === undefined || value === null || value === "") return fallback.slice();
        return (Array.isArray(value) ? value : String(value).split(",")).map(function (item) { return String(item).trim(); }).filter(Boolean);
    }

    /** The calculator URL: one options= only (a second one froze the page). */
    function calculatorUrl(origin, settings) {
        var options = listOf(settings.options, DEFAULT_OPTIONS);
        var params = ["lang=eng"];
        if (CATALOGUE_QUERY_ID && settings.catalogue !== false) {
            params.push("queryid=" + encodeURIComponent(CATALOGUE_QUERY_ID));
            ["capabilities", "waitmessage"].forEach(function (option) {
                if (options.indexOf(option) === -1) options.push(option);
            });
        }
        params.push("options=" + options.join(","));
        params.push("tools=" + listOf(settings.tools, [DEFAULT_TOOLS]).join(","));
        return origin + "/calculator/?" + params.join("&");
    }

    /**
     * Loads the calculator into `frame` and opens a MappiaIO connection to it.
     * @param {HTMLIFrameElement} frame The iframe that will hold the map.
     * @param {Object} [settings] {origin, tools, options, chrome, catalogue}: the map server; the
     *   toolbar tools and page options (comma-separated or arrays); chrome: false keeps the top bar
     *   and the toolbar; catalogue: false loads the whole server catalogue (for queries that may
     *   name any map, as in the playground).
     * @returns {Promise<Object>} {mappia, origin, url, apply(queryText, {view}), send(message), onMessage(fn)}.
     */
    function connect(frame, settings) {
        settings = settings || {};
        var origin = mapOrigin(settings.origin);
        var url = calculatorUrl(origin, settings);
        var listeners = [];
        var pendingApplies = [];

        /** The lean chrome and the example's region, joined to the query with && (its text stays as shown). */
        function decorated(queryText, view) {
            var parts = [];
            if (settings.chrome !== false) {
                Object.keys(LEAN_CHROME).forEach(function (selector) {
                    parts.push(JSON.stringify(selector) + ": " + JSON.stringify(LEAN_CHROME[selector]));
                });
            }
            if (view && view.length === 4) {
                parts.push("run: function () { var map = ExtjsUtils.JS.getMap(); map.zoomToExtent(new OpenLayers.Bounds(" +
                    view.map(Number).join(", ") + ").transform(new OpenLayers.Projection(\"EPSG:4326\"), map.getProjectionObject())); }");
            }
            return parts.length ? "ExtjsUtils.QUERY.decorate({ " + parts.join(", ") + " }) &&\n" + queryText : queryText;
        }

        return loadScriptOnce(origin + "/mappia_io.js").then(function () {
            return new Promise(function (resolve, reject) {
                var timer = setTimeout(function () {
                    frame.onload = null;
                    frame.removeAttribute("src");
                    reject(new Error("the map at " + origin + " did not load in " + (LOAD_TIMEOUT_MS / 1000) + " s"));
                }, LOAD_TIMEOUT_MS);

                frame.onload = function () {
                    frame.onload = null;
                    clearTimeout(timer);
                    // keepAfterReady = true: this connection keeps talking after the handshake.
                    var mappia = window.MappiaIO(frame, true);
                    mappia.addOnMessageCallback(function (msg) {
                        if (msg === QUERY_APPLIED) {
                            pendingApplies.splice(0).forEach(function (done) { done(); });
                        }
                        listeners.forEach(function (listener) { listener(msg); });
                    });
                    resolve({
                        mappia: mappia,
                        origin: origin,
                        url: url,
                        apply: function (queryText, extras) {
                            var text = decorated(queryText, (extras || {}).view);
                            return new Promise(function (resolveApply, rejectApply) {
                                // One re-apply if the first confirmation is lost while the map is
                                // still starting; it is what a person would do anyway.
                                var retry = setTimeout(function () { mappia.applyQuery(text); }, APPLY_RETRY_MS);
                                var fail = setTimeout(function () {
                                    rejectApply(new Error("the map did not confirm the query in " + (APPLY_TIMEOUT_MS / 1000) + " s"));
                                }, APPLY_TIMEOUT_MS);
                                pendingApplies.push(function () {
                                    clearTimeout(retry);
                                    clearTimeout(fail);
                                    resolveApply();
                                });
                                mappia.applyQuery(text);
                            });
                        },
                        send: function (message) {
                            mappia.send(message);
                        },
                        onMessage: function (listener) {
                            listeners.push(listener);
                        },
                    });
                };
                frame.src = url;
            });
        });
    }

    window.MappiaLive = { connect: connect, origin: mapOrigin, calculatorUrl: calculatorUrl, leanChrome: LEAN_CHROME };
})(window, document);
