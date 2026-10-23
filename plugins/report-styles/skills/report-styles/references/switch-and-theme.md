# The style switch and the theme switch

Two independent choices, each with a URL key. Code: `assets/react-reference/src/report-styles/state.ts` (pure
rules, unit-tested), `StyleProvider.tsx` (applies them), `switches.tsx` (the controls).

## Pre-select one style, or offer several

```tsx
<StyleProvider styles={["soft"]}>                        // pre-select: no style switch is rendered
<StyleProvider styles={["ibcs", "soft"]} theme="system">  // several: a switch, the first is the default
```

- `styles` is the builder's decision per app; the **first is the default**: the audience that opens the page most.
  Unknown ids are dropped; a list with no known id throws (a config error, caught by the first render).
- `labels` renames a style for this app without touching its look:
  `<StyleProvider styles={["soft", "ibcs"]} labels={{ soft: { persona: "for the team" } }}>`.
- **URL key `style=<id>`.** A presentation key: "Reset filters" keeps it. An id that is not offered falls back
  to the first offered style, so a link from an app with more styles never breaks a pre-selected one.
- **Legacy alias:** `variant=ibcs|artistic` (an older key) opens `ibcs` / `showcase`. The first switch
  rewrites the URL to `style=` and drops `variant`.
- `<StyleSwitch>` is a segmented control on desktop (label; the persona is the tooltip) and a native select on
  phones ("Soft · for HR / People"). With one offered style it renders nothing.
- When a page is not built for a style yet, render the IBCS page with one line: "The <label> version of this
  page is not built yet; this is the IBCS page." Never a blank page.
- Add a "How to read" line once per app, in the page footer next to the data note: "<labels> switch the
  presentation only; all show the same numbers." (`<ReportPage footnote>` / `<KeyFiguresPage footnote>`).

## Light and dark, for every style

- `<ThemeSwitch>` (Light | Dark) sits next to the style switch and is independent of it: changing the style
  keeps the theme.
- **URL key `theme=light|dark`.** Without it the theme follows `prefers-color-scheme`, live, until the reader
  picks one. `theme="light"` (or `"dark"`) on the provider fixes the app's default instead of the system's.
- The provider sets `data-style`, `data-theme` and `data-cvd` on `<html>` (or the `root` you pass). The
  generated CSS holds both colour sets per style, so a switch is an attribute change: no reload, no flash.
- **Print is always light**: the generated CSS re-applies the light set under `@media print`, and the switches
  are hidden in print.
- **CVD**: `<CvdToggle>` (or `cvd=on`) swaps the impact colours for the style's colour-blind-safe set.

## Keyboard and screen readers

Both switches are `role="radiogroup"` with `role="radio"` buttons: Tab reaches the selected one, arrow keys
move and select (wrapping), focus stays on the control after a move. The phone select is a native control.

## Power BI

No runtime switch exists. Pre-select = import one theme. Several styles = one report per style, or one report
with a page group per style switched by bookmarks. Light and dark = two themes; pick one per report. See
[power-bi.md](power-bi.md).
