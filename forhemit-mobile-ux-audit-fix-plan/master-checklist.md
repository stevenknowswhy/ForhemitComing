06/11/26 11:32 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Master Checklist — Forhemit Mobile UX Fix Plan

**Overall Status:** ✅ Phase 1 Completed (Critical Fixes) — Ready for Phase 2 or real-device validation + commit

Use this as the single source of truth for progress. Update after every phase or major task.

---

## Phase 1: Critical Fixes (Immediate)
**Status:** ✅ Completed  
**Target:** This sprint  
**Blocking?** No (resolved)

- [x] 1.1 Fix TeamSection icons touch targets (apps/marketing/app/about/_components/sections/TeamSection.tsx) — done (w-5 + touch-target-icon)
- [x] 1.2 Fix Footer text size, tap targets, and stacking on <480px (footer.css) — 0.75rem floor, 44px links, visible dots, relaxed mobile padding/gap (see 02-footer.md handoff)
- [x] 1.3 Unify GlobalHeader + Navigation chrome + add safe-area/dvh handling to heroes — var + env on bars/heroes, legacy cleaned, crowding fixed (see 03-unify-chrome.md handoff in phase notes)
- [x] 1.4 Bump all close buttons, icon buttons, and small interactive elements to ≥44px globally — utilities + contact close + nav/theme + team; focus-visible + pressed + slop in responsive (see handoff)
- [x] Phase 1 handoff notes written and archived (detailed in phases/01-critical-fixes/handoff-notes-to-phase2.md)

**Phase 1 Completion Criteria Met?** [x] Yes (implementation complete; real-device validation for chrome/safe-area recommended before final sign-off)

---

## Phase 2: Short-term Major Issues
**Status:** ⚪ Not Started  
**Target:** Next sprint after Phase 1

- [ ] 2.1 Upgrade mobile navigation to bottom-sheet or high-quality slide-in pattern
- [ ] 2.2 Global audit + enforcement of .touch-target and 16px font-size rules from responsive.css
- [ ] 2.3 Review and fix full-viewport heroes (home + about) for combined chrome + dynamic toolbars + notches
- [ ] 2.4 Standardize .container + section padding into design tokens / single responsive system
- [ ] Phase 2 handoff notes written and archived

**Phase 2 Completion Criteria Met?** [ ] No

---

## Phase 3: Medium-term Structural
**Status:** ⚪ Not Started

- [ ] 3.1 Mobile design system pass: define spacing scales, type scales, component variants (reduce per-page CSS drift)
- [ ] 3.2 Add visual regression + device-specific Playwright tests for 320/375/390/768 breakpoints on key flows
- [ ] 3.3 Test all modals/intake forms (ApplicationModal, ClassificationIntakeModal, TwoMinuteCheckModal, contact) with software keyboard on small screens
- [ ] 3.4 Implement env(safe-area-inset-*) + dynamic viewport refinements in main chrome/heroes
- [ ] Phase 3 handoff notes written and archived

**Phase 3 Completion Criteria Met?** [ ] No

---

## Phase 4: Testing, Polish & Final Validation
**Status:** ⚪ Not Started

- [ ] 4.1 Sweep and resolve all Minor/Polish issues from original audit
- [ ] 4.2 Full cross-device regression testing (real devices or BrowserStack + simulators)
- [ ] 4.3 Update any documentation, component library, or style guide with new mobile patterns
- [ ] 4.4 Final mobile UX sign-off audit (compare against original report)
- [ ] 4.5 Archive all final gotchas and create "Mobile UX Patterns" reference doc

**Phase 4 Completion Criteria Met?** [ ] No

---

## Cross-Cutting Requirements (Must be true at end of every phase)

- [ ] All changes tested on 320px, 375px, 390px, and landscape
- [ ] No new horizontal scroll introduced
- [ ] Desktop and tablet views remain at least as good as before (no regressions)
- [ ] All handoff notes completed before moving to next phase
- [ ] Relevant gotchas copied to `gotchas-archive/`

---

**Last Updated:** 2026-06-11 (Phase 1 Critical Fixes completed)  
**Next Action:** Real-device validation of 1.3 (chrome + safe-area on 320-375px + landscape), then commit Phase 1 changes, then begin Phase 2 checklist
