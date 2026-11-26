// Twenty import seam (OD-13): POST /api/admin/crm/import
//
// Accepts a Twenty-shaped JSON payload (people / companies / opportunities
// arrays), maps it through the shared mapper, and persists the records with
// source "twenty". Companies are inserted first; their returned UUIDs replace
// the payload's twentyCompanyId references on people and opportunities so
// foreign keys point at real rows. Admin-session guarded.

import { sbPost } from "@/app/admin/lib/supabase";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-api-guard";
import {
  companyToRow,
  mapTwentyImport,
  opportunityToRow,
  personToRow,
  rowToCompany,
  rowToOpportunity,
  rowToPerson,
} from "@forhemit/shared/features/crm/records";
import { CRM_RESOURCES } from "../resources";

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const mapped = mapTwentyImport(payload);
  if (
    mapped.people.length === 0 &&
    mapped.companies.length === 0 &&
    mapped.opportunities.length === 0
  ) {
    return Response.json(
      {
        error: "No importable records found",
        hint: "Expected people/companies/opportunities arrays",
        skipped: mapped.skipped,
      },
      { status: 400 }
    );
  }

  // Companies first so people/opportunities can link to the new UUIDs.
  const companyRows = await sbPost<Record<string, unknown>[]>(
    CRM_RESOURCES.companies.table,
    mapped.companies.map((c) => companyToRow(c))
  );

  const companyIdByTwentyId = new Map<string, string>();
  mapped.companies.forEach((company, index) => {
    const row = companyRows[index];
    if (row) companyIdByTwentyId.set(company.twentyId, String(row.id ?? ""));
  });
  const resolveCompanyId = (twentyId?: string): string | null =>
    twentyId ? companyIdByTwentyId.get(twentyId) ?? null : null;

  const personRows = mapped.people.length
    ? await sbPost<Record<string, unknown>[]>(
        CRM_RESOURCES.people.table,
        mapped.people.map((p) =>
          personToRow({ ...p, companyId: resolveCompanyId(p.twentyCompanyId) })
        )
      )
    : [];

  const opportunityRows = mapped.opportunities.length
    ? await sbPost<Record<string, unknown>[]>(
        CRM_RESOURCES.opportunities.table,
        mapped.opportunities.map((o) =>
          opportunityToRow({
            ...o,
            companyId: resolveCompanyId(o.twentyCompanyId),
          })
        )
      )
    : [];

  return Response.json(
    {
      created: {
        companies: companyRows.map(rowToCompany),
        people: personRows.map(rowToPerson),
        opportunities: opportunityRows.map(rowToOpportunity),
      },
      skipped: mapped.skipped,
    },
    { status: 201 }
  );
}
