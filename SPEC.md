# SPEC: Hundesteuer-Atlas

Decision: **build**, as a one-day prototype scoped to **Nordrhein-Westfalen (all 396 municipalities)**. The data model and URLs are nationwide from day one, so more states can be added without changing URLs.

Site language: German. This spec is in English. All UI strings quoted below are German and must be used as written.

---

## 1. Problem and users

In Germany every municipality sets its own dog tax (Hundesteuer) in its own bylaw (Hundesteuersatzung). Rates differ a lot (first dog from 0 € to about 180 € in NRW, listed/dangerous dogs up to more than 1,000 €). Rates are tiered by the number of dogs, and many bylaws carry special rates for "gefährliche Hunde" and sometimes "große Hunde".

Users:
- **New dog owners** who must register a dog within days or weeks and want to know what it costs. This is the main group, and they come with intent.
- **People about to get a dog or to move**, who compare costs between towns.
- **Residents reading about an increase** (for example Paderborn in November 2026) who want to know their own rate and their neighbours' rates.

Today, a search for `hundesteuer <kleine Gemeinde>` returns the municipality's bylaw PDF, often several versions of it (old and current), written in legal language. After that come generic insurer guide pages with no local numbers. Nobody shows the actual rate per municipality outside the 14 to 33 largest cities.

## 2. Why now

- **Trigger (confirmed):** autumn 2026 budget sessions are raising rates for 1 January 2027. Paderborn raises the first-dog rate from 72 € to 120 € (unchanged since 2000). The finance committee approved it, the council votes on 2026-11-12, and a petition against it runs until 2026-11-11 (NW, 2026-11-05). Search results also show 2027 changes in Nürnberg (132 → 144 €), München (proposal 144 €, dangerous dogs 1,200 €), Heilbronn, Marienberg and Hemhofen.
- **Yearly cycle:** rates change on 1 January. Tax notices and new-puppy registrations cluster in January and February. The Bund der Steuerzahler (BdSt) NRW publishes its comparison around March (2026 edition: "Stand 12.03.2026"), which brings a second wave of local news every year.
- **What keeps the gap open:** the only complete data sets are the yearly BdSt tables for one state each (NRW download, Niedersachsen PDFs by district). Neither has a page per municipality, a bylaw link or exemptions. Commercial calculators stop at 33 cities because collecting about 10,750 bylaws by hand does not pay. A pipeline does.
- **Ship by:** prototype live **2026-11-20**. Full NRW coverage and the scheduled monthly refresh by **2026-12-05**, so pages are indexed before the January peak.

## 3. Evidence (checked myself on 2026-11-10)

