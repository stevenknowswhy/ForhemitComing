import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";

// Convex -> Google Sheet sync (spec: SHEETS-SYNC-SPEC-2026-11-18).
//
// A cron (crons.ts, every 15 minutes) runs `run`, which POSTs new rows from
// checkResponses, contactSubmissions, and jobApplications to the Apps
// Script webhook bound to Stefano's "Forhemit — Website Form Submissions"
// Sheet. The script appends each row's values plus its Convex _id (the
// dedupe key); delivery is therefore at-least-once and safe to retry.
//
// The watermark (syncState) advances ONLY after the webhook confirms
// success. On any failure it is left untouched and the next run retries
// the same rows.
//
// Guardrails: contactSubmissions and jobApplications hold PII — that is
// the sync's purpose (Stefano's own Sheet, his own data) — but row
// contents are NEVER logged here; counts and table names only.
// checkResponses stays PII-free: nothing in this file adds fields to it.
//
// If SHEETS_SYNC_WEBHOOK_URL (or the secret) is unset, `run` exits
// quietly, so this code can deploy before the Apps Script is set up.

const MAX_ROWS_PER_RUN = 100;
// Safety bound on the in-memory scan; these are form-submission tables
// whose volume is far below this. Oldest first (default _creationTime
// order), filtered against the watermark in memory so the (_creationTime,
// _id) tie-break is exact.
const SCAN_LIMIT = 1000;

type SyncedTable = "checkResponses" | "contactSubmissions" | "jobApplications";

const TABLES: SyncedTable[] = [
  "checkResponses",
  "contactSubmissions",
  "jobApplications",
];

// ── Watermark ─────────────────────────────────────────────────────────

export const getState = internalQuery({
  args: { table: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("syncState")
      .withIndex("by_table", (q) => q.eq("table", args.table))
      .unique();
  },
});

export const advanceState = internalMutation({
  args: {
    table: v.string(),
    lastCreationTime: v.number(),
    lastId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("syncState")
      .withIndex("by_table", (q) => q.eq("table", args.table))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        lastCreationTime: args.lastCreationTime,
        lastId: args.lastId,
      });
    } else {
      await ctx.db.insert("syncState", {
        table: args.table,
        lastCreationTime: args.lastCreationTime,
        lastId: args.lastId,
      });
    }
  },
});

// ── List-after-watermark queries (one per table, oldest first) ────────

const watermarkArgs = {
  afterCreationTime: v.number(),
  afterId: v.string(),
};

function afterWatermark<T extends { _creationTime: number; _id: string }>(
  docs: T[],
  afterCreationTime: number,
  afterId: string,
): T[] {
  return docs
    .filter(
      (d) =>
        d._creationTime > afterCreationTime ||
        (d._creationTime === afterCreationTime && d._id > afterId),
    )
    .slice(0, MAX_ROWS_PER_RUN);
}

export const listCheckResponsesAfter = internalQuery({
  args: watermarkArgs,
  handler: async (ctx, args) => {
    const docs = await ctx.db.query("checkResponses").order("asc").take(SCAN_LIMIT);
    return afterWatermark(docs, args.afterCreationTime, args.afterId);
  },
});

export const listContactSubmissionsAfter = internalQuery({
  args: watermarkArgs,
  handler: async (ctx, args) => {
    const docs = await ctx.db.query("contactSubmissions").order("asc").take(SCAN_LIMIT);
    return afterWatermark(docs, args.afterCreationTime, args.afterId);
  },
});

export const listJobApplicationsAfter = internalQuery({
  args: watermarkArgs,
  handler: async (ctx, args) => {
    const docs = await ctx.db.query("jobApplications").order("asc").take(SCAN_LIMIT);
    return afterWatermark(docs, args.afterCreationTime, args.afterId);
  },
});

// ── Row mapping (values in Sheet column order; the webhook appends the
//    Convex _id itself as the final "Convex ID" column) ────────────────

const tsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function fmtTs(ms: number): string {
  const parts: Record<string, string> = {};
  for (const p of tsFormatter.formatToParts(new Date(ms))) {
    parts[p.type] = p.value;
  }
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

const yesNo = (b: boolean) => (b ? "Yes" : "No");

const PROFESSIONAL_TYPE_LABELS: Record<string, string> = {
  broker: "Broker",
  cpa: "CPA",
  attorney: "Attorney",
  wealth_manager: "Wealth Manager",
  other: "Other",
};

const INDUSTRY_LABELS: Record<string, string> = {
  construction: "Construction & specialty trades",
  manufacturing: "Manufacturing",
  healthcare: "Healthcare",
  professional_services: "Professional services",
  retail_food_hospitality: "Retail, food & hospitality",
  technology: "Technology",
  transportation_logistics: "Transportation & logistics",
  other: "Other",
};

const CRITERIA_NAMES: Record<string, string> = {
  revenue: "Revenue",
  headcount: "Headcount",
  profitability: "Profitability",
  timeline: "Timeline",
  transition: "Transition",
};

// The query handlers above return fully-typed documents; the action maps
// them through these per-table shapes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDoc = any;

function mapCheckResponse(d: AnyDoc): string[] {
  return [
    fmtTs(d._creationTime),
    d.role === "founder" ? "Founder" : "Professional",
    d.professionalType ? (PROFESSIONAL_TYPE_LABELS[d.professionalType] ?? "") : "",
    INDUSTRY_LABELS[d.industry] ?? "",
    yesNo(d.answers.revenue),
    yesNo(d.answers.headcount),
    yesNo(d.answers.profitability),
    yesNo(d.answers.timeline),
    yesNo(d.answers.transition),
    d.result === "pass"
      ? "Pass"
      : "Needs: " +
        (d.result as string[]).map((c) => CRITERIA_NAMES[c] ?? c).join(", "),
  ];
}

function mapContactSubmission(d: AnyDoc): string[] {
  return [
    fmtTs(d.createdAt),
    d.contactType,
    d.firstName,
    d.lastName,
    d.email,
    d.phone ?? "",
    d.company ?? "",
    d.interest ?? "",
    d.message,
    d.source ?? "",
    d.status ?? "new",
  ];
}

function mapJobApplication(d: AnyDoc): string[] {
  return [
    fmtTs(d.createdAt),
    d.firstName,
    d.lastName,
    d.email,
    d.phone,
    d.position,
    d.status ?? "new",
    d.resumeUrl ?? "",
  ];
}

const LIST_QUERIES = {
  checkResponses: internal.sheetsSync.listCheckResponsesAfter,
  contactSubmissions: internal.sheetsSync.listContactSubmissionsAfter,
  jobApplications: internal.sheetsSync.listJobApplicationsAfter,
} as const;

const MAPPERS = {
  checkResponses: mapCheckResponse,
  contactSubmissions: mapContactSubmission,
  jobApplications: mapJobApplication,
} as const;

// ── The scheduled sync ────────────────────────────────────────────────

export const run = internalAction({
  args: {},
  handler: async (ctx) => {
    const url = process.env.SHEETS_SYNC_WEBHOOK_URL;
    const secret = process.env.SHEETS_SYNC_SECRET;
    if (!url || !secret) {
      // Not set up yet — exit quietly (spec guardrail).
      return;
    }

    for (const table of TABLES) {
      try {
        const state = await ctx.runQuery(internal.sheetsSync.getState, { table });
        const docs = await ctx.runQuery(LIST_QUERIES[table], {
          afterCreationTime: state?.lastCreationTime ?? 0,
          afterId: state?.lastId ?? "",
        });
        if (docs.length === 0) continue;

        const rows = docs.map((d: AnyDoc) => ({
          id: d._id as string,
          values: MAPPERS[table](d),
        }));

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret, table, rows }),
        });
        const body = (await res.json().catch(() => null)) as {
          ok?: boolean;
          appended?: number;
        } | null;

        if (!res.ok || !body?.ok) {
          console.error(
            `sheetsSync: ${table} — webhook did not confirm success (HTTP ${res.status}); watermark left untouched, will retry`,
          );
          continue;
        }

        const last = docs[docs.length - 1];
        await ctx.runMutation(internal.sheetsSync.advanceState, {
          table,
          lastCreationTime: last._creationTime,
          lastId: last._id as string,
        });
        console.log(
          `sheetsSync: ${table} — sent ${rows.length}, appended ${body.appended ?? "?"}`,
        );
      } catch (err) {
        console.error(
          `sheetsSync: ${table} — run failed (${err instanceof Error ? err.message : "unknown error"}); watermark left untouched, will retry`,
        );
      }
    }
  },
});
