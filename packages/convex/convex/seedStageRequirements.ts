import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Seed stage requirements — maps templates to pipeline stages.
 * Run AFTER seedTemplates:seedAll.
 *
 * Run with: npx convex run seedStageRequirements:seedAll
 */

export const seedAll = mutation({
	args: {},
	handler: async (ctx) => {
		// Check if already seeded
		const existing = await ctx.db.query("stageRequirements").first();
		if (existing) {
			return {
				message:
					"Stage requirements already seeded. Delete existing records first if you want to re-seed.",
			};
		}

		const now = Date.now();
		let count = 0;

		// Helper to add a requirement — uses indexed lookup per title
		// instead of loading the entire templates table (avoids 16 MB read limit)
		const addReq = async (
			stage: string,
			title: string,
			audience: string[],
			order: number,
			autoCreate: boolean,
			recurrenceRule?: string,
		) => {
			const template = await ctx.db
				.query("templates")
				.withIndex("by_title", (q) => q.eq("title", title))
				.first();
			if (!template) {
				console.warn(`Template not found: "${title}"`);
				return;
			}
			const templateId = template._id;
			await ctx.db.insert("stageRequirements", {
				stage,
				templateId,
				requiredForAudience: audience,
				order,
				autoCreate,
				recurrenceRule,
			});
			count++;
		};

		// ============================================
		// FIRST CONTACT
		// ============================================
		await addReq(
			"First contact",
			"Inbound inquiry auto-response (email)",
			["seller", "broker", "partner"],
			1,
			true,
		);
		await addReq("First contact", "Deal intake form", ["internal"], 2, true);
		await addReq(
			"First contact",
			"Deal intake confirmation (internal)",
			["internal"],
			3,
			true,
		);

		// ============================================
		// INTRO CALL
		// ============================================
		await addReq(
			"Intro call",
			"Seller qualification call agenda",
			["seller"],
			1,
			true,
		);
		await addReq(
			"Intro call",
			"Broker screener / qualification form",
			["broker"],
			2,
			true,
		);
		await addReq(
			"Intro call",
			"Deal screener email (broker → Forhemit)",
			["broker"],
			3,
			true,
		);

		// ============================================
		// NDA SENT
		// ============================================
		await addReq(
			"NDA sent",
			"NDA (mutual — deal team)",
			["seller", "broker", "trustee", "counsel"],
			1,
			true,
		);
		await addReq(
			"NDA sent",
			"Pre-flight checklist (signed by seller + Forhemit)",
			["seller"],
			2,
			true,
		);
		await addReq(
			"NDA sent",
			"Pre-flight checklist cover letter (to seller)",
			["seller"],
			3,
			true,
		);
		await addReq(
			"NDA sent",
			"Conditional go letter (pre-flight)",
			["seller"],
			4,
			false,
		);
		await addReq(
			"NDA sent",
			"Pre-flight checklist (internal version)",
			["internal"],
			5,
			true,
		);

		// ============================================
		// FEASIBILITY
		// ============================================
		await addReq(
			"Feasibility",
			"Engagement letter (Forhemit → seller)",
			["seller"],
			1,
			true,
		);
		await addReq(
			"Feasibility",
			"Engagement letter cover email (to seller)",
			["seller"],
			2,
			true,
		);
		await addReq(
			"Feasibility",
			"Engagement letter (seller-facing)",
			["seller"],
			3,
			true,
		);
		await addReq(
			"Feasibility",
			"Transaction cost disclosure",
			["seller"],
			4,
			true,
		);
		await addReq("Feasibility", "Offer summary (V3)", ["seller"], 5, true);
		await addReq("Feasibility", "Honest Review document", ["seller"], 6, false);
		await addReq("Feasibility", "120-day calendar", ["seller"], 7, true);
		await addReq(
			"Feasibility",
			"Seller FAQ / plain-language guide",
			["seller"],
			8,
			true,
		);
		await addReq(
			"Feasibility",
			"Board resolution package",
			["seller"],
			9,
			true,
		);
		await addReq(
			"Feasibility",
			"Roles & independence matrix",
			["seller", "trustee", "counsel"],
			10,
			true,
		);
		await addReq(
			"Feasibility",
			"Seller document request list",
			["seller"],
			11,
			true,
		);
		await addReq(
			"Feasibility",
			"LLC-to-C-corp conversion checklist",
			["internal"],
			12,
			true,
		);
		await addReq(
			"Feasibility",
			"Deal team kick-off memo (internal)",
			["internal"],
			13,
			true,
		);
		await addReq(
			"Feasibility",
			"Seller onboarding email — Day 1: Welcome + what to expect",
			["seller"],
			14,
			true,
		);
		await addReq(
			"Feasibility",
			"Seller onboarding email — Day 2: Document request list",
			["seller"],
			15,
			true,
		);
		await addReq(
			"Feasibility",
			"Seller onboarding email — Day 3: Calendar link",
			["seller"],
			16,
			true,
		);
		await addReq(
			"Feasibility",
			"Seller onboarding email — Day 4: Team introduction",
			["seller"],
			17,
			true,
		);
		await addReq(
			"Feasibility",
			"Seller onboarding email — Day 5: First check-in",
			["seller"],
			18,
			true,
		);
		await addReq(
			"Feasibility",
			"Broker deal acceptance email",
			["broker"],
			19,
			true,
		);
		await addReq(
			"Feasibility",
			"SBA lender outreach brief (one-pager)",
			["lender"],
			20,
			true,
		);
		await addReq("Feasibility", "SBA intake form", ["lender"], 21, true);
		await addReq(
			"Feasibility",
			"SBA lender introduction package cover email",
			["lender"],
			22,
			true,
		);
		await addReq(
			"Feasibility",
			"Advisor introduction email (trustee)",
			["trustee"],
			23,
			true,
		);
		await addReq(
			"Feasibility",
			"Advisor introduction email (ERISA counsel)",
			["counsel"],
			24,
			true,
		);
		await addReq(
			"Feasibility",
			"Trustee engagement memo (introduction letter)",
			["trustee"],
			25,
			true,
		);
		await addReq(
			"Feasibility",
			"ERISA counsel RFP / conflict check request",
			["counsel"],
			26,
			true,
		);
		await addReq(
			"Feasibility",
			"Dream team roster + mini-RFP",
			["internal"],
			27,
			true,
		);
		await addReq(
			"Feasibility",
			"Retainer agreement (company → ERISA counsel)",
			["counsel"],
			28,
			true,
		);
		await addReq(
			"Feasibility",
			"Retainer agreement (company → trustee)",
			["trustee"],
			29,
			true,
		);
		await addReq(
			"Feasibility",
			"Letter of intent (LOI) template",
			["seller"],
			30,
			true,
		);
		await addReq("Feasibility", "LOI transmittal letter", ["seller"], 31, true);
		await addReq(
			"Feasibility",
			"Wire instruction sheet (standard)",
			["internal", "seller"],
			32,
			true,
		);
		await addReq(
			"Feasibility",
			"Capital stack summary (lender package cover)",
			["lender"],
			33,
			true,
		);
		await addReq(
			"Feasibility",
			"Lender qualification interview questions",
			["lender"],
			34,
			false,
		);
		await addReq("Feasibility", "Lender scoring rubric", ["lender"], 35, false);
		await addReq(
			"Feasibility",
			"Repayment / amortization model",
			["lender"],
			36,
			true,
		);
		await addReq(
			"Feasibility",
			"EIDL lien resolution tracker",
			["internal"],
			37,
			false,
		);

		// ============================================
		// TERM SHEET
		// ============================================
		await addReq(
			"Term sheet",
			"Gate 1 passage confirmation (internal + seller)",
			["seller", "internal"],
			1,
			true,
		);
		await addReq(
			"Term sheet",
			"Weekly deal status update (seller-facing)",
			["seller"],
			2,
			true,
			"weekly",
		);
		await addReq(
			"Term sheet",
			"Weekly deal status update (broker-facing)",
			["broker"],
			3,
			false,
			"weekly",
		);
		await addReq(
			"Term sheet",
			"Lender update email (during underwriting)",
			["lender"],
			4,
			true,
			"weekly",
		);
		await addReq(
			"Term sheet",
			"Trustee update memo (during appraisal)",
			["trustee"],
			5,
			false,
		);
		await addReq(
			"Term sheet",
			"Gate tracking dashboard",
			["internal"],
			6,
			false,
		);
		await addReq("Term sheet", "Lender Q&A tracker", ["lender"], 7, false);
		await addReq(
			"Term sheet",
			"Valuation firm briefing memo",
			["trustee"],
			8,
			true,
		);
		await addReq(
			"Term sheet",
			"Turnover cost calculator",
			["internal"],
			9,
			false,
		);
		await addReq(
			"Term sheet",
			"Deal economics model (internal)",
			["internal"],
			10,
			true,
		);
		await addReq(
			"Term sheet",
			"Broker pipeline status update template",
			["broker"],
			11,
			false,
			"weekly",
		);

		// ============================================
		// LOI SIGNED
		// ============================================
		await addReq(
			"LOI signed",
			"Gate 2 passage confirmation (internal + seller)",
			["seller", "internal"],
			1,
			true,
		);
		await addReq(
			"LOI signed",
			"Gate 3 passage confirmation (internal + seller)",
			["seller", "internal"],
			2,
			true,
		);
		await addReq(
			"LOI signed",
			"QofE findings memo (internal)",
			["internal"],
			3,
			true,
		);
		await addReq(
			"LOI signed",
			"Intercreditor agreement template",
			["lender"],
			4,
			false,
		);
		await addReq(
			"LOI signed",
			"Broker NDA / confidentiality agreement",
			["broker"],
			5,
			true,
		);
		await addReq("LOI signed", "Referral fee agreement", ["broker"], 6, false);
		await addReq(
			"LOI signed",
			"Invoice template (Forhemit → operating company)",
			["internal"],
			7,
			true,
		);
		await addReq(
			"LOI signed",
			"Fee collection tracker",
			["internal"],
			8,
			false,
		);
		await addReq(
			"LOI signed",
			"Conflict of interest log",
			["internal"],
			9,
			false,
		);
		await addReq(
			"LOI signed",
			"Vendor / advisor onboarding checklist",
			["internal"],
			10,
			false,
		);
		await addReq(
			"LOI signed",
			"§1042 rollover explainer (seller's CPA version)",
			["seller", "cpa"],
			11,
			false,
		);
		await addReq(
			"LOI signed",
			"Net proceeds calculator (interactive)",
			["seller"],
			12,
			false,
		);

		// ============================================
		// CLOSED
		// ============================================
		await addReq(
			"Closed",
			"Gate 4 / legal clearance memo (internal)",
			["internal"],
			1,
			true,
		);
		await addReq(
			"Closed",
			"Closing date confirmation (seller)",
			["seller"],
			2,
			true,
		);
		await addReq(
			"Closed",
			"Closing checklist (deal team)",
			["internal"],
			3,
			true,
		);
		await addReq(
			"Closed",
			"Closing congratulations letter (seller)",
			["seller"],
			4,
			true,
		);
		await addReq(
			"Closed",
			"Broker commission confirmation (closing)",
			["broker"],
			5,
			true,
		);
		await addReq(
			"Closed",
			"Employee announcement template (Day 1)",
			["seller"],
			6,
			true,
		);
		await addReq(
			"Closed",
			"Press release template (optional)",
			["seller"],
			7,
			false,
		);
		await addReq(
			"Closed",
			"New deal announcement (internal)",
			["internal"],
			8,
			false,
		);
		await addReq(
			"Closed",
			"Deal close announcement (internal)",
			["internal"],
			9,
			false,
		);
		await addReq("Closed", "COOP stewardship agreement", ["seller"], 10, true);

		// ============================================
		// POST-CLOSE (stewardship)
		// ============================================
		await addReq(
			"Closed",
			"COOP kickoff letter (to operating company)",
			["seller"],
			11,
			true,
		);
		await addReq(
			"Closed",
			"COOP intake forms (Track 1 People, Track 2 Systems)",
			["internal"],
			12,
			true,
		);
		await addReq(
			"Closed",
			"COOP delivery tracker (V1.0 – V4.0)",
			["internal"],
			13,
			false,
		);
		await addReq(
			"Closed",
			"Monthly COOP check-in agenda",
			["seller"],
			14,
			true,
			"monthly",
		);
		await addReq(
			"Closed",
			"COOP track status report (quarterly)",
			["seller", "trustee"],
			15,
			true,
			"quarterly",
		);
		await addReq(
			"Closed",
			"Refinance trigger notification (Month 14–18)",
			["seller", "lender"],
			16,
			false,
		);
		await addReq(
			"Closed",
			"Seller note retirement confirmation",
			["seller"],
			17,
			false,
		);
		await addReq(
			"Closed",
			"COOP completion letter (end of stewardship)",
			["seller"],
			18,
			true,
		);
		await addReq(
			"Closed",
			"Employee ownership anniversary note (Year 1)",
			["seller"],
			19,
			false,
		);
		await addReq(
			"Closed",
			"Case study request (post-close)",
			["seller"],
			20,
			false,
		);
		await addReq(
			"Closed",
			"Lessons learned memo (post-close, internal)",
			["internal"],
			21,
			false,
		);

		return {
			message: `Seeded ${count} stage requirements successfully`,
			count,
		};
	},
});
