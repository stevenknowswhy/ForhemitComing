// Admin API route guard (OD-13).
//
// Next.js middleware does not cover API routes here (they are exempted in
// middleware.ts), so every /api/admin/** route handler must verify the admin
// session itself. Same HMAC cookie check as the pages: the forhemit_admin_sess
// cookie must equal HMAC(ADMIN_TOKEN, fixed message).

import { COOKIE_NAME, verifyAdminSession } from "./admin-session";

/** Extract the admin session cookie value from a Request's Cookie header. */
export function readAdminCookie(request: Request): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE_NAME) return rest.join("=");
  }
  return undefined;
}

/** True when the request carries a valid admin session cookie. */
export async function isAdminRequest(request: Request): Promise<boolean> {
  return verifyAdminSession(readAdminCookie(request), process.env.ADMIN_TOKEN);
}

/** 401 response for unauthenticated admin API calls. */
export function unauthorizedResponse(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
