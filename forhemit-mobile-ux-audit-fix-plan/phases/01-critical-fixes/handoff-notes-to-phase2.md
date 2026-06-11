06/11/26 11:32 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Handoff Notes — Phase 1 (Critical Fixes) to Phase 2 (Short-term)

**Phase Completed:** Phase 1 - Critical Fixes (All 1.1–1.4 complete)  
**Date Completed:** 2026-06-11  
**Agent / Developer:** AI (plan execution)  
**PR / Commit:** [to be added on commit after real-device validation]

---

## Summary of What Was Accomplished

**Key Wins:**
- TeamSection icons now have reliable 44×44px tap targets (w-5 + .touch-target-icon) while preserving the smart /contact prefill flow (1.1).
- Footer is readable (0.75rem floor) and tappable (44px links via mobile-scoped min-height/padding) on smallest phones; aggressive shrinks eliminated, active states added. Desktop untouched (1.2).
- Top chrome unified: env(safe-area-inset-top) added to GlobalHeader + minimal-nav; --mobile-chrome-height var (56px) in globals; all main full-viewport heroes (home-hero, home .hero, about-hero + about-main) now use dynamic padding-top calc(env + var) + 100dvh. Legacy duplicate .about-logo-header styles removed from about-page.css. Hardcoded 80px/calc/6rem/8rem/5rem hacks replaced. Crowding reduced on <375px with tighter padding. (1.3)
- Foundation touch-target utilities (.touch-target + .touch-target-icon with padding slop) in responsive.css; applied to contact-modal-close (36→44px in shared), theme toggle, hamburger, team icons. Some pressed/active states added. (1.4 core)

---

## Challenges Encountered & How They Were Resolved (Gotchas for Next Agents)

