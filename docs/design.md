# Design

How the report styles are built and why. For using them, start with [getting started](getting-started.md).

IBCS® is a registered trademark of IBCS Institute. The IBCS style follows the IBCS® Standards; the project is not
affiliated with or certified by IBCS Institute.

> **Only the IBCS style follows the IBCS® Standards.** The other styles borrow elements of the IBCS notation —
> scenarios (AC, PY, PL, FC), variances with impact colours by polarity, N/A rules, same unit same scale — but relax
> IBCS presentation rules on purpose (each relaxation is documented with its rule id), so they are not
> IBCS-compliant. Use the IBCS style wherever IBCS compliance is required.

## The idea

A business report is often read by several audiences: the CFO who wants exact notation and dense pages, a
marketing team that wants a product-grade screen, an HR team that wants calm and plain words, a communication team
that publishes a story on the intranet. Building four reports means four data paths, four sets of rounding rules
and, sooner or later, four different numbers.

A **style** changes how a report looks, never what it says:

```
data (one input per page)
  └─ view model (pure)        the hard rules: variances, N/A, tones, formats, label priority
       └─ page skeleton       header · key message · four KPI tiles · time card | structure card · footer
            ├─ IBCS parts      chart grammar, colours, type, words — from tokens/ibcs.json
            ├─ Showcase parts
            ├─ Soft parts
            ├─ Graphic parts
            ├─ Annual parts
            ├─ Wallboard parts
            ├─ Contrast parts
            └─ Terminal parts
reconcile test: every shown number, in every style, equals the view model's text
```

Every style draws the same view model in the same page layout. Only the chart grammar, the colours, the type and a
few words differ. A switch between styles is an attribute change on the page; the numbers never move.

## The styles

| Id | Label · persona | Character |
|---|---|---|
| `ibcs` | IBCS · for the CFO | Notation first: light grey page with white cards (dark: charcoal), scenario patterns, dense, no decoration. The only style that follows the IBCS Standards, and the reference every other style reconciles to. |
| `showcase` | Showcase · for Marketing | A product-grade page: solid surfaces with a hairline edge, one radius, a line chart with a ΔPY% strip, a ranked dumbbell; one brand accent for the actuals (AC) and the one highlight. |
| `soft` | Soft · for HR / People | Warm page, rounded cards, calm colours, generous space, larger text and plain words ("This year", "Last year", "Change"). |
| `graphic` | Graphic · for Communication | A newspaper data page: the key message as a serif headline, a ruled figure strip, a line chart with annotations tied to their points, a ruled table with inline bars. |
| `annual` | Annual · for Investors | An annual-report spread: a tinted message band, light-weight numerals, AC columns and bars with a PY marker line, numbered callouts. |
| `wallboard` | Wallboard · for Operations | A screen read from a few metres: very large figures, high contrast, thick columns and bars, variances as large chips, few labels. |
| `contrast` | Contrast · for Accessibility | AAA contrast in both modes (text 7:1, marks 4.5:1, enforced), Atkinson Hyperlegible, 2 px borders, a direction glyph on every variance so colour is never the only cue. |
| `terminal` | Terminal · for Engineering | A command-line page: JetBrains Mono, 1 px boxes, a monospace table with inline bars, plain-text variances, an amber accent; dark-first. |

Ids are neutral and stable; labels and personas can be renamed per app. Every style has a light and a dark colour
set, chosen independently of the style. Print always uses light.

## What every style keeps

These come from the IBCS notation and the reporting hard rules. Every style keeps them; only the IBCS style also
keeps all the IBCS presentation rules.

- **Same numbers.** Values, rounding and formatting come from the view model; a style computes no number.
- **Same layout.** Header · key message · one row of four KPI tiles · time card left, structure card right ·
  footer. Same order and the same horizontal positions (page width, side padding, grid gaps) in every style.
  IBCS may show extra detail in place (absolute variances).
- **Same unit, same scale** (IBCS CH 4.1): bar and column charts of one unit on a page share one px per unit.
- **Relative variance** = (AC − REF) / REF with the signed reference; **N/A** when REF ≤ 0, blank, or below half a
  unit at the displayed precision.
- Variances on **display-signed** values. Polarity (+1, −1, 0) picks the **tone** only: good, bad, neutral. A
  variance shown as zero has **no colour and no sign**. Direction glyphs follow the sign, never the tone.
- **Impact colours keep their meaning** in every palette and mode: green family good, red family bad, blue family
  neutral. Never decorative, never a category or brand colour. Every style has a colour-blind-safe (CVD) set.
- **Titles describe; the key message is a separate element.**
- **Accessibility in both themes:** text ≥ 4.5:1; impact marks and the notation marks (AC, PL, FC) ≥ 3:1; 390 px
  wide with no horizontal scroll; motion off under reduced motion, and never delaying a number.
- **Never in any style:** gauges, funnels, radar, traffic lights, pies. Rings only in Showcase, on explicit request.

## Tokens and the build

Each style is one token file (`assets/tokens/<id>.json`), validated against one JSON Schema
(`contract.schema.json`): meta (label, persona, brand slot), a light and a dark colour set with the same roles
(surface, text, impact, scenario, accent, chart), typography, radius, density, motion, and the chart grammar with
the list of IBCS rules the style relaxes.

`scripts/build_styles.py` checks every token file in both modes, then generates everything else:

| Output | For |
|---|---|
| `tokens.generated.ts`, `styles/tokens-<id>.css` | the React components (`--rs-*` variables; colours scoped by `[data-style][data-theme]`, light again under `@media print`) |
| `<id>.tokens.json` | a DTCG export of the style |
| `power-bi/<id>-pbi-theme-<mode>[-cvd].json` | Power BI report themes, light and dark, each with a colour-blind-safe twin |
| `deneb/<id>-<mode>.overrides.json` | the ibcs-deneb templates, through that skill's `sync_tokens.py --overrides` |

