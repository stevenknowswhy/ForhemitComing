/**
 * Seed Transition Journal
 *
 * Creates a fully-populated mock transition journal for Sunrise Manufacturing.
 * Includes company, journal, 2 chapters, 15 entries across 2 weeks,
 * and a narrative for the current week.
 *
 * Usage: npx convex run journalSeed:seedTransitionJournal
 */

import { mutation } from "./_generated/server";

// ── Week helpers ────────────────────────────────────────────────────────────

function getWeekStarting(date: Date = new Date()): number {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1);
	d.setDate(diff);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

// ── Seed Data ───────────────────────────────────────────────────────────────

const COMPANY = {
	name: "Sunrise Manufacturing Co.",
	industry: "Manufacturing",
	size: "180 employees",
	revenue: "$28M",
	stage: "Feasibility" as const,
	ndaStatus: "Signed" as const,
};

// Current week: Monday–Sunday
const THIS_WEEK = getWeekStarting();
const LAST_WEEK = THIS_WEEK - 7 * 86400000;

interface SeedEntry {
	title: string;
	description: string;
	clientDescription?: string;
	outcome?: string;
	entryType:
		| "work"
		| "call"
		| "meeting"
		| "email"
		| "document"
		| "signature"
		| "notification"
		| "due_item"
		| "milestone"
		| "issue"
		| "decision"
		| "note";
	theme:
		| "legal"
		| "finance"
		| "trustee_bank"
		| "hr_comms"
		| "governance"
		| "tax"
		| "signing"
		| "admin";
	effortBand?: "low" | "medium" | "high" | "spike";
	visibleToClient: boolean;
	chapter: string;
	chapterNumber: number;
	daysOffset: number; // days from week start
}

// Last week's entries (Chapter 1: Ignition)
const LAST_WEEK_ENTRIES: SeedEntry[] = [
	{
		title: "Retainer Agreement Signed",
		description:
			"Sunrise Manufacturing executed the retainer agreement. Engagement officially commenced. Retainer fee of $25,000 received.",
		clientDescription:
			"Your retainer agreement has been signed and the engagement is now officially underway.",
		outcome: "Engagement secured — $25K retainer received",
		entryType: "milestone",
		theme: "finance",
		effortBand: "low",
		visibleToClient: true,
		chapter: "Ignition",
		chapterNumber: 1,
		daysOffset: 0,
	},
	{
		title: "ESOP Counsel Engagement Call",
		description:
			"Introductory call with Morrison & Partners (ESOP counsel). Discussed timeline, fiduciary requirements, and initial legal review scope. They will begin document review next week.",
		clientDescription:
			"Met with your ESOP legal counsel to align on timeline and document requirements.",
		entryType: "call",
		theme: "legal",
		effortBand: "medium",
		visibleToClient: true,
		chapter: "Ignition",
		chapterNumber: 1,
		daysOffset: 1,
	},
	{
		title: "Trustee Introduction",
		description:
			"Introduced First National Trust as the independent trustee. They reviewed the preliminary deal structure and confirmed availability for the Q3 timeline.",
		clientDescription:
			"Connected with your independent trustee to align on the transaction timeline.",
		entryType: "call",
		theme: "trustee_bank",
		effortBand: "low",
		visibleToClient: true,
		chapter: "Ignition",
		chapterNumber: 1,
		daysOffset: 2,
	},
	{
		title: "Data Room Setup",
		description:
			"Created the secure data room in Box.com. Uploaded initial document request list. Client will begin populating financial statements and HR records.",
		clientDescription:
			"Your secure document folder has been set up. You'll receive a link to access it shortly.",
		entryType: "work",
		theme: "admin",
		effortBand: "medium",
		visibleToClient: true,
		chapter: "Ignition",
		chapterNumber: 1,
		daysOffset: 2,
	},
	{
		title: "120-Day Calendar Published",
		description:
			"Shared the 120-day transaction roadmap with all parties. Key milestones and gate dates confirmed. Next checkpoint: Day 14 (team seated).",
		clientDescription:
			"Your 120-day transaction calendar has been published and shared with all parties.",
		outcome: "Calendar aligned — all parties confirmed key dates",
		entryType: "document",
		theme: "governance",
		effortBand: "low",
		visibleToClient: true,
		chapter: "Ignition",
		chapterNumber: 1,
		daysOffset: 3,
	},
	{
		title: "Internal: Counsel fee negotiation",
		description:
			"Morrison & Partners quoted $45K for full ESOP legal work. Negotiated down to $38K with milestone-based billing. Saved client $7K.",
		entryType: "note",
		theme: "legal",
		effortBand: "low",
		visibleToClient: false,
		chapter: "Ignition",
		chapterNumber: 1,
		daysOffset: 3,
	},
	{
		title: "Team Seating Complete",
		description:
			"All 7 transaction roles confirmed: Broker (Forhemit), CPA (Westfield Advisors), ESOP Counsel (Morrison & Partners), Lender (First Republic), Trustee (First National), Owner/Seller, Legal (in-house). Gate 0 passed.",
		clientDescription:
			"Your full transaction team is now seated. All key roles have been confirmed and aligned.",
		outcome: "Team seated — Gate 0 passed",
		entryType: "milestone",
		theme: "governance",
		effortBand: "high",
		visibleToClient: true,
		chapter: "Ignition",
		chapterNumber: 1,
		daysOffset: 5,
	},
];

