// Browser check and screenshots: a report page in every offered style and both themes at 1280 and 390 px, in Chrome.
//   npm run previews && npm run check-previews -- [--out <dir for the PNGs>] [--data people|service]
// Your own app (a static build): node check-previews.mjs --site dist --page index.html --styles soft,ibcs
//   --theme-default dark   (the styles in the app's order; the app's theme default: system | light | dark)
// The page must expose window.__REPORT_STYLES__ = { expected, headline, shared, tokens } (see previews/main.tsx).
// Needs Playwright (not a dependency of this package: npm i -D playwright, or NODE_PATH to a node_modules with it).
// The site is served by a local HTTP server that this script starts on 127.0.0.1 and closes when done
// (fonts do not load from file://).
// Fails on: a number whose text differs from the view model (reconcile), a style missing a headline number,
// a missing number of the shared set (every KPI's AC, PY, ΔPY, ΔPY%; every item's AC and ΔPY%; every time point's
// ΔPY% at desktop width), a missing number of the key message, a page that leaves the shared skeleton (header,
// message, one row of four KPI tiles, time card left of structure card, footer, in that order), a chart label that
// overlaps another or leaves its card, horizontal scroll, a console error, any request that leaves the local server (fonts are self-hosted), a style
// font that did not load; and once per
// style: the default theme (the system's, or the app's fixed default), print uses the light colours, the CVD toggle swaps the
// impact colours, the theme switch works from the keyboard.
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
import http from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : fallback; };
const data = arg("--data") ? `&data=${arg("--data")}` : ""; // a fixture of the preview app
const out = path.resolve(process.cwd(), arg("--out", path.join(root, "previews/shots")));
fs.mkdirSync(out, { recursive: true });

