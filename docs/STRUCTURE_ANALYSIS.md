# Structure Analysis: Forhemit Codebase Split

**Date**: 2026-03-22  
**Source Repository**: `/Users/stephenstokes/Desktop/ForhemitComingSoon`  
**Convex URL**: `https://striped-puma-587.convex.cloud`

---

## 1. ROUTE CLASSIFICATION

### Marketing Routes (KEEP in ForhemitComing)
These are public-facing pages that should remain on the marketing site:

| Route | Purpose | Notes |
|-------|---------|-------|
| `/` | Homepage | Main landing page |
| `/about` | About page | Company information |
| `/blog/*` | Blog posts | Content marketing |
| `/brokers` | Brokers landing | Professional audience |
| `/wealth-managers` | Wealth managers landing | Professional audience |
| `/lenders` | Lenders landing | Professional audience |
| `/accounting-firms` | Accountants landing | Professional audience |
| `/business-owners` | Business owners landing | Primary audience |
| `/legal-practices` | Legal landing | Professional audience |
| `/appraisers` | Appraisers landing | Professional audience |
| `/financial-accounting` | Financial services | Professional audience |
| `/the-exit-crisis` | Content page | Thought leadership |
| `/beyond-the-balance-sheet` | Content page | Thought leadership |
| `/faq` | FAQ page | Support content |
| `/introduction` | Introduction page | Lead nurture |
| `/opt-in/*` | Opt-in pages | Lead capture |
| `/coming-soon` | Coming soon page | Preview gate |
| `/privacy` | Privacy policy | Legal |
| `/terms` | Terms of service | Legal |
| `/api/health` | Health check | System monitoring |
| `/api/pdf-generate` | PDF generation | Public form PDFs |
| `/api/uploadthing` | File uploads | Public file handling |

### Admin Routes (MOVE to ForhemitAdminWebsite)
These are internal/administrative pages that should move to the admin site:

| Route | Purpose | Notes |
|-------|---------|-------|
| `/admin` | Admin dashboard | Main admin home |
| `/admin/applications` | Job applications | Internal HR management |
| `/admin/audit` | Audit logs | Security/compliance |
| `/admin/contacts` | Contact submissions | Lead management |
| `/admin/crm` | CRM system | Pipeline management |
| `/admin/early-access` | Early access signups | Lead management |
| `/admin/esop-partners` | ESOP partner CRM | Partner management |
| `/admin/stats` | Stats dashboard | Analytics |
| `/admin/templates` | Template builder | Document generation |
| `/admin/templates/forms/*` | Form builders | All template forms |
| `/api/admin/*` | Admin API routes | Server-side admin functions |

---

## 2. CONVEX FUNCTIONS CLASSIFICATION

### Public Functions (Marketing Site)
These functions should remain accessible from the marketing site:

| File | Functions | Purpose |
|------|-----------|---------|
| `contactSubmissions.ts` | `submitContactForm`, `submitContactFormPublic` | Public form submissions |
| `earlyAccessSignups.ts` | `submitEarlyAccessSignup`, `submitEarlyAccessSignupPublic` | Newsletter signups |
| `jobApplications.ts` | `submitJobApplication`, `submitJobApplicationPublic` | Career applications |

### Protected Functions (Admin Site Only)
These functions require authentication and should only be used by the admin site:

