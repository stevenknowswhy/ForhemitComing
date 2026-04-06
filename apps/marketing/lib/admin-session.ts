/**
 * HttpOnly cookie gate for /admin/* using HMAC(ADMIN_TOKEN, fixed message).
 * Edge-safe (Web Crypto) for middleware + Node server actions.
 */

const COOKIE_NAME = "forhemit_admin_sess";
const HMAC_MSG = "forhemit-admin-session-v1";

function arrayBufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    bin += String.fromCharCode(bytes[i]!);
  }
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function signAdminSession(adminSecret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(adminSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(HMAC_MSG));
  return arrayBufferToBase64Url(sig);
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyAdminSession(
  cookieVal: string | undefined,
  adminSecret: string | undefined
): Promise<boolean> {
  if (!cookieVal || !adminSecret) return false;
  try {
    const expected = await signAdminSession(adminSecret);
    return timingSafeEqualStrings(cookieVal, expected);
  } catch {
    return false;
  }
}

/** Compare a submitted password to ADMIN_TOKEN without storing the token in the cookie. */
export async function verifyAdminPassword(
  password: string,
  adminSecret: string | undefined
): Promise<boolean> {
  if (!adminSecret) return false;
  try {
    const expected = await signAdminSession(adminSecret);
    const attempt = await signAdminSession(password);
    return timingSafeEqualStrings(expected, attempt);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
