// Playground: try every style, theme and width on your own numbers. The report runs in an iframe (index.html?embed=1)
// at the chosen width, so phone and desktop layouts are the real ones; this page sends the data and settings and shows
// the checks the report runs on itself after every change.
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./playground.css";
import { SAMPLE, STYLE_IDS, STYLE_TOKENS, type KeyFiguresInput, type Kind, type Polarity, type StyleId, type Theme } from "../src/report-styles";
import { HR_FIXTURE, SERVICE_FIXTURE, STRESS_FIXTURE } from "../src/report-styles/fixtures";
import type { CheckResult } from "./selfcheck";

const PRESETS: Record<string, { label: string; data: KeyFiguresInput }> = {
  sample: { label: "Sales — months and regions", data: SAMPLE },
  people: { label: "People — quarters, a lower-is-better structure", data: HR_FIXTURE },
  service: { label: "Customer service — large counts, a score, a mix", data: SERVICE_FIXTURE },
  stress: { label: "Stress — long names, big numbers, 24 months", data: STRESS_FIXTURE },
};
const WIDTHS = [{ v: 1280, label: "Desktop 1280" }, { v: 820, label: "Tablet 820" }, { v: 390, label: "Phone 390" }];
const KINDS: Kind[] = ["amount", "count", "rate", "score"];
const POLARITIES: { v: Polarity; label: string }[] = [{ v: 1, label: "more is better" }, { v: -1, label: "less is better" }, { v: 0, label: "neutral (a mix)" }];
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const slug = (s: string, used: Set<string>) => {
  const base = s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
  let k = base, i = 2;
  while (used.has(k)) k = `${base}-${i++}`;
  return k;
};

/** What the components need; the playground refuses to send anything else, and says why. */
function validate(d: KeyFiguresInput): string[] {
  const e: string[] = [];
  const num = (x: unknown, where: string) => { if (typeof x !== "number" || !Number.isFinite(x)) e.push(`${where}: not a number`); };
  if (!Array.isArray(d.kpis) || d.kpis.length !== 4) e.push("kpis: exactly four KPI tiles");
  d.kpis?.forEach((k, i) => {
    num(k.ac, `KPI ${i + 1} AC`); num(k.py, `KPI ${i + 1} PY`);
    if (!KINDS.includes(k.kind)) e.push(`KPI ${i + 1}: kind must be ${KINDS.join(", ")}`);
    if (![1, -1, 0].includes(k.polarity)) e.push(`KPI ${i + 1}: polarity must be 1, -1 or 0`);
    if (!Number.isInteger(k.decimals) || k.decimals < 0 || k.decimals > 3) e.push(`KPI ${i + 1}: decimals 0–3`);
  });
  if (new Set(d.kpis?.map((k) => k.key)).size !== d.kpis?.length) e.push("kpis: keys must be unique");
  if (!d.time?.points || d.time.points.length < 2) e.push("time: at least two points");
  d.time?.points?.forEach((p, i) => { num(p.ac, `time point ${i + 1} AC`); num(p.py, `time point ${i + 1} PY`); });
  if (!d.structure?.items || d.structure.items.length < 1) e.push("structure: at least one item");
  d.structure?.items?.forEach((p, i) => { num(p.ac, `item ${i + 1} AC`); num(p.py, `item ${i + 1} PY`); });
  if (new Set(d.structure?.items?.map((x) => x.key)).size !== d.structure?.items?.length) e.push("structure: item keys must be unique");
  for (const m of [d.time, d.structure]) if (m && (!Number.isInteger(m.decimals) || m.decimals < 0 || m.decimals > 3)) e.push(`${m.title}: decimals 0–3`);
  for (const [side, key] of Object.entries(d.totals ?? {})) if (key && !d.kpis?.some((k) => k.key === key)) e.push(`totals.${side}: no KPI "${key}"`);
  return e;
}

function Seg<T extends string | number>({ items, value, onChange, label }: { items: { v: T; label: string }[]; value: T; onChange(v: T): void; label: string }) {
  return (
    <div className="pg-seg" role="radiogroup" aria-label={label}>
      {items.map((o) => <button key={String(o.v)} type="button" role="radio" aria-checked={o.v === value} onClick={() => onChange(o.v)}>{o.label}</button>)}
    </div>
  );
}

