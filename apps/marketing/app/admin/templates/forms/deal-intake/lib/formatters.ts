// ── FORMATTING UTILITIES ─────────────────────────────────────────────────────

export function fmt(n: number | undefined): string {
  if (n === undefined || n === null || isNaN(n)) return "—";
  return "$" + Math.round(n).toLocaleString();
}

export function fmtPct(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1) + "%";
}

export function fmtX(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2) + "x";
}

export function fmtK(n: number): string {
  if (n >= 1_000_000) {
    return "$" + (n / 1_000_000).toFixed(1) + "M";
  }
  return "$" + Math.round(n / 1000) + "K";
}
