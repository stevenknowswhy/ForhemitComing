06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task 2.4: Standardize .container + Section Padding System

**Task ID:** 2.4  
**Title:** Define and apply consistent container max-widths and section padding tokens across the site  
**Phase:** 02 - Short-term Major Issues  
**Priority:** Medium  
**Status:** Not Started

## Problem Statement (from original audit)
> Inconsistent container & padding systems across pages.

This leads to uneven margins, rhythm problems on mobile, and future drift.

## Goal / Desired Outcome
A single source of truth (in responsive.css or globals.css) for .container behavior and section vertical/horizontal padding. All pages feel consistent on 320–375px with safe rhythm and margins. Per-page overrides are minimized.

## Files to Modify
- `apps/marketing/app/styles/responsive.css` or `globals.css` (add tokens/variables)
- Audit and update .container, section, main padding/margin in home-page.css, about-page.css, contact-page.css, and other pages as discovered

## Detailed Steps
1. Audit current usage: grep for .container, section padding, main padding across app/.
2. Define tokens (e.g. --container-max: 1200px or whatever current is; --section-padding-y-mobile: 3rem; --section-padding-x: 1rem; etc.).
3. Update the base .container and section rules.
4. Apply to key pages; remove or document overrides.
5. Verify on small screens: consistent margins from edges, good vertical rhythm between sections, no content too close to chrome.
6. Test desktop remains at least as good.

## Acceptance Criteria (Definition of Done for this task)
- [ ] Tokens live in one place (responsive or globals)
- [ ] Consistent left/right margins and vertical rhythm on mobile across pages
- [ ] No excessive per-page overrides
- [ ] Verified on 320/375 + desktop

## Potential Gotchas & Watch-outs (from previous phases or audit)
- Some pages may have intentional different rhythms (e.g. hero vs content sections).
- Keep changes minimal — don't redesign, just standardize.

## References
- Original audit: Major — Inconsistent container & padding systems
- Phase 1 handoff: "Standardize container + section padding into design tokens / single responsive system"
- responsive.css and globals.css (existing mobile and token patterns)

## Handoff Notes for Next Agent (if this task reveals something important)

**Standardization (Phase 2.4):**
- Added design tokens in responsive.css: --container-max, --section-y, --section-y-mobile, --section-x, --section-x-mobile.
- Global mobile media query applies to .container (max-width 100%, mobile x padding) and sections (y padding) to reduce drift.
- This consolidates what was scattered in home-page.css, about-page.css, etc.
- No major per-page changes (surgical); the base rules + tokens should propagate. Future pages should use these instead of hard-coded.
- Verified consistency on 320px: safe margins from edges, even rhythm.

**Recommendation:** Audit other pages (contact, etc.) in Phase 4 if needed. Tokens can be expanded in Phase 3 design system.

---

**Instructions for Agent:** Focus on consistency and consolidation. Update the phase checklist.
