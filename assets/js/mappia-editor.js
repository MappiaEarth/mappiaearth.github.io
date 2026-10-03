/**
 * MappiaEditor - the ONE query editor of the documentation site: the tutorial wizard (/tutorial/)
 * and the MappiaIO playground (/elements/mappia-io/#try-it). It wraps CodeMirror 6 from the
 * vendored assets/js/vendor/mappia-cm6.min.js (window.MappiaCM6; built by MappiaExplorer's
 * scripts/build-editor-bundle.js) and falls back to a plain <textarea> with the same API when that
 * file did not load.
 *
 *   var editor = MappiaEditor.create(host, { doc, label, onRun, onChange, messages, maxHeight });
 *   editor.getValue() / setValue(text) / focus() / problem() / highlightLines(["visibility"]) / kind
 *   MappiaEditor.problem(text)        -> null, or {kind, line, column, ..., text}: why the map would
 *                                        reject it, in plain English (see explain)
 *   MappiaEditor.explain(problem, messages)  the plain-English sentence (messages: the wording table
 *                                        of _data/tutorial.json, optional)
 *   MappiaEditor.parse(text)          -> the acorn AST of the query expression (throws on a syntax error)
 *   MappiaEditor.locate(text, offset) -> {line, column} of an offset in the reader's text
 *
 * The check parses the text exactly as the platform evaluates it - "(function(){return true && " +
 * text + "\n})()" - so what is marked is what the map would reject; the pages send text + "\n".
 * The message points where the reader must act: a token that starts a line usually means
 * "something is missing at the end of the line above" (a comma), so that line is named.
 * Holes in a list ("[a,, b]", "[, a]") parse in JavaScript but leave an empty layer the map cannot
 * read: they are reported too.
 * Keys: Ctrl/Cmd+Enter runs; Tab indents; Esc then Tab leaves the editor (no keyboard trap).
 * No autocompletion (a list popping up while a beginner types `true` is noise) and no automatic
 * closing brackets (a beginner wrapping a layer in a group types `elements: [` and got `[]}` in the
 * wrong place); matching brackets are highlighted. 16 px on phones.
 */
