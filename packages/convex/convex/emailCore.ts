// ============================================
// Email Core — shared helpers, no Convex exports
// ============================================

import type { Id } from "./_generated/dataModel";

// Email configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "contact@forhemit.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "stefano.stokes@forhemit.com";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export { ADMIN_EMAIL, FROM_EMAIL };

export interface EmailPayload {
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
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string; id?: string }> {
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

export async function sendTelegramMessage(text: string): Promise<{ success: boolean; error?: string; id?: string }> {
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

// ============================================
// Send + Log Wrapper
// ============================================

/**
 * Send email and log to emailEvents table.
 * Call this from Convex actions instead of sendEmail() directly.
 */
export async function sendAndLogEmail(
  ctx: { runMutation: (fn: any, args: any) => Promise<any> },
  payload: EmailPayload,
  opts?: { templateId?: string; templateVersion?: number; relatedCompanyId?: Id<"crmCompanies">; relatedContactId?: Id<"crmContacts"> }
): Promise<{ success: boolean; error?: string; id?: string }> {
  const result = await sendEmail(payload);

  if (result.success) {
    try {
      await ctx.runMutation(
        (await import("./emailEvents")).logOutbound,
        {
          from: payload.from || FROM_EMAIL,
          to: Array.isArray(payload.to) ? payload.to.join(", ") : payload.to,
          subject: payload.subject,
          templateId: opts?.templateId,
          resendId: result.id,
          relatedCompanyId: opts?.relatedCompanyId,
          relatedContactId: opts?.relatedContactId,
          metadata: opts?.templateVersion ? { templateVersion: opts.templateVersion } : undefined,
        }
      );
    } catch (logError) {
      console.error("Failed to log outbound email:", logError);
    }
  }

  return result;
}

// ============================================
// Shared Email Layout Helper
// ============================================

// Brand colors — aligned with logo system v2
export const BRAND = {
  brass: "#B8965A",       // Primary accent (buttons, links, decorative)
  ink: "#1A1714",         // Dark background, headings
  parchment: "#F7F4EE",   // Light backgrounds
  stone: "#8A7E6E",       // Muted/secondary text
  white: "#ffffff",
  lightGray: "#f5f3ee",   // Page background (warm gray)
  borderGray: "#e0dbd2",  // Borders
  textGray: "#6b6560",    // Secondary text
  textDark: "#1A1714",    // Primary text
  textBody: "#3d3832",    // Body text
};

export function emailLayout(opts: {
  title: string;
  preheader?: string;
  content: string;
  footer?: string;
  /** Set to true for transactional/auth emails that don't need unsubscribe */
  transactional?: boolean;
}): string {
  const currentYear = new Date().getFullYear();
  const footerHtml = opts.footer || `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 11px; color: ${BRAND.stone}; line-height: 1.6;">
      <tr>
        <td style="text-align: center; padding-bottom: 2px;">
          Forhemit Transition Stewardship &middot; California Public Benefit Corporation
          &nbsp;&middot;&nbsp;
          <a href="https://forhemit.com" style="color: ${BRAND.brass}; text-decoration: none; font-weight: 500;">forhemit.com</a>
        </td>
      </tr>
      <tr>
        <td style="text-align: center; padding-bottom: 2px;">
          548 Market St, Suite 36451, San Francisco, CA 94104
        </td>
      </tr>
      <tr>
        <td style="text-align: center; font-size: 10px; color: #b0a99a;">
          &copy; ${currentYear} Forhemit Transition Stewardship. All rights reserved.
          &nbsp;&middot;&nbsp;
          <a href="https://forhemit.com/privacy" style="color: ${BRAND.stone}; text-decoration: underline;">Privacy</a>
          &nbsp;&middot;&nbsp;
          <a href="https://forhemit.com/terms" style="color: ${BRAND.stone}; text-decoration: underline;">Terms</a>
          ${opts.transactional ? "" : `&nbsp;&middot;&nbsp;<a href="{{unsubscribe_url}}" style="color: ${BRAND.stone}; text-decoration: underline;">Unsubscribe</a>`}
        </td>
      </tr>
    </table>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${opts.preheader ? `<meta name="description" content="${opts.preheader}">` : ""}
    </head>
    <body style="margin: 0; padding: 0; background-color: ${BRAND.lightGray};">
      <div style="font-family: 'Jost', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${BRAND.white}; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header: Icon mark + Wordmark -->
          <div style="background: ${BRAND.ink}; padding: 20px 30px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <!-- Icon mark: circle with "F" -->
                <td style="width: 44px; vertical-align: middle;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid ${BRAND.brass}; position: relative; text-align: center; line-height: 40px;">
                    <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 300; color: ${BRAND.parchment};">F</span>
                    <div style="width: 4px; height: 4px; border-radius: 50%; background: ${BRAND.brass}; margin: 0 auto; position: relative; top: -2px;"></div>
                  </div>
                </td>
                <!-- Separator -->
                <td style="width: 1px; padding: 0 16px;">
                  <div style="width: 1px; height: 32px; background: #3a342a;"></div>
                </td>
                <!-- Wordmark -->
                <td style="vertical-align: middle;">
                  <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 300; letter-spacing: 4px; color: ${BRAND.parchment};">FORHEMIT</div>
                  <div style="font-family: 'Jost', Arial, sans-serif; font-size: 6px; font-weight: 400; letter-spacing: 3px; color: ${BRAND.brass}; margin-top: 2px;">TRANSITION STEWARDSHIP</div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Title bar -->
          <div style="background: ${BRAND.parchment}; padding: 16px 30px; border-bottom: 1px solid ${BRAND.borderGray};">
            <h1 style="color: ${BRAND.ink}; margin: 0; font-size: 18px; font-weight: 500; font-family: 'Jost', Arial, sans-serif; letter-spacing: 0.5px;">
              ${opts.title}
            </h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px;">
            ${opts.content}
          </div>

          <!-- Footer -->
          <div style="background: ${BRAND.parchment}; padding: 20px 30px; border-top: 1px solid ${BRAND.borderGray};">
            ${footerHtml}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function ctaButton(text: string, url: string): string {
  return `
    <a href="${url}" style="display: inline-block; background: ${BRAND.brass}; color: ${BRAND.white}; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; margin: 20px 0; font-family: 'Jost', Arial, sans-serif; letter-spacing: 0.5px;">
      ${text}
    </a>
  `;
}

export function infoRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 6px 0; color: ${BRAND.textGray}; width: 120px; font-size: 13px;"><strong>${label}:</strong></td>
      <td style="padding: 6px 0; color: ${BRAND.textDark}; font-size: 13px;">${value}</td>
    </tr>
  `;
}

export function codeBlock(code: string): string {
  return `
    <div style="background: ${BRAND.ink}; color: ${BRAND.parchment}; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; letter-spacing: 8px; font-size: 32px; font-weight: bold; font-family: 'DM Mono', 'Courier New', monospace;">
      ${code}
    </div>
  `;
}

// ============================================
// Telegram Labels
// ============================================

export const CONTACT_TELEGRAM_TYPE_LABELS: Record<string, string> = {
  "business-owner": "Business Owner (ESOP Transition)",
  partner: "Partner (Accounting, Legal, Lending, etc.)",
  "existing-business": "Existing Portfolio Business",
  "website-visitor": "General Inquiry",
  marketing: "Marketing / Vendor Services",
};

export const CONTACT_TELEGRAM_INTEREST_LABELS: Record<string, string> = {
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

export function buildContactSubmissionTelegramText(args: {
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
