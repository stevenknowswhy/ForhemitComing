import { NextResponse } from "next/server";
import { queryGhost } from "@/lib/ghost";

/**
 * POST /api/generate-document
 *
 * Orchestrates the full document generation pipeline:
 * 1. Load template HTML from Ghost
 * 2. Render placeholders via Python template_service
 * 3. Generate PDF via /api/pdf-generate (Puppeteer)
 * 4. Upload to Box (if credentials configured)
 * 5. Log audit event to Ghost
 * 6. Return PDF + metadata
 */

interface GenerateRequest {
	// Template
	templateTitle: string;
	// Recipient
	recipientName: string;
	recipientEmail: string;
	// Deal data
	dealData: Record<string, string>;
	// Box upload (optional)
	companyId?: string;
	boxFolderId?: string;
	stage?: string;
	// Task tracking
	taskId?: string;
}

interface GhostTemplate {
	id: number;
	title: string;
	html_content: string;
	category: string;
	phase: number;
	doc_type: string;
}

export async function POST(request: Request) {
	try {
		const body: GenerateRequest = await request.json();
		const { templateTitle, recipientName, recipientEmail, dealData } = body;

		if (!templateTitle || !recipientName) {
			return NextResponse.json(
				{
					success: false,
					error: "Missing required fields: templateTitle, recipientName",
				},
				{ status: 400 },
			);
		}

		// ── 1. Load template from Ghost ───────────────────────────────
		const [template] = await queryGhost<GhostTemplate>(
			`SELECT id, title, html_content, category, phase, doc_type
			 FROM templates WHERE title = $1 LIMIT 1`,
			[templateTitle],
		);

		if (!template) {
			return NextResponse.json(
				{ success: false, error: `Template not found: ${templateTitle}` },
				{ status: 404 },
			);
		}

		if (!template.html_content) {
			return NextResponse.json(
				{ success: false, error: `Template has no content: ${templateTitle}` },
				{ status: 422 },
			);
		}

		// ── 2. Render template via Python ─────────────────────────────
		const renderData = {
			...dealData,
			recipientName,
			recipientEmail,
			generatedDate:
				dealData.generatedDate ||
				new Date().toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
		};

		const renderResult = callTemplateService("render", {
			title: templateTitle,
			data: JSON.stringify(renderData),
		});

		if (!renderResult.success || !renderResult.rendered_html) {
			return NextResponse.json(
				{
					success: false,
					error: `Render failed: ${renderResult.error || "no output"}`,
				},
				{ status: 500 },
			);
		}

		const renderedHtml = renderResult.rendered_html;

		// ── 3. Generate PDF via Puppeteer ─────────────────────────────
		const pdfResponse = await fetch(`${getBaseUrl()}/api/pdf-generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				htmlContent: renderedHtml,
				templateName: templateTitle,
				templateId: String(template.id),
				formData: renderData,
				mode: "full",
			}),
		});

		if (!pdfResponse.ok) {
			const errorText = await pdfResponse.text();
			console.error(
				`PDF generation failed (${pdfResponse.status}):`,
				errorText,
			);
			return NextResponse.json(
				{
					success: false,
					error: `PDF generation failed: ${pdfResponse.status}`,
				},
				{ status: 502 },
			);
		}

		const pdfBuffer = await pdfResponse.arrayBuffer();
		const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");
		const pdfSize = pdfBuffer.byteLength;

		// ── 4. Upload to Box (if configured) ─────────────────────────
		let boxFileId: string | null = null;
		let boxUploadError: string | null = null;

		if (body.boxFolderId) {
			try {
				boxFileId = await uploadToBox({
					folderId: body.boxFolderId,
					fileName: sanitizeFilename(
						`${templateTitle}-${dealData.ref || "document"}.pdf`,
					),
					contentBase64: pdfBase64,
				});
			} catch (err) {
				boxUploadError = err instanceof Error ? err.message : String(err);
				console.error("Box upload failed:", boxUploadError);
				// Don't fail the whole request — PDF was generated successfully
			}
		}

		// ── 5. Log to Ghost ──────────────────────────────────────────
		await logToGhost({
			templateId: String(template.id),
			templateName: templateTitle,
			formData: renderData,
			action: boxFileId ? "generate-and-upload" : "generate",
			generatedBy: "admin-api",
		});

		// ── 5b. Audit log (SOC 2) ───────────────────────────────────
		try {
			await queryGhost(
				`INSERT INTO document_audit (company_id, task_id, document_type, action, actor, metadata)
				 VALUES ($1, $2, $3, $4, $5, $6)`,
				[
					body.companyId || null,
					body.taskId || null,
					templateTitle,
					"generated",
					"admin-api",
					JSON.stringify({ boxFileId, pdfSize, templateId: template.id }),
				],
			);
		} catch (auditErr) {
			console.error("Audit log write failed:", auditErr);
			// Don't fail the request for audit log issues
		}

		// ── 6. Return result ─────────────────────────────────────────
		return NextResponse.json({
			success: true,
			pdfBase64,
			pdfSize,
			templateId: template.id,
			boxFileId,
			boxUploadError,
		});
	} catch (error) {
		console.error("generate-document error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}

// ── Helpers ─────────────────────────────────────────────────────────────────

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Call the Python template_service CLI.
 */
function callTemplateService(
	command: string,
	args: Record<string, string>,
): { success: boolean; rendered_html?: string; error?: string } {
	const cliArgs = Object.entries(args)
		.map(([k, v]) => `--${k.replace(/_/g, "-")} ${JSON.stringify(v)}`)
		.join(" ");

	const scriptPath = findScript("template_service.py");

	try {
		const stdout = execSync(`python3 ${scriptPath} ${command} ${cliArgs}`, {
			timeout: 15_000,
			encoding: "utf-8",
			cwd: process.cwd(),
		});

		if (command === "render") {
			return { success: true, rendered_html: stdout };
		}
		return { success: true };
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err);
		return { success: false, error: msg };
	}
}

/**
 * Upload a file to Box using the Box API directly.
 */
async function uploadToBox(params: {
	folderId: string;
	fileName: string;
	contentBase64: string;
}): Promise<string> {
	const accessToken = await getBoxAccessToken();

	const binaryString = atob(params.contentBase64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	const formData = new FormData();
	formData.append(
		"attributes",
		JSON.stringify({
			name: params.fileName,
			parent: { id: params.folderId },
		}),
	);
	formData.append(
		"file",
		new Blob([bytes], { type: "application/pdf" }),
		params.fileName,
	);

	const response = await fetch("https://upload.box.com/api/2.0/files/content", {
		method: "POST",
		headers: { Authorization: `Bearer ${accessToken}` },
		body: formData,
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Box upload failed: ${response.status} ${error}`);
	}

	const data = await response.json();
	return data.entries?.[0]?.id ?? "unknown";
}

