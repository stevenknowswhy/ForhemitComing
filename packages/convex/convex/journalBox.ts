/**
 * Journal Box Provisioning
 *
 * Creates the client-facing Box folder structure for a deal journal.
 * Structure mirrors a Skool-style course: Welcome → Phase folders → Journals.
 *
 * Each phase folder contains:
 *   - Phase Overview & Checklist.pdf (regenerated daily at 2AM PST)
 *   - Documents/ (for phase-specific artifacts)
 *   - Journal/ (for weekly digest PDFs)
 *
 * The root folder gets:
 *   - Activity Log.pdf (updated weekly alongside journal generation)
 *   - A Box shared link stored on the journal record
 */

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import {
	getOrCreateFolder,
	createSharedLink,
	uploadFile,
	getRootFolderId,
} from "./lib/box";

// ── Folder Structure Definition ─────────────────────────────────────────────

interface PhaseFolder {
	id: string;
	name: string;
	description: string;
}

const PHASE_FOLDERS: PhaseFolder[] = [
	{
		id: "ignition",
		name: "01 — Ignition (Days 1–14)",
		description: "Engagement secured, team seated, data room, COOP v1.0",
	},
	{
		id: "build",
		name: "02 — Build (Days 15–45)",
		description: "QofE fieldwork, lender package, FMV appraisal, Gate 1",
	},
	{
		id: "validate",
		name: "03 — Validate (Days 46–75)",
		description: "LOI executed, ESOP plan, Gate 2 (Lender), Gate 3 (QofE)",
	},
	{
		id: "close-prep",
		name: "04 — Close Prep (Days 76–105)",
		description: "Legal docs, board resolutions, ERISA review, Gate 4",
	},
	{
		id: "closing",
		name: "05 — Closing (Days 106–120)",
		description: "Final closing, post-close, transition",
	},
	{
		id: "post-close",
		name: "06 — Post-Close",
		description: "Stewardship and ongoing support",
	},
];

// ── HTML Templates ──────────────────────────────────────────────────────────

