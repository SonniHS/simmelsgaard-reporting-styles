# Changelog

All notable changes to this marketplace and its plugin. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned
- IBCS structure card: keep the absolute ΔPY column on narrower cards (tighter label sizing before dropping it).
- Soft on a phone: a taller shared plot height when the cards stack, so a short time chart stays readable at the
  shared scale.

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
