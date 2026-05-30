import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

// Declare process.env for Convex runtime (Node.js types not in tsconfig)
declare const process: {
	env: { RESEND_API_KEY?: string; BOX_WEBHOOK_PRIMARY_KEY?: string };
};

const http = httpRouter();

const JSON_HEADERS = { "Content-Type": "application/json" };

// CORS wildcard is intentional — draft HTML emails open from file:// origin
const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

/**
 * POST /log-document
 * ─────────────────
 * Logs an externally generated document to the externalDocumentLog table.
 * No auth required — this is an internal pipeline endpoint called by
 * Python scripts running on the same machine.
 *
 * Body (JSON):
 * {
 *   "companyId": "k5...",        // Convex document ID
 *   "documentType": "preflight-internal",
 *   "fileName": "preflight-internal-DHI-2026-001.pdf",
 *   "filePath": "/path/to/file.pdf",
 *   "fileSizeBytes": 328000,
 *   "ref": "DHI-2026-001",
 *   "companyName": "Dark Horse Institute",
 *   "generatedBy": "forhemit-preflight",
 *   "status": "generated",
 *   "metadata": "{\"viabilitySignal\":\"YES_WITH_CONDITIONS\"}"
 * }
 *
 * Response: { "success": true, "documentId": "k5..." }
 */
http.route({
	path: "/log-document",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		try {
			const body = await request.json();

			// Validate required fields
			if (!body.documentType || !body.fileName) {
				return new Response(
					JSON.stringify({
						success: false,
						error: "Missing required fields: documentType, fileName",
					}),
					{ status: 400, headers: JSON_HEADERS },
				);
			}

			const documentId = await ctx.runMutation(
				api.externalDocuments.logDocument,
				{
					companyId: body.companyId || undefined,
					documentType: body.documentType,
					fileName: body.fileName,
					filePath: body.filePath || undefined,
					fileSizeBytes: body.fileSizeBytes || undefined,
					ref: body.ref || undefined,
					companyName: body.companyName || undefined,
					generatedBy: body.generatedBy || "unknown",
					status: body.status || "generated",
					metadata: body.metadata || undefined,
				},
			);

			return new Response(JSON.stringify({ success: true, documentId }), {
				status: 200,
				headers: JSON_HEADERS,
			});
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";

			// Log error to Convex so we have a record of failures
			try {
				await ctx.runMutation(api.externalDocuments.logError, {
					documentType: "unknown",
					errorMessage: message,
					errorStack: error instanceof Error ? error.stack : undefined,
					source: "http:/log-document",
				});
			} catch {
				// If error logging itself fails, just return the response
			}

			return new Response(JSON.stringify({ success: false, error: message }), {
				status: 500,
				headers: JSON_HEADERS,
			});
		}
	}),
});

/**
 * POST /log-error
 * ───────────────
 * Logs a document generation error directly. Called when a Python
 * script encounters a failure and wants to record it in Convex.
 *
 * Body (JSON):
 * {
 *   "companyId": "k5...",        // optional
 *   "documentType": "preflight-internal",
 *   "ref": "DHI-2026-001",
 *   "errorMessage": "PDF generation failed: timeout",
 *   "errorStack": "...",         // optional
 *   "source": "generate-preflight-pdf.py"
 * }
 */
http.route({
	path: "/log-error",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		try {
			const body = await request.json();

			if (!body.errorMessage) {
				return new Response(
					JSON.stringify({
						success: false,
						error: "Missing required field: errorMessage",
					}),
					{ status: 400, headers: JSON_HEADERS },
				);
			}

			const errorId = await ctx.runMutation(api.externalDocuments.logError, {
				companyId: body.companyId || undefined,
				documentType: body.documentType || "unknown",
				ref: body.ref || undefined,
				errorMessage: body.errorMessage,
				errorStack: body.errorStack || undefined,
				source: body.source || undefined,
			});

			return new Response(JSON.stringify({ success: true, errorId }), {
				status: 200,
				headers: JSON_HEADERS,
			});
		} catch (error: unknown) {
			return new Response(
				JSON.stringify({
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				}),
				{ status: 500, headers: JSON_HEADERS },
			);
		}
	}),
});

/**
 * GET /health
 * ───────────
 * Health check for the HTTP action endpoint.
 */
http.route({
	path: "/health",
	method: "GET",
	handler: httpAction(async () => {
		return new Response(
			JSON.stringify({ status: "ok", timestamp: Date.now() }),
			{ status: 200, headers: JSON_HEADERS },
		);
	}),
});

/**
 * POST /send-email
 * ───────────────
 * Send an email via Resend from the browser (draft send button).
 * No auth required — called from approved .draft.html files.
 *
 * Body (JSON):
 * {
 *   "to": "recipient@example.com",
 *   "subject": "Subject line",
 *   "html": "<html>...</html>",
 *   "replyTo": "optional@forhemit.com"
 * }
 */
