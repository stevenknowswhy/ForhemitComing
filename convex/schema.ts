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
});
