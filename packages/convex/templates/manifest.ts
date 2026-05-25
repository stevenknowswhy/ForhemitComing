/**
 * Forhemit Document Template Manifest
 *
 * Agent-readable index of all 102 document templates organized by:
 * - Pipeline: external (sent outside org) vs internal (never leaves org)
 * - Stage: 01-first-touch through 06-post-close
 *
 * Usage:
 *   import { templates, getTemplatesByStage, getUrgentTemplates } from './manifest';
 *   const qualificationDocs = getTemplatesByStage('02-qualification');
 *   const urgentDocs = getUrgentTemplates();
 */

export type Pipeline = "external" | "internal";
export type Stage =
  | "01-first-touch"
  | "02-qualification"
  | "03-engagement"
  | "04-diligence"
  | "05-closing"
  | "06-post-close";
export type Status = "exists" | "partial" | "gap" | "urgent";
export type Audience =
  | "seller"
  | "broker"
  | "lender"
  | "trustee"
  | "counsel"
  | "cpa"
  | "partner"
  | "internal";

export interface TemplateEntry {
  id: string;
  name: string;
  path: string;
  pipeline: Pipeline;
  stage: Stage;
  audience: Audience[];
  status: Status;
  requiresSignature: boolean;
  isRequired: boolean;
  isRecurring: boolean;
  recurrenceRule?: string;
  description: string;
  formKey?: string;
}

