06/11/26 11:32 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 1.3: Unify Top Chrome (GlobalHeader + Navigation) + Add Proper Safe-Area / dvh Handling to Heroes

**Task ID:** 1.3  
**Title:** Consolidate fixed header/nav and fix hero viewport calculations for real mobile devices  
**Phase:** 01 - Critical Fixes  
**Priority:** Critical  
**Status:** Not Started

## Problem Statement (from original audit)

> Fixed chrome (GlobalHeader + Navigation) + full-viewport heroes create inconsistent mobile viewport  
> Both GlobalHeader (z-1001, top-left gold logo) and minimal-nav (z-500, top-right hamburger + theme toggle) are position: fixed.  
> navigation.css + GlobalHeader.css + home-page.css + home-hero.css all have separate padding/media queries and duplicate logo rules. Combined chrome height varies; 100dvh / calc(100dvh - 80px) attempts are approximate and break with dynamic toolbars, notches, or landscape.  
> On smallest phones the logo + hamburger + theme toggle crowd the top bar.

## Goal / Desired Outcome

A single, predictable, well-documented mobile chrome height. Heroes that reliably show primary content above the fold on real iOS and Android devices (including dynamic toolbars and notches). No more guessing with magic numbers.

## Files to Modify (Likely)

- GlobalHeader component + GlobalHeader.css
- Navigation / minimal-nav + navigation.css
- home-hero.css, about-page.css, home-page.css (hero sections)
- Possibly create a new shared `MobileChrome` or update layout root
- globals.css or responsive.css for new safe-area utilities

## Detailed Steps

1. **Full audit of current chrome**
   - Search the entire codebase for all references to GlobalHeader, logo in header, fixed nav, z-1001, z-500, header heights, calc(100dvh...
   - Identify every place that hardcodes or approximates header height.
   - Measure the actual combined height of logo + controls on 320px.

2. **Decide on architecture**
   - Strong recommendation: Create or refactor into a single `MobileHeader` / shared chrome component that owns the fixed positioning, safe-area padding, and exposes a CSS variable (e.g. `--mobile-chrome-height`) for heroes to consume.
   - Or at minimum, consolidate all logo + control rules into one place.

3. **Implement safe-area + dynamic viewport**
   - Use `env(safe-area-inset-top)` for notched devices.
   - Prefer `100dvh` + explicit top padding over `calc(100dvh - 80px)`.
   - Add bottom safe-area handling if any fixed bottom elements exist.
   - Test thoroughly in landscape and with iOS dynamic island / Android gesture nav.

4. **Fix crowding on smallest phones**
   - Adjust spacing between logo, hamburger, and theme toggle.
   - Consider collapsing or reordering elements if they still fight for space.

5. **Update all heroes**
   - Apply the new padding-top / height strategy to Home hero and About hero (and any other full-viewport heroes).
   - Remove or deprecate the old per-page hero height hacks.

6. **Document the new system**
   - Add clear comments explaining the chrome height budget and how to use the CSS variable or utility in future heroes/sections.

## Acceptance Criteria

- [ ] Combined fixed chrome height is predictable and uses CSS custom properties or a single source of truth
- [ ] Heroes display complete primary headline + CTA above the fold on real 320–375px devices (including dynamic toolbars)
- [ ] No crowding of logo + hamburger + theme toggle on smallest screens
- [ ] Proper `env(safe-area-inset-*)` usage in main chrome
- [ ] Landscape mode behaves correctly
- [ ] All duplicate/legacy header rules cleaned up or documented as deprecated
- [ ] No layout jumps when toolbars show/hide

## Potential Gotchas & Watch-outs

- Legacy rules in `home-page.css` or other old files may still be active — search broadly before assuming a rule is dead.
- z-index stacking: GlobalHeader is at z-1001. New elements must respect this.
- Some pages may have their own fixed elements that interact badly with the unified chrome.
- iOS vs Android dynamic toolbar behavior differs — test both.
- Changing hero padding can affect LCP / perceived performance if not done carefully.

## References

- Original audit: Critical Issues #3 — Fixed chrome + inconsistent mobile viewport
- Also mentioned in Major Issues: About hero min-height + padding, legacy home-logo-header rules

## Handoff Notes for Next Agent

(Especially important: Record the final chrome height value chosen, the CSS variable name decided upon, which legacy files still had rules, and any z-index decisions.)

---

**This task is foundational.** Almost every other mobile improvement depends on having a stable, well-understood top chrome. Do it thoroughly.
