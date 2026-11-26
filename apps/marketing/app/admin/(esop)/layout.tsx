import type { ReactNode } from "react";
import AdminChrome from "./AdminChrome";
import { SyncHealthLine } from "../daily-view/components/Blocks";
import { getSyncHealth } from "../daily-view/lib/queries";
import { supabaseConfigured } from "../daily-view/lib/supabase";

// Admin shell for authenticated admin pages (daily view, CRM, blog, ESOP
// Partners). Route group only — URLs are unchanged, so the /admin/* middleware
// gate still applies. /admin/login and /admin/logout stay outside the group:
// login renders chrome-free.
//
// Server component: the sync-health read stays server-side (service-role key
// never reaches the browser) and this layout composes server components, so
// the daily view's force-dynamic rendering is unaffected.
//
// force-dynamic here so the sync-health line renders per-request on every
// admin page — otherwise statically prerendered children (e.g. /admin/crm,
// /admin/blog) would bake build-time sync state into the HTML.
export const dynamic = "force-dynamic";

export default async function AdminEsopLayout({ children }: { children: ReactNode }) {
  let syncLine: ReactNode = null;

  if (supabaseConfigured()) {
    try {
      syncLine = <SyncHealthLine health={await getSyncHealth()} />;
    } catch (e) {
      // Surface a failed read rather than silently dropping the line: a
      // missing sync-health signal is exactly what the slot exists to show.
      syncLine = (
        <p className="text-sm opacity-75">
          Spine sync: read failed — {e instanceof Error ? e.message : String(e)}
        </p>
      );
    }
  } else {
    syncLine = <p className="text-sm opacity-75">Spine sync: Supabase not configured.</p>;
  }

  return <AdminChrome syncLine={syncLine}>{children}</AdminChrome>;
}
