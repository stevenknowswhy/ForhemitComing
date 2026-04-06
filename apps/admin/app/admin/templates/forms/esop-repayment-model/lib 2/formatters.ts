/**
 * ESOP Repayment & Amortization Model - Formatters
 * Display formatting utilities
 */

/**
 * Format number as currency with $ prefix
 */
export function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return "$" + Math.round(n).toLocaleString();
}

/**
 * Format number as compact currency (K/M suffixes)
 */
export function fmtK(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1000000) return (n < 0 ? "-$" : "$") + (abs / 1000000).toFixed(2) + "M";
  if (abs >= 1000) return (n < 0 ? "-$" : "$") + Math.round(abs / 1000).toLocaleString() + "K";
  return fmt(n);
}

/**
 * Format number as multiple (x suffix)
 */
export function fmtX(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return n.toFixed(2) + "x";
}

/**
 * Format number as percentage
 */
export function fmtPct(n: number | null | undefined, decimals: number = 1): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return n.toFixed(decimals) + "%";
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get today's date as formatted string
 */
export function today(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format number with commas
 */
export function fmtNumber(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return n.toLocaleString();
}

/**
 * Format year number (e.g., 1 -> "Year 1")
 */
export function fmtYear(n: number): string {
  return `Year ${n}`;
}

/**
 * Format phone number (simple version)
 */
export function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}
