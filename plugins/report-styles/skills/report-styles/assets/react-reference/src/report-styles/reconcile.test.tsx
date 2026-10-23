import { describe, expect, it } from "vitest";
import { act, create, type ReactTestInstance } from "react-test-renderer";
import { KeyFiguresPage } from "./KeyFiguresPage";
import { StyleProvider } from "./StyleProvider";
import { TopBar } from "./switches";
import { SAMPLE } from "./sample";
import { HR_FIXTURE, SERVICE_FIXTURE, STRESS_FIXTURE } from "./fixtures";
import { STYLE_IDS } from "./tokens.generated";
import { buildKeyFigures, expectedTexts, sharedKeys } from "./viewModel";

// The reconcile test: every number on every style's page, desktop and phone, is the view model's text, and every
// style shows the shared set. The view model is what the IBCS page shows, so this is "every style vs IBCS".

const DATA = { sample: SAMPLE, people: HR_FIXTURE, service: SERVICE_FIXTURE, stress: STRESS_FIXTURE };

const text = (n: ReactTestInstance | string): string => (typeof n === "string" ? n : n.children.map(text).join(""));

function render(style: string, phone: boolean, styles: readonly string[] = STYLE_IDS, data = SAMPLE) {
  let r!: ReturnType<typeof create>;
  act(() => {
    r = create(
      <StyleProvider styles={styles} initialSearch={`?style=${style}&theme=light`}>
        <TopBar brand="Sample Co" />
        <KeyFiguresPage data={data} phone={phone} initialChartWidth={phone ? { time: 340, structure: 340 } : { time: 720, structure: 480 }} />
      </StyleProvider>,
    );
  });
  return r;
}

const numbers = (r: ReturnType<typeof create>) => {
  const shown: Record<string, string[]> = {};
  r.root.findAll((n) => typeof n.type === "string" && n.props["data-k"] != null).forEach((n) => {
    (shown[n.props["data-k"]] ??= []).push(text(n).trim());
  });
  return shown;
};

const classOrder = (r: ReturnType<typeof create>, names: string[]) =>
  r.root.findAll((n) => typeof n.type === "string" && typeof n.props.className === "string")
    .flatMap((n) => names.filter((c) => n.props.className.split(" ").includes(c)));

describe.each(Object.keys(DATA) as (keyof typeof DATA)[])("data %s", (name) => {
 const vm = buildKeyFigures(DATA[name]);
 const want = expectedTexts(vm);
 describe.each(STYLE_IDS)("style %s", (style) => {
  describe.each([false, true])("phone %s", (phone) => {
    const r = render(style, phone, STYLE_IDS, DATA[name]);
    const shown = numbers(r);
    it("shows only view-model texts", () => {
      for (const [k, texts] of Object.entries(shown)) {
        expect(want, `unknown key ${k}`).toHaveProperty([k]);
        for (const t of texts) expect(t, k).toBe(want[k]);
      }
    });
    it("shows the shared set of numbers", () => {
      const missing = sharedKeys(vm, phone).filter((k) => !(k in shown));
      expect(missing).toEqual([]);
    });
    it("keeps the shared skeleton, in order", () => {
      expect(classOrder(r, ["rs-head", "rs-msg", "rs-kpis", "rs-time", "rs-structure", "rs-foot"]))
        .toEqual(["rs-head", "rs-msg", "rs-kpis", "rs-time", "rs-structure", "rs-foot"]);
      expect(r.root.findAll((n) => n.props.className === "rs-tile rs-anim")).toHaveLength(4);
    });
    it("names its cards from the data", () => {
      const titles = r.root.findAll((n) => n.type === "h2").map((n) => text(n));
      expect(titles).toEqual([vm.time.title, vm.structure.title]);
    });
  });
 });
});

describe("switches", () => {
  const radios = (r: ReturnType<typeof create>, group: string) =>
    r.root.find((n) => n.props.role === "radiogroup" && n.props["data-name"] === group).findAll((n) => n.type === "button");
  const checked = (r: ReturnType<typeof create>, group: string) => radios(r, group).find((b) => b.props["aria-checked"])!.props["data-v"];

  it("shows the app's own label and persona when it overrides them", () => {
    let r!: ReturnType<typeof create>;
    act(() => { r = create(<StyleProvider styles={["soft", "ibcs"]} labels={{ soft: { persona: "for the team" } }} initialSearch=""><TopBar brand="x" /></StyleProvider>); });
    const opts = r.root.findAll((n) => n.type === "option").map((n) => text(n));
    expect(opts).toEqual(["Soft · for the team", "IBCS · for the CFO"]);
  });

  it("renders no style switch when one style is offered (pre-select)", () => {
    const r = render("soft", false, ["soft"]);
    expect(r.root.findAll((n) => n.props.role === "radiogroup" && n.props["data-name"] === "style")).toHaveLength(0);
    expect(r.root.findAll((n) => n.props.role === "radiogroup" && n.props["data-name"] === "theme")).toHaveLength(1);
  });

  it("moves style and theme with the arrow keys, wrapping", () => {
    const r = render("terminal", false); // the last style: the arrow wraps to the first
    expect(checked(r, "style")).toBe("terminal");
    act(() => radios(r, "style").find((b) => b.props["aria-checked"])!.props.onKeyDown({ key: "ArrowRight", preventDefault() {} }));
    expect(checked(r, "style")).toBe("ibcs");
    act(() => radios(r, "theme").find((b) => b.props["aria-checked"])!.props.onKeyDown({ key: "ArrowLeft", preventDefault() {} }));
    expect(checked(r, "theme")).toBe("dark");
  });

  it("keeps every number when the style changes (one view model)", () => {
    const r = render("ibcs", false);
    const before = numbers(r)["revenue.ac"];
    act(() => radios(r, "style").find((b) => b.props["data-v"] === "showcase")!.props.onClick());
    expect(checked(r, "style")).toBe("showcase");
    expect(numbers(r)["revenue.ac"]).toEqual(before);
  });
});
