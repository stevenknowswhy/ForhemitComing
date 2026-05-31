05/31/26 05:51 AM PT
Purpose: (auto-inserted by pre-commit — please update)

# Dark Mode Plan — Forhemit Admin

> **Status: ✅ COMPLETED — 2026-05-31**
> Light/dark mode toggle verified working across sidebar, layout, cards, tables, forms, modals, CRM, journals, and all admin pages.

---

## Problem
The admin UI has **3 layers** of hardcoded light-mode colors that don't respond to the `.dark` class:

| Layer | File(s) | Scope | Fix |
|-------|---------|-------|-----|
| **A. Custom CSS** | `admin-stitch.css` | Sidebar, layout, page headers, cards, tables, forms, modals, buttons, mobile appbar, loading states, empty states | Add `.dark` override block + replace hardcoded hex with CSS vars |
| **B. Dashboard page** | `page.tsx` (admin home) | Already uses `dark:` Tailwind classes | ✅ Done — only needs stat card bg fix |
| **C. Other admin pages** | 14 other `page.tsx` + shared components | `bg-white`, `text-gray-*`, `border-gray-*` in Tailwind classes | Add `dark:` variant pairs |
| **D. Root layout** | `layout.tsx` | Body bg, Clerk appearance | Body already uses `var(--canvas)` ✅ |
| **E. UI components** | `card.tsx`, `table.tsx`, `chart.tsx`, `button.tsx`, `badge.tsx`, `input.tsx`, `select.tsx`, `dropdown-menu.tsx`, `dialog.tsx`, `tabs.tsx` | Already partially done | Verify + fix remaining |

---

## Strategy: CSS Variables First, Tailwind Second

**Layer A (admin-stitch.css)** controls the sidebar, layout shell, and all stitch-prefixed classes. Since these are pure CSS, the most efficient fix is:

1. Add a `.dark` override block at the top of `admin-stitch.css` that redefines every color variable
2. Replace all hardcoded hex values in the CSS with `var(--token)` references
3. This automatically darkens the sidebar, layout, tables, forms, modals, buttons — 80% of the UI

**Layer C (other pages)** uses Tailwind utility classes. These need manual `dark:` variants added to each file.

---

## File-by-File Plan

### 1. `app/admin/admin-stitch.css` — THE BIG ONE (750+ lines)

Add `.dark` override block after `.admin-layout-stitch *` block:

```css
.dark .admin-layout-stitch,
.dark .admin-layout-stitch * {
  --bg-primary: #1F2521;
  --bg-secondary: #2A3028;
  --bg-tertiary: #3A423A;
  --bg-card: #2A3028;
  --bg-glass: rgba(255, 255, 255, 0.03);
  --text-primary: #E8E6E1;
  --text-secondary: #A8A5A0;
  --text-muted: #8A8580;
  --text-inverse: #1F2521;
  --border-subtle: #3A423A;
  --shadow-color: rgba(0, 0, 0, 0.2);
}
```

Then replace every hardcoded color in the file with the token:

| Hardcoded | Token | Location(s) |
|-----------|-------|-------------|
| `#ffffff` / `white` | `var(--bg-primary)` | `.admin-layout-stitch`, `.admin-sidebar-stitch`, `.card-stitch`, `.modal-container-stitch`, `.search-input-stitch`, `.form-input-stitch`, `.table-container-stitch`, `.stat-card-stitch`, `.btn-stitch-secondary` |
| `#f8f9fa` | `var(--bg-secondary)` | `.admin-main-stitch`, `.sidebar-link:hover`, `.table-stitch thead`, `.modal-footer-stitch`, `.btn-stitch-ghost:hover`, `.btn-stitch-secondary:hover`, `.empty-state-stitch .empty-icon` |
| `#f0f0f0` | `var(--bg-tertiary)` | `.user-avatar-placeholder` |
| `#e5e7eb` | `var(--border-subtle)` | `.admin-sidebar-stitch` border, `.sidebar-header` border, `.sidebar-footer` border, `.card-stitch` border, `.table-stitch td` border, `.search-input-stitch` border, `.form-input-stitch` border, `.modal-container-stitch` border, `.spinner-stitch` border, `.btn-stitch-secondary` border |
| `#1f2937` | `var(--text-primary)` | `.sidebar-logo-title`, `.sidebar-link:hover` color, `.stat-value`, `.card-stitch-title`, `.search-input-stitch` color, `.form-input-stitch` color, `.form-label-stitch` color, `.modal-title-stitch`, `.table-stitch td` color, `.user-name` color |
| `#6b7280` | `var(--text-secondary)` | `.sidebar-logo-subtitle`, `.sidebar-link` color, `.stat-label`, `.sidebar-link-icon` color, `.table-stitch th` color, `.user-email` color, `.form-hint-stitch` color, `.modal-close-stitch` color |
| `#9ca3af` | `var(--text-muted)` | `.sidebar-section-title`, `.search-input-stitch::placeholder`, `.form-input-stitch::placeholder`, `.empty-state-stitch .empty-icon` color |
| `#fafafa` | `var(--bg-secondary)` | `.admin-mobile-appbar`, `.sidebar-rail-toggle` bg |

