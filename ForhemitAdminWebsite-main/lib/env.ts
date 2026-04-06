import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const convexUrlSchema = z.union([
  z.string().url(),
  z.literal("https://dummy.convex.cloud"),
]);

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().optional(),
    CLERK_WEBHOOK_SECRET: z.string().optional(),
    UPLOADTHING_TOKEN: z.string().optional(),
    UPLOADTHING_APP_ID: z.string().optional(),
    UNSPLASH_APPLICATION_ID: z.string().optional(),
    UNSPLASH_ACCESS_KEY: z.string().optional(),
    UNSPLASH_SECRET_KEY: z.string().optional(),
    CONVEX_DEPLOYMENT: z.string().optional(),
    CLERK_JWT_ISSUER_DOMAIN: z.string().optional(),
    ADMIN_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: convexUrlSchema,
    NEXT_PUBLIC_CONVEX_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().optional(),
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    UNSPLASH_APPLICATION_ID: process.env.UNSPLASH_APPLICATION_ID,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    CLERK_JWT_ISSUER_DOMAIN: process.env.CLERK_JWT_ISSUER_DOMAIN,
    ADMIN_TOKEN: process.env.ADMIN_TOKEN,
    NEXT_PUBLIC_CONVEX_URL:
      process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://dummy.convex.cloud",
    NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.npm_lifecycle_event === "lint",
  emptyStringAsUndefined: true,
});
