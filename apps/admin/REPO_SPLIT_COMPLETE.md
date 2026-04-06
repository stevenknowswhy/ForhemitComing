# Repository Split Complete ✓

**Date**: 2026-03-22  
**Status**: COMPLETE  
**Marketing Repo**: `/Users/stephenstokes/Desktop/ForhemitComingSoon`  
**Admin Repo**: `/Users/stephenstokes/Desktop/ForhemitAdminWebsite`

---

## Summary

The Forhemit codebase has been successfully split into two separate repositories:

1. **ForhemitComing** (Marketing Site) - Public-facing website at `forhemit.com`
2. **ForhemitAdminWebsite** (Admin Site) - Internal CRM at `forhemit.website` with Clerk authentication

Both sites share the same Convex backend (`striped-puma-587.convex.cloud`).

---

## What Was Done

### Marketing Site (ForhemitComing)

**Removed:**
- ✅ `/app/admin/` directory (entire admin interface)
- ✅ `/app/api/admin/` API routes
- ✅ Admin password authentication (`ADMIN_PASSWORD` from env)
- ✅ Preview gate middleware (site is now fully public)

**Kept:**
- ✅ All marketing pages (homepage, about, features, etc.)
- ✅ Contact form submissions (public Convex mutations)
- ✅ Blog system
- ✅ Lead capture forms
- ✅ Public API routes (health, pdf-generate, uploadthing)

**Build Status**: ✅ PASSED

### Admin Site (ForhemitAdminWebsite)

**Added:**
- ✅ `@clerk/nextjs` authentication
- ✅ Sign-in page at `/sign-in`
- ✅ Sign-up page at `/sign-up`
- ✅ Clerk middleware for route protection
- ✅ `ConvexProviderWithClerk` for authenticated Convex access
- ✅ `convex/auth.config.ts` for JWT verification

**Removed:**
- ✅ All marketing pages (homepage, about, blog, etc.)
- ✅ Marketing-specific components and layouts
- ✅ Old password-based authentication system
- ✅ Admin login/logout API routes (replaced by Clerk)

**Kept:**
- ✅ All admin routes (`/admin/*`)
- ✅ CRM system
- ✅ Template builders
- ✅ Document generation
- ✅ Contact/lead management

**Build Status**: ✅ PASSED

---

## Repository Structure

### Marketing Site (`ForhemitComing`)
```
app/
├── (marketing routes)
│   ├── page.tsx              # Homepage
│   ├── about/
│   ├── blog/
│   ├── brokers/
│   ├── business-owners/
│   ├── faq/
│   └── ...
├── api/
│   ├── health/               # Health check
│   ├── pdf-generate/         # PDF generation
│   └── uploadthing/          # File uploads
├── components/               # Marketing components
├── lib/
├── hooks/
└── globals.css

convex/
├── schema.ts                 # Shared schema
├── contactSubmissions.ts     # Public mutations
├── earlyAccessSignups.ts     # Public mutations
└── jobApplications.ts        # Public mutations
```

### Admin Site (`ForhemitAdminWebsite`)
```
app/
├── (auth)/
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
├── admin/
│   ├── page.tsx              # Dashboard
│   ├── applications/
│   ├── contacts/
│   ├── crm/
│   ├── esop-partners/
│   ├── stats/
│   ├── templates/
│   └── ...
├── api/
│   ├── health/
│   ├── pdf-generate/
│   └── uploadthing/
├── components/
│   └── providers/
│       └── ConvexProvider.tsx   # Uses ConvexProviderWithClerk
└── globals.css

convex/
├── schema.ts                 # Shared schema (byte-for-byte identical)
├── auth.config.ts            # Clerk JWT config
├── contactSubmissions.ts     # All functions (public + protected)
├── earlyAccessSignups.ts
├── jobApplications.ts
├── crmCompanies.ts
├── crmContacts.ts
├── crmActivities.ts
├── crmTasks.ts
├── documentTemplates.ts
├── generatedDocuments.ts
└── auditLogs.ts
```

---

## Environment Variables

### Marketing Site (`.env.local`)
```bash
# UploadThing
UPLOADTHING_TOKEN=...
UPLOADTHING_APP_ID=...

# Unsplash
UNSPLASH_APPLICATION_ID=...
UNSPLASH_ACCESS_KEY=...
UNSPLASH_SECRET_KEY=...

# Convex (shared)
NEXT_PUBLIC_CONVEX_URL=https://striped-puma-587.convex.cloud
CONVEX_DEPLOYMENT=dev:striped-puma-587
NEXT_PUBLIC_CONVEX_SITE_URL=https://striped-puma-587.convex.site

# Site URL
NEXT_PUBLIC_SITE_URL=https://forhemit.com
```

### Admin Site (`.env.local`)
```bash
# Clerk (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin

# UploadThing
UPLOADTHING_TOKEN=...
UPLOADTHING_APP_ID=...

# Unsplash
UNSPLASH_APPLICATION_ID=...
UNSPLASH_ACCESS_KEY=...
UNSPLASH_SECRET_KEY=...

# Convex (shared - MUST match marketing site)
NEXT_PUBLIC_CONVEX_URL=https://striped-puma-587.convex.cloud
CONVEX_DEPLOYMENT=dev:striped-puma-587
NEXT_PUBLIC_CONVEX_SITE_URL=https://striped-puma-587.convex.site

# Site URL
NEXT_PUBLIC_SITE_URL=https://forhemit.website
```

