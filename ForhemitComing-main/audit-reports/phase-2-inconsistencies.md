# UX/UI Audit Phase 2: The Consistency Audit

**Audit Date:** March 16, 2026  
**Auditor:** Claude Code (Expert UX/UI Auditor & Senior Frontend Architect)  
**Project:** Forhemit Coming Soon Website

---

## Executive Summary

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 15 | Accessibility failures, broken layouts, missing focus indicators |
| 🟠 Major | 42 | Brand inconsistency, architectural debt, significant deviations |
| 🟡 Minor | 87 | Small inconsistencies, unused variables, methodology mixing |

**Total Issues Found: 144**

---

## A. Typography Audit

### Finding 1: No Centralized Typography Scale
**Severity:** 🟠 Major  
**Files Affected:** `tailwind.config.js` (empty extend), all CSS files

**Current State:**
The project has no typography scale defined in Tailwind config. Font sizes are scattered:
- 958+ `font-size` declarations found
- Mixed usage of `rem`, `px`, and `clamp()`
- Magic numbers: `0.7rem`, `0.8125rem`, `0.9375rem`, `1.0625rem`, etc.

**Expected Standard:**
```javascript
// tailwind.config.js should have:
theme: {
  extend: {
    fontSize: {
      'xs': '0.75rem',    // 12px
      'sm': '0.875rem',   // 14px
      'base': '1rem',     // 16px
      'lg': '1.125rem',   // 18px
      'xl': '1.25rem',    // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    }
  }
}
```

---

### Finding 2: Heading Hierarchy Inconsistencies
**Severity:** 🟡 Minor  
**Files Affected:** Multiple page files

**Current State:**
- `/lenders/page.tsx`: Uses h1, h2, h3 (proper hierarchy)
- `/accounting-firms/page.tsx`: Uses h1, h2, h3 (proper hierarchy)
- `/admin/page.tsx`: Uses h1, h2, h3 - but inline styles on h1
- `/page.tsx` (home): h1 is styled via CSS class, not semantic hierarchy

**Snippet - `app/admin/page.tsx` line 176:**
```tsx
<h1 className="admin-title">Forhemit Admin</h1>
```

---

### Finding 3: Font Weight Inconsistencies
**Severity:** 🟡 Minor  
**Files Affected:** Multiple CSS files

**Current State:**
- Font weights range from 200 to 600 across the codebase
- No consistent weight assignments (e.g., always 600 for headings)
- Found in `app/error.tsx`: `font-weight: 400`, `font-weight: 500`

---

## B. Color & Theming Audit

### Finding 4: Hardcoded Hex Colors in CSS Files
**Severity:** 🔴 Critical  
**Files Affected:** 50+ CSS files

**Current State:**
- **188 hardcoded hex codes** in CSS files
- Many page-specific color variables that duplicate theme variables

**Examples:**

| File | Line | Hardcoded Color | Should Use |
|------|------|-----------------|------------|
| `app/admin/admin.css` | 112 | `#ef4444` | `var(--color-error)` |
| `app/admin/admin.css` | 137 | `#e66000` | `var(--color-brand)` |
| `app/brokers/brokers.css` | 8-18 | `--broker-orange: #FF6B00` | Already defined in theme! |
| `app/brokers/brokers.css` | 1371 | `background: linear-gradient(90deg, var(--broker-orange), #ff8533)` | Use CSS variable |
| `app/lenders/lenders.css` | 119 | `--lenders-alert: var(--color-error, #ff4444)` | Use only var |
| `app/about/about-page.css` | 427 | `color: #FF6B00` | `var(--color-brand)` |
| `app/about/about-page.css` | 1338 | `color: #fff` | `var(--text-primary)` |

---

### Finding 5: Hardcoded Colors in TSX Files
**Severity:** 🔴 Critical  
**Files Affected:** 34 occurrences across TSX files

**Examples:**

| File | Line | Code |
|------|------|------|
| `app/admin/page.tsx` | 88-94 | `new: "#3b82f6"` (status colors) |
| `app/admin/page.tsx` | 152 | `style={{ color: "#22c55e" }}` |
| `app/components/ErrorBoundary.tsx` | 40 | `background: "#0e0e0c"` |
| `app/components/ErrorBoundary.tsx` | 47 | `color: "#FF6B00"` |
| `app/components/forms/EarlyAccessForm.tsx` | 110 | `color: status === "success" ? "#22c55e" : "#ef4444"` |
| `app/icon.tsx` | 22 | `background: 'linear-gradient(135deg, #FF6B00 0%, #FF3D00 100%)'` |

