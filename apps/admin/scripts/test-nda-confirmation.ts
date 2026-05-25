/**
 * Test: Generate NDA Receipt Confirmation PDF and send via Resend
 *
 * Usage: npx tsx scripts/test-nda-confirmation.ts
 *
 * Requires RESEND_API_KEY in root .env.local
 */

import * as fs from "fs";
import * as path from "path";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { config } from "dotenv";

// Load env from admin .env.local
config({ path: path.resolve(__dirname, "../.env.local") });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "agent@email.forhemit.com";
const TO_EMAIL = "stefano.stokes@forhemit.com";

// ── Mock data ──
const mockData = {
  recipientName: "James Mitchell",
  recipientTitle: "Managing Member",
  company: "Mitchell Precision Manufacturing, LLC",
  ndaType: "Mutual Non-Disclosure Agreement",
  ndaSignedDate: "May 22, 2026",
  sentDate: "May 24, 2026",
  ref: "FHH-NDA-0001",
  generatedDate: "May 24, 2026",
};

async function main() {
  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY in .env.local");
    process.exit(1);
  }

  // 1. Read template
  const templatePath = path.resolve(
    process.env.HOME || "/Users/stephenstokes",
    "Downloads/nda-receipt-confirmation.html"
  );
  let html = fs.readFileSync(templatePath, "utf-8");

  // 2. Replace placeholders
  for (const [key, value] of Object.entries(mockData)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  console.log("Template loaded and populated with mock data");

  // 3. Generate PDF with Puppeteer
  console.log("Launching browser...");
  const isProduction = process.env.VERCEL === "1";

  let browser;
  if (isProduction) {
    browser = await puppeteer.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    const macChromePath =
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: macChromePath,
      headless: true,
    });
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });

  await page.setContent(html, {
    waitUntil: ["networkidle0", "domcontentloaded"],
  });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 500));

  console.log("Generating PDF...");
  const pdf = await page.pdf({
    format: "Letter",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await browser.close();

  const pdfBase64 = Buffer.from(pdf).toString("base64");
  console.log(`PDF generated: ${(pdf.length / 1024).toFixed(1)} KB`);

  // 4. Send via Resend
  console.log(`Sending to ${TO_EMAIL}...`);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `NDA Receipt Confirmation — ${mockData.company} — ${mockData.ref}`,
      html: `
        <div style="font-family: Jost, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p style="font-size: 15px; line-height: 1.6; color: #333;">
            Dear ${mockData.recipientName},
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #444;">
            Thank you for executing the ${mockData.ndaType}. Please find attached your official receipt confirmation from Forhemit Transition Stewardship.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #444;">
            With the NDA in place, we can now share confidential transaction materials. You will receive a follow-up within 2 business days outlining next steps.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0;">
              Best regards,<br><br>
              <strong>Forhemit Transition Stewardship</strong><br>
              deals@forhemit.com<br>
              forhemit.com
            </p>
          </div>
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center;">
            <p>Forhemit Stewardship Management Co. · California Public Benefit Corporation</p>
            <p>548 Market St, Suite 36451, San Francisco, CA 94104</p>
          </div>
        </div>
      `,
      text: `Dear ${mockData.recipientName},\n\nThank you for executing the ${mockData.ndaType}. Please find attached your official receipt confirmation.\n\nWith the NDA in place, we can now share confidential transaction materials. You will receive a follow-up within 2 business days.\n\nBest regards,\nForhemit Transition Stewardship\ndeals@forhemit.com\nforhemit.com`,
      attachments: [
        {
          filename: `Forhemit-NDA-Confirmation-${mockData.ref}.pdf`,
          content: pdfBase64,
        },
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Resend error:", data);
    process.exit(1);
  }

  console.log(`Email sent! Resend ID: ${data.id}`);
  console.log(`Subject: NDA Receipt Confirmation — ${mockData.company} — ${mockData.ref}`);
  console.log(`Attachment: Forhemit-NDA-Confirmation-${mockData.ref}.pdf`);
}

main().catch(console.error);
