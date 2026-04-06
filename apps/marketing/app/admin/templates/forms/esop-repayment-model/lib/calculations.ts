/**
 * ESOP Repayment & Amortization Model - Financial Calculations
 * Pure calculation functions for loan amortization and DSCR analysis
 */

import {
  RepaymentModelInputs,
  AmortizationRow,
  ScenarioResult,
  WaterfallData,
  ModelMetrics,
} from "../types";

// ── Payment Calculation ────────────────────────────────────────────────────

/**
 * Calculate loan payment using standard PMT formula
 * rate: annual interest rate (decimal)
 * periods: total number of periods (years)
 * presentValue: loan amount
 */
export function pmt(rate: number, periods: number, presentValue: number): number {
  if (rate === 0) return presentValue / periods;
  if (periods === 0) return 0;
  const r = rate;
  const n = periods;
  return presentValue * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

/**
 * Calculate monthly payment and convert to annual
 */
export function calculateSBAPayment(
  loanAmount: number,
  annualRate: number,
  years: number,
  amortizationType: string,
  year: number
): { payment: number; isInterestOnly: boolean } {
  if (loanAmount <= 0 || years <= 0) return { payment: 0, isInterestOnly: false };

  const monthlyRate = annualRate / 12;
  const totalMonths = years * 12;

  // Check for interest-only periods
  if (amortizationType === "io1" && year === 1) {
    return { payment: loanAmount * annualRate, isInterestOnly: true };
  }
  if (amortizationType === "io2" && year <= 2) {
    return { payment: loanAmount * annualRate, isInterestOnly: true };
  }

  // Calculate amortizing payment
  const monthlyPayment = pmt(monthlyRate, totalMonths, loanAmount);
  return { payment: monthlyPayment * 12, isInterestOnly: false };
}

// ── Amortization Schedule ──────────────────────────────────────────────────

export function buildAmortizationSchedule(
  inputs: RepaymentModelInputs,
  ebitdaMultiplier: number = 1.0
): AmortizationRow[] {
  const { sbaLoan, sellerNote, projections } = inputs;
  const maxYears = Math.max(sbaLoan.term, sellerNote.term);
  const rows: AmortizationRow[] = [];

  let sbaBalance = sbaLoan.amount;
  let snBalance = sellerNote.amount;
  let sbaAnnualPayment: number | null = null;

  for (let year = 1; year <= maxYears; year++) {
    // Calculate EBITDA with growth
    const ebitda =
      projections.year1Ebitda *
      Math.pow(1 + projections.ebitdaGrowthRate / 100, year - 1) *
      ebitdaMultiplier;

    // Calculate FCF components
    const capex = ebitda * (projections.capexPct / 100);
    const taxes = ebitda * (projections.taxPct / 100);
    const fcf = ebitda - capex - taxes - projections.workingCapitalReserve;

    // SBA Loan calculation
    let sbaInterest = 0;
    let sbaPrincipal = 0;

    if (year <= sbaLoan.term && sbaBalance > 0) {
      const { payment, isInterestOnly } = calculateSBAPayment(
        sbaLoan.amount,
        sbaLoan.rate / 100,
        sbaLoan.term,
        sbaLoan.amortizationType,
        year
      );

      if (isInterestOnly) {
        sbaInterest = sbaBalance * (sbaLoan.rate / 100);
        sbaPrincipal = 0;
        sbaAnnualPayment = null; // Reset for recalculation
      } else {
        // Recalculate payment if needed (after IO period)
        if (sbaAnnualPayment === null) {
          const remainingYears = sbaLoan.term - (year - 1);
          const monthlyRate = sbaLoan.rate / 100 / 12;
          const monthlyPayment = pmt(monthlyRate, remainingYears * 12, sbaBalance);
          sbaAnnualPayment = monthlyPayment * 12;
        }
        sbaInterest = sbaBalance * (sbaLoan.rate / 100);
        sbaPrincipal = Math.min(Math.max(0, sbaAnnualPayment - sbaInterest), sbaBalance);
      }
    }

    // Seller Note calculation
    let snInterest = 0;
    let snPrincipal = 0;

    if (snBalance > 0 && year <= sellerNote.term) {
      if (sellerNote.subordination === "yes") {
        // Full standstill - no payments
        snInterest = 0;
        snPrincipal = 0;
      } else if (sellerNote.subordination === "partial") {
        // Interest only
        snInterest = snBalance * (sellerNote.rate / 100);
        snPrincipal = 0;
      } else {
        // Full amortization
        const remainingYears = sellerNote.term - (year - 1);
        const monthlyRate = sellerNote.rate / 100 / 12;
        const monthlyPayment = pmt(monthlyRate, remainingYears * 12, snBalance);
        const annualPayment = monthlyPayment * 12;
        snInterest = snBalance * (sellerNote.rate / 100);
        snPrincipal = Math.min(Math.max(0, annualPayment - snInterest), snBalance);
      }
    }

    const totalDebtService = sbaInterest + sbaPrincipal + snInterest + snPrincipal;
    const dscr = totalDebtService > 0 ? fcf / totalDebtService : null;

    // Update balances
    sbaBalance = Math.max(0, sbaBalance - sbaPrincipal);
    snBalance = Math.max(0, snBalance - snPrincipal);

    rows.push({
      year,
      ebitda,
      capex,
      taxes,
      fcf,
      sbaInterest,
      sbaPrincipal,
      sbaBalance,
      snInterest,
      snPrincipal,
      snBalance,
      totalDebtService,
      dscr,
    });
  }

  return rows;
}

// ── Scenario Analysis ──────────────────────────────────────────────────────

export function buildScenarios(inputs: RepaymentModelInputs): ScenarioResult[] {
  const scenarios = [
    { name: "Base case", multiplier: 1.0 },
    { name: "Stress −15%", multiplier: 0.85 },
    { name: "Upside +15%", multiplier: 1.15 },
    { name: "Deep stress −25%", multiplier: 0.75 },
  ];

  return scenarios.map((scen) => {
    const rows = buildAmortizationSchedule(inputs, scen.multiplier);
    const dscrValues = rows
      .map((r) => r.dscr)
      .filter((d): d is number => d !== null && !isNaN(d));

    return {
      name: scen.name,
      multiplier: scen.multiplier,
      rows,
      year1Dscr: rows[0]?.dscr ?? null,
      minDscr: dscrValues.length > 0 ? Math.min(...dscrValues) : null,
      yearsBelowMin: rows.filter((r) => r.dscr !== null && r.dscr < 1.25).length,
    };
  });
}

// ── Waterfall Calculation ──────────────────────────────────────────────────

export function calculateWaterfall(inputs: RepaymentModelInputs): WaterfallData {
  const rows = buildAmortizationSchedule(inputs);
  const year1 = rows[0];

  if (!year1) {
    return {
      ebitda: 0,
      capex: 0,
      taxes: 0,
      wcReserve: 0,
      fcf: 0,
      sbaDebtService: 0,
      snDebtService: 0,
      netCash: 0,
    };
  }

  const sbaDebtService = year1.sbaInterest + year1.sbaPrincipal;
  const snDebtService = year1.snInterest + year1.snPrincipal;

  return {
    ebitda: year1.ebitda,
    capex: year1.capex,
    taxes: year1.taxes,
    wcReserve: inputs.projections.workingCapitalReserve,
    fcf: year1.fcf,
    sbaDebtService,
    snDebtService,
    netCash: year1.fcf - sbaDebtService - snDebtService,
  };
}

// ── Metrics Calculation ────────────────────────────────────────────────────

export function calculateMetrics(inputs: RepaymentModelInputs): ModelMetrics {
  const rows = buildAmortizationSchedule(inputs);

  if (rows.length === 0) {
    return {
      totalDebt: inputs.sbaLoan.amount + inputs.sellerNote.amount,
      year1Dscr: null,
      minDscr: null,
      totalInterestCost: 0,
      debtToEbitda: null,
      sbaMonthlyPayment: 0,
      sbaAnnualPayment: 0,
    };
  }

  const year1 = rows[0];
  const dscrValues = rows
    .map((r) => r.dscr)
    .filter((d): d is number => d !== null && !isNaN(d));

  const totalInterestCost = rows.reduce(
    (sum, r) => sum + r.sbaInterest + r.snInterest,
    0
  );

  // Calculate SBA monthly payment
  let sbaMonthly = 0;
  if (inputs.sbaLoan.amount > 0 && inputs.sbaLoan.term > 0) {
    if (
      inputs.sbaLoan.amortizationType === "io1" ||
      inputs.sbaLoan.amortizationType === "io2"
    ) {
      sbaMonthly = (inputs.sbaLoan.amount * (inputs.sbaLoan.rate / 100)) / 12;
    } else {
      const monthlyRate = inputs.sbaLoan.rate / 100 / 12;
      sbaMonthly = pmt(monthlyRate, inputs.sbaLoan.term * 12, inputs.sbaLoan.amount);
    }
  }

  const totalDebt = inputs.sbaLoan.amount + inputs.sellerNote.amount;
  const ebitda = inputs.projections.year1Ebitda;

  return {
    totalDebt,
    year1Dscr: year1.dscr,
    minDscr: dscrValues.length > 0 ? Math.min(...dscrValues) : null,
    totalInterestCost,
    debtToEbitda: ebitda > 0 ? totalDebt / ebitda : null,
    sbaMonthlyPayment: sbaMonthly,
    sbaAnnualPayment: sbaMonthly * 12,
  };
}

// ── DSCR Helpers ───────────────────────────────────────────────────────────

export function getDscrColor(dscr: number | null): string {
  if (dscr === null || isNaN(dscr)) return "#8AA0B8";
  if (dscr >= 1.5) return "#0D6E5A";
  if (dscr >= 1.25) return "#B85C00";
  return "#9E2B2B";
}

export function getDscrPill(dscr: number | null): { text: string; className: string } {
  if (dscr === null || isNaN(dscr)) return { text: "N/A", className: "pill-na" };
  if (dscr >= 1.5) return { text: "Pass", className: "pill-pass" };
  if (dscr >= 1.25) return { text: "Min", className: "pill-warn" };
  return { text: "Below", className: "pill-fail" };
}

export function getDscrStatus(dscr: number | null): string {
  if (dscr === null || isNaN(dscr)) return "indeterminate";
  if (dscr >= 1.5) return "comfortably above";
  if (dscr >= 1.25) return "at or near";
  return "below";
}

// ── Validation Helpers ─────────────────────────────────────────────────────

export function validateStep1(inputs: RepaymentModelInputs): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];

  if (!inputs.header.company.trim()) {
    errors.push({ field: "company", message: "Company name is required" });
  }

  return errors;
}

export function validateStep2(inputs: RepaymentModelInputs): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];

  if (inputs.sbaLoan.amount <= 0) {
    errors.push({ field: "sbaAmount", message: "SBA loan amount must be greater than 0" });
  }

  if (inputs.sbaLoan.rate <= 0) {
    errors.push({ field: "sbaRate", message: "SBA interest rate must be greater than 0" });
  }

  if (inputs.projections.year1Ebitda <= 0) {
    errors.push({ field: "ebitda", message: "Year 1 EBITDA must be greater than 0" });
  }

  return errors;
}
