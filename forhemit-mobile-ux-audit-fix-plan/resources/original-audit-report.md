06/11/26 11:32 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Original Mobile UI/UX Audit Report: Forhemit Marketing Website (apps/marketing)

**Source:** User-provided audit summary from senior mobile-first UX/UI designer audit.

**Note to Agents:** This is the complete original report that started the fix program. Read it in full before beginning any phase. It contains the detailed diagnosis, file paths, severity classifications, and discussion questions that informed the phased plan.

---

## Role & Approach (Summary)

I audited as a senior mobile-first UX/UI designer with deep experience shipping high-conversion responsive marketing sites (Next.js + Tailwind ecosystems...).

Focus: real-device experience from smallest phones (320–375px...) through large desktop. Evaluated against modern standards: 44×44 px minimum touch targets (WCAG 2.2), no iOS zoom, safe vertical rhythm...

Reviewed the full marketing app codebase...

---

## Executive Summary (Key Excerpt)

The site has strong foundations: proper viewport, overflow-x hidden, clamp-based typography..., dedicated responsive.css with excellent form/table/mobile grid handling..., Next Image usage, and progressive contact form logic...

However, it is not yet a fully considered mobile experience. Desktop-first assumptions, legacy fixed-position chrome, undersized interactive elements, and per-page custom CSS drift create friction on phones. Key conversion surfaces (home hero CTAs, team outreach icons, contact form, footer links) and the persistent header/nav/footer chrome are the biggest problem areas. The site “works” but feels compromised, cramped, or low-precision on real small screens.

Vertical space is eaten by fixed elements + tall fixed-height cards. Touch precision is unreliable in several places. Footer typography collapses into illegibility. Many “mobile” fixes exist in narrow scopes but are not applied globally or consistently.

---

## Critical Issues (High Severity – Fix First)

**1. TeamSection icons** (direct email to contact is correct direction, but tap targets are broken)
- File: apps/marketing/app/about/_components/sections/TeamSection.tsx:71-88
- 16px icons inside minimal padding = ~24–28px effective target
- Major usability failure on 320–375px phones for the exact action the icons were added to support.

**2. Footer text size & tap targets collapse on small screens**
- File: apps/marketing/app/components/layout/footer.css
- Base ~0.65rem down to 0.45rem on 320px. Dots shrink to 2px.
- Uppercase mono + tiny sizes + tight gaps = unreadable and untappable.

**3. Fixed chrome (GlobalHeader + Navigation) + full-viewport heroes create inconsistent mobile viewport**
- Multiple files with duplicate rules and approximate calc(100dvh - 80px)
- On smallest phones logo + hamburger + theme toggle crowd the top bar.
- No proper env(safe-area-inset-*) usage.

**4. Contact form layout + modal close target**
- .contact-modal-close is 36×36px.
- Needs 44px treatment.

---

## Major Issues (Excerpt)

- Home hero pro-links row: Horizontal flex of 7+ links at ~0.65rem — wraps awkwardly or forces micro-text on phones.
- CTAs and buttons: Many secondary elements rely on partial enforcement.
- About hero + sections: min-height: 100vh + padding issues with fixed chrome.
- Fixed-height cards (Team h-80, etc.) create long scrolls.
- Dropdown nav vs full mobile menu: Current pattern will feel cramped as nav grows.
- Inconsistent container & padding systems across pages.

---

## Minor / Polish Issues (Excerpt)

- Very small text and icons elsewhere drop below comfortable size.
- Horizontal scroll containers lack consistent visual affordances.
- Background meshes add to “chrome eats viewport” problem.
- Some legacy home-logo-header rules still floating.
- Reduced-motion handled globally but not all interactive states have clear pressed feedback on touch.
- No obvious env(safe-area-inset-*) in main chrome.

---

## Strengths to Preserve & Build On

- Viewport + overflow-x: hidden + body base styles solid.
- responsive.css is excellent for form-heavy surfaces (44px inputs, iOS font lock, etc.).
- Progressive contact form + query-param prefill is thoughtful UX.
- Clamp typography, Next Image, hamburger ARIA behavior good.
- Many pages already have their own responsive styles — good pattern, needs unification.

---

## Prioritized Recommendations

**Immediate (this sprint):**
- Fix TeamSection icons to 20–22px + 44px hit area.
- Fix footer minimum readable size + 44px targets.
- Unify top chrome + add safe-area padding to heroes.
- Bump close buttons and small icon buttons to 44px.

**Short-term:**
- Make mobile nav a full-width bottom sheet or better slide-in.
- Audit and apply touch-target + 16px rules globally.
- Review heroes for real-device chrome + notch.
- Standardize container + padding system.

**Medium-term:**
- Mobile design system audit pass (spacing, type, variants).
- Visual regression / device-specific Playwright tests.
- Test modals/intake flows with software keyboard on small screens.
- Safe-area and dynamic viewport refinements.

---

## Discussion Questions (from original)

- Primary mobile conversion path?
- Willing to make mobile nav a more substantial pattern (sheet)?
- How much per-page CSS to keep vs consolidate?
- Constraints on changing footer size/weight for brand reasons?

---

**End of Original Audit Summary**

**Full detailed version was provided by the user in the conversation that initiated this fix plan.**  
All agents must treat the original audit as the authoritative source of issues and context. The phased plan in this directory operationalizes the recommendations with structure, checklists, and mandatory knowledge transfer via handoff notes.
