# QA report, round 2

Verdict: **fail**. Round 2 found no change in the product. All six round-1 blockers are still open. The Builder marked them BLOCKED because it had no web access, and no web access or data was added in between.

## What I re-ran in round 2
- `npm test`: 12 files, 51 tests, green (same as round 1).
- `npm run build:preview`: 6 pages, preview paths start with `/preview/`, no hardcoded root links on `/`.
- `node scripts/design-check.mjs`: nothing found in 14 files.
- `npm audit --omit=dev`: still 5 vulnerabilities (1 critical, 3 high, 1 low). The fix is `astro@7.4.8` (breaking). Not applied.
- `data/` does not exist. `test/fixtures/` does not exist. `pipeline/` has only `fetch.ts`, `discover.ts`, `run.ts` and `harvest.ts`, with no `text.ts`, `extract.ts`, `validate.ts` or `municipalities.ts`.
- `src/pages/index.astro` still shows "Mustergemeinde" and "Der Atlas wird gerade angelegt. Noch ist keine Gemeinde erfasst."

The acceptance table from round 1 below still holds unchanged (AC 2, 4, 5, 6, 7, 8 fail, 3 and 12 partial).

# Round 1 report

Verdict (round 1): **fail**. The scaffold is clean, but the product has no data. Nothing the SPEC promises (a rate page per municipality) exists yet.

## What I ran
- `npm test`: 12 files, 51 tests, all green. None of them touch real data (no `data/` folder, no `test/fixtures/`).
- `npm run build:preview`: builds 6 pages. Links, stylesheet and favicon all start with `/preview/`. Sitemap entries start with `https://example.github.io/preview/`.
- `node scripts/design-check.mjs`: nothing found in 14 files.
- `npm audit --omit=dev`: 5 vulnerabilities (1 critical, 3 high, 1 low), see blocker 6.

## Acceptance criteria
| AC | Result |
|---|---|
| 1 build and test pass, no network | pass (but the build reads no `data/` at all) |
| 2 `data/municipalities-nw.json` with 396 entries | FAIL: `data/` does not exist |
| 3 harvest command, robots and rate-limit tests | PARTIAL: the fetcher tests pass. I found no pipeline code for the harvest command that has run, and there is no municipality list for it to read. |
| 4 at least 8 real bylaw fixtures, Paderborn 72 € / 600 € | FAIL: `test/fixtures/` does not exist |
| 5 at least 80 published, 15 of the 30 largest | FAIL: 0 published, `data/coverage-nw.md` missing |
| 6 dataset test for every published record | FAIL: no test file and no records |
| 7 one page per published municipality, Kreis hubs | FAIL: `dist/hundesteuer/` and `dist/nrw/<kreis>/` do not exist |
| 8 municipality page content | FAIL: no page to check |
| 9 calculator unit tests | pass (`test/calc.test.ts`) |
| 10 future `inForceFrom` shows "gilt ab …" | not checkable on a real page; the logic test in `page.test.ts` passes |
| 11 `/hundesteuer-2027/` gate | pass (tested both ways, page not generated) |
| 12 search index under 100 KB, "Pader" finds Paderborn | PARTIAL: `search.test.ts` exists. The homepage has no search field and no index file, and says "Noch ist keine Gemeinde erfasst." |
| 13 no third-party script or iframe, no cookies | pass on the 6 built pages |
| 14 insurance box, both cases | logic test passes, but the box is on no page because no municipality page exists |
| 15 Impressum and Datenschutz linked from every footer | pass (footer links present on `/`) |
| 16 data credits, methodik counts | pass in form, but the counts are all 0 |
| 17 `lang="de"`, unique title and description, canonical | pass on the 6 pages |

## Blockers
1. **No municipality data.** `data/` is missing: no 396-entry list, no `data/nw/*.json`, no `coverage-nw.md`. AC 2, 5 and 6 fail. This is where the studio's last run stopped ("BLOCKED" tasks in PLAN.md). The owner needs to run the Wikidata query and the harvest with network access, or the Builder gets a run with web access.
2. **No municipality pages.** The site has 6 pages and none answers `hundesteuer <gemeinde>`. The core product does not exist, and shipping this would put an empty site online. AC 7 and 8 fail.
3. **No real bylaw fixtures** in `test/fixtures/bylaws/` (AC 4). `pipeline/extract.ts` and `pipeline/validate.ts` are unwritten or untested against real text. Synthetic fixtures do not count.
4. **Homepage is a placeholder.** `src/pages/index.astro` shows the invented name "Mustergemeinde" with "—" on the tag, says "Der Atlas wird gerade angelegt", and has no search (AC 12). The tag is labelled "Muster", so it is honest, but it is not a shippable user path. The page must show a real municipality and the search field.
5. **`/nrw/` is an empty hub.** It has no table and the sitemap lists only `/` and `/methodik/`. The query "hundesteuer nrw" has nothing to answer it.
6. **Dependency audit.** `npm audit --omit=dev` reports Astro `<=7.3.1` (critical: XSS in `define:vars`, spread attributes and slots; also a path-boundary issue when stripping the configured base). It also reports `sharp` (high), `zod` (high) and `esbuild`. The suggested fix is `astro@7.4.8` (a major bump). The site is static, so exploitability is low, but the rule is "no high or critical issue that has a fix". The Builder should upgrade Astro, or document why the build cannot move, and re-run test, build and `build:preview`.

