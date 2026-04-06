# 🏗️ LLM-Optimized Refactoring Plan
## Senior Software Architecture Analysis

**Date:** 2026-03-21  
**Target:** Files exceeding 800 lines → Max 400 lines per module  
**Goal:** Optimize for LLM context windows with clear file-naming conventions

---

## 📊 Executive Summary

### Files Exceeding 800 Lines

| File | Lines | Type | Severity | Priority |
|------|-------|------|----------|----------|
| `app/admin/templates.css` | 2,517 | CSS | 🔴 Critical | P0 |
| `app/about/about-page.css` | 2,348 | CSS | 🔴 Critical | P0 |
| `app/brokers/brokers.css` | 1,975 | CSS | 🔴 Critical | P1 |
| `app/lenders/lenders.css` | 1,747 | CSS | 🔴 Critical | P1 |
| `app/page.css` | 1,566 | CSS | 🟠 High | P2 |
| `app/wealth-managers/wealth-managers.css` | 1,457 | CSS | 🟠 High | P2 |
| `app/admin/admin.css` | 1,235 | CSS | 🟠 High | P2 |
| `app/appraisers/appraisers.css` | 930 | CSS | 🟡 Medium | P3 |
| `app/admin/templates/forms/ESOPTermSheetForm.tsx` | 965 | TSX | 🔴 Critical | P0 |
| `components/ESOPHeadToHead.tsx` | 698 | TSX | 🟡 Medium | P3 |

---

## 🎯 Guiding Principles for LLM Context Optimization

### 1. File Naming Conventions
```
feature-domain-concern.ext
│      │      └─ What it does (components, hooks, utils, types)
│      └─ Business domain (esop, deal, contact, audit)
└─ Feature area (admin, public, shared)
```

### 2. Directory Structure Pattern
```
feature/
├── index.ts                 # Public API barrel export
├── components/
│   ├── index.ts             # Component barrel
│   ├── FeatureMain.tsx      # < 300 lines
│   ├── FeatureSection.tsx   # < 200 lines
│   └── FeatureCard.tsx      # < 150 lines
├── hooks/
│   ├── useFeature.ts        # < 150 lines
│   └── useFeatureCalc.ts    # < 150 lines
├── lib/
│   ├── calculations.ts      # Pure functions
│   ├── formatters.ts        # Display helpers
│   └── constants.ts         # Static data
├── types/
│   └── index.ts             # Shared interfaces
└── styles/
    ├── index.css            # Imports partials
    ├── components.css       # < 300 lines
    └── layout.css           # < 300 lines
```

### 3. Import/Export Strategy
```typescript
// index.ts - Single source of truth
export { FeatureMain } from './components/FeatureMain';
export { useFeature } from './hooks/useFeature';
export type { FeatureProps } from './types';

// Consumer imports exactly what they need
import { FeatureMain, useFeature } from '@/app/admin/templates/esop-term-sheet';
```

---

## 🔴 Priority P0: Critical Refactors

### 1. ESOPTermSheetForm.tsx (965 lines) — GOD OBJECT

**Current Issues:**
- 965 lines mixing form UI, calculation logic, visualization components, and tab content
- 8 sub-components defined in same file (Row, Section, DSCRBar, StackBar, ScenarioToggle, OpenItem, Callout)
- Calculation function `calculateScenarios()` is 80+ lines
- 5 tabbed content sections (200+ lines each if separated)
- Hard to test, hard to understand in single LLM context

**Refactoring Plan:**

