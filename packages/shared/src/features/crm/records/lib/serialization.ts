// CRM records serialization (OD-13).
//
// PostgREST rows are snake_case; the shared types and API payloads are
// camelCase. These pure mappers are the single translation point between the
// crm_* tables and the domain types. Unknown row fields are ignored; unknown
// values pass through the field validators below.

import { CRM_SOURCES, OPPORTUNITY_STAGES } from "../types";
import type {
  Company,
  CompanyInput,
  CrmSource,
  Note,
  NoteInput,
  Opportunity,
  OpportunityInput,
  OpportunityStage,
  Person,
  PersonInput,
} from "../types";

type Row = Record<string, unknown>;

/**
 * Row inputs accept the API create payloads (PersonInput etc., whose source
 * is normally server-assigned) plus an optional source override — the Twenty
 * import tags rows "twenty" through this same mapper.
 */
type RowInput<T> = Partial<T> & { source?: CrmSource };

function str(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function boolOr<T>(value: unknown, allowed: readonly string[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function iso(value: unknown): string {
  return typeof value === "string" ? value : new Date().toISOString();
}

export function rowToPerson(row: Row): Person {
  return {
    id: str(row.id) ?? "",
    kind: "person",
    source: boolOr<CrmSource>(row.source, CRM_SOURCES, "manual"),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    firstName: str(row.first_name) ?? "",
    lastName: str(row.last_name),
    email: str(row.email),
    phone: str(row.phone),
    jobTitle: str(row.job_title),
    companyId: str(row.company_id),
  };
}

export function personToRow(person: RowInput<PersonInput>): Row {
  const row: Row = {};
  if (person.firstName !== undefined) row.first_name = person.firstName;
  // source must survive inserts (the Twenty import tags rows "twenty");
  // created_at/updated_at stay DB-owned (defaults + updated_at trigger).
  if (person.source !== undefined) row.source = person.source;
  for (const key of ["lastName", "email", "phone", "jobTitle", "companyId"] as const) {
    if (person[key] !== undefined) {
      row[key
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()] = person[key];
    }
  }
  return row;
}

export function rowToCompany(row: Row): Company {
  return {
    id: str(row.id) ?? "",
    kind: "company",
    source: boolOr<CrmSource>(row.source, CRM_SOURCES, "manual"),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    name: str(row.name) ?? "",
    domain: str(row.domain),
    industry: str(row.industry),
    city: str(row.city),
    state: str(row.state),
  };
}

export function companyToRow(company: RowInput<CompanyInput>): Row {
  const row: Row = {};
  if (company.name !== undefined) row.name = company.name;
  if (company.source !== undefined) row.source = company.source;
  for (const key of ["domain", "industry", "city", "state"] as const) {
    if (company[key] !== undefined) row[key] = company[key];
  }
  return row;
}

export function rowToOpportunity(row: Row): Opportunity {
  return {
    id: str(row.id) ?? "",
    kind: "opportunity",
    source: boolOr<CrmSource>(row.source, CRM_SOURCES, "manual"),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    name: str(row.name) ?? "",
    stage: boolOr<OpportunityStage>(row.stage, OPPORTUNITY_STAGES, "prospect"),
    amount: num(row.amount),
    closeDate: str(row.close_date),
    personId: str(row.person_id),
    companyId: str(row.company_id),
  };
}

export function opportunityToRow(opportunity: RowInput<OpportunityInput>): Row {
  const row: Row = {};
  if (opportunity.name !== undefined) row.name = opportunity.name;
  if (opportunity.stage !== undefined) row.stage = opportunity.stage;
  if (opportunity.amount !== undefined) row.amount = opportunity.amount;
  if (opportunity.source !== undefined) row.source = opportunity.source;
  for (const key of ["closeDate", "personId", "companyId"] as const) {
    if (opportunity[key] !== undefined) {
      row[key
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()] = opportunity[key];
    }
  }
  return row;
}

export function rowToNote(row: Row): Note {
  return {
    id: str(row.id) ?? "",
    source: boolOr<CrmSource>(row.source, CRM_SOURCES, "manual"),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
    body: str(row.body) ?? "",
    personId: str(row.person_id),
    companyId: str(row.company_id),
    opportunityId: str(row.opportunity_id),
  };
}

export function noteToRow(note: RowInput<NoteInput>): Row {
  const row: Row = {};
  if (note.body !== undefined) row.body = note.body;
  if (note.source !== undefined) row.source = note.source;
  for (const key of ["personId", "companyId", "opportunityId"] as const) {
    if (note[key] !== undefined) {
      row[key
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()] = note[key];
    }
  }
  return row;
}
