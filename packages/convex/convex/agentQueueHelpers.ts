import type { Id } from "./_generated/dataModel";
import type { QueryCtx, MutationCtx } from "./_generated/server";

type StageName =
	| "First contact"
	| "Intro call"
	| "NDA sent"
	| "Feasibility"
	| "Term sheet"
	| "LOI signed"
	| "Closed"
	| "On hold"
	| "Dead";

/**
 * Build a JSON context snapshot of the deal for agent consumption.
 * Queries contacts and recent activities to give the agent full context.
 */
export async function buildDealContextSnapshot(
	ctx: QueryCtx | MutationCtx,
	companyId: Id<"crmCompanies">,
	newStage: StageName,
	oldStage: string,
	timestamp: number,
): Promise<string> {
	const company = await ctx.db.get(companyId);
	if (!company) throw new Error("Company not found during snapshot build");

	const contacts = await ctx.db
		.query("crmContacts")
		.withIndex("by_company", (q) => q.eq("companyId", companyId))
		.collect();

	const recentActivities = await ctx.db
		.query("crmActivities")
		.withIndex("by_company_date", (q) => q.eq("companyId", companyId))
		.order("desc")
		.take(20);

	return JSON.stringify({
		company: {
			id: company._id,
			name: company.name,
			industry: company.industry,
			size: company.size,
			revenue: company.revenue,
			stage: newStage,
			ndaStatus: company.ndaStatus,
			notes: company.notes,
		},
		contacts: contacts.map((c) => ({
			name: `${c.firstName} ${c.lastName}`,
			email: c.email,
			phone: c.phone,
			role: c.role,
			isPrimary: c.isPrimary,
		})),
		recentActivities: recentActivities.map((a) => ({
			type: a.type,
			title: a.title,
			description: a.description,
			date: a.date,
		})),
		stageTransition: {
			from: oldStage,
			to: newStage,
			timestamp,
		},
	});
}

/**
 * Log a stage change as a CRM activity.
 */
export async function logStageChange(
	ctx: MutationCtx,
	companyId: Id<"crmCompanies">,
	oldStage: string,
	newStage: string,
	performedBy: string | undefined,
	timestamp: number,
): Promise<void> {
	await ctx.db.insert("crmActivities", {
		companyId,
		type: "stage_change",
		title: "Stage changed",
		description: `Stage moved from "${oldStage}" to "${newStage}"`,
		date: new Date(timestamp).toISOString().split("T")[0],
		performedBy,
		metadata: {
			oldStage,
			newStage,
		},
		createdAt: timestamp,
	});
}
