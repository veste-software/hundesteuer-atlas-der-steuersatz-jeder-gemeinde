# Hundesteuer-Atlas: der Steuersatz jeder Gemeinde aus der eigenen Satzung

**Stage:** specced · **Platform:** web · **Score:** 3.3/5 · **Spend:** $1.90

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