---

## Authentication Flow

### Marketing Site
- No authentication required
- Public form submissions go directly to Convex
- Anonymous users can submit contact forms, newsletter signups, job applications

### Admin Site
- Clerk authentication required for all routes except `/sign-in` and `/sign-up`
- Middleware enforces authentication
- Authenticated Convex client sends JWT token with requests
- Convex validates JWT via `auth.config.ts`

---

## Deployment

### Marketing Site
```bash
cd /Users/stephenstokes/Desktop/ForhemitComingSoon
# Deploy to forhemit.com (Vercel)
vercel --prod
```

### Admin Site
```bash
cd /Users/stephenstokes/Desktop/ForhemitAdminWebsite
# First: Add Clerk keys to .env.local
# Then deploy to forhemit.website (Vercel)
vercel --prod
```

**IMPORTANT**: Admin site will NOT work without valid Clerk API keys!

---

## Next Steps

### 1. Set Up Clerk (Admin Site)
1. Go to https://dashboard.clerk.com
2. Create a new application
3. Get your Publishable Key and Secret Key
4. Add them to `/Users/stephenstokes/Desktop/ForhemitAdminWebsite/.env.local`
5. Configure allowed origins: `https://forhemit.website`

### 2. Deploy Marketing Site
```bash
cd /Users/stephenstokes/Desktop/ForhemitComingSoon
git add .
git commit -m "chore: remove admin functionality, marketing-only site"
git push origin main
# Deploy via Vercel dashboard or CLI
```

### 3. Deploy Admin Site
```bash
cd /Users/stephenstokes/Desktop/ForhemitAdminWebsite
git init
git add .
git commit -m "feat: initial admin site with Clerk authentication"
git remote add origin https://github.com/stevenknowswhy/ForhemitAdminWebsite.git
git push -u origin main
# Deploy via Vercel dashboard or CLI
```

### 4. Verify Integration
- Submit a contact form on marketing site
- Check that it appears in admin dashboard
- Verify both sites use same Convex deployment

---

## Rollback Plan

If issues arise:

1. **Marketing site issues**: The original code is in git history
   ```bash
   git revert HEAD  # If you committed the split
   ```

2. **Admin site issues**: The unified codebase still exists in the original repo
   - Admin functionality was only removed from marketing repo
   - Full admin code exists in `ForhemitAdminWebsite`

3. **Database issues**: Both sites share the same Convex backend
   - No data migration needed
   - Schema is identical in both repos

---

## Key Files Changed

### Marketing Site
- `middleware.ts` - Simplified, no auth
- `app/admin/` - **DELETED**
- `app/api/admin/` - **DELETED**
- `.env.local` - Removed ADMIN_PASSWORD

### Admin Site
- `middleware.ts` - Added Clerk auth
- `app/layout.tsx` - Added ClerkProvider
- `app/(auth)/` - **NEW**: Sign-in/sign-up pages
- `app/components/providers/ConvexProvider.tsx` - Uses ConvexProviderWithClerk
- `convex/auth.config.ts` - **NEW**: Clerk JWT config
- `app/admin/components/AdminClientLayout.tsx` - Uses Clerk UserButton
- `app/admin/components/AdminSidebar.tsx` - Updated for Clerk

---

## Architecture Diagram

```
┌─────────────────────┐         ┌─────────────────────┐
│  Marketing Site     │         │  Admin Site         │
│  forhemit.com       │         │  forhemit.website   │
│                     │         │                     │
│  • No Auth          │         │  • Clerk Auth       │
│  • Public Forms     │         │  • Protected Routes │
│  • Lead Capture     │         │  • CRM Access       │
└─────────┬───────────┘         └─────────┬───────────┘
          │                               │
          │    Anonymous       Authenticated
          │    Mutations       Queries/Mutations
          │         │                │
          └─────────┴────────────────┘
                    │
          ┌─────────▼───────────┐
          │  Convex Backend     │
          │  striped-puma-587   │
          │                     │
          │  • contactSubmissions
          │  • earlyAccessSignups
          │  • jobApplications
          │  • crmCompanies     │
          │  • documentTemplates│
          │  • ...              │
          └─────────────────────┘
```

---

## Verification Checklist

- [x] Marketing site builds successfully
- [x] Admin site builds successfully
- [x] Marketing site has no admin routes
- [x] Admin site has Clerk installed
- [x] Admin site has sign-in/sign-up pages
- [x] Middleware configured for both sites
- [x] Environment templates created
- [x] Both repos share same Convex URL
- [x] Schema is identical in both repos
- [ ] Clerk keys added to admin site
- [ ] Marketing site deployed
- [ ] Admin site deployed
- [ ] End-to-end test completed

---

**Split completed successfully! 🎉**

For questions or issues, refer to:
- `STRUCTURE_ANALYSIS.md` - Detailed analysis of the split
- `AGENTS.md` - Project coding standards
- Clerk docs: https://clerk.com/docs
- Convex docs: https://docs.convex.dev
