# Plan: Migrate FAQ Page to shadcn/ui Components

## Context

The FAQ page at `/app/faq/` uses fully custom UI components (accordion, tabs, cards, buttons). The project has no shadcn/ui infrastructure. This plan initializes shadcn/ui and migrates the FAQ page to use shadcn primitives where possible, while preserving the existing dark theme and brand identity.

---

## Phase 1: Initialize shadcn/ui Infrastructure

### Step 1.1 — Install shadcn/ui
Run `npx shadcn-ui@latest init` with these settings:
- **Style:** New York (cleaner, more minimal — fits the brand)
- **Base color:** Neutral (we'll override with CSS variables anyway)
- **CSS variables:** Yes

This generates:
- `components.json` — shadcn config
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `components/ui/` — base shadcn components (if any auto-installed)

### Step 1.2 — Install Required Dependencies
```
npm install @radix-ui/react-accordion @radix-ui/react-tabs class-variance-authority clsx tailwind-merge
```

### Step 1.3 — Add shadcn Components
```
npx shadcn-ui@latest add accordion tabs button card badge
```

This creates:
- `components/ui/accordion.tsx`
- `components/ui/tabs.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`

### Step 1.4 — Theme Integration
Map the existing CSS variables to shadcn's expected variable names in `globals.css`:

```css
/* shadcn/ui theme mapping — uses existing brand variables */
:root {
  --background: var(--bg-primary);
  --foreground: var(--text-primary);
  --card: var(--bg-card);
  --card-foreground: var(--text-primary);
  --popover: var(--bg-card);
  --popover-foreground: var(--text-primary);
  --primary: var(--color-brand);
  --primary-foreground: var(--bg-primary);
  --secondary: var(--bg-secondary);
  --secondary-foreground: var(--text-primary);
  --muted: var(--bg-tertiary);
  --muted-foreground: var(--text-secondary);
  --accent: var(--color-brand-subtle);
  --accent-foreground: var(--color-brand);
  --destructive: #ef4444;
  --border: var(--border-subtle);
  --input: var(--border-subtle);
  --ring: var(--color-brand);
  --radius: 0.75rem;
}
```

Update `tailwind.config.js` to add shadcn's required config:
- Add `darkMode: ["class"]` (already `"class"`)
- Extend with shadcn color utilities using CSS variables
- Add the content path for shadcn components

---

## Phase 2: Migrate FAQ Page Components

### Step 2.1 — Replace FAQAccordion with shadcn Accordion
**File:** `app/faq/_components/FAQAccordion.tsx`

Replace the custom accordion with shadcn's `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`.

Before (custom):
```tsx
const [openIndex, setOpenIndex] = useState<number | null>(null);
// ... manual toggle, max-height: 500px hack
```

After (shadcn):
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// Declarative, accessible, keyboard-navigable, animated via Radix
```

Benefits: proper keyboard navigation, ARIA attributes, smooth animations, no magic max-height number.

### Step 2.2 — Replace ValuePropositionsSection Tabs with shadcn Tabs
**File:** `app/faq/_components/sections/ValuePropositionsSection.tsx`

Replace the custom tabbed gallery (3 navigation methods: arrows + tabs + dots) with shadcn's `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.

Before (custom):
```tsx
const [activeIndex, setActiveIndex] = useState(0);
// ... custom arrows, custom dots, custom tab buttons
```

After (shadcn):
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Single navigation paradigm, proper ARIA, keyboard support
```

Remove the redundant arrow buttons and dot navigation — tabs alone are sufficient for 3 items.

### Step 2.3 — Replace CTA Button with shadcn Button
**File:** `app/faq/_components/sections/CTASection.tsx`

Replace the custom `<Link className="faq-cta-button">` with shadcn's `Button` component (asChild variant for Link).

```tsx
import { Button } from "@/components/ui/button";
<Button asChild variant="default" size="lg">
  <Link href="/introduction">Contact Us</Link>
</Button>
```

Style via custom CSS classes on the Button to match brand orange.

### Step 2.4 — Evaluate Card Migration
**Files:** `IntroSection.tsx` (value cards), `ValuePropositionsSection.tsx` (content card, category advantage card)

Replace custom `div` cards with shadcn `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` where the structure matches. The FAQ page uses cards for:
- 3 value cards in IntroSection -> shadcn Card
- Value prop content card -> shadcn Card
- Category advantage callout -> shadcn Card
- CTA card -> shadcn Card

### Step 2.5 — Badge for Eyebrow Labels
**Files:** All section components using `about-eyebrow` class

The "eyebrow" labels (`Resources`, `Our Approach`, `Stewardship Model`, etc.) can use shadcn `Badge` with a custom variant to match the mono-spaced, uppercase, brand-colored style.

---

## Phase 3: Clean Up CSS

### Step 3.1 — Remove Replaced CSS
From `faq-page.css`, remove styles that are now handled by shadcn components:
- `.faq-accordion-*` block (~100 lines) — replaced by shadcn Accordion
- `.faq-gallery-*` block (~130 lines) — replaced by shadcn Tabs
- `.faq-cta-button` block (~20 lines) — replaced by shadcn Button
- Card hover/transition styles where shadcn Card handles it

### Step 3.2 — Add shadcn Style Overrides
Add targeted overrides in `faq-page.css` for brand-specific styling:
- Accordion trigger colors, icon styling
- Tab active state brand colors
- Card border/shadow with theme variables

### Step 3.3 — Bring Under Line Limit
After migration, `faq-page.css` should drop from 974 lines to ~600-700 lines, well under the 800-line AGENTS.md limit.

---

## Phase 4: Verify No Regressions

### Step 4.1 — Visual QA
- Run `npm run dev` and visually compare FAQ page before/after
- Check all 6 sections render correctly
- Verify accordion open/close animations
- Verify tabs switch correctly on ValuePropositionsSection
- Check mobile responsive behavior (768px, 900px breakpoints)

### Step 4.2 — Existing Components Unaffected
The new shadcn components go in `components/ui/` alongside existing custom components. The custom `Button.tsx`, `Card.tsx`, `Badge.tsx`, `FAQItem.tsx` remain untouched — they're used by other pages (blog, legal-practices, etc.).

### Step 4.3 — Lint & Typecheck
Run `npm run lint` and verify no TypeScript errors.

---

## Files Modified

| File | Action |
|------|--------|
| `components.json` | Created (shadcn config) |
| `lib/utils.ts` | Created (cn utility) |
| `package.json` | Modified (new dependencies) |
| `tailwind.config.js` | Modified (shadcn color extensions) |
| `app/globals.css` | Modified (shadcn CSS variable mapping) |
| `components/ui/accordion.tsx` | Created (shadcn) |
| `components/ui/tabs.tsx` | Created (shadcn) |
| `components/ui/button.tsx` | Created (shadcn — may conflict with existing, use alias) |
| `components/ui/card.tsx` | Created (shadcn — may conflict with existing, use alias) |
| `components/ui/badge.tsx` | Created (shadcn — may conflict with existing, use alias) |
| `app/faq/_components/FAQAccordion.tsx` | Rewritten |
| `app/faq/_components/sections/ValuePropositionsSection.tsx` | Rewritten |
| `app/faq/_components/sections/CTASection.tsx` | Modified |
| `app/faq/_components/sections/IntroSection.tsx` | Modified |
| `app/faq/faq-page.css` | Trimmed + overrides added |

## Naming Conflict Resolution

The existing `components/ui/Button.tsx`, `Card.tsx`, `Badge.tsx` are PascalCase. shadcn generates lowercase (`button.tsx`, `card.tsx`, `badge.tsx`). Since filesystem is case-sensitive, both can coexist. The FAQ page imports from the lowercase shadcn versions. Other pages continue importing from the PascalCase custom versions.

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| shadcn theme clashes with existing custom theme | CSS variable mapping ensures brand colors propagate |
| Existing pages break due to new Radix CSS resets | shadcn CSS is scoped via component classes; global resets are minimal |
| Component naming confusion (Button vs button) | FAQ page explicitly imports from lowercase shadcn paths |
| Accordion animation differs from current | shadcn Accordion uses Radix `collapsible` with CSS transitions — can be tuned |
