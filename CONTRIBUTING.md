# Contributing

Thanks for helping improve simmelsgaard-reporting-styles: presentation styles for reports built on the IBCS® notation, as a Claude
Code plugin. Bug reports, wrong or missing guidance, new style proposals and pull requests are all welcome.

## Proposing a change

1. **Small fixes** (a typo, a broken link, a label that collides): open a pull request directly.
2. **A skill gave wrong or insufficient guidance**: open a
   [skill gap issue](https://github.com/SonniHS/simmelsgaard-reporting-styles/issues/new?template=skill_gap.yml) with
   the prompt you used and what happened. That is the most useful feedback for this project.
3. **Bugs in components, scripts or generated themes**: open a
   [bug report](https://github.com/SonniHS/simmelsgaard-reporting-styles/issues/new?template=bug_report.yml).
4. **A new style or a change to the token contract**: open an issue first with the audience it serves and the IBCS
   rules it would relax, so the design can be agreed before you build it.
5. **The notation itself, the Deneb templates or the IBCS linter**: those live in
   [simmelsgaard-reporting-skills](https://github.com/SonniHS/simmelsgaard-reporting-skills).

The flow is a plain GitHub pull request against `main`. There is no CLA and no DCO sign-off. By opening a pull
request you agree that your contribution is licensed under the same terms as the files it changes (see Licences).

## How the pieces fit

- `assets/tokens/<id>.json` is the source of a style; `scripts/build_styles.py` checks it in both modes and generates
  everything else. Never edit generated files.
- `assets/react-reference/src/report-styles/` holds the view model (the hard rules), the shared page skeleton and
  each style's chart parts. A style supplies parts; it never computes a number or moves a section.
- Each relaxed IBCS rule is documented in the style's `chart.relaxes` and its SKILL.md, with the rule id.

See [docs/design.md](docs/design.md) for the full picture and [docs/testing.md](docs/testing.md) for every check.

## Running the checks

```sh
python3 -m pytest -q tests                                   # manifests, links, generated assets, leak scan
S=plugins/report-styles/skills/report-styles
uv run --with jsonschema python -I $S/scripts/build_styles.py --check
cd $S/assets/react-reference && npm ci && npm run typecheck && npm test
npm run previews && npm run check-previews                   # plus --data people and --data service
claude plugin validate --strict . && claude plugin validate --strict plugins/report-styles
```

The consumer tests (Deneb sync, IBCS lint) run when a checkout of simmelsgaard-reporting-skills sits next to this
repository or `IBCS_SKILLS_REPO` points at one. If a change alters the look, update the screenshots in
`docs/previews/` with `npm run check-previews -- --out ../../../../../../docs/previews`.

## Licences

Read [NOTICE](NOTICE). **Prose** (SKILL.md, references, docs, README files): CC BY-SA 4.0. **Code and data** (scripts,
components, token files, generated assets, tests, manifests, code in fenced blocks): MIT. Third-party material only
with a compatible licence, attributed in NOTICE. NOTICE and the licence files are copied into the plugin; a test
checks the copies are identical.

## No private data

Everything here is public: no secrets, ids, host names, e-mail addresses, people's names, client data or local paths.
The leak scan fails on the common patterns; maintainers also run a private denylist.

## Security

Do not report vulnerabilities in public issues; see [SECURITY.md](SECURITY.md).
