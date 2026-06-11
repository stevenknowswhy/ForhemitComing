06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 3.4: Implement env(safe-area-inset-*) + Dynamic Viewport Refinements

**Task ID:** 3.4  
**Title:** Full env(safe-area-inset-*) and dvh refinements in chrome and heroes  
**Phase:** 03 - Medium-term Structural Improvements  
**Priority:** High  
**Status:** ✅ Robust foundation (bottom sheet now full env(safe-area-inset-bottom); heroes in home/about/contact use env(top) + dvh + spacing tokens; chrome (header/nav) consistent; added comments for dynamic viewport refinements; builds on Phase 1/2)

## Problem Statement (from original audit)
No obvious env(safe-area-inset-*) in main chrome. Fixed chrome + full-viewport heroes create inconsistent mobile viewport. Dynamic toolbars/notches not fully handled.

From Phase 1/2: We added env(top) + var for chrome/heroes, bottom sheet. Now full implementation + refinements.

From Phase 2 handoff: Safe-area refinements (3.4) can build on the var; use real device data from 2.3.

## Goal / Desired Outcome
Comprehensive use of env(safe-area-inset-*) (top, bottom, left, right) in GlobalHeader, Navigation, bottom sheet, heroes, and any full-bleed elements.
Dynamic viewport (100dvh / dvh) consistently used/refined to handle iOS/Android toolbars without jumps or cut-off content.

## Files to Modify
- `apps/marketing/app/components/layout/GlobalHeader.css`
- `apps/marketing/app/components/layout/navigation.css`
- `apps/marketing/app/home/styles/home-hero.css`
- `apps/marketing/app/styles/home-page.css`
- `apps/marketing/app/about/about-page.css`
- `apps/marketing/app/styles/responsive.css` (tokens if needed)
- Possibly layout.tsx for viewport (already good)

## Detailed Steps
1. Re-read Phase 1/2 handoffs and gotchas on safe-area (devtools insufficient, measure on real).
2. Audit current: search for 100dvh, env(safe-area, padding-top in chrome/heroes.
3. Add full insets:
   - Chrome: padding: env(safe-area-inset-top) env(safe-area-inset-right) ... etc. if needed.
   - Bottom sheet: padding-bottom: env(safe-area-inset-bottom);
   - Heroes: ensure padding uses full env + var; add left/right if full-bleed.
4. Dynamic viewport: prefer dvh where supported, or keep 100dvh + JS fallback if issues. Add comments.
5. Test: use browser devtools + note real device/sim (iOS dynamic island, Android gesture, landscape, keyboard).
6. Update any affected components (e.g. modals if they go full screen).
7. Verify no jumps on toolbar show/hide.

## Acceptance Criteria (Definition of Done for this task)
- [ ] env(safe-area-inset-*) used comprehensively in chrome, sheet, heroes
- [ ] Dynamic viewport (dvh) refinements prevent occlusion/jumps
- [ ] Landscape + keyboard tested in code/emulation
- [ ] Builds on Phase 1/2 var/env without duplication
- [ ] Real device note in handoff (per gotcha)

## Potential Gotchas & Watch-outs (from previous phases or audit)
- iOS vs Android differ (gotcha #3).
- Bottom sheet (Phase 2) must respect bottom inset.
- Changing padding can affect LCP – be careful.
- 100dvh vs dvh: dvh is dynamic, use where possible.
- Legacy in other CSS may interfere – search first.

## References
- Phase 1/2 handoffs: env + var already partial; refine in 3.4.
- Original audit: no env in chrome; viewport issues.
- responsive.css for any shared.

## Handoff Notes for Next Agent (if this task reveals something important)
(Fill after – measured values, specific refinements, remaining files)

---

**Instructions for Agent:** Prioritize real/sim testing. Update checklist. Add to gotchas if new issues with insets.
