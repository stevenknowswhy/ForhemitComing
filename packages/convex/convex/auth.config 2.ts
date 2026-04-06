export default {
  providers: [
    {
      // Clerk JWT issuer domain
      // This must match the "iss" claim in the Clerk JWT
      // Development: https://your-domain.clerk.accounts.dev
      // Production: https://clerk.yourdomain.com or https://your-domain.clerk.accounts.dev
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://enough-hermit-4.clerk.accounts.dev",
      // Application ID must match the "aud" claim in your session token
      applicationID: "convex",
    },
  ],
};
