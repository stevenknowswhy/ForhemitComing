# Failure Log — Ah-Yeon Agent

## Convex 16 MB Transaction Limit (2026-05-26)

### What Happened
- `seedTemplates:seedMissing` function was reading 16.01 MB from templates table in a single transaction
- Convex has hard limit of 16 MB bytes read per transaction
- Function was using `db.query("templates").collect()` — pulling entire table at once

### Root Cause
- 140 templates in dev deployment
- 127 templates with HTML content in `content` field
- Average content size: 12 KB per template
- Total content: 1.66 MB raw JSON, but Convex internal encoding inflated to ~16 MB

### Solution Applied
1. **Immediate fix**: Replaced `.collect()` with indexed lookups per title
   ```typescript
   // Before (BAD)
   const existingDocs = await ctx.db.query("templates").collect();
   const existingTitles = new Set(existingDocs.map((d: any) => d.title));
   
   // After (GOOD)
   for (const item of missingTemplates) {
     const existing = await ctx.db
       .query("templates")
       .withIndex("by_title", (q) => q.eq("title", item.title))
       .first();
   }
   ```

2. **Long-term fix**: Migrate content to File Storage (in progress)

### Files Fixed
- `packages/convex/convex/seedTemplates.ts` — seedMissing function
- `packages/convex/convex/seedStageRequirements.ts` — same pattern, preventive fix

### Files Still Needing Fix
- `packages/convex/convex/templates.ts:92` — `getAll` query (active, recurring)
- `packages/convex/convex/templateRules.ts:50` — `.collect()` in seed function

---

## Convex CLI Directory Requirement (2026-05-26)

### What Happened
- Tried to run `npx convex dev` from project root `/Users/stephenstokes/Workspace/Projects/Forhemit/`
- Command failed with: `In order to run, add 'convex' to your package.json dependencies`

### Why It Failed
- Convex CLI looks for `convex` dependency in nearest `package.json`
- Root `package.json` doesn't have `convex` as dependency
- Only `packages/convex/package.json` has it

### Solution
- Always run Convex CLI commands from `packages/convex/` directory
- Or use the npm scripts defined there:
  - `npm run convex:dev` — start dev server
  - `npm run convex:deploy` — deploy to prod
  - `npm run convex:once` — run codegen once

---

## TypeScript Edit Thrashing (2026-05-26)

### What Happened
- Created `templateContent.ts` with multiple incremental edits
- Each edit introduced new lint errors:
  1. Unused import `QueryCtx`
  2. Wrong return type from `getContentFileId`
  3. Inconsistent function signatures

### Why It Failed
- Incremental edits didn't maintain consistency across the file
- Each change assumed previous state was correct

### Solution
- Write the complete file once with all logic verified
- Then run codegen and lint once
- Much cleaner than trying to patch fragments

### Lesson
- For new files with complex logic, write entire file rather than editing fragments
- Verify imports, types, and function signatures together
