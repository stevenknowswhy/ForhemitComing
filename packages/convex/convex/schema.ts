import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// CRM Pipeline Stages
export const PIPELINE_STAGES = [
	// Legacy stages (kept for migration compat)
	"First contact",
	"Intro call",
	"NDA sent",
	"Feasibility",
	"Term sheet",
	"LOI signed",
	"On hold",
	"Dead",
	// New stewardship stages
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

// NDA Status values
export const NDA_STATUS = ["None", "Pending", "Signed"] as const;

// Activity types for CRM
export const ACTIVITY_TYPES = [
	"note",
	"call",
	"email",
	"meeting",
	"stage_change",
	"task",
] as const;

export default defineSchema({
	// Contact form submissions
	contactSubmissions: defineTable({
		// Contact type: who is reaching out
		contactType: v.union(
			v.literal("business-owner"),
			v.literal("partner"),
			v.literal("existing-business"),
			v.literal("website-visitor"),
			v.literal("marketing"),
		),
		// Personal information
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
		phone: v.optional(v.string()),
		company: v.optional(v.string()),
		// Area of interest
		interest: v.optional(
			v.union(
				v.literal("esop-transition"),
				v.literal("accounting"),
				v.literal("legal"),
				v.literal("lending"),
				v.literal("broker"),
				v.literal("wealth"),
				v.literal("appraisal"),
				v.literal("career"),
				v.literal("general"),
			),
		),
		// Message content
		message: v.string(),
		// Metadata
		source: v.optional(v.string()), // e.g., "homepage", "brokers-page", etc.
		status: v.optional(
			v.union(
				v.literal("new"),
				v.literal("in-progress"),
				v.literal("responded"),
				v.literal("closed"),
			),
		),
		createdAt: v.number(), // timestamp
		updatedAt: v.optional(v.number()), // timestamp when last edited
		ipAddress: v.optional(v.string()),
		userAgent: v.optional(v.string()),
		/** Internal admin-only notes (not shown to submitter) */
		adminNotes: v.optional(
			v.array(
				v.object({
					id: v.string(),
					text: v.string(),
					createdAt: v.number(),
				}),
			),
		),
	})
		.index("by_email", ["email"])
		.index("by_status", ["status"])
		.index("by_contactType", ["contactType"])
		.index("by_createdAt", ["createdAt"]),

	// Early access email signups
	earlyAccessSignups: defineTable({
		email: v.string(),
		source: v.optional(v.string()), // e.g., "hero-section", "footer", etc.
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
		ipAddress: v.optional(v.string()),
		userAgent: v.optional(v.string()),
	})
		.index("by_email", ["email"])
		.index("by_createdAt", ["createdAt"]),

	// Job applications
	jobApplications: defineTable({
		// Personal information
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
		phone: v.string(),
		// Position applied for
		position: v.string(),
		otherPosition: v.optional(v.string()), // if position is "Other"
		// Resume
		resumeUrl: v.optional(v.string()),
		// Application status
		status: v.optional(
			v.union(
				v.literal("new"),
				v.literal("reviewing"),
				v.literal("interview-scheduled"),
				v.literal("rejected"),
				v.literal("hired"),
			),
		),
		// Metadata
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
		ipAddress: v.optional(v.string()),
		userAgent: v.optional(v.string()),
	})
		.index("by_email", ["email"])
		.index("by_status", ["status"])
		.index("by_position", ["position"])
		.index("by_createdAt", ["createdAt"]),

	// Admin tracking for form submissions (optional analytics)
	submissionStats: defineTable({
		date: v.string(), // YYYY-MM-DD format
		contactSubmissions: v.number(),
		earlyAccessSignups: v.number(),
		jobApplications: v.number(),
		lastUpdated: v.number(),
	}).index("by_date", ["date"]),

	// Audit log for tracking all admin changes
	auditLogs: defineTable({
		action: v.union(
			v.literal("create"),
			v.literal("update"),
			v.literal("delete"),
		),
		entityType: v.union(
			v.literal("contactSubmission"),
			v.literal("earlyAccessSignup"),
			v.literal("jobApplication"),
			v.literal("generatedDocument"),
			v.literal("agentJob"),
			v.literal("post"),
			v.literal("user"),
			v.literal("agentOutput"),
			v.literal("dealTracker"),
		),
		entityId: v.string(), // The ID of the affected entity
		changes: v.optional(
			v.array(
				v.object({
					field: v.string(),
					oldValue: v.optional(v.string()),
					newValue: v.optional(v.string()),
				}),
			),
		), // Track what fields changed
		timestamp: v.number(),
		performedBy: v.optional(v.string()), // Could be extended with admin user info
		correlationId: v.optional(v.string()), // Links to businessLog entries
	})
		.index("by_entity", ["entityType", "entityId"])
		.index("by_timestamp", ["timestamp"])
		.index("by_action", ["action"])
		.index("by_correlation", ["correlationId"]),

	// ============================================
	// CRM - Engagement Tracker Tables
	// ============================================

	// Companies/Deals in the pipeline
	crmCompanies: defineTable({
		// Company Information
		name: v.string(),
		industry: v.optional(v.string()),
		size: v.optional(v.string()), // e.g., "150 employees"
		revenue: v.optional(v.string()), // e.g., "$22M"
		ebitda: v.optional(v.string()), // e.g., "$5.2M"
		website: v.optional(v.string()),
		address: v.optional(v.string()),

		// Pipeline Status
		stage: v.union(
			// Legacy
			v.literal("First contact"),
			v.literal("Intro call"),
			v.literal("NDA sent"),
			v.literal("Feasibility"),
			v.literal("Term sheet"),
			v.literal("LOI signed"),
			v.literal("On hold"),
			v.literal("Dead"),
			// Stewardship
			v.literal("Identified"),
			v.literal("Connected"),
			v.literal("Nurturing"),
			v.literal("Exploring"),
			v.literal("Engaged"),
			v.literal("Committed"),
			v.literal("In Process"),
			v.literal("Closed"),
			v.literal("Not a Fit"),
			v.literal("Lost"),
			v.literal("Recycled"),
		),
		ndaStatus: v.union(
			v.literal("None"),
			v.literal("Pending"),
			v.literal("Signed"),
		),

		// Source/Advisor
		advisor: v.optional(v.string()), // e.g., "Morgan Stanley", "Self-sourced"
		referralSource: v.optional(v.string()),

		// Important Dates
		lastContactDate: v.optional(v.string()), // ISO date string YYYY-MM-DD
		nextStep: v.optional(v.string()),
		nextStepDate: v.optional(v.string()), // ISO date string YYYY-MM-DD
		expectedCloseDate: v.optional(v.string()),

		// Deal Engine Gates (4 hard-stop checkpoints)
		gates: v.optional(
			v.object({
				gate1: v.optional(
					v.object({
						passed: v.boolean(),
						passedAt: v.optional(v.number()),
					}),
				),
				gate2: v.optional(
					v.object({
						passed: v.boolean(),
						passedAt: v.optional(v.number()),
					}),
				),
				gate3: v.optional(
					v.object({
						passed: v.boolean(),
						passedAt: v.optional(v.number()),
					}),
				),
				gate4: v.optional(
					v.object({
						passed: v.boolean(),
						passedAt: v.optional(v.number()),
					}),
				),
			}),
		),

		// Deal Engine Fields
		ref: v.optional(v.string()), // Deal reference number
		stageEnteredAt: v.optional(v.number()), // Timestamp when stage was entered
		fees: v.optional(
			v.object({
				tier: v.string(),
				ebitda: v.optional(v.number()),
				totalFee: v.optional(v.number()),
				stewardshipAnnual: v.optional(v.number()),
				stewardshipTranchesPaid: v.optional(v.number()),
				stewardshipTotalTranches: v.optional(v.number()),
				// Fee milestones
				retainer: v.optional(
					v.object({
						status: v.string(),
						amount: v.number(),
						invoicedAt: v.optional(v.number()),
						paidAt: v.optional(v.number()),
					}),
				),
				validation: v.optional(
					v.object({
						status: v.string(),
						amount: v.number(),
						invoicedAt: v.optional(v.number()),
						paidAt: v.optional(v.number()),
					}),
				),
				commitment: v.optional(
					v.object({
						status: v.string(),
						amount: v.number(),
						invoicedAt: v.optional(v.number()),
						paidAt: v.optional(v.number()),
					}),
				),
				success: v.optional(
					v.object({
						status: v.string(),
						amount: v.number(),
						invoicedAt: v.optional(v.number()),
						paidAt: v.optional(v.number()),
					}),
				),
			}),
		),
		sentAt: v.optional(v.number()), // Timestamp when document was sent

		// Contact IDs for different roles
		sellerContactId: v.optional(v.id("crmContacts")),
		brokerContactId: v.optional(v.id("crmContacts")),
		lenderContactId: v.optional(v.id("crmContacts")),
		trusteeContactId: v.optional(v.id("crmContacts")),
		counselContactId: v.optional(v.id("crmContacts")),

		// Notes
		notes: v.optional(v.string()),

		// Box.com integration
		boxFolderId: v.optional(v.string()),
		boxSignRequestId: v.optional(v.string()),
		boxSignStatus: v.optional(v.string()),

		// Metadata
		createdAt: v.number(),
		updatedAt: v.number(),
		createdBy: v.optional(v.string()),

		// ── Stewardship CRM Fields (Phase 1) ──────────────────────
		// Step 1: Business Basics
		subIndustry: v.optional(v.string()),
		businessModel: v.optional(v.string()),
		yearsInBusiness: v.optional(v.number()),
		revenueRange: v.optional(v.string()),
		employeeCountRange: v.optional(v.string()),
		city: v.optional(v.string()),
		state: v.optional(v.string()),
		phone: v.optional(v.string()),
		howWeHeardAboutThem: v.optional(v.string()),
		referredByContactId: v.optional(v.id("crmContacts")),
		dateFirstContact: v.optional(v.string()),
		assignedTo: v.optional(v.string()),

		// Step 3: Transition Readiness
		transitionTimeline: v.optional(v.string()),
		targetTransitionDate: v.optional(v.string()),
		retirementGoalAge: v.optional(v.number()),
		ownerAge: v.optional(v.number()),
		primaryMotivation: v.optional(v.string()),
		motivationDetail: v.optional(v.string()),
		urgencyLevel: v.optional(v.string()),
		hasSuccessorInMind: v.optional(v.string()),
		familyInBusiness: v.optional(v.boolean()),
		familyMemberNames: v.optional(v.string()),
		ownerWorkedWithAdvisor: v.optional(v.boolean()),
		businessValuedBefore: v.optional(v.boolean()),
		lastValuationDate: v.optional(v.string()),
		lastValuationAmount: v.optional(v.string()),
		identityTiedToBusiness: v.optional(v.string()),
		openToConversation: v.optional(v.string()),
		trustLevel: v.optional(v.string()),
		whatTheyCareMostAbout: v.optional(v.string()),
		dealBreakers: v.optional(v.string()),
		readinessScore: v.optional(v.number()),
		nextNurtureAction: v.optional(v.string()),
		nurtureStage: v.optional(v.string()),

		// Step 4: Business Snapshot
		ebitdaRange: v.optional(v.string()),
		askingPriceExpectation: v.optional(v.string()),
		ourValuationEstimate: v.optional(v.string()),
		profitability: v.optional(v.string()),
		revenueGrowthTrend: v.optional(v.string()),
		primaryAssets: v.optional(v.array(v.string())),
		realEstateOwned: v.optional(v.boolean()),
		debtOnBusiness: v.optional(v.string()),
		ownerCompensation: v.optional(v.string()),
		businessDependentOnOwner: v.optional(v.string()),
		financialNotes: v.optional(v.string()),

		// Step 5: Broker
		hasBroker: v.optional(v.boolean()),
		// brokerContactId already exists above
		brokerFirm: v.optional(v.string()),
		brokerCommission: v.optional(v.string()),
		brokerEngagementSigned: v.optional(v.boolean()),
		brokerEngagementDate: v.optional(v.string()),
		brokerNotes: v.optional(v.string()),

		// Step 6: Pipeline (stewardship stages)
		estimatedCloseDate: v.optional(v.string()),
		probabilityPct: v.optional(v.number()),
		closeConfidence: v.optional(v.string()),
		whyWeWinThis: v.optional(v.string()),
		whyWeMightLose: v.optional(v.string()),
		recycleDate: v.optional(v.string()),
		recycleReason: v.optional(v.string()),

		// Step 6: Nurture Tracking
		lastContactType: v.optional(v.string()),
		lastContactSummary: v.optional(v.string()),
		contactFrequencyGoal: v.optional(v.string()),
		resourcesSentTo: v.optional(v.array(v.string())),
		eventsAttendedTogether: v.optional(v.string()),
		referralsMadeForThem: v.optional(v.string()),
		birthdayCardSent: v.optional(v.boolean()),
		holidayCardSent: v.optional(v.boolean()),
		valueAddedActions: v.optional(v.string()),

		// Step 7: Notes & Next Steps
		internalNotes: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		nextAction: v.optional(v.string()),
		nextActionDate: v.optional(v.string()),
		nextActionOwner: v.optional(v.string()),
		reminderSet: v.optional(v.boolean()),
		reminderDate: v.optional(v.string()),

		// Contact FKs
		primaryOwnerContactId: v.optional(v.id("crmContacts")),
	})
		.index("by_stage", ["stage"])
		.index("by_ndaStatus", ["ndaStatus"])
		.index("by_advisor", ["advisor"])
		.index("by_createdAt", ["createdAt"])
		.index("by_nextStepDate", ["nextStepDate"])
		.index("by_name", ["name"])
		.index("by_nurtureStage", ["nurtureStage"])
		.index("by_transitionTimeline", ["transitionTimeline"])
		.index("by_recycleDate", ["recycleDate"])
		.index("by_referredBy", ["referredByContactId"])
		.index("by_nextActionDate", ["nextActionDate"]),

	// Contacts associated with companies
	crmContacts: defineTable({
		companyId: v.optional(v.id("crmCompanies")), // optional — referral partners may not be linked
		firstName: v.string(),
		lastName: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		role: v.optional(v.string()), // e.g., "Owner", "CEO"
		isPrimary: v.optional(v.boolean()), // Primary contact flag
		createdAt: v.number(),
		updatedAt: v.number(),

		// ── Stewardship CRM Fields (Phase 1) ──────────────────────
		contactType: v.optional(v.string()), // owner | advisor | broker | referral_partner | other
		title: v.optional(v.string()),
		firm: v.optional(v.string()),
		roleInBusiness: v.optional(v.string()),

		// Owner-specific
		ownershipPct: v.optional(v.number()),
		linkedInUrl: v.optional(v.string()),
		preferredContact: v.optional(v.string()),
		birthday: v.optional(v.string()),
		spouseName: v.optional(v.string()),
		personalInterests: v.optional(v.array(v.string())),
		almaMater: v.optional(v.string()),
		hometown: v.optional(v.string()),

		// Advisor-specific
		advisorType: v.optional(v.string()),
		advisorOpenToUs: v.optional(v.string()),
		relationshipStrength: v.optional(v.string()),

		// Broker-specific
		brokerMarket: v.optional(v.string()),
		website: v.optional(v.string()),
		dateMet: v.optional(v.string()),

		// Referral partner-specific
		relationshipStage: v.optional(v.string()),
		relationshipOwner: v.optional(v.string()),
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

		// Nurture (shared)
		lastContactDate: v.optional(v.string()),
		contactFrequencyGoal: v.optional(v.string()),
		nextTouchDate: v.optional(v.string()),
		birthdayCardSent: v.optional(v.boolean()),
		holidayCardSent: v.optional(v.boolean()),
		nurtureNotes: v.optional(v.string()),
		notes: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
	})
		.index("by_company", ["companyId"])
		.index("by_email", ["email"])
		.index("by_type", ["contactType"])
		.index("by_type_company", ["contactType", "companyId"])
		.index("by_lastName", ["lastName"]),

	// Activity log for companies (calls, meetings, notes, stage changes)
	crmActivities: defineTable({
		companyId: v.id("crmCompanies"),
		type: v.union(
			v.literal("note"),
			v.literal("call"),
			v.literal("email"),
			v.literal("meeting"),
			v.literal("stage_change"),
			v.literal("task"),
		),
		title: v.string(),
		description: v.optional(v.string()),
		date: v.string(), // ISO date string YYYY-MM-DD
		performedBy: v.optional(v.string()),
		metadata: v.optional(
			v.object({
				oldStage: v.optional(v.string()),
				newStage: v.optional(v.string()),
				duration: v.optional(v.number()), // for calls/meetings
			}),
		),
		createdAt: v.number(),
	})
		.index("by_company", ["companyId"])
		.index("by_date", ["date"])
		.index("by_type", ["type"])
		.index("by_company_date", ["companyId", "date"]),

	// ── Stewardship CRM Tables (Phase 1) ────────────────────────────────────

	// Interaction log — entity-agnostic activity tracking
	crmInteractions: defineTable({
		type: v.string(), // INTERACTION_TYPES value
		summary: v.string(), // THE most important field
		sentiment: v.optional(v.string()), // SENTIMENT_VALUES value
		contactId: v.optional(v.id("crmContacts")),
		companyId: v.optional(v.id("crmCompanies")),
		withWhomName: v.optional(v.string()), // name if contact not in system
		performedBy: v.optional(v.string()), // internal user
		nextAction: v.optional(v.string()),
		nextActionDate: v.optional(v.string()),
		nextActionCompleted: v.optional(v.boolean()),
		date: v.string(), // ISO date YYYY-MM-DD
		createdAt: v.number(),
	})
		.index("by_company", ["companyId"])
		.index("by_contact", ["contactId"])
		.index("by_date", ["date"])
		.index("by_type", ["type"])
		.index("by_company_date", ["companyId", "date"])
		.index("by_contact_date", ["contactId", "date"])
		.index("by_nextActionDate", ["nextActionDate"]),

	// CRM documents — lightweight file metadata
	crmDocuments: defineTable({
		companyId: v.optional(v.id("crmCompanies")),
		contactId: v.optional(v.id("crmContacts")),
		name: v.string(),
		type: v.string(), // NDA / Valuation / Letter / Resource / Meeting Notes / Other
		url: v.optional(v.string()),
		storageId: v.optional(v.string()),
		uploadedBy: v.optional(v.string()),
		notes: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_company", ["companyId"])
		.index("by_contact", ["contactId"])
		.index("by_type", ["type"]),

	// Tasks/Reminders for follow-ups
	crmTasks: defineTable({
		companyId: v.id("crmCompanies"),
		title: v.string(),
		description: v.optional(v.string()),
		dueDate: v.optional(v.string()),
		status: v.union(
			v.literal("pending"),
			v.literal("completed"),
			v.literal("overdue"),
		),
		priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
		assignedTo: v.optional(v.string()),
		completedAt: v.optional(v.number()),
		createdAt: v.number(),
	})
		.index("by_company", ["companyId"])
		.index("by_status", ["status"])
		.index("by_dueDate", ["dueDate"])
		.index("by_assignedTo", ["assignedTo"]),

	// Clerk-synced users (webhook + upsert fallback; see HARMONIZATION_PLAN)
	users: defineTable({
		clerkId: v.string(),
		email: v.string(),
		isAdmin: v.boolean(),
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
	}).index("by_clerk_id", ["clerkId"]),

	// Blog / resources (TipTap JSON in content; validate in mutations)
	posts: defineTable({
		title: v.string(),
		slug: v.string(),
		excerpt: v.optional(v.string()),
		content: v.any(),
		status: v.union(
			v.literal("draft"),
			v.literal("published"),
			v.literal("scheduled"),
		),
		publishedAt: v.optional(v.number()),
		scheduledAt: v.optional(v.number()),
		version: v.number(),
		parentId: v.optional(v.id("posts")),
		authorId: v.optional(v.id("users")),
		authorDisplayName: v.optional(v.string()),
		featuredImage: v.optional(v.string()),
		metaTitle: v.optional(v.string()),
		metaDescription: v.optional(v.string()),
		ogImage: v.optional(v.string()),
		/** Marketing blog: audience filter & cards */
		pathway: v.optional(
			v.union(
				v.literal("founders"),
				v.literal("attorneys"),
				v.literal("lenders"),
				v.literal("cpas"),
				v.literal("employees"),
			),
		),
		category: v.optional(v.string()),
		subtitle: v.optional(v.string()),
		readTimeOverview: v.optional(v.number()),
		readTimeDeepDive: v.optional(v.number()),
		readTimeMethodology: v.optional(v.number()),
		depthLevel: v.optional(
			v.union(
				v.literal("overview"),
				v.literal("detailed"),
				v.literal("comprehensive"),
			),
		),
		resilienceSummary: v.optional(v.array(v.string())),
		relatedPathways: v.optional(
			v.array(
				v.union(
					v.literal("founders"),
					v.literal("attorneys"),
					v.literal("lenders"),
					v.literal("cpas"),
					v.literal("employees"),
				),
			),
		),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_slug", ["slug"])
		.index("by_status_publishedAt", ["status", "publishedAt"])
		.index("by_author", ["authorId"])
		.index("by_updatedAt", ["updatedAt"]),

	// Phone messages from Retell AI webhook
	phoneMessages: defineTable({
		callId: v.string(), // Unique call identifier from Retell
		agentId: v.optional(v.string()), // The agent that handled the call
		callerNumber: v.optional(v.string()),
		transcript: v.optional(v.string()), // Full call transcript
		recordingUrl: v.optional(v.string()), // URL to the call audio
		status: v.optional(
			v.union(
				v.literal("completed"),
				v.literal("failed"),
				v.literal("in-progress"),
				v.literal("missed"),
			),
		),
		duration: v.optional(v.number()), // Duration in seconds
		summary: v.optional(v.string()), // AI generated summary
		metadata: v.optional(v.any()), // Store full webhook payload here
		createdAt: v.number(),
		read: v.optional(v.boolean()), // Whether the admin has reviewed this message
	})
		.index("by_callId", ["callId"])
		.index("by_createdAt", ["createdAt"])
		.index("by_status", ["status"])
		.index("by_read", ["read"]),

	// ============================================
	// AI Agent Layer
	// ============================================

	// Agent output artifacts — every agent-produced draft/model/memo
	agentOutputs: defineTable({
		companyId: v.id("crmCompanies"),
		agentId: v.string(), // e.g. "deal-analyst", "capital-structurer"
		templateId: v.string(), // e.g. "T-04", "T-08"
		gate: v.number(), // 1-4, or 0 for pre-pipeline
		content: v.string(), // markdown, JSON, or structured data
		contentType: v.union(
			v.literal("markdown"),
			v.literal("json"),
			v.literal("structured"),
		),
		status: v.union(
			v.literal("pending_review"),
			v.literal("approved"),
			v.literal("rejected"),
			v.literal("superseded"),
			v.literal("simulation"),
		),
		provider: v.string(), // "openrouter", "opengateway", etc.
		model: v.string(), // model ID used
		usage: v.object({
			promptTokens: v.number(),
			completionTokens: v.number(),
			totalTokens: v.number(),
		}),
		costUsd: v.number(),
		source: v.union(v.literal("claude"), v.literal("kimi")),
		supersedes: v.optional(v.string()), // prior output _id
		reviewNotes: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_company", ["companyId", "gate"])
		.index("by_agent", ["agentId", "companyId"])
		.index("by_status", ["status", "companyId"])
		.index("by_template", ["templateId", "companyId"]),

	// Agent job queue — pending/in-progress agent work
	agentQueue: defineTable({
		companyId: v.id("crmCompanies"),
		agentId: v.string(),
		templateId: v.string(),
		gate: v.number(),
		status: v.union(
			v.literal("pending"),
			v.literal("in_progress"),
			v.literal("completed"),
			v.literal("failed"),
			v.literal("simulation"),
		),
		priority: v.number(), // lower = higher priority
		isSimulation: v.boolean(),
		context: v.optional(v.string()), // deal data snapshot
		error: v.optional(v.string()),
		createdAt: v.number(),
		startedAt: v.optional(v.number()),
		completedAt: v.optional(v.number()),
	})
		.index("by_status_priority", ["status", "priority"])
		.index("by_company", ["companyId", "gate"])
		.index("by_agent", ["agentId", "status"]),

	// ============================================
	// Phase 3 — Financial Data & Documents
	// ============================================

	// Historical financial data for deals — agents read this for QofE, capital structure, valuation
	companyFinancials: defineTable({
		companyId: v.id("crmCompanies"),
		year: v.number(), // e.g. 2024
		revenue: v.number(),
		ebitda: v.number(),
		netIncome: v.optional(v.number()),
		freeCashFlow: v.optional(v.number()),
		ownerCompensation: v.optional(v.number()),
		ownerBenefits: v.optional(v.number()),
		totalDebt: v.optional(v.number()),
		tangibleAssets: v.optional(v.number()),
		currentAssets: v.optional(v.number()),
		currentLiabilities: v.optional(v.number()),
		notes: v.optional(v.string()),
		source: v.optional(v.string()), // e.g. "tax-return", "financial-statement", "management"
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
	})
		.index("by_company", ["companyId"])
		.index("by_company_year", ["companyId", "year"]),

	// Due diligence documents — metadata for uploaded files
	dealDocuments: defineTable({
		companyId: v.id("crmCompanies"),
		name: v.string(),
		type: v.union(
			v.literal("appraisal"),
			v.literal("plan-document"),
			v.literal("tax-return"),
			v.literal("financial-statement"),
			v.literal("legal"),
			v.literal("lender-doc"),
			v.literal("compliance"),
			v.literal("other"),
		),
		url: v.optional(v.string()),
		storageId: v.optional(v.string()), // Convex file storage ID
		uploadedBy: v.optional(v.string()),
		fileSize: v.optional(v.number()),
		mimeType: v.optional(v.string()),
		notes: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_company", ["companyId"])
		.index("by_type", ["type"])
		.index("by_company_type", ["companyId", "type"]),

	// Template definitions — maps to HTML templates in packages/convex/templates/
	templates: defineTable({
		title: v.string(),
		category: v.string(), // "document" | "communication" | "internal"
		lifecycleStage: v.string(), // "first-touch" | "qualification" | "engagement" | "diligence" | "closing" | "post-close"
		audience: v.array(v.string()), // ["seller"], ["broker"], ["internal"], etc.
		status: v.string(), // "exists" | "gap" | "partial"
		description: v.string(),
		isRequired: v.boolean(),
		requiresSignature: v.boolean(),
		isRecurring: v.optional(v.boolean()),
		recurrenceRule: v.optional(v.string()), // "weekly" | "monthly" | "quarterly"
		source: v.optional(v.string()), // e.g. "auto-generated", "imported"
		content: v.optional(v.string()), // DEPRECATED: inline HTML content (kept for migration fallback)
		contentFileId: v.optional(v.id("_storage")), // File Storage reference for template HTML
		version: v.optional(v.number()),
		updatedAt: v.optional(v.number()),
		createdAt: v.number(),
	})
		.index("by_title", ["title"])
		.index("by_stage", ["lifecycleStage", "status"]),

	// Stage requirements — maps templates to pipeline stages for auto-creation
	stageRequirements: defineTable({
		stage: v.string(),
		templateId: v.id("templates"),
		requiredForAudience: v.array(v.string()),
		order: v.number(),
		autoCreate: v.boolean(),
		recurrenceRule: v.optional(v.string()),
		// Trigger automation fields
		trigger: v.optional(v.string()),
		triggerGate: v.optional(v.string()),
		daysOffset: v.optional(v.number()),
		// Additional fields used by deal engine
		feeMilestone: v.optional(v.string()),
		autoSend: v.optional(v.boolean()),
		blockingGate: v.optional(v.string()),
	})
		.index("by_stage", ["stage"])
		.index("by_trigger", ["trigger"]),

	// Workflow tasks — auto-created from stage requirements per deal
	workflowTasks: defineTable({
		templateId: v.id("templates"),
		companyId: v.id("crmCompanies"),
		contactId: v.optional(v.id("crmContacts")),
		direction: v.union(v.literal("outbound"), v.literal("inbound")),
		status: v.union(
			v.literal("pending"),
			v.literal("sent"),
			v.literal("delivered"),
			v.literal("opened"),
			v.literal("received"),
			v.literal("completed"),
			v.literal("skipped"),
			v.literal("cancelled"),
			v.literal("overdue"),
		),
		dueDate: v.number(),
		recurrenceRule: v.optional(v.string()),
		recurrenceParentId: v.optional(v.id("workflowTasks")),
		recurrenceInstanceNumber: v.optional(v.number()),
		completedAt: v.optional(v.number()),
		completedBy: v.optional(v.string()),
		sentAt: v.optional(v.number()),
		receivedAt: v.optional(v.number()),
		notes: v.optional(v.string()),
		privateNotes: v.optional(v.string()),
		meetingAgenda: v.optional(v.string()),
		meetingHeldAt: v.optional(v.number()),
		priority: v.optional(
			v.union(v.literal("high"), v.literal("normal"), v.literal("low")),
		),
		// Document/e-sign fields
		resendId: v.optional(v.string()),
		boxFileId: v.optional(v.string()),
		boxSignRequestId: v.optional(v.string()),
		boxSignStatus: v.optional(v.string()),
		signedDocumentUrl: v.optional(v.string()),
		responseData: v.optional(v.any()),
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
	})
		.index("by_company", ["companyId"])
		.index("by_parent", ["recurrenceParentId"])
		.index("by_company_template", ["companyId", "templateId"])
		.index("by_status", ["status"])
		.index("by_box_sign", ["boxSignRequestId"]),

	// Notes — general-purpose notes on companies, contacts, and tasks
	notes: defineTable({
		companyId: v.id("crmCompanies"),
		contactId: v.optional(v.id("crmContacts")),
		authorId: v.optional(v.id("users")),
		content: v.string(),
		type: v.string(), // "internal" | "external" | "meeting" etc.
		isPrivate: v.optional(v.boolean()),
		workflowTaskId: v.optional(v.id("workflowTasks")),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_company", ["companyId"])
		.index("by_contact", ["contactId"])
		.index("by_task", ["workflowTaskId"])
		.index("by_type", ["type"]),

	// Email events — log of all inbound/outbound emails
	emailEvents: defineTable({
		direction: v.string(), // "outbound" | "inbound"
		from: v.string(),
		to: v.string(),
		subject: v.string(),
		templateId: v.optional(v.string()),
		resendId: v.optional(v.string()),
		status: v.string(), // "sent" | "received" | "bounced" | "delivered" etc.
		relatedCompanyId: v.optional(v.id("crmCompanies")),
		relatedContactId: v.optional(v.id("crmContacts")),
		metadata: v.optional(v.any()),
		createdAt: v.number(),
	})
		.index("by_createdAt", ["createdAt"])
		.index("by_company", ["relatedCompanyId"])
		.index("by_template", ["templateId"])
		.index("by_from", ["from"])
		.index("by_to", ["to"]),

	// Queue tasks — trigger-based task queue
	queueTasks: defineTable({
		companyId: v.id("crmCompanies"),
		templateId: v.id("templates"),
		priority: v.string(), // "normal" | "high" | "low"
		status: v.string(), // "pending" | "completed" | "cancelled"
		metadata: v.optional(v.any()),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index("by_company_template", ["companyId", "templateId"]),

	// Document audit log — SOC 2 ready
	documentAudit: defineTable({
		companyId: v.optional(v.id("crmCompanies")),
		taskId: v.optional(v.id("workflowTasks")),
		documentType: v.string(),
		action: v.union(
			v.literal("generated"),
			v.literal("uploaded"),
			v.literal("shared"),
			v.literal("signed"),
			v.literal("declined"),
			v.literal("expired"),
			v.literal("viewed"),
			v.literal("downloaded"),
			v.literal("emailed"),
		),
		actor: v.string(),
		metadata: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_company", ["companyId"])
		.index("by_task", ["taskId"])
		.index("by_action", ["action"]),

	// ============================================
	// Client Journals — Post-close transparency
	// Path A: crmCompanies = client AND deal
	// ============================================

	clientJournals: defineTable({
		clientId: v.id("crmCompanies"),

		journalType: v.union(v.literal("transition"), v.literal("stewardship")),
		currentChapter: v.string(),
		chapterNumber: v.number(),

		status: v.union(v.literal("active"), v.literal("archived")),

		boxFolderId: v.optional(v.string()),
		boxPdfFileId: v.optional(v.string()),
		boxSharedLink: v.optional(v.string()),

		clientTimezone: v.string(),
		deliveryDay: v.optional(v.string()),
		deliveryHour: v.optional(v.number()),

		// Engagement tracking
		lastEmailOpenedAt: v.optional(v.number()),
		lastFileViewedAt: v.optional(v.number()),
		emailOpenCount: v.optional(v.number()),
		fileViewCount: v.optional(v.number()),

		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("byClient", ["clientId"])
		.index("byStatus", ["status"]),

	journalEntries: defineTable({
		journalId: v.id("clientJournals"),
		clientId: v.id("crmCompanies"),

		title: v.string(),
		description: v.string(),
		clientDescription: v.optional(v.string()),
		outcome: v.optional(v.string()),

		entryType: v.union(
			v.literal("work"),
			v.literal("call"),
			v.literal("meeting"),
			v.literal("email"),
			v.literal("document"),
			v.literal("signature"),
			v.literal("notification"),
			v.literal("due_item"),
			v.literal("milestone"),
			v.literal("issue"),
			v.literal("decision"),
			v.literal("note"),
		),

		theme: v.union(
			v.literal("legal"),
			v.literal("finance"),
			v.literal("trustee_bank"),
			v.literal("hr_comms"),
			v.literal("governance"),
			v.literal("tax"),
			v.literal("signing"),
			v.literal("admin"),
		),

		status: v.union(
			v.literal("completed"),
			v.literal("in_progress"),
			v.literal("upcoming"),
			v.literal("blocked"),
			v.literal("waiting_on_others"),
			v.literal("canceled"),
		),

		effortBand: v.optional(
			v.union(
				v.literal("low"),
				v.literal("medium"),
				v.literal("high"),
				v.literal("spike"),
			),
		),
		hoursEstimate: v.optional(v.number()),
		valueNote: v.optional(v.string()),

		touchpointType: v.optional(
			v.union(
				v.literal("call"),
				v.literal("email"),
				v.literal("document"),
				v.literal("meeting"),
			),
		),

		performedBy: v.string(),
		performedByRole: v.optional(v.string()),
		participants: v.optional(
			v.array(
				v.object({
					name: v.string(),
					role: v.string(),
					organization: v.optional(v.string()),
				}),
			),
		),

		dueFrom: v.optional(v.array(v.string())),
		dueDate: v.optional(v.number()),

		relatedDocuments: v.optional(v.array(v.string())),
		relatedTaskId: v.optional(v.id("workflowTasks")),

		visibleToClient: v.boolean(),
		sensitivity: v.union(
			v.literal("low"),
			v.literal("medium"),
			v.literal("high"),
		),
		internalNote: v.optional(v.string()),

		isAutoGenerated: v.boolean(),
		autoGeneratedFrom: v.optional(v.string()),

		chapter: v.string(),
		chapterNumber: v.number(),

		occurredAt: v.number(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("byJournal", ["journalId"])
		.index("byClient", ["clientId"])
		.index("byChapter", ["journalId", "chapterNumber"])
		.index("byTheme", ["journalId", "theme"])
		.index("byStatus", ["journalId", "status"])
		.index("byOccurredAt", ["journalId", "occurredAt"])
		.index("byDueDate", ["dueDate"]),

	journalNarratives: defineTable({
		journalId: v.id("clientJournals"),
		clientId: v.id("crmCompanies"),

		weekStarting: v.number(),
		weekEnding: v.number(),

		narrativeText: v.string(),
		authorId: v.string(),
		authorName: v.string(),

		status: v.union(
			v.literal("draft"),
			v.literal("ready"),
			v.literal("sent"),
			v.literal("skipped"),
		),

		readyAt: v.optional(v.number()),
		sentAt: v.optional(v.number()),

		usedFallback: v.boolean(),
		fallbackReason: v.optional(v.string()),

		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("byJournal", ["journalId"])
		.index("byWeek", ["journalId", "weekStarting"])
		.index("byStatus", ["status"]),

	journalDigests: defineTable({
		journalId: v.id("clientJournals"),
		narrativeId: v.optional(v.id("journalNarratives")),

		weekStarting: v.number(),
		weekEnding: v.number(),

		boxFileId: v.string(),
		boxFileUrl: v.string(),

		metrics: v.object({
			totalEntries: v.number(),
			entriesByTheme: v.any(),
			entriesByEffort: v.any(),
			touchpoints: v.object({
				calls: v.number(),
				emails: v.number(),
				documents: v.number(),
				meetings: v.number(),
				total: v.number(),
			}),
			actionItemsDue: v.number(),
			milestones: v.number(),
		}),

		deliveredAt: v.number(),
		deliveredTo: v.array(v.string()),
		resendId: v.optional(v.string()),

		createdAt: v.number(),
	})
		.index("byJournal", ["journalId"])
		.index("byWeek", ["journalId", "weekStarting"])
		.index("byResendId", ["resendId"]),

	journalChapters: defineTable({
		journalId: v.id("clientJournals"),

		chapterNumber: v.number(),
		title: v.string(),
		description: v.optional(v.string()),

		status: v.union(
			v.literal("upcoming"),
			v.literal("active"),
			v.literal("completed"),
		),

		startedAt: v.optional(v.number()),
		completedAt: v.optional(v.number()),

		closeSummaryGenerated: v.boolean(),
		closeSummaryBoxFileId: v.optional(v.string()),

		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("byJournal", ["journalId"])
		.index("byStatus", ["journalId", "status"]),

	// ============================================
	// Deal Tracker — 120-Day ESOP Transaction Roadmap
	// ============================================

	// Per-client deal tracker tasks
	dealTrackerTasks: defineTable({
		companyId: v.id("crmCompanies"),
		phase: v.union(
			v.literal("ignition"), // Days 1-14
			v.literal("build"), // Days 15-45
			v.literal("validate"), // Days 46-75
			v.literal("close-prep"), // Days 76-105
			v.literal("closing"), // Days 106-120
		),
		taskId: v.string(), // e.g., "t1_1", "t2_3"
		taskTitle: v.string(),
		taskType: v.union(
			v.literal("milestone"),
			v.literal("action"),
			v.literal("deadline"),
			v.literal("deliverable"),
			v.literal("gate"),
		),
		dayTarget: v.string(), // e.g., "D.1", "D.45"
		dayNumber: v.number(), // e.g., 1, 45
		role: v.string(), // "Forhemit", "Owner/Seller", "Lender", etc.
		order: v.number(), // Sort order within phase

		// Subtask state
		subtasks: v.array(
			v.object({
				id: v.string(), // e.g., "t1_1_0", "t1_1_1"
				label: v.string(),
				completed: v.boolean(),
				completedAt: v.optional(v.number()),
				completedBy: v.optional(v.string()),
			}),
		),

		// Task-level state
		allSubtasksCompleted: v.boolean(),
		completedAt: v.optional(v.number()),

		// Gate-specific fields (only for gate tasks)
		gateStatus: v.optional(
			v.union(v.literal("pending"), v.literal("cleared"), v.literal("blocked")),
		),
		gateClearedAt: v.optional(v.number()),
		gateClearedBy: v.optional(v.string()),

		// Box sync metadata
		boxFileId: v.optional(v.string()),
		boxSyncedAt: v.optional(v.number()),

		// Audit trail
		lastUpdatedAt: v.number(),
		lastUpdatedBy: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_company", ["companyId"])
		.index("by_company_phase", ["companyId", "phase"])
		.index("by_company_task", ["companyId", "taskId"])
		.index("by_gate_status", ["companyId", "gateStatus"]),

	// Per-client deal tracker progress (aggregated)
	dealTrackerProgress: defineTable({
		companyId: v.id("crmCompanies"),

		// Overall progress
		totalSubtasks: v.number(),
		completedSubtasks: v.number(),
		progressPercent: v.number(),

		// Phase progress
		phases: v.object({
			ignition: v.object({
				total: v.number(),
				completed: v.number(),
				percent: v.number(),
			}),
			build: v.object({
				total: v.number(),
				completed: v.number(),
				percent: v.number(),
			}),
			validate: v.object({
				total: v.number(),
				completed: v.number(),
				percent: v.number(),
			}),
			closePrep: v.object({
				total: v.number(),
				completed: v.number(),
				percent: v.number(),
			}),
			closing: v.object({
				total: v.number(),
				completed: v.number(),
				percent: v.number(),
			}),
		}),

		// Gate status
		gates: v.object({
			gate1: v.object({
				status: v.string(),
				day: v.string(),
				name: v.string(),
			}),
			gate2: v.object({
				status: v.string(),
				day: v.string(),
				name: v.string(),
			}),
			gate3: v.object({
				status: v.string(),
				day: v.string(),
				name: v.string(),
			}),
			gate4: v.object({
				status: v.string(),
				day: v.string(),
				name: v.string(),
			}),
		}),

		// Current phase
		currentPhase: v.string(),
		currentDay: v.optional(v.number()),

		// Engagement dates
		engagementStartDate: v.optional(v.string()), // ISO date YYYY-MM-DD

		// Box sync
		boxFileId: v.optional(v.string()),
		boxSharedLink: v.optional(v.string()),
		boxSyncedAt: v.optional(v.number()),

		// Initialized by
		initializedBy: v.optional(v.string()),
		initializedAt: v.optional(v.number()),

		// Timestamps
		startedAt: v.number(),
		lastUpdatedAt: v.number(),
		estimatedCloseDate: v.optional(v.number()),

		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_company", ["companyId"])
		.index("by_phase", ["currentPhase"]),

	// ============================================
	// Business Log — Unified Activity Feed
	// ============================================

	businessLog: defineTable({
		// Versioning
		eventVersion: v.number(),

		// What happened
		eventType: v.string(),
		category: v.union(
			v.literal("deal"),
			v.literal("task"),
			v.literal("document"),
			v.literal("email"),
			v.literal("agent"),
			v.literal("auth"),
			v.literal("system"),
			v.literal("journal"),
			v.literal("tracker"),
			v.literal("box"),
			v.literal("client"),
		),

		// Display: dual summaries
		summary: v.string(), // internal/team
		clientSummary: v.optional(v.string()), // client-safe; REQUIRED if clientVisible

		// Actor (structured)
		actorType: v.union(
			v.literal("user"),
			v.literal("system"),
			v.literal("agent"),
			v.literal("webhook"),
			v.literal("client"),
			v.literal("box"),
		),
		actorId: v.optional(v.string()),
		actorLabel: v.optional(v.string()), // "Stefano" — internal
		clientActorLabel: v.optional(v.string()), // "Forhemit Team" — client

		// Where it came from
		source: v.union(
			v.literal("admin_ui"),
			v.literal("client_portal"),
			v.literal("box_embed"),
			v.literal("webhook"),
			v.literal("agent"),
			v.literal("api"),
			v.literal("scheduler"),
		),

		// Entity link
		entityType: v.optional(v.string()),
		entityId: v.optional(v.string()),

		// Scoping & traceability
		companyId: v.optional(v.id("crmCompanies")),
		scopeType: v.optional(
			v.union(v.literal("company"), v.literal("user"), v.literal("system")),
		),
		scopeId: v.optional(v.string()),
		correlationId: v.optional(v.string()),
		idempotencyKey: v.optional(v.string()),

		// Timing
		occurredAt: v.number(), // when event actually happened
		publishedAt: v.optional(v.number()), // when client may see it

		// Access control (derived in logEvent — never passed by callers)
		visibility: v.union(
			v.literal("system"),
			v.literal("internal"),
			v.literal("external"),
			v.literal("client"),
		),
		teamVisible: v.boolean(), // derived: visibility !== "system"
		clientVisible: v.boolean(), // derived: visibility in ("external","client")

		// Filtering & severity
		severity: v.union(
			v.literal("info"),
			v.literal("warning"),
			v.literal("critical"),
		),
		relatedRoles: v.optional(v.array(v.string())),

		// Retention
		retentionClass: v.union(v.literal("activity"), v.literal("compliance")),
		deletedAt: v.optional(v.number()),

		// Payloads (split: internal vs client-safe)
		metadata: v.optional(v.any()), // internal only; ≤2KB
		publicMetadata: v.optional(v.any()), // client-safe; ≤1KB

		// Links (with per-link visibility, max 5)
		links: v.optional(
			v.array(
				v.object({
					label: v.string(),
					type: v.union(
						v.literal("box_file"),
						v.literal("box_folder"),
						v.literal("document"),
						v.literal("company"),
						v.literal("external"),
					),
					href: v.optional(v.string()),
					boxFileId: v.optional(v.string()),
					boxFolderId: v.optional(v.string()),
					clientVisible: v.boolean(),
				}),
			),
		),
	})
		.index("by_company_time", ["companyId"])
		.index("by_team_time", ["teamVisible"])
		.index("by_company_client_time", ["companyId", "clientVisible"])
		.index("by_category_time", ["category"])
		.index("by_eventType_time", ["eventType"])
		.index("by_severity_time", ["severity"])
		.index("by_correlation_time", ["correlationId"])
		.index("by_retention_time", ["retentionClass"])
		.index("by_idempotency", ["idempotencyKey"]),

	// Client interactions (separate from feed — no feed pollution)
	businessLogInteractions: defineTable({
		eventId: v.id("businessLog"),
		companyId: v.id("crmCompanies"),
		interactionType: v.union(
			v.literal("seen"),
			v.literal("expanded"),
			v.literal("acknowledged"),
			v.literal("opened_link"),
		),
		viewerType: v.union(
			v.literal("client"),
			v.literal("box_user"),
			v.literal("system"),
		),
		viewerId: v.optional(v.string()),
		viewerEmail: v.optional(v.string()),
		embedSessionId: v.optional(v.id("boxLogSessions")),
	})
		.index("by_event", ["eventId"])
		.index("by_event_viewer", ["eventId", "viewerId"])
		.index("by_company_viewer", ["companyId", "viewerId"])
		.index("by_company_time", ["companyId"]),

	// Box embed sessions
	boxLogSessions: defineTable({
		companyId: v.id("crmCompanies"),
		boxFolderId: v.optional(v.string()),
		tokenHash: v.string(), // sha256 of URL token
		exchangedAt: v.optional(v.number()), // when URL token was exchanged
		sessionCookieHash: v.optional(v.string()), // sha256 of issued cookie
		exchangeCount: v.number(), // 0 or 1; guard on server
		viewerEmail: v.optional(v.string()),
		boxUserId: v.optional(v.string()),
		capabilities: v.array(v.string()), // ["read","acknowledge"] (v1)
		expiresAt: v.number(),
		revokedAt: v.optional(v.number()),
		createdBy: v.string(),
		lastSeenAt: v.optional(v.number()),
	})
		.index("by_tokenHash", ["tokenHash"])
		.index("by_company", ["companyId"]),

	// Stats cache (materialized from day one)
	businessLogStats: defineTable({
		window: v.string(), // "total" | "2026-05-31" | "severity:warning"
		count: v.number(),
		updatedAt: v.number(),
	}).index("by_window", ["window"]),
});