| File | Functions | Purpose |
|------|-----------|---------|
| `contactSubmissions.ts` | `getContactSubmissions`, `updateContactSubmission`, `deleteContactSubmission`, `getContactStats` | Lead management |
| `earlyAccessSignups.ts` | `getEarlyAccessSignups`, `deleteEarlyAccessSignup`, `getSignupStats` | Signup management |
| `jobApplications.ts` | `getJobApplications`, `updateJobApplication`, `deleteJobApplication`, `getApplicationStats`, `updateApplicationStatus`, `getApplicationsByStatus` | HR management |
| `documentTemplates.ts` | `getTemplates`, `getTemplateBySlug`, `createTemplate`, `updateTemplate`, `deleteTemplate`, `seedTemplates`, `searchTemplates` | Template CRUD |
| `generatedDocuments.ts` | `logGeneratedDocument`, `getGeneratedDocuments`, `getDocumentStats` | Document tracking |
| `auditLogs.ts` | `logAction`, `getAuditLogsForEntity`, `getRecentAuditLogs` | Audit trail |
| `crmCompanies.ts` | `getCompanies`, `getCompany`, `createCompany`, `updateCompany`, `deleteCompany`, `searchCompanies`, `getCompaniesByStage`, `getCompanyStats`, `getPipelineStats` | CRM companies |
| `crmContacts.ts` | `getContacts`, `getContactsByCompany`, `createContact`, `updateContact`, `deleteContact` | CRM contacts |
| `crmActivities.ts` | `getActivities`, `getActivitiesByCompany`, `createActivity`, `deleteActivity` | CRM activities |
| `crmTasks.ts` | `getTasks`, `getTasksByCompany`, `createTask`, `updateTask`, `deleteTask`, `getOverdueTasks`, `getTasksByAssignee` | CRM tasks |

---

## 3. ENVIRONMENT VARIABLES

### Current `.env.local`:
```bash
# UploadThing Configuration
UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJza19saXZlXzAyMjM2YWEwYTRmNTVkODc1NWVlOTAzZDVkZjMxNzNmZjg2N2QxOGFjNGVmYThhYWYyYzU3MmExZThjNWY5MTQiLCJhcHBJZCI6IjYxOHVrZWN2cGMiLCJyZWdpb25zIjpbInNlYTEiXX0=
UPLOADTHING_APP_ID=618ukecvpc

# Unsplash API Configuration
UNSPLASH_APPLICATION_ID=742548
UNSPLASH_ACCESS_KEY=3Bb8hffG8n7M0iNEptVq0QRKXf_voVgZXgz4u8prXg4
UNSPLASH_SECRET_KEY=T4xVp14_a7rzvBFN3-x033X_lMv-1NaH1_z3UMZwTEQ

# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://striped-puma-587.convex.cloud
CONVEX_DEPLOYMENT=dev:striped-puma-587
NEXT_PUBLIC_CONVEX_SITE_URL=https://striped-puma-587.convex.site

# Admin Password (TO BE REMOVED - replace with Clerk)
ADMIN_PASSWORD=My2005life!
```

### Variables to Keep in Marketing Site:
- `NEXT_PUBLIC_CONVEX_URL` (shared)
- `UPLOADTHING_TOKEN` (for public uploads)
- `UPLOADTHING_APP_ID`
- `NEXT_PUBLIC_SITE_URL=https://forhemit.com`