// This week's entries (Chapter 2: Build)
const THIS_WEEK_ENTRIES: SeedEntry[] = [
	{
		title: "QofE Fieldwork Kickoff",
		description:
			"Westfield Advisors began Quality of Earnings fieldwork. Spent 3 hours with the CFO reviewing 3 years of financials. Initial EBITDA range: $3.2M–$3.8M. More work needed on add-backs.",
		clientDescription:
			"Your CPA team began the Quality of Earnings analysis. They're reviewing 3 years of financial statements to establish a defensible earnings baseline.",
		entryType: "meeting",
		theme: "finance",
		effortBand: "high",
		visibleToClient: true,
		chapter: "Build",
		chapterNumber: 2,
		daysOffset: 0,
	},
	{
		title: "NDA Review — Updated Terms",
		description:
			"Reviewed updated mutual NDA with revised non-solicitation clause. Client requested 12-month restriction instead of 18. Approved with counsel sign-off.",
		clientDescription:
			"Reviewed and updated the mutual NDA. Key terms have been adjusted based on your feedback.",
		outcome: "NDA approved — 12-month non-solicitation agreed",
		entryType: "document",
		theme: "legal",
		effortBand: "medium",
		visibleToClient: true,
		chapter: "Build",
		chapterNumber: 2,
		daysOffset: 1,
	},
	{
		title: "FMV Appraisal Scope Call",
		description:
			"Called Anderson Valuation to scope the Fair Market Value appraisal. They need: 5 years of tax returns, asset depreciation schedule, real estate appraisal (if applicable). Timeline: 30 days from document receipt.",
		clientDescription:
			"Initiated the Fair Market Value appraisal process. The appraiser has outlined required documents and a 30-day timeline.",
		entryType: "call",
		theme: "finance",
		effortBand: "medium",
		visibleToClient: true,
		chapter: "Build",
		chapterNumber: 2,
		daysOffset: 2,
	},
	{
		title: "Tax Structure Discussion",
		description:
			"Met with tax advisor to review S-corp to C-corp conversion timing. Recommended converting 60 days before closing for optimal treatment. Estimated tax savings: $47K through proper structuring.",
		clientDescription:
			"Reviewed tax structure options with your advisor. We've identified a strategy that could save approximately $47K in taxes.",
		outcome: "Identified $47K in potential tax savings",
		entryType: "meeting",
		theme: "tax",
		effortBand: "high",
		visibleToClient: true,
		chapter: "Build",
		chapterNumber: 2,
		daysOffset: 3,
	},
	{
		title: "Board Resolution Draft",
		description:
			"Prepared initial board resolution authorizing the ESOP transaction. Template from Morrison & Partners, customized for Sunrise's bylaws. Pending board vote at next meeting.",
		clientDescription:
			"Prepared the board resolution authorizing the ESOP transaction for review.",
		entryType: "document",
		theme: "signing",
		effortBand: "medium",
		visibleToClient: true,
		chapter: "Build",
		chapterNumber: 2,
		daysOffset: 3,
	},
	{
		title: "Lender Package — Draft Review",
		description:
			"Completed first draft of the lender package for First Republic. Includes: executive summary, financial highlights, deal structure, projected cash flows. Sending for internal review before submission.",
		clientDescription:
			"Completed the first draft of the lending package. It's undergoing internal review before submission to the lender.",
		entryType: "document",
		theme: "finance",
		effortBand: "high",
		visibleToClient: true,
		chapter: "Build",
		chapterNumber: 2,
		daysOffset: 4,
	},
	{
		title: "Weekly Status Call — Owner/Seller",
		description:
			"30-minute check-in with the owner. Discussed QofE progress, upcoming document requests, and timeline. Owner is engaged and responsive. No blockers.",
		clientDescription:
			"Had a weekly check-in call to discuss progress and upcoming milestones.",
		entryType: "call",
		theme: "hr_comms",
		effortBand: "low",
		visibleToClient: true,
		chapter: "Build",
		chapterNumber: 2,
		daysOffset: 5,
	},
	{
		title: "Internal: Lender concern about leverage ratio",
		description:
			"First Republic expressed concern about the proposed leverage ratio (4.2x EBITDA). Need to bring this down to 3.5x or less. Options: seller note, earnout structure, or SBA 7(a) supplement. Will discuss with team Monday.",
		entryType: "note",
		theme: "finance",
		effortBand: "low",
		visibleToClient: false,
		chapter: "Build",
		chapterNumber: 2,
		daysOffset: 5,
	},
];

// ── Narrative ───────────────────────────────────────────────────────────────

