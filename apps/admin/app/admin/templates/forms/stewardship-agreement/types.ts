export type TermOption = 12 | 18 | 24 | null;

export type LiabilityCap =
  | "12 months of fees paid"
  | "$25,000 fixed cap"
  | "$50,000 fixed cap"
  | "$100,000 fixed cap";

export type VarianceThreshold = "±15% (standard)" | "±10% (tighter)" | "±20% (looser)";

export type LenderNotify =
  | "5 business days after Company non-response (standard)"
  | "10 business days after Company non-response"
  | "Immediate — concurrent with Company notification";

export type TermConvNotice =
  | "Company 60 days / Forhemit 90 days"
  | "60 days both parties"
  | "30 days both parties";

export type CurePeriod =
  | "30 days (standard) / 10 days for payment"
  | "15 days (all breaches)"
  | "Immediate for material breach";

export type LateInterest =
  | "1.5% per month (or maximum permitted by law)"
  | "1% per month"
  | "Federal prime rate + 3%";

export type ConfidentialitySurvival =
  | "3 years after termination"
  | "2 years after termination"
  | "5 years after termination";

export type MediationTimeline =
  | "45 days to conclude"
  | "30 days to conclude"
  | "60 days to conclude";

export type ArbitrationRules =
  | "AAA Commercial Arbitration Rules"
  | "JAMS Comprehensive Arbitration Rules";

export type EbitdaSource =
  | "QofE — adjusted EBITDA (recommended)"
  | "Unaudited management accounts"
  | "Reviewed financial statements"
  | "Audited financial statements";

export interface PillarItem {
  id: string;
  title: string;
  desc: string;
  checked: boolean;
}

export interface SAData {
  /* Shared fields (from engagement letter via localStorage) */
  s_company: string;
  s_ref: string;
  s_date: string;

  /* Section 1 — Parties & Closing */
  closing_date: string;
  agreement_date: string;
  post_officer: string;
  company_email: string;

  /* Section 2 — Term */
  term: TermOption;

  /* Section 3 — EBITDA & Fee */
  ebitda: string;
  ebitda_source: EbitdaSource;
  ack_fee: boolean;

  /* Section 4 — Pillars */
  pillars: PillarItem[];

  /* Section 5 — Lender & Trustee */
  lender_name: string;
  lender_rm: string;
  trustee_name: string;
  trustee_contact: string;
  ack_disclosure: boolean;

  /* Section 6 — Governing Terms */
  gov_law: string;
  venue_county: string;
  liability_cap: LiabilityCap;
  variance_threshold: VarianceThreshold;
  lender_notify: LenderNotify;
  term_conv_notice: TermConvNotice;
  special_terms: string;

  /* Section 7 — Standard of Care */
  ack_standard: boolean;

  /* Section 8 — Termination */
  term_cure_period: CurePeriod;
  late_interest: LateInterest;
  ack_termination: boolean;

  /* Section 9 — Confidentiality */
  confidentiality_survival: ConfidentialitySurvival;
  permitted_disclosure: string;
  ack_confidentiality: boolean;

  /* Section 10 — Indemnification */
  ack_indemnification: boolean;

  /* Section 11 — Dispute Resolution */
  mediation_timeline: MediationTimeline;
  arbitration_rules: ArbitrationRules;
  ack_dispute: boolean;

  /* Section 12 — Final */
  fhm_signer: string;
  fhm_title: string;
  ack_final: boolean;
}
