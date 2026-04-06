# Modular Design Policy
## 800-Line Limit & Architectural Standards

**Version:** 1.0  
**Effective Date:** 2026-03-21  
**Applies To:** All TypeScript, TSX, JavaScript, JSX, CSS, and SCSS files

---

## 🎯 The 800-Line Rule

### Absolute Maximums

| File Type | Hard Limit | Soft Target | Rationale |
|-----------|------------|-------------|-----------|
| **TSX Components** | 800 lines | 400 lines | Cognitive load, LLM context |
| **TS Logic/Hooks** | 800 lines | 300 lines | Testability, single responsibility |
| **CSS/SCSS** | 800 lines | 400 lines | Maintainability, scoping |
| **Tests** | 1000 lines | 600 lines | Test suite organization |

### Why 800 Lines?

1. **LLM Context Windows:** GPT-4, Claude, and other models have optimal comprehension around 400-800 lines of context
2. **Code Review:** Human reviewers can effectively review ~800 lines in a single session
3. **Cognitive Load:** Files larger than 800 lines typically violate Single Responsibility Principle
4. **Navigation:** IDE search, grep, and file explorers work better with smaller files
5. **Testing:** Smaller files are easier to unit test effectively

---

## 🏗️ Directory Structure Standard

### Feature-Based Organization

Every feature MUST follow this structure:

```
feature-name/                    # e.g., esop-term-sheet, deal-comparison
├── index.ts                     # Public API barrel export (REQUIRED)
├── types.ts                     # Shared interfaces/types
├── constants.ts                 # Static data, configuration
├── utils.ts                     # Pure utility functions
├── FeatureName.tsx              # Main component (< 400 lines)
├── lib/                         # Business logic
│   ├── calculations.ts          # Pure calculation functions
│   ├── validators.ts            # Input validation
│   ├── formatters.ts            # Display formatting
│   └── helpers.ts               # General helpers
├── hooks/                       # Custom React hooks
│   ├── useFeature.ts            # Main feature hook
│   ├── useFeatureData.ts        # Data fetching
│   └── useFeatureCalculations.ts # Computed values
├── components/                  # Feature-specific components
│   ├── index.ts                 # Component barrel
│   ├── FeatureHeader.tsx        # Header component
│   ├── FeatureSection.tsx       # Section wrapper
│   ├── FeatureCard.tsx          # Card component
│   ├── inputs/                  # Form inputs (if applicable)
│   │   ├── TextInput.tsx
│   │   ├── NumberInput.tsx
│   │   └── index.ts
│   ├── sections/                # Page/tab sections
│   │   ├── OverviewSection.tsx
│   │   ├── DetailsSection.tsx
│   │   └── index.ts
│   └── shared/                  # Internal shared components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── index.ts
└── styles/                      # Scoped styles (optional)
    ├── index.css
    └── components.css
```

### File Naming Convention

```
feature-domain-concern.ext
│      │      └─ What it does (components, hooks, lib, types)
│      └─ Domain/scope (esop, deal, contact, audit, auth)
└─ Feature area (admin, public, shared, internal)
```

**Examples:**
- `esop-term-sheet/lib/calculations.ts` ✓
- `admin/hooks/useAdminData.ts` ✓
- `deal-comparison/components/ComparisonRow.tsx` ✓
- `components/ui/data-display/MetricCard.tsx` ✓

---

## 📏 Component Size Guidelines

### By Component Type

| Component Type | Max Lines | Responsibility |
|----------------|-----------|----------------|
| **Presentational** | 200 lines | Display only, no business logic |
| **Container** | 400 lines | State management, data flow |
| **Page** | 300 lines | Composition of sections |
| **Section** | 250 lines | Logical page section |
| **Hook** | 150 lines | Single concern |
| **Utility Function** | 50 lines | Do one thing well |

### When to Split

Split a file when ANY of these are true:

1. **Line count exceeds 400** (soft warning)
2. **Line count exceeds 800** (hard error - must split)
3. **More than 3 logical concerns** in one file
4. **More than 5 sub-components** defined inline
5. **Mixed layers:** UI + API calls + calculations + types
6. **Difficult to name** the file descriptively

---

## 🔨 How to Split Large Files

### Pattern 1: Extract Types & Constants

**Before (monolith):**
```tsx
// MyFeature.tsx (900 lines)
interface Props { ... }
interface State { ... }
const DEFAULT_VALUE = 100;
const COLORS = { ... };
function calculateX() { ... }
function formatY() { ... }
export function MyFeature() { ... }
```

