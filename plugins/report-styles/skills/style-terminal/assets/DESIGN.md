---
version: alpha
name: "Terminal · for Engineering"
description: "A command-line page: a monospace typeface, 1 px box borders, compact tables, plain-text variances, an amber accent; dark-first."
colors:
  primary: "#8C5A00"
  secondary: "#545A62"
  tertiary: "#8C5A00"
  neutral: "#FAFAF7"
  surface: "#FAFAF7"
  surface-tile: "#FAFAF7"
  on-surface: "#1C1E21"
  on-primary: "#FFFFFF"
  outline: "#C9CCC4"
  error: "#C42B2B"
  scenario-ac: "#1C1E21"
  scenario-py: "#AEB3B9"
  scenario-pl: "#1C1E21"
  scenario-fc: "#1C1E21"
  impact-good: "#1D7A3A"
  impact-bad: "#C42B2B"
  impact-neutral: "#1E62C8"
  impact-good-cvd: "#0B7686"
  chart-axis: "#1C1E21"
  chart-grid: "transparent"
  chart-label: "#1C1E21"
  dark-primary: "#E8B04A"
  dark-secondary: "#9AA2AC"
  dark-tertiary: "#E8B04A"
  dark-neutral: "#0E1013"
  dark-surface: "#0E1013"
  dark-surface-tile: "#0E1013"
  dark-on-surface: "#E3E6EA"
  dark-on-primary: "#0E1013"
  dark-outline: "#2E333A"
  dark-error: "#F2625A"
  dark-scenario-ac: "#E3E6EA"
  dark-scenario-py: "#4C535C"
  dark-scenario-pl: "#E3E6EA"
  dark-scenario-fc: "#E3E6EA"
  dark-impact-good: "#4CC46B"
  dark-impact-bad: "#F2625A"
  dark-impact-neutral: "#63A6F7"
  dark-impact-good-cvd: "#3FC3CE"
  dark-chart-axis: "#9AA2AC"
  dark-chart-grid: "transparent"
  dark-chart-label: "#E3E6EA"
typography:
  headline-display:
    fontFamily: "JetBrains Mono"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.15
  headline-md:
    fontFamily: "JetBrains Mono"
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.3
  title-md:
    fontFamily: "JetBrains Mono"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.3
  body-md:
    fontFamily: "JetBrains Mono"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "JetBrains Mono"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
  label-sm:
    fontFamily: "JetBrains Mono"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
  figure-lg:
    fontFamily: "JetBrains Mono"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.1
  figure-md:
    fontFamily: "JetBrains Mono"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
rounded:
  hero: 0px
  panel: 0px
  tile: 0px
  control: 0px
  mark: 0px
spacing:
  gap: 12px
  pad: 14px
  tiles-per-row: 4
  max-visuals: 6
components:
  kpi-tile:
    backgroundColor: "{colors.surface-tile}"
    textColor: "{colors.on-surface}"
    typography: "{typography.figure-lg}"
    rounded: "{rounded.tile}"
    padding: "14px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title-md}"
    rounded: "{rounded.panel}"
    padding: "14px"
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

# Terminal · for Engineering

<!-- Generated by report-styles/scripts/build_styles.py from assets/tokens/terminal.json; do not edit. -->

## Overview

A command-line page: a monospace typeface, 1 px box borders, compact tables, plain-text variances, an amber accent; dark-first.

**Not IBCS-compliant.** It keeps a core of the IBCS® notation (scenarios, variances with impact colours, N/A, same unit same scale) and relaxes the rules listed under Do's and Don'ts. Where IBCS compliance is required, use the IBCS style.

Every style draws the same report page: a key message, four KPI tiles, a time card and a structure card, in the same order and the same columns. Only the look changes; the numbers, their positions and the notation rules do not.

## Colors

Tokens without a prefix are the light theme (the default for print and documents); `dark-*` is the dark theme. Text reaches WCAG AA on every surface it sits on, checked by the build.

- **Primary (#8C5A00):** the accent for the selected switch and focus; never a data colour.
- **Neutral (#FAFAF7) and Surface (#FAFAF7):** the page and the cards.
- **Scenario AC (#1C1E21) and PY (#AEB3B9):** actuals solid and strong, previous year lighter. PL is outlined and FC hatched in the same ink; scenarios are told apart by pattern, not hue.
- **Impact good (#1D7A3A), bad (#C42B2B), neutral (#1E62C8):** the tone of a variance only. `impact-good-cvd` (#0B7686) replaces green in the colour-vision mode.
- **Dark:** page #0E1013, AC #E3E6EA, PY #4C535C.

## Typography

Text in JetBrains Mono, headings in JetBrains Mono, figures in JetBrains Mono with tabular numerals, so columns of numbers align. The key message is 17 px; KPI values 28 px; chart labels 12 px.

## Layout

4 KPI tiles per row, then the time card and the structure card side by side from 1024 px and stacked below it (time first). Gap 12 px, card padding 14 px, at most 6 visuals on a page. No horizontal scroll at any width.

## Elevation & Depth

Flat. Hierarchy comes from the page and card tones and from type weight, not from shadows.

## Shapes

Corner radii: key message 0 px, cards 0 px, tiles 0 px, controls 0 px, chart marks 0 px.

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

- **SI 2.3:** A monospace typeface (JetBrains Mono) for all text and figures. The familiar look of logs and terminals for engineering teams; monospace keeps figures aligned in tables.
- **SI 2.1:** 1 px box borders around tiles and cards, no radius. The boxed look of a terminal dashboard; chrome only.
- **SI 1.2:** A dark page in dark mode with an amber accent for the switch and focus. Engineering screens are mostly dark; the accent is never green or red and never encodes data. Condition: Print is always light.
