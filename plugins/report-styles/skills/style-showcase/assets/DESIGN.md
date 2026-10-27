---
version: alpha
name: "Showcase · for Marketing"
description: "Product-grade surfaces, quiet tiles, tight type, a line chart with a ΔPY% strip and a ranked dumbbell in the shared layout. Amber marks AC and the one highlight, nothing else."
colors:
  primary: "#111827"
  secondary: "#4B5565"
  tertiary: "#B7790A"
  neutral: "#F5F6F8"
  surface: "#FFFFFF"
  surface-tile: "#FFFFFF"
  on-surface: "#111827"
  on-primary: "#FFFFFF"
  outline: "#E2E6EC"
  error: "#C93C2C"
  scenario-ac: "#B7790A"
  scenario-py: "#B8BFCB"
  scenario-pl: "#B7790A"
  scenario-fc: "#B7790A"
  impact-good: "#1D8A58"
  impact-bad: "#C93C2C"
  impact-neutral: "#2E6BD3"
  impact-good-cvd: "#0B8396"
  chart-axis: "#C9CFD8"
  chart-grid: "#EEF0F3"
  chart-label: "#111827"
  dark-primary: "#E8ECF2"
  dark-secondary: "#9AA4B4"
  dark-tertiary: "#E9B44C"
  dark-neutral: "#0E131C"
  dark-surface: "#151B26"
  dark-surface-tile: "#151B26"
  dark-on-surface: "#E8ECF2"
  dark-on-primary: "#0E131C"
  dark-outline: "#232B38"
  dark-error: "#F2786A"
  dark-scenario-ac: "#E9B44C"
  dark-scenario-py: "#566174"
  dark-scenario-pl: "#E9B44C"
  dark-scenario-fc: "#E9B44C"
  dark-impact-good: "#4FC28D"
  dark-impact-bad: "#F2786A"
  dark-impact-neutral: "#6EA6FA"
  dark-impact-good-cvd: "#45C2D8"
  dark-chart-axis: "#3A4454"
  dark-chart-grid: "#1E2632"
  dark-chart-label: "#E8ECF2"
typography:
  headline-display:
    fontFamily: "Inter"
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.15
  headline-md:
    fontFamily: "Inter"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  title-md:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: "Inter"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Inter"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
  label-sm:
    fontFamily: "Inter"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
  figure-lg:
    fontFamily: "Inter"
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.1
  figure-md:
    fontFamily: "Inter"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
rounded:
  hero: 12px
  panel: 12px
  tile: 12px
  control: 8px
  mark: 2px
spacing:
  gap: 16px
  pad: 20px
  tiles-per-row: 4
  max-visuals: 5
