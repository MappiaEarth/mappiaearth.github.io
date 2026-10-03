/**
 * The tutorial wizard (/tutorial/): one page, one live map, one editor, checked steps.
 *
 * Data: _data/tutorial.json (written by MappiaExplorer's publish-docs.js from
 * examples/tutorial/steps.yml), embedded in the page as <script type="application/json"
 * id="tutorial-data">: {chapters: [{id, title, notes, steps: [ids]}], steps: [{id, chapter, title,
 * text_html, task_html, start (null: carry), carry, solution, wrong, check, messages, hints_html,
 * highlight, chrome, view}], messages: {parse, runtime, warning}, catalogue_queryid}.
 * Uses: assets/js/mappia-editor.js (the editor + the parse check), assets/js/mappia-live.js
 * (MappiaLive.session: one map, a snapshot after every apply), assets/js/mappia-probe.js.
 *
 * How a step goes:
 * - its start text: what the reader left in this step before (localStorage), else the step's own
 *   start (a chapter's first step; the reader's last passing text can be brought back), else -
 *   "carry" - the reader's passing text of the previous step, else the previous step's solution;
 * - Run (or Ctrl/Cmd+Enter): the text is parsed in the page first (the platform's own wrapper); a
 *   parse error is shown on the line to fix and nothing is sent. Otherwise it is applied to the map
 *   and the snapshot that comes back is judged by check(): "Done", or "Not yet: <what the map
 *   shows>"; a runtime error is explained and the last working text is applied again by itself;
 * - reader actions in the map (a layer switched in the menu) count for steps whose check has `reader`;
 * - Next is never locked ("Skip" until done); the first hint opens by itself after 2 failed Runs;
 *   "Show me" previews the solution against the reader's text, "Use it" runs it;
 * - the last step leads to the end screen (summary, your query, the chapter notes, the tools).
 * Progress and every step's text: localStorage "mappia-tutorial-v1" (in try/catch: the wizard works
 * without storage, it just forgets). Deep links: /tutorial/#<step id>.
 *
 * Test hook (MappiaExplorer scripts/test-tutorial-steps.js): window.MappiaTutorial =
 *   {ready(), go(stepId), setText(text), getText(), run() -> Promise<verdict>, state(), check}
 * with verdict = {kind: "pass" | "fail" | "parse" | "runtime" | "timeout", pass, message (exactly
 * what the reader reads), problems: [String], notes: [String]}.
 */
