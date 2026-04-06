// ── FORMATTER FUNCTIONS ──────────────────────────────────────────────────────

export const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export const fmtK = (n: number) => "$" + (Math.round(n / 1000)).toLocaleString("en-US") + "K";

export const pct = (n: number, d: number) => ((n / d) * 100).toFixed(1) + "%";
