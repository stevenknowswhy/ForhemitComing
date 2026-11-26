// Server-only Supabase PostgREST client shared by admin server code.
// The service-role key lives ONLY in Vercel env (SUPABASE_SERVICE_ROLE_KEY)
// and is never sent to the browser: this module is imported exclusively by
// server components / server lib code. RLS stays on; the service role is
// the same credential class the spine sync job uses to write the mirror.
//
// Do not import from a client component ("use client"): the env access and
// the Authorization header below must stay server-side.

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

export function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

function assertConfigured(): { url: string; key: string } {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Supabase env not configured");
  }
  return { url: SUPABASE_URL, key: SERVICE_KEY };
}

function restUrl(path: string): string {
  const { url } = assertConfigured();
  return `${url}/rest/v1/${path}`;
}

function authHeaders(key: string): Record<string, string> {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
}

async function parseResult<T>(path: string, res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase ${path} -> ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

export async function sbGet<T>(path: string): Promise<T> {
  const { key } = assertConfigured();
  const res = await fetch(restUrl(path), {
    headers: authHeaders(key),
    cache: "no-store",
  });
  return parseResult<T>(path, res);
}

/** Insert one or more rows; PostgREST returns the created representation. */
export async function sbPost<T>(
  path: string,
  body: unknown,
  searchParams: Record<string, string> = {}
): Promise<T> {
  const { key } = assertConfigured();
  const params = new URLSearchParams(searchParams);
  const res = await fetch(restUrl(path + (params.size ? `?${params}` : "")), {
    method: "POST",
    headers: {
      ...authHeaders(key),
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return parseResult<T>(path, res);
}

/** Patch rows matched by the path's query string; returns the updated rows. */
export async function sbPatch<T>(
  path: string,
  body: unknown,
  searchParams: Record<string, string> = {}
): Promise<T> {
  const { key } = assertConfigured();
  const params = new URLSearchParams(searchParams);
  const res = await fetch(restUrl(path + (params.size ? `?${params}` : "")), {
    method: "PATCH",
    headers: {
      ...authHeaders(key),
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return parseResult<T>(path, res);
}

/** Delete rows matched by the path's query string. */
export async function sbDelete(
  path: string,
  searchParams: Record<string, string> = {}
): Promise<void> {
  const { key } = assertConfigured();
  const params = new URLSearchParams(searchParams);
  const res = await fetch(restUrl(path + (params.size ? `?${params}` : "")), {
    method: "DELETE",
    headers: authHeaders(key),
    cache: "no-store",
  });
  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(
      `Supabase ${path} -> ${res.status}: ${bodyText.slice(0, 200)}`
    );
  }
}
