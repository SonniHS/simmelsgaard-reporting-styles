# Web apps (React, Microsoft Fabric Apps)

The `report-styles` skill ships tested React 18 + SVG reference components in
`plugins/report-styles/skills/report-styles/assets/react-reference/`. You copy `src/report-styles` into your app and
own the code from there (MIT).

## The input

One object per page. Nothing in the components is specific to the sample:

```ts
import type { KeyFiguresInput } from "./report-styles";

export const page: KeyFiguresInput = {
  title: "Customer service",
  company: "Customer Service", period: "2025",
  acLabel: "2025", pyLabel: "2024",                 // how the actual and the reference are named on this page
  totals: { time: "solved", structure: "solved" },  // KPIs that are the sum of the points / items: checked
  kpis: [                                            // four tiles, in this order
    { key: "solved", label: "Tickets solved", unit: "", ac: 48210, py: 45930, decimals: 0, polarity: 1, kind: "count" },
    { key: "fcr", label: "First-contact resolution", unit: "%", ac: 71.4, py: 68.9, decimals: 1, polarity: 1, kind: "rate" },
    { key: "aht", label: "Average handling time", unit: "min", ac: 6.8, py: 7.4, decimals: 1, polarity: -1, kind: "amount" },
    { key: "csat", label: "Customer satisfaction", unit: "of 5", ac: 4.42, py: 4.47, decimals: 2, polarity: 1, kind: "score" },
  ],
  time: { title: "Tickets solved by quarter", unit: "tickets", decimals: 0, polarity: 1,
          points: [{ label: "Q1", ac: 11640, py: 10980 }, /* … */] },
  structure: { title: "Tickets solved by channel", unit: "tickets", decimals: 0, polarity: 0,
               items: [{ key: "phone", name: "Phone", ac: 17900, py: 19400 }, /* … */] },
};
```

- **kind** — `amount` and `count`: Δ and Δ%. `rate` (a percentage): Δ in percentage points only. `score` (a bounded
  scale such as 4.42 of 5): Δ only, because a % change of a bounded scale misleads.
- **polarity** — `1` more is better, `-1` less is better, `0` neither. Use `0` for a mix (a split across channels or
  products where a shift is not good or bad in itself): its variances show in blue, never green or red.
- **message** — optional; the default key message is built from the first KPI, the weakest structure item and the
  first rate, in plain words. Pass your own sentence built from view-model texts, each number with its key.

## The page

```tsx
import "./report-styles/styles/index.css";   // self-hosted fonts, tokens, page skeleton, the four styles
import { StyleProvider, TopBar, KeyFiguresPage } from "./report-styles";

export function App() {
  return (
    <StyleProvider styles={["soft", "ibcs"]} theme="system">
      <TopBar brand="Customer Service" />
      <KeyFiguresPage data={page} footnote="Soft and IBCS switch the presentation only; both show the same numbers." />
    </StyleProvider>
  );
}
```

`StyleProvider` puts `data-style`, `data-theme` and `data-cvd` on `<html>` and keeps `style=` and `theme=` in the
URL; the generated CSS does the rest. A different page layout: build your view model with the same helpers
(`variance`, `fmt`, `keep`, `niceTicks`), give every number a `data-k`, and render your own skeleton in the same order.

## Vite

Copy `src/report-styles` into `src/`, add the dependencies from the reference `package.json` (React and the
`@fontsource` font packages), and give `tsconfig.json`:

```json
{ "compilerOptions": { "jsx": "react-jsx", "lib": ["ES2022", "DOM", "DOM.Iterable"], "types": ["vite/client"] } }
```

Vite bundles the fonts from the CSS imports. Nothing else to configure.

## Microsoft Fabric Apps

The components are plain React with no server and no third-party requests, so the built page can be hosted as a
Fabric App. Use the `fabric-apps` plugin of simmelsgaard-reporting-skills for the app itself (data access,
deployment); give it this page as the report surface.

## Accessibility

- Every chart is an SVG with `role="img"` and a label that names the chart and what it compares.
- The switches are radio groups: Tab to the selected option, arrow keys to move; focus stays on the control.
- Text contrast ≥ 4.5:1 and marks ≥ 3:1 in both themes, checked by the build; a colour-blind-safe set (`CVD`).
- Motion is off under reduced motion and never delays a number. Printing always uses the light theme.
