// ── FORMATTERS ───────────────────────────────────────────────────────────────

/**
 * Format a number as currency with $ prefix
 */
export function fmtCurrency(value: string | number): string {
  if (!value) return "$0";
  const num = typeof value === "string" ? parseFloat(value.replace(/[$,]/g, "")) : value;
  if (isNaN(num)) return "$0";
  return "$" + num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/**
 * Format a number with K/M suffix for display
 */
export function fmtCompact(value: number): string {
  if (value >= 1_000_000) {
    return "$" + (value / 1_000_000).toFixed(1) + "M";
  }
  if (value >= 1_000) {
    return "$" + (value / 1_000).toFixed(0) + "K";
  }
  return "$" + value.toString();
}

/**
 * Format a DSCR value with x suffix
 */
export function fmtDscr(value: string): string {
  if (!value) return "—";
  if (value.includes("x")) return value;
  return value + "x";
}

/**
 * Get progress percentage based on current step
 */
export function getProgressPercent(stepIndex: number): number {
  const totalSteps = 7;
  return Math.round(((stepIndex + 1) / totalSteps) * 100);
}

/**
 * Check if all required fields are filled for a given step
 */
export function isStepComplete(
  step: string,
  inputs: {
    lender: { lenderName: string; institution: string; companyName: string; industry: string };
    financial: { revenue: string; ebitda: string; dscr: string };
    forhemit: { founderName: string; email: string };
    checklist: Record<string, boolean>;
  }
): boolean {
  switch (step) {
    case "lender":
      return !!(inputs.lender.lenderName && inputs.lender.institution && inputs.lender.companyName);
    case "financial":
      return !!(inputs.financial.revenue && inputs.financial.ebitda && inputs.financial.dscr);
    case "forhemit":
      return !!(inputs.forhemit.founderName && inputs.forhemit.email);
    case "checklist":
      return Object.values(inputs.checklist).every(Boolean);
    default:
      return true;
  }
}
