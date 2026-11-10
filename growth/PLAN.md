# Growth plan: Hundesteuer-Atlas (prep, 2026-11-10)

## Honest starting point
- `data/` does not exist yet: the harvest was blocked (the Builder had no network). The site builds with zero municipality pages. The sitemap lists only `/` and `/methodik/`. Everything that needs municipality pages waits for the first harvest run (human task).
- Do not announce or submit the site before roughly 80 published municipalities exist. An empty atlas wastes the launch.
- Search volumes are unverified (SPEC §3). Nothing here is a traffic claim.
- The homepage has no search box yet, so the `Suche` analytics event does not exist in code. `Rechner` and `Anzeige-Klick` do exist.
- I could not run `npm run build` or `npm test` in this run (shell access was denied after my first read-only commands). The only code change is the meta tags in `Base.astro`. Run both once before deploy.

## Done in this run
- Open Graph and Twitter tags in `src/layouts/Base.astro`, built from each page's existing title, description and canonical URL.
- Checked and already in place: unique title and description per page, canonical from `SITE_URL`, BreadcrumbList on municipality pages, sitemap from the single indexable list, robots.txt with a sitemap line, cookie-free env-gated analytics, "Anzeige" box without a link when no affiliate URL is set.
- No hreflang: one language (de).
- No social image: none exists, so `twitter:card` is `summary` with no `og:image`. Add one real image later (for example a rendered Steuermarke) rather than a stock picture.

## Query to page coverage
| Query | Page | Status |
|---|---|---|
| hundesteuer <gemeinde>, zweiter hund, listenhund, befreiung, satzung | `/hundesteuer/<slug>/` | in code, generated per published record only |
| hundesteuer <kreis> vergleich | `/nrw/<kreis>/` | in code, indexable from 3 published |
| hundesteuer nrw, tabelle | `/nrw/` | exists |
| hundesteuer <stadt> 2027 | `/hundesteuer-2027/` | generated only with 5 or more qualifying records. Until then the query is not served and I add no placeholder |
| big cities (Köln, Düsseldorf) | municipality page | official pages and news will outrank it. Expect little |

## Days 1 to 3 (after the first data run)
1. Run the harvest with network. Check `data/coverage-nw.md` and spot-check 20 pages against their bylaws.
2. Deploy with the real `SITE_URL`. Verify the domain in Google Search Console and Bing Webmaster Tools, submit `sitemap.xml`, turn on IndexNow via Bing.
3. Check whether `/hundesteuer-2027/` was generated. Paderborn votes on 2026-11-12. Show 120 € only once its amended bylaw is published; never from the news article.

## Days 4 to 14
- Once Search Console shows impressions, test the municipality title "Hundesteuer <Name> 2027: <Betrag>" only for records with a future in-force date.
- Add a data-driven intro sentence to each Kreis hub (real median and range), not boilerplate.
- Answer every "Fehler melden" mail within days. Fix the extraction rule, not the single page.
- Add the homepage search with the `Suche` event (a Builder task, tracked in PLAN.md).

## Days 15 to 30
- Next state (Niedersachsen is the obvious one, 941 municipalities). Harvest the bylaws ourselves; do not use the BdSt tables.
- One original data page only if the data supports it (for example the cheapest and most expensive municipalities, the share with a dangerous-dog rate). It must not duplicate `/nrw/`.
- Review the sitemap's indexed count and impressions per page type.

## Distribution (legitimate fits)
- Local journalists who cover rate increases: one short mail each, only where the Kreis page has real data. Offer the Kreis page and the method as a source, with the bylaw link.
- Hundeschulen, Tierärzte and Hundevereine in NRW that already explain the tax: ask for a plain link. No mass mailing.
- Reddit (r/de, r/Hunde, r/nrw) and local Facebook groups: post only as a real answer to a question about a specific town, with the number and the bylaw link.
- No self-promotion on Wikipedia and no link directories without editorial review.
- Cite the BdSt comparison as context only.

## Monetisation
- Free product. One "Anzeige" insurance box per municipality page, shown only when `AFFILIATE_HAFTPFLICHT_URL` is set, `rel="sponsored nofollow noopener"`, below the rates table. No urgency, no invented comparisons or ratings.
- After 30 days of real traffic, review Anzeige-Klick per page view. Change one thing at a time and log it in `growth/LOG.md`.
- Ads or data licensing only past 20,000 pageviews a month (SPEC §7).

## Analytics
Events: `Rechner`, `Anzeige-Klick` (live), `Suche` (after the search box exists). They need a first-party Plausible-compatible script via `PUBLIC_ANALYTICS_DOMAIN` and `PUBLIC_ANALYTICS_SRC`; otherwise they do nothing. Say "keine Cookies" on the site only while that is true.
