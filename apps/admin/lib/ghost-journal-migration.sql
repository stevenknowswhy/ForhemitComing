-- Ghost Database Migration: Transition Journal Tables
-- Run with: psql "$GHOST_CONNECTION_STRING" -f lib/ghost-journal-migration.sql

-- 1. Client Activity Log
-- Tracks all activity visible to clients (excludes internal notes)
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

-- 2. Phase Checklists
-- Stores checklist state per phase per journal
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

-- 3. Box Folder Map
-- Maps Box folder IDs to journal/phases for efficient lookups
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

-- 4. Box Documents
-- Tracks all documents uploaded to Box
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

-- 5. Checklist Sync State
-- Tracks when checklists were last synced for each journal
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

-- 6. Journal Metrics (for dashboard/analytics)
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

-- Seed activity log with mock data for Sunrise Manufacturing
INSERT INTO client_activity_log (journal_id, client_id, entry_id, event_type, event_date, phase, title, description, metadata)
VALUES
    -- Ignition entries (last week)
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'chapter_started', '2026-05-19 09:00:00-07', 'ignition', 'Ignition Phase Started', 'Engagement secured. Team seated, data room preparation initiated.', '{"chapter": "ignition"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-19 10:00:00-07', 'ignition', 'Engagement letter signed', 'Signed engagement letter with Sunrise Manufacturing. Scope includes full ESOP transaction advisory.', '{"theme": "admin", "effort": "document"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s9s7vb5w1', NULL, 'entry_created', '2026-05-20 09:30:00-07', 'ignition', 'Data room setup', 'Created secure data room. Shared access credentials with CFO and legal counsel.', '{"theme": "admin", "effort": "work"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-20 14:00:00-07', 'ignition', 'Trustee candidates identified', 'Identified three qualified independent trustee candidates. Sent profiles to board for review.', '{"theme": "trustee_bank", "effort": "document"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-21 11:00:00-07', 'ignition', 'IRS DOL review initiated', 'Submitted initial filings for IRS determination and DOL advisory opinion.', '{"theme": "tax", "effort": "work"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-22 10:00:00-07', 'ignition', 'Initial valuation call', 'Conference call with valuation firm. Discussed timeline, data requirements, and preliminary approach.', '{"theme": "finance", "effort": "call"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-22 15:00:00-07', 'ignition', 'Board resolution drafted', 'Drafted initial board resolutions for ESOP adoption. Sent to corporate counsel for review.', '{"theme": "governance", "effort": "document"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-23 09:00:00-07', 'ignition', 'Employee communication plan', 'Drafted employee communication plan for ESOP announcement. Includes FAQ, timeline, and town hall agenda.', '{"theme": "hr_comms", "effort": "document"}'),

    -- Build entries (this week)
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'chapter_started', '2026-05-26 09:00:00-07', 'build', 'Build Phase Started', 'Moving into Build phase. QofE fieldwork, lender package preparation, and FMV appraisal initiated.', '{"chapter": "build"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-26 10:00:00-07', 'build', 'QofE fieldwork kickoff', 'Quality of Earnings fieldwork started. Accounting team on-site for document review and interviews.', '{"theme": "finance", "effort": "meeting"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-26 14:00:00-07', 'build', 'Lender package drafted', 'Completed initial draft of lender presentation package. Includes financial summary, projections, and transaction structure.', '{"theme": "finance", "effort": "document"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-27 09:00:00-07', 'build', 'Appraisal firm engaged', 'FMV appraisal firm formally engaged. Kickoff meeting scheduled for Thursday.', '{"theme": "finance", "effort": "call"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-27 11:00:00-07', 'build', 'ERISA counsel retained', 'Retained ERISA counsel for fiduciary review. Conflict checks completed, engagement letter signed.', '{"theme": "legal", "effort": "document"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-28 10:00:00-07', 'build', 'Tax structure review', 'Meeting with tax advisors to review optimal ESOP structure. Analyzing S-corp vs C-corp implications.', '{"theme": "tax", "effort": "meeting"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-29 09:00:00-07', 'build', 'Board governance update', 'Updated board on transaction timeline and key milestones. Discussed fiduciary duties and approval process.', '{"theme": "governance", "effort": "meeting"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-29 14:00:00-07', 'build', 'SBA eligibility confirmed', 'Confirmed SBA 7(a) eligibility for ESOP financing. Began preparing SBA application package.', '{"theme": "finance", "effort": "work"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-30 10:00:00-07', 'build', 'Data room documents uploaded', 'Uploaded 47 documents to secure data room. Includes 3 years of financials, tax returns, and organizational charts.', '{"theme": "admin", "effort": "work"}'),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', NULL, 'entry_created', '2026-05-30 15:00:00-07', 'build', 'HR compensation analysis', 'Compensation study initiated for all employees. Required for ESOP contribution calculations and plan design.', '{"theme": "hr_comms", "effort": "call"}');