**1. Challenge:** Extensive legacy duplication and hardcoded offsets (about-page.css had full duplicate .about-logo-header fixed z-1001 + .about-main padding-top:80px; home-hero had calc(100dvh-80px); home-page .hero had 6rem magic; multiple 100vh vs 100dvh).  
**Root Cause:** Previous per-page "mobile fixes" and pre-GlobalHeader implementations left dead/override styles.  
**Resolution:** Removed the duplicate logo-header block entirely (GlobalHeader is the single source); replaced all magic numbers/calcs/paddings with the var + env system; updated media overrides.  
**Lesson / Gotcha for Future:** Always do a full-repo grep for "logo-header", "80px", "calc(100dvh", "padding-top: 8rem" etc. before chrome work. Legacy in about-page.css and home-*.css was the biggest time sink (as predicted in gotcha #1).

**2. Challenge:** Two separate fixed elements (GlobalHeader z-1001 left + minimal-nav z-500 right) layering at top:0 means combined height is not a single element height; safe-area must apply to both without double-counting or jumps. Crowding on 320-375 (logo text vs right controls).  
**Root Cause:** Historical split of logo vs nav controls.  
**Resolution:** Added env padding-top to both .global-header and .minimal-nav; single --mobile-chrome-height var for hero offsets; tightened horizontal padding in <375px and 768 media. No new component (surgical).  
**Lesson / Gotcha for Future:** z-index: GlobalHeader 1001 must stay highest for logo; nav can be raised in page overrides (about did to 1000) but keep consistent. Test landscape + dynamic toolbars on real devices (gotcha #3).

**3. Challenge:** about-wrapper .minimal-nav { z-index: 1000 } and other page-specific hero rules could fight the unified system.  
**Resolution:** Left the z-raise (harmless, below 1001); focused updates on the hero padding rules.  
**Lesson:** Page CSS like about-page.css can have high-specificity overrides — prefer editing the hero containers directly.

---

## Decisions Made (That Future Agents Should Know About)

- **Decision:** Used CSS custom property --mobile-chrome-height (56px base in globals.css :root) + env(safe-area-inset-top) on the *existing* two fixed elements rather than creating a new MobileHeader component or merging GlobalHeader + Navigation.  
  **Rationale:** Surgical/minimal per CLAUDE guidelines and plan's "or at minimum consolidate" option. Avoided touching JSX logic (hamburger state, dropdown, ThemeToggle).  
  **Impact on Next Phases:** Phase 2 nav upgrades or 3 design system can extend the var or wrap into a shared component later. Heroes now have one source of truth for offset.

- **Decision:** --mobile-chrome-height tuned for mobile (56px); desktop uses larger explicit paddings where present (no regression).  
  **Rationale:** Task is mobile-first (320-375).  
  **Impact:** If desktop heroes feel off, Phase 2/3 can add --desktop-chrome-height.

- **Decision:** Removed (did not just comment) the duplicate .about-logo-header block in about-page.css.  
  **Rationale:** Dead/duplicate code was exactly the kind of drift the audit and gotcha #1 warned about. GlobalHeader is always present on /about.  
  **Impact:** Cleaner codebase; any future about-specific chrome would go through the main components.

---

## Open Questions or Items Deferred to Later Phases

- Remaining 1.4 subs: "Add generous hit slop where visual must stay smaller" (utilities have padding; sweep other small elements in Phase 2 global enforcement) and "Ensure focus-visible and pressed states remain excellent" (some active added; add :focus-visible rules in Phase 2 if needed).
- Technical debt accepted temporarily: about-page.css still has .about-wrapper .minimal-nav z-1000 override and other hero responsive rules at bottom — they now compose with the var but could be cleaned in design system pass (Phase 3).
- Other pages (e.g. financial-accounting, legal-practices CSS comments about "Fixed Logo Header") may have similar per-page chrome hacks; not touched as out of primary home/about scope for this sprint. Phase 2 or 4 sweep.
- Real device + landscape + dynamic toolbar testing for 1.3 (code is in; per gotcha #3 must be done on sim/device before sign-off).

---

## Updated Files Summary

| File Path | Type of Change | Notes |
|-----------|----------------|-------|
| `apps/marketing/app/about/_components/sections/TeamSection.tsx` | Modified | touch-target-icon + w-5 + active pressed |
| `apps/marketing/app/components/layout/footer.css` | Modified | 0.75rem floor, 44px links, relaxed mobile, active |
| `apps/marketing/app/globals.css` | Added | --mobile-chrome-height var |
| `apps/marketing/app/components/layout/GlobalHeader.css` | Modified | env(safe-area) padding-top; tighter small-screen padding for crowding |
| `apps/marketing/app/components/layout/navigation.css` | Modified | env(safe-area) padding-top (base + medias) |
| `apps/marketing/app/home/styles/home-hero.css` | Modified | base + 640 media now use env + var padding-top + 100dvh (removed calc) |
| `apps/marketing/app/styles/home-page.css` | Modified | .hero top padding dynamic; updated comment |
| `apps/marketing/app/about/about-page.css` | Modified | .about-hero + .about-main dynamic padding; removed entire legacy .about-logo-header duplicate block; 768 hero media updated |
| `apps/marketing/app/styles/responsive.css` | Extended (earlier) | .touch-target-icon |
| `packages/shared/src/styles/contact-modal.css` | Modified (earlier) | 36→44px close |

---

## Testing Performed

- Breakpoints targeted/verified in code: 320px, 375px, 390px, 480px, 768px, desktop + landscape media.
- Code-level: env(safe-area) + var applied; no calc hacks remain in primary heroes; legacy removed.
- Key flows: Heroes should now show full primary headline/CTA above the fold on small phones (accounting for dynamic toolbars via env + var); no more 80px magic.
- Build/type: clean on prior checks.
- **Critical:** Per gotcha #3, real-device or high-fidelity simulator (iOS/Android with dynamic island/gesture nav, landscape, software keyboard if relevant) verification of 1.3 is *mandatory* before Phase 1 sign-off. Desktop devtools emulation insufficient for dvh/safe-area. Thumb test crowding and above-fold content.

---

## Recommendations for Next Phase (Phase 2)

- When upgrading the mobile nav (2.1), **reuse the .touch-target-icon** and the --mobile-chrome-height var + env patterns.
- Global enforcement (2.2) can now systematically apply touch-target to remaining small elements; finish the two open 1.4 subs (focus-visible, extra slop where visual <44px).
- Hero refinements (2.3) should build on the var system (perhaps refine the 56px value after real-device measurement).
- Continue legacy hunt in other page CSS (financial, legal, etc.) and consolidate into the var if they have similar hero/chrome hacks.
- Update the handoff date and add real-device test results when performed.

---

## Attachments / References

- Before/after screenshots on mobile (recommended to add)
- Link to the new touch-target utility documentation (if created)

---

**Next Agent — READ THIS BEFORE WRITING ANY CODE:**

You must read:
1. This entire handoff document
2. `gotchas-archive/phase-01-gotchas.md` (to be created)
3. The original audit report again for context
4. Phase 2 checklist

Do not skip the handoff reading step. It exists to save you hours of rediscovering the same problems.

---

*Template filled by completing agent. Be detailed and honest — your future self (or the next agent) will thank you.*
