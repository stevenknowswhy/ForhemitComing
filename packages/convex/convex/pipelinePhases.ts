import { query } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";

/**
 * Pipeline phase statistics based on the 120-Day ESOP Transaction Roadmap.
 *
 * 5 Phases: Ignition (1-14), Build (15-45), Validate (46-75), Close Prep (76-105), Closing (106-120)
 * 4 Hard Gates: FMV (D45), Lender (D60), QofE EBITDA (D75), COOP (D90)
 */
export const getPhaseStats = query({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx);
		const companies = await ctx.db.query("crmCompanies").collect();

		// Only count active deals (not Dead or On hold)
		const active = companies.filter(
			(c) => c.stage !== "Dead" && c.stage !== "On hold",
		);

		// Phase 1: IGNITION (Days 1-14)
		// Track: Retainer paid, COOP intake, QofE ordered, Trustee retained, Data room
		const ignitionCompanies = active.filter((c) =>
			["First contact", "Intro call", "NDA sent"].includes(c.stage ?? ""),
		);
		const hasRetainer = (c: any) => c.fees?.retainer?.status === "paid";
		const hasNDA = (c: any) =>
			c.ndaStatus === "Signed" ||
			c.stage === "NDA sent" ||
			c.stage === "Intro call";

		// Phase 2: BUILD (Days 15-45)
		// Track: QofE fieldwork, COOP v2, Lender package, FMV appraisal, Gate 1
		const buildCompanies = active.filter((c) => c.stage === "Feasibility");
		const hasGate1 = (c: any) => c.gates?.gate1?.passed;

		// Phase 3: VALIDATE (Days 46-75)
		// Track: LOI executed, ESOP plan, Final underwriting, Gate 2, Gate 3
		const validateCompanies = active.filter((c) => c.stage === "Term sheet");
		const hasGate2 = (c: any) => c.gates?.gate2?.passed;
		const hasGate3 = (c: any) => c.gates?.gate3?.passed;

		// Phase 4: CLOSE PREP (Days 76-105)
		// Track: PSA drafting, Employment agreement, Consents, COOP v4, Gate 4
		const closePrepCompanies = active.filter((c) => c.stage === "LOI signed");
		const hasGate4 = (c: any) => c.gates?.gate4?.passed;

		// Phase 5: CLOSING (Days 106-120)
		// Track: Title search, Wire protocol, Lender auth, Day 121 readiness, Closed
		const closingCompanies = active.filter((c) => c.stage === "Closed");

		// Helper: count companies matching a predicate
		const countWhere = (list: any[], fn: (c: any) => boolean) =>
			list.filter(fn).length;

		return {
			phases: [
				{
					key: "ignition",
					label: "Ignition",
					subtitle: "Days 1–14",
					color: "#5A7A5A",
					count: ignitionCompanies.length,
					categories: [
						{
							name: "Engagement Secured",
							done: countWhere(ignitionCompanies, hasRetainer),
							total: ignitionCompanies.length,
						},
						{
							name: "120-Day Calendar",
							done: countWhere(ignitionCompanies, hasNDA),
							total: ignitionCompanies.length,
						},
						{
							name: "Team Seated",
							done: countWhere(
								ignitionCompanies,
								(c) => c.stage === "NDA sent",
							),
							total: ignitionCompanies.length,
						},
						{
							name: "Data Room",
							done: countWhere(
								ignitionCompanies,
								(c) => c.stage === "NDA sent",
							),
							total: ignitionCompanies.length,
						},
						{
							name: "COOP v1.0",
							done: countWhere(
								ignitionCompanies,
								(c) => c.stage === "NDA sent",
							),
							total: ignitionCompanies.length,
						},
					],
				},
				{
					key: "build",
					label: "Build",
					subtitle: "Days 15–45",
					color: "#B87D5E",
					count: buildCompanies.length,
					categories: [
						{
							name: "QofE Fieldwork",
							done: countWhere(buildCompanies, (c) => hasGate1(c)),
							total: buildCompanies.length,
						},
						{
							name: "Lender Package",
							done: countWhere(buildCompanies, (c) => hasGate1(c)),
							total: buildCompanies.length,
						},
						{
							name: "FMV Appraisal",
							done: countWhere(buildCompanies, (c) => hasGate1(c)),
							total: buildCompanies.length,
						},
						{
							name: "COOP v2.0",
							done: countWhere(buildCompanies, (c) => hasGate1(c)),
							total: buildCompanies.length,
						},
						{
							name: "Gate 1: FMV",
							done: countWhere(buildCompanies, (c) => hasGate1(c)),
							total: buildCompanies.length,
						},
					],
				},
				{
					key: "validate",
					label: "Validate",
					subtitle: "Days 46–75",
					color: "#C49A3C",
					count: validateCompanies.length,
					categories: [
						{
							name: "LOI Executed",
							done: countWhere(
								validateCompanies,
								(c) => c.stage === "Term sheet",
							),
							total: validateCompanies.length,
						},
						{
							name: "ESOP Plan Draft",
							done: countWhere(validateCompanies, (c) => hasGate2(c)),
							total: validateCompanies.length,
						},
						{
							name: "Gate 2: Lender",
							done: countWhere(validateCompanies, (c) => hasGate2(c)),
							total: validateCompanies.length,
						},
						{
							name: "Gate 3: QofE",
							done: countWhere(validateCompanies, (c) => hasGate3(c)),
							total: validateCompanies.length,
						},
						{
							name: "Seller Note",
							done: countWhere(validateCompanies, (c) => hasGate3(c)),
							total: validateCompanies.length,
						},
					],
				},
				{
					key: "closeprep",
					label: "Close Prep",
					subtitle: "Days 76–105",
					color: "#D4763A",
					count: closePrepCompanies.length,
					categories: [
						{
							name: "PSA Final Draft",
							done: countWhere(closePrepCompanies, (c) => hasGate4(c)),
							total: closePrepCompanies.length,
						},
						{
							name: "Employment Agree.",
							done: countWhere(closePrepCompanies, (c) => hasGate4(c)),
							total: closePrepCompanies.length,
						},
						{
							name: "Landlord Consents",
							done: countWhere(closePrepCompanies, (c) => hasGate4(c)),
							total: closePrepCompanies.length,
						},
						{
							name: "COOP v4.0 Final",
							done: countWhere(closePrepCompanies, (c) => hasGate4(c)),
							total: closePrepCompanies.length,
						},
						{
							name: "Gate 4: COOP",
							done: countWhere(closePrepCompanies, (c) => hasGate4(c)),
							total: closePrepCompanies.length,
						},
					],
				},
				{
					key: "closing",
					label: "Closing",
					subtitle: "Days 106–120",
					color: "#8A5A2A",
					count: closingCompanies.length,
					categories: [
						{
							name: "Title / Lien",
							done: closingCompanies.length,
							total: closingCompanies.length,
						},
						{
							name: "Wire Verified",
							done: closingCompanies.length,
							total: closingCompanies.length,
						},
						{
							name: "Lender Funded",
							done: closingCompanies.length,
							total: closingCompanies.length,
						},
						{
							name: "Day 121 Ready",
							done: closingCompanies.length,
							total: closingCompanies.length,
						},
						{
							name: "Closed",
							done: closingCompanies.length,
							total: closingCompanies.length,
						},
					],
				},
			],
			gates: [
				{
					day: 45,
					label: "FMV Adequacy",
					passed: companies.filter((c) => c.gates?.gate1?.passed).length,
					total: active.length,
				},
				{
					day: 60,
					label: "Lender Commitment",
					passed: companies.filter((c) => c.gates?.gate2?.passed).length,
					total: active.length,
				},
				{
					day: 75,
					label: "QofE Validation",
					passed: companies.filter((c) => c.gates?.gate3?.passed).length,
					total: active.length,
				},
				{
					day: 90,
					label: "COOP Sign-off",
					passed: companies.filter((c) => c.gates?.gate4?.passed).length,
					total: active.length,
				},
			],
			totals: {
				active: active.length,
				total: companies.length,
				closed: closingCompanies.length,
			},
		};
	},
});
