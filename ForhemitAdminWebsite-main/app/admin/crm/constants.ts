import { PipelineStage, NdaStatus, ActivityType, TaskPriority } from "./types";

// ============================================
// CRM Constants
// ============================================

// Default values for new companies
export const DEFAULT_COMPANY_VALUES = {
  stage: "First contact" as PipelineStage,
  ndaStatus: "None" as NdaStatus,
};

// Default values for new activities
export const DEFAULT_ACTIVITY_VALUES = {
  type: "note" as ActivityType,
};

// Default values for new tasks
export const DEFAULT_TASK_VALUES = {
  priority: "medium" as TaskPriority,
  status: "pending" as const,
};

// ============================================
// UI Labels & Options
// ============================================

export const STAGE_OPTIONS: { value: PipelineStage; label: string }[] = [
  { value: "First contact", label: "First contact" },
  { value: "Intro call", label: "Intro call" },
  { value: "NDA sent", label: "NDA sent" },
  { value: "Feasibility", label: "Feasibility" },
  { value: "Term sheet", label: "Term sheet" },
  { value: "LOI signed", label: "LOI signed" },
  { value: "Closed", label: "Closed" },
  { value: "On hold", label: "On hold" },
  { value: "Dead", label: "Dead" },
];

export const NDA_OPTIONS: { value: NdaStatus; label: string }[] = [
  { value: "None", label: "None" },
  { value: "Pending", label: "Pending" },
  { value: "Signed", label: "Signed" },
];

export const ACTIVITY_TYPE_OPTIONS: { value: ActivityType; label: string; icon: string }[] = [
  { value: "note", label: "Note", icon: "📝" },
  { value: "call", label: "Call", icon: "📞" },
  { value: "email", label: "Email", icon: "✉" },
  { value: "meeting", label: "Meeting", icon: "🤝" },
  { value: "stage_change", label: "Stage Change", icon: "➜" },
  { value: "task", label: "Task", icon: "✓" },
];

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "#94a3b8" },
  { value: "medium", label: "Medium", color: "#f5a623" },
  { value: "high", label: "High", color: "#ff5f5f" },
];

export const SORT_OPTIONS = [
  { value: "date_desc", label: "Last Contact (Newest)" },
  { value: "date_asc", label: "Last Contact (Oldest)" },
  { value: "company_asc", label: "Company Name (A-Z)" },
  { value: "stage", label: "Stage" },
  { value: "due_date", label: "Due Date" },
];

// ============================================
// Filter Labels
// ============================================

export const FILTER_LABELS = {
  stage: {
    all: "All Stages",
    "First contact": "First Contact",
    "Intro call": "Intro Call",
    "NDA sent": "NDA Sent",
    Feasibility: "Feasibility",
    "Term sheet": "Term Sheet",
    "LOI signed": "LOI Signed",
    Closed: "Closed",
    "On hold": "On Hold",
    Dead: "Dead",
  },
  ndaStatus: {
    all: "All NDA Status",
    None: "None",
    Pending: "Pending",
    Signed: "Signed",
  },
  dueFilter: {
    all: "All Due Dates",
    overdue: "Overdue",
    today: "Due Today",
    week: "Due This Week",
  },
};

// ============================================
// Pagination
// ============================================

export const DEFAULT_PAGE_SIZE = 50;

// ============================================
// Date Constants
// ============================================

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ============================================
// Industry Options (common for ESOP deals)
// ============================================

export const COMMON_INDUSTRIES = [
  "Manufacturing",
  "Construction",
  "Engineering",
  "HVAC/Services",
  "Logistics",
  "Printing & Media",
  "Technology",
  "Healthcare",
  "Professional Services",
  "Automotive",
  "Food & Beverage",
  "Distribution",
  "Agriculture",
  "Other",
];

// ============================================
// Advisor Options (common sources)
// ============================================

export const COMMON_ADVISORS = [
  "Self-sourced",
  "Morgan Stanley",
  "Cascadia Capital",
  "Raymond James",
  "Stout",
  "KPMG",
  "Deloitte",
  "PWC",
  "EY",
  "McDonald & Co",
  "Kroll",
  "Houlihan Lokey",
  "Lincoln International",
  "Other",
];
