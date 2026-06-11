06/11/26 11:32 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 1.1: Fix TeamSection Icons Touch Targets

**Task ID:** 1.1  
**Title:** Increase TeamSection email/LinkedIn icon tap targets to ≥44px  
**Phase:** 01 - Critical Fixes  
**Priority:** Critical  
**Status:** ✅ Completed in Phase 1 start (see checklist for details + code changes)

## Problem Statement (from original audit)

> TeamSection icons (direct email to contact is correct direction, but tap targets are broken)  
> apps/marketing/app/about/_components/sections/TeamSection.tsx:71-88: `<Mail className="w-4 h-4" />` and same for Linkedin inside `<a>` with only `gap-3`. 16px icons inside minimal padding = ~24–28px effective target at best.  
> On 320–375px phones this is a major usability failure for the exact action the icons were added to support.  
> Cards use fixed `h-80` image containers + `p-4` — tall cards + tiny icons below = poor thumb reach and precision.

## Goal / Desired Outcome

Every team member card's email and LinkedIn icons must have a comfortable **≥44×44px tappable area** while keeping the visual design clean and the existing `/contact?interest=...` prefill behavior intact. The fix must feel intentional, not patched.

## Files to Modify

- `apps/marketing/app/about/_components/sections/TeamSection.tsx` (primary)
- Possibly `globals.css` or `responsive.css` if we introduce a reusable `.touch-target` utility here (recommended for Phase 1.4 synergy)

## Detailed Steps

1. **Explore the current component**
   - Read the full TeamSection.tsx file, especially the icon rendering around lines 71-88.
   - Understand the card structure (fixed h-80 image + content below).
   - Note the current classes on the `<a>` tags and icons.

2. **Design the touch target solution**
   - Option A (preferred): Wrap each icon link in a `<span>` or the `<a>` itself with `min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-2` (or similar) + increase icon to `w-5 h-5` or `w-6 h-6`.
   - Option B: Create a new shared utility `.touch-target-icon` in globals.css or responsive.css and apply it.
   - Decide based on how many other small icons exist (this decision will inform Phase 1.4).

3. **Implement the change**
   - Increase icon size.
   - Add sufficient padding + min dimensions for reliable thumb targeting.
   - Keep the link text or aria-label accessible.
   - Ensure the icons remain visually balanced inside the card footer area.

4. **Add touch feedback**
   - Ensure active/pressed state is visible (scale, background, or opacity change suitable for touch).
   - Test that focus-visible works well.

5. **Verify layout impact**
   - Check that increasing the target area does not cause cards to grow taller or create awkward spacing.
   - On very small screens, ensure the two icons (email + linkedin) don't collide or force wrapping issues.

6. **Test thoroughly**
   - 320px, 375px, 390px, landscape.
   - Real device or simulator preferred.
   - Confirm the query param prefill still works perfectly when tapping the icon.

## Acceptance Criteria

- [ ] Minimum 44×44px tappable area for every email and LinkedIn icon on all team cards
- [ ] Icon visual size is at least 20px (preferably 22–24px) for clarity
- [ ] Clear pressed state on touch
- [ ] No negative impact on card height or vertical rhythm
- [ ] Query param prefill behavior unchanged
- [ ] Passes manual thumb test on smallest phone size
- [ ] No new console warnings or layout shifts

## Potential Gotchas & Watch-outs

- The cards have fixed `h-80` on images — adding padding below might push content. Be careful with the overall card footer spacing.
- There may be other similar icon patterns elsewhere in the site (search for `Mail`, `Linkedin`, or small icon links in about, team, or contact areas).
- Legacy CSS in other files might override padding if specificity is low.
- If the team cards are in a grid, ensure the touch targets don't cause horizontal overflow on 320px.

## References

- Original audit: Critical Issues #1 — TeamSection icons
- Related: Progressive contact form prefill logic (keep this intact — it's a strength)
- Future synergy: This work should feed directly into the reusable touch-target utility created in Task 1.4

## Handoff Notes for Next Agent (fill after completion)

(Use this space or the phase handoff document to record any surprises, decisions, or new patterns discovered while fixing the TeamSection icons.)

---

**Agent Tip:** Start by reproducing the tiny tap target problem yourself on a 320px simulator. Feel the frustration — it will motivate a high-quality fix.
