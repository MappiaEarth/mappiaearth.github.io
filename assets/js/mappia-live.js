/**
 * Runs Mappia queries in an embedded calculator through MappiaIO (mappia_io.js) - the same
 * library, and the same calls, a site embedding a Mappia map uses. Shared by the tool pages
 * ("Run it live"), the MappiaIO page's playground and the tutorial wizard.
 *
 * Two ways in:
 *
 *   MappiaLive.connect(iframe).then(function (live) {     // the tool pages' "Run it live"
 *     live.onMessage(function (msg) { ... });              // everything the map sends
 *     return live.apply(queryText, { view: [...] });       // resolves on "mappia__queryApplied"
 *   });
 *
 *   var session = MappiaLive.session(iframe, { catalogue, chrome });   // one map, many queries
 *   session.apply(queryText, { chrome: "lean" | "full", view, keepView }).then(function (result) {
 *     // {applyId, ok, superseded, error: {kind, name, message, line, column} | null, snapshot, ms}
 *   });
 *   session.onStatus(fn)   // {state: starting|ready|applying|applied|drawn|error|timeout|failed, text, ms}
 *   session.onReader(fn)   // what the reader does in the map: {kind: visibility|opacity|move, layer, snapshot}
 *   session.onMessage(fn), session.send(object), session.snapshot(), session.reset(), session.ready
 *
 * A session (assets/js/mappia-probe.js must be on the page) joins a one-line probe in front of
 * every query, so each apply answers with a SNAPSHOT of the map - the layers with their title,
 * visibility, opacity and groups, the view, the errors and warnings the platform only logs - and
 * a broken query is told apart from a good one (the platform confirms both with
 * mappia__queryApplied). When the platform reports the error itself ({action: "mappia__queryError",
 * error}, posted just before the confirmation) that report wins over the probe's.
 * Only the latest apply counts: an older one still running resolves with {superseded: true}.
 * Without an answer in 20 s the apply resolves with error.kind "timeout".
 *
 * The map is opened lean, so an example shows quickly and on its own:
 * - tools=zoomextent: none of the optional toolbar buttons but "zoom to the layers";
 * - the top bar and the always-on toolbar buttons are hidden, zoom +/- excepted - a style rule
 *   applied together with the example (ExtjsUtils.QUERY.decorate), never shown in its text
 *   (connect(frame, {chrome: false}) or session apply {chrome: "full"} keep them);
 * - {view: [minLon, minLat, maxLon, maxLat]} shows the example's region (the one its picture
 *   shows). It is applied once the query has loaded (the platform's QUERY_LOADED event): a zoom
 *   made earlier is undone by the platform's own zoom to the layers;
 * - with the documentation's map catalogue (data-catalogue on this script's tag, the id of a
 *   saved query declaring every map the examples use - see _config.yml maps.catalogue_queryid),
 *   ?queryid=<id>&options=capabilities,waitmessage: the calculator reads capabilities documents
 *   of a few kB with those maps instead of the whole server catalogue (835 kB compressed, 18.9 MB
 *   to parse - a query confirmed in 0.6 s instead of 10.4 s), and waits for the example instead
 *   of loading that query. Other servers an example registers are read from that saved query
 *   too, so it registers them as well (MappiaExplorer publish-docs.js writes it).
 * A page whose example needs more passes its own settings: connect(frame, {tools, options,
 * chrome: false, catalogue: false}).
 *
 * MappiaIO is created only once this page has finished loading: created while the page is still
 * "interactive" (an iframe loading keeps it so) it never greets the map, and every apply would
 * wait in its queue forever (mappia_io.js waits for a DOMContentLoaded that already fired).
 * Every query is sent with a final "\n", so a query ending in a // comment works too.
 *
 * On the page URL: ?mappia_origin=https://localhost runs everything against a development server
 * instead of maps.csr.ufmg.br; ?mappia_catalogue=<id> uses another saved query's capabilities
 * (none: the whole catalogue).
 */
