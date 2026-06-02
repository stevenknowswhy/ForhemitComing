// ── CRM Stewardship Constants ────────────────────────────────────────────────
//
// New constants for the relationship/nurture-focused stewardship CRM.
// These replace the PE deal-tracking constants for new records.
// Old constants.ts stays for backward compatibility during migration.
//
// ──────────────────────────────────────────────────────────────────────────────

// ── Deal Stages ──────────────────────────────────────────────────────────────
// Replaces PIPELINE_STAGES. 11 stages covering the full owner journey.

export const DEAL_STAGES = [
	"Identified",
	"Connected",
	"Nurturing",
	"Exploring",
	"Engaged",
	"Committed",
	"In Process",
	"Closed",
	"Not a Fit",
	"Lost",
	"Recycled",
] as const;

export type DealStage = (typeof DEAL_STAGES)[number];

/** Stages where no further action is expected */
export const TERMINAL_STAGES = ["Closed", "Not a Fit", "Lost"] as const;
export type TerminalStage = (typeof TERMINAL_STAGES)[number];

/** Stages that appear in the active pipeline view */
export const ACTIVE_STAGES = [
	"Identified",
	"Connected",
	"Nurturing",
	"Exploring",
	"Engaged",
	"Committed",
	"In Process",
] as const;
export type ActiveStage = (typeof ACTIVE_STAGES)[number];

// ── NDA Status ───────────────────────────────────────────────────────────────
// Unchanged from original — still relevant for Engaged+ deals.

export const NDA_STATUS = ["None", "Pending", "Signed"] as const;
export type NdaStatus = (typeof NDA_STATUS)[number];

// ── Contact Types ────────────────────────────────────────────────────────────
// Discriminator on crmContacts — determines which fields are relevant.

export const CONTACT_TYPES = [
	"owner",
	"advisor",
	"broker",
	"referral_partner",
	"other",
] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];

// ── Advisor Types ────────────────────────────────────────────────────────────
// Subtype for contacts with contactType "advisor" or "referral_partner".

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

// ── Financial Range Buckets ──────────────────────────────────────────────────
// Shared enum for revenue and EBITDA range dropdowns.

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

// ── Employee Count Ranges ────────────────────────────────────────────────────

export const EMPLOYEE_RANGES = [
	"1–5",
	"6–20",
	"21–50",
	"51–100",
	"100+",
	"Unknown",
] as const;
export type EmployeeRange = (typeof EMPLOYEE_RANGES)[number];

// ── Transition Timeline ──────────────────────────────────────────────────────
// When the owner is thinking about transitioning.

export const TRANSITION_TIMELINES = [
	"Now (0–12 months)",
	"Soon (1–2 years)",
	"Planning (2–5 years)",
	"Someday",
	"Not Sure",
] as const;
export type TransitionTimeline = (typeof TRANSITION_TIMELINES)[number];

// ── Primary Motivation ───────────────────────────────────────────────────────
// Why the owner is considering a transition.

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

// ── Nurture Stage ────────────────────────────────────────────────────────────
// Where the owner is in their emotional/decision journey.
// Distinct from deal stage — nurture tracks readiness, stage tracks process.

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

// ── Relationship Stages ──────────────────────────────────────────────────────
// For advisor/referral partner contacts — tracks YOUR relationship with them.

export const RELATIONSHIP_STAGES = [
	"New Contact",
	"Getting to Know",
	"Mutual Trust",
	"Active Partner",
	"Dormant",
	"Dead",
] as const;
export type RelationshipStage = (typeof RELATIONSHIP_STAGES)[number];

// ── Interaction Types ────────────────────────────────────────────────────────
// What kind of touchpoint was this?

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

// ── Sentiment ────────────────────────────────────────────────────────────────
// How did the interaction go?

export const SENTIMENT_VALUES = [
	"Positive",
	"Neutral",
	"Negative",
	"Breakthrough",
] as const;
export type SentimentValue = (typeof SENTIMENT_VALUES)[number];

// ── Contact Frequency Goals ──────────────────────────────────────────────────
// How often should we be reaching out?

export const CONTACT_FREQUENCIES = [
	"Weekly",
	"Biweekly",
	"Monthly",
	"Quarterly",
	"Annually",
	"As Needed",
] as const;
export type ContactFrequency = (typeof CONTACT_FREQUENCIES)[number];

// ── Urgency Levels ───────────────────────────────────────────────────────────

export const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"] as const;
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

