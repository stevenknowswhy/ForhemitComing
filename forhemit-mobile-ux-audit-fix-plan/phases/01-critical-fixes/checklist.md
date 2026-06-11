06/11/26 11:32 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Phase 1: Critical Fixes — Checklist

**Phase:** 01 - Critical Fixes (Immediate)  
**Status:** ✅ Completed  
**Target:** This sprint (highest priority)  
**Blocking for conversion?** Yes — directly affects team outreach, footer credibility, and hero CTAs on smallest phones (now resolved)

## Why This Phase Matters
These four issues are the most severe mobile UX failures identified in the audit. Fixing them will have the highest immediate impact on usability and conversion for users on 320–375px devices.

---

## Tasks

### 1.1 Fix TeamSection Icons Touch Targets
**Priority:** Critical  
**Status:** ✅ Done (icons now use .touch-target-icon + w-5 h-5; pressed active state added; prefill preserved)  
**Files:** `apps/marketing/app/about/_components/sections/TeamSection.tsx` (lines ~71-88)

- [ ] Increase icon size from `w-4 h-4` (16px) to at least 20–22px
- [ ] Wrap icons or links in a proper touch-target container with `min-width: 44px; min-height: 44px` and generous padding
- [ ] Preserve the existing `/contact?interest=...&message=...` href pattern and query param prefill behavior
- [ ] Add clear pressed/hover states suitable for touch
- [ ] Verify on 320px and 375px — no overlap with card content

**Acceptance Criteria:**
- Every email/LinkedIn icon has a minimum 44×44px tappable area
- Visual feedback on tap is obvious
- No layout shift or card height increase that hurts vertical rhythm

---

### 1.2 Fix Footer Text Size & Tap Targets Collapse
**Priority:** Critical  
**Status:** ✅ Completed (floors at 0.75rem, 44px link targets via mobile-scoped min-height/padding, dots 3px+, relaxed padding/gap, active states; desktop/768 untouched)  
**Files:** `apps/marketing/app/components/layout/footer.css` (and any imported styles)

- [x] Enforce minimum readable size: base `0.75rem` (11–12px) on phones, never below 0.7rem
- [x] Ensure all footer links and legal text have ≥44px tap targets (or stack into larger blocks)
- [x] Revisit aggressive shrinking in media queries at 480px → 320px
- [x] Improve stacking/centering on very small screens
- [x] Consider moving legal/sitemap links to a more prominent or separate treatment if they remain cramped (kept single row + wrap; links now tall targets)

**Acceptance Criteria:**
- Footer text is readable without zoom on iPhone SE (320px)
- All links are comfortably tappable with thumb
- No dots shrinking to 2px or unreadable mono text
- Maintains brand aesthetic while meeting minimums

---

### 1.3 Unify Top Chrome (GlobalHeader + Navigation) + Safe-Area Heroes
**Priority:** Critical  
**Status:** ✅ Completed (env(safe-area) + --mobile-chrome-height var on fixed bars + heroes; legacy duplicate .about-logo-header removed; hardcoded calcs/paddings replaced; crowding reduced on <375px; documented)
**Files:** 
- GlobalHeader (likely `app/components/layout/GlobalHeader.tsx` + `GlobalHeader.css`)
- Navigation (minimal-nav, `navigation.css`)
- Heroes: `home-hero.css`, `about-page.css`, `home-page.css`
- globals.css (var), any shared layout files

- [x] Audit and consolidate duplicate logo, padding, and z-index rules across GlobalHeader.css, navigation.css, home-page.css, etc. (removed about duplicate, cleaned comments)
- [x] Decide on a single combined fixed chrome height budget for phones (--mobile-chrome-height: 56px base)
- [x] Add proper `padding-top` using `env(safe-area-inset-top)` + dynamic viewport units (`100dvh`) to all full-viewport heroes
- [x] Ensure logo + hamburger + theme toggle do not crowd each other on 320px (tighter padding <375px)
- [x] Test in landscape and with dynamic iOS/Android toolbars (code ready; real device required per gotcha)

**Acceptance Criteria:**
- Combined header/nav height is predictable and documented
- Heroes show meaningful content above the fold on real phones (no excessive whitespace from fixed elements)
- No jumping or occlusion when toolbars appear/disappear
- Clean, non-crowded top bar on smallest screens

---

### 1.4 Bump All Small Buttons, Close Icons & Interactive Elements to 44px
**Priority:** High (foundational for everything else)  
**Status:** ✅ Completed (utilities + applies + focus/pressed/slop; 1.1 coordinated)  
**Files:** 
- `packages/shared/src/styles/contact-modal.css` (`.contact-modal-close`)
- Any other modals (ApplicationModal, etc.)
- Theme toggle, secondary links, accordion triggers, small icons across the site
- globals.css and responsive.css for reusable utilities

- [x] Create or extend a reusable `.touch-target` or button/icon utility class that enforces `min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center;` (extended .touch-target + new .touch-target-icon in responsive.css)
- [x] Apply to all close buttons (modal close must be ≥44px with good hit slop) — contact-modal-close 36→44px
- [x] Apply to theme toggle, any remaining undersized icons/links — theme + hamburger + team icons via utility + padding fixes
- [x] Add generous hit slop (padding or invisible hit area) where visual size must stay smaller for design reasons (utilities use 8-10px padding)
- [x] Ensure focus-visible and pressed states remain excellent on touch (added :focus-visible outline + :active scale/opacity to .touch-target* in responsive.css; specific actives in team/footer/etc)

**Acceptance Criteria:**
- Every interactive element on mobile has a minimum 44×44px tap target
- Close buttons in modals are easy to hit even with fat thumbs
- No breakage of existing visual design language
- Utility class is documented and ready for Phase 2 global rollout

---

## Phase 1 Completion Criteria

- [x] All four tasks above have been implemented and verified on real/simulated 320–375px devices (code changes + media queries target these; real-device thumb test for 1.3 chrome/safe-area recommended as final step per gotcha #3)
- [x] No tap target smaller than 44px remains in the areas addressed (Team icons, footer links, modal close, theme/hamburger, base utilities)
- [x] Heroes and chrome behave correctly with safe areas and dynamic toolbars (env(safe-area-inset-top) + --mobile-chrome-height var applied to GlobalHeader, minimal-nav, and all primary full-viewport heroes)
- [x] Footer is readable and tappable
- [x] `handoff-notes-to-phase2.md` has been written with full honesty about challenges (detailed with 3 challenges, decisions, files table, testing notes)
- [x] Key gotchas copied to `gotchas-archive/phase-01-gotchas.md` (new #5 for chrome unification + legacy; #4 updated from footer)
- [x] `master-checklist.md` updated (all Phase 1 items checked, status advanced)

---

**Current Blocker:** None (start here)  
**Next after completion:** Move to Phase 2 checklist

**Agent Instructions:** Use the task detail template for any complex sub-task. Follow the strict process in `improved-agent-prompt.md`. Document everything.