function welcomeHtml(companyName: string): string {
	return `
<div style="font-family: 'Jost', sans-serif; color: #1f2937; line-height: 1.7; padding: 40px;">
	<div style="border-bottom: 2px solid #1e3a5f; padding-bottom: 24px; margin-bottom: 32px;">
		<div style="font-family: 'Cormorant Garamond', serif; font-size: 11pt; font-weight: 300; color: #1e3a5f; letter-spacing: 0.15em; text-transform: uppercase;">Forhemit</div>
		<div style="font-family: 'Cormorant Garamond', serif; font-size: 22pt; font-weight: 600; color: #1e3a5f; margin: 8px 0 4px;">Welcome to Your ESOP Transition</div>
		<div style="font-size: 11pt; color: #b08d57; font-weight: 500;">${companyName}</div>
	</div>

	<div style="margin-bottom: 28px;">
		<h2 style="font-family: 'Cormorant Garamond', serif; font-size: 16pt; font-weight: 600; color: #1e3a5f; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">Welcome</h2>
		<p style="font-size: 11pt; color: #374151; line-height: 1.8;">
			Welcome to your secure deal folder. This is your central hub for everything related to your ESOP transition. Every document, every update, every milestone — it all lives here.
		</p>
		<p style="font-size: 11pt; color: #374151; line-height: 1.8; margin-top: 12px;">
			We created this space so you always have a single place to find what you need, track what's happening, and know exactly where things stand. No digging through email threads. No wondering which version is current. Everything is organized by phase and timestamped.
		</p>
	</div>

	<div style="margin-bottom: 28px;">
		<h2 style="font-family: 'Cormorant Garamond', serif; font-size: 16pt; font-weight: 600; color: #1e3a5f; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">Why Box.com?</h2>
		<p style="font-size: 11pt; color: #374151; line-height: 1.8;">
			We use Box.com because your deal documents deserve enterprise-grade security. Box is trusted by 67% of the Fortune 500 and meets SOC 2, SOC 3, ISO 27001, HIPAA, FedRAMP, and GDPR compliance standards. Your financial data, legal documents, and sensitive business information are encrypted at rest and in transit.
		</p>
		<p style="font-size: 11pt; color: #374151; line-height: 1.8; margin-top: 12px;">
			Beyond security, Box gives you a clean, professional interface to browse your documents from any device — desktop, tablet, or phone. You can preview documents without downloading, search across all your files, and receive notifications when new content is added.
		</p>
	</div>

	<div style="margin-bottom: 28px;">
		<h2 style="font-family: 'Cormorant Garamond', serif; font-size: 16pt; font-weight: 600; color: #1e3a5f; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">What You'll Receive Here</h2>
		<p style="font-size: 11pt; color: #374151; line-height: 1.8; margin-bottom: 16px;">
			Your folder is organized into phases that mirror your 120-day ESOP transaction roadmap. As your deal progresses, new content appears in the corresponding phase folder. Here's what you'll find:
		</p>
		<table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
			<tr style="border-bottom: 1px solid #e5e7eb;">
				<td style="padding: 10px 12px; font-weight: 600; color: #1e3a5f; font-size: 10pt; width: 35%;">📋 Phase Checklists</td>
				<td style="padding: 10px 12px; font-size: 10pt; color: #374151;">Updated daily. Shows what's done, what's in progress, and what's coming next.</td>
			</tr>
			<tr style="border-bottom: 1px solid #e5e7eb;">
				<td style="padding: 10px 12px; font-weight: 600; color: #1e3a5f; font-size: 10pt;">📄 Documents</td>
				<td style="padding: 10px 12px; font-size: 10pt; color: #374151;">NDAs, agreements, reports, and deliverables organized by phase.</td>
			</tr>
			<tr style="border-bottom: 1px solid #e5e7eb;">
				<td style="padding: 10px 12px; font-weight: 600; color: #1e3a5f; font-size: 10pt;">📔 Weekly Journals</td>
				<td style="padding: 10px 12px; font-size: 10pt; color: #374151;">Your activity digest. Shows everything the team did each week, with outcomes and next steps.</td>
			</tr>
			<tr>
				<td style="padding: 10px 12px; font-weight: 600; color: #1e3a5f; font-size: 10pt;">📊 Activity Log</td>
				<td style="padding: 10px 12px; font-size: 10pt; color: #374151;">A running log of all activity across the engagement. Updated weekly.</td>
			</tr>
		</table>
	</div>

	<div style="margin-bottom: 28px;">
		<h2 style="font-family: 'Cormorant Garamond', serif; font-size: 16pt; font-weight: 600; color: #1e3a5f; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">How to Navigate</h2>
		<ol style="font-size: 11pt; color: #374151; line-height: 1.8; padding-left: 20px;">
			<li style="margin-bottom: 8px;"><strong>Start here</strong> — Read this welcome document first.</li>
			<li style="margin-bottom: 8px;"><strong>Go to your current phase</strong> — The numbered folders (01–06) match your deal timeline. Your current phase has a green indicator.</li>
			<li style="margin-bottom: 8px;"><strong>Check the checklist</strong> — Each phase folder has a checklist PDF that's updated daily. It shows exactly what's been completed and what's next.</li>
			<li style="margin-bottom: 8px;"><strong>Review your journal</strong> — The Journal subfolder in each phase contains your weekly activity digests.</li>
			<li><strong>Browse documents</strong> — The Documents subfolder has all artifacts for that phase.</li>
		</ol>
	</div>

	<div style="background: #f8f9fa; border-left: 3px solid #b08d57; padding: 16px 20px; border-radius: 4px; margin-bottom: 28px;">
		<p style="font-size: 10pt; color: #6b7280; margin: 0;">
			<strong style="color: #1e3a5f;">Questions?</strong> Your Forhemit account lead is your primary contact. If you have trouble accessing any document or need something that isn't here, reach out directly. We're here to make this process as transparent and smooth as possible.
		</p>
	</div>

	<div style="font-size: 9pt; color: #9ca3af; text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
		Forhemit · Confidential · ${new Date().getFullYear()}
	</div>
</div>`;
}

