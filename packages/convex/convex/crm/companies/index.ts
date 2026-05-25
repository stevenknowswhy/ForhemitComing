// CRM Companies Module - Exported for public API
export { list, get, getByStage, getStats, getWithUpcomingTasks } from "./queries";
export { create, update, remove } from "./mutations";
export { validateCompanyData, sanitizeCompanyData, checkCompanyEligibility } from "./validators";

// Type exports for use across the application
export type Company = {
  _id: string;
  _creationTime: number;
  name: string;
  industry?: string;
  size?: string; // e.g., "150 employees"
  revenue?: string; // e.g., "$22M"
  website?: string;
  address?: string;
  stage: string;
  ndaStatus: "None" | "Pending" | "Signed";
  advisor?: string; // e.g., "Morgan Stanley", "Self-sourced"
  referralSource?: string;
  lastContactDate?: string; // ISO date string YYYY-MM-DD
  nextStep?: string;
  nextStepDate?: string; // ISO date string YYYY-MM-DD
  expectedCloseDate?: string;
  notes?: string;
  createdBy?: string;
  createdAt: number;
  updatedAt: number;
};

export type CompanyStats = {
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
};

export type CompanyValidationResult = {
  valid: boolean;
  errors: string[];
};