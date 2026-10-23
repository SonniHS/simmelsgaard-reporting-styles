import type { ReactNode, SVGProps } from "react";
import type { Point } from "../viewModel";

// Small SVG helpers shared by the style parts. Numbers in charts are <T k=…> (a <text>) or <S k=…> (a <tspan>),
// so the reconcile test finds them by data-k exactly as in HTML.

export const f = (x: number) => Math.round(x * 10) / 10;

export function T({ k, children, ...rest }: { k?: string; children: ReactNode } & SVGProps<SVGTextElement>) {
  return <text data-k={k} {...rest}>{children}</text>;
}

export function S({ k, children, ...rest }: { k?: string; children: ReactNode } & SVGProps<SVGTSpanElement>) {
  return <tspan data-k={k} {...rest}>{children}</tspan>;
}

export function Svg({ w, h, label, children }: { w: number; h: number; label: string; children: ReactNode }) {
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>{children}</svg>;
}

/** Axis label of a time point: in full, or its initial on a phone when more than six points share the axis
 *  ("Jan" → "J"; quarters keep "Q1"). */
export const mlabel = (m: Point, phone: boolean, count = 12): string => (phone && count > 6 ? (m.label[0] ?? "") : m.label);

/** Width of a column of labels (names, values): about `perChar` px a character, kept between min and max. */
export const textWidth = (texts: string[], min: number, max: number, perChar = 7) =>
  Math.round(Math.min(max, Math.max(min, Math.max(0, ...texts.map((t) => t.length)) * perChar + 10)));

/** A label shortened with "…" to fit `px` (same estimate as textWidth); the full text stays in a <title> tooltip. */
export function Fit({ text, px, perChar = 7, ...rest }: { text: string; px: number; perChar?: number } & SVGProps<SVGTextElement>) {
  const max = Math.max(3, Math.floor((px - 10) / perChar));
  const shown = text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
  return <text {...rest}>{shown !== text && <title>{text}</title>}{shown}</text>;
}

/** True when labels of these texts do not fit the space between points (about `perChar` px a character):
 *  the chart then thins its labels by priority (keep), whatever the screen width. */
export const crowded = (step: number, texts: (string | null | undefined)[], perChar = 7.2) =>
  step < Math.max(0, ...texts.map((t) => (t ?? "").length)) * perChar + 8;

/** Baselines for the two end labels of a line chart: each on the side of its own line (the higher value above), pushed
 *  apart to at least `gap` px when the values are close. */
export function endLabels(yAc: number, yPy: number, gap = 16): { ac: number; py: number } {
  const acUp = yAc <= yPy, ac = yAc + (acUp ? 2 : 14), py = yPy + (acUp ? 14 : 2);
  if (Math.abs(py - ac) >= gap) return { ac, py };
  const mid = (ac + py) / 2;
  return acUp ? { ac: mid - gap / 2, py: mid + gap / 2 } : { ac: mid + gap / 2, py: mid - gap / 2 };
}

/** Inset of the first and last column so their centred labels stay inside the card. */
export const edgePad = (w: number, n: number, texts: (string | null | undefined)[], perChar = 7.4) =>
  Math.max(0, Math.ceil((Math.max(0, ...texts.map((t) => (t ?? "").length)) * perChar + 10) / 2 - w / n / 2) + 2);

/** Axis labels of the time points: every label when they fit, otherwise every k-th one counted back from the last
 *  (the most recent point always keeps its label); hidden ones are "". */
export function axisLabels(m: Point[], phone: boolean, step: number, perChar = 7.2): string[] {
  const full = m.map((d) => mlabel(d, phone, m.length));
  const every = Math.max(1, Math.ceil((Math.max(0, ...full.map((t) => t.length)) * perChar + 8) / Math.max(step, 1)));
  return full.map((t, i) => ((m.length - 1 - i) % every === 0 ? t : ""));
}

/** An SVG path through points. */
export const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${f(x)},${f(y)}`).join("");
