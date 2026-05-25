/**
 * Authentication guard for Convex queries and mutations.
 * Verifies the caller has a valid identity via ConvexProviderWithClerk.
 * Unlike requireAdmin, this does not check email domain or admin tokens.
 */

type AuthContext = {
	auth: {
		getUserIdentity: () => Promise<{ email?: string } | null>;
	};
};

export async function requireAuth(ctx: AuthContext): Promise<void> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new Error("Unauthorized: Authentication required");
	}
}