-- Seed phase checklists with mock data
INSERT INTO phase_checklists (journal_id, client_id, phase, phase_name, total_tasks, completed_tasks, in_progress_tasks, tasks, last_synced_at)
VALUES
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', 'ignition', '01 — Ignition (Days 1–14)', 8, 8, 0,
     '[
        {"title": "Sign engagement letter", "status": "completed", "category": "legal", "completedAt": "2026-05-19"},
        {"title": "Set up secure data room", "status": "completed", "category": "admin", "completedAt": "2026-05-20"},
        {"title": "Identify trustee candidates", "status": "completed", "category": "trustee_bank", "completedAt": "2026-05-20"},
        {"title": "Submit IRS determination request", "status": "completed", "category": "tax", "completedAt": "2026-05-21"},
        {"title": "Initial valuation call", "status": "completed", "category": "finance", "completedAt": "2026-05-22"},
        {"title": "Draft board resolutions", "status": "completed", "category": "governance", "completedAt": "2026-05-22"},
        {"title": "Draft employee communication plan", "status": "completed", "category": "hr_comms", "completedAt": "2026-05-23"},
        {"title": "Engage corporate counsel", "status": "completed", "category": "legal", "completedAt": "2026-05-23"}
     ]'::jsonb, NOW()),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', 'build', '02 — Build (Days 15–45)', 12, 5, 4,
     '[
        {"title": "QofE fieldwork kickoff", "status": "completed", "category": "finance", "completedAt": "2026-05-26"},
        {"title": "Draft lender presentation package", "status": "completed", "category": "finance", "completedAt": "2026-05-26"},
        {"title": "Engage FMV appraisal firm", "status": "completed", "category": "finance", "completedAt": "2026-05-27"},
        {"title": "Retain ERISA counsel", "status": "completed", "category": "legal", "completedAt": "2026-05-27"},
        {"title": "Tax structure analysis", "status": "completed", "category": "tax", "completedAt": "2026-05-28"},
        {"title": "SBA eligibility application", "status": "in_progress", "category": "finance"},
        {"title": "Complete QofE report", "status": "in_progress", "category": "finance"},
        {"title": "FMV appraisal draft", "status": "in_progress", "category": "finance"},
        {"title": "Board governance review", "status": "in_progress", "category": "governance"},
        {"title": "HR compensation study", "status": "pending", "category": "hr_comms"},
        {"title": "Lender outreach", "status": "pending", "category": "trustee_bank"},
        {"title": "Draft ESOP plan document", "status": "pending", "category": "legal"}
     ]'::jsonb, NOW()),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', 'validate', '03 — Validate (Days 46–75)', 10, 0, 0,
     '[
        {"title": "Execute LOI", "status": "pending", "category": "legal"},
        {"title": "ESOP plan document finalized", "status": "pending", "category": "legal"},
        {"title": "SBA application submitted", "status": "pending", "category": "finance"},
        {"title": "QofE report delivered", "status": "pending", "category": "finance"},
        {"title": "FMV appraisal delivered", "status": "pending", "category": "finance"},
        {"title": "DOL advisory opinion filed", "status": "pending", "category": "tax"},
        {"title": "Insurance quotes obtained", "status": "pending", "category": "admin"},
        {"title": "Trustee selection finalized", "status": "pending", "category": "trustee_bank"},
        {"title": "Employee census completed", "status": "pending", "category": "hr_comms"},
        {"title": "Board approval of transaction", "status": "pending", "category": "governance"}
     ]'::jsonb, NOW()),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', 'close-prep', '04 — Close Prep (Days 76–105)', 8, 0, 0,
     '[
        {"title": "Draft purchase agreement", "status": "pending", "category": "legal"},
        {"title": "Final board resolutions", "status": "pending", "category": "governance"},
        {"title": "ERISA compliance review", "status": "pending", "category": "legal"},
        {"title": "Final lender commitment", "status": "pending", "category": "finance"},
        {"title": "Closing checklist review", "status": "pending", "category": "admin"},
        {"title": "Final employee communications", "status": "pending", "category": "hr_comms"},
        {"title": "Trust documents finalized", "status": "pending", "category": "trustee_bank"},
        {"title": "Tax filings prepared", "status": "pending", "category": "tax"}
     ]'::jsonb, NOW()),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', 'closing', '05 — Closing (Days 106–120)', 6, 0, 0,
     '[
        {"title": "Execute closing documents", "status": "pending", "category": "legal"},
        {"title": "Fund escrow", "status": "pending", "category": "finance"},
        {"title": "Record ownership transfer", "status": "pending", "category": "admin"},
        {"title": "Employee announcement", "status": "pending", "category": "hr_comms"},
        {"title": "Post-close reporting setup", "status": "pending", "category": "finance"},
        {"title": "Transition plan activation", "status": "pending", "category": "governance"}
     ]'::jsonb, NOW()),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', 'post-close', '06 — Post-Close', 4, 0, 0,
     '[
        {"title": "Annual ESOP administration", "status": "pending", "category": "finance"},
        {"title": "Ongoing compliance reporting", "status": "pending", "category": "tax"},
        {"title": "Employee education program", "status": "pending", "category": "hr_comms"},
        {"title": "Stewardship reviews", "status": "pending", "category": "governance"}
     ]'::jsonb, NOW());

