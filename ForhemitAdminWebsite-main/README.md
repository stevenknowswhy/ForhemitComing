# Forhemit Admin Website

Internal CRM and document template management system for Forhemit PBC.

**URL**: https://forhemit.website  
**Status**: Authentication Required (Clerk)

---

## Features

- **Contact Management**: View and manage contact form submissions
- **Lead Tracking**: Early access signups and job applications
- **CRM System**: Business tracker with pipeline management
- **Template Builder**: Document generation and management
- **Audit Logs**: Track all system changes

---

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Authentication**: Clerk (@clerk/nextjs)
- **Database**: Convex (shared with marketing site)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm or pnpm
- Clerk account (https://clerk.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/stevenknowswhy/ForhemitAdminWebsite.git
cd ForhemitAdminWebsite

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Clerk keys

# Run development server
npm run dev
```

### Environment Variables

Required variables in `.env.local`:

```bash
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin

# Convex (shared with marketing site)
NEXT_PUBLIC_CONVEX_URL=https://striped-puma-587.convex.cloud
```

---

## Authentication

This site uses Clerk for authentication. All routes except `/sign-in` and `/sign-up` require authentication.

### Protected Routes
- `/admin` - Dashboard
- `/admin/contacts` - Contact submissions
- `/admin/crm` - Business tracker
- `/admin/templates` - Template builder
- All other `/admin/*` routes

### Public Routes
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/api/webhooks/*` - Webhook endpoints

---

## Shared Backend

This admin site shares the same Convex backend as the marketing site (forhemit.com). Changes made in the admin dashboard are immediately reflected in the shared database.

### Data Flow
```
Marketing Site (Public)
    ↓ (form submissions)
Convex Backend (Shared)
    ↑ (queries/mutations)
Admin Site (Authenticated)
```

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

```bash
# Using Vercel CLI
vercel --prod
```

---

## Project Structure

```
app/
├── (auth)/              # Auth pages group
│   ├── sign-in/         # Sign in page
│   └── sign-up/         # Sign up page
├── admin/               # Admin dashboard
│   ├── page.tsx         # Dashboard home
│   ├── contacts/        # Contact management
│   ├── crm/             # Business tracker
│   ├── templates/       # Template builder
│   └── ...
├── api/                 # API routes
├── components/          # React components
│   └── providers/       # Context providers
└── globals.css          # Global styles

convex/                  # Convex backend
├── schema.ts            # Database schema
├── auth.config.ts       # Clerk auth config
├── contactSubmissions.ts
├── crmCompanies.ts
├── documentTemplates.ts
└── ...

middleware.ts            # Clerk auth middleware
```

---

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

## Related Projects

- **Marketing Site**: https://github.com/stevenknowswhy/ForhemitComing
- **Live Marketing Site**: https://forhemit.com

---

## Documentation

- `REPO_SPLIT_COMPLETE.md` - Details of the repository split
- Clerk Docs: https://clerk.com/docs
- Convex Docs: https://docs.convex.dev
- Next.js Docs: https://nextjs.org/docs

---

## Support

For issues or questions, please open an issue on GitHub.