## Warnings
- Design: `design-check` finds nothing, and the homepage follows DESIGN.md (the masthead, the tag, the Barlow Condensed and Source Serif pairing). I could not judge municipality pages, the table styles or the calculator because they have no output. Re-check after data exists.
- `check:dist` and the calculator island could only be reviewed through their code and tests, not through built output.
- Homepage JS: none is built yet, so the performance budget is untested.
- Duplicate "tasks" in the STATUS.md "Needs you" list (the same legal and domain tasks appear 2 to 3 times). The owner will see noise.
- The preview sitemap uses `example.github.io` as host. That is by design of `build:preview`, but SITE_URL has to be set for production.

## Human tasks
- Run the Wikidata municipality query and the harvest (`npm run municipalities`, `npm run harvest`) from a machine with network access, or grant the next Builder run web access.
- Spot-check 20 random municipality pages against their linked bylaws before announcing.
- Have a lawyer review Impressum, Datenschutz and the affiliate setup; fill in the placeholders and set `PUBLIC_CONTACT_EMAIL`.
- Register the domain, set `SITE_URL`, set up AWIN and `AFFILIATE_HAFTPFLICHT_URL`, verify Search Console.

## Round 1: blockers

- (high) No municipality data: data/ is missing (no 396-entry list, no data/nw/*.json, no coverage-nw.md). AC 2, 5 and 6 fail. [data/]
- (high) No municipality pages exist, so no page answers 'hundesteuer <gemeinde>'. Only 6 pages are built. AC 7 and 8 fail. [src/pages/hundesteuer/, dist/]
- (high) No real bylaw fixtures and no extraction or validation tests on real text (AC 4, Paderborn 72 EUR / 600 EUR). Synthetic fixtures do not count. [test/fixtures/bylaws/, pipeline/extract.ts, pipeline/validate.ts]
- (high) Homepage is a placeholder: invented 'Mustergemeinde' tag with a dash, 'Der Atlas wird gerade angelegt', no search field or index (AC 12). [src/pages/index.astro]
- (medium) /nrw/ hub has no table or content, and the sitemap lists only / and /methodik/. [src/pages/nrw/index.astro]
- (medium) npm audit --omit=dev reports 1 critical and 3 high vulnerabilities (astro <=7.3.1, sharp, zod) with a fix available via astro 7.4.8. Upgrade and re-run test, build and build:preview, or document why it cannot be done. [package.json / package-lock.json]

## Round 2: blockers

- (high) No municipality data: data/ does not exist (no 396-entry list, no data/nw/*.json, no coverage-nw.md). AC 2, 5 and 6 fail. Needs a run or machine with network access (npm run municipalities, npm run harvest). [data/]
- (high) No municipality pages are generated (0 under /hundesteuer/), so no page answers 'hundesteuer <gemeinde>'. AC 7 and 8 fail and the Kreis hubs do not exist. [src/pages/hundesteuer/[slug].astro, dist/]
- (high) No real bylaw fixtures and no extraction or validation code or tests (AC 4, Paderborn 72 EUR / 600 EUR). pipeline/text.ts, extract.ts, validate.ts and municipalities.ts are missing. Synthetic fixtures do not count. [test/fixtures/bylaws/, pipeline/]
- (high) Homepage is a placeholder: invented 'Mustergemeinde' tag, 'Der Atlas wird gerade angelegt', no search field or index file (AC 12). [src/pages/index.astro]
- (medium) /nrw/ hub has no table and the sitemap lists only / and /methodik/. [src/pages/nrw/index.astro]
- (medium) npm audit --omit=dev reports 1 critical and 3 high vulnerabilities (astro <=7.3.1, sharp, zod) with a fix via astro@7.4.8. Upgrade and re-run test, build and build:preview, or document why it cannot be done. [package.json / package-lock.json]
