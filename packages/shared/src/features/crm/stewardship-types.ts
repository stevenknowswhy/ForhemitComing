// ── CRM Stewardship Types ────────────────────────────────────────────────────
//
// New types for the relationship/nurture-focused stewardship CRM.
// These work alongside the legacy types.ts during the migration period.
// Old types.ts stays for backward compatibility with existing views.
//
// ──────────────────────────────────────────────────────────────────────────────

// ── Entity Types ─────────────────────────────────────────────────────────────
// These map 1:1 to the Convex schema tables.

/**
 * Business / Deal record — the core entity.
 * Tracks a business through the stewardship pipeline from identification to close.
 */
export interface CompanyV2 {
	_id: string;
	id?: string;
	_creationTime?: number;

	// ── Step 1: Business Basics ───────────────────────────────
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
	assignedTo?: string;

	// ── Step 3: Transition Readiness ──────────────────────────
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

	// ── Step 4: Business Snapshot (Light Financials) ──────────
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

	// ── Step 5: Broker ────────────────────────────────────────
	hasBroker?: boolean;
	brokerContactId?: string;
	brokerFirm?: string;
	brokerCommission?: string;
	brokerEngagementSigned?: boolean;
	brokerEngagementDate?: string;
	brokerNotes?: string;

	// ── Step 6: Pipeline Status ───────────────────────────────
	stage: string;
	ndaStatus: string;
	stageEnteredAt?: number;
	estimatedCloseDate?: string;
	probabilityPct?: number;
	closeConfidence?: string;
	whyWeWinThis?: string;
	whyWeMightLose?: string;
	recycleDate?: string;
	recycleReason?: string;

	// ── Step 6: Nurture Tracking ──────────────────────────────
	lastContactType?: string;
	lastContactSummary?: string;
	contactFrequencyGoal?: string;
	resourcesSentTo?: string[];
	eventsAttendedTogether?: string;
	referralsMadeForThem?: string;
	birthdayCardSent?: boolean;
	holidayCardSent?: boolean;
	valueAddedActions?: string;

	// ── Step 7: Notes & Next Steps ────────────────────────────
	notes?: string;
	internalNotes?: string;
	tags?: string[];
	nextAction?: string;
	nextActionDate?: string;
	nextActionOwner?: string;
	reminderSet?: boolean;
	reminderDate?: string;

	// ── Contact FKs ───────────────────────────────────────────
	primaryOwnerContactId?: string;
	lenderContactId?: string;
	trusteeContactId?: string;
	counselContactId?: string;

	// ── Existing fields (kept for Deal Tracker + workflow engine) ──
	ref?: string;
	fees?: CompanyFees;
	gates?: CompanyGates;
	ndaStatusLegacy?: string; // mapped from old ndaStatus during migration

	// ── Box.com integration ───────────────────────────────────
	boxFolderId?: string;
	boxSignRequestId?: string;
	boxSignStatus?: string;
	sentAt?: number;

	// ── Legacy compat (remove after Phase 2) ──────────────────
	nextStep?: string; // maps to nextAction
	nextStepDate?: string; // maps to nextActionDate
	advisor?: string; // old string field — replaced by contact FKs
	referralSource?: string; // old string field — replaced by referredByContactId

	// ── Metadata ──────────────────────────────────────────────
	createdAt?: number;
	updatedAt?: number;
	createdBy?: string;
	priorityScore?: number;
}

/** Fee structure — unchanged from original, used by Deal Tracker */
export interface CompanyFees {
	tier: string;
	ebitda?: number;
	totalFee?: number;
	stewardshipAnnual?: number;
	stewardshipTranchesPaid?: number;
	stewardshipTotalTranches?: number;
	retainer?: FeeMilestone;
	validation?: FeeMilestone;
	commitment?: FeeMilestone;
	success?: FeeMilestone;
	[milestone: string]: unknown;
}

