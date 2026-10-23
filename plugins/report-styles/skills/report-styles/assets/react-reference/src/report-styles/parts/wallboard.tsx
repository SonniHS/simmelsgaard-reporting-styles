import type { StyleParts } from "../ReportPage";
import { useScale } from "../scale";
import { keep, type KeyFiguresVM } from "../viewModel";
import { axisLabels, edgePad, f, Fit, Svg, T, textWidth, crowded } from "./svg";

// Wallboard: a screen read from a few metres. Thick AC columns in front of lighter PY columns, AC values on the
// columns and a ΔPY% row in large coloured type; thick bars with ΔPY% as tinted chips. No gridlines, few labels.
// Columns and bars share the page's scale (CH 4.1).

export function wallboardParts(vm: KeyFiguresVM, { phone }: { phone: boolean }): StyleParts {
  return {
    time: { sub: `${vm.time.unit} · AC ${vm.acLabel}, PY ${vm.pyLabel} · ΔPY% below`, chart: (w) => <WallColumns vm={vm} w={w} phone={phone} /> },
    structure: { sub: `${vm.structure.unit} · AC ${vm.acLabel}, PY ${vm.pyLabel} · ΔPY% at the right`, chart: (w) => <WallBars vm={vm} w={w} phone={phone} /> },
  };
}

function WallColumns({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const m = vm.time.points, n = m.length, top = 26, main = phone ? 170 : 230;
  const pad = edgePad(w, n, [...m.map((d) => d.relText), ...m.map((d) => d.acText)], 10.5), step = (w - 2 * pad) / n, cw = Math.min(step * 0.6, 48);
  const s = useScale([{ unit: vm.time.unit, min: 0, max: vm.time.max, availablePx: main - 26 }]).get(vm.time.unit);
  if (s == null) return null;
  const y0 = top + Math.min(main, Math.ceil(vm.time.max * s) + 26), k = keep(m.map((d) => d.ac), phone || crowded(step, m.map((d) => d.acText), 10), Math.ceil((Math.max(...m.map((d) => d.acText.length)) * 10 + 8) / step)), kr = keep(m.map((d) => d.rel), phone || crowded(step, m.map((d) => d.relText), 10.5));
  const yr = y0 + 52;
  return (
    <Svg w={w} h={yr + 10} label={`${vm.time.title}, AC ${vm.acLabel} against PY ${vm.pyLabel}, with ΔPY%`}>
      {m.map((d, i) => {
        const cx = pad + step * (i + 0.5), ha = d.ac * s, hp = d.py * s;
        return (
          <g key={d.key}>
            <rect className="f-py" x={f(cx - cw / 2 - cw * 0.22)} y={f(y0 - hp)} width={f(cw)} height={f(hp)} rx={2} />
            <rect className="f-ac" data-u={vm.time.unit} data-v={d.ac} data-dim="h" x={f(cx - cw / 2 + cw * 0.08)} y={f(y0 - ha)} width={f(cw)} height={f(ha)} rx={2} />
            {k[i] && <T k={d.key + ".ac"} className="fig" x={f(cx + cw * 0.08)} y={f(y0 - ha - 8)} textAnchor="middle">{d.acText}</T>}
            <text className="t-dim" x={f(cx)} y={y0 + 22} textAnchor="middle">{axisLabels(m, phone, step, 9)[i]}</text>
            {kr[i] && <T k={d.key + ".rel"} className={`tone-${d.relTone} big`} x={f(cx)} y={yr} textAnchor="middle">{d.relText}</T>}
          </g>
        );
      })}
      <line className="axis" x1={0} x2={w} y1={y0} y2={y0} strokeWidth={2} />
    </Svg>
  );
}

function WallBars({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const rs = vm.structure.items, chipW = textWidth(rs.map((r) => r.relText ?? ""), 70, 110, 10.5), valW = textWidth(rs.map((r) => r.acText), 56, 110, 10.5);
  // names beside the bars, or on their own line above them on a phone
  const nameW = phone ? 0 : textWidth(rs.map((r) => r.name), 110, 210, 9), row = phone ? 66 : 52, dy = phone ? 20 : 0;
  const barW = Math.max(40, w - nameW - valW - chipW - 12);
  const s = useScale([{ unit: vm.structure.unit, min: 0, max: vm.structure.max, availablePx: barW }]).get(vm.structure.unit);
  if (s == null) return null;
  const cx = w - chipW;
  return (
    <Svg w={w} h={rs.length * row + dy} label={`${vm.structure.title}, AC ${vm.acLabel} against PY ${vm.pyLabel}, with ΔPY%`}>
      {rs.map((r, i) => {
        const y = i * row + dy;
        return (
          <g key={r.key}>
            <Fit text={r.name} px={phone ? w : nameW - 8} perChar={9.4} x={0} y={phone ? y - 4 : y + 24} className="name" />
            {r.py > 0 && <rect className="f-py" x={nameW} y={y + 26} width={f(r.py * s)} height={8} rx={1} />}
            <rect className="f-ac" data-u={vm.structure.unit} data-v={r.ac} data-dim="w" x={nameW} y={y + 4} width={f(r.ac * s)} height={22} rx={2} />
            <T k={`item.${r.key}.ac`} className="fig" x={f(nameW + Math.max(r.ac, r.py) * s + 8)} y={y + 23}>{r.acText}</T>
            <rect className={`chip-${r.relTone}`} x={cx} y={y + 2} width={chipW} height={28} rx={6} />
            <T k={`item.${r.key}.rel`} className={`tone-${r.relTone} big`} x={cx + chipW / 2} y={y + 23} textAnchor="middle">{r.relText}</T>
          </g>
        );
      })}
    </Svg>
  );
}
