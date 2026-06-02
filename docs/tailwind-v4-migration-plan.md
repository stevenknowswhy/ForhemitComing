06/02/26 10:36 AM PT
06/02/26 10:34 AM PT
06/02/26 10:31 AM PT
06/02/26 10:28 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Tailwind CSS v3 → v4 Migration Plan

**Scope:** `apps/admin` only (marketing app is a separate concern)
**Date:** 2026-05-31
**Status:** PLAN — NOT STARTED

---

## 1. Current State Audit

| Metric | Count |
|---|---|
| Tailwind version | `3.4.17` |
| PostCSS config | `postcss.config.js` (standard v3) |
| JS config file | `tailwind.config.js` (217 lines) |
| `@tailwind` directives | 3 (`globals.css`) |
| `@apply` usage | **0** — clean |
| `dark:` prefix files | 30 files, ~93 usages |
| Arbitrary hex colors (`text-[#...]`) | ~289 usages |
| Arbitrary var() (`bg-[var(--...)`) | ~88 usages |
| Arbitrary border (`border-[...]`) | ~221 usages |
| Plugins | `tailwindcss-animate`, `@tailwindcss/typography` |
| shadcn components | 25 files in `components/ui/` |
| `forwardRef` components | All 25 shadcn components |
| Dark mode strategy | `darkMode: "class"` (manual `.dark` class toggle) |

## 2. Breaking Changes That Affect Us

### 2.1 — CSS Directives
```
// REMOVE
@tailwind base;
@tailwind components;
@tailwind utilities;

// REPLACE WITH
@import "tailwindcss";
```

