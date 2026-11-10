# Hundesteuer-Atlas: der Steuersatz jeder Gemeinde aus der eigenen Satzung

**Stage:** qa · **Platform:** web · **Score:** 3.3/5 · **Spend:** $6.13

For dog owners and people about to get a dog in Germany: one page per municipality with the current and announced dog-tax rates (first and second dog, listed or dangerous dogs), reductions and exemptions, and a link to the bylaw, extracted from municipal bylaws and refreshed every budget season.

**Why now:** A wave of dog-tax increases for 2027 decided in the Oct-Nov 2026 budget sessions (e.g. Paderborn 72 to 120 EUR from January 2027, final council vote 2026-11-12). This recurs every year. (2026-11-05). Window: Standing gap with a yearly peak: rates change on January 1 after autumn budget votes. The only per-municipality data sets are hand-made and partial (33 or 14 big cities, NRW-only PDFs), and nobody covers the roughly 10,000 smaller municipalities, where a search returns only insurers' generic pages.

## Needs you

- [ ] [task 1] Register a domain (e.g. hundesteuer-atlas.de) and connect static hosting; set SITE_URL
- [ ] [task 2] Fill in the Impressum and Datenschutz placeholders and have a lawyer review the legal pages and the affiliate (Tippgeber) setup
- [ ] [task 3] Apply as a publisher on AWIN to a Hundehaftpflicht programme and set AFFILIATE_HAFTPFLICHT_URL
- [ ] [task 4] Verify the domain in Google Search Console and submit sitemap.xml
- [ ] [task 5] Enable the monthly harvest GitHub Actions workflow (contents write) and review the data diff after runs
- [ ] [task 6] Optional: spot-check 20 random municipality pages against their linked bylaws before announcing
- [ ] [task 7] Optional: create a Brave Search API key as BRAVE_SEARCH_API_KEY to raise bylaw discovery coverage
- [ ] [task 8] Run npm install once if the Builder cannot, and commit package-lock.json (CI and Pages run npm ci)
- [ ] [task 9] Have a lawyer review the legal pages (Impressum, Datenschutz) and the affiliate 'Tippgeber' setup
- [ ] [task 10] Fill in the Impressum/Datenschutz placeholders and set PUBLIC_CONTACT_EMAIL
- [ ] [task 11] Register a domain, connect static hosting and set SITE_URL
- [ ] [task 12] Apply to a Hundehaftpflicht affiliate programme (e.g. on AWIN) and set AFFILIATE_HAFTPFLICHT_URL
- [ ] [task 13] If analytics are wanted, set up a cookie-free Plausible-compatible service served from the own domain and set PUBLIC_ANALYTICS_DOMAIN and PUBLIC_ANALYTICS_SRC
- [ ] [task 14] Enable the monthly harvest workflow in GitHub Actions (contents: write) once the Builder adds it
- [ ] [task 15] Optional: create a Brave Search API key and set BRAVE_SEARCH_API_KEY
- [ ] [task 16] Blocked: Municipality master list (pipeline/municipalities.ts) (Needs the Wikidata SPARQL endpoint; the Builder has no web access. Run it with network access.)
- [ ] [task 17] Blocked: Text extraction + fixture tool (Paderborn fixture) (Needs to download the real Paderborn bylaw PDF; no web access, and synthetic fixtures do not count.)
- [ ] [task 18] Blocked: Rate extraction (pipeline/extract.ts) (Needs the real Paderborn fixture text from the fixture task to write and test against.)
- [ ] [task 19] Blocked: Validation and one published record (Needs extract.ts and a real fixture to produce a published record.)
- [ ] [task 20] Blocked: Municipality master list (Wikidata SPARQL) (Needs web access to the Wikidata endpoint)
- [ ] [task 21] Blocked: Text extraction + fixture tool, Paderborn and further real fixtures (Needs to download real bylaws; synthetic fixtures do not count)
- [ ] [task 22] Blocked: Rate extraction, validation and published records, harvest runs (Depend on real fixtures and network access)
- [ ] [task 23] Blocked: Seven more real fixtures (Needs downloading real NRW bylaws; no web access)
- [ ] [task 24] Blocked: Harvest orchestration, harvest of 30 largest and rest of NRW (Needs network and the municipality master list plus extraction, which are blocked)
- [ ] [task 25] Blocked: Stats/Kreis hubs/State hub/Homepage search/hundesteuer-2027/methodik (Depend on harvested data in data/, which does not exist yet)
- [ ] [task 26] Blocked: Municipality master list, real fixtures, rate extraction, validation, published records, harvest runs (Need web access (Wikidata, municipal bylaw PDFs); Builder has none. Hubs, search, stats wiring and methodik status counts depend on this data.)
- [ ] [task 27] Blocked: Seven more real fixtures (Needs web access to download real NRW bylaws)
- [ ] [task 28] Blocked: Harvest orchestration, harvest of the 30 largest and the rest of NRW (Needs network access plus the municipality list, text.ts, extract.ts and validate.ts, which are themselves blocked)
- [ ] [task 29] Blocked: Stats/neighbours, Kreis hubs, State hub, Homepage search, Methodik (Depend on harvested data in data/nw/, which does not exist yet)
- [ ] [task 30] Blocked: Municipality master list (Wikidata) (No web access for the SPARQL endpoint)
- [ ] [task 31] Blocked: Text extraction, fixtures, rate extraction, validation, harvest runs, and tasks depending on data (hubs, search index, stats wiring) (Need downloaded real bylaws and municipality data; no web access in the Builder shell)
- [ ] [task 32] Blocked: Harvest orchestration (needs municipality list, text/extract/validate modules and network access)
- [ ] [task 33] Blocked: Harvest the 30 largest NRW municipalities (needs network harvest runs)
- [ ] [task 34] Blocked: Harvest the rest of NRW (needs network harvest runs)
- [ ] [task 35] Blocked: Kreis hubs (needs municipality master list and published data)
- [ ] [task 36] Blocked: State hub /nrw/ (needs published data)
- [ ] [task 37] Blocked: Homepage search (needs data/ (master list and published records) for the index and the counter)
- [ ] [task 38] Run npm test and npm run build once to confirm the new meta tags in Base.astro break nothing
- [ ] [task 39] Run the harvest with network access (npm run harvest -- --state=NW) and commit data/ before launching; check data/coverage-nw.md and spot-check 20 pages against their bylaws
- [ ] [task 40] Verify the domain in Google Search Console and Bing Webmaster Tools, submit sitemap.xml and enable IndexNow via Bing, after the first data is live
- [ ] [task 41] Apply to a Hundehaftpflicht affiliate programme (e.g. AWIN) and set AFFILIATE_HAFTPFLICHT_URL
- [ ] [task 42] Set up a first-party cookie-free Plausible-compatible analytics service and set PUBLIC_ANALYTICS_DOMAIN and PUBLIC_ANALYTICS_SRC
- [ ] [task 43] Fill in the Impressum and Datenschutz placeholders, set PUBLIC_CONTACT_EMAIL, and have a lawyer review the legal pages and the affiliate setup
- [ ] [task 44] Optionally supply one real social-share image (for example a rendered Steuermarke) for og:image
- [ ] [task 45] Run the Wikidata municipality query and the NRW harvest with network access (npm run municipalities; npm run harvest), or give the next Builder run web access
- [ ] [task 46] Spot-check 20 random municipality pages against their linked bylaws before announcing
- [ ] [task 47] Have a lawyer review the legal pages (Impressum, Datenschutz) and the affiliate Tippgeber setup; fill in the placeholders and set PUBLIC_CONTACT_EMAIL
- [ ] [task 48] Register a domain, set SITE_URL, apply on AWIN and set AFFILIATE_HAFTPFLICHT_URL, verify the domain in Google Search Console
- [ ] [task 49] Blocked: [QA round 1] No municipality data (data/ missing) (Needs Wikidata/network harvest; no web access)
- [ ] [task 50] Blocked: [QA round 1] No municipality pages (Depends on published records from the harvest)
- [ ] [task 51] Blocked: [QA round 1] No real bylaw fixtures and extraction/validation tests (Needs downloading the real Paderborn bylaw; no web access)
- [ ] [task 52] Blocked: [QA round 1] Homepage is a placeholder (Needs published data for search index and tag rate)
- [ ] [task 53] Blocked: [QA round 1] /nrw/ hub has no content (Needs published data)
- [ ] [task 54] Blocked: [QA round 1] npm audit vulnerabilities (astro upgrade to 7.4.8) (Upgrade needs npm registry access; npm audit and install are unavailable in this session)
- [ ] [task 55] Run the municipality list and harvest with network access (npm run municipalities, then npm run harvest -- --state=NW), or give the next Builder run web access. Without this the product cannot ship.
- [ ] [task 56] Spot-check 20 random municipality pages against their linked bylaws before announcing.
- [ ] [task 57] Have a lawyer review the legal pages (Impressum, Datenschutz) and the affiliate setup; fill in the placeholders and set PUBLIC_CONTACT_EMAIL.
- [ ] [task 58] Register the domain, set SITE_URL, set up AWIN and AFFILIATE_HAFTPFLICHT_URL, and verify Search Console.
- [ ] [task 59] Enable the monthly harvest workflow in GitHub Actions once data exists.
- [ ] [task 60] Run npm audit fix --force (astro 7.4.8) on a machine with registry access if the Builder cannot.
- [ ] [task 61] Blocked: [QA round 2] No municipality data (data/) (Needs Wikidata SPARQL and a network harvest; Builder has no web access)
- [ ] [task 62] Blocked: [QA round 2] No municipality pages generated (Depends on published records from the harvest)
- [ ] [task 63] Blocked: [QA round 2] No real bylaw fixtures / extract, validate, text, municipalities code (Needs downloading real bylaws (Paderborn etc.) and running unpdf; no web access)
- [ ] [task 64] Blocked: [QA round 2] Homepage is a placeholder (Search index, coverage counter and real tag rate need published data)
- [ ] [task 65] Blocked: [QA round 2] /nrw/ hub has no table (Needs published municipality data)
- [ ] [task 66] Blocked: [QA round 2] npm audit vulnerabilities (astro upgrade) (Upgrading astro needs npm registry access, unavailable offline)

