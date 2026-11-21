import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

// Declare process.env for Convex runtime (Node.js types not in tsconfig)
declare const process: {
	env: {
		RESEND_API_KEY?: string;
		BOX_WEBHOOK_PRIMARY_KEY?: string;
		STRIPE_WEBHOOK_SECRET?: string;
		CORS_ALLOWED_ORIGINS?: string;
	};
};

const http = httpRouter();

const JSON_HEADERS = { "Content-Type": "application/json" };

// CORS wildcard is intentional — draft HTML emails open from file:// origin
const CORS_HEADERS = {
	"Access-Control-Allow-Origin": process.env.CORS_ALLOWED_ORIGINS ?? "https://forhemit.website,https://admin.forhemit.website",
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

/**
 * POST /log-journal-entry
 * ──────────────────────
 * Create a journal entry for a system event.
 * Called from admin API routes (generate-document, etc.)
 *
 * Body (JSON): { companyId, entryType, title, description, ... }
 */
http.route({
	path: "/log-journal-entry",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		try {
			const body = await request.json();

			if (
				!body.companyId ||
				!body.entryType ||
				!body.title ||
				!body.description
			) {
				return new Response(
					JSON.stringify({
						success: false,
						error:
							"Missing required fields: companyId, entryType, title, description",
					}),
					{ status: 400, headers: JSON_HEADERS },
				);
			}

			const result = await ctx.runMutation(api.journalEntries.autoLog, {
				companyId: body.companyId,
				entryType: body.entryType,
				theme: body.theme,
				title: body.title,
				description: body.description,
				clientDescription: body.clientDescription,
				outcome: body.outcome,
				touchpointType: body.touchpointType,
				performedBy: body.performedBy || "system",
				performedByRole: body.performedByRole,
				participants: body.participants,
				relatedDocuments: body.relatedDocuments,
				relatedTaskId: body.relatedTaskId,
				visibleToClient: body.visibleToClient,
				sensitivity: body.sensitivity,
				internalNote: body.internalNote,
				autoGeneratedFrom: body.autoGeneratedFrom || "api_call",
			});

			return new Response(JSON.stringify({ success: true, entryId: result }), {
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

/**
 * POST /stripe-webhook
 * ────────────────────
 * Stripe Checkout webhooks for the Self Guided Transition Service
 * (STRIPE-CHECKOUT-SPEC-2026-11-18.md). Verifies the Stripe signature
 * (HMAC-SHA256 over "<timestamp>.<raw body>" with STRIPE_WEBHOOK_SECRET,
 * 5-minute tolerance) before trusting anything in the event.
 *   checkout.session.completed — mark the bound record paid (idempotent),
 *     then fire the existing admin notification path.
 *   checkout.session.expired — state hygiene on the stored session.
 * Logs event types and session IDs only — never payer details.
 */
http.route({
	path: "/stripe-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
		if (!webhookSecret) {
			return new Response(
				JSON.stringify({ error: "Stripe webhook not configured" }),
				{ status: 500, headers: JSON_HEADERS },
			);
		}
		try {
			const rawBody = await request.text();
			const signatureHeader = request.headers.get("stripe-signature");
			if (!signatureHeader) {
				return new Response(
					JSON.stringify({ error: "Missing stripe-signature header" }),
					{ status: 400, headers: JSON_HEADERS },
				);
			}

			// Parse the Stripe signature header: t=<ts>,v1=<hex>[,v1=<hex>...]
			let timestamp = "";
			const signatures: string[] = [];
			for (const part of signatureHeader.split(",")) {
				const [key, value] = part.split("=");
				if (key === "t") timestamp = value;
				if (key === "v1") signatures.push(value);
			}
			if (!timestamp || signatures.length === 0) {
				return new Response(
					JSON.stringify({ error: "Malformed stripe-signature header" }),
					{ status: 400, headers: JSON_HEADERS },
				);
			}
			if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) {
				return new Response(
					JSON.stringify({ error: "Signature timestamp outside tolerance" }),
					{ status: 400, headers: JSON_HEADERS },
				);
			}

			const encoder = new TextEncoder();
			const cryptoKey = await crypto.subtle.importKey(
				"raw",
				encoder.encode(webhookSecret),
				{ name: "HMAC", hash: "SHA-256" },
				false,
				["sign"],
			);
			const mac = await crypto.subtle.sign(
				"HMAC",
				cryptoKey,
				encoder.encode(`${timestamp}.${rawBody}`),
			);
			const expected = Array.from(new Uint8Array(mac))
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");
			const matches = signatures.some((sig) => {
				if (sig.length !== expected.length) return false;
				let diff = 0;
				for (let i = 0; i < sig.length; i++) {
					diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
				}
				return diff === 0;
			});
			if (!matches) {
				return new Response(
					JSON.stringify({ error: "Invalid signature" }),
					{ status: 400, headers: JSON_HEADERS },
				);
			}

			const event = JSON.parse(rawBody);
			const session = event?.data?.object ?? {};
			console.log("stripe webhook", event?.type, session.id);

			if (event?.type === "checkout.session.completed") {
				let paymentId = session.metadata?.convex_payment_id;
				if (!paymentId && session.id) {
					const record = await ctx.runQuery(
						internal.stripeCheckout.getPaymentBySession,
						{ sessionId: session.id },
					);
					paymentId = record?._id;
				}
				if (!paymentId) {
					return new Response(
						JSON.stringify({ received: true, warning: "no bound record" }),
						{ status: 200, headers: JSON_HEADERS },
					);
				}
				const result = await ctx.runMutation(
					internal.stripeCheckout.markPaid,
					{
						paymentId,
						sessionId: session.id,
						paymentIntent:
							typeof session.payment_intent === "string"
								? session.payment_intent
								: undefined,
						amountTotal:
							typeof session.amount_total === "number"
								? session.amount_total
								: undefined,
						currency:
							typeof session.currency === "string"
								? session.currency
								: undefined,
					},
				);
				if (result?.ok && !result.alreadyPaid) {
					await ctx.runAction(
						internal.stripeCheckout.notifyPaymentReceived,
						{ paymentId },
					);
				}
			} else if (event?.type === "checkout.session.expired") {
				if (session.id) {
					await ctx.runMutation(
						internal.stripeCheckout.markSessionExpired,
						{ sessionId: session.id },
					);
				}
			}

			return new Response(JSON.stringify({ received: true }), {
				status: 200,
				headers: JSON_HEADERS,
			});
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";
			console.error("stripe webhook error", message);
			return new Response(JSON.stringify({ success: false, error: message }), {
				status: 500,
				headers: JSON_HEADERS,
			});
		}
	}),
});

export default http;
