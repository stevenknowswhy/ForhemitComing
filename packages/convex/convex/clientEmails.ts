import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import {
	sendAndLogEmail,
	sendTelegramMessage,
	emailLayout,
	BRAND,
} from "./emailCore";
import { logEvent } from "./lib/logEvent";
import { LOG_ACTIONS } from "./lib/logEvents.constants";
import type { Id } from "./_generated/dataModel";

// ── Business Log Mutation ───────────────────────────────

/**
 * Log a business event for letter generation/sending.
 * Called from actions via ctx.runMutation.
 */
export const logLetterEvent = mutation({
	args: {
		eventType: v.string(),
		summary: v.string(),
		clientSummary: v.optional(v.string()),
		visibility: v.union(
			v.literal("system"),
			v.literal("internal"),
			v.literal("external"),
			v.literal("client"),
		),
		companyId: v.optional(v.id("crmCompanies")),
		recipientEmail: v.string(),
		documentType: v.string(),
	},
	handler: async (ctx, args) => {
		const base = {
			eventType: args.eventType,
			category: "email" as const,
			summary: args.summary,
			actorType: "user" as const,
			actorLabel: "Stefano Stokes",
			clientActorLabel: "Forhemit Team",
			source: "admin_ui" as const,
			companyId: (args.companyId ?? undefined) as
				| Id<"crmCompanies">
				| undefined,
			entityType: "introductionLetter",
			severity: "info" as const,
			publicMetadata: {
				recipientEmail: args.recipientEmail,
				documentType: args.documentType,
			},
		};

		if (args.visibility === "external" || args.visibility === "client") {
			await logEvent(ctx, {
				...base,
				visibility: args.visibility,
				clientSummary:
					args.clientSummary || "Forhemit shared a document with you",
			});
		} else {
			await logEvent(ctx, {
				...base,
				visibility: args.visibility,
			});
		}
	},
});

// ── Helper: log business events from actions ────────────

async function logLetterGenerated(
	ctx: { runMutation: (fn: any, args: any) => Promise<any> },
	summary: string,
	recipientEmail: string,
	documentType: string,
	companyId?: Id<"crmCompanies">,
) {
	try {
		await ctx.runMutation((await import("./clientEmails")).logLetterEvent, {
			eventType: LOG_ACTIONS.DOC_GENERATED,
			summary,
			visibility: "internal",
			recipientEmail,
			documentType,
			companyId,
		});
	} catch (e) {
		console.error("[businessLog] Failed to log letter generation:", e);
	}
}

async function logLetterSent(
	ctx: { runMutation: (fn: any, args: any) => Promise<any> },
	summary: string,
	clientSummary: string,
	recipientEmail: string,
	documentType: string,
	companyId?: Id<"crmCompanies">,
) {
	try {
		await ctx.runMutation((await import("./clientEmails")).logLetterEvent, {
			eventType: LOG_ACTIONS.DOC_EMAILED,
			summary,
			clientSummary,
			visibility: "external",
			recipientEmail,
			documentType,
			companyId,
		});
	} catch (e) {
		console.error("[businessLog] Failed to log email send:", e);
	}
}

// ── Engagement Letter Queries ───────────────────────────

/**
 * Fetch company + related contacts for engagement letter auto-fill.
 * Returns all fields needed to populate the v3 Deal Configuration panel.
 */
/**
 * Parse EBITDA string (e.g., "$5.2M", "4500000") to a numeric string for the form.
 */
function parseEbitdaString(val?: string): string {
	if (!val) return "";
	const cleaned = val.replace(/[^0-9.]/g, "");
	const num = parseFloat(cleaned);
	if (isNaN(num)) return "";
	if (/[Mm]/.test(val)) return String(num * 1_000_000);
	if (/[Kk]/.test(val)) return String(num * 1_000);
	return String(num);
}

export const getCompanyForEngagementLetter = query({
	args: { companyId: v.id("crmCompanies") },
	handler: async (ctx, args) => {
		const company = await ctx.db.get(args.companyId);
		if (!company) return null;

		// Fetch related contacts
		const seller = company.sellerContactId
			? await ctx.db.get(company.sellerContactId)
			: null;
		const broker = company.brokerContactId
			? await ctx.db.get(company.brokerContactId)
			: null;

		return {
			// Company
			companyId: company._id,
			name: company.name,
			ref: company.ref || "",
			ebitda: parseEbitdaString(company.ebitda),
			ebitdaDisplay: company.ebitda || "",
			stage: company.stage,
			boxFolderId: company.boxFolderId || null,
			fees: company.fees || null,

			// Seller contact
			seller: seller
				? {
						contactId: seller._id,
						firstName: seller.firstName,
						lastName: seller.lastName,
						email: seller.email || "",
						phone: seller.phone || "",
						role: seller.role || "",
					}
				: null,

			// Broker contact
			broker: broker
				? {
						contactId: broker._id,
						firstName: broker.firstName,
						lastName: broker.lastName,
						email: broker.email || "",
						phone: broker.phone || "",
					}
				: null,
		};
	},
});

