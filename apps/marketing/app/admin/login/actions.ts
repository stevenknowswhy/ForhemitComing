"use server";

import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  signAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-session";

export type LoginAdminResult =
  | { ok: true; next: string }
  | { ok: false; error: string };

export async function loginAdminAction(formData: FormData): Promise<LoginAdminResult> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim();
  const safeNext =
    next.startsWith("/admin") && !next.startsWith("/admin/login")
      ? next
      : "/admin";

  const secret = process.env.ADMIN_TOKEN;
  if (!secret?.length) {
    return {
      ok: false,
      error:
        "ADMIN_TOKEN is not configured on the server. Add it to .env.local.",
    };
  }

  const ok = await verifyAdminPassword(password, secret);
  const token = await signAdminSession(secret);

  if (!ok) {
    await new Promise((r) => setTimeout(r, 400));
    return { ok: false, error: "Invalid password." };
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { ok: true, next: safeNext };
}
