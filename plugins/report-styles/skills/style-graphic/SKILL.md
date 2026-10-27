---
name: style-graphic
description: >
  The Graphic report style ("Graphic · for Communication") — an editorial, newspaper-style data page for
  company communication, in light or dark. Use it when report numbers go to the intranet, a newsletter or a
  town-hall slide, or when someone asks for an "editorial", "infographic", "news" or
  "storytelling" version of a report page. Says when to choose it, what it looks like (the key message as a
  serif headline, a ruled figure strip, a line chart with annotations tied to their points, a ruled table
  with inline bars), what it relaxes with rule ids, what stays banned (rings, pies, truncated axes,
  area-scaled icons), and where its tokens, Power BI themes and Deneb overrides are.
---

# Graphic · for Communication

The data page of a good newspaper: the key message is the headline, the figures sit in a ruled strip, the chart
is annotated where the story is, and every chart says what it shows. Credible and calm enough to sit next to the
CFO's numbers; readable from across a room. Same numbers and same layout as every style; see
[report-styles](../report-styles/SKILL.md).

**Not IBCS-compliant.** It keeps a core of the IBCS notation (scenarios, variances with impact colours, N/A,
same unit same scale) and relaxes the IBCS rules listed below. Where IBCS compliance is required, use
[style-ibcs](../style-ibcs/SKILL.md), and offer this style as an additional view.

## Choose it when

- the numbers are published to employees: intranet stories, newsletters, town-hall slides;
- the page has one story to tell and the reader will not explore it.

Not for analysis or monthly control (IBCS), not for a product dashboard (Showcase), not for the annual report
(Annual).

## What it looks like

Light: ink on an off-white page; dark: warm black. No boxes: hairline rules separate the figure strip and the
charts. The key message as a 32 px serif headline (Source Serif 4), text and figures in Source Sans 3, a small
navy tag before the title. Month chart: AC as a thick ink line and PY as a grey line on faint gridlines labelled
on the right, the largest gain and the weakest point annotated with leader lines (SA 4.5), and a Δ% row under the axis.
Regions: a ruled table, bar = AC, tick = PY, the region named in the headline marked.

## What it relaxes (exact wording in the token file)

- **SI 1.2** an off-white paper page with hairline rules instead of white cards; **SI 2.3** a serif headline;
  **CO 1.1** large headline and figures, a big number only where it carries what the headline lacks; **SI 3.1** faint gridlines with values only at the line ends, in the annotations
  and in the Δ% row; **CO 1.3** at most three visuals a page; **CH 4.1** the line chart keeps its own scale
  (labelled gridlines from zero), the table's bars share one.

**Requirement, not a relaxation:** every annotation is tied to its point by a visible leader line.
**Banned:** pie, ring, gauge, funnel, radar, traffic light, pseudo-3D, waffle, pictogram, area-scaled icons,
truncated axes. A share of a whole is a 100 % stacked bar with labels.

## Assets

- `assets/graphic.tokens.json` — DTCG export.
- `assets/DESIGN.md` — the style as a [DESIGN.md](https://github.com/google-labs-code/design.md), for any agent or design tool that reads one.
- `assets/power-bi/graphic-pbi-theme-<light|dark>[-cvd].json` — report themes (Georgia titles: Power BI has no
  web fonts).
- `assets/deneb/graphic-<light|dark>.overrides.json` — for the `ibcs-deneb` sync script
  ([power-bi.md](../report-styles/references/power-bi.md)).
- Web: `<StyleProvider styles={["graphic"]}>`.

`ibcs_lint.py theme` reports, as expected: the off-white or dark background (SI 1.2), serif title classes
(SI 2.3) and default gridlines (SI 3.1).
