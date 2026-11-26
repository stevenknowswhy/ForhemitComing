// CRM page (OD-13 D4): the server shell fetches the full record set through
// the PR A server-only PostgREST client and hands it to the client island as
// initial state. Supabase stays server-side; the island mutates through the
// admin-guarded /api/admin/crm routes (see useCrm).
//
// The schema migration (scripts/supabase/crm-schema.sql) is person-gated, so
// a failed or missing read degrades to an empty CRM with a notice instead of
// an error page.

import { sbGet, supabaseConfigured } from "@/app/admin/lib/supabase";
import {
  rowToCompany,
  rowToNote,
  rowToOpportunity,
  rowToPerson,
} from "@forhemit/shared/features/crm/records";
import type {
  Company,
  CrmData,
  Note,
  Opportunity,
  Person,
} from "@forhemit/shared/features/crm/records";
import { CrmClient } from "./CrmClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CRM",
  description: "People, companies, and opportunities for the brokerage",
};

type Row = Record<string, unknown>;

const EMPTY_DATA: CrmData = {
  people: [],
  companies: [],
  opportunities: [],
  notes: [],
};

async function fetchCrmData(): Promise<{ data: CrmData; notice: string | null }> {
  if (!supabaseConfigured()) {
    return {
      data: EMPTY_DATA,
      notice:
        "Supabase is not configured, so the CRM is read-only empty. Records created here need the Supabase env vars.",
    };
  }
  try {
    const [peopleRows, companyRows, opportunityRows, noteRows] = await Promise.all([
      sbGet<Row[]>("crm_people?select=*&order=created_at.asc"),
      sbGet<Row[]>("crm_companies?select=*&order=created_at.asc"),
      sbGet<Row[]>("crm_opportunities?select=*&order=created_at.asc"),
      sbGet<Row[]>("crm_notes?select=*&order=created_at.asc"),
    ]);
    return {
      data: {
        people: peopleRows.map(rowToPerson),
        companies: companyRows.map(rowToCompany),
        opportunities: opportunityRows.map(rowToOpportunity),
        notes: noteRows.map(rowToNote),
      },
      notice: null,
    };
  } catch (error) {
    // Likely the crm_* migration has not been applied yet.
    const detail = error instanceof Error ? error.message.slice(0, 160) : "unknown error";
    return {
      data: EMPTY_DATA,
      notice: `Could not load CRM records (${detail}). If the crm_* tables are new, run scripts/supabase/crm-schema.sql in the Supabase dashboard first.`,
    };
  }
}

export default async function CrmPage() {
  const { data, notice } = await fetchCrmData();
  const people: Person[] = data.people;
  const companies: Company[] = data.companies;
  const opportunities: Opportunity[] = data.opportunities;
  const notes: Note[] = data.notes;
  return <CrmClient initial={{ people, companies, opportunities, notes }} notice={notice} />;
}
