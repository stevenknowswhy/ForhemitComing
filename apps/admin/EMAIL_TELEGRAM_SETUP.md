# 📧 Email & Telegram Integration

This document describes the email and Telegram notification system shared between Forhemit codebases.

## Overview

The admin website now includes the same email (Resend) and Telegram notification functionality as the main website. This allows both applications to send notifications when forms are submitted or important events occur.

## Files Added

### 1. `convex/emails.ts`
Main Convex actions for sending email and Telegram notifications:

| Action | Purpose |
|--------|---------|
| `sendContactFormNotification` | Sends contact form submissions to admin |
| `sendInfrastructureAuditNotification` | Sends infrastructure audit results |
| `sendEarlyAccessNotification` | Sends early access signup alerts |
| `sendJobApplicationNotification` | Sends job application alerts with resume links |
| `sendConfidentialIntakeNotification` | Sends business owner intake form submissions |
| `sendClassificationIntakeNotification` | Sends classification intake form data |

### 2. `scripts/test-notifications.ts`
Test script to verify email and Telegram configuration:

```bash
# Run the test
npx tsx scripts/test-notifications.ts

# Or with a custom message
npx tsx scripts/test-notifications.ts "Custom test message"
```

## Environment Variables

Add these to your `.env.local` file:

```bash
# =====================================
# Email Configuration (Resend)
# =====================================
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=contact@forhemit.com
ADMIN_EMAIL=stefano.stokes@forhemit.com

# =====================================
# Telegram Notifications
# =====================================
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## Setup Instructions

### 1. Resend Email Setup

1. Sign up at https://resend.com with your admin email
2. Add and verify your domain (`forhemit.com`)
3. Create an API key with "Sending access" permission
4. Add the API key to your environment variables

### 2. Telegram Bot Setup

1. In Telegram, message [@BotFather](https://t.me/BotFather)
2. Create a new bot with `/newbot` command
3. Copy the bot token provided
4. Add the bot to your destination chat (group or channel)
5. Send a message in that chat
6. Get the chat ID by visiting:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
7. Add both the bot token and chat ID to your environment variables

### 3. Convex Environment Variables

For production, add the environment variables to your Convex dashboard:

```bash
npx convex env set RESEND_API_KEY re_your_actual_key
npx convex env set FROM_EMAIL contact@forhemit.com
npx convex env set ADMIN_EMAIL stefano.stokes@forhemit.com
npx convex env set TELEGRAM_BOT_TOKEN your_bot_token
npx convex env set TELEGRAM_CHAT_ID your_chat_id
```

## Usage Examples

### Using from a React Component

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function MyForm() {
  const sendNotification = useMutation(api.emails.sendContactFormNotification);

  const handleSubmit = async (formData) => {
    // First save to database...
    
    // Then send notification
    await sendNotification({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      contactType: "business-owner",
      interest: "esop-transition",
      message: formData.message,
      source: "admin-website"
    });
  };
}
```

### Using from Another Convex Function

```typescript
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const myAction = action({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    // Do something...
    
    // Send notification
    await ctx.runAction(api.emails.sendEarlyAccessNotification, {
      email: args.email,
      source: "admin-portal"
    });
  }
});
```

## Testing

Run the test script to verify everything is working:

```bash
npx tsx scripts/test-notifications.ts
```

You should see:
- Configuration check (which env vars are set)
- Email sending status
- Telegram sending status
- Results summary

## Troubleshooting

### Emails not sending?
- Check that `RESEND_API_KEY` is set in Convex dashboard
- Verify your domain is verified in Resend
- Check Convex logs: `npx convex logs`

### Telegram not working?
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Make sure `TELEGRAM_CHAT_ID` is the numeric ID (not the @username)
- Ensure the bot is a member of the chat

### Test script errors?
- Install dependencies: `npm install -D tsx dotenv`
- Ensure `.env.local` exists with the required variables

## Shared Codebase

This email/Telegram implementation is shared between:
- **Main website**: `/Users/stephenstokes/Desktop/ForhemitComingSoon`
- **Admin website**: `/Users/stephenstokes/Desktop/ForhemitAdminWebsite`

When updating one, consider updating the other to keep them in sync.
