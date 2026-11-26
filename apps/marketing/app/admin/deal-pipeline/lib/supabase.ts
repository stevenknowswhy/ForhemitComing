// Server-only Supabase client for the deal pipeline.
// On current remote main the implementation lives in app/admin/lib/supabase.ts
// (shared by admin server code; the daily view re-exports it the same way).
// The service-role key lives ONLY in Vercel env (SUPABASE_SERVICE_ROLE_KEY)
// and is never sent to the browser. Do not import from a client component.

export { supabaseConfigured, sbGet } from "../../lib/supabase";