```
app/admin/templates/esop-term-sheet/
├── index.ts                           # Barrel export
├── ESOPTermSheetForm.tsx              # 300 lines - Main container
├── types.ts                           # UserInputs, Scenario, etc.
├── constants.ts                       # DEFAULT_INPUTS, NAVY, BLUE, etc.
├── lib/
│   ├── calculations.ts                # calculateScenarios() + helpers
│   └── formatters.ts                  # fmt, pct, fmtM functions
├── hooks/
│   └── useTermSheetCalculations.ts    # useMemo wrapper for calcs
└── components/
    ├── index.ts
    ├── TermSheetLayout.tsx            # Header + tabs container
    ├── TabNavigation.tsx              # Tab buttons
    ├── TabContent.tsx                 # Tab switcher
    ├── sections/
    │   ├── TermSheetTab.tsx           # Tab 1 content
    │   ├── SourcesUsesTab.tsx         # Tab 2 content
    │   ├── DebtServiceTab.tsx         # Tab 3 content
    │   ├── SellerEconomicsTab.tsx     # Tab 4 content
    │   └── OpenItemsTab.tsx           # Tab 5 content
    ├── inputs/
    │   ├── StepIndicator.tsx          # Progress indicator
    │   ├── DealBasicsStep.tsx         # Step 1 inputs
    │   ├── FinancingStep.tsx          # Step 2 inputs
    │   ├── CostsStep.tsx              # Step 3 inputs
    │   └── ReviewStep.tsx             # Step 4 review
    └── shared/
        ├── Row.tsx                    # Data row component
        ├── Section.tsx                # Section wrapper
        ├── DSCRBar.tsx                # DSCR visualization
        ├── StackBar.tsx               # Capital stack bar
        ├── ScenarioToggle.tsx         # Scenario selector
        ├── OpenItem.tsx               # Open item display
        └── Callout.tsx                # Info callout box
```

**Line Distribution Target:**
| File | Target Lines | Responsibility |
|------|--------------|----------------|
| ESOPTermSheetForm.tsx | 250 | State management, composition |
| calculations.ts | 150 | Pure calculation logic |
| TermSheetLayout.tsx | 150 | Layout shell, header, footer |
| TabContent.tsx | 100 | Tab routing/switching |
| *Tab.tsx (x5) | 100 each | Tab-specific content |
| *Step.tsx (x4) | 80 each | Step input forms |
| Shared components | 30-50 each | Reusable UI |

**Benefits:**
- ✅ Each file fits comfortably in LLM context (400 lines max)
- ✅ Calculation logic is testable in isolation
- ✅ Components are reusable across templates
- ✅ AI can find logic by filename: `esop-term-sheet/lib/calculations.ts`

---

### 2. templates.css (2,517 lines) — KITCHEN SINK

**Current Issues:**
- CSS for 4+ different templates in one file
- Mixing template grid styles, form styles, document preview styles
- Hard to know which styles apply to which component
- Risk of unintended side effects when modifying

**Refactoring Plan:**

```
app/admin/templates/
├── index.ts                           # Barrel
├── styles/
│   ├── index.css                      # @import all partials
│   ├── base.css                       # Shared template styles (200 lines)
│   ├── grid.css                       # Template card grid (150 lines)
│   ├── preview.css                    # Document preview (200 lines)
│   └── forms/
│       ├── index.css                  # @import form styles
│       ├── base.css                   # Shared form styles (150 lines)
│       ├── cost-reference.css         # ESOPCostReferenceForm (200 lines)
│       ├── head-to-head.css           # ESOPHeadToHeadForm (200 lines)
│       └── term-sheet.css             # ESOPTermSheetForm (350 lines)
├── components/
│   ├── TemplatesTab.tsx
│   ├── DocumentPreviewModal.tsx
│   └── GeneratedDocumentsLog.tsx
└── forms/
    ├── esop-cost-reference/
    ├── esop-head-to-head/
    ├── esop-term-sheet/               # See above
    └── template-builder-guide/
```

**Migration Strategy:**
1. Extract each `/* ── SECTION ── */` block to its own file
2. Use CSS custom properties for shared values
3. Prefix all classes with template identifier (`.tcr-*`, `.h2h-*`, `.term-*`)
4. Create `index.css` that imports all partials

**Before/After Line Counts:**
| Before | After File | Lines |
|--------|------------|-------|
| templates.css (2517) | base.css | 200 |
| | grid.css | 150 |
| | preview.css | 200 |
| | forms/base.css | 150 |
| | forms/cost-reference.css | 250 |
| | forms/head-to-head.css | 550 |
| | forms/term-sheet.css | 700 |
| | **Total** | **~2200** |

---

### 3. about-page.css (2,348 lines) — PAGE-SPECIFIC MONOLITH

