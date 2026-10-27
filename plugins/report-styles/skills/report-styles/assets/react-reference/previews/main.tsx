// Preview app: the reference components exactly as an app would use them. Built by scripts/build-previews.mjs.
// ?data=people or ?data=service shows a test page from fixtures.ts instead of the sample.
// ?embed=1: driven by the playground (playground.html) through postMessage — data, style, theme and CVD in, check
// results and the page height out.
import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "../src/report-styles/styles/index.css";
import {
  buildKeyFigures, expectedTexts, KeyFiguresPage, SAMPLE, sharedKeys, STYLE_TOKENS, StyleProvider, TopBar, useReportStyle,
  type KeyFiguresInput, type StyleId, type Theme,
} from "../src/report-styles";
import { HR_FIXTURE, SERVICE_FIXTURE, STRESS_FIXTURE } from "../src/report-styles/fixtures";
import { selfCheck } from "./selfcheck";

const params = new URLSearchParams(location.search);
const which = params.get("data");
const initial = which === "people" ? HR_FIXTURE : which === "service" ? SERVICE_FIXTURE : which === "stress" ? STRESS_FIXTURE : SAMPLE;
// embedded when the URL says so or when the page runs inside a frame (some hosts serve files without the query string)
const embed = params.get("embed") === "1" || window.self !== window.top;
const styles = (document.documentElement.dataset.styles ?? "ibcs,showcase,soft,graphic,annual,wallboard,contrast,terminal").split(",");

// for scripts/check-previews.mjs: what the page must show, from the same view model the page draws
function expose(data: KeyFiguresInput) {
  const vm = buildKeyFigures(data);
  (window as unknown as { __REPORT_STYLES__: unknown }).__REPORT_STYLES__ = {
    expected: expectedTexts(vm), headline: vm.message.flatMap((p) => (p.k ? [p.k] : [])),
    shared: { desktop: sharedKeys(vm, false), phone: sharedKeys(vm, true) }, tokens: STYLE_TOKENS,
  };
}

type Inbound =
  | { type: "rs:data"; data: KeyFiguresInput }
  | { type: "rs:set"; style?: StyleId; theme?: Theme; cvd?: boolean };

/** Inside the provider: applies the playground's settings, runs the checks after each render, reports back. */
function Bridge({ data, onData }: { data: KeyFiguresInput; onData(d: KeyFiguresInput): void }) {
  const { style, theme, cvd, setStyle, setTheme, setCvd } = useReportStyle();
  useEffect(() => {
    const on = (e: MessageEvent<Inbound>) => {
      if (e.source !== window.parent || !e.data || typeof e.data !== "object") return;
      if (e.data.type === "rs:data") onData(e.data.data);
      if (e.data.type === "rs:set") {
        if (e.data.style) setStyle(e.data.style);
        if (e.data.theme) setTheme(e.data.theme);
        if (e.data.cvd != null) setCvd(e.data.cvd);
      }
    };
    window.addEventListener("message", on);
    window.parent.postMessage({ type: "rs:ready" }, "*");
    return () => window.removeEventListener("message", on);
  }, [onData, setStyle, setTheme, setCvd]);
  const vm = useMemo(() => {
    try { return buildKeyFigures(data); } catch { return null; }
  }, [data]);
  // check after anything changes on the page — this component's render, a chart redrawing at a new width, fonts —
  // once the DOM has been quiet for a moment; the height goes along so the playground can size the frame
  useEffect(() => {
    if (!vm) return;
    let timer = 0;
    const run = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        window.parent.postMessage({ type: "rs:checks", style, theme, cvd, results: selfCheck(vm), height: document.body.scrollHeight }, "*");
      }, 120);
    };
    const mo = new MutationObserver(run), ro = new ResizeObserver(run);
    mo.observe(document.getElementById("app")!, { subtree: true, childList: true, characterData: true, attributes: true });
    ro.observe(document.body);
    document.fonts.ready.then(run);
    run();
    return () => { window.clearTimeout(timer); mo.disconnect(); ro.disconnect(); };
  }, [vm, style, theme, cvd]);
  return null;
}

function App() {
  const [data, setData] = useState<KeyFiguresInput>(initial);
  useEffect(() => expose(data), [data]);
  return (
    <StyleProvider styles={styles}>
      <TopBar brand={<>{data.company} <span className="rs-dim">Reports</span></>} />
      <KeyFiguresPage data={data} footnote="Fictitious sample data. Δ% is N/A where the reference is zero or blank; a variance shown as zero has no colour." />
      {embed && <Bridge data={data} onData={setData} />}
    </StyleProvider>
  );
}

expose(initial);
// embedded, the frame takes the page's height: no full-viewport floor, so the height can shrink as well as grow
if (embed) document.body.style.minHeight = "0";
createRoot(document.getElementById("app")!).render(<App />);
