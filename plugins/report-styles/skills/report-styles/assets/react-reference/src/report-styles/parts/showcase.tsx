import type { StyleParts } from "../ReportPage";
import { keep, type KeyFiguresVM, tickText } from "../viewModel";
import { f, mlabel, path, S, Svg, T, textWidth } from "./svg";

// Showcase: a line chart (AC amber, PY slate, the gap shaded by impact) with a ΔPY% strip below, and a ranked
// dumbbell for the regions. Amber is AC and nothing else.

export function showcaseParts(vm: KeyFiguresVM, { phone }: { phone: boolean }): StyleParts {
  const legend = <div className="rs-legend"><span><i className="ac" />AC {vm.acLabel}</span><span><i className="py" />PY {vm.pyLabel}</span></div>;
  return {
    time: { sub: `${vm.time.unit} · AC ${vm.acLabel} against PY ${vm.pyLabel} · ΔPY% below`, legend, chart: (w) => <River vm={vm} w={w} phone={phone} /> },
    structure: { sub: `${vm.structure.unit} · ranked by AC ${vm.acLabel} · dot = AC, ring = PY ${vm.pyLabel} · ΔPY% at the right`, chart: (w) => <Ranking vm={vm} w={w} phone={phone} /> },
  };
}

function River({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const m = vm.time.points, n = m.length, ticks = vm.time.ticks, top_ = ticks[ticks.length - 1]!;
  const ax = 30, endW = phone ? 40 : 52, top = 8, hh = phone ? 140 : 180;
  const x = (i: number) => ax + 6 + (i * (w - ax - 6 - endW)) / Math.max(1, n - 1), y = (v: number) => top + hh - (v / top_) * hh;
  const L = m[n - 1]!;
  const yl = top + hh + 18;
  const ys = yl + 60, sh = 16 / Math.max(...m.map((d) => Math.abs(d.rel ?? 0))), k = keep(m.map((d) => d.rel), phone);
  const bw = Math.min(14, (w - ax) / (2 * n));
  return (
    <Svg w={w} h={ys + 22} label={`${vm.time.title}, AC ${vm.acLabel} against PY ${vm.pyLabel}, with ΔPY%`}>
      {/* gridlines with axis labels; values only at the line end (gridlines or labels, never both) */}
      {ticks.map((t) => (
        <g key={t}>
          <line className="grid" x1={ax} x2={w - endW + 8} y1={f(y(t))} y2={f(y(t))} />
          <text className="t-dim" x={ax - 8} y={f(y(t) + 4)} textAnchor="end">{tickText(t)}</text>
        </g>
      ))}
      {m.slice(0, n - 1).map((a, i) => {
        const b = m[i + 1]!, tone = a.ac - a.py + b.ac - b.py >= 0 ? "good" : "bad";
        return <polygon key={a.key} className={`f-${tone}`} fillOpacity={0.14}
          points={`${f(x(i))},${f(y(a.ac))} ${f(x(i + 1))},${f(y(b.ac))} ${f(x(i + 1))},${f(y(b.py))} ${f(x(i))},${f(y(a.py))}`} />;
      })}
      <path d={path(m.map((d, i) => [x(i), y(d.py)]))} fill="none" className="axis-py" strokeWidth={1.75} strokeLinejoin="round" />
      <path d={path(m.map((d, i) => [x(i), y(d.ac)]))} fill="none" className="s-ac" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={f(x(n - 1))} cy={f(y(L.ac))} r={4} className="f-ac" />
      <T k={L.key + ".ac"} className="fig" x={f(x(n - 1) + 9)} y={f(y(L.ac) + 4)}>{L.acText}</T>
      <text className="t-dim" x={f(x(n - 1) + 9)} y={f(y(L.py) + 14)}><S k={L.key + ".py"}>{L.pyText}</S></text>
      {m.map((d, i) => <text key={d.key} className="t-dim" x={f(x(i))} y={yl} textAnchor="middle">{mlabel(d, phone, m.length)}</text>)}
      {/* the ΔPY% strip: one small column per month in its tone; labels thinned on a phone */}
      <text className="t-dim" x={0} y={yl + 22}>ΔPY%</text>
      <line className="grid-strong" x1={ax} x2={w - endW + 8} y1={ys} y2={ys} />
      {m.map((d, i) => {
        const hgt = (d.rel ?? 0) * sh;
        return (
          <g key={d.key}>
            <rect className={`f-${d.relTone}`} x={f(x(i) - bw / 2)} y={f(Math.min(ys, ys - hgt))} width={f(bw)} height={f(Math.abs(hgt))} rx={1} />
            {k[i] && <T k={d.key + ".rel"} className={`tone-${d.relTone}`} x={f(x(i))} y={f(hgt >= 0 ? ys - hgt - 5 : ys - hgt + 14)} textAnchor="middle" fontWeight={600}>{d.relText}</T>}
          </g>
        );
      })}
    </Svg>
  );
}

function Ranking({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const rs = vm.structure.items, row = 42, head = 4;
  const x0 = 20 + textWidth(rs.map((r) => r.name), phone ? 76 : 120, phone ? 120 : 190, 7.2) + 10;
  const x1 = w - textWidth(rs.map((r) => r.acText), 40, 80, 8) - (phone ? 56 : 80);
  const s = (x1 - x0) / vm.structure.max;
  return (
    <Svg w={w} h={head + rs.length * row} label={`${vm.structure.title}, ranked, AC ${vm.acLabel} against PY ${vm.pyLabel}`}>
      {rs.map((r, i) => {
        const y = head + i * row + 18;
        return (
          <g key={r.key}>
            <text className="t-dim fig" x={0} y={y + 4}>{i + 1}</text>
            <text x={20} y={y + 4}>{r.name}</text>
            <line className="grid" x1={x0} x2={x1} y1={y} y2={y} />
            <line className={`s-${r.absTone}`} x1={f(x0 + r.py * s)} x2={f(x0 + r.ac * s)} y1={y} y2={y} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={f(x0 + r.py * s)} cy={y} r={4.5} className="f-panel s-py" strokeWidth={2} />
            <circle cx={f(x0 + r.ac * s)} cy={y} r={5.5} className="f-ac" />
            <T k={`item.${r.key}.ac`} className="fig" x={x1 + 12} y={y + 4}>{r.acText}</T>
            <T k={`item.${r.key}.rel`} className={`tone-${r.relTone}`} x={w} y={y + 4} textAnchor="end" fontWeight={600}>{r.relText}</T>
          </g>
        );
      })}
    </Svg>
  );
}
