/**
 * Business Log — Constants & Event Definitions
 *
 * SUMMARY STYLE GUIDE
 * ─────────────────────────────────────────────────────────────────
 * INTERNAL summaries (summary field):
 * - Max 120 characters, past tense
 * - Include entity names, emails, dollar amounts, old→new states
 * - Internal jargon OK: "Gate 2 (Lender) cleared at D60"
 *
 * CLIENT summaries (clientSummary field):
 * - Max 120 characters, plain language
 * - No internal IDs, no jargon, no individual names
 * - Required whenever clientVisible === true (enforced by TypeScript + runtime)
 *
 * CLIENT actor labels (clientActorLabel field):
 * - Always "Forhemit Team" unless explicitly approved
 * - Individual names NEVER shown to clients
 *
 * SECURITY (enforced in toClientProjection):
 * - No internal notes, internal emails, internal IDs
 * - No cost data, AI prompts, AI outputs marked internal
 * - No audit log field-level diffs
 * ─────────────────────────────────────────────────────────────────
 */

export const LOG_ACTIONS = {
	// Auth
	AUTH_LOGIN: "auth.login",
	AUTH_LOGOUT: "auth.logout",
	AUTH_USER_CREATED: "auth.user_created",
	AUTH_ROLE_CHANGED: "auth.role_changed",

	// Deal
	DEAL_CREATED: "deal.created",
	DEAL_STAGE_CHANGED: "deal.stage_changed",
	DEAL_NDA_CHANGED: "deal.nda_status_changed",
	DEAL_GATE_CLEARED: "deal.gate_cleared",
	DEAL_GATE_BLOCKED: "deal.gate_blocked",
	DEAL_FEE_INVOICED: "deal.fee_invoiced",
	DEAL_FEE_PAID: "deal.fee_paid",
	DEAL_CLOSED: "deal.closed",
	DEAL_KILLED: "deal.killed",
	DEAL_ON_HOLD: "deal.on_hold",
	DEAL_CONTACT_ADDED: "deal.contact_added",
	DEAL_BOX_LINKED: "deal.box_folder_linked",
	DEAL_BOX_SIGN: "deal.box_sign_status",

	// Task
	TASK_CREATED: "task.created",
	TASK_ASSIGNED: "task.assigned",
	TASK_SENT: "task.sent",
	TASK_OPENED: "task.opened",
	TASK_COMPLETED: "task.completed",
	TASK_OVERDUE: "task.overdue",
	TASK_CANCELLED: "task.cancelled",
	TASK_SKIPPED: "task.skipped",

	// Document
	DOC_GENERATED: "document.generated",
	DOC_UPLOADED: "document.uploaded",
	DOC_SHARED: "document.shared",
	DOC_SIGNED: "document.signed",
	DOC_DECLINED: "document.declined",
	DOC_VIEWED: "document.viewed",
	DOC_DOWNLOADED: "document.downloaded",
	DOC_EMAILED: "document.emailed",

	// Email
	EMAIL_SENT: "email.sent",
	EMAIL_DELIVERED: "email.delivered",
	EMAIL_OPENED: "email.opened",
	EMAIL_BOUNCED: "email.bounced",
	EMAIL_FAILED: "email.failed",

	// Agent
	AGENT_OUTPUT: "agent.output_generated",
	AGENT_JOB_QUEUED: "agent.job_queued",
	AGENT_JOB_COMPLETED: "agent.job_completed",
	AGENT_JOB_FAILED: "agent.job_failed",
	AGENT_APPROVED: "agent.output_approved",
	AGENT_REJECTED: "agent.output_rejected",

	// Journal
	JOURNAL_ENTRY: "journal.entry_created",
	JOURNAL_NARRATIVE: "journal.narrative_sent",
	JOURNAL_DIGEST: "journal.digest_delivered",
	JOURNAL_OPENED: "journal.client_opened",
	JOURNAL_VIEWED: "journal.client_viewed",

	// Tracker
	TRACKER_SUBTASK: "tracker.subtask_toggled",
	TRACKER_GATE: "tracker.gate_cleared",
	TRACKER_BLOCKED: "tracker.gate_blocked",
	TRACKER_STARTED: "tracker.engagement_started",
	TRACKER_PHASE: "tracker.phase_entered",

	// Box
	BOX_FOLDER_PROVISIONED: "box.folder_provisioned",
	BOX_LINK_GENERATED: "box.link_generated",
	BOX_SESSION_STARTED: "box.session_started",
	BOX_SESSION_REVOKED: "box.session_revoked",

	// Client interactions (v1: read + ack + open links)
	CLIENT_FEED_OPENED: "client.feed_opened",
	CLIENT_EVENT_ACKED: "client.event_acknowledged",
	CLIENT_LINK_OPENED: "client.box_link_opened",

	// System
	SYSTEM_SETTINGS: "system.settings_changed",
	SYSTEM_EXPORT: "system.export_generated",
	SYSTEM_BULK: "system.bulk_operation",
	SYSTEM_PUBLISHED: "system.content_published",
	SYSTEM_UPDATED: "system.content_updated",
} as const;

