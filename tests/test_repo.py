"""Validation for the marketplace: manifests, frontmatter, links, generated assets, consumers and a leak scan.

Run from the repo root:  python3 -m pytest -q tests   (or python3 -m unittest discover -s tests -v)
Stdlib only. Optional:
  tests/private-denylist.txt (gitignored), one case-insensitive entry per line (`term`, `re:<regex>`,
      `warn:<term>`), for names that must never appear but cannot be listed in a public file. Without it that
      check is skipped; before publishing run with REQUIRE_PRIVATE_DENYLIST=1 so a missing list fails.
  IBCS_SKILLS_REPO=<checkout of simmelsgaard-reporting-skills> (default: a sibling folder named
      simmelsgaard-skills) runs the consumer tests: every Deneb overrides file through ibcs-deneb's
      sync_tokens.py, and every Power BI theme through ibcs-review's ibcs_lint.py. Skipped when absent.
  REQUIRE_PUBLISH=1 fails while internal working files (BRIEF.md) are still in the repo.
"""

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGINS = ROOT / "plugins"
DENYLIST = ROOT / "tests" / "private-denylist.txt"
SKILLS = PLUGINS / "report-styles" / "skills"
BUILD = SKILLS / "report-styles" / "scripts" / "build_styles.py"
STYLES = ("ibcs", "showcase", "soft", "graphic")
INTERNAL = {"BRIEF.md"}  # working files that are removed before publishing (and are not scanned until then)

SKIP_SCAN = {"LICENSE-CC-BY-SA-4.0", "LICENSE-MIT"}
LICENCE_FILES = ["NOTICE", "LICENSE-MIT", "LICENSE-CC-BY-SA-4.0"]
PRIVATE_DIRS = r"(?:vault|packages|apps|specs|erp-demo|design/tokens)/"

ZERO_GUID = "00000000-0000-0000-0000-000000000000"
LEAK_PATTERNS = [
    ("e-mail address", re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+"),
     lambda m: m.split("@")[1].startswith("example.") or m.startswith("noreply@anthropic")),
    ("GUID", re.compile(r"\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b"),
     lambda m: m == ZERO_GUID),
    ("tenant-specific host", re.compile(
        r"\b[\w-]+\.(?:datawarehouse\.fabric\.microsoft\.com|database\.windows\.net|"
        r"crm\d*\.dynamics\.com|operations\.dynamics\.com|sharepoint\.com)\b", re.I),
     lambda m: False),
    ("licence line of the IBCS PDF", re.compile(r"licensed\s+for", re.I), lambda m: False),
    ("home directory path", re.compile(r"(?:/Users/|/home/|[A-Z]:\\Users\\)[\w.-]+"), lambda m: False),
    ("private repo path", re.compile(r"(?<![\w/{}<.$-])" + PRIVATE_DIRS), lambda m: False),
    ("private repo path", re.compile(r"(?:^|(?<=[\s(\[`'\"=:]))(?:\.\.?/|~/|/)+" + PRIVATE_DIRS), lambda m: False),
]


def repo_files():
    for path in ROOT.rglob("*"):
        rel = path.relative_to(ROOT)
        if rel.parts[0] == "simmelsgaard-reporting-skills":
            continue  # CI checks the ibcs plugins out here for the consumer tests; that repository has its own scan
        if path.is_file() and not rel.parts[0].startswith(".git") and ".remember" not in rel.parts \
                and "__pycache__" not in rel.parts and "node_modules" not in rel.parts and "dist" not in rel.parts \
                and rel.name not in {DENYLIST.name, "CLAUDE.local.md"} | INTERNAL:
            yield path


def md_files(base):
    return (p for p in base.rglob("*.md") if "node_modules" not in p.parts)


def text_files():
    for path in repo_files():
        if path.name in SKIP_SCAN:
            continue
        try:
            path.read_bytes().decode("utf-8")
        except UnicodeDecodeError:
            continue
        yield path


