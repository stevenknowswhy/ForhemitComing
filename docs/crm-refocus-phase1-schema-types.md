06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# CRM Refocus — Phase 1: Schema + Types + Constants

> **Goal:** Redesign the data model from a PE deal-tracking CRM to a relationship/nurture stewardship CRM. No UI changes. Schema, types, and constants only.
>
> **Date:** 2026-05-31
> **Status:** DRAFT — Pending review

---

## Decisions Locked In

| Decision | Choice | Rationale |
|---|---|---|
| Owners as contacts | `crmContacts` with `contactType: "owner"` | Searchable, gets own interaction log, reusable |
| Single contact pool | One `crmContacts` table with type discriminator | Avoids reconciling duplicate people across tables |
| Interaction log entity-agnostic | Standalone `crmInteractions` table with optional `companyId` and `contactId` | Not every interaction is deal-related |
| `lastContactDate` auto-derived | Computed from latest interaction log entry, NOT a manual field | Manual fields go stale |
| `daysSinceContact` computed | Not stored — derived in queries | Same reason |
| `assignedTo` in schema only | Field exists, hidden from UI until team grows | Future-proof without current complexity |
| Tags freeform | `tags: string[]` on each record | Don't over-engineer; autocomplete later |
| Financial range buckets | Single shared enum for revenue and EBITDA | Consistent filtering, easier comparison |
| Deal stages supersede PE pipeline | New 11-stage stewardship pipeline replaces the old 9-stage PE pipeline | The old stages don't match the business model |
| Two-pipeline bridge | `In Process` → triggers Deal Tracker entry | Existing 120-day tracker still valid for active deals |
| Reminders stored, not sent | Fields exist; dashboard surfaces them in Phase 7 | Avoids building a notification engine now |

---

## 1. New Constants

### 1.1 Pipeline Stages (replaces PIPELINE_STAGES)

```typescript
// packages/shared/src/features/crm/constants.ts (new file)

export const DEAL_STAGES = [
  "Identified",      // In database, no real contact yet
  "Connected",       // Had first conversation
  "Nurturing",       // Regular touchpoints, not ready yet
  "Exploring",       // They're open to learning more
  "Engaged",         // Active conversations about transition
  "Committed",       // Moving forward with us
  "In Process",      // Transaction underway → triggers Deal Tracker
  "Closed",          // Transition complete
  "Not a Fit",       // Wrong profile or not interested
  "Lost",            // Went with someone else
  "Recycled",        // Come back to later
] as const;

export type DealStage = (typeof DEAL_STAGES)[number];

// Terminal stages (no further action expected)
export const TERMINAL_STAGES = ["Closed", "Not a Fit", "Lost"] as const;

// Active stages (pipeline-worthy)
export const ACTIVE_STAGES = [
  "Identified", "Connected", "Nurturing", "Exploring",
  "Engaged", "Committed", "In Process",
] as const;

// Stages that should appear in the main pipeline view
export const PIPELINE_STAGES = [...ACTIVE_STAGES] as const;
```

**Migration mapping (old → new):**

| Old Stage | New Stage |
|---|---|
| First contact | Identified |
| Intro call | Connected |
| NDA sent | Engaged |
| Feasibility | Engaged |
| Term sheet | Committed |
| LOI signed | In Process |
| Closed | Closed |
| On hold | Recycled |
| Dead | Lost |

This mapping is a **default** — existing companies get migrated, but the admin can manually reassign.

### 1.2 NDA Status (keep as-is)

```typescript
export const NDA_STATUS = ["None", "Pending", "Signed"] as const;
export type NdaStatus = (typeof NDA_STATUS)[number];
```

No change needed. NDA tracking is still relevant for deals in `Engaged`+.

### 1.3 Contact Types (new)

```typescript
export const CONTACT_TYPES = [
  "owner",             // Business owner / seller
  "advisor",           // CPA, attorney, wealth manager attached to a client
  "broker",            // Deal intermediary
  "referral_partner",  // Your referral network (may also be an "advisor" type)
  "other",             // Lender, trustee, counsel, etc.
] as const;

export type ContactType = (typeof CONTACT_TYPES)[number];
```

### 1.4 Advisor Types (new)

```typescript
export const ADVISOR_TYPES = [
  "CPA",
  "Attorney / ESOP Counsel",
  "Wealth Manager",
  "Financial Planner",
  "Insurance Agent",
  "Business Banker",
  "Commercial RE",
  "Other",
] as const;

export type AdvisorType = (typeof ADVISOR_TYPES)[number];
```

### 1.5 Financial Range Buckets (new)

```typescript
export const FINANCIAL_RANGES = [
  "Under $500K",
  "$500K – $1M",
  "$1M – $3M",
  "$3M – $5M",
  "$5M – $10M",
  "$10M+",
  "Unknown",
] as const;

export type FinancialRange = (typeof FINANCIAL_RANGES)[number];
```

### 1.6 Employee Count Ranges (new)

