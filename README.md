# simmelsgaard-reporting-styles

[![CI](https://github.com/SonniHS/simmelsgaard-reporting-styles/actions/workflows/ci.yml/badge.svg)](https://github.com/SonniHS/simmelsgaard-reporting-styles/actions/workflows/ci.yml)

Presentation styles for business reports built on the IBCS® notation, as a Claude Code plugin. One report, eight
audiences:

> **Only the IBCS style follows the IBCS® Standards.** The other styles borrow elements of the IBCS notation —
> scenarios (AC, PY, PL, FC), variances with impact colours by polarity, N/A rules, same unit same scale — but relax
> IBCS presentation rules on purpose (each relaxation is documented with its rule id), so they are not
> IBCS-compliant. Use the IBCS style wherever IBCS compliance is required.


| IBCS · for the CFO | Showcase · for Marketing | Soft · for HR / People |
|---|---|---|
| ![IBCS](docs/previews/ibcs-light-1280.png) | ![Showcase](docs/previews/showcase-dark-1280.png) | ![Soft](docs/previews/soft-light-1280.png) |
| **Graphic · for Communication** | **Annual · for Investors** | **Wallboard · for Operations** |
| ![Graphic](docs/previews/graphic-light-1280.png) | ![Annual](docs/previews/annual-light-1280.png) | ![Wallboard](docs/previews/wallboard-dark-1280.png) |
| **Contrast · for Accessibility** | **Terminal · for Engineering** | |
| ![Contrast](docs/previews/contrast-light-1280.png) | ![Terminal](docs/previews/terminal-dark-1280.png) | |

- **The same numbers in every style.** One view model per page; every style draws it, none computes a number. A
  reconcile test proves it on desktop and phone.
- **The same layout.** Header, key message, four KPI tiles, a time chart and a structure chart, in the same places.
- **Light and dark for every style**, a colour-blind-safe set, print always light.
- **Pre-select one style, or ship several with a switch** (`style=`, `theme=` in the URL).
- **A core of the IBCS notation in every style**: signed-reference variances, N/A, impact colours by polarity,
  scenario notation, same unit same scale. The **IBCS style** follows the IBCS Standards; every other style
  documents the IBCS rules it relaxes, with the rule id, and is not IBCS-compliant.
- **Web apps and Power BI**: tested React + SVG components with self-hosted fonts; Power BI themes and re-coloured
  Deneb templates, generated from the same tokens.
- **A DESIGN.md for every style** ([format](https://github.com/google-labs-code/design.md)): drop
  `style-<id>/assets/DESIGN.md` into any project, and any agent or design tool that reads DESIGN.md gets the style's
  tokens, layout and notation rules, without this plugin.

## Install

```
/plugin marketplace add SonniHS/simmelsgaard-reporting-skills
/plugin marketplace add SonniHS/simmelsgaard-reporting-styles
/plugin install report-styles@simmelsgaard-reporting-styles
```

`report-styles` builds on the `ibcs` plugin (the notation) from
[simmelsgaard-reporting-skills](https://github.com/SonniHS/simmelsgaard-reporting-skills), installed as a dependency.

Then ask, for example: *"Give this KPI page a Soft version for the HR team, with a switch to IBCS for the CFO and a
dark mode."*

## Docs

- [Getting started](docs/getting-started.md) — install, choose, build, prove the numbers, Power BI, brand.
- [Choosing a style](docs/choosing-a-style.md) — by audience; one style or several; light or dark.
- [Gallery](docs/gallery.md) — every style in both themes, desktop and phone.
- [Web apps](docs/web-apps.md) — the input, the React components, Vite, Microsoft Fabric Apps, accessibility.
- [Power BI](docs/power-bi.md) — themes, Deneb overrides, linting a theme.
- [Testing](docs/testing.md) — what proves the numbers, and the browser check on your own app.
- [Troubleshooting](docs/troubleshooting.md) · [Prerequisites](docs/prerequisites.md)
- [Playground](docs/playground.md) — try every style, theme and width on your own numbers, with live checks.
- [Design](docs/design.md) — how it is built, what every style keeps, what each style relaxes, decisions.

## Skills

| Skill | What it does |
|---|---|
| [`report-styles`](plugins/report-styles/skills/report-styles/SKILL.md) | choosing, pre-select or switch, light/dark, the shared layout, the reconcile and totals checks, tokens and brand, Power BI, adding a style; ships the tokens, the build script and the React components |
| [`style-ibcs`](plugins/report-styles/skills/style-ibcs/SKILL.md) | IBCS · for the CFO: the reference, and the only style that follows the IBCS Standards |
| [`style-showcase`](plugins/report-styles/skills/style-showcase/SKILL.md) | Showcase · for Marketing: a product-grade page with one brand accent |
| [`style-soft`](plugins/report-styles/skills/style-soft/SKILL.md) | Soft · for HR / People: calm, roomy, plain words |
| [`style-graphic`](plugins/report-styles/skills/style-graphic/SKILL.md) | Graphic · for Communication: a newspaper data page |
| [`style-annual`](plugins/report-styles/skills/style-annual/SKILL.md) | Annual · for Investors: an annual-report spread |
| [`style-wallboard`](plugins/report-styles/skills/style-wallboard/SKILL.md) | Wallboard · for Operations: a screen read from a few metres |
| [`style-contrast`](plugins/report-styles/skills/style-contrast/SKILL.md) | Contrast · for Accessibility: AAA contrast, a low-vision typeface, glyphs on every variance |
| [`style-terminal`](plugins/report-styles/skills/style-terminal/SKILL.md) | Terminal · for Engineering: a monospace command-line page |

## Contributing

Issues and pull requests are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md) and, for vulnerabilities,
[SECURITY.md](SECURITY.md). Changes are listed in [CHANGELOG.md](CHANGELOG.md).

## Licence

Prose CC BY-SA 4.0, code and data MIT; see [NOTICE](NOTICE). IBCS® is a registered trademark of IBCS Institute;
its IBCS style follows the IBCS® Standards; this project is not affiliated with or certified by IBCS Institute.