// ── Trust Levels ─────────────────────────────────────────────────────────────
// Internal honest assessment of where you really stand with this person.

export const TRUST_LEVELS = [
	"Cold",
	"Warming",
	"Established",
	"Deep Trust",
] as const;
export type TrustLevel = (typeof TRUST_LEVELS)[number];

// ── Business Models ──────────────────────────────────────────────────────────

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

// ── Industry Categories ──────────────────────────────────────────────────────

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

// ── Close Confidence ─────────────────────────────────────────────────────────

export const CLOSE_CONFIDENCE_VALUES = ["Hot", "Warm", "Cool", "Cold"] as const;
export type CloseConfidence = (typeof CLOSE_CONFIDENCE_VALUES)[number];

// ── Profitability ────────────────────────────────────────────────────────────

export const PROFITABILITY_LEVELS = [
	"Very Profitable",
	"Profitable",
	"Breaking Even",
	"Struggling",
] as const;
export type Profitability = (typeof PROFITABILITY_LEVELS)[number];

// ── Revenue Growth Trend ─────────────────────────────────────────────────────

export const GROWTH_TRENDS = ["Growing", "Stable", "Declining"] as const;
export type GrowthTrend = (typeof GROWTH_TRENDS)[number];

// ── Owner Dependency ─────────────────────────────────────────────────────────

export const OWNER_DEPENDENCY_LEVELS = [
	"Highly",
	"Somewhat",
	"Not Much",
] as const;
export type OwnerDependency = (typeof OWNER_DEPENDENCY_LEVELS)[number];

// ── Identity Tied to Business ────────────────────────────────────────────────

export const IDENTITY_ATTACHMENT_LEVELS = ["High", "Medium", "Low"] as const;
export type IdentityAttachment = (typeof IDENTITY_ATTACHMENT_LEVELS)[number];

// ── Openness to Conversation ─────────────────────────────────────────────────

export const OPENNESS_LEVELS = ["Very Open", "Somewhat", "Guarded"] as const;
export type OpennessLevel = (typeof OPENNESS_LEVELS)[number];

// ── Successor Status ─────────────────────────────────────────────────────────

export const SUCCESSOR_OPTIONS = [
	"Yes – Family",
	"Yes – Employee",
	"Yes – Outside",
	"No",
	"Unsure",
] as const;
export type SuccessorOption = (typeof SUCCESSOR_OPTIONS)[number];

// ── Advisor Openness ─────────────────────────────────────────────────────────

export const ADVISOR_OPENNESS = [
	"Supportive",
	"Neutral",
	"Resistant",
	"Unknown",
] as const;
export type AdvisorOpenness = (typeof ADVISOR_OPENNESS)[number];

// ── Relationship Strength ────────────────────────────────────────────────────

export const RELATIONSHIP_STRENGTHS = [
	"Strong",
	"Moderate",
	"Weak",
	"Unknown",
] as const;
export type RelationshipStrength = (typeof RELATIONSHIP_STRENGTHS)[number];

// ── Preferred Contact Method ─────────────────────────────────────────────────

export const PREFERRED_CONTACT_METHODS = ["Call", "Text", "Email"] as const;
export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHODS)[number];

// ── How We Heard ─────────────────────────────────────────────────────────────

export const HOW_WE_HEARD_OPTIONS = [
	"Referral",
	"Conference",
	"Cold Outreach",
	"Inbound",
	"LinkedIn",
	"Event",
	"Other",
] as const;
export type HowWeHeard = (typeof HOW_WE_HEARD_OPTIONS)[number];

// ── Asset Types ──────────────────────────────────────────────────────────────
// Checkboxes for primary business assets.

export const ASSET_TYPES = [
	"Real Estate",
	"Equipment",
	"Inventory",
	"Customer List",
	"Contracts",
	"IP",
	"Brand",
] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

// ── Next Nurture Actions ─────────────────────────────────────────────────────

export const NEXT_NURTURE_ACTIONS = [
	"Coffee Meeting",
	"Send Resource",
	"Invite to Event",
	"Intro to Advisor",
	"Valuation Conversation",
	"Follow-up Call",
	"Send Card",
	"Check In",
] as const;
export type NextNurtureAction = (typeof NEXT_NURTURE_ACTIONS)[number];

// ── Document Types ───────────────────────────────────────────────────────────

export const CRM_DOCUMENT_TYPES = [
	"NDA",
	"Valuation",
	"Letter of Intent",
	"Resource Sent",
	"Meeting Notes",
	"Engagement Letter",
	"Other",
] as const;
export type CrmDocumentType = (typeof CRM_DOCUMENT_TYPES)[number];

