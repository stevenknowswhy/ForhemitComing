import { DealInputs, CalculatedValues, DSCRResult } from "../types";
import {
  TARGET_DSCR,
  SELLER_NOTE_RATE,
} from "../constants";

// ── LOAN CALCULATIONS ────────────────────────────────────────────────────────

/**
 * Calculate monthly loan payment using standard amortization formula
 */
export function pmt(
  annualRate: number,
  termYears: number,
  pv: number
): number {
  if (pv <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return pv / n;
  return (pv * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Calculate SBA guaranty fee per FY2026 fee schedule.
 * 
 * Fee tiers (SBA guarantees 75% for loans > $150k):
 *   ≤ $150k:          0%
 *   $150,001–$700k:   2.0% of guaranteed portion
 *   $700,001–$1M:     3.0% of guaranteed portion
 *   > $1M:            3.5% of guaranteed portion
 * 
 * Source: SBA SOP 50 10 8, Appendix to Part 2, Section A
 */
export function calcGuarantyFee(sbaAmount: number): number {
  if (!sbaAmount || sbaAmount <= 0) return 0;
  const guaranteedPortion = sbaAmount * 0.75;
  let feeRate: number;
  if (sbaAmount <= 150_000) {
    feeRate = 0.0;
  } else if (sbaAmount <= 700_000) {
    feeRate = 0.02;
  } else if (sbaAmount <= 1_000_000) {
    feeRate = 0.03;
  } else {
    feeRate = 0.035;
  }
  return Math.round(guaranteedPortion * feeRate);
}

// ── WORKING CAPITAL CALCULATION ───────────────────────────────────────────────

/**
 * Calculate working capital based on percentage of purchase price.
 * User can override the calculated value.
 */
export function calculateWorkingCapital(
  purchasePrice: number,
  workingCapitalPct: number
): number {
  return Math.round(purchasePrice * (workingCapitalPct / 100));
}

// ── CORE CALCULATIONS ────────────────────────────────────────────────────────

/**
 * Calculate all derived values from inputs
 */
export function calculateValues(inputs: DealInputs): CalculatedValues {
  const { purchasePrice, ebitda, actualClosingCosts, workingCapital } = inputs.financial;
  const { sbaAmount, sellerNote } = inputs.capital;

  // Total uses = purchase price + actual closing costs + working capital
  const totalProjectCost = purchasePrice + actualClosingCosts + workingCapital;
  const esopLoan = Math.max(0, totalProjectCost - sbaAmount - sellerNote);
  const impliedMultiple = ebitda > 0 ? purchasePrice / ebitda : 0;

  const sbaPct = totalProjectCost > 0 ? (sbaAmount / totalProjectCost) * 100 : 0;
  const sellerPct =
    totalProjectCost > 0 ? (sellerNote / totalProjectCost) * 100 : 0;
  const esopPct = totalProjectCost > 0 ? (esopLoan / totalProjectCost) * 100 : 0;

  // Dynamic guaranty fee calculation
  const guarantyFee = calcGuarantyFee(sbaAmount);

  return {
    totalProjectCost,
    esopLoan,
    impliedMultiple,
    sbaPct,
    sellerPct,
    esopPct,
    guarantyFee,
  };
}

/**
 * Calculate DSCR metrics with corrected formulas.
 * 
 * PRIMARY DSCR (SBA standard): EBITDA / Total Annual Debt Service
 * - Uses pre-tax, pre-D&A EBITDA (no adjustments)
 * - This is what SBA underwriters actually use
 * 
 * SUPPLEMENTAL OCF DSCR: EBITDA × (1 - taxRate) / Total Annual Debt Service
 * - Uses user-entered effective tax rate
 * - For pass-throughs and S-corps, user enters 0%
 * - Clearly labeled as supplemental metric
 */
export function calculateDSCR(
  inputs: DealInputs,
  activeEbitda: number
): DSCRResult {
  const { sbaAmount, sellerNote, standbyMode } = inputs.capital;
  const { loanTerm, interestRate, esopRate, esopTerm, taxRate } = inputs.dscr;
  const { purchasePrice, actualClosingCosts, workingCapital } = inputs.financial;

  // Annual debt service calculations
  const sbaDS = pmt(interestRate, loanTerm, sbaAmount) * 12;
  
  // ESOP loan amount is the gap in the capital stack
  const totalProjectCost = purchasePrice + actualClosingCosts + workingCapital;
  const esopLoanAmount = Math.max(0, totalProjectCost - sbaAmount - sellerNote);
  const esopDS = pmt(esopRate, esopTerm, esopLoanAmount) * 12;

  // Seller note debt service:
  // Full standby → $0 during SBA term (SOP 50 10 8 equity injection treatment)
  // Active → interest-only at 6% per annum (conservative placeholder)
  const snDS = (standbyMode === "full" || sellerNote <= 0) ? 0 : sellerNote * SELLER_NOTE_RATE;

  const totalDS = sbaDS + esopDS + snDS;

  // Primary DSCR uses EBITDA directly (SBA standard metric)
  // No tax or D&A adjustments applied
  const dscrEbitda = totalDS > 0 ? activeEbitda / totalDS : 0;

  // OCF calculation simplified and disclosed
  // OCF = EBITDA × (1 - effective tax rate)
  // Removed arbitrary D&A proxy (was: ebitda * 0.08)
  const ocf = activeEbitda * (1 - taxRate / 100);
  const dscrOcf = totalDS > 0 ? ocf / totalDS : 0;

  return {
    sbaDS,
    esopDS,
    snDS,
    totalDS,
    ocf,
    dscrEbitda,
    dscrOcf,
    // Include assumptions for display
    esopRate,
    esopTerm,
    taxRate,
    sbaRate: interestRate,
  };
}

/**
 * Calculate stressed DSCR at 10% EBITDA decline
 */
export function calculateStressedDSCR(
  inputs: DealInputs,
  activeEbitda: number
): number {
  const dscr = calculateDSCR(inputs, activeEbitda);
  const stressedEbitda = activeEbitda * 0.9;
  return dscr.totalDS > 0 ? stressedEbitda / dscr.totalDS : 0;
}