export interface FeeMilestone {
	status: string;
	amount: number;
	invoicedAt?: number;
	paidAt?: number;
}

/** Gate status — unchanged from original, used by Deal Tracker */
export interface CompanyGates {
	gate1?: { passed: boolean; passedAt?: number };
	gate2?: { passed: boolean; passedAt?: number };
	gate3?: { passed: boolean; passedAt?: number };
	gate4?: { passed: boolean; passedAt?: number };
}

/**
 * Contact record — any individual person.
 * Owners, advisors, brokers, referral partners all live here.
 */
export interface ContactV2 {
	_id: string;
	id?: string;
	_creationTime?: number;

	// ── Identity ──────────────────────────────────────────────
	contactType: string;
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
	title?: string;
	firm?: string;

	// ── Company link ──────────────────────────────────────────
	companyId?: string;
	isPrimary?: boolean;
	roleInBusiness?: string;

	// ── Owner-specific ────────────────────────────────────────
	ownershipPct?: number;
	linkedInUrl?: string;
	preferredContact?: string;
	birthday?: string;
	spouseName?: string;
	personalInterests?: string[];
	almaMater?: string;
	hometown?: string;

	// ── Advisor-specific ──────────────────────────────────────
	advisorType?: string;
	advisorOpenToUs?: string;
	relationshipStrength?: string;

	// ── Broker-specific ───────────────────────────────────────
	brokerMarket?: string;
	website?: string;
	dateMet?: string;

	// ── Referral partner-specific ─────────────────────────────
	relationshipStage?: string;
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

	// ── Nurture (shared across types) ─────────────────────────
	lastContactDate?: string;
	contactFrequencyGoal?: string;
	nextTouchDate?: string;
	birthdayCardSent?: boolean;
	holidayCardSent?: boolean;
	nurtureNotes?: string;
	notes?: string;
	tags?: string[];

	// ── Metadata ──────────────────────────────────────────────
	createdAt?: number;
	updatedAt?: number;
}

/**
 * Interaction — entity-agnostic activity log.
 * The institutional memory of every touchpoint.
 */
export interface InteractionV2 {
	_id: string;
	id?: string;
	_creationTime?: number;

	// ── What happened ─────────────────────────────────────────
	type: string;
	summary: string;
	sentiment?: string;

	// ── Who ───────────────────────────────────────────────────
	contactId?: string;
	companyId?: string;
	withWhomName?: string;
	performedBy?: string;

	// ── Follow-up ─────────────────────────────────────────────
	nextAction?: string;
	nextActionDate?: string;
	nextActionCompleted?: boolean;

	// ── Metadata ──────────────────────────────────────────────
	date: string;
	createdAt?: number;
}

/**
 * CRM Document — lightweight metadata for files associated with deals/contacts.
 */
export interface CrmDocumentV2 {
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

// ── Form Data Types ──────────────────────────────────────────────────────────
// Used by the multi-step form. Maps to mutations.

/**
 * Company form data — the 7-step create/edit form payload.
 * The form collects everything, the mutation creates/updates the company
 * and creates/links contact records in one transaction.
 */
export interface CompanyFormDataV2 {
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

	// Step 2: Owner Info
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

