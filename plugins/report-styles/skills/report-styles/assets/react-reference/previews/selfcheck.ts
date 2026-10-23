// In-page checks of a rendered report, the same rules as scripts/check-previews.mjs: used by the playground to show
// live results after every change. Read-only; works on whatever the page has drawn.
import { expectedTexts, sharedKeys, type KeyFiguresVM } from "../src/report-styles";

export interface CheckResult { id: string; label: string; ok: boolean; detail: string[] }

export function selfCheck(vm: KeyFiguresVM): CheckResult[] {
  const want = expectedTexts(vm), shown: Record<string, string> = {}, bad: string[] = [];
  document.querySelectorAll<HTMLElement | SVGElement>("[data-k]").forEach((el) => {
    const k = (el as HTMLElement).dataset.k!, t = (el.textContent ?? "").trim();
    if (!(k in want)) bad.push(`unknown key ${k}`);
    else if (t !== want[k]) bad.push(`${k}: shows "${t}", view model "${want[k]}"`);
    shown[k] = t;
  });
  const phone = window.innerWidth <= 760;
  const missing = sharedKeys(vm, phone).filter((k) => !(k in shown));
  const headline = vm.message.flatMap((p) => (p.k && !(p.k in shown) ? [p.k] : []));

  // chart labels: none overlaps another, none leaves its card
  const clash: string[] = [];
  document.querySelectorAll(".rs-card").forEach((card) => {
    const cb = card.getBoundingClientRect();
    const texts = [...card.querySelectorAll("svg text")].map((t) => ({ t, b: t.getBoundingClientRect() })).filter((x) => x.b.width > 0);
    texts.forEach(({ t, b }) => { if (b.left < cb.left - 1 || b.right > cb.right + 1) clash.push(`"${t.textContent}" leaves its card`); });
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i]!.b, b = texts[j]!.b;
      if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1.5 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 3)
        clash.push(`"${texts[i]!.t.textContent}" overlaps "${texts[j]!.t.textContent}"`);
    }
  });

  // same unit, same scale: drawn px per unit of every value mark, per unit
  const ppu: Record<string, number[]> = {};
  document.querySelectorAll<HTMLElement>("[data-u][data-v]").forEach((el) => {
    const v = +el.dataset.v!, b = el.getBoundingClientRect(), px = el.dataset.dim === "w" ? b.width : b.height;
    if (v > 0 && px > 4) (ppu[el.dataset.u!] ??= []).push(px / v);
  });
  const scale = Object.entries(ppu).flatMap(([u, xs]) => {
    const lo = Math.min(...xs), hi = Math.max(...xs);
    return hi > lo * 1.02 && hi - lo > 0.05 ? [`${u}: ${lo.toFixed(2)}–${hi.toFixed(2)} px per unit`] : [];
  });

  const scroll = document.documentElement.scrollWidth - window.innerWidth;
  const n = Object.keys(shown).length;
  return [
    { id: "reconcile", label: `Every number equals the view model (${n} numbers)`, ok: bad.length === 0, detail: bad },
    { id: "shared", label: "The shared set of numbers is shown", ok: missing.length === 0 && headline.length === 0, detail: [...missing, ...headline.map((k) => `key message: ${k}`)] },
    { id: "totals", label: "Parts add up to their totals", ok: vm.checks.length === 0, detail: vm.checks },
    { id: "labels", label: "No chart label overlaps another or leaves its card", ok: clash.length === 0, detail: clash },
    { id: "scale", label: "Same unit, same scale", ok: scale.length === 0, detail: scale },
    { id: "scroll", label: "No horizontal scroll", ok: scroll <= 0, detail: scroll > 0 ? [`${scroll}px too wide`] : [] },
  ];
}
