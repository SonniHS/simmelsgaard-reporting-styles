import { describe, expect, it } from "vitest";
import { offeredStyles, resolveStyle, resolveTheme, step, themePinned, withParam } from "./state";

const p = (s: string) => new URLSearchParams(s);

describe("style switch", () => {
  const all = offeredStyles(["ibcs", "showcase", "soft", "graphic"]);
  it("takes the URL's style when offered, else the first offered", () => {
    expect(resolveStyle(p("?style=soft"), all)).toBe("soft");
    expect(resolveStyle(p("?style=nope"), all)).toBe("ibcs");
    expect(resolveStyle(p(""), ["graphic", "ibcs"])).toBe("graphic");
    expect(resolveStyle(p("?style=soft"), ["ibcs"])).toBe("ibcs"); // pre-selected: the URL cannot switch it
  });
  it("keeps old variant=artistic links working", () => {
    expect(resolveStyle(p("?variant=artistic"), all)).toBe("showcase");
    expect(resolveStyle(p("?variant=ibcs&style=soft"), all)).toBe("soft");
    expect(withParam("?variant=artistic&page=2", "style", "soft")).toBe("?page=2&style=soft");
  });
  it("rejects a config with no known style and drops unknown or repeated ids", () => {
    expect(() => offeredStyles(["poster"])).toThrow();
    expect(offeredStyles(["soft", "x", "soft", "ibcs"])).toEqual(["soft", "ibcs"]);
  });
});

describe("theme switch", () => {
  it("URL first, then the app default, then the system", () => {
    expect(resolveTheme(p("?theme=dark"), "light", false)).toBe("dark");
    expect(resolveTheme(p("?theme=sepia"), "system", true)).toBe("dark");
    expect(resolveTheme(p(""), "light", true)).toBe("light");
    expect(resolveTheme(p(""), "system", false)).toBe("light");
    expect(themePinned(p("?theme=light"))).toBe(true);
    expect(themePinned(p("?style=soft"))).toBe(false);
  });
  it("arrow keys wrap in both directions and ignore other keys", () => {
    expect(step(["a", "b", "c"], "c", "ArrowRight")).toBe("a");
    expect(step(["a", "b", "c"], "a", "ArrowLeft")).toBe("c");
    expect(step(["a", "b"], "a", "Enter")).toBeNull();
  });
});