/**
 * Get a Box access token using Client Credentials Grant.
 */
async function getBoxAccessToken(): Promise<string> {
	const clientId = process.env.BOX_CLIENT_ID;
	const clientSecret = process.env.BOX_CLIENT_SECRET;
	const enterpriseId = process.env.BOX_ENTERPRISE_ID;

	if (!clientId || !clientSecret || !enterpriseId) {
		throw new Error("Box credentials not configured in admin environment");
	}

	const response = await fetch("https://api.box.com/oauth2/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "client_credentials",
			client_id: clientId,
			client_secret: clientSecret,
			box_subject_type: "enterprise",
			box_subject_id: enterpriseId,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Box OAuth failed: ${response.status} ${error}`);
	}

	const data = await response.json();
	return data.access_token;
}

/**
 * Log generation event to Ghost's document_generations table.
 */
async function logToGhost(params: {
	templateId: string;
	templateName: string;
	formData: Record<string, string>;
	action: string;
	generatedBy: string;
}): Promise<void> {
	try {
		await queryGhost(
			`INSERT INTO document_generations
				(template_id, template_name, form_data, action, generated_by)
			 VALUES ($1, $2, $3, $4, $5)`,
			[
				params.templateId,
				params.templateName,
				JSON.stringify(params.formData),
				params.action,
				params.generatedBy,
			],
		);
	} catch (err) {
		console.error("Ghost log failed:", err);
		// Don't fail the request for a logging failure
	}
}

/**
 * Find the template_service.py script relative to the project root.
 */
function findScript(name: string): string {
	const candidates = [
		resolve(`scripts/${name}`),
		resolve(`../scripts/${name}`),
		resolve(`../../scripts/${name}`),
	];

	for (const p of candidates) {
		if (existsSync(p)) return p;
	}

	throw new Error(
		`Script not found: ${name}. Looked in: ${candidates.join(", ")}`,
	);
}

/**
 * Get the base URL for internal API calls.
 */
function getBaseUrl(): string {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5050";
}

/**
 * Sanitize a filename for Box upload.
 */
function sanitizeFilename(name: string): string {
	return name
		.replace(/[<>:"/\\|?*]/g, "")
		.replace(/\s+/g, "-")
		.substring(0, 200);
}
