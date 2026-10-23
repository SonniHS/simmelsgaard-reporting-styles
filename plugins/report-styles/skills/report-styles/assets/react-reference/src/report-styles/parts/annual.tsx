import type { StyleParts } from "../ReportPage";
import { useScale } from "../scale";
import { keep, type KeyFiguresVM, type Point } from "../viewModel";
import { axisLabels, f, Fit, S, Svg, T, textWidth, crowded } from "./svg";

// Annual: the key-figures spread of an annual report. AC columns and bars in the brand colour with PY as a marker line
// across them (a page-coloured halo keeps it readable on the column and on the page), numbered callouts tied to their
// columns and explained under the chart, a Δ% row. Columns and bars share the page's scale (CH 4.1).

export function annualParts(vm: KeyFiguresVM, { phone }: { phone: boolean }): StyleParts {
  const legend = (
    <p className="an-legend"><span className="an-key ac" />{vm.acLabel} <span className="an-key py" />{vm.pyLabel}</p>
  );
  return {
    terms: { py: "Was", delta: `On ${vm.pyLabel}` },
    time: { sub: `${vm.time.unit} · numbered points explained below`, legend, chart: (w) => <MarkerColumns vm={vm} w={w} phone={phone} /> },
    structure: { sub: `${vm.structure.unit} · ranked by ${vm.acLabel}`, legend, chart: (w) => <MarkerBars vm={vm} w={w} phone={phone} /> },
  };
}

