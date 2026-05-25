import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { api } from "./_generated/api";

// ============================================
// Priority levels
// ============================================

const PRIORITY_EMOJI: Record<string, string> = {
  URGENT: "🔴",
  HIGH: "🟠",
  MEDIUM: "🟡",
  LOW: "🟢",
};

const PRIORITY_LABEL: Record<string, string> = {
  URGENT: "URGENT",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
};

// ============================================
// Send Telegram notification with priority
// ============================================

export const notifyTelegram = action({
  args: {
    priority: v.union(
      v.literal("URGENT"),
      v.literal("HIGH"),
      v.literal("MEDIUM"),
      v.literal("LOW")
    ),
    title: v.string(),
    body: v.string(),
    link: v.optional(v.string()),
    linkText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram not configured");
      return { success: false, error: "Telegram not configured" };
    }

    const emoji = PRIORITY_EMOJI[args.priority];
    const label = PRIORITY_LABEL[args.priority];

    // Build message
    let message = `${emoji} **[${label}]** ${args.title}\n\n${args.body}`;

    if (args.link) {
      message += `\n\n🔗 [${args.linkText || "View"}](${args.link})`;
    }

    // Send via Telegram Bot API
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Telegram API error:", error);
      return { success: false, error };
    }

    return { success: true };
  },
});

// ============================================
// Notify inbound email — with sender matching
// ============================================

export const notifyInboundEmail = action({
  args: {
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    preview: v.string(),
    relatedCompanyId: v.optional(v.string()),
    relatedContactId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Determine priority based on sender
    let priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";

    if (args.relatedContactId) {
      // Known contact = URGENT
      priority = "URGENT";
    } else if (args.to.includes("intake") || args.to.includes("nda")) {
      // Intake/NDA inbox = HIGH
      priority = "HIGH";
    }

    // Build Telegram message
    const inboxLabel = args.to.split("@")[0].toUpperCase();
    const body = [
      `📬 **${inboxLabel} Inbox**`,
      ``,
      `**From:** ${args.from}`,
      `**Subject:** ${args.subject}`,
      ``,
      args.preview,
    ].join("\n");

    await ctx.runAction(api.notifications.notifyTelegram, {
      priority,
      title: `Inbound Email — ${inboxLabel}`,
      body,
    });

    return { success: true, priority };
  },
});

// ============================================
// Notify deal activity (stage change, doc signed, etc.)
// ============================================

export const notifyDealActivity = action({
  args: {
    companyId: v.string(),
    companyName: v.string(),
    activity: v.string(),
    details: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("URGENT"),
      v.literal("HIGH"),
      v.literal("MEDIUM"),
      v.literal("LOW")
    )),
  },
  handler: async (ctx, args) => {
    const priority = args.priority || "HIGH";

    const body = [
      `🏢 **${args.companyName}**`,
      ``,
      args.activity,
      args.details ? `\n${args.details}` : "",
    ].join("\n");

    await ctx.runAction(api.notifications.notifyTelegram, {
      priority,
      title: "Deal Activity",
      body,
    });

    return { success: true };
  },
});

// ============================================
// Notify task overdue
// ============================================

export const notifyTaskOverdue = action({
  args: {
    companyName: v.string(),
    taskTitle: v.string(),
    dueDate: v.number(),
    contactName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const daysOverdue = Math.floor((Date.now() - args.dueDate) / (24 * 60 * 60 * 1000));

    const body = [
      `⏰ **Overdue Task**`,
      ``,
      `**Task:** ${args.taskTitle}`,
      `**Company:** ${args.companyName}`,
      args.contactName ? `**Contact:** ${args.contactName}` : "",
      `**Days overdue:** ${daysOverdue}`,
    ].filter(Boolean).join("\n");

    await ctx.runAction(api.notifications.notifyTelegram, {
      priority: daysOverdue > 7 ? "URGENT" : "HIGH",
      title: "Overdue Task",
      body,
    });

    return { success: true };
  },
});

// ============================================
// Daily deal digest
// ============================================

export const sendDailyDigest = action({
  args: {},
  handler: async (ctx) => {
    // This would be called by a cron job
    // For now, just send a placeholder
    await ctx.runAction(api.notifications.notifyTelegram, {
      priority: "LOW",
      title: "Daily Digest",
      body: "Daily deal activity digest — to be implemented with dashboard queries.",
    });

    return { success: true };
  },
});

// ============================================
// Notify Slack
// ============================================

export const notifySlack = action({
  args: {
    channel: v.union(
      v.literal("email-inbound"),
      v.literal("email-outbound"),
      v.literal("deal-activity"),
      v.literal("email-errors")
    ),
    message: v.string(),
    blocks: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn("Slack not configured — SLACK_WEBHOOK_URL missing");
      return { success: false, error: "Slack not configured" };
    }

    // Build Slack message with Block Kit if provided
    const payload: any = {
      channel: `#${args.channel}`,
      text: args.message,
    };

    if (args.blocks) {
      payload.blocks = args.blocks;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Slack API error:", error);
      return { success: false, error };
    }

    return { success: true };
  },
});

// ============================================
// Notify Slack — inbound email
// ============================================

export const notifySlackInboundEmail = action({
  args: {
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    preview: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    const blocks = [
      {
        type: "header",
        text: { type: "plain_text", text: "📬 Inbound Email" },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*From:*\n${args.from}` },
          { type: "mrkdwn", text: `*To:*\n${args.to}` },
        ],
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Subject:* ${args.subject}` },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: args.preview },
      },
      { type: "divider" },
    ];

    return await ctx.runAction(api.notifications.notifySlack, {
      channel: "email-inbound",
      message: `Inbound email from ${args.from}: ${args.subject}`,
      blocks,
    });
  },
});

// ============================================
// Notify Slack — outbound email
// ============================================

export const notifySlackOutboundEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    templateId: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    const blocks = [
      {
        type: "header",
        text: { type: "plain_text", text: "📤 Outbound Email" },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*To:*\n${args.to}` },
          { type: "mrkdwn", text: `*Status:*\n${args.status}` },
        ],
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Subject:* ${args.subject}` },
      },
      { type: "divider" },
    ];

    return await ctx.runAction(api.notifications.notifySlack, {
      channel: "email-outbound",
      message: `Outbound email to ${args.to}: ${args.subject}`,
      blocks,
    });
  },
});

// ============================================
// Notify Slack — deal activity
// ============================================

export const notifySlackDealActivity = action({
  args: {
    companyName: v.string(),
    activity: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    const blocks: Array<Record<string, unknown>> = [
      {
        type: "header",
        text: { type: "plain_text", text: "🏢 Deal Activity" },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*${args.companyName}*\n${args.activity}` },
      },
    ];

    if (args.details) {
      blocks.push({
        type: "section",
        text: { type: "mrkdwn", text: args.details },
      });
    }

    blocks.push({ type: "divider" } as { type: string; text?: { type: string; text: string } });

    return await ctx.runAction(api.notifications.notifySlack, {
      channel: "deal-activity",
      message: `${args.companyName}: ${args.activity}`,
      blocks,
    });
  },
});

// ============================================
// Notify Slack — email error
// ============================================

export const notifySlackEmailError = action({
  args: {
    error: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    const blocks = [
      {
        type: "header",
        text: { type: "plain_text", text: "⚠️ Email Error" },
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: args.error },
      },
      { type: "divider" },
    ];

    return await ctx.runAction(api.notifications.notifySlack, {
      channel: "email-errors",
      message: `Email error: ${args.error}`,
      blocks,
    });
  },
});
