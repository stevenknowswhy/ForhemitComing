# Theme Audit Scripts

These scripts help automate the dark/light mode theme audit across the Forhemit codebase.

## Scripts

### 1. `fix-theme-colors.js`

Automatically finds and replaces hardcoded colors with theme-aware CSS variables.

#### Usage

```bash
# Show help
node scripts/fix-theme-colors.js --help

# Dry run - see what would change (recommended first step)
node scripts/fix-theme-colors.js --dry-run

# Dry run with verbose output
node scripts/fix-theme-colors.js --dry-run --verbose

# Analyze files without fixing
node scripts/fix-theme-colors.js --analyze

# Fix specific files
node scripts/fix-theme-colors.js app/brokers/brokers.css app/wealth-managers/wealth-managers.css

# Fix all CSS files matching a pattern
node scripts/fix-theme-colors.js --pattern "app/accounting-firms/**/*.css"

# Actually apply fixes (⚠️ modifies files)
node scripts/fix-theme-colors.js
```

#### What it fixes

| Pattern | Replacement | Example |
|---------|-------------|---------|
| `rgba(255, 107, 0, 0.1)` | `var(--color-brand-subtle)` | Brand color subtle |
| `#FF3D00` | `var(--color-brand-hover)` | Brand hover color |
| `#10B981` | `var(--color-success)` | Success green |
| `#ef4444`, `#ff4444` | `var(--color-error)` | Error red |
| `rgba(0, 0, 0, 0.3)` | `var(--shadow-color)` | Black shadows |
| `rgba(0, 0, 0, 0.9)` | `var(--overlay-heavy)` | Heavy overlays |
| `rgba(14, 14, 12, 0.8)` | `var(--bg-primary)` | Dark backgrounds |

#### Safety Features

- **Dry run mode**: Preview all changes before applying
- **Backup**: Git will show you exactly what changed
- **Rule-based**: Only replaces known patterns
- **Preserves comments**: Only modifies CSS values

---

### 2. `ensure-theme-vars.js`

Checks that `app/styles/theme.css` contains all required CSS variables for the theme system to work correctly.

#### Usage

```bash
node scripts/ensure-theme-vars.js
```

This will:
1. Check if all required variables exist in both dark and light themes
2. Add any missing variables with sensible defaults
3. Report what was added

#### Required Variables

The script ensures these variables exist:

**Status Colors:**
- `--color-success`, `--color-success-bg`, `--color-success-border`, `--color-success-subtle`
- `--color-error`, `--color-error-bg`, `--color-error-border`

**Overlays:**
- `--overlay-heavy`, `--overlay-medium`, `--overlay-light`

**Component-specific:**
- `--toggle-shadow`, `--progress-bar-bg`, `--dropzone-border`, `--badge-bg`, `--badge-border`

---

## Workflow

### For a new page audit:

1. **Ensure theme variables exist:**
   ```bash
   node scripts/ensure-theme-vars.js
   ```

2. **Analyze the page (dry run):**
   ```bash
   node scripts/fix-theme-colors.js --dry-run --verbose app/your-page/*.css
   ```

3. **Review the output** - check for any complex gradients or special cases

4. **Apply fixes:**
   ```bash
   node scripts/fix-theme-colors.js app/your-page/*.css
   ```

5. **Review changes in git:**
   ```bash
   git diff
   ```

6. **Test both themes** - switch between dark and light mode to verify

---

## Manual Review Checklist

After running the automated fixes, manually check for:

1. **Complex gradients** with multiple colors:
   ```css
   /* May need manual adjustment */
   background: linear-gradient(135deg, rgba(255,107,0,0.1) 0%, rgba(20,20,16,0.8) 100%);
   ```

2. **Page-specific semantic colors** - some pages use unique color schemes (e.g., Brokers tactical HUD)

3. **Image overlays** - ensure overlays work with both themes

4. **Box shadows on cards** - verify shadow intensity in light mode

---

## Adding New Rules

To add a new replacement rule to `fix-theme-colors.js`, edit the `REPLACEMENT_RULES` array:

```javascript
{
  name: 'my-new-rule',           // Unique identifier
  pattern: /rgba\(255,\s*0,\s*0,\s*[\d.]+\)/g,  // Regex to match
  replacement: 'var(--my-var)',  // Replacement string
  description: 'Red color'       // Human-readable description
}
```

---

## Troubleshooting

### Script says "No CSS files found"

Make sure you're running from the project root:
```bash
cd /Users/stephenstokes/Downloads/Projects/03 March 2026/ForhemitComingSoon
node scripts/fix-theme-colors.js
```

### Changes look wrong in light mode

The script uses default light theme values. You may need to adjust them:

1. Open `app/styles/theme.css`
2. Find the `[data-theme="light"]` section
3. Adjust the variable values for better contrast

### Some colors weren't replaced

The script only handles common patterns. Complex cases need manual fixing:
- Multi-stop gradients
- Calculated colors
- Dynamic opacity values

---

## See Also

- `/THEME_AUDIT_CHECKLIST.md` - Track audit progress
- `/app/styles/theme.css` - Theme variable definitions
