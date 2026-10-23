#!/usr/bin/env python3
"""Build the report styles from their token files: validate, then generate every derived asset.

    python3 -I scripts/build_styles.py            # check, then write the generated files
    python3 -I scripts/build_styles.py --check    # check only; exit 1 when a generated file is stale (CI)

Paths are relative to this skill's directory; run it from anywhere. The sources are
assets/tokens/<id>.json (one per style, validated against assets/tokens/contract.schema.json).
Every guardrail runs on each colour mode (light and dark) separately; contrast is WCAG 2.2
relative luminance. Schema validation needs `jsonschema`
(uv run --with jsonschema python -I scripts/build_styles.py); without it the schema step is
skipped with a note and the guardrails still run.

Generated, never edited by hand:
  assets/react-reference/src/report-styles/tokens.generated.ts      typed tokens for the components
  assets/react-reference/src/report-styles/styles/tokens-<id>.css   --rs-* variables: layout on
      [data-style], colours on [data-style][data-theme], the light set again under @media print
  ../style-<id>/assets/<id>.tokens.json                              DTCG export of the style
  ../style-<id>/assets/power-bi/<id>-pbi-theme-<mode>[-cvd].json     Power BI report themes
  ../style-<id>/assets/deneb/<id>-<mode>.overrides.json              overrides for ibcs-deneb's sync_tokens.py
The IBCS light theme and Deneb tokens are the ibcs-power-bi plugin's own; this script adds IBCS dark only.
"""
from __future__ import annotations

import colorsys
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # leave no __pycache__ inside the plugin
SKILL = Path(__file__).resolve().parent.parent
SKILLS = SKILL.parent
TOKENS = SKILL / "assets" / "tokens"
REACT = SKILL / "assets" / "react-reference" / "src" / "report-styles"
STYLE_IDS = ("ibcs", "showcase", "soft", "graphic")
MODES = ("light", "dark")
PBI_SCHEMA = "https://raw.githubusercontent.com/microsoft/powerbi-desktop-samples/main/Report%20Theme%20JSON%20Schema/reportThemeSchema-2.157.json"


def rgb(paint: str, over: tuple[float, float, float] | None = None) -> tuple[float, float, float]:
    """A hex or rgba() paint as 0..1 RGB; rgba is composited over `over`."""
    if paint.startswith("#"):
        return tuple(int(paint[i:i + 2], 16) / 255 for i in (1, 3, 5))  # type: ignore[return-value]
    m = re.fullmatch(r"rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)", paint)
    if not m or over is None:
        raise ValueError(f"cannot resolve paint {paint!r}")
    r, g, b, a = (float(x) for x in m.groups())
    return tuple(a * c / 255 + (1 - a) * o for c, o in zip((r, g, b), over))  # type: ignore[return-value]


def lum(c: tuple[float, float, float]) -> float:
    lin = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast(a, b) -> float:
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def hue(c) -> tuple[float, float]:
    h, _l, s = colorsys.rgb_to_hls(*c)
    return h * 360, s


def in_band(h: float, lo: float, hi: float) -> bool:
    return lo <= h <= hi if lo <= hi else (h >= lo or h <= hi)


HUE = {"good": (70, 165), "cvd.good": (165, 200), "bad": (345, 20), "neutral": (200, 245)}


def check(style: dict) -> list[str]:
    errs: list[str] = []
    for mode in MODES:
        errs += check_colors(f"{style['meta']['id']}/{mode}", mode, style["color"][mode])
    sid = style["meta"]["id"]
    for role, px in style["typography"]["size"].items():
        if px < 12:
            errs.append(f"{sid}: typography.size.{role} {px} px < 12 px")
    if style["radius"]["mark"] > 4:
        errs.append(f"{sid}: radius.mark {style['radius']['mark']} > 4 px")

    ch = style["chart"]
    overlap = set(ch["banned"]) & (set(ch["allowed"]) | set(ch["onRequest"]))
    if overlap:
        errs.append(f"{sid}: forms both banned and allowed: {sorted(overlap)}")
    for form in ("gauge", "funnel", "radar", "traffic-light"):
        if form not in ch["banned"]:
            errs.append(f"{sid}: {form} must be banned in every style (EX 2.2, EX 2.3, EX 2.5)")
    return errs


