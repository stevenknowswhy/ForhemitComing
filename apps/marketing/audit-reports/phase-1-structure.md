# UX/UI Audit Phase 1: Structural Mapping & Discovery

**Audit Date:** March 16, 2026  
**Auditor:** Claude Code (Expert UX/UI Auditor & Senior Frontend Architect)  
**Project:** Forhemit Coming Soon Website

---

## 1. Global Architecture Map

### 1.1 Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16.1.6 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | 3.4.17 |
| Animation | Framer Motion | 12.35.1 |
| Icons | Lucide React | 0.577.0 |
| Database | Convex | 1.33.0 |
| Error Tracking | Sentry | 10.43.0 |
| File Uploads | UploadThing | 7.7.4 |

### 1.2 Design System Architecture

**Theme Configuration Location:** `app/styles/theme.css`

The project uses a CSS Variables-based theming system with dual-mode support (dark/light):

```
app/
├── styles/
│   ├── theme.css          # Core theme variables (colors, shadows, effects)
│   ├── variables.css      # Legacy aliases for backward compatibility
│   ├── home-page.css     # Home page specific styles
│   ├── loading.css       # Loading spinner styles
│   └── ...
├── globals.css            # Global reset and base styles
├── layout.tsx            # Root layout with font configuration
└── components/
    ├── layout/
    │   ├── navigation.css
    │   └── footer.css
    ├── modals/
    │   ├── sitemap-modal.css
    │   ├── contact-modal.css
    │   ├── legal-modal.css
    │   └── infrastructure-audit.css
    └── forms/
        ├── early-access-form.css
        └── application/
            └── application-modal.css
```

### 1.3 Key CSS Variables Found

#### Brand Colors (Constant across themes)
```css
--color-brand: #FF6B00
--color-brand-hover: #ff8c33
--color-brand-subtle: rgba(255, 107, 0, 0.1)
--color-brand-border: rgba(255, 107, 0, 0.3)
```

#### Background Colors (Dark Theme Default)
```css
--bg-primary: #0e0e0c
--bg-secondary: #1a1209
--bg-tertiary: #141410
--bg-card: rgba(255, 255, 255, 0.03)
--bg-glass: rgba(255, 255, 255, 0.05)
```

#### Text Colors (Dark Theme)
```css
--text-primary: #f5f0e8
--text-secondary: #a09a90
--text-muted: #5a544a
--text-inverse: #1a1612
```

#### Status Colors
```css
--color-success: #00cc66 / #059669 (light)
--color-error: #ff4444 / #dc2626 (light)
```

### 1.4 Font Configuration

**Location:** `app/layout.tsx`

Google Fonts configured:
- **Cormorant Garamond** (--font-cormorant): 300, 400, 500, 600 weights
- **DM Mono** (--font-dm-mono): 300, 400, 500 weights
- **Outfit** (--font-outfit): 200, 300, 400, 500 weights
- **Inter** (--font-inter): Default sans-serif

---

## 2. Component Inventory

### 2.1 Layout Components

| Component | Location | Styling Method | Props Interface |
|-----------|----------|----------------|-----------------|
| Navigation | `app/components/layout/Navigation.tsx` | CSS Module + CSS Variables | `{ variant?: "dark" \| "light" }` |
| GlobalFooter | `app/components/layout/GlobalFooter.tsx` | CSS Module | None |
| ThemeToggle | `app/components/ui/ThemeToggle.tsx` | CSS Variables | None |

### 2.2 Modal Components

| Component | Location | Styling Method | Key Props |
|-----------|----------|----------------|-----------|
| ContactModal | `app/components/modals/ContactModal.tsx` | CSS Module | `{ isOpen, onClose, source }` |
| LegalModal | `app/components/modals/LegalModal.tsx` | CSS Module | `{ isOpen, onClose }` |
| SitemapModal | `app/components/modals/SitemapModal.tsx` | CSS Module | `{ isOpen, onClose }` |
| InfrastructureAuditModal | `app/components/modals/InfrastructureAuditModal.tsx` | CSS Module | `{ isOpen, onClose }` |
| ApplicationModal | `app/components/forms/application/ApplicationModal.tsx` | CSS Module | `{ isOpen, onClose }` |

### 2.3 Form Components

| Component | Location | Styling Method | Key Props |
|-----------|----------|----------------|-----------|
| EarlyAccessForm | `app/components/forms/EarlyAccessForm.tsx` | CSS Module | None |
| ProgressBar | `app/components/forms/application/components/ProgressBar.tsx` | CSS Module | `{ progress: number }` |
| ResumeUpload | `app/components/forms/application/components/ResumeUpload.tsx` | CSS Module | `{ onUpload }` |

### 2.4 Utility Components

