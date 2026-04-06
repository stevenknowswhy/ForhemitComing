import type { AuthConfig } from "convex/server";

/**
 * Clerk → Convex auth. The `domain` must be your Clerk **Frontend API URL**
 * (same value as the `iss` claim in Clerk JWTs). Find it in Clerk Dashboard →
 * API Keys → "Frontend API URL" (dev looks like https://verb-noun-00.clerk.accounts.dev).
 *
 * This variable must be set for your **Convex** deployment (not only Next.js):
 * - Convex Dashboard → your deployment → Settings → Environment Variables:
 *   `CLERK_JWT_ISSUER_DOMAIN` = that URL
 * - Or CLI: `npx convex env set CLERK_JWT_ISSUER_DOMAIN "https://....clerk.accounts.dev"`
 *
 * After changing this file or the env var, run `npx convex dev` or `npx convex deploy`
 * so the backend picks up auth config.
 */
const clerkIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN?.trim();

if (!clerkIssuerDomain) {
  throw new Error(
    'Missing CLERK_JWT_ISSUER_DOMAIN for Convex. Set it in the Convex Dashboard (Settings → Environment Variables) for this deployment, or run: npx convex env set CLERK_JWT_ISSUER_DOMAIN "https://<your-app>.clerk.accounts.dev" — see https://docs.convex.dev/auth/clerk'
  );
}

export default {
  providers: [
    {
      domain: clerkIssuerDomain,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