// ── Client Introduction Email ───────────────────────────

/**
 * Send client introduction email with optional PDF attachment.
 * This is the warm first-contact letter — sets the tone, explains what
 * Forhemit does, how the process works, and why it matters.
 */
export const sendClientIntroductionEmail = action({
	args: {
		to: v.string(),
		firstName: v.string(),
		senderFirstName: v.string(),
		senderLastName: v.string(),
		senderTitle: v.string(),
		senderCompany: v.string(),
		senderEmail: v.string(),
		senderPhone: v.string(),
		subject: v.optional(v.string()),
		customMessage: v.optional(v.string()),
		pdfBase64: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const firstName = args.firstName || "there";
		const subject =
			args.subject || "An Introduction to Forhemit Transition Stewardship";

		// Build HTML email body
		const html = args.customMessage
			? `
			<div style="font-family: 'Cormorant Garamond', Georgia, serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #1C1510; line-height: 1.75; font-size: 15px;">
				<div style="background: #1A2238; padding: 14px 24px; margin: -24px -24px 20px;">
					<div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase; color: #F8F5EF;">Forhemit</div>
					<div style="font-size: 10px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(248,245,239,0.4); margin-top: 2px;">Transition Stewardship</div>
				</div>
				<div style="white-space: pre-wrap; font-family: Georgia, serif; font-size: 14px; line-height: 1.75; color: #3d3832;">
					${args.customMessage.replace(/\n/g, "<br>")}
				</div>
				<div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #D4CBBF;">
					<div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 400; color: #1A2238;">${args.senderFirstName} ${args.senderLastName}</div>
					<div style="font-size: 12px; color: #7A7060; line-height: 1.6; margin-top: 2px;">${args.senderTitle} · ${args.senderCompany}</div>
				</div>
			</div>`
			: `
			<div style="font-family: Georgia, serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #1C1510; line-height: 1.75; font-size: 14px;">
				<p>${firstName},</p>
				<p>Most business owners who reach this stage have spent years — sometimes decades — building something that cannot be fully captured on a spreadsheet. Our firm exists for exactly this moment.</p>
				<p>I've attached our introduction letter which walks through what we do, how we work, and why this matters. I'd welcome a conversation to learn more about your goals.</p>
				<p>Warm regards,<br><strong>${args.senderFirstName} ${args.senderLastName}</strong><br>${args.senderTitle}<br>${args.senderCompany}</p>
			</div>`;

		const text =
			args.customMessage ||
			`${firstName},\n\nMost business owners who reach this stage have spent years — sometimes decades — building something that cannot be fully captured on a spreadsheet. Our firm exists for exactly this moment.\n\nI've attached our introduction letter which walks through what we do, how we work, and why this matters. I'd welcome a conversation to learn more about your goals.\n\nWarm regards,\n${args.senderFirstName} ${args.senderLastName}\n${args.senderTitle}\n${args.senderCompany}`;

		const attachments = args.pdfBase64
			? [
					{
						filename: "Forhemit-Introduction-Letter.pdf",
						content: args.pdfBase64.split(",")[1] || args.pdfBase64,
					},
				]
			: undefined;

		// Log: letter generated
		await logLetterGenerated(
			ctx,
			`Introduction Letter generated for ${firstName} (${args.to})`,
			args.to,
			"client_introduction_letter",
		);

		// Send email
		const emailResult = await sendAndLogEmail(
			ctx,
			{
				to: args.to,
				subject,
				html,
				text,
				replyTo: args.senderEmail,
				attachments,
			},
			{ templateId: "client-introduction-letter" },
		);

		// Log: email sent (client-visible)
		if (emailResult.success) {
			await logLetterSent(
				ctx,
				`Introduction Letter emailed to ${args.to}`,
				"Forhemit shared an introduction letter outlining how we work and why employee ownership matters",
				args.to,
				"client_introduction_letter",
			);
		}

		// Telegram notification
		const telegramLines = [
			"📧 Client Introduction Letter Sent",
			"",
			`To: ${firstName}`,
			`Email: ${args.to}`,
			`Subject: ${subject}`,
			"",
			`Attachments: ${attachments ? attachments.map((a) => a.filename).join(", ") : "None"}`,
			"",
			`Sent by: ${args.senderFirstName} ${args.senderLastName}`,
		];
		const telegramResult = await sendTelegramMessage(telegramLines.join("\n"));

		return {
			success: emailResult.success || telegramResult.success,
			email: emailResult,
			telegram: telegramResult,
		};
	},
});

