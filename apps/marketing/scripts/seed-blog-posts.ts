#!/usr/bin/env npx tsx
/**
 * Seed Convex `posts` from legacy `mockArticles` (one-time or local dev).
 *
 * Loads env from (in order, later files only fill missing keys):
 *   ../../packages/convex/.env.local, .env, .env.local under apps/marketing
 *
 * Or override: ADMIN_TOKEN=… NEXT_PUBLIC_CONVEX_URL=… pnpm seed:blog
 *
 * Skips slugs that already exist. Requires ADMIN_TOKEN matching Convex requireAdmin.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { ConvexClient } from "convex/browser";
import { api } from "../../../packages/convex/convex/_generated/api";
import { mockArticles } from "../lib/blog-data";

const cwd = process.cwd();

function loadDotenvFiles() {
  const candidates = [
    resolve(cwd, "../../packages/convex/.env.local"),
    resolve(cwd, ".env"),
    resolve(cwd, ".env.local"),
  ];
  for (const path of candidates) {
    if (existsSync(path)) {
      loadEnv({ path, override: false });
    }
  }
}

loadDotenvFiles();

function deriveConvexHttpUrl(): string | undefined {
  const direct =
    process.env.NEXT_PUBLIC_CONVEX_URL?.trim() ||
    process.env.CONVEX_URL?.trim();
  if (direct) return direct;
  const dep = process.env.CONVEX_DEPLOYMENT?.trim();
  if (!dep) return undefined;
  if (dep.startsWith("http://") || dep.startsWith("https://")) return dep;
  const slug = dep.includes(":") ? dep.split(":").pop()! : dep;
  return slug ? `https://${slug}.convex.cloud` : undefined;
}

const CONVEX_URL = deriveConvexHttpUrl();
const ADMIN_TOKEN = process.env.ADMIN_TOKEN?.trim();

if (!CONVEX_URL) {
  console.error(
    "Could not resolve Convex URL. Set NEXT_PUBLIC_CONVEX_URL in apps/marketing/.env.local, or CONVEX_DEPLOYMENT (e.g. dev:your-deployment) in packages/convex/.env.local / apps/marketing/.env.local."
  );
  process.exit(1);
}
if (!ADMIN_TOKEN) {
  console.error(
    "ADMIN_TOKEN is not set. Add it to apps/marketing/.env.local (same value Convex requireAdmin expects), or export it before running."
  );
  process.exit(1);
}

type BlogPathway = "founders" | "attorneys" | "lenders" | "cpas" | "employees";

function toBlogPathway(p: string): BlogPathway | undefined {
  if (
    p === "founders" ||
    p === "attorneys" ||
    p === "lenders" ||
    p === "cpas" ||
    p === "employees"
  ) {
    return p;
  }
  return undefined;
}

function tipTapFromStrings(...paragraphs: string[]) {
  const chunks = paragraphs.flatMap((p) =>
    p
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean)
  );
  const content =
    chunks.length > 0
      ? chunks.map((text) => ({
          type: "paragraph" as const,
          content: [{ type: "text" as const, text }],
        }))
      : [
          {
            type: "paragraph" as const,
            content: [{ type: "text" as const, text: "…" }],
          },
        ];
  return { type: "doc" as const, content };
}

async function main() {
  const client = new ConvexClient(CONVEX_URL!);

  try {
    for (const a of mockArticles) {
      const pathway = toBlogPathway(a.pathway);
      const relatedPathways = (a.relatedPathways ?? [])
        .map((p) => toBlogPathway(p))
        .filter((p): p is BlogPathway => p !== undefined);

      try {
        await client.mutation(api.posts.create, {
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          subtitle: a.subtitle,
          category: a.category,
          content: tipTapFromStrings(
            a.excerpt,
            a.subtitle,
            "This article was imported from legacy demo content. Replace the body in Convex or the admin UI when ready."
          ),
          status: "published",
          featuredImage: a.imageUrl,
          pathway,
          readTimeOverview: a.readTime.overview,
          readTimeDeepDive: a.readTime.deepDive,
          readTimeMethodology: a.readTime.methodology,
          depthLevel: a.depthLevel,
          resilienceSummary: a.resilienceSummary,
          relatedPathways:
            relatedPathways.length > 0 ? relatedPathways : undefined,
          adminToken: ADMIN_TOKEN,
        });
        console.log("[ok]", a.slug);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("already exists")) {
          console.log("[skip]", a.slug);
        } else {
          throw e;
        }
      }
    }
  } finally {
    client.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
