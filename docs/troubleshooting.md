# Troubleshooting

**The plugin installs but does not load, or the `ibcs` skills are missing.**
`report-styles` depends on `ibcs` from another marketplace. Add simmelsgaard-reporting-skills first
(`/plugin marketplace add SonniHS/simmelsgaard-reporting-skills`), then install `report-styles` again. This
marketplace allowlists that dependency (`allowCrossMarketplaceDependenciesOn`); a copy without the allowlist installs
the plugin without its dependency.

**The fonts fall back to system fonts in the preview.** Browsers do not load fonts from `file://`. Serve the folder
over HTTP (the browser check does this itself) or open the built app from your dev server.

**A chart is very short.** Same unit, same scale: when the time card and the structure card share a unit, both draw at
the smaller px per unit. That is the rule (IBCS CH 4.1), not a bug. Give the charts different units only if they
really are different measures; otherwise accept the shorter chart or show fewer items in the structure card.

**The IBCS structure card has no ΔPY column.** When the card is too narrow, the names first move onto their own line
above the bars; only when even that leaves the bars too little room is the absolute ΔPY column dropped (it stays in
the KPI tiles). ΔPY% always stays, and the column headers in the chart say which is shown.

**A "Data check" note appears above the key message.** The parts in your input do not add up to the KPI you named
in `totals`. Fix the source data; the page states the mismatch instead of hiding it.

**`build_styles.py` fails after a brand change.** It names the colour, the mode and the rule: for example an accent
in the green or red family, a text colour below 4.5:1, or an actual that is not clearly stronger than the
reference. Pick a darker or lighter shade of the brand colour for that mode.

**`ibcs_lint.py` reports findings on a style theme.** Expected for the style's documented relaxations (listed in each
style's skill). Anything else is a defect: please open an issue.

**The browser check fails with "previews not built" or "no page".** Run `npm run previews` first, or pass `--site`
and `--page` for your own build. It needs Playwright: `npm i -D playwright`, or `NODE_PATH` to a `node_modules` with it.

**Some value labels are missing.** Labels thin by priority when they do not fit — on a phone, on a narrow card, or with
many points: the last, the largest and the smallest always stay. Scale large numbers (kEUR, mEUR) so more fit.

**The switch shows "for HR / People" to a different team.** Rename the persona for your app:
`<StyleProvider labels={{ soft: { persona: "for the team" } }}>`.