**Current Issues:**
- 30+ distinct sections in one file
- Mixes hero, problem/solution, PBC, crisis grid, FAQ, CTA styles
- Sections like `/* ── Hero Section ── */`, `/* ── FAQ Section ── */` should be separate

**Refactoring Plan:**

```
app/about/
├── page.tsx                           # Main page component
├── layout.tsx                         # Page layout
├── styles/
│   ├── index.css                      # @import all
│   ├── base.css                       # Page base styles (150 lines)
│   ├── variables.css                  # Page-specific CSS vars (50 lines)
│   └── sections/
│       ├── hero.css                   # Hero section (200 lines)
│       ├── problem-solution.css       # Problem/solution (250 lines)
│       ├── pbc.css                    # PBC section (150 lines)
│       ├── why-we-exist.css           # Why we exist (200 lines)
│       ├── crisis-grid.css            # Crisis grid (150 lines)
│       ├── mission.css                # Mission section (150 lines)
│       ├── solutions.css              # Solutions (150 lines)
│       ├── faq.css                    # FAQ section (200 lines)
│       └── cta.css                    # CTA section (100 lines)
└── _components/
    └── sections/
        ├── HeroSection.tsx
        ├── ProblemSolutionSection.tsx
        ├── PBCSection.tsx
        ├── WhyWeExistSection.tsx
        ├── CrisisGridSection.tsx
        ├── MissionSection.tsx
        ├── SolutionsSection.tsx
        ├── FAQSection.tsx
        └── CTASection.tsx
```

**Section Extraction Guide:**
```bash
# Each /* ── Section Name ── */ comment becomes a file
# Lines between section headers go to sections/[kebab-case].css
```

---

## 🟠 Priority P1: High-Priority Refactors

### 4. brokers.css (1,975 lines) & lenders.css (1,747 lines)

**Pattern:** Both follow similar structure with page-specific sections

**Refactoring Plan:**
```
app/brokers/
├── page.tsx
├── styles/
│   ├── index.css
│   ├── base.css                       # 150 lines
│   ├── hero.css                       # 200 lines
│   ├── dossier.css                    # 300 lines
│   ├── process.css                    # 250 lines
│   ├── dual-track.css                 # 200 lines
│   ├── promise.css                    # 200 lines
│   ├── dilemma.css                    # 200 lines
│   └── cta.css                        # 100 lines
└── _components/
    └── sections/                      # Already partially done!
        ├── HeroSection.tsx
        ├── DossierSection.tsx
        ├── ProcessSection.tsx
        ├── DualTrackSection.tsx
        ├── PromiseSection.tsx
        ├── DilemmaSection.tsx
        └── CTASection.tsx
```

**Note:** The `_components/sections/` structure already exists for brokers! We just need to split the CSS to match.

---

## 🟡 Priority P2-P3: Medium/Low Priority

### 5. admin.css (1,235 lines)

**Current Issues:**
- Mixes login, tabs, tables, modals, cards styles
- Admin page has multiple concerns

**Refactoring Plan:**
```
app/admin/
├── page.tsx                           # 732 lines → target 250
├── login.tsx                          # Extract if >200 lines
├── styles/
│   ├── index.css
│   ├── base.css                       # Admin base (150 lines)
│   ├── login.css                      # Login styles (150 lines)
│   ├── tabs.css                       # Tab navigation (150 lines)
│   ├── tables.css                     # Data tables (200 lines)
│   ├── cards.css                      # Submission cards (200 lines)
│   └── modals.css                     # Edit/Delete modals (150 lines)
├── hooks/
│   └── useAdminData.ts                # Extract data fetching
└── components/                        # Already exists
    ├── AdminTabs.tsx                  # Extract from page.tsx
    ├── ContactsTab.tsx                # Extract from page.tsx
    ├── EarlyAccessTab.tsx             # Extract from page.tsx
    ├── ApplicationsTab.tsx            # Extract from page.tsx
    ├── StatsTab.tsx                   # Extract from page.tsx
    ├── AuditTab.tsx                   # Extract from page.tsx
    ├── TemplatesTab.tsx               # Already exists
    ├── EditModal.tsx                  # Already exists
    └── DeleteConfirmModal.tsx         # Already exists
```

---