// ── Preliminary Review Email ────────────────────────────

/**
 * Send preliminary review / valuation email with optional PDF attachment.
 * This is the second letter — includes valuation perspective, fee structure,
 * and how Forhemit is paid. Sent after initial conversations.
 */
export const sendPreliminaryReviewEmail = action({
	args: {
		to: v.string(),
		firstName: v.string(),
		companyName: v.string(),
		brokerFirstName: v.optional(v.string()),
		brokerLastName: v.optional(v.string()),
		valuationAmount: v.string(),
		senderFirstName: v.string(),
		senderLastName: v.string(),
		senderTitle: v.string(),
		senderCompany: v.string(),
		senderEmail: v.string(),
		senderPhone: v.string(),
		subject: v.optional(v.string()),
		customMessage: v.optional(v.string()),
		pdfBase64: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const company = args.companyName || "your company";
		const subject =
			args.subject || `Initial Review and Alignment for ${company}`;

		// Build HTML email body
		const html = args.customMessage
			? `
			<div style="font-family: 'Cormorant Garamond', Georgia, serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #1C1510; line-height: 1.75; font-size: 15px;">
				<div style="background: #1A2238; padding: 14px 24px; margin: -24px -24px 20px;">
					<div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase; color: #F8F5EF;">Forhemit</div>
					<div style="font-size: 10px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(248,245,239,0.4); margin-top: 2px;">Transition Stewardship</div>
				</div>
				<div style="white-space: pre-wrap; font-family: Georgia, serif; font-size: 14px; line-height: 1.75; color: #3d3832;">
					${args.customMessage.replace(/\n/g, "<br>")}
				</div>
				<div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #D4CBBF;">
					<div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 400; color: #1A2238;">${args.senderFirstName} ${args.senderLastName}</div>
					<div style="font-size: 12px; color: #7A7060; line-height: 1.6; margin-top: 2px;">${args.senderTitle} · ${args.senderCompany}</div>
				</div>
			</div>`
			: `
			<div style="font-family: Georgia, serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #1C1510; line-height: 1.75; font-size: 14px;">
				<p>${args.firstName || "there"},</p>
				<p>This letter is meant to give you a clear, practical picture of where we believe <strong>${company}</strong> stands today and how a Forhemit engagement would work.</p>
				<p>We anticipate a preliminary starting valuation of approximately <strong>${args.valuationAmount || "$XX million"}</strong>. This is not a formal valuation — the official purchase price will be determined by an independent, third-party appraisal.</p>
				<p>I've attached our full preliminary review letter with details on our fee structure and how we are paid.</p>
				<p>Best,<br><strong>${args.senderFirstName} ${args.senderLastName}</strong><br>${args.senderTitle}<br>${args.senderCompany}</p>
			</div>`;

		const text =
			args.customMessage ||
			`${args.firstName || "there"},\n\nThis letter is meant to give you a clear, practical picture of where we believe ${company} stands today and how a Forhemit engagement would work.\n\nWe anticipate a preliminary starting valuation of approximately ${args.valuationAmount || "$XX million"}. This is not a formal valuation — the official purchase price will be determined by an independent, third-party appraisal.\n\nI've attached our full preliminary review letter with details on our fee structure and how we are paid.\n\nBest,\n${args.senderFirstName} ${args.senderLastName}\n${args.senderTitle}\n${args.senderCompany}`;

		const attachments = args.pdfBase64
			? [
					{
						filename: `Forhemit-Preliminary-Review-${company.replace(/\s+/g, "-")}.pdf`,
						content: args.pdfBase64.split(",")[1] || args.pdfBase64,
					},
				]
			: undefined;

		// Log: letter generated
		await logLetterGenerated(
			ctx,
			`Preliminary Review Letter generated for ${company} (${args.to})`,
			args.to,
			"preliminary_review_letter",
		);

		// Send email
		const emailResult = await sendAndLogEmail(
			ctx,
			{
				to: args.to,
				subject,
				html,
				text,
				replyTo: args.senderEmail,
				attachments,
			},
			{ templateId: "preliminary-review-letter" },
		);

		// Log: email sent (client-visible)
		if (emailResult.success) {
			await logLetterSent(
				ctx,
				`Preliminary Review Letter emailed to ${args.to} for ${company}`,
				"Forhemit shared a preliminary review with an initial valuation perspective and fee structure",
				args.to,
				"preliminary_review_letter",
			);
		}

		// Telegram notification
		const telegramLines = [
			"📧 Preliminary Review Letter Sent",
			"",
			`Company: ${company}`,
			`To: ${args.firstName || "Client"}`,
			`Email: ${args.to}`,
			`Valuation: ${args.valuationAmount || "Not specified"}`,
			args.brokerFirstName || args.brokerLastName
				? `Broker: ${[args.brokerFirstName, args.brokerLastName].filter(Boolean).join(" ")}`
				: "",
			`Subject: ${subject}`,
			"",
			`Attachments: ${attachments ? attachments.map((a) => a.filename).join(", ") : "None"}`,
			"",
			`Sent by: ${args.senderFirstName} ${args.senderLastName}`,
		].filter(Boolean);
		const telegramResult = await sendTelegramMessage(telegramLines.join("\n"));

		return {
			success: emailResult.success || telegramResult.success,
			email: emailResult,
			telegram: telegramResult,
		};
	},
});

