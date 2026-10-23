import type { KeyFiguresInput } from "./viewModel";

// A second, deliberately different page for the tests: people data, four quarters (not twelve months), counts in the
// thousands, a structure where a rise is bad (polarity −1, overtime hours), a rate KPI that rises (bad), a new team
// with no PY. Every style must draw it with the same rules as the sample.
export const HR_FIXTURE: KeyFiguresInput = {
  title: "People",
  company: "Sample Co",
  period: "2025",
  acLabel: "2025",
  pyLabel: "2024",
  kpis: [
    { key: "headcount", label: "Headcount", unit: "FTE", ac: 1240, py: 1205, decimals: 0, polarity: 0, kind: "count" },
    { key: "sick", label: "Sick leave", unit: "%", ac: 4.6, py: 4.2, decimals: 1, polarity: -1, kind: "rate" },
    { key: "attrition", label: "Attrition", unit: "%", ac: 9.8, py: 11.1, decimals: 1, polarity: -1, kind: "rate" },
    { key: "open", label: "Open positions", unit: "", ac: 38, py: 52, decimals: 0, polarity: 0, kind: "count" },
  ],
  time: {
    title: "Headcount by quarter", unit: "FTE", decimals: 0, polarity: 0,
    points: [{ label: "Q1", ac: 1212, py: 1190 }, { label: "Q2", ac: 1228, py: 1201 }, { label: "Q3", ac: 1219, py: 1222 }, { label: "Q4", ac: 1240, py: 1205 }],
  },
  structure: {
    title: "Overtime hours by department", unit: "h", decimals: 0, polarity: -1,
    items: [
      { key: "ops", name: "Operations", ac: 3200, py: 3000 },
      { key: "sales", name: "Sales", ac: 1450, py: 1600 },
      { key: "it", name: "IT", ac: 980, py: 990 },
      { key: "finance", name: "Finance", ac: 410, py: 380 },
      { key: "people", name: "People team (new)", ac: 120, py: 0 },
    ],
  },
};

// A third page, from the proof run: counts in the tens of thousands with large negative variances (labels such as
// "−1,500"), a score KPI, a lower-is-better KPI, a mix split drawn neutral (polarity 0), and a totals check that holds.
export const SERVICE_FIXTURE: KeyFiguresInput = {
  title: "Customer service",
  company: "Customer Service",
  period: "2025",
  acLabel: "2025",
  pyLabel: "2024",
  totals: { time: "solved", structure: "solved" },
  kpis: [
    { key: "solved", label: "Tickets solved", unit: "", ac: 49210, py: 45930, decimals: 0, polarity: 1, kind: "count" },
    { key: "fcr", label: "First-contact resolution", unit: "%", ac: 71.4, py: 68.9, decimals: 1, polarity: 1, kind: "rate" },
    { key: "aht", label: "Average handling time", unit: "min", ac: 6.8, py: 7.4, decimals: 1, polarity: -1, kind: "amount" },
    { key: "csat", label: "Customer satisfaction", unit: "of 5", ac: 4.42, py: 4.47, decimals: 2, polarity: 1, kind: "score" },
  ],
  time: {
    title: "Tickets solved by quarter", unit: "tickets", decimals: 0, polarity: 1,
    points: [{ label: "Q1", ac: 11640, py: 10980 }, { label: "Q2", ac: 11920, py: 11450 }, { label: "Q3", ac: 12050, py: 11820 }, { label: "Q4", ac: 13600, py: 11680 }],
  },
  structure: {
    title: "Tickets solved by channel", unit: "tickets", decimals: 0, polarity: 0,
    items: [
      { key: "phone", name: "Phone", ac: 17900, py: 19400 },
      { key: "email", name: "E-mail", ac: 14300, py: 14100 },
      { key: "chat", name: "Chat", ac: 12410, py: 10230 },
      { key: "self", name: "Self-service", ac: 3600, py: 2200 },
      { key: "whatsapp", name: "WhatsApp (new)", ac: 1000, py: 0 },
    ],
  },
};

// A stress page for the browser checks: long names, six-digit values, 24 time points, a negative reference.
export const STRESS_FIXTURE: KeyFiguresInput = {
  title: "Stress test",
  company: "Sample Co International Holding",
  period: "Jan 2024 – Dec 2025",
  acLabel: "2025",
  pyLabel: "2024",
  totals: { structure: "sales" },
  kpis: [
    { key: "sales", label: "Net sales across all channels", unit: "kEUR", ac: 1284300, py: 1191750, decimals: 0, polarity: 1, kind: "amount" },
    { key: "ebit", label: "EBIT margin", unit: "%", ac: 7.4, py: 9.1, decimals: 1, polarity: 1, kind: "rate" },
    { key: "nps", label: "Net promoter score", unit: "of 100", ac: 41, py: 38, decimals: 0, polarity: 1, kind: "score" },
    { key: "result", label: "Result after tax", unit: "kEUR", ac: 18250, py: -4300, decimals: 0, polarity: 1, kind: "amount" },
  ],
  time: {
    title: "Net sales by month, two years", unit: "kEUR", decimals: 0, polarity: 1,
    points: Array.from({ length: 24 }, (_, i) => ({
      label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]! + (i < 12 ? "" : "’"),
      ac: 48000 + ((i * 7919) % 13000), py: 46000 + ((i * 104729) % 11000),
    })),
  },
  structure: {
    title: "Net sales by business unit", unit: "kEUR", decimals: 0, polarity: 1,
    items: [
      { key: "bu1", name: "Industrial automation and robotics", ac: 412800, py: 389100 },
      { key: "bu2", name: "Consumer electronics (Europe and Middle East)", ac: 298400, py: 311900 },
      { key: "bu3", name: "Medical devices", ac: 254100, py: 221700 },
      { key: "bu4", name: "Services, maintenance and spare parts", ac: 199600, py: 189050 },
      { key: "bu5", name: "Energy storage (new unit)", ac: 119400, py: 0 },
    ],
  },
};
