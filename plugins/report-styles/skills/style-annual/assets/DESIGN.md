---
version: alpha
name: "Annual · for Investors"
description: "An annual-report spread: a tinted message band, light-weight numerals, AC columns and bars with a PY marker line, numbered callouts, generous space."
colors:
  primary: "#4B2A63"
  secondary: "#5A5166"
  tertiary: "#B8862B"
  neutral: "#FFFFFF"
  surface: "#F4F1F7"
  surface-tile: "#FFFFFF"
  on-surface: "#231B2E"
  on-primary: "#FFFFFF"
  outline: "#E4DFEA"
  error: "#BE3A2E"
  scenario-ac: "#4B2A63"
  scenario-py: "#CFC6DA"
  scenario-pl: "#4B2A63"
  scenario-fc: "#4B2A63"
  impact-good: "#2A8550"
  impact-bad: "#BE3A2E"
  impact-neutral: "#3365B8"
  impact-good-cvd: "#0E7F8F"
  chart-axis: "#231B2E"
  chart-grid: "transparent"
  chart-label: "#231B2E"
  dark-primary: "#CDB6E6"
  dark-secondary: "#B2A8BF"
  dark-tertiary: "#E3B25A"
  dark-neutral: "#17131D"
  dark-surface: "#221C2B"
  dark-surface-tile: "#17131D"
  dark-on-surface: "#F0EBF5"
  dark-on-primary: "#17131D"
  dark-outline: "#352C41"
  dark-error: "#F17A6C"
  dark-scenario-ac: "#CDB6E6"
  dark-scenario-py: "#5A4D6A"
  dark-scenario-pl: "#CDB6E6"
  dark-scenario-fc: "#CDB6E6"
  dark-impact-good: "#5FC487"
  dark-impact-bad: "#F17A6C"
  dark-impact-neutral: "#7EA6F0"
  dark-impact-good-cvd: "#4CC2D0"
  dark-chart-axis: "#F0EBF5"
  dark-chart-grid: "transparent"
  dark-chart-label: "#F0EBF5"
typography:
  headline-display:
    fontFamily: "Manrope"
    fontSize: 44px
    fontWeight: 300
    lineHeight: 1.15
  headline-md:
    fontFamily: "Manrope"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.3
  title-md:
    fontFamily: "Manrope"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.3
  body-md:
    fontFamily: "Manrope"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Manrope"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.35
  label-sm:
    fontFamily: "Manrope"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
  figure-lg:
    fontFamily: "Manrope"
    fontSize: 44px
    fontWeight: 300
    lineHeight: 1.1
  figure-md:
    fontFamily: "Manrope"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.35
rounded:
  hero: 4px
  panel: 4px
  tile: 4px
  control: 4px
  mark: 0px
spacing:
  gap: 32px
  pad: 28px
  tiles-per-row: 4
  max-visuals: 3
components:
  kpi-tile:
    backgroundColor: "{colors.surface-tile}"
    textColor: "{colors.on-surface}"
    typography: "{typography.figure-lg}"
    rounded: "{rounded.tile}"
    padding: "28px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title-md}"
    rounded: "{rounded.panel}"
    padding: "28px"
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

# Annual · for Investors

<!-- Generated by report-styles/scripts/build_styles.py from assets/tokens/annual.json; do not edit. -->

## Overview

An annual-report spread: a tinted message band, light-weight numerals, AC columns and bars with a PY marker line, numbered callouts, generous space.

**Not IBCS-compliant.** It keeps a core of the IBCS® notation (scenarios, variances with impact colours, N/A, same unit same scale) and relaxes the rules listed under Do's and Don'ts. Where IBCS compliance is required, use the IBCS style.

Every style draws the same report page: a key message, four KPI tiles, a time card and a structure card, in the same order and the same columns. Only the look changes; the numbers, their positions and the notation rules do not.

## Colors

Tokens without a prefix are the light theme (the default for print and documents); `dark-*` is the dark theme. Text reaches WCAG AA on every surface it sits on, checked by the build.

- **Primary (#4B2A63):** the accent for the selected switch and focus; never a data colour.
- **Neutral (#FFFFFF) and Surface (#F4F1F7):** the page and the cards.
- **Scenario AC (#4B2A63) and PY (#CFC6DA):** actuals solid and strong, previous year lighter. PL is outlined and FC hatched in the same ink; scenarios are told apart by pattern, not hue.
- **Impact good (#2A8550), bad (#BE3A2E), neutral (#3365B8):** the tone of a variance only. `impact-good-cvd` (#0E7F8F) replaces green in the colour-vision mode.
- **Dark:** page #17131D, AC #CDB6E6, PY #5A4D6A.

## Typography

Text in Manrope, headings in Manrope, figures in Manrope with tabular numerals, so columns of numbers align. The key message is 22 px; KPI values 44 px; chart labels 13 px.

## Layout

4 KPI tiles per row, then the time card and the structure card side by side from 1024 px and stacked below it (time first). Gap 32 px, card padding 28 px, at most 3 visuals on a page. No horizontal scroll at any width.

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

- **SI 1.2:** A tinted band behind the key message and white (dark: plum) panels without boxes. The annual-report cover gesture: one focal point per page. Condition: The tint is the brand surface, never green or red, and never encodes data.
- **SI 2.3:** Light-weight display numerals (44 px) for the KPI values. The calm, generous voice of an annual report; labels and variances stay regular weight.
- **CO 1.1:** Large KPI figures and message. Read in print and on screens at a distance.
- **UN 3.2:** PY drawn as a marker line across the AC column or bar, not as a second column or bar. One solid shape per category reads calmer; the marker keeps the comparison exact. Condition: AC stays solid, PY the marker; both are named in the legend.
- **SI 2.2:** AC in the aubergine brand colour instead of a neutral dark grey. The brand carries the report; the colour is far from every impact hue and AC stays clearly stronger than PY (checked).
- **CO 1.3:** At most 3 visuals a page. One message per spread; detail lives in the IBCS page.