(function (window, document) {
    "use strict";

    var STORE_KEY = "mappia-tutorial-v1";
    var HINT_AFTER_FAILS = 2;

    /* ---------- messages ---------- */

    var DEFAULT_RUNTIME = [
        { pattern: "\\.map is not a function|e\\.map is not a function", message: "The query must end with the list of layers [ ... ]: the last part of an && chain is the list." },
        { pattern: "^([\\w$]+) is not defined", message: "`{1}` is not defined{at}. If it is a text, put it in quotes: \"{1}\". A shared name must first be declared with ExtjsUtils.QUERY.setQueryGlobalProperties." },
        { pattern: "^([\\w$.]+) is not a function", message: "`{1}` is not a function{at} - check its spelling; the API reference lists the helpers." },
        { pattern: "Cannot read properties of (undefined|null)", message: "Something used{at} does not exist ({raw})." },
    ];
    var DEFAULT_WARNING = [
        { pattern: "Could not create layer record for layer '([^']+)'", message: "There is no map called \"{1}\" in the catalogue - check the spelling of the name you typed." },
        { pattern: "Error loading Source: (\\S+)", message: "The server \"{1}\" did not answer - this is not your mistake. Try again in a moment." },
        { pattern: "Non-existing source '([^']+)'", message: "No server is registered as \"{1}\": a layer's source must name a server registered with addRemoteWMSServer." },
    ];

    function fill(template, values) {
        return String(template).replace(/\{(\w+)\}/g, function (all, key) { return values[key] !== undefined && values[key] !== null ? values[key] : all; });
    }

    /**
     * First matching rule of `rules` for `text`, its message filled in. A rule is {match (or
     * pattern): a regular expression on the text, message: a template}; numbered and named groups
     * of the match become placeholders ({1}, {name}), with `extra` ({line}, {column}...). When the
     * line is not known, "Line {line}: " is left out of the sentence.
     */
    function byRules(rules, text, extra) {
        var result = null;
        extra = extra || {};
        (rules || []).some(function (rule) {
            var re;
            try { re = new RegExp(rule.match || rule.pattern || "(?!)"); } catch (e) { return false; }
            var m = re.exec(text);
            if (!m) return false;
            var values = Object.assign({ raw: text, message: text, original: text }, extra);
            for (var i = 1; i < m.length; i++) values[i] = m[i];
            Object.assign(values, m.groups || {});
            var template = String(rule.message);
            if (!extra.line) {
                template = template.replace(/Line \{line\}[:,]\s*/g, "").replace(/\s*\(line \{line\}\)/g, "");
                template = template.charAt(0).toUpperCase() + template.slice(1);
            }
            result = fill(template, values);
            return true;
        });
        return result;
    }

    function tableOf(messages, keys) {
        for (var i = 0; i < keys.length; i++) if (messages && Array.isArray(messages[keys[i]])) return messages[keys[i]];
        return [];
    }

    /** The plain-English sentence for an error the map reported: the wording table first (on "Name: message"), then the built-in one. */
    function explainRuntime(error, messages) {
        var raw = String(error.message || "");
        var full = (error.name ? error.name + ": " : "") + raw;
        var extra = { at: error.line ? " (line " + error.line + ")" : "", line: error.line || null, column: error.column != null ? error.column + 1 : null };
        return byRules(tableOf(messages, ["runtime"]), full, extra) || byRules(DEFAULT_RUNTIME, raw, extra)
            || ("The map stopped" + extra.at + ": " + full);
    }

    /** The sentence for a platform warning (a map name not in the catalogue, a server that did not answer), or null. */
    function explainWarning(text, messages) {
        return byRules(tableOf(messages, ["warnings", "warning"]), text, {}) || byRules(DEFAULT_WARNING, text, {});
    }

    /* ---------- the check (pure: no DOM, no map) ---------- */

    function sameText(a, b) { return String(a == null ? "" : a).trim().toLowerCase() === String(b == null ? "" : b).trim().toLowerCase(); }

    /**
     * Judges a step: the expectations of step.check against the last successful snapshot and the
     * step's history. Pure, for tests.
     * @param {Object} step A step of _data/tutorial.json (check, messages).
     * @param {Object} snapshot {layers: [{name, title, visible, opacity, groups: {menu, panel}}], warnings}.
     * @param {Object} history {warnings: [String], parseErrorSeen: Boolean, reader: [{name, visible}]}.
     * @param {Object} [messages] The global wording table (messages.warning).
     * @returns {{pass: Boolean, problems: String[], notes: String[]}}
     */
    function check(step, snapshot, history, messages) {
        var c = step.check || {};
        var own = step.messages || {};
        var problems = [];
        snapshot = snapshot || { layers: [], warnings: [] };
        history = history || {};
        function say(key, fallback, values) { return fill(own[key] || fallback, values || {}); }
        if (c.free) return { pass: true, problems: [], notes: [] };
        (c.layers || []).forEach(function (want) {
            var layer = (snapshot.layers || []).filter(function (l) { return l.name === want.name; })[0];
            var key = "layers." + want.name + ".";
            if (!layer) {
                var typed = null;
                (snapshot.warnings || []).some(function (w) { typed = explainWarning(w, messages); return !!typed; });
                /* a misspelled map: what the map said, naming what the learner typed, comes first; else
                   the step's own words ("layers.<name>" in steps.yml, or "layers.<name>.present") */
                var missing = own["layers." + want.name] ? "layers." + want.name : key + "present";
                problems.push(typed || say(missing, "The map has no layer " + want.name + " - is its name written exactly so?", { name: want.name }));
                return;
            }
            var label = layer.title || want.name;
            var values = { name: want.name, title: label };
            if (want.visible !== undefined && layer.visible !== want.visible) {
                problems.push(say(key + "visible", "\"" + label + "\" is " + (layer.visible ? "on" : "off") + " - the task asks for it " + (want.visible ? "on" : "off") + ".", values));
            }
            if (want.title !== undefined && !sameText(layer.title, want.title)) {
                problems.push(say(key + "title", "Its title is now \"" + layer.title + "\" - the task asks for \"" + want.title + "\".",
                    Object.assign({ actual: layer.title, expected: want.title }, values)));
            }
            if (want.opacity !== undefined) {
                var range = Array.isArray(want.opacity) ? want.opacity : [want.opacity, want.opacity];
                if (!(layer.opacity >= range[0] - 1e-6 && layer.opacity <= range[1] + 1e-6)) {
                    problems.push(say(key + "opacity", "\"" + label + "\" has opacity " + layer.opacity + " - the task asks for " +
                        (range[0] === range[1] ? range[0] : "a value between " + range[0] + " and " + range[1]) + ".",
                        Object.assign({ actual: layer.opacity, min: range[0], max: range[1] }, values)));
                }
            }
            /* above: drawn over another layer - the snapshot lists the map's layers top first, and the
               first entry of the query's list is the one on top */
            if (want.above !== undefined) {
                var order = (snapshot.layers || []).map(function (l) { return l.name; });
                var under = (snapshot.layers || []).filter(function (l) { return l.name === want.above; })[0];
                if (under && order.indexOf(want.name) > order.indexOf(want.above)) {
                    problems.push(say(key + "above", "\"" + label + "\" is drawn under \"" + (under.title || want.above) +
                        "\": put its { } entry first in the list - the first entry is drawn on top.", Object.assign({ under: under.title || want.above }, values)));
                }
            }
            ["menu", "panel"].forEach(function (where) {
                if (want[where] === undefined) return;
                var groups = (layer.groups && layer.groups[where]) || [];
                if (groups.indexOf(want[where]) === -1) {
                    var place = where === "menu" ? "in the top menu" : "in the layer panel";
                    problems.push(say(key + where, "\"" + label + "\" is " + (groups.length ? "under \"" + groups.join(" / ") + "\" " : "not in a group ") +
                        place + " - the task asks for \"" + want[where] + "\".", Object.assign({ actual: groups.join(" / "), expected: want[where] }, values)));
                }
            });
        });
        (c.absent || []).forEach(function (name) {
            if ((snapshot.layers || []).some(function (l) { return l.name === name; })) {
                problems.push(say("absent." + name, "The map still has the layer " + name + ".", { name: name }));
            }
        });
        if (c.warningSeen && !(history.warnings || []).some(function (w) { return String(w).indexOf(c.warningSeen) !== -1; })) {
            problems.push(say("warningSeen", "Run it once with the change the task asks for, to see what the map says."));
        }
        if (c.parseErrorSeen && !history.parseErrorSeen) {
            problems.push(say("parseErrorSeen", "Run it once with the change the task asks for, to see the message."));
        }
        if (c.reader && c.reader.length) {
            var next = readerProgress(c.reader, history.reader);
            if (next < c.reader.length) {
                var want = c.reader[next];
                problems.push(say("reader", "Now use the map itself: switch " + want.name + " " + (want.visible ? "on" : "off") + " in the top menu.", { name: want.name }));
            }
        }
        problems = problems.filter(function (p, i) { return problems.indexOf(p) === i; });
        return { pass: problems.length === 0, problems: problems, notes: [] };
    }

    /** Hints from the text itself (acorn): a passing query may still teach a habit. */
    function textNotes(text) {
        var notes = [];
        var parsed;
        try { parsed = window.MappiaEditor.parse(text); } catch (e) { return notes; }
        (function walk(node) {
            if (!node || typeof node.type !== "string") return;
            if (node.type === "Property" && node.key && node.value && node.value.type === "Literal" && typeof node.value.value === "string") {
                var key = node.key.name || node.key.value;
                var value = node.value.value;
                var line = window.MappiaEditor.locate(text, node.value.start - parsed.offset).line;
                if (/^(opacity|minscale|maxscale|priority)$/.test(key) && value.trim() !== "" && !isNaN(Number(value))) {
                    notes.push("Line " + line + ": " + key + ": \"" + value + "\" works, but numbers go without quotes: " + key + ": " + value + ",");
                } else if (/^(visibility|openGroup)$/.test(key) && /^(true|false)$/.test(value)) {
                    notes.push("Line " + line + ": " + key + ": \"" + value + "\" - true and false go without quotes: " + key + ": " + value + ",");
                }
            }
            for (var k in node) {
                if (k === "loc") continue;
                var child = node[k];
                if (Array.isArray(child)) child.forEach(walk);
                else if (child && typeof child.type === "string") walk(child);
            }
        })(parsed.expression);
        return notes;
    }

    /** A line diff (longest common subsequence): [{op: "same"|"add"|"del", text}]. */
    /**
     * A line diff (longest common subsequence): [{op: "same"|"add"|"del", text}]. Lines are compared
     * with their spaces normalised and blank lines left out, so the reader's own indentation is not
     * reported as a change; "same" lines are shown as the solution writes them.
     */
    function diffLines(fromText, toText) {
        function lines(text) { return String(text).split("\n").filter(function (line) { return line.trim() !== ""; }); }
        function key(line) { return line.trim().replace(/\s+/g, " ").replace(/\s*([,:{}\[\]()])\s*/g, "$1"); }
        var a = lines(fromText), b = lines(toText);
        var ka = a.map(key), kb = b.map(key);
        var n = a.length, m = b.length, i, j;
        var table = [];
        for (i = 0; i <= n; i++) { table.push(new Array(m + 1).fill(0)); }
        for (i = n - 1; i >= 0; i--) {
            for (j = m - 1; j >= 0; j--) table[i][j] = ka[i] === kb[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
        }
        var out = [];
        i = 0; j = 0;
        while (i < n && j < m) {
            if (ka[i] === kb[j]) { out.push({ op: "same", text: b[j] }); i++; j++; }
            else if (table[i + 1][j] >= table[i][j + 1]) { out.push({ op: "del", text: a[i] }); i++; }
            else { out.push({ op: "add", text: b[j] }); j++; }
        }
        while (i < n) out.push({ op: "del", text: a[i++] });
        while (j < m) out.push({ op: "add", text: b[j++] });
        return out;
    }

    /** How many of the expected reader actions were seen, in order. */
    function readerProgress(expected, events) {
        var next = 0;
        (events || []).forEach(function (event) {
            var want = expected[next];
            if (want && event.name === want.name && (want.visible === undefined || event.visible === want.visible)) next++;
        });
        return next;
    }

    /* ---------- storage ---------- */

    function loadStore() {
        try {
            var stored = JSON.parse(window.localStorage.getItem(STORE_KEY));
            if (stored && stored.v === 1) return stored;
        } catch (e) {}
        return { v: 1, current: null, steps: {}, lastPassing: null };
    }

    /* ---------- the page ---------- */

    function start() {
        var root = document.getElementById("tutorial-wizard");
        var dataNode = document.getElementById("tutorial-data");
        if (!root || !dataNode || !window.MappiaEditor || !window.MappiaLive) return;
        var data;
        try { data = JSON.parse(dataNode.textContent); } catch (e) { return; }
        if (!data || !data.steps || !data.steps.length) return;

        var steps = data.steps, chapters = data.chapters || [];
        var messages = data.messages || {};
        var byId = {};
        steps.forEach(function (step, i) { step.index = i; byId[step.id] = step; });
        function chapterOf(step) {
            return chapters.filter(function (c) { return c.id === step.chapter || (c.steps || []).indexOf(step.id) !== -1; })[0] || { id: step.chapter, title: "", steps: [] };
        }
        function firstOfChapter(step) {
            var c = chapterOf(step);
            var ids = (c.steps && c.steps.length) ? c.steps : steps.filter(function (s) { return s.chapter === step.chapter; }).map(function (s) { return s.id; });
            return ids[0] === step.id;
        }

        var $ = function (id) { return document.getElementById(id); };
        var el = {
            app: $("wizard-app"), progress: $("wizard-progress"), where: $("wizard-where"), title: $("wizard-title"),
            text: $("wizard-text"), task: $("wizard-task"), carry: $("wizard-carry"), bring: $("wizard-bring"),
            editor: $("wizard-editor"), run: $("wizard-run"), next: $("wizard-next"), prev: $("wizard-prev"),
            verdict: $("wizard-verdict"), verdictFull: $("wizard-verdict-full"), notes: $("wizard-notes"), hint: $("wizard-hint"), hints: $("wizard-hints"),
            show: $("wizard-show"), showme: $("wizard-showme"), diff: $("wizard-diff"), use: $("wizard-use"), cancel: $("wizard-cancel"),
            undo: $("wizard-undo"), reset: $("wizard-reset"), map: $("wizard-map"), status: $("wizard-status"),
            summary: $("wizard-summary"), card: $("wizard-card"), end: $("wizard-end"), endSummary: $("wizard-end-summary"),
            endQuery: $("wizard-end-query"), endCopy: $("wizard-end-copy"), endBack: $("wizard-end-back"), startOver: $("wizard-start-over"),
            welcome: $("wizard-welcome"), nocode: $("wizard-nocode"), source: $("wizard-source"), legend: $("wizard-legend"), work: $("wizard-work"),
            hintBar: $("wizard-hint-bar"), restart: $("wizard-restart"),
        };

        /** A step done with the map itself: its check is only the reader's actions, nothing in the query. */
        function isMapOnly(step) {
            var c = (step && step.check) || {};
            return !!(c.reader && c.reader.length) && !c.layers && !c.absent && !c.warningSeen && !c.parseErrorSeen && !c.free;
        }

        var store = loadStore();
        function save() { try { window.localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {} }
        function stepStore(step) { return store.steps[step.id] || (store.steps[step.id] = {}); }

        var current = null, history = null, lastRunSnapshot = null, lastWorking = null, lastVerdict = null;
        var latestRun = null, stepApply = Promise.resolve(), firstApply = null, appliedText = null;

        root.classList.add("is-live");
        el.app.hidden = false;
        el.scroll = $("wizard-scroll");

        /*
         * Desktop: the wizard takes the rest of the window under the page header, so the task, Run
         * (at the bottom of the left column) and the map's own top menu are on screen together; the
         * editor is capped to the room left under the task and scrolls inside.
         */
        function fit() {
            var desktop = window.matchMedia && window.matchMedia("(min-width: 901px)").matches;
            if (!desktop) {
                root.style.removeProperty("--wizard-h");
                root.style.removeProperty("--wizard-editor-h");
                return;
            }
            var top = el.app.getBoundingClientRect().top + (window.pageYOffset || 0);
            root.style.setProperty("--wizard-h", Math.max(560, window.innerHeight - top - 4) + "px");
            /* The query panel shows the whole query; the step's text above it scrolls. Only when the
               query is taller than the window allows - keeping TEXT_MIN for the text - does the
               editor scroll inside. */
            var TEXT_MIN = 100; /* the step's title and its first lines; the rest scrolls */
            var content = el.editor.querySelector(".cm-content") || el.editor.querySelector("textarea");
            var scroller = el.editor.querySelector(".cm-scroller");
            var need = content ? content.scrollHeight + (scroller ? scroller.offsetHeight - scroller.clientHeight : 0) + 2 : 200;
            var card = el.card.getBoundingClientRect().height;
            var foot = el.card.querySelector(".wizard__foot").getBoundingClientRect().height;
            var aroundEditor = el.work.getBoundingClientRect().height - el.editor.getBoundingClientRect().height;
            var textMin = Math.min(el.scroll.scrollHeight, TEXT_MIN);
            var room = card - foot - aroundEditor - textMin;
            root.style.setProperty("--wizard-editor-h", Math.max(120, Math.min(need, room)) + "px");
        }
        var fitLines = 0; /* fit again when the query grows or shrinks by a line */
        function fitIfLinesChanged(text) {
            var lines = String(text).split("\n").length;
            if (lines !== fitLines) { fitLines = lines; fit(); }
        }
        window.addEventListener("resize", fit);
        window.addEventListener("load", function () { fit(); setTimeout(fit, 800); });

        var editor = window.MappiaEditor.create(el.editor, {
            doc: "",
            messages: messages,
            label: "The query of this step (JavaScript). Ctrl+Enter runs it. Esc then Tab leaves the editor.",
            maxHeight: "var(--wizard-editor-h, none)",
            onRun: function () { run(); },
            onChange: function (text) {
                updateSource();
                fitIfLinesChanged(text);
                if (!current || settingText) return; /* only the reader's own edits are kept as this step's text */
                clearTimeout(onChangeTimer);
                onChangeTimer = setTimeout(function () { stepStore(current).text = text; save(); updateUndo(); }, 300);
            },
        });
        var onChangeTimer = null, settingText = false;

        /* --- whose text is in the editor: the step's starting query, or the learner's version --- */

        /** What the tutorial proposes for a step: its own start, else what the step before arrives at. */
        function baselineOf(step) {
            if (!step) return "";
            if (step.start != null && step.start !== "") return step.start;
            var prev = steps[step.index - 1];
            return prev ? (prev.solution || baselineOf(prev)) : "";
        }

        function updateSource() {
            if (!current || !el.source) return;
            var text = editor.getValue();
            var ch = editor.changes ? editor.changes() : window.MappiaEditor.changedAgainst(baselineOf(current), text);
            var backup = stepStore(current).mine;
            if (!ch.lines.length && !ch.removed) {
                el.source.classList.remove("is-mine");
                el.source.innerHTML = "<span><strong>The starting query</strong> proposed by this step</span>" +
                    (typeof backup === "string" && backup !== text ? "<button type=\"button\" class=\"wizard__link\" data-act=\"mine\">Bring my version back</button>" : "");
                return;
            }
            var extra = Math.max(0, ch.removed - ch.lines.length);
            var what = ch.lines.length ? ch.lines.length + " line" + (ch.lines.length > 1 ? "s" : "") + " changed (blue bar)" : "";
            if (extra) what += (what ? ", " : "") + extra + " line" + (extra > 1 ? "s" : "") + " removed";
            el.source.classList.add("is-mine");
            el.source.innerHTML = "<span><strong>Your version</strong> - " + what + " against the starting query of this step</span>" +
                "<button type=\"button\" class=\"wizard__link\" data-act=\"base\">Back to the starting query</button>";
        }

        /** Puts the step's starting query back; the learner's version is kept, one click away. */
        function backToStart() {
            if (!current) return;
            var mine = editor.getValue(), base = baselineOf(current);
            if (mine !== base) stepStore(current).mine = mine;
            setEditorText(base);
            stepStore(current).text = base;
            save();
            updateSource();
            updateUndo();
        }

        /**
         * Restart this step: as when the learner arrived - its starting query in the editor and on the
         * map (layers switched in the map come back as the query says), no verdict, hints, Show me or
         * history. Their own text is kept: "Bring my version back" in the label above the editor.
         * The step stays done if it was.
         */
        function restartStep() {
            if (!current) return Promise.resolve(null);
            var s = stepStore(current);
            var mine = editor.getValue();
            if (typeof s.text === "string") {
                if (mine !== baselineOf(current)) s.mine = mine;
                delete s.text;
            }
            save();
            el.hints.hidden = true;
            el.hints.innerHTML = "";
            el.showme.hidden = true;
            var step = current;
            return show(step).then(function (result) {
                if (current === step) {
                    updateSource();
                    note("idle", "The step starts again: its starting query is back on the map." + (isMapOnly(step) ? " Use the map on the right." : " Edit it, then press Run."));
                }
                return result;
            });
        }

        function bringMineBack() {
            if (!current || typeof stepStore(current).mine !== "string") return;
            setEditorText(stepStore(current).mine);
            stepStore(current).text = stepStore(current).mine;
            save();
            updateSource();
            updateUndo();
        }

        /** The wizard puts a text in the editor (a step's start, Show me, Undo...): not stored as the reader's edit. */
        function setEditorText(text) {
            settingText = true;
            try { editor.setValue(text); } finally { settingText = false; }
        }

        var session = window.MappiaLive.session(el.map, { catalogue: data.catalogue_queryid || undefined });
        session.onStatus(function (s) {
            el.status.textContent = s.text || "";
            el.status.setAttribute("data-state", s.state);
        });
        session.onReader(onReader);

        /* --- rendering --- */

        function renderProgress() {
            var html = chapters.map(function (c) {
                var ids = (c.steps && c.steps.length) ? c.steps : steps.filter(function (s) { return s.chapter === c.id; }).map(function (s) { return s.id; });
                var dots = ids.map(function (id) {
                    var s = byId[id];
                    if (!s) return "";
                    var done = !!(store.steps[id] && store.steps[id].done);
                    return "<li><a href=\"#" + id + "\" class=\"wizard__dot" + (done ? " is-done" : "") + "\"" + (current && current.id === id ? " aria-current=\"step\"" : "") +
                        " aria-label=\"Step " + (s.index + 1) + ": " + escapeHtml(s.title) + (done ? " (done)" : "") + "\" title=\"" + escapeHtml(s.title) + "\">" + (s.index + 1) + "</a></li>";
                }).join("");
                return "<li class=\"wizard__chapter\" title=\"" + escapeHtml(c.title) + "\"><span class=\"wizard__chapter-title\">" + escapeHtml(c.title) + "</span><ol>" + dots + "</ol></li>";
            }).join("");
            el.progress.innerHTML = "<ol class=\"wizard__chapters-nav\">" + html + "</ol>";
        }

        function escapeHtml(text) {
            return String(text == null ? "" : text).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; });
        }

        function verdict(v) {
            if (history && history.hintOpenedNow && !v.pass) {
                v.message += " A hint is open, above the query.";
                history.hintOpenedNow = false;
            }
            if (v.pass && el.hintBar) el.hintBar.hidden = true;
            lastVerdict = v;
            /* the look follows the tone when there is one (a half-way verdict is "progress", whatever its kind) */
            el.verdict.className = "wizard__verdict is-" + (v.tone || v.kind);
            el.verdict.textContent = v.message;
            el.verdictFull.className = "wizard__verdict-full is-" + (v.tone || v.kind);
            el.verdictFull.textContent = v.message;
            el.notes.innerHTML = (v.notes || []).map(function (n) { return "<li>" + escapeHtml(n) + "</li>"; }).join("");
            el.notes.hidden = !(v.notes && v.notes.length);
            updateNext();
            fit(); /* a long verdict makes the Run bar taller: the query panel and the text share the rest */
            return v;
        }
        function note(kind, message) {
            el.verdict.className = "wizard__verdict is-" + kind;
            el.verdict.textContent = message;
            el.verdictFull.className = "wizard__verdict-full is-" + kind;
            el.verdictFull.textContent = message;
        }

        function updateNext() {
            var done = current && store.steps[current.id] && store.steps[current.id].done;
            var last = current && current.index === steps.length - 1;
            el.next.textContent = last ? (done ? "Finish →" : "Skip to the end →") : (done ? "Next →" : "Skip →");
            el.next.classList.toggle("is-primary", !!done);
            el.prev.disabled = !current || current.index === 0;
        }

        function updateUndo() {
            el.undo.hidden = !(lastWorking !== null && editor.getValue() !== lastWorking && history && (history.runs > 0));
        }

        function summarize(snapshot) {
            if (!snapshot || !snapshot.layers) return "";
            if (!snapshot.layers.length) return "The map shows no layer of the query.";
            return "The map shows: " + snapshot.layers.map(function (l) {
                return l.title + " (" + (l.visible ? "on" : "off") + (l.opacity < 1 ? ", opacity " + l.opacity : "") + ")";
            }).join(", ") + ".";
        }

        /* --- steps --- */

        function startTextOf(step) {
            var mine = store.steps[step.id];
            if (mine && typeof mine.text === "string") return mine.text;
            if (step.start != null && step.start !== "") return step.start;
            var prev = steps[step.index - 1];
            if (!prev) return "";
            var prevStore = store.steps[prev.id];
            if (prevStore && prevStore.done && typeof prevStore.passText === "string") return prevStore.passText;
            return prev.solution || startTextOf(prev);
        }

        function show(step, opts) {
            opts = opts || {};
            /* A new chapter starts on a fresh map (no listener, handler or callback of earlier queries
               piles up) - only when the map starts fast, from a saved catalogue's capabilities (~0.6 s). */
            if (current && current.chapter !== step.chapter && /[?&]queryid=/.test(session.url)) session.reset();
            current = step;
            store.current = step.id;
            save();
            history = { runs: 0, failed: 0, warnings: [], parseErrorSeen: false, reader: [], hintsShown: 0, usedShowMe: false, hintOpenedNow: false };
            if (el.hintBar) el.hintBar.hidden = true;
            el.end.hidden = true;
            el.card.hidden = false;
            var c = chapterOf(step);
            el.where.textContent = (c.title ? c.title + " · " : "") + "step " + (step.index + 1) + " of " + steps.length;
            el.title.textContent = step.title;
            el.text.innerHTML = step.text_html || "";
            el.task.innerHTML = "<strong>Your turn:</strong> " + (step.task_html || "").replace(/^<p>|<\/p>\s*$/g, "");
            el.hints.innerHTML = "";
            el.hints.hidden = true;
            el.hint.disabled = !(step.hints_html && step.hints_html.length);
            el.hint.textContent = "Hint"; /* a new step (or the same, restarted) starts with no hint shown */
            el.showme.hidden = true;
            el.show.disabled = !step.solution;
            el.map.title = "The live map - step " + (step.index + 1) + ": " + step.title;
            var text = startTextOf(step);
            setEditorText(text);
            editor.highlightLines(step.highlight || []);
            if (editor.setBaseline) editor.setBaseline(baselineOf(step)); /* the learner's changes get a blue bar */
            updateSource();
            var mine = store.steps[step.id];
            el.carry.hidden = !(firstOfChapter(step) && step.index > 0 && store.lastPassing && store.lastPassing !== text && !(mine && typeof mine.text === "string"));
            renderProgress();
            if (location.hash !== "#" + step.id) history_replace("#" + step.id);
            el.scroll.scrollTop = 0;
            fit();
            var done = !!(mine && mine.done);
            var mapOnly = isMapOnly(step);
            el.card.classList.toggle("is-reader", mapOnly);
            if (el.nocode) el.nocode.hidden = !mapOnly;
            if (el.legend) el.legend.hidden = mapOnly;
            el.run.classList.toggle("is-primary", !mapOnly); /* Run is not this step's action */
            verdict({ kind: done ? "pass" : "idle", pass: done, problems: [], notes: [],
                message: done ? "You did this step already - run it again, or go on."
                    : mapOnly ? "Use the map on the right - see Your turn. No Run needed." : "Edit the query, then press Run." });
            updateUndo();
            if (opts.apply === false) return stepApply;
            var p = window.MappiaEditor.problem(text, messages);
            if (p) { note("parse", p.text + " The map still shows the previous query."); return stepApply; }
            stepApply = session.apply(text, { chrome: step.chrome || "lean", view: step.view || null }).then(function (result) {
                if (result.superseded) return result;
                if (result.ok) {
                    lastRunSnapshot = result.snapshot;
                    appliedText = text;
                    if (!hasMissingLayer(result.snapshot)) lastWorking = text;
                    el.summary.textContent = summarize(result.snapshot);
                    updateUndo();
                }
                return result;
            });
            return stepApply;
        }

        function history_replace(hash) {
            try { window.history.replaceState(null, "", hash); } catch (e) { location.hash = hash; }
        }

        function hasMissingLayer(snapshot) {
            return (snapshot.warnings || []).some(function (w) { return /Could not create layer record|Error loading Source|Non-existing source/.test(w); });
        }

        /** A Run that missed: after the first, a hint button; after HINT_AFTER_FAILS, the first hint opens by itself. */
        function failed() {
            history.failed++;
            if (history.failed >= HINT_AFTER_FAILS && history.hintsShown === 0) { showHint(); history.hintOpenedNow = true; }
            updateHintButton();
        }

        function updateHintButton() {
            if (!el.hintBar) return;
            var hints = (current && current.hints_html) || [];
            var more = history && history.hintsShown < hints.length;
            el.hintBar.hidden = !(history && history.failed > 0 && more);
            el.hintBar.textContent = history && history.hintsShown > 0 ? "Another hint" : "Show a hint";
        }

        /** Run: the learner's text on the map, judged. Resolves with the verdict. */
        function run() {
            if (!current) return Promise.resolve(lastVerdict);
            if (!el.welcome.hidden) { el.welcome.hidden = true; fit(); }
            var step = current;
            var text = editor.getValue();
            stepStore(step).text = text;
            save();
            el.showme.hidden = true;
            var p = editor.problem();
            if (p) {
                history.runs++;
                var parsed = { kind: "parse", pass: false, problems: [p.text], notes: [], message: p.text + " Nothing was sent to the map." };
                /* A step about the message itself (check.parseErrorSeen): seeing it is half of the step -
                   not a miss - and the other half is putting the query right, so the map shows it again. */
                if (step.check && step.check.parseErrorSeen && p.kind !== "empty") {
                    var firstTime = !history.parseErrorSeen;
                    history.parseErrorSeen = true;
                    updateUndo();
                    parsed.tone = "progress"; /* the half-way point of this step, not an error to fix */
                    parsed.message = p.text + " " + ((step.messages && step.messages.parseErrorSeenNext) ||
                        "Good: that is the message. Now undo that change and Run again, so the map shows the query.");
                    if (!firstTime) failed(); /* the same error again: the second half is where help may be needed */
                    return Promise.resolve(verdict(parsed));
                }
                if (p.kind !== "empty") history.parseErrorSeen = true;
                failed();
                updateUndo();
                return Promise.resolve(verdict(parsed));
            }
            note("running", "Running on the map...");
            el.run.disabled = true;
            var mine = session.apply(text, { chrome: step.chrome || "lean", keepView: true }).then(function (result) {
                el.run.disabled = false;
                if (result.superseded) return latestRun;
                if (current !== step) return lastVerdict;
                history.runs++;
                history.reader = [];
                if (!result.ok) {
                    var error = result.error || { kind: "runtime", message: "the query could not be run" };
                    failed();
                    if (error.kind === "timeout" || error.kind === "unavailable") {
                        return verdict({ kind: "timeout", pass: false, message: error.message, problems: [error.message], notes: [] });
                    }
                    var said = explainRuntime(error, messages);
                    var back = lastWorking !== null && lastWorking !== text;
                    var msg = said + (back ? " Your last working map is back on screen." : "");
                    if (back) {
                        session.apply(lastWorking, { chrome: step.chrome || "lean", keepView: true }).then(function (again) {
                            if (again.ok) { lastRunSnapshot = again.snapshot; el.summary.textContent = summarize(again.snapshot); }
                        });
                    }
                    updateUndo();
                    return verdict({ kind: "runtime", pass: false, message: msg, problems: [said], notes: [] });
                }
                var snapshot = result.snapshot;
                lastRunSnapshot = snapshot;
                appliedText = text;
                (snapshot.warnings || []).forEach(function (w) { history.warnings.push(w); });
                if (!hasMissingLayer(snapshot)) lastWorking = text;
                el.summary.textContent = summarize(snapshot);
                var judged = check(step, snapshot, history, messages);
                var notes = textNotes(text);
                (snapshot.warnings || []).forEach(function (w) {
                    var said = explainWarning(w, messages);
                    if (said && /did not answer/.test(said) && notes.indexOf(said) === -1) notes.push(said);
                });
                updateUndo();
                if (judged.pass) return verdict(pass(step, text, snapshot, notes));
                if (isMapOnly(step)) {
                    /* Run is not wrong here, just not the step's action: no "Not yet" - but pressing
                       it again and again means the learner is looking for what to do: the hint helps */
                    failed();
                    return verdict({ kind: "fail", pass: false, problems: judged.problems, notes: notes,
                        message: "The query ran - there is nothing to change in it here. " + judged.problems.join(" ") });
                }
                failed();
                return verdict({ kind: "fail", pass: false, message: "Not yet: " + judged.problems.join(" "), problems: judged.problems, notes: notes });
            });
            latestRun = mine;
            return mine;
        }

        function pass(step, text, snapshot, notes) {
            var s = stepStore(step);
            s.done = true;
            s.passText = text;
            if (history.usedShowMe) s.showMe = true;
            store.lastPassing = text;
            save();
            renderProgress();
            var last = step.index === steps.length - 1;
            var said = "";
            if (step.check && step.check.warningSeen) {
                var seen = (history.warnings || []).filter(function (w) { return String(w).indexOf(step.check.warningSeen) !== -1; })[0];
                if (seen) said = "The map says: " + (explainWarning(seen, messages) || seen) + " ";
            }
            /* a step may say what its success shows (messages.pass), instead of the general sentence */
            var done = (step.messages && step.messages.pass) || "Done: the map shows what the task asked for.";
            return { kind: "pass", pass: true, problems: [], notes: notes || [],
                message: said + done + (last ? " That was the last step - press Finish." : " Press Next when you are ready.") };
        }

        function onReader(event) {
            if (!current || !history) return;
            if (event.kind === "visibility" || event.kind === "opacity") {
                history.reader.push({ name: event.layer.name, visible: event.layer.visible, opacity: event.layer.opacity, kind: event.kind });
                if (event.snapshot) el.summary.textContent = summarize(event.snapshot);
            }
            var c = current.check || {};
            if (!c.reader || !c.reader.length || !lastRunSnapshot) return;
            var judged = check(current, lastRunSnapshot, history, messages);
            if (judged.pass) { verdict(pass(current, editor.getValue(), lastRunSnapshot, [])); return; }
            var next = readerProgress(c.reader, history.reader);
            if (next > 0 && next < c.reader.length && (event.kind === "visibility")) {
                var want = c.reader[next];
                var title = (event.layer && event.layer.name === want.name && event.layer.title) || want.name;
                note("progress", "Good: \u201c" + (event.layer.title || event.layer.name) + "\u201d is " + (event.layer.visible ? "on" : "off") +
                    ". Now switch \u201c" + title + "\u201d " + (want.visible === false ? "off" : "on") + " again, the same way.");
            } else if (lastVerdict && lastVerdict.kind !== "idle") {
                note("fail", (isMapOnly(current) ? "" : "Not yet: ") + judged.problems.join(" "));
            }
        }

        function showHint() {
            var hints = (current && current.hints_html) || [];
            if (!hints.length) return;
            var n = Math.min(history.hintsShown + 1, hints.length);
            history.hintsShown = n;
            el.hints.innerHTML = hints.slice(0, n).map(function (h, i) { return "<p><strong>Hint " + (i + 1) + ".</strong> " + h.replace(/^<p>|<\/p>\s*$/g, "") + "</p>"; }).join("");
            el.hints.hidden = false;
            /* draw the eye to it once: it opens next to the task, above the query */
            el.hints.classList.remove("is-new"); void el.hints.offsetWidth; el.hints.classList.add("is-new");
            fit();
            el.hints.scrollIntoView({ block: "nearest" });
            el.hint.textContent = n < hints.length ? "Another hint" : "Hint";
            el.hint.disabled = n >= hints.length;
            updateHintButton();
        }

        function showMe() {
            if (!current || !current.solution) return;
            var rows = diffLines(editor.getValue(), current.solution);
            el.diff.innerHTML = rows.map(function (r) {
                var mark = r.op === "add" ? "+ " : r.op === "del" ? "- " : "  ";
                return "<span class=\"wizard__diff-" + r.op + "\">" + escapeHtml(mark + r.text) + "</span>";
            }).join("\n");
            el.showme.hidden = false;
            el.showme.scrollIntoView({ block: "nearest" });
            el.use.focus({ preventScroll: true });
        }

        function go(step) {
            if (!step) return Promise.resolve(null);
            return show(step);
        }

        function next() {
            if (!current) return;
            if (current.index >= steps.length - 1) { showEnd(); return; }
            go(steps[current.index + 1]);
        }

        function showEnd() {
            current = null;
            store.current = "end";
            save();
            el.card.hidden = true;
            el.end.hidden = false;
            var done = steps.filter(function (s) { return store.steps[s.id] && store.steps[s.id].done; });
            el.endSummary.innerHTML = "<p>You did <strong>" + done.length + " of " + steps.length + "</strong> steps.</p><ol>" + steps.map(function (s) {
                var ok = store.steps[s.id] && store.steps[s.id].done;
                return "<li class=\"" + (ok ? "is-done" : "") + "\"><a href=\"#" + s.id + "\">" + escapeHtml(s.title) + "</a>" + (ok ? " ✓" : " (skipped)") + "</li>";
            }).join("") + "</ol>";
            el.endQuery.textContent = store.lastPassing || editor.getValue();
            renderProgress();
            history_replace("#end");
            el.end.focus();
        }

        el.run.addEventListener("click", function () { run(); });
        el.next.addEventListener("click", next);
        el.prev.addEventListener("click", function () { if (current && current.index > 0) go(steps[current.index - 1]); });
        el.hint.addEventListener("click", showHint);
        if (el.hintBar) el.hintBar.addEventListener("click", showHint);
        el.show.addEventListener("click", showMe);
        el.cancel.addEventListener("click", function () { el.showme.hidden = true; });
        el.use.addEventListener("click", function () {
            if (!current) return;
            history.usedShowMe = true;
            setEditorText(current.solution);
            el.showme.hidden = true;
            run();
        });
        el.undo.addEventListener("click", function () { if (lastWorking !== null) { setEditorText(lastWorking); run(); } });
        el.reset.addEventListener("click", function () { restartStep(); });
        if (el.restart) el.restart.addEventListener("click", function () { restartStep(); });
        el.source.addEventListener("click", function (event) {
            var act = event.target && event.target.getAttribute("data-act");
            if (act === "base") backToStart();
            else if (act === "mine") bringMineBack();
        });
        el.bring.addEventListener("click", function () {
            if (!store.lastPassing || !current) return;
            setEditorText(store.lastPassing);
            stepStore(current).text = store.lastPassing;
            save();
            el.carry.hidden = true;
        });
        el.endCopy.addEventListener("click", function () {
            var text = el.endQuery.textContent;
            var done = function () { el.endCopy.textContent = "Copied"; setTimeout(function () { el.endCopy.textContent = "Copy your query"; }, 1500); };
            if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
        });
        el.endBack.addEventListener("click", function () { go(steps[steps.length - 1]); });
        /* --- welcome back / start the whole tutorial again: a choice at the top, never a browser pop-up --- */
        function hideWelcome() { el.welcome.hidden = true; el.welcome.innerHTML = ""; fit(); }
        function welcomeBack(doneBefore, at) {
            el.welcome.className = "wizard__welcome";
            el.welcome.innerHTML = "<p><strong>Welcome back.</strong> " + (doneBefore
                    ? "You did " + doneBefore + " of " + steps.length + " steps; your queries are kept in this browser."
                    : "Your query from last time is kept in this browser.") + "</p>" +
                "<button type=\"button\" class=\"wizard__btn is-primary\" data-act=\"continue\">" +
                (at ? "Continue at step " + (at.index + 1) + ": " + escapeHtml(at.title) : "Continue") + "</button>" +
                "<button type=\"button\" class=\"wizard__btn\" data-act=\"restart\">Start the tutorial again</button>";
            el.welcome.hidden = false;
            fit();
        }
        function askStartOver() {
            el.welcome.className = "wizard__welcome is-confirm";
            el.welcome.innerHTML = "<p><strong>Start the tutorial again from step 1?</strong> Your ticks and the queries you wrote " +
                "are forgotten in this browser; each step starts again from the query it proposes.</p>" +
                "<button type=\"button\" class=\"wizard__btn is-primary\" data-act=\"restart-yes\">Yes, start again</button>" +
                "<button type=\"button\" class=\"wizard__btn\" data-act=\"restart-no\">No, keep my progress</button>";
            el.welcome.hidden = false;
            fit();
            el.welcome.scrollIntoView({ block: "nearest" });
            var yes = el.welcome.querySelector("[data-act=restart-yes]");
            if (yes) yes.focus({ preventScroll: true });
        }
        el.welcome.addEventListener("click", function (event) {
            var act = event.target && event.target.getAttribute("data-act");
            if (act === "continue" || act === "restart-no") hideWelcome();
            else if (act === "restart") askStartOver();
            else if (act === "restart-yes") {
                store = { v: 1, current: null, steps: {}, lastPassing: null };
                save();
                hideWelcome();
                go(steps[0]);
            }
        });
        el.startOver.addEventListener("click", askStartOver);
        window.addEventListener("hashchange", function () {
            var id = location.hash.slice(1);
            if (id === "end") { if (current) showEnd(); return; }
            if (byId[id] && (!current || current.id !== id)) go(byId[id]);
        });

        /* --- first step: the link, else where the reader left off, else the first --- */
        var wanted = location.hash.slice(1);
        var first = byId[wanted] || (wanted === "end" ? null : byId[store.current]) || steps[0];
        var doneBefore = steps.filter(function (s) { return store.steps[s.id] && store.steps[s.id].done; }).length;
        var keptBefore = Object.keys(store.steps).filter(function (id) { return byId[id] && typeof store.steps[id].text === "string"; }).length;
        if (doneBefore || keptBefore) welcomeBack(doneBefore, wanted === "end" ? null : first);
        if (wanted === "end" || (!byId[wanted] && store.current === "end")) {
            firstApply = show(steps[steps.length - 1]);
            showEnd();
        } else {
            firstApply = show(first);
        }
        renderProgress();

        window.MappiaTutorial = {
            ready: function () { return session.ready.then(function () { return firstApply; }).then(function () { return true; }); },
            go: function (stepId) { return go(byId[stepId]).then(function () { return true; }); },
            setText: function (text) { editor.setValue(text); if (current) { stepStore(current).text = text; save(); } },
            getText: function () { return editor.getValue(); },
            run: run,
            restart: function () { return restartStep().then(function () { return true; }); },
            state: function () {
                return {
                    step: current ? current.id : (store.current === "end" ? "end" : null),
                    index: current ? current.index : null,
                    done: steps.filter(function (s) { return store.steps[s.id] && store.steps[s.id].done; }).map(function (s) { return s.id; }),
                    text: editor.getValue(), verdict: lastVerdict, snapshot: lastRunSnapshot, history: history,
                    lastWorking: lastWorking, status: el.status.getAttribute("data-state"), editor: editor.kind,
                };
            },
            check: check,
            session: session,
        };
    }

    window.MappiaTutorialCheck = { check: check, textNotes: textNotes, diffLines: diffLines, readerProgress: readerProgress, explainRuntime: explainRuntime, explainWarning: explainWarning };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
})(window, document);
