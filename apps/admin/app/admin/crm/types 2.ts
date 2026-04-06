import { Doc } from "@/convex/_generated/dataModel";

// ============================================
// CRM Types
// ============================================

// Export Convex document types for convenience
export type Company = Doc<"crmCompanies">;
export type Contact = Doc<"crmContacts">;
export type Activity = Doc<"crmActivities">;
export type Task = Doc<"crmTasks">;

// Pipeline stages
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

// NDA status values
export const NDA_STATUS = ["None", "Pending", "Signed"] as const;
export type NdaStatus = (typeof NDA_STATUS)[number];

// Activity types
export const ACTIVITY_TYPES = ["note", "call", "email", "meeting", "stage_change", "task"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

// CRM Views
export const CRM_VIEWS = ["table", "kanban", "calendar", "analytics"] as const;
export type CrmView = (typeof CRM_VIEWS)[number];

// Task priorities
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

// Task statuses
export const TASK_STATUSES = ["pending", "completed", "overdue"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

// ============================================
// Stage Style Configuration
// ============================================

export interface StageStyle {
  name: PipelineStage;
  color: string;
  bg: string;
  borderColor: string;
}

export const STAGE_STYLES: Record<PipelineStage, StageStyle> = {
  "First contact": {
    name: "First contact",
    color: "#4d9eff",
    bg: "#1a3a6a",
    borderColor: "#4d9eff40",
  },
  "Intro call": {
    name: "Intro call",
    color: "#a78bfa",
    bg: "#2d1f5e",
    borderColor: "#a78bfa40",
  },
  "NDA sent": {
    name: "NDA sent",
    color: "#f5a623",
    bg: "#4a2e0a",
    borderColor: "#f5a62340",
  },
  Feasibility: {
    name: "Feasibility",
    color: "#2dd882",
    bg: "#0d3a22",
    borderColor: "#2dd88240",
  },
  "Term sheet": {
    name: "Term sheet",
    color: "#00d4aa",
    bg: "#003d30",
    borderColor: "#00d4aa40",
  },
  "LOI signed": {
    name: "LOI signed",
    color: "#a3e635",
    bg: "#2a3a00",
    borderColor: "#a3e63540",
  },
  Closed: {
    name: "Closed",
    color: "#e2e8f0",
    bg: "#2d3748",
    borderColor: "#e2e8f040",
  },
  "On hold": {
    name: "On hold",
    color: "#94a3b8",
    bg: "#1e293b",
    borderColor: "#94a3b840",
  },
  Dead: {
    name: "Dead",
    color: "#ff5f5f",
    bg: "#3a1010",
    borderColor: "#ff5f5f40",
  },
};

// ============================================
// Filter Types
// ============================================

export interface CompanyFilters {
  stage: string;
  ndaStatus: string;
  searchQuery: string;
  advisor: string;
  dueFilter: DueFilter;
}

export type DueFilter = "all" | "overdue" | "today" | "week";

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

// ============================================
// Stats Types
// ============================================

export interface PipelineStats {
  total: number;
  active: number;
  closed: number;
  ndaSigned: number;
  overdue: number;
  thisWeek: number;
  stageDistribution: Record<string, number>;
  ndaDistribution: {
    Signed: number;
    Pending: number;
    None: number;
  };
  winRate: number;
}

// ============================================
// Form Types
// ============================================

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
