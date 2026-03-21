import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Contact form submissions
  contactSubmissions: defineTable({
    // Contact type: who is reaching out
    contactType: v.union(
      v.literal("business-owner"),
      v.literal("partner"),
      v.literal("existing-business"),
      v.literal("website-visitor"),
      v.literal("marketing")
    ),
    // Personal information
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    // Area of interest
    interest: v.optional(v.union(
      v.literal("esop-transition"),
      v.literal("accounting"),
      v.literal("legal"),
      v.literal("lending"),
      v.literal("broker"),
      v.literal("wealth"),
      v.literal("career"),
      v.literal("general")
    )),
    // Message content
    message: v.string(),
    // Metadata
    source: v.optional(v.string()), // e.g., "homepage", "brokers-page", etc.
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("in-progress"),
      v.literal("responded"),
      v.literal("closed")
    )),
    createdAt: v.number(), // timestamp
    updatedAt: v.optional(v.number()), // timestamp when last edited
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_contactType", ["contactType"])
    .index("by_createdAt", ["createdAt"]),

  // Early access email signups
  earlyAccessSignups: defineTable({
    email: v.string(),
    source: v.optional(v.string()), // e.g., "hero-section", "footer", etc.
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_createdAt", ["createdAt"]),

  // Job applications
  jobApplications: defineTable({
    // Personal information
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    // Position applied for
    position: v.string(),
    otherPosition: v.optional(v.string()), // if position is "Other"
    // Resume
    resumeUrl: v.optional(v.string()),
    // Application status
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("reviewing"),
      v.literal("interview-scheduled"),
      v.literal("rejected"),
      v.literal("hired")
    )),
    // Metadata
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_position", ["position"])
    .index("by_createdAt", ["createdAt"]),

  // Admin tracking for form submissions (optional analytics)
  submissionStats: defineTable({
    date: v.string(), // YYYY-MM-DD format
    contactSubmissions: v.number(),
    earlyAccessSignups: v.number(),
    jobApplications: v.number(),
    lastUpdated: v.number(),
  })
    .index("by_date", ["date"]),

  // Document templates metadata
  documentTemplates: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    version: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("draft"),
      v.literal("archived")
    ),
    category: v.optional(v.string()),
    formKey: v.optional(v.string()), // <--- NEW: maps to form registry
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  // Log of all generated/downloaded/printed documents
  generatedDocuments: defineTable({
    templateId: v.id("documentTemplates"),
    templateName: v.string(),
    formData: v.string(), // JSON snapshot of form inputs at generation time
    action: v.union(
      v.literal("pdf-download"),
      v.literal("print"),
      v.literal("preview")
    ),
    generatedBy: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_template", ["templateId"])
    .index("by_createdAt", ["createdAt"]),

  // Audit log for tracking all admin changes
  auditLogs: defineTable({
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete")
    ),
    entityType: v.union(
      v.literal("contactSubmission"),
      v.literal("earlyAccessSignup"),
      v.literal("jobApplication"),
      v.literal("documentTemplate"),
      v.literal("generatedDocument")
    ),
    entityId: v.string(), // The ID of the affected entity
    changes: v.optional(v.array(v.object({
      field: v.string(),
      oldValue: v.optional(v.string()),
      newValue: v.optional(v.string()),
    }))), // Track what fields changed
    timestamp: v.number(),
    performedBy: v.optional(v.string()), // Could be extended with admin user info
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_action", ["action"]),
});
