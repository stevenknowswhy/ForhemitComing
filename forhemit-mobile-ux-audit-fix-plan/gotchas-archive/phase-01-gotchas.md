06/11/26 11:32 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Phase 01 Gotchas Archive — Critical Fixes

**Purpose:** Permanent record of hard-won lessons from Phase 1. Future agents (and humans) should read this before starting any mobile work.

**Date Archived:** 2026-06-11 (Phase 1 Critical Fixes completed)

---

## Gotcha #1: Legacy CSS Still Active in Unexpected Places

**What happened:**  
Even after consolidating GlobalHeader and navigation, some logo positioning and padding rules from the old `home-page.css` and `home-hero.css` were still overriding the new unified styles on certain breakpoints.

**Why it was painful:**  
Took extra time to hunt down with broad searches. Almost introduced a regression in the hero layout.

**Rule for all future work:**  
Before editing any header/nav/chrome file, run a full-repo search for the logo class names, fixed positioning, and any `calc(100dvh` patterns. Legacy rules hide in old page-specific CSS files.

**Related files:** `home-page.css`, `home-hero.css`

---

## Gotcha #2: Touch Target Utilities Need Careful Specificity

**What happened:**  
When first adding `.touch-target`, some component buttons had higher specificity from Tailwind or module CSS and ignored the new min-width/min-height.

**Resolution:**  
Used a combination of higher specificity in the utility (or `!important` sparingly) + applied the class at the right DOM level (often on a wrapper).

**Rule:**  
Test touch targets with the browser's element inspector "hover" and "active" states. Always verify on real mobile after adding the class.

---

## Gotcha #3: Safe-Area + Dynamic Viewport Testing Requires Real Devices

**What happened:**  
`100dvh` + `env(safe-area-inset-top)` behaved differently in desktop dev tools vs real iPhone (especially with dynamic island and when the virtual keyboard appeared).

**Resolution:**  
Final verification was done on physical devices + iOS Simulator + Android emulator. Desktop Chrome "mobile" emulation was not sufficient.

**Rule:**  
For any chrome or hero work involving safe areas or dvh, real-device or high-fidelity simulator testing is mandatory before marking complete.

---

## Gotcha #4: Footer Brand Constraints + Aggressive Shrinking Rules

**What happened:**  
Footer had 4 nested media queries with progressive shrink (base 0.65rem → 0.45rem + 2px dots + 0.25rem padding/gap at 320px). We floored at 0.75rem, 3px dots, and relaxed padding/gap while adding 44px tap areas only on mobile. No stakeholder pushback encountered during implementation (chose conservative 0.75rem floor to stay "brand-appropriate" per plan). The shrinking was likely for a tight premium desktop aesthetic.

**Resolution:**  
Scoped all floor + tap changes inside the mobile @media blocks only (desktop + 768px untouched). Links got min-height + padding for targets; text stayed readable.

**Rule:**  
When changing footer sizes, check for existing brand guidelines or stakeholder preferences *early* (before finalizing). Always search the entire footer.css for every shrinking media query — they hide in 360/320 specific rules. Bias fixes toward smallest breakpoint first.

**Related files:** `footer.css` (all media queries), `Footer.tsx` (structure left intact)

---

## Additional Notes

- The contact prefill query param pattern in TeamSection is excellent UX — protect it in all future changes.
- Many "mobile responsive" media queries were written at `max-640px` or `max-768px`. On true 320px phones these were not aggressive enough. Future work should bias toward testing the smallest breakpoint first.

## Gotcha #5: Chrome Unification Requires Broad Legacy Search + Careful Offset Math

**What happened:** 
Multiple sources of truth for "header height" (about-page.css duplicate .about-logo-header + 80px main padding, home-hero calc(100dvh-80px), home-page 6rem comment, about-hero 8rem/5rem overrides). Adding env(safe-area) to two separate fixed bars (GlobalHeader + nav) required updating heroes without causing double padding or layout jumps. Crowding on 320-375 between left logo and right controls.

**Resolution:** 
Introduced single --mobile-chrome-height var + env padding on the fixed bars only. Heroes use calc(env + var). Removed the entire duplicate about-logo-header block. Tightened small-screen horizontal padding. 

**Rule for all future work:** 
Before any header/nav/hero edit: 
1. Full grep for GlobalHeader, minimal-nav, logo-header, 80px, calc\(100dvh, padding: 6rem|8rem, min-height: 100. 
2. about-page.css is a notorious source of legacy chrome overrides — treat it as such. 
3. Always test the *combined* visual height of the two fixed bars (they layer, not stack in DOM). 
4. Real devices/simulators required for safe-area + dynamic toolbars (see gotcha #3).

**Related files:** globals.css (var), GlobalHeader.css, navigation.css, home-hero.css, home-page.css, about-page.css (legacy cleaned), layout.tsx (render order).

---

**Add new gotchas as they are discovered during Phase 1 execution.**  
This file becomes part of the institutional knowledge for the entire mobile fix program.
