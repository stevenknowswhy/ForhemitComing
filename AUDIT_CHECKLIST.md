# Quick Reference Checklist

> Print this or keep it open while working.  
> Check off items as you complete them.

---

## CURRENT STATUS

**Active Phase**: ✅ Phase 1 | ✅ Phase 2 | ✅ Phase 3 | 🔄 Phase 4  
**Last Action**: _______________________________  
**Date**: _______________

---

## PHASE 1: CRITICAL SECURITY & STABILITY

### Pre-Flight
- [ ] Created backup branch: `safety/audit-implementation`
- [ ] Ran `npm run build` - succeeded
- [ ] Tested all pages load correctly

### Run Installation Script
```bash
# From project root:
bash scripts/run-phase1.sh
```
- [ ] Script completed without errors

### Post-Installation Verification

#### Build & Type Check
- [ ] `npm run build` - succeeds
- [ ] `npx tsc --noEmit` - no errors

#### Error Boundary Test
- [ ] Temporarily add `throw new Error("test")` to any page
- [ ] Verify error boundary displays fallback UI
- [ ] Click "Reload Page" button works
- [ ] Remove test error

#### XSS Fix Verification
- [ ] Open Infrastructure Audit modal
- [ ] Complete audit for each lane (Resilience, Stewardship, Competitive)
- [ ] Verify diagnostic text displays correctly
- [ ] Check DevTools Elements - no raw HTML injection

#### Memory Leak Verification
- [ ] Submit Early Access form, close before 2s - no console errors
- [ ] Navigate rapidly between pages
- [ ] Check React DevTools Profiler - no memory growth

#### Environment Validation
- [ ] (Optional) Temporarily rename `NEXT_PUBLIC_CONVEX_URL` in .env.local
- [ ] Verify clear error message appears
- [ ] Restore env var

### Phase 1 Sign-Off
- [x] All verification tests pass
- [x] Build succeeds
- [x] No console errors
- [x] **VERIFIED BY**: Stephen **DATE**: 2026-03-10

### Commit
```bash
git add .
git commit -m "feat(security): Phase 1 - error boundaries, XSS fix, memory leak fixes, env validation"
```
- [ ] Changes committed
- [ ] Commit hash recorded: `_________________`

---

## PHASE 2: CODE QUALITY & CLEANUP

### Pre-Flight
- [x] Phase 1 still works (quick smoke test)
- [x] Build succeeds
- [x] Commit hash recorded: `e480569`

### 2.1 Remove Dead Code
- [ ] Confirmed no imports to `_archive`
- [ ] Deleted `app/about/_archive/`
- [ ] `/about` page still loads

### 2.2 Consolidate Utilities
- [ ] Updated `admin/page.tsx` to use `lib/formatters.ts`
- [ ] Phone formatting works in admin

### 2.3 Fix TypeScript
- [ ] Removed `as any` from ContactModal.tsx
- [ ] `npx tsc --noEmit` passes
- [ ] Contact form still submits

### 2.4 Toast System (Optional)
- [ ] Created ToastProvider
- [ ] Updated all modals
- [ ] Toasts work from all locations

### 2.5 IntersectionObserver
- [ ] Fixed observer recreation in lenders/page.tsx
- [ ] Scroll animations still work
- [ ] Performance improved

### Phase 2 Sign-Off
- [x] Bundle size reduced (3,037 lines deleted!)
- [x] No TypeScript errors
- [x] Build succeeds
- [x] **VERIFIED BY**: Stephen **DATE**: 2026-03-10

---

## PHASE 3: PERFORMANCE

### Pre-Flight
- [x] Phase 2 still works
- [x] Commit hash recorded: `a26e61d`

### 3.1 Query Caching
- [ ] Added cache to `getStats` query
- [ ] Admin stats load faster on return visits
- [ ] Cache invalidates on new submissions

### 3.2 Admin Pagination
- [ ] Added cursor pagination to Convex queries
- [ ] Added pagination UI to admin page
- [ ] Large datasets load without timeout

### 3.3 Image Optimization
- [ ] Replaced `<img>` with `next/image` where applicable
- [ ] Configured domains in `next.config.js`
- [ ] Images load correctly
- [ ] Lighthouse score improved

### 3.4 Dynamic Imports
- [ ] Added dynamic imports for modals
- [ ] Initial load faster
- [ ] Modals still work

### 3.5 Rate Limiting
- [ ] Added rate limiting to uploads
- [ ] Normal uploads work
- [ ] Excess uploads blocked properly

### Phase 3 Sign-Off
- [ ] Admin faster: _____s → _____s
- [ ] Bundle smaller: _____KB → _____KB
- [ ] Build succeeds
- [ ] **VERIFIED BY**: _______________ **DATE**: _______

---

## PHASE 4: TESTING & OBSERVABILITY

### Pre-Flight
- [x] Phase 3 still works
- [x] Commit hash recorded: `df29e3c`

### 4.1 Error Tracking
- [ ] Signed up for Sentry (or alternative)
- [ ] Installed SDK
- [ ] Configured DSN
- [ ] Test error appears in dashboard

### 4.2 Analytics
- [ ] Installed analytics
- [ ] Page views tracked
- [ ] Events tracked:
  - [ ] Contact form submission
  - [ ] Early access signup
  - [ ] Job application
  - [ ] Audit completion

### 4.3 Health Check
- [ ] Created `/api/health`
- [ ] Returns 200 when healthy
- [ ] Returns 503 when Convex down

### 4.4 Tests
- [ ] Installed Vitest
- [ ] Created `formatters.test.ts`
- [ ] `npm test` passes

### 4.5 E2E (Optional)
- [ ] Installed Playwright
- [ ] Created critical path tests
- [ ] Tests pass

### Phase 4 Sign-Off
- [ ] Errors tracked
- [ ] Analytics receiving data
- [ ] Tests pass
- [ ] Build succeeds
- [ ] **VERIFIED BY**: _______________ **DATE**: _______

---

## FINAL VERIFICATION

### Full Regression Test
- [ ] Home page loads
- [ ] Navigation works
- [ ] All forms submit
- [ ] Admin functions
- [ ] File upload works
- [ ] No console errors
- [ ] No memory leaks

### Security
- [ ] XSS fixed
- [ ] Input validation works
- [ ] Rate limiting active

### Performance
- [ ] Build time: _____s
- [ ] Bundle size: _____KB
- [ ] Lighthouse score: _____

### Documentation
- [ ] README updated
- [ ] Environment variables documented

---

## ROLLBACK POINTS

If you need to rollback, use these commit hashes:

| Phase | Commit Hash | Date |
|-------|-------------|------|
| Pre-Implementation | `_________________` | _______ |
| After Phase 1 | `e480569` | 2026-03-10 |
| After Phase 2 | `a26e61d` | 2026-03-10 |
| After Phase 3 | `_________________` | _______ |
| After Phase 4 | `_________________` | _______ |

**Emergency Rollback**: `git checkout safety/audit-implementation`

---

## ISSUES LOG

| # | Phase | Issue | How Fixed |
|---|-------|-------|-----------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## NOTES