Also add dark mode overrides for the mobile appbar:
```css
.dark .admin-mobile-appbar {
  background: var(--bg-secondary);
  border-bottom-color: var(--border-subtle);
}
.dark .admin-mobile-appbar-title,
.dark .admin-mobile-appbar-btn,
.dark .admin-mobile-appbar-add {
  color: var(--text-primary);
}
```

### 2. `app/admin/components/AdminClientLayout.tsx`

Lines ~127-140: Loading state uses `bg-white`, `text-gray-500`
→ `bg-[var(--canvas)] dark:bg-[var(--canvas)]`, `text-[var(--text-secondary)]`

Lines ~143-148: Not-authenticated state uses `bg-white`, `text-gray-500`
→ Same fix

Lines ~153-180: Access denied page uses `bg-gray-50`, `bg-white`, `text-gray-900`, `text-gray-600`, `border-gray-200`, `bg-red-50`, `border-red-200`, `text-red-700`, `text-gray-500`
→ Add `dark:` variants for each

### 3. `app/admin/page.tsx` (dashboard)

- Stat card `bg-[#F0EBE3] dark:bg-[#2A3028]` — already done ✅
- All `C.*` tokens — already done ✅
- Only verify: nothing else needed

### 4. Other admin pages — Tailwind `dark:` variants needed

For each page, the pattern is the same. Replace:
- `bg-white` → `bg-white dark:bg-[#2A3028]`
- `bg-gray-50` → `bg-gray-50 dark:bg-[#1F2521]`
- `text-gray-900` → `text-gray-900 dark:text-[#E8E6E1]`
- `text-gray-700` → `text-gray-700 dark:text-[#C8C5C0]`
- `text-gray-600` → `text-gray-600 dark:text-[#A8A5A0]`
- `text-gray-500` → `text-gray-500 dark:text-[#A8A5A0]`
- `text-gray-400` → `text-gray-400 dark:text-[#8A8580]`
- `border-gray-200` → `border-gray-200 dark:border-[#3A423A]`
- `border-gray-100` → `border-gray-100 dark:border-[#3A423A]`
- `border-gray-300` → `border-gray-300 dark:border-[#4A524A]`
- `ring-gray-200` → `ring-gray-200 dark:ring-[#3A423A]`
- `divide-gray-100` → `divide-gray-100 dark:divide-[#3A423A]`
- `divide-gray-200` → `divide-gray-200 dark:divide-[#3A423A]`

**Pages to update** (14 files):
1. `app/admin/applications/page.tsx`
2. `app/admin/audit/page.tsx`
3. `app/admin/compliance/page.tsx`
4. `app/admin/contacts/page.tsx`
5. `app/admin/crm/page.tsx`
6. `app/admin/early-access/page.tsx`
7. `app/admin/esop-partners/page.tsx`
8. `app/admin/journals/page.tsx`
9. `app/admin/journals/[journalId]/page.tsx`
10. `app/admin/letters/page.tsx`
11. `app/admin/phone-messages/page.tsx`
12. `app/admin/stats/page.tsx`
13. `app/admin/templates/page.tsx`
14. `app/admin/users/page.tsx`

### 5. UI Components — verify dark mode

Already done:
- `card.tsx` ✅
- `table.tsx` ✅
- `chart.tsx` ✅

Need to verify/fix:
- `button.tsx` — check hover states
- `badge.tsx` — check bg/text colors
- `input.tsx` — check bg/border/text
- `select.tsx` — check trigger/content bg
- `dropdown-menu.tsx` — check content bg
- `dialog.tsx` — check overlay/content bg
- `tabs.tsx` — check trigger colors

### 6. `app/admin/admin.css` — legacy sidebar styles

This file has `admin-sidebar-header`, `admin-sidebar-link`, etc. Check if these are still in use and add dark overrides if so.

---

## Execution Order

1. **admin-stitch.css** — Add `.dark` block + replace all hardcoded hex with tokens
2. **AdminClientLayout.tsx** — Fix loading/auth/access-denied states
3. **UI components** — Verify + fix each shared component
4. **14 admin pages** — Add `dark:` variants via search-and-replace pattern
5. **admin.css** — Check if legacy styles need dark overrides
6. **Test** — Toggle dark mode, verify sidebar, all pages, modals, forms

---

## Dark Mode Color Palette

| Role | Light | Dark |
|------|-------|------|
| Background primary | `#ffffff` | `#1F2521` |
| Background secondary | `#f8f9fa` | `#2A3028` |
| Background tertiary | `#f0f0f0` | `#3A423A` |
| Card surface | `#F0EBE3` | `#2A3028` |
| Canvas (page bg) | `#F9F7F2` | `#1F2521` |
| Text primary | `#1f2937` | `#E8E6E1` |
| Text secondary | `#6b7280` | `#A8A5A0` |
| Text muted | `#9ca3af` | `#8A8580` |
| Border | `#e5e7eb` | `#3A423A` |
| Brand | `#FF6B00` | `#FF6B00` (unchanged) |
