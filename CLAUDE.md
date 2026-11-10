# Hundesteuer-Atlas: der Steuersatz jeder Gemeinde aus der eigenen Satzung

Built by an automated studio. Read `SPEC.md` (what and why), `PLAN.md` (the task list) and this file (how) before changing anything.

## Rules for every contributor, human or agent

- Never commit secrets. Environment variable names go in `.env.example`, values never do.
- Payments stay in test mode until the owner goes live.
- Do not run `git commit` or `git push`. The studio orchestrator commits.
- `npm test` and `npm run build` must pass before work counts as done.
- Pages that answer a search query must be real tools or substantive answers, never thin filler.

## Stack, layout and commands

**Stack:** Astro 5 (static output, TypeScript strict), hand-written CSS with custom properties (no Tailwind, no UI kit, no icon pack), Vitest for tests, `tsx` to run the harvest pipeline. Fonts self-hosted via `@fontsource/barlow-condensed` and `@fontsource/source-serif-4`. No backend, no cookies, no third-party scripts.

**Note:** the scaffold was written by hand because the Architect could not run npm. The first PLAN task is `npm install` (creates `package-lock.json`, which CI's `npm ci` needs) and proving test/build green; fix version ranges there if install fails.

### Layout

```
astro.config.mjs        site/base from SITE_URL / SITE_BASE, trailingSlash: 'always'
src/styles/global.css   ALL design tokens (colours, type scale, spacing, grid) + base styles
src/layouts/Base.astro  <html lang="de">, title/description/canonical, masthead, footer (legal links, data credits)
src/components/         SteuerMarke.astro (signature tag), Analytics.astro (cookie-free, env-gated)
src/lib/url.ts          withBase(), absoluteUrl(): use for EVERY internal link, asset and sitemap URL
src/lib/indexable.ts    the one list of indexable paths; sitemap.xml is built from it
src/pages/              index, nrw/, methodik, impressum, datenschutz, 404, sitemap.xml.ts, robots.txt.ts
pipeline/               harvest pipeline (Node/TS, run with tsx). Never imported by the Astro build
data/                   committed data: municipalities-nw.json, per-municipality results, coverage-nw.md
test/                   *.test.ts (Vitest); test/fixtures/bylaws/ = real bylaw text + sidecar JSON
scripts/design-check.mjs  studio-owned design lint; do not edit
```

### Commands

| Command | What it does |
|---|---|
| `npm install` | install; keep `package-lock.json` committed |
| `npm test` | `vitest run`, once, exits |
| `npm run build` | static build to `dist/`. No network, reads only `data/` |
| `npm run build:preview` | same build with `SITE_URL=https://example.github.io SITE_BASE=/preview` |
| `npm run design-check` | flags AI-looking design habits; must exit 0 |
| `npm run harvest -- --state=NW --limit=5 --max-minutes=3` | fetch and extract bylaws (network; never part of build) |

Never run `npm run dev`, `astro dev`, `astro preview` or `vitest` without `run`: they do not exit.

### Conventions

- Design: read `DESIGN.md` first. Colours and sizes only via the custom properties in `global.css`. No one-sided thick borders, no gradients, no big radii, no lift on hover, no emoji.
- Links: `href={withBase('/nrw/')}`, never a bare `/nrw/`. Every URL ends with `/`.
- Every page passes a unique `title`, `description` and `path` to `Base`; pages that must not rank pass `noindex` and stay out of `indexablePaths()`.
- Data logic lives in plain TS modules under `src/lib/` (rates model, calculator, search, slugs, stats) so Vitest can test it without Astro. Pages only render.
- Env vars: build-time secrets via `process.env` in frontmatter (`AFFILIATE_HAFTPFLICHT_URL`), public ones via `import.meta.env.PUBLIC_*`. Names live in `.env.example`.
- UI copy is German, Sie-form, plain and exact (see DESIGN.md "Voice"). Code and comments are English.
- Interactive parts (search, calculator, table sort) are small vanilla-TS `<script>` blocks in Astro components; no React/Preact unless a task really needs it. Pages must work without JS.
- Analytics events: `window.plausible?.('Suche')`, `('Rechner')`, `('Anzeige-Klick')`: no-op when analytics is off.
- Crawling: obey robots.txt, 1 request/second/host, UA `HundesteuerAtlasBot/0.1 (+<SITE_URL>/methodik/)`. Never rehost bylaw PDFs; the download cache in `.cache/` is gitignored.