def check_colors(sid: str, mode: str, c: dict) -> list[str]:
    errs: list[str] = []
    page = rgb(c["surface"]["page"])
    grounds = {"page": page}
    if c["surface"]["panel"] != "transparent":
        grounds["panel"] = rgb(c["surface"]["panel"], page)

    def need(name, paint, minimum):
        for gname, g in grounds.items():
            r = contrast(rgb(paint, page), g)
            if r < minimum:
                errs.append(f"{sid}: {name} {paint} on {gname} {r:.2f}:1 < {minimum}:1")

    need("text.primary", c["text"]["primary"], 4.5)
    need("text.secondary", c["text"]["secondary"], 4.5)
    need("chart.label", c["chart"]["label"], 4.5)
    r = contrast(rgb(c["text"]["onAccent"]), rgb(c["accent"]["primary"]))
    if r < 4.5:
        errs.append(f"{sid}: text.onAccent on accent.primary {r:.2f}:1 < 4.5:1")

    imp = c["impact"]
    for key in ("good", "bad", "neutral"):
        need(f"impact.{key}", imp[key], 3.0)
        need(f"impact.cvd.{key}", imp["cvd"][key], 3.0)
    for name, paint in (("good", imp["good"]), ("bad", imp["bad"]), ("neutral", imp["neutral"]),
                        ("cvd.good", imp["cvd"]["good"]), ("cvd.bad", imp["cvd"]["bad"]), ("cvd.neutral", imp["cvd"]["neutral"])):
        band = HUE[name.replace("cvd.", "") if name != "cvd.good" else name]
        h, _s = hue(rgb(paint))
        if not in_band(h, *band):
            errs.append(f"{sid}: impact.{name} {paint} hue {h:.0f}° outside {band}")

    for label, g, b in (("", imp["good"], imp["bad"]), ("cvd ", imp["cvd"]["good"], imp["cvd"]["bad"])):
        lg, lb = lum(rgb(g)), lum(rgb(b))
        if mode == "light" and not lg > lb:
            errs.append(f"{sid}: {label}good must be brighter than bad on a light page ({lg:.3f} ≤ {lb:.3f})")
        if mode == "dark" and abs(lg - lb) < 0.08:
            errs.append(f"{sid}: {label}good/bad luminance gap {abs(lg - lb):.3f} < 0.08 on a dark page")

    # AC clearly stronger than PY against where the marks sit (the panel when there is one)
    ground = grounds.get("panel", page)
    ac, py = contrast(rgb(c["scenario"]["ac"]), ground), contrast(rgb(c["scenario"]["py"]), ground)
    if ac < 1.5 * py:
        errs.append(f"{sid}: AC contrast {ac:.2f} is not ≥ 1.5 × PY contrast {py:.2f}")
    # AC, PL (outline) and FC (hatch stripes) are the marks that carry the notation: non-text contrast 3:1 (WCAG 1.4.11)
    for key in ("ac", "pl", "fc"):
        need(f"scenario.{key}", c["scenario"][key], 3.0)

    for key in ("primary", "highlight"):
        h, s = hue(rgb(c["accent"][key]))
        if s > 0.25 and (in_band(h, *HUE["good"]) or in_band(h, *HUE["bad"])):
            errs.append(f"{sid}: accent.{key} {c['accent'][key]} sits in an impact hue family (green or red)")
    return errs


def css_vars(style: dict) -> str:
    """Flatten the token tree into --rs-* custom properties: layout on [data-style=<id>], colours on
    [data-style=<id>][data-theme=<mode>], and the light colours again under @media print (print is always light)."""
    lines: list[str] = []

    def walk(node, path):
        if isinstance(node, dict):
            for k, v in node.items():
                walk(v, path + [re.sub(r"(?<!^)(?=[A-Z])", "-", k).lower()])
        elif isinstance(node, (str, int, float)) and not isinstance(node, bool):
            unit = "px" if path[0] in ("radius",) or path[:2] == ["typography", "size"] or path[:2] in (["density", "gap"], ["density", "pad"]) else ""
            lines.append(f"  --rs-{'-'.join(path)}: {node}{unit};")

    def block(selector, groups):
        lines.clear()
        for node, path in groups:
            walk(node, path)
        return f"{selector} {{\n" + "\n".join(lines) + "\n}\n"

    sid = style["meta"]["id"]
    m = style["motion"]
    layout = block(f'[data-style="{sid}"]', [(style[g], [g]) for g in ("typography", "radius", "density")])
    layout = layout.replace("\n}\n", f"\n  --rs-motion-duration: {m['durationMs'] if m['enabled'] else 0}ms;\n  --rs-motion-easing: {m['easing']};\n}}\n")
    out = [f"/* Generated by scripts/build_styles.py from assets/tokens/{sid}.json; do not edit. */\n", layout]
    for mode in MODES:
        out.append(block(f'[data-style="{sid}"][data-theme="{mode}"]', [(style["color"][mode], ["color"])]))
    out.append("@media print {\n" + block(f'[data-style="{sid}"][data-theme]', [(style["color"]["light"], ["color"])]) + "}\n")
    return "".join(out)


