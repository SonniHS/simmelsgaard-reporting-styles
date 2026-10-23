# Testing

What proves that a styled page can be trusted, and how to run it — for this repository and for your own app.

## Numbers that can be trusted

| Question | Check | Where |
|---|---|---|
| Do the parts add up to their totals? | `totals` in the input; mismatches in `vm.checks`, shown on the page | view model |
| Does every view show the same numbers? | the reconcile test: every `data-k` text in every style, desktop and phone, equals the view model | `reconcile.test.tsx` |
| Does every style show the whole shared set? | every KPI's AC, PY, ΔPY, ΔPY%; every item's AC and ΔPY%; every time point's ΔPY% at desktop | `reconcile.test.tsx`, `check-previews.mjs` |
| Is the same unit drawn at the same scale? | the drawn length per unit of every value mark, per unit, across charts (±2 %) | `scale.test.tsx`, `check-previews.mjs` |

## In this repository

```sh
S=plugins/report-styles/skills/report-styles
uv run --with jsonschema python -I $S/scripts/build_styles.py --check   # tokens: schema, guardrails, generated files current
cd $S/assets/react-reference
npm ci && npm run typecheck && npm test                                 # components (vitest)
npm run previews                                                        # build the preview app
NODE_PATH=<node_modules with playwright> npm run check-previews         # the sample in Chrome
npm run check-previews -- --data people                                 # quarters, inverse polarity
npm run check-previews -- --data service                                # large counts, negative variances, a score
cd - && python3 -m pytest -q tests                                      # repository: manifests, links, assets, leak scan
```

`tests/test_repo.py` also runs the consumer tests when a checkout of simmelsgaard-reporting-skills is next to this
repository (or `IBCS_SKILLS_REPO` points at one): every Deneb overrides file through the real sync script, every
Power BI theme through the IBCS linter.

## The browser check on your own app

`check-previews.mjs` serves a static build on 127.0.0.1, opens it in Chrome (Playwright) in every offered style and
both themes at 1280 and 390 px, saves screenshots, and closes everything when done:

```sh
node <report-styles>/assets/react-reference/scripts/check-previews.mjs \
  --site dist --page index.html --styles soft,ibcs --theme-default dark --out shots
```

Your entry must expose what the page should show, as the preview app does:

```ts
const vm = buildKeyFigures(page);
(window as any).__REPORT_STYLES__ = {
  expected: expectedTexts(vm), headline: vm.message.flatMap((p) => (p.k ? [p.k] : [])),
  shared: { desktop: sharedKeys(vm, false), phone: sharedKeys(vm, true) }, tokens: STYLE_TOKENS,
};
```

It fails on: a number that differs from the view model; a missing shared number or key-message number; a page that
leaves the shared layout or places tiles and cards differently across styles; a chart label that overlaps another
or leaves its card; charts of one unit at different scales; horizontal scroll; a console error; any request to
another host; a style font that did not load; the wrong default theme; print not light; the CVD toggle; the
keyboard on the switches.

## CI

`.github/workflows/ci.yml`: repository tests (with the consumer tests against simmelsgaard-reporting-skills), the
components (typecheck, tests, previews, the browser check on all three pages), and `claude plugin validate --strict`
for the marketplace and the plugin.
