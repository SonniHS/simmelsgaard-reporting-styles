# Prerequisites

| For | You need |
|---|---|
| the skills | Claude Code 2.1 or later, the simmelsgaard-reporting-skills marketplace (for the `ibcs` dependency) |
| web apps | Node.js 22, React 18 (the reference components are tested with 18.3.1 and TypeScript 5.9) |
| the browser check | Playwright and Chrome (or Playwright's Chromium), only to run `check-previews.mjs` |
| Power BI | Power BI Desktop, the Deneb custom visual for the chart templates, and the `ibcs-power-bi` plugin |
| Microsoft Fabric Apps | a Fabric capacity with Fabric Apps enabled, and the `fabric-apps` plugin |
| building the styles | Python 3.10+; `jsonschema` for the schema step (`uv run --with jsonschema …`) |

The reference components have no runtime dependencies beyond React; the fonts are OFL packages bundled with your app.
