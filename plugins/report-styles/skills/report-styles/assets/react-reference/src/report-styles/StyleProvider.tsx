import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STYLE_TOKENS, type StyleId } from "./tokens.generated";
import { offeredStyles, resolveStyle, resolveTheme, STYLE_PARAM, THEME_PARAM, themePinned, withParam, type Theme } from "./state";

export interface StyleLabel { label: string; persona: string }

export interface ReportStyleState {
  style: StyleId; theme: Theme; cvd: boolean; offered: StyleId[];
  /** The label and persona the switch shows for a style: the app's override, else the style's tokens. */
  meta(s: StyleId): StyleLabel;
  setStyle(s: StyleId): void; setTheme(t: Theme): void; setCvd(on: boolean): void;
}

const Ctx = createContext<ReportStyleState | null>(null);

export function useReportStyle(): ReportStyleState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useReportStyle needs a <StyleProvider> above it");
  return v;
}

const DARK = "(prefers-color-scheme: dark)";
const hasWindow = typeof window !== "undefined";
const search = () => (hasWindow ? window.location.search : "");
const prefersDark = () => hasWindow && !!window.matchMedia?.(DARK).matches;

export interface StyleProviderProps {
  /** The styles this app offers, first = default. One style = pre-selected, no switch rendered. */
  styles: readonly string[];
  /** "system" (default) follows prefers-color-scheme until the reader picks a theme. */
  theme?: Theme | "system";
  /** Initial URL query, for server rendering and tests; in a browser the live URL is read. */
  initialSearch?: string;
  /** Per-app names for the switch, e.g. { soft: { persona: "for the team" } }; the style's look is unchanged. */
  labels?: Partial<Record<StyleId, Partial<StyleLabel>>>;
  /** The element that carries data-style / data-theme / data-cvd (default: <html>, so the page background follows). */
  root?: () => HTMLElement | null;
  children: ReactNode;
}

/**
 * Sets the complete --rs-* variable set by putting data-style, data-theme and data-cvd on one root element; the
 * generated CSS does the rest, so a switch is an attribute change, never a reload. Keeps `style` and `theme` in the URL.
 */
export function StyleProvider({ styles, theme: themeDefault = "system", initialSearch, labels, root, children }: StyleProviderProps) {
  const key = styles.join(",");
  const offered = useMemo(() => offeredStyles(key.split(",")), [key]);
  const start = new URLSearchParams(initialSearch ?? search());
  const [style, setStyleState] = useState<StyleId>(() => resolveStyle(start, offered));
  const [theme, setThemeState] = useState<Theme>(() => resolveTheme(start, themeDefault, prefersDark()));
  const [cvd, setCvd] = useState(() => start.get("cvd") === "on");

  const write = useCallback((param: string, value: string) => {
    if (hasWindow) window.history.replaceState(window.history.state, "", withParam(window.location.search, param, value));
  }, []);
  const setStyle = useCallback((s: StyleId) => { if (offered.includes(s)) { setStyleState(s); write(STYLE_PARAM, s); } }, [offered, write]);
  const setTheme = useCallback((t: Theme) => { setThemeState(t); write(THEME_PARAM, t); }, [write]);

  // follow the system theme live, unless the URL pins one or the app fixed a default
  useEffect(() => {
    if (!hasWindow || themeDefault !== "system" || !window.matchMedia) return;
    const mq = window.matchMedia(DARK);
    const on = () => { if (!themePinned(new URLSearchParams(search()))) setThemeState(mq.matches ? "dark" : "light"); };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [themeDefault]);

  useEffect(() => {
    const el = root ? root() : hasWindow ? document.documentElement : null;
    if (!el) return;
    el.dataset.style = style;
    el.dataset.theme = theme;
    el.dataset.cvd = cvd ? "on" : "off";
  }, [style, theme, cvd, root]);

  const meta = useCallback((s: StyleId): StyleLabel => ({ label: styleMeta(s).label, persona: styleMeta(s).persona, ...labels?.[s] }), [labels]);
  const value = useMemo(() => ({ style, theme, cvd, offered, meta, setStyle, setTheme, setCvd }), [style, theme, cvd, offered, meta, setStyle, setTheme]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Label and persona of a style, from its tokens. */
export const styleMeta = (s: StyleId) => STYLE_TOKENS[s].meta;