// ── Stage Migration Map ──────────────────────────────────────────────────────
// Maps old PE pipeline stages to new stewardship stages.
// Used during data migration.

export const STAGE_MIGRATION_MAP: Record<string, DealStage> = {
	"First contact": "Identified",
	"Intro call": "Connected",
	"NDA sent": "Engaged",
	Feasibility: "Engaged",
	"Term sheet": "Committed",
	"LOI signed": "In Process",
	Closed: "Closed",
	"On hold": "Recycled",
	Dead: "Lost",
};

// ── Stage Styles ─────────────────────────────────────────────────────────────
// Visual configuration for each stage (colors for badges, charts, kanban columns).

export interface StageStyle {
	color: string;
	bg: string;
	borderColor: string;
	label: string;
}

export const DEAL_STAGE_STYLES: Record<DealStage, StageStyle> = {
	Identified: {
		label: "Identified",
		color: "#94a3b8",
		bg: "#1e293b",
		borderColor: "#94a3b840",
	},
	Connected: {
		label: "Connected",
		color: "#4d9eff",
		bg: "#1a3a6a",
		borderColor: "#4d9eff40",
	},
	Nurturing: {
		label: "Nurturing",
		color: "#a78bfa",
		bg: "#2d1f5e",
		borderColor: "#a78bfa40",
	},
	Exploring: {
		label: "Exploring",
		color: "#f5a623",
		bg: "#4a2e0a",
		borderColor: "#f5a62340",
	},
	Engaged: {
		label: "Engaged",
		color: "#2dd882",
		bg: "#0d3a22",
		borderColor: "#2dd88240",
	},
	Committed: {
		label: "Committed",
		color: "#00d4aa",
		bg: "#003d30",
		borderColor: "#00d4aa40",
	},
	"In Process": {
		label: "In Process",
		color: "#a3e635",
		bg: "#2a3a00",
		borderColor: "#a3e63540",
	},
	Closed: {
		label: "Closed",
		color: "#e2e8f0",
		bg: "#2d3748",
		borderColor: "#e2e8f040",
	},
	"Not a Fit": {
		label: "Not a Fit",
		color: "#6b7280",
		bg: "#1f2937",
		borderColor: "#6b728040",
	},
	Lost: {
		label: "Lost",
		color: "#ff5f5f",
		bg: "#3a1010",
		borderColor: "#ff5f5f40",
	},
	Recycled: {
		label: "Recycled",
		color: "#fbbf24",
		bg: "#422006",
		borderColor: "#fbbf2440",
	},
};

// ── Dropdown Options (for form UI) ──────────────────────────────────────────
// Pre-built arrays for Select components. Import and map directly.

export const DEAL_STAGE_OPTIONS: { value: DealStage; label: string }[] =
	DEAL_STAGES.map((s) => ({ value: s, label: DEAL_STAGE_STYLES[s].label }));

export const NDA_OPTIONS: { value: NdaStatus; label: string }[] =
	NDA_STATUS.map((s) => ({ value: s, label: s }));

export const CONTACT_TYPE_OPTIONS: {
	value: ContactType;
	label: string;
}[] = [
	{ value: "owner", label: "Business Owner" },
	{ value: "advisor", label: "Advisor" },
	{ value: "broker", label: "Broker" },
	{ value: "referral_partner", label: "Referral Partner" },
	{ value: "other", label: "Other" },
];

export const ADVISOR_TYPE_OPTIONS: {
	value: AdvisorType;
	label: string;
}[] = ADVISOR_TYPES.map((s) => ({ value: s, label: s }));

export const FINANCIAL_RANGE_OPTIONS: {
	value: FinancialRange;
	label: string;
}[] = FINANCIAL_RANGES.map((s) => ({ value: s, label: s }));

export const EMPLOYEE_RANGE_OPTIONS: {
	value: EmployeeRange;
	label: string;
}[] = EMPLOYEE_RANGES.map((s) => ({ value: s, label: s }));

export const TRANSITION_TIMELINE_OPTIONS: {
	value: TransitionTimeline;
	label: string;
}[] = TRANSITION_TIMELINES.map((s) => ({ value: s, label: s }));

export const PRIMARY_MOTIVATION_OPTIONS: {
	value: PrimaryMotivation;
	label: string;
}[] = PRIMARY_MOTIVATIONS.map((s) => ({ value: s, label: s }));

