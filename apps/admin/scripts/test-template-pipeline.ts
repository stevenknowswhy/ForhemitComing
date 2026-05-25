#!/usr/bin/env -S npx tsx
/**
 * End-to-end test for the template pipeline:
 * template.content → {{placeholder}} replacement → PDF generation → Resend email
 *
 * Usage:
 *   cd apps/admin
 *   npx tsx scripts/test-template-pipeline.ts "Gate 1 Passage Confirmation" seller@example.com "John Smith"
 *
 * Or run with defaults (tests NDA receipt confirmation):
 *   npx tsx scripts/test-template-pipeline.ts
 */

import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Set NEXT_PUBLIC_CONVEX_URL or CONVEX_URL env var");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

// Default test data
const DEFAULT_TEMPLATE = "NDA Receipt Confirmation";
const DEFAULT_EMAIL = "stefano.stokes@forhemit.com";
const DEFAULT_NAME = "James Mitchell";

const DEFAULT_DEAL_DATA: Record<string, string> = {
  companyName: "Mitchell Precision Manufacturing, LLC",
  recipientName: "James Mitchell",
  recipientTitle: "Managing Member",
  ref: "FHH-NDA-0001",
  ndaType: "Mutual Non-Disclosure Agreement",
  ndaSignedDate: "2026-05-20",
  generatedDate: "May 24, 2026",
};

// Gate-specific test data
const GATE_DEAL_DATA: Record<string, Record<string, string>> = {
  "Gate 1 Passage Confirmation": {
    companyName: "Mitchell Precision Manufacturing, LLC",
    sellerName: "James Mitchell",
    ref: "FHH-0023",
    gateDate: "May 24, 2026",
    sbaIndicationDate: "May 22, 2026",
    lenderName: "Live Oak Bank",
    commitmentAmount: "$2,500,000",
    gate2TargetDate: "June 15, 2026",
    generatedDate: "May 24, 2026",
  },
  "Gate 2 Passage Confirmation": {
    companyName: "Mitchell Precision Manufacturing, LLC",
    sellerName: "James Mitchell",
    ref: "FHH-0023",
    gateDate: "June 15, 2026",
    loiAssumption: "$4,200,000",
    appraisedValue: "$4,450,000",
    variance: "6%",
    gate3TargetDate: "July 5, 2026",
    generatedDate: "June 15, 2026",
  },
  "Gate 3 Passage Confirmation": {
    companyName: "Mitchell Precision Manufacturing, LLC",
    sellerName: "James Mitchell",
    ref: "FHH-0023",
    gateDate: "July 5, 2026",
    closingTargetDate: "July 20, 2026",
    generatedDate: "July 5, 2026",
  },
  "Deal screener response": {
    companyName: "Mitchell Precision Manufacturing, LLC",
    brokerName: "Sarah Chen",
    brokerFirm: "Pacific Business Brokers",
    ref: "FHH-DS-0042",
    fitsCriteria: "true",
    ebitdaRange: "$1M-$5M",
    ebitdaStatus: "Within range",
    industryFit: "Precision manufacturing",
    industryStatus: "Qualified",
    ownershipStructure: "Single owner-operator",
    ownershipStatus: "Qualified",
    location: "San Francisco, CA",
    locationStatus: "Qualified",
    managementDepth: "3 key managers",
    managementStatus: "Sufficient",
    declineReason: "",
    generatedDate: "May 24, 2026",
  },
  "Engagement letter cover": {
    companyName: "Mitchell Precision Manufacturing, LLC",
    sellerName: "James Mitchell",
    ref: "FHH-0023",
    retainerAmount: "$15,000",
    retainerType: "Non-refundable",
    retainerPaymentTerms: "Due at signing",
    successFeeAmount: "$75,000",
    stewardshipFee: "2.5% of EBITDA annually",
    governingState: "California",
    deadlineDate: "May 31, 2026",
    generatedDate: "May 24, 2026",
  },
  "COOP kickoff letter": {
    companyName: "Mitchell Precision Manufacturing, LLC",
    sellerName: "James Mitchell",
    ref: "FHH-0023",
    closingDate: "September 15, 2026",
    stewardshipPeriod: "24 months",
    stewardshipStartDate: "January 14, 2027",
    stewardshipEndDate: "January 14, 2029",
    annualFee: "$37,500",
    firstBillingDate: "January 14, 2027",
    stewardshipLeadName: "Stefano Stokes",
    stewardshipLeadEmail: "stefano.stokes@forhemit.com",
    stewardshipLeadPhone: "(415) 555-0100",
    generatedDate: "January 14, 2027",
  },
};

