/**
 * Runs Mappia queries in an embedded calculator through MappiaIO (mappia_io.js) - the same
 * library, and the same calls, a site embedding a Mappia map uses. Shared by the tool pages
 * ("Run this example in a live map") and the MappiaIO page's playground.
 *
 *   MappiaLive.connect(iframe).then(function (live) {
 *     live.onMessage(function (msg) { ... });   // everything the map sends
 *     return live.apply(queryText);              // resolves on "mappia__queryApplied"
 *   });
 *
 * ?mappia_origin=https://localhost on the page URL runs everything against a development
 * server instead of maps.csr.ufmg.br.
 */
(function (window, document) {
    "use strict";

    var DEFAULT_ORIGIN = "https://maps.csr.ufmg.br";
    var QUERY_APPLIED = "mappia__queryApplied";
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

    /**
     * Loads the calculator into `frame` and opens a MappiaIO connection to it.
     * @param {HTMLIFrameElement} frame The iframe that will hold the map.
     * @param {Object} [options] {origin, params}: the map server, extra calculator URL parameters.
     * @returns {Promise<Object>} {mappia, origin, apply(queryText), send(message), onMessage(fn)}.
     */
    function connect(frame, options) {
        options = options || {};
        var origin = mapOrigin(options.origin);
        var listeners = [];
        var pendingApplies = [];

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
                        apply: function (queryText) {
                            return new Promise(function (resolveApply, rejectApply) {
                                // One re-apply if the first confirmation is lost while the map is
                                // still starting; it is what a person would do anyway.
                                var retry = setTimeout(function () { mappia.applyQuery(queryText); }, APPLY_RETRY_MS);
                                var fail = setTimeout(function () {
                                    rejectApply(new Error("the map did not confirm the query in " + (APPLY_TIMEOUT_MS / 1000) + " s"));
                                }, APPLY_TIMEOUT_MS);
                                pendingApplies.push(function () {
                                    clearTimeout(retry);
                                    clearTimeout(fail);
                                    resolveApply();
                                });
                                mappia.applyQuery(queryText);
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
                frame.src = origin + "/calculator/?lang=eng&options=scale" + (options.params || "");
            });
        });
    }

    window.MappiaLive = { connect: connect, origin: mapOrigin };
})(window, document);