### 6. ESOPHeadToHead.tsx (698 lines) — PROACTIVE REFACTOR

**Current State:** Under 800 lines but close enough to warrant cleanup

**Refactoring Plan:**
```
components/esop-head-to-head/
├── index.ts                           # Re-export from here
├── ESOPHeadToHead.tsx                 # 200 lines - Main container
├── types.ts                           # Data types
├── constants.ts                       # DATA, NAVY, BLUE, GRAY, etc.
├── lib/
│   └── formatters.ts                  # fmt, fmtM
└── components/
    ├── index.ts
    ├── Callout.tsx                    # 40 lines
    ├── Section.tsx                    # 30 lines
    ├── CompareRow.tsx                 # 50 lines
    ├── MetricCard.tsx                 # 60 lines
    ├── VerdictTab.tsx                 # 150 lines
    ├── StructureTab.tsx               # 100 lines
    └── DealCertaintyTab.tsx           # 80 lines
```

---

## 🏛️ Architecture Patterns

### Pattern 1: Barrel Exports
```typescript
// app/admin/templates/esop-term-sheet/index.ts
export { ESOPTermSheetForm } from './ESOPTermSheetForm';
export type { UserInputs, Scenario, CalculatedResults } from './types';
export { calculateScenarios } from './lib/calculations';

// Registry import becomes clean
import { ESOPTermSheetForm } from './forms/esop-term-sheet';
```

### Pattern 2: Component Composition
```typescript
// Before: 965 lines with inline everything
// After: Clean composition
<ESOPTermSheetForm>
  <TermSheetLayout>
    <TabNavigation activeTab={tab} onChange={setTab} />
    <TabContent activeTab={tab}>
      {tab === 'termsheet' && <TermSheetTab data={data} />}
      {tab === 'stack' && <SourcesUsesTab data={data} />}
      {/* ... */}
    </TabContent>
  </TermSheetLayout>
</ESOPTermSheetForm>
```

### Pattern 3: Hook Extraction
```typescript
// hooks/useTermSheetCalculations.ts
export function useTermSheetCalculations(inputs: UserInputs) {
  return useMemo(() => calculateScenarios(inputs), [inputs]);
}

// ESOPTermSheetForm.tsx
const scenarios = useTermSheetCalculations(inputs);
```

### Pattern 4: CSS Module Pattern
```css
/* styles/forms/term-sheet.css */
@layer components {
  .term-form-container { /* ... */ }
  .term-progress { /* ... */ }
  /* All .term-* prefixed classes */
}
```

---

## ✅ Implementation Status

| Phase | Task | Status | Date |
|-------|------|--------|------|
| **1 & 2** | ESOPTermSheetForm.tsx modularization | ✅ Complete | 2026-03-21 |
| **3** | templates.css partial extraction | ✅ Complete | 2026-03-21 |
| **4** | admin/page.tsx tab extraction | 🔄 Pending | - |
| **4** | admin.css partial extraction | 🔄 Pending | - |
| **5-6** | Remaining CSS cleanup | 🔄 Pending | - |

**Policy Created:** [MODULAR_DESIGN.md](./MODULAR_DESIGN.md) - Enforcement from 2026-03-21

---

## 📋 Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Create `app/admin/templates/esop-term-sheet/` directory structure
- [ ] Extract types and constants
- [ ] Move calculation logic to `lib/calculations.ts`
- [ ] Verify imports/exports work correctly
- [ ] Update registry imports

### Phase 2: Component Extraction (Week 1-2)
- [ ] Extract shared components (Row, Section, Callout, etc.)
- [ ] Extract tab content sections
- [ ] Extract step input sections
- [ ] Extract TermSheetLayout shell
- [ ] Refactor main ESOPTermSheetForm to composition pattern

### Phase 3: CSS Modularization (Week 2)
- [ ] Split `templates.css` into partials
- [ ] Split `about-page.css` into section files
- [ ] Create `styles/index.css` barrel imports
- [ ] Update all CSS imports in components

### Phase 4: Admin Page Cleanup (Week 3)
- [ ] Extract tab components from `admin/page.tsx`
- [ ] Split `admin.css` into partials
- [ ] Create `hooks/useAdminData.ts`
- [ ] Refactor page.tsx to use extracted components