// ── Engagement Letter Email ─────────────────────────────

/**
 * Send engagement letter via email with PDF attachment.
 * Used by the Quick Send workflow in the admin letters section.
 */
export const sendEngagementLetterEmail = action({
	args: {
		to: v.string(),
		companyName: v.string(),
		officerName: v.string(),
		engagementRef: v.string(),
		subject: v.optional(v.string()),
		customMessage: v.optional(v.string()),
		pdfBase64: v.string(),
		companyId: v.optional(v.id("crmCompanies")),
	},
	handler: async (ctx, args) => {
		const subject =
			args.subject || `Forhemit — Engagement Letter for ${args.companyName}`;
		const companyName = args.companyName || "your company";

		const messageText =
			args.customMessage ||
			`Please find attached the Engagement Letter for ${companyName}.

Reference: ${args.engagementRef || "—"}

This letter outlines the scope of services, fee structure, and terms of the proposed engagement. Please review with your counsel and CPA.

If you have any questions, please don't hesitate to reach out.`;

		const html = emailLayout({
			title: "Engagement Letter",
			preheader: `Forhemit engagement letter for ${companyName} — ref ${args.engagementRef}`,
			content: `
				<p style="font-size: 14px; color: ${BRAND.textBody}; line-height: 1.75; margin: 0 0 16px;">${args.officerName || "Dear Sir or Madam"},</p>
				<div style="font-size: 14px; color: ${BRAND.textBody}; line-height: 1.75; white-space: pre-wrap;">${messageText.replace(/\n/g, "<br>")}</div>
				<p style="font-size: 14px; color: ${BRAND.textBody}; line-height: 1.75; margin: 20px 0 0;">
					Warm regards,<br>
					<strong>Stefano Stokes</strong><br>
					<span style="color: ${BRAND.textGray};">Founder & Managing Director · Forhemit Transition Stewardship</span>
				</p>
			`,
			transactional: true,
		});

		const text = `${args.officerName || "Dear Sir or Madam"},\n\n${messageText}\n\nWarm regards,\nStefano Stokes\nFounder & Managing Director\nForhemit Transition Stewardship`;

		const pdfContent = args.pdfBase64.split(",")[1] || args.pdfBase64;

		const attachments = [
			{
				filename: `Forhemit-Engagement-Letter-${args.engagementRef || "document"}.pdf`,
				content: pdfContent,
			},
		];

		await logLetterGenerated(
			ctx,
			`Engagement Letter generated for ${companyName} (${args.engagementRef})`,
			args.to,
			"engagement_letter",
			args.companyId as Id<"crmCompanies"> | undefined,
		);

		const emailResult = await sendAndLogEmail(
			ctx,
			{
				to: args.to,
				subject,
				html,
				text,
				replyTo: "deals@forhemit.com",
				attachments,
			},
			{
				templateId: "engagement-letter",
				relatedCompanyId: args.companyId as Id<"crmCompanies"> | undefined,
			},
		);

		if (emailResult.success) {
			await logLetterSent(
				ctx,
				`Engagement Letter emailed to ${args.to} for ${companyName}`,
				`Forhemit sent the Engagement Letter for ${companyName} (ref: ${args.engagementRef})`,
				args.to,
				"engagement_letter",
				args.companyId as Id<"crmCompanies"> | undefined,
			);
		}

		const telegramLines = [
			"📧 Engagement Letter Sent",
			"",
			`Company: ${companyName}`,
			`Officer: ${args.officerName || "—"}`,
			`Ref: ${args.engagementRef || "—"}`,
			`To: ${args.to}`,
			`Subject: ${subject}`,
			`Attachment: Forhemit-Engagement-Letter-${args.engagementRef || "document"}.pdf`,
			"",
			`Sent via Quick Send`,
		].join("\n");
		const telegramResult = await sendTelegramMessage(telegramLines);

		return {
			success: emailResult.success || telegramResult.success,
			email: emailResult,
			telegram: telegramResult,
		};
	},
});
