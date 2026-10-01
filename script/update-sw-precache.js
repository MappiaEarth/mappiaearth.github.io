#!/usr/bin/env node
/**
 * Refreshes the list of pages the service worker precaches (sw.js), so returning visitors get
 * the current pages instead of the ones cached when sw.js was last generated.
 *
 * Why not the gulp "sw" task: it regenerates the whole worker with workbox-build's
 * generateSW, which minifies through rollup-plugin-terser -> jest-worker, starting one node
 * process per CPU core (23 on a 24-core machine) - and on Windows those workers can hang.
 * The gulp pipeline cannot start on Node 22 anyway (node-sass). This script only recomputes
 * the precache list with workbox-build's getManifest (it hashes files - no bundling, no
 * worker processes) and replaces the list inside the existing sw.js; the worker code itself
 * is unchanged.
 *
 * Steps: build the site with JEKYLL_ENV=production into a temporary folder (what GitHub Pages
 * serves), compute the manifest over the same patterns the gulp task used, swap it in.
 *
 * Usage:  npm run sw            update sw.js
 *         npm run sw -- --dry-run   report what would change, write nothing
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { getManifest } = require("workbox-build");

const ROOT = path.join(__dirname, "..");
const SW_PATH = path.join(ROOT, "sw.js");
// Pages and styles only: images are many (every example screenshot, every responsive size)
// and a visitor needs few of them, so they are fetched - and cached by the browser - on use.
const GLOB_PATTERNS = ["**/*.{html,css}"];
const LIST_START = "precacheAndRoute([";
const LIST_END = "],{})";
const HARD_TIMEOUT_MS = 5 * 60 * 1000;

const dryRun = process.argv.includes("--dry-run");

// Never leave anything running: give up after a hard limit.
const killTimer = setTimeout(() => {
    console.error(`FAIL: gave up after ${HARD_TIMEOUT_MS / 60000} minutes.`);
    process.exit(1);
}, HARD_TIMEOUT_MS);
killTimer.unref();

function fail(message) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
}

function entriesOf(swSource) {
    const start = swSource.indexOf(LIST_START);
    const end = start === -1 ? -1 : swSource.indexOf(LIST_END, start);
    if (start === -1 || end === -1 || swSource.indexOf(LIST_START, start + 1) !== -1) {
        fail(`sw.js does not contain exactly one "${LIST_START} ... ${LIST_END}" list; regenerate it with workbox instead.`);
    }
    const body = swSource.slice(start + LIST_START.length, end);
    const urls = [...body.matchAll(/url:"([^"]*)"/g)].map((match) => match[1]);
    return { start, end, urls };
}

async function main() {
    if (!fs.existsSync(SW_PATH)) fail(`${SW_PATH} not found.`);
    const swSource = fs.readFileSync(SW_PATH, "utf8");
    const current = entriesOf(swSource);

    // 1. A production build, which is what GitHub Pages publishes.
    // A temporary build inside the project, in the git-ignored .tmp/ folder (Jekyll skips
    // dot-folders), removed again below.
    fs.mkdirSync(path.join(ROOT, ".tmp"), { recursive: true });
    const buildDir = fs.mkdtempSync(path.join(ROOT, ".tmp", "sw-build-"));
    console.log(`building the site (JEKYLL_ENV=production) into ${buildDir} ...`);
    const build = spawnSync("bundle", ["exec", "jekyll", "build", "--destination", buildDir], {
        cwd: ROOT,
        env: Object.assign({}, process.env, { JEKYLL_ENV: "production" }),
        shell: process.platform === "win32", // bundle is a .bat on Windows
        encoding: "utf8",
    });
    if (build.status !== 0) fail(`jekyll build failed:\n${build.stdout}\n${build.stderr}`);

    // 2. The manifest: url + content hash for every precached file. No bundling, no workers.
    const { manifestEntries, count, size, warnings } = await getManifest({
        globDirectory: buildDir,
        globPatterns: GLOB_PATTERNS,
    });
    warnings.forEach((warning) => console.warn(`warning: ${warning}`));

    const list = manifestEntries
        .map((entry) => `{url:${JSON.stringify(entry.url)},revision:${JSON.stringify(entry.revision)}}`)
        .join(",");

    const before = new Set(current.urls);
    const after = new Set(manifestEntries.map((entry) => entry.url));
    const added = [...after].filter((url) => !before.has(url));
    const removed = [...before].filter((url) => !after.has(url));
    const oldBody = swSource.slice(current.start + LIST_START.length, current.end);
    const changedRevisions = manifestEntries.filter((entry) => before.has(entry.url) && !oldBody.includes(`url:${JSON.stringify(entry.url)},revision:${JSON.stringify(entry.revision)}`)).length;

    console.log(`precache: ${current.urls.length} -> ${count} files (${(size / 1048576).toFixed(1)} MB)`);
    console.log(`  new: ${added.length}   gone: ${removed.length}   changed content: ${changedRevisions}`);
    if (added.length) console.log(`  e.g. new: ${added.filter((u) => u.endsWith(".html")).slice(0, 6).join(", ")}`);

    fs.rmSync(buildDir, { recursive: true, force: true });

    if (dryRun) {
        console.log("dry run: sw.js not written.");
        return;
    }
    const updated = swSource.slice(0, current.start + LIST_START.length) + list + swSource.slice(current.end);
    fs.writeFileSync(SW_PATH, updated);
    console.log("sw.js updated. Commit it with the site changes; visitors pick it up on their next visit.");
}

main()
    .then(() => process.exit(0))
    .catch((err) => fail(err.stack || err.message));
