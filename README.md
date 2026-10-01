# Mappia Documentation

Jekyll site for [mappia.earth](https://mappia.earth/) — human docs, the `/reference/` chapters, and the machine-readable API/LLM feeds.

## Run locally

Prerequisites: Ruby + Bundler. On Windows you can bootstrap with `install.bat` (gems, `bundle install`, and optionally Node for the Gulp asset pipeline).

```bash
bundle install
npm start
```

That runs `jekyll serve --livereload`: builds into `_site/` and serves with live reload. Open the URL it prints (usually `http://127.0.0.1:4000`). First build can take about a minute.

| Command | What it does |
|---|---|
| `npm start` | Local preview via Jekyll (recommended for inspecting pages/reference) |
| `npm run build` | One-shot `jekyll build` into `_site/` |
| `npm run start:gulp` | Full Gulp pipeline (Sass/JS + Jekyll + BrowserSync). Needs **Node 14** — see below |
| `npm run build:gulp` | One-shot Gulp production build. Same Node constraint |

Committed CSS/JS under `assets/` is enough for normal docs preview. Rebuild those assets with Gulp only when you change `_sass/` or `_js/`.

### Gulp / Node note

The Gulpfile pulls in `node-sass` (via `gulp-sass@3`), which does **not** support modern Node (e.g. Node 22). On an unsupported runtime, `npm run start:gulp` fails while loading the gulpfile with `Node Sass does not yet support your current environment`. Use Node 14 (as in `install.bat`) if you need the asset pipeline, or stick to `npm start`.

## Machine-readable files

These stay at the **site root** on purpose (the [llms.txt](https://llmstxt.org/) discovery convention), not under `assets/`:

| URL | Role |
|---|---|
| `/llms.txt` | Index: every reference chapter with a one-line summary and a link to its markdown |
| `/llms-full.txt` | Whole reference concatenated into one file |

Chapter markdown and the generated API dump live next to other static assets:

- `/assets/reference/<chapter>.md`
- `/assets/api.json`

Sources for the LLM index files are the repo-root `llms.txt` and `llms-full.txt` (written by `publish-docs.js` in the platform repo). Do not move them into `assets/` — that would break the conventional root URLs.
