06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 2.2: Global Audit + Enforcement of Touch-Target and 16px Font Rules

**Task ID:** 2.2  
**Title:** Systematically apply .touch-target utilities and 16px+ font minimums across the entire site  
**Phase:** 02 - Short-term Major Issues  
**Priority:** High  
**Status:** Not Started

## Problem Statement (from original audit)
> CTAs and buttons: Many secondary elements rely on partial enforcement.
> Very small text and icons elsewhere drop below comfortable size.
> Reduced-motion handled globally but not all interactive states have clear pressed feedback on touch.

From Phase 1 handoff: "Global enforcement (2.2) can now systematically apply touch-target to remaining small elements; finish the two open 1.4 subs (focus-visible, extra slop where visual <44px)."

## Goal / Desired Outcome
Every interactive element on mobile (≤768px) meets the 44×44px target using the Phase 1 utilities. Body and important text never drops below ~16px / 0.75rem on phones. All new/changed elements have excellent focus-visible and pressed states. The site feels consistent and premium on small screens without one-off fixes.

## Files to Modify
- `apps/marketing/app/styles/responsive.css` (extend utilities if needed)
- Sweep and update across components and pages: CTAs, pro-links, modals (other than contact which was done), forms, hero links, secondary buttons, accordions, etc.
- Any remaining small icons or text in home, about, contact, etc.

## Detailed Steps
1. Re-read Phase 1 handoff (especially open 1.4 items) and gotchas #2 (specificity), #4.
2. Audit the site: Use dev tools at 320px and 375px. Search for small classes (w-3, w-4, text-xs, text-sm, padding <0.5rem on buttons/links, etc.).
3. Prioritize conversion path: hero CTAs, pro-links, contact form elements, modals, nav (already partly done).
4. Apply .touch-target or .touch-target-icon + states.
5. For text: ensure min font-size 0.75rem or 16px in mobile media where appropriate (build on responsive.css base).
6. Add or improve focus-visible and active/pressed where missing.
7. Verify no desktop breakage (utilities are mobile-friendly by default or scoped).
8. Test on multiple breakpoints + landscape.

## Acceptance Criteria (Definition of Done for this task)
- [ ] Comprehensive audit completed (list of fixed areas in handoff)
- [ ] All interactive elements on mobile have ≥44×44px tap area (using Phase 1 utilities)
- [ ] Generous hit slop where visual size must stay smaller for design reasons
- [ ] Focus-visible and pressed states are excellent on touch
- [ ] Important text ≥0.75rem / comfortable size on phones
- [ ] No regressions on desktop/tablet
- [ ] Verified on 320/375/390/landscape

## Potential Gotchas & Watch-outs (from previous phases or audit)
- Specificity battles with existing Tailwind/component styles (use the utility at the right DOM level).
- Some design elements intentionally small visually — use padding hit slop, not make everything big.
- Check other pages (lenders, brokers, etc.) and modals (ApplicationModal, etc.).
- 16px font lock is already in responsive for inputs — extend the spirit to other text.

## References
- Original audit: Major/Minor — CTAs, small text/icons, pressed feedback
- Phase 1: 1.4 task + utilities created in responsive.css + touch-target-icon
- Handoff from Phase 1: explicit call to finish open 1.4 subs in 2.2
- responsive.css: existing .touch-target rules and form 16px protections

## Handoff Notes for Next Agent (if this task reveals something important)

**Audit findings (Phase 2.2):**
- Applied .touch-target to key CTAs/buttons in business-owners (cta-button, ghost), error/not-found pages (primary/secondary buttons, email link), esop calendar (nav arrows + today).
- Extended global mobile rules in responsive.css for buttons/links/icons + 16px font floor on <480px (covers body, p, small text classes, pro-links, etc.).
- Finished remaining 1.4 focus-visible/active (already in utilities) + slop (padding in .touch-target-icon).
- Pro-links in home-hero bumped to 0.75rem on mobile (from original audit major issue).
- Other small elements (blog, broker-screening, coming-soon, globals small paddings) noted but deprioritized as non-core marketing conversion paths; can be swept in Phase 4.

**Recommendation:** Use browser inspector at 320px to find any missed (e.g., accordion triggers, secondary icons). The global CSS rule + class application should cover 95% without per-page bloat.

---

**Instructions for Agent:** Complete all acceptance criteria before marking this task done. Update the phase checklist. Add any new gotchas. This task makes the site consistent after the critical fixes.
