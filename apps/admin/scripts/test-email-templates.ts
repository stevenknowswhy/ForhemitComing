/**
 * Test script for auth email templates
 * Run: npx tsx scripts/test-email-templates.ts
 */

import { Resend } from "resend";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../.env.local") });

const resend = new Resend(process.env.RESEND_API_KEY!);

const TEST_EMAIL = process.env.TEST_EMAIL || "stefanostokes86@gmail.com";
const FROM_EMAIL = process.env.AGENT_EMAIL || "agent@email.forhemit.com";

// Brand colors — aligned with logo system v2
const BRAND = {
  brass: "#B8965A",
  ink: "#1A1714",
  parchment: "#F7F4EE",
  stone: "#8A7E6E",
  textBody: "#3d3832",
  textGray: "#6b6560",
  lightGray: "#f5f3ee",
  borderGray: "#e0dbd2",
  white: "#ffffff",
};

function emailLayout(title: string, content: string, transactional = true): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 0; background-color: ${BRAND.lightGray};">
      <div style="font-family: 'Jost', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${BRAND.white}; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header: Icon mark + Wordmark -->
          <div style="background: ${BRAND.ink}; padding: 20px 30px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width: 44px; vertical-align: middle;">
                  <div style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid ${BRAND.brass}; text-align: center; line-height: 40px;">
                    <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 300; color: ${BRAND.parchment};">F</span>
                    <div style="width: 4px; height: 4px; border-radius: 50%; background: ${BRAND.brass}; margin: 0 auto; position: relative; top: -2px;"></div>
                  </div>
                </td>
                <td style="width: 1px; padding: 0 16px;">
                  <div style="width: 1px; height: 32px; background: #3a342a;"></div>
                </td>
                <td style="vertical-align: middle;">
                  <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 300; letter-spacing: 4px; color: ${BRAND.parchment};">FORHEMIT</div>
                  <div style="font-family: 'Jost', Arial, sans-serif; font-size: 6px; font-weight: 400; letter-spacing: 3px; color: ${BRAND.brass}; margin-top: 2px;">TRANSITION STEWARDSHIP</div>
                </td>
              </tr>
            </table>
          </div>
          <!-- Title bar -->
          <div style="background: ${BRAND.parchment}; padding: 16px 30px; border-bottom: 1px solid ${BRAND.borderGray};">
            <h1 style="color: ${BRAND.ink}; margin: 0; font-size: 18px; font-weight: 500; font-family: 'Jost', Arial, sans-serif; letter-spacing: 0.5px;">${title}</h1>
          </div>
          <div style="padding: 30px;">${content}</div>
          <!-- Footer -->
          <div style="background: ${BRAND.parchment}; padding: 20px 30px; border-top: 1px solid ${BRAND.borderGray};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 11px; color: ${BRAND.stone}; line-height: 1.6;">
              <tr><td style="text-align: center; padding-bottom: 4px;">Forhemit Stewardship Management Co. &middot; California Public Benefit Corporation &nbsp;&middot;&nbsp; <a href="https://forhemit.com" style="color: ${BRAND.brass}; text-decoration: none; font-weight: 500;">forhemit.com</a> &nbsp;&middot;&nbsp; 548 Market St, Suite 36451, San Francisco, CA 94104</td></tr>
              <tr><td style="text-align: center; font-size: 10px; color: #b0a99a;">&copy; 2026 Forhemit Stewardship Management Co. All rights reserved. &nbsp;&middot;&nbsp; <a href="https://forhemit.com/privacy" style="color: ${BRAND.stone}; text-decoration: underline;">Privacy</a> &nbsp;&middot;&nbsp; <a href="https://forhemit.com/terms" style="color: ${BRAND.stone}; text-decoration: underline;">Terms</a>${transactional ? "" : ` &nbsp;&middot;&nbsp; <a href="{{unsubscribe_url}}" style="color: ${BRAND.stone}; text-decoration: underline;">Unsubscribe</a>`}</td></tr>
            </table>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function ctaButton(text: string, url: string): string {
  return `<a href="${url}" style="display: inline-block; background: ${BRAND.brass}; color: ${BRAND.white}; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; margin: 20px 0; font-family: 'Jost', Arial, sans-serif; letter-spacing: 0.5px;">${text}</a>`;
}

