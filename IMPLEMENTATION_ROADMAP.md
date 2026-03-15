# Forhemit Capital - Implementation Roadmap

> **Status Tracker**: Use this file to track progress through each phase.  
> **Last Updated**: 2026-03-10  
> **Current Phase**: Not Started

---

## Quick Status Overview

| Phase | Status | Verification Date | Verified By |
|-------|--------|-------------------|-------------|
| Phase 1: Critical Security & Stability | ⏳ Pending | - | - |
| Phase 2: Code Quality & Cleanup | ⏳ Pending | - | - |
| Phase 3: Performance Optimization | ⏳ Pending | - | - |
| Phase 4: Testing & Observability | ⏳ Pending | - | - |

**Legend**: ⏳ Pending | 🔄 In Progress | ✅ Complete | ⏸️ Blocked

---

## Pre-Implementation Setup

### Before Starting Phase 1
- [ ] Create a backup branch: `git checkout -b safety/audit-implementation`
- [ ] Run full build: `npm run build` (record build time: ___s)
- [ ] Run dev server and confirm all pages load
- [ ] Document current bundle size: `npm run build` → check `.next/static/`
- [ ] Open all major pages in browser, screenshot for comparison

### Testing Checklist (Pre-Implementation)
Verify these work BEFORE making changes:
- [ ] Home page (`/`) loads without console errors
- [ ] Navigation menu opens/closes correctly
- [ ] `/lenders` page shows "Friday 3PM vs Tuesday Morning" section correctly
- [ ] Contact modal opens from footer
- [ ] Early access email submission works
- [ ] Admin page loads (`/admin`)
- [ ] All form submissions complete without errors
- [ ] No 404s on any linked pages

---

## Phase 1: Critical Security & Stability
**Priority**: P0 - DO NOT SKIP  
**Estimated Time**: 2-3 hours  
**Risk Level**: Low (additive changes)

### Goals
- Prevent total app crashes via error boundaries
- Fix XSS vulnerability
- Eliminate memory leaks
- Add runtime safety checks

### Implementation Checklist

#### 1.1 Install Dependencies
```bash
npm install isomorphic-dompurify zod
```
- [ ] Dependencies installed successfully
- [ ] `package.json` updated
- [ ] `package-lock.json` committed

#### 1.2 Create Error Boundary Component
**File**: `app/components/ErrorBoundary.tsx`
- [ ] Component created with `getDerivedStateFromError`
- [ ] Fallback UI matches site design (dark theme)
- [ ] Error logging to console for debugging
- [ ] "Reload Page" button included

**Manual Verification**:
- [ ] Temporarily throw error in a page component
- [ ] Verify error boundary catches and displays fallback
- [ ] Click "Reload Page" button works
- [ ] Remove test error after verification

#### 1.3 Add Error Boundary to Root Layout
**File**: `app/layout.tsx`
- [ ] Import ErrorBoundary
- [ ] Wrap `{children}` with ErrorBoundary
- [ ] Add ConvexClientProvider INSIDE ErrorBoundary (or alongside - test both)

**Manual Verification**:
- [ ] Dev server starts without errors
- [ ] Home page loads normally
- [ ] Navigation still works
- [ ] Build succeeds: `npm run build`

#### 1.4 Fix XSS Vulnerability in InfrastructureAuditModal
**File**: `app/components/modals/InfrastructureAuditModal.tsx`
- [ ] Install `isomorphic-dompurify`
- [ ] Import DOMPurify
- [ ] Sanitize `diagnostic` text before rendering
- [ ] Use `useMemo` to avoid re-sanitizing on every render

**Code Change**:
```typescript
import DOMPurify from 'isomorphic-dompurify';
// ...
const sanitizedDiagnostic = useMemo(() => 
  DOMPurify.sanitize(diagnostic), 
  [diagnostic]
);
```

**Manual Verification**:
- [ ] Infrastructure audit modal opens
- [ ] Complete full audit flow for each lane (Resilience, Stewardship, Competitive)
- [ ] Verify diagnostic text displays correctly
- [ ] Check browser DevTools → Elements for sanitized HTML