**Guardrails** (a failure is a notation error, not a style choice): text and labels ≥ 4.5:1 on page and panel;
impact and CVD impact ≥ 3:1; AC, PL and FC ≥ 3:1 (a style with `meta.level: "AAA"` — Contrast — needs 7:1 and
4.5:1); impact hues in their families; good brighter than bad in light
mode, a good/bad luminance gap in dark mode; AC clearly stronger than PY; accents never green or red; no text below
12 px; bar radius ≤ 4 px; gauges, funnels, radar and traffic lights banned in every style.

**Brand slot.** Each style names the tokens a builder may replace with a brand (`meta.brandSlot`); Showcase ships a
neutral navy-and-amber placeholder. The build re-checks every guardrail against the new colours. Impact colours are
never part of a brand slot.

**Fonts are self-hosted** (OFL, from the `@fontsource` packages, latin subsets, only the weights in use): a report
page makes no third-party request on load.

## What each style relaxes

The IBCS style relaxes only app chrome and offers a dark theme; it is the IBCS-compliant style. Every other style
relaxes IBCS presentation rules on purpose for its audience, which is why it is **not** IBCS-compliant: the list
says exactly where it differs from IBCS, it does not make the style IBCS. The exact wording, with the reason and
the condition, is in each token file's `chart.relaxes` and in each style's skill.

| Style | Relaxed rules (IBCS ids) |
|---|---|
| IBCS | SI 2.1 cards for app chrome only; SI 1.2 a dark theme on request (notation preserved) |
| Showcase | SI 1.2 brand surfaces; SI 2.1 solid panels, one radius; SI 2.3 a large key message; SI 3.1 faint gridlines on the line chart; SI 1.3 one short fade; UN 3.2 AC against one reference by hue; SI 2.1 opt-in pseudo-3D bars; EX 2.1 a ring only on request; CH 4.1 the line and the dumbbell keep their own scales |
| Soft | SI 1.2 warm page; SI 2.2 a soft blue-grey ink for AC; SI 2.1 rounded cards and bar ends; CO 1.1 larger text; CO 2.2 fewer visuals and more space; SI 3.1 gridlines instead of labels; SI 1.3 a short fade |
| Graphic | SI 1.2 an off-white page with rules; SI 2.3 a serif headline; CO 1.1 large type; SI 3.1 gridlines on the line chart; CO 1.3 at most three visuals; CH 4.1 the line keeps its own scale |
| Annual | SI 1.2 a tinted message band; SI 2.3 light-weight numerals; CO 1.1 large figures; UN 3.2 PY as a marker line; SI 2.2 the brand colour for AC; CO 1.3 at most three visuals |
| Wallboard | SI 1.2 a contrasting page; CO 1.1 very large type; SI 2.1 tiles with a small radius; CO 2.2 fewer labels (no PY value labels); CO 1.3 at most three visuals |
| Contrast | SI 2.1 2 px borders; SI 2.3 a low-vision typeface; CO 1.1 larger text; UN 4.1 a direction glyph on every variance |
| Terminal | SI 2.3 a monospace typeface; SI 2.1 1 px box borders; SI 1.2 a dark page with an amber accent |

## Design decisions

- **One layout for every style.** An earlier draft gave Showcase a hero card and Graphic a poster layout; readers
  switching styles lost their place. The skeleton is now shared code, so a style cannot move a section.
- **Light and dark for every style**, independent of the style switch, following the system until the reader picks.
  The IBCS dark theme keeps the notation: AC solid, PY lighter, PL outlined, FC hatched read correctly on dark.
- **Graphic is editorial.** Two directions were built — a newspaper data page and an annual-review infographic;
  the editorial one became Graphic, credible enough to sit next to finance numbers, and the annual-review one later
  became its own style, Annual, for investors. Its first version (a yellow poster block) was dropped as too loud for a company communication team.
- **Showcase is a product page, not a poster:** solid surfaces, one radius, a tight type scale, amber only for AC
  and the one highlight.
- **No rings in Soft or Graphic.** A share of a whole is a 100 % stacked bar with labels; Showcase keeps a ring
  only when the report's owner asks for one.
- **Same unit, same scale is enforced**, not just stated: one scale registry per page, measured in the browser.
  Line charts that are read against labelled gridlines opt out, as documented relaxations.
- **Numbers that can be trusted**, in two senses: consistent (parts add up to their totals, checked from the data)
  and the same in every view (the reconcile test).
- **One plugin that depends on the `ibcs` plugin**, so the notation, the Power BI templates and the IBCS tokens
  stay in one place.

## Verification

| Layer | Check |
|---|---|
| Tokens | `build_styles.py`: schema, guardrails per mode, generated files current (`--check`) |
| Components | vitest: view-model rules, axis ticks, totals check, switch state and keyboard, same scale, and the reconcile test for every style on desktop and phone, on three different pages |
| Pages in a browser | `check-previews.mjs`: reconcile, shared numbers and layout, same position across styles, no label collisions, same unit same scale, self-hosted fonts, no third-party request, themes, print, CVD, keyboard |
| Generated assets | repo tests run every Deneb overrides file through ibcs-deneb's sync script and every Power BI theme through ibcs-review's linter; each lint finding must be a documented relaxation |
| Repository | manifests, frontmatter, links inside the plugin, a leak scan, `claude plugin validate --strict` |

A proof run, a fresh builder with only the skills and one prompt, built a customer-service page with a friendly
default and an IBCS view for the CFO; its findings (label collisions, a missing totals check, a score kind,
guidance gaps) shaped the 1.0 release.
