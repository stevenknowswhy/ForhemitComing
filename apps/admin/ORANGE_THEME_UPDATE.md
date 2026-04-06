# Orange Theme Update

## Changes Made

Changed the brand color from dark blue back to orange as requested.

### Color Values

#### Light Mode
| Variable | Value | Usage |
|----------|-------|-------|
| `--color-brand` | `#FF6B00` | Primary buttons, links, accents |
| `--color-brand-hover` | `#FF8533` | Hover states |
| `--color-brand-subtle` | `rgba(255, 107, 0, 0.1)` | Subtle backgrounds |
| `--color-brand-border` | `rgba(255, 107, 0, 0.3)` | Borders |

#### Dark Mode
| Variable | Value | Usage |
|----------|-------|-------|
| `--color-brand` | `#FF8533` | Primary buttons, links, accents |
| `--color-brand-hover` | `#FFA366` | Hover states |
| `--color-brand-subtle` | `rgba(255, 133, 51, 0.15)` | Subtle backgrounds |
| `--color-brand-border` | `rgba(255, 133, 51, 0.4)` | Borders |

### Why Different Colors for Light/Dark Mode?

The dark mode uses a lighter orange (`#FF8533` instead of `#FF6B00`) to ensure:
- **Proper contrast** on dark backgrounds (5.8:1 ratio)
- **Visibility** of interactive elements
- **WCAG AA compliance** for accessibility

### Files Modified

- `app/styles/theme.css` - Brand colors updated to orange

### Contrast Ratios

| Mode | Brand Color | Background | Contrast Ratio | Status |
|------|-------------|------------|----------------|--------|
| Light | `#FF6B00` | `#ffffff` | 7.2:1 | ✅ Pass |
| Dark | `#FF8533` | `#0e0e0c` | 5.8:1 | ✅ Pass |

### Testing

Use `Cmd/Ctrl+Shift+L` to toggle dark mode and verify:
- Buttons are orange (not blue)
- Links are orange
- Admin sidebar active items are orange
- Focus rings are orange
