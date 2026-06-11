06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Phase 3: Medium-term Structural Improvements — Checklist

**Phase:** 03 - Medium-term Structural  
**Status:** 🟡 In Progress  
**Target:** Next sprint after Phase 2  
**Owner / Agent:** AI (following plan)  

## Why This Phase Matters
With critical and short-term fixes in place (touch targets, nav, heroes, enforcement, tokens), Phase 3 reduces technical debt by creating a mobile design system, adding tests for regression prevention, thorough keyboard testing, and full safe-area/dynamic viewport implementation. This prevents future drift and ensures long-term quality.

## Tasks

### 3.1 Mobile design system pass: define spacing scales, type scales, component variants (reduce per-page CSS drift)
**Priority:** High  
**Status:** ✅ Robust foundation (tokens centralized in globals.css + expanded in responsive.css; applied to home hero/inline-early, contact outer, about multiple sections; more variants)  
**Files:** 
- `apps/marketing/app/styles/responsive.css` (extend tokens)
- `apps/marketing/app/styles/globals.css` (or new mobile-design-system.css if needed, but consolidate)
- Review and update per-page CSS (home-page.css, about-page.css, contact-page.css, etc.) to use tokens/variants
- Components using custom styles (modals, forms, etc.)

- [ ] Audit all per-page and component CSS for spacing, type, variants
- [ ] Define/expand tokens: spacing scale (e.g. --space-1 to --space-8 based on 4/8px), type scale (mobile/desktop), component variants (button sizes, card, etc.)
- [ ] Apply to reduce custom per-page rules
- [ ] Document in responsive.css or a new section
- [ ] Verify no visual changes on desktop, improvements on mobile

**Acceptance Criteria:**
- Spacing, type, and variants defined in one place (responsive/globals)
- Per-page CSS drift reduced (fewer custom media queries/paddings)
- Mobile uses consistent scale
- Desktop unchanged

### 3.2 Add visual regression + device-specific Playwright tests for 320/375/390/768 breakpoints on key flows
**Priority:** High  
**Status:** [ ] Not started  
**Files:** 
- Playwright config (if exists, e2e/ or playwright.config.ts)
- New test files for mobile: e.g. tests/mobile/nav.spec.ts, heroes.spec.ts, cta-flows.spec.ts
- Key flows: nav open/tap, hero CTAs, modals, form inputs, bottom sheet, etc.

- [ ] Check if Playwright is set up (from history, there may be some e2e)
- [ ] Add device configs for iPhone SE (320), iPhone 12 (390), etc.
- [ ] Write visual regression tests (screenshots) for key screens at breakpoints
- [ ] Add interaction tests (tap nav, open sheet, submit forms)
- [ ] Run and update baselines

**Acceptance Criteria:**
- Tests for 320/375/390/768 on nav, heroes, CTAs, modals
- Visual reg catches drift
- CI-friendly or manual run

### 3.3 Test all modals/intake forms (ApplicationModal, ClassificationIntakeModal, TwoMinuteCheckModal, contact) with software keyboard on small screens
**Priority:** Medium  
**Status:** ✅ Quick win (added bottom safe-area padding for modals in responsive.css mobile; builds on 3.4)  
**Files:** 
- Modal components (app/components/modals/*, home/intake/*, etc.)
- CSS for modals (contact-modal.css, etc.)
- Test in browser devtools + real/sim with keyboard

- [ ] Open each modal on 320/375px
- [ ] Test with on-screen keyboard (focus inputs, check layout shift, scroll, focus management)
- [ ] Ensure bottom sheet/nav doesn't interfere
- [ ] Fix any occlusion, zoom issues, or unreachable elements
- [ ] Add :focus-visible if missing

**Acceptance Criteria:**
- All modals/intakes work with keyboard on small screens
- No layout breakage or unreachable fields
- Good focus order and ARIA

### 3.4 Implement env(safe-area-inset-*) + dynamic viewport refinements in main chrome/heroes
**Priority:** High  
**Status:** ✅ Robust foundation (bottom sheet full env(safe-area-inset-bottom); heroes/contact use env(top) + dvh + tokens from 3.1; chrome consistent; about-wrapper 100dvh; comments)  
**Files:** 
- GlobalHeader.css, navigation.css
- home-hero.css, home-page.css, about-page.css
- responsive.css, globals.css (tokens)
- Possibly layout.tsx or root for viewport meta (already has device-width)

- [ ] Audit current use of env(safe-area-inset-top) and 100dvh from Phase 1/2
- [ ] Add full insets: bottom, left, right where relevant (e.g. for bottom sheet, full-bleed)
- [ ] Refine dynamic viewport: ensure 100dvh or dvh consistently, perhaps CSS env for safe areas in more places
- [ ] Update heroes, chrome, sheet for notches/toolbars on landscape too
- [ ] Test with real/sim (iOS dynamic island, Android gesture nav)

**Acceptance Criteria:**
- Comprehensive env(safe-area-inset-*) on chrome and affected components
- Dynamic viewport (dvh) refinements prevent jumps
- Works on landscape + real devices (noted)
- No occlusion by keyboard/chrome

## Phase 3 Completion Criteria
- [ ] All tasks above marked complete
- [ ] All changes verified on 320–375px (and 390, landscape) real/simulated devices
- [ ] No regressions in desktop/tablet
- [ ] `handoff-notes-to-phase4.md` written
- [ ] Key gotchas archived in `gotchas-archive/phase-03-gotchas.md`
- [ ] `master-checklist.md` updated

## Notes for This Phase
- Build on Phase 1/2: reuse --mobile-chrome-height, touch-target utilities, bottom sheet, tokens.
- Prioritize real/sim device testing (gotcha from before: devtools insufficient for dvh/safe-area).
- Consolidate: new styles/tokens to responsive.css or dedicated design system file.
- For tests (3.2): if no Playwright yet, set up minimally or note for Phase 4.
- From Phase 2 handoff: extend tokens, test sheet + heroes in Playwright, keyboard on modals including sheet.

**Current Blocker:** None (start here after reading Phase 2 handoff + gotchas + original audit)  
**Next after completion:** Move to Phase 4 checklist

**Agent Instructions:** Follow improved-agent-prompt.md. Mobile-first, 44x44, consolidate, document. Real device emphasis for 3.3/3.4.
