import type { StyleParts } from "../ReportPage";
import { keep, type KeyFiguresVM } from "../viewModel";
import { useScale } from "../scale";
import { f, Fit, mlabel, Svg, T, textWidth } from "./svg";

// IBCS, the reference: a multi-tier column chart (ΔPY% pins, ΔPY bars, PY/AC columns) and region bars with ΔPY and
// ΔPY% columns. The two absolute-variance details (monthly ΔPY, region ΔPY) are the IBCS page's extras.

export function ibcsParts(vm: KeyFiguresVM, { phone }: { phone: boolean }): StyleParts {
  return {
    time: { sub: `${vm.time.unit} · AC ${vm.acLabel}, PY ${vm.pyLabel} · ΔPY, ΔPY%`, chart: (w) => <TimeTiers vm={vm} w={w} phone={phone} /> },
    // the variance columns are labelled inside the chart, which drops ΔPY when the card is too narrow for both
    structure: { sub: `${vm.structure.unit} · AC ${vm.acLabel}, PY ${vm.pyLabel}`, chart: (w) => <RegionBars vm={vm} w={w} phone={phone} /> },
  };
}

function TimeTiers({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const m = vm.time.points, step = w / m.length, cw = step * 0.56;
  const tierPct = 70, tierAbs = 70, main = 190, gap = 10;
  const yPct = 16 + tierPct / 2, yAbs = 16 + tierPct + gap + 14 + tierAbs / 2;
  const sPct = (tierPct / 2 - 16) / Math.max(...m.map((d) => Math.abs(d.rel ?? 0)));
  // same unit, same scale (CH 4.1): the value tier and the ΔPY tier share the page's px per unit with every other
  // chart of this unit; the ΔPY% pins keep their own scale
  const U = vm.time.unit, maxAbs = Math.max(...m.map((d) => Math.abs(d.abs)), 1e-9);
  const sMain = useScale([{ unit: U, min: 0, max: vm.time.max, availablePx: main - 22 }, { unit: U, min: -maxAbs, max: maxAbs, availablePx: tierAbs - 32 }]).get(U);
  if (sMain == null) return null;
  const sAbs = sMain;
  // the value tier is as tall as its columns at the shared scale (plus the label room), never an empty band
  const y0 = 16 + tierPct + gap + 14 + tierAbs + gap + Math.min(main, Math.ceil(vm.time.max * sMain) + 22);
  const kPct = keep(m.map((d) => d.rel), phone), kAbs = keep(m.map((d) => d.abs), phone), kAc = keep(m.map((d) => d.ac), phone);
  return (
    <Svg w={w} h={y0 + 22} label={`${vm.time.title}, AC and PY with variances`}>
      <text className="t-dim" x={0} y={10}>ΔPY%</text>
      <text className="t-dim" x={0} y={16 + tierPct + gap + 10}>ΔPY</text>
      <line className="axis-py" x1={0} x2={w} y1={yPct} y2={yPct} strokeWidth={2} />
      <line className="axis-py" x1={0} x2={w} y1={yAbs} y2={yAbs} strokeWidth={3} />
      {m.map((d, i) => {
        const cx = step * (i + 0.5);
        const ph = (d.rel ?? 0) * sPct, py = yPct - ph;
        const ah = d.abs * sAbs;
        const hp = d.py * sMain, ha = d.ac * sMain;
        return (
          <g key={d.key}>
            {/* ΔPY% pins */}
            <line className={`s-${d.relTone}`} x1={f(cx)} x2={f(cx)} y1={yPct} y2={f(py)} strokeWidth={2} />
            <rect className={`f-${d.relTone}`} x={f(cx - 3.5)} y={f(py - 3.5)} width={7} height={7} />
            {kPct[i] && <T k={d.key + ".rel"} x={f(cx)} y={f(ph >= 0 ? py - 7 : py + 16)} textAnchor="middle">{d.relText}</T>}
            {/* ΔPY bars */}
            <rect className={`f-${d.absTone}`} x={f(cx - cw / 2)} y={f(Math.min(yAbs, yAbs - ah))} width={f(cw)} height={f(Math.abs(ah))} />
            {kAbs[i] && <T k={d.key + ".abs"} x={f(cx)} y={f(ah >= 0 ? yAbs - ah - 4 : yAbs - ah + 14)} textAnchor="middle">{d.absText}</T>}
            {/* PY behind and to the left, AC in front */}
            <rect className="f-py" x={f(cx - cw / 2 - step * 0.12)} y={f(y0 - hp)} width={f(cw)} height={f(hp)} />
            <rect className="f-ac" data-u={vm.time.unit} data-v={d.ac} data-dim="h" x={f(cx - cw / 2 + step * 0.04)} y={f(y0 - ha)} width={f(cw)} height={f(ha)} />
            {kAc[i] && <T k={d.key + ".ac"} x={f(cx + step * 0.04)} y={f(y0 - ha - 4)} textAnchor="middle">{d.acText}</T>}
            <text x={f(cx)} y={y0 + 16} textAnchor="middle">{mlabel(d, phone, m.length)}</text>
          </g>
        );
      })}
      <line className="axis" x1={0} x2={w} y1={y0} y2={y0} strokeWidth={1} />
    </Svg>
  );
}

function RegionBars({ vm, w, phone }: { vm: KeyFiguresVM; w: number; phone: boolean }) {
  const rs = vm.structure.items, head = 20;
  const nameW = textWidth(rs.map((r) => r.name), 90, 180);
  const valW = textWidth(rs.map((r) => r.acText), 36, 72, 7.2);
  // a variance column: bars up to `bar` px each side of its axis, and room for the longest label on each side
  // (negative labels sit left of their bar, positive right), so no label runs into the next column or off the card
  const column = (items: { dir: number; text: string }[], bar: number) => {
    const side = (d: number) => Math.max(0, ...items.filter((i) => i.dir === d).map((i) => Math.ceil(i.text.length * 6.8)));
    const left = (items.some((i) => i.dir < 0) ? bar : 0) + side(-1) + 6, right = (items.some((i) => i.dir > 0) ? bar : 0) + side(1) + 6;
    return { left, right, width: left + right };
  };
  const barA = 16, barP = phone ? 14 : 22;
  const colA = column(rs.map((r) => ({ dir: r.absDir, text: r.absText })), barA);
  const colP = column(rs.map((r) => ({ dir: r.rel == null ? 1 : r.relDir, text: r.relText! })), barP);
  // the first layout that leaves the AC/PY bars at least 90 px: names beside the bars with both variance columns;
  // names on their own line above the bars (phones always) with both columns; names above with ΔPY% only (ΔPY stays
  // in the KPI tiles). ΔPY% is always shown: it carries the comparison.
  const fits = (nameCol: number, both: boolean) => w - nameCol - valW - colP.width - (both ? colA.width : 0) >= 90;
  const stack = phone || !fits(nameW, true);
  const narrow = stack && !fits(0, true);
  const row = stack ? 44 : 30, dy = stack ? 14 : 0;
  const x0 = stack ? 0 : nameW;
  const cols = narrow ? colP.width : colA.width + colP.width;
  const barW = Math.max(40, w - x0 - valW - cols);
  const cxA = x0 + barW + valW + colA.left, cxP = narrow ? x0 + barW + valW + colP.left : cxA + colA.right + colP.left;
  // the AC/PY bars and the ΔPY bars share the page's px per unit for this unit (CH 4.1)
  const U = vm.structure.unit, maxAbs = Math.max(...rs.map((r) => Math.abs(r.abs)), 1e-9);
  const s = useScale([{ unit: U, min: 0, max: vm.structure.max, availablePx: barW },
    ...(narrow ? [] : [{ unit: U, min: -maxAbs, max: maxAbs, availablePx: 2 * barA }])]).get(U);
  if (s == null) return null;
  const sA = s;
  const sP = barP / Math.max(...rs.filter((r) => r.rel != null).map((r) => Math.abs(r.rel!)), 1e-9);
  const h = head + rs.length * row;
  return (
    <Svg w={w} h={h + 4} label={`${vm.structure.title}, AC and PY with variances`}>
      <text className="t-dim" x={cxP} y={12} textAnchor="middle">ΔPY%</text>
      <line className="axis-py" x1={cxP} x2={cxP} y1={head} y2={h} strokeWidth={2} />
      {!narrow && <><text className="t-dim" x={cxA} y={12} textAnchor="middle">ΔPY</text><line className="axis-py" x1={cxA} x2={cxA} y1={head} y2={h} strokeWidth={3} /></>}
      {rs.map((r, i) => {
        const y = head + i * row, a = r.abs * sA;
        const p = r.rel == null ? 0 : r.rel * sP;
        return (
          <g key={r.key} transform={dy ? `translate(0,${dy})` : undefined}>
            {stack ? <Fit text={r.name} px={w} x={0} y={y - 2} /> : <Fit text={r.name} px={nameW} x={0} y={y + 19} />}
            <rect className="f-py" x={x0} y={y + 10} width={f(r.py * s)} height={15} />
            <rect className="f-ac" data-u={vm.structure.unit} data-v={r.ac} data-dim="w" x={x0} y={y + 6} width={f(r.ac * s)} height={15} />
            <T k={`item.${r.key}.ac`} x={f(x0 + Math.max(r.ac, r.py) * s + 4)} y={y + 18}>{r.acText}</T>
            {!narrow && <rect className={`f-${r.absTone}`} x={f(Math.min(cxA, cxA + a))} y={y + 7} width={f(Math.abs(a))} height={14} />}
            {!narrow && <T k={`item.${r.key}.abs`} x={f(cxA + a + (a >= 0 ? 4 : -4))} y={y + 18} textAnchor={a >= 0 ? "start" : "end"}>{r.absText}</T>}
            {r.rel == null
              ? <T k={`item.${r.key}.rel`} className="t-dim" x={cxP + 6} y={y + 18}>{r.relText!}</T>
              : <>
                  <line className={`s-${r.relTone}`} x1={cxP} x2={f(cxP + p)} y1={y + 14} y2={y + 14} strokeWidth={2} />
                  <rect className={`f-${r.relTone}`} x={f(cxP + p - 3.5)} y={y + 10.5} width={7} height={7} />
                  <T k={`item.${r.key}.rel`} x={f(cxP + p + (p >= 0 ? 7 : -7))} y={y + 18} textAnchor={p >= 0 ? "start" : "end"}>{r.relText!}</T>
                </>}
          </g>
        );
      })}
      <line className="axis" x1={x0} x2={x0} y1={head} y2={h} />
    </Svg>
  );
}
