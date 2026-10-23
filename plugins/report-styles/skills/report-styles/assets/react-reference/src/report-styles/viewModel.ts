// The view model every style draws. Pure functions; the hard rules live here, never in a style's renderer:
//  - relative variance = (AC − REF) / REF with the signed reference; N/A when REF ≤ 0, blank, or |REF| displays as 0
//  - variances on display-signed values; polarity picks the tone only (good / bad / neutral)
//  - a Δ that displays as zero has no tone and no sign
//  - direction glyphs follow the sign, never the tone
// A style receives finished texts and tones; it computes no number. The reconcile test checks exactly that.

export type Tone = "good" | "bad" | "neutral" | "none";
export type Polarity = 1 | -1 | 0;
/** amount and count: Δ and Δ%; rate (a percentage): Δ in pp only; score (a bounded scale such as 4.42 of 5): Δ only. */
export type Kind = "amount" | "count" | "rate" | "score";
const MINUS = "−";

const round = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;

/** Number text at fixed decimals with a thousands comma; "−" for negatives; never "−0.0". */
export function fmt(x: number, d: number): string {
  const r = round(x, d);
  const s = Math.abs(r).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return r < 0 ? MINUS + s : s;
}

/** Signed variance text: "+5.7", "−1.2", and "0.0" (no sign) when it displays as zero. */
export function fmtDelta(x: number, d: number): string {
  const r = round(x, d);
  if (r === 0) return fmt(0, d);
  return (r > 0 ? "+" : MINUS) + fmt(Math.abs(r), d);
}

/** (AC − REF) / REF with the signed REF; null (N/A) when REF ≤ 0, blank, or below half a unit at display precision. */
export function relVar(ac: number, ref: number | null | undefined, refDecimals: number): number | null {
  if (ref == null || Number.isNaN(ref) || ref <= 0) return null;
  if (Math.abs(ref) < 0.5 * 10 ** -refDecimals) return null;
  return (ac - ref) / ref;
}

/** Impact tone of a variance as displayed: "none" when it shows as zero or N/A, else by polarity. */
export function tone(delta: number | null, polarity: Polarity, d: number): Tone {
  if (delta == null || round(delta, d) === 0) return "none";
  if (polarity === 0) return "neutral";
  return delta * polarity > 0 ? "good" : "bad";
}

/** Direction from the arithmetic sign of the displayed value (never from the tone). */
export function dir(delta: number | null, d: number): -1 | 0 | 1 {
  if (delta == null) return 0;
  const r = round(delta, d);
  return r > 0 ? 1 : r < 0 ? -1 : 0;
}

export interface Variance {
  abs: number; absText: string; absTone: Tone; absDir: -1 | 0 | 1;
  rel: number | null; relText: string | null; relTone: Tone; relDir: -1 | 0 | 1;
}

/** AC against one reference. A rate's absolute Δ is in percentage points and it has no relative Δ (pp says it all);
 *  a score has no relative Δ either (a % change of a bounded scale misleads). */
export function variance(ac: number, py: number, decimals: number, polarity: Polarity, kind: Kind): Variance {
  const abs = round(ac, decimals) - round(py, decimals);
  const noRel = kind === "rate" || kind === "score";
  const rel = noRel ? null : relVar(ac, py, decimals);
  return {
    abs, absText: fmtDelta(abs, decimals) + (kind === "rate" ? " pp" : ""),
    absTone: tone(abs, polarity, decimals), absDir: dir(abs, decimals),
    rel, relText: noRel ? null : rel == null ? "N/A" : fmtDelta(rel * 100, 1) + "%",
    relTone: rel == null ? "none" : tone(rel * 100, polarity, 1), relDir: dir(rel == null ? null : rel * 100, 1),
  };
}

/** Labels to keep on a phone when more than six share an axis: the largest |value|, the smallest, and the last
 *  (label thinning by priority). Six or fewer always keep every label. */
export function keep(values: (number | null)[], phone: boolean): boolean[] {
  if (!phone || values.length <= 6) return values.map(() => true);
  const idx = values.flatMap((v, i) => (v == null ? [] : [[v, i] as const]));
  if (!idx.length) return values.map(() => false);
  const hi = idx.reduce((a, b) => (Math.abs(b[0]) > Math.abs(a[0]) ? b : a))[1];
  const lo = idx.reduce((a, b) => (b[0] < a[0] ? b : a))[1];
  return values.map((_, i) => i === hi || i === lo || i === values.length - 1);
}

