# Security policy

## Reporting a vulnerability

Please report security problems **privately**, not in a public issue, discussion or pull request.

Use GitHub's private vulnerability reporting: open the repository's
[Security tab](https://github.com/SonniHS/simmelsgaard-reporting-styles/security) and choose
**Report a vulnerability** (direct link:
<https://github.com/SonniHS/simmelsgaard-reporting-styles/security/advisories/new>). The report stays visible only
to you and the maintainer until an advisory is published.

Include what you can of: the skill and file affected and the version; what an attacker could do and under which
conditions; steps or a minimal input to reproduce it; a suggested fix, if you have one.

This is a small project; reports are handled on a best-effort basis and acknowledged once read. Fixes are released
on `main` and listed in [CHANGELOG.md](CHANGELOG.md).

## Scope

In scope:

- **Scripts**: `build_styles.py`, `build-previews.mjs`, `check-previews.mjs` (for example the check's local server
  serving files outside the folder it was given).
- **Reference components and CSS**: anything that renders input text as markup, loads a third-party resource, or
  lets a URL parameter do more than pick an offered style or theme.
- **Generated assets**: Power BI themes and Deneb overrides that could inject script or markup into a report.
- **Guidance in the skills** that leads an agent to produce insecure code, such as secrets in source files.
- The marketplace and plugin manifests, and this repository's CI workflow.

Out of scope: vulnerabilities in Claude Code, Power BI, Microsoft Fabric, Deneb, React, Node.js, Playwright or other
upstream products; report those to their vendors.

## No secrets in issues

Never paste secrets, tokens, connection strings, tenant, workspace or item ids, host names or real business data into
an issue or pull request, including screenshots. Use placeholders and invented numbers.
