import type { StyleParts } from "../ReportPage";
import { glyph } from "../ReportPage";
import { keep, type KeyFiguresVM, tickText } from "../viewModel";
import { useScale } from "../scale";
import { f, mlabel, S, Svg, T, textWidth } from "./svg";

// Soft: rounded columns on faint gridlines with a change-on-last-year pin tier; rounded bars with tinted pills.
// Plain-language words, with the IBCS abbreviations next to them in the legend.

export function softParts(vm: KeyFiguresVM, { phone }: { phone: boolean }): StyleParts {
  const legend = (
    <div className="rs-legend">
      <span><i style={{ background: "var(--rs-color-scenario-ac)" }} />This year (AC)</span>
      <span><i style={{ background: "var(--rs-color-scenario-py)" }} />Last year (PY)</span>
    </div>
  );
  return {
    terms: { py: "Last year", delta: "Change" },
    time: { sub: `${vm.time.unit} · change on last year below`, legend, chart: (w) => <SoftColumns vm={vm} w={w} phone={phone} /> },
    structure: { sub: `${vm.structure.unit} · change on last year at the right`, legend, chart: (w) => <SoftBars vm={vm} w={w} phone={phone} /> },
  };
}

function SoftColumns({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const m = vm.time.points, ax = 30, step = (w - ax) / m.length, cw = Math.min(step * 0.5, 26), main = 180, top = 8;
  // same unit, same scale (CH 4.1): the columns share px per unit with the page's other charts of this unit; the
  // gridlines follow that scale (ticks that no longer fit are dropped)
  const s = useScale([{ unit: vm.time.unit, min: 0, max: vm.time.ticks[vm.time.ticks.length - 1]!, availablePx: main }]).get(vm.time.unit);
  if (s == null) return null;
  // gridlines at least 18 px apart: every k-th tick when the shared scale makes the columns short
  const fit = vm.time.ticks.filter((t) => t * s <= main + 0.5);
  const every = Math.max(1, Math.ceil(18 / (((fit[1] ?? 1) - (fit[0] ?? 0)) * s)));
  // the plot is as tall as its top gridline at the shared scale, never an empty band
  const ticks = fit.filter((_, i) => i % every === 0), y0 = top + Math.max(24, Math.ceil(fit[fit.length - 1]! * s));
  const r = cw >= 8 ? 4 : 0; // no radius on bars thinner than 8 px
  const col = (x: number, y: number, ww: number, hh: number, cls: string, mark?: { u: string; v: number }) =>
    <path className={cls} data-u={mark?.u} data-v={mark?.v} data-dim={mark ? "h" : undefined} d={`M${f(x)},${f(y + hh)}V${f(y + r)}q0,-${r} ${r},-${r}H${f(x + ww - r)}q${r},0 ${r},${r}V${f(y + hh)}Z`} />;
  const yv = y0 + 92, sp = 26 / Math.max(...m.map((d) => Math.abs(d.rel ?? 0)));
  const k = keep(m.map((d) => d.rel), phone);
  return (
    <Svg w={w} h={yv + 40} label={`${vm.time.title}, this year against last year, with the change`}>
      {/* gridlines with axis labels, no data labels on this tier (gridlines or labels, never both) */}
      {ticks.map((t) => (
        <g key={t}>
          <line className="grid" x1={ax} x2={w} y1={f(y0 - t * s)} y2={f(y0 - t * s)} />
          <text className="t-dim" x={ax - 6} y={f(y0 - t * s + 4)} textAnchor="end">{tickText(t)}</text>
        </g>
      ))}
      {m.map((d) => {
        const cx = ax + step * (m.indexOf(d) + 0.5);
        return (
          <g key={d.key}>
            {col(cx - cw / 2 - cw * 0.3, y0 - d.py * s, cw, d.py * s, "f-py")}
            {col(cx - cw / 2 + cw * 0.15, y0 - d.ac * s, cw, d.ac * s, "f-ac", { u: vm.time.unit, v: d.ac })}
            <text className="t-dim" x={f(cx)} y={y0 + 18} textAnchor="middle">{mlabel(d, phone, m.length)}</text>
          </g>
        );
      })}
      {/* change on last year: round-headed pins with labels */}
      <text className="t-dim" x={0} y={y0 + 44}>Change on last year, %</text>
      <line className="axis-py" x1={ax} x2={w} y1={yv} y2={yv} strokeWidth={2} strokeLinecap="round" />
      {m.map((d, i) => {
        const cx = ax + step * (i + 0.5), p = (d.rel ?? 0) * sp;
        return (
          <g key={d.key}>
            <line className={`s-${d.relTone}`} x1={f(cx)} x2={f(cx)} y1={yv} y2={f(yv - p)} strokeWidth={2.5} strokeLinecap="round" />
            <circle className={`f-${d.relTone}`} cx={f(cx)} cy={f(yv - p)} r={4.5} />
            {k[i] && <T k={d.key + ".rel"} x={f(cx)} y={f(p >= 0 ? yv - p - 9 : yv - p + 18)} textAnchor="middle">{d.relText}</T>}
          </g>
        );
      })}
    </Svg>
  );
}

function SoftBars({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const rs = vm.structure.items, row = 44, pillW = phone ? 66 : 74;
  const nameW = textWidth(rs.map((r) => r.name), phone ? 80 : 100, phone ? 130 : 190, 7.6), valW = textWidth(rs.map((r) => r.acText), 40, 76, 8);
  const barW = w - nameW - valW - pillW - 8;
  const s = useScale([{ unit: vm.structure.unit, min: 0, max: vm.structure.max, availablePx: barW }]).get(vm.structure.unit);
  if (s == null) return null;
  const px = w - pillW;
  return (
    <Svg w={w} h={rs.length * row + 4} label={`${vm.structure.title}, this year against last year`}>
      {rs.map((r, i) => {
        const y = i * row + 6;
        return (
          <g key={r.key}>
            <text x={0} y={y + 19}>{r.name}</text>
            {r.py > 0 && <rect className="f-py" x={nameW} y={y + 12} width={f(r.py * s)} height={16} rx={4} />}
            <rect className="f-ac" data-u={vm.structure.unit} data-v={r.ac} data-dim="w" x={nameW} y={y + 4} width={f(r.ac * s)} height={16} rx={4} />
            <T k={`item.${r.key}.ac`} x={f(nameW + Math.max(r.ac, r.py) * s + 6)} y={y + 18} fontWeight={700}>{r.acText}</T>
            <rect className={`pill-${r.relTone}`} x={px} y={y + 3} width={pillW} height={24} rx={12} />
            <text x={px + pillW / 2} y={y + 19} textAnchor="middle" className={`tone-${r.relTone}`} fontWeight={700}>
              {glyph(r.relDir)}{r.relDir ? " " : ""}<S k={`item.${r.key}.rel`}>{r.relText}</S>
            </text>
          </g>
        );
      })}
    </Svg>
  );
}