def grey_like(paint: str) -> str:
    """A neutral grey with the same relative luminance as `paint` (fallback series must not carry hue)."""
    y = lum(rgb(paint))
    v = 12.92 * y if y <= 0.0031308 else 1.055 * y ** (1 / 2.4) - 0.055
    h = f"{round(v * 255):02X}"
    return f"#{h}{h}{h}"


def solid(paint: str, page: str) -> str:
    """A paint as an opaque hex (transparent → the page), for tools that take no alpha."""
    return page if paint == "transparent" else paint


def dtcg(style: dict) -> dict:
    """The style as DTCG tokens ($value/$type), colour sets per mode, plus the chart grammar as an extension."""
    def tree(node, typ):
        if isinstance(node, dict):
            return {k: tree(v, typ) for k, v in node.items()}
        return {"$value": node, "$type": typ}

    sid = style["meta"]["id"]
    out = {
        "$description": f"{style['meta']['label']} · {style['meta']['persona']}: {style['meta']['summary']} "
                        f"Generated from report-styles/assets/tokens/{sid}.json; do not edit.",
        "color": {m: tree(style["color"][m], "color") for m in MODES},
        "typography": {
            "family": tree(style["typography"]["family"], "fontFamily"),
            "weight": tree(style["typography"]["weight"], "fontWeight"),
            "size": {k: {"$value": f"{v}px", "$type": "dimension"} for k, v in style["typography"]["size"].items()},
        },
        "radius": {k: {"$value": f"{v}px", "$type": "dimension"} for k, v in style["radius"].items()},
        "density": {k: {"$value": f"{v}px" if k in ("gap", "pad") else v, "$type": "dimension" if k in ("gap", "pad") else "number"}
                    for k, v in style["density"].items()},
        "motion": {"duration": {"$value": f"{style['motion']['durationMs'] if style['motion']['enabled'] else 0}ms", "$type": "duration"},
                   "easing": {"$value": style["motion"]["easing"], "$type": "cubicBezier" if style["motion"]["easing"].startswith("cubic") else "string"}},
        "$extensions": {"report-styles": {"meta": style["meta"], "chart": style["chart"]}},
    }
    return out


# Power BI has no web fonts in themes: each style maps to installed faces
PBI_FONTS = {
    "ibcs": {"text": "Segoe UI", "title": "Segoe UI Semibold", "figure": "Segoe UI Semibold"},
    "showcase": {"text": "Segoe UI", "title": "Segoe UI Semibold", "figure": "Segoe UI Semibold"},
    "soft": {"text": "Segoe UI", "title": "Segoe UI Semibold", "figure": "Segoe UI Bold"},
    "graphic": {"text": "Segoe UI", "title": "Georgia", "figure": "Segoe UI Semibold"},
}


