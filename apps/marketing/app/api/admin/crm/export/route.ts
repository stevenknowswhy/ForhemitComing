// CRM export route (OD-13): GET /api/admin/crm/export
//
// format=json (default): the full data set as Twenty-shaped arrays.
// format=csv: one entity's records as CSV — entity=people|companies|
// opportunities|notes (default opportunities). Admin-session guarded.

import { sbGet } from "@/app/admin/lib/supabase";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-api-guard";
import {
  rowToCompany,
  rowToNote,
  rowToOpportunity,
  rowToPerson,
} from "@forhemit/shared/features/crm/records";
import type { CrmEntityType } from "@forhemit/shared/features/crm/records";
import { CRM_RESOURCES, isCrmEntity } from "../resources";

type Json = Record<string, unknown>;

const CSV_COLUMNS: Record<CrmEntityType, string[]> = {
  people: [
    "id",
    "firstName",
    "lastName",
    "email",
    "phone",
    "jobTitle",
    "companyId",
    "source",
    "createdAt",
    "updatedAt",
  ],
  companies: [
    "id",
    "name",
    "domain",
    "industry",
    "city",
    "state",
    "source",
    "createdAt",
    "updatedAt",
  ],
  opportunities: [
    "id",
    "name",
    "stage",
    "amount",
    "closeDate",
    "personId",
    "companyId",
    "source",
    "createdAt",
    "updatedAt",
  ],
  notes: [
    "id",
    "body",
    "personId",
    "companyId",
    "opportunityId",
    "source",
    "createdAt",
    "updatedAt",
  ],
};

function csvCell(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
}

function toCsv(entity: CrmEntityType, records: unknown[]): string {
  const columns = CSV_COLUMNS[entity];
  const lines = [columns.join(",")];
  for (const record of records) {
    const row = record as Json;
    lines.push(columns.map((c) => csvCell(row[c])).join(","));
  }
  return lines.join("\r\n");
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();

  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "json";

  if (format === "json") {
    const [people, companies, opportunities, notes] = await Promise.all([
      sbGet<Json[]>("crm_people"),
      sbGet<Json[]>("crm_companies"),
      sbGet<Json[]>("crm_opportunities"),
      sbGet<Json[]>("crm_notes"),
    ]);
    const data = {
      people: people.map(rowToPerson),
      companies: companies.map(rowToCompany),
      opportunities: opportunities.map(rowToOpportunity),
      notes: notes.map(rowToNote),
    };
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="crm-export.json"',
      },
    });
  }

  if (format === "csv") {
    const entityParam = url.searchParams.get("entity") ?? "opportunities";
    if (!isCrmEntity(entityParam)) {
      return Response.json(
        { error: "Unknown CRM resource for CSV export" },
        { status: 400 }
      );
    }
    const def = CRM_RESOURCES[entityParam];
    const rows = await sbGet<Json[]>(def.table);
    const records = rows.map(def.rowToRecord);
    return new Response(toCsv(entityParam, records), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="crm-${entityParam}.csv"`,
      },
    });
  }

  return Response.json(
    { error: "Unsupported format; use json or csv" },
    { status: 400 }
  );
}
