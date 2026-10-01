/**
 * Fails when a built page has broken markup: an element closed that was never opened, an
 * element left open (a missing </div> swallows everything after it), or a "tag" that is no
 * HTML element at all - text such as `Array<Object>` printed without escaping, which the
 * browser turns into a real, never-closed element.
 *
 *   node script/check-html.js                 every page of _site/
 *   node script/check-html.js _site/api/index.html [...]
 *
 * Browsers repair broken markup silently and differently, so this is the only place it shows.
 * It reads the HTML the way a browser tokenizes it (comments, <script>/<style>/<textarea>
 * contents and void elements are skipped; end tags the HTML standard lets you omit - </p>,
 * </li>, </td>... - are accepted when implied). Exit code 1 on any problem.
 */

const fs = require("fs");
const path = require("path");

const SITE_DIR = path.join(__dirname, "..", "_site");
const MAX_REPORTS_PER_FILE = 15;

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const RAW_TEXT = new Set(["script", "style", "textarea", "title"]);
// End tag may be omitted: the element is closed by its parent's end or a sibling's start.
const OPTIONAL_END = new Set(["p", "li", "dt", "dd", "option", "optgroup", "tr", "td", "th", "thead", "tbody", "tfoot", "colgroup", "caption", "rb", "rt", "rp"]);
const HTML_ELEMENTS = new Set(("a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col " +
    "colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 " +
    "head header hgroup hr html i iframe img input ins kbd label legend li link main map mark menu meta meter nav noscript object " +
    "ol optgroup option output p param picture pre progress q rp rt ruby s samp script search section select slot small source " +
    "span strong style sub summary sup table tbody td template textarea tfoot th thead time title tr track u ul var video wbr " +
    "svg path g circle rect line polyline polygon ellipse defs use symbol text tspan lineargradient radialgradient stop clippath " +
    "mask pattern image foreignobject desc marker filter fegaussianblur feoffset feblend fecolormatrix").split(/\s+/));

// Tags this site uses on purpose (the publisher page: styled in _layouts/mappia_publisher.html).
const SITE_ELEMENTS = new Set(["mappia", "qgis", "gh", "evidence", "response"]);

function lineOf(html, index) {
    let line = 1;
    for (let i = 0; i < index; i++) {
        if (html.charCodeAt(i) === 10) line++;
    }
    return line;
}

/** The visible text just before `index`, to recognise where on the page a problem is. */
function contextBefore(html, index) {
    return html.slice(Math.max(0, index - 400), index)
        .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(-120);
}

function checkHtml(html) {
    const problems = [];
    const stack = []; // {name, index}
    const tagPattern = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!doctype[^>]*>|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*(\/?)>/gi;
    let match;
    while ((match = tagPattern.exec(html)) !== null) {
        if (!match[2]) continue; // comment, CDATA, doctype
        const closing = match[1] === "/";
        const name = match[2].toLowerCase();
        const at = match.index;

        if (!HTML_ELEMENTS.has(name) && !SITE_ELEMENTS.has(name) && !name.includes("-")) {
            problems.push({ at, message: `<${closing ? "/" : ""}${match[2]}> is not an HTML element - unescaped text?` });
            continue;
        }
        if (!closing) {
            if (VOID.has(name) || match[4] === "/") continue;
            // A new p/li/... closes an open sibling of the same kind, as browsers do.
            if (OPTIONAL_END.has(name) && stack.length && stack[stack.length - 1].name === name) stack.pop();
            stack.push({ name, index: at });
            if (RAW_TEXT.has(name)) {
                const end = html.toLowerCase().indexOf(`</${name}`, tagPattern.lastIndex);
                tagPattern.lastIndex = end === -1 ? html.length : end;
            }
            continue;
        }
        if (VOID.has(name)) continue;
        let open = stack.length - 1;
        while (open >= 0 && stack[open].name !== name) open--;
        if (open === -1) {
            problems.push({ at, message: `</${name}> closes nothing - there is no open <${name}>` });
            continue;
        }
        for (let i = stack.length - 1; i > open; i--) {
            if (!OPTIONAL_END.has(stack[i].name)) {
                problems.push({ at: stack[i].index, message: `<${stack[i].name}> is never closed (its parent </${name}> closes it implicitly)` });
            }
        }
        stack.length = open;
    }
    for (const left of stack) {
        if (!OPTIONAL_END.has(left.name) && !["html", "body", "head"].includes(left.name)) {
            problems.push({ at: left.index, message: `<${left.name}> is never closed (still open at the end of the page)` });
        }
    }
    return problems;
}

function pagesUnder(directory) {
    const found = [];
    (function walk(current) {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".html")) found.push(full);
        }
    })(directory);
    return found;
}

function main() {
    const files = process.argv.slice(2).length ? process.argv.slice(2) : pagesUnder(SITE_DIR);
    if (files.length === 0) {
        console.error(`No pages found - build the site first (${path.relative(process.cwd(), SITE_DIR)} is empty).`);
        process.exitCode = 1;
        return;
    }
    let broken = 0;
    for (const file of files) {
        const html = fs.readFileSync(file, "utf8");
        const problems = checkHtml(html).sort((a, b) => a.at - b.at);
        if (problems.length === 0) continue;
        broken++;
        console.error(`\n${path.relative(process.cwd(), file)}: ${problems.length} problem(s)`);
        for (const problem of problems.slice(0, MAX_REPORTS_PER_FILE)) {
            console.error(`  line ${lineOf(html, problem.at)}: ${problem.message}`);
            console.error(`    after: "...${contextBefore(html, problem.at)}"`);
        }
        if (problems.length > MAX_REPORTS_PER_FILE) {
            console.error(`  ... and ${problems.length - MAX_REPORTS_PER_FILE} more`);
        }
    }
    console.log(`${files.length} page(s) checked, ${broken} with broken markup.`);
    if (broken > 0) process.exitCode = 1;
}

if (require.main === module) {
    main();
}

module.exports = { checkHtml };
