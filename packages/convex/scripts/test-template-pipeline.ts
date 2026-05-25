#!/usr/bin/env node --experimental-strip-types
/**
 * End-to-end test for the template pipeline.
 *
 * Tests one template per pipeline stage:
 *   02-qualification: NDA Receipt Confirmation
 *   03-engagement: Engagement letter cover
 *   04-diligence: Gate 1 passage confirmation
 *   05-closing: Closing congratulations
 *   06-post-close: COOP kickoff letter
 *
 * For each template:
 *   1. Load HTML from templates table
 *   2. Replace {{placeholders}} with mock data
 *   3. POST to /api/pdf-generate → verify PDF returned
 *   4. Send email via Resend with PDF attachment
 *
 * Usage:
 *   cd packages/convex
 *   node --experimental-strip-types scripts/test-template-pipeline.ts
 *   node --experimental-strip-types scripts/test-template-pipeline.ts --dry-run
 *   node --experimental-strip-types scripts/test-template-pipeline.ts --stage qualification
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CONVEX_DIR = resolve(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");
const STAGE_FILTER = process.argv.find((a) => a.startsWith("--stage="))?.split("=")[1];

// Mock data that covers most placeholders
const MOCK_DATA: Record<string, string> = {
  companyName: "Mitchell Precision Manufacturing, LLC",
  recipientName: "James Mitchell",
  recipientEmail: "stefano.stokes@forhemit.com", // send to self for testing
  sellerName: "James Mitchell",
  sellerTitle: "Managing Member",
  brokerName: "Sarah Chen",
  brokerFirm: "Pacific Business Brokers",
  lenderName: "First Republic SBA",
  trusteeName: "Robert Williams",
  trusteeFirm: "Fiduciary Trust Partners",
  counselName: "David Park",
  ref: "FHH-TEST-001",
  feeTier: "Tier 2",
  ebitda: "$7,200,000",
  purchasePrice: "$12,500,000",
  gateDate: "May 24, 2026",
  gateNumber: "1",
  gateName: "Capital Commitment",
  sbaIndicationDate: "May 20, 2026",
  lenderName2: "First Republic SBA",
  commitmentAmount: "$8,500,000",
  gate2TargetDate: "June 15, 2026",
  closingTargetDate: "July 15, 2026",
  weekDate: "May 24, 2026",
  meetingDate: "June 1, 2026",
  stewardshipPeriod: "24 months",
  stewardshipStartDate: "September 1, 2026",
  stewardshipEndDate: "September 1, 2028",
  annualFee: "$180,000",
  stewardshipLeadName: "Stefano Stokes",
  stewardshipLeadEmail: "stefano.stokes@forhemit.com",
  stewardshipLeadPhone: "(415) 555-0100",
  monthNumber: "3",
  totalMonths: "24",
  quarterLabel: "Q3 2026",
  quarterNumber: "3",
  totalQuarters: "8",
  anniversaryYear: "1st",
  exclusivityPeriod: "90 days",
  closingDate: "July 15, 2026",
  loDate: "May 1, 2026",
  generatedDate: "May 24, 2026",
};

// Templates to test per stage
const TEST_TEMPLATES = [
  {
    name: "NDA Receipt Confirmation",
    stage: "qualification",
    extraData: {
      ndaType: "Mutual Non-Disclosure Agreement",
      ndaSignedDate: "May 22, 2026",
    },
  },
  {
    name: "Engagement letter cover",
    stage: "engagement",
    extraData: {
      retainerAmount: "$25,000",
      retainerType: "Non-Refundable",
    },
  },
  {
    name: "Gate 1 passage confirmation",
    stage: "diligence",
    extraData: {},
  },
  {
    name: "Closing congratulations letter",
    stage: "closing",
    extraData: {},
  },
  {
    name: "COOP kickoff letter",
    stage: "post-close",
    extraData: {},
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function runConvexQuery(queryPath: string, args: Record<string, unknown>): unknown {
  const argsJson = JSON.stringify(args);
  try {
    const result = execSync(`npx convex run ${queryPath} '${argsJson}'`, {
      cwd: CONVEX_DIR,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 30_000,
    });
    return JSON.parse(result.trim());
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`  Query failed: ${error}`);
    return null;
  }
}

function replacePlaceholders(template: string, data: Record<string, string>): string {
  let result = template;

  // Handle {{#if var}}...{{/if}} blocks
  result = result.replace(
    /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, varName: string, block: string) => {
      const value = data[varName];
      return value !== undefined && value !== "" ? block : "";
    }
  );

  // Replace simple placeholders
  result = result.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    return data[key] !== undefined ? data[key] : `{{${key}}}`;
  });

  return result;
}

async function generatePdf(html: string, templateName: string): Promise<Buffer | null> {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${siteUrl}/api/pdf-generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formData: {},
        templateId: "test",
        templateName,
        htmlContent: html,
        mode: "full",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`  PDF generation failed (${response.status}): ${errorText.substring(0, 200)}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (err) {
    console.error(`  PDF generation error: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

async function sendEmail(
  pdfBase64: string,
  filename: string,
  subject: string,
  recipientEmail: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("  RESEND_API_KEY not set");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "agent@email.forhemit.com",
        to: recipientEmail,
        subject,
        html: `<p>Please find attached the test document.</p>`,
        attachments: [{ filename, content: pdfBase64 }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`  Email send failed: ${error}`);
      return false;
    }

    const data = await response.json();
    console.log(`  Email sent. Resend ID: ${data.id}`);
    return true;
  } catch (err) {
    console.error(`  Email error: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Template Pipeline E2E Test ===\n");
  if (DRY_RUN) console.log("[DRY RUN] No emails will be sent.\n");

  const templates = STAGE_FILTER
    ? TEST_TEMPLATES.filter((t) => t.stage === STAGE_FILTER)
    : TEST_TEMPLATES;

  let passed = 0;
  let failed = 0;

  for (const test of templates) {
    console.log(`\n--- Testing: ${test.name} (${test.stage}) ---`);

    // 1. Load template from Convex
    console.log(`  Loading template from database...`);
    const template = runConvexQuery("templates:getByTitle", {
      title: test.name,
    }) as { title?: string; content?: string; version?: number } | null;

    if (!template || !template.content) {
      console.error(`  FAIL: Template not found or has no content`);
      failed++;
      continue;
    }

    console.log(`  Template loaded: v${template.version}, ${(template.content.length / 1024).toFixed(1)}KB`);

    // 2. Replace placeholders
    const data = { ...MOCK_DATA, ...test.extraData };
    const rendered = replacePlaceholders(template.content, data);

    // Check for unreplaced placeholders (excluding {{#if}}, {{/if}}, {{else}})
    const unreplaced = rendered.match(/\{\{[#\/]?\w+\}\}/g);
    if (unreplaced) {
      console.warn(`  WARN: ${unreplaced.length} unreplaced placeholder(s): ${[...new Set(unreplaced)].slice(0, 5).join(", ")}`);
    }

    // 3. Generate PDF
    console.log(`  Generating PDF...`);
    const pdf = await generatePdf(rendered, test.name);

    if (!pdf) {
      console.error(`  FAIL: PDF generation failed`);
      failed++;
      continue;
    }

    console.log(`  PDF generated: ${(pdf.length / 1024).toFixed(1)}KB`);

    // 4. Send email
    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would send email to ${MOCK_DATA.recipientEmail}`);
      passed++;
      continue;
    }

    console.log(`  Sending email to ${MOCK_DATA.recipientEmail}...`);
    const pdfBase64 = pdf.toString("base64");
    const filename = `Forhemit-Test-${test.name.replace(/\s+/g, "-")}.pdf`;
    const subject = `Test: ${test.name} — ${MOCK_DATA.companyName} — ${MOCK_DATA.ref}`;

    const sent = await sendEmail(pdfBase64, filename, subject, MOCK_DATA.recipientEmail);

    if (sent) {
      console.log(`  PASS`);
      passed++;
    } else {
      console.error(`  FAIL: Email send failed`);
      failed++;
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
