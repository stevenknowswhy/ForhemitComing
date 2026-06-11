06/11/26 02:01 PM PT
Purpose: (auto-inserted by pre-commit — please update)

# Phase 02 Gotchas Archive — Short-term Major Issues

**Purpose:** Permanent record of hard-won lessons from Phase 2. Future agents (and humans) should read this before starting any mobile work.

**Date Archived:** 2026-06-11 (Phase 2 Short-term completed)

---

## Gotcha #1: Global CSS rules + targeted classes beat blanket application for enforcement

**What happened:** 
Many small elements (error/not-found CTAs, bo-ctas, esop arrows, pro-links, blog secondary, broker, coming-soon paddings) scattered with <44px or tiny fonts. A single global rule in responsive.css wasn't enough due to specificity, icons+text combos, and design intent for "small premium" UI. Blog and internal pages had many but were deprioritized.

**Why it was painful:** 
Risk of over-touching non-core (e.g. blog) or missing critical (conversion CTAs). Per-page drift from original audit.

**Resolution:** 
Extended comprehensive @480px rules in responsive.css (min 44px on buttons/links/role=button, font floor max(0.9375rem,15px) for body/p/small classes/icons; .touch-target-icon for icons). Surgically added classes only to core marketing elements (error, not-found, business-owners, esop). Pro-links bumped as example from audit.

**Rule for all future work:** 
Grep for w-[1-4], text-(xs|sm), p-[0-2] on interactive first (focus marketing/app, exclude admin). Use global rule in responsive + .touch-target* classes for precision. Test at 320px inspector. For text, the 16px floor helps iOS zoom without breaking design. Defer blog/internal to Phase 4.

**Related files:** responsive.css (global + tokens), error/not-found/business-owners/esop files, home-hero (pro-links).

---

## Gotcha #2: Heroes "review" mostly confirmed Phase 1 work; real device still king for dynamic

**What happened:** 
Phase 1 already added calc(env + --mobile-chrome-height) to heroes and cleaned old hacks/legacy in about-page. "Review and fix for dynamic toolbars + notches" didn't require new code, but highlighted that 56px is approximate until measured on real devices with toolbars.

**Why it was painful:** 
No new "fix" felt like incomplete, but per surgical + handoff: don't duplicate. Dynamic varies (iOS notch vs Android gesture).

**Resolution:** 
Confirmed code + updated task/handoff with "no new changes; measure on device". Noted in gotchas.

**Rule for all future work:** 
For 2.3/Phase 1 chrome: always re-measure combined header (GlobalHeader + nav controls + safe-area) on real 320px sim/device with dynamic toolbars. Update var + hero inner padding if >4px off. Test landscape + keyboard. See Phase 1 gotcha #3.

**Related files:** globals.css (var), home-hero/home-page/about-page (padding), Phase 1 handoff.

---

## Gotcha #3: Tokens in responsive.css are great for consolidation but need Phase 3 expansion

**What happened:** 
Container/section padding was inconsistent across home/about/contact (different max-w, x/y rems) causing uneven mobile margins/rhythm. Adding tokens + global @media in responsive helped without breaking per-page.

**Why it was painful:** 
Drift from "many pages have their own responsive" (audit strength but also debt). Risk of over-standardizing design intent.

**Resolution:** 
Added --container-max, --section-y-mobile etc. + rules for .container and sections in mobile media. No per-page edits (surgical). 

**Rule for all future work:** 
When standardizing (2.4/Phase 3), put tokens in responsive.css or dedicated design-tokens file first. Use grep for "max-width:.*px|padding:.*rem" in page CSS. Prefer extending globals for desktop. Phase 3 design system should import these.

**Related files:** responsive.css (tokens + rules), home-page/about-page/contact CSS.

---

## Additional Notes

- Phase 2 heavily reused Phase 1 (touch utilities, chrome var, env, z-1001 respect) per handoff recs - this made enforcement/nav fast.
- Bottom sheet for 2.1 works across sizes (upgrade from dropdown); on desktop it's functional (no regression).
- 16px font floor + 44px in global rules cover most new small text/icons without classes.
- Real device testing still pending for heroes (2.3) - do before Phase 3.
- No new horiz scroll or desktop issues introduced.
- For Phase 3: focus design system on tokens, Playwright for nav/heroes/CTA touch states at key breakpoints.

**Add new gotchas as they are discovered during Phase 2 execution.**  
This file becomes part of the institutional knowledge for the entire mobile fix program.
