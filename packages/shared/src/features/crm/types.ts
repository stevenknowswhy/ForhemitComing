// ── CRM Canonical Types ──────────────────────────────────────────────────────
//
// Unified types for the CRM feature. Both admin and marketing import from here.
// Convex-specific hooks stay in apps; these types are the shared data contract.
//
// ──────────────────────────────────────────────────────────────────────────────

// Pipeline stages (admin's sales-process stages — reflects actual business flow)
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

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

// NDA status values (matches Convex schema)
export const NDA_STATUS = ["None", "Pending", "Signed"] as const;
export type NdaStatus = (typeof NDA_STATUS)[number];

// Activity types
export const ACTIVITY_TYPES = ["note", "call", "email", "meeting", "stage_change", "task"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

// CRM Views
export const CRM_VIEWS = ["table", "kanban", "calendar", "analytics", "queue"] as const;
export type CrmView = (typeof CRM_VIEWS)[number];

// Task priorities (marketing's superset — adds "urgent")
export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

// Task statuses (marketing's richer workflow)
export const TASK_STATUSES = ["Open", "In Progress", "Done", "Blocked"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

// Sort types
export type SortDirection = "asc" | "desc";

export type SortField =
  | "company"
  | "stage"
  | "lastContact"
  | "nextDate"
  | "createdAt"
  | "priorityScore";

export type SortConfig = {
  field: SortField | string; // string for backwards compat with admin
  direction: SortDirection;
};

export type DueFilter = string;

// ── Stage Style ──────────────────────────────────────────────────────────────

export interface StageStyle {
  name: string;       // admin convention
  label: string;      // marketing convention
  className: string;  // marketing convention (CSS class)
  color: string;
  bg: string;
  borderColor: string;
}

export const STAGE_STYLES: Record<string, StageStyle> = {
  "First contact": {
    name: "First contact",
    label: "First contact",
    className: "stage-first-contact",
    color: "#4d9eff",
    bg: "#1a3a6a",
    borderColor: "#4d9eff40",
  },
  "Intro call": {
    name: "Intro call",
    label: "Intro call",
    className: "stage-intro-call",
    color: "#a78bfa",
    bg: "#2d1f5e",
    borderColor: "#a78bfa40",
  },
  "NDA sent": {
    name: "NDA sent",
    label: "NDA sent",
    className: "stage-nda-sent",
    color: "#f5a623",
    bg: "#4a2e0a",
    borderColor: "#f5a62340",
  },
  Feasibility: {
    name: "Feasibility",
    label: "Feasibility",
    className: "stage-feasibility",
    color: "#2dd882",
    bg: "#0d3a22",
    borderColor: "#2dd88240",
  },
  "Term sheet": {
    name: "Term sheet",
    label: "Term sheet",
    className: "stage-term-sheet",
    color: "#00d4aa",
    bg: "#003d30",
    borderColor: "#00d4aa40",
  },
  "LOI signed": {
    name: "LOI signed",
    label: "LOI signed",
    className: "stage-loi-signed",
    color: "#a3e635",
    bg: "#2a3a00",
    borderColor: "#a3e63540",
  },
  Closed: {
    name: "Closed",
    label: "Closed",
    className: "stage-closed",
    color: "#e2e8f0",
    bg: "#2d3748",
    borderColor: "#e2e8f040",
  },
  "On hold": {
    name: "On hold",
    label: "On hold",
    className: "stage-on-hold",
    color: "#94a3b8",
    bg: "#1e293b",
    borderColor: "#94a3b840",
  },
  Dead: {
    name: "Dead",
    label: "Dead",
    className: "stage-dead",
    color: "#ff5f5f",
    bg: "#3a1010",
    borderColor: "#ff5f5f40",
  },
};

// ── Entity Types ─────────────────────────────────────────────────────────────
// Hand-rolled types (no Convex dependency). Apps that use Convex can cast
// Doc<"crmCompanies"> to Company or use the canonical types directly.

export interface Company {
  id?: string;
  _id: string;
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
  advisors?: string[];
  referralSource?: string;
  lastContactDate?: string;
  nextStep?: string;
  nextStepDate?: string;
  expectedCloseDate?: string;
  notes?: string;
  nextFollowUpAt?: number;
  createdAt?: number;
  updatedAt?: number;
  priorityScore?: number;
  [key: string]: any; // Convex docs may have additional fields
}

export interface Contact {
  id: string;
  _id?: string;
  companyId: string;
  name: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
  notes?: string;
  createdAt?: string | number;
  updatedAt?: string | number;
}

export interface Activity {
  id: string;
  _id?: string;
  companyId: string;
  type: ActivityType;
  title?: string;
  body?: string;
  description?: string;
  occurredAt: string | number;
  date?: string;
  performedBy?: string;
  createdAt?: string | number;
}

export interface Task {
  id: string;
  _id?: string;
  companyId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  description?: string;
  dueAt?: string | number;
  dueDate?: string;
  assignedTo?: string;
  createdAt?: string | number;
  updatedAt?: string | number;
}

// ── Filter & Stats ───────────────────────────────────────────────────────────

export interface CompanyFilters {
  // UI-friendly fields
  searchQuery?: string;
  stage?: PipelineStage | "all";
  ndaStatus?: NdaStatus | "all";
  // Structured filter fields
  query?: string;
  stages?: PipelineStage[];
  ndaStatuses?: NdaStatus[];
  advisors?: string[];
  industries?: string[];
  dueFilter?: DueFilter;
  dueInDays?: number | null;
  advisor?: string;
}

export interface PipelineStats {
  total: number;
  active: number;
  closed: number;
  ndaSigned: number;
  overdue: number;
  thisWeek: number;
  winRate?: number;
  stageDistribution: Record<string, number>;
  ndaDistribution: {
    Signed: number;
    Pending: number;
    None: number;
    [key: string]: number;
  };
  // Extended stats
  totalCompanies?: number;
  byStage?: Record<string, number>;
  ndaSignedCount?: number;
  upcomingFollowUpsCount?: number;
  [key: string]: any;
}

// ── Form Types ───────────────────────────────────────────────────────────────

export interface CompanyFormData {
  name: string;
  industry?: string;
  size?: string;
  revenue?: string;
  website?: string;
  address?: string;
  stage: PipelineStage;
  ndaStatus: NdaStatus;
  advisor?: string;
  advisors?: string[];
  referralSource?: string;
  lastContactDate?: string;
  nextStep?: string;
  nextStepDate?: string;
  expectedCloseDate?: string;
  notes?: string;
}

export interface ContactFormData {
  companyId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
}

export interface ActivityFormData {
  companyId: string;
  type: ActivityType;
  title: string;
  description?: string;
  date: string;
  performedBy?: string;
}

export interface TaskFormData {
  companyId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  assignedTo?: string;
}