### 2.2 — PostCSS Plugin
```
// postcss.config.mjs — REMOVE autoprefixer, REPLACE tailwindcss
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

### 2.3 — Config File → CSS `@theme`
The entire `tailwind.config.js` (217 lines) must be migrated to a CSS `@theme` directive inside `globals.css`. This includes:
- All custom colors (canvas, parchment, ink, stone, sage, shadcn semantic)
- All custom font families
- All custom font sizes (display, h1, h2, h3, body, ui, meta, pull)
- Custom spacing (18, 22, 30, 128)
- Custom maxWidth, boxShadow, borderRadius
- Custom animations and keyframes

### 2.4 — Renamed Utilities (silent breakage risk)
| v3 | v4 | Impact |
|---|---|---|
| `shadow-sm` | `shadow-xs` | All `shadow-sm` become smaller |
| `shadow` | `shadow-sm` | Bare `shadow` changes |
| `rounded-sm` | `rounded-xs` | All `rounded-sm` become smaller |
| `rounded` | `rounded-sm` | Bare `rounded` changes |
| `outline-none` | `outline-hidden` | Accessibility behavior change |
| `ring` (3px) | `ring-3` | `ring` becomes 1px |
| `blur-sm` | `blur-xs` | Blur values shift |

### 2.5 — Default Behavior Changes
- **Border color**: `gray-200` → `currentColor` (every bare `border` class needs explicit color)
- **Ring color**: `blue-500` → `currentColor`
- **Ring width**: 3px → 1px
- **Placeholder color**: `gray-400` → `currentColor` at 50% opacity
- **Button cursor**: `pointer` → `default`
- **`space-x/y-*` selector change**: different child matching
- **`divide-x/y-*` selector change**: different child matching

### 2.6 — Dark Mode Strategy
v4 defaults to `@media (prefers-color-scheme: dark)`. Forhemit uses `.dark` class toggle via Clerk/theme-toggle. Must configure:
```css
@custom-variant dark (&:is(.dark *));
```

### 2.7 — Plugin Migration
| v3 Plugin | v4 Replacement |
|---|---|
| `tailwindcss-animate` | `tw-animate-css` (CSS import) |
| `@tailwindcss/typography` | `@plugin "@tailwindcss/typography"` in CSS |

### 2.8 — shadcn/ui Component Updates
- Remove `React.forwardRef` → function components with `data-slot` attributes
- CSS variable wrapping: `hsl()` in `:root`, bare vars in `@theme inline`
- `tailwind-merge` and `clsx` still work but should be updated
- All 25 `components/ui/*.tsx` files need updating

## 3. Migration Steps (Ordered)

### Phase 0: Preparation
- [ ] Create `tw-v4-migration` branch from main
- [ ] Run `npx @tailwindcss/upgrade` on `apps/admin` — let the codemod do the heavy lifting
- [ ] Review the automated diff carefully
- [ ] Pin `tailwindcss@^4` and `@tailwindcss/postcss@^4` in package.json

### Phase 1: PostCSS + CSS Directives
- [ ] Replace `postcss.config.js` with `postcss.config.mjs`:
  ```js
  export default {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  }
  ```
- [ ] In `globals.css`, replace `@tailwind` directives with `@import "tailwindcss"`
- [ ] Remove `autoprefixer` from devDependencies
- [ ] Add `@custom-variant dark (&:is(.dark *));` for class-based dark mode

### Phase 2: Config Migration (tailwind.config.js → CSS @theme)
- [ ] Delete `tailwind.config.js`
- [ ] In `globals.css`, add `@theme inline { ... }` block with:
  - All custom colors → `--color-*` namespace
  - All font families → `--font-*` namespace
  - All custom font sizes → `--text-*` namespace
  - Custom spacing → `--spacing-*` namespace
  - Custom shadows, radii, animations
  - shadcn semantic color mappings
- [ ] Add `@custom-variant` for dark mode class strategy
- [ ] Replace `tailwindcss-animate` with `tw-animate-css` import
- [ ] Replace `@tailwindcss/typography` plugin with `@plugin "@tailwindcss/typography"`

### Phase 3: Utility Renames (codemod-assisted)
- [ ] `shadow-sm` → `shadow-xs` (search: ~50+ usages)
- [ ] `rounded-sm` → `rounded-xs` (search: ~30+ usages)
- [ ] `outline-none` → `outline-hidden` (search: ~20+ usages)
- [ ] `ring` → `ring-3` where 3px ring was intended
- [ ] `blur-sm` → `blur-xs` if used
- [ ] Verify all bare `border` classes have explicit color

### Phase 4: Default Behavior Fixes
- [ ] Add base layer to restore v3 border color default:
  ```css
  @layer base {
    *, ::after, ::before, ::backdrop, ::file-selector-button {
      border-color: var(--color-gray-200, currentColor);
    }
  }
  ```
- [ ] Or: audit all bare `border` usages and add explicit colors
- [ ] Add button cursor override if desired:
  ```css
  @layer base {
    button:not(:disabled), [role="button"]:not(:disabled) {
      cursor: pointer;
    }
  }
  ```

### Phase 5: shadcn/ui Component Refresh
- [ ] Update all 25 `components/ui/*.tsx` files:
  - Remove `React.forwardRef` wrappers
  - Add `data-slot` attributes to each primitive
  - Convert to named function exports
  - Update type signatures to `React.ComponentProps<...>`
- [ ] Update CSS variable declarations in `globals.css`:
  - `:root` vars: wrap values in `hsl()`
  - `@theme inline` vars: reference bare vars (no `hsl()` wrapper)
- [ ] Verify `tailwind-merge` is updated (v3+ handles v4 classes)

### Phase 6: Arbitrary Value Audit
- [ ] ~289 hex color usages — these work in v4 but review for consistency
- [ ] ~88 var() usages — these work in v4, no change needed
- [ ] ~221 arbitrary border usages — these work in v4, no change needed
- [ ] Consider migrating high-usage arbitrary values to `@theme` tokens

### Phase 7: Verification
- [ ] `next build` passes (type check + compile)
- [ ] Visual regression: check every admin page in light + dark mode
- [ ] Check phase radial chart, gooey tabs, dock, pipeline cards
- [ ] Check all chart components (Recharts integration)
- [ ] Check all form components (inputs, selects, checkboxes)
- [ ] Check responsive breakpoints
- [ ] Check print styles (`responsive.css`, `print.css`)

## 4. Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Silent utility rename breakage | **HIGH** | Codemod + visual review of every page |
| Border color default change | **HIGH** | Add base layer override or audit all bare `border` |
| Dark mode stops working | **MEDIUM** | `@custom-variant dark` must be set correctly |
| shadcn `forwardRef` removal breaks refs | **MEDIUM** | Test every component that uses `ref` prop |
| Chart components break | **MEDIUM** | Recharts uses inline styles, should be safe — verify |
| `admin-stitch.css` variable conflicts | **LOW** | Variables are custom, not TW-generated — safe |
| Marketing app unaffected | **N/A** | Separate `tailwind.config.js`, out of scope |

## 5. Estimated Effort

| Phase | Est. Time | Notes |
|---|---|---|
| Phase 0: Prep | 15 min | Branch + codemod run |
| Phase 1: PostCSS | 10 min | Small file changes |
| Phase 2: Config migration | 1-2 hrs | Largest manual effort — 217 lines of config to CSS |
| Phase 3: Utility renames | 30 min | Codemod handles most |
| Phase 4: Default fixes | 30 min | Border + button audit |
| Phase 5: shadcn refresh | 1-2 hrs | 25 component files |
| Phase 6: Arbitrary audit | 30 min | Spot-check, mostly safe |
| Phase 7: Verification | 1 hr | Full visual + build check |
| **Total** | **~5-7 hrs** | Single session |

## 6. Files Likely to Change

### Deleted
- `apps/admin/tailwind.config.js`
- `apps/admin/postcss.config.js`

### Created/Replaced
- `apps/admin/postcss.config.mjs`

### Modified (heavy)
- `apps/admin/app/globals.css` — config migration, @theme, imports
- `apps/admin/components/ui/*.tsx` — all 25 files (forwardRef removal)

### Modified (light — utility renames)
- ~30 files with `dark:` prefix (no change if `@custom-variant` set)
- Files with `shadow-sm`, `rounded-sm`, `outline-none`, `ring`

## 7. Decision Points (User Input Needed)

1. **Button cursor**: Restore `cursor: pointer` on buttons, or accept v4 default `cursor: default`?
2. **Border color**: Add base layer to restore `gray-200` default, or audit all bare `border` usages?
3. **Marketing app**: Migrate now or later? (Separate `tailwind.config.js`, no shared config)
4. **shadcn full refresh**: Use `pnpm dlx shadcn@latest add --all --overwrite` to get v4-native components, or manually update existing?

---

*Plan ready for review. Do not execute until approved.*
