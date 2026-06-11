06/11/26 11:32 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Task Detail Template

**Task ID:** [e.g. 1.1]  
**Title:** [Clear action-oriented title]  
**Phase:** [Which phase this belongs to]  
**Priority:** Critical / High / Medium / Low  
**Status:** Not Started / In Progress / Done / Blocked

## Problem Statement (from original audit)

[Quote or paraphrase the exact issue from the audit report]

## Goal / Desired Outcome

[What "good" looks like after this task. Be specific and measurable, e.g. "All icons in TeamSection have ≥44×44px tap targets on 320px screens with clear visual feedback"]

## Files to Modify

- `path/to/file1.tsx` — reason
- `path/to/file2.css` — reason

## Detailed Steps

1. [First concrete action]
2. [Second...]
3. Verify on multiple breakpoints using dev tools + real device if possible
4. Run any existing tests / lint

## Acceptance Criteria (Definition of Done for this task)

- [ ] Specific, testable condition 1
- [ ] Specific, testable condition 2 (e.g. "No tap target smaller than 44px remains in this component")
- [ ] Visual regression or manual check on 320px, 375px, landscape passes
- [ ] No console errors or layout shifts introduced
- [ ] Desktop experience unchanged or improved

## Potential Gotchas & Watch-outs (from previous phases or audit)

- [List known risks, interactions with other components, CSS specificity issues, etc.]
- Example: "The current fixed header uses z-1001 — any new mobile menu must respect this stacking context or it will be covered."

## References

- Original audit section: [link or quote]
- Related components: [TeamSection, GlobalHeader, etc.]
- Design tokens or utilities to reuse: [responsive.css touch-target classes, etc.]

## Handoff Notes for Next Agent (if this task reveals something important)

(Only fill if this task uncovers new challenges that future phases should know about)

---

**Instructions for Agent:** Complete all acceptance criteria before marking this task done. Update the phase checklist. Add any new gotchas to the phase handoff notes.
