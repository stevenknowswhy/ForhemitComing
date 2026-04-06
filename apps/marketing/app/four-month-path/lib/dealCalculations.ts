import type { StateKey } from "./feeData";

// ── Tax rate constants ──────────────────────────────────────────────
const FED_LT_CAP_GAINS = 0.20;
const NIIT = 0.038; // Net Investment Income Tax
const FED_ORDINARY = 0.37; // highest federal ordinary income bracket

// State capital gains rates (most states tax cap gains as ordinary income)
export const STATE_RATES: Record<StateKey, number> = {
  florida: 0,
  texas: 0,
  tennessee: 0,
  other: 0.08, // representative "average other state" — noted as approximate in UI
};

// ── PE deal structure assumptions (NCEO / industry benchmarks) ──────
// These proportions are derived from the deal comparison document and
// align with academic surveys of PE transactions (2019–2024).
const PE_PREMIUM = 1.30; // PE offers ~30% more headline than ESOP value
const PE_CASH_PCT = 0.615; // 61.5% cash at close
const PE_ESCROW_PCT = 0.077; // 7.7% held in escrow
const PE_ESCROW_CLAIM_LOSS = 0.25; // 25% of escrow typically lost to reps & warranty claims
const PE_EARNOUT_PCT = 0.154; // 15.4% earnout
const PE_EARNOUT_REALIZED = 0.45; // 45% average realization (industry research, 2019–2024)
const PE_ROLLOVER_PCT = 0.154; // 15.4% forced minority equity rollover
const PE_ROLLOVER_RETURN = 1.8; // 1.8x return assumption over 6 years (modest)

// Seller-paid transaction cost rates
const ESOP_SELLER_FEE = 45_000; // Forhemit advisory (only direct seller cost)
const PE_BROKER_RATE = 0.10; // M&A broker success fee (capped near market norms)
const PE_BROKER_CAP = 650_000;
const PE_OTHER_COSTS = 235_000; // QoE $85k + seller legal $95k + R&W insurance $55k

export type DealInputs = {
  esopValue: number;
  taxBasis: number;
  state: StateKey;
};

export type DealResults = {
  // ── ESOP path ──
  esopValue: number;
  esopSellerCost: number;
  esopNetProceeds: number;
  esopTaxableGain: number;
  esopFedTax: number;
  esopNIIT: number;
  esopStateTax: number;
  esopTotalTax: number;
  esopNetAfterTax: number;
  esopWith1042: number; // full deferral via §1042 election
  // ── PE path ──
  peHeadline: number;
  peCashAtClose: number;
  peEscrowNet: number; // after estimated claim losses
  peEarnoutNet: number; // after 45% realization rate
  peRolloverFV: number; // 6-year future value (illiquid)
  peTotalGross: number;
  peSellerCosts: number;
  peTaxableGainOnCash: number;
  peFedTax: number;
  peNIIT: number;
  peStateTax: number;
  peEarnoutTax: number; // earnout taxed at ordinary income rates
  peTotalTax: number;
  peNetAfterTax: number;
  // ── Comparison ──
  esopAdvantageBase: number; // ESOP net vs PE net (no §1042)
  esopAdvantageWith1042: number; // ESOP §1042 vs PE net
  peEquivalentFor1042: number; // PE headline needed to match ESOP §1042 net
};

export function calculateDeal({ esopValue, taxBasis, state }: DealInputs): DealResults {
  const stateRate = STATE_RATES[state];

  // ── ESOP path ──────────────────────────────────────────────────────
  // ESOP transaction costs are borne by the company/trust, not the seller.
  // Only the Forhemit advisory fee ($45k) is directly seller-paid.
  const esopSellerCost = ESOP_SELLER_FEE;
  const esopNetProceeds = esopValue - esopSellerCost;
  const esopTaxableGain = Math.max(esopNetProceeds - taxBasis, 0);
  const esopFedTax = esopTaxableGain * FED_LT_CAP_GAINS;
  const esopNIIT = esopTaxableGain * NIIT;
  const esopStateTax = esopTaxableGain * stateRate;
  const esopTotalTax = esopFedTax + esopNIIT + esopStateTax;
  const esopNetAfterTax = esopNetProceeds - esopTotalTax;
  const esopWith1042 = esopNetProceeds; // §1042 defers all recognized gain

  // ── PE path ────────────────────────────────────────────────────────
  const peHeadline = esopValue * PE_PREMIUM;
  const peCashAtClose = peHeadline * PE_CASH_PCT;
  const peEscrowHeld = peHeadline * PE_ESCROW_PCT;
  const peEscrowNet = peEscrowHeld * (1 - PE_ESCROW_CLAIM_LOSS);
  const peEarnoutStated = peHeadline * PE_EARNOUT_PCT;
  const peEarnoutNet = peEarnoutStated * PE_EARNOUT_REALIZED;
  const peRolloverStated = peHeadline * PE_ROLLOVER_PCT;
  const peRolloverFV = peRolloverStated * PE_ROLLOVER_RETURN; // 6-yr future value

  const peSellerCosts =
    Math.min(peHeadline * PE_BROKER_RATE, PE_BROKER_CAP) + PE_OTHER_COSTS;

  const peTotalGross = peCashAtClose + peEscrowNet + peEarnoutNet + peRolloverFV;

  // Tax on cash at close (long-term capital gains)
  const peTaxableGainOnCash = Math.max(peCashAtClose - taxBasis, 0);
  const peFedTax = peTaxableGainOnCash * FED_LT_CAP_GAINS;
  const peNIIT = peTaxableGainOnCash * NIIT;
  const peStateTax = peTaxableGainOnCash * stateRate;

  // Earnout payments are typically taxed as ordinary income (not cap gains)
  const peEarnoutTax = peEarnoutNet * (FED_ORDINARY + stateRate);

  const peTotalTax = peFedTax + peNIIT + peStateTax + peEarnoutTax;
  const peNetAfterTax = peTotalGross - peSellerCosts - peTotalTax;

  // ── Comparison ─────────────────────────────────────────────────────
  const esopAdvantageBase = esopNetAfterTax - peNetAfterTax;
  const esopAdvantageWith1042 = esopWith1042 - peNetAfterTax;

  // Solve for the PE headline that delivers peNetAfterTax = esopWith1042.
  // Use the ratio peNetAfterTax / peHeadline as an effective net rate, then
  // scale up to the target. This is a linear approximation.
  const peEffectiveNetRate = peNetAfterTax / peHeadline;
  const peEquivalentFor1042 =
    peEffectiveNetRate > 0 ? esopWith1042 / peEffectiveNetRate : peHeadline * 2;

  return {
    esopValue,
    esopSellerCost,
    esopNetProceeds,
    esopTaxableGain,
    esopFedTax,
    esopNIIT,
    esopStateTax,
    esopTotalTax,
    esopNetAfterTax,
    esopWith1042,
    peHeadline,
    peCashAtClose,
    peEscrowNet,
    peEarnoutNet,
    peRolloverFV,
    peTotalGross,
    peSellerCosts,
    peTaxableGainOnCash,
    peFedTax,
    peNIIT,
    peStateTax,
    peEarnoutTax,
    peTotalTax,
    peNetAfterTax,
    esopAdvantageBase,
    esopAdvantageWith1042,
    peEquivalentFor1042,
  };
}

export function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function fmtShort(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−$" : "$";
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)}k`;
  return fmt(n);
}
