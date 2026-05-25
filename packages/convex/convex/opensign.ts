import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";

// ============================================
// Create OpenSign envelope
// ============================================

export const createEnvelope = action({
  args: {
    workflowTaskId: v.id("workflowTasks"),
    documentUrl: v.string(),
    recipientEmail: v.string(),
    recipientName: v.string(),
    signerRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENSIGN_API_KEY;
    if (!apiKey) {
      throw new Error("OPENSIGN_API_KEY not configured");
    }

    // Call OpenSign API to create envelope
    const response = await fetch("https://api.opensign.com/v1/envelopes", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documents: [{ url: args.documentUrl, name: "Agreement.pdf" }],
        recipients: [{
          email: args.recipientEmail,
          name: args.recipientName,
          role: args.signerRole || "signer",
          routingOrder: 1,
        }],
        status: "sent",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenSign API error: ${error}`);
    }

    const data = await response.json();
    const envelopeId = data.envelopeId || data.id;

    // Update the workflow task with OpenSign info
    await ctx.runMutation("workflowTasks:markTaskSent" as any, {
      workflowTaskId: args.workflowTaskId,
      opensignEnvelopeId: envelopeId,
    });

    // Also update OpenSign-specific fields
    await ctx.runMutation("opensign:updateTaskOpenSign" as any, {
      workflowTaskId: args.workflowTaskId,
      opensignEnvelopeId: envelopeId,
      opensignStatus: "sent",
    });

    return { envelopeId, success: true };
  },
});

// ============================================
// Update task with OpenSign data
// ============================================

export const updateTaskOpenSign = mutation({
  args: {
    workflowTaskId: v.id("workflowTasks"),
    opensignEnvelopeId: v.string(),
    opensignStatus: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("signed"),
      v.literal("completed"),
      v.literal("voided")
    ),
    signedDocumentUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      opensignEnvelopeId: args.opensignEnvelopeId,
      opensignStatus: args.opensignStatus,
      updatedAt: Date.now(),
    };

    if (args.signedDocumentUrl) {
      updates.signedDocumentUrl = args.signedDocumentUrl;
    }

    await ctx.db.patch(args.workflowTaskId, updates);
    return { success: true };
  },
});

// ============================================
// Webhook handler — called by OpenSign on status change
// ============================================

export const handleWebhook = mutation({
  args: {
    envelopeId: v.string(),
    status: v.string(),
    signedDocumentUrl: v.optional(v.string()),
    recipientEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find the workflow task by OpenSign envelope ID
    const task = await ctx.db.query("workflowTasks")
      .withIndex("by_opensign", (q) => q.eq("opensignEnvelopeId", args.envelopeId))
      .first();

    if (!task) {
      console.warn(`No workflow task found for OpenSign envelope: ${args.envelopeId}`);
      return { success: false, error: "Task not found" };
    }

    // Map OpenSign status to our status
    const statusMap: Record<string, string> = {
      draft: "pending",
      sent: "sent",
      delivered: "delivered",
      viewed: "opened",
      signed: "received",
      completed: "received",
      declined: "skipped",
      voided: "skipped",
      expired: "overdue",
    };

    const newStatus = statusMap[args.status] || args.status;

    // Update the task
    const updates: any = {
      opensignStatus: args.status,
      status: newStatus,
      updatedAt: Date.now(),
    };

    if (args.status === "signed" || args.status === "completed") {
      updates.receivedAt = Date.now();
      if (args.signedDocumentUrl) {
        updates.signedDocumentUrl = args.signedDocumentUrl;
      }
    }

    await ctx.db.patch(task._id, updates);

    // Log activity
    await ctx.db.insert("crmActivities", {
      companyId: task.companyId,
      type: "email",
      title: `Document ${args.status}`,
      description: `OpenSign envelope ${args.envelopeId} status: ${args.status}`,
      date: new Date().toISOString().split("T")[0],
      performedBy: "system",
      createdAt: Date.now(),
    });

    return { success: true, taskId: task._id, newStatus };
  },
});

// ============================================
// Get envelope status
// ============================================

export const getEnvelopeStatus = query({
  args: { workflowTaskId: v.id("workflowTasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.workflowTaskId);
    if (!task) return null;

    return {
      opensignEnvelopeId: task.opensignEnvelopeId,
      opensignStatus: task.opensignStatus,
      signedDocumentUrl: task.signedDocumentUrl,
      status: task.status,
    };
  },
});
