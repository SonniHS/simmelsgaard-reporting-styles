import type { StyleParts } from "../ReportPage";
import { Num } from "../ReportPage";
import { useScale } from "../scale";
import { keep, type KeyFiguresVM } from "../viewModel";
import { edgePad, axisLabels, f, Svg, T, crowded } from "./svg";

// Terminal: a command-line page. Thin AC columns in front of PY with a Δ% row; the structure as a monospace table with
// an inline bar per row, like a CLI report. The table's bars join the page's scale (CH 4.1), so they are drawn at their
// measured width rather than as percentages.

export function terminalParts(vm: KeyFiguresVM, { phone }: { phone: boolean }): StyleParts {
  return {
    terms: { py: "py", delta: "Δ" },
    time: { sub: `unit=${vm.time.unit}  ac=${vm.acLabel}  py=${vm.pyLabel}  Δ%↓`, chart: (w) => <TerminalColumns vm={vm} w={w} phone={phone} /> },
    structure: { sub: `unit=${vm.structure.unit}  sort=ac desc`, chart: (w) => <TerminalTable vm={vm} w={w} phone={phone} /> },
  };
}

function TerminalColumns({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const m = vm.time.points, n = m.length, top = 22, main = phone ? 150 : 190;
  const pad = edgePad(w, n, [...m.map((d) => d.acText), ...m.map((d) => d.relText)], 7.4), step = (w - 2 * pad) / n, cw = Math.min(step * 0.36, 18);
  const s = useScale([{ unit: vm.time.unit, min: 0, max: vm.time.max, availablePx: main - 22 }]).get(vm.time.unit);
  if (s == null) return null;
  const y0 = top + Math.min(main, Math.ceil(vm.time.max * s) + 22), k = keep(m.map((d) => d.ac), phone || crowded(step, m.map((d) => d.acText), 7.4), Math.ceil((Math.max(...m.map((d) => d.acText.length)) * 7.4 + 8) / step)), kr = keep(m.map((d) => d.rel), phone || crowded(step, m.map((d) => d.relText), 7.4));
  const yr = y0 + 40;
  return (
    <Svg w={w} h={yr + 8} label={`${vm.time.title}, AC ${vm.acLabel} against PY ${vm.pyLabel}, with Δ%`}>
      {m.map((d, i) => {
        const cx = pad + step * (i + 0.5), ha = d.ac * s, hp = d.py * s;
        return (
          <g key={d.key}>
            <rect className="f-py" x={f(cx - cw)} y={f(y0 - hp)} width={f(cw)} height={f(hp)} />
            <rect className="f-ac" data-u={vm.time.unit} data-v={d.ac} data-dim="h" x={f(cx)} y={f(y0 - ha)} width={f(cw)} height={f(ha)} />
            {k[i] && <T k={d.key + ".ac"} x={f(cx)} y={f(y0 - Math.max(ha, hp) - 6)} textAnchor="middle">{d.acText}</T>}
            <text className="t-dim" x={f(cx)} y={y0 + 16} textAnchor="middle">{axisLabels(m, phone, step, 7.4)[i]}</text>
            {kr[i] && <T k={d.key + ".rel"} className={`tone-${d.relTone}`} x={f(cx)} y={yr} textAnchor="middle">{d.relText}</T>}
          </g>
        );
      })}
      <line className="axis" x1={0} x2={w} y1={y0} y2={y0} strokeDasharray="3 3" />
    </Svg>
  );
}

function TerminalTable({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const rs = vm.structure.items;
  // the bar column gets what the text columns leave (monospace: about 7.4 px a character at 12 px)
  const chars = (xs: string[]) => Math.max(...xs.map((x) => x.length));
  const textCols = chars(rs.map((r) => r.name)) + chars(rs.map((r) => r.acText)) * (phone ? 1 : 2) + chars(rs.map((r) => r.relText ?? "")) + (phone ? 6 : 8);
  const barPx = Math.max(40, w - textCols * 7.6 - 24);
  const s = useScale([{ unit: vm.structure.unit, min: 0, max: vm.structure.max, availablePx: barPx }]).get(vm.structure.unit);
  if (s == null) return null;
  return (
    <table className="tm-table">
      <thead><tr><th scope="col">name</th><th scope="col" aria-hidden="true" /><th scope="col">ac</th>{!phone && <th scope="col">py</th>}<th scope="col">Δ%</th></tr></thead>
      <tbody>
        {rs.map((r) => (
          <tr key={r.key}>
            <th scope="row">{r.name}</th>
            <td className="tm-bar" aria-hidden="true">
              <span className="ac" data-u={vm.structure.unit} data-v={r.ac} data-dim="w" style={{ width: `${f(r.ac * s)}px` }} />
              {r.py > 0 && <span className="py" style={{ width: `${f(r.py * s)}px` }} />}
            </td>
            <td><Num text={r.acText} k={`item.${r.key}.ac`} /></td>
            {!phone && <td className="dim"><Num text={r.pyText} k={`item.${r.key}.py`} /></td>}
            <td><Num text={r.relText!} k={`item.${r.key}.rel`} tone={r.relTone} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
