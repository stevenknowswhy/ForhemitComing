// Server-only Supabase PostgREST client for the daily view.
// The implementation moved to app/admin/lib/supabase.ts so other admin
// server code (CRM routes) can share the same service-role client;
// this module re-exports it and daily-view behavior is unchanged.

export {
  supabaseConfigured,
  sbGet,
  sbPost,
  sbPatch,
  sbDelete,
} from "../../lib/supabase";
