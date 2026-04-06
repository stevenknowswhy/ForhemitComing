# Forhemit Codebase Standards

## 📋 Quick Reference

| Document | Purpose |
|----------|---------|
| **AGENTS.md** | This file - Quick reference & high-level standards |
| **MODULAR_DESIGN.md** | Complete modular design policy, patterns, and enforcement |
| **REFACTORING_PLAN.md** | Legacy refactoring roadmap and architecture decisions |

---

## File Size Limits

**Maximum file size: 800 lines of code**

This rule applies to all source files (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.scss`).

### Soft Targets (Preferred)

| File Type | Soft Limit | Hard Limit |
|-----------|------------|------------|
| TSX Components | 400 lines | 800 lines |
| TS Logic/Hooks | 300 lines | 800 lines |
| CSS/SCSS | 400 lines | 800 lines |
| Tests | 600 lines | 1000 lines |

### Why 800 Lines?
- **LLM Context**: Models have optimal comprehension around 400-800 lines
- **Cognitive load**: Files larger than 800 lines become difficult to understand
- **Single Responsibility**: Large files often violate SRP
- **Testing**: Smaller files are easier to unit test effectively
- **Code Review**: Reviewers can thoroughly review 800 lines in a reasonable timeframe
- **Navigation**: IDE navigation works better with smaller files

---

## 🏗️ Feature-Based Directory Structure (REQUIRED)

All new features MUST follow this structure:

```
feature-name/                    # e.g., esop-term-sheet, deal-comparison
├── index.ts                     # Public API barrel export (REQUIRED)
├── types.ts                     # Shared interfaces/types
├── constants.ts                 # Static data, configuration
├── FeatureName.tsx              # Main component (< 400 lines)
├── lib/                         # Business logic
│   ├── calculations.ts          # Pure calculation functions
│   ├── validators.ts            # Input validation
│   └── formatters.ts            # Display formatting
├── hooks/                       # Custom React hooks
│   ├── useFeature.ts            # Main feature hook
│   └── useFeatureData.ts        # Data fetching
├── components/                  # Feature-specific components
│   ├── index.ts                 # Component barrel
│   ├── inputs/                  # Form inputs
│   ├── sections/                # Page/tab sections
│   └── shared/                  # Internal shared components
└── styles/                      # Scoped styles (optional)
    └── index.css
```

### File Naming Convention
```
feature-domain-concern.ext
│      │      └─ components, hooks, lib, types
│      └─ esop, deal, contact, audit, auth
└─ admin, public, shared
```

**Good Examples:**
- `esop-term-sheet/lib/calculations.ts` ✓
- `admin/hooks/useAdminData.ts` ✓
- `deal-comparison/components/ComparisonRow.tsx` ✓

---

## Component Size Guidelines

| Component Type | Max Lines | Responsibility |
|----------------|-----------|----------------|
| **Presentational** | 200 lines | Display only, no business logic |
| **Container** | 400 lines | State management, data flow |
| **Page** | 300 lines | Composition of sections |
| **Section** | 250 lines | Logical page section |
| **Hook** | 150 lines | Single concern |
| **Utility Function** | 50 lines | Do one thing well |

---

## ✅ Pre-Commit Checklist

Before committing:

- [ ] No files exceed 800 lines (`wc -l`)
- [ ] Feature has an `index.ts` barrel export
- [ ] Components are under 400 lines (soft limit)
- [ ] Types extracted to `types.ts`
- [ ] Constants extracted to `constants.ts`
- [ ] Functions under 50 lines each
- [ ] Build passes (`npm run build`)
- [ ] TypeScript check passes (`npx tsc --noEmit`)

---

## 🔍 Quick Checks

### Check File Sizes
```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) \
  ! -path "./node_modules/*" ! -path "./.next/*" \
  -exec wc -l {} + | sort -rn | head -20
```

### Check Specific Feature
```bash
wc -l app/admin/templates/forms/esop-term-sheet/**/*.ts
```

---

## 📚 Reference Architecture

### Example: Modular Feature (ESOP Term Sheet)

```
esop-term-sheet/
├── index.ts              # 30 lines - Barrel export
├── types.ts              # 70 lines - Interfaces
├── constants.ts          # 80 lines - Defaults, colors
├── ESOPTermSheetForm.tsx # 356 lines - Main component ✅
├── lib/
│   ├── calculations.ts   # 172 lines - Pure functions
│   └── formatters.ts     # 7 lines - Utilities
├── hooks/
│   └── useTermSheetCalculations.ts  # 13 lines
└── components/
    ├── inputs/           # 4 files, ~100 lines each
    ├── sections/         # 5 files, ~200 lines each
    └── shared/           # 8 files, ~50 lines each
```

**Total: 28 files, max 449 lines each** (was 1 file with 965 lines)

---

## 🚫 Anti-Patterns

### The God Object (AVOID)
```tsx
// ❌ DON'T: One file with everything
function App() {
  // 500 lines of state
  // 300 lines of API calls
  // 400 lines of JSX
  // 200 lines of helpers
}
```

### Mixed Concerns (AVOID)
```tsx
// ❌ DON'T: UI + Logic + API + Types in one file
function Component() {
  interface Props { }  // Extract to types.ts
  const fetchData = () => { };  // Extract to lib/api.ts
  const calculate = () => { };  // Extract to lib/calculations.ts
  // ... JSX
}
```

---

## 📖 Detailed Documentation

For complete policy, patterns, and enforcement:

→ **See [MODULAR_DESIGN.md](./MODULAR_DESIGN.md)**

Includes:
- Complete directory structure specification
- How-to guides for splitting large files
- Barrel export patterns
- CSS organization standards
- Pre-commit hooks
- Exception process

---

## CSS Organization

### File Size Limits for CSS
- **Component CSS**: 300 lines max (use CSS modules)
- **Page-specific CSS**: 400 lines max
- **Global CSS**: 200 lines max

### CSS Architecture
- Use CSS variables for theming (defined in `styles/variables.css`)
- Prefer component-scoped styles over global styles
- Group related styles together with clear section comments
- Use prefixed class names: `.esop-form-container`, `.h2h-card`, etc.

---

## Exceptions

The following MAY exceed 800 lines with justification:
- Auto-generated files (e.g., from codegen)
- Configuration files with many options
- Test files with extensive test cases

**Process:** Add `// EXCEPTION: [reason]` comment and get tech lead approval.

---

*For complete guidelines, see [MODULAR_DESIGN.md](./MODULAR_DESIGN.md)*
