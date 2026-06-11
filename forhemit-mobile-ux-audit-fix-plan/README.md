06/11/26 11:32 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Forhemit Marketing Website — Mobile UI/UX Audit Fix Plan

**Created:** 2026-06-11  
**Based on:** Mobile UI/UX Audit Report (apps/marketing)  
**Purpose:** Provide a structured, phased, agent-orchestrated workflow to systematically fix all identified mobile UX issues while preserving the site's strong foundations.

---

## Why This Plan Exists (Improving the Original Approach)

The original audit delivered an excellent, prioritized diagnosis. However, a flat list of issues is hard for sequential agents (or human devs) to execute without losing context, duplicating effort, or missing subtle interactions between fixes.

**This improved system adds:**
- Clear phase boundaries with checklists
- Dedicated task files with acceptance criteria
- **Mandatory handoff notes + gotchas** so every subsequent agent starts with full context + awareness of previous challenges/decisions
- Templates for consistency
- A single source of truth (this folder) that lives with the codebase
- An improved agent prompt template (see below) that can be reused for future audits/fixes

---

## Core Principles (All Agents Must Follow)

1. **Mobile-first verification** — Always test changes on 320–375px widths (iPhone SE class). Use real devices or accurate simulators when possible.
2. **44×44 px minimum touch targets** (WCAG 2.2) — Non-negotiable for all interactive elements.
3. **Consolidate, don't proliferate** — Prefer extending `responsive.css`, globals, or new shared utilities over adding more per-page CSS files.
4. **Preserve strengths** — Progressive forms, clamp typography, Next Image usage, ARIA on hamburger, etc.
5. **Document for the next agent** — Every phase must produce clear handoff notes.
6. **No horizontal scroll. Safe vertical rhythm. No occlusion by keyboard/chrome.**

---

## Folder Structure & How to Navigate

```
forhemit-mobile-ux-audit-fix-plan/
├── README.md                      ← You are here
├── master-checklist.md            ← Overall progress tracker
├── phases/
│   ├── 01-critical-fixes/         ← Highest severity, immediate sprint
│   │   ├── checklist.md
│   │   ├── 01-teamsection-icons.md
│   │   ├── 02-footer.md
│   │   ├── 03-unify-chrome.md
│   │   ├── 04-bump-touch-targets.md
│   │   └── handoff-notes-to-phase2.md
│   ├── 02-short-term/
│   │   ├── checklist.md
│   │   └── ...
│   ├── 03-medium-term/
│   │   └── ...
│   └── 04-testing-polish/
│       └── ...
├── templates/
│   ├── phase-checklist-template.md
│   ├── task-detail-template.md
│   └── handoff-notes-template.md
├── resources/
│   └── original-audit-report.md   ← Full original audit for reference
├── gotchas-archive/               ← Historical gotchas from completed phases
└── improved-agent-prompt.md       ← Reusable prompt for future agents
```

---

## Workflow for Any Agent Starting a Phase

1. Read this `README.md`
2. Read the phase's `checklist.md`
3. Read the **previous phase's `handoff-notes-to-*.md`** (if exists) + any relevant entries in `gotchas-archive/`
4. Read relevant task `.md` files
5. Execute the work following the detailed steps + acceptance criteria
6. Update the phase checklist (mark completed items)
7. **Write the handoff notes** using the template (this is mandatory)
8. Copy key gotchas to `gotchas-archive/phase-XX-gotchas.md`
9. Update `master-checklist.md`
10. Commit with message like: `fix(mobile): Phase 1 - TeamSection icons + Footer (refs #audit-123)`

**The next agent is required to read your handoff notes before touching any code.**

---

## Phases Overview

### Phase 1: Critical Fixes (Immediate)
**Goal:** Eliminate the most painful mobile UX failures that directly hurt conversion and credibility.
**Key Files:** TeamSection.tsx, footer.css, GlobalHeader*, navigation.css, home-hero.css, contact-modal.css, globals.css, responsive.css

**Tasks:**
- Fix TeamSection email/LinkedIn icons (touch targets)
- Fix Footer typography + tap targets collapse
- Unify fixed chrome (header/nav) + add proper safe-area / dvh handling for heroes
- Bump all small buttons, close icons, interactive elements to ≥44px

### Phase 2: Short-term Major Issues
**Goal:** Make the mobile experience feel intentional and consistent rather than patched.
- Upgrade mobile navigation pattern (bottom sheet or improved slide-in)
- Global enforcement of touch-target and 16px font rules
- Fix hero viewport rhythm on home/about with real chrome + notch testing
- Standardize container + section padding system

### Phase 3: Medium-term Structural Improvements
**Goal:** Reduce technical debt and prevent future drift.
- Create/consolidate mobile design system (spacing, type, component variants)
- Add Playwright visual regression + device-specific tests for key breakpoints
- Thorough modal + long-form keyboard testing on small screens
- Implement env(safe-area-inset-*) and dynamic viewport refinements

### Phase 4: Testing, Polish & Handoff
**Goal:** Validate everything works beautifully on real devices and document the new patterns.
- Sweep remaining minor/polish issues
- Cross-device + cross-browser regression
- Update documentation / component stories if applicable
- Final mobile UX sign-off audit (can be done by same or new agent)

---

## Improved Agent Prompt (Reusable)

Copy the content of `improved-agent-prompt.md` when starting a new fix agent session. It incorporates all the lessons from the original audit + this phased system.

---

## Success Criteria (Definition of Done)

- [ ] Zero interactive elements < 44×44px on 320px screens
- [ ] Footer text ≥ 0.75rem / 11–12px and fully tappable without zoom on phones
- [ ] Heroes display complete primary content above the fold on real iOS/Android devices (accounting for dynamic toolbars)
- [ ] Consistent left/right margins and vertical rhythm across all pages on mobile
- [ ] Mobile nav is thumb-reachable and scannable
- [ ] No regressions in desktop/tablet or existing functionality (forms, modals, routing)
- [ ] All handoff notes written and archived
- [ ] Real-device or high-fidelity simulator sign-off

---

**Let's fix this systematically and make the mobile experience a strength instead of a compromise.**

Start by reading `master-checklist.md` and then `phases/01-critical-fixes/checklist.md`.