### Variables to Add to Admin Site:
- `NEXT_PUBLIC_CONVEX_URL` (same shared URL)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard`
- `CLERK_WEBHOOK_SECRET` (optional)

---

## 4. CURRENT MIDDLEWARE CONFIGURATION

### `middleware.ts` (Current):
- **Purpose**: Routes visitors to `/coming-soon` unless they have `?preview=true` or a preview cookie
- **Allows**: `/coming-soon`, `/blog/*`, `/admin/*`, `/_next/*`, `/api/*`, static assets
- **Behavior**: Sets `preview_access` cookie for 24 hours when `?preview=true`

### New Middleware for Marketing Site:
- Remove preview gate (site is now public)
- Simplify to just handle basic routing
- No authentication

### New Middleware for Admin Site:
- Clerk authentication middleware
- Protect all routes except `/sign-in`, `/sign-up`, `/api/webhooks/*`

---

## 5. CLERK DEPENDENCIES

### Current Status:
**NO CLERK INSTALLED** - The current codebase uses a simple password check (`ADMIN_PASSWORD`) for admin access.

### Dependencies to Add to Admin Site:
```bash
npm install @clerk/nextjs
```

### Files to Create in Admin Site:
1. `middleware.ts` - Clerk route protection
2. `app/layout.tsx` - ClerkProvider + ConvexProviderWithClerk
3. `app/(auth)/sign-in/[[...sign-in]]/page.tsx` - Sign in page
4. `app/(auth)/sign-up/[[...sign-up]]/page.tsx` - Sign up page
5. `convex/auth.config.ts` - Clerk JWT issuer configuration
6. `app/api/webhooks/clerk/route.ts` - Clerk webhook handler (optional)

---

## 6. COMPONENT CLASSIFICATION

### Marketing Components (KEEP):
- `/app/components/` - Shared marketing components
- `/app/blog/_components/` - Blog-specific components
- `/app/brokers/_components/` - Brokers page components
- `/app/faq/_components/` - FAQ components
- `/app/the-exit-crisis/_components/` - Content page components
- `/app/styles/` - Marketing-specific styles

### Admin Components (MOVE):
- `/app/admin/components/` - Admin layout components
- `/app/admin/crm/components/` - CRM components
- `/app/admin/esop-partners/components/` - Partner CRM components
- `/app/admin/templates/` - All template forms and builders
- `/app/admin/*.css` - Admin-specific styles

---

## 7. SHARED ASSETS

### Assets to Copy to Both Repos:
- `/public/` - Static assets (images, fonts, etc.)
- `/convex/schema.ts` - Must be byte-for-byte identical
- `/types/` - Shared TypeScript types
- `/utils/` - Shared utilities (if any)
- `/components/ui/` - shadcn/ui components (if used)
- `/hooks/` - Shared hooks
- `/lib/` - Shared libraries

### Build Configuration:
- `tailwind.config.js` - May need customization per site
- `next.config.js` - Different for each deployment
- `tsconfig.json` - Same
- `postcss.config.js` - Same

---

## 8. ESTIMATED FILE COUNTS

### Marketing Site (After Split):
- Routes: ~20 files
- Components: ~50 files
- API routes: ~4 files
- Convex: ~4 files (public mutations only)
- Total estimated: ~150 files

### Admin Site (After Split):
- Routes: ~15 files
- Components: ~150 files (includes complex forms)
- API routes: ~2 files
- Convex: ~12 files (all functions)
- Total estimated: ~250 files

---

## 9. CRITICAL SHARED SCHEMA

The `convex/schema.ts` file defines these tables:
- `contactSubmissions` - Marketing form data (shared)
- `earlyAccessSignups` - Newsletter signups (shared)
- `jobApplications` - Career applications (shared)
- `submissionStats` - Analytics (admin only)
- `documentTemplates` - Templates (admin only)
- `generatedDocuments` - Document logs (admin only)
- `auditLogs` - Audit trail (admin only)
- `crmCompanies` - CRM data (admin only)
- `crmContacts` - CRM data (admin only)
- `crmActivities` - CRM data (admin only)
- `crmTasks` - CRM data (admin only)

**IMPORTANT**: Both repositories MUST share the exact same schema.ts file to maintain data consistency.

---

## 10. IMPLEMENTATION NOTES

### Phase A: Marketing Site (ForhemitComing)
1. Remove `/app/admin/` directory entirely
2. Update `middleware.ts` to remove preview gate
3. Keep only public Convex mutations
4. Remove `ADMIN_PASSWORD` from env
5. Ensure build passes without Clerk

### Phase B: Admin Site (ForhemitAdminWebsite)
1. Copy entire codebase as starting point
2. Remove all marketing routes except `/sign-in`, `/sign-up`
3. Install Clerk dependencies
4. Set up Clerk middleware and providers
5. Update all admin Convex functions to check `ctx.auth.getUserIdentity()`
6. Create auth pages

### Phase C: Shared Backend
1. Both repos point to same Convex deployment
2. Schema changes must be made in both repos simultaneously
3. Admin repo uses authenticated client
4. Marketing repo uses anonymous client

---

## 11. VERIFICATION CHECKLIST

### Marketing Site:
- [ ] Homepage loads
- [ ] Contact form submits to Convex
- [ ] No admin routes accessible
- [ ] No Clerk dependencies
- [ ] Build succeeds
- [ ] Deploys to forhemit.com

### Admin Site:
- [ ] Sign-in page loads
- [ ] Clerk authentication works
- [ ] Can view contact submissions
- [ ] Can manage CRM data
- [ ] Can use template builders
- [ ] Build succeeds
- [ ] Deploys to forhemit.website

### Shared Backend:
- [ ] Form submission from marketing appears in admin dashboard
- [ ] Both sites use same Convex URL
- [ ] Schema is identical in both repos

---

*Generated for repository split planning*