#### 1.5 Fix Memory Leaks in Timeouts
**Files to Update**:
- [ ] `EarlyAccessForm.tsx:69` - Wrap in useEffect with cleanup
- [ ] `GalleryContainer.tsx:43` - Store timeout ref for cleanup
- [ ] `Toast.tsx:24-34` - Verify cleanup exists (should already have it)
- [ ] `brokers/page.tsx` - Add cleanup for all setTimeout/setInterval

**Manual Verification**:
- [ ] Submit early access form, close modal before 2s timeout
- [ ] Navigate away from brokers page during animation
- [ ] Open/close gallery multiple times
- [ ] Check React DevTools Profiler for memory growth

#### 1.6 Add Runtime Environment Validation
**File**: `app/components/providers/ConvexProvider.tsx`
- [ ] Add runtime check for NEXT_PUBLIC_CONVEX_URL
- [ ] Throw descriptive error if missing
- [ ] Add console warning in development

**Manual Verification**:
- [ ] Temporarily rename env var, verify clear error message
- [ ] Restore env var, verify app loads

#### 1.7 Add Input Validation Schema
**File**: `lib/validation.ts` (create new)
- [ ] Create Zod schemas matching Convex schema
- [ ] Email validation regex
- [ ] Phone number format validation
- [ ] Max length constraints

**Manual Verification**:
- [ ] Test invalid email → proper error
- [ ] Test invalid phone → proper error
- [ ] Test oversized input → proper error

### Phase 1 Verification Summary
- [ ] All changes committed to branch
- [ ] Build succeeds with no new warnings
- [ ] All manual tests pass
- [ ] No console errors in dev mode
- [ ] No memory leaks detected (React DevTools)

**Sign-off**: _______________ Date: _______

---

## Phase 2: Code Quality & Cleanup
**Priority**: P1  
**Estimated Time**: 3-4 hours  
**Risk Level**: Medium (deleting code)
**Blocked By**: Phase 1 completion

### Goals
- Remove dead/orphaned code
- Consolidate duplicate utilities
- Fix TypeScript `any` types
- Improve type safety

### Pre-Phase Verification
Repeat testing checklist from Phase 1 to establish baseline:
- [ ] All Phase 1 functionality still works
- [ ] Build succeeds

### Implementation Checklist

#### 2.1 Remove Dead Code - Archive Directory
**Action**: Delete `app/about/_archive/`
- [ ] Confirm no imports reference `_archive`
- [ ] Run search: `grep -r "_archive" app/ --include="*.tsx" --include="*.ts"`
- [ ] Delete entire directory
- [ ] Verify build succeeds

**Manual Verification**:
- [ ] `/about` page loads correctly
- [ ] No 404s on about page
- [ ] All about page content displays

#### 2.2 Consolidate Phone Formatting
**Files**:
- [ ] `app/lib/formatters.ts` - Keep this one
- [ ] `app/admin/page.tsx:46` - Replace with import

**Manual Verification**:
- [ ] Admin page loads
- [ ] Phone numbers format correctly in admin display

#### 2.3 Fix TypeScript `any` Types
**Files to Update**:
- [ ] `ContactModal.tsx:94` - Replace `as any` with proper type
- [ ] Check all `as any` casts in codebase
- [ ] Add proper type unions where needed

**Manual Verification**:
- [ ] `npm run build` succeeds with `strict: true` (if enabled)
- [ ] Type checking passes: `npx tsc --noEmit`
- [ ] Contact form submission still works

#### 2.4 Centralize Toast System (Optional but Recommended)
**File**: Create `app/components/providers/ToastProvider.tsx`
- [ ] Move toast state from individual modals to context
- [ ] Wrap layout with ToastProvider
- [ ] Update all modals to use context instead of local hook

**Manual Verification**:
- [ ] Toasts appear from all modals
- [ ] Multiple toasts stack correctly
- [ ] Toasts auto-dismiss properly

