/**
 * Test script for auth email templates
 *
 * Usage:
 *   npx tsx scripts/test-auth-emails.ts
 *
 * Tests: verify-email, magic-link, two-factor-code
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../packages/convex/convex/_generated/api";

// Load env from admin's .env.local
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const TEST_EMAIL = process.env.ADMIN_EMAIL || "stefano.stokes@forhemit.com";

async function testVerifyEmail() {
  console.log("\n1. Testing sendVerifyEmail...");
  try {
    const result = await convex.action(api.authEmails.sendVerifyEmail, {
      to: TEST_EMAIL,
      token: "test-token-abc123-" + Date.now(),
      firstName: "Stefano",
    });
    console.log("   Result:", result.success ? "SUCCESS" : "FAILED");
    if (result.email?.id) console.log("   Email ID:", result.email.id);
    return result.success;
  } catch (err) {
    console.error("   Error:", err);
    return false;
  }
}

async function testMagicLink() {
  console.log("\n2. Testing sendMagicLink...");
  try {
    const result = await convex.action(api.authEmails.sendMagicLink, {
      to: TEST_EMAIL,
      token: "magic-token-xyz789-" + Date.now(),
      firstName: "Stefano",
    });
    console.log("   Result:", result.success ? "SUCCESS" : "FAILED");
    if (result.email?.id) console.log("   Email ID:", result.email.id);
    return result.success;
  } catch (err) {
    console.error("   Error:", err);
    return false;
  }
}

async function testTwoFactorCode() {
  console.log("\n3. Testing sendTwoFactorCode...");
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await convex.action(api.authEmails.sendTwoFactorCode, {
      to: TEST_EMAIL,
      code,
      firstName: "Stefano",
    });
    console.log("   Result:", result.success ? "SUCCESS" : "FAILED");
    console.log("   Code:", code);
    if (result.email?.id) console.log("   Email ID:", result.email.id);
    return result.success;
  } catch (err) {
    console.error("   Error:", err);
    return false;
  }
}

async function main() {
  console.log("=== Auth Email Template Tests ===");
  console.log(`Sending to: ${TEST_EMAIL}`);

  const results = {
    verify: await testVerifyEmail(),
    magicLink: await testMagicLink(),
    twoFactor: await testTwoFactorCode(),
  };

  console.log("\n=== Summary ===");
  console.log(`Verify Email:  ${results.verify ? "PASS" : "FAIL"}`);
  console.log(`Magic Link:    ${results.magicLink ? "PASS" : "FAIL"}`);
  console.log(`Two-Factor:    ${results.twoFactor ? "PASS" : "FAIL"}`);

  const allPassed = Object.values(results).every(Boolean);
  console.log(`\nOverall: ${allPassed ? "ALL PASSED" : "SOME FAILED"}`);
  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