| What | Source | How checked |
|---|---|---|
| Paderborn: 72 → 120 € first dog from 1 Jan 2027; two dogs 90 → 150 € each; three or more 108 → 180 € each; dangerous 600 → 960 €; large dogs 300 → 480 €. Council vote on 12 Nov, petition until 11 Nov. Article dated 05.11.2026 | https://www.nw.de/lokal/kreis_paderborn/paderborn/24455572_Hoehere-Hundesteuer-fuer-Paderborn-Politiker-beschliessen-deutliche-Erhoehung.html | opened |
| The best calculator covers 33 large cities, has 2027 rates for only Hamburg, München and Nürnberg, excludes all other municipalities, and was updated 2026-10-17 | https://www.deutschland-rechner.de/hundesteuer-rechner | opened |
| Omni Calculator shows one row per federal state only, with no municipalities and no date | https://www.omnicalculator.com/de/finanzen/hundesteuer-rechner | opened |
| amtsdeutschland.de deliberately shows no amounts and only generates a letter to the municipality (updated 1 Sep 2026) | https://amtsdeutschland.de/rechner/hundesteuer/ | opened |
| SERP `hundesteuer paderborn`: the top results are the city's 2025 bylaw PDF and its 2005 bylaw PDF, then unrelated pages. No page shows the rate | search | searched as a user |
| SERP `hundesteuer salzkotten höhe`: the bylaw PDF (3rd amendment, 2018), then Allianz and ARAG generic pages. SERP `hundesteuer bad lippspringe zweiter hund`: nothing about that town | search | searched as a user |
| BdSt NRW 2026: all 396 municipalities levy a first-dog tax, 27 raised rates in 2026, 326 levy a dangerous-dog rate. Published as a yearly download (Stand 12.03.2026) | https://steuerzahler.de/aktuelles/detail/es-wird-teurer-hundesteuer-vergleich-2026/ | search result summary, not opened |
| BdSt Niedersachsen/Bremen 2026 (8 Oct 2026): all 941 municipalities, 300 raised rates 2022–2026, PDFs by district | https://steuerzahler.de/aktuellesausniedersachsenundbremen/news/bdst-hundesteuervergleich-2026/ and https://steuerzahler.de/fileadmin/user_upload/Hundesteuer_Landkreise_2026.pdf | search result summary, not opened |
| Destatis (7 Oct 2026): dog-tax revenue 2025 was 429.7 million € | https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/10/PD26_N069_73.html | search result summary, not opened |
| Local media publish district comparisons themselves (Landkreis Haßberge; Kreis Esslingen, where Köngen goes 96 → 120 € in 2026), which shows demand for regional comparison pages | https://www.infranken.de/lk/hassberge/grosse-unterschiede-so-hoch-ist-die-hundesteuer-in-staedten-und-gemeinden-im-landkreis-hassberge-art-5109721 and https://www.stuttgarter-zeitung.de/lokales/esslingen/hundesteuerer-kreis-esslingen-halter-zahlen-ab-2026-deutlich-mehr-in-koengen-wie-sieht-es-anderswo-aus-78881844.html | search results |
| Affiliate payouts exist for dog liability insurance: an AWIN listing for BavariaDirekt shows 20 € per Hundehaftpflicht sale; Agila shows 10–35 € per lead | https://ui.awin.com/merchant-profile/13884 and related AWIN listings | search result summary, undated, not verified |

**Not verified:** monthly search volumes (I had no keyword tool). Demand is inferred from the yearly cycle of registrations and rate changes, the SERPs, and media coverage.

## 4. Positioning

**The gap in one sentence:** nobody shows the dog-tax rate of a small or mid-sized German municipality on one readable page, taken from that municipality's own current bylaw with the paragraph quoted, and compared with its neighbours.

| Alternative | URL | What it lacks |
|---|---|---|
| deutschland-rechner.de Hundesteuer-Rechner | https://www.deutschland-rechner.de/hundesteuer-rechner | Only 33 large cities. No bylaw excerpt, no exemptions |
| finanz.de Hundesteuer | https://www.finanz.de/steuern/hundesteuer/ | About 14 large cities (per search summary) |
| Omni Calculator | https://www.omnicalculator.com/de/finanzen/hundesteuer-rechner | State-level guide values, not real municipal rates |
| amtsdeutschland.de | https://amtsdeutschland.de/rechner/hundesteuer/ | Shows no amounts at all |
| rechner-portal.de | https://rechner-portal.de/tiere-haustiere/hund/hundesteuer-rechner | The user must type in their own rate |
| BdSt NRW / BdSt Niedersachsen yearly comparisons | see §3 | One state each, one download or PDF a year, no page per municipality, no bylaw link, no exemptions, no 2027 rates until spring |
| Municipal bylaw PDFs | e.g. paderborn.de | Authoritative but legal language, several versions online, no comparison, often outdated versions rank |
| Insurer guide pages (Allianz, ARAG, Tarifcheck) | allianz.de, arag.de, tarifcheck.de | Generic and national, with no local rate |

**What only this product does:**
1. One page per municipality with the rates for the first, second and further dogs and for dangerous dogs, **with the bylaw paragraph quoted word for word**, the bylaw date, the in-force date, a "retrieved on" date and the direct link to the bylaw.
2. Comparison with every other covered municipality in the same Kreis ("12 € teurer als der Kreisschnitt").
3. A yearly-cost calculator that follows the bylaw's own structure (nth dog, or "je Hund, wenn zwei Hunde gehalten werden").
4. Rates that take effect in the future are flagged ("gilt ab 01.01.2027") as soon as the municipality publishes the amended bylaw.
5. A monthly automatic refresh that re-reads every bylaw and keeps the history.