function phaseChecklistHtml(
	companyName: string,
	phase: PhaseFolder,
	tasks: Array<{
		title: string;
		status: string;
		day: string;
		role: string;
		type: string;
		subs: Array<{ label: string; completed: boolean }>;
	}>,
	gates: Array<{ name: string; day: string; passed: boolean }>,
): string {
	const taskRows = tasks
		.map((task) => {
			const statusIcon =
				task.status === "completed"
					? "✅"
					: task.status === "in_progress"
						? "🔄"
						: "🔲";
			const subHtml =
				task.subs.length > 0
					? `<div style="margin-left: 24px; margin-top: 4px;">${task.subs
							.map(
								(s) =>
									`<div style="font-size: 9pt; color: #6b7280;">${s.completed ? "☑️" : "☐"} ${s.label}</div>`,
							)
							.join("")}</div>`
					: "";

			return `
			<div style="padding: 8px 12px; border-left: 3px solid ${task.status === "completed" ? "#22c55e" : task.status === "in_progress" ? "#3b82f6" : "#e5e7eb"}; margin-bottom: 6px; background: ${task.status === "completed" ? "#f0fdf4" : "#fff"};">
				<div style="display: flex; align-items: center; gap: 8px;">
					<span>${statusIcon}</span>
					<span style="font-size: 10pt; font-weight: 600; color: #1f2937;">${task.title}</span>
					<span style="font-size: 8pt; color: #9ca3af; margin-left: auto;">${task.day} · ${task.role}</span>
				</div>
				${subHtml}
			</div>`;
		})
		.join("");

	const gateHtml =
		gates.length > 0
			? `
		<div style="margin-top: 24px;">
			<h3 style="font-family: 'Cormorant Garamond', serif; font-size: 13pt; font-weight: 600; color: #1e3a5f; margin-bottom: 10px;">Gate Status</h3>
			${gates
				.map(
					(g) => `
				<div style="padding: 8px 12px; border: 1px solid ${g.passed ? "#22c55e" : "#e5e7eb"}; border-radius: 6px; margin-bottom: 6px; background: ${g.passed ? "#f0fdf4" : "#fff"};">
					<span style="font-size: 10pt;">${g.passed ? "✅" : "⏳"} <strong>${g.name}</strong> <span style="color: #9ca3af; font-size: 9pt;">${g.day}</span></span>
				</div>`,
				)
				.join("")}
		</div>`
			: "";

	return `
<div style="font-family: 'Jost', sans-serif; color: #1f2937; line-height: 1.7; padding: 40px;">
	<div style="border-bottom: 2px solid #1e3a5f; padding-bottom: 24px; margin-bottom: 32px;">
		<div style="font-family: 'Cormorant Garamond', serif; font-size: 11pt; font-weight: 300; color: #1e3a5f; letter-spacing: 0.15em; text-transform: uppercase;">Forhemit</div>
		<div style="font-family: 'Cormorant Garamond', serif; font-size: 20pt; font-weight: 600; color: #1e3a5f; margin: 8px 0 4px;">${phase.name}</div>
		<div style="font-size: 10pt; color: #6b7280;">${companyName} · ${phase.description}</div>
		<div style="font-size: 9pt; color: #b08d57; margin-top: 4px;">Last updated: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
	</div>

	<div>
		<h3 style="font-family: 'Cormorant Garamond', serif; font-size: 13pt; font-weight: 600; color: #1e3a5f; margin-bottom: 10px;">Tasks</h3>
		${taskRows || '<p style="color: #9ca3af; font-style: italic;">No tasks for this phase yet.</p>'}
	</div>

	${gateHtml}

	<div style="font-size: 9pt; color: #9ca3af; text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb; margin-top: 24px;">
		Forhemit · Confidential · Updated automatically daily at 2:00 AM Pacific
	</div>
</div>`;
}

