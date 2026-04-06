// ── ESOP DEAL FLOW SYSTEM TYPES ──────────────────────────────────────────────
//
// Three-stage deal intake and due diligence system:
//   Stage 1: First Contact (Intake)
//   Stage 2: Feasibility Study
//   Stage 3: Due Diligence
//
// ──────────────────────────────────────────────────────────────────────────────

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 1: FIRST CONTACT
// ═════════════════════════════════════════════════════════════════════════════

export type DealSource = "broker" | "direct" | "existing" | "";
export type EngagementLetterStatus = "Signed" | "Pending" | "N/A" | "";
export type FoundUsMethod = "Referral" | "Web Search" | "Event" | "Other" | "";
export type EntityType = "C-Corp" | "S-Corp" | "LLC" | "Partnership" | "Other" | "";
export type HeadcountRange = "Under 30" | "30-100" | "100-500" | "500+" | "";
export type RevenueRange = "Under $5M" | "$5M-$10M" | "$10M-$50M" | "$50M+" | "";
export type TimelineOption = "Under 6 months" | "6-12 months" | "1-2 years" | "Just exploring" | "";
export type DealStatus = "Pre-Feasibility" | "Feasibility" | "Term Sheet" | "DD Phase" | "";

export interface SourceReferral {
  dealSource: DealSource;
  brokerFirm: string;
  brokerContact: string;
  engagementLetter: EngagementLetterStatus;
  foundUs: FoundUsMethod;
  intakeBy: string;
}

export interface BusinessIdentity {
  companyName: string;
  entityType: EntityType;
  yearsInBusiness: number;
  city: string;
  state: string;
  website: string;
  industry: string;
}

export interface ContactPerson {
  name: string;
  email: string;
  phone: string;
}

export interface KeyContacts {
  decisionMaker: ContactPerson;
  cfo: ContactPerson;
  broker: ContactPerson;
}

export interface OwnershipStructure {
  single: boolean;
  partners: boolean;
  peBacked: boolean;
  familyOwned: boolean;
}

export interface QuickQualifiers {
  headcountRange: HeadcountRange;
  revenueRange: RevenueRange;
  approxEbitda: string;
  ownership: OwnershipStructure;
  pctEquity: number;
  justExploring: boolean;
  timeline: TimelineOption;
}

export type PrimaryMotivation = 
  | "retirement" 
  | "liquidity" 
  | "retention" 
  | "tax" 
  | "timing" 
  | "health";

export type ESOPKnowledge = 
  | "" 
  | "none" 
  | "met_advisors" 
  | "spoke_bank" 
  | "has_valuation";

export interface Motivation {
  primaryDrivers: PrimaryMotivation[];
  esopKnowledge: ESOPKnowledge;
}

export interface RedFlags {
  lessThan2YearsProfitable: boolean;
  highTurnover: boolean;
  pendingLitigation: boolean;
  customerConcentration: boolean;
  wantsAllCash: boolean;
  mustCloseUnder90Days: boolean;
}

export interface NextSteps {
  sendNDA: boolean;
  scheduleIntroCall: boolean;
  requestFinancials: boolean;
  brokerFeeReview: boolean;
  passRefer: boolean;
  meetingScheduled: string;
  timezone: string;
}

