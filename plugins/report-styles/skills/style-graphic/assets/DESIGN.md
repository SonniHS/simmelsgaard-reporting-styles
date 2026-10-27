---
version: alpha
name: "Graphic · for Communication"
description: "A newspaper data page: the key message as a serif headline, a ruled strip of four figures, a line chart with two annotations, a ruled table with inline bars."
colors:
  primary: "#27466F"
  secondary: "#5C5850"
  tertiary: "#B9781A"
  neutral: "#FBFAF7"
  surface: "#FBFAF7"
  surface-tile: "#FBFAF7"
  on-surface: "#1C1B19"
  on-primary: "#FFFFFF"
  outline: "#D8D3C9"
  error: "#B8322A"
  scenario-ac: "#1C1B19"
  scenario-py: "#ABA597"
  scenario-pl: "#1C1B19"
  scenario-fc: "#1C1B19"
  impact-good: "#2C7D4E"
  impact-bad: "#B8322A"
  impact-neutral: "#2F5FA8"
  impact-good-cvd: "#0F7A8A"
  chart-axis: "#1C1B19"
  chart-grid: "#E7E3DA"
  chart-label: "#1C1B19"
  dark-primary: "#A9C0E8"
  dark-secondary: "#A9A398"
  dark-tertiary: "#E2A445"
  dark-neutral: "#151513"
  dark-surface: "#151513"
  dark-surface-tile: "#151513"
  dark-on-surface: "#ECE9E2"
  dark-on-primary: "#151513"
  dark-outline: "#3A3833"
  dark-error: "#EE7468"
  dark-scenario-ac: "#ECE9E2"
  dark-scenario-py: "#6E6A62"
  dark-scenario-pl: "#ECE9E2"
  dark-scenario-fc: "#ECE9E2"
  dark-impact-good: "#62BE86"
  dark-impact-bad: "#EE7468"
  dark-impact-neutral: "#7AA5EE"
  dark-impact-good-cvd: "#4DC1CE"
  dark-chart-axis: "#ECE9E2"
  dark-chart-grid: "#2A2926"
  dark-chart-label: "#ECE9E2"
typography:
  headline-display:
    fontFamily: "Source Serif 4"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.15
  headline-md:
    fontFamily: "Source Serif 4"
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.3
  title-md:
    fontFamily: "Source Serif 4"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: "Source Sans 3"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Source Sans 3"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.35
  label-sm:
    fontFamily: "Source Sans 3"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
  figure-lg:
    fontFamily: "Source Sans 3"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.1
  figure-md:
    fontFamily: "Source Sans 3"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.35
rounded:
  hero: 0px
  panel: 0px
  tile: 0px
  control: 2px
  mark: 0px
spacing:
  gap: 28px
  pad: 0px
  tiles-per-row: 4
  max-visuals: 3
components:
  kpi-tile:
    backgroundColor: "{colors.surface-tile}"
    textColor: "{colors.on-surface}"
    typography: "{typography.figure-lg}"
    rounded: "{rounded.tile}"
    padding: "0px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title-md}"
    rounded: "{rounded.panel}"
    padding: "0px"
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

# Graphic · for Communication

<!-- Generated by report-styles/scripts/build_styles.py from assets/tokens/graphic.json; do not edit. -->

## Overview

A newspaper data page: the key message as a serif headline, a ruled strip of four figures, a line chart with two annotations, a ruled table with inline bars.

**Not IBCS-compliant.** It keeps a core of the IBCS® notation (scenarios, variances with impact colours, N/A, same unit same scale) and relaxes the rules listed under Do's and Don'ts. Where IBCS compliance is required, use the IBCS style.

Every style draws the same report page: a key message, four KPI tiles, a time card and a structure card, in the same order and the same columns. Only the look changes; the numbers, their positions and the notation rules do not.

## Colors

Tokens without a prefix are the light theme (the default for print and documents); `dark-*` is the dark theme. Text reaches WCAG AA on every surface it sits on, checked by the build.

- **Primary (#27466F):** the accent for the selected switch and focus; never a data colour.
- **Neutral (#FBFAF7) and Surface (transparent):** the page and the cards.
- **Scenario AC (#1C1B19) and PY (#ABA597):** actuals solid and strong, previous year lighter. PL is outlined and FC hatched in the same ink; scenarios are told apart by pattern, not hue.
- **Impact good (#2C7D4E), bad (#B8322A), neutral (#2F5FA8):** the tone of a variance only. `impact-good-cvd` (#0F7A8A) replaces green in the colour-vision mode.
- **Dark:** page #151513, AC #ECE9E2, PY #6E6A62.

## Typography

Text in Source Sans 3, headings in Source Serif 4, figures in Source Sans 3 with tabular numerals, so columns of numbers align. The key message is 32 px; KPI values 34 px; chart labels 13 px.

## Layout

4 KPI tiles per row, then the time card and the structure card side by side from 1024 px and stacked below it (time first). Gap 28 px, card padding 0 px, at most 3 visuals on a page. No horizontal scroll at any width.

## Elevation & Depth

Flat. Hierarchy comes from the page and card tones and from type weight, not from shadows.

## Shapes

Corner radii: key message 0 px, cards 0 px, tiles 0 px, controls 2 px, chart marks 0 px.

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
- Don't use these chart types: pie, ring/donut, gauge, funnel, radar, traffic light, 3-D, area-scaled-icons, truncated-axis, waffle, pictogram.
- Don't use the accent or a second hue to tell series apart.

Where this style departs from the IBCS rules:

- **SI 1.2:** An off-white paper page (dark: warm black) with hairline rules instead of white cards. The editorial look of a newspaper data page; charts and tables sit directly on the page.
- **SI 2.3:** A serif display face for the headline (the key message). Editorial voice; labels and figures stay in a plain sans with tabular figures.
- **CO 1.1:** The key message as a 32 px headline; figures 34 px. Read on intranet pages and in town-hall slides. Condition: A figure only where it carries something the headline lacks.
- **SI 3.1:** Faint horizontal gridlines on the line chart, value labels only at the line ends and in the annotations. Newspaper convention for a 12-point line; the reader reads levels off the grid. Condition: Gridlines or full data labels on a visual, never both.
- **CO 1.3:** At most 3 visuals a page. One story per page; detail lives in the IBCS page.
- **CH 4.1:** The line chart keeps its own value scale instead of one px per unit across the page. A line is read against its labelled gridlines, not by comparing lengths with the table's bars. Condition: Gridlines start at zero and are labelled; the table's inline bars share one scale among themselves; any further bars or columns of the same unit share it too.