(function (window, document) {
    "use strict";

    var DEFAULT_ORIGIN = "https://maps.csr.ufmg.br";
    var QUERY_APPLIED = "mappia__queryApplied";
    var QUERY_ERROR = "mappia__queryError";
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
    var SESSION_APPLY_TIMEOUT_MS = 20000;
    // After the confirmation the probe's snapshot follows within about a second; none at all means
    // the probe never ran - the text did not parse on the map.
    var SNAPSHOT_GRACE_MS = 5000;
    var scripts = {};

    function mapOrigin(fallback) {
        var match = /[?&]mappia_origin=([^&#]+)/.exec(window.location.search);
        return (match ? decodeURIComponent(match[1]) : (fallback || DEFAULT_ORIGIN)).replace(/\/+$/, "");
    }

    function catalogueOf(settings) {
        if (settings.catalogue === false) return "";
        var match = /[?&]mappia_catalogue=([^&#]+)/.exec(window.location.search);
        if (match) return decodeURIComponent(match[1]) === "none" ? "" : decodeURIComponent(match[1]);
        if (typeof settings.catalogue === "string" && settings.catalogue) return settings.catalogue;
        return CATALOGUE_QUERY_ID;
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

    /** Runs fn once this page has loaded (see the note on MappiaIO above). */
    function whenPageLoaded(fn) {
        if (document.readyState === "complete") { fn(); return; }
        window.addEventListener("load", function once() { window.removeEventListener("load", once); fn(); });
    }

    function listOf(value, fallback) {
        if (value === undefined || value === null || value === "") return fallback.slice();
        return (Array.isArray(value) ? value : String(value).split(",")).map(function (item) { return String(item).trim(); }).filter(Boolean);
    }

    /** The calculator URL: one options= only (a second one froze the page). */
    function calculatorUrl(origin, settings) {
        settings = settings || {};
        var options = listOf(settings.options, DEFAULT_OPTIONS);
        var params = ["lang=eng"];
        var catalogue = catalogueOf(settings);
        if (catalogue) {
            params.push("queryid=" + encodeURIComponent(catalogue));
            ["capabilities", "waitmessage"].forEach(function (option) {
                if (options.indexOf(option) === -1) options.push(option);
            });
        }
        params.push("options=" + options.join(","));
        params.push("tools=" + listOf(settings.tools, [DEFAULT_TOOLS]).join(","));
        return origin + "/calculator/?" + params.join("&");
    }

    function cssParts(css) {
        return Object.keys(css || {}).map(function (selector) { return JSON.stringify(selector) + ": " + JSON.stringify(css[selector]); });
    }

    /** A decorate run function that shows `view` once the query has loaded (after the platform's zoom to the layers). */
    function viewRun(view) {
        var zoom = "var map = ExtjsUtils.JS.getMap(); map.zoomToExtent(new OpenLayers.Bounds(" + view.map(Number).join(", ") +
            ").transform(new OpenLayers.Projection(\"EPSG:4326\"), map.getProjectionObject()));";
        return "run: function () { if (typeof CustomEvents === \"undefined\") { " + zoom + " return; } " +
            "var go = function () { setTimeout(function () { CustomEvents.remove(CUSTOM_EVENTS_NAMES.QUERY_LOADED, go); " + zoom + " }, 0); }; " +
            "CustomEvents.register(CUSTOM_EVENTS_NAMES.QUERY_LOADED, go); }";
    }

    /**
     * Loads the calculator into `frame` and opens a MappiaIO connection to it.
     * @param {HTMLIFrameElement} frame The iframe that will hold the map.
     * @param {Object} [settings] {origin, tools, options, chrome, catalogue}: the map server; the
     *   toolbar tools and page options (comma-separated or arrays); chrome: false keeps the top bar
     *   and the toolbar; catalogue: false loads the whole server catalogue (for queries that may
     *   name any map).
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
            var parts = settings.chrome !== false ? cssParts(LEAN_CHROME) : [];
            if (view && view.length === 4) parts.push(viewRun(view));
            return (parts.length ? "ExtjsUtils.QUERY.decorate({ " + parts.join(", ") + " }) &&\n" + queryText : queryText) + "\n";
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
                    whenPageLoaded(function () {
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
                    });
                };
                frame.src = url;
            });
        });
    }

    /** The platform's own error report ({action: "mappia__queryError", error}), or null. */
    function platformError(msg) {
        if (!msg || typeof msg !== "object") return null;
        if (msg.action !== QUERY_ERROR && msg.operation !== QUERY_ERROR && msg.type !== QUERY_ERROR) return null;
        var error = msg.error || msg;
        return { name: error.name || "Error", message: String(error.message || "the query could not be run"),
            line: error.line == null ? null : +error.line, column: error.column == null ? null : +error.column };
    }

    /**
     * One live map for many queries (the tutorial, the playground). See the file comment.
     * @param {HTMLIFrameElement} frame
     * @param {Object} [settings] {origin, tools, options, catalogue (false | a saved query id), chrome ("lean" default | "full")}
     */
    function session(frame, settings) {
        settings = settings || {};
        if (!window.MappiaProbe) throw new Error("MappiaLive.session needs assets/js/mappia-probe.js on the page");
        var origin = mapOrigin(settings.origin);
        var url = calculatorUrl(origin, settings);
        var statusListeners = [], readerListeners = [], messageListeners = [];
        var mappia = null, seq = 0, current = null, lastStatus = null, lastApplyId = null, asks = {};
        var self = {};

        function status(state, extra) {
            lastStatus = Object.assign({ state: state }, extra || {});
            statusListeners.forEach(function (fn) { try { fn(lastStatus); } catch (e) { console.error(e); } });
        }

        function finish(entry, result) {
            if (!entry || entry.done) return;
            entry.done = true;
            clearTimeout(entry.timer);
            clearTimeout(entry.grace);
            if (current === entry) current = null;
            result.applyId = entry.id;
            result.ms = Math.round(performance.now() - entry.started);
            if (!result.superseded) {
                if (result.ok) status("applied", { ms: result.ms, text: "Applied in " + (result.ms / 1000).toFixed(1) + " s - drawing..." });
                else if (result.error && result.error.kind === "timeout") status("timeout", { text: result.error.message });
                else status("error", { ms: result.ms, text: "The map could not run the query." });
            }
            entry.resolve(result);
        }

        function fromSnapshot(entry, snapshot) {
            var errors = [];
            if (entry.platformError) {
                /* the platform counts columns from 1, on the text it evaluated: line 1 holds its wrapper and our probe too */
                var reported = Object.assign({ kind: "runtime" }, entry.platformError);
                if (reported.column != null) reported.column = Math.max(0, reported.column - 1 - (reported.line === 1 ? entry.prefixLength + "(function(){return true && ".length : 0));
                errors.push(reported);
            }
            else (snapshot.errors || []).forEach(function (text) { errors.push(Object.assign({ kind: "runtime" }, MappiaProbe.parseError(text, entry.prefixLength))); });
            return { ok: errors.length === 0, error: errors[0] || null, errors: errors, snapshot: snapshot };
        }

        function onMessage(msg) {
            messageListeners.forEach(function (fn) { try { fn(msg); } catch (e) { console.error(e); } });
            var reported = platformError(msg);
            if (reported) { if (current) current.platformError = reported; return; }
            if (msg === QUERY_APPLIED) {
                if (current && !current.applied) {
                    var entry = current;
                    entry.applied = true;
                    entry.grace = setTimeout(function () {
                        finish(entry, { ok: false, snapshot: null, error: Object.assign({ kind: entry.platformError ? "runtime" : "unread" },
                            entry.platformError || { name: "SyntaxError", message: "the map could not read the query" }) });
                    }, entry.platformError ? 1500 : SNAPSHOT_GRACE_MS);
                }
                return;
            }
            if (!msg || typeof msg !== "object") return;
            if (msg.operation === "tutorial__snapshot") {
                if (msg.onRequest && asks[msg.applyId]) { asks[msg.applyId](msg); delete asks[msg.applyId]; return; }
                if (current && msg.applyId === current.id) finish(current, fromSnapshot(current, msg));
                return;
            }
            if (msg.operation === "tutorial__reader") {
                readerListeners.forEach(function (fn) { try { fn(msg); } catch (e) { console.error(e); } });
                return;
            }
            if (msg.operation === "tutorial__drawn") {
                if (msg.applyId === lastApplyId && !current) status("drawn", { ms: msg.ms, text: "Drawn" });
            }
        }

        function start() {
            status("starting", { text: "Starting the live map..." });
            var started = performance.now();
            self.ready = loadScriptOnce(origin + "/mappia_io.js").then(function () {
                return new Promise(function (resolve, reject) {
                    var timer = setTimeout(function () {
                        frame.onload = null;
                        reject(new Error("the map at " + origin + " did not load in " + (LOAD_TIMEOUT_MS / 1000) + " s"));
                    }, LOAD_TIMEOUT_MS);
                    frame.onload = function () {
                        frame.onload = null;
                        clearTimeout(timer);
                        whenPageLoaded(function () {
                            if (mappia && mappia.remove) mappia.remove();
                            mappia = window.MappiaIO(frame, true);
                            mappia.addOnMessageCallback(onMessage);
                            resolve(self);
                        });
                    };
                    frame.src = url;
                });
            });
            self.ready.then(function () { status("ready", { ms: Math.round(performance.now() - started), text: "Map ready" }); },
                function (error) { status("failed", { text: "The live map is not available (" + error.message + ")." }); });
            return self.ready;
        }

        /**
         * Applies `text` (the reader's query, as typed) to the map.
         * @param {String} text
         * @param {Object} [opts] {chrome: "lean"|"full", view: [4 numbers] (shown after loading), keepView: true (put the reader's view back), timeoutMs}
         * @returns {Promise<Object>} {applyId, ok, superseded, error, errors, snapshot, ms}
         */
        self.apply = function (text, opts) {
            opts = opts || {};
            if (current) finish(current, { superseded: true, ok: false, error: null, snapshot: null });
            var id = opts.applyId || "apply-" + (++seq);
            var chrome = opts.chrome || settings.chrome || "lean";
            var prefix = MappiaProbe.prefix(id, { css: chrome === "full" ? {} : LEAN_CHROME, keepView: !!opts.keepView, view: opts.view });
            var entry = { id: id, started: performance.now(), prefixLength: prefix.length };
            current = entry;
            lastApplyId = id;
            var promise = new Promise(function (resolve) { entry.resolve = resolve; });
            self.ready.then(function () {
                if (entry.done) return;
                entry.started = performance.now();
                entry.timer = setTimeout(function () {
                    finish(entry, { ok: false, snapshot: null, error: { kind: "timeout", name: "Timeout",
                        message: "The map gave no answer in " + ((opts.timeoutMs || SESSION_APPLY_TIMEOUT_MS) / 1000) + " s. It may still be busy with a large layer, or the query may hold an entry it cannot read. Check the query, then press Run again." } });
                }, opts.timeoutMs || SESSION_APPLY_TIMEOUT_MS);
                status("applying", { text: "Applying..." });
                mappia.applyQuery(prefix + text + "\n");
            }, function (error) {
                finish(entry, { ok: false, snapshot: null, error: { kind: "unavailable", name: "Error", message: "The live map is not available (" + error.message + ")." } });
            });
            return promise;
        };

        /** A snapshot of the map now (the private probe channel); null before the first apply or after 5 s. */
        self.snapshot = function () {
            return self.ready.then(function () {
                return new Promise(function (resolve) {
                    var id = "ask-" + (++seq);
                    var timer = setTimeout(function () { delete asks[id]; resolve(null); }, 5000);
                    asks[id] = function (msg) { clearTimeout(timer); resolve(msg); };
                    frame.contentWindow.postMessage({ tutorial_probe: { applyId: id } }, origin);
                });
            });
        };

        /** Reloads the map (a clean slate: no callback, listener or handler of earlier queries). */
        self.reset = function () {
            if (current) finish(current, { superseded: true, ok: false, error: null, snapshot: null });
            return start();
        };
        self.send = function (message) { return self.ready.then(function () { mappia.send(message); }); };
        self.onStatus = function (fn) { statusListeners.push(fn); if (lastStatus) fn(lastStatus); return self; };
        self.onReader = function (fn) { readerListeners.push(fn); return self; };
        self.onMessage = function (fn) { messageListeners.push(fn); return self; };
        self.origin = origin;
        self.url = url;
        self.frame = frame;
        start();
        return self;
    }

    window.MappiaLive = { connect: connect, session: session, origin: mapOrigin, calculatorUrl: calculatorUrl, leanChrome: LEAN_CHROME };
})(window, document);