**After (modular):**
```tsx
// types.ts (50 lines)
export interface Props { ... }
export interface State { ... }

// constants.ts (30 lines)
export const DEFAULT_VALUE = 100;
export const COLORS = { ... };

// lib/calculations.ts (80 lines)
export function calculateX() { ... }

// lib/formatters.ts (40 lines)
export function formatY() { ... }

// MyFeature.tsx (200 lines)
import { Props, State } from './types';
import { DEFAULT_VALUE, COLORS } from './constants';
import { calculateX } from './lib/calculations';
import { formatY } from './lib/formatters';
export function MyFeature() { ... }
```

### Pattern 2: Extract Sub-Components

**Before:**
```tsx
function Page() {
  return (
    <div>
      {/* 200 lines of header JSX */}
      {/* 300 lines of content JSX */}
      {/* 150 lines of footer JSX */}
    </div>
  );
}
```

**After:**
```tsx
import { Header } from './components/Header';
import { Content } from './components/Content';
import { Footer } from './components/Footer';

function Page() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
```

### Pattern 3: Extract Tab/Section Content

**Before:**
```tsx
function Dashboard() {
  const [tab, setTab] = useState('overview');
  return (
    <div>
      {tab === 'overview' && <div>{/* 200 lines */}</div>}
      {tab === 'details' && <div>{/* 250 lines */}</div>}
      {tab === 'settings' && <div>{/* 180 lines */}</div>}
    </div>
  );
}
```

**After:**
```tsx
import { OverviewTab } from './components/tabs/OverviewTab';
import { DetailsTab } from './components/tabs/DetailsTab';
import { SettingsTab } from './components/tabs/SettingsTab';

function Dashboard() {
  const [tab, setTab] = useState('overview');
  return (
    <div>
      {tab === 'overview' && <OverviewTab />}
      {tab === 'details' && <DetailsTab />}
      {tab === 'settings' && <SettingsTab />}
    </div>
  );
}
```

---

## 📦 Barrel Export Pattern (REQUIRED)

Every feature directory MUST have an `index.ts` barrel file:

```typescript
// feature-name/index.ts

// Main component
export { FeatureComponent } from './FeatureComponent';
export { FeatureComponent as default } from './FeatureComponent';

// Types
export type { 
  FeatureProps, 
  FeatureState, 
  FeatureData 
} from './types';

// Constants
export { 
  DEFAULT_CONFIG, 
  FEATURE_LIMITS 
} from './constants';

// Utilities
export { 
  calculateFeature,
  validateFeature,
  formatFeature 
} from './lib';

// Hooks
export { 
  useFeature,
  useFeatureData 
} from './hooks';
```

**Import from feature root:**
```typescript
// ✅ Correct - import from barrel
import { FeatureComponent, useFeature } from './feature-name';

// ❌ Wrong - deep imports bypass barrel
import { FeatureComponent } from './feature-name/FeatureComponent';
```

---

## 🎨 CSS/SCSS Standards

### File Size Limits

| CSS Type | Max Lines | Strategy |
|----------|-----------|----------|
| **Component CSS** | 300 lines | CSS Modules per component |
| **Page CSS** | 400 lines | Split by section |
| **Global CSS** | 200 lines | Use CSS variables, minimal |

### CSS Organization

```css
/* feature-name/styles/index.css */

/* 1. CSS Variables (scoped to feature) */
@import './variables.css';

/* 2. Base/feature styles */
@import './base.css';

/* 3. Component styles */
@import './components.css';

/* 4. Responsive overrides */
@import './responsive.css';
```

### Naming Convention

Use prefixed class names to avoid collisions:

```css
/* feature-name/styles/components.css */
.esop-form-container { }
.esop-form-header { }
.esop-form-field { }
.esop-form-input { }

/* feature-name/styles/responsive.css */
@media (max-width: 768px) {
  .esop-form-container { }
}
```

---

## ✅ Pre-Commit Checklist

Before committing, verify:

- [ ] No files exceed 800 lines
- [ ] Feature has an `index.ts` barrel export
- [ ] Components are under 400 lines (soft limit)
- [ ] Types extracted to `types.ts`
- [ ] Constants extracted to `constants.ts`
- [ ] Functions under 50 lines each
- [ ] No circular imports
- [ ] Build passes (`npm run build`)
- [ ] TypeScript check passes (`npx tsc --noEmit`)

---

## 🔍 Enforcement Tools

### Check File Sizes

```bash
# Find all files over 800 lines
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./convex/_generated/*" \
  -exec wc -l {} + | sort -rn | head -20
```

### Check Specific File

