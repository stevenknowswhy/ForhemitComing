/**
 * Admin authorization for Convex mutations.
 * Uses Clerk identity from ConvexProviderWithClerk; optional ADMIN_TOKEN on the
 * deployment for scripts. Keep rules in sync with lib/clerk.ts.
 */
const SUPER_ADMIN_EMAIL = "stefano.stokes@forhemit.com";
const ALLOWED_EMAIL_DOMAIN = "forhemit.com";

function isAdminEmail(email: string): boolean {
  const e = email.toLowerCase().trim();
  if (e === SUPER_ADMIN_EMAIL.toLowerCase()) return true;
  return e.endsWith(`@${ALLOWED_EMAIL_DOMAIN.toLowerCase()}`);
}

type AuthContext = {
  auth: {
    getUserIdentity: () => Promise<{ email?: string } | null>;
  };
};

export async function requireAdmin(
  ctx: AuthContext,
  adminToken?: string | undefined
): Promise<void> {
  const envToken = process.env.ADMIN_TOKEN;
  if (typeof envToken === "string" && envToken.length > 0 && adminToken === envToken) {
    return;
  }

  const identity = await ctx.auth.getUserIdentity();
  const email = identity?.email;
  if (email && isAdminEmail(email)) {
    return;
  }

  throw new Error("Unauthorized: Admin access required");
}