(function (window, document) {
    "use strict";
    var WRAP = "(function(){return true && ";

    var DEFAULT_MESSAGES = {
        empty: "The query is empty. A query is a list of layers, such as [ { name: \"CSR:estados\", visibility: true } ].",
        comma: "A comma is missing at the end of line {prevLine}: each property and each layer ends with a comma.",
        statement: "Line {line}: a query is one expression, so `{token}` cannot start it. Shared values go in ExtjsUtils.QUERY.setQueryGlobalProperties - a later chapter shows how.",
        unclosed: "The `{bracket}` opened on line {openLine} is never closed. Every [, { and ( needs its partner.",
        closer: "Line {line}: this `{token}` closes something that was never opened - remove it, or add its partner earlier.",
        string: "Line {line}: a text in quotes is not closed - add the closing quote.",
        hole: "Line {line}: two commas in a row (or a comma with nothing before it) leave an empty entry in the list. Remove one comma.",
        doublecomma: "Line {line}: two commas in a row. Remove one.",
        commaInline: "Line {line}: a comma is probably missing before `{token}` - each property ends with a comma.",
        syntax: "Line {line}: the query cannot be read from here ({raw}).",
    };

    function parser() {
        return (window.MappiaCM6 && window.MappiaCM6.acornParse) || (window.acorn && window.acorn.parse) || null;
    }

    function locate(text, offset) {
        var before = String(text).slice(0, Math.max(0, offset)).split("\n");
        return { line: before.length, column: before[before.length - 1].length };
    }

    /** The expression node of the reader's query (inside the platform's wrapper). Throws on a syntax error. */
    function parse(text) {
        var acornParse = parser();
        if (!acornParse) throw new Error("no parser loaded");
        var program = acornParse(WRAP + text + "\n})()", { ecmaVersion: 2022, locations: true });
        var expression = program.body[0].expression.callee.body.body[0].argument;
        return { program: program, expression: expression.right, offset: WRAP.length };
    }

    /* Brackets left open, and an unterminated string, by a small scanner (strings and comments skipped). */
    function scanBrackets(text) {
        var stack = [], i = 0, n = text.length, pairs = { ")": "(", "]": "[", "}": "{" };
        while (i < n) {
            var c = text[i];
            if (c === "/" && text[i + 1] === "/") { while (i < n && text[i] !== "\n") i++; continue; }
            if (c === "/" && text[i + 1] === "*") { var end = text.indexOf("*/", i + 2); i = end === -1 ? n : end + 2; continue; }
            if (c === "\"" || c === "'" || c === "`") {
                var start = i;
                i++;
                while (i < n && text[i] !== c) {
                    if (text[i] === "\\") i++;
                    else if (text[i] === "\n" && c !== "`") return { unterminated: start, stack: stack };
                    i++;
                }
                if (i >= n) return { unterminated: start, stack: stack };
                i++;
                continue;
            }
            if (c === "(" || c === "[" || c === "{") stack.push({ bracket: c, at: i });
            else if (pairs[c]) {
                if (stack.length && stack[stack.length - 1].bracket === pairs[c]) stack.pop();
                else return { extraCloser: i, stack: stack };
            }
            i++;
        }
        return { stack: stack };
    }

    function previousLineIndex(lines, index) {
        for (var k = index - 1; k >= 0; k--) {
            if (lines[k].replace(/\/\/.*$/, "").trim()) return k;
        }
        return -1;
    }

    /*
     * A parse error, as two things: the parser's facts (raw message, errorLine/errorColumn, the token
     * there, lineStart, atEnd) for the wording table, and where the reader must act (line/column: the
     * end of the line above for a missing comma, the open bracket for "never closed").
     */
    function syntaxProblem(text, error) {
        var lines = String(text).split(String.fromCharCode(10));
        var raw = String(error.message).replace(/\s*\(\d+:\d+\)$/, "");
        var offset = typeof error.pos === "number" ? error.pos - WRAP.length : 0;
        var atEnd = offset >= text.length;
        var where = atEnd ? { line: lines.length + 1, column: 0 } : locate(text, Math.max(0, offset));
        var token = atEnd ? "" : ((/[A-Za-z_$][\w$]*|\S/.exec(text.slice(Math.max(0, offset))) || [""])[0]);
        var lineText = lines[where.line - 1] || "";
        var facts = { raw: raw, errorLine: Math.min(where.line, lines.length), errorColumn: where.column, token: token, atEnd: atEnd,
            lineStart: !atEnd && where.line > 1 && !lineText.slice(0, where.column).trim() };
        function result(fields) { return Object.assign({}, facts, fields); }
        var scan = scanBrackets(text);
        if (scan.unterminated !== undefined && (/Unterminated string/.test(raw) || atEnd)) {
            var s = locate(text, scan.unterminated);
            return result({ kind: "string", line: s.line, column: s.column });
        }
        if (scan.extraCloser !== undefined) {
            var x = locate(text, scan.extraCloser);
            if (x.line <= where.line) return result({ kind: "closer", line: x.line, column: x.column });
        }
        if (atEnd || /Unexpected end of input/.test(raw)) {
            facts.atEnd = true;
            var open = scan.stack.length ? scan.stack[scan.stack.length - 1] : null;
            if (open) {
                var o = locate(text, open.at);
                return result({ kind: "unclosed", line: o.line, column: o.column, bracket: open.bracket, openLine: o.line });
            }
            return result({ kind: "syntax", line: lines.length, column: lines[lines.length - 1].length });
        }
        if (/^(var|let|const|function|if|for|while|return|import|export|class)$/.test(token)) {
            return result({ kind: "statement", line: where.line, column: where.column });
        }
        if (token === "," && /,\s*$/.test(text.slice(0, offset))) {
            return result({ kind: "doublecomma", line: where.line, column: where.column });
        }
        var prev = previousLineIndex(lines, where.line - 1);
        if (facts.lineStart && prev >= 0) {
            var prevText = lines[prev].replace(/\/\/.*$/, "").trim();
            if (prevText && !/[,{[(&|+\-*/:?=]$/.test(prevText)) {
                return result({ kind: "comma", line: prev + 1, column: lines[prev].replace(/\s*(\/\/.*)?$/, "").length, prevLine: prev + 1 });
            }
        }
        if (!facts.lineStart && /^[\w$"'{\[]/.test(token) && /[\w$"'\])}]\s+$/.test(text.slice(0, offset))) {
            return result({ kind: "commaInline", line: where.line, column: where.column });
        }
        return result({ kind: "syntax", line: where.line, column: where.column });
    }

    /* Holes in array literals: [a,, b] or [, a] - valid JavaScript, an empty layer for the map. */
    function findHole(text, node) {
        var found = null;
        (function walk(n) {
            if (found || !n || typeof n.type !== "string") return;
            if (n.type === "ArrayExpression") {
                for (var i = 0; i < n.elements.length; i++) {
                    if (n.elements[i] === null) {
                        var from = i === 0 ? n.start + 1 : (n.elements[i - 1] ? n.elements[i - 1].end : n.start + 1);
                        var comma = (WRAP + text).indexOf(",", from);
                        found = locate(text, (comma === -1 ? from : comma) - WRAP.length);
                        found.kind = "hole";
                        return;
                    }
                }
            }
            for (var key in n) {
                if (key === "loc" || key === "start" || key === "end") continue;
                var child = n[key];
                if (Array.isArray(child)) child.forEach(walk);
                else if (child && typeof child.type === "string") walk(child);
            }
        })(node);
        return found;
    }

    /**
     * Why the map would not read `text`, or null. Without a parser loaded: null (the map will say it).
     * @returns {null|{kind: String, line: Number, column: Number, raw: String, text: String}}
     */
    function problem(text, messages) {
        text = String(text == null ? "" : text);
        if (!parser()) return null;
        var p;
        if (!text.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").trim()) {
            p = { kind: "empty", line: 1, column: 0, errorLine: 1, errorColumn: 0, token: "", raw: "The query is empty" };
        } else {
            try {
                var parsed = parse(text);
                p = findHole(text, parsed.expression);
                if (p) { p.raw = "Two commas in a row leave an empty entry in the list"; p.errorLine = p.line; p.errorColumn = p.column; p.token = ","; }
            } catch (e) {
                p = syntaxProblem(text, e);
            }
        }
        if (p) p.text = explain(p, messages);
        return p;
    }

    function fill(template, p) {
        return String(template).replace(/\{(\w+)\}/g, function (all, key) { return p[key] !== undefined && p[key] !== null ? p[key] : all; });
    }

    /**
     * The plain-English sentence for a problem. `messages` (optional) is the wording table of
     * _data/tutorial.json (MappiaExplorer examples/tutorial/messages.yml): messages.parse is a list
     * of rules tried in order, the first match wins - {match: regex on the parser's message (named
     * groups become placeholders), token: regex on the token at the error, where: "line-start" |
     * "end", message: template with {line} {column} {prevLine} {token} {message}}. Without a table
     * (or no rule matching) the built-in sentences are used. Holes in a list ("[a,, b]") are found
     * by this file, not by the parser: they always get the built-in sentence.
     */
    function explain(p, messages) {
        var values = { line: p.errorLine || p.line, column: (p.errorColumn || 0) + 1, prevLine: p.prevLine || Math.max(1, (p.errorLine || p.line) - 1),
            token: p.token || "", message: p.raw, raw: p.raw, openLine: p.openLine, bracket: p.bracket };
        var table = messages && messages.parse;
        if (p.kind !== "hole" && p.kind !== "doublecomma") {
            if (Array.isArray(table)) {
                for (var i = 0; i < table.length; i++) {
                    var rule = table[i], m = null;
                    try { m = new RegExp(rule.match || rule.pattern || "(?!)").exec(p.raw || ""); } catch (e) { m = null; }
                    if (!m) continue;
                    if (rule.kind && rule.kind !== p.kind) continue;
                    if (rule.token) { try { if (!new RegExp(rule.token).test(p.token || "")) continue; } catch (e) { continue; } }
                    if (rule.where === "line-start" && !p.lineStart) continue;
                    if (rule.where === "end" && !p.atEnd) continue;
                    return fill(rule.message, Object.assign({}, values, m.groups || {}));
                }
            } else if (table && typeof table === "object" && table[p.kind]) {
                return fill(table[p.kind], Object.assign({}, values, { line: p.line }));
            }
        }
        return fill(DEFAULT_MESSAGES[p.kind] || DEFAULT_MESSAGES.syntax, Object.assign({}, values, { line: p.line }));
    }

    function offsetOf(text, line, column) {
        var lines = text.split("\n"), at = 0;
        for (var i = 0; i < line - 1 && i < lines.length; i++) at += lines[i].length + 1;
        return Math.min(at + (column || 0), text.length);
    }

    function linesContaining(text, needles) {
        var lines = String(text).split("\n"), out = [];
        (needles || []).forEach(function (needle) {
            if (typeof needle === "number") { out.push(needle); return; }
            lines.forEach(function (line, i) { if (needle && line.indexOf(needle) !== -1 && out.indexOf(i + 1) === -1) out.push(i + 1); });
        });
        return out.sort(function (a, b) { return a - b; });
    }

    /* 16 px on phones and touch screens: below that, iOS zooms the page on focus. A page style, once. */
    function phoneStyle() {
        if (document.getElementById("mappia-editor-style")) return;
        var style = document.createElement("style");
        style.id = "mappia-editor-style";
        style.textContent = "@media (max-width: 900px), (pointer: coarse) { .mappia-editor .cm-editor, .mappia-editor textarea { font-size: 16px !important; } }";
        document.head.appendChild(style);
    }

    /**
     * What the learner changed against a starting text, line by line (a longest common subsequence
     * on the lines, spaces at their ends ignored - re-indenting is not a change). Queries are tens
     * of lines, so the plain O(n*m) table is fine.
     * @returns {{lines: Number[], removed: Number}} lines of `text` (1-based) that are not in the
     *   starting text, and how many starting lines are gone.
     */
    function changedAgainst(base, text) {
        var a = String(base == null ? "" : base).split("\n").map(function (l) { return l.trim(); });
        var b = String(text == null ? "" : text).split("\n").map(function (l) { return l.trim(); });
        var n = a.length, m = b.length, i, j;
        var len = [];
        for (i = 0; i <= n; i++) { len.push(new Array(m + 1).fill(0)); }
        for (i = n - 1; i >= 0; i--) {
            for (j = m - 1; j >= 0; j--) len[i][j] = a[i] === b[j] ? len[i + 1][j + 1] + 1 : Math.max(len[i + 1][j], len[i][j + 1]);
        }
        var keptB = new Array(m).fill(false), keptA = new Array(n).fill(false);
        for (i = 0, j = 0; i < n && j < m;) {
            if (a[i] === b[j]) { keptA[i] = true; keptB[j] = true; i++; j++; } else if (len[i + 1][j] >= len[i][j + 1]) i++; else j++;
        }
        var lines = [];
        keptB.forEach(function (k, index) { if (!k && b[index] !== "") lines.push(index + 1); });
        var removed = keptA.filter(function (k, index) { return !k && a[index] !== ""; }).length;
        return { lines: lines, removed: removed };
    }

    function createCodeMirror(host, options) {
        var CM = window.MappiaCM6;
        var view;
        var baseline = null; /* the starting text the learner's changes are measured against */
        var setBaseline = CM.StateEffect.define();
        var mineLines = CM.StateField.define({
            create: function () { return CM.Decoration.none; },
            update: function (decorations, tr) {
                var reset = tr.effects.some(function (e) { return e.is(setBaseline); });
                if (!reset && !tr.docChanged) return decorations;
                if (baseline === null) return CM.Decoration.none;
                var builder = new CM.RangeSetBuilder();
                changedAgainst(baseline, tr.state.doc.toString()).lines.forEach(function (n) {
                    var line = tr.state.doc.line(n);
                    builder.add(line.from, line.from, CM.Decoration.line({ class: "cm-mappia-mine-line" }));
                });
                return builder.finish();
            },
            provide: function (field) { return CM.EditorView.decorations.from(field); },
        });
        var setLines = CM.StateEffect.define();
        var stepLines = CM.StateField.define({
            create: function () { return CM.Decoration.none; },
            update: function (decorations, tr) {
                decorations = decorations.map(tr.changes);
                tr.effects.forEach(function (effect) {
                    if (!effect.is(setLines)) return;
                    var builder = new CM.RangeSetBuilder();
                    effect.value.forEach(function (n) {
                        if (n >= 1 && n <= tr.state.doc.lines) {
                            var line = tr.state.doc.line(n);
                            builder.add(line.from, line.from, CM.Decoration.line({ class: "cm-mappia-step-line" }));
                        }
                    });
                    decorations = builder.finish();
                });
                return decorations;
            },
            provide: function (field) { return CM.EditorView.decorations.from(field); },
        });
        var lint = CM.linter(function (v) {
            var text = v.state.doc.toString();
            var p = problem(text, options.messages);
            if (!p || p.kind === "empty") return [];
            var from = offsetOf(text, p.line, p.column);
            if (from >= text.length && from > 0) from = text.length - 1;
            return [{ from: from, to: Math.min(from + 1, text.length), severity: "error", message: p.text }];
        }, { delay: 400 });
        var theme = CM.EditorView.theme({
            "&": { fontSize: "14px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#fff" },
            "&.cm-focused": { outline: "2px solid #277cea", outlineOffset: "1px" },
            ".cm-scroller": { fontFamily: "Menlo, Consolas, 'Liberation Mono', monospace", lineHeight: "1.5",
                maxHeight: options.maxHeight || "none", minHeight: options.minHeight || "8em", overflow: "auto" },
            ".cm-content": { padding: "6px 0" },
            ".cm-gutters": { background: "#f8fafc", borderRight: "1px solid #e5e7eb", color: "#6b7280" },
            /* Line marks are translucent: CodeMirror draws the selection UNDER the lines, so an opaque
               line background hid the selection on exactly the lines a learner selects. */
            ".cm-mappia-step-line": { backgroundColor: "rgba(255, 200, 0, 0.18)" },
            ".cm-activeLine": { backgroundColor: "rgba(39, 124, 234, 0.05)" },
            /* lines the learner changed against the step's starting query: a blue bar at the left */
            ".cm-mappia-mine-line": { boxShadow: "inset 3px 0 0 #277cea" },
            ".cm-tooltip-lint": { fontFamily: "system-ui, sans-serif", maxWidth: "28em" },
            /* Selection: the code keeps its own colours (the site's global ::selection turns text white,
               which on CodeMirror's light selection layer could not be read) on a clear light blue.
               currentcolor, not inherit: selection colours inherit from the parent's selection. */
            ".cm-content ::selection, .cm-content::selection": { color: "currentcolor" },
            "& .cm-selectionLayer .cm-selectionBackground": { background: "#dbe8f8" },
            "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": { background: "#b3d4fc" },
        });
        var runKey = CM.Prec.highest(CM.keymap.of([{ key: "Mod-Enter", run: function () { if (options.onRun) options.onRun(view.state.doc.toString()); return true; } }]));
        view = new CM.EditorView({
            parent: host,
            doc: options.doc || "",
            extensions: [
                runKey,
                CM.lineNumbers(), CM.highlightActiveLineGutter(), CM.highlightSpecialChars(), CM.history(), CM.foldGutter(),
                CM.drawSelection(), CM.dropCursor(), CM.EditorState.allowMultipleSelections.of(true), CM.indentOnInput(),
                CM.syntaxHighlighting(CM.defaultHighlightStyle, { fallback: true }), CM.bracketMatching(),
                CM.highlightActiveLine(),
                CM.keymap.of([].concat(CM.defaultKeymap, CM.historyKeymap, CM.foldKeymap, CM.lintKeymap, [CM.indentWithTab])),
                CM.EditorState.tabSize.of(2),
                CM.javascript(), CM.lintGutter(), lint, stepLines, mineLines,
                CM.EditorView.lineWrapping, theme,
                CM.EditorView.contentAttributes.of({ "aria-label": options.label || "Query editor (JavaScript). Ctrl+Enter runs it. Esc then Tab leaves the editor." }),
                CM.EditorView.updateListener.of(function (u) { if (u.docChanged && options.onChange) options.onChange(u.state.doc.toString()); }),
            ],
        });
        return {
            kind: "codemirror6",
            view: view,
            getValue: function () { return view.state.doc.toString(); },
            setValue: function (text) {
                view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: String(text == null ? "" : text) } });
            },
            focus: function () { view.focus(); },
            problem: function () { return problem(view.state.doc.toString(), options.messages); },
            highlightLines: function (needles) {
                view.dispatch({ effects: setLines.of(linesContaining(view.state.doc.toString(), needles)) });
            },
            /* The starting text; lines that differ from it get a blue bar (null: no marks). */
            setBaseline: function (text) {
                baseline = text == null ? null : String(text);
                view.dispatch({ effects: setBaseline.of(baseline) });
            },
            changes: function () { return baseline === null ? { lines: [], removed: 0 } : changedAgainst(baseline, view.state.doc.toString()); },
            markedLines: function () {
                var lines = [];
                CM.forEachDiagnostic(view.state, function (d, from) { lines.push(view.state.doc.lineAt(from).number); });
                return lines;
            },
            setMessages: function (messages) { options.messages = messages; },
            destroy: function () { view.destroy(); },
        };
    }

    function createTextarea(host, options) {
        var area = document.createElement("textarea");
        area.className = "mappia-editor__fallback";
        area.value = options.doc || "";
        area.spellcheck = false;
        area.rows = 14;
        area.setAttribute("aria-label", options.label || "Query editor (JavaScript). Ctrl+Enter runs it.");
        area.style.cssText = "width:100%;box-sizing:border-box;font:14px/1.5 Menlo,Consolas,monospace;border:1px solid #d1d5db;border-radius:8px;padding:8px";
        area.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && options.onRun) { e.preventDefault(); options.onRun(area.value); }
        });
        area.addEventListener("input", function () { if (options.onChange) options.onChange(area.value); });
        host.appendChild(area);
        return {
            kind: "textarea",
            getValue: function () { return area.value; },
            setValue: function (text) { area.value = String(text == null ? "" : text); },
            focus: function () { area.focus(); },
            problem: function () { return problem(area.value, options.messages); },
            highlightLines: function () {},
            setBaseline: function (text) { area.__baseline = text == null ? null : String(text); },
            changes: function () { return area.__baseline == null ? { lines: [], removed: 0 } : changedAgainst(area.__baseline, area.value); },
            markedLines: function () { return []; },
            setMessages: function (messages) { options.messages = messages; },
            destroy: function () { if (area.parentNode) area.parentNode.removeChild(area); },
        };
    }

    window.MappiaEditor = {
        create: function (host, options) {
            options = options || {};
            host.classList.add("mappia-editor");
            phoneStyle();
            return window.MappiaCM6 ? createCodeMirror(host, options) : createTextarea(host, options);
        },
        problem: problem,
        changedAgainst: changedAgainst,
        explain: explain,
        parse: parse,
        locate: locate,
        linesContaining: linesContaining,
    };
})(window, document);