Growth copy anchor: "Der Hundesteuersatz Ihrer Gemeinde, direkt aus der Satzung zitiert, mit Link und Datum."

## 5. MVP scope

### In
- **Master list:** all 396 NRW municipalities with AGS (Amtlicher Gemeindeschlüssel, starting with `05`), name, Kreis or kreisfreie Stadt, population and official website. Source: the Wikidata SPARQL endpoint (CC0). If Wikidata does not return exactly 396, fall back to the Destatis Gemeindeverzeichnis (GV-ISys, licence dl-de/by-2.0, attribution in the footer) for the list and use Wikidata only for websites. The result is committed as `data/municipalities-nw.json`.
- **Harvest pipeline** (`npm run harvest`), run by the Builder and later by a monthly CI job, **never during `npm run build`**:
  1. *Discovery* per municipal host: read robots.txt and obey it. Read the sitemap(s), else crawl best-first from the homepage, preferring links whose URL or text matches `ortsrecht|satzung|steuer|abgaben|finanz|hund`. At most 60 pages per host, depth 4 and 1 request per second per host; up to 12 hosts in parallel. Use a generic User-Agent `HundesteuerAtlasBot/0.1 (+<site URL>/ueber)`, with no personal data. Candidate documents are PDF or HTML whose URL or anchor text matches `/hundesteuer/i`. Rank them: "satzung" or "lesefassung" first, newest year in the file name or anchor text first, Änderungssatzungen kept as secondary documents. Optional fallback: only if the env var `BRAVE_SEARCH_API_KEY` is set, query `Hundesteuersatzung <Name>` restricted to the municipality's domain. The pipeline must work without it.
  2. *Text:* extract the text of the PDF or HTML. Scanned PDFs without a text layer get status `scan` (no OCR in the MVP).
  3. *Extraction:* find the rate paragraph by its heading (`§ n Steuersatz|Steuersätze|Steuermaßstab und Steuersatz|Höhe der Steuer`). Parse amounts (`72,00 €`, `72 EUR`, `1.200,00 Euro`) and tie each to its tier label as written in the bylaw: first, second, third and further dog; "je Hund, wenn zwei/drei Hunde gehalten werden"; gefährliche Hunde (often referring to §3 or §10 LHundG NRW); große Hunde (§11 LHundG NRW). Store the **verbatim excerpt** of the paragraph and its § number. Also capture: the paragraphs headed `Steuerbefreiung|Steuerermäßigung|Steuervergünstigung` (§ number, heading and the first 600 characters verbatim); the in-force date (`tritt am … in Kraft`); and the bylaw title and date.
  4. *Validation* (all must pass for status `published`): the first-dog amount (or a stated 0) is found; every published amount occurs verbatim in the stored excerpt; first dog is between 0 and 400 €; dangerous-dog amounts are at least the first-dog amount; the excerpt contains "Hund". Otherwise the status is `found-unparsed`, `scan`, `not-found` or `fetch-error`.
  5. *Change tracking:* store the sha256 of every source document. A re-run re-extracts only changed documents and appends to `history` (old rates with the dates they were valid).