def frontmatter(path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---", 4)
    if end < 0:
        return None
    fields, key = {}, None
    for line in text[4:end].splitlines():
        m = re.match(r"^([A-Za-z_-]+):\s*(.*)$", line)
        if m:
            key, value = m.group(1), m.group(2).strip()
            fields[key] = "" if value in {">", "|", ">-", "|-"} else value
        elif key and line.startswith((" ", "\t")):
            fields[key] = (fields[key] + " " + line.strip()).strip()
    return fields


def plugin_dirs():
    return sorted(p for p in PLUGINS.iterdir() if p.is_dir())


def skills_of(plugin):
    return sorted(p.parent for p in (plugin / "skills").glob("*/SKILL.md"))


def run_script(*args, cwd=None):
    return subprocess.run([sys.executable, "-I", "-B", *map(str, args)], capture_output=True, text=True, cwd=cwd)


def skills_repo():
    p = Path(os.environ.get("IBCS_SKILLS_REPO") or ROOT.parent / "simmelsgaard-skills")
    return p if (p / "plugins" / "ibcs").is_dir() else None


class Manifests(unittest.TestCase):
    def test_marketplace_lists_every_plugin(self):
        market = json.loads((ROOT / ".claude-plugin" / "marketplace.json").read_text())
        listed = {p["name"]: p["source"] for p in market["plugins"]}
        self.assertEqual(set(listed), {p.name for p in plugin_dirs()})
        for name, source in listed.items():
            self.assertEqual(source, f"./plugins/{name}")

    def test_plugin_manifest_names_match_dirs(self):
        for plugin in plugin_dirs():
            manifest = json.loads((plugin / ".claude-plugin" / "plugin.json").read_text())
            self.assertEqual(manifest["name"], plugin.name)
            self.assertTrue(manifest.get("description"))

    def test_cross_marketplace_dependencies_are_allowed(self):
        # A dependency from another marketplace installs only when the root marketplace allowlists it;
        # otherwise the plugin installs without it and then fails to load.
        market = json.loads((ROOT / ".claude-plugin" / "marketplace.json").read_text())
        allowed = set(market.get("allowCrossMarketplaceDependenciesOn", []))
        names = {p.name for p in plugin_dirs()}
        for plugin in plugin_dirs():
            for dep in json.loads((plugin / ".claude-plugin" / "plugin.json").read_text()).get("dependencies", []):
                name, _, market_name = dep.partition("@")
                if market_name and market_name != market["name"]:
                    self.assertIn(market_name, allowed, f"{plugin.name}: {dep} needs allowCrossMarketplaceDependenciesOn")
                else:
                    self.assertIn(name, names - {plugin.name}, f"{plugin.name}: unknown dependency {dep}")

    def test_every_plugin_ships_identical_licence_files(self):
        for plugin in plugin_dirs():
            for name in LICENCE_FILES:
                copy = plugin / name
                self.assertTrue(copy.is_file(), f"{plugin.name} has no {name}")
                self.assertEqual(copy.read_bytes(), (ROOT / name).read_bytes(), f"{copy} differs from /{name}")

    def test_every_plugin_has_readme(self):
        for plugin in plugin_dirs():
            self.assertTrue((plugin / "README.md").is_file(), f"{plugin.name} has no README.md")

    @unittest.skipUnless(shutil.which("claude"), "claude CLI not installed")
    def test_claude_plugin_validate_strict(self):
        for target in [ROOT, *plugin_dirs()]:
            r = subprocess.run(["claude", "plugin", "validate", "--strict", str(target)], capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, f"{target}:\n{r.stdout}{r.stderr}")


class Frontmatter(unittest.TestCase):
    def test_skills_have_name_and_description(self):
        for plugin in plugin_dirs():
            for skill in skills_of(plugin):
                fm = frontmatter(skill / "SKILL.md")
                self.assertIsNotNone(fm, f"{skill}: no frontmatter")
                self.assertEqual(fm.get("name"), skill.name, f"{skill}: name must match the directory")
                self.assertTrue(fm.get("description"), f"{skill}: empty description")

    def test_frontmatter_is_strict_yaml_safe_and_descriptions_fit(self):
        for f in [s / "SKILL.md" for p in plugin_dirs() for s in skills_of(p)]:
            text = f.read_text(encoding="utf-8")
            head = text[4:text.find("\n---", 4)]
            for n, line in enumerate(head.splitlines(), 2):
                m = re.match(r"^([A-Za-z_-]+):\s+(.+)$", line)
                if m and m.group(2)[0] not in "'\"|>[{":
                    self.assertNotRegex(m.group(2), r": | #", f"{f.relative_to(ROOT)}:{n}: quote it or use a block scalar")
            desc = frontmatter(f).get("description", "")
            self.assertLessEqual(len(desc), 1024, f"{f.relative_to(ROOT)}: description is {len(desc)} chars")

    def test_every_style_has_a_skill(self):
        for sid in STYLES:
            self.assertTrue((SKILLS / f"style-{sid}" / "SKILL.md").is_file(), f"no style-{sid} skill")


MD_LINK = re.compile(r"\]\(([^)\s#]+)(?:#[^)]*)?\)")
BARE_REF = re.compile(r"`((?:\.\./)*(?:references|scripts|assets)/[^`*<>{}\s]+)`")


class Links(unittest.TestCase):
    def test_relative_links_resolve_inside_their_plugin(self):
        problems = []
        for plugin in plugin_dirs():
            for md in md_files(plugin):
                text = md.read_text(encoding="utf-8")
                for target in MD_LINK.findall(text):
                    if re.match(r"^[a-z]+:", target):
                        continue
                    resolved = (md.parent / target).resolve()
                    if not resolved.exists():
                        problems.append(f"{md.relative_to(ROOT)}: broken link {target}")
                    elif plugin.resolve() not in resolved.parents and resolved != plugin.resolve():
                        problems.append(f"{md.relative_to(ROOT)}: link leaves the plugin: {target}")
                base = next((p for p in md.parents if p.parent.name == "skills"), None)
                bases = [base] if base else skills_of(plugin)
                for target in BARE_REF.findall(text):
                    if not (md.parent / target).exists() and not any((b / target).exists() for b in bases):
                        problems.append(f"{md.relative_to(ROOT)}: missing file {target}")
        self.assertEqual(problems, [], "\n".join(problems))

    def test_repo_docs_links_resolve(self):
        for md in [*ROOT.glob("*.md"), *(ROOT / "docs").glob("*.md")]:
            for target in MD_LINK.findall(md.read_text(encoding="utf-8")):
                if not re.match(r"^[a-z]+:", target):
                    self.assertTrue((md.parent / target).exists(), f"{md.relative_to(ROOT)}: broken link {target}")


class GeneratedAssets(unittest.TestCase):
    def test_build_check_passes(self):
        r = run_script(BUILD, "--check")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)

    def test_every_style_ships_its_assets(self):
        for sid in STYLES:
            a = SKILLS / f"style-{sid}" / "assets"
            self.assertTrue((a / f"{sid}.tokens.json").is_file())
            for mode in ("light", "dark"):
                for cvd in ("", "-cvd"):
                    self.assertTrue((a / "power-bi" / f"{sid}-pbi-theme-{mode}{cvd}.json").is_file(), f"{sid} {mode}{cvd} theme")
                self.assertTrue((a / "deneb" / f"{sid}-{mode}.overrides.json").is_file(), f"{sid} {mode} overrides")

    def test_themes_carry_the_tokens_impact_colours(self):
        for sid in STYLES:
            tok = json.loads((SKILLS / "report-styles" / "assets" / "tokens" / f"{sid}.json").read_text())
            for theme in (SKILLS / f"style-{sid}" / "assets" / "power-bi").glob("*.json"):
                mode = "dark" if "-dark" in theme.name else "light"
                imp = tok["color"][mode]["impact"]
                imp = imp["cvd"] if theme.stem.endswith("-cvd") else imp
                t = json.loads(theme.read_text())
                self.assertEqual((t["good"], t["bad"], t["neutral"]), (imp["good"], imp["bad"], imp["neutral"]), theme.name)
                self.assertEqual(t["dataColors"][:2], [tok["color"][mode]["scenario"]["ac"], tok["color"][mode]["scenario"]["py"]])


