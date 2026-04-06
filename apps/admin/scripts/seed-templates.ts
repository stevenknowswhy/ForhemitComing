#!/usr/bin/env tsx
/**
 * Seed document templates to Convex
 * Run: npx tsx scripts/seed-templates.ts
 */

import { ConvexClient } from "convex/browser";
import { api } from "../../../packages/convex/convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("Error: NEXT_PUBLIC_CONVEX_URL is not set");
  process.exit(1);
}

async function main() {
  console.log("Connecting to Convex...");
  console.log("URL:", CONVEX_URL);
  
  const client = new ConvexClient(CONVEX_URL!);
  
  try {
    console.log("\nSeeding document templates...");
    const result = await client.mutation(api.documentTemplates.seed, {});
    console.log("✅ Seed completed successfully!");
    console.log("\nSeeded templates:");
    result.templates.forEach((t: { slug: string; seeded: boolean }) => {
      console.log(`  ${t.seeded ? "[NEW]" : "[UPD]"} ${t.slug}`);
    });
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    client.close();
  }
}

main();
