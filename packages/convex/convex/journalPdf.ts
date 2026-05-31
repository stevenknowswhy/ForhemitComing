import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

declare const process: { env: { [key: string]: string | undefined } };

// ── Week helpers ────────────────────────────────────────────────────────────

function getWeekStarting(date: Date = new Date()): number {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1);
	d.setDate(diff);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

function formatLabel(s: string): string {
	return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Fallback narrative generator ────────────────────────────────────────────

function generateFallbackNarrative(
	entries: Array<{
		entryType: string;
		theme: string;
		title: string;
		description: string;
		clientDescription?: string;
		outcome?: string;
	}>,
	metrics: {
		touchpoints: {
			calls: number;
			emails: number;
			documents: number;
			meetings: number;
			total: number;
		};
	},
	journalType: string,
): string {
	const lines: string[] = [];
	const type = journalType === "transition" ? "transition" : "stewardship";
	lines.push(
		`This week on the ${type} track, the Forhemit team completed ${entries.length} activities across the engagement.`,
	);

	// Highlight touchpoints
	const { calls, meetings, documents, emails } = metrics.touchpoints;
	const parts: string[] = [];
	if (calls > 0) parts.push(`${calls} call${calls > 1 ? "s" : ""}`);
	if (meetings > 0) parts.push(`${meetings} meeting${meetings > 1 ? "s" : ""}`);
	if (documents > 0)
		parts.push(`${documents} document${documents > 1 ? "s" : ""}`);
	if (emails > 0) parts.push(`${emails} notification${emails > 1 ? "s" : ""}`);
	if (parts.length > 0) {
		lines.push(`Key touchpoints included ${parts.join(", ")}.`);
	}

	// Highlight outcomes
	const withOutcomes = entries.filter((e) => e.outcome);
	if (withOutcomes.length > 0) {
		lines.push("Notable outcomes this week:");
		for (const e of withOutcomes.slice(0, 5)) {
			lines.push(`• ${e.title}: ${e.outcome}`);
		}
	}

	// Group by theme
	const byTheme: Record<string, number> = {};
	for (const e of entries) {
		byTheme[e.theme] = (byTheme[e.theme] || 0) + 1;
	}
	const topThemes = Object.entries(byTheme)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 3)
		.map(([theme, count]) => `${formatLabel(theme)} (${count})`);
	if (topThemes.length > 0) {
		lines.push(`Primary areas of focus: ${topThemes.join(", ")}.`);
	}

	lines.push(
		"This summary was auto-generated. Your account lead will provide a more detailed update next week.",
	);

	return lines.join("\n\n");
}

// ── HTML Template ───────────────────────────────────────────────────────────