function activityLogHtml(
	companyName: string,
	entries: Array<{
		occurredAt: number;
		entryType: string;
		theme: string;
		title: string;
		clientDescription: string;
		outcome?: string;
	}>,
): string {
	const rows = entries
		.sort((a, b) => b.occurredAt - a.occurredAt)
		.map(
			(e) => `
		<tr style="border-bottom: 1px solid #e5e7eb;">
			<td style="padding: 8px 12px; font-size: 9pt; color: #6b7280; white-space: nowrap;">${new Date(e.occurredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
			<td style="padding: 8px 12px; font-size: 9pt;"><span style="background: #f3f4f6; padding: 1px 6px; border-radius: 3px; font-size: 8pt; font-weight: 600; text-transform: uppercase; color: #4b5563;">${e.entryType.replace(/_/g, " ")}</span></td>
			<td style="padding: 8px 12px; font-size: 9pt; color: #6b7280; text-transform: capitalize;">${e.theme.replace(/_/g, " ")}</td>
			<td style="padding: 8px 12px; font-size: 10pt; color: #1f2937; font-weight: 500;">${e.title}</td>
			<td style="padding: 8px 12px; font-size: 9pt; color: #4b5563;">${e.clientDescription}</td>
			<td style="padding: 8px 12px; font-size: 9pt; color: #059669; font-weight: 500;">${e.outcome || ""}</td>
		</tr>`,
		)
		.join("");

	return `
<div style="font-family: 'Jost', sans-serif; color: #1f2937; line-height: 1.7; padding: 40px;">
	<div style="border-bottom: 2px solid #1e3a5f; padding-bottom: 24px; margin-bottom: 32px;">
		<div style="font-family: 'Cormorant Garamond', serif; font-size: 11pt; font-weight: 300; color: #1e3a5f; letter-spacing: 0.15em; text-transform: uppercase;">Forhemit</div>
		<div style="font-family: 'Cormorant Garamond', serif; font-size: 20pt; font-weight: 600; color: #1e3a5f; margin: 8px 0 4px;">Activity Log</div>
		<div style="font-size: 10pt; color: #6b7280;">${companyName} · Complete engagement activity</div>
		<div style="font-size: 9pt; color: #b08d57; margin-top: 4px;">Generated: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
	</div>

	<table style="width: 100%; border-collapse: collapse;">
		<thead>
			<tr style="border-bottom: 2px solid #e5e7eb;">
				<th style="padding: 8px 12px; text-align: left; font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Date</th>
				<th style="padding: 8px 12px; text-align: left; font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Type</th>
				<th style="padding: 8px 12px; text-align: left; font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Theme</th>
				<th style="padding: 8px 12px; text-align: left; font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Title</th>
				<th style="padding: 8px 12px; text-align: left; font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Description</th>
				<th style="padding: 8px 12px; text-align: left; font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Outcome</th>
			</tr>
		</thead>
		<tbody>
			${rows || '<tr><td colspan="6" style="padding: 24px; text-align: center; color: #9ca3af; font-style: italic;">No activity yet.</td></tr>'}
		</tbody>
	</table>

	<div style="font-size: 9pt; color: #9ca3af; text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb; margin-top: 24px;">
		Forhemit · Confidential · This log excludes internal notes
	</div>
</div>`;
}

// ── PDF Generation Helper ───────────────────────────────────────────────────