## Recommendation

None yet. The Growth role gives one after launch.

## Metrics

No real numbers yet. Fill in `metrics.json` (Search Console, analytics, Stripe); agents never invent them.

## Monetisation

affiliate (dog liability insurance), no ads and no cookies at launch (Everything free. One box labelled 'Anzeige' per municipality page linking to a Hundehaftpflicht offer via AFFILIATE_HAFTPFLICHT_URL; payouts seen in AWIN listings are 20 € per sale (BavariaDirekt) and 10–35 € per lead (Agila), unverified; planning figure 25 € per sale.)

## Target queries

- hundesteuer [gemeinde]
- hundesteuer [stadt] 2027
- hundesteuer zweiter hund [stadt]
- hundesteuer listenhund [stadt]
- hundesteuer befreiung [stadt]
- hundesteuersatzung [gemeinde]
- hundesteuer kreis [kreis]
- hundesteuer nrw
- hundesteuer nrw 2027
- hundesteuer erhöhung 2027

## Alternatives found

- deutschland-rechner.de Hundesteuer-Rechner (partial): 33 large cities only.
- finanz.de Hundesteuer (partial): Compares 14 large cities, according to the search result (not opened).
- Bund der Steuerzahler NRW Hundesteuervergleich (partial): NRW only, PDF tables published once a year, nothing per municipality.
- Omni Calculator Hundesteuer-Rechner (partial): Shows state-level guide values according to the search summary (not opened).

