import { useEffect, useRef } from "react";
import { useReportStyle } from "./StyleProvider";
import { step, type Theme } from "./state";

interface SegItem<T extends string> { value: T; label: string; title?: string }

/** A radio group of buttons: click or arrow keys select; the selected button keeps focus after a keyboard move. */
export function Segmented<T extends string>({ name, items, value, onChange, className = "" }:
  { name: string; items: SegItem<T>[]; value: T; onChange(v: T): void; className?: string }) {
  const refs = useRef(new Map<T, HTMLButtonElement>());
  const moved = useRef(false);
  useEffect(() => { if (moved.current) { refs.current.get(value)?.focus(); moved.current = false; } }, [value]);
  return (
    <div className={`rs-seg ${className}`.trim()} role="radiogroup" aria-label={name} data-name={name.toLowerCase()}>
      {items.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} tabIndex={o.value === value ? 0 : -1}
          title={o.title} data-v={o.value} ref={(el) => { if (el) refs.current.set(o.value, el); else refs.current.delete(o.value); }}
          onClick={() => onChange(o.value)}
          onKeyDown={(e) => {
            const next = step(items.map((i) => i.value), value, e.key);
            if (next == null) return;
            e.preventDefault();
            moved.current = true;
            onChange(next);
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** The style switch: segmented on desktop, a select on phones (CSS shows one). Not rendered when one style is offered. */
export function StyleSwitch() {
  const { style, offered, setStyle, meta } = useReportStyle();
  if (offered.length < 2) return null;
  const items = offered.map((s) => ({ value: s, label: meta(s).label, title: `${meta(s).label} · ${meta(s).persona}` }));
  return (
    <>
      <Segmented name="Style" className="rs-switch" items={items} value={style} onChange={setStyle} />
      <select className="rs-switch-phone" aria-label="Style" value={style} onChange={(e) => setStyle(e.target.value as typeof style)}>
        {items.map((o) => <option key={o.value} value={o.value}>{o.title}</option>)}
      </select>
    </>
  );
}

export function ThemeSwitch() {
  const { theme, setTheme } = useReportStyle();
  const items: SegItem<Theme>[] = [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }];
  return <Segmented name="Theme" items={items} value={theme} onChange={setTheme} />;
}

export function CvdToggle() {
  const { cvd, setCvd } = useReportStyle();
  return <label className="rs-cvd"><input type="checkbox" checked={cvd} onChange={(e) => setCvd(e.target.checked)} /> CVD</label>;
}

/** App chrome: brand slot on the left, the switches on the right. Same in every style. */
export function TopBar({ brand }: { brand: React.ReactNode }) {
  return (
    <header className="rs-top">
      <div className="rs-brand"><span className="rs-mark" aria-hidden="true" />{brand}</div>
      <div className="rs-tools"><StyleSwitch /><ThemeSwitch /><CvdToggle /></div>
    </header>
  );
}
