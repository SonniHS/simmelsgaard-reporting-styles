import type { StyleParts } from "../ReportPage";
import { glyph } from "../ReportPage";
import { useScale } from "../scale";
import { keep, type KeyFiguresVM } from "../viewModel";
import { axisLabels, edgePad, f, Fit, S, Svg, T, textWidth, crowded } from "./svg";

// Contrast: maximum legibility. Thick AC columns in front of PY, every variance with a direction glyph next to its
// colour (colour is never the only cue), plain words, no thin lines. Columns and bars share the page's scale (CH 4.1).

export function contrastParts(vm: KeyFiguresVM, { phone }: { phone: boolean }): StyleParts {
  const legend = (
    <p className="ct-legend"><span className="ct-key ac" />{vm.acLabel} (AC) <span className="ct-key py" />{vm.pyLabel} (PY)</p>
  );
  return {
    terms: { py: "Previous year", delta: "Change" },
    time: { sub: `${vm.time.unit} · change on ${vm.pyLabel} below, with ▲ ▼`, legend, chart: (w) => <ContrastColumns vm={vm} w={w} phone={phone} /> },
    structure: { sub: `${vm.structure.unit} · change on ${vm.pyLabel} at the right, with ▲ ▼`, legend, chart: (w) => <ContrastBars vm={vm} w={w} phone={phone} /> },
  };
}

function ContrastColumns({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const m = vm.time.points, n = m.length, top = 26, main = phone ? 170 : 220;
  const pad = edgePad(w, n, [...m.map((d) => "▲" + (d.relText ?? "")), ...m.map((d) => d.acText)], 9.2), step = (w - 2 * pad) / n, cw = Math.min(step * 0.58, 40);
  const s = useScale([{ unit: vm.time.unit, min: 0, max: vm.time.max, availablePx: main - 26 }]).get(vm.time.unit);
  if (s == null) return null;
  const y0 = top + Math.min(main, Math.ceil(vm.time.max * s) + 26), k = keep(m.map((d) => d.ac), phone || crowded(step, m.map((d) => d.acText), 9), Math.ceil((Math.max(...m.map((d) => d.acText.length)) * 9 + 8) / step)), kr = keep(m.map((d) => d.rel), phone || crowded(2 * step, m.map((d) => d.relText), 9.5));
  // labels wider than their column: every other one moves to a second line, so none touch (no smaller type)
  const stagger = Math.max(...m.map((d) => ((d.relText ?? "").length + 1) * 8.8)) > step - 8;
  const yr = y0 + 50, rowH = stagger ? 22 : 0;
  return (
    <Svg w={w} h={yr + rowH + 10} label={`${vm.time.title}, ${vm.acLabel} against ${vm.pyLabel}, with the change in % and its direction`}>
      {m.map((d, i) => {
        const cx = pad + step * (i + 0.5), ha = d.ac * s, hp = d.py * s;
        return (
          <g key={d.key}>
            <rect className="f-py" x={f(cx - cw / 2 - cw * 0.25)} y={f(y0 - hp)} width={f(cw)} height={f(hp)} />
            <rect className="f-ac" data-u={vm.time.unit} data-v={d.ac} data-dim="h" x={f(cx - cw / 2 + cw * 0.1)} y={f(y0 - ha)} width={f(cw)} height={f(ha)} />
            {k[i] && <T k={d.key + ".ac"} className="fig" x={f(cx + cw * 0.1)} y={f(y0 - ha - 8)} textAnchor="middle">{d.acText}</T>}
            <text x={f(cx)} y={y0 + 22} textAnchor="middle">{axisLabels(m, phone, step, 9)[i]}</text>
            {kr[i] && (
              <text x={f(cx)} y={yr + (stagger && i % 2 ? rowH : 0)} textAnchor="middle" className={`tone-${d.relTone} strong`}>
                {glyph(d.relDir)}<S k={d.key + ".rel"}>{d.relText}</S>
              </text>
            )}
          </g>
        );
      })}
      <line className="axis" x1={0} x2={w} y1={y0} y2={y0} strokeWidth={3} />
    </Svg>
  );
}

function ContrastBars({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const rs = vm.structure.items, relW = textWidth(rs.map((r) => "▲" + (r.relText ?? "")), 70, 110, 9.5), valW = textWidth(rs.map((r) => r.acText), 50, 100, 9.5);
  // names beside the bars, or on their own line above them on a phone
  const nameW = phone ? 0 : textWidth(rs.map((r) => r.name), 100, 200, 9), row = phone ? 62 : 46, dy = phone ? 20 : 0;
  const barW = Math.max(40, w - nameW - valW - relW);
  const s = useScale([{ unit: vm.structure.unit, min: 0, max: vm.structure.max, availablePx: barW }]).get(vm.structure.unit);
  if (s == null) return null;
  return (
    <Svg w={w} h={rs.length * row + dy + 4} label={`${vm.structure.title}, ${vm.acLabel} against ${vm.pyLabel}, with the change in % and its direction`}>
      {rs.map((r, i) => {
        const y = i * row + dy;
        return (
          <g key={r.key}>
            <Fit text={r.name} px={phone ? w : nameW - 8} perChar={9} x={0} y={phone ? y - 4 : y + 20} className="strong" />
            {r.py > 0 && <rect className="f-py" x={nameW} y={y + 20} width={f(r.py * s)} height={10} />}
            <rect className="f-ac" data-u={vm.structure.unit} data-v={r.ac} data-dim="w" x={nameW} y={y + 4} width={f(r.ac * s)} height={18} />
            <T k={`item.${r.key}.ac`} className="fig" x={f(nameW + Math.max(r.ac, r.py) * s + 8)} y={y + 20}>{r.acText}</T>
            <text x={w} y={y + 20} textAnchor="end" className={`tone-${r.relTone} strong`}>
              {glyph(r.relDir)}<S k={`item.${r.key}.rel`}>{r.relText}</S>
            </text>
          </g>
        );
      })}
      <line className="axis" x1={nameW} x2={nameW} y1={dy} y2={rs.length * row + dy} strokeWidth={3} />
    </Svg>
  );
}
