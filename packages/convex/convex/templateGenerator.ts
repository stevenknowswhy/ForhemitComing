/**
 * Template Generator - Convex Action
 *
 * Orchestrates the full template pipeline:
 * 1. Load template from templates table (by title or lifecycle stage + category)
 * 2. Replace {{placeholders}} with deal data
 * 3. Handle {{#if condition}}...{{else}}...{{/if}} blocks
 * 4. Call /api/pdf-generate with mode: "full" to get PDF
 * 5. Send email via Resend with PDF attachment
 * 6. Log to emailEvents via sendAndLogEmail
 *
 * Usage:
 *   await ctx.runAction(api.templateGenerator.generateDocument, {
 *     templateTitle: "Gate 1 Passage Confirmation",
 *     recipientEmail: "seller@example.com",
 *     recipientName: "John Smith",
 *     dealData: { companyName: "Acme Corp", gateDate: "June 1, 2026", ... }
 *   });
 */

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { renderTemplate, buildTemplateData } from "./templateRenderer";
import { generatePdf } from "./pdfGenerator";
import { sendTemplateEmail, getEmailConfig, formatEmailBody } from "./templateEmailer";
import { getTemplateContent } from "./lib/templateContent";

/**
 * Generate document from template - orchestrates the full pipeline
 */
export const generateDocument = action({
  args: {
    templateTitle: v.string(),
    recipientEmail: v.string(),
    recipientName: v.string(),
    dealData: v.record(v.string(), v.string()),
    subject: v.optional(v.string()),
    fromEmail: v.optional(v.string()),
    replyTo: v.optional(v.string()),
    companyId: v.optional(v.string()),
    contactId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; emailId?: string; error?: string; templateVersion?: number; pdfSize?: number }> => {
    const {
      templateTitle,
      recipientEmail,
      recipientName,
      dealData,
      subject: overrideSubject,
      fromEmail,
      replyTo,
    } = args;

    // Build the complete data object with defaults
    const data = buildTemplateData(dealData, recipientName, recipientEmail);

    // 1. Load template from database
    const template = await ctx.runQuery(
      api.templates.getByTitle,
      { title: templateTitle }
    );

    if (!template) {
      console.error(`Template not found: ${templateTitle}`);
      return {
        success: false,
        error: `Template "${templateTitle}" not found.`,
      };
    }

    const templateContent = await getTemplateContent(ctx, template);
    if (!templateContent) {
      console.error(`Template has no content: ${templateTitle}`);
      return {
        success: false,
        error: `Template "${templateTitle}" has no content stored.`,
      };
    }

    // 2. Replace placeholders
    const renderedHtml = renderTemplate(templateContent, data);

    // 3. Generate PDF
    try {
      const pdfResult: any = await ctx.runAction(api.pdfGenerator.generatePdf, {
        // Filter undefined values to match Record<string, string> type
        formData: Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined)) as Record<string, string>,
        templateId: template._id,
        templateName: templateTitle,
        htmlContent: renderedHtml,
        mode: "full",
      });

      // 4. Get email configuration
      const emailConfig = getEmailConfig(templateTitle);
      const filledSubject = overrideSubject || emailConfig.subject;
      const filledFilename = emailConfig.filename.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
        const value = data[key];
        return value ? value : "unknown";
      });

      // 5. Format email body
      const filledBody = emailConfig.body.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
        const value = data[key];
        return value ? value : "unknown";
      });
      const formattedBody = formatEmailBody(filledBody);

      // 6. Send email
      const emailResult: any = await ctx.runAction(api.templateEmailer.sendTemplateEmail, {
        to: recipientEmail,
        subject: filledSubject,
        html: formattedBody,
        from: fromEmail || "deals@forhemit.com",
        attachments: [{
          filename: filledFilename,
          content: pdfResult.pdfBase64,
        }],
        templateId: template._id,
        templateVersion: template.version ?? 1,
      });

      if (!emailResult.success) {
        console.error("Email send failed:", emailResult.error);
        return {
          success: false,
          error: emailResult.error,
          templateVersion: template.version ?? 1,
          pdfSize: pdfResult.pdfSize,
        };
      }

      return {
        success: true,
        emailId: emailResult.emailId,
        templateVersion: template.version ?? 1,
        pdfSize: pdfResult.pdfSize,
      };
    } catch (error) {
      console.error("Document generation failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        templateVersion: template?.version,
      };
    }
  },
});

/**
 * Test template rendering without generating PDF or sending email
 */
export const testTemplateRendering = action({
  args: {
    templateTitle: v.string(),
    dealData: v.record(v.string(), v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
    const { templateTitle, dealData } = args;

    // Build test data
    const data = buildTemplateData(dealData, "Test User", "test@example.com");

    // Load template
    const template: any = await ctx.runQuery(
      api.templates.getByTitle,
      { title: templateTitle }
    );

    if (!template) {
      return {
        success: false,
        error: `Template "${templateTitle}" not found`,
      };
    }

    const templateContent = await getTemplateContent(ctx, template);
    if (!templateContent) {
      return {
        success: false,
        error: `Template "${templateTitle}" has no content`,
      };
    }

    // Render template
    const renderedHtml = renderTemplate(templateContent, data);

    return {
      success: true,
      html: renderedHtml,
      templateVersion: template.version ?? 1,
    };
  },
});

/**
 * Preview email configuration for a template
 */
export const previewEmailConfig = action({
  args: {
    templateTitle: v.string(),
    dealData: v.record(v.string(), v.string()),
  },
  handler: async (ctx, args) => {
    const { templateTitle, dealData } = args;

    const emailConfig = getEmailConfig(templateTitle);
    const data = buildTemplateData(dealData, "Test User", "test@example.com");

    const filledSubject = emailConfig.subject.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
      const value = data[key];
      return value ? value : "unknown";
    });

    const filledBody = emailConfig.body.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
      const value = data[key];
      return value ? value : "unknown";
    });

    return {
      subject: filledSubject,
      body: filledBody,
      filename: emailConfig.filename.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
        const value = data[key];
        return value ? value : "unknown";
      }),
    };
  },
});