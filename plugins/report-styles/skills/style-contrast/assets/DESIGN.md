---
version: alpha
name: "Contrast · for Accessibility"
description: "Maximum legibility: black on white (or white on black), AAA contrast, a typeface designed for low vision, strong borders, and every variance carrying a direction glyph as well as its colour."
colors:
  primary: "#000000"
  secondary: "#333333"
  tertiary: "#0040A0"
  neutral: "#FFFFFF"
  surface: "#FFFFFF"
  surface-tile: "#FFFFFF"
  on-surface: "#000000"
  on-primary: "#FFFFFF"
  outline: "#000000"
  error: "#B0001A"
  scenario-ac: "#000000"
  scenario-py: "#707070"
  scenario-pl: "#000000"
  scenario-fc: "#000000"
  impact-good: "#00702E"
  impact-bad: "#B0001A"
  impact-neutral: "#0040A0"
  impact-good-cvd: "#006475"
  chart-axis: "#000000"
  chart-grid: "transparent"
  chart-label: "#000000"
  dark-primary: "#FFFFFF"
  dark-secondary: "#D6D6D6"
  dark-tertiary: "#FFD60A"
  dark-neutral: "#000000"
  dark-surface: "#000000"
  dark-surface-tile: "#000000"
  dark-on-surface: "#FFFFFF"
  dark-on-primary: "#000000"
  dark-outline: "#FFFFFF"
  dark-error: "#FF8A8A"
  dark-scenario-ac: "#FFFFFF"
  dark-scenario-py: "#9A9A9A"
  dark-scenario-pl: "#FFFFFF"
  dark-scenario-fc: "#FFFFFF"
  dark-impact-good: "#5BE38F"
  dark-impact-bad: "#FF8A8A"
  dark-impact-neutral: "#8EC2FF"
  dark-impact-good-cvd: "#5CDCEB"
  dark-chart-axis: "#FFFFFF"
  dark-chart-grid: "transparent"
  dark-chart-label: "#FFFFFF"
typography:
  headline-display:
    fontFamily: "Atkinson Hyperlegible"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
  headline-md:
    fontFamily: "Atkinson Hyperlegible"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.3
  title-md:
    fontFamily: "Atkinson Hyperlegible"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.3
  body-md:
    fontFamily: "Atkinson Hyperlegible"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Atkinson Hyperlegible"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.35
  label-sm:
    fontFamily: "Atkinson Hyperlegible"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.35
  figure-lg:
    fontFamily: "Atkinson Hyperlegible"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.1
  figure-md:
    fontFamily: "Atkinson Hyperlegible"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.35
rounded:
  hero: 4px
  panel: 4px
  tile: 4px
  control: 4px
  mark: 0px
spacing:
  gap: 20px
  pad: 20px
  tiles-per-row: 4
  max-visuals: 4
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

# Contrast · for Accessibility

<!-- Generated by report-styles/scripts/build_styles.py from assets/tokens/contrast.json; do not edit. -->

## Overview

Maximum legibility: black on white (or white on black), AAA contrast, a typeface designed for low vision, strong borders, and every variance carrying a direction glyph as well as its colour.

**Not IBCS-compliant.** It keeps a core of the IBCS® notation (scenarios, variances with impact colours, N/A, same unit same scale) and relaxes the rules listed under Do's and Don'ts. Where IBCS compliance is required, use the IBCS style.

Every style draws the same report page: a key message, four KPI tiles, a time card and a structure card, in the same order and the same columns. Only the look changes; the numbers, their positions and the notation rules do not.

## Colors

Tokens without a prefix are the light theme (the default for print and documents); `dark-*` is the dark theme. Text reaches WCAG AAA on every surface it sits on, checked by the build.

- **Primary (#000000):** the accent for the selected switch and focus; never a data colour.
- **Neutral (#FFFFFF) and Surface (#FFFFFF):** the page and the cards.
- **Scenario AC (#000000) and PY (#707070):** actuals solid and strong, previous year lighter. PL is outlined and FC hatched in the same ink; scenarios are told apart by pattern, not hue.
- **Impact good (#00702E), bad (#B0001A), neutral (#0040A0):** the tone of a variance only. `impact-good-cvd` (#006475) replaces green in the colour-vision mode.
- **Dark:** page #000000, AC #FFFFFF, PY #9A9A9A.

## Typography

Text in Atkinson Hyperlegible, headings in Atkinson Hyperlegible, figures in Atkinson Hyperlegible with tabular numerals, so columns of numbers align. The key message is 22 px; KPI values 36 px; chart labels 15 px.

## Layout

4 KPI tiles per row, then the time card and the structure card side by side from 1024 px and stacked below it (time first). Gap 20 px, card padding 20 px, at most 4 visuals on a page. No horizontal scroll at any width.

## Elevation & Depth

Flat. Hierarchy comes from the page and card tones and from type weight, not from shadows.

## Shapes

Corner radii: key message 4 px, cards 4 px, tiles 4 px, controls 4 px, chart marks 0 px.

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
- Don't use these chart types: pie, ring/donut, gauge, funnel, radar, traffic light, 3-D, waffle, pictogram, area-scaled-icons, truncated-axis.
- Don't use the accent or a second hue to tell series apart.

Where this style departs from the IBCS rules:

- **SI 2.1:** 2 px borders around tiles and cards. Clear boundaries for low vision and for screen magnifiers, where only part of the page is visible.
- **SI 2.3:** Atkinson Hyperlegible, a typeface designed for low-vision readers, at larger sizes. Distinct letterforms (1/l/I, 0/O, 5/S) and generous spacing improve legibility.
- **CO 1.1:** Larger text: body 17 px, labels 15 px, figures 36 px. Readable without zooming; still fits 390 px.
- **UN 4.1:** Every variance label carries a direction glyph (▲ ▼) next to its colour. Colour is never the only cue (WCAG 1.4.1); the glyph follows the sign, the colour the impact. Condition: The glyph follows the sign, never the tone; a variance shown as zero has no glyph and no colour.
- **SI 1.2:** A dark theme of white on pure black when the reader picks dark. Many low-vision readers need inverted contrast; the notation and the impact hue families are kept at AAA contrast. Condition: Print is always light.
