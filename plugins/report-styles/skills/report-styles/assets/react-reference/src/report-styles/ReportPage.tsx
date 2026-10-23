import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ScaleProvider } from "./scale";
import type { Kpi, KeyFiguresVM, Tone } from "./viewModel";

// The page skeleton every style shares, in this order and these grid positions:
//   header (title, scope) · key message · four KPI tiles in one row · [time card | structure card] · footer.
// A style supplies parts (StyleParts); it cannot move a section. Horizontal geometry is fixed in base.css.

export const glyph = (d: number) => (d > 0 ? "▲" : d < 0 ? "▼" : "");

/** A number in HTML. data-k ties it to the view model; the reconcile test compares every data-k text across styles. */
export function Num({ text, k, tone }: { text: string; k?: string; tone?: Tone | "value" }) {
  return <span className={`rs-n${tone ? " tone-" + tone : ""}`} data-k={k}>{text}</span>;
}

export interface Terms { py: string; delta: string }
export interface CardPart {
  sub: ReactNode;
  legend?: ReactNode;
  /** An SVG chart drawn at the card's measured width, or `body` for a non-chart part (a table). */
  chart?: (width: number) => ReactNode;
  body?: ReactNode;
}
export interface StyleParts { terms?: Partial<Terms>; kicker?: ReactNode; time: CardPart; structure: CardPart }

/** One KPI tile, the same fields in every style: label and unit, AC, ΔPY (abs, and Δ% unless a rate), PY. */
export function KpiTile({ k, terms }: { k: Kpi; terms: Terms }) {
  const lead = k.kind === "rate" ? k.absDir : k.relDir;
  return (
    <div className="rs-tile rs-anim">
      <div className="k-label">{k.label}{k.unit ? <span className="k-lu">, {k.unit}</span> : null}</div>
      <div className="k-value"><Num text={k.acText} k={k.key + ".ac"} /></div>
      <div className="k-var">
        <span className="k-dl">{terms.delta}</span>
        <span className={`k-d tone-${k.absTone}`}><span className="k-g">{glyph(lead)}</span> <Num text={k.absText} k={k.key + ".abs"} /></span>
        {k.relText ? <span className={`k-d tone-${k.relTone}`}><Num text={k.relText} k={k.key + ".rel"} /></span> : null}
      </div>
      <div className="k-ref">{terms.py} <Num text={k.pyText} k={k.key + ".py"} /></div>
    </div>
  );
}

export function KeyMessage({ vm }: { vm: KeyFiguresVM }) {
  return <p className="rs-message">{vm.message.map((p, i) => (p.k ? <Num key={i} text={p.t} k={p.k} tone={p.tone} /> : <span key={i}>{p.t}</span>))}</p>;
}

/** The scenario notation key, painted from the current mode's tokens: AC solid, PY lighter, PL outlined, FC hatched. */
export function NotationKey() {
  const id = useId().replace(/:/g, "");
  const w = 16, h = 11;
  const items: [string, ReactNode][] = [
    ["AC", <rect width={w} height={h} className="f-ac" />],
    ["PY", <rect width={w} height={h} className="f-py" />],
    ["PL", <rect x={0.75} y={0.75} width={w - 1.5} height={h - 1.5} className="f-page s-pl" strokeWidth={1.5} />],
    ["FC", <rect x={0.75} y={0.75} width={w - 1.5} height={h - 1.5} fill={`url(#${id})`} className="s-fc" strokeWidth={1.5} />],
  ];
  return (
    <span className="rs-notation">
      <svg width={4 * 46 - 8} height={16} viewBox={`0 0 ${4 * 46 - 8} 16`} role="img" aria-label="Notation: AC solid, PY lighter, PL outlined, FC hatched">
        <defs><pattern id={id} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width={4} height={4} className="f-page" /><line x1={0} y1={0} x2={0} y2={4} className="s-fc" strokeWidth={2} /></pattern></defs>
        {items.map(([label, mark], i) => <g key={label}><g transform={`translate(${i * 46},2)`}>{mark}</g><text x={i * 46 + w + 5} y={12}>{label}</text></g>)}
      </svg>
    </span>
  );
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Measures its own width and draws the chart at it; `initialWidth` serves server rendering and tests. */
export function ChartSlot({ draw, initialWidth = 0 }: { draw: (w: number) => ReactNode; initialWidth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(initialWidth);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setW(Math.floor(el.clientWidth)));
    ro.observe(el);
    setW(Math.floor(el.clientWidth));
    return () => ro.disconnect();
  }, []);
  return <div className="rs-chart" ref={ref}>{w > 0 ? draw(w) : null}</div>;
}

export interface ReportPageProps {
  vm: KeyFiguresVM;
  parts: StyleParts;
  /** Chart width before layout (server rendering, tests); the browser measures. */
  initialChartWidth?: { time: number; structure: number };
  footnote?: ReactNode;
}

export function ReportPage({ vm, parts, initialChartWidth, footnote }: ReportPageProps) {
  const terms: Terms = { py: "PY", delta: "ΔPY", ...parts.terms };
  const card = (cls: "time" | "structure", title: string, part: CardPart) => (
    <section className={`rs-card rs-${cls} rs-anim`}>
      <h2>{title}</h2>
      <p className="rs-sub">{part.sub}</p>
      {part.legend}
      {part.body ?? <ChartSlot draw={part.chart!} initialWidth={initialChartWidth?.[cls]} />}
    </section>
  );
  return (
    <main className="rs-page">
      <header className="rs-head">{parts.kicker}<h1 className="rs-title">{vm.title}</h1><p className="rs-scope">{vm.scope}</p></header>
      {vm.checks.length > 0 && (
        <p className="rs-check" role="alert"><strong>Data check:</strong> {vm.checks.join(" ")} Fix the source before relying on this page.</p>
      )}
      <div className="rs-msg"><KeyMessage vm={vm} /></div>
      <div className="rs-kpis">{vm.kpis.map((k) => <KpiTile key={k.key} k={k} terms={terms} />)}</div>
      {/* one scale registry for the page: charts of the same unit share px per unit (CH 4.1) */}
      <ScaleProvider><div className="rs-row-2">{card("time", vm.time.title, parts.time)}{card("structure", vm.structure.title, parts.structure)}</div></ScaleProvider>
      <footer className="rs-foot"><span>{footnote ?? "Δ% is N/A where the reference is zero or blank; a variance shown as zero has no colour."}</span><NotationKey /></footer>
    </main>
  );
}
