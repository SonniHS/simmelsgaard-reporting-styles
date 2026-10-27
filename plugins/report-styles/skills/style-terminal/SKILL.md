---
name: style-terminal
description: >
  The Terminal report style ("Terminal · for Engineering") — a monospace, command-line look for engineering, IT,
  platform and data teams, dark-first. Use it when report numbers go to an engineering audience (service metrics,
  costs, usage, delivery figures) in an internal tool or developer portal, or when someone asks for a
  "terminal", "CLI", "developer", "hacker" or "monospace" version of a report page. Says when to choose it, what it
  looks like (JetBrains Mono, 1 px boxes, a compact table with inline bars, plain-text variances, an amber accent),
  what it relaxes with rule ids, and where its tokens, Power BI themes and Deneb overrides are.
---

# Terminal · for Engineering

A report page that looks at home next to logs and dashboards: monospace type, boxes, a table you could have printed
from a CLI. The same numbers and layout as every style; see [report-styles](../report-styles/SKILL.md).

**Not IBCS-compliant.** It keeps a core of the IBCS notation (scenarios, variances with impact colours, N/A, same unit
same scale) and relaxes the IBCS rules listed below. Where IBCS compliance is required, use
[style-ibcs](../style-ibcs/SKILL.md), and offer this style as an additional view.

## Choose it when

- the readers are engineers, SREs, IT operations, platform or data teams;
- the page lives in an internal tool, a developer portal or next to monitoring dashboards.

Usually dark: `<StyleProvider styles={["terminal"]} theme="dark">`. Not for finance packs (IBCS) or wall screens
(Wallboard).

## What it looks like

Dark: near-black page, light grey text, amber for the switch, the focus and the `$ report` / `##` / `>` prompts.
Light: off-white paper. JetBrains Mono throughout at compact sizes. KPI tiles in 1 px boxes with lowercase labels
(`py`, `Δ`). Time card: thin AC columns in front of PY on a dashed axis, AC values on top, a Δ% row. Structure card:
a monospace table — name, an inline AC bar over a thin PY bar, `ac`, `py`, `Δ%` — whose bars share the page's scale.

## What it relaxes (exact wording in the token file)

- **SI 2.3** a monospace typeface; **SI 2.1** 1 px box borders, no radius; **SI 1.2** a dark page with an amber accent
  in dark mode (print is always light).

## Assets

- `assets/terminal.tokens.json` — DTCG export.
- `assets/DESIGN.md` — the style as a [DESIGN.md](https://github.com/google-labs-code/design.md), for any agent or design tool that reads one.
- `assets/power-bi/terminal-pbi-theme-<light|dark>[-cvd].json` — report themes (Consolas: Power BI has no web fonts).
- `assets/deneb/terminal-<light|dark>.overrides.json` — for the `ibcs-deneb` sync script
  ([power-bi.md](../report-styles/references/power-bi.md)).
- Web: `<StyleProvider styles={["terminal"]} theme="dark">`.
