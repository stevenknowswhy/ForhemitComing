"use client";

// ============================================
// CRM Types + Constants
// ============================================
//
// This file exists to provide a stable public contract for the CRM feature.
// The CRM UI can iterate independently, but the app must always typecheck/build.

// The CRM stage set is evolving; keep this flexible so the app can typecheck
// while stage names iterate across CRM UI + Convex schema.
export type PipelineStage = string;

export type NdaStatus = "None" | "Requested" | "Pending" | "Signed";

export type ActivityType = "note" | "call" | "email" | "meeting" | "stage_change" | "task";

export type CrmView = "table" | "kanban" | "calendar" | "analytics";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus = "Open" | "In Progress" | "Done" | "Blocked";

export type SortDirection = "asc" | "desc";

export type SortField =
  | "company"
  | "stage"
  | "lastContact"
  | "nextDate"
  | "createdAt"
  | "priorityScore";

export type SortConfig = {
  field: SortField;
  direction: SortDirection;
};

// Due filters are represented as string literals in the UI ("week", "month", etc.)
// Keep flexible to avoid typecheck churn while refining UX.
export type DueFilter = string;

export type StageStyle = {
  label: string;
  className: string;
  color?: string;
  bg?: string;
  borderColor?: string;
};

export const PIPELINE_STAGES: readonly PipelineStage[] = [
  "New",
  "Contacted",
  "Qualified",
  "In Process",
  "Underwriting",
  "LOI",
  "Closed",
  "Archived",
] as const;

export const NDA_STATUS: readonly NdaStatus[] = ["None", "Requested", "Pending", "Signed"] as const;

export const ACTIVITY_TYPES: readonly ActivityType[] = ["note", "call", "email", "meeting", "stage_change", "task"] as const;

export const CRM_VIEWS: readonly CrmView[] = ["table", "kanban", "calendar", "analytics"] as const;

export const TASK_PRIORITIES: readonly TaskPriority[] = ["low", "medium", "high", "urgent"] as const;

export const STAGE_STYLES: Record<string, StageStyle> = {
  New: { label: "New", className: "stage-new", color: "#60a5fa", bg: "rgba(96, 165, 250, 0.12)", borderColor: "rgba(96, 165, 250, 0.35)" },
  Contacted: { label: "Contacted", className: "stage-contacted", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)", borderColor: "rgba(245, 158, 11, 0.35)" },
  Qualified: { label: "Qualified", className: "stage-qualified", color: "#34d399", bg: "rgba(52, 211, 153, 0.12)", borderColor: "rgba(52, 211, 153, 0.35)" },
  "In Process": { label: "In Process", className: "stage-in-process", color: "#a78bfa", bg: "rgba(167, 139, 250, 0.12)", borderColor: "rgba(167, 139, 250, 0.35)" },
  Underwriting: { label: "Underwriting", className: "stage-underwriting", color: "#fb7185", bg: "rgba(251, 113, 133, 0.12)", borderColor: "rgba(251, 113, 133, 0.35)" },
  LOI: { label: "LOI", className: "stage-loi", color: "#22c55e", bg: "rgba(34, 197, 94, 0.12)", borderColor: "rgba(34, 197, 94, 0.35)" },
  Closed: { label: "Closed", className: "stage-closed", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)", borderColor: "rgba(16, 185, 129, 0.35)" },
  Archived: { label: "Archived", className: "stage-archived", color: "#9ca3af", bg: "rgba(156, 163, 175, 0.12)", borderColor: "rgba(156, 163, 175, 0.35)" },
};

export type Company = {
  // Some CRM code uses Convex docs (`_id`) while other UI uses a normalized `id`.
  // Keep both optional so the module typechecks during iteration.
  id?: string;
  _id?: string;
  _creationTime?: number;
  name: string;
  stage: PipelineStage;
  ndaStatus: NdaStatus;
  industry?: string;
  size?: string;
  revenue?: string;
  website?: string;
  address?: string;
  location?: string;
  owner?: string;
  advisor?: string;
  referralSource?: string;
  lastContactDate?: string;
  nextStep?: string;
  nextStepDate?: string;
  expectedCloseDate?: string;
  advisors?: string[];
  notes?: string;
  nextFollowUpAt?: number;
  createdAt?: number;
  updatedAt?: number;
  priorityScore?: number;
  [key: string]: any;
};

export type Contact = {
  id: string;
  companyId: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt?: string | number;
  updatedAt?: string | number;
};

export type Activity = {
  id: string;
  companyId: string;
  type: ActivityType;
  title?: string;
  body?: string;
  occurredAt: string | number; // ISO date string or epoch ms
  createdAt?: string | number;
};

export type Task = {
  id: string;
  companyId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt?: string | number; // ISO date string or epoch ms
  createdAt?: string | number;
  updatedAt?: string | number;
};

export type CompanyFilters = {
  // Legacy/UX-friendly filter shape used by UI components
  searchQuery?: string;
  stage?: PipelineStage | "all";
  ndaStatus?: NdaStatus | "all";
  // More structured filters used by utilities/hooks
  query?: string;
  stages?: PipelineStage[];
  ndaStatuses?: NdaStatus[];
  advisors?: string[];
  industries?: string[];
  dueFilter?: DueFilter;
  dueInDays?: number | null;
};

export type PipelineStats = {
  // StatsBar expects this shape
  total: number;
  active: number;
  overdue: number;
  thisWeek: number;
  ndaSigned: number;
  closed: number;

  // Optional extended stats for other views
  totalCompanies?: number;
  byStage?: Record<string, number>;
  ndaSignedCount?: number;
  upcomingFollowUpsCount?: number;
  stageDistribution?: Record<string, number>;
  ndaDistribution?: Record<string, number> & { Signed: number; Pending: number; None: number };

  // Allow additional derived metrics while the feature evolves
  [key: string]: any;
};

export type CompanyFormData = Omit<Company, "id" | "createdAt" | "updatedAt" | "priorityScore">;
export type ContactFormData = {
  companyId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
};
export type ActivityFormData = {
  companyId: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  performedBy: string;
};
export type TaskFormData = {
  companyId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  assignedTo?: string;
};

