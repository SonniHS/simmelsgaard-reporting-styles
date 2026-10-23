import { describe, expect, it } from "vitest";
import { act, create } from "react-test-renderer";
import { KeyFiguresPage } from "./KeyFiguresPage";
import { HR_FIXTURE } from "./fixtures";
import { SAMPLE } from "./sample";
import { pxPerUnit } from "./scale";
import { StyleProvider } from "./StyleProvider";

describe("pxPerUnit", () => {
  it("gives every chart of a unit the smallest px per unit, zero inside the span", () => {
    const m = pxPerUnit([
      { unit: "mEUR", min: 0, max: 11.3, availablePx: 168 },   // months: 14.9 px per unit on their own
      { unit: "mEUR", min: 0, max: 31.5, availablePx: 180 },   // regions: 5.7
      { unit: "mEUR", min: -2, max: 2.6, availablePx: 44 },     // a Δ tier spans −2…+2.6
      { unit: "FTE", min: 0, max: 1250, availablePx: 180 },
    ]);
    expect(m.get("mEUR")).toBeCloseTo(180 / 31.5);
    expect(m.get("FTE")).toBeCloseTo(180 / 1250);
    expect(pxPerUnit([{ unit: "x", min: 0, max: 0, availablePx: 100 }]).has("x")).toBe(false);
  });
});

// The IBCS page's value marks (AC columns and AC bars) carry data-u / data-v; their drawn length per unit must match.
function ppuByChart(data: typeof SAMPLE) {
  let r!: ReturnType<typeof create>;
  act(() => {
    r = create(<StyleProvider styles={["ibcs"]} initialSearch=""><KeyFiguresPage data={data} phone={false} initialChartWidth={{ time: 720, structure: 480 }} /></StyleProvider>);
  });
  const marks = r.root.findAll((n) => n.type === "rect" && n.props["data-u"] != null && n.props["data-v"] > 0);
  return marks.map((n) => ({ unit: n.props["data-u"] as string, dim: n.props["data-dim"], ppu: (n.props["data-dim"] === "w" ? n.props.width : n.props.height) / n.props["data-v"] }));
}

describe("same unit, same scale on a page (CH 4.1)", () => {
  it("draws the months and the regions of the sample (both mEUR) at one px per unit", () => {
    const ms = ppuByChart(SAMPLE);
    expect(new Set(ms.map((m) => m.dim))).toEqual(new Set(["h", "w"])); // both charts measured
    const lo = Math.min(...ms.map((m) => m.ppu)), hi = Math.max(...ms.map((m) => m.ppu));
    expect(hi / lo).toBeLessThan(1.02);
  });
  it("keeps separate scales for different units (FTE and hours)", () => {
    const ms = ppuByChart(HR_FIXTURE);
    const fte = ms.filter((m) => m.unit === "FTE").map((m) => m.ppu), h = ms.filter((m) => m.unit === "h").map((m) => m.ppu);
    expect(Math.max(...fte) / Math.min(...fte)).toBeLessThan(1.02);
    expect(Math.max(...h) / Math.min(...h)).toBeLessThan(1.02);
    expect(Math.abs(fte[0]! - h[0]!)).toBeGreaterThan(0.01);
  });
});