function codeBlock(code: string): string {
  return `<div style="background: ${BRAND.ink}; color: ${BRAND.parchment}; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; letter-spacing: 8px; font-size: 32px; font-weight: bold; font-family: 'DM Mono', 'Courier New', monospace;">${code}</div>`;
}

async function sendEmail(subject: string, html: string, text: string) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [TEST_EMAIL],
    subject,
    html,
    text,
  });

  if (error) {
    console.error("  ❌ Error:", error.message);
    return false;
  }

  console.log("  ✅ Sent, ID:", data?.id);
  return true;
}

async function testVerifyEmail() {
  console.log("\n📧 Testing verify-email template...");
  const verifyUrl = "https://admin.forhemit.com/verify?token=test-token-abc123";
  const html = emailLayout("Verify Your Email", `
    <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">Hi Test,</p>
    <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">Thanks for signing up with Forhemit. Please verify your email address to activate your account.</p>
    <div style="text-align: center; margin: 30px 0;">${ctaButton("Verify Email Address", verifyUrl)}</div>
    <p style="color: ${BRAND.textGray}; font-size: 13px; line-height: 1.5;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
  `);
  const text = `Hi Test,\n\nThanks for signing up with Forhemit. Please verify your email address:\n\n${verifyUrl}\n\nThis link expires in 24 hours.`;
  return sendEmail("Verify your email — Forhemit", html, text);
}

async function testMagicLink() {
  console.log("\n📧 Testing magic-link template...");
  const loginUrl = "https://admin.forhemit.com/auth/magic-link?token=test-magic-link-xyz789";
  const html = emailLayout("Your Login Link", `
    <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">Hi Test,</p>
    <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">Click the button below to sign in to your Forhemit account. No password needed.</p>
    <div style="text-align: center; margin: 30px 0;">${ctaButton("Sign In to Forhemit", loginUrl)}</div>
    <p style="color: ${BRAND.textGray}; font-size: 13px; line-height: 1.5;">This link expires in 15 minutes and can only be used once. If you didn't request this, you can safely ignore this email.</p>
  `);
  const text = `Hi Test,\n\nClick the link below to sign in to your Forhemit account:\n\n${loginUrl}\n\nThis link expires in 15 minutes.`;
  return sendEmail("Your login link — Forhemit", html, text);
}

async function testTwoFactorCode() {
  console.log("\n📧 Testing two-factor-code template...");
  const code = "482916";
  const html = emailLayout("Your Verification Code", `
    <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">Hi Test,</p>
    <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">Enter this code to complete your sign-in:</p>
    ${codeBlock(code)}
    <p style="color: ${BRAND.textGray}; font-size: 13px; line-height: 1.5; text-align: center;">This code expires in 5 minutes. Never share it with anyone.</p>
  `);
  const text = `Hi Test,\n\nYour Forhemit verification code is:\n\n${code}\n\nThis code expires in 5 minutes. Never share it with anyone.`;
  return sendEmail(`Your verification code: ${code} — Forhemit`, html, text);
}

async function main() {
  console.log("🧪 Forhemit Auth Email Template Tests");
  console.log("=====================================");
  console.log(`Sending to: ${TEST_EMAIL}`);

  const results = {
    verify: await testVerifyEmail(),
    magicLink: await testMagicLink(),
    twoFactor: await testTwoFactorCode(),
  };

  console.log("\n📊 Summary");
  console.log("==========");
  console.log(`verify-email:     ${results.verify ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`magic-link:       ${results.magicLink ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`two-factor-code:  ${results.twoFactor ? "✅ PASS" : "❌ FAIL"}`);

  const allPassed = Object.values(results).every(Boolean);
  console.log(`\n${allPassed ? "✅ All tests passed!" : "❌ Some tests failed"}`);

  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);