```typescript
export const EMPLOYEE_RANGES = [
  "1–5",
  "6–20",
  "21–50",
  "51–100",
  "100+",
  "Unknown",
] as const;

export type EmployeeRange = (typeof EMPLOYEE_RANGES)[number];
```

### 1.7 Transition Timeline (new)

```typescript
export const TRANSITION_TIMELINES = [
  "Now (0–12 months)",
  "Soon (1–2 years)",
  "Planning (2–5 years)",
  "Someday",
  "Not Sure",
] as const;

export type TransitionTimeline = (typeof TRANSITION_TIMELINES)[number];
```

### 1.8 Motivation Types (new)

```typescript
export const PRIMARY_MOTIVATIONS = [
  "Retirement",
  "Health",
  "Burnout",
  "Partner Issues",
  "Growth Capital",
  "Estate Planning",
  "Family",
  "No Successor",
  "Other",
] as const;

export type PrimaryMotivation = (typeof PRIMARY_MOTIVATIONS)[number];
```

### 1.9 Nurture Stage (new)

```typescript
export const NURTURE_STAGES = [
  "Awareness",
  "Exploring",
  "Considering",
  "Ready",
  "In Process",
  "Closed",
  "Recycled",
] as const;

export type NurtureStage = (typeof NURTURE_STAGES)[number];
```

### 1.10 Relationship Stages (for advisor network, new)

```typescript
export const RELATIONSHIP_STAGES = [
  "New Contact",
  "Getting to Know",
  "Mutual Trust",
  "Active Partner",
  "Dormant",
  "Dead",
] as const;

export type RelationshipStage = (typeof RELATIONSHIP_STAGES)[number];
```

### 1.11 Interaction Types (new)

```typescript
export const INTERACTION_TYPES = [
  "Call",
  "Email",
  "Text",
  "Meeting",
  "Coffee",
  "Event",
  "Referral",
  "Other",
] as const;

export type InteractionType = (typeof INTERACTION_TYPES)[number];
```

### 1.12 Sentiment (new)

```typescript
export const SENTIMENT_VALUES = [
  "Positive",
  "Neutral",
  "Negative",
  "Breakthrough",
] as const;

export type SentimentValue = (typeof SENTIMENT_VALUES)[number];
```

### 1.13 Contact Frequency Goals (new)

```typescript
export const CONTACT_FREQUENCIES = [
  "Weekly",
  "Biweekly",
  "Monthly",
  "Quarterly",
  "Annually",
  "As Needed",
] as const;

export type ContactFrequency = (typeof CONTACT_FREQUENCIES)[number];
```

### 1.14 Urgency Levels (new)

```typescript
export const URGENCY_LEVELS = [
  "Low",
  "Medium",
  "High",
  "Critical",
] as const;

export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];
```

### 1.15 Trust Levels (new)

```typescript
export const TRUST_LEVELS = [
  "Cold",
  "Warming",
  "Established",
  "Deep Trust",
] as const;

export type TrustLevel = (typeof TRUST_LEVELS)[number];
```

### 1.16 Business Model / Industry Categories (new)

```typescript
export const BUSINESS_MODELS = [
  "B2B",
  "B2C",
  "Service",
  "Product",
  "Trades",
  "Healthcare",
  "Other",
] as const;

export type BusinessModel = (typeof BUSINESS_MODELS)[number];

export const INDUSTRY_CATEGORIES = [
  "Manufacturing",
  "Construction",
  "Healthcare",
  "Professional Services",
  "Retail",
  "Technology",
  "Food & Beverage",
  "Transportation & Logistics",
  "Real Estate",
  "Education",
  "Financial Services",
  "Energy",
  "Agriculture",
  "Entertainment",
  "Other",
] as const;

export type IndustryCategory = (typeof INDUSTRY_CATEGORIES)[number];
```

---

## 2. Schema Changes

### 2.1 Modified: `crmCompanies`

**Remove:**
- `owner?: string` — replaced by linked contact records
- `advisor?: string` — replaced by linked contact records with type
- `advisors?: string[]` — replaced by linked contact records with type
- `referralSource?: string` — replaced by `referredByContactId`
- `size?: string` — replaced by `employeeCountRange`
- `revenue?: string` — replaced by `revenueRange`
- `ebitda?: string` — replaced by `ebitdaRange`
- `stage` union literal values — replaced by new stage set
- `ndaStatus` — keep (still relevant for engaged+ deals)
- `nextStep` / `nextStepDate` — keep, still useful

**Add:**

