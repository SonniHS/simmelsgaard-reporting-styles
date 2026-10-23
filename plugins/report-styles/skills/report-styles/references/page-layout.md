# One page layout, every style

Every style shows the same elements in the same places; a style changes how they look, never where they are or
which of them appear. The skeleton is code (`ReportPage.tsx`), so a style cannot move a section.

```
header      title (descriptive) · scope
message     the key message, a separate element built from view-model texts
KPI row     four tiles in one row (two by two on a phone), same order
cards       time card (left, 3/5) | structure card (right, 2/5), titled from the data; stacked below 1024 px
footer      data note · notation key (AC solid, PY lighter, PL outlined, FC hatched)
```

## What is shared, what a style supplies

| Shared (`ReportPage`, `KpiTile`, base.css) | A style supplies (`parts/<id>.tsx`, `<id>.css`) |
|---|---|
| order of the sections; page width, side padding and grid gaps; the top bar | the chart grammar of each card (`chart(width)` or a `body` such as a table) |
| the KPI tile's fields: label and unit, AC, ΔPY, ΔPY% (rates: pp only), PY | the card subtitles and legend; its words for the comparison (`terms`: "PY" / "Last year" / "2024") |
| the key message's parts and tones | colours, type, radius, density, vertical rhythm (from its tokens) |
| the notation key and the footer | an optional `kicker` before the title |

**The shared set of numbers** every style shows: every KPI's AC, PY, ΔPY and ΔPY%; each structure item's AC and ΔPY%;
each time point's ΔPY% wherever the labels fit. Where they do not (a phone, a narrow card, many points), labels thin
by priority — the last, the largest |value|, the smallest — and those three are always shown. Axis labels thin the
same way; names too long for their column end in "…" with the full name as a tooltip; KPI values shrink to fit their
tile.
IBCS may show more in place (its ΔPY tier on the time card and a ΔPY column on the structure card).

**Horizontal geometry is fixed** (`--rs-skeleton-max` 1344 px, `--rs-skeleton-side` 16 px, `--rs-skeleton-gap`
16 px): tiles, cards and switches sit at the same x and width in every style. Vertical positions follow each
style's type (a larger headline pushes the KPI row down); that is intended.

## The input

`buildKeyFigures(input)` takes one page's data; nothing in the components is specific to the sample:

```ts
{
  title?: "People", company: "Sample Co", period: "2025", unitNote?: "EUR",
  acLabel: "2025", pyLabel: "2024",                       // how AC and the reference are named on this page
  kpis: [{ key, label, unit, ac, py, decimals, polarity: 1 | -1 | 0, kind: "amount" | "count" | "rate" | "score" }, …],  // four
  time: { title: "Headcount by quarter", unit: "FTE", decimals, polarity, points: [{ label, ac, py }, …] },
  structure: { title: "Overtime hours by department", unit: "h", decimals, polarity, items: [{ key, name, ac, py }, …] },
  message?: (vm) => MessagePart[],                       // default: lead KPI, weakest item by impact, first rate
  totals?: { time?: "revenue", structure?: "revenue" },   // KPI keys that are the sum of the points / items: checked
}
```

- **kind**: `amount` and `count` show Δ and Δ%; `rate` (a percentage) shows Δ in pp only; `score` (a bounded scale,
  e.g. CSAT 4.42 of 5, unit `"of 5"`) shows Δ only — a % change of a bounded scale misleads.
- **polarity**: `1` more is better, `-1` less is better (handling time, sick leave, cost), `0` neither. Use `0` for
  a **mix** — the split of a whole across channels, products or regions where a shift is not good or bad in itself;
  the variances then show in the neutral (blue) family, never green or red.
- **totals**: when a KPI is the sum of the time points or of the structure items, name it; AC and PY must add up
  (within half a unit at the KPI's precision). A mismatch is listed in `vm.checks` and shown on the page above the
  key message. The reconcile test proves every view shows the same numbers; only this proves the numbers agree.
- **message**: the default is in plain words ("on 2024", using `pyLabel`), so it suits every style; pass your own
  built from view-model texts, each number with its `k`, when the page has a better sentence.

Axis ticks come from the data (`niceTicks`, from zero), name and value columns size to the longest text, axis labels
shorten to an initial only on a phone with more than six points.

## Same unit, same scale (CH 4.1)

`ReportPage` puts one scale registry (`ScaleProvider`, the `ibcs` web-charts contract) around both cards. Every bar
or column chart registers its value extent and the px it has for it (`useScale`) under its unit key; all charts of
one unit then draw at the **smallest px per unit** among them, so 10 mEUR is the same length in the month columns
and in the region bars. In IBCS the ΔPY tiers join their unit's scale; ΔPY% pins keep their own scale. Charts
of different units (FTE, hours) keep separate scales. Showcase's and Graphic's line charts opt out as a documented
CH 4.1 relaxation (read against labelled gridlines from zero). The browser check measures the drawn px per unit of
every value mark (`data-u`, `data-v`) and fails when charts of one unit differ by more than 2 %.

## One data path

```
data hook (one per page)  →  buildKeyFigures(input) (pure)  →  STYLE_PARTS[style](vm, { phone })  →  <ReportPage>
```

The view model holds the hard rules (`relVar`, `tone`, `dir`, `fmt`, `fmtDelta`, `keep`). A style renderer
receives finished texts and tones; it computes no number. Switching the style re-renders the parts from the
same view-model object.

## Tests that hold it

- `reconcile.test.tsx` — every style, desktop and phone, on the sample and on a second page (people data, quarters,
  inverse polarity): every `data-k` text equals the view model; the shared
  set is present; the sections are in order; four tiles.
- `assets/react-reference/scripts/check-previews.mjs` (`npm run check-previews`) — the built previews in Chrome: the same checks on the real page, plus the
  same x/width (±2 px) for tiles, cards and the theme switch across styles, no horizontal scroll, the style's
  self-hosted fonts loaded, no third-party request, the theme following the system, print light, CVD, keyboard.
