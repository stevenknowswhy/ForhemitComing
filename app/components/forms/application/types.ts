export interface ApplicationData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  position: string;
  otherPosition: string;
  resumeUrl: string;
}

export type ApplicationStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const POSITIONS = [
  "Chief Operating Officer Stewardship",
  "Director ESOP Architect",
  "Funding Director",
  "Director of Investor Relations",
  "Director of Origination & Acquisitions",
  "Investment Analyst",
  "Portfolio Manager",
  "Operations Director",
  "Legal Counsel",
  "Business Development",
  "Other"
] as const;

export const TOTAL_STEPS = 7;