```typescript
crmCompanies: defineTable({
  // ── Step 1: Business Basics ───────────────────────────────
  name: v.string(),
  industry: v.optional(v.string()),              // freeform or from INDUSTRY_CATEGORIES
  subIndustry: v.optional(v.string()),
  businessModel: v.optional(v.string()),          // B2B / B2C / Service / etc.
  yearsInBusiness: v.optional(v.number()),
  revenueRange: v.optional(v.string()),           // FINANCIAL_RANGES value
  employeeCountRange: v.optional(v.string()),     // EMPLOYEE_RANGES value
  city: v.optional(v.string()),
  state: v.optional(v.string()),
  website: v.optional(v.string()),
  address: v.optional(v.string()),
  phone: v.optional(v.string()),                  // NEW: company phone
  howWeHeardAboutThem: v.optional(v.string()),    // dropdown value
  referredByContactId: v.optional(v.id("crmContacts")),
  dateFirstContact: v.optional(v.string()),       // ISO date
  assignedTo: v.optional(v.string()),             // user ID (schema only, hidden from UI)

  // ── Step 3: Transition Readiness ──────────────────────────
  transitionTimeline: v.optional(v.string()),     // TRANSITION_TIMELINES value
  targetTransitionDate: v.optional(v.string()),
  retirementGoalAge: v.optional(v.number()),
  ownerAge: v.optional(v.number()),
  primaryMotivation: v.optional(v.string()),      // PRIMARY_MOTIVATIONS value
  motivationDetail: v.optional(v.string()),       // their words
  urgencyLevel: v.optional(v.string()),           // URGENCY_LEVELS value
  hasSuccessorInMind: v.optional(v.string()),     // Yes-Family / Yes-Employee / Yes-Outside / No / Unsure
  familyInBusiness: v.optional(v.boolean()),
  familyMemberNames: v.optional(v.string()),
  ownerWorkedWithAdvisor: v.optional(v.boolean()),
  businessValuedBefore: v.optional(v.boolean()),
  lastValuationDate: v.optional(v.string()),
  lastValuationAmount: v.optional(v.string()),    // currency range string
  identityTiedToBusiness: v.optional(v.string()), // High / Medium / Low
  openToConversation: v.optional(v.string()),     // Very Open / Somewhat / Guarded
  trustLevel: v.optional(v.string()),             // TRUST_LEVELS value
  whatTheyCareMostAbout: v.optional(v.string()),  // textarea — THE most important field
  dealBreakers: v.optional(v.string()),           // textarea
  readinessScore: v.optional(v.number()),         // 1–10
  nextNurtureAction: v.optional(v.string()),      // dropdown value
  nurtureStage: v.optional(v.string()),           // NURTURE_STAGES value

  // ── Step 4: Business Snapshot (Light Financials) ──────────
  ebitdaRange: v.optional(v.string()),            // FINANCIAL_RANGES value
  askingPriceExpectation: v.optional(v.string()),
  ourValuationEstimate: v.optional(v.string()),
  profitability: v.optional(v.string()),          // Very Profitable / Profitable / Breaking Even / Struggling
  revenueGrowthTrend: v.optional(v.string()),     // Growing / Stable / Declining
  primaryAssets: v.optional(v.array(v.string())), // checkbox values
  realEstateOwned: v.optional(v.boolean()),
  debtOnBusiness: v.optional(v.string()),         // yes/no + range
  ownerCompensation: v.optional(v.string()),      // range
  businessDependentOnOwner: v.optional(v.string()), // Highly / Somewhat / Not Much
  financialNotes: v.optional(v.string()),

  // ── Step 5: Broker ────────────────────────────────────────
  hasBroker: v.optional(v.boolean()),
  brokerContactId: v.optional(v.id("crmContacts")),
  brokerFirm: v.optional(v.string()),
  brokerCommission: v.optional(v.string()),       // percentage
  brokerEngagementSigned: v.optional(v.boolean()),
  brokerEngagementDate: v.optional(v.string()),
  brokerNotes: v.optional(v.string()),

  // ── Step 6: Relationship & Nurture ────────────────────────
  lastContactType: v.optional(v.string()),        // INTERACTION_TYPES value
  lastContactSummary: v.optional(v.string()),
  contactFrequencyGoal: v.optional(v.string()),   // CONTACT_FREQUENCIES value
  resourcesSentTo: v.optional(v.array(v.string())),
  eventsAttendedTogether: v.optional(v.string()),
  referralsMadeForThem: v.optional(v.string()),
  birthdayCardSent: v.optional(v.boolean()),
  holidayCardSent: v.optional(v.boolean()),
  valueAddedActions: v.optional(v.string()),

  // ── Step 6: Pipeline Status ───────────────────────────────
  stage: v.union(/* new 11 stages — see below */),
  stageEnteredAt: v.optional(v.number()),
  estimatedCloseDate: v.optional(v.string()),
  probabilityPct: v.optional(v.number()),         // 0–100
  closeConfidence: v.optional(v.string()),        // Hot / Warm / Cool / Cold
  whyWeWinThis: v.optional(v.string()),
  whyWeMightLose: v.optional(v.string()),
  recycleDate: v.optional(v.string()),
  recycleReason: v.optional(v.string()),

  // ── Step 7: Notes & Next Steps ────────────────────────────
  notes: v.optional(v.string()),
  internalNotes: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  nextAction: v.optional(v.string()),
  nextActionDate: v.optional(v.string()),
  nextActionOwner: v.optional(v.string()),
  reminderSet: v.optional(v.boolean()),
  reminderDate: v.optional(v.string()),

  // ── Existing fields to KEEP ───────────────────────────────
  ndaStatus: v.union(v.literal("None"), v.literal("Pending"), v.literal("Signed")),
  ref: v.optional(v.string()),
  fees: v.optional(v.object({ /* unchanged */ })),
  gates: v.optional(v.object({ /* unchanged */ })),
  boxFolderId: v.optional(v.string()),
  boxSignRequestId: v.optional(v.string()),
  boxSignStatus: v.optional(v.string()),
  sentAt: v.optional(v.number()),

  // ── Contact FKs (keep broker, replace seller with primary owner) ──
  primaryOwnerContactId: v.optional(v.id("crmContacts")),
  // sellerContactId → REMOVED (replaced by primaryOwnerContactId)
  // brokerContactId → moved to broker section above
  lenderContactId: v.optional(v.id("crmContacts")),
  trusteeContactId: v.optional(v.id("crmContacts")),
  counselContactId: v.optional(v.id("crmContacts")),

  // ── Metadata ──────────────────────────────────────────────
  createdAt: v.number(),
  updatedAt: v.number(),
  createdBy: v.optional(v.string()),
})
  .index("by_stage", ["stage"])
  .index("by_ndaStatus", ["ndaStatus"])
  .index("by_createdAt", ["createdAt"])
  .index("by_nextActionDate", ["nextActionDate"])    // replaces nextStepDate
  .index("by_name", ["name"])
  .index("by_nurtureStage", ["nurtureStage"])         // NEW
  .index("by_transitionTimeline", ["transitionTimeline"]) // NEW
  .index("by_recycleDate", ["recycleDate"])           // NEW
  .index("by_referredBy", ["referredByContactId"])    // NEW
```

