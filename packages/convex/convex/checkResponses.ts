import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Anonymous metadata from the homepage 2-Minute Check (spec 2026-11-18).
//
// HARD RULE: this table never holds personally identifiable information —
// no name, email, phone, company name, IP-derived identity, or free-text
// fields. Free text is excluded deliberately: it is the usual route by
// which "anonymous" data becomes identifiable.
export const record = mutation({
  args: {
    role: v.union(v.literal("founder"), v.literal("professional")),
    professionalType: v.optional(
      v.union(
        v.literal("broker"),
        v.literal("cpa"),
        v.literal("attorney"),
        v.literal("wealth_manager"),
        v.literal("other"),
      ),
    ),
    industry: v.union(
      v.literal("construction"),
      v.literal("manufacturing"),
      v.literal("healthcare"),
      v.literal("professional_services"),
      v.literal("retail_food_hospitality"),
      v.literal("technology"),
      v.literal("transportation_logistics"),
      v.literal("other"),
    ),
    answers: v.object({
      revenue: v.boolean(),
      headcount: v.boolean(),
      profitability: v.boolean(),
      timeline: v.boolean(),
      transition: v.boolean(),
    }),
    result: v.union(
      v.literal("pass"),
      v.array(
        v.union(
          v.literal("revenue"),
          v.literal("headcount"),
          v.literal("profitability"),
          v.literal("timeline"),
          v.literal("transition"),
        ),
      ),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("checkResponses", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
