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
					JSON.stringify({
						success: false,
						error: "RESEND_API_KEY not configured",
					}),
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
