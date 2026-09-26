// Build guard: with a CONVEX_DEPLOY_KEY (Vercel preview/production), push the
// shared Convex functions and run `next build` as the deploy's --cmd child so
// the build bakes in the real deployment URL via NEXT_PUBLIC_CONVEX_URL /
// NEXT_PUBLIC_CONVEX_SITE_URL. Without a key (local dev, GitHub CI), fall back
// to a plain `next build` — lib/env.ts then serves its dummy-URL fallback,
// which is correct for keyless builds.
import { spawnSync } from "node:child_process";

function run(cmd, args) {
  const result = spawnSync(cmd, args, { stdio: "inherit" });
  if (result.error) {
    console.error(`build: failed to run ${cmd}: ${result.error.message}`);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

if (process.env.CONVEX_DEPLOY_KEY) {
  // Runs in this package's directory, so the convex CLI sees Next.js in
  // package.json (injecting the NEXT_PUBLIC_* var names), reads convex.json
  // (functions live in packages/convex), and executes `next build` back here.
  run("npx", ["--no-install", "convex", "deploy", "--cmd", "next build", "--yes"]);
} else {
  run("npx", ["--no-install", "next", "build"]);
}
