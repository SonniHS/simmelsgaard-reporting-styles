import { STYLE_IDS, type StyleId } from "./tokens.generated";

// Pure rules of the style and theme switches; StyleProvider applies them to the URL and the document.

export type Theme = "light" | "dark";
export const THEMES: readonly Theme[] = ["light", "dark"];

/** URL keys. `style` and `theme` are presentation keys: "Reset filters" keeps them. */
export const STYLE_PARAM = "style";
export const THEME_PARAM = "theme";
/** An older key: variant=ibcs|artistic. Kept as an alias so old links open the right style. */
export const LEGACY_PARAM = "variant";
const LEGACY: Record<string, StyleId> = { ibcs: "ibcs", artistic: "showcase" };

export const isStyleId = (s: unknown): s is StyleId => typeof s === "string" && (STYLE_IDS as readonly string[]).includes(s);

/** The offered styles, in the builder's order, unknown ids dropped. Throws on an empty list (a config error). */
export function offeredStyles(styles: readonly string[]): StyleId[] {
  const out = styles.filter(isStyleId);
  if (!out.length) throw new Error(`report-styles: none of ${JSON.stringify(styles)} is a style (${STYLE_IDS.join(", ")})`);
  return [...new Set(out)];
}

/** The style to draw: the URL's if offered (style=, else the legacy variant=), otherwise the first offered style. */
export function resolveStyle(params: URLSearchParams, offered: readonly StyleId[]): StyleId {
  const s = params.get(STYLE_PARAM) ?? LEGACY[params.get(LEGACY_PARAM) ?? ""] ?? null;
  return s && (offered as readonly string[]).includes(s) ? (s as StyleId) : offered[0]!;
}

/** The theme to draw: the URL's if valid, else the configured default, else the reader's system preference. */
export function resolveTheme(params: URLSearchParams, fallback: Theme | "system", prefersDark: boolean): Theme {
  const t = params.get(THEME_PARAM);
  if (t === "light" || t === "dark") return t;
  if (fallback !== "system") return fallback;
  return prefersDark ? "dark" : "light";
}

/** Whether the URL pins the theme (then a system change is ignored). */
export const themePinned = (params: URLSearchParams) => THEMES.includes(params.get(THEME_PARAM) as Theme);

/** Arrow-key movement in a radio group, wrapping at both ends. */
export function step<T>(items: readonly T[], current: T, key: string): T | null {
  const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[key];
  if (!d) return null;
  const i = items.indexOf(current);
  return items[(i + d + items.length) % items.length]!;
}

/** The query string after a switch: sets the key, drops the legacy alias so the URL has one source of truth. */
export function withParam(search: string, key: string, value: string): string {
  const p = new URLSearchParams(search);
  p.set(key, value);
  if (key === STYLE_PARAM) p.delete(LEGACY_PARAM);
  return "?" + p.toString();
}