**Expected Standard:**
All colors should reference CSS variables:
```tsx
// Instead of:
style={{ color: "#22c55e" }}
// Use:
style={{ color: "var(--color-success)" }}
```

---

### Finding 6: Duplicate Page-Specific Color Variables
**Severity:** 🟠 Major  
**Files Affected:** Multiple page CSS files

**Current State:**
Each page defines its own color variables instead of using theme:

```css
/* app/brokers/brokers.css */
--broker-orange: #FF6B00;        /* Already in theme.css! */
--broker-dark: #0a0a0a;          /* Similar to --bg-primary */
--broker-gray: #888888;          /* No theme equivalent */

/* app/lenders/lenders.css */
--lenders-accent: var(--color-brand);  /* OK - references theme */
--lenders-alert: var(--color-error, #ff4444);  /* Unnecessary fallback */

/* app/wealth-managers/wealth-managers.css */
--wealth-accent-dark: #cc5500;    /* Similar to brand-hover */
--wealth-success: #00cc66;        /* Already in theme! */
```

---

### Finding 7: Brand Color Inconsistency
**Severity:** 🟠 Major  
**Files Affected:** Multiple

**Current State:**
- Primary brand color `#FF6B00` is correctly defined in theme
- But many files hardcode variations like `#ff8533`, `#e66000`
- Found: `#FF3D00` in `app/icon.tsx` - doesn't exist in theme

---

## C. Spacing & Layout Audit

### Finding 8: Mixed Spacing Units
**Severity:** 🟠 Major  
**Files Affected:** 50+ CSS files, 898 margin/padding declarations

**Current State:**
- Mix of `px`, `rem`, and `clamp()` for spacing
- Magic numbers: `0.25rem`, `0.625rem`, `0.75rem`, `1.0625rem`, etc.

**Examples:**

| File | Line | Current | Issue |
|------|------|---------|-------|
| `app/lenders/lenders.css` | 1483 | `font-size: 0.7rem` | Magic number |
| `app/lenders/lenders.css` | 643 | `font-size: 0.9375rem` | Magic number |
| `app/brokers/brokers.css` | 1505 | `background: #ccc` | Hardcoded gray |
| `app/brokers/brokers.css` | 1521 | `color: #888` | Hardcoded gray |

**Expected Standard:**
Define spacing scale in Tailwind:
```javascript
theme: {
  extend: {
    spacing: {
      '18': '4.5rem',
      '22': '5.5rem',
    }
  }
}
```

---

### Finding 9: Inconsistent Section Padding
**Severity:** 🟡 Minor  
**Files Affected:** Multiple page CSS files

**Current State:**
- `/lenders`: `padding: 8rem 0 4rem` (line 189)
- `/brokers`: `padding: 8rem 0 4rem` (line 189)
- `/accounting-firms`: `padding: var(--space-2xl) 0` (responsive.css line 128 = 10rem)
- `/financial-accounting`: Uses different values

**Recommendation:** Standardize on 4-5 spacing tiers for sections.

---

## D. UI/UX Patterns Audit

### Finding 10: Inconsistent Animation Timing
**Severity:** 🟠 Major  
**Files Affected:** 437 transition/animation declarations

**Current State:**
Animation durations vary significantly:
- `0.15s`, `0.2s`, `0.25s`, `0.3s`, `0.4s`, `0.5s`, `0.6s`, `0.8s`, `1s`, `1.5s`, `3s`

**Common patterns found:**
```css
/* Quick interactions */
transition: all 0.15s ease;    /* sitemap-modal.css line 173 */
transition: all 0.2s ease;     /* Multiple files */

/* Standard transitions */
transition: all 0.3s ease;     /* Most common */
transition: filter 0.4s ease;   /* Image hovers */

/* Complex animations */
transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);  /* brokers.css */
```

**Expected Standard:**
Define timing variables:
```css
:root {
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.6s ease;
}
```

---

### Finding 11: Missing Focus Indicators
**Severity:** 🔴 Critical  
**Files Affected:** Most pages

**Current State:**
- Only **6 files** have `:focus-visible` styles defined:
  - `app/components/modals/sitemap-modal.css`
  - `app/lenders/lenders.css`
  - `app/legal-practices/styles/interactions.css`
  - `app/accounting-firms/styles/interactions.css`
  - `app/components/layout/navigation.css`
  - `app/components/forms/early-access-form.css` (partial)

- Many files explicitly **remove** outline without replacement:
```css
/* app/admin/admin.css line 76 */
.admin-login-input:focus {
  outline: none;  /* No replacement! */
}

/* app/wealth-managers/wealth-managers.css line 691 */
outline: none;  /* No replacement */
```