/** Round axis ticks from 0 to at least `max`: 3–6 steps of 1, 2, 2.5 or 5 × 10ⁿ. Bars and columns start at zero. */
export function niceTicks(max: number, target = 4): number[] {
  if (!(max > 0)) return [0, 1];
  const raw = max / target, mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => max / s <= target + 1.5) ?? 10 * mag;
  const ticks: number[] = [];
  for (let t = 0; t < max + step * 1e-9; t += step) ticks.push(round(t, 10));
  if (ticks[ticks.length - 1]! < max) ticks.push(round(ticks[ticks.length - 1]! + step, 10));
  return ticks;
}

/** An axis tick in the page's number format: thousands comma, only the decimals the step needs. */
export const tickText = (t: number) => fmt(t, Number.isInteger(t) ? 0 : (String(t).split(".")[1] ?? "").length);

// ------------------------------------------------------------------ the Key figures page

export interface KpiInput { key: string; label: string; unit: string; ac: number; py: number; decimals: number; polarity: Polarity; kind: Kind }
export interface MeasureInput { title: string; unit: string; decimals: number; polarity: Polarity }
export interface KeyFiguresInput {
  title?: string;
  company: string; period: string; unitNote?: string;
  /** How the actual and the reference are named on this page, e.g. "2025" and "2024". */
  acLabel: string; pyLabel: string;
  kpis: KpiInput[];
  /** The time series card (left): one AC and one PY value per point, e.g. months. */
  time: MeasureInput & { points: { label: string; ac: number; py: number }[] };
  /** The structure card (right): items ranked by AC, e.g. regions or departments. */
  structure: MeasureInput & { items: { key: string; name: string; ac: number; py: number }[] };
  /** Build the key message from the view model; default: lead KPI, weakest item, first rate KPI. */
  message?: (vm: KeyFiguresVM) => MessagePart[];
  /** KPIs that are the total of the time points or of the structure items (by KPI key); their AC and PY must equal
   *  the sum. A mismatch is listed in vm.checks and shown on the page: numbers that disagree are not to be trusted. */
  totals?: { time?: string; structure?: string };
}

export interface Kpi extends Variance { key: string; label: string; unit: string; kind: Kind; acText: string; pyText: string }
export interface Point extends Variance { key: string; label: string; ac: number; py: number; acText: string; pyText: string }
export interface Item extends Point { name: string }
export interface MessagePart { t: string; k?: string; tone?: Tone | "value" }

export interface KeyFiguresVM {
  title: string; scope: string; acLabel: string; pyLabel: string;
  message: MessagePart[];
  kpis: Kpi[];
  time: { title: string; unit: string; points: Point[]; max: number; ticks: number[]; best: Point; dip: Point; below: number };
  structure: { title: string; unit: string; items: Item[]; max: number; worst: Item | null };
  /** Data checks that failed (parts against totals), as sentences; empty when the input is consistent. */
  checks: string[];
}

/** Parts against their total, per scenario; a sentence per mismatch beyond half a unit at the total's precision. */
export function checkTotals(S: KeyFiguresInput): string[] {
  const out: string[] = [];
  const sides: [string | undefined, string, { ac: number; py: number }[]][] = [
    [S.totals?.time, S.time.title, S.time.points], [S.totals?.structure, S.structure.title, S.structure.items]];
  for (const [key, title, parts] of sides) {
    if (!key) continue;
    const k = S.kpis.find((x) => x.key === key);
    if (!k) { out.push(`${title}: no KPI "${key}" to check the total against.`); continue; }
    for (const [which, label] of [["ac", S.acLabel], ["py", S.pyLabel]] as const) {
      if (which === "py" && parts.every((p) => !p.py)) continue; // no reference parts: nothing to check
      const sum = parts.reduce((a, p) => a + p[which], 0);
      if (Math.abs(sum - k[which]) >= 0.5 * 10 ** -k.decimals) {
        out.push(`${title} adds up to ${fmt(sum, k.decimals)} in ${label}, but ${k.label} is ${fmt(k[which], k.decimals)}.`);
      }
    }
  }
  return out;
}

/** The default key message: "<lead KPI> <Δ%> on <PY label> to <AC> <unit>; <weakest item> <Δ%>, <first rate> <Δpp>." */
export function defaultMessage(vm: KeyFiguresVM): MessagePart[] {
  const lead = vm.kpis[0]!, rate = vm.kpis.find((k) => k.kind === "rate"), worst = vm.structure.worst;
  const parts: MessagePart[] = [{ t: `${lead.label} ` }];
  if (lead.relText) parts.push({ t: lead.relText, k: `${lead.key}.rel`, tone: lead.relTone }, { t: ` on ${vm.pyLabel} to ` });
  else parts.push({ t: lead.absText, k: `${lead.key}.abs`, tone: lead.absTone }, { t: ` on ${vm.pyLabel} to ` });
  parts.push({ t: lead.acText, k: `${lead.key}.ac`, tone: "value" }, { t: lead.unit && lead.unit !== "%" ? ` ${lead.unit}` : lead.unit });
  if (worst) parts.push({ t: `; ${worst.name} ` }, { t: worst.relText!, k: `item.${worst.key}.rel`, tone: worst.relTone });
  if (rate) parts.push({ t: `, ${rate.label.toLowerCase()} ` }, { t: rate.absText, k: `${rate.key}.abs`, tone: rate.absTone });
  parts.push({ t: "." });
  return parts;
}

