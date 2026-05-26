import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Seed the templates table from both inventories:
 * - Forms Master Inventory (39 items)
 * - Communications Inventory (63 items)
 *
 * Run with: npx convex run seedTemplates:seedAll
 */

export const seedAll = mutation({
	args: {},
	handler: async (ctx) => {
		// Check if already seeded
		const existing = await ctx.db.query("templates").first();
		if (existing) {
			return {
				message:
					"Templates already seeded. Delete existing records first if you want to re-seed.",
			};
		}

		const now = Date.now();
		let count = 0;

		// ============================================
		// FORMS MASTER INVENTORY (39 items)
		// ============================================

		const formsInventory = [
			// Seller-facing documents
			{
				title: "Pre-flight checklist (signed by seller + Forhemit)",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["seller"],
				status: "exists" as const,
				description:
					"Mutual go/no-go with $15K non-refundable deposit; 6 parts, 34 items",
				isRequired: true,
				requiresSignature: true,
			},
			{
				title: "Transaction cost disclosure",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "exists" as const,
				description: "Itemized Low/Realistic/High with §1042 comparison vs PE",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Offer summary (V3)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "exists" as const,
				description:
					"Robin Crow / DHI — capital stack, seller proceeds, timeline",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Honest Review document",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "exists" as const,
				description:
					"Objections, fears, hopes — fee section intentionally withheld",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "120-day calendar",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "exists" as const,
				description: "Day-by-day milestones for seller visibility",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Seller FAQ / plain-language guide",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Fifth-grade accessible — what is an ESOP, what does seller actually do, guarantees, control",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "§1042 rollover explainer (seller's CPA version)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller", "cpa"],
				status: "gap" as const,
				description:
					"QRS mechanics, reinvestment window, basis implications — for CPA to review with seller",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Engagement letter (seller-facing)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "partial" as const,
				description:
					"Forhemit fee structure, milestones, cancellation terms — DocuSign ready",
				isRequired: true,
				requiresSignature: true,
			},
			{
				title: "Seller document request list",
				category: "document" as const,
				lifecycleStage: "diligence",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Organized by Gate — what Forhemit needs from seller and by when",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Net proceeds calculator (interactive)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Seller inputs EBITDA + basis — shows Day 1 cash, note payout, total vs PE after tax",
				isRequired: false,
				requiresSignature: false,
			},

			// Broker-facing documents
			{
				title: "Broker introduction packet",
				category: "document" as const,
				lifecycleStage: "first-touch",
				audience: ["broker"],
				status: "exists" as const,
				description:
					"9 sections incl. $10M side-by-side, gotchas, commission protection, deal submission",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Two-track cost analysis (full doc)",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["broker"],
				status: "exists" as const,
				description:
					"Parallel process economics — when ESOP sunk costs are at risk",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "ESOP cost reference card (3-way framework)",
				category: "document" as const,
				lifecycleStage: "first-touch",
				audience: ["broker"],
				status: "exists" as const,
				description:
					"Sunk / Structural / Lost Benefit — one-page broker leave-behind",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Broker screener / qualification form",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["broker"],
				status: "exists" as const,
				description:
					"Quick filter — does this listing fit Forhemit criteria before first call",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Broker NDA / confidentiality agreement",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["broker"],
				status: "gap" as const,
				description:
					"Covers deal flow sharing, referral fee terms, and seller identity protection",
				isRequired: true,
				requiresSignature: true,
			},
			{
				title: "Referral fee agreement",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["broker"],
				status: "gap" as const,
				description:
					"Formal documentation of any referral arrangement — separate from broker commission",
				isRequired: false,
				requiresSignature: true,
			},
			{
				title: "Broker pipeline status update template",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["broker"],
				status: "gap" as const,
				description:
					"Recurring email format to keep broker informed through Gate milestones",
				isRequired: false,
				requiresSignature: false,
				isRecurring: true,
				recurrenceRule: "weekly",
			},

			// Lender-facing documents
			{
				title: "SBA lender outreach brief (one-pager)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["lender"],
				status: "partial" as const,
				description:
					"Who Forhemit is, deal program overview, what we need from lender partner",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "SBA intake form",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["lender"],
				status: "exists" as const,
				description: "Structured lender Q&A and deal intake",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Lender qualification interview questions",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["lender"],
				status: "partial" as const,
				description:
					"Gotcha questions — trustee relationship, seller PG, stretch above $5M, timeline",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Lender scoring rubric",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["lender"],
				status: "exists" as const,
				description:
					"14-day indication / ESOP exp / stretch capability / re-trade history matrix",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Lender Q&A tracker",
				category: "document" as const,
				lifecycleStage: "diligence",
				audience: ["lender"],
				status: "exists" as const,
				description: "CRM-style log of lender responses across deals",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Repayment / amortization model",
				category: "document" as const,
				lifecycleStage: "diligence",
				audience: ["lender"],
				status: "exists" as const,
				description:
					"Seller note + SBA debt service with refinance trigger at Month 14-18",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Capital stack summary (lender package cover)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["lender"],
				status: "gap" as const,
				description:
					"Deal-specific one-page summary — uses of proceeds, sources, DSCR, collateral",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Intercreditor agreement template",
				category: "document" as const,
				lifecycleStage: "diligence",
				audience: ["lender"],
				status: "gap" as const,
				description:
					"For deals >$5M requiring dual-lender stack — seller note subordination terms",
				isRequired: false,
				requiresSignature: true,
			},

			// Advisor / trustee / counsel documents
			{
				title: "ESOP ecosystem outreach playbook",
				category: "document" as const,
				lifecycleStage: "first-touch",
				audience: ["trustee", "counsel"],
				status: "exists" as const,
				description:
					"LinkedIn approach, templates A/B/C, coffee chat agenda, lender intel framework",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Board resolution package",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "exists" as const,
				description:
					"Three resolutions: transaction auth, trustee engagement, company counsel engagement",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Roles & independence matrix",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller", "trustee", "counsel"],
				status: "exists" as const,
				description:
					"Who selects whom, who is client, who pays — ERISA compliance architecture",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Dream team roster + mini-RFP",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["internal"],
				status: "exists" as const,
				description:
					"Trustee, ERISA counsel, QofE firm shortlists with evaluation questions",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "ERISA counsel RFP / conflict check request",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["counsel"],
				status: "gap" as const,
				description:
					"Formal engagement initiation for ERISA counsel — conflict check + LLC-to-C-corp ESOP experience",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Trustee engagement memo (introduction letter)",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["trustee"],
				status: "gap" as const,
				description:
					"Forhemit introduces deal to trustee — what they receive, what the timeline is, what Forhemit's role is not",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Valuation firm briefing memo",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["trustee"],
				status: "gap" as const,
				description:
					"ERISA FMV appraisal scope, deal context, trustee referral process — corrects '409A' terminology",
				isRequired: true,
				requiresSignature: false,
			},

			// Internal operations
			{
				title: "Deal intake form",
				category: "internal" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "exists" as const,
				description: "Structured intake for new prospects — all four verticals",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "ESOP partner CRM",
				category: "internal" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "exists" as const,
				description:
					"Tracks advisors, trustees, lenders, brokers with relationship stage",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Classification intake flow",
				category: "internal" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "exists" as const,
				description:
					"React app — routes inbound deals to correct vertical and tier",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Pre-flight checklist (internal version)",
				category: "internal" as const,
				lifecycleStage: "qualification",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Forhemit's own readiness check before presenting to seller — different from seller-facing version",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Gate tracking dashboard",
				category: "internal" as const,
				lifecycleStage: "diligence",
				audience: ["internal"],
				status: "partial" as const,
				description:
					"Gates 1–4 status per deal — capital, valuation, operations, legal",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "COOP intake forms (Track 1 People, Track 2 Systems)",
				category: "internal" as const,
				lifecycleStage: "post-close",
				audience: ["internal"],
				status: "exists" as const,
				description: "Post-close stewardship onboarding — 4 tracks",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "COOP delivery tracker (V1.0 – V4.0)",
				category: "internal" as const,
				lifecycleStage: "post-close",
				audience: ["internal"],
				status: "partial" as const,
				description:
					"Ties COOP version to gate milestone; trustee sign-off at Gate 4",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Turnover cost calculator",
				category: "internal" as const,
				lifecycleStage: "diligence",
				audience: ["internal"],
				status: "exists" as const,
				description:
					"Key man risk quantification for trustee and lender presentations",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Deal economics model (internal)",
				category: "internal" as const,
				lifecycleStage: "diligence",
				audience: ["internal"],
				status: "partial" as const,
				description:
					"Full pro forma — EBITDA, debt service, Forhemit fee, net to seller, net to employees — gated by tier",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "LLC-to-C-corp conversion checklist",
				category: "internal" as const,
				lifecycleStage: "engagement",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Most time-sensitive gating item — state-specific steps, tax elections, timeline",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "EIDL lien resolution tracker",
				category: "internal" as const,
				lifecycleStage: "diligence",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Tracks SBA EIDL subordination or payoff status — required before new SBA financing",
				isRequired: false,
				requiresSignature: false,
			},

			// Legal / compliance templates
			{
				title: "Engagement letter (Forhemit → seller)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "exists" as const,
				description:
					"HTML with DocuSign anchors; fee milestones, cancellation, non-refundable deposit",
				isRequired: true,
				requiresSignature: true,
			},
			{
				title: "NDA (mutual — deal team)",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["seller", "broker", "trustee", "counsel"],
				status: "gap" as const,
				description:
					"Covers seller, broker, Forhemit, and advisors in shared deal room",
				isRequired: true,
				requiresSignature: true,
			},
			{
				title: "Retainer agreement (company → ERISA counsel)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["counsel"],
				status: "gap" as const,
				description:
					"Owner-executed; Forhemit is not a party — ERISA independence preserved",
				isRequired: true,
				requiresSignature: true,
			},
			{
				title: "Retainer agreement (company → trustee)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["trustee"],
				status: "gap" as const,
				description:
					"Owner-executed; trustee selection occurs before any lender or appraiser contact",
				isRequired: true,
				requiresSignature: true,
			},
			{
				title: "Letter of intent (LOI) template",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Non-binding; triggers deposit uncashing and exclusivity window; includes C-corp conversion condition",
				isRequired: true,
				requiresSignature: true,
			},
			{
				title: "COOP stewardship agreement",
				category: "document" as const,
				lifecycleStage: "post-close",
				audience: ["seller"],
				status: "partial" as const,
				description:
					"Post-close 12–24 month engagement; 2.5% EBITDA annually; four track deliverables",
				isRequired: true,
				requiresSignature: true,
			},
		];

		// ============================================
		// COMMUNICATIONS INVENTORY (63 items)
		// ============================================

		const communicationsInventory = [
			// First touch (8)
			{
				title: "Inbound inquiry auto-response (email)",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["seller", "broker", "partner"],
				status: "gap" as const,
				description:
					"Triggered when someone contacts via website or deals@ — confirms receipt, sets expectations, provides next step",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Voicemail script (Retell AI / live)",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "partial" as const,
				description:
					"What Forhemit says in the first 20 seconds — consistent across all inbound channels",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "LinkedIn connection follow-up (post-accept)",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["broker", "trustee", "counsel"],
				status: "gap" as const,
				description:
					"24-hour message after connection accepted — moves toward a call without pitching",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Cold outreach email — broker (first touch)",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["broker"],
				status: "gap" as const,
				description:
					"Active acquirer framing; targets mid-career broker with aged listing; leads with their problem",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Cold outreach email — CPA (first touch)",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["cpa"],
				status: "gap" as const,
				description:
					"'Lose one client vs. gain 20–50 individual tax clients' frame; physician-focused CPA firms",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Cold outreach email — seller (owner-direct)",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Avoids 'ESOP' in subject; leads with equity unlocked, guarantees retired, control retained",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Conference / event follow-up email",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Within 24 hours of meeting someone in person — references the conversation, suggests next step",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Referral acknowledgment (when someone sends a lead)",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["broker", "cpa", "counsel"],
				status: "gap" as const,
				description:
					"Immediate reply to whoever made the introduction — professional, warm, confirms receipt",
				isRequired: true,
				requiresSignature: false,
			},

			// Qualification (7)
			{
				title: "Deal screener email (broker → Forhemit)",
				category: "communication" as const,
				lifecycleStage: "qualification",
				audience: ["broker"],
				status: "urgent" as const,
				description:
					"Structured reply to broker who sent a listing — confirms criteria match or explains why it doesn't fit",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Seller qualification call agenda",
				category: "meeting" as const,
				lifecycleStage: "qualification",
				audience: ["seller"],
				status: "urgent" as const,
				description:
					"15-minute script for first seller call — pain mirror → identity shift → authority prime → invisible filter",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Pre-flight checklist cover letter (to seller)",
				category: "communication" as const,
				lifecycleStage: "qualification",
				audience: ["seller"],
				status: "urgent" as const,
				description:
					"Email that accompanies the pre-flight checklist — explains what it is, why it exists, what happens next",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "No-fit decline email (seller)",
				category: "communication" as const,
				lifecycleStage: "qualification",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"When a seller doesn't meet criteria — respectful, specific, leaves door open",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "No-fit decline email (broker)",
				category: "communication" as const,
				lifecycleStage: "qualification",
				audience: ["broker"],
				status: "gap" as const,
				description:
					"When a listing doesn't qualify — gives broker enough to know why without burning the relationship",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Conditional go letter (pre-flight)",
				category: "communication" as const,
				lifecycleStage: "qualification",
				audience: ["seller"],
				status: "urgent" as const,
				description:
					"When checklist is signed with a condition — confirms deposit held uncashed until condition met",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Deal intake confirmation (internal)",
				category: "internal" as const,
				lifecycleStage: "qualification",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Internal notification when a new deal is added to the CRM — assigns deal lead, opens Gate 1 checklist",
				isRequired: true,
				requiresSignature: false,
			},

			// Engagement (8)
			{
				title: "Engagement letter cover email (to seller)",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "urgent" as const,
				description:
					"Email sending the engagement letter for signature — what they're signing, what happens after",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "LOI transmittal letter",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "urgent" as const,
				description:
					"Cover memo when LOI is presented — explains key terms in plain language before seller reads the legal document",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Broker deal acceptance email",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["broker"],
				status: "gap" as const,
				description:
					"Sent to broker when Forhemit accepts a deal and signs engagement — confirms commission protection, timeline, next steps",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Advisor introduction email (trustee)",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["trustee"],
				status: "urgent" as const,
				description:
					"Forhemit introduces the deal to the trustee — deal context, Forhemit's role, what trustee receives and when",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Advisor introduction email (ERISA counsel)",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["counsel"],
				status: "urgent" as const,
				description:
					"Forhemit introduces the deal — triggers conflict check; confirms LLC-to-C-corp ESOP experience ask",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "SBA lender introduction package cover email",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["lender"],
				status: "gap" as const,
				description:
					"Sends the lender brief — deal summary, what Forhemit needs, timeline",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Deal team kick-off memo (internal)",
				category: "internal" as const,
				lifecycleStage: "engagement",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Internal document sent Day 1 — names every team member, role, communication channel, gate schedule",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Seller onboarding email — Day 1: Welcome + what to expect",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Day 1 of 5-day onboarding sequence — welcome, what to expect, key contacts",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Seller onboarding email — Day 2: Document request list",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Day 2 — organized list of what Forhemit needs from seller, with deadlines",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Seller onboarding email — Day 3: Calendar link",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "gap" as const,
				description: "Day 3 — scheduling link for recurring check-ins",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Seller onboarding email — Day 4: Team introduction",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "gap" as const,
				description: "Day 4 — introduces deal team members and their roles",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Seller onboarding email — Day 5: First check-in",
				category: "communication" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Day 5 — first check-in, how are things going, any questions",
				isRequired: true,
				requiresSignature: false,
			},

			// Due diligence (11)
			{
				title: "Gate 1 passage confirmation (internal + seller)",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["seller", "internal"],
				status: "gap" as const,
				description:
					"Capital committed — confirms SBA indication received, deal proceeds; sent to seller and deal team",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Gate 2 passage confirmation (internal + seller)",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["seller", "internal"],
				status: "gap" as const,
				description:
					"Valuation confirmed within 15% of LOI assumption — triggers QofE scope",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Gate 3 passage confirmation (internal + seller)",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["seller", "internal"],
				status: "gap" as const,
				description:
					"Operations cleared — COOP V3.0 complete, key man docs executed",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Gate failure / extension notice (seller)",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"When a gate doesn't clear on schedule — explains what's needed, revised timeline, no-fault framing",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Document request follow-up (seller)",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Polite but firm — when seller hasn't returned requested docs by deadline",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Weekly deal status update (seller-facing)",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"One-page / one-email — where things stand, what's needed from seller this week, next milestone",
				isRequired: true,
				requiresSignature: false,
				isRecurring: true,
				recurrenceRule: "weekly",
			},
			{
				title: "Weekly deal status update (broker-facing)",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["broker"],
				status: "gap" as const,
				description:
					"Shorter version for broker — headline status only; protects seller confidentiality",
				isRequired: false,
				requiresSignature: false,
				isRecurring: true,
				recurrenceRule: "weekly",
			},
			{
				title: "Lender update email (during underwriting)",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["lender"],
				status: "gap" as const,
				description:
					"Proactive weekly touch to SBA lender — status, any new items, ETA on open conditions",
				isRequired: true,
				requiresSignature: false,
				isRecurring: true,
				recurrenceRule: "weekly",
			},
			{
				title: "Trustee update memo (during appraisal)",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["trustee"],
				status: "gap" as const,
				description:
					"Keeps trustee informed of timeline — what Forhemit has delivered, what's pending",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "EIDL lien status update (internal)",
				category: "internal" as const,
				lifecycleStage: "diligence",
				audience: ["internal", "lender"],
				status: "gap" as const,
				description:
					"Tracks SBA EIDL payoff / subordination progress — shared with lender when resolved",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "QofE findings memo (internal)",
				category: "internal" as const,
				lifecycleStage: "diligence",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Adjusted EBITDA vs. LOI assumption — internal flag if variance exceeds 15% threshold",
				isRequired: true,
				requiresSignature: false,
			},

			// Closing (7)
			{
				title: "Gate 4 / legal clearance memo (internal)",
				category: "internal" as const,
				lifecycleStage: "closing",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"All legal conditions satisfied — trustee sign-off, SBA commitment, docs clean; triggers closing schedule",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Closing date confirmation (seller)",
				category: "communication" as const,
				lifecycleStage: "closing",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Formal notice of closing date — what seller needs to do, where to be, what to bring",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Closing checklist (deal team)",
				category: "internal" as const,
				lifecycleStage: "closing",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Every document, every party, every wire — sequenced day-of closing checklist",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Closing congratulations letter (seller)",
				category: "communication" as const,
				lifecycleStage: "closing",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Sent same day as close — warm, professional; transitions to COOP stewardship relationship",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Broker commission confirmation (closing)",
				category: "communication" as const,
				lifecycleStage: "closing",
				audience: ["broker"],
				status: "gap" as const,
				description:
					"Confirms commission amount and wire timing — sent to broker on closing day",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Employee announcement template (Day 1)",
				category: "communication" as const,
				lifecycleStage: "closing",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Seller communicates ESOP to employees — plain language, no jargon, answers 'what does this mean for me'",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Press release template (optional)",
				category: "communication" as const,
				lifecycleStage: "closing",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"For sellers who want to announce publicly — positions as employee ownership milestone, not M&A",
				isRequired: false,
				requiresSignature: false,
			},

			// Post-close (8)
			{
				title: "COOP kickoff letter (to operating company)",
				category: "communication" as const,
				lifecycleStage: "post-close",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Day 121 — stewardship begins; confirms 4 tracks, schedule, Forhemit contacts, fee structure",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Monthly COOP check-in agenda",
				category: "meeting" as const,
				lifecycleStage: "post-close",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Standard agenda for monthly stewardship call — tracks progress across all 4 COOP tracks",
				isRequired: true,
				requiresSignature: false,
				isRecurring: true,
				recurrenceRule: "monthly",
			},
			{
				title: "COOP track status report (quarterly)",
				category: "communication" as const,
				lifecycleStage: "post-close",
				audience: ["seller", "trustee"],
				status: "gap" as const,
				description:
					"Written report delivered each quarter — People / Systems / Financial / Governance progress vs. plan",
				isRequired: true,
				requiresSignature: false,
				isRecurring: true,
				recurrenceRule: "quarterly",
			},
			{
				title: "Refinance trigger notification (Month 14–18)",
				category: "communication" as const,
				lifecycleStage: "post-close",
				audience: ["seller", "lender"],
				status: "gap" as const,
				description:
					"Forhemit notifies company when mandatory conventional refinance window opens — initiates lender outreach",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Seller note retirement confirmation",
				category: "communication" as const,
				lifecycleStage: "post-close",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"When seller note is paid off — formal confirmation letter to seller; closes the seller financial relationship",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "COOP completion letter (end of stewardship)",
				category: "communication" as const,
				lifecycleStage: "post-close",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Month 24 — formal close of stewardship engagement; summary of outcomes, any transition recommendations",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Employee ownership anniversary note (Year 1)",
				category: "communication" as const,
				lifecycleStage: "post-close",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Optional — sent to company on first anniversary of ESOP; reinforces stewardship relationship",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Case study request (post-close)",
				category: "communication" as const,
				lifecycleStage: "post-close",
				audience: ["seller"],
				status: "gap" as const,
				description:
					"Asks seller for permission to use the deal as an anonymized case study — used in broker and CPA outreach",
				isRequired: false,
				requiresSignature: false,
			},

			// Internal operations (10)
			{
				title: "Weekly internal deal review agenda",
				category: "internal" as const,
				lifecycleStage: "diligence",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Standing meeting format — all active deals, gate status, blockers, actions by owner",
				isRequired: false,
				requiresSignature: false,
				isRecurring: true,
				recurrenceRule: "weekly",
			},
			{
				title: "Deal file naming and folder structure guide",
				category: "internal" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "exists" as const,
				description:
					"Standard naming convention for every deal — prevents version chaos across advisors and lenders",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Vendor / advisor onboarding checklist",
				category: "internal" as const,
				lifecycleStage: "engagement",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"When adding a new trustee, counsel, or lender to the pre-vetted team — NDA, contact sheet, fee expectations",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Conflict of interest log",
				category: "internal" as const,
				lifecycleStage: "engagement",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Internal record — any situation where Forhemit's role could create ERISA or SBA independence concern",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Fee collection tracker",
				category: "internal" as const,
				lifecycleStage: "diligence",
				audience: ["internal"],
				status: "partial" as const,
				description:
					"Milestone gates → invoice trigger → payment received — per deal",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Invoice template (Forhemit → operating company)",
				category: "internal" as const,
				lifecycleStage: "diligence",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Clean, professional — references gate milestone, fee tier, payment terms",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "Wire instruction sheet (standard)",
				category: "internal" as const,
				lifecycleStage: "engagement",
				audience: ["internal", "seller"],
				status: "gap" as const,
				description:
					"Novo Bank routing/account — sent to seller / company at retainer and closing milestones",
				isRequired: true,
				requiresSignature: false,
			},
			{
				title: "New deal announcement (internal)",
				category: "internal" as const,
				lifecycleStage: "qualification",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Slack / email when a deal clears Gate 1 — names deal, EBITDA, state, deal lead",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Deal close announcement (internal)",
				category: "internal" as const,
				lifecycleStage: "closing",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"When a deal closes — names deal, proceeds, timeline achieved, lessons learned",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Lessons learned memo (post-close, internal)",
				category: "internal" as const,
				lifecycleStage: "post-close",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"What worked, what didn't, what changes for the next deal — mandatory after every close",
				isRequired: false,
				requiresSignature: false,
			},

			// Brand / admin (8)
			{
				title: "Email signature standard (all staff)",
				category: "internal" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Name, title, Forhemit, phone, email, website — consistent format across all outbound",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Out-of-office / coverage message standard",
				category: "internal" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Who to contact when Forhemit staff is unavailable — especially during active gate windows",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Meeting confirmation email template",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Sent after a call is booked — agenda, dial-in, what to bring or prepare",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "No-show / reschedule follow-up",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"When a scheduled call doesn't happen — brief, professional, one re-ask",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Thank-you email (post-call, non-deal)",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["trustee", "lender", "counsel"],
				status: "gap" as const,
				description:
					"After an ecosystem call (trustee, lender, advisor) where no deal was discussed — maintains relationship",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Complaint / dispute response template",
				category: "communication" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"If a seller, broker, or advisor raises a concern — acknowledges, owns, proposes resolution",
				isRequired: false,
				requiresSignature: false,
			},
			{
				title: "Confidentiality reminder (recurring, internal)",
				category: "internal" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "gap" as const,
				description:
					"Quarterly reminder to all team about what can and cannot be shared externally about active deals",
				isRequired: false,
				requiresSignature: false,
				isRecurring: true,
				recurrenceRule: "quarterly",
			},
			{
				title: "Style guide and writing standards one-pager",
				category: "internal" as const,
				lifecycleStage: "first-touch",
				audience: ["internal"],
				status: "partial" as const,
				description:
					"'Transaction' not 'transition' as verb; plain language for owners; technical precision for advisors; no ESOP jargon in owner-direct outreach",
				isRequired: false,
				requiresSignature: false,
			},
		];

		// Insert forms inventory
		for (const item of formsInventory) {
			await ctx.db.insert("templates", {
				...item,
				source: "forms",
				isRecurring: item.isRecurring ?? false,
				recurrenceRule: item.recurrenceRule,
				content: undefined,
				version: 1,
				createdAt: now,
				updatedAt: now,
			});
			count++;
		}

		// Insert communications inventory
		for (const item of communicationsInventory) {
			await ctx.db.insert("templates", {
				...item,
				source: "communications",
				isRecurring: item.isRecurring ?? false,
				recurrenceRule: item.recurrenceRule,
				content: undefined,
				version: 1,
				createdAt: now,
				updatedAt: now,
			});
			count++;
		}

		return { message: `Seeded ${count} templates successfully`, count };
	},
});