#### 2.5 Fix IntersectionObserver Recreation
**File**: `lenders/page.tsx:50-67`
- [ ] Move observer creation to useRef or useMemo
- [ ] Ensure single observer instance
- [ ] Proper cleanup on unmount

**Manual Verification**:
- [ ] Scroll through lenders page
- [ ] Animations trigger correctly
- [ ] No performance degradation in DevTools Performance tab

### Phase 2 Verification Summary
- [ ] Deleted code is truly unused (no import errors)
- [ ] Bundle size reduced (check build output)
- [ ] No TypeScript errors
- [ ] All manual tests pass
- [ ] Build succeeds

**Sign-off**: _______________ Date: _______

---

## Phase 3: Performance Optimization
**Priority**: P2  
**Estimated Time**: 4-6 hours  
**Risk Level**: Medium (changes to data fetching)
**Blocked By**: Phase 2 completion

### Goals
- Implement query caching
- Add pagination for admin
- Optimize Convex queries
- Reduce bundle size

### Pre-Phase Verification
- [ ] All Phase 2 functionality still works
- [ ] Record current admin page load time
- [ ] Record current build bundle sizes

### Implementation Checklist

#### 3.1 Add Query Caching for Stats
**File**: `convex/jobApplications.ts`
- [ ] Add caching layer for `getStats` query
- [ ] Cache TTL: 60 seconds
- [ ] Implement cache invalidation on mutations

**Manual Verification**:
- [ ] Open admin stats tab
- [ ] Note load time
- [ ] Navigate away and back
- [ ] Verify faster load (cached)
- [ ] Submit new application
- [ ] Verify cache invalidates correctly

#### 3.2 Add Pagination to Admin
**Files**:
- [ ] `convex/jobApplications.ts` - Add cursor-based pagination
- [ ] `convex/contactSubmissions.ts` - Add cursor-based pagination
- [ ] `app/admin/page.tsx` - Add pagination UI

**Manual Verification**:
- [ ] Admin loads with pagination controls
- [ ] Next/Previous page buttons work
- [ ] Page size selector works (10, 25, 50, 100)
- [ ] Large dataset loads without timeout

#### 3.3 Optimize Images
**Files**: All pages with images
- [ ] Add `next/image` where not used
- [ ] Configure image domains in `next.config.js`
- [ ] Add lazy loading for below-fold images
- [ ] Verify external image URLs are in allowed domains

**Manual Verification**:
- [ ] Images load correctly
- [ ] No console warnings about image domains
- [ ] Lighthouse score improved

#### 3.4 Implement Dynamic Imports
**File**: `app/layout.tsx` and heavy pages
- [ ] Dynamic import for modals
- [ ] Dynamic import for heavy components
- [ ] Add loading states

**Manual Verification**:
- [ ] Initial page load faster
- [ ] Modals still open correctly
- [ ] No layout shift when dynamic components load

#### 3.5 Add Rate Limiting
**File**: `app/api/uploadthing/route.ts` or middleware
- [ ] Add IP-based rate limiting
- [ ] Configure limits: 5 uploads per minute per IP
- [ ] Add rate limit headers

**Manual Verification**:
- [ ] Upload works normally under limit
- [ ] Upload blocked when limit exceeded
- [ ] Proper error message displayed

### Phase 3 Verification Summary
- [ ] Admin page loads faster (measure and record)
- [ ] Bundle size reduced (record before/after)
- [ ] No rate limiting false positives
- [ ] All images load correctly
- [ ] Build succeeds

**Sign-off**: _______________ Date: _______

---

## Phase 4: Testing & Observability
**Priority**: P3  
**Estimated Time**: 6-8 hours  
**Risk Level**: Low (additive)
**Blocked By**: Phase 3 completion

### Goals
- Add error tracking
- Implement analytics
- Create test suite
- Add monitoring

### Implementation Checklist

#### 4.1 Add Error Tracking
**Options**: Sentry, LogRocket, or Vercel Analytics
- [ ] Sign up for service
- [ ] Install SDK: `npm install @sentry/nextjs`
- [ ] Configure DSN in environment
- [ ] Add error boundary integration
- [ ] Test error capture

