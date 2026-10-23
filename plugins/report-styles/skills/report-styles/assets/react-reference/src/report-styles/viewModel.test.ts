import { describe, expect, it } from "vitest";
import { buildKeyFigures, checkTotals, dir, fmt, fmtDelta, keep, niceTicks, relVar, tickText, tone, variance } from "./viewModel";
import { HR_FIXTURE } from "./fixtures";
import { SAMPLE } from "./sample";

describe("hard rules", () => {
  it("relative variance uses the signed reference and is N/A for REF ≤ 0, blank or displaying as zero", () => {
    expect(relVar(110, 100, 1)).toBeCloseTo(0.1);
    expect(relVar(5, 0, 1)).toBeNull();
    expect(relVar(5, -10, 1)).toBeNull();
    expect(relVar(5, null, 1)).toBeNull();
    expect(relVar(5, 0.04, 1)).toBeNull(); // displays as 0.0
    expect(relVar(5, 0.05, 1)).not.toBeNull();
  });
  it("a variance that displays as zero has no sign and no tone", () => {
    expect(fmtDelta(0.04, 1)).toBe("0.0");
    expect(fmtDelta(-0.04, 1)).toBe("0.0");
    expect(tone(0.04, 1, 1)).toBe("none");
    expect(dir(-0.04, 1)).toBe(0);
  });
  it("polarity picks the tone, the sign picks the direction", () => {
    expect(tone(2, -1, 1)).toBe("bad");
    expect(dir(2, 1)).toBe(1);
    expect(tone(-2, -1, 1)).toBe("good");
    expect(tone(2, 0, 1)).toBe("neutral");
  });
  it("uses a true minus and never prints −0.0", () => {
    expect(fmt(-1.24, 1)).toBe("−1.2");
    expect(fmt(-0.04, 1)).toBe("0.0");
    expect(fmt(14820, 0)).toBe("14,820");
  });
  it("a rate's variance is in pp on display-rounded values and has no Δ%", () => {
    const v = variance(2.31, 2.29, 1, -1, "rate");
    expect(v.absText).toBe("0.0 pp");
    expect(v.absTone).toBe("none");
    expect(v.relText).toBeNull();
  });
  it("label thinning keeps the largest |value|, the smallest and the last, only beyond six labels", () => {
    expect(keep([1, -5, 3, 2, 4, 1, 2], true)).toEqual([false, true, false, false, false, false, true]);
    expect(keep([1, -5, 3, 2], true)).toEqual([true, true, true, true]);
    expect(keep([1, 2], false)).toEqual([true, true]);
    // the largest (index 5) sits next to the last (index 6): with a 2-point gap only the last and the smallest stay
    expect(keep([5, -9, 3, 2, 4, 30, 2], true, 2)).toEqual([false, true, false, false, false, false, true]);
  });
  it("a score has a Δ in its own unit and no Δ% (a % of a bounded scale misleads)", () => {
    const v = variance(4.42, 4.47, 2, 1, "score");
    expect([v.absText, v.absTone, v.relText]).toEqual(["−0.05", "bad", null]);
  });
});

describe("the Key figures view model", () => {
  const vm = buildKeyFigures(SAMPLE);
  it("builds the message from view-model texts only", () => {
    expect(vm.message.map((p) => p.t).join("")).toBe("Revenue +5.4% on 2024 to 111.7 mEUR; North −7.3%, gross margin −1.2 pp.");
  });
  it("marks the new region's Δ% N/A and sorts items by AC", () => {
    expect(vm.structure.items.map((r) => r.key)).toEqual(["south", "north", "west", "east", "central", "online"]);
    expect(vm.structure.items.at(-1)!.relText).toBe("N/A");
    expect(vm.structure.worst!.key).toBe("north");
  });
  it("finds the largest gain, the weakest point and how many points are below PY", () => {
    expect([vm.time.best.label, vm.time.dip.label, vm.time.below]).toEqual(["Dec", "Jul", 1]);
    expect(vm.time.ticks).toEqual([0, 2.5, 5, 7.5, 10, 12.5]);
  });
});

describe("other data", () => {
  const hr = buildKeyFigures(HR_FIXTURE);
  it("takes titles, units and labels from the input", () => {
    expect([hr.title, hr.time.title, hr.structure.unit, hr.acLabel]).toEqual(["People", "Headcount by quarter", "h", "2025"]);
  });
  it("ranks the weakest item by impact: with polarity −1 the largest rise is the worst", () => {
    expect(hr.structure.worst!.key).toBe("finance"); // +7.9% beats Operations' +6.7%
    expect(hr.structure.worst!.relTone).toBe("bad");
  });
  it("builds a default message from the lead KPI, the weakest item and the first rate", () => {
    expect(hr.message.map((p) => p.t).join("")).toBe("Headcount +2.9% on 2024 to 1,240 FTE; Finance +7.9%, sick leave +0.4 pp.");
  });
});

describe("data checks", () => {
  it("the sample's months and regions add up to its revenue", () => {
    expect(buildKeyFigures(SAMPLE).checks).toEqual([]);
  });
  it("names a part that does not add up to its total, per scenario", () => {
    const bad = { ...SAMPLE, structure: { ...SAMPLE.structure, items: [...SAMPLE.structure.items, { key: "x", name: "Extra", ac: 1, py: 0 }] } };
    expect(checkTotals(bad)).toEqual(["Revenue by region adds up to 112.7 in 2025, but Revenue is 111.7."]);
    expect(checkTotals({ ...SAMPLE, totals: { time: "nope" } })).toEqual(['Revenue by month: no KPI "nope" to check the total against.']);
  });
});

describe("axis ticks", () => {
  it("start at zero, reach the maximum, use round steps", () => {
    expect(niceTicks(11.3)).toEqual([0, 2.5, 5, 7.5, 10, 12.5]);
    expect(niceTicks(1240)).toEqual([0, 250, 500, 750, 1000, 1250]);
    expect(niceTicks(3)).toEqual([0, 1, 2, 3]);
    expect(niceTicks(0)).toEqual([0, 1]);
    expect([1250, 2.5, 0].map(tickText)).toEqual(["1,250", "2.5", "0"]);
    for (const m of [0.37, 7, 99, 101, 4321]) {
      const t = niceTicks(m);
      expect(t[0]).toBe(0);
      expect(t.at(-1)!).toBeGreaterThanOrEqual(m);
      expect(t.length).toBeGreaterThanOrEqual(3);
      expect(t.length).toBeLessThanOrEqual(7);
    }
  });
});
