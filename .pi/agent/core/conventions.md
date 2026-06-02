# Project Conventions — Forhemit

## Convex Development

### File Structure
```
packages/convex/
├── convex/
│   ├── lib/              # Helper functions (templateContent.ts, requireAuth.ts, etc.)
│   ├── schema.ts         # Database schema definitions
│   ├── templates.ts      # Template CRUD operations
│   ├── templateGenerator.ts  # Template generation actions
│   └── ...
├── _generated/           # Auto-generated Convex types
└── package.json          # Has convex dependency
```

### Naming Conventions
- **Mutations**: `verbNoun` (e.g., `seedMissing`, `submitForm`)
- **Queries**: `getNoun` or `getAllNouns` (e.g., `getByTitle`, `getAll`)
- **Actions**: `verbNoun` for complex operations (e.g., `generateAndSendDocument`)
- **Helpers**: camelCase utility functions in `lib/`

### Database Patterns
1. **Always use indexes for lookups** — never `.collect()` on large tables
2. **Use `by_*` indexes** when available (e.g., `by_title`, `by_status`)
3. **Store large content in File Storage** — not inline in documents
4. **Keep document reads under 16 MB** — hard limit per transaction

### Template System
- Templates stored in `templates` table
- Content field: HTML string (being migrated to File Storage)
- Metadata: title, category, lifecycleStage, audience, status, description
- Related tables: `stageRequirements`, `documentTemplates`

## Git Workflow

### Commit Messages
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`

### Incremental Development
1. Implement one logical change
2. Run build/lint checks
3. Commit if clean
4. Repeat

### Before Committing
- [ ] `npm run build` passes
- [ ] `npm run lint` passes (if configured)
- [ ] TypeScript compiles without errors
- [ ] No console.log debugging left behind

## Code Style

### TypeScript
- Use explicit types for function parameters
- Prefer `interface` over `type` for object shapes
- Use `const` assertions for literal types
- Avoid `any` — use `unknown` and type guards

### Convex Functions
- Always include JSDoc comments for public functions
- Use `v` validators for all function arguments
- Include error handling for database operations
- Return meaningful error messages

### React Components
- Use `"use client"` directive for client components
- Prefer named exports over default exports
- Use TypeScript interfaces for props
- Include loading and error states

## Dual Database Architecture — Convex + Ghost

Forhemit uses two databases. Choosing the wrong one wastes storage, breaks real-time, or bloats the agent context.

### Convex (user-facing, real-time, auth)
Use for data the user sees in the app:
- Dashboard stats, CRM records, forms, templates
- Real-time subscriptions (live dashboard updates)
- Clerk auth-gated mutations
- File storage (PDFs, template HTML content)
- Webhook handlers updating user state
- Active workflow engine state

### Ghost (agent-facing, analytics, Python scripts)
Use for data the agent or scripts generate/query:
- Document generation logs (Python scripts write directly via `ghost_logger.py`)
- Audit logs, error logs, historical data
- Complex SQL analytics (JOINs, CTEs, window functions)
- Schema prototyping before committing to Convex
- Agent scratch data and experiments
- Integration sync metadata

### Decision Shortcut
> **User sees it → Convex. Agent/script generates it → Ghost.**

### Connection
- Convex production: `https://striped-puma-587.convex.cloud`
- Ghost: `postgresql://tsdbadmin:***@jxkcqq6yua...tsdb.cloud.timescale.com:5432/tsdb`
- Python scripts: `from ghost_logger import log_document, log_error`
- Node.js API routes: `import { queryGhost } from "@/lib/ghost"`
- Ghost CLI: `ghost sql forhemit -- "SELECT ..."`

### Ghost Tables (current)
`external_document_log`, `document_generation_errors`, `audit_logs`, `templates` (mirror), `pipeline_stages`, `stage_requirements` (mirror), `workflow_phases`

### Adding a New Ghost Table
1. Create table via `ghost sql forhemit -- "CREATE TABLE ..."`
2. Document schema in `~/.pi/ecosystem/global/ghost-database.md`
3. If the admin dashboard needs it, add an API route at `apps/admin/app/api/ghost/`
4. If Python scripts write to it, add a function to `scripts/ghost_logger.py`

## Testing

### Before Deploying
- [ ] Test in dev deployment first
- [ ] Verify schema changes are backward compatible
- [ ] Check for breaking changes in API
- [ ] Run any existing test suites

### Manual Testing Checklist
- [ ] Function executes without errors
- [ ] Returns expected data structure
- [ ] Handles edge cases (empty data, missing fields)
- [ ] Performance acceptable for expected data volume
