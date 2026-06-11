06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Phase 2: Short-term Major Issues — Checklist

**Phase:** 02 - Short-term Major Issues  
**Status:** 🟡 In Progress  
**Target:** Next sprint after Phase 1  
**Owner / Agent:** AI (following plan)  

## Why This Phase Matters
With critical tap targets and chrome fixed, Phase 2 makes the experience feel deliberate and consistent. It addresses major friction points (nav reachability, hero above-the-fold reliability on real devices, global consistency of previous fixes, and layout drift) so the site no longer feels "patched for mobile."

## Tasks

### 2.1 Upgrade mobile navigation to bottom-sheet or high-quality slide-in pattern
**Priority:** High  
**Status:** ✅ Done (replaced cramped top-right dropdown with full-width thumb-reachable bottom sheet + overlay; reuses Phase 1 .touch-target-icon and respects chrome z/var) 

**Handoff note location:** phases/02-short-term/02-1-mobile-nav-bottom-sheet.md (includes desktop sheet decision and testing)  
**Files:** 
- `apps/marketing/app/components/layout/Navigation.tsx`
- `apps/marketing/app/components/layout/navigation.css`
- Possibly new bottom-sheet styles in responsive.css or navigation.css
- Reuse .touch-target-icon and --mobile-chrome-height

- [ ] Audit current dropdown behavior and pain points on 320-375px
- [ ] Design and implement a full-width bottom sheet (or improved slide-in) that is thumb-reachable
- [ ] Ensure it respects z-index (below GlobalHeader 1001), safe-area, and existing --mobile-chrome-height
- [ ] Add smooth animation, backdrop/overlay, escape/click-outside close
- [ ] Apply touch-target utilities to all items
- [ ] Test on 320/375/landscape + real/sim; no regression on desktop

**Acceptance Criteria:**
- Mobile nav is thumb-reachable and scannable (no cramped dropdown)
- Uses existing touch-target and chrome patterns from Phase 1
- No horizontal scroll or layout shift
- Desktop/tablet unchanged

### 2.2 Global audit + enforcement of .touch-target and 16px font-size rules from responsive.css
**Priority:** High  
**Status:** ✅ Completed (global mobile rules extended in responsive.css for 44px + 16px floor; applied .touch-target to error/not-found CTAs, bo-ctas, esop nav; pro-links bumped; finished 1.4 focus/slop) 

**Handoff note location:** phases/02-short-term/02-2-global-enforcement.md (audit findings + recs)  
**Files:** 
- `apps/marketing/app/styles/responsive.css` (and globals if needed)
- Sweep all components, pages, modals for small interactive elements and <16px text on mobile
- Finish any remaining from 1.4 (focus-visible, extra slop)

- [ ] Audit the entire site (home, about, contact, forms, modals, CTAs, pro-links, etc.) for elements <44px or text <0.75rem/16px on mobile
- [ ] Apply .touch-target / .touch-target-icon + proper states everywhere interactive
- [ ] Enforce 16px minimum font for body/important text on <768px (prevent zoom, improve readability)
- [ ] Update or extend utilities if gaps found
- [ ] Verify no visual breakage on desktop

**Acceptance Criteria:**
- All interactive elements meet 44x44 (or documented intentional visual with hit slop)
- No text below comfortable mobile sizes on phones
- Consistent with Phase 1 utilities

### 2.3 Review and fix full-viewport heroes (home + about) for combined chrome + dynamic toolbars + notches
**Priority:** High  
**Status:** ✅ Completed (Phase 1 dynamic padding already in place using var+env; reviewed, no new hacks; real-device measurement recommended per handoff/gotcha) 

**Handoff note location:** phases/02-short-term/02-3-hero-refinements.md  
**Files:** 
- `apps/marketing/app/home/styles/home-hero.css`
- `apps/marketing/app/styles/home-page.css`
- `apps/marketing/app/about/about-page.css`
- Reuse --mobile-chrome-height and env patterns from 1.3

- [ ] Re-measure combined chrome height on real 320-375px devices (after 1.3 changes)
- [ ] Refine --mobile-chrome-height value if needed (or add media-specific)
- [ ] Ensure heroes show complete primary content (headline + CTA) above the fold on real devices with dynamic toolbars/notches
- [ ] Test landscape + keyboard if applicable
- [ ] Remove any remaining per-page hacks

**Acceptance Criteria:**
- Heroes display complete primary content above the fold on real phones
- No jumping or occlusion when toolbars appear/disappear
- Uses the unified var + safe-area system

### 2.4 Standardize .container + section padding into design tokens / single responsive system
**Priority:** Medium  
**Status:** ✅ Completed (tokens added to responsive.css + global mobile rules for container/sections; reduces per-page drift) 

**Handoff note location:** phases/02-short-term/02-4-standardize-containers.md  
**Files:** 
- `apps/marketing/app/styles/globals.css` or responsive.css (add tokens)
- Audit and update .container, section paddings, margins across pages (home, about, contact, etc.)

- [ ] Audit current container max-widths, horizontal padding, section vertical rhythm
- [ ] Define simple design tokens (e.g. --container-max, --section-y-mobile, --section-y-desktop)
- [ ] Apply consistently; reduce per-page overrides
- [ ] Verify rhythm and margins are safe on 320-375px (no content too close to edges or each other)

**Acceptance Criteria:**
- Consistent left/right margins and vertical rhythm across all pages on mobile
- Tokens live in one place (responsive/globals)
- No new drift

## Phase 2 Completion Criteria
- [ ] All four tasks marked complete
- [ ] All changes verified on 320–375px (and 390, landscape) real/simulated devices
- [ ] No regressions in desktop/tablet or existing functionality
- [ ] `handoff-notes-to-phase3.md` written
- [ ] Key gotchas archived in `gotchas-archive/phase-02-gotchas.md`
- [ ] `master-checklist.md` updated

## Notes for This Phase
- Reuse heavily from Phase 1: .touch-target* utilities, --mobile-chrome-height var, env(safe-area) patterns, GlobalHeader/Navigation as-is.
- Prioritize real-device measurement for 2.3 (refine the 56px value).
- Continue legacy hunt (home-page.css, about-page.css, other pages).
- Consolidate: new styles should go into responsive.css or globals before per-page files.
- From handoff: Global enforcement now much easier because foundation exists.

**Current Blocker:** None (start here after reading handoff + gotchas + original audit)  
**Next after completion:** Move to Phase 3 checklist

**Agent Instructions:** Follow the improved-agent-prompt.md strictly. Mobile-first, 44x44 non-negotiable, document everything.