## Kill criteria

- Fewer than 150 organic clicks in the 28 days ending 2027-02-28: freeze, no expansion beyond NRW
- Fewer than 1,000 organic clicks in total by 2027-05-10: shut down
- A spot check of 30 random published rates finds more than 1 wrong amount: unpublish the affected pages and fix extraction before any growth work
- No affiliate sale by 2027-06-30 despite more than 3,000 visits: remove the box and decide between consent-based ads and shutdown

## Links

- Repo: https://github.com/veste-software/hundesteuer-atlas-der-steuersatz-jeder-gemeinde
- Preview (GitHub Pages, builds from main): https://veste-software.github.io/hundesteuer-atlas-der-steuersatz-jeder-gemeinde/

## History

- 2026-11-10 01:08 · scouted · picked from the bench: score 3.3, under the usual 3.5; the review panel is skipped, the prototype is how it is judged
- 2026-11-10 01:16 · specced · spec written
- 2026-11-10 01:28 · planned · scaffold and plan written
- 2026-11-10 01:36 · building · build started
- 2026-11-10 02:12 · seo · all planned tasks done
- 2026-11-10 02:18 · qa · seo and conversion foundations written
- 2026-11-10 02:24 · building · QA round 1 found 6 blocker(s)
- 2026-11-10 02:29 · qa · all planned tasks done
- 2026-11-10 02:35 · building · QA round 2 found 6 blocker(s)
- 2026-11-10 02:40 · qa · all planned tasks done
