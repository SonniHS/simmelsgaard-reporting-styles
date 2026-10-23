---
name: style-wallboard
description: >
  The Wallboard report style ("Wallboard · for Operations") — a glanceable screen read from a few metres, for a
  control room, a shop floor, a contact centre or a team TV, usually dark. Use it when report numbers go on a wall
  display or a large shared screen, when someone asks for a "TV dashboard", "wallboard", "control room" or
  "big-screen" version of a report page, or when the readers glance rather than analyse. Says when to choose it,
  what it looks like (very large figures, high contrast, thick columns and bars, variances as large coloured
  chips, few labels), what it relaxes with rule ids, and where its tokens, Power BI themes and Deneb overrides are.
---

# Wallboard · for Operations

A screen people glance at from across the room: very large figures, high contrast, thick marks and few words. The
IBCS notation stays (AC solid in front, PY lighter behind), and the numbers and the layout are the same as in every
style; see [report-styles](../report-styles/SKILL.md).

**Not IBCS-compliant.** It keeps a core of the IBCS notation (scenarios, variances with impact colours, N/A,
same unit same scale) and relaxes the IBCS rules listed below. Where IBCS compliance is required, use
[style-ibcs](../style-ibcs/SKILL.md), and offer this style as an additional view.

## Choose it when

- the page runs on a wall display, a large monitor in a shared space, or a team TV;
- the readers check status in seconds: operations, a contact centre, a warehouse, a shift team.

Set the app's default theme to dark for screens in lit rooms (`<StyleProvider theme="dark">`); readers can still
switch. Not for reading at a desk (IBCS, Soft) or for print (Annual, IBCS).

## What it looks like

Dark: near-black page, slate tiles, white actuals, bright impact colours. Light: grey page, white tiles, black
actuals. Inter at heavy weights: KPI values 56 px, labels 15–16 px, the message 24 px bold. Time card: thick AC
columns in front of lighter PY columns, AC values on top, a large ΔPY% row. Structure card: thick AC bars with a thin
PY bar beneath, values at the bar end, ΔPY% as tinted chips at the right. No gridlines, no motion.

## What it relaxes (exact wording in the token file)

- **SI 1.2** a contrasting page (grey; dark: near-black with slate panels); **CO 1.1** very large type for
  reading from a few metres; **SI 2.1** tiles and cards with a 6 px radius on a
  contrasting page (chrome only); **CO 2.2** fewer labels — AC values and the ΔPY% row, no PY value labels (PY stays
  as the reference column and in the KPI tiles; every value of the shared set is still printed); **CO 1.3** at most
  three visuals a page.

**Banned:** pie, ring, gauge, funnel, radar, traffic light, pseudo-3D, waffle, pictogram, truncated axes.

## Assets

- `assets/wallboard.tokens.json` — DTCG export.
- `assets/power-bi/wallboard-pbi-theme-<light|dark>[-cvd].json` — report themes (Segoe UI Semibold/Black).
- `assets/deneb/wallboard-<light|dark>.overrides.json` — for the `ibcs-deneb` sync script
  ([power-bi.md](../report-styles/references/power-bi.md)).
- Web: `<StyleProvider styles={["wallboard"]} theme="dark">`.

`ibcs_lint.py theme` reports, as expected: the non-white page and the visual backgrounds (SI 1.2).