function renderJournalHtml(opts: {
	companyName: string;
	journalType: string;
	chapter: string;
	chapterNumber: number;
	weekStarting: number;
	weekEnding: number;
	narrativeText: string;
	entries: Array<{
		entryType: string;
		theme: string;
		title: string;
		clientDescription?: string;
		description: string;
		outcome?: string;
		occurredAt: number;
		effortBand?: string;
		status: string;
	}>;
	metrics: {
		totalEntries: number;
		entriesByTheme: Record<string, number>;
		entriesByEffort: Record<string, number>;
		touchpoints: {
			calls: number;
			emails: number;
			documents: number;
			meetings: number;
			total: number;
		};
		actionItemsDue: number;
		milestones: number;
	};
}): string {
	const {
		companyName,
		journalType,
		chapter,
		chapterNumber,
		weekStarting,
		weekEnding,
		narrativeText,
		entries,
		metrics,
	} = opts;

	const weekLabel = `${new Date(weekStarting).toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${new Date(weekEnding).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

	const entriesByThemeGrouped = new Map<string, typeof entries>();
	for (const e of entries) {
		const group = entriesByThemeGrouped.get(e.theme) || [];
		group.push(e);
		entriesByThemeGrouped.set(e.theme, group);
	}

	let entriesHtml = "";
	for (const [theme, group] of entriesByThemeGrouped) {
		entriesHtml += `
			<div class="theme-group">
				<h3 class="theme-label">${formatLabel(theme)}</h3>
				${group
					.map(
						(e) => `
					<div class="entry-card">
						<div class="entry-header">
							<span class="entry-type ${e.entryType}">${formatLabel(e.entryType)}</span>
							${e.effortBand ? `<span class="entry-effort">${formatLabel(e.effortBand)}</span>` : ""}
							<span class="entry-date">${new Date(e.occurredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
						</div>
						<p class="entry-title">${e.title}</p>
						<p class="entry-body">${e.clientDescription || e.description}</p>
						${e.outcome ? `<p class="entry-outcome">→ ${e.outcome}</p>` : ""}
					</div>`,
					)
					.join("")}
			</div>`;
	}

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
	<style>
		@page {
			size: A4;
			margin: 24mm 20mm 28mm 20mm;
		}

		* { box-sizing: border-box; margin: 0; padding: 0; }

		body {
			font-family: 'Jost', -apple-system, sans-serif;
			color: #1f2937;
			line-height: 1.6;
			font-size: 10pt;
			background: #fff;
		}

		/* ── Header ─────────────────────────────────── */

		.journal-header {
			border-bottom: 2px solid #1e3a5f;
			padding-bottom: 16px;
			margin-bottom: 24px;
		}

		.brand {
			font-family: 'Cormorant Garamond', Georgia, serif;
			font-size: 11pt;
			font-weight: 300;
			color: #1e3a5f;
			letter-spacing: 0.15em;
			text-transform: uppercase;
		}

		.journal-title {
			font-family: 'Cormorant Garamond', Georgia, serif;
			font-size: 22pt;
			font-weight: 600;
			color: #1e3a5f;
			margin: 8px 0 4px;
		}

		.journal-subtitle {
			font-size: 10pt;
			color: #6b7280;
		}

		.week-label {
			font-size: 11pt;
			color: #b08d57;
			font-weight: 500;
			margin-top: 4px;
		}

		/* ── Metrics Bar ────────────────────────────── */

		.metrics-bar {
			display: flex;
			gap: 24px;
			padding: 12px 16px;
			background: #f8f9fa;
			border-radius: 6px;
			margin-bottom: 24px;
		}

		.metric {
			text-align: center;
		}

		.metric-value {
			font-size: 18pt;
			font-weight: 600;
			color: #1e3a5f;
			line-height: 1.2;
		}

		.metric-label {
			font-size: 7.5pt;
			color: #6b7280;
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		/* ── Narrative ──────────────────────────────── */

		.narrative-section {
			margin-bottom: 28px;
		}

		.section-title {
			font-family: 'Cormorant Garamond', Georgia, serif;
			font-size: 14pt;
			font-weight: 600;
			color: #1e3a5f;
			margin-bottom: 10px;
			padding-bottom: 4px;
			border-bottom: 1px solid #e5e7eb;
		}

		.narrative-text {
			font-size: 10.5pt;
			line-height: 1.7;
			color: #374151;
			white-space: pre-wrap;
		}

		/* ── Entries ────────────────────────────────── */

		.entries-section {
			margin-bottom: 28px;
		}

		.theme-group {
			margin-bottom: 16px;
		}

		.theme-label {
			font-size: 10pt;
			font-weight: 600;
			color: #b08d57;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			margin-bottom: 6px;
		}

		.entry-card {
			padding: 8px 12px;
			border-left: 3px solid #e5e7eb;
			margin-bottom: 8px;
			page-break-inside: avoid;
		}

		.entry-card.type-milestone { border-left-color: #eab308; }
		.entry-card.type-signature { border-left-color: #22c55e; }
		.entry-card.type-issue { border-left-color: #ef4444; }
		.entry-card.type-document { border-left-color: #3b82f6; }
		.entry-card.type-call { border-left-color: #06b6d4; }
		.entry-card.type-meeting { border-left-color: #6366f1; }
		.entry-card.type-email { border-left-color: #a855f7; }

		.entry-header {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 4px;
		}

		.entry-type {
			font-size: 7.5pt;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			padding: 1px 6px;
			border-radius: 3px;
			background: #f3f4f6;
			color: #4b5563;
		}

		.entry-effort {
			font-size: 7pt;
			color: #9ca3af;
		}

		.entry-date {
			font-size: 8pt;
			color: #9ca3af;
			margin-left: auto;
		}

		.entry-title {
			font-size: 9.5pt;
			font-weight: 600;
			color: #1f2937;
		}

		.entry-body {
			font-size: 9pt;
			color: #4b5563;
			margin-top: 2px;
		}

		.entry-outcome {
			font-size: 9pt;
			font-weight: 500;
			color: #059669;
			margin-top: 4px;
			padding: 3px 8px;
			background: #ecfdf5;
			border-radius: 3px;
			display: inline-block;
		}

		/* ── Footer ─────────────────────────────────── */

		.journal-footer {
			margin-top: 32px;
			padding-top: 12px;
			border-top: 1px solid #e5e7eb;
			font-size: 8pt;
			color: #9ca3af;
			text-align: center;
		}

		/* ── Page breaks ────────────────────────────── */

		.narrative-section, .theme-group {
			page-break-inside: avoid;
		}
	</style>
</head>
<body>
	<div class="journal-header">
		<div class="brand">Forhemit</div>
		<div class="journal-title">${companyName} — ${journalType === "transition" ? "Transition" : "Stewardship"} Journal</div>
		<div class="journal-subtitle">Chapter ${chapterNumber}: ${chapter}</div>
		<div class="week-label">Week of ${weekLabel}</div>
	</div>

	<div class="metrics-bar">
		<div class="metric">
			<div class="metric-value">${metrics.touchpoints.total}</div>
			<div class="metric-label">Touchpoints</div>
		</div>
		<div class="metric">
			<div class="metric-value">${metrics.touchpoints.calls}</div>
			<div class="metric-label">Calls</div>
		</div>
		<div class="metric">
			<div class="metric-value">${metrics.touchpoints.meetings}</div>
			<div class="metric-label">Meetings</div>
		</div>
		<div class="metric">
			<div class="metric-value">${metrics.touchpoints.documents}</div>
			<div class="metric-label">Documents</div>
		</div>
		<div class="metric">
			<div class="metric-value">${metrics.touchpoints.emails}</div>
			<div class="metric-label">Notifications</div>
		</div>
		<div class="metric">
			<div class="metric-value">${metrics.actionItemsDue}</div>
			<div class="metric-label">Action Items</div>
		</div>
	</div>

	${
		narrativeText
			? `<div class="narrative-section">
			<div class="section-title">Weekly Update</div>
			<div class="narrative-text">${narrativeText}</div>
		</div>`
			: ""
	}

	<div class="entries-section">
		<div class="section-title">Activity This Week</div>
		${entriesHtml || '<p style="color: #9ca3af; font-style: italic;">No entries this week.</p>'}
	</div>

	<div class="journal-footer">
		Generated ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · Forhemit Client Journal · Confidential
	</div>
</body>
</html>`;
}