### 2.2 Modified: `crmContacts`

**Add contact type discriminator and all person-related fields:**

```typescript
crmContacts: defineTable({
  // ── Identity ──────────────────────────────────────────────
  contactType: v.string(),      // CONTACT_TYPES: "owner" | "advisor" | "broker" | "referral_partner" | "other"
  firstName: v.string(),
  lastName: v.string(),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  title: v.optional(v.string()),     // CEO, CPA, Attorney, etc.
  firm: v.optional(v.string()),       // their company/firm name

  // ── Link to company (optional — referral partners may not be linked) ──
  companyId: v.optional(v.id("crmCompanies")),
  isPrimary: v.optional(v.boolean()),  // primary owner of a company
  roleInBusiness: v.optional(v.string()),

  // ── Owner-specific fields ─────────────────────────────────
  ownershipPct: v.optional(v.number()),
  linkedInUrl: v.optional(v.string()),
  preferredContact: v.optional(v.string()),  // Call / Text / Email
  birthday: v.optional(v.string()),          // ISO date — for card sending
  spouseName: v.optional(v.string()),
  personalInterests: v.optional(v.array(v.string())),  // tags
  almaMater: v.optional(v.string()),
  hometown: v.optional(v.string()),

  // ── Advisor-specific fields ───────────────────────────────
  advisorType: v.optional(v.string()),        // ADVISOR_TYPES value
  advisorOpenToUs: v.optional(v.string()),    // Supportive / Neutral / Resistant / Unknown
  relationshipStrength: v.optional(v.string()), // Strong / Moderate / Weak / Unknown

  // ── Broker-specific fields ────────────────────────────────
  brokerMarket: v.optional(v.string()),
  website: v.optional(v.string()),
  dateMet: v.optional(v.string()),

  // ── Referral partner-specific fields ──────────────────────
  relationshipStage: v.optional(v.string()),   // RELATIONSHIP_STAGES value
  relationshipOwner: v.optional(v.string()),   // user ID
  howWeMet: v.optional(v.string()),
  totalReferralsReceived: v.optional(v.number()),
  referralsThisYear: v.optional(v.number()),
  lastReferralDate: v.optional(v.string()),
  referralsMadeToThem: v.optional(v.number()),
  typicalClientProfile: v.optional(v.string()),
  averageClientAge: v.optional(v.string()),
  geographyServed: v.optional(v.string()),
  openToCoReferrals: v.optional(v.boolean()),
  willingToCoPresent: v.optional(v.boolean()),

  // ── Nurture (shared across types) ─────────────────────────
  lastContactDate: v.optional(v.string()),     // auto-derived from interaction log
  contactFrequencyGoal: v.optional(v.string()), // CONTACT_FREQUENCIES value
  nextTouchDate: v.optional(v.string()),
  birthdayCardSent: v.optional(v.boolean()),
  holidayCardSent: v.optional(v.boolean()),
  nurtureNotes: v.optional(v.string()),
  notes: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),

  // ── Metadata ──────────────────────────────────────────────
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_company", ["companyId"])
  .index("by_email", ["email"])
  .index("by_type", ["contactType"])          // NEW
  .index("by_type_company", ["contactType", "companyId"]) // NEW
  .index("by_lastName", ["lastName"])          // NEW: for search/autocomplete
```

