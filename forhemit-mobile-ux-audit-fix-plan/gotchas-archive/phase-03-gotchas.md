06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Phase 03 Gotchas Archive — Medium-term Structural Improvements

**Purpose:** Permanent record of hard-won lessons from Phase 3. Future agents (and humans) should read this before starting any mobile work.

**Date Archived:** 2026-06-11 (Phase 3 in progress; updates as completed)

---

## Gotcha #1: Design system tokens must be adopted gradually to avoid breaking intentional design variations

**What happened:** 
Adding full spacing/type scales and variants (btn, card, section) in responsive.css is powerful for reducing drift, but hero-specific styles (gradients, clamps) and per-page variations (about-section-alt etc.) exist for a reason. Over-applying tokens early could flatten the premium look.

**Resolution:** 
Defined comprehensive scales in responsive.css (mobile-first with media for floors). Refactored only layout examples (e.g. .about-section to use --space-6). Left hero/component specifics intact with comments. 

**Rule for all future work:** 
Audit with grep for hard-coded padding/font before refactoring. Use tokens for rhythm/consistency (sections, containers, buttons), keep brand-specific in their files. Phase 4 can do broader adoption. Cross-ref Phase 2 gotcha on tokens.

**Related files:** responsive.css (new design system section), about-page.css (example), home-page.css, globals.css.

---

## Gotcha #2: Safe-area and dvh refinements require real-device validation even after code changes

**What happened:** 
Phase 1/2 added env(top) + var for chrome/heroes, bottom sheet padding. Expanding to full insets (bottom for sheet, left/right if needed) and dvh notes is good, but iOS/Android toolbars, notches, landscape, and keyboard push differ. Emulation helps but isn't perfect (e.g. dynamic island height).

**Resolution:** 
Added padding-bottom: calc(...) + env(safe-area-inset-bottom) to nav-bottom-sheet. Noted dvh preference and testing in task. No over-refactoring.

**Rule for all future work:** 
Always test with real/sim (iPhone SE + toolbars, Android gesture, landscape, software keyboard). Measure actual safe areas if possible. Update --mobile-chrome-height or add more env if jumps/occlusion. See Phase 1 gotcha #3, Phase 2 gotcha #2. Bottom sheet must not be covered by home indicator.

**Related files:** navigation.css (sheet), GlobalHeader.css, home-hero.css, about-page.css, responsive.css.

---

## Gotcha #3: Playwright and keyboard tests (3.2/3.3) depend on setup and emulation limits

**What happened:** 
Playwright may not be fully configured in the project (only mentioned in plan/history e2e). Keyboard testing relies on devtools emulation, which approximates but doesn't perfectly match real iOS/Android keyboard heights/behavior or bottom sheet interaction.

**Resolution:** 
Task files include setup steps and notes. For now, focused on code (3.1/3.4) and documented what tests should cover (sheet + modals, visual at breakpoints). 

**Rule for all future work:** 
If no full Playwright, add minimal config + devices (iPhone SE for 320, etc.) and run manually. For keyboard, combine emulation with real device if possible. Mask dynamic content in visuals. Include bottom sheet focus/scroll in tests.

**Related files:** 03-2 and 03-3 task files, any existing e2e/.

---

## Additional Notes

- Phase 3 builds directly on Phase 1 (chrome/var/env, touch) and Phase 2 (bottom sheet, tokens, global rules).
- Real-device testing is the recurring theme across phases for dvh/safe-area/keyboard – do this before Phase 4 sign-off.
- Design system is foundation for Phase 4 "Mobile UX Patterns" doc.
- No new per-page CSS added; all in responsive.css for consolidation.
- For 3.2/3.3, since tests are code-light here, they can be expanded in Phase 4.

## Gotcha #4: Applying design system tokens requires careful per-page review to preserve intentional variations

**What happened:** 
Expanding spacing/type scales and variants (including .modal-content, .form-group, .btn sizes) in responsive.css is great for robustness, but applying to home hero, contact, about required preserving hero-specific (clamps, gradients) and page-unique styles. Hard-coded paddings in contact (5.5rem) and heroes were updated to use tokens + env without breaking visuals.

**Resolution:** 
Used surgical replaces with comments referencing Phase 3.1. Added desktop media for upscaling. Kept brand tokens in theme.css.

**Rule for all future work:** 
Before bulk replace, review per-page for "hero", "about-hero", "contact" etc. Use design system for rhythm (section, card, btn), not brand-specific. This makes foundation robust while avoiding over-standardization. Cross-ref Phase 2 gotcha on tokens.

**Related files:** responsive.css (enhanced design system), home-page.css, about-page.css, contact-page.css.

## Gotcha #5: Safe-area and dvh refinements must cover mobile-specific elements like bottom sheets and modals

**What happened:** 
Phase 1/2 had partial env(top) + var. For robust 3.4, added env(bottom) to bottom sheet (from Phase 2), and updated contact/about/home outer paddings to use env(top) + dvh + spacing tokens. Contact had min-height calc(100vh) which was updated to dvh.

**Resolution:** 
Surgical updates with Phase 3.4 comments. Ensured no double padding.

**Rule for all future work:** 
When adding full-bleed or fixed elements (modals, sheets, heroes), always include env(safe-area-inset-*) for top/bottom and dvh for viewport. Test with dynamic toolbars. See Phase 1 gotcha #3.

**Related files:** navigation.css (sheet), contact-page.css, about-page.css, home-page.css, heroes.

**Add new gotchas as they are discovered during Phase 3 execution.**  
This file becomes part of the institutional knowledge for the entire mobile fix program.