export const templates: Record<string, TemplateEntry> = {
  // ============================================================================
  // EXTERNAL DOCUMENTS - Sent outside organization
  // ============================================================================

  // ── 01-first-touch ──────────────────────────────────────────────────────────
  "external/01-first-touch/broker-intro-packet": {
    id: "external/01-first-touch/broker-intro-packet",
    name: "Broker introduction packet",
    path: "./external/01-first-touch/broker-intro-packet.html",
    pipeline: "external",
    stage: "01-first-touch",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "9 sections incl. $10M side-by-side, gotchas, commission protection, deal submission",
    formKey: "deal-intake",
  },
  "external/01-first-touch/cold-outreach-broker": {
    id: "external/01-first-touch/cold-outreach-broker",
    name: "Cold outreach email — broker (first touch)",
    path: "./external/01-first-touch/cold-outreach-broker.html",
    pipeline: "external",
    stage: "01-first-touch",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Active acquirer framing; targets mid-career broker with aged listing; leads with their problem",
  },
  "external/01-first-touch/cold-outreach-cpa": {
    id: "external/01-first-touch/cold-outreach-cpa",
    name: "Cold outreach email — CPA (first touch)",
    path: "./external/01-first-touch/cold-outreach-cpa.html",
    pipeline: "external",
    stage: "01-first-touch",
    audience: ["cpa"],
    status: "gap",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "'Lose one client vs. gain 20–50 individual tax clients' frame; physician-focused CPA firms",
  },
  "external/01-first-touch/cold-outreach-seller": {
    id: "external/01-first-touch/cold-outreach-seller",
    name: "Cold outreach email — seller (owner-direct)",
    path: "./external/01-first-touch/cold-outreach-seller.html",
    pipeline: "external",
    stage: "01-first-touch",
    audience: ["seller"],
    status: "gap",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Avoids 'ESOP' in subject; leads with equity unlocked, guarantees retired, control retained",
  },
  "external/01-first-touch/referral-acknowledgment": {
    id: "external/01-first-touch/referral-acknowledgment",
    name: "Referral acknowledgment (when someone sends a lead)",
    path: "./external/01-first-touch/referral-acknowledgment.html",
    pipeline: "external",
    stage: "01-first-touch",
    audience: ["broker", "cpa", "counsel"],
    status: "gap",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Immediate reply to whoever made the introduction — professional, warm, confirms receipt",
  },
  "external/01-first-touch/linkedin-followup": {
    id: "external/01-first-touch/linkedin-followup",
    name: "LinkedIn connection follow-up (post-accept)",
    path: "./external/01-first-touch/linkedin-followup.html",
    pipeline: "external",
    stage: "01-first-touch",
    audience: ["broker", "trustee", "counsel"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "24-hour message after connection accepted — moves toward a call without pitching",
  },
  "external/01-first-touch/thank-you-ecosystem": {
    id: "external/01-first-touch/thank-you-ecosystem",
    name: "Thank-you email (post-call, non-deal)",
    path: "./external/01-first-touch/thank-you-ecosystem.html",
    pipeline: "external",
    stage: "01-first-touch",
    audience: ["trustee", "lender", "counsel"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "After an ecosystem call (trustee, lender, advisor) where no deal was discussed — maintains relationship",
  },

  // ── 02-qualification ────────────────────────────────────────────────────────
  "external/02-qualification/nda-mutual": {
    id: "external/02-qualification/nda-mutual",
    name: "NDA (mutual — deal team)",
    path: "./external/02-qualification/nda-mutual.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller", "broker", "trustee", "counsel"],
    status: "exists",
    requiresSignature: true,
    isRequired: true,
    isRecurring: false,
    description:
      "Covers seller, broker, Forhemit, and advisors in shared deal room",
  },
  "external/02-qualification/broker-nda": {
    id: "external/02-qualification/broker-nda",
    name: "Broker NDA / confidentiality agreement",
    path: "./external/02-qualification/broker-nda.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["broker"],
    status: "exists",
    requiresSignature: true,
    isRequired: true,
    isRecurring: false,
    description:
      "Covers deal flow sharing, referral fee terms, and seller identity protection",
  },
  "external/02-qualification/deal-screener-response": {
    id: "external/02-qualification/deal-screener-response",
    name: "Deal screener email (broker → Forhemit)",
    path: "./external/02-qualification/deal-screener-response.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Structured reply to broker who sent a listing — confirms criteria match or explains why it doesn't fit",
  },
  "external/02-qualification/pre-flight-checklist": {
    id: "external/02-qualification/pre-flight-checklist",
    name: "Pre-flight checklist (signed by seller + Forhemit)",
    path: "./external/02-qualification/pre-flight-checklist.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: true,
    isRequired: true,
    isRecurring: false,
    description:
      "Mutual go/no-go with $15K non-refundable deposit; 6 parts, 34 items",
  },
  "external/02-qualification/pre-flight-cover-letter": {
    id: "external/02-qualification/pre-flight-cover-letter",
    name: "Pre-flight checklist cover letter (to seller)",
    path: "./external/02-qualification/pre-flight-cover-letter.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Email that accompanies the pre-flight checklist — explains what it is, why it exists, what happens next",
  },
  "external/02-qualification/no-fit-decline-seller": {
    id: "external/02-qualification/no-fit-decline-seller",
    name: "No-fit decline email (seller)",
    path: "./external/02-qualification/no-fit-decline-seller.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "When a seller doesn't meet criteria — respectful, specific, leaves door open",
  },
  "external/02-qualification/no-fit-decline-broker": {
    id: "external/02-qualification/no-fit-decline-broker",
    name: "No-fit decline email (broker)",
    path: "./external/02-qualification/no-fit-decline-broker.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "When a listing doesn't qualify — gives broker enough to know why without burning the relationship",
  },
  "external/02-qualification/conditional-go-letter": {
    id: "external/02-qualification/conditional-go-letter",
    name: "Conditional go letter (pre-flight)",
    path: "./external/02-qualification/conditional-go-letter.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "When checklist is signed with a condition — confirms deposit held uncashed until condition met",
  },
  "external/02-qualification/nda-receipt-confirmation": {
    id: "external/02-qualification/nda-receipt-confirmation",
    name: "NDA Receipt Confirmation",
    path: "./external/02-qualification/nda-receipt-confirmation.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller", "broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Confirms NDA has been received and is on file — simple notification, no signatures required",
  },

  // ── 03-engagement ──────────────────────────────────────────────────────────
  "external/03-engagement/engagement-letter": {
    id: "external/03-engagement/engagement-letter",
    name: "Engagement letter (seller-facing)",
    path: "./external/03-engagement/engagement-letter.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["seller"],
    status: "exists",
    requiresSignature: true,
    isRequired: true,
    isRecurring: false,
    description:
      "Forhemit fee structure, milestones, cancellation terms — DocuSign ready",
    formKey: "engagement-letter",
  },
  "external/03-engagement/engagement-letter-cover": {
    id: "external/03-engagement/engagement-letter-cover",
    name: "Engagement letter cover email (to seller)",
    path: "./external/03-engagement/engagement-letter-cover.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Email sending the engagement letter for signature — what they're signing, what happens after",
  },
  "external/03-engagement/loi-template": {
    id: "external/03-engagement/loi-template",
    name: "Letter of intent (LOI) template",
    path: "./external/03-engagement/loi-template.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["seller"],
    status: "exists",
    requiresSignature: true,
    isRequired: true,
    isRecurring: false,
    description:
      "Non-binding; triggers deposit uncashing and exclusivity window; includes C-corp conversion condition",
  },
  "external/03-engagement/loi-transmittal": {
    id: "external/03-engagement/loi-transmittal",
    name: "LOI transmittal letter",
    path: "./external/03-engagement/loi-transmittal.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Cover memo when LOI is presented — explains key terms in plain language before seller reads the legal document",
  },
  "external/03-engagement/broker-deal-acceptance": {
    id: "external/03-engagement/broker-deal-acceptance",
    name: "Broker deal acceptance email",
    path: "./external/03-engagement/broker-deal-acceptance.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Sent to broker when Forhemit accepts a deal and signs engagement — confirms commission protection, timeline, next steps",
  },
  "external/03-engagement/referral-fee-agreement": {
    id: "external/03-engagement/referral-fee-agreement",
    name: "Referral fee agreement",
    path: "./external/03-engagement/referral-fee-agreement.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["broker"],
    status: "exists",
    requiresSignature: true,
    isRequired: false,
    isRecurring: false,
    description:
      "Formal documentation of any referral arrangement — separate from broker commission",
  },
  "external/03-engagement/advisor-intro-trustee": {
    id: "external/03-engagement/advisor-intro-trustee",
    name: "Advisor introduction email (trustee)",
    path: "./external/03-engagement/advisor-intro-trustee.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["trustee"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Forhemit introduces the deal to the trustee — deal context, Forhemit's role, what trustee receives and when",
  },
  "external/03-engagement/advisor-intro-counsel": {
    id: "external/03-engagement/advisor-intro-counsel",
    name: "Advisor introduction email (ERISA counsel)",
    path: "./external/03-engagement/advisor-intro-counsel.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["counsel"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Forhemit introduces the deal — triggers conflict check; confirms LLC-to-C-corp ESOP experience ask",
  },
  "external/03-engagement/lender-intro-package": {
    id: "external/03-engagement/lender-intro-package",
    name: "SBA lender introduction package cover email",
    path: "./external/03-engagement/lender-intro-package.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description: "Sends the lender brief — deal summary, what Forhemit needs, timeline",
  },
  "external/03-engagement/seller-onboarding-day1": {
    id: "external/03-engagement/seller-onboarding-day1",
    name: "Seller onboarding email — Day 1: Welcome + what to expect",
    path: "./external/03-engagement/seller-onboarding-day1.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Day 1 of 5-day onboarding sequence — welcome, what to expect, key contacts",
  },
  "external/03-engagement/seller-onboarding-day2": {
    id: "external/03-engagement/seller-onboarding-day2",
    name: "Seller onboarding email — Day 2: Document request list",
    path: "./external/03-engagement/seller-onboarding-day2.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Day 2 — organized list of what Forhemit needs from seller, with deadlines",
  },
  "external/03-engagement/seller-onboarding-day3": {
    id: "external/03-engagement/seller-onboarding-day3",
    name: "Seller onboarding email — Day 3: Calendar link",
    path: "./external/03-engagement/seller-onboarding-day3.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description: "Day 3 — scheduling link for recurring check-ins",
  },
  "external/03-engagement/seller-onboarding-day4": {
    id: "external/03-engagement/seller-onboarding-day4",
    name: "Seller onboarding email — Day 4: Team introduction",
    path: "./external/03-engagement/seller-onboarding-day4.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description: "Day 4 — introduces deal team members and their roles",
  },
  "external/03-engagement/seller-onboarding-day5": {
    id: "external/03-engagement/seller-onboarding-day5",
    name: "Seller onboarding email — Day 5: First check-in",
    path: "./external/03-engagement/seller-onboarding-day5.html",
    pipeline: "external",
    stage: "03-engagement",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Day 5 — first check-in, how are things going, any questions",
  },

  // ── 04-diligence ───────────────────────────────────────────────────────────
  "external/04-diligence/gate1-passage-confirmation": {
    id: "external/04-diligence/gate1-passage-confirmation",
    name: "Gate 1 passage confirmation (internal + seller)",
    path: "./external/04-diligence/gate1-passage-confirmation.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["seller", "internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Capital committed — confirms SBA indication received, deal proceeds; sent to seller and deal team",
  },
  "external/04-diligence/gate2-passage-confirmation": {
    id: "external/04-diligence/gate2-passage-confirmation",
    name: "Gate 2 passage confirmation (internal + seller)",
    path: "./external/04-diligence/gate2-passage-confirmation.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["seller", "internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Valuation confirmed within 15% of LOI assumption — triggers QofE scope",
  },
  "external/04-diligence/gate3-passage-confirmation": {
    id: "external/04-diligence/gate3-passage-confirmation",
    name: "Gate 3 passage confirmation (internal + seller)",
    path: "./external/04-diligence/gate3-passage-confirmation.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["seller", "internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Operations cleared — COOP V3.0 complete, key man docs executed",
  },
  "external/04-diligence/gate-failure-notice": {
    id: "external/04-diligence/gate-failure-notice",
    name: "Gate failure / extension notice (seller)",
    path: "./external/04-diligence/gate-failure-notice.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "When a gate doesn't clear on schedule — explains what's needed, revised timeline, no-fault framing",
  },
  "external/04-diligence/document-request-followup": {
    id: "external/04-diligence/document-request-followup",
    name: "Document request follow-up (seller)",
    path: "./external/04-diligence/document-request-followup.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Polite but firm — when seller hasn't returned requested docs by deadline",
  },
  "external/04-diligence/weekly-status-seller": {
    id: "external/04-diligence/weekly-status-seller",
    name: "Weekly deal status update (seller-facing)",
    path: "./external/04-diligence/weekly-status-seller.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: true,
    recurrenceRule: "weekly",
    description:
      "One-page / one-email — where things stand, what's needed from seller this week, next milestone",
  },
  "external/04-diligence/weekly-status-broker": {
    id: "external/04-diligence/weekly-status-broker",
    name: "Weekly deal status update (broker-facing)",
    path: "./external/04-diligence/weekly-status-broker.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: true,
    recurrenceRule: "weekly",
    description:
      "Shorter version for broker — headline status only; protects seller confidentiality",
  },
  "external/04-diligence/qofe-coordination-request": {
    id: "external/04-diligence/qofe-coordination-request",
    name: "QofE coordination request (to seller's CPA)",
    path: "./external/04-diligence/qofe-coordination-request.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["cpa"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Requests financial data, working papers, and normalization details from CPA for independent QofE appraiser",
  },
  "external/04-diligence/lender-update": {
    id: "external/04-diligence/lender-update",
    name: "Lender update email (during underwriting)",
    path: "./external/04-diligence/lender-update.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: true,
    recurrenceRule: "weekly",
    description:
      "Proactive weekly touch to SBA lender — status, any new items, ETA on open conditions",
  },
  "external/04-diligence/trustee-update": {
    id: "external/04-diligence/trustee-update",
    name: "Trustee update memo (during appraisal)",
    path: "./external/04-diligence/trustee-update.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["trustee"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Keeps trustee informed of timeline — what Forhemit has delivered, what's pending",
  },
  "external/04-diligence/broker-pipeline-status": {
    id: "external/04-diligence/broker-pipeline-status",
    name: "Broker pipeline status update template",
    path: "./external/04-diligence/broker-pipeline-status.html",
    pipeline: "external",
    stage: "04-diligence",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: true,
    recurrenceRule: "weekly",
    description:
      "Recurring email format to keep broker informed through Gate milestones",
  },

  // ── 05-closing ─────────────────────────────────────────────────────────────
  "external/05-closing/closing-date-confirmation": {
    id: "external/05-closing/closing-date-confirmation",
    name: "Closing date confirmation (seller)",
    path: "./external/05-closing/closing-date-confirmation.html",
    pipeline: "external",
    stage: "05-closing",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Formal notice of closing date — what seller needs to do, where to be, what to bring",
  },
  "external/05-closing/closing-congratulations": {
    id: "external/05-closing/closing-congratulations",
    name: "Closing congratulations letter (seller)",
    path: "./external/05-closing/closing-congratulations.html",
    pipeline: "external",
    stage: "05-closing",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Sent same day as close — warm, professional; transitions to COOP stewardship relationship",
  },
  "external/05-closing/broker-commission-confirmation": {
    id: "external/05-closing/broker-commission-confirmation",
    name: "Broker commission confirmation (closing)",
    path: "./external/05-closing/broker-commission-confirmation.html",
    pipeline: "external",
    stage: "05-closing",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Confirms commission amount and wire timing — sent to broker on closing day",
  },
  "external/05-closing/employee-announcement": {
    id: "external/05-closing/employee-announcement",
    name: "Employee announcement template (Day 1)",
    path: "./external/05-closing/employee-announcement.html",
    pipeline: "external",
    stage: "05-closing",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Seller communicates ESOP to employees — plain language, no jargon, answers 'what does this mean for me'",
  },
  "external/05-closing/closing-package-tax-filing": {
    id: "external/05-closing/closing-package-tax-filing",
    name: "Closing tax package (for seller's CPA)",
    path: "./external/05-closing/closing-package-tax-filing.html",
    pipeline: "external",
    stage: "05-closing",
    audience: ["cpa"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Post-close tax filing package — sale proceeds, §1042 status, enclosed documents, key filing items for CPA",
  },
  "external/05-closing/press-release": {
    id: "external/05-closing/press-release",
    name: "Press release template (optional)",
    path: "./external/05-closing/press-release.html",
    pipeline: "external",
    stage: "05-closing",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "For sellers who want to announce publicly — positions as employee ownership milestone, not M&A",
  },

  // ── 06-post-close ──────────────────────────────────────────────────────────
  "external/06-post-close/coop-kickoff-letter": {
    id: "external/06-post-close/coop-kickoff-letter",
    name: "COOP kickoff letter (to operating company)",
    path: "./external/06-post-close/coop-kickoff-letter.html",
    pipeline: "external",
    stage: "06-post-close",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Day 121 — stewardship begins; confirms 4 tracks, schedule, Forhemit contacts, fee structure",
  },
  "external/06-post-close/coop-stewardship-agreement": {
    id: "external/06-post-close/coop-stewardship-agreement",
    name: "COOP stewardship agreement",
    path: "./external/06-post-close/coop-stewardship-agreement.html",
    pipeline: "external",
    stage: "06-post-close",
    audience: ["seller"],
    status: "exists",
    requiresSignature: true,
    isRequired: true,
    isRecurring: false,
    description:
      "Post-close 12–24 month engagement; 2.5% EBITDA annually; four track deliverables",
  },
  "external/06-post-close/monthly-checkin-agenda": {
    id: "external/06-post-close/monthly-checkin-agenda",
    name: "Monthly COOP check-in agenda",
    path: "./external/06-post-close/monthly-checkin-agenda.html",
    pipeline: "external",
    stage: "06-post-close",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: true,
    recurrenceRule: "monthly",
    description:
      "Standard agenda for monthly stewardship call — tracks progress across all 4 COOP tracks",
  },
  "external/06-post-close/quarterly-status-report": {
    id: "external/06-post-close/quarterly-status-report",
    name: "COOP track status report (quarterly)",
    path: "./external/06-post-close/quarterly-status-report.html",
    pipeline: "external",
    stage: "06-post-close",
    audience: ["seller", "trustee"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: true,
    recurrenceRule: "quarterly",
    description:
      "Written report delivered each quarter — People / Systems / Financial / Governance progress vs. plan",
  },
  "external/06-post-close/refinance-trigger": {
    id: "external/06-post-close/refinance-trigger",
    name: "Refinance trigger notification (Month 14–18)",
    path: "./external/06-post-close/refinance-trigger.html",
    pipeline: "external",
    stage: "06-post-close",
    audience: ["seller", "lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Forhemit notifies company when mandatory conventional refinance window opens — initiates lender outreach",
  },
  "external/06-post-close/seller-note-retirement": {
    id: "external/06-post-close/seller-note-retirement",
    name: "Seller note retirement confirmation",
    path: "./external/06-post-close/seller-note-retirement.html",
    pipeline: "external",
    stage: "06-post-close",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "When seller note is paid off — formal confirmation letter to seller; closes the seller financial relationship",
  },
  "external/06-post-close/coop-completion-letter": {
    id: "external/06-post-close/coop-completion-letter",
    name: "COOP completion letter (end of stewardship)",
    path: "./external/06-post-close/coop-completion-letter.html",
    pipeline: "external",
    stage: "06-post-close",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Month 24 — formal close of stewardship engagement; summary of outcomes, any transition recommendations",
  },
  "external/06-post-close/anniversary-note": {
    id: "external/06-post-close/anniversary-note",
    name: "Employee ownership anniversary note (Year 1)",
    path: "./external/06-post-close/anniversary-note.html",
    pipeline: "external",
    stage: "06-post-close",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Optional — sent to company on first anniversary of ESOP; reinforces stewardship relationship",
  },
  "external/06-post-close/case-study-request": {
    id: "external/06-post-close/case-study-request",
    name: "Case study request (post-close)",
    path: "./external/06-post-close/case-study-request.html",
    pipeline: "external",
    stage: "06-post-close",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Asks seller for permission to use the deal as an anonymized case study — used in broker and CPA outreach",
  },

  // ============================================================================
  // INTERNAL DOCUMENTS - Never leave organization
  // ============================================================================

  // ── 01-first-touch ──────────────────────────────────────────────────────────
  "internal/01-first-touch/inbound-auto-response": {
    id: "internal/01-first-touch/inbound-auto-response",
    name: "Inbound inquiry auto-response (email)",
    path: "./internal/01-first-touch/inbound-auto-response.html",
    pipeline: "internal",
    stage: "01-first-touch",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Triggered when someone contacts via website or deals@ — confirms receipt, sets expectations, provides next step",
  },
  "internal/01-first-touch/voicemail-script": {
    id: "internal/01-first-touch/voicemail-script",
    name: "Voicemail script (Retell AI / live)",
    path: "./internal/01-first-touch/voicemail-script.html",
    pipeline: "internal",
    stage: "01-first-touch",
    audience: ["internal"],
    status: "partial",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "What Forhemit says in the first 20 seconds — consistent across all inbound channels",
  },
  "internal/01-first-touch/conference-followup": {
    id: "internal/01-first-touch/conference-followup",
    name: "Conference / event follow-up email",
    path: "./internal/01-first-touch/conference-followup.html",
    pipeline: "internal",
    stage: "01-first-touch",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Within 24 hours of meeting someone in person — references the conversation, suggests next step",
  },
  "internal/01-first-touch/email-signature-standard": {
    id: "internal/01-first-touch/email-signature-standard",
    name: "Email signature standard (all staff)",
    path: "./internal/01-first-touch/email-signature-standard.html",
    pipeline: "internal",
    stage: "01-first-touch",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Name, title, Forhemit, phone, email, website — consistent format across all outbound",
  },
  "internal/01-first-touch/ooo-coverage-message": {
    id: "internal/01-first-touch/ooo-coverage-message",
    name: "Out-of-office / coverage message standard",
    path: "./internal/01-first-touch/ooo-coverage-message.html",
    pipeline: "internal",
    stage: "01-first-touch",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Who to contact when Forhemit staff is unavailable — especially during active gate windows",
  },
  "internal/01-first-touch/meeting-confirmation": {
    id: "internal/01-first-touch/meeting-confirmation",
    name: "Meeting confirmation email template",
    path: "./internal/01-first-touch/meeting-confirmation.html",
    pipeline: "internal",
    stage: "01-first-touch",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Sent after a call is booked — agenda, dial-in, what to bring or prepare",
  },
  "internal/01-first-touch/no-show-followup": {
    id: "internal/01-first-touch/no-show-followup",
    name: "No-show / reschedule follow-up",
    path: "./internal/01-first-touch/no-show-followup.html",
    pipeline: "internal",
    stage: "01-first-touch",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "When a scheduled call doesn't happen — brief, professional, one re-ask",
  },
  "internal/01-first-touch/confidentiality-reminder": {
    id: "internal/01-first-touch/confidentiality-reminder",
    name: "Confidentiality reminder (recurring, internal)",
    path: "./internal/01-first-touch/confidentiality-reminder.html",
    pipeline: "internal",
    stage: "01-first-touch",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: true,
    recurrenceRule: "quarterly",
    description:
      "Quarterly reminder to all team about what can and cannot be shared externally about active deals",
  },
  "internal/01-first-touch/style-guide": {
    id: "internal/01-first-touch/style-guide",
    name: "Style guide and writing standards one-pager",
    path: "./internal/01-first-touch/style-guide.html",
    pipeline: "internal",
    stage: "01-first-touch",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "'Transaction' not 'transition' as verb; plain language for owners; technical precision for advisors; no ESOP jargon in owner-direct outreach",
  },

  // ── 02-qualification ────────────────────────────────────────────────────────
  "internal/02-qualification/deal-intake-form": {
    id: "internal/02-qualification/deal-intake-form",
    name: "Deal intake form",
    path: "./internal/02-qualification/deal-intake-form.html",
    pipeline: "internal",
    stage: "02-qualification",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description: "Structured intake for new prospects — all four verticals",
    formKey: "deal-intake",
  },
  "internal/02-qualification/classification-intake": {
    id: "internal/02-qualification/classification-intake",
    name: "Classification intake flow",
    path: "./internal/02-qualification/classification-intake.html",
    pipeline: "internal",
    stage: "02-qualification",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description: "React app — routes inbound deals to correct vertical and tier",
    formKey: "deal-flow-system",
  },
  "internal/02-qualification/deal-intake-confirmation": {
    id: "internal/02-qualification/deal-intake-confirmation",
    name: "Deal intake confirmation (internal)",
    path: "./internal/02-qualification/deal-intake-confirmation.html",
    pipeline: "internal",
    stage: "02-qualification",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Internal notification when a new deal is added to the CRM — assigns deal lead, opens Gate 1 checklist",
  },
  "internal/02-qualification/new-deal-announcement": {
    id: "internal/02-qualification/new-deal-announcement",
    name: "New deal announcement (internal)",
    path: "./internal/02-qualification/new-deal-announcement.html",
    pipeline: "internal",
    stage: "02-qualification",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Slack / email when a deal clears Gate 1 — names deal, EBITDA, state, deal lead",
  },
  "internal/02-qualification/pre-flight-checklist-internal": {
    id: "internal/02-qualification/pre-flight-checklist-internal",
    name: "Pre-flight checklist (internal version)",
    path: "./internal/02-qualification/pre-flight-checklist-internal.html",
    pipeline: "internal",
    stage: "02-qualification",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Forhemit's own readiness check before presenting to seller — different from seller-facing version",
  },

  // ── 03-engagement ──────────────────────────────────────────────────────────
  "internal/03-engagement/deal-team-kickoff": {
    id: "internal/03-engagement/deal-team-kickoff",
    name: "Deal team kick-off memo (internal)",
    path: "./internal/03-engagement/deal-team-kickoff.html",
    pipeline: "internal",
    stage: "03-engagement",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Internal document sent Day 1 — names every team member, role, communication channel, gate schedule",
  },
  "internal/03-engagement/vendor-onboarding-checklist": {
    id: "internal/03-engagement/vendor-onboarding-checklist",
    name: "Vendor / advisor onboarding checklist",
    path: "./internal/03-engagement/vendor-onboarding-checklist.html",
    pipeline: "internal",
    stage: "03-engagement",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "When adding a new trustee, counsel, or lender to the pre-vetted team — NDA, contact sheet, fee expectations",
  },
  "internal/03-engagement/conflict-of-interest-log": {
    id: "internal/03-engagement/conflict-of-interest-log",
    name: "Conflict of interest log",
    path: "./internal/03-engagement/conflict-of-interest-log.html",
    pipeline: "internal",
    stage: "03-engagement",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Internal record — any situation where Forhemit's role could create ERISA or SBA independence concern",
  },
  "internal/03-engagement/wire-instructions": {
    id: "internal/03-engagement/wire-instructions",
    name: "Wire instruction sheet (standard)",
    path: "./internal/03-engagement/wire-instructions.html",
    pipeline: "internal",
    stage: "03-engagement",
    audience: ["internal", "seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Novo Bank routing/account — sent to seller / company at retainer and closing milestones",
  },
  "internal/03-engagement/llc-to-corp-checklist": {
    id: "internal/03-engagement/llc-to-corp-checklist",
    name: "LLC-to-C-corp conversion checklist",
    path: "./internal/03-engagement/llc-to-corp-checklist.html",
    pipeline: "internal",
    stage: "03-engagement",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Most time-sensitive gating item — state-specific steps, tax elections, timeline",
  },

  // ── 04-diligence ───────────────────────────────────────────────────────────
  "internal/04-diligence/gate-tracking-dashboard": {
    id: "internal/04-diligence/gate-tracking-dashboard",
    name: "Gate tracking dashboard",
    path: "./internal/04-diligence/gate-tracking-dashboard.html",
    pipeline: "internal",
    stage: "04-diligence",
    audience: ["internal"],
    status: "partial",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description: "Gates 1–4 status per deal — capital, valuation, operations, legal",
    formKey: "deal-flow-system",
  },
  "internal/04-diligence/weekly-internal-review": {
    id: "internal/04-diligence/weekly-internal-review",
    name: "Weekly internal deal review agenda",
    path: "./internal/04-diligence/weekly-internal-review.html",
    pipeline: "internal",
    stage: "04-diligence",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: true,
    recurrenceRule: "weekly",
    description:
      "Standing meeting format — all active deals, gate status, blockers, actions by owner",
  },
  "internal/04-diligence/fee-collection-tracker": {
    id: "internal/04-diligence/fee-collection-tracker",
    name: "Fee collection tracker",
    path: "./internal/04-diligence/fee-collection-tracker.html",
    pipeline: "internal",
    stage: "04-diligence",
    audience: ["internal"],
    status: "partial",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description: "Milestone gates → invoice trigger → payment received — per deal",
  },
  "internal/04-diligence/invoice-template": {
    id: "internal/04-diligence/invoice-template",
    name: "Invoice template (Forhemit → operating company)",
    path: "./internal/04-diligence/invoice-template.html",
    pipeline: "internal",
    stage: "04-diligence",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Clean, professional — references gate milestone, fee tier, payment terms",
  },
  "internal/04-diligence/qofe-findings-memo": {
    id: "internal/04-diligence/qofe-findings-memo",
    name: "QofE findings memo (internal)",
    path: "./internal/04-diligence/qofe-findings-memo.html",
    pipeline: "internal",
    stage: "04-diligence",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Adjusted EBITDA vs. LOI assumption — internal flag if variance exceeds 15% threshold",
  },
  "internal/04-diligence/eidl-lien-tracker": {
    id: "internal/04-diligence/eidl-lien-tracker",
    name: "EIDL lien resolution tracker",
    path: "./internal/04-diligence/eidl-lien-tracker.html",
    pipeline: "internal",
    stage: "04-diligence",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Tracks SBA EIDL payoff / subordination progress — shared with lender when resolved",
  },
  "internal/04-diligence/eidl-lien-status-update": {
    id: "internal/04-diligence/eidl-lien-status-update",
    name: "EIDL lien status update (internal)",
    path: "./internal/04-diligence/eidl-lien-status-update.html",
    pipeline: "internal",
    stage: "04-diligence",
    audience: ["internal", "lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Tracks SBA EIDL payoff / subordination progress — shared with lender when resolved",
  },

  // ── 05-closing ─────────────────────────────────────────────────────────────
  "internal/05-closing/gate4-legal-clearance": {
    id: "internal/05-closing/gate4-legal-clearance",
    name: "Gate 4 / legal clearance memo (internal)",
    path: "./internal/05-closing/gate4-legal-clearance.html",
    pipeline: "internal",
    stage: "05-closing",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "All legal conditions satisfied — trustee sign-off, SBA commitment, docs clean; triggers closing schedule",
  },
  "internal/05-closing/closing-checklist": {
    id: "internal/05-closing/closing-checklist",
    name: "Closing checklist (deal team)",
    path: "./internal/05-closing/closing-checklist.html",
    pipeline: "internal",
    stage: "05-closing",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Every document, every party, every wire — sequenced day-of closing checklist",
  },
  "internal/05-closing/deal-close-announcement": {
    id: "internal/05-closing/deal-close-announcement",
    name: "Deal close announcement (internal)",
    path: "./internal/05-closing/deal-close-announcement.html",
    pipeline: "internal",
    stage: "05-closing",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "When a deal closes — names deal, proceeds, timeline achieved, lessons learned",
  },

  // ── 06-post-close ──────────────────────────────────────────────────────────
  "internal/06-post-close/lessons-learned-memo": {
    id: "internal/06-post-close/lessons-learned-memo",
    name: "Lessons learned memo (post-close, internal)",
    path: "./internal/06-post-close/lessons-learned-memo.html",
    pipeline: "internal",
    stage: "06-post-close",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "What worked, what didn't, what changes for the next deal — mandatory after every close",
  },
  "internal/06-post-close/coop-intake-forms": {
    id: "internal/06-post-close/coop-intake-forms",
    name: "COOP intake forms (Track 1 People, Track 2 Systems)",
    path: "./internal/06-post-close/coop-intake-forms.html",
    pipeline: "internal",
    stage: "06-post-close",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description: "Post-close stewardship onboarding — 4 tracks",
  },
  "internal/06-post-close/coop-delivery-tracker": {
    id: "internal/06-post-close/coop-delivery-tracker",
    name: "COOP delivery tracker (V1.0 – V4.0)",
    path: "./internal/06-post-close/coop-delivery-tracker.html",
    pipeline: "internal",
    stage: "06-post-close",
    audience: ["internal"],
    status: "partial",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Ties COOP version to gate milestone; trustee sign-off at Gate 4",
  },

  // ============================================================================
  // DOCUMENTS WITH MULTIPLE AUDIENCES (appear in both forms and communications)
  // ============================================================================
  "external/02-qualification/transaction-cost-disclosure": {
    id: "external/02-qualification/transaction-cost-disclosure",
    name: "Transaction cost disclosure",
    path: "./external/02-qualification/transaction-cost-disclosure.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description: "Itemized Low/Realistic/High with §1042 comparison vs PE",
  },
  "external/02-qualification/offer-summary": {
    id: "external/02-qualification/offer-summary",
    name: "Offer summary (V3)",
    path: "./external/02-qualification/offer-summary.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Robin Crow / DHI — capital stack, seller proceeds, timeline",
  },
  "external/02-qualification/honest-review": {
    id: "external/02-qualification/honest-review",
    name: "Honest Review document",
    path: "./external/02-qualification/honest-review.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Objections, fears, hopes — fee section intentionally withheld",
  },
  "external/02-qualification/120-day-calendar": {
    id: "external/02-qualification/120-day-calendar",
    name: "120-day calendar",
    path: "./external/02-qualification/120-day-calendar.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description: "Day-by-day milestones for seller visibility",
  },
  "external/02-qualification/seller-faq": {
    id: "external/02-qualification/seller-faq",
    name: "Seller FAQ / plain-language guide",
    path: "./external/02-qualification/seller-faq.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Fifth-grade accessible — what is an ESOP, what does seller actually do, guarantees, control",
  },
  "external/02-qualification/1042-explainer": {
    id: "external/02-qualification/1042-explainer",
    name: "§1042 rollover explainer (seller's CPA version)",
    path: "./external/02-qualification/1042-explainer.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller", "cpa"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "QRS mechanics, reinvestment window, basis implications — for CPA to review with seller",
  },
  "external/02-qualification/tax-impact-summary": {
    id: "external/02-qualification/tax-impact-summary",
    name: "Tax impact summary (ESOP vs third-party sale)",
    path: "./external/02-qualification/tax-impact-summary.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller", "cpa"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Side-by-side tax comparison: ESOP + §1042 vs traditional M&A — CPA review guide with illustrative numbers",
  },
  "external/02-qualification/net-proceeds-calculator": {
    id: "external/02-qualification/net-proceeds-calculator",
    name: "Net proceeds calculator (interactive)",
    path: "./external/02-qualification/net-proceeds-calculator.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Seller inputs EBITDA + basis — shows Day 1 cash, note payout, total vs PE after tax",
  },
  "external/02-qualification/broker-screener": {
    id: "external/02-qualification/broker-screener",
    name: "Broker screener / qualification form",
    path: "./external/02-qualification/broker-screener.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Quick filter — does this listing fit Forhemit criteria before first call",
  },
  "external/02-qualification/two-track-cost-analysis": {
    id: "external/02-qualification/two-track-cost-analysis",
    name: "Two-track cost analysis (full doc)",
    path: "./external/02-qualification/two-track-cost-analysis.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Parallel process economics — when ESOP sunk costs are at risk",
  },
  "external/02-qualification/esop-cost-reference": {
    id: "external/02-qualification/esop-cost-reference",
    name: "ESOP cost reference card (3-way framework)",
    path: "./external/02-qualification/esop-cost-reference.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Sunk / Structural / Lost Benefit — one-page broker leave-behind",
    formKey: "esop-cost-reference",
  },
  "external/02-qualification/seller-document-request": {
    id: "external/02-qualification/seller-document-request",
    name: "Seller document request list",
    path: "./external/02-qualification/seller-document-request.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Organized by Gate — what Forhemit needs from seller and by when",
  },
  "external/02-qualification/esop-ecosystem-outreach": {
    id: "external/02-qualification/esop-ecosystem-outreach",
    name: "ESOP ecosystem outreach playbook",
    path: "./external/02-qualification/esop-ecosystem-outreach.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["trustee", "counsel"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "LinkedIn approach, templates A/B/C, coffee chat agenda, lender intel framework",
  },
  "external/02-qualification/board-resolution-package": {
    id: "external/02-qualification/board-resolution-package",
    name: "Board resolution package",
    path: "./external/02-qualification/board-resolution-package.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Three resolutions: transaction auth, trustee engagement, company counsel engagement",
  },
  "external/02-qualification/roles-independence-matrix": {
    id: "external/02-qualification/roles-independence-matrix",
    name: "Roles & independence matrix",
    path: "./external/02-qualification/roles-independence-matrix.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller", "trustee", "counsel"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Who selects whom, who is client, who pays — ERISA compliance architecture",
  },
  "external/02-qualification/dream-team-roster": {
    id: "external/02-qualification/dream-team-roster",
    name: "Dream team roster + mini-RFP",
    path: "./external/02-qualification/dream-team-roster.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Trustee, ERISA counsel, QofE firm shortlists with evaluation questions",
  },
  "external/02-qualification/erisa-counsel-rfp": {
    id: "external/02-qualification/erisa-counsel-rfp",
    name: "ERISA counsel RFP / conflict check request",
    path: "./external/02-qualification/erisa-counsel-rfp.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["counsel"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Formal engagement initiation for ERISA counsel — conflict check + LLC-to-C-corp ESOP experience",
  },
  "external/02-qualification/trustee-engagement-memo": {
    id: "external/02-qualification/trustee-engagement-memo",
    name: "Trustee engagement memo (introduction letter)",
    path: "./external/02-qualification/trustee-engagement-memo.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["trustee"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Forhemit introduces deal to trustee — what they receive, what the timeline is, what Forhemit's role is not",
  },
  "external/02-qualification/valuation-firm-briefing": {
    id: "external/02-qualification/valuation-firm-briefing",
    name: "Valuation firm briefing memo",
    path: "./external/02-qualification/valuation-firm-briefing.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["trustee"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "ERISA FMV appraisal scope, deal context, trustee referral process — corrects '409A' terminology",
  },
  "external/02-qualification/sba-lender-outreach": {
    id: "external/02-qualification/sba-lender-outreach",
    name: "SBA lender outreach brief (one-pager)",
    path: "./external/02-qualification/sba-lender-outreach.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Who Forhemit is, deal program overview, what we need from lender partner",
  },
  "external/02-qualification/sba-intake-form": {
    id: "external/02-qualification/sba-intake-form",
    name: "SBA intake form",
    path: "./external/02-qualification/sba-intake-form.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description: "Structured lender Q&A and deal intake",
    formKey: "sba-esop-package",
  },
  "external/02-qualification/lender-interview-questions": {
    id: "external/02-qualification/lender-interview-questions",
    name: "Lender qualification interview questions",
    path: "./external/02-qualification/lender-interview-questions.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "Gotcha questions — trustee relationship, seller PG, stretch above $5M, timeline",
  },
  "external/02-qualification/lender-scoring-rubric": {
    id: "external/02-qualification/lender-scoring-rubric",
    name: "Lender scoring rubric",
    path: "./external/02-qualification/lender-scoring-rubric.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description:
      "14-day indication / ESOP exp / stretch capability / re-trade history matrix",
  },
  "external/02-qualification/lender-qa-tracker": {
    id: "external/02-qualification/lender-qa-tracker",
    name: "Lender Q&A tracker",
    path: "./external/02-qualification/lender-qa-tracker.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description: "CRM-style log of lender responses across deals",
    formKey: "lender-qa-tracker",
  },
  "external/02-qualification/repayment-model": {
    id: "external/02-qualification/repayment-model",
    name: "Repayment / amortization model",
    path: "./external/02-qualification/repayment-model.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Seller note + SBA debt service with refinance trigger at Month 14-18",
    formKey: "esop-repayment-model",
  },
  "external/02-qualification/capital-stack-summary": {
    id: "external/02-qualification/capital-stack-summary",
    name: "Capital stack summary (lender package cover)",
    path: "./external/02-qualification/capital-stack-summary.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["lender"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description:
      "Deal-specific one-page summary — uses of proceeds, sources, DSCR, collateral",
  },
  "external/02-qualification/intercreditor-agreement": {
    id: "external/02-qualification/intercreditor-agreement",
    name: "Intercreditor agreement template",
    path: "./external/02-qualification/intercreditor-agreement.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["lender"],
    status: "exists",
    requiresSignature: true,
    isRequired: false,
    isRecurring: false,
    description:
      "For deals >$5M requiring dual-lender stack — seller note subordination terms",
  },
  "external/02-qualification/esop-head-to-head": {
    id: "external/02-qualification/esop-head-to-head",
    name: "ESOP head-to-head comparison",
    path: "./external/02-qualification/esop-head-to-head.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description: "ESOP vs PE vs strategic buyer comparison",
    formKey: "esop-head-to-head",
  },
  "external/02-qualification/esop-term-sheet": {
    id: "external/02-qualification/esop-term-sheet",
    name: "ESOP term sheet",
    path: "./external/02-qualification/esop-term-sheet.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["seller"],
    status: "exists",
    requiresSignature: false,
    isRequired: true,
    isRecurring: false,
    description: "Deal terms summary for seller review",
    formKey: "esop-term-sheet",
  },
  "external/02-qualification/intro-letter-generator": {
    id: "external/02-qualification/intro-letter-generator",
    name: "Intro letter generator",
    path: "./external/02-qualification/intro-letter-generator.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["broker"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description: "Generates personalized introduction letters",
    formKey: "intro-letter-generator",
  },
  "external/02-qualification/esop-qualification-prompt": {
    id: "external/02-qualification/esop-qualification-prompt",
    name: "ESOP qualification prompt",
    path: "./external/02-qualification/esop-qualification-prompt.html",
    pipeline: "external",
    stage: "02-qualification",
    audience: ["internal"],
    status: "exists",
    requiresSignature: false,
    isRequired: false,
    isRecurring: false,
    description: "AI prompt for qualifying ESOP deals",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all templates for a specific pipeline stage
 */
export function getTemplatesByStage(stage: Stage): TemplateEntry[] {
  return Object.values(templates).filter((t) => t.stage === stage);
}

/**
 * Get all templates for a specific pipeline (external or internal)
 */
export function getTemplatesByPipeline(pipeline: Pipeline): TemplateEntry[] {
  return Object.values(templates).filter((t) => t.pipeline === pipeline);
}

/**
 * Get all templates for a specific audience
 */
export function getTemplatesByAudience(audience: Audience): TemplateEntry[] {
  return Object.values(templates).filter((t) => t.audience.includes(audience));
}

/**
 * Get all templates with a specific status
 */
export function getTemplatesByStatus(status: Status): TemplateEntry[] {
  return Object.values(templates).filter((t) => t.status === status);
}

/**
 * Get all urgent templates (Deal 1 blockers)
 */
export function getUrgentTemplates(): TemplateEntry[] {
  return getTemplatesByStatus("urgent");
}

/**
 * Get all templates that exist (built)
 */
export function getExistingTemplates(): TemplateEntry[] {
  return getTemplatesByStatus("exists");
}

/**
 * Get all templates that need to be built (gap or urgent)
 */
export function getGapTemplates(): TemplateEntry[] {
  return Object.values(templates).filter(
    (t) => t.status === "gap" || t.status === "urgent"
  );
}

/**
 * Get all templates that require signatures
 */
export function getSignatureTemplates(): TemplateEntry[] {
  return Object.values(templates).filter((t) => t.requiresSignature);
}

/**
 * Get all recurring templates
 */
export function getRecurringTemplates(): TemplateEntry[] {
  return Object.values(templates).filter((t) => t.isRecurring);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): TemplateEntry | undefined {
  return templates[id];
}

/**
 * Get all unique stages
 */
export function getAllStages(): Stage[] {
  return [
    "01-first-touch",
    "02-qualification",
    "03-engagement",
    "04-diligence",
    "05-closing",
    "06-post-close",
  ];
}

/**
 * Get statistics
 */
export function getTemplateStats() {
  const all = Object.values(templates);
  return {
    total: all.length,
    external: all.filter((t) => t.pipeline === "external").length,
    internal: all.filter((t) => t.pipeline === "internal").length,
    exists: all.filter((t) => t.status === "exists").length,
    partial: all.filter((t) => t.status === "partial").length,
    gap: all.filter((t) => t.status === "gap").length,
    urgent: all.filter((t) => t.status === "urgent").length,
    requiresSignature: all.filter((t) => t.requiresSignature).length,
    isRequired: all.filter((t) => t.isRequired).length,
    isRecurring: all.filter((t) => t.isRecurring).length,
  };
}