	// Step 5: Advisors
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

/** Owner row in the multi-step form. Primary owner is owners[0]. */
export interface OwnerFormData {
	contactId?: string; // existing contact ID (if linking)
	isNew?: boolean; // true = creating new contact
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

/** Broker row in the multi-step form. */
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

/** Advisor row in the multi-step form. Dynamic array. */
export interface AdvisorFormData {
	contactId?: string;
	isNew?: boolean;
	firstName: string;
	lastName: string;
	phone?: string;
	email?: string;
	type: string; // ADVISOR_TYPES value
	firm?: string;
	relationshipStrength?: string;
	advisorOpenToUs?: string;
	date?: string;
	notes?: string;
}

/** Contact create/edit form data. */
export interface ContactFormDataV2 {
	contactType: string;
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
	advisorType?: string;
	brokerMarket?: string;
	website?: string;
	dateMet?: string;
	relationshipStage?: string;
	relationshipOwner?: string;
	howWeMet?: string;
	typicalClientProfile?: string;
	averageClientAge?: string;
	geographyServed?: string;
	openToCoReferrals?: boolean;
	willingToCoPresent?: boolean;
	contactFrequencyGoal?: string;
	nextTouchDate?: string;
	nurtureNotes?: string;
	notes?: string;
	tags?: string[];
}

/** Interaction create form data. */
export interface InteractionFormDataV2 {
	type: string;
	summary: string;
	sentiment?: string;
	contactId?: string;
	companyId?: string;
	withWhomName?: string;
	performedBy?: string;
	date: string;
	nextAction?: string;
	nextActionDate?: string;
}

/** Document create form data. */
export interface DocumentFormDataV2 {
	companyId?: string;
	contactId?: string;
	name: string;
	type: string;
	url?: string;
	storageId?: string;
	notes?: string;
}

// ── Filter & Stats Types ─────────────────────────────────────────────────────

/** Filters for the company/deal list view. */
export interface CompanyFiltersV2 {
	searchQuery?: string;
	stage?: string | "all";
	stages?: string[];
	ndaStatus?: string | "all";
	ndaStatuses?: string[];
	nurtureStage?: string | "all";
	transitionTimeline?: string | "all";
	trustLevel?: string | "all";
	closeConfidence?: string | "all";
	industry?: string | "all";
	industries?: string[];
	tags?: string[];
	hasBroker?: boolean;
	daysSinceContact?: number; // "not touched in X days"
	dueFilter?: string;
}

/** Pipeline statistics for dashboard. */
export interface PipelineStatsV2 {
	total: number;
	active: number; // non-terminal stages
	closed: number;
	recycled: number;
	byStage: Record<string, number>;
	byNurtureStage: Record<string, number>;
	byTransitionTimeline: Record<string, number>;
	neglected: number; // lastContactDate > 60 days ago
	upcomingActions: number; // nextActionDate within 7 days
	winRate?: number;
}

/** Filter for the contact list view. */
export interface ContactFiltersV2 {
	searchQuery?: string;
	contactType?: string | "all";
	companyId?: string;
	relationshipStage?: string | "all";
	daysSinceContact?: number;
	tags?: string[];
}

/** Filter for the interaction log view. */
export interface InteractionFiltersV2 {
	companyId?: string;
	contactId?: string;
	type?: string | "all";
	sentiment?: string | "all";
	dateFrom?: string;
	dateTo?: string;
}

// ── Sort Types ───────────────────────────────────────────────────────────────

export type SortDirectionV2 = "asc" | "desc";

export type CompanySortField =
	| "name"
	| "stage"
	| "nurtureStage"
	| "lastContact"
	| "nextAction"
	| "readinessScore"
	| "createdAt"
	| "transitionTimeline";

export interface SortConfigV2 {
	field: CompanySortField;
	direction: SortDirectionV2;
}

// ── View Types ───────────────────────────────────────────────────────────────

export const CRM_VIEWS_V2 = [
	"table",
	"kanban",
	"calendar",
	"analytics",
] as const;
export type CrmViewV2 = (typeof CRM_VIEWS_V2)[number];

// ── Legacy Compat ────────────────────────────────────────────────────────────
// Re-export old types with V1 suffix for explicit migration references.

export type {
	Company as CompanyV1,
	Contact as ContactV1,
	Activity as ActivityV1,
	Task as TaskV1,
	CompanyFormData as CompanyFormDataV1,
	ContactFormData as ContactFormDataV1,
	CompanyFilters as CompanyFiltersV1,
	PipelineStats as PipelineStatsV1,
} from "./types";