/** The view model of a key-figures page. The time and structure cards share no axis (different grains); each shares within itself. */
export function buildKeyFigures(S: KeyFiguresInput): KeyFiguresVM {
  const kpis: Kpi[] = S.kpis.map((k) => ({
    key: k.key, label: k.label, unit: k.unit, kind: k.kind,
    acText: fmt(k.ac, k.decimals), pyText: fmt(k.py, k.decimals),
    ...variance(k.ac, k.py, k.decimals, k.polarity, k.kind),
  }));
  const T = S.time, St = S.structure;
  const points: Point[] = T.points.map((pt, i) => ({
    key: `t${i + 1}`, label: pt.label, ac: pt.ac, py: pt.py, acText: fmt(pt.ac, T.decimals), pyText: fmt(pt.py, T.decimals),
    ...variance(pt.ac, pt.py, T.decimals, T.polarity, "amount"),
  }));
  const items: Item[] = [...St.items].sort((a, b) => b.ac - a.ac).map((r) => ({
    key: r.key, label: r.name, name: r.name, ac: r.ac, py: r.py, acText: fmt(r.ac, St.decimals), pyText: fmt(r.py, St.decimals),
    ...variance(r.ac, r.py, St.decimals, St.polarity, "amount"),
  }));
  const withRel = points.filter((p) => p.rel != null);
  const tMax = Math.max(...points.flatMap((p) => [p.ac, p.py]));
  // the weakest item by impact: the lowest Δ% for polarity +1, the highest for −1
  const ranked = items.filter((r) => r.rel != null).sort((a, b) => (a.rel! - b.rel!) * (St.polarity === -1 ? -1 : 1));
  const vm: KeyFiguresVM = {
    title: S.title ?? "Key figures",
    scope: [S.company, S.period, S.unitNote].filter(Boolean).join(" · "),
    acLabel: S.acLabel, pyLabel: S.pyLabel,
    message: [],
    kpis,
    time: {
      title: T.title, unit: T.unit, points, max: tMax, ticks: niceTicks(tMax),
      best: withRel.reduce((a, b) => (b.rel! > a.rel! ? b : a), withRel[0] ?? points[0]!),
      dip: withRel.reduce((a, b) => (b.rel! < a.rel! ? b : a), withRel[0] ?? points[0]!),
      below: points.filter((p) => p.relDir < 0).length,
    },
    structure: { title: St.title, unit: St.unit, items, max: Math.max(...items.flatMap((r) => [r.ac, r.py])), worst: ranked[0] ?? null },
    checks: checkTotals(S),
  };
  vm.message = (S.message ?? defaultMessage)(vm);
  return vm;
}

/** Every number a page shows, by data-k key: what the reconcile test compares each style's page against. */
export function expectedTexts(vm: KeyFiguresVM): Record<string, string> {
  const want: Record<string, string> = {};
  const put = (p: string, v: { acText: string; pyText: string; absText: string; relText: string | null }) => {
    want[p + ".ac"] = v.acText; want[p + ".py"] = v.pyText; want[p + ".abs"] = v.absText;
    if (v.relText) want[p + ".rel"] = v.relText;
  };
  vm.kpis.forEach((k) => put(k.key, k));
  vm.time.points.forEach((m) => put(m.key, m));
  vm.structure.items.forEach((r) => put(`item.${r.key}`, r));
  return want;
}

/** The numbers every style must show (the shared set); IBCS may show more. Points' Δ% only where labels are not thinned. */
export function sharedKeys(vm: KeyFiguresVM, phone: boolean): string[] {
  const need: string[] = [];
  vm.kpis.forEach((k) => need.push(k.key + ".ac", k.key + ".py", k.key + ".abs", ...(k.relText ? [k.key + ".rel"] : [])));
  vm.structure.items.forEach((r) => need.push(`item.${r.key}.ac`, `item.${r.key}.rel`));
  if (!phone) vm.time.points.forEach((m) => need.push(m.key + ".rel"));
  return need;
}
