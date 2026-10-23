// Same unit, same scale (IBCS CH 4.1): one px per unit per scale group on a page. Adapted (MIT) from the ibcs plugin's
// web-charts reference components (scale.tsx: pxPerUnit, ScaleProvider, useScale), same contract: the registry hands
// out px per unit, never a domain; each chart sizes its own plot from its own range.
import { createContext, useCallback, useContext, useId, useLayoutEffect, useMemo, useState, type ReactNode } from "react";

export type ScaleRequest = {
  /** Scale group key: the unit, e.g. "mEUR" or "FTE". Charts of one unit share px per unit. */
  unit: string;
  min: number;
  max: number;
  /** The most plot px the chart may use for this extent, after its own label rooms and gaps. */
  availablePx: number;
};

/** Smallest px per unit per group; zero is always inside the span; non-positive requests are skipped. */
export function pxPerUnit(requests: Iterable<ScaleRequest>): Map<string, number> {
  const out = new Map<string, number>();
  for (const r of requests) {
    const span = Math.max(r.max, 0) - Math.min(r.min, 0);
    if (!(span > 0) || !(r.availablePx > 0)) continue;
    out.set(r.unit, Math.min(out.get(r.unit) ?? Infinity, r.availablePx / span));
  }
  return out;
}

type Api = { register: (id: string, requests: ScaleRequest[]) => void; unregister: (id: string) => void };

// Two contexts: a stable API (registering never re-runs the charts' effects) and the current px per unit.
const ApiContext = createContext<Api | null>(null);
const PpuContext = createContext<Map<string, number> | null>(null);

/** Page scale registry; ReportPage puts one around both cards. `fixed` sets px per unit exactly (print, tests). */
export function ScaleProvider({ children, fixed }: { children: ReactNode; fixed?: Record<string, number> }) {
  const [requests, setRequests] = useState<Record<string, string>>({});
  const register = useCallback((id: string, reqs: ScaleRequest[]) => {
    const json = JSON.stringify(reqs);
    setRequests((prev) => (prev[id] === json ? prev : { ...prev, [id]: json }));
  }, []);
  const unregister = useCallback((id: string) => {
    setRequests((prev) => {
      if (!(id in prev)) return prev;
      const { [id]: _drop, ...rest } = prev;
      return rest;
    });
  }, []);
  const api = useMemo<Api>(() => ({ register, unregister }), [register, unregister]);
  const fixedKey = JSON.stringify(fixed ?? {});
  const ppu = useMemo(() => {
    const map = pxPerUnit(Object.values(requests).flatMap((j) => JSON.parse(j) as ScaleRequest[]));
    for (const [unit, v] of Object.entries(JSON.parse(fixedKey) as Record<string, number>)) map.set(unit, v);
    return map;
  }, [requests, fixedKey]);
  return (
    <ApiContext.Provider value={api}>
      <PpuContext.Provider value={ppu}>{children}</PpuContext.Provider>
    </ApiContext.Provider>
  );
}

/**
 * Register this chart's extents and read back the page's px per unit for each requested group. Without a provider
 * the chart scales on its own requests. Returns undefined for a group until the first layout pass has run.
 */
export function useScale(requests: ScaleRequest[]): Map<string, number | undefined> {
  const api = useContext(ApiContext);
  const ppu = useContext(PpuContext);
  const id = useId();
  const key = JSON.stringify(requests);
  useLayoutEffect(() => {
    if (!api) return;
    api.register(id, JSON.parse(key) as ScaleRequest[]);
    return () => api.unregister(id);
  }, [api, id, key]);
  const own = pxPerUnit(requests);
  const map = api && ppu ? ppu : own;
  return new Map(requests.map((r) => [r.unit, map.get(r.unit) ?? (api ? undefined : own.get(r.unit))]));
}