/**
 * Insert templates that were added to the manifest after the initial seed.
 * Safe to run multiple times — skips titles that already exist.
 */
export const seedMissing = mutation({
	args: {},
	handler: async (ctx) => {
		const now = Date.now();
		let inserted = 0;
		let skipped = 0;

		const missingTemplates = [
			{
				title: "QofE coordination request (to seller's CPA)",
				category: "communication" as const,
				lifecycleStage: "diligence",
				audience: ["cpa"],
				status: "exists" as const,
				description:
					"Requests financial data, working papers, and normalization details from CPA for independent QofE appraiser",
				isRequired: true,
				requiresSignature: false,
				source: "communications",
			},
			{
				title: "Closing tax package (for seller's CPA)",
				category: "communication" as const,
				lifecycleStage: "closing",
				audience: ["cpa"],
				status: "exists" as const,
				description:
					"Post-close tax filing package — sale proceeds, §1042 status, enclosed documents, key filing items for CPA",
				isRequired: true,
				requiresSignature: false,
				source: "communications",
			},
			{
				title: "Tax impact summary (ESOP vs third-party sale)",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["seller", "cpa"],
				status: "exists" as const,
				description:
					"Side-by-side tax comparison: ESOP + §1042 vs traditional M&A — CPA review guide with illustrative numbers",
				isRequired: true,
				requiresSignature: false,
				source: "forms",
			},
			{
				title:
					"Exit strategy benchmark (ESOP vs PE vs strategic vs succession)",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["seller"],
				status: "exists" as const,
				description:
					"Comparison of exit paths: ESOP, PE recap, strategic sale, family succession — with tax, control, timeline, and legacy factors",
				isRequired: false,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "Employee communications plan (pre- and post-close)",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["seller", "internal"],
				status: "exists" as const,
				description:
					"Phased communications plan for employees — from initial announcement through post-close ESOP education",
				isRequired: false,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "Trustee retainer agreement (company → trustee)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["trustee"],
				status: "exists" as const,
				description: "Standard retainer agreement for ESOP trustee engagement",
				isRequired: true,
				requiresSignature: true,
				source: "forms",
			},
			{
				title: "ERISA counsel retainer agreement (company → counsel)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["counsel"],
				status: "exists" as const,
				description: "Standard retainer agreement for ERISA counsel engagement",
				isRequired: true,
				requiresSignature: true,
				source: "forms",
			},
			{
				title: "Trustee RFP (formal request for proposal)",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["trustee"],
				status: "exists" as const,
				description:
					"Formal RFP for ESOP trustee services — company background, scope, evaluation criteria, timeline",
				isRequired: false,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "Turnover cost calculator — key person risk assessment",
				category: "document" as const,
				lifecycleStage: "diligence",
				audience: ["seller", "trustee", "lender"],
				status: "exists" as const,
				description:
					"Quantifies key-person departure risk — cost of turnover across recruitment, training, productivity, and institutional knowledge",
				isRequired: false,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "Fairness opinion package (trustee's financial advisor)",
				category: "document" as const,
				lifecycleStage: "diligence",
				audience: ["trustee", "seller"],
				status: "exists" as const,
				description:
					"Fairness opinion cover letter and checklist — for trustee's financial advisor to certify transaction fairness",
				isRequired: true,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "First Day as ESOP town hall agenda + employee FAQ",
				category: "document" as const,
				lifecycleStage: "closing",
				audience: ["seller", "internal"],
				status: "exists" as const,
				description:
					"Town hall agenda for Day 1 as employee-owners — celebration format, FAQ, ESOP education",
				isRequired: true,
				requiresSignature: false,
				source: "communications",
			},
			{
				title: "Trustee welcome letter to employees",
				category: "communication" as const,
				lifecycleStage: "closing",
				audience: ["trustee", "seller"],
				status: "exists" as const,
				description:
					"Welcome letter from ESOP trustee to all employee-participants — introduces trustee role, explains ESOP basics",
				isRequired: true,
				requiresSignature: false,
				source: "communications",
			},
			{
				title: "Repurchase obligation study",
				category: "document" as const,
				lifecycleStage: "post-close",
				audience: ["seller", "trustee"],
				status: "exists" as const,
				description:
					"10-year repurchase obligation projection — models diversification, distributions, terminations, and cash flow impact",
				isRequired: true,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "ESOP distribution policy",
				category: "document" as const,
				lifecycleStage: "post-close",
				audience: ["seller", "trustee"],
				status: "exists" as const,
				description:
					"Distribution policy document — timing, method, diversification rights, put options, tax withholding",
				isRequired: true,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "ESOP satisfaction survey (annual, employees)",
				category: "document" as const,
				lifecycleStage: "post-close",
				audience: ["seller", "internal"],
				status: "exists" as const,
				description:
					"Annual employee satisfaction survey — ESOP knowledge, engagement, ownership culture, suggestions",
				isRequired: false,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "ESOP head-to-head comparison",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["seller"],
				status: "exists" as const,
				description:
					"Side-by-side comparison: ESOP vs third-party sale vs PE recap vs management buyout",
				isRequired: false,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "ESOP term sheet",
				category: "document" as const,
				lifecycleStage: "engagement",
				audience: ["seller"],
				status: "exists" as const,
				description:
					"Proposed term sheet for the ESOP transaction — structure, price, payment, conditions, timeline",
				isRequired: true,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "Intro letter generator",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["broker"],
				status: "exists" as const,
				description:
					"Template for generating personalized introduction letters to brokers and referral sources",
				isRequired: false,
				requiresSignature: false,
				source: "forms",
			},
			{
				title: "ESOP qualification prompt",
				category: "document" as const,
				lifecycleStage: "qualification",
				audience: ["internal"],
				status: "exists" as const,
				description:
					"Scored assessment of ESOP qualification — 10 criteria, 0-20 scale, with pass/conditional/decline recommendation",
				isRequired: false,
				requiresSignature: false,
				source: "forms",
			},
		];

		// Use indexed lookups per title to stay under the 16 MB per-transaction read limit.
		// The "by_title" index makes each lookup O(log n) instead of loading the entire table.
		for (const item of missingTemplates) {
			const existing = await ctx.db
				.query("templates")
				.withIndex("by_title", (q) => q.eq("title", item.title))
				.first();

			if (existing) {
				skipped++;
				continue;
			}

			await ctx.db.insert("templates", {
				...item,
				isRecurring: false,
				recurrenceRule: undefined,
				content: undefined,
				version: 1,
				createdAt: now,
				updatedAt: now,
			});
			inserted++;
		}

		return {
			message: `Inserted ${inserted}, skipped ${skipped} (already exist)`,
			inserted,
			skipped,
		};
	},
});
