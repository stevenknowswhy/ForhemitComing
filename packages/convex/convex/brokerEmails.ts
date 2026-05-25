import { v } from "convex/values";
import { action } from "./_generated/server";
import { sendAndLogEmail, sendTelegramMessage } from "./emailCore";

/**
 * Send broker introduction email with PDF attachment
 */
export const sendBrokerIntroductionEmail = action({
  args: {
    brokerEmail: v.string(),
    brokerFirstName: v.string(),
    brokerLastName: v.optional(v.string()),
    brokerFirm: v.optional(v.string()),
    brokerMarket: v.optional(v.string()),
    dealRef: v.optional(v.string()),
    senderName: v.string(),
    senderTitle: v.string(),
    senderEmail: v.string(),
    senderPhone: v.string(),
    introPdfBase64: v.optional(v.string()),
    tearSheetPdfBase64: v.optional(v.string()),
    subject: v.optional(v.string()),
    customMessage: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const html = args.customMessage
      ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1A2238; border-bottom: 2px solid #9A7540; padding-bottom: 10px;">
          ${args.subject || "Forhemit Transition Stewardship — Broker Introduction"}
        </h2>

        <div style="font-size: 14px; line-height: 1.7; color: #444; white-space: pre-wrap;">
          ${args.customMessage.replace(/\n/g, "<br>")}
        </div>
      </div>
      `
      : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1A2238; border-bottom: 2px solid #9A7540; padding-bottom: 10px;">
          ${args.subject || "Forhemit Transition Stewardship — Broker Introduction"}
        </h2>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Hi ${args.brokerFirstName},
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #444;">
          I hope this email finds you well. I'm reaching out from Forhemit Transition Stewardship regarding potential acquisition opportunities.
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #444;">
          Forhemit is actively looking for founder-owned businesses to acquire. What makes us different: the company buys itself. The seller exits at fair market value, employees become owners, and the business stays in the community.
        </p>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9A7540;">
          <h3 style="margin-top: 0; color: #1A2238; font-size: 14px;">What We're Looking For:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #444; font-size: 13px; line-height: 1.6;">
            <li>EBITDA of $3M – $15M</li>
            <li>20 or more W-2 employees</li>
            <li>Any industry — we are generalist buyers</li>
            <li>Primary markets: Florida, Texas, Tennessee</li>
            <li>C-corp preferred; S-corp deals require pre-close conversion</li>
            <li>Founder-led with consistent 3+ year financial history</li>
          </ul>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #444;">
          I've attached a detailed introduction document that explains our process, how everyone gets paid, and why sellers take a second look at our ESOP structure.
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #444;">
          If you have a listing that fits, I'd love to connect. If you're not sure, send it anyway — we confirm fit within 48 hours.
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0;">
            Best regards,<br><br>
            <strong>${args.senderName}</strong><br>
            ${args.senderTitle}<br>
            Forhemit Transition Stewardship<br>
            ${args.senderEmail}<br>
            ${args.senderPhone}<br>
            forhemit.com
          </p>
        </div>
      </div>
    `;

    const text = args.customMessage || `Hi ${args.brokerFirstName},

I hope this email finds you well. I'm reaching out from Forhemit Transition Stewardship regarding potential acquisition opportunities.

Forhemit is actively looking for founder-owned businesses to acquire. What makes us different: the company buys itself. The seller exits at fair market value, employees become owners, and the business stays in the community.

What We're Looking For:
• EBITDA of $3M – $15M
• 20 or more W-2 employees
• Any industry — we are generalist buyers
• Primary markets: Florida, Texas, Tennessee
• C-corp preferred; S-corp deals require pre-close conversion
• Founder-led with consistent 3+ year financial history

I've attached a detailed introduction document that explains our process, how everyone gets paid, and why sellers take a second look at our ESOP structure.

If you have a listing that fits, I'd love to connect. If you're not sure, send it anyway — we confirm fit within 48 hours.

Best regards,

${args.senderName}
${args.senderTitle}
Forhemit Transition Stewardship
${args.senderEmail}
${args.senderPhone}
forhemit.com`;

    // Prepare attachments if PDFs are provided
    const attachments: Array<{ filename: string; content: string }> = [];

    if (args.introPdfBase64) {
      attachments.push({
        filename: `Forhemit-Broker-Introduction-${args.brokerFirstName || 'Broker'}.pdf`,
        content: args.introPdfBase64.split(',')[1] || args.introPdfBase64,
      });
    }

    if (args.tearSheetPdfBase64) {
      attachments.push({
        filename: `Forhemit-Broker-Tear-Sheet-${args.brokerFirstName || 'Broker'}.pdf`,
        content: args.tearSheetPdfBase64.split(',')[1] || args.tearSheetPdfBase64,
      });
    }

    // Send email with PDF attachment
    const emailResult = await sendAndLogEmail(_ctx, {
      to: args.brokerEmail,
      subject: args.subject || "Forhemit Transition Stewardship — Broker Introduction",
      html,
      text,
      replyTo: args.senderEmail,
      attachments: attachments.length > 0 ? attachments : undefined,
    }, { templateId: "broker-introduction" });

    // Send Telegram notification
    const telegramText = [
      "📧 Broker Introduction Email Sent",
      "",
      `To: ${args.brokerFirstName} ${args.brokerLastName || ""}`.trim(),
      `Email: ${args.brokerEmail}`,
      args.brokerFirm ? `Firm: ${args.brokerFirm}` : "",
      args.brokerMarket ? `Market: ${args.brokerMarket}` : "",
      args.dealRef ? `Re: ${args.dealRef}` : "",
      "",
      `Attachments: ${attachments.length > 0 ? attachments.map(a => a.filename).join(', ') : 'None'}`,
      "",
      `Sent by: ${args.senderName}`,
    ].filter(Boolean).join("\n");

    const telegramResult = await sendTelegramMessage(telegramText);

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send broker tear sheet PDF to broker
 */
export const sendBrokerTearSheet = action({
  args: {
    brokerEmail: v.string(),
    brokerFirstName: v.string(),
    brokerLastName: v.optional(v.string()),
    brokerFirm: v.optional(v.string()),
    brokerMarket: v.optional(v.string()),
    dealRef: v.optional(v.string()),
    senderName: v.string(),
    senderTitle: v.string(),
    senderEmail: v.string(),
    senderPhone: v.string(),
    pdfBase64: v.string(),
    subject: v.optional(v.string()),
    customMessage: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1A2238; border-bottom: 2px solid #9A7540; padding-bottom: 10px;">
          ${args.subject || "Forhemit — Broker Tear Sheet"}
        </h2>

        <div style="font-size: 14px; line-height: 1.7; color: #444; white-space: pre-wrap;">
          ${(args.customMessage || "Please find attached our Broker Tear Sheet.").replace(/\n/g, "<br>")}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0;">
            Best regards,<br><br>
            <strong>${args.senderName}</strong><br>
            ${args.senderTitle}<br>
            Forhemit Transition Stewardship<br>
            ${args.senderEmail}<br>
            ${args.senderPhone}<br>
            forhemit.com
          </p>
        </div>
      </div>
    `;

    const text = args.customMessage || `Hi ${args.brokerFirstName},

Please find attached our Broker Tear Sheet with deal criteria, economics, and process details.

If you have a listing that fits, I'd love to connect. We confirm fit within 48 hours.

Best regards,

${args.senderName}
${args.senderTitle}
Forhemit Transition Stewardship
${args.senderEmail}
${args.senderPhone}
forhemit.com`;

    // Prepare PDF attachment
    const attachments = args.pdfBase64
      ? [{
          filename: `Forhemit-Broker-Tear-Sheet-${args.brokerFirstName || 'Broker'}.pdf`,
          content: args.pdfBase64.split(',')[1] || args.pdfBase64,
        }]
      : undefined;

    // Send email with PDF attachment
    const emailResult = await sendAndLogEmail(_ctx, {
      to: args.brokerEmail,
      subject: args.subject || "Forhemit — Broker Tear Sheet",
      html,
      text,
      replyTo: args.senderEmail,
      attachments,
    }, { templateId: "broker-tear-sheet" });

    // Send Telegram notification
    const telegramText = [
      "📧 Broker Tear Sheet Sent",
      "",
      `To: ${args.brokerFirstName} ${args.brokerLastName || ""}`.trim(),
      `Email: ${args.brokerEmail}`,
      args.brokerFirm ? `Firm: ${args.brokerFirm}` : "",
      args.brokerMarket ? `Market: ${args.brokerMarket}` : "",
      args.dealRef ? `Re: ${args.dealRef}` : "",
      "",
      `Sent by: ${args.senderName}`,
    ].filter(Boolean).join("\n");

    const telegramResult = await sendTelegramMessage(telegramText);

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});