components:
  kpi-tile:
    backgroundColor: "{colors.surface-tile}"
    textColor: "{colors.on-surface}"
    typography: "{typography.figure-lg}"
    rounded: "{rounded.tile}"
    padding: "20px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title-md}"
    rounded: "{rounded.panel}"
    padding: "20px"
  key-message:
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-md}"
    rounded: "{rounded.hero}"
  switch:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.control}"
  switch-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  mark-ac:
    backgroundColor: "{colors.scenario-ac}"
    rounded: "{rounded.mark}"
  mark-py:
    backgroundColor: "{colors.scenario-py}"
    rounded: "{rounded.mark}"
  variance-good:
    textColor: "{colors.impact-good}"
    typography: "{typography.figure-md}"
  variance-bad:
    textColor: "{colors.impact-bad}"
    typography: "{typography.figure-md}"
  variance-neutral:
    textColor: "{colors.impact-neutral}"
    typography: "{typography.figure-md}"
  variance-good-cvd:
    textColor: "{colors.impact-good-cvd}"
    typography: "{typography.figure-md}"
  variance-bad-cvd:
    textColor: "{colors.error}"
    typography: "{typography.figure-md}"
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  card-subtitle:
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
  divider:
    backgroundColor: "{colors.outline}"
    height: "1px"
  highlight:
    backgroundColor: "{colors.tertiary}"
    width: "3px"
  mark-pl:
    backgroundColor: "{colors.scenario-pl}"
    rounded: "{rounded.mark}"
  mark-fc:
    backgroundColor: "{colors.scenario-fc}"
    rounded: "{rounded.mark}"
  chart-axis:
    backgroundColor: "{colors.chart-axis}"
    height: "1px"
  chart-grid:
    backgroundColor: "{colors.chart-grid}"
    height: "1px"
  chart-label:
    textColor: "{colors.chart-label}"
    typography: "{typography.label-md}"
  kpi-tile-dark:
    backgroundColor: "{colors.dark-surface-tile}"
    textColor: "{colors.dark-on-surface}"
  card-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-on-surface}"
  key-message-dark:
    textColor: "{colors.dark-on-surface}"
  switch-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-on-surface}"
  switch-selected-dark:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-on-primary}"
  mark-ac-dark:
    backgroundColor: "{colors.dark-scenario-ac}"
  mark-py-dark:
    backgroundColor: "{colors.dark-scenario-py}"
  variance-good-dark:
    textColor: "{colors.dark-impact-good}"
  variance-bad-dark:
    textColor: "{colors.dark-impact-bad}"
  variance-neutral-dark:
    textColor: "{colors.dark-impact-neutral}"
  variance-good-cvd-dark:
    textColor: "{colors.dark-impact-good-cvd}"
  variance-bad-cvd-dark:
    textColor: "{colors.dark-error}"
  page-dark:
    backgroundColor: "{colors.dark-neutral}"
    textColor: "{colors.dark-on-surface}"
  card-subtitle-dark:
    textColor: "{colors.dark-secondary}"
  divider-dark:
    backgroundColor: "{colors.dark-outline}"
  highlight-dark:
    backgroundColor: "{colors.dark-tertiary}"
  mark-pl-dark:
    backgroundColor: "{colors.dark-scenario-pl}"
  mark-fc-dark:
    backgroundColor: "{colors.dark-scenario-fc}"
  chart-axis-dark:
    backgroundColor: "{colors.dark-chart-axis}"
  chart-grid-dark:
    backgroundColor: "{colors.dark-chart-grid}"
  chart-label-dark:
    textColor: "{colors.dark-chart-label}"
---

# Showcase · for Marketing

<!-- Generated by report-styles/scripts/build_styles.py from assets/tokens/showcase.json; do not edit. -->

## Overview

Product-grade surfaces, quiet tiles, tight type, a line chart with a ΔPY% strip and a ranked dumbbell in the shared layout. Amber marks AC and the one highlight, nothing else.

**Not IBCS-compliant.** It keeps a core of the IBCS® notation (scenarios, variances with impact colours, N/A, same unit same scale) and relaxes the rules listed under Do's and Don'ts. Where IBCS compliance is required, use the IBCS style.

Every style draws the same report page: a key message, four KPI tiles, a time card and a structure card, in the same order and the same columns. Only the look changes; the numbers, their positions and the notation rules do not.

## Colors

Tokens without a prefix are the light theme (the default for print and documents); `dark-*` is the dark theme. Text reaches WCAG AA on every surface it sits on, checked by the build.