**Migration note:** Existing `crmContacts` records have no `contactType`. Migration script should:
- If `role === "Owner"` or `isPrimary === true` → set `contactType: "owner"`
- If linked to `brokerContactId` on a company → set `contactType: "broker"`
- Otherwise → set `contactType: "other"` (admin reviews later)

### 2.3 New: `crmInteractions`

Entity-agnostic interaction log. Replaces `crmActivities` as the primary activity tracking table.

```typescript
crmInteractions: defineTable({
  // ── What happened ─────────────────────────────────────────
  type: v.string(),              // INTERACTION_TYPES value
  summary: v.string(),           // THE most important field — what was said
  sentiment: v.optional(v.string()), // SENTIMENT_VALUES value

  // ── Who ───────────────────────────────────────────────────
  contactId: v.optional(v.id("crmContacts")),  // who we interacted with
  companyId: v.optional(v.id("crmCompanies")),  // about which company (optional)
  withWhomName: v.optional(v.string()),          // name if contact not in system
  performedBy: v.optional(v.string()),           // internal user

  // ── Follow-up ─────────────────────────────────────────────
  nextAction: v.optional(v.string()),
  nextActionDate: v.optional(v.string()),
  nextActionCompleted: v.optional(v.boolean()),

  // ── Metadata ──────────────────────────────────────────────
  date: v.string(),              // ISO date YYYY-MM-DD
  createdAt: v.number(),
})
  .index("by_company", ["companyId"])
  .index("by_contact", ["contactId"])
  .index("by_date", ["date"])
  .index("by_type", ["type"])
  .index("by_company_date", ["companyId", "date"])
  .index("by_contact_date", ["contactId", "date"])
  .index("by_nextActionDate", ["nextActionDate"]) // NEW: for "today's actions" query
```

**Migration:** Existing `crmActivities` records should be migrated into `crmInteractions`:
- `companyId` → same
- `type` → map: `note` → `Other`, `call` → `Call`, `email` → `Email`, `meeting` → `Meeting`, `stage_change` → `Other`, `task` → `Other`
- `title` + `description` → combined into `summary`
- `date` → same
- `performedBy` → same

### 2.4 New: `crmDocuments`

Document tracking for deal-related files.

```typescript
crmDocuments: defineTable({
  companyId: v.optional(v.id("crmCompanies")),
  contactId: v.optional(v.id("crmContacts")),
  name: v.string(),
  type: v.string(),              // NDA / Valuation / Letter / Resource / Meeting Notes / Other
  url: v.optional(v.string()),
  storageId: v.optional(v.string()),
  uploadedBy: v.optional(v.string()),
  notes: v.optional(v.string()),
  createdAt: v.number(),
})
  .index("by_company", ["companyId"])
  .index("by_contact", ["contactId"])
  .index("by_type", ["type"])
```

### 2.5 Keep Unchanged

These tables need **no schema changes** for Phase 1:

- `crmTasks` — still useful for follow-up tasks (but will eventually be replaced by interaction log `nextAction`)
- `companyFinancials` — detailed financials for deals in `In Process` stage (Deal Tracker)
- `dealDocuments` — same as above
- `dealTrackerTasks` / `dealTrackerProgress` — the 120-day tracker is untouched
- `workflowTasks` / `templates` / `stageRequirements` — template engine stays
- `businessLog` / `businessLogStats` — activity feed stays
- All journal tables — post-close system stays
- All non-CRM tables (`contactSubmissions`, `earlyAccessSignups`, etc.)

### 2.6 Deprecate (keep, don't use for new records)

- `crmActivities` — replaced by `crmInteractions`. Keep for read access during migration. Add comment: `@deprecated Use crmInteractions instead`.

---

## 3. Types Rewrite

### 3.1 File: `packages/shared/src/features/crm/types.ts`

Full rewrite of this file. New structure:

```typescript
// ── Constants ────────────────────────────────────────────────
// (all the constants from section 1 above)

// ── Entity Types ─────────────────────────────────────────────

export interface Company {
  _id: string;
  id?: string;
  _creationTime?: number;

  // Step 1: Business Basics
  name: string;
  industry?: string;
  subIndustry?: string;
  businessModel?: BusinessModel;
  yearsInBusiness?: number;
  revenueRange?: FinancialRange;
  employeeCountRange?: EmployeeRange;
  city?: string;
  state?: string;
  website?: string;
  address?: string;
  phone?: string;
  howWeHeardAboutThem?: string;
  referredByContactId?: string;
  dateFirstContact?: string;
  assignedTo?: string;

  // Step 3: Transition Readiness
  transitionTimeline?: TransitionTimeline;
  targetTransitionDate?: string;
  retirementGoalAge?: number;
  ownerAge?: number;
  primaryMotivation?: PrimaryMotivation;
  motivationDetail?: string;
  urgencyLevel?: UrgencyLevel;
  hasSuccessorInMind?: string;
  familyInBusiness?: boolean;
  familyMemberNames?: string;
  ownerWorkedWithAdvisor?: boolean;
  businessValuedBefore?: boolean;
  lastValuationDate?: string;
  lastValuationAmount?: string;
  identityTiedToBusiness?: "High" | "Medium" | "Low";
  openToConversation?: "Very Open" | "Somewhat" | "Guarded";
  trustLevel?: TrustLevel;
  whatTheyCareMostAbout?: string;
  dealBreakers?: string;
  readinessScore?: number;
  nextNurtureAction?: string;
  nurtureStage?: NurtureStage;

  // Step 4: Business Snapshot
  ebitdaRange?: FinancialRange;
  askingPriceExpectation?: string;
  ourValuationEstimate?: string;
  profitability?: "Very Profitable" | "Profitable" | "Breaking Even" | "Struggling";
  revenueGrowthTrend?: "Growing" | "Stable" | "Declining";
  primaryAssets?: string[];
  realEstateOwned?: boolean;
  debtOnBusiness?: string;
  ownerCompensation?: string;
  businessDependentOnOwner?: "Highly" | "Somewhat" | "Not Much";
  financialNotes?: string;

  // Step 5: Broker
  hasBroker?: boolean;
  brokerContactId?: string;
  brokerFirm?: string;
  brokerCommission?: string;
  brokerEngagementSigned?: boolean;
  brokerEngagementDate?: string;
  brokerNotes?: string;

  // Step 6: Pipeline
  stage: DealStage;
  ndaStatus: NdaStatus;
  stageEnteredAt?: number;
  estimatedCloseDate?: string;
  probabilityPct?: number;
  closeConfidence?: "Hot" | "Warm" | "Cool" | "Cold";
  whyWeWinThis?: string;
  whyWeMightLose?: string;
  recycleDate?: string;
  recycleReason?: string;

  // Step 6: Nurture
  lastContactType?: InteractionType;
  lastContactSummary?: string;
  contactFrequencyGoal?: ContactFrequency;
  resourcesSentTo?: string[];
  eventsAttendedTogether?: string;
  referralsMadeForThem?: string;
  birthdayCardSent?: boolean;
  holidayCardSent?: boolean;
  valueAddedActions?: string;

  // Step 7: Notes & Next Steps
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  nextAction?: string;
  nextActionDate?: string;
  nextActionOwner?: string;
  reminderSet?: boolean;
  reminderDate?: string;

  // Existing fields (kept)
  ref?: string;
  fees?: { /* unchanged */ };
  gates?: { /* unchanged */ };
  primaryOwnerContactId?: string;
  brokerContactId?: string;  // duplicated above for clarity
  lenderContactId?: string;
  trusteeContactId?: string;
  counselContactId?: string;
  boxFolderId?: string;
  boxSignRequestId?: string;
  boxSignStatus?: string;
  sentAt?: number;
  nextStep?: string;         // legacy compat — maps to nextAction
  nextStepDate?: string;     // legacy compat — maps to nextActionDate

  // Metadata
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
  priorityScore?: number;
}

export interface Contact {
  _id: string;
  id?: string;
  _creationTime?: number;

  contactType: ContactType;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  firm?: string;

  companyId?: string;
  isPrimary?: boolean;
  roleInBusiness?: string;
  ownershipPct?: number;
  linkedInUrl?: string;
  preferredContact?: string;
  birthday?: string;
  spouseName?: string;
  personalInterests?: string[];
  almaMater?: string;
  hometown?: string;

  advisorType?: AdvisorType;
  advisorOpenToUs?: string;
  relationshipStrength?: string;

  brokerMarket?: string;
  website?: string;
  dateMet?: string;

  relationshipStage?: RelationshipStage;
  relationshipOwner?: string;
  howWeMet?: string;
  totalReferralsReceived?: number;
  referralsThisYear?: number;
  lastReferralDate?: string;
  referralsMadeToThem?: number;
  typicalClientProfile?: string;
  averageClientAge?: string;
  geographyServed?: string;
  openToCoReferrals?: boolean;
  willingToCoPresent?: boolean;

  lastContactDate?: string;
  contactFrequencyGoal?: ContactFrequency;
  nextTouchDate?: string;
  birthdayCardSent?: boolean;
  holidayCardSent?: boolean;
  nurtureNotes?: string;
  notes?: string;
  tags?: string[];

  createdAt?: number;
  updatedAt?: number;
}

export interface Interaction {
  _id: string;
  id?: string;
  _creationTime?: number;

  type: InteractionType;
  summary: string;
  sentiment?: SentimentValue;

  contactId?: string;
  companyId?: string;
  withWhomName?: string;
  performedBy?: string;

  nextAction?: string;
  nextActionDate?: string;
  nextActionCompleted?: boolean;

  date: string;
  createdAt?: number;
}

export interface CrmDocument {
  _id: string;
  id?: string;
  _creationTime?: number;

  companyId?: string;
  contactId?: string;
  name: string;
  type: string;
  url?: string;
  storageId?: string;
  uploadedBy?: string;
  notes?: string;
  createdAt?: number;
}
```

### 3.2 Form Types