-- Seed sync state
INSERT INTO checklist_sync_state (journal_id, client_id, last_sync_at, last_sync_status, phases_synced)
VALUES (
    'pn7dr450q7zb0fj0j4jsy8shr187vaqp',
    'jd71m28efj3v3nkxjqe50b5s9s7vb5w1',
    NOW(),
    'success',
    '["ignition", "build", "validate", "close-prep", "closing", "post-close"]'::jsonb
);

-- Seed journal metrics
INSERT INTO journal_metrics (journal_id, client_id, week_starting, total_entries, entries_by_theme, entries_by_effort, touchpoints, milestones, active_phase, days_in_current_phase)
VALUES
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', '2026-05-19', 8,
     '{"admin": 2, "trustee_bank": 1, "tax": 1, "finance": 1, "governance": 1, "hr_comms": 1}'::jsonb,
     '{"document": 3, "work": 1, "call": 1}'::jsonb,
     '{"calls": 1, "emails": 0, "documents": 3, "meetings": 0, "total": 4}'::jsonb,
     0, 'ignition', 7),
    ('pn7dr450q7zb0fj0j4jsy8shr187vaqp', 'jd71m28efj3v3nkxjqe50b5s9s7vb5w1', '2026-05-26', 8,
     '{"finance": 3, "legal": 1, "tax": 1, "governance": 1, "hr_comms": 1, "admin": 1}'::jsonb,
     '{"meeting": 3, "document": 2, "call": 1, "work": 1}'::jsonb,
     '{"calls": 1, "emails": 0, "documents": 2, "meetings": 3, "total": 6}'::jsonb,
     0, 'build', 7);

COMMENT ON TABLE client_activity_log IS 'Client-facing activity log for transition journals. Excludes internal notes.';
COMMENT ON TABLE phase_checklists IS 'Phase checklist state per journal, synced daily from deal tracker.';
COMMENT ON TABLE box_folder_map IS 'Maps Box folder IDs to journal/phases for efficient API lookups.';
COMMENT ON TABLE box_documents IS 'Tracks all documents uploaded to Box for transition journals.';
COMMENT ON TABLE checklist_sync_state IS 'Tracks when checklists were last synced per journal.';
COMMENT ON TABLE journal_metrics IS 'Weekly metrics snapshot for journal analytics and dashboards.';
