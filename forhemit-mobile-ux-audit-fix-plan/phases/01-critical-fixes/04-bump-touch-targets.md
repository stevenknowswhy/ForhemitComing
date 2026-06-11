06/11/26 11:32 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 1.4: Bump All Small Buttons, Close Icons & Interactive Elements to ≥44px

**Task ID:** 1.4  
**Title:** Create and apply global touch-target standards across the site  
**Phase:** 01 - Critical Fixes  
**Priority:** High (foundational)  
**Status:** ✅ Started (utilities + key applies for contact/theme/hamburger/team; full sweep deferred per plan to later in phase or Phase 2)

## Problem Statement (from original audit)

Multiple places still have undersized interactive elements:
- `.contact-modal-close` is only 36×36px
- Theme toggle, secondary links, small icons, accordion triggers, etc.
- Many "mobile fixes" exist in narrow scopes but are not applied globally or consistently.
- Reduced-motion and focus-visible are handled globally (positive), but not all interactive states (especially small icons) have clear pressed/hover feedback on touch.

## Goal / Desired Outcome

Introduce a reusable, documented touch-target system so that **no interactive element on mobile is ever smaller than 44×44px** again. This becomes the foundation that Phase 2 and 3 build upon.

## Files to Modify

- `globals.css` or `responsive.css` — add `.touch-target`, `.touch-target-icon`, button/input base improvements
- `packages/shared/src/styles/contact-modal.css` — fix modal close button
- Any other modal or component files with small close icons
- Theme toggle component
- Scattered small icons/links identified during audit

## Detailed Steps

1. **Create reusable utilities (recommended approach)**
   - Add to globals.css or a new `touch-targets.css`:
     ```css
     .touch-target {
       min-width: 44px;
       min-height: 44px;
       display: inline-flex;
       align-items: center;
       justify-content: center;
       padding: 8px; /* generous hit slop */
     }
     .touch-target-icon {
       min-width: 44px;
       min-height: 44px;
       display: inline-flex;
       align-items: center;
       justify-content: center;
       padding: 10px;
     }
     ```
   - Also improve base button and link styles for touch feedback.

2. **Apply to known problem areas**
   - Contact modal close button (increase from 36px)
   - Theme toggle
   - Any remaining small icons in TeamSection (coordinate with Task 1.1), accordions, pro-links, etc.
   - Modal close buttons across ApplicationModal, ClassificationIntakeModal, etc.

3. **Add visual pressed states**
   - Ensure `active:` or touch-specific styles give clear feedback.

4. **Audit sweep**
   - Use browser dev tools element inspector or a quick script to find other small clickable areas.
   - Prioritize anything in the critical conversion path (hero CTAs, contact, team outreach).

5. **Document the new utility**
   - Add comments explaining when to use `.touch-target` vs `.touch-target-icon`.
   - Update the improved-agent-prompt or a new MOBILE_UX_GUIDE.md if it grows.

## Acceptance Criteria

- [ ] Reusable `.touch-target` and `.touch-target-icon` utilities exist and are documented
- [ ] Contact modal close button is ≥44px with good hit slop
- [ ] Theme toggle and all other small interactive elements in scope meet the minimum
- [ ] Clear pressed states on touch for all updated elements
- [ ] No visual breakage on desktop (utilities are mobile-friendly by default or scoped)
- [ ] Ready for global rollout in Phase 2

## Potential Gotchas & Watch-outs

- Some design elements intentionally use small visual icons — use generous invisible hit slop (padding) rather than making the visual larger.
- CSS specificity battles with existing component styles.
- Modal overlays may have their own stacking context issues.

## References

- Original audit: Critical Issues #4 and several Major/Minor mentions of small targets
- Synergy with Task 1.1 (TeamSection) and Phase 2 global enforcement

## Handoff Notes for Next Agent

(Record the exact utility class names chosen and any components that were particularly tricky to update.)

---

**This task turns one-off fixes into a sustainable system.** Do it well and Phase 2 becomes much easier.
