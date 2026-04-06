import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";

// Email configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "contact@forhemit.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "stefano.stokes@forhemit.com";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64 encoded
  }>;
}

/**
 * Send email using Resend API
 */
async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string; id?: string }> {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const body: Record<string, unknown> = {
      from: payload.from || FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo,
    };

    // Add attachments if provided
    if (payload.attachments && payload.attachments.length > 0) {
      body.attachments = payload.attachments.map(att => ({
        filename: att.filename,
        content: att.content,
      }));
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }

    console.log("Email sent successfully:", data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error("Error sending email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error sending email" 
    };
  }
}

/**
 * Send Telegram message using Bot API
 */
const TELEGRAM_MAX_MESSAGE_LENGTH = 4096;

async function sendTelegramMessage(text: string): Promise<{ success: boolean; error?: string; id?: string }> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured");
    return { success: false, error: "Telegram service not configured" };
  }

  const payload =
    text.length > TELEGRAM_MAX_MESSAGE_LENGTH
      ? `${text.slice(0, TELEGRAM_MAX_MESSAGE_LENGTH - 20)}\n\n…(truncated)`
      : text;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: payload,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("Telegram API error:", data);
      return { success: false, error: data.description || "Failed to send Telegram message" };
    }

    return { success: true, id: String(data.result?.message_id ?? "") };
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending Telegram message",
    };
  }
}

const CONTACT_TELEGRAM_TYPE_LABELS: Record<string, string> = {
  "business-owner": "Business Owner (ESOP Transition)",
  partner: "Partner (Accounting, Legal, Lending, etc.)",
  "existing-business": "Existing Portfolio Business",
  "website-visitor": "General Inquiry",
  marketing: "Marketing / Vendor Services",
};

const CONTACT_TELEGRAM_INTEREST_LABELS: Record<string, string> = {
  "esop-transition": "ESOP Transition",
  accounting: "Accounting Partnership",
  legal: "Legal Partnership",
  lending: "Lending Partnership",
  broker: "Business Broker Partnership",
  wealth: "Wealth Management Partnership",
  appraisal: "Appraisal / Valuation Partnership",
  career: "Career Opportunities",
  general: "General Inquiry",
};

