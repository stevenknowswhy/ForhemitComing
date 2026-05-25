import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Deal Queue Task Generator — Action for processing individual workflow tasks.
 *
 * Handles document generation from deal queue, including PDF generation and
 * sender notifications. Extracted from dealEngine.ts for better separation of concerns.
 */

export const generateQueueTask = action({
  args: {
    taskId: v.id("workflowTasks"),
    recipientEmail: v.string(),
    recipientName: v.string(),
    senderEmail: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string; emailId?: string }> => {
    const now = Date.now();

    // 1. Load the workflow task
    const task: any = await ctx.runQuery(
      api.workflowTasks.get,
      { id: args.taskId }
    );
    if (!task) return { success: false, error: "Task not found" };

    // 2. Load the company
    const company: any = await ctx.runQuery(
      api.crmCompanies.get,
      { id: task.companyId }
    );
    if (!company?.company) return { success: false, error: "Company not found" };

    // 3. Load the template by ID
    const template: any = await ctx.runQuery(
      api.templates.get,
      { id: task.templateId as any }
    );
    if (!template) return { success: false, error: "Template not found" };

    // 4. Build deal data for placeholder replacement
    const dealData: Record<string, string> = {
      companyName: company.company.name,
      ref: company.company.ref || "",
      ebitda: company.company.fees?.ebitda?.toLocaleString() || "",
      recipientName: args.recipientName,
      recipientEmail: args.recipientEmail,
      generatedDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      expectedCloseDate: company.company.expectedCloseDate || "",
      stage: company.company.stage,
    };

    // 5. Generate document via templateGenerator
    const result: any = await ctx.runAction(
      api.templateGenerator.generateDocument,
      {
        templateTitle: template.title,
        recipientEmail: args.recipientEmail,
        recipientName: args.recipientName,
        dealData,
        companyId: company.company._id,
      }
    );

    // 6. Update the task status if successful
    if (result.success) {
      await ctx.runMutation(
        api.workflowTasks.markTaskSent,
        {
          workflowTaskId: args.taskId,
          resendId: result.emailId,
        }
      );

      // Send notification to sender that they should review and send
      if (args.senderEmail) {
        const senderNotification = `
          <div style="font-family: Jost, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1A1714; border-bottom: 2px solid #B8965A; padding-bottom: 10px; font-size: 18px;">
              Document Ready for Review
            </h2>
            <p style="font-size: 15px; line-height: 1.6; color: #3d3832;">
              A document has been generated and is ready for you to review and send:
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px 0; color: #8A7E6E; width: 120px;"><strong>Template:</strong></td><td style="padding: 8px 0;">${template.title}</td></tr>
              <tr><td style="padding: 8px 0; color: #8A7E6E;"><strong>Company:</strong></td><td style="padding: 8px 0;">${company.company.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #8A7E6E;"><strong>Recipient:</strong></td><td style="padding: 8px 0;">${args.recipientName} (${args.recipientEmail})</td></tr>
              <tr><td style="padding: 8px 0; color: #8A7E6E;"><strong>Status:</strong></td><td style="padding: 8px 0; color: #B8965A; font-weight: bold;">PDF attached, ready to send</td></tr>
            </table>
            <p style="font-size: 14px; line-height: 1.6; color: #8A7E6E;">
              The PDF has been sent to your email. Please review it and forward to the recipient when ready.
            </p>
          </div>
        `;

        await ctx.runAction(
          api.emails.sendTemplateEmailAction,
          {
            to: args.senderEmail,
            subject: `Action Required: Review & Send — ${template.title} — ${company.company.name}`,
            html: senderNotification,
            templateId: "sender-notification",
          }
        );
      }
    }

    return {
      success: result.success,
      emailId: result.emailId,
      error: result.error,
    };
  },
});