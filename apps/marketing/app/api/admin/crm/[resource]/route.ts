// CRM list/create route (OD-13): /api/admin/crm/[resource]
// Admin-session guarded; data goes through the server-only service-role
// PostgREST client. Middleware exempts /api/**, so the guard here is
// mandatory, not decorative.

import { sbGet, sbPost } from "@/app/admin/lib/supabase";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-api-guard";
import { CRM_RESOURCES, isCrmEntity } from "../resources";

type RouteContext = { params: Promise<{ resource: string }> };

export async function GET(request: Request, context: RouteContext) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();
  const { resource } = await context.params;
  if (!isCrmEntity(resource)) {
    return Response.json({ error: "Unknown CRM resource" }, { status: 404 });
  }
  const def = CRM_RESOURCES[resource];
  const rows = await sbGet<Record<string, unknown>[]>(
    `${def.table}?order=created_at.desc`
  );
  return Response.json({ records: rows.map(def.rowToRecord) });
}

export async function POST(request: Request, context: RouteContext) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();
  const { resource } = await context.params;
  if (!isCrmEntity(resource)) {
    return Response.json({ error: "Unknown CRM resource" }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "Expected a JSON object" }, { status: 400 });
  }
  const def = CRM_RESOURCES[resource];
  const row = def.inputToRow(body as Record<string, unknown>);
  const created = await sbPost<Record<string, unknown>[]>(def.table, row);
  const first = created[0];
  if (!first) {
    return Response.json({ error: "Insert returned no row" }, { status: 502 });
  }
  return Response.json(def.rowToRecord(first), { status: 201 });
}
