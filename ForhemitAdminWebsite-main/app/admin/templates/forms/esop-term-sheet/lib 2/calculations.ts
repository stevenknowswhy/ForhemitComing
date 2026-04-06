import { UserInputs, Scenario, Scenarios } from "../types";
import { fmtK } from "./formatters";
import {
  D_AND_A,
  SBA_RATE,
  SBA_TERM,
  TARGET_DSCR,
  CLOSING_COSTS_ESTIMATE,
} from "../constants";

// ── CALCULATION FUNCTIONS ────────────────────────────────────────────────────

/**
 * Calculate loan payment using standard amortization formula
 */
function calculateLoanPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  return (
    (principal * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numPayments))
  );
}

/**
 * Calculate the present value of an annuity (loan amount from payment)
 */
function calculateLoanAmountFromPayment(
  annualPayment: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  const monthlyPayment = annualPayment / 12;
  return (
    (monthlyPayment * (1 - Math.pow(1 + monthlyRate, -numPayments))) /
    monthlyRate
  );
}

/**
 * Calculate OCF (Operating Cash Flow) from EBITDA
 */
function calculateOCF(
  ebitda: number,
  dAndA: number,
  taxRate: number
): number {
  const ebit = ebitda - dAndA;
  const taxes = ebit * (taxRate / 100);
  const nopat = ebit - taxes;
  return nopat + dAndA;
}

// ── MAIN SCENARIO CALCULATION ────────────────────────────────────────────────

export function calculateScenarios(inputs: UserInputs): Scenarios {
  const {
    purchasePrice,
    ebitda,
    taxRate,
    sbaLoanAmount,
    esopLoanRate,
    esopLoanTerm,
  } = inputs;

  // Base financials
  const ebit = ebitda - D_AND_A;
  const taxes = ebit * (taxRate / 100);
  const nopat = ebit - taxes;
  const ocf = nopat + D_AND_A;

  // SBA loan details (10-year fully amortizing, ~7.75%)
  const sbaPayment = calculateLoanPayment(sbaLoanAmount, SBA_RATE, SBA_TERM);
  const sbaAnnualDS = sbaPayment * 12;

  // ESOP loan sizing for 1.25x OCF DSCR
  const maxAnnualDS = ocf / TARGET_DSCR;
  const esopAnnualDS = maxAnnualDS - sbaAnnualDS;
  const esopLoanAmount = calculateLoanAmountFromPayment(
    esopAnnualDS,
    esopLoanRate / 100,
    esopLoanTerm
  );

  // Capital structure
  const sellerNoteAmount = purchasePrice - sbaLoanAmount - esopLoanAmount;
  const totalCapital =
    purchasePrice + inputs.sbaFee + inputs.stampTax + CLOSING_COSTS_ESTIMATE;

  // Create scenario factory
  const createScenario = (
    scenarioEbitda: number,
    label: string,
    sub: string
  ): Scenario => {
    const scenarioOcf = calculateOCF(scenarioEbitda, D_AND_A, taxRate);
    const scenarioEsopDS = Math.max(
      0,
      scenarioOcf / TARGET_DSCR - sbaAnnualDS
    );
    const scenarioEsop = Math.min(
      esopLoanAmount,
      calculateLoanAmountFromPayment(
        scenarioEsopDS,
        esopLoanRate / 100,
        esopLoanTerm
      )
    );
    const scenarioNote = Math.max(
      0,
      purchasePrice - sbaLoanAmount - scenarioEsop
    );
    const scenarioCash = purchasePrice - scenarioNote;
    const scenarioTotalDS = sbaAnnualDS + scenarioEsop * (esopLoanRate / 100);
    const sellerCashPct = Math.round((scenarioCash / purchasePrice) * 100 * 10) / 10;
    const scenarioDscrEbitda = scenarioEbitda / scenarioTotalDS;
    const scenarioDscrOcf = scenarioOcf / scenarioTotalDS;

    return {
      id: label.split(" ")[1], // "A" or "B"
      label,
      sub,
      ebitda: scenarioEbitda,
      multiple: `${Math.round((purchasePrice / scenarioEbitda) * 10) / 10}x`,
      sba: sbaLoanAmount,
      esop: Math.round(scenarioEsop),
      note: Math.round(scenarioNote),
      total: Math.round(totalCapital),
      pp: purchasePrice,
      sellerCash: Math.round(scenarioCash),
      sellerCashPct,
      sbaDS: Math.round(sbaAnnualDS),
      esopDS: Math.round(scenarioEsop * (esopLoanRate / 100)),
      totalDS: Math.round(scenarioTotalDS),
      dscr_ebitda: Math.round(scenarioDscrEbitda * 100) / 100,
      dscr_ocf: Math.round(scenarioDscrOcf * 100) / 100,
      ocf: Math.round(scenarioOcf),
      stress10:
        Math.round(((scenarioEbitda * 0.9) / scenarioTotalDS) * 100) / 100,
      stress20:
        Math.round(((scenarioEbitda * 0.8) / scenarioTotalDS) * 100) / 100,
      breakeven: Math.round(scenarioTotalDS / TARGET_DSCR),
      color: label.includes("A") ? "#d97706" : "#16a34a",
      bg: label.includes("A") ? "#fffbeb" : "#f0fdf4",
      border: label.includes("A") ? "#fcd34d" : "#bbf7d0",
      textColor: label.includes("A") ? "#92400e" : "#14532d",
    };
  };

  return {
    A: createScenario(
      ebitda * 0.8,
      "Scenario A",
      `${fmtK(ebitda * 0.8)} EBITDA · ${Math.round(
        purchasePrice / (ebitda * 0.8)
      )}x multiple`
    ),
    B: createScenario(
      ebitda,
      "Scenario B",
      `${fmtK(ebitda)} EBITDA · ${Math.round(
        purchasePrice / ebitda
      )}x multiple`
    ),
  };
}
