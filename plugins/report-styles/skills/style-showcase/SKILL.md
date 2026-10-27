---
name: style-showcase
description: >
  The Showcase report style ("Showcase · for Marketing") — a premium, product-grade look for marketing and
  sales reports and dashboards, with one brand accent, in light or dark. Use it when a report or report app
  is for marketing, sales, customer-facing or executive showcase pages, when someone asks for a "nicer",
  "branded", "product-like", "SaaS-style" or "artistic" version of an IBCS page, or for links
  that use variant=artistic. Says when to choose it, how it differs from IBCS (scenarios by hue, solid panels, one
  radius), what it relaxes with rule ids, how to put your own brand in, and where its tokens, Power BI
  themes and Deneb overrides are.
---

# Showcase · for Marketing

A product-grade page: solid surfaces with a hairline edge, one radius, tight type, and one brand accent that
marks the actual (AC) and the one highlight, nothing else. Same numbers and same layout as every style; see
[report-styles](../report-styles/SKILL.md).

**Not IBCS-compliant.** It keeps a core of the IBCS notation (scenarios, variances with impact colours, N/A,
same unit same scale) and relaxes the IBCS rules listed below. Where IBCS compliance is required, use
[style-ibcs](../style-ibcs/SKILL.md), and offer this style as an additional view.

## Choose it when

- the readers are marketing, sales, customer success, or an executive audience used to product dashboards;
- the page is shown on screens or shared outside finance, and should carry the company's brand colour;
- an older link says `variant=artistic` (it opens Showcase).

Not for finance packs (IBCS) or calm people reports (Soft).

## What it looks like

Light: cool grey page, white panels. Dark: navy page, slate panels. Inter throughout, figures semibold, a
12/13/14/20/26/32 px scale, 12 px radius everywhere, a 240 ms fade (off under reduced motion, never delaying a
number). Charts: a line chart of AC (amber) against PY (slate) with the gap shaded by impact and a ΔPY% strip
below; the structure (regions, departments) as a ranked dumbbell (dot = AC, ring = PY) with ΔPY% at the right. KPI variances as tinted chips.

## What it relaxes (exact wording in the token file's `chart.relaxes`)

- **SI 1.2** brand surfaces; **SI 2.1** solid panels with a hairline edge and one radius, chrome only;
  **SI 2.3** the key message set large; **SI 3.1** faint gridlines on the line chart, values only at the end and
  in the strip; **SI 1.3** one short entry fade.
- **UN 3.2** scenarios by hue for AC against **one** reference (amber, slate). Any further scenario keeps its IBCS
  fill: PL outlined, FC hatched, each labelled.
- **SI 2.1** Bars3D only as an opt-in per visual, lengths linear from zero (CH 3.2), never the default.
- **CH 4.1** the line chart and the ranked dumbbell keep their own scales (labelled gridlines from zero, every
  value printed); bars of one unit still share a scale.
- **EX 2.1** a share ring only when the report's owner asks (2–3 parts, labelled); a Ranking is the default.

## Put your brand here

`meta.brandSlot`: AC/PL/FC colour, the highlight, the page colour and the fonts, per mode. Amber, navy and Inter
are neutral placeholders. Change only those paths and run `report-styles/scripts/build_styles.py`: it fails if
the brand colour is green or red, if AC is not clearly stronger than PY, or if any text or mark loses contrast in
either mode. Brand fonts are self-hosted ([tokens-and-brand.md](../report-styles/references/tokens-and-brand.md)).

## Assets

- `assets/showcase.tokens.json` — DTCG export.
- `assets/DESIGN.md` — the style as a [DESIGN.md](https://github.com/google-labs-code/design.md), for any agent or design tool that reads one.
- `assets/power-bi/showcase-pbi-theme-<light|dark>[-cvd].json` — report themes.
- `assets/deneb/showcase-<light|dark>.overrides.json` — for the `ibcs-deneb` sync script
  ([power-bi.md](../report-styles/references/power-bi.md)).
- Web: `<StyleProvider styles={["showcase"]}>` or a switch with other styles.

`ibcs_lint.py theme` reports, as expected: the non-white background (SI 1.2), visual borders and backgrounds
(SI 2.1), default gridlines (SI 3.1), and amber/slate series colours (lint's SI 2.2; covered by UN 3.2).