**Manual Verification**:
- [ ] Trigger test error
- [ ] Verify error appears in dashboard
- [ ] Verify source maps work

#### 4.2 Add Analytics
**Options**: Vercel Analytics, Google Analytics, Plausible
- [ ] Install analytics package
- [ ] Add page view tracking
- [ ] Add event tracking for key actions:
  - [ ] Contact form submission
  - [ ] Early access signup
  - [ ] Job application start/complete
  - [ ] Audit completion

**Manual Verification**:
- [ ] Page views tracked
- [ ] Events tracked with correct metadata

#### 4.3 Add Health Check Endpoint
**File**: `app/api/health/route.ts`
- [ ] Create health check API route
- [ ] Check Convex connection
- [ ] Check critical services
- [ ] Return 200/503 status codes

**Manual Verification**:
- [ ] `/api/health` returns healthy status
- [ ] Returns 503 when Convex unavailable (simulate)

#### 4.4 Create Test Infrastructure
**Install**: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Create `vitest.config.ts`
- [ ] Add test script to `package.json`
- [ ] Create test utilities
- [ ] Create first test: `lib/formatters.test.ts`

**Manual Verification**:
- [ ] `npm test` runs successfully
- [ ] Tests pass in CI (if applicable)

#### 4.5 Add E2E Tests (Optional)
**Install**: `npm install -D playwright`
- [ ] Configure Playwright
- [ ] Create critical path tests:
  - [ ] Home → Contact → Submit
  - [ ] Home → Early Access → Submit
  - [ ] Navigation flow

**Manual Verification**:
- [ ] `npx playwright test` passes
- [ ] Tests run in headed mode correctly

### Phase 4 Verification Summary
- [ ] Errors tracked in external system
- [ ] Analytics receiving data
- [ ] Health check responds correctly
- [ ] Unit tests pass
- [ ] Build succeeds with test infrastructure

**Sign-off**: _______________ Date: _______

---

## Post-Implementation Verification

### Final Testing Round
Repeat ALL checks from all phases:
- [ ] Home page loads
- [ ] All navigation works
- [ ] All forms submit correctly
- [ ] Admin page loads and functions
- [ ] File upload works
- [ ] No console errors
- [ ] No memory leaks (DevTools)
- [ ] Lighthouse score checked

### Performance Comparison
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Build Time | ___s | ___s | ___% |
| Bundle Size | ___KB | ___KB | ___% |
| First Contentful Paint | ___s | ___s | ___% |
| Admin Load Time | ___s | ___s | ___% |

### Security Checklist
- [ ] XSS vulnerability fixed
- [ ] Input validation working
- [ ] Rate limiting active
- [ ] Environment variables validated
- [ ] No secrets in client bundle

### Documentation Updates
- [ ] README updated with new setup instructions
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Deployment notes updated

---

## Rollback Plan

### If Critical Issue Found
1. **Immediate**: `git checkout safety/audit-implementation` (backup branch)
2. **Or**: Revert commits: `git revert HEAD~N..HEAD` (where N = commits in phase)
3. **Verify**: Run pre-implementation test checklist
4. **Investigate**: Fix issue in feature branch before retry

### Rollback Checkpoints
Mark these commits as you complete phases:
- [ ] Phase 1 Complete: Commit hash `_________________`
- [ ] Phase 2 Complete: Commit hash `_________________`
- [ ] Phase 3 Complete: Commit hash `_________________`
- [ ] Phase 4 Complete: Commit hash `_________________`

---

## Notes & Observations

### During Implementation
Use this section to jot down notes as you work:

**Phase 1 Notes**:
- 

**Phase 2 Notes**:
-

**Phase 3 Notes**:
-

**Phase 4 Notes**:
-

### Issues Encountered
| Phase | Issue | Resolution |
|-------|-------|------------|
| | | |

### Questions for Next Review
- 

---

## Change Log

| Date | Phase | Changes Made | Verified By |
|------|-------|--------------|-------------|
| 2026-03-10 | - | Created implementation roadmap | - |
| | | | |
