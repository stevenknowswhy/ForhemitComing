import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// CRM Pipeline Stages
export const PIPELINE_STAGES = [
  "First contact",
  "Intro call",
  "NDA sent",
  "Feasibility",
  "Term sheet",
  "LOI signed",
  "Closed",
  "On hold",
  "Dead",
] as const;

// NDA Status values
export const NDA_STATUS = ["None", "Pending", "Signed"] as const;

// Activity types for CRM
export const ACTIVITY_TYPES = ["note", "call", "email", "meeting", "stage_change", "task"] as const;

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
      v.literal("appraisal"),
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
    /** Internal admin-only notes (not shown to submitter) */
    adminNotes: v.optional(
      v.array(
        v.object({
          id: v.string(),
          text: v.string(),
          createdAt: v.number(),
        })
      )
    ),
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
      v.literal("pdf-download-server"),
      v.literal("pdf-download-client"),
      v.literal("print"),
      v.literal("preview"),
      v.literal("export-csv"),
      v.literal("export-json")
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

  // ============================================
  // CRM - Engagement Tracker Tables
  // ============================================

  // Companies/Deals in the pipeline
  crmCompanies: defineTable({
    // Company Information
    name: v.string(),
    industry: v.optional(v.string()),
    size: v.optional(v.string()), // e.g., "150 employees"
    revenue: v.optional(v.string()), // e.g., "$22M"
    website: v.optional(v.string()),
    address: v.optional(v.string()),

    // Pipeline Status
    stage: v.union(
      v.literal("First contact"),
      v.literal("Intro call"),
      v.literal("NDA sent"),
      v.literal("Feasibility"),
      v.literal("Term sheet"),
      v.literal("LOI signed"),
      v.literal("Closed"),
      v.literal("On hold"),
      v.literal("Dead")
    ),
    ndaStatus: v.union(v.literal("None"), v.literal("Pending"), v.literal("Signed")),

    // Source/Advisor
    advisor: v.optional(v.string()), // e.g., "Morgan Stanley", "Self-sourced"
    referralSource: v.optional(v.string()),

    // Important Dates
    lastContactDate: v.optional(v.string()), // ISO date string YYYY-MM-DD
    nextStep: v.optional(v.string()),
    nextStepDate: v.optional(v.string()), // ISO date string YYYY-MM-DD
    expectedCloseDate: v.optional(v.string()),

    // Notes
    notes: v.optional(v.string()),

    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.optional(v.string()),
  })
    .index("by_stage", ["stage"])
    .index("by_ndaStatus", ["ndaStatus"])
    .index("by_advisor", ["advisor"])
    .index("by_createdAt", ["createdAt"])
    .index("by_nextStepDate", ["nextStepDate"])
    .index("by_name", ["name"]),

  // Contacts associated with companies
  crmContacts: defineTable({
    companyId: v.id("crmCompanies"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.optional(v.string()), // e.g., "Owner", "CEO"
    isPrimary: v.optional(v.boolean()), // Primary contact flag
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_email", ["email"]),

  // Activity log for companies (calls, meetings, notes, stage changes)
  crmActivities: defineTable({
    companyId: v.id("crmCompanies"),
    type: v.union(
      v.literal("note"),
      v.literal("call"),
      v.literal("email"),
      v.literal("meeting"),
      v.literal("stage_change"),
      v.literal("task")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(), // ISO date string YYYY-MM-DD
    performedBy: v.optional(v.string()),
    metadata: v.optional(v.object({
      oldStage: v.optional(v.string()),
      newStage: v.optional(v.string()),
      duration: v.optional(v.number()), // for calls/meetings
    })),
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_date", ["date"])
    .index("by_type", ["type"])
    .index("by_company_date", ["companyId", "date"]),

  // Tasks/Reminders for follow-ups
  crmTasks: defineTable({
    companyId: v.id("crmCompanies"),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("overdue")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    assignedTo: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_status", ["status"])
    .index("by_dueDate", ["dueDate"])
    .index("by_assignedTo", ["assignedTo"]),

  // Phone messages from Retell AI webhook
  phoneMessages: defineTable({
    callId: v.string(), // Unique call identifier from Retell
    agentId: v.optional(v.string()), // The agent that handled the call
    callerNumber: v.optional(v.string()),
    transcript: v.optional(v.string()), // Full call transcript
    recordingUrl: v.optional(v.string()), // URL to the call audio
    status: v.optional(v.union(
      v.literal("completed"),
      v.literal("failed"),
      v.literal("in-progress"),
      v.literal("missed")
    )),
    duration: v.optional(v.number()), // Duration in seconds
    summary: v.optional(v.string()), // AI generated summary
    metadata: v.optional(v.any()), // Store full webhook payload here
    createdAt: v.number(),
    read: v.optional(v.boolean()), // Whether the admin has reviewed this message
  })
    .index("by_callId", ["callId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_status", ["status"])
    .index("by_read", ["read"]),
});