# ibcs_lint findings a style's theme is expected to raise: each is one of the style's documented relaxations.
# Lint reports Showcase's amber/slate series under SI 2.2 (colour for series); the style's UN 3.2 covers it.
LINT_ALIASES = {"showcase": {"SI 2.2": "UN 3.2"}}


@unittest.skipUnless(skills_repo(), "simmelsgaard-reporting-skills checkout not found (set IBCS_SKILLS_REPO)")
class Consumers(unittest.TestCase):
    """The generated files work in the tools that consume them (the ibcs plugins)."""

    def test_deneb_overrides_sync_into_every_template(self):
        sync = skills_repo() / "plugins/ibcs-power-bi/skills/ibcs-deneb/scripts/sync_tokens.py"
        for overrides in sorted(SKILLS.glob("style-*/assets/deneb/*.overrides.json")):
            want = json.loads(overrides.read_text())["color"]["scenario"]["ac"]["$value"]
            with tempfile.TemporaryDirectory() as tmp:
                r = run_script(sync, "--overrides", overrides, "--out", tmp)
                self.assertEqual(r.returncode, 0, f"{overrides.name}: {r.stdout}{r.stderr}")
                templates = sorted(Path(tmp, "templates").glob("*.vl.json"))
                self.assertTrue(templates, overrides.name)
                for t in templates:
                    params = {p["name"]: p.get("value") for p in json.loads(t.read_text()).get("params", [])}
                    if "ibcsAC" in params:
                        self.assertEqual(params["ibcsAC"], want, f"{overrides.name} → {t.name}")

    def test_lint_findings_are_documented_relaxations(self):
        lint = skills_repo() / "plugins/ibcs/skills/ibcs-review/scripts/ibcs_lint.py"
        problems = []
        for sid in STYLES:
            tok = json.loads((SKILLS / "report-styles" / "assets" / "tokens" / f"{sid}.json").read_text())
            relaxed = {r["rule"] for r in tok["chart"]["relaxes"]}
            for theme in sorted((SKILLS / f"style-{sid}" / "assets" / "power-bi").glob("*.json")):
                mode = "dark" if "-dark" in theme.name else "light"
                overrides = SKILLS / f"style-{sid}" / "assets" / "deneb" / f"{sid}-{mode}.overrides.json"
                r = run_script(lint, "theme", theme, "--overrides", overrides, "--format", "json")
                findings = json.loads(r.stdout)
                findings = findings.get("findings", findings) if isinstance(findings, dict) else findings
                for f in findings:
                    rule = LINT_ALIASES.get(sid, {}).get(f["ibcs"], f["ibcs"])
                    if rule not in relaxed:
                        problems.append(f"{theme.name}: {f['ibcs']} {f.get('rule')} {f.get('evidence')} is not a documented relaxation")
        self.assertEqual(problems, [], "\n".join(problems))


