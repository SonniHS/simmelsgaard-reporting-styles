# Changelog

All notable changes to this marketplace and its plugin. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.2.0] - 2026-10-23

### Added
- Style **Annual · for Investors** (`style-annual`): the key-figures spread of an annual report — a tinted message
  band, light-weight numerals, AC columns and bars with a PY marker line, numbered callouts; aubergine and gold.
- Style **Wallboard · for Operations** (`style-wallboard`): a screen read from a few metres — very large figures,
  high contrast, thick columns and bars, variances as large chips, few labels; usually shown dark.
- Both in light and dark with colour-blind-safe sets, Power BI themes, Deneb overrides, DTCG tokens, documented
  relaxations, and covered by the reconcile, same-scale, layout and browser checks.

## [1.1.0] - 2026-10-23

### Added
- IBCS Power BI assets for light too (`ibcs-pbi-theme-light.json`, `-light-cvd`, `ibcs-light.overrides.json`), in the
  web style's screen-tuned colours: every style now has all four themes and both overrides files in this repository.

### Changed
- IBCS structure card: when the names leave too little room, they move onto their own line above the bars before
  any column is dropped, so the absolute ΔPY column stays on narrower cards. On phones the names always sit above
  the bars, and long names are no longer shortened.
- Soft structure card on phones: names above the bars, so the bars use the full width and, at the shared scale
  (CH 4.1), the time chart above gets a readable height.

## [1.0.0] - 2026-10-23

### Added
- Plugin `report-styles` with the skills `report-styles`, `style-ibcs`, `style-showcase`, `style-soft` and
  `style-graphic`: four presentation styles for IBCS-based reports (IBCS for the CFO, Showcase for Marketing, Soft
  for HR / People, Graphic for Communication), each in light and dark, with a colour-blind-safe set.
- One page layout for every style (header, key message, four KPI tiles, time card, structure card, footer) and one
  view model, so every style shows the same numbers in the same places.
- A style switch (`style=`, pre-select one or offer several, per-app labels) and a theme switch (`theme=`, following
  the system until the reader picks; print always light), both keyboard-accessible.
- Same unit, same scale on every page (IBCS CH 4.1): one scale registry, measured in the browser.
- Token contract (JSON Schema) and `build_styles.py`: contrast, impact-colour and notation guardrails in both modes;
  generates TypeScript and CSS tokens, DTCG exports, Power BI themes (light, dark, CVD) and overrides for the
  ibcs-deneb templates.
- Tested React 18 + SVG reference components with self-hosted OFL fonts, a preview app and `check-previews.mjs`
  (reconcile, layout, scale, label collisions, fonts, themes, keyboard), usable on any built app.
- Input for any key-figures page: KPI kinds `amount`, `count`, `rate`, `score`; polarity per measure; a totals check.
- Docs: getting started, choosing a style, gallery, web apps, Power BI, testing, troubleshooting, design.
