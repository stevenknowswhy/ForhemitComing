# Forhemit Codebase Standards

## File Size Limits

**Maximum file size: 800 lines of code**

This rule applies to all source files (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.scss`).

### Why 800 Lines?
- Cognitive load: Files larger than 800 lines become difficult to understand in a single session
- Single Responsibility: Large files often violate SRP by handling multiple concerns
- Testing: Smaller files are easier to unit test effectively
- Code Review: Reviewers can thoroughly review 800 lines in a reasonable timeframe
- Navigation: IDE navigation and search work better with smaller files

### What To Do When Approaching The Limit

1. **Split by Feature/Responsibility**
   - Extract components into separate files
   - Move utility functions to `lib/` or `utils/` folders
   - Create dedicated hook files in `hooks/`

2. **Split CSS by Component**
   - Move component styles to `ComponentName.module.css`
   - Create shared style partials in `styles/components/`
   - Keep global styles minimal

3. **Extract Data/Configuration**
   - Move hardcoded data to separate `.ts` files
   - Create configuration objects in dedicated files

### Exceptions

The following are allowed to exceed 800 lines with justification:
- Auto-generated files (e.g., from codegen)
- Configuration files with many options
- Test files with extensive test cases (consider splitting by feature instead)

## Component Architecture

### File Organization
```
app/
├── components/
│   ├── ui/           # Primitive components (Button, Input, Card)
│   ├── layout/       # Layout components (Navigation, Footer)
│   ├── forms/        # Form-specific components
│   └── modals/       # Modal components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── styles/           # Global and shared styles
└── [route]/
    ├── page.tsx
    ├── layout.tsx
    └── sections/     # Page-specific sections
```

### Component Size Guidelines
- **Presentational components**: Keep under 200 lines
- **Container components**: Keep under 400 lines
- **Page components**: Keep under 300 lines (compose from sections)

## CSS Organization

### File Size Limits for CSS
- **Component CSS**: 300 lines max (use CSS modules)
- **Page-specific CSS**: 400 lines max
- **Global CSS**: 200 lines max

### CSS Architecture
- Use CSS variables for theming (defined in `styles/variables.css`)
- Prefer component-scoped styles over global styles
- Group related styles together with clear section comments
