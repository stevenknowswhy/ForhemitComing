05/30/26 12:55 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Design: Admin/Marketing Page Deduplication

**Session:** 20260526-160000
**Date:** 2026-05-26
**Status:** Pending approval

## Problem Statement

The admin and marketing apps have near-identical page components. jscpd reports 1,663 duplicate code findings. Analysis of 13 page pairs shows:

| Category | Pages | Avg Similarity | Approach |
|----------|-------|----------------|----------|
| **Near-identical** (diff ≤ 20) | 9 | 99% | Direct import from marketing |
| **Minor differences** (diff 20-50) | 2 | 95% | Direct import + small overrides |
| **Structural differences** (diff > 50) | 2 | 75% | Shared base + per-app extensions |

## Proposed Approach

### Strategy: Admin imports marketing client components

Instead of duplicating page content, admin pages become thin wrappers:

```tsx
// apps/admin/app/lenders/page.tsx (AFTER)
import { Metadata } from "next";
import { LendersPageClient } from "@/../../marketing/app/lenders/LendersPageClient";

export const metadata: Metadata = {
  title: "Lenders | Forhemit",
  description: "...",
};

export default function LendersPage() {
  return <LendersPageClient variant="admin" />;
}
```

The marketing client components accept an optional `variant` prop for the few differences (Link vs anchor, content wording).

### Pages to deduplicate (ordered by impact)

**Phase 1 — Near-identical (9 pages, ~3,500 lines saved):**
1. `lenders` — 567 lines, 21 diffs
2. `appraisers` — 548 lines, 15 diffs
3. `accounting-firms` — 462 lines, 10 diffs
4. `wealth-managers` — 664 lines, 37 diffs
5. `financial-accounting` — 318 lines, 8 diffs
6. `introduction` — 473 lines, 2 diffs
7. `opt-in` — 375 lines, 2 diffs
8. `legal-practices` — 46 lines, 2 diffs
9. `faq` — 33 lines, 2 diffs

**Phase 2 — Minor differences (2 pages):**
10. `beyond-the-balance-sheet` — 368 lines, 72 diffs
11. `the-exit-crisis` — 34 lines, 2 diffs

**Phase 3 — Structural differences (2 pages):**
12. `brokers` — 48 + 110 lines, different structure (admin uses sections, marketing uses BrokersPathClient)
13. `business-owners` — 430 + 545 lines, 267 diffs (marketing has additional sections)

### Variant prop pattern

For pages with content differences, the marketing client component accepts a `variant` prop:

```tsx
interface PageProps {
  variant?: "admin" | "marketing";
}
```

The few differences (FAQ wording, Link vs anchor) are handled via this prop. Most content is identical.

### CSS deduplication

Many page-specific CSS files are also duplicated:
- `lenders/lenders.css` — identical in both apps
- `appraisers/appraisers.css` — identical in both apps
- etc.

**Strategy:** Move shared page CSS to `packages/shared/src/styles/pages/` and import from both apps.

### Files to modify

**Per page (Phase 1 example — lenders):**
- `apps/marketing/app/lenders/LendersPageClient.tsx` — add `variant` prop
- `apps/admin/app/lenders/page.tsx` — replace with thin wrapper importing from marketing
- `apps/admin/app/lenders/lenders.css` — delete (use marketing's copy or shared)

### Risks

1. **Import path resolution** — Admin importing from marketing's app directory requires careful path aliasing. May need `@marketing/` alias or relative paths.
2. **CSS scoping** — If CSS is imported in the client component, it should work in both apps.
3. **Server/client boundary** — Admin wrapper must be a server component (for metadata), marketing client must be "use client".
4. **Testing** — Each dedup must be verified with `tsc --noEmit` on both apps.

### Out of scope

- Deduplicating admin-specific pages (admin dashboard, CRM, templates) — these are unique to admin
- Deduplicating marketing-specific pages (blog, assess) — these are unique to marketing
- Extracting shared components (Header, Footer, etc.) — separate task
- Changing the monorepo architecture (e.g., making marketing a dependency of admin)

### Recommendation

**Start with Phase 1** (9 near-identical pages). This gives the biggest ROI with the lowest risk. Each page is a mechanical transformation: replace admin page content with import from marketing client component.

Estimated effort: ~2 hours for Phase 1, ~1 hour for Phase 2-3.
Total lines saved: ~5,000+ (page content + CSS).