const STYLES = arg("--styles", "ibcs,showcase,soft,graphic").split(",");
const THEME_DEFAULT = arg("--theme-default", "system");
const THEMES = ["light", "dark"];
const WIDTHS = [1280, 390];
const site = path.resolve(process.cwd(), arg("--site", root));
const pagePath = arg("--page", "previews/index.html");
if (site === root && !fs.existsSync(path.join(site, "previews/dist/main.js"))) throw new Error("previews not built: npm run previews");
if (!fs.existsSync(path.join(site, pagePath))) throw new Error(`no page ${pagePath} in ${site}`);
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".woff": "font/woff" };
const server = http.createServer((req, res) => {
  const file = path.join(site, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!file.startsWith(site + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" }).end(fs.readFileSync(file));
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const origin = `http://127.0.0.1:${server.address().port}`;
const page_url = `${origin}/${pagePath}`;
// installed Chrome locally; CI sets REPORT_STYLES_BROWSER=chromium (Playwright's bundled browser)
const browser = await chromium.launch({ headless: true, ...(process.env.REPORT_STYLES_BROWSER === "chromium" ? {} : { channel: "chrome" }) });
const fails = [];
const report = [];
let tokens; // the generated style tokens, read from the page
const geom = {}; // `${width}/${theme}` → style → box per skeleton element, compared across styles below
for (const width of WIDTHS) for (const theme of THEMES) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: width < 500 ? 2 : 1, reducedMotion: "reduce" });
  for (const style of STYLES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("request", (r) => {
      const u = r.url();
      if (!u.startsWith(origin + "/")) errors.push(`request to ${u}`);
    });
    await page.goto(`${page_url}?style=${style}&theme=${theme}${data}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const res = await page.evaluate((style) => {
      // expected texts straight from the view model the page draws: what the IBCS page shows
      const { expected: want, shared, headline, tokens } = window.__REPORT_STYLES__;
      const shown = {}, bad = [];
      document.querySelectorAll("[data-k]").forEach((el) => {
        const k = el.dataset.k, t = el.textContent.trim();
        if (!(k in want)) bad.push(`unknown key ${k}`);
        else if (t !== want[k]) bad.push(`${k}: shows "${t}", view model "${want[k]}"`);
        shown[k] = t;
      });
      // the shared set: the same metrics on every style (IBCS may show more)
      const missing = shared[window.innerWidth > 760 ? "desktop" : "phone"].filter((k) => !(k in shown));
      // the style's own fonts were served and loaded (self-hosted, no fallback)
      const families = new Set(Object.values(tokens[style].typography.family).map((f) => f.split(",")[0].replace(/"/g, "").trim()).filter((f) => f !== "system-ui"));
      const unloaded = [...families].filter((fam) => ![...document.fonts].some((ff) => ff.family.replace(/"/g, "") === fam && ff.status === "loaded"));
      // the shared skeleton, in order
      const order = [".rs-head", ".rs-msg", ".rs-kpis", ".rs-time", ".rs-structure", ".rs-foot"].map((q) => document.querySelector(q));
      const box = (el) => el.getBoundingClientRect();
      const skel = [];
      if (order.some((el) => !el)) skel.push("missing " + [".rs-head", ".rs-msg", ".rs-kpis", ".rs-time", ".rs-structure", ".rs-foot"].filter((_, i) => !order[i]).join(", "));
      else {
        for (let i = 1; i < order.length; i++) if (order[i - 1].compareDocumentPosition(order[i]) !== Node.DOCUMENT_POSITION_FOLLOWING) skel.push("sections out of order");
        const tiles = [...document.querySelectorAll(".rs-kpis > .rs-tile")];
        if (tiles.length !== 4) skel.push(`${tiles.length} KPI tiles`);
        if (window.innerWidth > 760) {
          if (new Set(tiles.map((t) => Math.round(box(t).top))).size !== 1) skel.push("KPI tiles not in one row");
          const [mo, re] = [box(order[3]), box(order[4])];
          if (!(Math.round(mo.top) === Math.round(re.top) && mo.left < re.left)) skel.push("time card not left of the structure card");
          if (!(box(order[2]).bottom <= mo.top)) skel.push("KPI row not above the charts");
        }
      }
      // horizontal geometry of the skeleton, for the cross-style comparison
      const g = {};
      const at = (name, el) => { if (el) { const b = box(el); g[name] = { left: b.left, width: b.width, top: b.top + window.scrollY }; } };
      at("page", document.querySelector(".rs-page"));
      document.querySelectorAll(".rs-kpis > .rs-tile").forEach((t, i) => at(`tile${i + 1}`, t));
      at("time card", document.querySelector(".rs-time"));
      at("structure card", document.querySelector(".rs-structure"));
      at("theme switch", document.querySelector('.rs-seg[data-name="theme"]'));
      // chart labels: none overlaps another, none leaves its card (a label that runs into a value or off the edge)
      const clash = [];
      document.querySelectorAll(".rs-card").forEach((card) => {
        const cb = card.getBoundingClientRect();
        const texts = [...card.querySelectorAll("svg text")].map((t) => ({ t, b: t.getBoundingClientRect() })).filter((x) => x.b.width > 0);
        texts.forEach(({ t, b }) => {
          if (b.left < cb.left - 1 || b.right > cb.right + 1) clash.push(`"${t.textContent}" leaves its card`);
        });
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i].b, b = texts[j].b;
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 1.5 && oy > 3) clash.push(`"${texts[i].t.textContent}" overlaps "${texts[j].t.textContent}"`);
        }
      });
      // same unit, same scale (CH 4.1): px per unit of every measurable value mark, per unit, across the page's charts
      const ppu = {};
      document.querySelectorAll("[data-u][data-v]").forEach((el) => {
        const v = +el.dataset.v, b = el.getBoundingClientRect(), px = el.dataset.dim === "w" ? b.width : b.height;
        if (v > 0 && px > 4) (ppu[el.dataset.u] ??= []).push({ chart: el.closest(".rs-card")?.className.match(/rs-(time|structure)/)?.[1], ppu: px / v });
      });
      const scale = [];
      for (const [u, ms] of Object.entries(ppu)) {
        const lo = Math.min(...ms.map((m) => m.ppu)), hi = Math.max(...ms.map((m) => m.ppu));
        if (hi > lo * 1.02 && hi - lo > 0.05) {
          const by = (c) => ms.filter((m) => m.chart === c).map((m) => m.ppu);
          scale.push(`${u}: ${lo.toFixed(2)}–${hi.toFixed(2)} px per unit (time ${Math.max(0, ...by("time")).toFixed(2)}, structure ${Math.max(0, ...by("structure")).toFixed(2)})`);
        }
      }
      const page = getComputedStyle(document.documentElement).getPropertyValue("--rs-color-surface-page").trim();
      return { g, bad, missing, skel, unloaded, clash, scale, tokens, headline, keys: Object.keys(shown), scroll: document.documentElement.scrollWidth - window.innerWidth, title: document.documentElement.dataset.style, page };
    }, style);
    ((geom[`${width}/${theme}`] ||= {})[style] = res.g);
    for (const c of res.clash) fails.push(`${style}/${theme}@${width}: label ${c}`);
    for (const c of res.scale) fails.push(`${style}/${theme}@${width}: same unit, different scale (CH 4.1): ${c}`);
    for (const fam of res.unloaded) fails.push(`${style}/${theme}@${width}: font ${fam} not loaded`);
    tokens ??= res.tokens;
    for (const k of res.missing) fails.push(`${style}/${theme}@${width}: shared number ${k} not shown`);
    for (const k of res.skel) fails.push(`${style}/${theme}@${width}: skeleton: ${k}`);
    for (const b of res.bad) fails.push(`${style}/${theme}@${width}: ${b}`);
    for (const k of res.headline) if (!res.keys.includes(k)) fails.push(`${style}/${theme}@${width}: headline number ${k} not shown`);
    if (res.scroll > 0) fails.push(`${style}/${theme}@${width}: horizontal scroll ${res.scroll}px`);
    if (res.title !== style) fails.push(`${style}/${theme}@${width}: page drew ${res.title}`);
    if (res.page !== tokens[style].color[theme].surface.page) fails.push(`${style}/${theme}@${width}: page colour ${res.page}, tokens say ${tokens[style].color[theme].surface.page}`);
    for (const e of errors) fails.push(`${style}/${theme}@${width}: ${e}`);
    const file = path.join(out, `${style}-${theme}-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    report.push(`${style}/${theme}@${width}: ${res.keys.length} numbers, all equal to the view model${res.bad.length ? " (NO)" : ""} → ${path.relative(root, file)}`);
    await page.close();
  }
  await ctx.close();
}

// same place on every style: each skeleton element's left edge and width match the IBCS page within 2 px
for (const [at, byStyle] of Object.entries(geom)) {
  const ref = byStyle[STYLES[0]];
  const tops = [];
  for (const style of STYLES.slice(1)) {
    for (const [name, b] of Object.entries(ref)) {
      const o = byStyle[style][name];
      if (!o) { fails.push(`${style}@${at}: ${name} missing`); continue; }
      if (Math.abs(o.left - b.left) > 2 || Math.abs(o.width - b.width) > 2)
        fails.push(`${style}@${at}: ${name} at x ${Math.round(o.left)}, width ${Math.round(o.width)}; ${STYLES[0]} has x ${Math.round(b.left)}, width ${Math.round(b.width)}`);
    }
    tops.push(`${style} ${Math.round(byStyle[style].tile1.top - ref.tile1.top) >= 0 ? "+" : ""}${Math.round(byStyle[style].tile1.top - ref.tile1.top)}`);
  }
  report.push(`${at}: tiles, cards and switch at the same x and width in all styles; KPI row top vs ${STYLES[0]} (not asserted): ${tops.join(", ")} px`);
}

// behaviour, once per style at desktop width
// the theme a fresh visit should get: the system's (dark here), or the app's fixed default whatever the system says
const scheme = THEME_DEFAULT === "dark" ? "light" : "dark";
const startTheme = THEME_DEFAULT === "system" ? "dark" : THEME_DEFAULT, otherTheme = startTheme === "dark" ? "light" : "dark";
for (const style of STYLES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const varOf = (name) => page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);
  const C = tokens[style].color;
  await page.goto(`${page_url}?style=${style}`, { waitUntil: "networkidle" });
  const t0 = await page.evaluate(() => document.documentElement.dataset.theme);
  if (t0 !== startTheme) fails.push(`${style}: no theme in the URL, ${scheme} system, default ${THEME_DEFAULT}: drew ${t0}, want ${startTheme}`);
  await page.emulateMedia({ media: "print" });
  if ((await varOf("--rs-color-surface-page")) !== C.light.surface.page) fails.push(`${style}: print in the ${t0} theme does not use the light page colour`);
  await page.emulateMedia({ media: "screen" });
  await page.click(".rs-cvd input");
  if ((await varOf("--rs-color-impact-good")) !== C[startTheme].impact.cvd.good) fails.push(`${style}: CVD toggle did not swap impact.good to ${C[startTheme].impact.cvd.good}`);
  await page.click(".rs-cvd input");
  await page.focus('.rs-seg[data-name="theme"] [aria-checked="true"]');
  await page.keyboard.press("ArrowRight");
  const t1 = await page.evaluate(() => [document.documentElement.dataset.theme, new URLSearchParams(location.search).get("theme"), document.activeElement?.dataset.v]);
  if (t1.some((t) => t !== otherTheme)) fails.push(`${style}: arrow key on the theme switch gave ${JSON.stringify(t1)}, want ${otherTheme}`);
  if (STYLES.length > 1) {
    await page.focus('.rs-seg[data-name="style"] [aria-checked="true"]');
    await page.keyboard.press("ArrowRight");
    const s1 = await page.evaluate(() => [document.documentElement.dataset.style, document.documentElement.dataset.theme]);
    const want = STYLES[(STYLES.indexOf(style) + 1) % STYLES.length];
    if (s1[0] !== want || s1[1] !== otherTheme) fails.push(`${style}: arrow key on the style switch gave ${JSON.stringify(s1)}, want [${want}, ${otherTheme}]`);
  }
  report.push(`${style}: theme default (${THEME_DEFAULT}), print light, CVD swap, keyboard theme/style switch checked`);
  await ctx.close();
}
await browser.close();
server.close();
report.forEach((l) => console.log(l));
if (fails.length) { fails.forEach((f) => console.error("FAIL", f)); process.exit(1); }
console.log("ok: reconcile, shared numbers, shared skeleton, same x/width across styles, no label collisions, same unit same scale, headline numbers, theme colours, no horizontal scroll, no console errors, no foreign requests, theme/print/CVD/keyboard behaviour");
