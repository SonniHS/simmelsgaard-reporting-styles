---
name: style-soft
description: >
  The Soft report style ("Soft · for HR / People") — calm, warm, roomy and plain-spoken, for readers outside
  finance, in light or dark. Use it when a report or dashboard is for HR, people and culture, wellbeing,
  internal services or any audience that does not read IBCS notation daily, or when someone asks for a
  "friendlier", "softer", "less technical" or "easier to read" version of a finance page. Says when to choose
  it, what it keeps from IBCS (fills, impact colours, the same numbers) and what it relaxes with rule ids
  (rounded cards, larger text, gridlines instead of labels, fewer visuals), the plain-language wording, the
  share-of-whole rule (a 100 % stacked bar, no rings), and where its tokens, Power BI themes and Deneb
  overrides are.
---

# Soft · for HR / People

A warm page, rounded cards, calm colours, generous space, larger text and plain words. The IBCS fills stay
(AC solid, PY light, PL outlined, FC hatched), in a softer ink. Same numbers and same layout as every style;
see [report-styles](../report-styles/SKILL.md).

## Choose it when

- the readers are HR, people managers, employees, internal service teams, often on a phone;
- the page answers "how are we doing" for people who do not read variance notation daily.

Not for the finance pack (IBCS) or a marketing showcase (Showcase).

## What it looks like

Light: off-white page, white cards with one soft shadow. Dark: warm charcoal page, slightly lighter cards.
Nunito for headings and the message, Nunito Sans for text and figures, body 15 px, labels 13 px. Charts: rounded
columns (4 px, never on bars under 8 px) on faint gridlines, a "Change on last year, %" pin tier below; region
bars with tinted change pills. Words: "This year (AC)", "Last year (PY)", "Change", always with the abbreviation
nearby so finance readers can map it.

## What it relaxes (exact wording in the token file)

- **SI 1.2** warm page; **SI 2.2** AC in a soft blue-grey ink instead of neutral grey (low saturation, far from
  every impact hue); **SI 2.1** rounded cards with one soft shadow, bar ends rounded 4 px; **CO 1.1** larger
  text; **CO 2.2** generous space and at most four visuals a page (never filler); **SI 3.1** faint gridlines where
  data labels are dropped, gridlines or labels on a visual, never both; **SI 1.3** a short fade.

**Share of a whole:** one 100 % stacked bar with direct labels (2–3 parts); it also compares across periods.
No rings or pies.

## Assets

- `assets/soft.tokens.json` — DTCG export.
- `assets/power-bi/soft-pbi-theme-<light|dark>[-cvd].json` — report themes.
- `assets/deneb/soft-<light|dark>.overrides.json` — for the `ibcs-deneb` sync script
  ([power-bi.md](../report-styles/references/power-bi.md)).
- Web: `<StyleProvider styles={["soft"]}>`.

`ibcs_lint.py theme` reports, as expected: the warm or dark background and visual backgrounds (SI 1.2), the
AC ink as a saturated series colour (SI 2.2), the shadow (SI 2.1) and default gridlines (SI 3.1).
