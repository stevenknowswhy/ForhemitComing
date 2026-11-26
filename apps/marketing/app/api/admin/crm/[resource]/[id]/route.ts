// CRM record update/delete route (OD-13): /api/admin/crm/[resource]/[id]
// Admin-session guarded; data goes through the server-only service-role
// PostgREST client.

import { sbDelete, sbPatch } from "@/app/admin/lib/supabase";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-api-guard";
import { CRM_RESOURCES, isCrmEntity } from "../../resources";

type RouteContext = { params: Promise<{ resource: string; id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();
  const { resource, id } = await context.params;
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
  const updated = await sbPatch<Record<string, unknown>[]>(
    def.table,
    row,
    { id: `eq.${id}` }
  );
  const first = updated[0];
  if (!first) {
    return Response.json({ error: "Record not found" }, { status: 404 });
  }
  return Response.json(def.rowToRecord(first));
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();
  const { resource, id } = await context.params;
  if (!isCrmEntity(resource)) {
    return Response.json({ error: "Unknown CRM resource" }, { status: 404 });
  }
  const def = CRM_RESOURCES[resource];
  await sbDelete(def.table, { id: `eq.${id}` });
  return Response.json({ ok: true });
}
