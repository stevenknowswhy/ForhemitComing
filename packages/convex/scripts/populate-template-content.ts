#!/usr/bin/env npx tsx
/**
 * Populate template content in Convex from HTML files on disk.
 *
 * Reads each .html file from packages/convex/templates/{external,internal}/...
 * and calls the templates:updateContentByTitle mutation via ConvexHttpClient.
 *
 * Usage:
 *   cd packages/convex
 *   npx tsx scripts/populate-template-content.ts
 *
 * Options:
 *   --dry-run   Print what would be updated without calling Convex
 *   --verbose   Print skipped files too
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ConvexHttpClient } from "convex/browser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = resolve(__dirname, "..", "templates");

// Load CONVEX_URL from env
const CONVEX_URL = process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error("CONVEX_URL not set. Run: export CONVEX_URL=$(grep CONVEX_URL packages/convex/.env.local | cut -d= -f2)");
  process.exit(1);
}

type ManifestEntry = {
  name: string;
  path: string;
  status: string;
};

function parseManifest(): ManifestEntry[] {
  const manifestPath = join(TEMPLATES_DIR, "manifest.ts");
  const content = readFileSync(manifestPath, "utf-8");

  const entries: ManifestEntry[] = [];
  const entryRegex = /name:\s*"([^"]+)",\s*\n\s*path:\s*"([^"]+)",[\s\S]*?status:\s*"([^"]+)"/g;

  let match: RegExpExecArray | null;
  while ((match = entryRegex.exec(content)) !== null) {
    entries.push({
      name: match[1],
      path: match[2],
      status: match[3],
    });
  }

  return entries;
}

// We need to import the api reference. Since we can't import generated code
// in a standalone script without compilation, we'll use the raw mutation path.
// ConvexHttpClient supports calling mutations by path string.

async function callMutation(
  client: ConvexHttpClient,
  name: string,
  args: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  // ConvexHttpClient.runMutation uses the function path as a string
  // We need to use the internal name format
  return await (client as any).mutation(name, args);
}

async function main() {
  const cliArgs = process.argv.slice(2);
  const dryRun = cliArgs.includes("--dry-run");
  const verbose = cliArgs.includes("--verbose");

  console.log("=== Populate Template Content ===\n");
  if (dryRun) {
    console.log("[DRY RUN] No mutations will be called.\n");
  }

  // 1. Parse manifest
  const entries = parseManifest();
  const existEntries = entries.filter((e) => e.status === "exists");
  console.log(`Found ${entries.length} manifest entries, ${existEntries.length} with status "exists".\n`);

  // 2. Connect to Convex
  let client: ConvexHttpClient | null = null;
  if (!dryRun) {
    console.log(`Connecting to ${CONVEX_URL}...`);
    client = new ConvexHttpClient(CONVEX_URL);
  }

  // 3. For each "exists" entry, read the HTML file and update Convex
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const entry of existEntries) {
    const relativePath = entry.path.replace(/^\.\//, "");
    const filePath = join(TEMPLATES_DIR, relativePath);

    if (!existsSync(filePath)) {
      if (verbose) {
        console.log(`  SKIP (file not found): ${entry.name} -> ${relativePath}`);
      }
      skipped++;
      continue;
    }

    let htmlContent: string;
    try {
      htmlContent = readFileSync(filePath, "utf-8");
    } catch (err) {
      console.error(`  ERROR reading ${filePath}: ${err}`);
      errors++;
      continue;
    }

    if (dryRun) {
      console.log(`  [DRY RUN] Would update: "${entry.name}" (${(htmlContent.length / 1024).toFixed(1)}KB)`);
      updated++;
      continue;
    }

    // Call Convex mutation
    try {
      process.stdout.write(`  Updating: "${entry.name}" (${(htmlContent.length / 1024).toFixed(1)}KB)...`);

      const result = await callMutation(client!, "templates:updateContentByTitle", {
        title: entry.name,
        content: htmlContent,
      });

      if (result && result.success === false) {
        console.log(` FAIL: ${result.error}`);
        errors++;
      } else {
        console.log(" OK");
        updated++;
      }
    } catch (err) {
      console.log(` FAIL: ${err instanceof Error ? err.message : String(err)}`);
      errors++;
    }
  }

  // 4. Summary
  console.log("\n=== Summary ===");
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped (file not found): ${skipped}`);
  console.log(`  Errors: ${errors}`);

  if (errors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
