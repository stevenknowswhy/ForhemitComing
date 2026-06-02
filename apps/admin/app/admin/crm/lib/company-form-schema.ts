import { z } from "zod";

// ── Owner Row Schema ─────────────────────────────────────────────────────────

export const ownerSchema = z.object({
	contactId: z.string().optional(),
	isNew: z.boolean().optional(),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	phone: z.string().optional(),
	email: z.string().email("Invalid email").optional().or(z.literal("")),
	address: z.string().optional(),
	ownershipPct: z.coerce.number().min(0).max(100).optional(),
	roleInBusiness: z.string().optional(),
	linkedInUrl: z.string().optional(),
	preferredContact: z.string().optional(),
	birthday: z.string().optional(),
	spouseName: z.string().optional(),
	personalInterests: z.array(z.string()).optional(),
});

// ── Broker Row Schema ────────────────────────────────────────────────────────

export const brokerSchema = z.object({
	contactId: z.string().optional(),
	isNew: z.boolean().optional(),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	phone: z.string().optional(),
	email: z.string().email("Invalid email").optional().or(z.literal("")),
	website: z.string().optional(),
	dateMet: z.string().optional(),
	firm: z.string().optional(),
});

// ── Advisor Row Schema ───────────────────────────────────────────────────────

export const advisorSchema = z.object({
	contactId: z.string().optional(),
	isNew: z.boolean().optional(),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	phone: z.string().optional(),
	email: z.string().email("Invalid email").optional().or(z.literal("")),
	type: z.string().min(1, "Advisor type is required"),
	firm: z.string().optional(),
	relationshipStrength: z.string().optional(),
	advisorOpenToUs: z.string().optional(),
	date: z.string().optional(),
	notes: z.string().optional(),
});

// ── Full Company Form Schema ─────────────────────────────────────────────────

export const companyFormSchema = z.object({
	// Step 1: Business Basics
	name: z.string().min(1, "Company name is required"),
	industry: z.string().optional(),
	subIndustry: z.string().optional(),
	businessModel: z.string().optional(),
	yearsInBusiness: z.coerce.number().optional(),
	revenueRange: z.string().optional(),
	employeeCountRange: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	website: z.string().optional(),
	address: z.string().optional(),
	phone: z.string().optional(),
	howWeHeardAboutThem: z.string().optional(),
	referredByContactId: z.string().optional(),
	dateFirstContact: z.string().optional(),

	// Step 2: Owner Info
	owners: z.array(ownerSchema).min(1, "At least one owner is required"),

	// Step 3: Transition Readiness
	transitionTimeline: z.string().optional(),
	targetTransitionDate: z.string().optional(),
	retirementGoalAge: z.coerce.number().optional(),
	ownerAge: z.coerce.number().optional(),
	primaryMotivation: z.string().optional(),
	motivationDetail: z.string().optional(),
	urgencyLevel: z.string().optional(),
	hasSuccessorInMind: z.string().optional(),
	familyInBusiness: z.boolean().optional(),
	familyMemberNames: z.string().optional(),
	ownerWorkedWithAdvisor: z.boolean().optional(),
	businessValuedBefore: z.boolean().optional(),
	lastValuationDate: z.string().optional(),
	lastValuationAmount: z.string().optional(),
	identityTiedToBusiness: z.string().optional(),
	openToConversation: z.string().optional(),
	trustLevel: z.string().optional(),
	whatTheyCareMostAbout: z.string().optional(),
	dealBreakers: z.string().optional(),
	readinessScore: z.coerce.number().min(1).max(10).optional(),
	nextNurtureAction: z.string().optional(),
	nurtureStage: z.string().optional(),

	// Step 4: Business Snapshot
	ebitdaRange: z.string().optional(),
	askingPriceExpectation: z.string().optional(),
	ourValuationEstimate: z.string().optional(),
	profitability: z.string().optional(),
	revenueGrowthTrend: z.string().optional(),
	primaryAssets: z.array(z.string()).optional(),
	realEstateOwned: z.boolean().optional(),
	debtOnBusiness: z.string().optional(),
	ownerCompensation: z.string().optional(),
	businessDependentOnOwner: z.string().optional(),
	financialNotes: z.string().optional(),

	// Step 5: Broker & Advisors
	hasBroker: z.boolean().optional(),
	broker: brokerSchema.optional(),
	advisors: z.array(advisorSchema).optional(),

	// Step 6: Pipeline & Nurture
	stage: z.string().min(1, "Stage is required"),
	ndaStatus: z.string().optional(),
	estimatedCloseDate: z.string().optional(),
	probabilityPct: z.coerce.number().min(0).max(100).optional(),
	closeConfidence: z.string().optional(),
	whyWeWinThis: z.string().optional(),
	whyWeMightLose: z.string().optional(),
	recycleDate: z.string().optional(),
	recycleReason: z.string().optional(),
	contactFrequencyGoal: z.string().optional(),
	resourcesSentTo: z.array(z.string()).optional(),
	eventsAttendedTogether: z.string().optional(),
	referralsMadeForThem: z.string().optional(),

	// Step 7: Notes & Next Steps
	notes: z.string().optional(),
	internalNotes: z.string().optional(),
	tags: z.array(z.string()).optional(),
	nextAction: z.string().optional(),
	nextActionDate: z.string().optional(),
	reminderSet: z.boolean().optional(),
	reminderDate: z.string().optional(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

// ── Default Values ───────────────────────────────────────────────────────────

export const defaultCompanyFormValues: CompanyFormValues = {
	name: "",
	industry: "",
	owners: [{ firstName: "", lastName: "", isNew: true }],
	stage: "Identified",
	ndaStatus: "None",
	hasBroker: false,
	advisors: [],
	tags: [],
	primaryAssets: [],
	resourcesSentTo: [],
};
