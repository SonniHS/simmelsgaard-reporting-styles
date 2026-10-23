# Playground

Try every style, theme and width on your own numbers, and watch the report check itself.

```sh
cd plugins/report-styles/skills/report-styles/assets/react-reference
npm ci && npm run previews
npx serve previews        # or any static server; then open /playground.html (fonts do not load from file://)
```

## What you can change

- **View** — the style (all eight), light or dark, the colour-blind-safe colours, and the width: desktop 1280,
  tablet 820, phone 390. The report runs in a frame at that width, so the phone and tablet layouts are the real ones.
  The style and theme switches inside the report work too.
- **Data** — four presets (sales by month and region; people by quarter with a lower-is-better structure; customer
  service with large counts, a score and a mix; a stress page with long names, six-digit values and 24 months), then
  every field in a form: page title and labels, the four KPI tiles (label, unit, AC, PY, decimals, kind, polarity),
  the time card and the structure card (title, unit, decimals, polarity, which KPI is their total, and every point or
  item). Add and remove rows. Or edit the whole input as JSON.
- **Stress buttons** — randomise the actuals, make every name long, multiply every value by 1000, or extend the time
  series to 24 points.

Input the components cannot draw (not four KPIs, fewer than two points, a duplicate key, a decimals value outside 0–3,
a totals KPI that does not exist) is not sent; the playground says why.

## The checks

After every change the report checks itself and the results appear on the left — the same rules as the browser check
in CI:

| Check | Fails when |
|---|---|
| Every number equals the view model | a shown number differs from the text the view model computed |
| The shared set of numbers is shown | a KPI value or variance, a structure item's AC or Δ%, a time point's Δ% that must show, or a number of the key message is missing |
| Parts add up to their totals | the points or items do not add up to the KPI named as their total (also shown on the page) |
| No chart label overlaps another or leaves its card | two labels collide, or a label runs off the card |
| Same unit, same scale | charts of one unit draw at different lengths per unit (more than 2 % apart) |
| No horizontal scroll | the page is wider than the frame |

Only the IBCS style follows the IBCS® Standards; the playground says so next to the style picker.
