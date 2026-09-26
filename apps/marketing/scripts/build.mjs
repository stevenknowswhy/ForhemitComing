// Build guard: on Vercel PRODUCTION builds with a CONVEX_DEPLOY_KEY, push the
// shared Convex functions and run `next build` as the deploy's --cmd child so
// the build bakes in the real deployment URL via NEXT_PUBLIC_CONVEX_URL /
// NEXT_PUBLIC_CONVEX_SITE_URL. Everything else (Vercel preview, local dev,
// GitHub CI) runs a plain `next build`: preview deployments are claimed fresh
// per build and Convex environment variables are strictly per-deployment with
// no skip flag, so a fresh preview can never satisfy auth.config.ts's required
// CLERK_JWT_ISSUER_DOMAIN and the function push always fails
// (AuthConfigMissingEnvironmentVariable). Keyless builds fall back to
// lib/env.ts's dummy URL, which is correct for them.
import { spawnSync } from "node:child_process";

function run(cmd, args) {
  const result = spawnSync(cmd, args, { stdio: "inherit" });
  if (result.error) {
    console.error(`build: failed to run ${cmd}: ${result.error.message}`);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

const hasConvexKey = Boolean(process.env.CONVEX_DEPLOY_KEY);
const isVercelProduction = process.env.VERCEL_ENV === "production";

if (hasConvexKey && isVercelProduction) {
  // Runs in this package's directory, so the convex CLI sees Next.js in
  // package.json (injecting the NEXT_PUBLIC_* var names), reads convex.json
  // (functions live in packages/convex), and executes `next build` back here.
  run("npx", ["--no-install", "convex", "deploy", "--cmd", "next build", "--yes"]);
} else {
  if (hasConvexKey) {
    console.log(
      `build: CONVEX_DEPLOY_KEY set but VERCEL_ENV="${process.env.VERCEL_ENV}" is not production — running plain next build`,
    );
  }
  run("npx", ["--no-install", "next", "build"]);
}
