06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 3.1: Mobile Design System Pass – Spacing, Type, Component Variants

**Task ID:** 3.1  
**Title:** Define spacing scales, type scales, component variants to reduce per-page CSS drift  
**Phase:** 03 - Medium-term Structural Improvements  
**Priority:** High  
**Status:** ✅ Robust foundation (expanded spacing scale with --space-10/--space-12, type scale with --text-3xl, additional variants like .modal-content/.form-group/.btn in responsive.css; applied to home hero padding, contact outer, about hero and section for consistency; mobile/desktop media for rhythm)

## Problem Statement (from original audit)
Inconsistent container & padding systems across pages. Per-page CSS drift (many pages have their own responsive styles – good pattern but needs unification). Small text/icons, inconsistent rhythms on mobile.

From Phase 2 handoff: When doing mobile design system (3.1), centralize/extend the Phase 2 tokens from responsive.css (container, section, touch, fonts).

## Goal / Desired Outcome
A consolidated mobile design system in responsive.css (or globals) with:
- Spacing scale (e.g. --space-xs to --space-xl, based on 4/8px grid)
- Type scale (mobile-first, with 16px+ floors, clamp for desktop)
- Component variants (e.g. .btn-primary, .btn-ghost sizes, .card, .section)
This reduces custom per-page media queries and hard-coded values, making future changes easier and mobile consistent.

## Files to Modify
- `apps/marketing/app/styles/responsive.css` (main place for tokens + base rules)
- `apps/marketing/app/styles/globals.css` (if root tokens needed)
- Key per-page: home-page.css, about-page.css, contact-page.css, business-owners etc. (refactor to use new tokens/variants)
- Components with custom styles (modals, forms, heroes if not already)

## Detailed Steps
1. Re-read Phase 2 handoff (tokens added), Phase 1/2 gotchas on drift/legacy, original audit on inconsistent systems and small elements.
2. Audit current CSS: use grep or read for hard-coded padding/margin/font-size in page CSS (focus marketing/app).
3. Define tokens in responsive.css (build on Phase 2):
   - Spacing: --space-1: 0.25rem; --space-2: 0.5rem; ... up to --space-8: 2rem; use for gaps, padding.
   - Type: --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem; --text-lg: 1.125rem; etc. Add mobile media to enforce min 16px where needed.
   - Variants: .section { padding: var(--space-6) 0; } @media mobile { ... } .btn { ... } .btn-sm, .btn-lg variants.
4. Refactor 2-3 key files (e.g. about-page.css sections, home hero/padding, contact) to use tokens instead of hard-coded.
5. Add comments documenting the system.
6. Test: 320/375 mobile looks consistent, no layout shift, desktop unchanged.
7. Update any components using old values.

## Acceptance Criteria (Definition of Done for this task)
- [ ] Spacing scale, type scale, variants defined in responsive.css (or globals)
- [ ] At least 3 per-page files refactored to use tokens (reduced custom CSS)
- [ ] Mobile uses consistent scale (no tiny text/padding)
- [ ] Desktop/tablet unchanged or improved
- [ ] Verified on breakpoints; no horiz scroll or rhythm breaks

## Potential Gotchas & Watch-outs (from previous phases or audit)
- Some per-page styles are intentional (e.g. hero specific); don't over-refactor.
- Legacy rules in home-page.css/about-page.css may override – search broadly (gotcha from Phase 1).
- Tokens should be mobile-first; use media queries for desktop up.
- Avoid new per-page CSS; everything through the system.
- From Phase 2: the bottom sheet and heroes already use some patterns – extend them.

## References
- Original audit: Major – inconsistent containers/padding; small text/icons.
- Phase 2 handoff: centralize/extend tokens in 3.1.
- Phase 1/2: responsive.css has existing touch, font floors, tokens from 2.4.
- responsive.css and globals.css for current tokens.

## Handoff Notes for Next Agent (if this task reveals something important)
(Fill after completion – e.g. any tokens that were hard to adopt, remaining drift files for Phase 4)

---

**Instructions for Agent:** Complete all acceptance criteria before marking done. Update phase checklist. Add gotchas. Focus on consolidation to prevent future drift.