async function generatePdf(
	html: string,
	templateName: string,
): Promise<Uint8Array> {
	const adminUrl = process.env.ADMIN_APP_URL || "http://localhost:5050";
	const response = await fetch(`${adminUrl}/api/pdf-generate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			htmlContent: html,
			templateName,
			templateId: templateName.toLowerCase().replace(/\s+/g, "-"),
		}),
	});

	if (!response.ok) {
		const errText = await response.text();
		throw new Error(`PDF generation failed for ${templateName}: ${errText}`);
	}

	const buffer = await response.arrayBuffer();
	return new Uint8Array(buffer);
}

// ── Provision Journal Box ───────────────────────────────────────────────────

export const provisionJournalBox = action({
	args: {
		journalId: v.id("clientJournals"),
		companyName: v.string(),
		journalType: v.string(),
	},
	handler: async (
		_ctx,
		args,
	): Promise<{
		rootFolderId: string;
		sharedLink: string;
		phaseFolderIds: Record<string, string>;
	}> => {
		const rootFolderId = getRootFolderId();
		const folderName = `${args.companyName} — ESOP ${args.journalType === "transition" ? "Transition" : "Stewardship"}`;

		// 2. Create root deal folder (or reuse existing)
		const dealFolder = await getOrCreateFolder(folderName, rootFolderId);

		// 3. Create Welcome folder
		await getOrCreateFolder("00 — Welcome", dealFolder.id);

		// 4. Create phase folders with Documents and Journal subfolders
		const phaseFolderIds: Record<string, string> = {};
		for (const phase of PHASE_FOLDERS) {
			const phaseFolder = await getOrCreateFolder(phase.name, dealFolder.id);
			await getOrCreateFolder("Documents", phaseFolder.id);
			await getOrCreateFolder("Journal", phaseFolder.id);
			phaseFolderIds[phase.id] = phaseFolder.id;
		}

		// 5. Create shared link on root folder
		const sharedLink = await createSharedLink(dealFolder.id, "open");

		// 6. Update journal with boxFolderId and shared link
		// Note: We pass journalId back to caller to update after provisioning

		return {
			rootFolderId: dealFolder.id,
			sharedLink: sharedLink.url,
			phaseFolderIds,
		};
	},
});

// ── Upload Welcome Documents ────────────────────────────────────────────────

export const uploadWelcomeDocs = action({
	args: {
		journalId: v.id("clientJournals"),
		boxFolderId: v.string(),
		companyName: v.string(),
	},
	handler: async (
		_ctx,
		args,
	): Promise<{ files: Array<{ name: string; fileId: string }> }> => {
		const { findFolderByName } = await import("./lib/box");
		const welcomeFolder = await findFolderByName(
			args.boxFolderId,
			"00 — Welcome",
		);
		if (!welcomeFolder) throw new Error("Welcome folder not found");

		const html = welcomeHtml(args.companyName);
		const pdfBytes = await generatePdf(html, "Welcome");
		const file = await uploadFile(
			"Welcome to Your ESOP Transition.pdf",
			pdfBytes,
			welcomeFolder.id,
		);

		return { files: [{ name: file.name, fileId: file.id }] };
	},
});

// ── Upload Phase Checklist ──────────────────────────────────────────────────

export const uploadPhaseChecklist = internalAction({
	args: {
		journalId: v.id("clientJournals"),
		phase: v.string(),
		boxFolderId: v.string(),
		companyName: v.string(),
	},
	handler: async (
		_ctx,
		args,
	): Promise<{ fileId: string; fileName: string }> => {
		const phaseDef = PHASE_FOLDERS.find((p) => p.id === args.phase);
		if (!phaseDef) throw new Error(`Unknown phase: ${args.phase}`);

		const { findFolderByName } = await import("./lib/box");
		const phaseFolder = await findFolderByName(args.boxFolderId, phaseDef.name);
		if (!phaseFolder)
			throw new Error(`Phase folder not found: ${phaseDef.name}`);

		// TODO: Load deal tracker tasks for this phase when query exists
		const tasks: Array<{
			title: string;
			status: string;
			day: string;
			role: string;
			type: string;
			subs: Array<{ label: string; completed: boolean }>;
		}> = [];

		const html = phaseChecklistHtml(args.companyName, phaseDef, tasks, []);
		const pdfBytes = await generatePdf(
			html,
			`Phase Checklist — ${phaseDef.name}`,
		);
		const file = await uploadFile(
			"Phase Overview & Checklist.pdf",
			pdfBytes,
			phaseFolder.id,
		);

		return { fileId: file.id, fileName: file.name };
	},
});

// ── Sync Activity Log ───────────────────────────────────────────────────────

export const syncActivityLog = internalAction({
	args: {
		journalId: v.id("clientJournals"),
		boxFolderId: v.string(),
		companyName: v.string(),
	},
	handler: async (_ctx, args): Promise<{ fileId: string | null }> => {
		// Generate activity log from company name
		// TODO: Load entries via an internal query when one exists
		const html = activityLogHtml(args.companyName, []);
		const pdfBytes = await generatePdf(html, "Activity Log");
		const file = await uploadFile(
			"Activity Log.pdf",
			pdfBytes,
			args.boxFolderId,
		);

		return { fileId: file.id };
	},
});

// ── Sync Daily Checklist (all phases) ───────────────────────────────────────

export const syncAllChecklists = internalAction({
	args: {},
	handler: async (
		ctx,
	): Promise<{
		processed: number;
		results: Array<Record<string, unknown>>;
	}> => {
		const journals = (await ctx.runQuery(
			internal.clientJournals.internalListActive,
			{},
		)) as any[];

		const results: Array<Record<string, unknown>> = [];

		for (const journal of journals) {
			try {
				const journalData = (await ctx.runQuery(
					internal.clientJournals.internalGet,
					{ id: journal._id },
				)) as any;

				if (!journalData?.boxFolderId) {
					results.push({
						journalId: journal._id,
						skipped: true,
						reason: "No Box folder",
					});
					continue;
				}

				// Upload checklists for all phases
				for (const phase of PHASE_FOLDERS) {
					try {
						await ctx.runAction(internal.journalBox.uploadPhaseChecklist, {
							journalId: journal._id,
							phase: phase.id,
							boxFolderId: journalData.boxFolderId,
							companyName: journalData.companyName || "Client",
						});
					} catch (phaseErr) {
						console.error(
							`Checklist sync failed for ${journal._id} / ${phase.id}:`,
							phaseErr,
						);
					}
				}

				// Also sync activity log
				await ctx.runAction(internal.journalBox.syncActivityLog, {
					journalId: journal._id,
					boxFolderId: journalData.boxFolderId,
					companyName: journalData.companyName || "Client",
				});

				results.push({ journalId: journal._id, success: true });
			} catch (err) {
				console.error(`Checklist sync failed for ${journal._id}:`, err);
				results.push({
					journalId: journal._id,
					error: err instanceof Error ? err.message : "Unknown error",
				});
			}
		}

		return { processed: results.length, results };
	},
});