export interface Stage1Data {
  sourceReferral: SourceReferral;
  businessIdentity: BusinessIdentity;
  keyContacts: KeyContacts;
  quickQualifiers: QuickQualifiers;
  motivation: Motivation;
  redFlags: RedFlags;
  nextSteps: NextSteps;
  internalNotes: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 2: FEASIBILITY STUDY
// ═════════════════════════════════════════════════════════════════════════════

export type ControlRetention = "Yes" | "No" | "Transition over time" | "";
export type YesNoOption = "Yes" | "No" | "";

export interface OwnerObjectives {
  liquidity: boolean;
  legacy: boolean;
  taxOptimization: boolean;
  retention: boolean;
  culture: boolean;
  estatePlanning: boolean;
  retainControl: ControlRetention;
  minCashAtClosing: string;
  willingSellerFinance: YesNoOption;
  sellerFinanceMax: string;
  employmentContinuation: YesNoOption;
  employmentYears: number;
}

export interface ValuationScenario {
  conservative: string;
  baseCase: string;
  aggressive: string;
}

export type FinancialQuality = "Audited" | "Reviewed" | "Compiled" | "";

export interface PreliminaryValuation {
  revenue: ValuationScenario;
  ebitda: ValuationScenario;
  multiple: ValuationScenario;
  enterpriseValue: ValuationScenario;
  netDebt: ValuationScenario;
  equityValue: ValuationScenario;
  workingCapitalTarget: ValuationScenario;
  financialQuality: FinancialQuality;
  ebitdaNotes: string;
  valuationNotes: string;
}

export interface EmployeeCategory {
  count: number;
  tenure: string;
  avgComp: string;
  notes: string;
}

export interface EmployeePopulation {
  fullTime: EmployeeCategory;
  partTime: EmployeeCategory & { excludeFromEsop: YesNoOption };
  union: EmployeeCategory & { cbaRestrictions: string };
  management: EmployeeCategory & { topHeavyRisk: string };
  keyEmployeeRisk: YesNoOption;
  nonCompeteStatus: string;
  keyPersonInsurance: "In place" | "Not in place" | "N/A" | "";
}

export interface FinancingSource {
  amount: string;
  terms: string;
  status: string;
}

export interface ESOPStructure {
  pctToEsop: number;
  initialTranche: number;
  purchasePrice: string;
  syntheticEquity: "Options" | "SARs" | "Phantom Stock" | "N/A" | "";
  financingStack: {
    seniorDebt: FinancingSource;
    subordinated: FinancingSource;
    equity: FinancingSource;
  };
}

export interface FeasibilityRedFlags {
  concentration: boolean;
  litigation: boolean;
  environmental: boolean;
  relatedParty: boolean;
  qrpIssues: boolean;
  apAging: boolean;
  ebitdaUnder2M: boolean;
  other: boolean;
  notes: string;
}

export interface FeasibilityScores {
  ownerCommitment: number;
  financialViability: number;
  employeeEngagement: number;
  legalCompliance: number;
  notes: string;
}

export type GoNoGoDecision = "proceed" | "conditional" | "pass" | "";

export interface GoNoGo {
  decision: GoNoGoDecision;
  conditionsRationale: string;
  nextSteps: string;
  signOffs: {
    leadAdvisor: string;
    companyCEO: string;
    esopCounsel: string;
    valuationFirm: string;
  };
}

export interface Stage2Data {
  ownerObjectives: OwnerObjectives;
  valuation: PreliminaryValuation;
  employeePopulation: EmployeePopulation;
  esopStructure: ESOPStructure;
  redFlags: FeasibilityRedFlags;
  scores: FeasibilityScores;
  goNoGo: GoNoGo;
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 3: DUE DILIGENCE
// ═════════════════════════════════════════════════════════════════════════════

export type DDStatus = "Received" | "Pending" | "N/A" | "";

export interface DDDocument {
  checked: boolean;
  status: DDStatus;
}

export interface LegalCorporateDocs {
  articles: DDDocument;
  bylaws: DDDocument;
  shareholderAgreements: DDDocument;
  minutes: DDDocument;
  capTable: DDDocument;
  subsidiaryChart: DDDocument;
  goodStanding: DDDocument;
}

export interface MaterialContracts {
  customerContracts: DDDocument;
  supplierAgreements: DDDocument;
  licensing: DDDocument;
  nonCompete: DDDocument;
  leases: DDDocument;
  changeOfControl: DDDocument;
}

export interface LitigationCompliance {
  pendingLitigation: DDDocument;
  threatenedClaims: DDDocument;
  regulatoryComplaints: DDDocument;
  dolAudit: DDDocument;
}

export interface HRPlanDocuments {
  esopPlanDoc: DDDocument;
  plan401k: DDDocument;
  spd: DDDocument;
  ips: DDDocument;
  loanDocs: DDDocument;
}

export interface HRParticipantData {
  census: DDDocument;
  vesting: DDDocument;
  forfeiture: DDDocument;
  distributions: DDDocument;
  qdro: DDDocument;
}

export interface HRCompensation {
  handbook: DDDocument;
  flsa: DDDocument;
  cba: DDDocument;
  topHat: DDDocument;
  employmentAgreements: DDDocument;
  nondiscriminationTesting: DDDocument;
  topHeavy: DDDocument;
  coverageTesting: DDDocument;
  form5500: DDDocument;
  fiduciaryInsurance: DDDocument;
}

export interface FinancialStatements {
  audited: DDDocument;
  interim: DDDocument;
  arAging: DDDocument;
  inventory: DDDocument;
  fixedAssets: DDDocument;
  relatedParty: DDDocument;
}

export interface TaxMatters {
  federalReturns: DDDocument;
  stateReturns: DDDocument;
  sCorpStatus: DDDocument;
  rollover1042: DDDocument;
  salesTax: DDDocument;
  unclaimedProperty: DDDocument;
}

export interface DealSpecificFinancials {
  qoe: DDDocument;
  wcMethodology: DDDocument;
  indebtedness: DDDocument;
  proforma: DDDocument;
}

export interface Liability {
  amount: string;
  reserved: YesNoOption;
  notes: string;
}

export interface Liabilities {
  environmental: Liability;
  warranty: Liability;
  pendingLitigation: Liability;
  taxContingencies: Liability;
  leaseObligations: Liability;
  pension: Liability;
  earnouts: Liability;
}

export interface Insurance {
  do: DDDocument;
  generalLiability: DDDocument;
  cyber: DDDocument;
  fiduciary: DDDocument;
}

export interface Governance {
  trusteeType: "Internal" | "Independent" | "Directed" | "";
  trusteeSeat: YesNoOption | "TBD";
  adminCommittee: string;
  valuationFirm: string;
  recordkeeper: string;
  boardRep: YesNoOption | "TBD";
}

export interface Rollover1042 {
  qrpIdentified: boolean;
  timelineEstablished: boolean;
  frnDecision: boolean;
  estatePlanning: boolean;
  cratCrut: boolean;
  qrpDetail: string;
  windowStartDate: string;
}

export interface GapItem {
  issue: string;
  owner: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Closed" | "";
}

export interface Stage3Data {
  legalCorporate: LegalCorporateDocs;
  materialContracts: MaterialContracts;
  litigation: LitigationCompliance;
  hrPlanDocs: HRPlanDocuments;
  hrParticipant: HRParticipantData;
  hrCompensation: HRCompensation;
  financials: FinancialStatements;
  tax: TaxMatters;
  dealFinancials: DealSpecificFinancials;
  liabilities: Liabilities;
  insurance: Insurance;
  governance: Governance;
  rollover1042: Rollover1042;
  gapItems: GapItem[];
  advisorNotes: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// META & COMPLETE FORM DATA
// ═════════════════════════════════════════════════════════════════════════════

export interface DealFlowMeta {
  projectCode: string;
  engagementDate: string;
  leadAdvisor: string;
  status: DealStatus;
}

export interface DealFlowInputs {
  meta: DealFlowMeta;
  stage1: Stage1Data;
  stage2: Stage2Data;
  stage3: Stage3Data;
}

export type DealFlowStage = 1 | 2 | 3;

export interface ValidationErrors {
  // Stage 1
  companyName?: string;
  industry?: string;
  yearsInBusiness?: string;
  
  // Stage 2
  ownerName?: string;
  purchasePrice?: string;
  
  // Generic
  [key: string]: string | undefined;
}

export interface FeasibilitySummary {
  totalScore: number;
  maxScore: number;
  percentage: number;
  recommendation: "proceed" | "conditional" | "pass";
}

export interface GeneratedDealFlowData {
  inputs: DealFlowInputs;
  feasibility: FeasibilitySummary;
  generatedAt: string;
}
