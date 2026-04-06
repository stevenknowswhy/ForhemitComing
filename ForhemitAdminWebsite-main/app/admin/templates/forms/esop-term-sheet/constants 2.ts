import { UserInputs, ThemeColor } from "./types";

// ── DEFAULT VALUES ───────────────────────────────────────────────────────────

export const DEFAULT_INPUTS: UserInputs = {
  purchasePrice: 10_000_000,
  ebitda: 2_500_000,
  taxRate: 23.8,
  sbaLoanAmount: 5_000_000, // SBA 7(a) cap
  esopLoanRate: 8.5,
  esopLoanTerm: 7,
  forhemitFee: 25_000,
  trusteeFee: 0, // Calculated based on stage
  appraisalFee: 0, // Calculated based on stage
  counselFee: 0, // Calculated based on stage
  sbaFee: 138_125, // 3.5% on first $1M + 3.75% on remaining $4M
  stampTax: 35_000, // ~0.35% of $10M
  qoeFee: 25_000,
  legalFee: 25_000,
  cpaFee: 15_000,
  dealStage: "mid",
};

// ── COLORS ───────────────────────────────────────────────────────────────────

export const NAVY = "#1e3a5f";

export const BLUE: ThemeColor = { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" };
export const AMBER: ThemeColor = { color: "#b45309", bg: "#fffbeb", border: "#fcd34d" };
export const GREEN: ThemeColor = { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" };
export const GRAY: ThemeColor = { color: "#374151", bg: "#f9fafb", border: "#e5e7eb" };
export const RED: ThemeColor = { color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" };

// ── FINANCIAL CONSTANTS ──────────────────────────────────────────────────────

export const D_AND_A = 150_000; // Estimated depreciation & amortization
export const SBA_RATE = 7.75 / 100; // SBA 7(a) interest rate
export const SBA_TERM = 10; // SBA loan term in years
export const TARGET_DSCR = 1.25; // Minimum DSCR constraint
export const CLOSING_COSTS_ESTIMATE = 350_000; // Estimated closing costs