```typescript
export interface CompanyFormData {
  // Step 1: Business Basics
  name: string;
  industry?: string;
  subIndustry?: string;
  businessModel?: string;
  yearsInBusiness?: number;
  revenueRange?: string;
  employeeCountRange?: string;
  city?: string;
  state?: string;
  website?: string;
  address?: string;
  phone?: string;
  howWeHeardAboutThem?: string;
  referredByContactId?: string;
  dateFirstContact?: string;

  // Step 2: Owner Info (array — primary + additional)
  owners: OwnerFormData[];

  // Step 3: Transition Readiness
  transitionTimeline?: string;
  targetTransitionDate?: string;
  retirementGoalAge?: number;
  ownerAge?: number;
  primaryMotivation?: string;
  motivationDetail?: string;
  urgencyLevel?: string;
  hasSuccessorInMind?: string;
  familyInBusiness?: boolean;
  familyMemberNames?: string;
  ownerWorkedWithAdvisor?: boolean;
  businessValuedBefore?: boolean;
  lastValuationDate?: string;
  lastValuationAmount?: string;
  identityTiedToBusiness?: string;
  openToConversation?: string;
  trustLevel?: string;
  whatTheyCareMostAbout?: string;
  dealBreakers?: string;
  readinessScore?: number;
  nextNurtureAction?: string;
  nurtureStage?: string;

  // Step 4: Business Snapshot
  ebitdaRange?: string;
  askingPriceExpectation?: string;
  ourValuationEstimate?: string;
  profitability?: string;
  revenueGrowthTrend?: string;
  primaryAssets?: string[];
  realEstateOwned?: boolean;
  debtOnBusiness?: string;
  ownerCompensation?: string;
  businessDependentOnOwner?: string;
  financialNotes?: string;

  // Step 5: Broker
  hasBroker?: boolean;
  broker?: BrokerFormData;

  // Step 5: Advisors (array)
  advisors: AdvisorFormData[];

  // Step 6: Pipeline
  stage: string;
  ndaStatus: string;
  estimatedCloseDate?: string;
  probabilityPct?: number;
  closeConfidence?: string;
  whyWeWinThis?: string;
  whyWeMightLose?: string;
  recycleDate?: string;
  recycleReason?: string;

  // Step 6: Nurture
  contactFrequencyGoal?: string;
  resourcesSentTo?: string[];
  eventsAttendedTogether?: string;
  referralsMadeForThem?: string;

  // Step 7: Notes & Next Steps
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  nextAction?: string;
  nextActionDate?: string;
  reminderSet?: boolean;
  reminderDate?: string;
}

export interface OwnerFormData {
  contactId?: string;        // if selecting existing contact
  isNew?: boolean;           // true = creating new, false = linking existing
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
  ownershipPct?: number;
  roleInBusiness?: string;
  linkedInUrl?: string;
  preferredContact?: string;
  birthday?: string;
  spouseName?: string;
  personalInterests?: string[];
}

export interface BrokerFormData {
  contactId?: string;
  isNew?: boolean;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  website?: string;
  dateMet?: string;
  firm?: string;
}

export interface AdvisorFormData {
  contactId?: string;
  isNew?: boolean;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  type: string;              // ADVISOR_TYPES value
  firm?: string;
  relationshipStrength?: string;
  advisorOpenToUs?: string;
  date?: string;
  notes?: string;
}

export interface ContactFormData {
  contactType: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  firm?: string;
  companyId?: string;
  isPrimary?: boolean;
  // ... other fields based on contactType
}

export interface InteractionFormData {
  type: string;
  summary: string;
  sentiment?: string;
  contactId?: string;
  companyId?: string;
  withWhomName?: string;
  date: string;
  nextAction?: string;
  nextActionDate?: string;
}
```

### 3.3 Filter & Stats Types

```typescript
export interface CompanyFilters {
  searchQuery?: string;
  stage?: DealStage | "all";
  stages?: DealStage[];
  ndaStatus?: NdaStatus | "all";
  ndaStatuses?: NdaStatus[];
  nurtureStage?: NurtureStage | "all";
  transitionTimeline?: string | "all";
  trustLevel?: string | "all";
  closeConfidence?: string | "all";
  industry?: string | "all";
  industries?: string[];
  dueFilter?: string;
  daysSinceContact?: number;      // "show me contacts not touched in X days"
  tags?: string[];
  hasBroker?: boolean;
}

export interface PipelineStats {
  total: number;
  active: number;          // all non-terminal stages
  closed: number;
  recycled: number;
  byStage: Record<string, number>;
  byNurtureStage: Record<string, number>;
  byTransitionTimeline: Record<string, number>;
  neglected: number;       // lastContactDate > 60 days ago
  upcomingActions: number; // nextActionDate within 7 days
  winRate?: number;
}
```

### 3.4 Stage Styles (new, replaces old STAGE_STYLES)