### Phase 5: Page CSS Cleanup (Week 3-4)
- [ ] Split `brokers.css` and `lenders.css`
- [ ] Split `page.css` (homepage)
- [ ] Split `wealth-managers.css`
- [ ] Split `appraisers.css`

### Phase 6: Component Library (Week 4)
- [ ] Create shared `components/ui/data-display/` for Row, Section, etc.
- [ ] Move reusable components from ESOP forms
- [ ] Create `components/esop-head-to-head/` structure
- [ ] Final verification and testing

---

## 🧪 Testing Strategy

### For Each Refactoring:
1. **Before:** Take screenshot of working UI
2. **During:** Run `npm run build` after each file move
3. **After:** Visual regression check
4. **Unit Tests:** Add tests for extracted calculation functions
5. **Integration:** Verify form submission still works

### Test Commands:
```bash
# Type checking
npx tsc --noEmit

# Build verification
npm run build

# Find orphaned imports
npx ts-prune

# CSS validation (if tool available)
npx stylelint "**/*.css"
```

---

## 📁 Final Directory Structure

```
app/
├── admin/
│   ├── page.tsx                       # 250 lines (was 732)
│   ├── login.tsx
│   ├── styles/
│   │   ├── index.css                  # @imports
│   │   ├── base.css                   # 150 lines
│   │   ├── login.css                  # 150 lines
│   │   ├── tabs.css                   # 150 lines
│   │   ├── tables.css                 # 200 lines
│   │   └── cards.css                  # 200 lines
│   ├── hooks/
│   │   └── useAdminData.ts            # 150 lines
│   ├── components/
│   │   ├── index.ts                   # Barrel
│   │   ├── AdminTabs.tsx              # 100 lines
│   │   ├── ContactsTab.tsx            # 150 lines
│   │   ├── EarlyAccessTab.tsx         # 120 lines
│   │   ├── ApplicationsTab.tsx        # 150 lines
│   │   ├── StatsTab.tsx               # 100 lines
│   │   ├── AuditTab.tsx               # 120 lines
│   │   ├── TemplatesTab.tsx           # Already exists
│   │   ├── EditModal.tsx              # Already exists
│   │   └── DeleteConfirmModal.tsx     # Already exists
│   └── templates/
│       ├── index.ts
│       ├── styles/
│       │   ├── index.css              # @imports
│       │   ├── base.css               # 200 lines
│       │   ├── grid.css               # 150 lines
│       │   ├── preview.css            # 200 lines
│       │   └── forms/
│       │       ├── index.css
│       │       ├── base.css           # 150 lines
│       │       ├── cost-reference.css # 250 lines
│       │       ├── head-to-head.css   # 550 lines
│       │       └── term-sheet.css     # 350 lines
│       ├── components/
│       │   ├── index.ts
│       │   ├── DocumentPreviewModal.tsx
│       │   └── GeneratedDocumentsLog.tsx
│       ├── forms/
│       │   ├── esop-cost-reference/
│       │   │   ├── index.ts
│       │   │   ├── types.ts
│       │   │   ├── constants.ts
│       │   │   ├── ESOPCostReferenceForm.tsx
│       │   │   └── styles.module.css
│       │   ├── esop-head-to-head/
│       │   │   └── ...
│       │   ├── esop-term-sheet/       # See detailed structure above
│       │   │   ├── index.ts
│       │   │   ├── types.ts           # UserInputs, Scenario, etc.
│       │   │   ├── constants.ts       # DEFAULT_INPUTS, colors
│       │   │   ├── ESOPTermSheetForm.tsx      # 250 lines
│       │   │   ├── lib/
│       │   │   │   ├── calculations.ts        # Pure functions
│       │   │   │   └── formatters.ts          # fmt, pct
│       │   │   ├── hooks/
│       │   │   │   └── useTermSheetCalculations.ts
│       │   │   └── components/
│       │   │       ├── index.ts
│       │   │       ├── TermSheetLayout.tsx
│       │   │       ├── TabNavigation.tsx
│       │   │       ├── TabContent.tsx
│       │   │       ├── sections/
│       │   │       │   ├── TermSheetTab.tsx
│       │   │       │   ├── SourcesUsesTab.tsx
│       │   │       │   ├── DebtServiceTab.tsx
│       │   │       │   ├── SellerEconomicsTab.tsx
│       │   │       │   └── OpenItemsTab.tsx
│       │   │       ├── inputs/
│       │   │       │   ├── StepIndicator.tsx
│       │   │       │   ├── DealBasicsStep.tsx
│       │   │       │   ├── FinancingStep.tsx
│       │   │       │   ├── CostsStep.tsx
│       │   │       │   └── ReviewStep.tsx
│       │   │       └── shared/
│       │   │           ├── Row.tsx
│       │   │           ├── Section.tsx
│       │   │           ├── DSCRBar.tsx
│       │   │           ├── StackBar.tsx
│       │   │           ├── ScenarioToggle.tsx
│       │   │           ├── OpenItem.tsx
│       │   │           └── Callout.tsx
│       │   └── template-builder-guide/
│       └── registry.ts
├── about/
│   ├── page.tsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── base.css
│   │   ├── variables.css
│   │   └── sections/                  # 9 section files
│   │       ├── hero.css
│   │       ├── problem-solution.css
│   │       ├── pbc.css
│   │       ├── why-we-exist.css
│   │       ├── crisis-grid.css
│   │       ├── mission.css
│   │       ├── solutions.css
│   │       ├── faq.css
│   │       └── cta.css
│   └── _components/sections/          # Already exists
├── brokers/                           # Similar structure
├── lenders/                           # Similar structure
└── ...

components/
├── ui/                                # Primitive components
│   ├── button.tsx
│   ├── card.tsx
│   ├── tabs.tsx
│   └── data-display/                  # Shared data components
│       ├── Row.tsx
│       ├── Section.tsx
│       ├── Callout.tsx
│       ├── DSCRBar.tsx
│       └── StackBar.tsx
├── layout/
│   ├── Header.tsx
│   └── Footer.tsx
└── esop-head-to-head/                 # Refactored structure
    ├── index.ts
    ├── ESOPHeadToHead.tsx
    ├── types.ts
    ├── constants.ts
    ├── lib/
    │   └── formatters.ts
    └── components/
        ├── Callout.tsx
        ├── Section.tsx
        ├── CompareRow.tsx
        ├── MetricCard.tsx
        ├── VerdictTab.tsx
        ├── StructureTab.tsx
        └── DealCertaintyTab.tsx
```