def pbi_theme(style: dict, mode: str, cvd: bool) -> dict:
    """A Power BI report theme: page and visual chrome, text classes, data colours, impact colours."""
    sid = style["meta"]["id"]
    c = style["color"][mode]
    page = c["surface"]["page"]
    panel = solid(c["surface"]["panel"], page)
    imp = c["impact"]["cvd"] if cvd else c["impact"]
    fonts = PBI_FONTS[sid]
    sc = lambda color: {"solid": {"color": color}}  # noqa: E731
    boxed = c["surface"]["panel"] != "transparent"
    radius = style["radius"]["panel"]
    text = lambda face, size, color: {"fontFace": face, "fontSize": size, "color": color}  # noqa: E731
    pt = lambda px: round(px * 0.75)  # noqa: E731  (CSS px → Power BI pt)
    t = style["typography"]["size"]
    name = f"{sid}-pbi-theme-{mode}{'-cvd' if cvd else ''}"
    visual = {
        "background": [{"show": boxed, "color": sc(panel), "transparency": 0}],
        "border": [{"show": sid == "showcase", "color": sc(solid(c["surface"]["edge"], page)), "radius": radius}],
        "dropShadow": [{"show": sid == "soft" and mode == "light"}],
        "visualHeader": [{"show": False}],
        "title": [{"show": True, "fontFamily": fonts["title"], "fontSize": pt(t["title"]), "fontColor": sc(c["text"]["primary"]),
                   "bold": False, "alignment": "left"}],
        "subTitle": [{"show": True, "fontFamily": fonts["text"], "fontSize": pt(t["label"]), "fontColor": sc(c["text"]["secondary"])}],
        "labels": [{"show": True, "fontFamily": fonts["text"], "fontSize": pt(t["label"]), "color": sc(c["chart"]["label"])}],
        "categoryAxis": [{"show": True, "gridlineShow": False, "showAxisTitle": False, "fontFamily": fonts["text"],
                          "fontSize": pt(t["label"]), "labelColor": sc(c["text"]["secondary"])}],
        "valueAxis": [{"show": style["chart"]["gridlines"] == "faint", "gridlineShow": style["chart"]["gridlines"] == "faint",
                       "gridlineColor": sc(solid(c["chart"]["grid"], page)), "showAxisTitle": False,
                       "fontFamily": fonts["text"], "fontSize": pt(t["label"]), "labelColor": sc(c["text"]["secondary"])}],
        "legend": [{"show": False, "fontFamily": fonts["text"], "fontSize": pt(t["label"])}],
    }
    return {
        "$schema": PBI_SCHEMA,
        "name": name,
        # AC first, PY second; further series fall back to quiet greys of the mode, never impact colours
        "dataColors": [c["scenario"]["ac"], c["scenario"]["py"], grey_like(c["text"]["secondary"]), grey_like(solid(c["surface"]["edge"], page))],
        "good": imp["good"], "bad": imp["bad"], "neutral": imp["neutral"],
        "maximum": c["scenario"]["ac"], "center": c["scenario"]["py"], "minimum": panel,
        "foreground": c["text"]["primary"], "foregroundNeutralSecondary": c["text"]["secondary"],
        "background": panel, "backgroundLight": panel, "secondaryBackground": page,
        "tableAccent": c["scenario"]["ac"], "hyperlink": c["accent"]["highlight"], "visitedHyperlink": c["accent"]["highlight"],
        "textClasses": {
            "callout": text(fonts["figure"], pt(t["figure"]), c["text"]["primary"]),
            "title": text(fonts["title"], pt(t["title"]), c["text"]["primary"]),
            "header": text(fonts["title"], pt(t["label"]), c["text"]["primary"]),
            "label": text(fonts["text"], pt(t["label"]), c["text"]["primary"]),
            "largeTitle": text(fonts["title"], pt(t["message"]), c["text"]["primary"]),
        },
        "visualStyles": {
            "*": {"*": visual},
            "page": {"*": {"background": [{"color": sc(page), "transparency": 0}], "outspace": [{"color": sc(page), "transparency": 0}]}},
        },
    }