- **Rate model** (per municipality): `ags, name, slug, kreis, kreisSlug, population, website, status, bylaw {url, title, date, inForceFrom, retrievedAt, sha256, format}, tiers[] {label (verbatim), kind: "nth-dog" | "per-dog-when-n-kept" | "dangerous" | "large", n, amountEur}, excerpt {paragraph, text}, reliefs[] {paragraph, heading, text}, history[]`. Paderborn's bylaw uses "per-dog-when-n-kept", so the model must represent both kinds.
- **Pages** (static, built from committed data):
  - `/`: search box (municipality name, client-side over a small JSON index), an explanation in two sentences, NRW coverage counter ("N von 396 Gemeinden erfasst"; this is a data count, not a visitor count), and links to the state and Kreis hubs.
  - `/nrw/`: state hub with a sortable table of all published municipalities (1. Hund, 2. Hund, gefährlicher Hund, Stand der Satzung) plus min, median, max and the 10 cheapest and 10 most expensive.
  - `/nrw/<kreis-slug>/`: Kreis hub with a table of its municipalities, Kreis median and the status of every municipality. Ones without data appear as "noch nicht erfasst", with a link to the bylaw if one was found. Indexable only when at least 3 municipalities are published, otherwise `noindex`.
  - `/hundesteuer/<gemeinde-slug>/`: municipality page, **generated only for status `published`**. Slug = name in lower case, ASCII-folded (ä→ae and so on). If the name is not unique among all German municipalities (check against the full Wikidata/Destatis list), append `-<kreis-slug>`. Slugs never change once published.
  - `/hundesteuer-2027/`: list of municipalities whose published bylaw comes into force on or after 2027-01-01, with old and new rates. **Generated only if at least 5 such municipalities exist.**
  - `/methodik/`: how the data is collected, its limits, the status counts and the BdSt note (we do not use their tables).
  - `/impressum/`, `/datenschutz/`: drafts with placeholders.
- **Municipality page content:** H1 `Hundesteuer <Name>`; a rates table with labels as in the bylaw; the line "Satzung vom <date>, in Kraft seit/ab <date>, abgerufen am <date>"; the verbatim excerpt set as a quote with its § number; a link "Satzung öffnen (PDF)"; a reliefs section "Ermäßigungen und Befreiungen laut Satzung" with excerpts, or the sentence "In der Satzung nicht gefunden – bitte Satzung prüfen"; a yearly-cost calculator (normal dogs 1–5, dangerous dogs 0–3). A static table of totals for 1, 2 and 3 dogs is rendered at build time, so the page works without JS. When the bylaw does not say how mixed normal and dangerous dogs are counted, show separate totals and say so. Then: neighbours in the same Kreis with their first-dog rate and the difference; a box about liability insurance (see §7); the disclaimer "Angaben ohne Gewähr. Verbindlich ist allein die Satzung der Gemeinde."; a link "Fehler melden" (mailto: to the Impressum address with the AGS in the subject line); BreadcrumbList JSON-LD.
- **Future rates:** if `inForceFrom` is after the build date, label the rates "gilt ab <date>". If an older bylaw with current rates was also parsed, show both ("bis 31.12.2026" / "ab 01.01.2027").
- **Monthly refresh:** a GitHub Actions workflow (`workflow_dispatch` plus a monthly cron) runs the harvest, runs the tests and commits changed data only if the tests pass. The human enables it.
- `sitemap.xml` with only indexable pages; `robots.txt`.

### Out (not in the MVP)
- States other than NRW (the pipeline takes a `--state` flag; NI, HE and SL come next).
- OCR of scanned bylaws; LLM-based extraction (it may come later behind an optional `ANTHROPIC_API_KEY`, but it is not needed for any acceptance criterion).
- Search by postcode (PLZ→Gemeinde data has licence issues to sort out first).
- Accounts, newsletters, email alerts, comments and user-submitted rates.
- Display ads and any cookie banner.
- English version.
- News-based "announced but not yet published" rates. Only rates from published bylaw documents are shown.
- Ingesting BdSt tables in any form (database right, §87b UrhG).

## 6. Acceptance criteria (QA checks these, none needs an account or key)