/**
 * Retention class per action.
 * - "activity": purgeable after 3-year TTL
 * - "compliance": kept forever
 *
 * Dev guard in logEvent throws if an eventType is not listed here.
 */
export const LOG_RETENTION: Record<string, "activity" | "compliance"> = {
	// Compliance — keep forever
	"deal.nda_status_changed": "compliance",
	"deal.gate_cleared": "compliance",
	"deal.fee_invoiced": "compliance",
	"deal.fee_paid": "compliance",
	"deal.closed": "compliance",
	"deal.killed": "compliance",
	"deal.box_sign_status": "compliance",
	"document.signed": "compliance",
	"document.declined": "compliance",
	"auth.role_changed": "compliance",

	// Activity — purgeable after 3-year TTL
	"deal.created": "activity",
	"deal.stage_changed": "activity",
	"deal.on_hold": "activity",
	"deal.contact_added": "activity",
	"deal.box_folder_linked": "activity",
	"deal.gate_blocked": "activity",
	"task.created": "activity",
	"task.assigned": "activity",
	"task.sent": "activity",
	"task.opened": "activity",
	"task.completed": "activity",
	"task.overdue": "activity",
	"task.cancelled": "activity",
	"task.skipped": "activity",
	"document.generated": "activity",
	"document.uploaded": "activity",
	"document.shared": "activity",
	"document.viewed": "activity",
	"document.downloaded": "activity",
	"document.emailed": "activity",
	"email.sent": "activity",
	"email.delivered": "activity",
	"email.opened": "activity",
	"email.bounced": "activity",
	"email.failed": "activity",
	"agent.output_generated": "activity",
	"agent.job_queued": "activity",
	"agent.job_completed": "activity",
	"agent.job_failed": "activity",
	"agent.output_approved": "activity",
	"agent.output_rejected": "activity",
	"journal.entry_created": "activity",
	"journal.narrative_sent": "activity",
	"journal.digest_delivered": "activity",
	"journal.client_opened": "activity",
	"journal.client_viewed": "activity",
	"tracker.subtask_toggled": "activity",
	"tracker.gate_cleared": "activity",
	"tracker.gate_blocked": "activity",
	"tracker.engagement_started": "activity",
	"tracker.phase_entered": "activity",
	"box.folder_provisioned": "activity",
	"box.link_generated": "activity",
	"box.session_started": "activity",
	"box.session_revoked": "activity",
	"client.feed_opened": "activity",
	"client.event_acknowledged": "activity",
	"client.box_link_opened": "activity",
	"auth.login": "activity",
	"auth.logout": "activity",
	"auth.user_created": "activity",
	"system.settings_changed": "activity",
	"system.export_generated": "activity",
	"system.bulk_operation": "activity",
	"system.content_published": "activity",
	"system.content_updated": "activity",
} as const;

/** Visibility levels that are client-visible */
export const CLIENT_VISIBLE_LEVELS = new Set(["external", "client"]);

/** Role filter options for Employee tab */
export const ROLE_FILTERS = [
	"Forhemit",
	"Owner/Seller",
	"CPA",
	"Legal",
	"Lender",
	"Broker",
	"Trustee",
] as const;

/** Category filter options */
export const CATEGORY_FILTERS = [
	"deal",
	"task",
	"document",
	"email",
	"agent",
	"auth",
	"system",
	"journal",
	"tracker",
	"box",
	"client",
] as const;

/** Category → icon mapping for UI */
export const CATEGORY_ICONS: Record<string, string> = {
	deal: "🤝",
	task: "📋",
	document: "📄",
	email: "📧",
	agent: "🤖",
	auth: "🔐",
	system: "⚙️",
	journal: "📔",
	tracker: "🗓️",
	box: "📦",
	client: "👤",
};
