---
name: style-annual
description: >
  The Annual report style ("Annual · for Investors") — the calm key-figures spread of an annual report, for
  investors, the board and anything published as a yearly or half-yearly review, in light or dark. Use it when
  report numbers go into an annual report, an investor update, a half-year review or a board pack that should
  look published rather than operational, or when someone asks for an "annual report look", "investor" or
  "print-quality" version of an IBCS page. Says when to choose it, what it looks like (a tinted message band,
  light-weight numerals, AC columns and bars with a PY marker line, numbered callouts), what it relaxes with rule
  ids, how to put a brand in, and where its tokens, Power BI themes and Deneb overrides are.
---

# Annual · for Investors

The key-figures spread of a calm annual report: one focal band for the message, generous space, light-weight
numerals, the brand colour on the actuals and a gold accent for the numbered callouts. Same numbers and same layout
as every style; see [report-styles](../report-styles/SKILL.md).

**Not IBCS-compliant.** It keeps a core of the IBCS notation (scenarios, variances with impact colours, N/A,
same unit same scale) and relaxes the IBCS rules listed below. Where IBCS compliance is required, use
[style-ibcs](../style-ibcs/SKILL.md), and offer this style as an additional view.

## Choose it when

- the page is published: an annual or half-year report, an investor update, a board pack read as a document;
- the readers expect the look of a printed report rather than an app.

Not for monthly control (IBCS), not for a product dashboard (Showcase), not for a wall screen (Wallboard).

## What it looks like

Light: white page, a lavender message band, aubergine actuals, gold callout rings. Dark: plum. Manrope throughout,
KPI values as 44 px light-weight numerals under a thin brand rule, no boxes. Time card: AC columns with PY as a
marker line across each column (with a page-coloured halo), AC values on the columns, a Δ% row, the largest gain and
the weakest point numbered ① ② and explained under the chart. Structure card: ranked AC bars with a PY marker, Δ% at
the right. Words: "On 2024", "Was 106.0".

## What it relaxes (exact wording in the token file)

- **SI 1.2** a tinted message band and panels without boxes; **SI 2.3** light-weight display numerals; **CO 1.1**
  large figures and message; **UN 3.2** PY as a marker line on the AC column or bar, named in the legend;
  **SI 2.2** AC in the aubergine brand colour (far from every impact hue, clearly stronger than PY); **CO 1.3** at most
  three visuals a page.

**Banned:** pie, ring, gauge, funnel, radar, traffic light, pseudo-3D, waffle, pictogram, truncated axes. A share of a
whole is a 100 % stacked bar with labels.

## Put your brand here

`meta.brandSlot`: AC/PL/FC colour, the accents, the band colour and the fonts, per mode. Change only those paths and
run `report-styles/scripts/build_styles.py`; it re-checks contrast and the notation in both modes
([tokens-and-brand.md](../report-styles/references/tokens-and-brand.md)).

## Assets

- `assets/annual.tokens.json` — DTCG export.
- `assets/power-bi/annual-pbi-theme-<light|dark>[-cvd].json` — report themes (Segoe UI Light figures: Power BI has
  no web fonts).
- `assets/deneb/annual-<light|dark>.overrides.json` — for the `ibcs-deneb` sync script
  ([power-bi.md](../report-styles/references/power-bi.md)).
- Web: `<StyleProvider styles={["annual"]}>`.

`ibcs_lint.py theme` reports, as expected: the tinted background (SI 1.2) and the aubergine series colour (SI 2.2).
