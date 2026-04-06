export type IntakeRole = "owner" | "broker";

export type IntakeAnswers = {
  role?: IntakeRole;
  selling?: "yes" | "no";
  broker?: "yes" | "no";
  saleTrack?: "single" | "dual" | "employee";
  financingType?: string | string[];
  closeUrgency?: "fast" | "prepared";
  esop?: "yes" | "no";
};

export type ClientType = "A" | "B" | "C" | "D";

export type DerivedClient = {
  type: ClientType;
  label: string;
} | null;

export type IntakePhase = "intake" | "loading" | "result";

export type IntakeStepOption = {
  value: string;
  label: string;
  sub: string;
};

export type IntakeStepDef = {
  id: string;
  field: keyof IntakeAnswers;
  label: string;
  lender?: boolean;
  multi?: boolean;
  hint?: string;
  showIf: (a: IntakeAnswers) => boolean;
  options: IntakeStepOption[];
};

export type RoadmapData = {
  headline: string;
  sub: string;
  timeline: string;
  stations: string[];
  urgencyNote: string | null;
  lender: boolean;
  trackNote: string;
  finLabel: string;
};

export type PreCoopData = {
  clientId: string;
  date: string;
  pct: number;
  track: string;
  fin: string;
  done: string[];
  active: string[];
  pending: string[];
};

export type IntakeResultState = {
  type: ClientType | undefined;
  label: string | undefined;
  clientId: string;
  success?: boolean;
  closeUrgency?: IntakeAnswers["closeUrgency"];
  roadmap: RoadmapData;
  preCOOP: PreCoopData | null;
};
