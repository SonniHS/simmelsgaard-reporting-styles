# Tokens, guardrails, brand slot, new styles

## The contract

`assets/tokens/contract.schema.json` (JSON Schema 2020-12). One file per style, `assets/tokens/<id>.json`:

| Group | Keys | Notes |
|---|---|---|
| `meta` | `id`, `label`, `persona`, `summary`, `brandSlot` | `brandSlot`: the paths a builder may replace |
| `color.light`, `color.dark` | each: `surface`, `text`, `impact`, `scenario`, `accent`, `chart` | same roles in both modes |
| `color.*.surface` | `page`, `panel`, `tile`, `edge`, `backdrop` | contrast is checked on page and panel |
| `color.*.impact` | `good`, `bad`, `neutral`, `cvd.{good,bad,neutral}` | fixed meaning; hue families checked |
| `color.*.scenario` | `ac`, `py`, `pl`, `fc` | AC solid, PY lighter, PL outlined, FC hatched in both modes |
| `color.*.accent` | `primary`, `highlight` | chrome and the one emphasis; never green or red |
| `typography` | `family`, `weight`, `size` | figures need tabular numerals; nothing below 12 px |
| `radius`, `density`, `motion` | | `radius.mark` ≤ 4 px; motion off under reduced motion |
| `chart` | grammar (`timeSeries`, `variance`, `structure`, `kpi`, …), `allowed`, `onRequest`, `banned`, `relaxes[]` | `relaxes`: each IBCS rule the style relaxes, with rule id, what, why, condition |

## Guardrails (`scripts/build_styles.py`, every mode)

Text and labels ≥ 4.5:1 on page and panel; impact and CVD impact ≥ 3:1; AC, PL and FC ≥ 3:1 (the marks that carry
the notation); impact hues in their families (good 70–165°, CVD good 165–200°, bad 345–20°, neutral 200–245°);
light mode good brighter than bad, dark mode a good/bad luminance gap ≥ 0.08 (also CVD); AC contrast ≥ 1.5 × PY
contrast; accent not green or red; sizes ≥ 12 px; gauge, funnel, radar and traffic light banned; nothing both
banned and allowed. A failure is a notation error, not a style choice.

```
uv run --with jsonschema python -I scripts/build_styles.py          # check, then write the generated files
python3 -I scripts/build_styles.py --check                          # CI: fail when anything is stale
```

## Put your brand here

Each style lists its brand slot in `meta.brandSlot` (Showcase: AC/PL/FC and highlight colour, page, fonts). Copy
the style's token file, change only those paths, keep the id, and run the build. It fails, naming the colour and
the ratio, when the brand breaks a rule; for example an accent in the green or red family, or an AC that is not
clearly stronger than PY. Impact colours are never in a brand slot. Fonts: add the font files to `fonts.css`
(self-hosted; no third-party request on page load) and put the family first in `typography.family.*`.

## Adding a style

1. `assets/tokens/<id>.json` — add the id to the schema's enum and to `STYLE_IDS` in the build script; fill both
   modes; list its relaxations with rule ids.
2. `react-reference/src/report-styles/parts/<id>.tsx` — a `PartsFactory` returning the two cards' charts,
   subtitles, legend and `terms`; register it in `parts/index.ts`.
3. `styles/<id>.css` — scoped by `[data-style="<id>"]`; never override the skeleton geometry.
4. `../style-<id>/SKILL.md` — when to choose it, what it relaxes, its assets.
5. Run the build, `npm test` and the preview check: the reconcile and geometry tests cover the new style
   without new test code.
