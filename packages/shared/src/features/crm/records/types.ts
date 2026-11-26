// CRM records types (OD-13).
//
// Twenty's record vocabulary (people / companies / opportunities) with our
// ESOP-style pipeline stages. Every record carries a `source` discriminator:
// 'manual' for records created here, 'twenty' for rows imported through the
// /api/admin/crm/import seam until a live bridge exists.
//
// These types live in a nested module (crm/records) because the stewardship
// CRM already owns crm/types.ts; both coexist under features/crm.

export const CRM_SOURCES = ["manual", "twenty"] as const;
export type CrmSource = (typeof CRM_SOURCES)[number];

/** Pipeline stages shared with the ESOP Partners idiom (STAGE_ORDER in constants). */
export const OPPORTUNITY_STAGES = [
  "prospect",
  "introduced",
  "active",
  "preferred",
  "dormant",
] as const;
export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

export const CRM_ENTITY_TYPES = [
  "people",
  "companies",
  "opportunities",
  "notes",
] as const;
export type CrmEntityType = (typeof CRM_ENTITY_TYPES)[number];

/** Fields every CRM record shares; `kind` discriminates the union. */
export interface CrmRecordBase {
  id: string;
  kind: "person" | "company" | "opportunity";
  source: CrmSource;
  createdAt: string;
  updatedAt: string;
}

export interface Company extends CrmRecordBase {
  kind: "company";
  name: string;
  domain?: string | null;
  industry?: string | null;
  city?: string | null;
  state?: string | null;
}

export interface Person extends CrmRecordBase {
  kind: "person";
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  companyId?: string | null;
}

export interface Opportunity extends CrmRecordBase {
  kind: "opportunity";
  name: string;
  stage: OpportunityStage;
  amount?: number | null;
  closeDate?: string | null;
  personId?: string | null;
  companyId?: string | null;
}

/** A note attaches to exactly one record, mirroring crm_notes' CHECK. */
export interface Note {
  id: string;
  body: string;
  source: CrmSource;
  createdAt: string;
  updatedAt: string;
  personId?: string | null;
  companyId?: string | null;
  opportunityId?: string | null;
}

/** Records a note may attach to; notes are handled separately in the UI. */
export type CrmRecord = Person | Company | Opportunity;

/** The full data set the CRM page server-fetches and the client island mutates. */
export interface CrmData {
  people: Person[];
  companies: Company[];
  opportunities: Opportunity[];
  notes: Note[];
}

/** Payload for creating a record via the API (id/source/timestamps are server-assigned). */
export type PersonInput = Omit<Person, "id" | "kind" | "source" | "createdAt" | "updatedAt">;
export type CompanyInput = Omit<Company, "id" | "kind" | "source" | "createdAt" | "updatedAt">;
export type OpportunityInput = Omit<
  Opportunity,
  "id" | "kind" | "source" | "createdAt" | "updatedAt"
>;
export type NoteInput = Omit<Note, "id" | "source" | "createdAt" | "updatedAt">;

export type CrmRecordInput = PersonInput | CompanyInput | OpportunityInput;

/** Field to sort records by; `dir` flips the comparison. */
export interface CrmSortConfig {
  field: "name" | "stage" | "amount" | "createdAt" | null;
  dir: "asc" | "desc";
}

/** Options accepted by filterRecords in lib/calculations. */
export interface CrmFilterOptions {
  search?: string;
  stage?: OpportunityStage | null;
  source?: CrmSource | null;
}

export const CRM_ENTITY_KINDS = {
  people: "person",
  companies: "company",
  opportunities: "opportunity",
} as const satisfies Record<Exclude<CrmEntityType, "notes">, CrmRecord["kind"]>;

export type RecordEntityType = Exclude<CrmEntityType, "notes">;
export type CrmEntityKind = (typeof CRM_ENTITY_KINDS)[RecordEntityType];
