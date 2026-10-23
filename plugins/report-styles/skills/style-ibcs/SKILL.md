---
name: style-ibcs
description: >
  The IBCS report style ("IBCS · for the CFO") — notation first, dense, no decoration, the reference every
  other report style reconciles to. Use it when a report, dashboard or report app is for finance,
  controlling or the CFO, when someone asks for "IBCS", "proper notation", "the finance version", or when
  unsure which style to pick; also for the IBCS dark theme in a web app or Power BI. Says when to choose it
  over Showcase, Soft or Graphic, what it relaxes (cards for UI chrome, an optional dark theme), and where
  its tokens, dark Power BI themes and Deneb overrides are. The notation itself is the ibcs plugin's.
---

# IBCS · for the CFO

The reference style, and **the only report style that follows the IBCS® Standards**. It follows the IBCS® notation of the `ibcs` plugin (`ibcs-notation`, `ibcs-web-charts`,
`ibcs-power-bi`) without changes inside charts and tables; this skill only adds what the report-styles system
needs: its place in the shared page layout, its light and dark colours, and its assets. For the switch, the
layout and the reconcile test, see [report-styles](../report-styles/SKILL.md).

## Choose it when

- the readers are finance, controlling, management accounting, the CFO, the board's finance committee;
- several audiences share a page and finance is the main reader (offer IBCS first); when finance only checks a
  page made for others, offer IBCS second, after the friendly default;
- you are unsure: IBCS is never wrong, only sometimes too dense for a non-finance reader.

Prefer Soft for readers outside finance, Showcase for marketing and sales, Graphic for communication pages.

## What it looks like

Light grey page, white cards for UI chrome only, system fonts, no motion. Charts: a multi-tier month chart
(ΔPY% pins, ΔPY bars, PY and AC columns) and region bars with ΔPY and ΔPY% columns. The IBCS page shows two
details the other styles leave out, in the same positions: monthly ΔPY and the region ΔPY column.

Light: AC #404040, PY #A6A6A6, good #3F9C35, bad #D42A20, neutral #1F6FD1 (the IBCS impact hues in screen-tuned
codes). Dark: the ibcs-dark derivation, page #1E1E1E, AC #D9D9D9, PY #7F7F7F,
good #9CCB19, bad #FF4D4D, neutral #4D8DFF; PL outlined and FC hatched keep reading on the dark page.

## What it relaxes

- **SI 2.1** — cards with rounded corners on a light grey page, for UI chrome only; no frames inside charts or
  tables.
- **SI 1.2** — a dark theme when the reader picks dark; the notation and impact hue families are preserved.
  Light is the default for print and for anything shared as a document.

## Assets

- `assets/ibcs.tokens.json` — DTCG export (generated from `report-styles/assets/tokens/ibcs.json`).
- `assets/power-bi/ibcs-pbi-theme-<light|dark>[-cvd].json` — report themes in this style's colours (the same
  screen-tuned impact colours as the web style).
- `assets/deneb/ibcs-<light|dark>.overrides.json` — re-colours the `ibcs-deneb` templates to match.
  See [power-bi.md](../report-styles/references/power-bi.md).
- Web: `<StyleProvider styles={["ibcs"]}>` with the components in `report-styles/assets/react-reference`.

`ibcs_lint.py theme` on the dark theme reports the dark background and the dark visual background (SI 1.2):
expected. Anything else is a defect.
