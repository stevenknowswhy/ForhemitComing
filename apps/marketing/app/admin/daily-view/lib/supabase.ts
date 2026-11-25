// Server-only Supabase PostgREST client for the daily view.
// The service-role key lives ONLY in Vercel env (SUPABASE_SERVICE_ROLE_KEY)
// and is never sent to the browser: this module is imported exclusively by
// server components / server lib code. RLS stays on; the service role is
// the same credential class the spine sync job uses to write the mirror.

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

export function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

export async function sbGet<T>(path: string): Promise<T> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Supabase env not configured");
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase ${path} -> ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}
