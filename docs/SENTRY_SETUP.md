# Sentry Setup Guide

This guide walks through configuring [Sentry](https://sentry.io) for the Forhemit admin app (`apps/admin`). The code integration (`@sentry/nextjs@^10.43.0`) is already installed and configured — this document covers the **project-level setup** required to activate it.

---

## Table of Contents

1. [Create a Sentry Project](#1-create-a-sentry-project)
2. [Get the DSN](#2-get-the-dsn)
3. [Create an Auth Token](#3-create-an-auth-token)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Add to Vercel Environment Variables](#5-add-to-vercel-environment-variables)
6. [Add to GitHub Repository Secrets](#6-add-to-github-repository-secrets)
7. [Configure Sentry Webpack Plugin](#7-configure-sentry-webpack-plugin)
8. [Update Content Security Policy](#8-update-content-security-policy)
9. [Add `instrumentation.ts`](#9-add-instrumentationts)
10. [Configure Alert Rules](#10-configure-alert-rules)
11. [Verify the Setup](#11-verify-the-setup)
12. [Existing Configuration Reference](#12-existing-configuration-reference)

---

## 1. Create a Sentry Project

1. Go to [sentry.io](https://sentry.io) and sign in (or create an account).
2. Navigate to **Settings → Projects → Create Project**.
3. Select **Next.js** as the platform.
4. Set the project name to `forhemit-admin` (or your preferred name).
5. Set the alert frequency to **Issue Alert: on every new issue** (you can customize later).
6. Assign the project to your organization (create one if needed, e.g., `forhemit`).
7. Click **Create Project**.

---

## 2. Get the DSN

After creating the project:

1. Go to **Project Settings → Client Keys (DSN)**.
2. Copy the DSN. It looks like:
   ```
   https://abc123@o123456.ingest.us.sentry.io/7890123
   ```
3. Store this — you'll need it in the next step.

---

## 3. Create an Auth Token

The auth token is used by CI/CD to upload source maps for readable stack traces.

1. Go to **User Settings → Auth Tokens** (or **Settings → Auth Tokens** in newer Sentry versions).
2. Click **Create New Token**.
3. Set the name to `forhemit-ci`.
4. Select the following scopes:
   - `org:read` — read organization info
   - `project:releases` — create releases and upload source maps
   - `project:write` — update project settings
5. Click **Create Token**.
6. Copy the token immediately — it won't be shown again.

---

## 4. Configure Environment Variables

Add these variables to your `.env.local` files:

### `apps/admin/.env.local`

```bash
# Sentry DSN (public — exposed to the browser)
NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123456.ingest.us.sentry.io/7890123

# Sentry Auth Token (server-only — used for source map uploads in CI)
SENTRY_AUTH_TOKEN=sntrys_your_token_here

# Sentry organization slug (must match your org in sentry.io)
SENTRY_ORG=forhemit

# Sentry project slug (must match the project in sentry.io)
SENTRY_PROJECT=forhemit-admin
```

### Root `.env.example`

Add these entries to the root `.env.example` for documentation:

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

> **Note:** `NEXT_PUBLIC_SENTRY_DSN` is the only variable exposed to the client bundle. All other `SENTRY_*` variables are server/CI-only.

---

## 5. Add to Vercel Environment Variables

1. Go to your [Vercel dashboard](https://vercel.com) → **forhemit-admin** project → **Settings → Environment Variables**.
2. Add the following:

| Variable | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Your DSN from step 2 | Production, Preview, Development |
| `SENTRY_AUTH_TOKEN` | Your auth token from step 3 | Production, Preview |
| `SENTRY_ORG` | `forhemit` | Production, Preview |
| `SENTRY_PROJECT` | `forhemit-admin` | Production, Preview |

> **Important:** `SENTRY_AUTH_TOKEN` should **not** be set for the Development environment — it's only needed for source map uploads during builds on Vercel.

---

## 6. Add to GitHub Repository Secrets

Source map uploads also happen in CI (GitHub Actions). Add these as repository secrets:

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**.
2. Add:

| Secret Name | Value |
|---|---|
| `SENTRY_AUTH_TOKEN` | Your auth token from step 3 |
| `SENTRY_ORG` | `forhemit` |
| `SENTRY_PROJECT` | `forhemit-admin` |
| `NEXT_PUBLIC_SENTRY_DSN` | Your DSN from step 2 |

3. In your CI workflow (`.github/workflows/ci.yml`), ensure these secrets are available as environment variables during the build step:

```yaml
- name: Build
  run: pnpm turbo build
  env:
    NEXT_PUBLIC_SENTRY_DSN: ${{ secrets.NEXT_PUBLIC_SENTRY_DSN }}
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
    SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
```

---

## 7. Configure Sentry Webpack Plugin

The `withSentryConfig` wrapper in `next.config.js` enables automatic source map uploads during production builds. Add it to `apps/admin/next.config.js`:

```js
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // ... existing config ...
};

module.exports = withSentryConfig(nextConfig, {
  // Upload source maps only when SENTRY_AUTH_TOKEN is set
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only upload source maps in production builds
  silent: true,
  hideSourceMaps: true, // Don't expose source maps in production client bundles

  // widen the file upload limit for source maps
  widenClientFileUpload: true,

  // Automatically tree-shake Sentry logger statements in production
  disableLogger: true,
});
```

> **Note:** Source map uploads only happen when `SENTRY_AUTH_TOKEN` is set. Local dev builds without the token will skip uploads silently.

---

## 8. Update Content Security Policy

The current CSP `connect-src` directive in `next.config.js` doesn't include Sentry's ingestion domains. Add the Sentry DSN origin to allow error reporting:

In the existing `connect-src` header value, append:

```
https://*.sentry.io
```

The updated `connect-src` should look like:

```
connect-src 'self' https://api.convex.dev https://uploadthing.com wss://uploadthing.com https://striped-puma-587.convex.cloud wss://striped-puma-587.convex.cloud https://clerk.forhemit.website https://*.clerk.accounts.dev https://clerk-telemetry.com https://*.sentry.io
```

---

## 9. Add `instrumentation.ts`

@sentry/nextjs v8+ requires an `instrumentation.ts` file at the project root for server-side auto-instrumentation. Create `apps/admin/instrumentation.ts`:

```ts
import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Only initialize Sentry on the server when running in Node.js
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  // Edge runtime initialization
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
```

> **Note:** If you don't need edge runtime error tracking, you can omit the edge import. A `sentry.edge.config.ts` would also need to be created for edge runtime support.

---

## 10. Configure Alert Rules

Set up alert rules in Sentry to be notified of critical issues.

### Error Rate Alert

1. Go to **Alerts → Create Alert Rule**.
2. Select **Issue Alert**.
3. Configure:
   - **When:** An event is seen in `forhemit-admin`
   - **If:** The issue has occurred more than 10 times in 5 minutes
   - **Then:** Send notification to `#engineering` (Slack/email)
4. Name it: `High Error Rate — Admin`

### New Issue Alert

1. Go to **Alerts → Create Alert Rule**.
2. Select **Issue Alert**.
3. Configure:
   - **When:** A new issue is created
   - **If:** The issue's level is `error` or higher
   - **Then:** Send notification to your email / Slack channel
4. Name it: `New Error Issue — Admin`

### High Priority Alert

1. Go to **Alerts → Create Alert Rule**.
2. Select **Issue Alert**.
3. Configure:
   - **When:** An event is seen with level `fatal`
   - **Then:** Send notification immediately (PagerDuty / Slack / email)
4. Name it: `Fatal Error — Admin`

---

## 11. Verify the Setup

### Test Error Capture

Add a temporary test route to trigger a client-side error:

```tsx
// apps/admin/app/admin/test-sentry/page.tsx
"use client";

export default function TestSentry() {
  return (
    <button onClick={() => { throw new Error("Sentry test error — delete this page"); }}>
      Trigger Error
    </button>
  );
}
```

1. Deploy to a preview environment (or run locally with `pnpm dev`).
2. Navigate to `/admin/test-sentry` and click the button.
3. Check the Sentry dashboard → **Issues** — the error should appear within 1-2 minutes.
4. **Delete the test route** after verification.

### Verify Source Maps

1. Trigger a production error (after deploying with `SENTRY_AUTH_TOKEN` set).
2. In Sentry, open the issue.
3. Stack traces should show **original TypeScript source** (not minified JS).
4. If stack traces are minified, check that `SENTRY_AUTH_TOKEN` was available during the Vercel/CI build and that `withSentryConfig` is configured in `next.config.js`.

### Verify Server-Side Errors

Server-side errors (API routes, server components) are captured automatically once `instrumentation.ts` is in place. Test by throwing an error in a server action or API route.

---

## 12. Existing Configuration Reference

The following Sentry integration files already exist in `apps/admin/`:

### `sentry.client.config.ts`

- **Traces:** 10% sample rate in production, 100% in development
- **Replays:** 100% on error, 10% of sessions
- **Integrations:** `replayIntegration()`, `browserTracingIntegration()`

### `sentry.server.config.ts`

- **Traces:** 10% sample rate in production, 100% in development
- **Profiling:** 10% in production, 100% in development
- **Debug mode:** enabled in development

### `app/error.tsx`

- Client-side error boundary that captures exceptions via `Sentry.captureException()`
- Shows a styled error page with retry, home, and contact options
- Only reports to Sentry when `NEXT_PUBLIC_SENTRY_DSN` is set

---

## Environment Variable Summary

| Variable | Where Used | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Client + Server | Sentry DSN for error reporting |
| `SENTRY_AUTH_TOKEN` | CI / Vercel builds | Source map uploads |
| `SENTRY_ORG` | CI / Vercel builds | Organization slug |
| `SENTRY_PROJECT` | CI / Vercel builds | Project slug |

---

## Quick Checklist

- [ ] Sentry project created at sentry.io
- [ ] DSN copied and added to `NEXT_PUBLIC_SENTRY_DSN`
- [ ] Auth token created with `org:read`, `project:releases`, `project:write`
- [ ] Env vars set in `apps/admin/.env.local`
- [ ] Env vars added to Vercel (Production + Preview)
- [ ] Secrets added to GitHub Actions
- [ ] `withSentryConfig` added to `apps/admin/next.config.js`
- [ ] CSP `connect-src` updated with `https://*.sentry.io`
- [ ] `instrumentation.ts` created
- [ ] Alert rules configured (error rate, new issue, fatal)
- [ ] Test error verified on Sentry dashboard
- [ ] Source maps verified in production stack traces