```typescript
export const STAGE_STYLES: Record<DealStage, StageStyle> = {
  "Identified":    { color: "#94a3b8", bg: "#1e293b", borderColor: "#94a3b840" },
  "Connected":     { color: "#4d9eff", bg: "#1a3a6a", borderColor: "#4d9eff40" },
  "Nurturing":     { color: "#a78bfa", bg: "#2d1f5e", borderColor: "#a78bfa40" },
  "Exploring":     { color: "#f5a623", bg: "#4a2e0a", borderColor: "#f5a62340" },
  "Engaged":       { color: "#2dd882", bg: "#0d3a22", borderColor: "#2dd88240" },
  "Committed":     { color: "#00d4aa", bg: "#003d30", borderColor: "#00d4aa40" },
  "In Process":    { color: "#a3e635", bg: "#2a3a00", borderColor: "#a3e63540" },
  "Closed":        { color: "#e2e8f0", bg: "#2d3748", borderColor: "#e2e8f040" },
  "Not a Fit":     { color: "#6b7280", bg: "#1f2937", borderColor: "#6b728040" },
  "Lost":          { color: "#ff5f5f", bg: "#3a1010", borderColor: "#ff5f5f40" },
  "Recycled":      { color: "#fbbf24", bg: "#422006", borderColor: "#fbbf2440" },
};
```

---

## 4. Migration Script

### 4.1 Stage Migration

```typescript
const STAGE_MAP: Record<string, string> = {
  "First contact": "Identified",
  "Intro call": "Connected",
  "NDA sent": "Engaged",
  "Feasibility": "Engaged",
  "Term sheet": "Committed",
  "LOI signed": "In Process",
  "Closed": "Closed",
  "On hold": "Recycled",
  "Dead": "Lost",
};
```

### 4.2 crmContacts Migration

For each existing `crmContacts` record:
1. If `role === "Owner"` or `isPrimary === true` → `contactType = "owner"`
2. If the contact is linked via `brokerContactId` on any company → `contactType = "broker"`
3. Otherwise → `contactType = "other"` (admin reviews later)

### 4.3 crmActivities → crmInteractions Migration

For each existing `crmActivities` record:
1. Create a new `crmInteractions` record
2. Map `type`: `note`→`Other`, `call`→`Call`, `email`→`Email`, `meeting`→`Meeting`, `stage_change`→`Other`, `task`→`Other`
3. Combine `title` + `description` → `summary`
4. Copy `companyId`, `date`, `performedBy`

### 4.4 Company Field Migration

For each existing `crmCompanies` record:
1. `stage` → map via STAGE_MAP
2. `size` → `employeeCountRange` (if matches a bucket, else "Unknown")
3. `revenue` → `revenueRange` (parse "$22M" → "$10M+", etc.)
4. `ebitda` → `ebitdaRange` (same parsing)
5. `owner` → if exists, create a `crmContacts` record with `contactType: "owner"`, set `primaryOwnerContactId`
6. `advisor` → keep as string in `notes` (admin reviews later)
7. `referralSource` → keep as string in `notes`
8. `sellerContactId` → rename to `primaryOwnerContactId`

---

## 5. Files to Create/Modify

### New files:
1. `packages/shared/src/features/crm/constants.ts` — all enum/constant definitions
2. `packages/shared/src/features/crm/types.ts` — complete rewrite (section 3)
3. `packages/shared/src/features/crm/migration-map.ts` — stage mapping, contact type inference
4. `packages/convex/convex/crmInteractions.ts` — new table CRUD (queries + mutations)
5. `packages/convex/convex/crmDocuments.ts` — new table CRUD
6. `packages/convex/convex/migrations/crmRefocus.ts` — migration script

### Modified files:
7. `packages/convex/convex/schema.ts` — new tables, modified crmCompanies + crmContacts
8. `packages/shared/src/features/crm/index.ts` — export new constants and types
9. `apps/admin/app/admin/crm/hooks/useCrmCompanies.ts` — update for new CompanyFormData
10. `apps/admin/app/admin/crm/components/CompanyModal.tsx` — temporary: update field names to match new schema (minimal — full form rebuild is Phase 2)
11. `packages/shared/src/lib/phaseChartConfig.ts` — update if stage names affect chart config

### Files to NOT touch in Phase 1:
- Deal Tracker components (unchanged)
- Phase Radial Chart (unless stage names break it)
- Letter components (unchanged)
- Business Log (unchanged)
- Journal system (unchanged)

---

## 6. Validation Checklist

- [ ] Schema pushes via `npx convex dev` without errors
- [ ] All constants exported from `packages/shared`
- [ ] All types exported from `packages/shared`
- [ ] `CompanyFormData` round-trips: form → mutation → query → form
- [ ] Existing CRM table/kanban/calendar views still render (with old stage names mapped to new)
- [ ] Deal Tracker still links to companies (companyId FK unchanged)
- [ ] Business Log still links to companies (companyId FK unchanged)
- [ ] Migration script tested on dev data
- [ ] No breaking changes to `packages/convex/convex/crmCompanies.ts` queries/mutations (additive only — old fields still accepted until Phase 2)
- [ ] `pnpm build` passes across all workspaces
