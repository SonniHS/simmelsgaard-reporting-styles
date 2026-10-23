# Power BI

Each style ships Power BI report themes and overrides that re-colour the IBCS Deneb chart templates. Both are
generated from the style's tokens; never edit them by hand.

Requires the `ibcs-power-bi` plugin of simmelsgaard-reporting-skills for the templates and the report-building
workflow.

## Themes

| Style | Files (in `plugins/report-styles/skills/style-<id>/assets/power-bi/`) |
|---|---|
| IBCS | `ibcs-pbi-theme-light.json`, `-light-cvd`, `-dark`, `-dark-cvd` |
| Showcase | `showcase-pbi-theme-light.json`, `-light-cvd`, `-dark`, `-dark-cvd` |
| Soft | `soft-pbi-theme-light.json`, `-light-cvd`, `-dark`, `-dark-cvd` |
| Graphic | `graphic-pbi-theme-light.json`, `-light-cvd`, `-dark`, `-dark-cvd` |
| Annual | `annual-pbi-theme-light.json`, `-light-cvd`, `-dark`, `-dark-cvd` |
| Wallboard | `wallboard-pbi-theme-light.json`, `-light-cvd`, `-dark`, `-dark-cvd` |

Import one in Power BI Desktop (View → Themes → Browse for themes), or set it as the custom theme of a PBIR report.
Themes set page and visual backgrounds, borders, title and label fonts (installed faces: Power BI themes take no web
fonts), the actuals and reference as the first two data colours with neutral greys after them, and the good, bad
and neutral colours of the mode (the `-cvd` theme swaps them for the colour-blind-safe set).

Power BI has no runtime style or theme switch: choose one theme per report, or keep a page group per style behind
bookmarks. Keep the same visual positions in every style, so changing the style is a theme swap.

## Deneb templates

The chart templates are the `ibcs-deneb` skill's. Each style has an overrides file per mode that the skill's sync
script applies:

```sh
python3 -I <ibcs-deneb>/scripts/sync_tokens.py \
  --overrides plugins/report-styles/skills/style-soft/assets/deneb/soft-light.overrides.json \
  --out ./deneb-soft-light
# the colour-blind-safe set:
python3 -I <ibcs-deneb>/scripts/sync_tokens.py --overrides …/soft-light.overrides.json --variant cvd --out ./deneb-soft-light-cvd
```

The output has a `templates/` and a `config/` folder: every template with its colour, text, background, axis,
highlight and font parameters set to the style. Template structure, polarity and notation do not change.

## Checking a theme

`ibcs_lint.py theme <file>` (ibcs-review skill) checks a theme against strict IBCS. On a style theme it reports the
style's documented relaxations — a non-white background, borders, gridlines, a serif title — as findings; that is
expected, and each style's skill lists which ones. Any other finding is a defect. The repository's tests run every
theme through the linter and fail on an undocumented finding.