```bash
wc -l app/admin/templates/forms/ESOPTermSheetForm.tsx
```

### Pre-Commit Hook (Recommended)

Add to `.husky/pre-commit` or package.json scripts:

```bash
#!/bin/bash
# Check for files over 800 lines
LARGE_FILES=$(find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./convex/_generated/*" \
  -exec wc -l {} + | awk '$1 > 800 {print $2}')

if [ -n "$LARGE_FILES" ]; then
  echo "❌ Error: Files exceed 800 line limit:"
  echo "$LARGE_FILES"
  exit 1
fi
```

---

## 📚 Examples

### Good: Modular Feature

```
esop-term-sheet/
├── index.ts              # 30 lines
├── types.ts              # 70 lines
├── constants.ts          # 80 lines
├── ESOPTermSheetForm.tsx # 356 lines ✅
├── lib/
│   ├── calculations.ts   # 172 lines
│   └── formatters.ts     # 7 lines
├── hooks/
│   └── useTermSheetCalculations.ts  # 13 lines
└── components/
    ├── inputs/           # 4 files, ~100 lines each
    ├── sections/         # 5 files, ~200 lines each
    └── shared/           # 8 files, ~50 lines each
```

### Bad: Monolithic Feature

```
ESOPTermSheetForm.tsx   # 965 lines ❌
```

---

## 🚫 Anti-Patterns to Avoid

### 1. The God Object
```tsx
// ❌ DON'T: One file with everything
function App() {
  // 500 lines of state
  // 300 lines of API calls
  // 400 lines of JSX
  // 200 lines of helper functions
}
```

### 2. Deep Nesting
```tsx
// ❌ DON'T: Excessive nesting
<div>
  <div>
    <div>
      <div>{/* content */}</div>
    </div>
  </div>
</div>
```

### 3. Mixed Concerns
```tsx
// ❌ DON'T: UI + Logic + API + Types in one file
function Component() {
  interface Props { }  // Extract to types.ts
  const API_URL = '';  // Extract to constants.ts
  const fetchData = () => { };  // Extract to lib/api.ts
  const calculate = () => { };  // Extract to lib/calculations.ts
  // ... JSX
}
```

### 4. Default Exports Only
```tsx
// ❌ DON'T: Only default export
export default function Component() { }

// ✅ DO: Named + default export
export function Component() { }
export default Component;
```

---

## 🔄 Refactoring Workflow

When you encounter a file over 800 lines:

1. **Analyze:** Identify logical boundaries (UI, logic, data, types)
2. **Extract Types:** Move interfaces to `types.ts`
3. **Extract Constants:** Move static data to `constants.ts`
4. **Extract Logic:** Move pure functions to `lib/*.ts`
5. **Extract Hooks:** Move stateful logic to `hooks/*.ts`
6. **Extract Components:** Move sub-components to `components/*.tsx`
7. **Create Barrel:** Add `index.ts` with public exports
8. **Update Imports:** Point consumers to barrel
9. **Verify:** Run build and tests
10. **Commit:** Atomic commit with clear message

---

## 📊 Success Metrics

Track these metrics over time:

| Metric | Target | Current |
|--------|--------|---------|
| Files > 800 lines | 0 | ? |
| Files > 400 lines | < 5% | ? |
| Average file size | < 200 lines | ? |
| Features with barrels | 100% | ? |
| Test coverage | > 60% | ? |

---

## 📝 Exceptions

The following MAY exceed 800 lines with justification:

1. **Auto-generated files** (e.g., from codegen, migrations)
2. **Data/configuration files** with extensive options
3. **Test files** with many related test cases (prefer splitting by feature)
4. **Third-party vendored code** (mark with `// VENDOR` comment)

**Exception Process:**
1. Add comment at top: `// EXCEPTION: [reason]`
2. Document in PR why splitting would hurt maintainability
3. Get approval from tech lead

---

## 🎯 Benefits

Following this policy provides:

- ✅ **AI-Friendly:** LLMs can process files in single context window
- ✅ **Code Review:** Faster, more thorough reviews
- ✅ **Testing:** Easier to write focused unit tests
- ✅ **Debugging:** Clear file names indicate where to look
- ✅ **Onboarding:** New devs understand codebase faster
- ✅ **Refactoring:** Safer to modify isolated modules
- ✅ **Reusability:** Components are decoupled and portable

---

**Remember:** The goal is not just smaller files—it's clearer architecture, better testability, and maintainable code that both humans and AI can understand.

---

*Last Updated: 2026-03-21*  
*Enforcement: Immediate*  
*Review Cycle: Quarterly*