def load_denylist():
    if not DENYLIST.exists():
        return []
    entries = []
    for n, raw in enumerate(DENYLIST.read_text(encoding="utf-8").splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        kind = "error"
        if line.startswith("warn:"):
            kind, line = "warn", line[5:].strip()
        source = line[3:].strip() if line.startswith("re:") else re.escape(line)
        entries.append((kind, (re.compile(source, re.I), re.compile(source.encode("utf-8"), re.I)), f"{DENYLIST.name} line {n}"))
    return entries


class LeakScan(unittest.TestCase):
    def test_no_private_data(self):
        hits = []
        for path in text_files():
            rel = path.relative_to(ROOT)
            for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
                for label, rx, allowed in LEAK_PATTERNS:
                    for m in rx.finditer(line):
                        if not allowed(m.group(0)):
                            hits.append(f"{rel}:{n}: {label}: {m.group(0)}")
        self.assertEqual(hits, [], "\n".join(hits))

    def test_no_denylisted_terms(self):
        deny = load_denylist()
        if not deny:
            if os.environ.get("REQUIRE_PRIVATE_DENYLIST") == "1":
                self.fail(f"{DENYLIST.relative_to(ROOT)} is missing or empty but REQUIRE_PRIVATE_DENYLIST=1")
            self.skipTest(f"{DENYLIST.relative_to(ROOT)} not present: private-name scan NOT run")
        hits, warnings = [], []
        for path in repo_files():
            rel = path.relative_to(ROOT)
            if path.name in SKIP_SCAN:
                continue
            data = path.read_bytes()
            try:
                data = data.decode("utf-8")
            except UnicodeDecodeError:
                pass
            for kind, (rx_text, rx_bytes), label in deny:
                rx = rx_text if isinstance(data, str) else rx_bytes
                found = [f"{rel}: matches {label}"] if rx.search(data) else []
                if rx_text.search(str(rel)):
                    found.append(f"{rel}: path matches {label}")
                (hits if kind == "error" else warnings).extend(found)
        for w in sorted(set(warnings)):
            print(f"\nWARNING (review by hand): {w}", file=sys.stderr)
        self.assertEqual(sorted(set(hits)), [], "\n".join(sorted(set(hits))))

    def test_no_pdfs(self):
        for path in repo_files():
            self.assertNotEqual(path.suffix.lower(), ".pdf", f"{path}: PDFs are not shipped")

    def test_internal_files_removed_before_publishing(self):
        present = sorted(n for n in INTERNAL if (ROOT / n).exists())
        if present and os.environ.get("REQUIRE_PUBLISH") == "1":
            self.fail(f"internal working files still in the repo: {present}")


if __name__ == "__main__":
    unittest.main()
