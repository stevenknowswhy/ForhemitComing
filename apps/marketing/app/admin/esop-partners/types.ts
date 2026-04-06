// ESOP Partner CRM Types

export type PartnerType = 
  | 'Lender' 
  | 'Attorney' 
  | 'CPA' 
  | 'Administrator' 
  | 'Appraiser' 
  | 'Trustee' 
  | 'Financial Advisor' 
  | 'Other';

export type EngagementStage = 
  | 'prospect' 
  | 'introduced' 
  | 'active' 
  | 'preferred' 
  | 'dormant';

export type ActivityType = 
  | 'deal' 
  | 'call' 
  | 'email' 
  | 'doc' 
  | 'referral' 
  | 'event';

export interface JourneyStep {
  id: string;
  name: string;
  desc: string;
  docLabel?: string;
}

export interface JourneyStepState {
  status: 'pending' | 'current' | 'done';
  date: string | null;
  docSent?: boolean;
}

export interface Note {
  id: string;
  text: string;
  ts: string;
}

export interface Activity {
  id: string;
  text: string;
  date: string;
  time: string;
  type: ActivityType;
}

export interface PartnerContact {
  id: number;
  first: string;
  last: string;
  firm: string;
  type: PartnerType;
  email: string;
  phone: string;
  states: string[];
  stage: EngagementStage;
  lastContact: string;
  notes: string;
  preferred: boolean;
  journey: Record<string, JourneyStepState>;
  notes_log: Note[];
  activities: Activity[];
}

export interface StageMeta {
  label: string;
  score: number;
}

export interface TypeColors {
  bg: string;
  text: string;
}

export interface JourneyMap {
  [key: string]: JourneyStep[];
}

export type ViewMode = 'all' | 'preferred' | 'pipeline' | 'nudges' | 'onboarding';
export type CardViewMode = 'grid' | 'list';

export interface SortConfig {
  field: 'name' | 'firm' | 'type' | 'stage' | 'lastcontact' | null;
  dir: 'asc' | 'desc';
}

export interface StorageMeta {
  nextId: number;
  nextNid: number;
  nextAid: number;
}

export interface ExportedData {
  contacts: PartnerContact[];
  exportedAt: string;
  version: string;
}
