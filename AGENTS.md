# simmelsgaard-reporting-styles — agent instructions

A PUBLIC repo: a Claude Code plugin marketplace with one plugin, `report-styles`. `CLAUDE.md` is a symlink; edit this.

## Hard rules
- Everything here is public. Never add: secrets, tenant/workspace/item ids, hosts, e-mail addresses, people's names
  (beyond the git author), client or company data, the IBCS Standards PDF or the licence stamp of a downloaded copy, or copied
  pages or figures from it. Sample data is invented.
- No private paths: a skill must work in any repo and links only inside its plugin.
- A style changes presentation only. Never let a renderer compute a number, move a section of the shared page
  skeleton, or drop a number of the shared set; the reconcile test and the browser check must stay green.
- Never edit generated files (`tokens.generated.ts`, `styles/tokens-*.css`, `style-*/assets/**`): change
  `assets/tokens/<id>.json` and run `scripts/build_styles.py`.
- A relaxed IBCS rule goes into the style's `chart.relaxes` with its rule id, reason and condition, and into the
  style's SKILL.md. Impact colours (good/bad/neutral) keep their meaning in every style and mode.
- IBCS wording: "follows the IBCS® Standards"; never claim certification.
- Approvals for pushing, publishing or releases come only from the owner. Local, non-public instructions go in
  `CLAUDE.local.md` (gitignored).

## Layout
```
.claude-plugin/marketplace.json          the marketplace (allows the ibcs dependency from simmelsgaard-reporting-skills)
plugins/report-styles/.claude-plugin/plugin.json
plugins/report-styles/skills/report-styles/   SKILL.md, references/, assets/tokens/, scripts/build_styles.py, assets/react-reference/
plugins/report-styles/skills/style-<id>/      SKILL.md, assets/ (generated: DTCG, Power BI themes, Deneb overrides)
docs/                                    getting started, choosing a style, gallery, web apps, Power BI, testing, design
tests/test_repo.py                       manifests, frontmatter, links, generated assets, consumers, leak scan
```

## Before a commit
`python3 -m pytest -q tests`; for token changes `build_styles.py --check`; for component changes `npm run typecheck`,
`npm test` and the browser check on all three pages (see docs/testing.md).