const NARRATIVE_TEXT = `<h2>Week in Review</h2>
<p>This was a productive week on the Build track. We kicked off the Quality of Earnings fieldwork with Westfield Advisors and made significant progress on multiple fronts.</p>
<h3>Key Highlights</h3>
<ul>
<li><strong>QofE Fieldwork Started</strong> — Your CPA team spent 3 hours with the CFO reviewing financials. Initial EBITDA range is $3.2M–$3.8M. They'll need a few more sessions to finalize add-backs.</li>
<li><strong>$47K Tax Savings Identified</strong> — Our tax review uncovered a structuring opportunity through S-corp to C-corp conversion timing. This is real money back to you at closing.</li>
<li><strong>NDA Finalized</strong> — The mutual NDA has been updated and approved with the revised terms you requested.</li>
<li><strong>Lender Package Drafted</strong> — First draft of the lending package is complete and under internal review. We'll submit to First Republic early next week.</li>
</ul>
<h3>What's Next</h3>
<p>Next week we'll focus on completing the QofE fieldwork, submitting the lender package, and beginning the FMV appraisal document collection. The board resolution is ready for your review — we'll schedule a call to walk through it.</p>
<p>As always, if you have any questions about any of this, don't hesitate to reach out.</p>`;

// ── Main Seed Mutation ──────────────────────────────────────────────────────

export const seedTransitionJournal = mutation({
	args: {},
	handler: async (ctx) => {
		// 1. Create company
		const companyId = await ctx.db.insert("crmCompanies", {
			name: COMPANY.name,
			industry: COMPANY.industry,
			size: COMPANY.size,
			revenue: COMPANY.revenue,
			stage: COMPANY.stage,
			ndaStatus: COMPANY.ndaStatus,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		// 2. Create journal
		const journalId = await ctx.db.insert("clientJournals", {
			clientId: companyId,
			journalType: "transition",
			currentChapter: "Build",
			chapterNumber: 2,
			status: "active",
			clientTimezone: "America/Los_Angeles",
			deliveryDay: "Tuesday",
			deliveryHour: 9,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		// 3. Create chapters
		await ctx.db.insert("journalChapters", {
			journalId,
			chapterNumber: 1,
			title: "Ignition",
			description: "Engagement secured, team seated, data room, COOP v1.0",
			status: "completed",
			startedAt: LAST_WEEK,
			completedAt: THIS_WEEK - 86400000,
			closeSummaryGenerated: false,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		await ctx.db.insert("journalChapters", {
			journalId,
			chapterNumber: 2,
			title: "Build",
			description: "QofE fieldwork, lender package, FMV appraisal, Gate 1",
			status: "active",
			startedAt: THIS_WEEK,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			closeSummaryGenerated: false,
		});

		// 4. Seed last week's entries
		for (const entry of LAST_WEEK_ENTRIES) {
			await ctx.db.insert("journalEntries", {
				journalId,
				clientId: companyId,
				title: entry.title,
				description: entry.description,
				clientDescription: entry.clientDescription,
				outcome: entry.outcome,
				entryType: entry.entryType,
				theme: entry.theme,
				status: "completed",
				effortBand: entry.effortBand,
				performedBy: "account-lead",
				visibleToClient: entry.visibleToClient,
				sensitivity: entry.visibleToClient ? "low" : "medium",
				internalNote: entry.visibleToClient ? undefined : entry.description,
				isAutoGenerated: false,
				chapter: entry.chapter,
				chapterNumber: entry.chapterNumber,
				occurredAt: LAST_WEEK + entry.daysOffset * 86400000,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		}

		// 5. Seed this week's entries
		for (const entry of THIS_WEEK_ENTRIES) {
			await ctx.db.insert("journalEntries", {
				journalId,
				clientId: companyId,
				title: entry.title,
				description: entry.description,
				clientDescription: entry.clientDescription,
				outcome: entry.outcome,
				entryType: entry.entryType,
				theme: entry.theme,
				status: "completed",
				effortBand: entry.effortBand,
				performedBy: "account-lead",
				visibleToClient: entry.visibleToClient,
				sensitivity: entry.visibleToClient ? "low" : "medium",
				internalNote: entry.visibleToClient ? undefined : entry.description,
				isAutoGenerated: false,
				chapter: entry.chapter,
				chapterNumber: entry.chapterNumber,
				occurredAt: THIS_WEEK + entry.daysOffset * 86400000,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		}

		// 6. Create narrative for this week
		const narrativeId = await ctx.db.insert("journalNarratives", {
			journalId,
			clientId: companyId,
			weekStarting: THIS_WEEK,
			weekEnding: THIS_WEEK + 6 * 86400000,
			narrativeText: NARRATIVE_TEXT,
			authorId: "admin",
			authorName: "Stefano Stokes",
			status: "draft",
			usedFallback: false,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		return {
			companyId,
			journalId,
			narrativeId,
			companyName: COMPANY.name,
			entriesCount: LAST_WEEK_ENTRIES.length + THIS_WEEK_ENTRIES.length,
			chaptersCount: 2,
		};
	},
});