1. `npm test` and `npm run build` both pass. `npm run build` makes no network requests and reads only committed files under `data/`.
2. `data/municipalities-nw.json` has exactly 396 entries. Every `ags` is 8 digits starting with `05` and unique, and every `slug` is unique.
3. `npm run harvest -- --state=NW --limit=5 --max-minutes=3` exists, exits on its own within the time limit, and writes per-municipality results with a `status`. A unit test proves a URL disallowed by a fixture `robots.txt` is not fetched, and another proves at most 1 request per second per host (mocked clock/fetch).
4. At least **8 real bylaw fixtures** live in `test/fixtures/bylaws/`: extracted text plus a sidecar JSON with the source URL and retrieval date, from at least 8 different NRW municipalities. **Paderborn** is one of them if its PDF can be fetched (https://paderborn.de/rathaus-service/stadtverwaltung/satzungen/steuern-und-abgaben.php.media/293109/Hundesteuersatzung-der-Stadt-Pderborn-ab-01.01.2025.pdf). Its test expects a first-dog rate of 72 € and a dangerous-dog rate of 600 €, per the NW article; any other tiers must match the bylaw text. At least one fixture uses "nth-dog" tiers and one uses "per-dog-when-n-kept" tiers. Extraction unit tests pass on all fixtures. If a fixture URL is unreachable, the Builder picks another real bylaw and records why in the sidecar. Synthetic fixtures do not count towards the 8.
5. The committed dataset has **at least 80 NRW municipalities with status `published`**, including at least 15 of the 30 largest NRW municipalities by population. `data/coverage-nw.md` lists all 396 with their status and is generated by the pipeline.
6. A dataset test passes for **every** published municipality: each published amount occurs verbatim (after normalising `72,00 €` = `72 €` = `72 EUR`) in the stored excerpt; `bylaw.url` is an absolute http(s) URL; `retrievedAt` is an ISO date.
7. One HTML file per published municipality exists under `/hundesteuer/<slug>/`, and none exists for any other status. `sitemap.xml` lists exactly the indexable pages. Kreis hubs with fewer than 3 published municipalities carry `<meta name="robots" content="noindex">`.
8. A sample municipality page contains: the H1 `Hundesteuer <Name>`, the rates table, the verbatim excerpt with its § number, the bylaw link, the three dates (Satzung, in Kraft, abgerufen), the reliefs section (excerpt or the stated fallback sentence), the static totals table for 1, 2 and 3 dogs, the neighbour comparison, the disclaimer sentence and the "Fehler melden" mailto link.
9. The calculator matches hand-computed totals in unit tests for both tier kinds. For example: nth-dog 60/70/80 with 3 dogs = 210; per-dog-when-n-kept 90 € each when 2 are kept, with 2 dogs = 180.
10. When `inForceFrom` is a future date (test with a fixture dated 2027-01-01 and a build date in 2026), the page shows "gilt ab 01.01.2027".
11. `/hundesteuer-2027/` is not generated when fewer than 5 qualifying municipalities exist (tested with fixture data both ways).
12. Homepage search: the JSON index is under 100 KB. Searching "Pader" returns Paderborn (unit test on the search function). The homepage works without JS and links to `/nrw/`.
13. Built HTML contains no third-party `<script>` or `<iframe>`, and the site sets no cookies (no `document.cookie`, no `Set-Cookie` in any server config).
14. Insurance box: with `AFFILIATE_HAFTPFLICHT_URL` unset, the box shows only neutral information and no link. With it set, the link has `rel="sponsored nofollow noopener"` and the visible label "Anzeige". Both are tested.
15. `/impressum/` and `/datenschutz/` exist, are linked from every page footer, and are marked as drafts with placeholders (no invented names or addresses).
16. The footer credits the data sources ("Gemeindeliste: Wikidata (CC0)" and, if used, "Destatis, dl-de/by-2.0"). `/methodik/` states the status counts taken from the data.
17. Every page sets `<html lang="de">`, a unique `<title>` and meta description, and a canonical URL built from `SITE_URL` + `SITE_BASE`.

## 7. Monetisation

**Primary model: affiliate for dog liability insurance (Hundehaftpflicht), with no ads and no cookies at launch.** It fits the moment: someone who registers a new dog also needs liability cover. In NRW, cover is a legal duty for large and dangerous dogs (the Builder must verify the exact § of the LHundG NRW on recht.nrw.de before citing it; if it cannot be verified, use the neutral sentence "Für große und gefährliche Hunde schreibt das Landeshundegesetz NRW eine Haftpflichtversicherung vor – Details beim Ordnungsamt.").

- **Free:** everything. No paywall.
- **Slot:** one box per municipality page, below the rates table and above the neighbours, labelled "Anzeige", with `rel="sponsored nofollow"`. The URL comes from the env var `AFFILIATE_HAFTPFLICHT_URL`. Nothing appears on hubs, the homepage or the legal pages.
- **Payouts seen (unverified, undated AWIN listings):** 20 € per Hundehaftpflicht sale (BavariaDirekt); 10–35 € per lead (Agila). Planning figure: 25 € per sale.
- **Later, only if more than 20,000 pageviews a month:** display ads behind a TCF consent banner, and/or licensing the rate data set (CSV or API) to pet or insurance portals. Neither is in the MVP.

**Expected profit (first 12 months after launch):**
- *Bottom-up:* about 430 M € revenue a year (Destatis 2025) at roughly 70–90 € per dog implies about 5–6 M taxed dogs. With about 1/12 turnover and moves, roughly 0.8–1 M registrations a year (assumption). If 40% of those search `hundesteuer <ort>`, that is about 30k such searches a month nationwide (unverified); NRW's population share (≈21%) gives about 6–7k a month. The prototype covers perhaps 50–60% of that by population. A new domain earns almost nothing for 2–3 months; then positions 3–8 for small towns and worse for big cities (where official pages and news rank), so the average captured share is about 4–5%. That gives roughly 250–350 visits a month from month 4 and **about 3,000 visits in year 1 for NRW only**, or about 5,000 with a partial expansion to more states. Revenue: 3% click the insurance box, 6% of those buy, at 25 € each: 5,000 × 0.03 × 0.06 × 25 € ≈ **225 €**. Running costs: domain about 15 € plus optional API costs about 5 € = 20 €. **Net ≈ 200 €.**
- *Cross-check:* the studio's only site with traction (a German programmatic directory with thousands of detail pages) had about 286 clicks in 28 days at about 6 weeks old. An atlas with 80–396 pages, fewer pages but stronger consumer intent, should land at the same order: 2,000–5,000 clicks in year 1. At a 20–60 € RPM for an insurance affiliate in a German finance niche, that gives 40–300 €. The two methods agree within a factor of 3. Using the lower end, **expected ≈ 150 €**.
- *Upside (1 in 10):* nationwide coverage of about 6,000 municipalities by mid-2027, top-3 positions on the long tail, about 60,000 visits × 0.06 € plus a small data-licence deal ≈ **4,000 €**.

This earns close to nothing in year 1. It is built because it is a one-day prototype that fits the owner's pipeline strength exactly, costs about 20 € a year to run, and is the first step of a nationwide data asset (10,750 municipalities, refreshed yearly), which the studio's own results suggest is the kind of site that ranks.

## 8. Target queries and page plan

| Query (pattern) | Page that answers it |
|---|---|
| `hundesteuer <gemeinde>` | `/hundesteuer/<slug>/`: rates, bylaw excerpt, link |
| `hundesteuer <stadt> 2027` | `/hundesteuer/<slug>/` (future-rate label) and `/hundesteuer-2027/` |
| `hundesteuer zweiter hund <stadt>` | `/hundesteuer/<slug>/`: tier table plus totals for 1, 2 and 3 dogs |
| `hundesteuer listenhund <stadt>` / `kampfhund steuer <stadt>` | `/hundesteuer/<slug>/`: dangerous-dog row with § excerpt |
| `hundesteuer befreiung <stadt>` / `hundesteuer ermäßigung <stadt>` | `/hundesteuer/<slug>/`: reliefs section with excerpts |
| `hundesteuersatzung <gemeinde>` | `/hundesteuer/<slug>/`: direct link to the current bylaw, plus date |
| `hundesteuer kreis <x>` / `hundesteuer <landkreis> vergleich` | `/nrw/<kreis-slug>/` |
| `hundesteuer nrw` / `hundesteuer nrw 2027` / `hundesteuer nrw tabelle` | `/nrw/` |
| `hundesteuer erhöhung 2027` | `/hundesteuer-2027/` (only when at least 5 real entries exist) |
| `hundesteuer rechner` (hard, national) | `/` plus calculator on every municipality page |

Every page carries real data from a bylaw. No article-only pages, and no pages for municipalities without validated data.

## 9. Success metrics and kill criteria

Success (target):
- 2026-12-05: at least 250 of 396 NRW municipalities published, and the monthly refresh enabled.
- 2027-02-28: at least 300 organic clicks in the trailing 28 days (Search Console).
- 2027-04-30: at least 600 organic clicks in the trailing 28 days, and an average position of 10 or better on `hundesteuer <gemeinde>` queries for municipalities under 50k inhabitants.

Kill or stop:
- Fewer than **150 organic clicks in the 28 days ending 2027-02-28** (the registration peak plus 3 months to index): no expansion to other states; freeze.
- Fewer than **1,000 organic clicks in total by 2027-05-10** (6 months): shut down and let the domain lapse.
- A spot check of 30 random published rates against the linked bylaws finds **more than 1 wrong amount**: unpublish the affected status class at once and fix extraction before any growth work.
- **No affiliate sale by 2027-06-30** despite more than 3,000 visits: remove the box and decide between consent-based ads and shutdown.

## 10. Legal and platform notes

- **Bylaws are official works** (§5 Abs. 1 UrhG, amtliche Werke), so quoting them word for word is allowed. Link to the municipality's file; do not rehost the PDFs.
- **Do not use BdSt tables** (NRW or Niedersachsen) as a data source or for bulk comparison: they are likely protected by the database right (§87b UrhG). Comparing a handful of values for a manual sanity check is fine; republishing is not.
- **Crawling:** obey robots.txt, 1 request per second per host, a generic UA with the site URL, no login-protected areas, no personal data. Municipal pages are public.
- **Accuracy:** every page shows its source, dates and the disclaimer "Angaben ohne Gewähr. Verbindlich ist allein die Satzung der Gemeinde." Only validated rates are published.
- **Advertising law:** affiliate links are labelled "Anzeige" (§5a UWG, §6 DDG). Linking to an insurer or comparison site as a pure "Tippgeber", without advice, is generally possible without a §34d GewO licence. A lawyer should confirm this.
- **Privacy:** no cookies, no third-party scripts. If analytics are wanted, use cookie-free server-side or hosting analytics only, and say so in the Datenschutz page.
- **Impressum and Datenschutz** are required (DDG §5, GDPR) and written as drafts with placeholders.
- Platform: static web. Preview on GitHub Pages; the real site on a custom domain (Cloudflare Pages or similar).

## 11. Human tasks

- Register a domain (e.g. `hundesteuer-atlas.de`, availability not checked) and connect static hosting; set `SITE_URL`.
- Fill in the Impressum and Datenschutz placeholders and have a lawyer review the legal pages and the affiliate (Tippgeber) setup.
- Apply as a publisher on AWIN (or a similar network) to a Hundehaftpflicht programme and set `AFFILIATE_HAFTPFLICHT_URL`.
- Verify the domain in Google Search Console and submit `sitemap.xml`.
- Enable the monthly harvest workflow in GitHub Actions (grant contents write) and glance at the data diff after each run.
- Optional before announcing: spot-check 20 random municipality pages against their linked bylaws.
- Optional: create a Brave Search API key and set `BRAVE_SEARCH_API_KEY` to raise discovery coverage.

## 12. Look and feel

The visitor has just brought home a puppy or opened a letter about a tax rise. They arrive in a hurry and a little irritated, and want one number they can trust, plus proof. The digital cousin of this product is the **Hundesteuermarke**, the small stamped aluminium or enamel tag on the collar, with the municipality name, the year and a punched number, in a new colour each year. Its partner is the **Amtsblatt**, the municipality's plain official gazette set in narrow columns with § signs in the margin. So the rate sits on a tag-shaped plate with a punched hole and stamped, embossed-looking numerals (a DIN 1451-style narrow grotesque, such as Barlow Condensed or D-DIN). The bylaw excerpt is set like an Amtsblatt column on off-white paper, with the § number hanging in the margin. The palette is aluminium grey, Amtsblatt paper and one enamel accent that changes with the tax year (2027 tags get their own colour). The mood is municipal, exact and a little dry-humoured, never a SaaS landing page: no gradients, no rounded floating cards, no stock dog photos.
