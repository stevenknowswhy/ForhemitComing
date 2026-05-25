/**
 * Seed NDA Receipt Confirmation HTML into Convex templates table.
 * Run: npx tsx scripts/seed-nda-template.ts
 */
import { ConvexHttpClient } from "convex/browser";
import * as fs from "fs";
import * as path from "path";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:5173";

async function main() {
  const client = new ConvexHttpClient(CONVEX_URL);

  const templatePath = path.resolve(
    __dirname,
    "../../../packages/convex/templates/external/02-qualification/nda-receipt-confirmation.html"
  );
  const html = fs.readFileSync(templatePath, "utf-8");
  console.log(`Read template: ${html.length} chars`);

  const result = await client.mutation("documentPipeline:findOrCreateAndSeed" as any, {
    title: "NDA Receipt Confirmation",
    content: html,
    lifecycleStage: "qualification",
    audience: ["seller"],
    category: "communication",
    description: "Confirms receipt of executed NDA. Sent automatically when NDA is received from client.",
  });

  console.log("Result:", JSON.stringify(result, null, 2));
}

main().catch(console.error);
