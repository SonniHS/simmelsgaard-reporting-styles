## What and why

<!-- What does this change, and which problem or issue does it address? -->

## Checklist

- [ ] `python3 -m pytest -q tests` passes (with `IBCS_SKILLS_REPO` set, the consumer tests ran)
- [ ] Token or style changes: `build_styles.py` ran and the generated files are committed (`--check` passes)
- [ ] Component changes: `npm run typecheck`, `npm test`, `npm run previews` and `npm run check-previews` (sample, `--data people`, `--data service`) pass; screenshots updated in `docs/previews/` if the look changed
- [ ] `claude plugin validate --strict .` and `claude plugin validate --strict plugins/report-styles` pass
- [ ] A relaxed IBCS rule is listed in the style's `chart.relaxes` with its rule id, reason and condition
- [ ] No private data: no secrets, ids, hosts, e-mail addresses, names or local paths (the leak scan passes)
- [ ] CHANGELOG.md has an entry under `## [Unreleased]` (or this change is invisible to users)
