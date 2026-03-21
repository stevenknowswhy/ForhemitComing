import { DealInputs, CalculatedValues, DSCRResult } from "../types";
import {
  TARGET_DSCR,
  ESOP_LOAN_PREMIUM,
  ESOP_LOAN_TERM,
  D_AND_A_PCT,
  TAX_RATE,
  SELLER_NOTE_RATE,
} from "../constants";

// ── LOAN CALCULATIONS ────────────────────────────────────────────────────────

/**
 * Calculate monthly loan payment using standard amortization formula
 */
export function pmt(
  rate: number,
  nper: number,
  pv: number
): number {
  if (rate === 0) return pv / nper;
  const r = rate / 12;
  return (pv * r * Math.pow(1 + r, nper)) / (Math.pow(1 + r, nper) - 1);
}

/**
 * Calculate loan amount from annual payment
 */
export function calculateLoanAmountFromPayment(
  annualPayment: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  const monthlyPayment = annualPayment / 12;
  if (monthlyRate === 0) return monthlyPayment * numPayments;
  return (
    (monthlyPayment * (1 - Math.pow(1 + monthlyRate, -numPayments))) /
    monthlyRate
  );
}

// ── CORE CALCULATIONS ────────────────────────────────────────────────────────

/**
 * Calculate all derived values from inputs
 */
export function calculateValues(inputs: DealInputs): CalculatedValues {
  const { purchasePrice, ebitda, closingCosts } = inputs.financial;
  const { sbaAmount, sellerNote } = inputs.capital;

  const totalProjectCost = purchasePrice + closingCosts;
  const esopLoan = Math.max(0, totalProjectCost - sbaAmount - sellerNote);
  const impliedMultiple = ebitda > 0 ? purchasePrice / ebitda : 0;

  const sbaPct = totalProjectCost > 0 ? (sbaAmount / totalProjectCost) * 100 : 0;
  const sellerPct =
    totalProjectCost > 0 ? (sellerNote / totalProjectCost) * 100 : 0;
  const esopPct = totalProjectCost > 0 ? (esopLoan / totalProjectCost) * 100 : 0;

  return {
    totalProjectCost,
    esopLoan,
    impliedMultiple,
    sbaPct,
    sellerPct,
    esopPct,
  };
}

/**
 * Calculate DSCR metrics
 */
export function calculateDSCR(
  inputs: DealInputs,
  activeEbitda: number
): DSCRResult {
  const { sbaAmount, sellerNote, standbyMode } = inputs.capital;
  const { loanTerm, interestRate } = inputs.dscr;
  const calculated = calculateValues(inputs);

  // SBA debt service
  const sbaMonthlyDS = pmt(interestRate / 100, loanTerm * 12, sbaAmount);
  const sbaDS = sbaMonthlyDS * 12;

  // ESOP loan debt service (7-year term, 1% premium)
  const esopRate = interestRate / 100 + ESOP_LOAN_PREMIUM;
  const esopMonthlyDS =
    calculated.esopLoan > 0
      ? pmt(esopRate, ESOP_LOAN_TERM * 12, calculated.esopLoan)
      : 0;
  const esopDS = esopMonthlyDS * 12;

  // Seller note debt service
  const snDS = standbyMode === "full" ? 0 : sellerNote * SELLER_NOTE_RATE;

  const totalDS = sbaDS + esopDS + snDS;

  // OCF calculation
  const dAndA = activeEbitda * D_AND_A_PCT;
  const taxes = (activeEbitda - dAndA) * TAX_RATE;
  const ocf = activeEbitda - taxes;

  const dscrEbitda = totalDS > 0 ? activeEbitda / totalDS : 0;
  const dscrOcf = totalDS > 0 ? ocf / totalDS : 0;

  return {
    sbaDS,
    esopDS,
    snDS,
    totalDS,
    ocf,
    dscrEbitda,
    dscrOcf,
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
  return dscr.totalDS > 0 ? (activeEbitda * 0.9) / dscr.totalDS : 0;
}
