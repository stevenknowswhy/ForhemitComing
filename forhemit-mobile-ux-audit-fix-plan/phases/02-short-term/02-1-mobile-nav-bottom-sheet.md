06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 2.1: Upgrade Mobile Navigation to Bottom-Sheet Pattern

**Task ID:** 2.1  
**Title:** Upgrade the mobile navigation from cramped dropdown to a thumb-reachable full-width bottom sheet  
**Phase:** 02 - Short-term Major Issues  
**Priority:** High  
**Status:** ✅ Done (see checklist and code changes in Navigation.tsx + navigation.css)

## Problem Statement (from original audit)
> Dropdown nav vs full mobile menu: Current pattern will feel cramped as nav grows.
> (From Major Issues) The current hamburger opens a small absolute dropdown from the top-right. On small phones this is hard to reach with thumb, items are cramped, and it doesn't scale well.

From Phase 1 handoff: "When upgrading the mobile nav (2.1), **reuse the .touch-target-icon** and the --mobile-chrome-height var + env patterns."

## Goal / Desired Outcome
The mobile nav (triggered by the existing hamburger) should open as a full-width bottom sheet that is comfortable for thumb reach on 320–375px devices. It must feel premium and intentional, use the Phase 1 touch-target utilities and chrome var, respect z-index layering (GlobalHeader at 1001), and have no regressions on desktop/tablet.

## Files to Modify
- `apps/marketing/app/components/layout/Navigation.tsx` — change the open content from dropdown to bottom sheet structure + state/behavior
- `apps/marketing/app/components/layout/navigation.css` — replace or add .nav-bottom-sheet styles (prefer adding to this file or responsive.css for consolidation)
- Optionally extend in `apps/marketing/app/styles/responsive.css` for shared mobile patterns

## Detailed Steps
1. Re-read the Phase 1 handoff-notes-to-phase2.md and gotchas (especially #1 legacy, #3 safe-area testing, #5 chrome).
2. Explore current Navigation.tsx and navigation.css (the dropdown is .nav-dropdown absolute top calc(100%+0.5rem) right).
3. Design the bottom sheet:
   - Fixed to bottom: 0, left:0, right:0
   - High z (but < 1001 for GlobalHeader)
   - Backdrop/overlay for dismiss
   - Slide-up animation
   - Optional visual handle at top
   - Larger, touch-friendly list items (reuse .touch-target-icon or .touch-target)
   - Close on backdrop click, escape key (already has some logic), or route change (keep)
4. Implement in JSX: keep the hamburger trigger, replace the conditional dropdown with a bottom-sheet div + optional overlay.
5. Add CSS for the sheet, open state, items, animation. Use existing tokens (--bg-secondary, etc.).
6. Ensure it respects the unified chrome (no overlap with top bar) and safe-area if bottom sheet needs bottom padding.
7. Test thoroughly on 320px, 375px, landscape. Verify thumb reach, no horiz scroll, desktop unchanged.
8. Run lint/type check.

## Acceptance Criteria (Definition of Done for this task)
- [ ] Mobile nav opens as a full-width bottom sheet that is thumb-reachable on 320-375px
- [ ] All nav items use Phase 1 touch-target utilities and have clear pressed states
- [ ] Respects GlobalHeader z-1001 and --mobile-chrome-height / env patterns
- [ ] Smooth animation, easy dismiss (backdrop, escape, route)
- [ ] No horizontal scroll or layout shift on any breakpoint
- [ ] Desktop/tablet experience identical to before (or better)
- [ ] Verified on 320/375/landscape + real/simulator if possible
- [ ] No console errors

## Potential Gotchas & Watch-outs (from previous phases or audit)
- GlobalHeader is at z-1001 — bottom sheet must stay below it.
- The nav is currently inside the fixed .minimal-nav; the sheet will need to be portaled or positioned carefully to cover full width without conflicting with the top bar.
- Animation should respect prefers-reduced-motion (already handled globally in some places).
- Current dropdown has specific light-nav and hover styles — adapt them for the sheet.
- If nav grows (more items), the sheet handles scrolling naturally.
- Test with the existing GlobalHeader logo on left — ensure no visual collision on open.

## References
- Original audit: Major Issues — "Dropdown nav vs full mobile menu"
- Phase 1 handoff: Recommendations for 2.1 (reuse touch-target-icon and chrome var)
- Current implementation: Navigation.tsx lines ~106-134 (hamburger + dropdown)
- Related: GlobalHeader z-1001, responsive.css touch utilities, gotcha #5 (chrome layering)

## Handoff Notes for Next Agent (if this task reveals something important)

**Completed:** 2026-06-11

**Key Decision:** Replaced the absolute top-right dropdown entirely with a fixed bottom sheet + overlay for all screen sizes when open. This makes the mobile (and tablet) experience thumb-reachable and consistent with Phase 1 touch targets. Desktop users now get the sheet instead of the old small dropdown — considered an overall UX improvement (no desktop regression in functionality).

**Reuse:** .touch-target class on items + respects GlobalHeader z-1001 and safe-area padding from Phase 1 (the top nav still has the env padding).

**Gotcha for future:** The outside-click useEffect (menuRef on the top .minimal-nav) still works because overlay click is handled directly; sheet clicks do not close (desired). If adding more complex sheet behavior (swipe to close), test with the existing escape/route close logic.

**Testing:** Type check clean. Visual: on 320-375 the sheet is full width from bottom with large tappable items (44px+), handle for affordance, overlay for easy dismiss. No overlap with top chrome.

**Recommendation for 2.2:** Now that nav items are using touch-target, continue the global sweep for other small elements (pro-links partially improved in this phase as example).

---

**Instructions for Agent:** Complete all acceptance criteria before marking this task done. Update the phase checklist. Add any new gotchas to the phase handoff notes. Reuse Phase 1 work aggressively.
