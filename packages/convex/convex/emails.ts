import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { requireAuth } from "./lib/requireAuth";
import {
  sendEmail,
  sendAndLogEmail,
  sendTelegramMessage,
  buildContactSubmissionTelegramText,
  CONTACT_TELEGRAM_TYPE_LABELS,
  CONTACT_TELEGRAM_INTEREST_LABELS,
  ADMIN_EMAIL,
} from "./emailCore";

/** Fired when a new submission is stored so Telegram alerts do not depend on the public site calling an action. */
export const notifyContactSubmissionTelegram = internalAction({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    contactType: v.string(),
    interest: v.optional(v.string()),
    message: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    return await sendTelegramMessage(buildContactSubmissionTelegramText(args));
  },
});

/**
 * Send contact form notification to admin
 */
export const sendContactFormNotification = action({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    contactType: v.string(),
    interest: v.optional(v.string()),
    message: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    await requireAuth(_ctx);
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${args.firstName} ${args.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${args.email}">${args.email}</a></td>
            </tr>
            ${args.phone ? `
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;">${args.phone}</td>
            </tr>
            ` : ""}
            ${args.company ? `
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Company:</strong></td>
              <td style="padding: 8px 0;">${args.company}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Type:</strong></td>
              <td style="padding: 8px 0;">${CONTACT_TELEGRAM_TYPE_LABELS[args.contactType] || args.contactType}</td>
            </tr>
            ${args.interest ? `
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Interest:</strong></td>
              <td style="padding: 8px 0;">${CONTACT_TELEGRAM_INTEREST_LABELS[args.interest] || args.interest}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Source:</strong></td>
              <td style="padding: 8px 0;">${args.source || "Website"}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #444;">${args.message.replace(/\n/g, "<br>")}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>This email was sent from the Forhemit website contact form.</p>
          <p>&copy; ${new Date().getFullYear()} Forhemit. All rights reserved.</p>
        </div>
      </div>
    `;

    const text = `
New Contact Form Submission

Contact Information:
-------------------
Name: ${args.firstName} ${args.lastName}
Email: ${args.email}
${args.phone ? `Phone: ${args.phone}\n` : ""}${args.company ? `Company: ${args.company}\n` : ""}Type: ${CONTACT_TELEGRAM_TYPE_LABELS[args.contactType] || args.contactType}
${args.interest ? `Interest: ${CONTACT_TELEGRAM_INTEREST_LABELS[args.interest] || args.interest}\n` : ""}Source: ${args.source || "Website"}

Message:
--------
${args.message}

---
This email was sent from the Forhemit website contact form.
&copy; ${new Date().getFullYear()} Forhemit. All rights reserved.
    `.trim();

    const emailResult = await sendAndLogEmail(_ctx, {
      to: ADMIN_EMAIL,
      subject: `New Contact Form: ${args.firstName} ${args.lastName} - ${CONTACT_TELEGRAM_TYPE_LABELS[args.contactType] || args.contactType}`,
      html,
      text,
      replyTo: args.email,
    }, { templateId: "contact-form" });

    const telegramResult = await sendTelegramMessage(buildContactSubmissionTelegramText(args));

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send infrastructure audit notification to admin
 */
export const sendInfrastructureAuditNotification = action({
  args: {
    lane: v.string(),
    score: v.number(),
    status: v.string(),
    statusLabel: v.string(),
    answers: v.object({
      q1: v.number(),
      q2: v.number(),
      q3: v.number(),
      q4: v.number(),
      q5: v.number(),
    }),
  },
  handler: async (_ctx, args) => {
    await requireAuth(_ctx);
    const laneLabels: Record<string, string> = {
      resilience: "Lane 1: Resilience",
      stewardship: "Lane 2: Stewardship",
      competitive: "Lane 3: Competitive",
    };

    const statusColors: Record<string, string> = {
      optimal: "#2e7d32",
      warning: "#ed6c02",
      critical: "#d32f2f",
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          🏢 New Infrastructure Audit Completed
        </h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Audit Results</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Lane:</strong></td>
              <td style="padding: 8px 0;">${laneLabels[args.lane] || args.lane}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Score:</strong></td>
              <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: ${statusColors[args.status] || "#333"};">${args.score}/100</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
              <td style="padding: 8px 0; color: ${statusColors[args.status] || "#333"}; font-weight: bold;">${args.statusLabel}</td>
            </tr>
          </table>
        </div>
        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Score Breakdown</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Cash Flow (Q1):</strong></td>
              <td style="padding: 8px 0;">${args.answers.q1}/20</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Personnel Grid (Q2):</strong></td>
              <td style="padding: 8px 0;">${args.answers.q2}/20</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Autonomy (Q3):</strong></td>
              <td style="padding: 8px 0;">${args.answers.q3}/20</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Tenure (Q4):</strong></td>
              <td style="padding: 8px 0;">${args.answers.q4}/20</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Documentation (Q5):</strong></td>
              <td style="padding: 8px 0;">${args.answers.q5}/20</td>
            </tr>
          </table>
        </div>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>Sent from the Forhemit Infrastructure Audit.</p>
        </div>
      </div>
    `;

    const textLines = [
      "🏢 New Infrastructure Audit Completed",
      "",
      `Lane: ${laneLabels[args.lane] || args.lane}`,
      `Score: ${args.score}/100`,
      `Status: ${args.statusLabel}`,
      "",
      "Score Breakdown:",
      `- Cash Flow (Q1): ${args.answers.q1}/20`,
      `- Personnel Grid (Q2): ${args.answers.q2}/20`,
      `- Autonomy (Q3): ${args.answers.q3}/20`,
      `- Tenure (Q4): ${args.answers.q4}/20`,
      `- Documentation (Q5): ${args.answers.q5}/20`,
    ].filter(Boolean);

    const emailResult = await sendAndLogEmail(_ctx, {
      to: ADMIN_EMAIL,
      subject: `🏢 Infrastructure Audit: ${laneLabels[args.lane] || args.lane} — ${args.statusLabel} (${args.score}/100)`,
      html,
      text: textLines.join("\n"),
    }, { templateId: "infrastructure-audit" });

    const telegramResult = await sendTelegramMessage(textLines.join("\n"));

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send early access signup notification to admin
 */
export const sendEarlyAccessNotification = action({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    await requireAuth(_ctx);
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          New Early Access Signup
        </h2>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Signup Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${args.email}">${args.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Source:</strong></td>
              <td style="padding: 8px 0;">${args.source || "Website"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
              <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>This email was sent from the Forhemit website early access form.</p>
          <p>&copy; ${new Date().getFullYear()} Forhemit. All rights reserved.</p>
        </div>
      </div>
    `;

    const text = `
New Early Access Signup

Signup Details:
--------------
Email: ${args.email}
Source: ${args.source || "Website"}
Date: ${new Date().toLocaleString()}

---
This email was sent from the Forhemit website early access form.
&copy; ${new Date().getFullYear()} Forhemit. All rights reserved.
    `.trim();

    const emailResult = await sendAndLogEmail(_ctx, {
      to: ADMIN_EMAIL,
      subject: `New Early Access Signup: ${args.email}`,
      html,
      text,
    }, { templateId: "early-access-signup" });

    const telegramText = [
      "📧 New Early Access Signup",
      "",
      `Email: ${args.email}`,
      `Source: ${args.source || "Website"}`,
    ].join("\n");

    const telegramResult = await sendTelegramMessage(telegramText);

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send job application notification to admin
 */
export const sendJobApplicationNotification = action({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    position: v.string(),
    otherPosition: v.optional(v.string()),
    resumeUrl: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    await requireAuth(_ctx);
    const positionDisplay = args.position === "Other" && args.otherPosition
      ? args.otherPosition
      : args.position;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          New Job Application
        </h2>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Applicant Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${args.firstName} ${args.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${args.email}">${args.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;">${args.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Position:</strong></td>
              <td style="padding: 8px 0;">${positionDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
              <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>

        ${args.resumeUrl ? `
        <div style="background: #e8f5e9; border: 1px solid #4caf50; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0; color: #2e7d32;">📎 Resume Attached</h3>
          <a href="${args.resumeUrl}" style="display: inline-block; background: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
            Download Resume
          </a>
        </div>
        ` : `
        <div style="background: #fff3e0; border: 1px solid #ff9800; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #e65100;">⚠️ No Resume Attached</h3>
          <p style="margin-bottom: 0;">The applicant submitted without a resume. You may want to follow up.</p>
        </div>
        `}

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>This email was sent from the Forhemit website job application form.</p>
          <p>&copy; ${new Date().getFullYear()} Forhemit. All rights reserved.</p>
        </div>
      </div>
    `;

    const text = `
New Job Application

Applicant Information:
---------------------
Name: ${args.firstName} ${args.lastName}
Email: ${args.email}
Phone: ${args.phone}
Position: ${positionDisplay}
Date: ${new Date().toLocaleString()}

${args.resumeUrl ? `Resume: ${args.resumeUrl}` : "No resume attached"}

---
This email was sent from the Forhemit website job application form.
&copy; ${new Date().getFullYear()} Forhemit. All rights reserved.
    `.trim();

    const emailResult = await sendAndLogEmail(_ctx, {
      to: ADMIN_EMAIL,
      subject: `New Job Application: ${positionDisplay} - ${args.firstName} ${args.lastName}`,
      html,
      text,
      replyTo: args.email,
    }, { templateId: "job-application" });

    const telegramText = [
      "📋 New Job Application",
      "",
      `Name: ${args.firstName} ${args.lastName}`,
      `Email: ${args.email}`,
      `Phone: ${args.phone}`,
      `Position: ${positionDisplay}`,
      args.resumeUrl ? `Resume: ${args.resumeUrl}` : "No resume attached",
    ].join("\n");

    const telegramResult = await sendTelegramMessage(telegramText);

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send confidential intake notification to admin (business owners intake form)
 */
export const sendConfidentialIntakeNotification = action({
  args: {
    path: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.optional(v.string()),
    bizName: v.optional(v.string()),
    state: v.optional(v.string()),
    industry: v.optional(v.string()),
    employees: v.optional(v.string()),
    years: v.optional(v.string()),
    ebitda: v.optional(v.string()),
    entity: v.optional(v.string()),
    timeline: v.optional(v.string()),
    notes: v.optional(v.string()),
    ndaSigned: v.optional(v.boolean()),
  },
  handler: async (_ctx, args) => {
    await requireAuth(_ctx);
    const roleLabels: Record<string, string> = {
      "owner-sole": "Sole Owner",
      "owner-partner": "Partner / Co-owner",
      "advisor": "Advisor acting on behalf of owner",
    };

    const timelineLabels: Record<string, string> = {
      asap: "As soon as possible",
      "1yr": "Within 12 months",
      "2yr": "1–3 years out",
      exploring: "Just exploring",
    };

    const isNda = args.path === "nda";
    const pathLabel = isNda ? "Confidential (NDA Signed)" : "Light Intake (No NDA)";

    const detailRows = [
      { label: "Business Name", value: args.bizName },
      { label: "State", value: args.state },
      { label: "Industry", value: args.industry },
      { label: "Employees", value: args.employees },
      { label: "Years in Operation", value: args.years },
      { label: "EBITDA Range", value: args.ebitda },
      { label: "Entity Type", value: args.entity },
      { label: "Timeline", value: args.timeline ? (timelineLabels[args.timeline] || args.timeline) : undefined },
    ].filter((r): r is { label: string; value: string } => !!r.value);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          ${isNda ? "🔒" : "📋"} New Business Owner Intake — ${pathLabel}
        </h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${args.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${args.email}">${args.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;">${args.phone}</td>
            </tr>
            ${args.role ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Role:</strong></td><td style="padding: 8px 0;">${roleLabels[args.role] || args.role}</td></tr>` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Intake Path:</strong></td>
              <td style="padding: 8px 0;">${pathLabel}</td>
            </tr>
            ${isNda ? `<tr><td style="padding: 8px 0; color: #666;"><strong>NDA Status:</strong></td><td style="padding: 8px 0; color: #2e7d32; font-weight: bold;">✅ Signed</td></tr>` : ""}
          </table>
        </div>
        ${detailRows.length > 0 ? `
        <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Business Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${detailRows.map((r) => `<tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>${r.label}:</strong></td><td style="padding: 8px 0;">${r.value}</td></tr>`).join("")}
          </table>
        </div>` : ""}
        ${args.notes ? `
        <div style="background: #fffbe6; border: 1px solid #ffd700; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Additional Notes</h3>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #444; margin-bottom: 0;">${args.notes.replace(/\n/g, "<br>")}</p>
        </div>` : ""}
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>This was sent from the Forhemit Business Owners intake form.</p>
          <p>&copy; ${new Date().getFullYear()} Forhemit. All rights reserved.</p>
        </div>
      </div>
    `;

    const textLines = [
      `${isNda ? "🔒" : "📋"} New Business Owner Intake — ${pathLabel}`,
      "",
      `Name: ${args.name}`,
      `Email: ${args.email}`,
      `Phone: ${args.phone}`,
      args.role ? `Role: ${roleLabels[args.role] || args.role}` : "",
      isNda ? "NDA: Signed" : "",
      "",
      ...detailRows.map((r) => `${r.label}: ${r.value}`),
      args.notes ? `\nNotes:\n${args.notes}` : "",
    ].filter(Boolean);

    const emailResult = await sendAndLogEmail(_ctx, {
      to: ADMIN_EMAIL,
      subject: `${isNda ? "🔒" : "📋"} Business Owner Intake: ${args.name} — ${args.bizName || "Unknown Business"}`,
      html,
      text: textLines.join("\n"),
      replyTo: args.email,
    }, { templateId: "confidential-intake" });

    const telegramLines = [
      `${isNda ? "🔒" : "📋"} New Business Owner Intake`,
      "",
      `Path: ${pathLabel}`,
      `Name: ${args.name}`,
      `Email: ${args.email}`,
      `Phone: ${args.phone}`,
      args.role ? `Role: ${roleLabels[args.role] || args.role}` : "",
      args.bizName ? `Business: ${args.bizName}` : "",
      args.industry ? `Industry: ${args.industry}` : "",
      args.employees ? `Employees: ${args.employees}` : "",
      args.ebitda ? `EBITDA: ${args.ebitda}` : "",
      args.timeline ? `Timeline: ${timelineLabels[args.timeline] || args.timeline}` : "",
      isNda ? "NDA: ✅ Signed" : "",
      args.notes ? `\nNotes: ${args.notes}` : "",
    ].filter(Boolean);

    const telegramResult = await sendTelegramMessage(telegramLines.join("\n"));

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send classification intake notification to admin (home page intake flow)
 */
export const sendClassificationIntakeNotification = action({
  args: {
    role: v.string(),
    answers: v.string(),
    clientType: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    await requireAuth(_ctx);
    const roleLabels: Record<string, string> = {
      owner: "Business Owner",
      broker: "Broker",
      advisor: "Advisor / CPA / Attorney",
      lender: "Lender",
    };

    let parsed: Record<string, unknown> = {};
    try { parsed = JSON.parse(args.answers); } catch { /* empty */ }

    const answerRows = Object.entries(parsed)
      .filter(([k]) => k !== "role")
      .map(([k, val]) => {
        const label = k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
        const display = Array.isArray(val) ? val.join(", ") : String(val);
        return { label, value: display };
      });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F0562E; border-bottom: 2px solid #F0562E; padding-bottom: 10px;">
          🎯 New Classification Intake
        </h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Role:</strong></td>
              <td style="padding: 8px 0;">${roleLabels[args.role] || args.role}</td>
            </tr>
            ${args.clientType ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Client Type:</strong></td><td style="padding: 8px 0;">${args.clientType}</td></tr>` : ""}
            ${answerRows.map((r) => `<tr><td style="padding: 8px 0; color: #666;"><strong>${r.label}:</strong></td><td style="padding: 8px 0;">${r.value}</td></tr>`).join("")}
          </table>
        </div>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>Sent from the Forhemit classification intake flow.</p>
        </div>
      </div>
    `;

    const textLines = [
      "🎯 New Classification Intake",
      "",
      `Role: ${roleLabels[args.role] || args.role}`,
      args.clientType ? `Client Type: ${args.clientType}` : "",
      ...answerRows.map((r) => `${r.label}: ${r.value}`),
    ].filter(Boolean);

    const emailResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `🎯 Classification Intake: ${roleLabels[args.role] || args.role}${args.clientType ? ` — ${args.clientType}` : ""}`,
      html,
      text: textLines.join("\n"),
    });

    const telegramResult = await sendTelegramMessage(textLines.join("\n"));

    return {
      success: emailResult.success || telegramResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send an email with attachments — public wrapper for sendAndLogEmail.
 * Used by templateGenerator for PDF attachment delivery.
 */
export const sendWithAttachment = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.optional(v.string()),
    from: v.optional(v.string()),
    replyTo: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          filename: v.string(),
          content: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const result = await sendAndLogEmail(ctx, {
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      from: args.from,
      replyTo: args.replyTo,
      attachments: args.attachments,
    });

    return {
      success: result.success,
      id: result.id,
      error: result.error,
    };
  },
});

/**
 * Send an email with template metadata — used by templateGenerator.
 * Wraps sendAndLogEmail with templateVersion tracking.
 */
export const sendTemplateEmailAction = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.optional(v.string()),
    from: v.optional(v.string()),
    replyTo: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          filename: v.string(),
          content: v.string(),
        })
      )
    ),
    templateId: v.optional(v.string()),
    templateVersion: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const result = await sendAndLogEmail(ctx, {
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      from: args.from,
      replyTo: args.replyTo,
      attachments: args.attachments,
    }, {
      templateId: args.templateId,
      templateVersion: args.templateVersion,
    });

    return {
      success: result.success,
      id: result.id,
      error: result.error,
    };
  },
});
