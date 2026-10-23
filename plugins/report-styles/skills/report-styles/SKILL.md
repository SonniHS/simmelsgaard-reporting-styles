---
name: report-styles
description: >
  Gives a business report, dashboard or report app one of four presentation styles — IBCS (for the CFO),
  Showcase (for Marketing), Soft (for HR / People), Graphic (for Communication) — or several with a
  switch, in a web app (React, Microsoft Fabric apps) or in Power BI, without changing a single number.
  Use it whenever someone wants a report to look different for a different audience, asks for a
  "less technical", "marketing", "friendly", "editorial", "dark mode" or "branded" version of an
  IBCS-style page, wants a style or light/dark switch, or wants to pre-select one style for an app.
  Covers choosing a style, pre-select versus a switch (URL key style=), the light/dark theme switch
  (theme=), the one page layout every style shares, the shared view model and the reconcile test that
  keeps every style's numbers identical, the token contract with its contrast guardrails and brand
  slot, the Power BI themes and Deneb overrides, and how to add a style.
---

# Report styles

A **style** changes how a report looks, never what it says. Every style draws the same view model in
the same page layout; only the chart grammar, colours, type and a few words differ. The IBCS notation
rules (scenarios, variances, impact colours) come from the `ibcs` plugin and hold in every style; each
style documents the few presentation rules it relaxes, with rule ids.

| Id | Label · persona | Choose it when |
|---|---|---|
| `ibcs` | IBCS · for the CFO | finance and controlling; dense, exact, the reference every other style reconciles to — [style-ibcs](../style-ibcs/SKILL.md) |
| `showcase` | Showcase · for Marketing | a product-grade page for marketing or sales; one brand accent — [style-showcase](../style-showcase/SKILL.md) |
| `soft` | Soft · for HR / People | readers outside finance (HR, people, internal services); calm, roomy, plain words — [style-soft](../style-soft/SKILL.md) |
| `graphic` | Graphic · for Communication | intranet stories, town halls, the annual review; a newspaper data page — [style-graphic](../style-graphic/SKILL.md) |

Ids are neutral and never change with the labels. Every style has a **light and a dark** colour set.

## Workflow

1. **Pick the audience, then the style** (table above). Unsure who reads it: IBCS.
2. **Pre-select or switch.** One style for the whole app → `styles: ["soft"]`, no switch is rendered.
   Several audiences read the same page → a switch appears in the top bar and **the first style is the
   default: put first the audience that opens the page most.** A team page the CFO also checks is
   `styles: ["soft", "ibcs"]`; a finance pack that others also read is `["ibcs", "soft"]`. Rename a style for the
   app with `labels` (e.g. Soft "for the team"). Details: [references/switch-and-theme.md](references/switch-and-theme.md).
3. **Build the page once.** One data hook → one pure view model (`viewModel.ts`) → the shared page
   skeleton (`ReportPage`) with the current style's parts. Never a second data path per style. See
   [references/page-layout.md](references/page-layout.md).
4. **Prove the numbers can be trusted**, in two steps. *Consistent:* declare which KPI is the total of the time
   series and of the structure (`totals`); a mismatch is listed in `vm.checks` and shown on the page — fix the
   source, never the page. *The same in every view:* every number carries `data-k`; the reconcile test renders
   every offered style (desktop and phone) and compares each text with the view model. Copy
   `assets/react-reference/src/report-styles/reconcile.test.tsx`, then run `assets/react-reference/scripts/check-previews.mjs` on your
   build (labels that collide, fonts, themes, keyboard). See [references/page-layout.md](references/page-layout.md).
5. **Brand it, if asked.** Change only the paths in the style's `meta.brandSlot`, then run
   `scripts/build_styles.py`, which re-checks every contrast and impact rule in both modes. See
   [references/tokens-and-brand.md](references/tokens-and-brand.md).
6. **Power BI:** apply the style's theme JSON and sync the Deneb templates with its overrides. See
   [references/power-bi.md](references/power-bi.md).

## Non-negotiables (every style, both themes)

- **Same numbers.** Values, rounding and formatting come from the view model; a renderer computes nothing.
- **Same layout.** Header · key message · one row of four KPI tiles · month chart left, region chart right ·
  footer. Same order and the same horizontal positions in every style; IBCS may show extra detail in place.
- Relative variance = (AC − REF) / REF with the signed reference; **N/A** when REF ≤ 0, blank, or below half a
  unit at the displayed precision. A variance shown as zero has **no colour and no sign**. Polarity picks the
  tone only; direction glyphs follow the sign.
- **Impact colours keep their meaning** (green good, red bad, blue neutral) in every palette and mode, with a
  CVD variant; never decorative. Accent colours are never green or red.
- Same unit, same scale: bar and column charts of one unit share px per unit on a page (`ScaleProvider`,
  measured by the browser check); no truncated value axes for bars and columns.
- Title descriptive; key message a separate element.
- Text ≥ 4.5:1, impact and notation marks ≥ 3:1, in both modes; 390 px with no horizontal scroll; motion off under
  reduced motion and never delaying a number; print always light.
- Never in any style: gauges, funnels, radar, traffic lights, pies. No rings either, except in Showcase when the
  report's owner asks for one (2–3 parts, labelled, never two side by side).

## What ships

- `assets/tokens/<id>.json` — the source of each style, against `assets/tokens/contract.schema.json`.
- `scripts/build_styles.py` — validates and generates everything else (`--check` for CI).
- `assets/react-reference/` — tested React + SVG components: `StyleProvider`, `StyleSwitch`, `ThemeSwitch`,
  `ReportPage`, `KpiTile`, the four styles' chart parts, `viewModel.ts`, the CSS with self-hosted fonts, and a
  preview app. Copy `src/report-styles` into your app ([README](assets/react-reference/README.md)).
- Per style, in `../style-<id>/assets/`: a DTCG token file, Power BI themes (light, dark, CVD) and Deneb overrides.

## Adding a style

A token file that passes `build_styles.py`, a `parts/<id>.tsx` that fills the shared skeleton, a `<id>.css`,
an entry in `STYLE_PARTS`, its `relaxes` list with rule ids, and a `style-<id>` skill. The reconcile test then
covers it with no new test code. See [references/tokens-and-brand.md](references/tokens-and-brand.md).
