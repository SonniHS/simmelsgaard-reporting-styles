import type { StyleParts } from "../ReportPage";
import { Num } from "../ReportPage";
import { keep, type KeyFiguresVM, type Point, tickText } from "../viewModel";
import { f, mlabel, path, S, Svg, T, textWidth } from "./svg";

// Graphic (Editorial): a newspaper data page. A line chart on faint gridlines with the best month and the dip
// annotated (each tied to its point by a leader line) and a Δ% row; regions as a ruled table with inline bars.

/** The table's first column header from the card title: "Revenue by region" → "Region". */
const itemHeader = (title: string) => { const t = title.replace(/^.* by /, ""); return t.charAt(0).toUpperCase() + t.slice(1); };

export function graphicParts(vm: KeyFiguresVM, { phone }: { phone: boolean }): StyleParts {
  const max = vm.structure.max, worst = vm.structure.worst?.key;
  const table = (
    <table className="ed-table">
      <thead><tr><th scope="col">{itemHeader(vm.structure.title)}</th><th scope="col" aria-hidden="true" /><th scope="col">{vm.acLabel}</th><th scope="col">Δ% on {vm.pyLabel}</th></tr></thead>
      <tbody>
        {vm.structure.items.map((r) => (
          <tr key={r.key} className={r.key === worst ? "ed-mark" : undefined}>
            <th scope="row">{r.name}</th>
            <td className="ed-bar" aria-hidden="true">
              <span className="ac" style={{ width: `${f((r.ac / max) * 100)}%` }} />
              {r.py > 0 && <span className="py" style={{ left: `${f((r.py / max) * 100)}%` }} />}
            </td>
            <td><Num text={r.acText} k={`item.${r.key}.ac`} /></td>
            <td><Num text={r.relText!} k={`item.${r.key}.rel`} tone={r.relTone} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return {
    terms: { py: vm.pyLabel, delta: `On ${vm.pyLabel}` },
    kicker: <span className="ed-tag" aria-hidden="true" />,
    time: {
      sub: <>{vm.time.unit} · <span className="ed-key ac" />{vm.acLabel} <span className="ed-key py" />{vm.pyLabel} · Δ% on {vm.pyLabel} below</>,
      chart: (w) => <EditorialLine vm={vm} w={w} phone={phone} />,
    },
    structure: { sub: `${vm.structure.unit} · bar = ${vm.acLabel}, tick = ${vm.pyLabel}${worst ? " · marked: named in the headline" : ""}`, body: table },
  };
}

function EditorialLine({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const m = vm.time.points, n = m.length, ticks = vm.time.ticks, top_ = ticks[ticks.length - 1]!;
  const top = 46, hh = phone ? 170 : 220;
  const L0 = m[0]!;
  // room for the labels: tick labels at the right edge, the end values before them, half the first label at the left
  const axR = textWidth(ticks.map(tickText), 22, 70, 7.2);
  const Ln = m[n - 1]!;
  const endW = textWidth([Ln.acText, Ln.pyText], 30, 80, 7.6) + 4;
  const x0 = Math.ceil(textWidth([mlabel(L0, phone, n) ?? "", L0.relText ?? ""], 10, 60, 7.4) / 2);
  const x1 = w - axR - endW;
  const x = (i: number) => x0 + (i * (x1 - x0)) / Math.max(1, n - 1), y = (v: number) => top + hh - (v / top_) * hh;
  const { best, dip, below } = vm.time, py = vm.pyLabel;
  const L = m[n - 1]!;
  // end labels: AC on the side of its line, PY on the other; pushed apart when the two values are close
  const endY = (() => {
    const acUp = L.ac >= L.py, ya = y(L.ac) + (acUp ? 2 : 12), yp = y(L.py) + (acUp ? 12 : 2);
    const gap = 16, d = Math.abs(yp - ya);
    if (d >= gap) return { ac: ya, py: yp };
    const mid = (ya + yp) / 2;
    return acUp ? { ac: mid - gap / 2, py: mid + gap / 2 } : { ac: mid + gap / 2, py: mid - gap / 2 };
  })();
  const yl = top + hh + 18, yr = yl + 26, k = keep(m.map((d) => d.rel), phone);
  // annotations, each tied to its point by a leader line: the best month above the lines, the dip below them
  const note = (d: Point, word: string, above: boolean) => {
    const i = m.indexOf(d), px = x(i), py = y(d.ac), ty = above ? 14 : py + 64;
    const anchor = px > w * 0.55 ? "end" : "start", tx = px + (anchor === "end" ? -8 : 8);
    return (
      <g key={d.key + "-note"}>
        <line className="leader" x1={f(px)} x2={f(px)} y1={f(above ? ty + 6 : ty - 14)} y2={f(above ? py - 6 : py + 6)} />
        <circle cx={f(px)} cy={f(py)} r={4.5} className="f-highlight s-page" strokeWidth={2} />
        <text className="note" x={f(tx)} y={ty} textAnchor={anchor}>
          <tspan fontWeight={600}>{d.label} <S k={d.key + ".rel"} className={`tone-${d.relTone}`}>{d.relText}</S></tspan> {word}
        </text>
      </g>
    );
  };
  return (
    <Svg w={w} h={yr + 6} label={`${vm.time.title}, ${vm.acLabel} against ${py}, with the largest gain and the weakest point annotated, and Δ%`}>
      {/* gridlines with labels on the right (newspaper convention); 0 is the baseline in ink */}
      {ticks.map((t) => (
        <g key={t}>
          <line className={t ? "grid" : "axis"} x1={0} x2={w - axR + 4} y1={f(y(t))} y2={f(y(t))} />
          <text className="t-dim" x={w} y={f(y(t) - 4)} textAnchor="end">{tickText(t)}</text>
        </g>
      ))}
      <path d={path(m.map((d, i) => [x(i), y(d.py)]))} fill="none" className="axis-py" strokeWidth={2} />
      <path d={path(m.map((d, i) => [x(i), y(d.ac)]))} fill="none" className="s-ac" strokeWidth={3} strokeLinejoin="round" />
      <T k={L.key + ".ac"} className="fig" x={f(x(n - 1) + 7)} y={f(endY.ac)}>{L.acText}</T>
      <text className="t-dim" x={f(x(n - 1) + 7)} y={f(endY.py)}><S k={L.key + ".py"}>{L.pyText}</S></text>
      {note(best, phone ? "the best" : `on ${py}, the largest gain`, true)}
      {best !== dip && note(dip, below === 1 ? (phone ? "only dip" : `the only one below ${py}`) : below > 1 ? (phone ? "weakest" : `the largest drop on ${py}`) : (phone ? "smallest" : "the smallest gain"), false)}
      {m.map((d, i) => <text key={d.key} className="t-dim" x={f(x(i))} y={yl} textAnchor="middle">{mlabel(d, phone, m.length)}</text>)}
      {/* the Δ% row: a line of figures under the months, as a newspaper prints a table under a chart */}
      <line className="grid" x1={0} x2={w - axR + 4} y1={yl + 8} y2={yl + 8} />
      <text className="t-dim" x={w} y={yr} textAnchor="end">Δ%</text>
      {m.map((d, i) => k[i] && <T key={d.key} k={d.key + ".rel"} className={`tone-${d.relTone}`} x={f(x(i))} y={yr} textAnchor="middle" fontWeight={600}>{d.relText}</T>)}
    </Svg>
  );
}