function MarkerColumns({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const m = vm.time.points, n = m.length, top = 46, main = phone ? 150 : 190;
  // the cards have no padding: inset the first and last columns by what half a label needs beyond half a column
  const labelW = textWidth([...m.map((d) => d.relText ?? ""), ...m.map((d) => d.acText)], 10, 70, 7.4);
  const pad = Math.max(0, Math.ceil(labelW / 2 - w / n / 2) + 2), step = (w - 2 * pad) / n, cw = Math.min(step * 0.62, 34);
  const s = useScale([{ unit: vm.time.unit, min: 0, max: vm.time.max, availablePx: main - 22 }]).get(vm.time.unit);
  if (s == null) return null;
  const y0 = top + Math.min(main, Math.ceil(vm.time.max * s) + 22), k = keep(m.map((d) => d.ac), phone || crowded(step, m.map((d) => d.acText), 7.4), Math.ceil((Math.max(...m.map((d) => d.acText.length)) * 7.4 + 8) / step)), kr = keep(m.map((d) => d.rel), phone || crowded(step, m.map((d) => d.relText), 7.6));
  const { best, dip, below } = vm.time, py = vm.pyLabel;
  const notes: [Point, string][] = [[best, "the largest gain"]];
  if (dip !== best) notes.push([dip, below === 1 ? `the only one below ${py}` : below > 1 ? "the largest drop" : "the smallest gain"]);
  const yr = y0 + 42, yn = yr + 26;
  return (
    <Svg w={w} h={yn + notes.length * 20} label={`${vm.time.title}: ${vm.acLabel} columns with a ${py} marker; the largest gain and the weakest point numbered`}>
      {m.map((d, i) => {
        const cx = pad + step * (i + 0.5), ha = d.ac * s, hp = d.py * s;
        const pm = { x1: f(cx - cw / 2 - 4), x2: f(cx + cw / 2 + 4), y1: f(y0 - hp), y2: f(y0 - hp) };
        return (
          <g key={d.key}>
            <rect className="f-ac" data-u={vm.time.unit} data-v={d.ac} data-dim="h" x={f(cx - cw / 2)} y={f(y0 - ha)} width={f(cw)} height={f(ha)} />
            {d.py > 0 && <><line className="pyhalo" {...pm} /><line className="pymark" {...pm} /></>}
            {k[i] && <T k={d.key + ".ac"} x={f(cx)} y={f(y0 - Math.max(ha, hp) - 6)} textAnchor="middle">{d.acText}</T>}
            <text className="t-dim" x={f(cx)} y={y0 + 18} textAnchor="middle">{axisLabels(m, phone, step, 7.2)[i]}</text>
            {kr[i] && <T k={d.key + ".rel"} className={`tone-${d.relTone}`} x={f(cx)} y={yr} textAnchor="middle" fontWeight={700}>{d.relText}</T>}
          </g>
        );
      })}
      <line className="axis" x1={0} x2={w} y1={y0} y2={y0} strokeWidth={1.5} />
      <line className="grid-faint" x1={0} x2={w} y1={y0 + 26} y2={y0 + 26} />
      {notes.map(([d], j) => {
        const i = m.indexOf(d), cx = pad + step * (i + 0.5), cy = 12;
        const ly = y0 - Math.max(d.ac, d.py) * s - (k[i] ? 22 : 6); // to the value label, or to the column when the label is thinned
        return (
          <g key={"n" + j}>
            <circle cx={f(cx)} cy={cy} r={10} className="f-page s-highlight" strokeWidth={2} />
            <text x={f(cx)} y={cy + 4.5} textAnchor="middle" fontWeight={700}>{j + 1}</text>
            {ly > cy + 18 && <line className="leader" x1={f(cx)} x2={f(cx)} y1={cy + 12} y2={f(ly)} />}
          </g>
        );
      })}
      {notes.map(([d, word], j) => (
        <text key={"t" + j} className="t-dim" x={0} y={yn + j * 20}>
          <tspan fontWeight={700} className="t-strong">{j + 1}. {d.label} </tspan>
          <S k={d.key + ".rel"} className={`tone-${d.relTone}`} fontWeight={700}>{d.relText}</S> on {py}, {word}
        </text>
      ))}
    </Svg>
  );
}

function MarkerBars({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const rs = vm.structure.items, relW = textWidth(rs.map((r) => r.relText ?? ""), 46, 80, 7.6), valW = textWidth(rs.map((r) => r.acText), 44, 80, 7.6);
  // names beside the bars, or on their own line above them on a phone
  const nameW = phone ? 0 : textWidth(rs.map((r) => r.name), 96, 180, 7.6), row = phone ? 56 : 44, dy = phone ? 16 : 0;
  const barW = Math.max(40, w - nameW - valW - relW);
  const s = useScale([{ unit: vm.structure.unit, min: 0, max: vm.structure.max, availablePx: barW }]).get(vm.structure.unit);
  if (s == null) return null;
  return (
    <Svg w={w} h={rs.length * row + 4 + dy} label={`${vm.structure.title}, ranked: ${vm.acLabel} bars with a ${vm.pyLabel} marker`}>
      {rs.map((r, i) => {
        const y = i * row + 4 + dy, pm = { x1: f(nameW + r.py * s), x2: f(nameW + r.py * s), y1: y, y2: y + 26 };
        return (
          <g key={r.key}>
            <Fit text={r.name} px={phone ? w : nameW - 6} perChar={7.6} x={0} y={phone ? y - 4 : y + 17} fontWeight={600} />
            <rect className="f-ac" data-u={vm.structure.unit} data-v={r.ac} data-dim="w" x={nameW} y={y + 4} width={f(r.ac * s)} height={18} />
            {r.py > 0 && <><line className="pyhalo" {...pm} /><line className="pymark" {...pm} /></>}
            <T k={`item.${r.key}.ac`} x={f(nameW + Math.max(r.ac, r.py) * s + 8)} y={y + 17}>{r.acText}</T>
            <T k={`item.${r.key}.rel`} className={`tone-${r.relTone}`} x={w} y={y + 17} textAnchor="end" fontWeight={700}>{r.relText}</T>
          </g>
        );
      })}
      <line className="axis" x1={nameW} x2={nameW} y1={dy} y2={rs.length * row + 4 + dy} />
    </Svg>
  );
}
