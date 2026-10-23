import { useEffect, useMemo, useState, type ReactNode } from "react";
import { STYLE_PARTS } from "./parts";
import { ReportPage } from "./ReportPage";
import { useReportStyle } from "./StyleProvider";
import { buildKeyFigures, type KeyFiguresInput } from "./viewModel";

const PHONE = "(max-width: 760px)";

/** True at phone width (≤ 760 px); `initial` serves server rendering and tests. */
export function usePhone(initial = false): boolean {
  const [phone, setPhone] = useState(() => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(PHONE).matches : initial));
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(PHONE);
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return phone;
}

/**
 * The reference page: one data input → one view model → the current style's parts in the shared skeleton.
 * Switching the style changes the parts only; the view model (and so every number) is the same object.
 */
export function KeyFiguresPage({ data, phone: phoneProp, initialChartWidth, footnote }:
  { data: KeyFiguresInput; phone?: boolean; initialChartWidth?: { time: number; structure: number }; footnote?: ReactNode }) {
  const { style } = useReportStyle();
  const measured = usePhone(phoneProp ?? false);
  const phone = phoneProp ?? measured;
  const vm = useMemo(() => buildKeyFigures(data), [data]);
  const parts = STYLE_PARTS[style](vm, { phone });
  return <ReportPage key={`${style}-${phone}`} vm={vm} parts={parts} initialChartWidth={initialChartWidth} footnote={footnote} />;
}