http.route({
	path: "/send-email",
	method: "POST",
	handler: httpAction(async (_ctx, request) => {
		try {
			const body = await request.json();

			if (!body.to || !body.subject || !body.html) {
				return new Response(
					JSON.stringify({
						success: false,
						error: "Missing required fields: to, subject, html",
					}),
					{ status: 400, headers: { ...CORS_HEADERS, ...JSON_HEADERS } },
				);
			}

			// Call Resend API directly (avoids auth requirement on internal actions)
			const resendKey = process.env.RESEND_API_KEY;
			if (!resendKey) {
				return new Response(
					JSON.stringify({ success: false, error: "RESEND_API_KEY not configured" }),
					{ status: 500, headers: { ...CORS_HEADERS, ...JSON_HEADERS } },
				);
			}

			const resendBody: Record<string, unknown> = {
				from: "Forhemit <deals@forhemit.com>",
				to: [body.to],
				subject: body.subject,
				html: body.html,
				reply_to: body.replyTo || "deals@forhemit.com",
			};

			// Include attachments if provided (base64-encoded)
			if (
				body.attachments &&
				Array.isArray(body.attachments) &&
				body.attachments.length > 0
			) {
				resendBody.attachments = body.attachments.map(
					(att: { filename: string; content: string }) => ({
						filename: att.filename,
						content: att.content,
					}),
				);
			}

			const resendResp = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${resendKey}`,
					...JSON_HEADERS,
				},
				body: JSON.stringify(resendBody),
			});

			const resendData = await resendResp.json();

			if (!resendResp.ok) {
				return new Response(
					JSON.stringify({
						success: false,
						error: resendData.message || "Resend API error",
					}),
					{ status: 500, headers: { ...CORS_HEADERS, ...JSON_HEADERS } },
				);
			}

			return new Response(
				JSON.stringify({ success: true, id: resendData.id }),
				{ status: 200, headers: { ...CORS_HEADERS, ...JSON_HEADERS } },
			);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";
			return new Response(JSON.stringify({ success: false, error: message }), {
				status: 500,
				headers: { ...CORS_HEADERS, ...JSON_HEADERS },
			});
		}
	}),
});

/**
 * OPTIONS /send-email
 * ───────────────────
 * CORS preflight for the send-email endpoint.
 */
http.route({
	path: "/send-email",
	method: "OPTIONS",
	handler: httpAction(async () => {
		return new Response(null, { status: 204, headers: CORS_HEADERS });
	}),
});

/**
 * POST /box-webhook
 * ─────────────────
 * Receives Box Sign webhook events and updates workflow task status.
 * Verifies HMAC-SHA256 signature using BOX_WEBHOOK_PRIMARY_KEY.
 *
 * Box events:
 *   SIGN_REQUEST.SIGNATURE_REQUESTED — signer was emailed
 *   SIGN_REQUEST.SIGNER_SIGNED — a signer signed
 *   SIGN_REQUEST.COMPLETED — all signers completed
 *   SIGN_REQUEST.DECLINED — signer declined
 *   SIGN_REQUEST.EXPIRED — request expired
 */
http.route({
	path: "/box-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		try {
			const rawBody = await request.text();

			// Verify webhook signature if key is configured
			const primaryKey = process.env.BOX_WEBHOOK_PRIMARY_KEY;
			if (primaryKey) {
				const signature = request.headers.get("box-signature-primary");
				if (signature) {
					// HMAC-SHA256 verification using Web Crypto API
					const encoder = new TextEncoder();
					const key = await crypto.subtle.importKey(
						"raw",
						encoder.encode(primaryKey),
						{ name: "HMAC", hash: "SHA-256" },
						false,
						["sign"],
					);
					const signed = await crypto.subtle.sign(
						"HMAC",
						key,
						encoder.encode(rawBody),
					);
					const expected = btoa(String.fromCharCode(...new Uint8Array(signed)));
					if (expected !== signature) {
						return new Response(
							JSON.stringify({ error: "Invalid signature" }),
							{ status: 401, headers: JSON_HEADERS },
						);
					}
				}
			}

			const body = JSON.parse(rawBody);

			// Handle webhook challenge (Box sends during setup)
			if (body.type === "webhook_challenge") {
				return new Response(JSON.stringify({ challenge: body.challenge }), {
					status: 200,
					headers: JSON_HEADERS,
				});
			}

			// Extract sign request data
			const eventType = body.event_type;
			const signRequest = body.sign_request;

			if (!eventType || !signRequest?.id) {
				return new Response(
					JSON.stringify({ error: "Missing event_type or sign_request.id" }),
					{ status: 400, headers: JSON_HEADERS },
				);
			}

			// Only handle sign-related events
			const handledEvents = [
				"SIGN_REQUEST.SIGNATURE_REQUESTED",
				"SIGN_REQUEST.SIGNER_SIGNED",
				"SIGN_REQUEST.COMPLETED",
				"SIGN_REQUEST.DECLINED",
				"SIGN_REQUEST.EXPIRED",
			];

			if (!handledEvents.includes(eventType)) {
				return new Response(JSON.stringify({ success: true, skipped: true }), {
					status: 200,
					headers: JSON_HEADERS,
				});
			}

			const signedFileId = signRequest.sign_files?.files?.[0]?.id;

			// Update the workflow task
			const result = await ctx.runMutation(api.box.handleBoxWebhook, {
				signRequestId: signRequest.id,
				eventType,
				signStatus: signRequest.status,
				signedFileId: signedFileId || undefined,
			});

			return new Response(JSON.stringify({ success: true, result }), {
				status: 200,
				headers: JSON_HEADERS,
			});
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";
			return new Response(JSON.stringify({ success: false, error: message }), {
				status: 500,
				headers: JSON_HEADERS,
			});
		}
	}),
});

export default http;