function buildContactSubmissionTelegramText(args: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  contactType: string;
  interest?: string;
  message: string;
  source?: string;
}): string {
  return [
    "📬 Contact form message delivered",
    "",
    `Name: ${args.firstName} ${args.lastName}`,
    `Email: ${args.email}`,
    args.phone ? `Phone: ${args.phone}` : "",
    args.company ? `Company: ${args.company}` : "",
    `Type: ${CONTACT_TELEGRAM_TYPE_LABELS[args.contactType] || args.contactType}`,
    args.interest
      ? `Interest: ${CONTACT_TELEGRAM_INTEREST_LABELS[args.interest] || args.interest}`
      : "",
    `Source: ${args.source || "Website"}`,
    "",
    "Message:",
    args.message,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Fired when a new submission is stored so Telegram alerts do not depend on the public site calling an action. */
export const notifyContactSubmissionTelegram = internalAction({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    contactType: v.string(),
    interest: v.optional(v.string()),
    message: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    return await sendTelegramMessage(buildContactSubmissionTelegramText(args));
  },
});

/**
 * Send contact form notification to admin
 */
export const sendContactFormNotification = action({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    contactType: v.string(),
    interest: v.optional(v.string()),
    message: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const contactTypeLabels: Record<string, string> = {
      "business-owner": "Business Owner (ESOP Transition)",
      "partner": "Partner (Accounting, Legal, Lending, etc.)",
      "existing-business": "Existing Portfolio Business",
      "website-visitor": "General Inquiry",
      "marketing": "Marketing / Vendor Services",
    };

    const interestLabels: Record<string, string> = {
      "esop-transition": "ESOP Transition",
      "accounting": "Accounting Partnership",
      "legal": "Legal Partnership",
      "lending": "Lending Partnership",
      "broker": "Business Broker Partnership",
      "wealth": "Wealth Management Partnership",
      "appraisal": "Appraisal / Valuation Partnership",
      "career": "Career Opportunities",
      "general": "General Inquiry",
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${args.firstName} ${args.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${args.email}">${args.email}</a></td>
            </tr>
            ${args.phone ? `
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;">${args.phone}</td>
            </tr>
            ` : ""}
            ${args.company ? `
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Company:</strong></td>
              <td style="padding: 8px 0;">${args.company}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Type:</strong></td>
              <td style="padding: 8px 0;">${contactTypeLabels[args.contactType] || args.contactType}</td>
            </tr>
            ${args.interest ? `
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Interest:</strong></td>
              <td style="padding: 8px 0;">${interestLabels[args.interest] || args.interest}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Source:</strong></td>
              <td style="padding: 8px 0;">${args.source || "Website"}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #444;">${args.message.replace(/\n/g, "<br>")}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>This email was sent from the Forhemit website contact form.</p>
          <p>© ${new Date().getFullYear()} Forhemit. All rights reserved.</p>
        </div>
      </div>
    `;

    const text = `
New Contact Form Submission

Contact Information:
-------------------
Name: ${args.firstName} ${args.lastName}
Email: ${args.email}
${args.phone ? `Phone: ${args.phone}\n` : ""}${args.company ? `Company: ${args.company}\n` : ""}Type: ${contactTypeLabels[args.contactType] || args.contactType}
${args.interest ? `Interest: ${interestLabels[args.interest] || args.interest}\n` : ""}Source: ${args.source || "Website"}

Message:
--------
${args.message}

---
This email was sent from the Forhemit website contact form.
© ${new Date().getFullYear()} Forhemit. All rights reserved.
    `.trim();

    const emailResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Contact Form: ${args.firstName} ${args.lastName} - ${contactTypeLabels[args.contactType] || args.contactType}`,
      html,
      text,
      replyTo: args.email,
    });

    const telegramResult = await sendTelegramMessage(buildContactSubmissionTelegramText(args));

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

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
    const emailResult = await sendEmail({
      to: args.brokerEmail,
      subject: args.subject || "Forhemit Transition Stewardship — Broker Introduction",
      html,
      text,
      replyTo: args.senderEmail,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

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
 * Send infrastructure audit notification to admin
 */
export const sendInfrastructureAuditNotification = action({
  args: {
    lane: v.string(),
    score: v.number(),
    status: v.string(),
    statusLabel: v.string(),
    answers: v.object({
      q1: v.number(),
      q2: v.number(),
      q3: v.number(),
      q4: v.number(),
      q5: v.number(),
    }),
  },
  handler: async (_ctx, args) => {
    const laneLabels: Record<string, string> = {
      resilience: "Lane 1: Resilience",
      stewardship: "Lane 2: Stewardship",
      competitive: "Lane 3: Competitive",
    };

    const statusColors: Record<string, string> = {
      optimal: "#2e7d32",
      warning: "#ed6c02",
      critical: "#d32f2f",
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          🏢 New Infrastructure Audit Completed
        </h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Audit Results</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Lane:</strong></td>
              <td style="padding: 8px 0;">${laneLabels[args.lane] || args.lane}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Score:</strong></td>
              <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: ${statusColors[args.status] || "#333"};">${args.score}/100</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; color: ${statusColors[args.status] || "#333"}; font-weight: bold;">${args.statusLabel}</td>
            </tr>
          </table>
        </div>
        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Score Breakdown</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Cash Flow (Q1):</strong></td>
              <td style="padding: 8px 0;">${args.answers.q1}/20</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Personnel Grid (Q2):</strong></td>
              <td style="padding: 8px 0;">${args.answers.q2}/20</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Autonomy (Q3):</strong></td>
              <td style="padding: 8px 0;">${args.answers.q3}/20</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Tenure (Q4):</strong></td>
              <td style="padding: 8px 0;">${args.answers.q4}/20</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Documentation (Q5):</strong></td>
              <td style="padding: 8px 0;">${args.answers.q5}/20</td>
            </tr>
          </table>
        </div>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>Sent from the Forhemit Infrastructure Audit.</p>
        </div>
      </div>
    `;

    const textLines = [
      "🏢 New Infrastructure Audit Completed",
      "",
      `Lane: ${laneLabels[args.lane] || args.lane}`,
      `Score: ${args.score}/100`,
      `Status: ${args.statusLabel}`,
      "",
      "Score Breakdown:",
      `- Cash Flow (Q1): ${args.answers.q1}/20`,
      `- Personnel Grid (Q2): ${args.answers.q2}/20`,
      `- Autonomy (Q3): ${args.answers.q3}/20`,
      `- Tenure (Q4): ${args.answers.q4}/20`,
      `- Documentation (Q5): ${args.answers.q5}/20`,
    ].filter(Boolean);

    const emailResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `🏢 Infrastructure Audit: ${laneLabels[args.lane] || args.lane} — ${args.statusLabel} (${args.score}/100)`,
      html,
      text: textLines.join("\n"),
    });

    const telegramResult = await sendTelegramMessage(textLines.join("\n"));

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send early access signup notification to admin
 */
export const sendEarlyAccessNotification = action({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          New Early Access Signup
        </h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Signup Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${args.email}">${args.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Source:</strong></td>
              <td style="padding: 8px 0;">${args.source || "Website"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
              <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>This email was sent from the Forhemit website early access form.</p>
          <p>© ${new Date().getFullYear()} Forhemit. All rights reserved.</p>
        </div>
      </div>
    `;

    const text = `
New Early Access Signup

Signup Details:
--------------
Email: ${args.email}
Source: ${args.source || "Website"}
Date: ${new Date().toLocaleString()}

---
This email was sent from the Forhemit website early access form.
© ${new Date().getFullYear()} Forhemit. All rights reserved.
    `.trim();

    const emailResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Early Access Signup: ${args.email}`,
      html,
      text,
    });

    const telegramText = [
      "📧 New Early Access Signup",
      "",
      `Email: ${args.email}`,
      `Source: ${args.source || "Website"}`,
    ].join("\n");

    const telegramResult = await sendTelegramMessage(telegramText);

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send job application notification to admin
 */
export const sendJobApplicationNotification = action({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    position: v.string(),
    otherPosition: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const positionDisplay = args.position === "Other" && args.otherPosition 
      ? args.otherPosition 
      : args.position;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          New Job Application
        </h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Applicant Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${args.firstName} ${args.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${args.email}">${args.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;">${args.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Position:</strong></td>
              <td style="padding: 8px 0;">${positionDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
              <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>

        ${args.resumeUrl ? `
        <div style="background: #e8f5e9; border: 1px solid #4caf50; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0; color: #2e7d32;">📎 Resume Attached</h3>
          <a href="${args.resumeUrl}" style="display: inline-block; background: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
            Download Resume
          </a>
        </div>
        ` : `
        <div style="background: #fff3e0; border: 1px solid #ff9800; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #e65100;">⚠️ No Resume Attached</h3>
          <p style="margin-bottom: 0;">The applicant submitted without a resume. You may want to follow up.</p>
        </div>
        `}

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>This email was sent from the Forhemit website job application form.</p>
          <p>© ${new Date().getFullYear()} Forhemit. All rights reserved.</p>
        </div>
      </div>
    `;

    const text = `
New Job Application

Applicant Information:
---------------------
Name: ${args.firstName} ${args.lastName}
Email: ${args.email}
Phone: ${args.phone}
Position: ${positionDisplay}
Date: ${new Date().toLocaleString()}

${args.resumeUrl ? `Resume: ${args.resumeUrl}` : "No resume attached"}

---
This email was sent from the Forhemit website job application form.
© ${new Date().getFullYear()} Forhemit. All rights reserved.
    `.trim();

    const emailResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Job Application: ${positionDisplay} - ${args.firstName} ${args.lastName}`,
      html,
      text,
      replyTo: args.email,
    });

    const telegramText = [
      "📋 New Job Application",
      "",
      `Name: ${args.firstName} ${args.lastName}`,
      `Email: ${args.email}`,
      `Phone: ${args.phone}`,
      `Position: ${positionDisplay}`,
      args.resumeUrl ? `Resume: ${args.resumeUrl}` : "No resume attached",
    ].join("\n");

    const telegramResult = await sendTelegramMessage(telegramText);

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send confidential intake notification to admin (business owners intake form)
 */
export const sendConfidentialIntakeNotification = action({
  args: {
    path: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.optional(v.string()),
    bizName: v.optional(v.string()),
    state: v.optional(v.string()),
    industry: v.optional(v.string()),
    employees: v.optional(v.string()),
    years: v.optional(v.string()),
    ebitda: v.optional(v.string()),
    entity: v.optional(v.string()),
    timeline: v.optional(v.string()),
    notes: v.optional(v.string()),
    ndaSigned: v.optional(v.boolean()),
  },
  handler: async (_ctx, args) => {
    const roleLabels: Record<string, string> = {
      "owner-sole": "Sole Owner",
      "owner-partner": "Partner / Co-owner",
      "advisor": "Advisor acting on behalf of owner",
    };

    const timelineLabels: Record<string, string> = {
      asap: "As soon as possible",
      "1yr": "Within 12 months",
      "2yr": "1–3 years out",
      exploring: "Just exploring",
    };

    const isNda = args.path === "nda";
    const pathLabel = isNda ? "Confidential (NDA Signed)" : "Light Intake (No NDA)";

    const detailRows = [
      { label: "Business Name", value: args.bizName },
      { label: "State", value: args.state },
      { label: "Industry", value: args.industry },
      { label: "Employees", value: args.employees },
      { label: "Years in Operation", value: args.years },
      { label: "EBITDA Range", value: args.ebitda },
      { label: "Entity Type", value: args.entity },
      { label: "Timeline", value: args.timeline ? (timelineLabels[args.timeline] || args.timeline) : undefined },
    ].filter((r): r is { label: string; value: string } => !!r.value);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          ${isNda ? "🔒" : "📋"} New Business Owner Intake — ${pathLabel}
        </h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${args.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${args.email}">${args.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;">${args.phone}</td>
            </tr>
            ${args.role ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Role:</strong></td><td style="padding: 8px 0;">${roleLabels[args.role] || args.role}</td></tr>` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Intake Path:</strong></td>
              <td style="padding: 8px 0;">${pathLabel}</td>
            </tr>
            ${isNda ? `<tr><td style="padding: 8px 0; color: #666;"><strong>NDA Status:</strong></td><td style="padding: 8px 0; color: #2e7d32; font-weight: bold;">✅ Signed</td></tr>` : ""}
          </table>
        </div>
        ${detailRows.length > 0 ? `
        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Business Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${detailRows.map((r) => `<tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>${r.label}:</strong></td><td style="padding: 8px 0;">${r.value}</td></tr>`).join("")}
          </table>
        </div>` : ""}
        ${args.notes ? `
        <div style="background: #fffbe6; border: 1px solid #ffd700; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Additional Notes</h3>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #444; margin-bottom: 0;">${args.notes.replace(/\n/g, "<br>")}</p>
        </div>` : ""}
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>This was sent from the Forhemit Business Owners intake form.</p>
          <p>© ${new Date().getFullYear()} Forhemit. All rights reserved.</p>
        </div>
      </div>
    `;

    const textLines = [
      `${isNda ? "🔒" : "📋"} New Business Owner Intake — ${pathLabel}`,
      "",
      `Name: ${args.name}`,
      `Email: ${args.email}`,
      `Phone: ${args.phone}`,
      args.role ? `Role: ${roleLabels[args.role] || args.role}` : "",
      isNda ? "NDA: Signed" : "",
      "",
      ...detailRows.map((r) => `${r.label}: ${r.value}`),
      args.notes ? `\nNotes:\n${args.notes}` : "",
    ].filter(Boolean);

    const emailResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `${isNda ? "🔒" : "📋"} Business Owner Intake: ${args.name} — ${args.bizName || "Unknown Business"}`,
      html,
      text: textLines.join("\n"),
      replyTo: args.email,
    });

    const telegramLines = [
      `${isNda ? "🔒" : "📋"} New Business Owner Intake`,
      "",
      `Path: ${pathLabel}`,
      `Name: ${args.name}`,
      `Email: ${args.email}`,
      `Phone: ${args.phone}`,
      args.role ? `Role: ${roleLabels[args.role] || args.role}` : "",
      args.bizName ? `Business: ${args.bizName}` : "",
      args.industry ? `Industry: ${args.industry}` : "",
      args.employees ? `Employees: ${args.employees}` : "",
      args.ebitda ? `EBITDA: ${args.ebitda}` : "",
      args.timeline ? `Timeline: ${timelineLabels[args.timeline] || args.timeline}` : "",
      isNda ? "NDA: ✅ Signed" : "",
      args.notes ? `\nNotes: ${args.notes}` : "",
    ].filter(Boolean);

    const telegramResult = await sendTelegramMessage(telegramLines.join("\n"));

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
    const emailResult = await sendEmail({
      to: args.brokerEmail,
      subject: args.subject || "Forhemit — Broker Tear Sheet",
      html,
      text,
      replyTo: args.senderEmail,
      attachments,
    });

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

/**
 * Send classification intake notification to admin (home page intake flow)
 */
export const sendClassificationIntakeNotification = action({
  args: {
    role: v.string(),
    answers: v.string(),
    clientType: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const roleLabels: Record<string, string> = {
      owner: "Business Owner",
      broker: "Broker",
      advisor: "Advisor / CPA / Attorney",
      lender: "Lender",
    };

    let parsed: Record<string, unknown> = {};
    try { parsed = JSON.parse(args.answers); } catch { /* empty */ }

    const answerRows = Object.entries(parsed)
      .filter(([k]) => k !== "role")
      .map(([k, val]) => {
        const label = k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
        const display = Array.isArray(val) ? val.join(", ") : String(val);
        return { label, value: display };
      });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          🎯 New Classification Intake
        </h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Role:</strong></td>
              <td style="padding: 8px 0;">${roleLabels[args.role] || args.role}</td>
            </tr>
            ${args.clientType ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Client Type:</strong></td><td style="padding: 8px 0;">${args.clientType}</td></tr>` : ""}
            ${answerRows.map((r) => `<tr><td style="padding: 8px 0; color: #666;"><strong>${r.label}:</strong></td><td style="padding: 8px 0;">${r.value}</td></tr>`).join("")}
          </table>
        </div>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>Sent from the Forhemit classification intake flow.</p>
        </div>
      </div>
    `;

    const textLines = [
      "🎯 New Classification Intake",
      "",
      `Role: ${roleLabels[args.role] || args.role}`,
      args.clientType ? `Client Type: ${args.clientType}` : "",
      ...answerRows.map((r) => `${r.label}: ${r.value}`),
    ].filter(Boolean);

    const emailResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `🎯 Classification Intake: ${roleLabels[args.role] || args.role}${args.clientType ? ` — ${args.clientType}` : ""}`,
      html,
      text: textLines.join("\n"),
    });

    const telegramResult = await sendTelegramMessage(textLines.join("\n"));

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});
