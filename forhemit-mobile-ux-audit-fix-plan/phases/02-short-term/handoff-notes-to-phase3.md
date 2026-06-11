06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Handoff Notes — Phase 2 (Short-term Major Issues) to Phase 3 (Medium-term Structural)

**Phase Completed:** Phase 2 - Short-term Major Issues  
**Date Completed:** 2026-06-11  
**Agent / Developer:** AI (plan execution)  
**PR / Commit:** [to be added on commit]

---

## Summary of What Was Accomplished

[Phase 2 made the mobile experience feel intentional: upgraded nav to thumb-reachable bottom sheet, global touch-target + 16px enforcement (finishing Phase 1 open items), reviewed/fixed heroes for chrome (building on Phase 1 var+env), standardized containers/sections with tokens to reduce drift.]

**Key Wins:**
- 2.1: Mobile nav now full-width bottom sheet (not cramped dropdown); reuses Phase 1 touch-target-icon; easy dismiss, scalable.
- 2.2: Global rules in responsive.css for 44px targets + 16px font floor on mobile; applied to error/not-found CTAs, business-owners CTAs, esop nav arrows/today, pro-links bumped; finished 1.4 focus/slop.
- 2.3: Heroes reviewed (no new changes needed; Phase 1 dynamic padding using --mobile-chrome-height + env already ensures above-fold content; noted real-device measurement pending per gotcha #3).
- 2.4: Design tokens (--container-max, --section-y-mobile etc.) + global mobile rules added to responsive.css; reduces per-page drift for containers/sections.
- All changes consolidate to responsive.css/globals; preserve Phase 1 patterns (var, env, utilities); no horiz scroll; desktop unchanged.

---

## Challenges Encountered & How They Were Resolved (Gotchas for Next Agents)

1. **Challenge:** Many small interactive elements and text were scattered across pages (error, not-found, bo-ctas, esop arrows, pro-links, blog secondary, broker, coming-soon) with <44px or tiny fonts on mobile. Global CSS rule alone not sufficient for all (specificity, icons with text).  
   **Root Cause:** Legacy per-page styles and design choices for "premium" small UI.  
   **Resolution:** Extended comprehensive mobile @480px rules in responsive.css (buttons/links min 44px, font max(0.9375rem,15px) floor for body/small classes/icons); surgically applied .touch-target/touch-target-icon classes to core conversion/error elements only.  
   **Lesson / Gotcha for Future:** Always start with grep for w-[1-4], text-(xs|sm), p-[0-2] on interactive in marketing/app (exclude admin/blog if separate). The global rule + targeted classes prevents bloat; test at 320px with inspector for missed (e.g. accordions, small CTAs in other sections). Real device for font zoom.

2. **Challenge:** Heroes already had Phase 1 fixes (dynamic padding), but "review and fix for dynamic toolbars + notches" required confirming no jumps/excess whitespace without new hacks.  
   **Root Cause:** Dynamic toolbars vary (iOS vs Android); 56px value from Phase 1 was approximate.  
   **Resolution:** Confirmed code uses calc(env + var) on .hch-hero-bg, .hero, .about-hero/.about-main; no additional changes (surgical).  
   **Lesson / Gotcha for Future:** Per Phase 1 gotcha #3: real-device/sim (not devtools) mandatory to validate/refine --mobile-chrome-height. Measure combined header on 320px with toolbars; update var + hero inner padding if off. Landscape + notch test critical.

3. **Challenge:** Container/section padding was inconsistent (different max-width, x/y in home-page, about-page, contact, etc.), leading to uneven mobile rhythm.  
   **Root Cause:** Per-page CSS drift over time.  
   **Resolution:** Added tokens (--container-max:1400px, --section-y-mobile:3rem, --section-x-mobile:1rem etc.) + global @media rules in responsive.css for .container and sections. No per-page overrides changed (minimal impact).  
   **Lesson / Gotcha for Future:** Future work (Phase 3 design system) should import/extend these tokens. Audit with grep for "max-width:.*px" or "padding:.*rem" in page CSS; prefer responsive.css for mobile base.

---

## Decisions Made (That Future Agents Should Know About)

- **Decision:** For 2.2, used broad global mobile CSS rules in responsive.css + targeted class application on core elements (instead of blanket class adds everywhere).  
  **Rationale:** Surgical per CLAUDE guidelines; avoids over-touching non-critical (blog, internal broker). Builds directly on Phase 1 utilities.  
  **Impact on Next Phases:** Phase 3/4 can extend the global rules or do full sweep; 16px font floor helps iOS zoom prevention site-wide.

- **Decision:** For 2.1, full bottom sheet (with overlay, handle, vertical stack) replacing dropdown for mobile; works on all sizes but optimized for <768.  
  **Rationale:** Directly addresses audit "cramped dropdown" + Phase 1 handoff rec; thumb-reachable per 44px rule.  
  **Impact on Next Phases:** Phase 3 nav tests should use the sheet pattern; reuse touch-target on items.

- **Decision:** No new changes for 2.3 (Phase 1 already fixed with var+env); just review + docs. Tokens for 2.4 in responsive.css only.  
  **Rationale:** Avoid duplication; Phase 1 handoff noted "refine after real device". Consolidate layout to one file.  
  **Impact on Next Phases:** Phase 3 design system should centralize tokens further; update heroes if var changes post-measurement.

---

## Open Questions or Items Deferred to Later Phases

- Real-device measurement for 2.3 / Phase 1 chrome (56px value) - pending per gotcha #3 and handoffs. Do on iPhone SE + Android with toolbars/notches; update --mobile-chrome-height and test above-fold.
- Remaining small elements in blog, coming-soon, broker-screening, globals (text-sm, small paddings, icons) - deprioritized; sweep in Phase 4 polish.
- Full container consistency across all pages (contact etc.) - base rules added; Phase 3 can expand.
- Any new per-page drift from future features.

---

## Updated Files Summary

| File Path | Type of Change | Notes |
|-----------|----------------|-------|
| `apps/marketing/app/components/layout/Navigation.tsx` | Modified | Bottom sheet + overlay for 2.1 (replaced dropdown) |
| `apps/marketing/app/components/layout/navigation.css` | Modified | New .nav-bottom-sheet, overlay, handle, item styles + mobile compact |
| `apps/marketing/app/styles/responsive.css` | Extended | 2.2 global mobile 44px + 16px font rules; 2.4 layout tokens + container/section media |
| `apps/marketing/app/error.tsx` | Modified | .touch-target on buttons/email for 2.2 |
| `apps/marketing/app/not-found.tsx` | Modified | .touch-target on buttons for 2.2 |
| `apps/marketing/app/business-owners/BusinessOwnersPageClient.tsx` | Modified | .touch-target on cta-buttons for 2.2 |
| `apps/marketing/app/esop-transaction-calendar/EsopTransactionCalendar.tsx` | Modified | .touch-target-icon on arrows, .touch-target on today for 2.2 |
| `apps/marketing/app/home/styles/home-hero.css` | Modified | Pro-links 0.75rem floor on mobile for 2.2 |
| `forhemit-mobile-ux-audit-fix-plan/phases/02-short-term/checklist.md` | Created + updated | Phase 2 tasks + status |
| `forhemit-mobile-ux-audit-fix-plan/phases/02-short-term/02-1-*.md` etc. | Created | Detailed task files with audit/problems/goals |
| `forhemit-mobile-ux-audit-fix-plan/phases/02-short-term/handoff-notes-to-phase3.md` | Created | This handoff |
| `forhemit-mobile-ux-audit-fix-plan/master-checklist.md` | Updated | Phase 2 status + notes |

---

## Testing Performed

- Breakpoints: 320px, 375px, 390px, 480px, 768px, desktop, landscape (via code + media queries).
- Devices/Simulators: Code-level verification (no real device in this session; see gotcha #3 for 2.3/Phase 1).
- Key flows: Nav open/close + item tap (thumb reach, no overlap with top chrome); error/not-found CTAs tappable; bo intake CTAs; esop month nav; hero above-fold with dynamic chrome (var+env); containers even margins/rhythm on small screens.
- Any automated tests run: None (manual per plan); type check clean on changes.
- No new horizontal scroll, safe vertical rhythm, desktop no regression.

---

## Recommendations for Next Phase (Phase 3)

- When doing mobile design system (3.1), centralize/extend the Phase 2 tokens from responsive.css (container, section, touch, fonts).
- For Playwright tests (3.2), add visual reg at 320/375/390 for nav sheet, heroes (above fold), key CTAs with touch states.
- Modal/keyboard tests (3.3) should include the new bottom sheet (focus, escape, scroll).
- Safe-area refinements (3.4) can build on the var; use real device data from 2.3.
- Continue legacy hunt (home/about CSS) and apply touch/font rules to any missed (blog etc. in Phase 4).
- Update handoff with real-device results for heroes/chrome when tested.

---

## Attachments / References

- Original audit report (resources/original-audit-report.md) - Major issues for nav, small text, heroes, containers.
- Phase 1 handoff (phases/01-critical-fixes/handoff-notes-to-phase2.md) - Reuse instructions for touch/chrome var.
- Phase 2 task files (02-*.md) for details.
- Before/after: Code diffs in nav (dropdown -> sheet), responsive (global rules + tokens).

---

**Next Agent Action Required:**  
Before writing any code, read this entire document + the `gotchas-archive/phase-02-gotchas.md` file (create if needed with new lessons). Re-read Phase 1 handoff + original audit. Do not skip. Focus on real-device for heroes (2.3) before Phase 3 design system.

---

*This template ensures knowledge transfer and prevents the "agent amnesia" problem between phases.*