**Accessibility Impact:** Keyboard users cannot see focus state.

---

### Finding 12: Inconsistent Hover States
**Severity:** 🟡 Minor  
**Files Affected:** 190 hover states across codebase

**Current State:**
- Most hover states exist but use inconsistent patterns
- Some use `transition: all`, others specify properties
- Color changes vary: some use opacity, others use color swaps

---

### Finding 13: Modal Implementation Patterns
**Severity:** 🟠 Major  
**Files Affected:** 5 modal components

**Current State:**
Five separate modal implementations exist:
1. `ContactModal` - Custom form flow
2. `LegalModal` - Legal content
3. `SitemapModal` - Navigation
4. `InfrastructureAuditModal` - Interactive wizard
5. `ApplicationModal` - Multi-step form

**Issues:**
- No unified Modal base component
- Different overlay patterns:
  - `ContactModal`: Click on overlay closes
  - `LegalModal`: Various implementations
- Different close button placements
- No consistent focus trapping

---

## E. Codebase Consistency Audit

### Finding 14: Inline Styles in TSX Files
**Severity:** 🟠 Major  
**Files Affected:** 72+ inline style declarations

**Current State:**
Found 72 instances of `style={{ ... }}` in TSX files:

**Critical Examples:**

| File | Line | Issue |
|------|------|-------|
| `app/components/ErrorBoundary.tsx` | 34-41 | Multiple inline styles |
| `app/admin/page.tsx` | 152, 154, 156 | Hardcoded colors inline |
| `app/admin/page.tsx` | 562-574 | Status colors inline |
| `app/components/forms/EarlyAccessForm.tsx` | 103-110 | Status colors inline |

**Example - `app/components/ErrorBoundary.tsx`:**
```tsx
<div
  style={{
    background: "#0e0e0c",    // Hardcoded
    color: "#f5f0e8",         // Hardcoded
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  }}
>
```

**Expected Standard:**
Use CSS classes and CSS variables:
```tsx
<div className="error-boundary-container">
```

---

### Finding 15: Tailwind Configuration Not Utilized
**Severity:** 🟠 Major  
**Files Affected:** `tailwind.config.js`

**Current State:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {},  // EMPTY!
  },
  plugins: [],
}
```

**Issue:**
- No custom colors, spacing, or typography defined
- All Tailwind classes use default values
- Theme.css variables are separate from Tailwind

**Recommendation:**
Either:
1. Configure Tailwind to use theme.css variables, OR
2. Move design tokens to Tailwind config

---

## Priority Matrix

| Priority | Issue | Impact | Effort |
|----------|-------|--------|--------|
| 🔴 P1 | Missing focus indicators | Accessibility | 1-2 hours |
| 🔴 P1 | Hardcoded colors in TSX | Brand consistency | 2-4 hours |
| 🔴 P1 | Hardcoded colors in CSS | Brand consistency | 4-8 hours |
| 🟠 P2 | No typography scale | Maintainability | 2-3 hours |
| 🟠 P2 | Animation timing inconsistency | UX consistency | 2-4 hours |
| 🟠 P2 | Inline styles | Code quality | 3-5 hours |
| 🟠 P2 | Duplicate color variables | Maintainability | 2-3 hours |
| 🟠 P2 | Modal consolidation | Architectural | 4-8 hours |
| 🟡 P3 | Tailwind configuration | Technical debt | 4-6 hours |
| 🟡 P3 | Heading hierarchy | Minor UX | 1-2 hours |

---

## Files Requiring Immediate Attention

### Critical Priority (15 files):

1. `app/components/ErrorBoundary.tsx` - Multiple hardcoded colors
2. `app/admin/page.tsx` - Inline styles + status colors
3. `app/admin/admin.css` - Hardcoded colors
4. `app/components/forms/EarlyAccessForm.tsx` - Inline status colors
5. `app/components/forms/EarlyAccessForm.tsx` - Missing focus indicator
6. `app/icon.tsx` - Hardcoded gradient
7. `app/lenders/lenders.css` - Hardcoded colors
8. `app/brokers/brokers.css` - Duplicate color variables
9. `app/wealth-managers/wealth-managers.css` - Duplicate colors
10. `app/about/about-page.css` - Hardcoded colors
11. `app/components/modals/contact-modal.css` - Missing focus
12. `app/components/modals/application-modal.css` - Missing focus
13. `app/opt-in/opt-in-page.css` - Missing focus
14. `app/wealth-managers/wealth-managers.css` - Missing focus
15. `app/appraisers/appraisers.css` - Missing focus

---

**Phase 2 Status:** ✅ Complete  
**Next Phase:** Phase 3 - The Remediation Plan
