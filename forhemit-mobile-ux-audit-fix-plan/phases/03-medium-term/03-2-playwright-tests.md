06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 3.2: Add Visual Regression + Device-Specific Playwright Tests

**Task ID:** 3.2  
**Title:** Add Playwright visual regression and device-specific tests for key breakpoints and flows  
**Phase:** 03 - Medium-term Structural Improvements  
**Priority:** High  
**Status:** Not Started

## Problem Statement (from original audit)
No automated tests mentioned; reliance on manual. Risk of future regressions in mobile (small text, touch, heroes, nav).

From Phase 2 handoff: For Playwright tests (3.2), add visual reg at 320/375/390/768 for nav sheet, heroes (above fold), key CTAs with touch states.

## Goal / Desired Outcome
Playwright tests (or setup if missing) covering:
- Visual regression (screenshots) at 320, 375, 390, 768 on key pages/flows.
- Interaction tests for mobile: nav/bottom sheet, hero CTAs, modals, forms.
Prevents drift and catches issues early.

## Files to Modify
- playwright.config.ts (or e2e/playwright.config if exists)
- New tests: e2e/mobile/ (e.g. nav.spec.ts, hero.spec.ts, cta.spec.ts, modal.spec.ts)
- Possibly package.json for deps if not present
- .github/workflows if CI, but minimal

## Detailed Steps
1. Check current test setup: list e2e/, read playwright.config.ts or package.json scripts.
2. If no Playwright: add minimal setup (but per plan, assume or note; from history there are e2e mentions).
3. Configure devices: use playwright's iPhone SE, Pixel, etc. for 320/375/390/768.
4. Write tests:
   - Visual: await page.goto('/'); expect(page).toHaveScreenshot('home-320.png'); at different viewports.
   - Interactions: click hamburger, assert bottom sheet visible, tap item, etc.
   - Key flows: home hero CTA, about team icons (to contact), contact form, modals.
5. Run tests, update snapshots.
6. Document how to run (e.g. npx playwright test --project=mobile).

## Acceptance Criteria (Definition of Done for this task)
- [ ] Tests exist for 320/375/390/768 on nav, heroes, CTAs, modals
- [ ] Visual regression (screenshots) for key screens
- [ ] Interaction tests pass (tap, keyboard if possible)
- [ ] Can run on 320-768 viewports
- [ ] No false positives; baselines updated

## Potential Gotchas & Watch-outs (from previous phases or audit)
- Playwright may not be fully set up – check for @playwright/test in deps.
- Visual tests are flaky on dynamic content (use stable selectors, mask dynamic parts like dates).
- Device emulation vs real: note that for safe-area/dvh, real devices better (cross-ref gotcha).
- Bottom sheet animation: wait for stable state before screenshot.
- Focus on marketing/app; skip heavy admin/blog if separate.

## References
- Phase 2 handoff: add visual reg for nav, heroes, CTAs at breakpoints.
- Original plan: device-specific Playwright tests for key breakpoints on key flows.
- Current e2e/ if any (from history mentions).

## Handoff Notes for Next Agent (if this task reveals something important)
(Fill after – e.g. if setup was missing, what was added, flaky tests found)

---

**Instructions for Agent:** If Playwright not present, set up minimally or defer to Phase 4. Update checklist. Add gotchas. Tests should cover mobile-specific issues from audit (touch, small screens, chrome).
