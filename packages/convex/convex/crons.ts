import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// ============================================
// Recurring task creator — runs every Monday at 9am PT
// ============================================

crons.weekly(
	"createRecurringTasks",
	{ dayOfWeek: "monday", hourUTC: 16, minuteUTC: 0 }, // 9am PT = 16:00 UTC
	internal.cronJobs.createRecurringTasks,
);

// ============================================
// Time-based trigger check — runs daily at 8am UTC (midnight PT)
// ============================================

crons.cron(
	"checkTimeBasedTriggers",
	"0 8 * * *", // daily at 8am UTC (midnight PT)
	internal.cronJobs.checkTimeBasedTriggers,
);

// ============================================
// Journal digest — runs every Tuesday at 2am PT (9am UTC)
// Generates PDFs and sends weekly email digests for all active journals
// ============================================

crons.weekly(
	"journalDigest",
	{ dayOfWeek: "tuesday", hourUTC: 9, minuteUTC: 0 }, // 2am PT = 9am UTC
	internal.journalPdf.processAllJournals,
);

export default crons;

// ============================================
// The actual recurring task logic (internal mutation)
// ============================================

// Note: This is defined in a separate file to avoid circular imports
// The cron job calls internal.cronJobs.createRecurringTasks
