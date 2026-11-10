# DESIGN: Hundesteuer-Atlas

## The idea

The site is the cousin of two things on the same kitchen table: the **Hundesteuermarke**, the small stamped aluminium tag on the collar with the town, the year and a punched number, and the **Amtsblatt** printed on pale grey-green recycled paper, set in narrow columns with § numbers hanging in the margin. Every rate appears as a stamped tag, numbered like a plate in a field guide ("Abb. 1"), and every claim sits next to the bylaw text it came from.

### Why this direction

The studio's starting direction was a *field-guide plate*: serif text, italic captions, numbered figures, pale grey-green paper, thin line drawings. The spec (§12) asks for Hundesteuermarke + Amtsblatt. They fit together without a fight: German municipal print really is on grey-green recycled paper, the Amtsblatt is set in serif, and a field guide's numbered plates with italic captions are exactly how a tag "specimen" per municipality should be shown. So we keep the field-guide grammar (paper, serif, italic captions, numbered figures, thin line drawings) and make the specimen a dog-tax tag.

## Typefaces (self-hosted, npm)

| Role | Face | Package | Weights |
|---|---|---|---|
| Display, numerals, labels | **Barlow Condensed** (DIN 1451 cousin, the lettering stamped into tags and street signs) | `@fontsource/barlow-condensed` | 500, 600 |
| Text, captions, bylaw quotes | **Source Serif 4** (an Amtsblatt-type book serif with real italics and tabular figures) | `@fontsource/source-serif-4` | 400, 400 italic, 600 |

Imported once in `src/layouts/Base.astro`. No other fonts, no CDN.

Type scale (rem, root 16 px), set as custom properties in `src/styles/global.css`:

| Token | Size | Use |
|---|---|---|
| `--fs-mark` | clamp(4rem, 14vw, 7rem) | the stamped rate on the tag |
| `--fs-h1` | clamp(2.5rem, 7vw, 4.25rem) | page title, Barlow Condensed 600 |
| `--fs-h2` | 1.75rem | section heads, Barlow Condensed 600 |
| `--fs-h3` | 1.25rem | sub-heads, Source Serif 600 |
| `--fs-body` | 1.0625rem | text, line-height 1.55 |
| `--fs-small` | 0.875rem | captions (italic), table notes |
| `--fs-label` | 0.8125rem | labels: Barlow Condensed 500, uppercase, letter-spacing 0.08em |

Figures: `font-variant-numeric: tabular-nums lining-nums` in every table and amount. Quotes „…", dashes –, the non-breaking space in `72 €` and `§ 2`.

## Colours

| Name | Hex | Use |
|---|---|---|
| Papier | `#E4E9DF` | page surface: grey-green recycled paper |
| Tinte | `#1E2420` | text, rules, buttons (green-black office ink) |
| Alu | `#C3C8C1` | the tag face, table header tint, notice tint |
| Emaille 2026 | `#A3361F` | the accent: the enamel band of the current tax year, links on hover, focus ring, selection. Used sparingly |
| Emaille 2027 | `#1F5A73` | only for rates that take effect in the future ("gilt ab 01.01.2027") |

Secondary text is Tinte in italic, not a lighter grey. Rules are Tinte at full strength, 1 px. Contrast: Tinte on Papier ≈ 13:1, Emaille 2026 on Papier ≈ 5.5:1, Emaille 2027 on Papier ≈ 6.2:1, Tinte on Alu ≈ 9:1. Each year adds one enamel colour token (`--emaille-2028` …); never more than two on one page.

## Grid and spacing

- Page: max 72rem, a **margin column** of 7rem on the left (from 48rem up) for § numbers, figure numbers ("Abb. 2", "Taf. 1") and dates, then the text column. Text measure 62ch.
- Below 48rem the margin column folds above its block as a small label line.
- Spacing steps (custom properties `--s-1` … `--s-8`): 4, 8, 12, 16, 24, 36, 56, 88 px. Sections are separated by a 1 px Tinte rule and `--s-7`; the masthead gets a double rule (3 px `double`), as on an Amtsblatt head.
- Rhythm changes from section to section: the tag plate sits offset to the right of the H1 on wide screens; tables run full width; the bylaw quote is narrow.
- Group with rules and type, not with boxes. No card grids.

## Signature element: the Steuermarke

`src/components/SteuerMarke.astro`: an inline SVG line drawing (1.5 px Tinte stroke, Alu fill) of a shield-shaped tag with a punched hole ringed at the top and a thin enamel band across the upper third in the year's colour. Stamped into it in Barlow Condensed: the municipality name (uppercase, letterspaced), the tax year, and the first-dog rate at `--fs-mark` with an "embossed" look made of two 1 px text-shadows (one lighter, one darker, no blur). Below it an italic caption in field-guide style: *Abb. 1 · Steuermarke Paderborn. Satz für den ersten Hund, Satzung vom 10.12.2024.* The tag is decorative (`aria-hidden`); the same number is always in the rates table as real text.

Second hand-made detail: the **§ in the margin**. Bylaw excerpts are set like an Amtsblatt column: Source Serif, 1 px rule above and below, the § number hanging in the margin column in Barlow Condensed at `--fs-h2`, an italic source line underneath.

Favicon: the tag outline in SVG (`public/favicon.svg`).

## Components

- **Buttons**: square corners, 1 px Tinte border, Barlow Condensed 600 uppercase, letter-spacing 0.06em. Primary = Tinte fill with Papier text; secondary = Papier with Tinte text. Hover: swap fill (no movement). Focus: 2 px Emaille 2026 outline, offset 3 px.
- **Inputs**: like a field on a paper form: label above in the label style, the field with a 1 px Tinte bottom rule only and a slightly lighter paper tint; number inputs use tabular figures. No floating labels.
- **Results / tables**: real `<table>` with `<caption>` in italic ("Taf. 1 · Steuersätze laut § 2 der Satzung"), header row on Alu tint in label style, 1 px rules between rows, amounts right-aligned with tabular figures. Sortable headers on `/nrw/` show a small drawn triangle, not an icon font.
- **Notices**: an Alu-tinted block with a label word ("Hinweis", "Anzeige", "Gilt ab 01.01.2027") in the label style at the top. No side border, no icon. Future-rate notices use Emaille 2027 for the label word only.
- **Insurance box (Anzeige)**: the same notice style, the word "Anzeige" first, plain text, one underlined link.
- **Links**: Tinte, underlined with `text-underline-offset: 0.2em`; hover turns Emaille 2026.

## Voice

German, Sie-form, municipal and exact, a little dry. Numbers first, then the source. Short sentences. Name the paragraph, not "the rules". Examples: „72 € im Jahr für den ersten Hund. So steht es in § 2 der Satzung.“ — „Noch nicht erfasst. Die Satzung liegt uns noch nicht lesbar vor.“ — 404: „Für diese Adresse ist keine Marke ausgegeben.“ No exclamation marks, no "Jetzt entdecken".

## What we will not do

- No one-sided thick borders, no rounded floating cards, no lift on hover, no pills.
- No gradients, glows, blur, or soft large shadows.
- No stock dog photos, no illustrations, no emoji, no icon packs. The only drawings are our own thin-line SVGs (tag, sort triangle, external-link arrow).
- No Inter/Roboto/system-font-only pages; no Google Fonts or CDN.
- No hero-with-two-buttons, no three-feature cards, no "so funktioniert's" steps, no CTA band.
- No marketing filler, no invented numbers or visitor counts.
- No motion beyond a 120 ms colour transition on links and buttons; nothing moves under `prefers-reduced-motion: reduce`.
