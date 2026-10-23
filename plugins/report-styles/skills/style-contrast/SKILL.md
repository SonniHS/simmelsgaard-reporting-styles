---
name: style-contrast
description: >
  The Contrast report style ("Contrast · for Accessibility") — maximum legibility for readers with low vision or
  colour-vision differences, and for reports that must meet WCAG AAA, in light or dark. Use it when a report or
  report app has accessibility requirements, when someone asks for a "high-contrast", "accessible", "low-vision",
  "WCAG AAA" or "colour-blind friendly" version of a report page, or for public-sector and regulated audiences.
  Says when to choose it, what it guarantees (text 7:1 and marks 4.5:1 in both modes, enforced by the build;
  Atkinson Hyperlegible; 2 px borders; a direction glyph on every variance so colour is never the only cue), what
  it relaxes with rule ids, and where its tokens, Power BI themes and Deneb overrides are.
---

# Contrast · for Accessibility

Black on white, or white on black, with nothing in between that a low-vision reader has to guess at. The same
numbers and layout as every style; see [report-styles](../report-styles/SKILL.md).

**Not IBCS-compliant.** It keeps a core of the IBCS notation (scenarios, variances with impact colours, N/A, same unit
same scale) and relaxes the IBCS rules listed below. Where IBCS compliance is required, use
[style-ibcs](../style-ibcs/SKILL.md), and offer this style as an additional view.

## Choose it when

- readers have low vision, use a screen magnifier, or have colour-vision differences;
- the organisation has a WCAG AAA requirement (public sector, regulated reporting, accessibility statements);
- as an extra view next to any other style: offer it in the switch so every reader can pick it.

## What it guarantees

- **AAA contrast in both modes**, enforced by `build_styles.py` (`meta.level: "AAA"`): text and labels ≥ 7:1, impact
  colours and the notation marks (AC, PL, FC) ≥ 4.5:1, in the colour-blind-safe set too.
- **Colour is never the only cue** (WCAG 1.4.1): every variance label carries ▲ or ▼, following the sign; a variance
  shown as zero has neither glyph nor colour.
- **Atkinson Hyperlegible**, a typeface designed for low-vision readers, at body 17 px, labels 15 px, figures 36 px.
- 2 px borders on tiles and cards; a 3 px focus ring; a 3 px axis; no thin lines that carry meaning.
- Plain words: "Change", "Previous year", with AC and PY in the legend.

## What it relaxes (exact wording in the token file)

- **SI 2.1** 2 px borders around tiles and cards; **SI 2.3** a low-vision typeface; **CO 1.1** larger text;
  **UN 4.1** a direction glyph on every variance next to its colour; **SI 1.2** white on pure black when the reader
  picks dark (print is always light).

## Assets

- `assets/contrast.tokens.json` — DTCG export.
- `assets/power-bi/contrast-pbi-theme-<light|dark>[-cvd].json` — report themes (Segoe UI Bold titles).
- `assets/deneb/contrast-<light|dark>.overrides.json` — for the `ibcs-deneb` sync script
  ([power-bi.md](../report-styles/references/power-bi.md)).
- Web: `<StyleProvider styles={["ibcs", "contrast"]}>` — IBCS by default, Contrast for readers who need it.
