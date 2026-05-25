/**
 * Forhemit Fee Schedule
 *
 * Tier-based pricing tied to QofE-normalized TTM EBITDA.
 * Milestone fees paid at engagement, Gate 1, Gate 2, and closing.
 * Stewardship fee billed quarterly post-close.
 */

export interface FeeBreakdown {
  tier: 1 | 2 | 3;
  totalFee: number;
  retainer: number;      // 20% — due at engagement signing
  validation: number;    // 15% — due at Gate 1 (trustee FMV letter + LOI)
  commitment: number;    // 15% — due at Gate 2 (SBA commitment letter)
  success: number;       // 50% — due at closing
  stewardshipAnnual: number;   // 2.5% of EBITDA
  stewardshipQuarterly: number; // annual / 4
}

const TIERS = [
  { tier: 1 as const, maxEbitda: 5_000_000, totalFee: 75_000 },
  { tier: 2 as const, maxEbitda: 10_000_000, totalFee: 100_000 },
  { tier: 3 as const, maxEbitda: 15_000_000, totalFee: 125_000 },
] as const;

const RETAINER_PCT = 0.20;
const VALIDATION_PCT = 0.15;
const COMMITMENT_PCT = 0.15;
const SUCCESS_PCT = 0.50;
const STEWARDSHIP_RATE = 0.025;

export function getTier(ebitda: number): 1 | 2 | 3 {
  for (const t of TIERS) {
    if (ebitda < t.maxEbitda) return t.tier;
  }
  return 3;
}

export function getTotalFee(tier: 1 | 2 | 3): number {
  return TIERS.find((t) => t.tier === tier)!.totalFee;
}

export function calculateFees(ebitda: number): FeeBreakdown {
  const tier = getTier(ebitda);
  const totalFee = getTotalFee(tier);

  return {
    tier,
    totalFee,
    retainer: Math.round(totalFee * RETAINER_PCT),
    validation: Math.round(totalFee * VALIDATION_PCT),
    commitment: Math.round(totalFee * COMMITMENT_PCT),
    success: Math.round(totalFee * SUCCESS_PCT),
    stewardshipAnnual: Math.round(ebitda * STEWARDSHIP_RATE),
    stewardshipQuarterly: Math.round((ebitda * STEWARDSHIP_RATE) / 4),
  };
}
