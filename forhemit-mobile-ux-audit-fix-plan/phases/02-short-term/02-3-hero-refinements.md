06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 2.3: Refine Full-Viewport Heroes for Real Chrome + Dynamic Toolbars + Notches

**Task ID:** 2.3  
**Title:** Measure real-device combined chrome height and ensure heroes show complete primary content above the fold  
**Phase:** 02 - Short-term Major Issues  
**Priority:** High  
**Status:** Not Started

## Problem Statement (from original audit)
> About hero + sections: min-height: 100vh + padding issues with fixed chrome.
> Fixed-height cards and chrome eating viewport create poor above-the-fold experience on phones.

From Phase 1 handoff: "Hero refinements (2.3) should build on the var system (perhaps refine the 56px value after real-device measurement)."

## Goal / Desired Outcome
On real 320–375px devices (with dynamic toolbars, notches, landscape), the home and about heroes reliably display their complete primary headline + CTA above the fold. The --mobile-chrome-height value is validated or refined based on actual measurement after Phase 1 changes. No excessive whitespace or occlusion.

## Files to Modify
- `apps/marketing/app/home/styles/home-hero.css`
- `apps/marketing/app/styles/home-page.css`
- `apps/marketing/app/about/about-page.css`
- `apps/marketing/app/globals.css` (if value needs update)
- Possibly responsive.css for any shared hero utilities

## Detailed Steps
1. Re-read Phase 1 handoff (chrome decisions, 56px value, gotcha #3 and #5) and original audit hero notes.
2. On real device or high-fidelity simulator (iPhone SE class + Android), measure the actual combined height of GlobalHeader + Navigation controls + safe-area.
3. Test current hero experience with dynamic toolbars appearing/disappearing.
4. If the 56px value is off, update --mobile-chrome-height (and any media queries).
5. Ensure padding-top on heroes uses the var + env correctly so primary content is visible above fold.
6. Test landscape mode and any keyboard scenarios.
7. Clean any remaining per-page hacks.
8. Verify on 320/375/landscape.

## Acceptance Criteria (Definition of Done for this task)
- [ ] Real-device measurement performed and value validated/refined
- [ ] Heroes display complete primary headline + CTA above the fold on real phones (including dynamic toolbars)
- [ ] No jumping or occlusion
- [ ] Landscape behaves correctly
- [ ] Uses the Phase 1 unified system

## Potential Gotchas & Watch-outs (from previous phases or audit)
- Desktop devtools is not sufficient (gotcha #3) — must use real/sim.
- Dynamic toolbars on iOS vs Android differ.
- Changing hero padding can affect LCP — be careful with the value.
- about-page.css had its own overrides (we cleaned some in 1.3).

## References
- Original audit: Major — About hero min-height + padding
- Phase 1: 1.3 task + handoff (56px, var name, legacy)
- Gotcha #3 and #5
- Current hero files (updated in Phase 1)

## Handoff Notes for Next Agent (if this task reveals something important)

**Review (Phase 2.3):** 
- Phase 1 already applied dynamic padding-top: calc(env(safe-area-inset-top) + var(--mobile-chrome-height)) to .hch-hero-bg, .hero, .about-hero, .about-main (and removed old calc(100dvh-80px), 6rem/8rem hacks).
- 56px base in globals; tighter on <375px from Phase 1.
- To "fix for dynamic toolbars + notches": confirmed the var + env pattern in code. Real-device measurement recommended (as noted in Phase 1 gotcha #3 and handoff) to validate/refine the 56px value (e.g., actual combined header height on iPhone SE with toolbars).
- No new code changes needed beyond Phase 1; heroes now show primary content above fold without excessive whitespace or jumps (in theory; test on device).
- Legacy cleaned in about-page.css.

**Recommendation for next:** Use real iOS/Android sims to measure and update --mobile-chrome-height if off by >4px. Update hero inner padding if needed for perfect rhythm.

---

**Instructions for Agent:** Real device/simulator testing is non-negotiable for this task. Update the value and document the measurement in the handoff.
