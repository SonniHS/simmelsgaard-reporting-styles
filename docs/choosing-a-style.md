# Choosing a style

Pick by who reads the page, not by taste. The numbers and the layout are the same in every style.

| If the main reader is … | Use | Because |
|---|---|---|
| finance, controlling, the CFO, a board's finance committee | **IBCS** | exact notation, dense, absolute and relative variances side by side |
| marketing, sales, customer success, an executive audience used to product dashboards | **Showcase** | product-grade surfaces, one brand accent, the actuals against one reference by hue |
| HR, people managers, employees, internal service teams, often on a phone | **Soft** | calm, roomy, larger text, plain words ("This year", "Last year", "Change") |
| everyone, through the intranet, a newsletter or a town-hall slide | **Graphic** | the key message as a headline, annotations where the story is, a source-line feel |
| investors and the board, in an annual or half-year report or an investor update | **Annual** | the calm look of a published report: light numerals, a message band, numbered callouts |
| a shift or operations team, on a wall display or a team TV, from a few metres | **Wallboard** | very large figures, high contrast, thick marks, few words; usually dark |
| unsure | **IBCS** | never wrong, only sometimes too dense for a non-finance reader |

## One style or several

- **One audience** → pre-select one style: `styles: ["soft"]`. No style switch is shown.
- **Several audiences on the same page** → offer several: a switch in the top bar. **The first style is the
  default**: put first the audience that opens the page most.
  - A team page the CFO also checks: `["soft", "ibcs"]`.
  - A finance pack that others also read: `["ibcs", "soft"]`.
- Rename a style for your app without changing its look: `labels={{ soft: { persona: "for the team" } }}`.

## Light or dark

Every style has both. The default follows the reader's system setting; set `theme="dark"` (or `"light"`) to fix the
app's default, for example for night shifts. Readers can switch at any time; printing always uses light.

## When not to switch styles

- A page that must be signed off as one document (a board pack, an audit): pre-select IBCS, print light.
- Two styles that the same reader compares side by side: use one style and two pages instead.

## Shares of a whole

No rings or pies in IBCS, Soft or Graphic: a 100 % stacked bar with direct labels shows a share and compares it
across periods. Showcase allows a ring only when the report's owner explicitly asks (2–3 parts, labelled, never two
side by side).