function NumIn({ value, onChange, step = "any", label }: { value: number; onChange(v: number): void; step?: string; label: string }) {
  const [text, setText] = useState(String(value));
  useEffect(() => { if (Number(text) !== value) setText(String(value)); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <input className="pg-num" aria-label={label} inputMode="decimal" value={text} step={step}
    onChange={(e) => { setText(e.target.value); const n = Number(e.target.value.replace(",", ".")); if (e.target.value.trim() !== "" && Number.isFinite(n)) onChange(n); }} />;
}

function Playground() {
  const [preset, setPreset] = useState("sample");
  const [data, setData] = useState<KeyFiguresInput>(clone(SAMPLE));
  const [style, setStyle] = useState<StyleId>("ibcs");
  const [theme, setTheme] = useState<Theme>(window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const [cvd, setCvd] = useState(false);
  const [width, setWidth] = useState(1280);
  const [tab, setTab] = useState<"form" | "json">("form");
  const [json, setJson] = useState(() => JSON.stringify(SAMPLE, null, 2));
  const [jsonError, setJsonError] = useState("");
  const [checks, setChecks] = useState<CheckResult[] | null>(null);
  const [frameH, setFrameH] = useState(900);
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(1000);
  // the report loads once; later changes go by message, so switching never reloads it
  const [src] = useState(() => `index.html?embed=1&style=${style}&theme=${theme}`);

  const errors = useMemo(() => validate(data), [data]);
  const post = useCallback((msg: unknown) => frame.current?.contentWindow?.postMessage(msg, "*"), []);
  const update = (fn: (d: KeyFiguresInput) => void) => setData((d) => { const n = clone(d); fn(n); return n; });

  // send data and settings to the report; it answers with checks and its height
  useEffect(() => { if (errors.length === 0) post({ type: "rs:data", data }); }, [data, errors, post]);
  useEffect(() => { post({ type: "rs:set", style, theme, cvd }); }, [style, theme, cvd, post]);
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "rs:ready") { post({ type: "rs:set", style, theme, cvd }); if (validate(data).length === 0) post({ type: "rs:data", data }); }
      if (e.data?.type === "rs:checks") {
        setChecks(e.data.results);
        setFrameH(e.data.height);
        if (e.data.style !== style) setStyle(e.data.style); // the reader used the switch inside the report
        if (e.data.theme !== theme) setTheme(e.data.theme);
      }
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [data, style, theme, cvd, post]);
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => { setJson(JSON.stringify(data, null, 2)); }, [data]);
  useEffect(() => { document.documentElement.dataset.pgTheme = theme; }, [theme]);

  const scale = Math.min(1, (stageW - 32) / width);
  const loadPreset = (k: string) => { setPreset(k); setData(clone(PRESETS[k]!.data)); };
  const quick = {
    randomise: () => update((d) => {
      const r = (x: number, dec: number) => Math.max(0, Math.round(x * (0.85 + Math.random() * 0.3) * 10 ** dec) / 10 ** dec);
      d.kpis.forEach((k) => { k.ac = r(k.ac, k.decimals); });
      d.time.points.forEach((p) => { p.ac = r(p.ac, d.time.decimals); });
      d.structure.items.forEach((p) => { p.ac = r(p.ac, d.structure.decimals); });
    }),
    longNames: () => update((d) => { d.structure.items.forEach((p) => { p.name = p.name + " and surrounding area"; }); }),
    large: () => update((d) => {
      d.time.points.forEach((p) => { p.ac *= 1000; p.py *= 1000; }); d.structure.items.forEach((p) => { p.ac *= 1000; p.py *= 1000; });
      // KPIs that are totals of the cards scale with them, so the totals check keeps holding
      d.kpis.forEach((k) => { if (k.key === d.totals?.time || k.key === d.totals?.structure) { k.ac *= 1000; k.py *= 1000; k.decimals = 0; k.unit = k.unit.replace(/^m/, "k"); } });
      d.time.decimals = 0; d.structure.decimals = 0; d.time.unit = d.time.unit.replace(/^m/, "k"); d.structure.unit = d.structure.unit.replace(/^m/, "k");
    }),
    manyPoints: () => update((d) => {
      const base = d.time.points.at(-1)!;
      for (let i = d.time.points.length; i < 24; i++) d.time.points.push({ label: `P${i + 1}`, ac: base.ac * (0.9 + Math.random() * 0.2), py: base.py });
    }),
  };

  return (
    <div className="pg">
      <aside className="pg-side">
        <h1>Report styles playground</h1>
        <p className="pg-dim">The page on the right is the real component in an iframe at the chosen width. Change anything; the checks below run on every render.</p>

        <section>
          <h2>View</h2>
          <label className="pg-row">Style
            <select value={style} onChange={(e) => setStyle(e.target.value as StyleId)}>
              {STYLE_IDS.map((s) => <option key={s} value={s}>{STYLE_TOKENS[s].meta.label} · {STYLE_TOKENS[s].meta.persona}</option>)}
            </select>
          </label>
          <p className="pg-note">{style === "ibcs" ? "Follows the IBCS® Standards." : "Not IBCS-compliant: borrows elements of the IBCS notation and relaxes its presentation rules."}</p>
          <div className="pg-row">Theme <Seg<Theme> label="Theme" items={[{ v: "light" as Theme, label: "Light" }, { v: "dark" as Theme, label: "Dark" }]} value={theme} onChange={setTheme} /></div>
          <div className="pg-row">Width <Seg<number> label="Width" items={WIDTHS} value={width} onChange={setWidth} /></div>
          <label className="pg-row pg-check"><input type="checkbox" checked={cvd} onChange={(e) => setCvd(e.target.checked)} /> Colour-blind-safe colours (CVD)</label>
        </section>

        <section>
          <h2>Data</h2>
          <label className="pg-row">Preset
            <select value={preset} onChange={(e) => loadPreset(e.target.value)}>
              {Object.entries(PRESETS).map(([k, p]) => <option key={k} value={k}>{p.label}</option>)}
            </select>
          </label>
          <div className="pg-buttons">
            <button type="button" onClick={() => loadPreset(preset)}>Reset</button>
            <button type="button" onClick={quick.randomise}>Randomise actuals</button>
            <button type="button" onClick={quick.longNames}>Long names</button>
            <button type="button" onClick={quick.large}>× 1000</button>
            <button type="button" onClick={quick.manyPoints}>24 points</button>
          </div>
          <Seg<"form" | "json"> label="Editor" items={[{ v: "form" as const, label: "Form" }, { v: "json" as const, label: "JSON" }]} value={tab} onChange={setTab} />

          {tab === "form" ? (
            <div className="pg-form">
              <h3>Page</h3>
              {(["title", "company", "period", "unitNote", "acLabel", "pyLabel"] as const).map((f) => (
                <label key={f} className="pg-row">{f}<input value={(data[f] as string) ?? ""} onChange={(e) => update((d) => { (d as unknown as Record<string, string>)[f] = e.target.value; })} /></label>
              ))}

              <h3>KPI tiles</h3>
              <table className="pg-table"><thead><tr><th>label</th><th>unit</th><th>AC</th><th>PY</th><th>dec</th><th>kind</th><th>polarity</th></tr></thead>
                <tbody>{data.kpis.map((k, i) => (
                  <tr key={k.key}>
                    <td><input value={k.label} aria-label="KPI label" onChange={(e) => update((d) => { d.kpis[i]!.label = e.target.value; })} /></td>
                    <td><input className="pg-short" value={k.unit} aria-label="KPI unit" onChange={(e) => update((d) => { d.kpis[i]!.unit = e.target.value; })} /></td>
                    <td><NumIn label="KPI AC" value={k.ac} onChange={(v) => update((d) => { d.kpis[i]!.ac = v; })} /></td>
                    <td><NumIn label="KPI PY" value={k.py} onChange={(v) => update((d) => { d.kpis[i]!.py = v; })} /></td>
                    <td><NumIn label="KPI decimals" value={k.decimals} onChange={(v) => update((d) => { d.kpis[i]!.decimals = Math.round(v); })} /></td>
                    <td><select value={k.kind} aria-label="KPI kind" onChange={(e) => update((d) => { d.kpis[i]!.kind = e.target.value as Kind; })}>{KINDS.map((x) => <option key={x}>{x}</option>)}</select></td>
                    <td><select value={k.polarity} aria-label="KPI polarity" onChange={(e) => update((d) => { d.kpis[i]!.polarity = Number(e.target.value) as Polarity; })}>{POLARITIES.map((x) => <option key={x.v} value={x.v}>{x.label}</option>)}</select></td>
                  </tr>
                ))}</tbody></table>

              {(["time", "structure"] as const).map((side) => {
                const m = data[side];
                const rows = side === "time" ? data.time.points.map((p) => ({ name: p.label, ac: p.ac, py: p.py })) : data.structure.items.map((p) => ({ name: p.name, ac: p.ac, py: p.py }));
                return (
                  <div key={side}>
                    <h3>{side === "time" ? "Time card (left)" : "Structure card (right)"}</h3>
                    <label className="pg-row">title<input value={m.title} onChange={(e) => update((d) => { d[side].title = e.target.value; })} /></label>
                    <div className="pg-inline">
                      <label>unit<input className="pg-short" value={m.unit} onChange={(e) => update((d) => { d[side].unit = e.target.value; })} /></label>
                      <label>dec<NumIn label="decimals" value={m.decimals} onChange={(v) => update((d) => { d[side].decimals = Math.round(v); })} /></label>
                      <label>polarity<select value={m.polarity} onChange={(e) => update((d) => { d[side].polarity = Number(e.target.value) as Polarity; })}>{POLARITIES.map((x) => <option key={x.v} value={x.v}>{x.label}</option>)}</select></label>
                      <label>total of<select value={data.totals?.[side] ?? ""} onChange={(e) => update((d) => { d.totals = { ...d.totals, [side]: e.target.value || undefined }; })}>
                        <option value="">— not checked —</option>{data.kpis.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}</select></label>
                    </div>
                    <table className="pg-table"><thead><tr><th>{side === "time" ? "label" : "name"}</th><th>AC</th><th>PY</th><th /></tr></thead>
                      <tbody>{rows.map((r, i) => (
                        <tr key={i}>
                          <td><input value={r.name} aria-label="name" onChange={(e) => update((d) => { if (side === "time") d.time.points[i]!.label = e.target.value; else d.structure.items[i]!.name = e.target.value; })} /></td>
                          <td><NumIn label="AC" value={r.ac} onChange={(v) => update((d) => { (side === "time" ? d.time.points : d.structure.items)[i]!.ac = v; })} /></td>
                          <td><NumIn label="PY" value={r.py} onChange={(v) => update((d) => { (side === "time" ? d.time.points : d.structure.items)[i]!.py = v; })} /></td>
                          <td><button type="button" aria-label="Remove row" onClick={() => update((d) => { (side === "time" ? d.time.points : d.structure.items).splice(i, 1); })}>×</button></td>
                        </tr>
                      ))}</tbody></table>
                    <button type="button" onClick={() => update((d) => {
                      if (side === "time") d.time.points.push({ label: `P${d.time.points.length + 1}`, ac: d.time.points.at(-1)?.ac ?? 1, py: d.time.points.at(-1)?.py ?? 1 });
                      else { const used = new Set(d.structure.items.map((x) => x.key)); d.structure.items.push({ key: slug("New item", used), name: "New item", ac: 1, py: 1 }); }
                    })}>Add {side === "time" ? "point" : "item"}</button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="pg-json">
              <textarea value={json} spellCheck={false} aria-label="Report input as JSON" onChange={(e) => setJson(e.target.value)} />
              <div className="pg-buttons">
                <button type="button" onClick={() => {
                  try { const d = JSON.parse(json) as KeyFiguresInput; const errs = validate(d); setJsonError(errs.join("; ")); if (!errs.length) setData(d); }
                  catch (err) { setJsonError(String(err)); }
                }}>Apply</button>
                <button type="button" onClick={() => navigator.clipboard?.writeText(json)}>Copy</button>
              </div>
              {jsonError && <p className="pg-error">{jsonError}</p>}
            </div>
          )}
          {errors.length > 0 && <div className="pg-error"><strong>Not sent to the report:</strong><ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul></div>}
        </section>

        <section>
          <h2>Checks</h2>
          {!checks ? <p className="pg-dim">Waiting for the report…</p> : (
            <ul className="pg-checks">
              {checks.map((c) => (
                <li key={c.id} className={c.ok ? "ok" : "fail"}>
                  <span aria-hidden="true">{c.ok ? "✓" : "✗"}</span> {c.label}
                  {!c.ok && c.detail.length > 0 && <ul>{c.detail.slice(0, 8).map((d) => <li key={d}>{d}</li>)}</ul>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>

      <main className="pg-stage" ref={stage}>
        <div className="pg-bar">
          <span>{STYLE_TOKENS[style].meta.label} · {theme} · {width} px{scale < 1 ? ` (shown at ${Math.round(scale * 100)} %)` : ""}</span>
          <a href={`index.html?style=${style}&theme=${theme}`} target="_blank" rel="noreferrer">Open the page alone</a>
        </div>
        <div className="pg-frame" style={{ width: width * scale, height: frameH * scale }}>
          <iframe ref={frame} title="Report preview" src={src}
            style={{ width, height: frameH, transform: `scale(${scale})` }} />
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("pg")!).render(<Playground />);
