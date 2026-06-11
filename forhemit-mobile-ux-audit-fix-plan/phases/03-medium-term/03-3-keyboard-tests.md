06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 3.3: Test Modals/Intake Forms with Software Keyboard on Small Screens

**Task ID:** 3.3  
**Title:** Thorough keyboard testing on modals and long forms on small screens  
**Phase:** 03 - Medium-term Structural Improvements  
**Priority:** Medium  
**Status:** Not Started

## Problem Statement (from original audit)
Modals and forms need testing with software keyboard. Risk of occlusion, layout shift, unreachable elements on small screens with on-screen keyboard.

From Phase 2 handoff: Modal/keyboard tests (3.3) should include the new bottom sheet (focus, escape, scroll).

## Goal / Desired Outcome
All modals (contact, Application, ClassificationIntake, TwoMinuteCheck, etc.) and intake forms work perfectly when software keyboard is open on 320/375px:
- No occlusion of fields/buttons.
- Proper scrolling/focus.
- Good UX (no zoom issues, accessible).

## Files to Modify
- Modal components: app/components/modals/* (ContactModal, etc.), home/intake/* (ClassificationIntakeModal, etc.), forms/application/*
- CSS: contact-modal.css, application-modal.css, etc. (add keyboard-specific if needed, e.g. .modal--keyboard-open)
- Possibly responsive.css for global keyboard handling

## Detailed Steps
1. Re-read Phase 2 handoff for bottom sheet inclusion.
2. In devtools (Chrome: toggle device toolbar, show keyboard or use mobile emulation with input focus).
3. Test each:
   - Open modal/form on 320px.
   - Focus text inputs, textareas.
   - Check if keyboard covers anything (use safe-area or adjust bottom padding dynamically if needed).
   - Scroll to bottom fields.
   - Submit, close.
4. For bottom sheet nav: ensure when open, keyboard doesn't break it (rare but test).
5. Fix issues: e.g. add padding-bottom on keyboard open, better focus management, ARIA.
6. Add :focus-visible if missing on form elements.
7. Test with real/sim if possible (iOS/Android keyboard).

## Acceptance Criteria (Definition of Done for this task)
- [ ] All listed modals/intakes tested with keyboard on 320/375
- [ ] No occlusion, layout shifts, or unreachable elements
- [ ] Bottom sheet unaffected
- [ ] Good focus order, labels, submit works
- [ ] Fixes documented (e.g. CSS for keyboard)

## Potential Gotchas & Watch-outs (from previous phases or audit)
- iOS vs Android keyboards differ in height/behavior.
- Dynamic viewport (dvh) helps but test with 100dvh + env.
- Bottom sheet from Phase 2 may need z or positioning tweaks with modals.
- Long forms (intake) are critical for conversion.
- Cross-ref Phase 1/2: forms already have 44px inputs, 16px fonts – build on that.

## References
- Phase 2 handoff: test modals/intake with keyboard, include bottom sheet.
- Plan: thorough modal + long-form keyboard testing on small screens.
- Current modal CSS and components.

## Handoff Notes for Next Agent (if this task reveals something important)
(Fill after – e.g. specific fixes needed, keyboard height measurements)

---

**Instructions for Agent:** Use devtools mobile emulation + "show virtual keyboard" or manual focus. Prioritize contact and intake flows. Update checklist.