| Component | Location | Styling Method | Notes |
|-----------|----------|----------------|-------|
| Toast | `app/components/ui/Toast.tsx` | CSS Module | Toast notifications |
| ErrorBoundary | `app/components/ErrorBoundary.tsx` | Inline styles | Error handling |
| ClientOnly | `components/ClientOnly.tsx` | None | SSR helper |

### 2.5 Visualization Components (Root /components/)

| Component | Location |
|-----------|----------|
| SignatureAnimation | `components/visualizations/SignatureAnimation.tsx` |
| DataTicker | `components/visualizations/DataTicker.tsx` |
| DealFlowSimulator | `components/visualizations/DealFlowSimulator.tsx` |
| ComparisonTable | `components/visualizations/ComparisonTable.tsx` |
| TwentyFourHourFolder | `components/visualizations/TwentyFourHourFolder.tsx` |
| DealRadar | `components/visualizations/DealRadar.tsx` |
| DossierCard | `components/cards/DossierCard.tsx` |
| FAQItem | `components/ui/FAQItem.tsx` |
| ScrollReveal | `components/animation/ScrollReveal.tsx` |

---

## 3. Page Templates

### 3.1 Route Inventory (19 Pages)

| Route | Template Type | Has Loading State | Has _components |
|-------|---------------|-------------------|------------------|
| `/` | Landing Page | ❌ | ❌ |
| `/about` | Content Page | ❌ | ✅ |
| `/accounting-firms` | Landing Page | ✅ | ❌ |
| `/admin` | Admin Dashboard | ❌ | ✅ (components/) |
| `/appraisers` | Landing Page | ✅ | ❌ |
| `/brokers` | Landing Page | ✅ | ❌ |
| `/business-owners` | Landing Page | ❌ | ✅ |
| `/coming-soon` | Placeholder | ❌ | ❌ |
| `/faq` | FAQ Page | ❌ | ✅ (_components/) |
| `/financial-accounting` | Landing Page | ✅ | ❌ |
| `/introduction` | Content Page | ❌ | ❌ |
| `/legal-practices` | Landing Page | ❌ | ✅ (_components/) |
| `/lenders` | Landing Page | ✅ | ❌ |
| `/opt-in` | Form Page | ❌ | ❌ |
| `/privacy` | Legal Page | ❌ | ❌ |
| `/terms` | Legal Page | ❌ | ❌ |
| `/wealth-managers` | Landing Page | ✅ | ❌ |
| `/beyond-the-balance-sheet` | Content Page | ❌ | ❌ |
| `/the-exit-crisis` | Content Page | ❌ | ✅ (_components/) |

---

## 4. Tailwind Configuration Assessment

### 4.1 Current Configuration

**Location:** `tailwind.config.js`

```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},  // ⚠️ EMPTY - Using default Tailwind values
  },
  plugins: [],
}
```

### 4.2 Concerns

- **No custom theme extensions** - All spacing, colors, and typography use Tailwind defaults
- **No design token mapping** - Hard to maintain brand consistency
- **No dark mode configuration** - Theme switching handled via CSS variables only

---

## 5. Scope Definition

### 5.1 Audit Scope

| Category | Count |
|----------|-------|
| Total Pages | 19 |
| Total Components | 20+ |
| Global CSS Files | 3 |
| Page-specific CSS Files | 50+ |
| Theme Variables | ~60 |

### 5.2 Sampling Strategy

Given the large codebase (>50 CSS files), this audit will sample representative pages and components:

**Priority Pages for Audit:**
1. `/` (Home) - Primary landing, most visited
2. `/lenders` - Complex landing with animations
3. `/admin` - Dashboard with forms and data display
4. `/about` - Content-heavy page

**Priority Components for Audit:**
1. Navigation - Global, affects all pages
2. ContactModal - Complex form interactions
3. EarlyAccessForm - Primary conversion point
4. ThemeToggle - Affects all pages

---

## 6. Phase 1 Findings Summary

### ✅ Strengths
1. **Well-organized theme system** - CSS variables in `theme.css` are comprehensive
2. **Dark/light mode support** - Properly implemented via data-theme attribute
3. **Component-based architecture** - Reusable modal and form components
4. **Semantic naming** - CSS variables use clear, descriptive names

### ⚠️ Areas Requiring Audit
1. **Tailwind configuration** - Empty `extend: {}` suggests default values used throughout
2. **Inline styles** - Multiple instances found in TSX files (72+ matches)
3. **Hardcoded colors** - 188+ hex code occurrences in CSS, 34+ in TSX
4. **Font sizes** - 958+ font-size declarations, likely many inconsistent values
5. **Focus indicators** - Only partial coverage across pages
6. **Animation timing** - 437+ transitions/animations with varying timings

---

**Phase 1 Status:** ✅ Complete  
**Next Phase:** Phase 2 - The Consistency Audit
