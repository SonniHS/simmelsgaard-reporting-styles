---
version: alpha
name: "IBCS · for the CFO"
description: "Notation first: white paper, scenario patterns, dense pages, no decoration. The reference every other style reconciles to."
colors:
  primary: "#404040"
  secondary: "#595959"
  tertiary: "#1F6FD1"
  neutral: "#F4F5F7"
  surface: "#FFFFFF"
  surface-tile: "#FFFFFF"
  on-surface: "#000000"
  on-primary: "#FFFFFF"
  outline: "#E3E5E8"
  error: "#D42A20"
  scenario-ac: "#404040"
  scenario-py: "#A6A6A6"
  scenario-pl: "#404040"
  scenario-fc: "#404040"
  impact-good: "#3F9C35"
  impact-bad: "#D42A20"
  impact-neutral: "#1F6FD1"
  impact-good-cvd: "#008E96"
  chart-axis: "#404040"
  chart-grid: "transparent"
  chart-label: "#000000"
  dark-primary: "#D9D9D9"
  dark-secondary: "#A6A6A6"
  dark-tertiary: "#4D8DFF"
  dark-neutral: "#1E1E1E"
  dark-surface: "#262626"
  dark-surface-tile: "#262626"
  dark-on-surface: "#EDEDED"
  dark-on-primary: "#1E1E1E"
  dark-outline: "#333333"
  dark-error: "#FF4D4D"
  dark-scenario-ac: "#D9D9D9"
  dark-scenario-py: "#7F7F7F"
  dark-scenario-pl: "#D9D9D9"
  dark-scenario-fc: "#D9D9D9"
  dark-impact-good: "#9CCB19"
  dark-impact-bad: "#FF4D4D"
  dark-impact-neutral: "#4D8DFF"
  dark-impact-good-cvd: "#1FB5BE"
  dark-chart-axis: "#D9D9D9"
  dark-chart-grid: "transparent"
  dark-chart-label: "#EDEDED"
typography:
  headline-display:
    fontFamily: "system-ui"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.15
  headline-md:
    fontFamily: "system-ui"
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.3
  title-md:
    fontFamily: "system-ui"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.3
  body-md:
    fontFamily: "system-ui"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "system-ui"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
  label-sm:
    fontFamily: "system-ui"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
  figure-lg:
    fontFamily: "system-ui"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.1
  figure-md:
    fontFamily: "system-ui"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
rounded:
  hero: 8px
  panel: 8px
  tile: 8px
  control: 6px
  mark: 0px
spacing:
  gap: 16px
  pad: 16px
  tiles-per-row: 4
  max-visuals: 8
components:
  kpi-tile:
    backgroundColor: "{colors.surface-tile}"
    textColor: "{colors.on-surface}"
    typography: "{typography.figure-lg}"
    rounded: "{rounded.tile}"
    padding: "16px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title-md}"
    rounded: "{rounded.panel}"
    padding: "16px"
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

# IBCS · for the CFO

<!-- Generated by report-styles/scripts/build_styles.py from assets/tokens/ibcs.json; do not edit. -->

## Overview

Notation first: white paper, scenario patterns, dense pages, no decoration. The reference every other style reconciles to.

**The only report style that follows the IBCS® Standards.** Every other style reconciles to it.

Every style draws the same report page: a key message, four KPI tiles, a time card and a structure card, in the same order and the same columns. Only the look changes; the numbers, their positions and the notation rules do not.

## Colors

Tokens without a prefix are the light theme (the default for print and documents); `dark-*` is the dark theme. Text reaches WCAG AA on every surface it sits on, checked by the build.

- **Primary (#404040):** the accent for the selected switch and focus; never a data colour.
- **Neutral (#F4F5F7) and Surface (#FFFFFF):** the page and the cards.
- **Scenario AC (#404040) and PY (#A6A6A6):** actuals solid and strong, previous year lighter. PL is outlined and FC hatched in the same ink; scenarios are told apart by pattern, not hue.
- **Impact good (#3F9C35), bad (#D42A20), neutral (#1F6FD1):** the tone of a variance only. `impact-good-cvd` (#008E96) replaces green in the colour-vision mode.
- **Dark:** page #1E1E1E, AC #D9D9D9, PY #7F7F7F.

## Typography

Text in system-ui, headings in system-ui, figures in system-ui with tabular numerals, so columns of numbers align. The key message is 17 px; KPI values 24 px; chart labels 12 px.

## Layout

4 KPI tiles per row, then the time card and the structure card side by side from 1024 px and stacked below it (time first). Gap 16 px, card padding 16 px, at most 8 visuals on a page. No horizontal scroll at any width.

## Elevation & Depth

Flat. Hierarchy comes from the page and card tones and from type weight, not from shadows.

## Shapes

Corner radii: key message 8 px, cards 8 px, tiles 8 px, controls 6 px, chart marks 0 px.

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
- Don't use these chart types: pie, ring/donut, gauge, funnel, radar, traffic light, 3-D, waffle, pictogram.
- Don't use the accent or a second hue to tell series apart.

Where the app around the report departs from the IBCS rules (the notation itself does not):

- **SI 2.1:** Cards with rounded corners and a light grey page, for UI chrome only; no frames inside charts or tables. App chrome only; notation inside charts and tables stays IBCS.
- **SI 1.2:** A dark theme (charcoal page and cards) when the reader picks dark. Reader preference and dark app shells; the ibcs-dark derivation keeps the notation (AC solid, PY lighter, PL outlined, FC hatched) and the impact hue families. Condition: Light is the default for print and for anything shared as a document.
