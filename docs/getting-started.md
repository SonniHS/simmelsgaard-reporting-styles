# Getting started

From your data to a report page in one or more styles, in a web app (React, Microsoft Fabric Apps) or in Power BI.
Each step is one prompt in Claude Code; the commands under each step are what the skills run or tell you to run.

```
your data ──► one view model ──► the shared page ──► IBCS / Showcase / Soft / Graphic, light or dark
                                                       ├─ web app: React reference components
                                                       └─ Power BI: theme + re-coloured Deneb templates
```

Check the [prerequisites](prerequisites.md) first.

## 1. Install

```
/plugin marketplace add SonniHS/simmelsgaard-reporting-skills
/plugin marketplace add SonniHS/simmelsgaard-reporting-styles
/plugin install report-styles@simmelsgaard-reporting-styles
```

`report-styles` depends on the `ibcs` plugin (the notation) from simmelsgaard-reporting-skills; the first line adds
that marketplace so the dependency resolves. For Power BI, also install `ibcs-power-bi@simmelsgaard-reporting-skills`.

## 2. Choose a style, or several

> "This page is for our HR team, and the CFO checks it too. Which style?"

The `report-styles` skill answers from the audience: one style pre-selected, or several with a switch where the
first is the default (the audience that opens the page most). See [choosing a style](choosing-a-style.md).

## 3. Build the page (web app)

> "Build a one-page React report for the customer service team from this data: … Friendly by default, an IBCS view
> for the CFO, dark mode for night shifts. Same numbers in both."

The skill copies the reference components into your app and fills one input:

```tsx
import "./report-styles/styles/index.css";
import { StyleProvider, TopBar, KeyFiguresPage } from "./report-styles";

<StyleProvider styles={["soft", "ibcs"]} theme="dark" labels={{ soft: { persona: "for the team" } }}>
  <TopBar brand="Customer Service" />
  <KeyFiguresPage data={myPage} footnote="Soft and IBCS switch the presentation only; both show the same numbers." />
</StyleProvider>
```

`myPage` holds four KPIs, a time series and a structure (for example months and regions), with titles, units and how
the actual and the reference are named. See [web apps](web-apps.md) for the input, Vite setup and Fabric Apps.

## 4. Prove the numbers

- **Consistent:** name the KPI that is the total of the time series or the structure (`totals`); a mismatch shows on
  the page above the key message.
- **The same in every view:** copy the reconcile test; it renders every offered style on desktop and phone and
  compares every number with the view model.
- **In a browser:** run `check-previews.mjs` on your build — layout, scale, label collisions, fonts, themes, keyboard.

See [testing](testing.md).

## 5. Power BI

> "Make the Power BI report match the Graphic style, dark."

Import `style-graphic/assets/power-bi/graphic-pbi-theme-dark.json` and re-colour the IBCS Deneb templates with
`graphic-dark.overrides.json`. See [Power BI](power-bi.md).

## 6. Brand it

> "Put our brand colour #0B6E99 into the Showcase style."

Only the paths in the style's `meta.brandSlot` change; `build_styles.py` re-checks contrast, impact colours and the
notation in both modes and fails, naming the rule, when the brand breaks one.

## 7. Outside Claude Code

Every style ships `style-<id>/assets/DESIGN.md`, generated from the same tokens. Copy it to the root of another
project and any agent or design tool that reads [DESIGN.md](https://github.com/google-labs-code/design.md) builds in
that style: colours for both themes, type, radii, spacing, the shared layout, and the notation rules as do's and
don'ts. It describes the look; the numbers still need the view model and the reconcile test to be proven.