---

## 🎓 Lessons for AI Agents

### Finding Logic by Filename:
```bash
# ESOP term sheet calculations
find . -path "*/esop-term-sheet/lib/calculations*"

# Admin data hooks
find . -path "*/admin/hooks/*"

# Shared UI components
find . -path "*/ui/data-display/*"
```

### Understanding a Feature:
1. Read `feature/index.ts` for public API
2. Read `feature/types.ts` for data structures
3. Read `feature/components/index.ts` for available components
4. Read specific component for implementation details

### Safe Refactoring Checklist:
- [ ] File is under 400 lines after change
- [ ] All imports use barrel exports
- [ ] No circular dependencies
- [ ] Types extracted to `types.ts`
- [ ] Constants extracted to `constants.ts`
- [ ] Functions under 50 lines
- [ ] Components under 200 lines

---

## 📈 Success Metrics

| Metric | Before | After Target |
|--------|--------|--------------|
| Files > 800 lines | 10 | 0 |
| Files > 400 lines | ~20 | < 5 |
| Avg file size | 280 lines | 180 lines |
| Test coverage | ~30% | > 60% |
| Build time | Baseline | -10% |
| Bundle size | Baseline | -5% |

---

## 📝 Notes

1. **Preserve Functionality:** No logic changes, only organization
2. **Incremental Migration:** Can be done file-by-file
3. **Backwards Compatibility:** Keep registry.ts working throughout
4. **CSS Variables:** Use CSS custom properties for theming consistency
5. **Import Sorting:** Group imports: React → Libs → Absolute → Relative

---

*This plan optimizes the codebase for both human and AI comprehension, making it easier to maintain, test, and extend.*