- **Primary (#111827):** the accent for the selected switch and focus; never a data colour.
- **Neutral (#F5F6F8) and Surface (#FFFFFF):** the page and the cards.
- **Scenario AC (#B7790A) and PY (#B8BFCB):** actuals solid and strong, previous year lighter. PL is outlined and FC hatched in the same ink; scenarios are told apart by pattern, not hue.
- **Impact good (#1D8A58), bad (#C93C2C), neutral (#2E6BD3):** the tone of a variance only. `impact-good-cvd` (#0B8396) replaces green in the colour-vision mode.
- **Dark:** page #0E131C, AC #E9B44C, PY #566174.

## Typography

Text in Inter, headings in Inter, figures in Inter with tabular numerals, so columns of numbers align. The key message is 20 px; KPI values 26 px; chart labels 12 px.

## Layout

4 KPI tiles per row, then the time card and the structure card side by side from 1024 px and stacked below it (time first). Gap 16 px, card padding 20 px, at most 5 visuals on a page. No horizontal scroll at any width.

## Elevation & Depth

Flat. Hierarchy comes from the page and card tones and from type weight, not from shadows.

## Shapes

Corner radii: key message 12 px, cards 12 px, tiles 12 px, controls 8 px, chart marks 2 px.

## Components

- **kpi-tile:** label, AC value, PY, ΔPY and ΔPY%. The value shrinks to fit its tile and is never cut.
- **card:** a title, a subtitle naming unit and scenarios, then the chart.
- **mark-ac / mark-py:** columns and bars; all marks of one unit share one scale across the page.
- **variance-*:** a ΔPY or ΔPY% figure in its impact tone.
- **switch / switch-selected:** style and theme switches; the selection is shown by fill, not weight.
- **mark-pl / mark-fc:** plan outlined, forecast hatched, in the scenario ink.
- **chart-axis / chart-grid / chart-label:** the chart furniture; gridlines only where the style allows them.
- **…-dark:** every component again with the dark theme's colours.

## Do's and Don'ts

- Do write a relative variance against the signed reference; show N/A when the reference is zero, negative or rounds to less than half a unit.
- Do let polarity choose the tone only: a variance shown as zero has no colour and no sign.
- Do draw the same unit at the same scale everywhere on the page.
- Do keep every number on the page equal to the view model; every style shows the same set.
- Don't use these chart types: pie, gauge, funnel, radar, traffic light, waffle, pictogram.
- Don't use the accent or a second hue to tell series apart.

Where this style departs from the IBCS rules:

- **SI 1.2:** Brand surfaces: a navy page in dark mode, a cool grey page with white panels in light mode. Product feel; impact and scenario colours are tuned per mode and contrast-checked.
- **SI 2.1:** Solid panels and tiles with a hairline edge, one radius (12 px) everywhere. Chrome only; no glass, glow or gradient; chart marks carry no shade or 3D.
- **SI 2.3:** The key message set large (20 px) in the text face; figures semibold. One bold element per page; body and labels plain with tabular figures.
- **SI 3.1:** Faint horizontal gridlines on the line chart, values only at the line end and in the ΔPY% strip. A 12-point line reads against levels; labelling every point would crowd the hero chart. Condition: Gridlines or full data labels on a visual, never both.
- **SI 1.3:** One short entry fade per visual (240 ms). Presentation feel. Condition: Off under prefers-reduced-motion; motion never encodes data and never delays the numbers (final from the first frame, no count-up).
- **UN 3.2:** Scenarios by hue (amber = AC, slate = PY/reference) instead of fill pattern. The line chart reads AC against one reference; hue plus labels is clearer than patterns there. Condition: Hue separates AC from ONE reference only. Any further scenario keeps its IBCS fill (PL outlined, FC hatched or dashed), recognisable without labels; every scenario is labelled.
- **SI 2.1:** Bars3D: pseudo-3D bars, opt-in per visual. Requested for some marketing pages; kept strictly opt-in. Condition: Opt-in only; bar length stays linear from zero (CH 3.2: no volume comparison); never the default.
- **EX 2.1:** A share ring is not used unless the report's owner asks for it; a Ranking is the default for structure. A ring is weak for comparison (CH 3.1); available only on explicit request.
- **CH 4.1:** The line chart and the ranked dumbbell keep their own value scales instead of one px per unit across the page. A line is read against its labelled gridlines and a dumbbell by positions with every value printed, not by comparing lengths across charts. Condition: Gridlines start at zero and are labelled; every dumbbell value is printed; any bars or columns of the same unit on the page share one scale.
