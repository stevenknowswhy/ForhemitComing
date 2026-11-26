// One-tap outreach touch logging (Backend Step 6):
// POST /api/admin/outreach-touches
// Admin-session guarded, following the OD-13 CRM routes pattern
// (app/api/admin/crm/[resource]/route.ts): Next.js middleware exempts
// /api/**, so the guard here is mandatory. The write goes through the
// server-only service-role PostgREST client (app/admin/lib/supabase) —
// the service key never reaches the browser.
//
// Body: { contact_id: string (uuid), touch_no: 1..3,
//         channel?: string (default "email"),
//         outcome?: string (default "sent") }
// Inserts outreach_touches(contact_id, touch_no, sent_at=now, channel,
// outcome). The table's UNIQUE(contact_id, touch_no) makes a double-tap
// on an already-logged touch a 409, not a duplicate row.

import { sbPost } from "@/app/admin/lib/supabase";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-api-guard";
import type { OutreachTouchRow } from "@/app/admin/daily-view/types";

const CHANNELS = ["email", "facebook", "linkedin", "phone", "form"];
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "Expected a JSON object" }, { status: 400 });
  }
  const { contact_id, touch_no, channel, outcome } = body as Record<
    string,
    unknown
  >;
  if (typeof contact_id !== "string" || !UUID_RE.test(contact_id)) {
    return Response.json(
      { error: "contact_id must be a uuid" },
      { status: 400 }
    );
  }
  if (
    typeof touch_no !== "number" ||
    !Number.isInteger(touch_no) ||
    touch_no < 1 ||
    touch_no > 3
  ) {
    return Response.json(
      { error: "touch_no must be an integer 1..3" },
      { status: 400 }
    );
  }
  const channelValue =
    typeof channel === "string" && CHANNELS.includes(channel)
      ? channel
      : "email";
  const outcomeValue =
    typeof outcome === "string" && outcome.length > 0 ? outcome : "sent";

  try {
    const created = await sbPost<OutreachTouchRow[]>("outreach_touches", {
      contact_id,
      touch_no,
      sent_at: new Date().toISOString(),
      channel: channelValue,
      outcome: outcomeValue,
    });
    const first = created[0];
    if (!first) {
      return Response.json(
        { error: "Insert returned no row" },
        { status: 502 }
      );
    }
    return Response.json(first, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    // PostgREST surfaces the UNIQUE(contact_id, touch_no) violation as 409.
    if (message.includes("-> 409")) {
      return Response.json(
        { error: `Touch ${touch_no} is already logged for this contact` },
        { status: 409 }
      );
    }
    return Response.json({ error: message }, { status: 502 });
  }
}
