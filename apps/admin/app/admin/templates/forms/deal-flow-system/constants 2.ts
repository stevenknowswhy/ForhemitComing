// ── ESOP DEAL FLOW SYSTEM CONSTANTS ──────────────────────────────────────────

import type { DealFlowInputs, GapItem } from "./types";

// ═════════════════════════════════════════════════════════════════════════════
// STEP DEFINITIONS
// ═════════════════════════════════════════════════════════════════════════════

export const STAGES = [
  { id: 1, label: "First Contact", subtitle: "Intake & Qualification" },
  { id: 2, label: "Feasibility Study", subtitle: "Analysis & Scoring" },
  { id: 3, label: "Due Diligence", subtitle: "Document Review" },
];

// ═════════════════════════════════════════════════════════════════════════════
// DEFAULT EMPTY STATE
// ═════════════════════════════════════════════════════════════════════════════

export const DEFAULT_INPUTS: DealFlowInputs = {
  meta: {
    projectCode: "",
    engagementDate: new Date().toISOString().split("T")[0],
    leadAdvisor: "",
    status: "",
  },
  stage1: {
    sourceReferral: {
      dealSource: "",
      brokerFirm: "",
      brokerContact: "",
      engagementLetter: "",
      foundUs: "",
      intakeBy: "",
    },
    businessIdentity: {
      companyName: "",
      entityType: "",
      yearsInBusiness: 0,
      city: "",
      state: "",
      website: "",
      industry: "",
    },
    keyContacts: {
      decisionMaker: { name: "", email: "", phone: "" },
      cfo: { name: "", email: "", phone: "" },
      broker: { name: "", email: "", phone: "" },
    },
    quickQualifiers: {
      headcountRange: "",
      revenueRange: "",
      approxEbitda: "",
      ownership: { single: false, partners: false, peBacked: false, familyOwned: false },
      pctEquity: 30,
      justExploring: false,
      timeline: "",
    },
    motivation: {
      primaryDrivers: [],
      esopKnowledge: "",
    },
    redFlags: {
      lessThan2YearsProfitable: false,
      highTurnover: false,
      pendingLitigation: false,
      customerConcentration: false,
      wantsAllCash: false,
      mustCloseUnder90Days: false,
    },
    nextSteps: {
      sendNDA: false,
      scheduleIntroCall: false,
      requestFinancials: false,
      brokerFeeReview: false,
      passRefer: false,
      meetingScheduled: "",
      timezone: "",
    },
    internalNotes: "",
  },
  stage2: {
    ownerObjectives: {
      liquidity: false,
      legacy: false,
      taxOptimization: false,
      retention: false,
      culture: false,
      estatePlanning: false,
      retainControl: "",
      minCashAtClosing: "",
      willingSellerFinance: "",
      sellerFinanceMax: "",
      employmentContinuation: "",
      employmentYears: 0,
    },
    valuation: {
      revenue: { conservative: "", baseCase: "", aggressive: "" },
      ebitda: { conservative: "", baseCase: "", aggressive: "" },
      multiple: { conservative: "", baseCase: "", aggressive: "" },
      enterpriseValue: { conservative: "", baseCase: "", aggressive: "" },
      netDebt: { conservative: "", baseCase: "", aggressive: "" },
      equityValue: { conservative: "", baseCase: "", aggressive: "" },
      workingCapitalTarget: { conservative: "", baseCase: "", aggressive: "" },
      financialQuality: "",
      ebitdaNotes: "",
      valuationNotes: "",
    },
    employeePopulation: {
      fullTime: { count: 0, tenure: "", avgComp: "", notes: "" },
      partTime: { count: 0, tenure: "", avgComp: "", notes: "", excludeFromEsop: "" },
      union: { count: 0, tenure: "", avgComp: "", notes: "", cbaRestrictions: "" },
      management: { count: 0, tenure: "", avgComp: "", notes: "", topHeavyRisk: "" },
      keyEmployeeRisk: "",
      nonCompeteStatus: "",
      keyPersonInsurance: "",
    },
    esopStructure: {
      pctToEsop: 30,
      initialTranche: 30,
      purchasePrice: "",
      syntheticEquity: "",
      financingStack: {
        seniorDebt: { amount: "", terms: "", status: "" },
        subordinated: { amount: "", terms: "", status: "" },
        equity: { amount: "", terms: "", status: "" },
      },
    },
    redFlags: {
      concentration: false,
      litigation: false,
      environmental: false,
      relatedParty: false,
      qrpIssues: false,
      apAging: false,
      ebitdaUnder2M: false,
      other: false,
      notes: "",
    },
    scores: {
      ownerCommitment: 0,
      financialViability: 0,
      employeeEngagement: 0,
      legalCompliance: 0,
      notes: "",
    },
    goNoGo: {
      decision: "",
      conditionsRationale: "",
      nextSteps: "",
      signOffs: {
        leadAdvisor: "",
        companyCEO: "",
        esopCounsel: "",
        valuationFirm: "",
      },
    },
  },
  stage3: {
    legalCorporate: {
      articles: { checked: false, status: "" },
      bylaws: { checked: false, status: "" },
      shareholderAgreements: { checked: false, status: "" },
      minutes: { checked: false, status: "" },
      capTable: { checked: false, status: "" },
      subsidiaryChart: { checked: false, status: "" },
      goodStanding: { checked: false, status: "" },
    },
    materialContracts: {
      customerContracts: { checked: false, status: "" },
      supplierAgreements: { checked: false, status: "" },
      licensing: { checked: false, status: "" },
      nonCompete: { checked: false, status: "" },
      leases: { checked: false, status: "" },
      changeOfControl: { checked: false, status: "" },
    },
    litigation: {
      pendingLitigation: { checked: false, status: "" },
      threatenedClaims: { checked: false, status: "" },
      regulatoryComplaints: { checked: false, status: "" },
      dolAudit: { checked: false, status: "" },
    },
    hrPlanDocs: {
      esopPlanDoc: { checked: false, status: "" },
      plan401k: { checked: false, status: "" },
      spd: { checked: false, status: "" },
      ips: { checked: false, status: "" },
      loanDocs: { checked: false, status: "" },
    },
    hrParticipant: {
      census: { checked: false, status: "" },
      vesting: { checked: false, status: "" },
      forfeiture: { checked: false, status: "" },
      distributions: { checked: false, status: "" },
      qdro: { checked: false, status: "" },
    },
    hrCompensation: {
      handbook: { checked: false, status: "" },
      flsa: { checked: false, status: "" },
      cba: { checked: false, status: "" },
      topHat: { checked: false, status: "" },
      employmentAgreements: { checked: false, status: "" },
      nondiscriminationTesting: { checked: false, status: "" },
      topHeavy: { checked: false, status: "" },
      coverageTesting: { checked: false, status: "" },
      form5500: { checked: false, status: "" },
      fiduciaryInsurance: { checked: false, status: "" },
    },
    financials: {
      audited: { checked: false, status: "" },
      interim: { checked: false, status: "" },
      arAging: { checked: false, status: "" },
      inventory: { checked: false, status: "" },
      fixedAssets: { checked: false, status: "" },
      relatedParty: { checked: false, status: "" },
    },
    tax: {
      federalReturns: { checked: false, status: "" },
      stateReturns: { checked: false, status: "" },
      sCorpStatus: { checked: false, status: "" },
      rollover1042: { checked: false, status: "" },
      salesTax: { checked: false, status: "" },
      unclaimedProperty: { checked: false, status: "" },
    },
    dealFinancials: {
      qoe: { checked: false, status: "" },
      wcMethodology: { checked: false, status: "" },
      indebtedness: { checked: false, status: "" },
      proforma: { checked: false, status: "" },
    },
    liabilities: {
      environmental: { amount: "", reserved: "", notes: "" },
      warranty: { amount: "", reserved: "", notes: "" },
      pendingLitigation: { amount: "", reserved: "", notes: "" },
      taxContingencies: { amount: "", reserved: "", notes: "" },
      leaseObligations: { amount: "", reserved: "", notes: "" },
      pension: { amount: "", reserved: "", notes: "" },
      earnouts: { amount: "", reserved: "", notes: "" },
    },
    insurance: {
      do: { checked: false, status: "" },
      generalLiability: { checked: false, status: "" },
      cyber: { checked: false, status: "" },
      fiduciary: { checked: false, status: "" },
    },
    governance: {
      trusteeType: "",
      trusteeSeat: "",
      adminCommittee: "",
      valuationFirm: "",
      recordkeeper: "",
      boardRep: "",
    },
    rollover1042: {
      qrpIdentified: false,
      timelineEstablished: false,
      frnDecision: false,
      estatePlanning: false,
      cratCrut: false,
      qrpDetail: "",
      windowStartDate: "",
    },
    gapItems: Array(5).fill(null).map(() => ({
      issue: "",
      owner: "",
      dueDate: "",
      status: "",
    })) as GapItem[],
    advisorNotes: "",
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// OPTIONS FOR SELECT INPUTS
// ═════════════════════════════════════════════════════════════════════════════

export const DEAL_SOURCE_OPTIONS = [
  { value: "broker", label: "Broker-Led Deal" },
  { value: "direct", label: "Organic / Direct Inquiry" },
  { value: "existing", label: "Existing Client Expansion" },
];

export const ENGAGEMENT_LETTER_OPTIONS = ["Signed", "Pending", "N/A"];

export const FOUND_US_OPTIONS = ["Referral", "Web Search", "Event", "Other"];

export const ENTITY_TYPE_OPTIONS = ["C-Corp", "S-Corp", "LLC", "Partnership", "Other"];

export const HEADCOUNT_OPTIONS = [
  { value: "Under 30", label: "Under 30 (may be too small)" },
  { value: "30-100", label: "30–100" },
  { value: "100-500", label: "100–500" },
  { value: "500+", label: "500+" },
];

export const REVENUE_OPTIONS = [
  { value: "Under $5M", label: "Under $5M" },
  { value: "$5M-$10M", label: "$5M–$10M" },
  { value: "$10M-$50M", label: "$10M–$50M" },
  { value: "$50M+", label: "$50M+" },
];

export const TIMELINE_OPTIONS = [
  "Under 6 months",
  "6-12 months",
  "1-2 years",
  "Just exploring",
];

export const DEAL_STATUS_OPTIONS = [
  "Pre-Feasibility",
  "Feasibility",
  "Term Sheet",
  "DD Phase",
];

export const TIMEZONE_OPTIONS = ["ET", "CT", "MT", "PT", "Other"];

export const YES_NO_OPTIONS = ["Yes", "No"];

export const YES_NO_TBD_OPTIONS = ["Yes", "No", "TBD"];

export const CONTROL_OPTIONS = ["Yes", "No", "Transition over time"];

export const FINANCIAL_QUALITY_OPTIONS = ["Audited", "Reviewed", "Compiled"];

export const SYNTHETIC_EQUITY_OPTIONS = ["Options", "SARs", "Phantom Stock", "N/A"];

export const TRUSTEE_TYPE_OPTIONS = ["Internal", "Independent", "Directed"];

export const KEY_PERSON_INS_OPTIONS = ["In place", "Not in place", "N/A"];

export const DD_STATUS_OPTIONS = ["Received", "Pending", "N/A"];

export const GAP_STATUS_OPTIONS = ["Open", "In Progress", "Closed"];

// ═════════════════════════════════════════════════════════════════════════════
// MOTIVATION & FLAG CONFIGURATIONS
// ═════════════════════════════════════════════════════════════════════════════

export const PRIMARY_MOTIVATIONS = [
  { key: "retirement", label: "Retirement / exit readiness" },
  { key: "liquidity", label: "Liquidity event (need cash)" },
  { key: "retention", label: "Employee retention / succession" },
  { key: "tax", label: "Tax advantages (1042 rollover)" },
  { key: "timing", label: "Market timing / opportunistic" },
  { key: "health", label: "Health / life event forcing sale" },
] as const;

export const ESOP_KNOWLEDGE_OPTIONS = [
  { value: "none", label: "No prior ESOP education" },
  { value: "met_advisors", label: "Met with other ESOP advisors" },
  { value: "spoke_bank", label: "Spoke to bank / lender" },
  { value: "has_valuation", label: "Has valuation in hand" },
];

export const STAGE1_RED_FLAGS = [
  { key: "lessThan2YearsProfitable", label: "Less than 2 years profitable" },
  { key: "highTurnover", label: "High employee turnover (>30% annually)" },
  { key: "pendingLitigation", label: "Pending litigation" },
  { key: "customerConcentration", label: "Customer concentration (>40% one client)" },
  { key: "wantsAllCash", label: "Owner wants 100% cash at closing (no seller note)" },
  { key: "mustCloseUnder90Days", label: "Must close in <90 days" },
] as const;

export const OWNERSHIP_OPTIONS = [
  { key: "single", label: "Single owner" },
  { key: "partners", label: "Partners" },
  { key: "peBacked", label: "PE backed" },
  { key: "familyOwned", label: "Family owned" },
] as const;

export const OWNER_OBJECTIVES = [
  { key: "liquidity", label: "Liquidity Event" },
  { key: "legacy", label: "Legacy Continuation / Succession" },
  { key: "taxOptimization", label: "Tax Optimization — 1042 Rollover" },
  { key: "retention", label: "Employee Retention" },
  { key: "culture", label: "Cultural Transformation" },
  { key: "estatePlanning", label: "Estate Planning" },
] as const;

export const FEASIBILITY_RED_FLAGS = [
  { key: "concentration", label: "Concentrated customer (>30% one client)" },
  { key: "litigation", label: "Pending litigation / contingent liabilities" },
  { key: "environmental", label: "Environmental liabilities" },
  { key: "relatedParty", label: "Related-party transactions" },
  { key: "qrpIssues", label: "Qualified replacement property issues (1042)" },
  { key: "apAging", label: "A/P aging concerns" },
  { key: "ebitdaUnder2M", label: "EBITDA <$2M (flag for ESOP alternatives)" },
  { key: "other", label: "Other flag (note below)" },
] as const;

export const SCORING_CRITERIA = [
  { key: "ownerCommitment", label: "Owner commitment & readiness" },
  { key: "financialViability", label: "Financial viability (DSCR >1.25x)" },
  { key: "employeeEngagement", label: "Employee engagement potential" },
  { key: "legalCompliance", label: "Legal / compliance cleanliness" },
] as const;

// ═════════════════════════════════════════════════════════════════════════════
// DUE DILIGENCE DOCUMENT SECTIONS
// ═════════════════════════════════════════════════════════════════════════════

export const DD_SECTIONS = {
  legalCorporate: [
    { key: "articles", label: "Articles of Incorporation + all amendments" },
    { key: "bylaws", label: "Bylaws / Operating Agreement (current version)" },
    { key: "shareholderAgreements", label: "Shareholder agreements / Buy-sell agreements" },
    { key: "minutes", label: "Minute books — last 5 years (board + shareholder meetings)" },
    { key: "capTable", label: "Cap table (fully diluted) + option pool history" },
    { key: "subsidiaryChart", label: "Subsidiary chart + foreign qualifications" },
    { key: "goodStanding", label: "Good standing certificates (all jurisdictions)" },
  ],
  materialContracts: [
    { key: "customerContracts", label: "Customer contracts (>threshold revenue %)" },
    { key: "supplierAgreements", label: "Supplier agreements (major vendors)" },
    { key: "licensing", label: "Licensing / Franchise agreements" },
    { key: "nonCompete", label: "Non-compete / NDA agreements (employees & sellers)" },
    { key: "leases", label: "Lease agreements (real estate & equipment)" },
    { key: "changeOfControl", label: "Change of Control provisions — any consent required?" },
  ],
  litigation: [
    { key: "pendingLitigation", label: "Pending / active litigation summary (schedule)" },
    { key: "threatenedClaims", label: "Threatened claims (environmental, IP, employment)" },
    { key: "regulatoryComplaints", label: "Regulatory complaints (SEC, DOL, IRS)" },
    { key: "dolAudit", label: "DOL audit history / Form 5500 errors", critical: true },
  ],
  hrPlanDocs: [
    { key: "esopPlanDoc", label: "Current ESOP plan document + trust agreement (if existing)" },
    { key: "plan401k", label: "401(k) plan documents (if KSOP consideration)" },
    { key: "spd", label: "Summary Plan Descriptions (SPDs)" },
    { key: "ips", label: "Investment policy statements" },
    { key: "loanDocs", label: "Loan documents (if leveraged ESOP exists)" },
  ],
  hrParticipant: [
    { key: "census", label: "Census data: hire date, DOB, comp history (3 yrs), hours", critical: true },
    { key: "vesting", label: "Vesting schedules (current & historical)" },
    { key: "forfeiture", label: "Forfeiture account balances" },
    { key: "distributions", label: "Distribution records (last 3 years)" },
    { key: "qdro", label: "QDROs pending / completed" },
  ],
  hrCompensation: [
    { key: "handbook", label: "Employee handbook (current)" },
    { key: "flsa", label: "Job classifications + FLSA exempt status" },
    { key: "cba", label: "Union contracts / CBAs (current + expiration dates)" },
    { key: "topHat", label: "Deferred comp arrangements (TOP HAT plans)" },
    { key: "employmentAgreements", label: "Employment agreements (key employees)" },
    { key: "nondiscriminationTesting", label: "Nondiscrimination testing results (ADP/ACP)" },
    { key: "topHeavy", label: "Top-heavy status determination" },
    { key: "coverageTesting", label: "Coverage testing (IRC 410(b))" },
    { key: "form5500", label: "Form 5500 filings (last 3 years)" },
    { key: "fiduciaryInsurance", label: "Fiduciary insurance confirmation", critical: true },
  ],
  financials: [
    { key: "audited", label: "Audited / reviewed / compiled financials (last 3 years)" },
    { key: "interim", label: "Interim statements (current year vs. budget)" },
    { key: "arAging", label: "A/R aging (current + historical bad debt analysis)" },
    { key: "inventory", label: "Inventory reports (LIFO/FIFO method noted)" },
    { key: "fixedAssets", label: "Fixed asset register + depreciation schedules" },
    { key: "relatedParty", label: "Related party receivables / payables schedule" },
  ],
  tax: [
    { key: "federalReturns", label: "Federal tax returns (last 3 years)" },
    { key: "stateReturns", label: "State tax returns (all jurisdictions)" },
    { key: "sCorpStatus", label: "S-Corp status confirmation + prior C-corp E&P review" },
    { key: "rollover1042", label: "1042 rollover documentation", critical: true },
    { key: "salesTax", label: "Sales / use tax compliance" },
    { key: "unclaimedProperty", label: "Unclaimed property filings" },
  ],
  dealFinancials: [
    { key: "qoe", label: "Quality of Earnings report (if available)" },
    { key: "wcMethodology", label: "Working capital calculation methodology" },
    { key: "indebtedness", label: "Indebtedness schedule (payoff letters needed?)" },
    { key: "proforma", label: "Post-transaction projections — 5-year pro forma" },
  ],
  insurance: [
    { key: "do", label: "D&O coverage (including fiduciary liability)", critical: true },
    { key: "generalLiability", label: "General liability + umbrella" },
    { key: "cyber", label: "Cyber liability (employee data breach exposure)" },
    { key: "fiduciary", label: "Fiduciary liability coverage — ESOP-specific confirmation", critical: true },
  ],
};

export const LIABILITY_TYPES = [
  { key: "environmental", label: "Environmental", placeholder: "Phase I report status..." },
  { key: "warranty", label: "Product Warranty", placeholder: "Historical claims data..." },
  { key: "pendingLitigation", label: "Pending Litigation", placeholder: "Case description..." },
  { key: "taxContingencies", label: "Tax Contingencies", placeholder: "Audit exposure details..." },
  { key: "leaseObligations", label: "Lease Obligations", placeholder: "Operating vs Finance..." },
  { key: "pension", label: "Pension / Post-Retirement", placeholder: "Frozen? Unfunded obligation?" },
  { key: "earnouts", label: "Earn-outs (prior deals)", placeholder: "Terms, timeline..." },
] as const;

// ═════════════════════════════════════════════════════════════════════════════
// SCORING CONSTANTS
// ═════════════════════════════════════════════════════════════════════════════

export const SCORE_MAX = 5;
export const SCORE_MIN = 1;
export const TOTAL_MAX_SCORE = 20; // 4 criteria × 5 max

export const SCORE_THRESHOLDS = {
  proceed: 16,    // 16-20: Proceed to Due Diligence
  conditional: 9, // 9-15: Fix issues first
  pass: 0,        // 1-8: Pass / Consider alternatives
};

// ═════════════════════════════════════════════════════════════════════════════
// COLORS
// ═════════════════════════════════════════════════════════════════════════════

export const COLORS = {
  navy: "#1a2f52",
  blue: "#2a5298",
  blueMid: "#3a6ab8",
  teal: "#1a6b72",
  orange: "#c55a11",
  gold: "#b8960c",
  slate: "#4a5568",
  coolGray: "#718096",
  light: "#f7f9fc",
  border: "#d1dce8",
  dangerBg: "#fff8f0",
  dangerBd: "#f0c08a",
  successBg: "#f0faf5",
  successBd: "#6fbf94",
  warningBg: "#fffbf0",
  warningBd: "#f0c08a",
};
