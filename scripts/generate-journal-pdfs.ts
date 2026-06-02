/**
 * Generate Welcome and Phase Checklist PDFs for a journal.
 * Runs locally using Puppeteer + Chrome.
 *
 * Usage: npx tsx scripts/generate-journal-pdfs.ts <boxFolderId> <companyName>
 */

import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const COMPANY_NAME = process.argv[2] || "Sunrise Manufacturing Co.";
const BOX_FOLDER_ID = process.argv[3] || "";

// ── HTML Templates ──────────────────────────────────────────────────────────

function welcomeHtml(): string {
	return `
<div style="font-family: 'Jost', sans-serif; color: #1f2937; line-height: 1.7; padding: 40px;">
	<div style="border-bottom: 2px solid #1e3a5f; padding-bottom: 24px; margin-bottom: 32px;">
		<div style="font-family: 'Cormorant Garamond', serif; font-size: 11pt; font-weight: 300; color: #1e3a5f; letter-spacing: 0.15em; text-transform: uppercase;">Forhemit</div>
		<div style="font-family: 'Cormorant Garamond', serif; font-size: 22pt; font-weight: 600; color: #1e3a5f; margin: 8px 0 4px;">Welcome to Your ESOP Transition</div>
		<div style="font-size: 11pt; color: #b08d57; font-weight: 500;">${COMPANY_NAME}</div>
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
			<li style="margin-bottom: 8px;"><strong>Go to your current phase</strong> — The numbered folders (01–06) match your deal timeline.</li>
			<li style="margin-bottom: 8px;"><strong>Check the checklist</strong> — Each phase folder has a checklist PDF that's updated daily.</li>
			<li style="margin-bottom: 8px;"><strong>Review your journal</strong> — The Journal subfolder contains your weekly activity digests.</li>
			<li><strong>Browse documents</strong> — The Documents subfolder has all artifacts for that phase.</li>
		</ol>
	</div>

	<div style="background: #f8f9fa; border-left: 3px solid #b08d57; padding: 16px 20px; border-radius: 4px; margin-bottom: 28px;">
		<p style="font-size: 10pt; color: #6b7280; margin: 0;">
			<strong style="color: #1e3a5f;">Questions?</strong> Your Forhemit account lead is your primary contact. If you have trouble accessing any document or need something that isn't here, reach out directly.
		</p>
	</div>

	<div style="font-size: 9pt; color: #9ca3af; text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
		Forhemit · Confidential · ${new Date().getFullYear()}
	</div>
</div>`;
}

function phaseChecklistHtml(phaseName: string, description: string): string {
	return `
<div style="font-family: 'Jost', sans-serif; color: #1f2937; line-height: 1.7; padding: 40px;">
	<div style="border-bottom: 2px solid #1e3a5f; padding-bottom: 24px; margin-bottom: 32px;">
		<div style="font-family: 'Cormorant Garamond', serif; font-size: 11pt; font-weight: 300; color: #1e3a5f; letter-spacing: 0.15em; text-transform: uppercase;">Forhemit</div>
		<div style="font-family: 'Cormorant Garamond', serif; font-size: 20pt; font-weight: 600; color: #1e3a5f; margin: 8px 0 4px;">${phaseName}</div>
		<div style="font-size: 10pt; color: #6b7280;">${COMPANY_NAME} · ${description}</div>
		<div style="font-size: 9pt; color: #b08d57; margin-top: 4px;">Last updated: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
	</div>

	<div>
		<h3 style="font-family: 'Cormorant Garamond', serif; font-size: 13pt; font-weight: 600; color: #1e3a5f; margin-bottom: 10px;">Tasks</h3>
		<p style="color: #9ca3af; font-style: italic;">Checklist will be populated as tasks are tracked in the deal tracker.</p>
	</div>

	<div style="font-size: 9pt; color: #9ca3af; text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb; margin-top: 24px;">
		Forhemit · Confidential · Updated automatically daily at 2:00 AM Pacific
	</div>
</div>`;
}

// ── PDF Generation ──────────────────────────────────────────────────────────

async function generatePdf(html: string, outputPath: string): Promise<void> {
	const browser = await puppeteer.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		executablePath:
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
		headless: true,
	});

	try {
		const page = await browser.newPage();
		await page.setContent(
			`<!DOCTYPE html><html><head><meta charset="UTF-8">
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
			<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff}</style>
			</head><body>${html}</body></html>`,
			{ waitUntil: ["networkidle0", "domcontentloaded"] },
		);
		await page.evaluate(() => document.fonts.ready);
		await new Promise((r) => setTimeout(r, 1000));

		const pdf = await page.pdf({
			format: "A4",
			printBackground: true,
			margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
		});

		fs.writeFileSync(outputPath, pdf);
		console.log(`  ✅ Generated: ${path.basename(outputPath)}`);
	} finally {
		await browser.close();
	}
}

// ── Main ────────────────────────────────────────────────────────────────────

const PHASES = [
	{
		id: "ignition",
		name: "01 — Ignition (Days 1–14)",
		desc: "Engagement secured, team seated, data room",
	},
	{
		id: "build",
		name: "02 — Build (Days 15–45)",
		desc: "QofE fieldwork, lender package, FMV appraisal",
	},
	{
		id: "validate",
		name: "03 — Validate (Days 46–75)",
		desc: "LOI executed, ESOP plan, SBA, QofE gates",
	},
	{
		id: "close-prep",
		name: "04 — Close Prep (Days 76–105)",
		desc: "Legal docs, board resolutions, ERISA review",
	},
	{
		id: "closing",
		name: "05 — Closing (Days 106–120)",
		desc: "Final closing, post-close, transition",
	},
	{
		id: "post-close",
		name: "06 — Post-Close",
		desc: "Stewardship and ongoing support",
	},
];

async function main() {
	console.log("\n📄 Generating journal PDFs...\n");

	const outDir = path.join(process.cwd(), "tmp", "journal-pdfs");
	fs.mkdirSync(outDir, { recursive: true });

	// Generate Welcome PDF
	await generatePdf(welcomeHtml(), path.join(outDir, "Welcome.pdf"));

	// Generate Phase Checklists
	for (const phase of PHASES) {
		await generatePdf(
			phaseChecklistHtml(phase.name, phase.desc),
			path.join(outDir, `Checklist-${phase.id}.pdf`),
		);
	}

	console.log(`\n✅ All PDFs generated in ${outDir}\n`);
}

main().catch(console.error);
