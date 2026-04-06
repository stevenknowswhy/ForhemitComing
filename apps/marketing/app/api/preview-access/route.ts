import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PREVIEW_COOKIE = "forhemit_preview";
const PREVIEW_COOKIE_VALUE = "granted";
const DEFAULT_CODE = "Forhemit-access2026";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const code =
    typeof body === "object" && body !== null && "code" in body
      ? String((body as { code?: unknown }).code ?? "").trim()
      : "";

  const expected = (process.env.PREVIEW_INVITATION_CODE ?? DEFAULT_CODE).trim();

  if (!code || code !== expected) {
    return NextResponse.json({ ok: false, error: "Invalid invitation code" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(PREVIEW_COOKIE, PREVIEW_COOKIE_VALUE, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    secure,
  });
  return res;
}
