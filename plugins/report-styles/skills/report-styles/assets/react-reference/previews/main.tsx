// Preview app: the reference components exactly as an app would use them. Built by scripts/build-previews.mjs.
// ?data=people or ?data=service shows a test page from fixtures.ts instead of the sample.
import { createRoot } from "react-dom/client";
import "../src/report-styles/styles/index.css";
import { buildKeyFigures, expectedTexts, KeyFiguresPage, SAMPLE, sharedKeys, STYLE_TOKENS, StyleProvider, TopBar } from "../src/report-styles";
import { HR_FIXTURE, SERVICE_FIXTURE } from "../src/report-styles/fixtures";

const which = new URLSearchParams(location.search).get("data");
const data = which === "people" ? HR_FIXTURE : which === "service" ? SERVICE_FIXTURE : SAMPLE;

// for scripts/check-previews.mjs only: what the page must show, from the same view model the page draws
const vm = buildKeyFigures(data);
(window as unknown as { __REPORT_STYLES__: unknown }).__REPORT_STYLES__ = {
  expected: expectedTexts(vm), headline: vm.message.flatMap((p) => (p.k ? [p.k] : [])),
  shared: { desktop: sharedKeys(vm, false), phone: sharedKeys(vm, true) }, tokens: STYLE_TOKENS,
};

const styles = (document.documentElement.dataset.styles ?? "ibcs,showcase,soft,graphic,annual,wallboard").split(",");
createRoot(document.getElementById("app")!).render(
  <StyleProvider styles={styles}>
    <TopBar brand={<>Sample Co <span className="rs-dim">Reports</span></>} />
    <KeyFiguresPage data={data} footnote="Fictitious sample data. Δ% is N/A where the reference is zero or blank; a variance shown as zero has no colour." />
  </StyleProvider>,
);
