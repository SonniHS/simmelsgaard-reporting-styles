import type { KeyFiguresInput } from "./viewModel";

// Fictitious sample: one company, one year, EUR. The edge cases are on purpose: Online has no PY (Δ% N/A), the return
// rate's Δ rounds to zero (no colour, no sign), the gross margin has a pp variance, the return rate's polarity is −1.
export const SAMPLE: KeyFiguresInput = {
  company: "Sample Co",
  period: "Jan–Dec 2025",
  unitNote: "EUR",
  acLabel: "2025",
  pyLabel: "2024",
  // revenue is the total of the months and of the regions: checked, a mismatch shows on the page
  totals: { time: "revenue", structure: "revenue" },
  kpis: [
    { key: "revenue", label: "Revenue", unit: "mEUR", ac: 111.7, py: 106.0, decimals: 1, polarity: 1, kind: "amount" },
    { key: "margin", label: "Gross margin", unit: "%", ac: 38.4, py: 39.6, decimals: 1, polarity: 1, kind: "rate" },
    { key: "orders", label: "Orders", unit: "", ac: 14820, py: 14310, decimals: 0, polarity: 1, kind: "count" },
    { key: "returns", label: "Return rate", unit: "%", ac: 2.31, py: 2.29, decimals: 1, polarity: -1, kind: "rate" },
  ],
  time: {
    title: "Revenue by month", unit: "mEUR", decimals: 1, polarity: 1,
    points: [
      ["Jan", 8.2, 7.8], ["Feb", 7.9, 7.6], ["Mar", 8.8, 8.1], ["Apr", 9.1, 8.9], ["May", 9.4, 8.8], ["Jun", 9.9, 9.2],
      ["Jul", 8.7, 8.9], ["Aug", 8.1, 7.9], ["Sep", 9.6, 9.0], ["Oct", 10.2, 9.5], ["Nov", 10.5, 9.9], ["Dec", 11.3, 10.4],
    ].map(([label, ac, py]) => ({ label: label as string, ac: ac as number, py: py as number })),
  },
  structure: {
    title: "Revenue by region", unit: "mEUR", decimals: 1, polarity: 1,
    items: [
      { key: "north", name: "North", ac: 24.1, py: 26.0 },
      { key: "south", name: "South", ac: 31.5, py: 28.9 },
      { key: "west", name: "West", ac: 22.8, py: 21.2 },
      { key: "east", name: "East", ac: 18.4, py: 17.9 },
      { key: "central", name: "Central", ac: 12.6, py: 12.0 },
      { key: "online", name: "Online (new)", ac: 2.3, py: 0 },
    ],
  },
};