export const NURTURE_STAGE_OPTIONS: {
	value: NurtureStage;
	label: string;
}[] = NURTURE_STAGES.map((s) => ({ value: s, label: s }));

export const RELATIONSHIP_STAGE_OPTIONS: {
	value: RelationshipStage;
	label: string;
}[] = RELATIONSHIP_STAGES.map((s) => ({ value: s, label: s }));

export const INTERACTION_TYPE_OPTIONS: {
	value: InteractionType;
	label: string;
}[] = INTERACTION_TYPES.map((s) => ({ value: s, label: s }));

export const SENTIMENT_OPTIONS: {
	value: SentimentValue;
	label: string;
}[] = SENTIMENT_VALUES.map((s) => ({ value: s, label: s }));

export const CONTACT_FREQUENCY_OPTIONS: {
	value: ContactFrequency;
	label: string;
}[] = CONTACT_FREQUENCIES.map((s) => ({ value: s, label: s }));

export const URGENCY_OPTIONS: {
	value: UrgencyLevel;
	label: string;
}[] = URGENCY_LEVELS.map((s) => ({ value: s, label: s }));

export const TRUST_LEVEL_OPTIONS: {
	value: TrustLevel;
	label: string;
}[] = TRUST_LEVELS.map((s) => ({ value: s, label: s }));

export const BUSINESS_MODEL_OPTIONS: {
	value: BusinessModel;
	label: string;
}[] = BUSINESS_MODELS.map((s) => ({ value: s, label: s }));

export const INDUSTRY_OPTIONS: {
	value: IndustryCategory;
	label: string;
}[] = INDUSTRY_CATEGORIES.map((s) => ({ value: s, label: s }));

export const CLOSE_CONFIDENCE_OPTIONS: {
	value: CloseConfidence;
	label: string;
}[] = CLOSE_CONFIDENCE_VALUES.map((s) => ({ value: s, label: s }));

export const PROFITABILITY_OPTIONS: {
	value: Profitability;
	label: string;
}[] = PROFITABILITY_LEVELS.map((s) => ({ value: s, label: s }));

export const GROWTH_TREND_OPTIONS: {
	value: GrowthTrend;
	label: string;
}[] = GROWTH_TRENDS.map((s) => ({ value: s, label: s }));

export const OWNER_DEPENDENCY_OPTIONS: {
	value: OwnerDependency;
	label: string;
}[] = OWNER_DEPENDENCY_LEVELS.map((s) => ({ value: s, label: s }));

export const SUCCESSOR_OPTIONS_LIST: {
	value: SuccessorOption;
	label: string;
}[] = SUCCESSOR_OPTIONS.map((s) => ({ value: s, label: s }));

export const NEXT_NURTURE_ACTION_OPTIONS: {
	value: NextNurtureAction;
	label: string;
}[] = NEXT_NURTURE_ACTIONS.map((s) => ({ value: s, label: s }));

export const HOW_WE_HEARD_OPTIONS_LIST: {
	value: HowWeHeard;
	label: string;
}[] = HOW_WE_HEARD_OPTIONS.map((s) => ({ value: s, label: s }));

export const ASSET_TYPE_OPTIONS: {
	value: AssetType;
	label: string;
}[] = ASSET_TYPES.map((s) => ({ value: s, label: s }));

export const PREFERRED_CONTACT_OPTIONS: {
	value: PreferredContactMethod;
	label: string;
}[] = PREFERRED_CONTACT_METHODS.map((s) => ({ value: s, label: s }));

export const CRM_DOCUMENT_TYPE_OPTIONS: {
	value: CrmDocumentType;
	label: string;
}[] = CRM_DOCUMENT_TYPES.map((s) => ({ value: s, label: s }));

export const IDENTITY_ATTACHMENT_OPTIONS: {
	value: IdentityAttachment;
	label: string;
}[] = IDENTITY_ATTACHMENT_LEVELS.map((s) => ({ value: s, label: s }));

export const OPENNESS_OPTIONS: {
	value: OpennessLevel;
	label: string;
}[] = OPENNESS_LEVELS.map((s) => ({ value: s, label: s }));

export const ADVISOR_OPENNESS_OPTIONS: {
	value: AdvisorOpenness;
	label: string;
}[] = ADVISOR_OPENNESS.map((s) => ({ value: s, label: s }));

export const RELATIONSHIP_STRENGTH_OPTIONS: {
	value: RelationshipStrength;
	label: string;
}[] = RELATIONSHIP_STRENGTHS.map((s) => ({ value: s, label: s }));
