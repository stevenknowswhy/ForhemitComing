-- ═══════════════════════════════════════════════════════════════════════════════
-- Ghost schema initializer — full "Ghost" data layer for a fresh Neon Postgres
--
-- Run with:
--   psql "$GHOST_CONNECTION_STRING" -f scripts/init-ghost-schema.sql
--
-- "Ghost" is the admin app's operational PostgreSQL store, connected through
-- apps/admin/lib/ghost.ts (getGhostPool / queryGhost) via the
-- GHOST_CONNECTION_STRING environment variable.
--
-- Every statement is idempotent (CREATE TABLE IF NOT EXISTS / CREATE INDEX
-- IF NOT EXISTS / CREATE UNIQUE INDEX via table constraints), so the script is
-- safe to re-run and never alters or reseed an existing database. No INSERTs,
-- no seed data, no application-code changes — DDL only.
--
-- Plain Postgres only, Neon-compatible. gen_random_uuid() is core since
-- PostgreSQL 13 (Neon runs newer majors), so no extension is required.
--
-- ── Sources ────────────────────────────────────────────────────────────────────
-- [V1] scripts/ghost_logger.py::_ensure_tables — verbatim DDL for
--      external_document_log and document_generation_errors (+ 4 + 2 indexes).
-- [V2] apps/admin/lib/ghost-journal-migration.sql — verbatim DDL for
--      client_activity_log, phase_checklists, box_folder_map, box_documents,
--      checklist_sync_state, journal_metrics (+ indexes and COMMENT ON TABLE).
--      That file's demo/mock INSERT statements are intentionally NOT carried
--      over (this script ships no seed data).
-- [D*] Derived tables — no DDL for them exists anywhere in the repo. Their
--      columns are reconstructed from the actual queryGhost queries in the 14
--      admin API routes that import apps/admin/lib/ghost.ts. Per-table
--      derivation notes (route + every referenced column) precede each table.
--
-- Derived-table conventions:
--   * Only columns the route queries actually reference are included; nothing
--     speculative is added beyond a primary key.
--   * UUID PK DEFAULT gen_random_uuid() where the routes type the returned id
--     as a string (matches the [V2] convention); SERIAL where a route types
--     the id as a number.
--   * TIMESTAMPTZ NOT NULL DEFAULT now() on created_at/updated_at wherever a
--     query filters or orders on them ([V1]/[V2] house style).
-- ═══════════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════════════════════
-- [V1] external_document_log — VERBATIM from scripts/ghost_logger.py
-- (_ensure_tables). Written by log_document(); read by:
--   apps/admin/app/api/ghost/dashboard/route.ts  (COUNT, daily volume
--     DATE(created_at) GROUP BY, type breakdown GROUP BY document_type,
--     recent docs ORDER BY created_at DESC LIMIT 8)
--   apps/admin/app/api/ghost/documents/route.ts  (WHERE company_name = $1
--     ORDER BY created_at DESC, or unfiltered ORDER BY created_at DESC)
--   apps/admin/app/api/ghost/stats/route.ts      (COUNT, MAX(created_at)
--     GROUP BY document_type)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS external_document_log (
    id SERIAL PRIMARY KEY,
    company_name TEXT,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT,
    file_size_bytes INTEGER,
    generated_by TEXT,
    ref TEXT,
    status TEXT NOT NULL DEFAULT 'generated',
    metadata TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_edl_company ON external_document_log(company_name);
CREATE INDEX IF NOT EXISTS idx_edl_created ON external_document_log(created_at);
CREATE INDEX IF NOT EXISTS idx_edl_status ON external_document_log(status);
CREATE INDEX IF NOT EXISTS idx_edl_type ON external_document_log(document_type);


-- ═══════════════════════════════════════════════════════════════════════════════
-- [V1] document_generation_errors — VERBATIM from scripts/ghost_logger.py
-- (_ensure_tables). Written by log_error(); read by:
--   apps/admin/app/api/ghost/dashboard/route.ts  (COUNT)
--   apps/admin/app/api/ghost/stats/route.ts      (COUNT)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS document_generation_errors (
    id SERIAL PRIMARY KEY,
    company_name TEXT,
    document_type TEXT NOT NULL,
    ref TEXT,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dge_created ON document_generation_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_dge_type ON document_generation_errors(document_type);


-- ═══════════════════════════════════════════════════════════════════════════════
-- [V2] client_activity_log — VERBATIM from
-- apps/admin/lib/ghost-journal-migration.sql. Read by:
--   apps/admin/app/api/client/journal/activity/route.ts
--     (SELECT id, event_type, event_date, phase, title, description
--      WHERE journal_id = $1 ORDER BY event_date DESC LIMIT 50)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS client_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id TEXT NOT NULL,           -- Convex journal ID
    client_id TEXT NOT NULL,            -- Convex CRM company ID
    entry_id TEXT,                      -- Convex journal entry ID (nullable for system events)
    chapter_id TEXT,                    -- Convex chapter ID
    event_type TEXT NOT NULL,           -- 'entry_created', 'chapter_completed', 'narrative_published', 'checklist_updated', 'document_uploaded'
    event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    phase TEXT NOT NULL,                -- 'ignition', 'build', 'validate', 'close-prep', 'closing', 'post-close'
    title TEXT NOT NULL,                -- Human-readable event title
    description TEXT,                   -- Event description (client-facing only)
    metadata JSONB DEFAULT '{}'::jsonb, -- Additional structured data
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_journal ON client_activity_log(journal_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_client ON client_activity_log(client_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_phase ON client_activity_log(journal_id, phase);


-- ═══════════════════════════════════════════════════════════════════════════════
-- [V2] phase_checklists — VERBATIM from ghost-journal-migration.sql. Read by:
--   apps/admin/app/api/client/journal/checklists/route.ts
--     (SELECT id, phase, phase_name, total_tasks, completed_tasks,
--      in_progress_tasks, tasks WHERE journal_id = $1 ORDER BY phase)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS phase_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    phase TEXT NOT NULL,                -- 'ignition', 'build', 'validate', 'close-prep', 'closing', 'post-close'
    phase_name TEXT NOT NULL,           -- '01 — Ignition (Days 1–14)'
    tasks JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Array of {title, status, category, dueDate, completedAt}
    total_tasks INTEGER NOT NULL DEFAULT 0,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    in_progress_tasks INTEGER NOT NULL DEFAULT 0,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(journal_id, phase)
);

CREATE INDEX IF NOT EXISTS idx_checklists_journal ON phase_checklists(journal_id, phase);


-- ═══════════════════════════════════════════════════════════════════════════════
-- [V2] box_folder_map — VERBATIM from ghost-journal-migration.sql.
-- (No route queries it directly today; part of the journal data layer.)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS box_folder_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    box_folder_id TEXT NOT NULL UNIQUE, -- Box folder ID
    folder_type TEXT NOT NULL,          -- 'root', 'welcome', 'phase', 'documents', 'journal'
    phase TEXT,                         -- NULL for root/welcome, phase name for phase folders
    parent_folder_id TEXT,              -- Parent Box folder ID
    folder_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_box_folders_journal ON box_folder_map(journal_id);
CREATE INDEX IF NOT EXISTS idx_box_folders_box_id ON box_folder_map(box_folder_id);


-- ═══════════════════════════════════════════════════════════════════════════════
-- [V2] box_documents — VERBATIM from ghost-journal-migration.sql.
-- (No route queries it directly today; part of the journal data layer.)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS box_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    box_file_id TEXT NOT NULL UNIQUE,   -- Box file ID
    box_folder_id TEXT NOT NULL,        -- Box folder ID where file lives
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,            -- 'welcome_pdf', 'phase_checklist', 'journal_digest', 'activity_log', 'document'
    phase TEXT,                         -- NULL for root-level, phase name for phase docs
    file_size BIGINT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_box_docs_journal ON box_documents(journal_id, phase);
CREATE INDEX IF NOT EXISTS idx_box_docs_box_id ON box_documents(box_file_id);


-- ═══════════════════════════════════════════════════════════════════════════════
-- [V2] checklist_sync_state — VERBATIM from ghost-journal-migration.sql.
-- (No route queries it directly today; part of the journal data layer.)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS checklist_sync_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id TEXT NOT NULL UNIQUE,
    client_id TEXT NOT NULL,
    last_sync_at TIMESTAMPTZ,
    last_sync_status TEXT,              -- 'success', 'partial', 'failed'
    last_sync_error TEXT,
    phases_synced JSONB DEFAULT '[]'::jsonb,  -- Array of phase names synced
    next_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_state_journal ON checklist_sync_state(journal_id);


-- ═══════════════════════════════════════════════════════════════════════════════
-- [V2] journal_metrics — VERBATIM from ghost-journal-migration.sql. Read by:
--   apps/admin/app/api/client/journal/metrics/route.ts
--     (SELECT week_starting, total_entries, entries_by_theme, entries_by_effort,
--      touchpoints, milestones, active_phase, days_in_current_phase
--      WHERE journal_id = $1 ORDER BY week_starting DESC)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS journal_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    week_starting DATE NOT NULL,
    total_entries INTEGER NOT NULL DEFAULT 0,
    entries_by_theme JSONB DEFAULT '{}'::jsonb,
    entries_by_effort JSONB DEFAULT '{}'::jsonb,
    touchpoints JSONB DEFAULT '{}'::jsonb,     -- {calls, emails, documents, meetings, total}
    action_items_due INTEGER DEFAULT 0,
    milestones INTEGER DEFAULT 0,
    active_phase TEXT,
    days_in_current_phase INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(journal_id, week_starting)
);

CREATE INDEX IF NOT EXISTS idx_metrics_journal ON journal_metrics(journal_id, week_starting DESC);

-- Verbatim COMMENT ON TABLE statements from [V2] (carried over from the end of
-- ghost-journal-migration.sql, after its seed section).
COMMENT ON TABLE client_activity_log IS 'Client-facing activity log for transition journals. Excludes internal notes.';
COMMENT ON TABLE phase_checklists IS 'Phase checklist state per journal, synced daily from deal tracker.';
COMMENT ON TABLE box_folder_map IS 'Maps Box folder IDs to journal/phases for efficient API lookups.';
COMMENT ON TABLE box_documents IS 'Tracks all documents uploaded to Box for transition journals.';
COMMENT ON TABLE checklist_sync_state IS 'Tracks when checklists were last synced per journal.';
COMMENT ON TABLE journal_metrics IS 'Weekly metrics snapshot for journal analytics and dashboards.';


-- ═══════════════════════════════════════════════════════════════════════════════
-- [D1] document_audit — DERIVED (no DDL in repo). Columns reconstructed from:
--   apps/admin/app/api/ghost/audit/route.ts
--     GET:  SELECT id, company_id, task_id, document_type, action, actor,
--           metadata, ip_address, created_at
--           WHERE created_at >= NOW() - INTERVAL '<days> days'
--             [AND action = $n] [AND company_id = $n]
--           ORDER BY created_at DESC LIMIT n
--           (+ stats query: COUNT(*) FILTER (WHERE action = 'generated' /
--              'uploaded' / 'shared' / 'signed' / 'viewed' / 'downloaded'))
--     POST: INSERT (company_id, task_id, document_type, action, actor,
--           metadata, ip_address) VALUES (...) RETURNING id
--           — documentType, action, actor are required by the handler.
--   apps/admin/app/api/generate-document/route.ts (audit-log step):
--           INSERT (company_id, task_id, document_type, action, actor, metadata)
--           with metadata = JSON.stringify({boxFileId, pdfSize, templateId}).
--   apps/admin/app/api/ghost/retention/route.ts:
--           WHERE action = 'generated' AND created_at < NOW() - INTERVAL '6 years'
--           GROUP BY document_type ORDER BY MIN(created_at).
-- Type notes: id UUID (route types the returned id as string; [V2] convention);
--   company_id/task_id TEXT (Convex string ids, nullable); metadata JSONB
--   (routes write JSON.stringify(...) payloads); document_type/action/actor
--   NOT NULL (every write path supplies them); ip_address TEXT (kept permissive
--   — may hold proxy headers, not only bare IPs); created_at TIMESTAMPTZ
--   NOT NULL DEFAULT now() (every read filters/orders on it).
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS document_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT,
    task_id TEXT,
    document_type TEXT NOT NULL,
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    metadata JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_audit_created ON document_audit(created_at);
CREATE INDEX IF NOT EXISTS idx_document_audit_action ON document_audit(action);
CREATE INDEX IF NOT EXISTS idx_document_audit_company ON document_audit(company_id);

COMMENT ON TABLE document_audit IS 'Document lifecycle audit trail. Schema derived from ghost/audit, ghost/retention and generate-document route queries — see scripts/init-ghost-schema.sql header.';


-- ═══════════════════════════════════════════════════════════════════════════════
-- [D2] document_generations — DERIVED (no DDL in repo). Columns reconstructed
-- from:
--   apps/admin/app/api/ghost/generation-log/route.ts
--     GET:  SELECT id, template_id, template_name, form_data, action,
--           generated_by, status, created_at
--           [WHERE template_id = $1] ORDER BY created_at DESC LIMIT n
--     POST: INSERT (template_id, template_name, form_data, action,
--           generated_by) VALUES (...) RETURNING id
--           — templateId, templateName, formData, action required;
--             generatedBy defaults to 'admin-ui' in the handler.
--   apps/admin/app/api/generate-document/route.ts (logToGhost):
--           INSERT (template_id, template_name, form_data, action, generated_by)
--           with form_data = JSON.stringify(renderData).
-- Type notes: id UUID (route types the returned id as string); template_id
--   TEXT (generate-document writes String(template.id) — a stringified key,
--   not a FK); form_data JSONB (both writers send JSON payloads; JSONB matches
--   the [V2] house style); action NOT NULL; generated_by NOT NULL DEFAULT
--   'admin-ui' (the handler's own default); status TEXT NOT NULL DEFAULT
--   'generated' (selected by the route but never inserted — default mirrors
--   [V1] external_document_log.status); created_at TIMESTAMPTZ NOT NULL
--   DEFAULT now() (ORDER BY created_at DESC).
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS document_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id TEXT NOT NULL,
    template_name TEXT NOT NULL,
    form_data JSONB,
    action TEXT NOT NULL,
    generated_by TEXT NOT NULL DEFAULT 'admin-ui',
    status TEXT NOT NULL DEFAULT 'generated',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_docgen_template ON document_generations(template_id);
CREATE INDEX IF NOT EXISTS idx_docgen_created ON document_generations(created_at);

COMMENT ON TABLE document_generations IS 'Document generation history. Schema derived from ghost/generation-log and generate-document route queries — see scripts/init-ghost-schema.sql header.';


-- ═══════════════════════════════════════════════════════════════════════════════
-- [D3] templates — DERIVED (no DDL in repo). Columns reconstructed from:
--   apps/admin/app/api/generate-document/route.ts (step 1, template load):
--     SELECT id, title, html_content, category, phase, doc_type
--       FROM templates WHERE title = $1 LIMIT 1
-- Type notes: every column is typed per the route's GhostTemplate interface,
--   which marks none of them optional — id: number → SERIAL PK (the only
--   route-typed numeric id in the Ghost layer), strings → TEXT NOT NULL,
--   phase: number → INTEGER. html_content stays NOT NULL: the route's
--   "Template has no content" 422 branch guards empty-string content.
--   title is also the sole WHERE target and is indexed for that lookup.
--   Only query-referenced columns are included; no other route touches this
--   table. Templates are seeded per deal outside this script.
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    html_content TEXT NOT NULL,
    category TEXT NOT NULL,
    phase INTEGER NOT NULL,
    doc_type TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_templates_title ON templates(title);

COMMENT ON TABLE templates IS 'Document templates (HTML) served to the generate-document pipeline. Schema derived from the generate-document route query — see scripts/init-ghost-schema.sql header.';


-- ═══════════════════════════════════════════════════════════════════════════════
-- [D4] form_templates — DERIVED (no DDL in repo). Columns reconstructed from:
--   apps/admin/app/api/ghost/form-templates/route.ts
--     GET: SELECT id, form_key, name, description, category, version, status,
--          is_active, created_at, updated_at
--          [WHERE category = $n] [AND status = $n]  (both optional filters)
--          ORDER BY category, name
-- Type notes: id UUID ([V2] convention — no route types the id); form_key
--   TEXT NOT NULL UNIQUE (stable lookup key, uniqueness inferred from the
--   "_key" name); version TEXT (free-form version label); status TEXT kept
--   nullable (no insert path or default value is evidenced); is_active BOOLEAN
--   NOT NULL DEFAULT true (inferred from the column name and [V1] house-style
--   defaults); created_at/updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
--   (selected on every read).
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS form_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    version TEXT,
    status TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_form_templates_cat_name ON form_templates(category, name);
CREATE INDEX IF NOT EXISTS idx_form_templates_status ON form_templates(status);

COMMENT ON TABLE form_templates IS 'Form template catalog. Schema derived from the ghost/form-templates route query — see scripts/init-ghost-schema.sql header.';


-- ═══════════════════════════════════════════════════════════════════════════════
-- [D5] retention_policies — DERIVED (no DDL in repo). Columns reconstructed
-- from:
--   apps/admin/app/api/ghost/retention/route.ts
--     GET: SELECT * FROM retention_policies ORDER BY document_type
--     PUT: UPDATE retention_policies
--            SET retention_days = COALESCE($2, retention_days),
--                description     = COALESCE($3, description),
--                auto_delete     = COALESCE($4, auto_delete),
--                updated_at      = now()
--            WHERE document_type = $1
--            RETURNING id
-- Type notes: document_type TEXT NOT NULL UNIQUE (one policy per document
--   type: sole WHERE target and ORDER BY key); retention_days INTEGER (days,
--   nullable — no insert path evidences a value); auto_delete BOOLEAN NOT NULL
--   DEFAULT false (inferred from the name and house defaults); updated_at
--   TIMESTAMPTZ NOT NULL DEFAULT now() (SET by the PUT); description TEXT.
--   Only query-referenced columns are included; the UNIQUE constraint on
--   document_type also serves the ORDER BY.
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type TEXT NOT NULL UNIQUE,
    retention_days INTEGER,
    description TEXT,
    auto_delete BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE retention_policies IS 'Per-document-type retention policies. Schema derived from the ghost/retention route queries — see scripts/init-ghost-schema.sql header.';


-- ═══════════════════════════════════════════════════════════════════════════════
-- [D6] compliance_events — DERIVED (no DDL in repo). Columns reconstructed
-- from:
--   apps/admin/app/api/ghost/retention/route.ts
--     GET ?type=events:
--       SELECT * FROM compliance_events [WHERE NOT resolved]
--       ORDER BY created_at DESC LIMIT 100
-- Type notes: only `resolved` and `created_at` are referenced by the query
--   (SELECT * returns whatever else the table holds, so nothing else can be
--   derived from code). resolved BOOLEAN NOT NULL DEFAULT false (filter
--   target; NOT NULL keeps `NOT resolved` deterministic); created_at
--   TIMESTAMPTZ NOT NULL DEFAULT now() (ORDER BY). UUID PK per [V2]
--   convention.
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS compliance_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resolved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compliance_events_created ON compliance_events(created_at);

COMMENT ON TABLE compliance_events IS 'Compliance events surfaced by the retention view. Only `resolved` and `created_at` are referenced by code (SELECT *) — see scripts/init-ghost-schema.sql header.';


-- ═══════════════════════════════════════════════════════════════════════════════
-- [D7] deal_pipeline — DERIVED (no DDL in repo). Columns reconstructed from:
--   apps/admin/app/api/client/documents/route.ts (findClientCompany):
--     SELECT name, ref, box_folder_id
--       FROM deal_pipeline
--       WHERE seller_email = $1 OR broker_email = $1
--          OR lender_email = $1 OR counsel_email = $1
--       LIMIT 1
-- Type notes: all columns TEXT; box_folder_id nullable (route types it
--   `string | null`). id SERIAL PK added as house convention (every Ghost
--   table carries a single-column PK) — not referenced by the route. One
--   btree per email column, because the OR-match cannot use a composite
--   index (mirrors [V1]'s index-the-filtered-columns style). Only
--   query-referenced columns are included.
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS deal_pipeline (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    ref TEXT NOT NULL,
    box_folder_id TEXT,
    seller_email TEXT,
    broker_email TEXT,
    lender_email TEXT,
    counsel_email TEXT
);

CREATE INDEX IF NOT EXISTS idx_deal_pipeline_seller_email ON deal_pipeline(seller_email);
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_broker_email ON deal_pipeline(broker_email);
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_lender_email ON deal_pipeline(lender_email);
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_counsel_email ON deal_pipeline(counsel_email);

COMMENT ON TABLE deal_pipeline IS 'Deal pipeline with company contact emails. Schema derived from the client/documents findClientCompany query — see scripts/init-ghost-schema.sql header.';


-- ═══════════════════════════════════════════════════════════════════════════════
-- [D8] client_journals — DERIVED (no DDL in repo, and no route queries it
-- today). Evidence used for the reconstruction:
--   apps/admin/app/api/client/journal/box-link/route.ts — serves the client's
--     Box shared link and comments that it comes "from client_journals via
--     Convex"; the route currently hardcodes the link (queryGhost is imported
--     but unused), so no column list is queryable there.
--   Sibling journal routes (activity / checklists / metrics) and [V2] key all
--     journal state by TEXT journal_id + TEXT client_id.
-- Reconstruction: journal_id TEXT NOT NULL UNIQUE (one journal row per Convex
--   journal id), client_id TEXT NOT NULL ([V2] convention), box_shared_link
--   TEXT (the value the box-link route is meant to serve), created_at/
--   updated_at TIMESTAMPTZ NOT NULL DEFAULT now() ([V2] house style). UUID PK
--   per [V2] convention.
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS client_journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id TEXT NOT NULL UNIQUE,
    client_id TEXT NOT NULL,
    box_shared_link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE client_journals IS 'Client journal registry incl. Box shared link. Reconstructed from the box-link route comment and sibling journal-route key conventions — see scripts/init-ghost-schema.sql header.';
