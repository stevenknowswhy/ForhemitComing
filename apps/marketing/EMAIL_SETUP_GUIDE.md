# 📧 Email Integration Setup Guide

## ✅ What's Been Implemented

### 1. Convex Email Actions (`convex/emails.ts`)
Notification actions have been created:

- **`sendContactFormNotification`** - Sends contact submissions to email **and Telegram** when configured
- **`sendEarlyAccessNotification`** - Sends email when someone signs up for early access
- **`sendJobApplicationNotification`** - Sends email when someone applies for a job

All emails are sent to: **stefano.stokes@forhemit.com**

### 2. Updated Form Components
The following forms now call email actions after successful database submission:

- `app/components/modals/ContactModal.tsx` - Contact form
- `app/components/forms/EarlyAccessForm.tsx` - Early access signup
- `app/components/forms/application/ApplicationModal.tsx` - Job application

### 3. Environment Variables
Added to `.env.local.example` and `.env.local`:
```bash
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=contact@forhemit.com
ADMIN_EMAIL=stefano.stokes@forhemit.com
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

---

## 🚀 Steps to Complete Setup

### Step 1: Sign Up for Resend
1. Go to https://resend.com
2. Sign up with your **stefano.stokes@forhemit.com** email
3. Verify your email address

### Step 2: Add Your Domain
1. In Resend dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter: `forhemit.com`
4. You'll see DNS records to add in Namecheap:
   - Type: `TXT`, Host: `_dmarc`, Value: (provided by Resend)
   - Type: `TXT`, Host: `resend._domainkey`, Value: (provided by Resend)
   - Type: `MX`, Host: `@`, Value: `feedback-smtp.us-east-1.amazonses.com`

### Step 3: Add DNS Records in Namecheap
1. Log into your Namecheap account
2. Go to Domain List → Manage for `forhemit.com`
3. Go to **Advanced DNS** tab
4. Add the DNS records provided by Resend
5. Wait 5-10 minutes for DNS propagation
6. In Resend, click **"Verify Domain"**

### Step 4: Get Your API Key
1. In Resend dashboard, go to **"API Keys"**
2. Click **"Create API Key"**
3. Name: `Forhemit Production`
4. Permission: `Sending access`
5. Copy the API key (starts with `re_`)

### Step 5: Configure Environment Variables

#### Local Development (`.env.local`)
```bash
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=contact@forhemit.com
ADMIN_EMAIL=stefano.stokes@forhemit.com
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_numeric_chat_id
```

#### Convex Dashboard (for production)
1. Go to https://dashboard.convex.dev
2. Select your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Add:
   - `RESEND_API_KEY` = your actual API key
   - `FROM_EMAIL` = `contact@forhemit.com`
   - `ADMIN_EMAIL` = `stefano.stokes@forhemit.com`
   - `TELEGRAM_BOT_TOKEN` = your Telegram bot token
   - `TELEGRAM_CHAT_ID` = destination chat/channel ID

### Step 5b: Telegram Bot Setup (for contact alerts)
1. In Telegram, message [@BotFather](https://t.me/BotFather) and create a bot.
2. Copy the bot token and set `TELEGRAM_BOT_TOKEN`.
3. Add the bot to the destination chat (group or channel).
4. Send at least one message in that chat.
5. Get the chat ID from:
   - `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
6. Set `TELEGRAM_CHAT_ID` to that numeric ID.

### Step 6: Redeploy
```bash
npx convex dev  # For local development
# or
npx convex deploy  # For production
```

---

## 📋 Testing

Once setup is complete, test each form:

### 1. Contact Form
1. Go to any page with a "Contact" button
2. Fill out the form
3. Check that you receive an email at stefano.stokes@forhemit.com
4. Check the Telegram destination receives the same message

### 2. Early Access Form
1. Go to the homepage
2. Enter an email in the early access form
3. Check that you receive an email notification

### 3. Job Application
1. Go to the careers/join page
2. Fill out a job application
3. Check that you receive an email with resume link

---

## 📧 Email Format

Each email notification includes:
- **Professional HTML formatting** with Forhemit branding
- **Plain text fallback** for compatibility
- **Reply-to header** set to the submitter's email (for contact forms)
- **Full form data** including all fields submitted

---

## 🔧 Troubleshooting

### Emails not sending?
1. Check that `RESEND_API_KEY` is set in Convex dashboard
2. Verify your domain is verified in Resend
3. Check Convex logs for errors: `npx convex logs`

### Domain verification failing?
1. Double-check DNS records in Namecheap match exactly
2. Wait longer for DNS propagation (can take up to 24 hours)
3. Try using Resend's test mode with their default domain first

### Want to test without domain verification?
Resend allows sending to your own email during testing without domain verification. Add your email as a test recipient in Resend dashboard.

---

## 📞 Need Help?

- Resend Docs: https://resend.com/docs
- Convex Docs: https://docs.convex.dev
- Resend Support: support@resend.com