async function testPipeline(
  templateTitle: string,
  recipientEmail: string,
  recipientName: string,
  dealData: Record<string, string>
) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`TESTING: ${templateTitle}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  Recipient: ${recipientName} <${recipientEmail}>`);
  console.log(`  Deal data keys: ${Object.keys(dealData).join(", ")}`);

  // Step 1: Verify template exists and has content
  console.log(`\n  [1/3] Loading template from Convex...`);
  // We'll call the action directly — it does the loading internally

  // Step 2: Generate document (PDF + email)
  console.log(`  [2/3] Generating PDF and sending email...`);
  const startTime = Date.now();

  try {
    // Dynamic import of the Convex API
    const api = await import("../../packages/convex/convex/_generated/api.js");

    const result = await client.action(
      api.templateGenerator.generateDocument,
      {
        templateTitle,
        recipientEmail,
        recipientName,
        dealData,
      }
    );

    const elapsed = Date.now() - startTime;

    if (result.success) {
      console.log(`  [3/3] SUCCESS in ${elapsed}ms`);
      console.log(`    Email ID: ${result.emailId}`);
      console.log(`    Template version: ${result.templateVersion}`);
      console.log(`    PDF size: ${result.pdfSize ? (result.pdfSize / 1024).toFixed(1) + "KB" : "unknown"}`);
      return { success: true, templateTitle, emailId: result.emailId };
    } else {
      console.error(`  [3/3] FAILED in ${elapsed}ms`);
      console.error(`    Error: ${result.error}`);
      return { success: false, templateTitle, error: result.error };
    }
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error(`  [3/3] EXCEPTION in ${elapsed}ms`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
    return { success: false, templateTitle, error: err instanceof Error ? err.message : String(err) };
  }
}

async function main() {
  const args = process.argv.slice(2);

  const templateTitle = args[0] || DEFAULT_TEMPLATE;
  const recipientEmail = args[1] || DEFAULT_EMAIL;
  const recipientName = args[2] || DEFAULT_NAME;

  // Get deal data for the template
  const dealData = GATE_DEAL_DATA[templateTitle] || DEFAULT_DEAL_DATA;

  console.log(`\nTemplate Pipeline Test`);
  console.log(`Convex URL: ${CONVEX_URL}`);
  console.log(`Template: ${templateTitle}`);

  const result = await testPipeline(templateTitle, recipientEmail, recipientName, dealData);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`RESULT: ${result.success ? "PASS" : "FAIL"}`);
  console.log(`${"=".repeat(60)}\n`);

  if (!result.success) {
    process.exit(1);
  }
}

// Run all stages if --all flag is passed
async function runAll() {
  const stages = [
    { title: "Deal screener response", email: DEFAULT_EMAIL, name: "Sarah Chen" },
    { title: "Engagement letter cover", email: DEFAULT_EMAIL, name: "James Mitchell" },
    { title: "Gate 1 Passage Confirmation", email: DEFAULT_EMAIL, name: "James Mitchell" },
    { title: "Gate 2 Passage Confirmation", email: DEFAULT_EMAIL, name: "James Mitchell" },
    { title: "Gate 3 Passage Confirmation", email: DEFAULT_EMAIL, name: "James Mitchell" },
    { title: "COOP kickoff letter", email: DEFAULT_EMAIL, name: "James Mitchell" },
  ];

  const results = [];
  for (const stage of stages) {
    const dealData = GATE_DEAL_DATA[stage.title] || DEFAULT_DEAL_DATA;
    const result = await testPipeline(stage.title, stage.email, stage.name, dealData);
    results.push(result);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("SUMMARY");
  console.log(`${"=".repeat(60)}`);
  for (const r of results) {
    console.log(`  ${r.success ? "PASS" : "FAIL"} — ${r.templateTitle}`);
  }
  const passed = results.filter((r) => r.success).length;
  console.log(`\n  ${passed}/${results.length} passed\n`);
}

if (process.argv.includes("--all")) {
  runAll().catch(console.error);
} else {
  main().catch(console.error);
}
