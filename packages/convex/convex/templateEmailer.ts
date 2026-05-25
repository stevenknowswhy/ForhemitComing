/**
 * Template Emailer - Email Dispatch Utilities
 *
 * Handles email formatting and sending for template documents.
 * Extracted from templateGenerator.ts for better separation of concerns.
 */

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { escapeHtml } from "./templateRenderer";

// Default email configuration
export const DEFAULT_EMAIL_CONFIG = {
  subject: "Document — {{companyName}} — {{ref}}",
  body: `Please find the attached document for {{companyName}} (ref: {{ref}}).

Best regards,
Forhemit Transition Stewardship`,
  filename: "{{companyName}}-Document-{{ref}}.pdf",
};

/**
 * Email configuration mapping for different template types
 */
export const EMAIL_CONFIGS: Record<string, {
  subject: string;
  body: string;
  filename: string;
}> = {
  // ---- 02-qualification ----
  "Deal screener email (broker → Forhemit)": {
    subject: "Deal Screener Response — {{companyName}} — {{ref}}",
    body: `Dear {{recipientName}},

Thank you for submitting the listing for {{companyName}}. We have completed our initial qualification assessment.

Please find attached our formal response outlining whether this opportunity meets our criteria and next steps.

If you have any questions, please don't hesitate to reach out.

Best regards,
Forhemit Transition Stewardship
deals@forhemit.com | forhemit.com`,
    filename: "Forhemit-Deal-Screener-{{ref}}.pdf",
  },
  "Pre-flight checklist cover letter (to seller)": {
    subject: "Pre-Flight Checklist — {{companyName}} — {{ref}}",
    body: `Dear {{recipientName}},

Thank you for your interest in exploring an employee ownership transition for {{companyName}}.

Please find attached the Pre-Flight Checklist — a comprehensive assessment tool designed to evaluate readiness, identify requirements, establish timeline, and clarify commitments.

Please complete the checklist within 5 business days and return it to deals@forhemit.com.

Best regards,
Forhemit Transition Stewardship
deals@forhemit.com | forhemit.com`,
    filename: "Forhemit-PreFlight-Checklist-{{ref}}.pdf",
  },
  // Add more email configs as needed...
};

/**
 * Send template email with PDF attachment
 */
export const sendTemplateEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    from: v.string(),
    attachments: v.array(v.object({
      filename: v.string(),
      content: v.string(),
    })),
    templateId: v.id("templates"),
    templateVersion: v.number(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; emailId?: string; error?: string }> => {
    const { to, subject, html, from, attachments, templateId, templateVersion } = args;

    try {
      const emailResult = await ctx.runAction(
        api.emails.sendTemplateEmailAction,
        {
          to,
          subject,
          html,
          from,
          attachments,
          templateId,
          templateVersion,
        }
      );

      if (!emailResult.success) {
        console.error("Email send failed:", emailResult.error);
        return { success: false, error: emailResult.error };
      }

      return { success: true, emailId: emailResult.id };
    } catch (error) {
      console.error("Email send error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  },
});

/**
 * Format email body for sending
 */
export function formatEmailBody(body: string): string {
  const emailHtml = body
    .split("\n\n")
    .map((p) => `<p style="font-size: 15px; line-height: 1.6; color: #333; margin: 0 0 16px 0;">${escapeHtml(p)}</p>`)
    .join("");

  return `
    <div style="font-family: Jost, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      ${emailHtml}
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0;">
          Best regards,<br><br>
          <strong>Forhemit Transition Stewardship</strong><br>
          deals@forhemit.com<br>
          forhemit.com
        </p>
      </div>
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center;">
        <p>Forhemit Stewardship Management Co. · California Public Benefit Corporation</p>
        <p>548 Market St, Suite 36451, San Francisco, CA 94104</p>
      </div>
    </div>
  `;
}

/**
 * Get email configuration for a template
 */
export function getEmailConfig(templateTitle: string) {
  return EMAIL_CONFIGS[templateTitle] || DEFAULT_EMAIL_CONFIG;
}