def deneb_overrides(style: dict, mode: str) -> dict:
    """Overrides for the ibcs-deneb plugin's tokens (ibcs-tokens.json paths, DTCG $value leaves).
    Use: sync_tokens.py --overrides <this file> --out ./deneb-<style>-<mode> (add --variant cvd for the CVD set)."""
    c = style["color"][mode]
    page = c["surface"]["page"]
    ground = solid(c["surface"]["panel"], page)  # a Deneb visual sits on the visual background
    v = lambda x: {"$value": x}  # noqa: E731
    on_ac = "#FFFFFF" if contrast(rgb("#FFFFFF"), rgb(c["scenario"]["ac"])) >= contrast(rgb(ground), rgb(c["scenario"]["ac"])) else ground
    out = {
        "$description": f"report-styles: {style['meta']['label']} ({mode}) for the ibcs-deneb templates. Generated; do not edit.",
        "color": {
            "scenario": {
                "ac": v(c["scenario"]["ac"]), "py": v(c["scenario"]["py"]),
                "pl": {"fill": v(ground), "stroke": v(c["scenario"]["pl"])},
                "fc": {"ground": v(ground), "stripe": v(c["scenario"]["fc"]), "stroke": v(c["scenario"]["fc"])},
            },
            "variance": {"good": v(c["impact"]["good"]), "bad": v(c["impact"]["bad"]), "neutral": v(c["impact"]["neutral"]),
                         "cvd": {k: v(x) for k, x in c["impact"]["cvd"].items()}},
            "text": {"primary": v(c["text"]["primary"]), "secondary": v(c["text"]["secondary"]), "onDark": v(on_ac)},
            "background": {"page": v(ground)},
            "axis": {"category": v(c["chart"]["axis"] if c["chart"]["axis"].startswith("#") else c["text"]["secondary"]),
                     "pyReference": v(c["scenario"]["py"]), "plReference": v(c["scenario"]["pl"])},
            "marker": {"highlight": v(c["accent"]["highlight"]), "annotationRef": v(c["accent"]["highlight"])},
        },
        "typography": {"family": {"powerbi": v([PBI_FONTS[style["meta"]["id"]]["text"], PBI_FONTS[style["meta"]["id"]]["title"]])}},
    }
    if c["chart"]["grid"] != "transparent":
        out["color"]["axis"]["grid"] = v(c["chart"]["grid"])
    return out


def ts_module(styles: dict) -> str:
    body = json.dumps(styles, indent=2, ensure_ascii=False)
    return ("// Generated by scripts/build_styles.py from assets/tokens/<id>.json; do not edit.\n"
            f"export const STYLE_TOKENS = {body} as const;\n\n"
            "export type StyleId = keyof typeof STYLE_TOKENS;\n"
            f"export const STYLE_IDS = {json.dumps(list(styles))} as const satisfies readonly StyleId[];\n")


def outputs(styles: dict) -> dict[Path, str]:
    dump = lambda obj: json.dumps(obj, indent=2, ensure_ascii=False) + "\n"  # noqa: E731
    out: dict[Path, str] = {REACT / "tokens.generated.ts": ts_module(styles)}
    for sid, s in styles.items():
        out[REACT / "styles" / f"tokens-{sid}.css"] = css_vars(s)
        assets = SKILLS / f"style-{sid}" / "assets"
        out[assets / f"{sid}.tokens.json"] = dump(dtcg(s))
        for mode in MODES:
            if sid == "ibcs" and mode == "light":
                continue  # the ibcs-power-bi plugin's theme and the ibcs-deneb defaults are IBCS light
            for cvd in (False, True):
                out[assets / "power-bi" / f"{sid}-pbi-theme-{mode}{'-cvd' if cvd else ''}.json"] = dump(pbi_theme(s, mode, cvd))
            out[assets / "deneb" / f"{sid}-{mode}.overrides.json"] = dump(deneb_overrides(s, mode))
    return out


def main(argv: list[str]) -> int:
    check_only = "--check" in argv
    styles = {sid: json.loads((TOKENS / f"{sid}.json").read_text(encoding="utf-8")) for sid in STYLE_IDS}
    errs: list[str] = []
    try:
        import jsonschema  # type: ignore
    except ImportError:
        print("note: jsonschema not installed, schema step skipped (uv run --with jsonschema …)")
    else:
        schema = json.loads((TOKENS / "contract.schema.json").read_text(encoding="utf-8"))
        for sid, s in styles.items():
            for e in jsonschema.Draft202012Validator(schema).iter_errors(s):
                errs.append(f"{sid}: schema: {'/'.join(map(str, e.absolute_path))}: {e.message}")
            if s["meta"]["id"] != sid:
                errs.append(f"{sid}: meta.id is {s['meta']['id']!r}")
    for s in styles.values():
        errs += check(s)

    files = outputs(styles)
    stale = [str(f.relative_to(SKILLS)) for f, text in files.items() if not f.exists() or f.read_text(encoding="utf-8") != text]
    if check_only and stale:
        errs.append(f"generated files are stale: {stale} (run python3 -I scripts/build_styles.py)")
    for e in errs:
        print("FAIL", e)
    if errs:
        return 1
    if not check_only:
        for f, text in files.items():
            f.parent.mkdir(parents=True, exist_ok=True)
            f.write_text(text, encoding="utf-8")
    print(f"ok: {len(styles)} styles checked" + ("" if check_only else f", wrote {len(files)} files"))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