// ── Main action: generate digest for one journal ────────────────────────────

export const generateJournalDigest = internalAction({
	args: {
		journalId: v.id("clientJournals"),
		weekStarting: v.optional(v.number()),
		force: v.optional(v.boolean()),
	},
	handler: async (
		ctx,
		args,
	): Promise<
		| { error: string }
		| { skipped: true; reason: string }
		| {
				success: true;
				weekStarting: number;
				entriesCount: number;
				metrics: Record<string, unknown>;
				boxFileId: string | undefined;
		  }
	> => {
		const weekStarting = args.weekStarting ?? getWeekStarting();
		const weekEnding = weekStarting + 6 * 86400000;

		// 1. Load journal
		const journal = (await ctx.runQuery(api.clientJournals.get, {
			id: args.journalId,
		})) as {
			_id: string;
			clientId: string;
			boxFolderId?: string;
			boxSharedLink?: string;
			companyName?: string;
			journalType: string;
			currentChapter: string;
			chapterNumber: number;
			digestRecipients?: string[];
		} | null;
		if (!journal) return { error: "Journal not found" };

		// 2. Check if already sent (skip unless forced)
		const existing = (await ctx.runQuery(
			api.journalDigests.getByJournalAndWeek,
			{ journalId: args.journalId, weekStarting },
		)) as Record<string, unknown> | null;
		if (existing && !args.force) {
			return { skipped: true, reason: "Digest already exists for this week" };
		}

		// 3. Load narrative
		const narrative = (await ctx.runQuery(
			api.journalNarratives.getByJournalAndWeek,
			{ journalId: args.journalId, weekStarting },
		)) as { _id: string; narrativeText?: string; status?: string } | null;

		// 4. Load client-visible entries for this week
		const entries = (await ctx.runQuery(api.journalEntries.listByJournal, {
			journalId: args.journalId,
		})) as Array<{
			visibleToClient: boolean;
			occurredAt: number;
			entryType: string;
			theme: string;
			title: string;
			description: string;
			clientDescription?: string;
			outcome?: string;
			effortBand?: string;
			status: string;
			sensitivity: string;
		}>;
		const weekEntries = entries.filter(
			(e: (typeof entries)[number]) =>
				e.visibleToClient &&
				e.occurredAt >= weekStarting &&
				e.occurredAt <= weekEnding,
		);

		// 5. Compute metrics
		const themeCount: Record<string, number> = {};
		const typeCount: Record<string, number> = {};
		let calls = 0,
			emails = 0,
			documents = 0,
			meetings = 0,
			outcomesCount = 0;

		for (const e of weekEntries) {
			themeCount[e.theme] = (themeCount[e.theme] || 0) + 1;
			typeCount[e.entryType] = (typeCount[e.entryType] || 0) + 1;
			if (e.entryType === "call" || e.entryType === "signature") calls++;
			if (e.entryType === "email" || e.entryType === "notification") emails++;
			if (e.entryType === "document") documents++;
			if (e.entryType === "meeting") meetings++;
			if (e.outcome) outcomesCount++;
		}

		const metrics = {
			totalEntries: weekEntries.length,
			entriesByTheme: themeCount,
			entriesByEffort: typeCount,
			touchpoints: {
				calls,
				emails,
				documents,
				meetings,
				total: calls + emails + documents + meetings,
			},
			actionItemsDue: 0,
			milestones: 0,
		};

		// 5b. Auto-generate fallback narrative if missing or draft
		let activeNarrative = narrative;
		const needsFallback =
			!activeNarrative || activeNarrative.status === "draft";

		if (needsFallback && weekEntries.length > 0) {
			const fallbackText = generateFallbackNarrative(
				weekEntries,
				metrics,
				journal.journalType,
			);

			if (activeNarrative) {
				// Update existing draft with fallback text
				await ctx.runMutation(api.journalNarratives.update, {
					id: activeNarrative._id as Id<"journalNarratives">,
					narrativeText: fallbackText,
				});
				await ctx.runMutation(api.journalNarratives.markFallback, {
					id: activeNarrative._id as Id<"journalNarratives">,
					reason:
						"Account lead did not mark narrative as ready before Tuesday deadline",
				});
				activeNarrative = { ...activeNarrative, narrativeText: fallbackText };
			} else {
				// Create new fallback narrative
				const newId = await ctx.runMutation(
					api.journalNarratives.createFallback,
					{
						journalId: args.journalId,
						clientId: journal.clientId as Id<"crmCompanies">,
						weekStarting,
						weekEnding,
						narrativeText: fallbackText,
					},
				);
				activeNarrative = {
					_id: newId as unknown as string,
					narrativeText: fallbackText,
				};
			}
		}

		// 6. Generate HTML
		const html = renderJournalHtml({
			companyName: journal.companyName || "Client",
			journalType: journal.journalType,
			chapter: journal.currentChapter,
			chapterNumber: journal.chapterNumber,
			weekStarting,
			weekEnding,
			narrativeText: activeNarrative?.narrativeText || "",
			entries: weekEntries,
			metrics,
		});

		// 7. Call PDF generation service
		const adminUrl = process.env.ADMIN_APP_URL || "http://localhost:5050";
		const pdfResponse = await fetch(`${adminUrl}/api/pdf-generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				htmlContent: html,
				templateName: "Journal",
				templateId: "journal",
			}),
		});

		if (!pdfResponse.ok) {
			const errText = await pdfResponse.text();
			return { error: `PDF generation failed: ${errText}` };
		}

		const pdfBuffer = await pdfResponse.arrayBuffer();
		const pdfBytes = new Uint8Array(pdfBuffer);

		// 8. Upload to Box
		let boxFileId: string | undefined;
		let boxFileUrl: string | undefined;

		if (journal.boxFolderId) {
			try {
				const uploadResult = (await ctx.runAction(
					internal.box.uploadFileToFolder,
					{
						folderId: journal.boxFolderId,
						fileName: `Journal_Week_${new Date(weekStarting).toISOString().split("T")[0]}.pdf`,
						content: Array.from(pdfBytes),
					},
				)) as { id: string; name: string } | null;
				boxFileId = uploadResult?.id;
				boxFileUrl = uploadResult?.id
					? `https://app.box.com/file/${uploadResult.id}`
					: undefined;
			} catch (err) {
				console.error("Box upload failed:", err);
				// Continue — PDF is generated, Box upload can be retried
			}
		}

		// 9. Save digest record
		await ctx.runMutation(api.journalDigests.create, {
			journalId: args.journalId,
			narrativeId: activeNarrative?._id as Id<"journalNarratives"> | undefined,
			weekStarting,
			weekEnding,
			boxFileId: boxFileId || "pending",
			boxFileUrl: boxFileUrl || "",
			metrics,
			deliveredAt: Date.now(),
			deliveredTo: [],
		});

		// 10. Update narrative status
		if (activeNarrative) {
			await ctx.runMutation(api.journalNarratives.updateStatus, {
				id: activeNarrative._id as Id<"journalNarratives">,
				status: "sent",
			});
		}

		// 11. Send email digest
		if (journal.digestRecipients && journal.digestRecipients.length > 0) {
			try {
				const { sendAndLogEmail, emailLayout, ctaButton, BRAND } = await import(
					"./emailCore"
				);

				const journalTypeLabel =
					journal.journalType === "transition" ? "Transition" : "Stewardship";
				const weekLabel = new Date(weekStarting).toLocaleDateString("en-US", {
					month: "long",
					day: "numeric",
				});

				const touchpoints = metrics.touchpoints as {
					calls: number;
					emails: number;
					documents: number;
					meetings: number;
					total: number;
				};

				// Build email content
				let contentHtml = `
					<p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
						Your weekly ${journalTypeLabel.toLowerCase()} journal is ready. Here's a summary of activity this week.
					</p>

					<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
						<tr>
							<td style="background: ${BRAND.parchment}; border-radius: 6px; padding: 16px 20px;">
								<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
									<tr>
										<td style="text-align: center; padding: 0 12px;">
											<div style="font-size: 24px; font-weight: 600; color: ${BRAND.ink};">${touchpoints.total}</div>
											<div style="font-size: 11px; color: ${BRAND.stone}; text-transform: uppercase;">Touchpoints</div>
										</td>
										<td style="text-align: center; padding: 0 12px;">
											<div style="font-size: 24px; font-weight: 600; color: ${BRAND.ink};">${touchpoints.calls}</div>
											<div style="font-size: 11px; color: ${BRAND.stone}; text-transform: uppercase;">Calls</div>
										</td>
										<td style="text-align: center; padding: 0 12px;">
											<div style="font-size: 24px; font-weight: 600; color: ${BRAND.ink};">${touchpoints.meetings}</div>
											<div style="font-size: 11px; color: ${BRAND.stone}; text-transform: uppercase;">Meetings</div>
										</td>
										<td style="text-align: center; padding: 0 12px;">
											<div style="font-size: 24px; font-weight: 600; color: ${BRAND.ink};">${touchpoints.documents}</div>
											<div style="font-size: 11px; color: ${BRAND.stone}; text-transform: uppercase;">Documents</div>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>`;

				// Add narrative excerpt if available
				if (activeNarrative?.narrativeText) {
					const excerpt =
						activeNarrative.narrativeText.length > 300
							? `${activeNarrative.narrativeText.slice(0, 300)}…`
							: activeNarrative.narrativeText;
					contentHtml += `
						<div style="border-left: 3px solid ${BRAND.brass}; padding-left: 16px; margin: 20px 0;">
							<p style="color: ${BRAND.textBody}; font-size: 14px; line-height: 1.7; margin: 0; font-style: italic;">
								${excerpt}
							</p>
						</div>`;
				}

				// CTA button to view full journal
				const viewUrl =
					journal.boxSharedLink || boxFileUrl || "https://app.box.com";
				contentHtml += ctaButton("View Full Journal", viewUrl);

				// Build the full email
				const emailHtml = emailLayout({
					title: `${journal.companyName || "Client"} — Weekly ${journalTypeLabel} Journal`,
					preheader: `Week of ${weekLabel} — ${touchpoints.total} touchpoints this week`,
					content: contentHtml,
					transactional: true,
				});

				// Send to all recipients
				await sendAndLogEmail(
					ctx,
					{
						to: journal.digestRecipients,
						subject: `${journal.companyName || "Client"} ${journalTypeLabel} Journal — Week of ${weekLabel}`,
						html: emailHtml,
					},
					{
						templateId: "journal-digest",
						relatedCompanyId: args.journalId as unknown as Id<"crmCompanies">,
					},
				);

				// Update digest record with delivery info
				const digestRecord = (await ctx.runQuery(
					api.journalDigests.getByJournalAndWeek,
					{ journalId: args.journalId, weekStarting },
				)) as { _id: string } | null;
				if (digestRecord) {
					await ctx.runMutation(api.journalDigests.markDelivered, {
						id: digestRecord._id as Id<"journalDigests">,
						to: journal.digestRecipients,
					});
				}
			} catch (emailErr) {
				console.error("Email digest send failed:", emailErr);
				// PDF is generated and uploaded — email failure is non-fatal
			}
		}

		return {
			success: true,
			weekStarting,
			entriesCount: weekEntries.length,
			metrics,
			boxFileId,
		};
	},
});

// ── Cron action: process all active journals ────────────────────────────────

export const processAllJournals = internalAction({
	args: {},
	handler: async (
		ctx,
	): Promise<{
		processed: number;
		results: Array<Record<string, unknown>>;
	}> => {
		const journals = (await ctx.runQuery(
			api.clientJournals.listActive,
			{},
		)) as Array<{ _id: string }>;
		const weekStarting = getWeekStarting();
		const results: Array<Record<string, unknown>> = [];

		for (const journal of journals) {
			try {
				const result = (await ctx.runAction(
					internal.journalPdf.generateJournalDigest,
					{
						journalId: journal._id as Id<"clientJournals">,
						weekStarting,
					},
				)) as Record<string, unknown>;
				results.push({ journalId: journal._id, ...result });
			} catch (err) {
				console.error(`Failed to process journal ${journal._id}:`, err);
				results.push({
					journalId: journal._id,
					error: err instanceof Error ? err.message : "Unknown error",
				});
			}
		}

		return { processed: results.length, results };
	},
});
