"use client";

// CrmClient (OD-13 D4) — the /admin/crm client island.
//
// Mirrors ESOPPartnerCRM's structure (topbar, metrics, filter pills, view
// switch, root-level overlays with Escape-closes-topmost) but is backed by
// the Supabased useCrm hook instead of localStorage, and styled in the
// OD-11 token dialect. Records span people, companies, and opportunities
// (Twenty's vocabulary); notes render in the detail slide-over.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  LayoutGrid,
  List,
  Plus,
  Search,
  Table as TableIcon,
  Upload,
  X,
} from "lucide-react";
import {
  STAGE_META,
  STAGE_ORDER,
  formatAmount,
  useCrm,
} from "@forhemit/shared/features/crm/records";
import type {
  CrmData,
  CrmRecord,
  CrmSource,
  CrmSortConfig,
  Note,
  RecordEntityType,
} from "@forhemit/shared/features/crm/records";
import { Pipeline } from "./components/Pipeline";
import { TableView } from "./components/TableView";
import { RecordDetail } from "./components/RecordDetail";
import { RecordModal } from "./components/RecordModal";

type ViewMode = "pipeline" | "table";
type TypeFilter = "all" | RecordEntityType;

const TYPE_LABELS: Record<TypeFilter, string> = {
  all: "All",
  people: "People",
  companies: "Companies",
  opportunities: "Opportunities",
};

interface SelectedRef {
  entityType: RecordEntityType;
  id: string;
}

interface CrmClientProps {
  initial: CrmData;
  /** Server-side degradation (Supabase unconfigured / migration missing). */
  notice?: string | null;
}

export function CrmClient({ initial, notice = null }: CrmClientProps) {
  const crm = useCrm(initial);
  const {
    data,
    searchQuery,
    setSearchQuery,
    stageFilter,
    setStageFilter,
    sourceFilter,
    setSourceFilter,
    sort,
    setSort,
    toast,
    isMutating,
    filteredPeople,
    filteredCompanies,
    filteredOpportunities,
    pipelineGroups,
    metrics,
    createPerson,
    createCompany,
    createOpportunity,
    addNote,
    moveOpportunity,
    updateRecord,
    deleteRecord,
    importTwenty,
  } = crm;

  const [view, setView] = useState<ViewMode>("pipeline");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selected, setSelected] = useState<SelectedRef | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [modal, setModal] = useState<{ entityType: RecordEntityType; id: string | null } | null>(
    null
  );
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Escape closes the topmost overlay (modal first, then detail, then import).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (modal) setModal(null);
      else if (detailOpen) setDetailOpen(false);
      else if (importOpen) setImportOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modal, detailOpen, importOpen]);

  const recordFor = useCallback(
    (entityType: RecordEntityType, id: string): CrmRecord | null => {
      const pool =
        entityType === "people"
          ? data.people
          : entityType === "companies"
            ? data.companies
            : data.opportunities;
      return pool.find((record) => record.id === id) ?? null;
    },
    [data]
  );

  const selectedRecord = selected ? recordFor(selected.entityType, selected.id) : null;

  const handleSelect = useCallback(
    (entityType: RecordEntityType, record: CrmRecord) => {
      setSelected({ entityType, id: record.id });
      setDetailOpen(true);
    },
    []
  );

  const openCreate = (entityType: RecordEntityType) => {
    setSelected(null);
    setDetailOpen(false);
    setModal({ entityType, id: null });
  };

  const openEdit = (entityType: RecordEntityType, id: string) => {
    setDetailOpen(false);
    setModal({ entityType, id });
  };

  const handleSubmit = useCallback(
    async (input: Record<string, unknown>): Promise<boolean> => {
      if (!modal) return false;
      let ok = false;
      if (modal.entityType === "people") {
        ok =
          modal.id !== null
            ? await updateRecord("people", modal.id, input)
            : await createPerson(input as never);
      } else if (modal.entityType === "companies") {
        ok =
          modal.id !== null
            ? await updateRecord("companies", modal.id, input)
            : await createCompany(input as never);
      } else {
        ok =
          modal.id !== null
            ? await updateRecord("opportunities", modal.id, input)
            : await createOpportunity(input as never);
      }
      if (ok) setModal(null);
      return ok;
    },
    [modal, updateRecord, createPerson, createCompany, createOpportunity]
  );

  const handleDelete = useCallback(
    async (entityType: RecordEntityType, id: string) => {
      await deleteRecord(entityType, id);
      setDetailOpen(false);
      setSelected(null);
    },
    [deleteRecord]
  );

  const handleImport = useCallback(async () => {
    let payload: unknown;
    try {
      payload = JSON.parse(importText);
    } catch {
      crm.showToast("Import payload is not valid JSON", "error");
      return;
    }
    const count = await importTwenty(payload);
    if (count > 0) {
      setImportText("");
      setImportOpen(false);
    }
  }, [importText, importTwenty, crm]);

  const handleImportFile = useCallback(
    async (file: File) => {
      const text = await file.text();
      setImportText(text);
    },
    []
  );

  const handleExport = useCallback(() => {
    window.location.href = "/api/admin/crm/export?format=json";
  }, []);

  const handleSort = useCallback(
    (field: NonNullable<CrmSortConfig["field"]>) => {
      setSort((current) =>
        current.field === field
          ? { field, dir: current.dir === "asc" ? "desc" : "asc" }
          : { field, dir: "asc" }
      );
    },
    [setSort]
  );

  // Type filter picks which entity's records the table shows; the pipeline
  // always shows opportunities.
  const tableEntity: RecordEntityType =
    typeFilter === "all" ? "opportunities" : typeFilter;

  const tableRecords = useMemo<readonly CrmRecord[]>(() => {
    if (tableEntity === "people") return filteredPeople;
    if (tableEntity === "companies") return filteredCompanies;
    return filteredOpportunities;
  }, [tableEntity, filteredPeople, filteredCompanies, filteredOpportunities]);

  const totalCount =
    data.people.length + data.companies.length + data.opportunities.length;
  const isEmpty = totalCount === 0;

  const typeCounts: Record<TypeFilter, number> = {
    all: totalCount,
    people: data.people.length,
    companies: data.companies.length,
    opportunities: data.opportunities.length,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F2F5F9] text-foreground">
      {/* Topbar */}
      <div className="sticky top-0 z-30 flex min-h-14 flex-wrap items-center gap-2 border-b border-border bg-card px-4 py-1.5 md:h-13 md:min-h-0 md:flex-nowrap md:px-6 md:py-0">
        <h1 className="font-serif text-base text-foreground">CRM</h1>

        {/* View switch */}
        <div
          className="flex items-center rounded-md border border-border p-0.5"
          role="tablist"
          aria-label="View mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={view === "pipeline"}
            onClick={() => setView("pipeline")}
            className={`flex h-9 min-w-[44px] items-center justify-center gap-1 rounded px-2 text-xs transition-colors ${
              view === "pipeline" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Pipeline
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "table"}
            onClick={() => setView("table")}
            className={`flex h-9 min-w-[44px] items-center justify-center gap-1 rounded px-2 text-xs transition-colors ${
              view === "table" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Table
          </button>
        </div>

        <div className="relative order-last w-full md:order-none md:ml-auto md:w-auto">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search records…"
            aria-label="Search records"
            className="h-9 w-full rounded-full border border-border bg-muted/40 pl-8 pr-3 text-xs text-foreground transition-all focus:border-primary focus:outline-none md:w-44 md:focus:w-56"
          />
        </div>

        <button
          type="button"
          onClick={() => openCreate(tableEntity)}
          className="flex h-9 min-h-[36px] items-center gap-1 rounded border border-border px-3 text-xs transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
        <button
          type="button"
          onClick={() => setImportOpen((open) => !open)}
          aria-expanded={importOpen}
          className="flex h-9 min-h-[36px] items-center gap-1 rounded border border-border px-3 text-xs transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Upload className="h-3.5 w-3.5" />
          Import
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="flex h-9 min-h-[36px] items-center gap-1 rounded bg-primary px-3 text-xs text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className="border-b border-amber-300/60 bg-amber-50 px-4 py-2 text-xs text-amber-900 md:px-6"
        >
          {notice}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Metrics */}
        <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="People" value={metrics.people} />
          <MetricCard label="Companies" value={metrics.companies} />
          <MetricCard label="Opportunities" value={metrics.opportunities} />
          <MetricCard label="Notes" value={metrics.notes} />
          <MetricCard label="From Twenty" value={metrics.fromTwenty} />
          <MetricCard label="Pipeline value" value={formatAmount(metrics.pipelineValue)} />
        </div>

        {/* Type pills */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5" role="group" aria-label="Record type">
          {(Object.keys(TYPE_LABELS) as TypeFilter[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              aria-pressed={typeFilter === type}
              className={`h-9 rounded-full border px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                typeFilter === type
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {TYPE_LABELS[type]}
              <span className="ml-1 font-mono text-[10px]">{typeCounts[type]}</span>
            </button>
          ))}
        </div>

        {/* Stage + source pills */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Stage</span>
          <FilterPill
            active={stageFilter === null}
            onClick={() => setStageFilter(null)}
            label="Any"
          />
          {STAGE_ORDER.map((stage) => (
            <FilterPill
              key={stage}
              active={stageFilter === stage}
              onClick={() => setStageFilter(stageFilter === stage ? null : stage)}
              label={`${STAGE_META[stage].label} (${metrics.byStage[stage]})`}
              title={STAGE_META[stage].description}
            />
          ))}
          <span className="ml-2 text-[11px] uppercase tracking-wide text-muted-foreground">Source</span>
          {(["manual", "twenty"] as CrmSource[]).map((source) => (
            <FilterPill
              key={source}
              active={sourceFilter === source}
              onClick={() => setSourceFilter(sourceFilter === source ? null : source)}
              label={source === "twenty" ? "Twenty" : "Manual"}
            />
          ))}
        </div>

        {/* Import area */}
        {importOpen && (
          <div className="mb-4 rounded-lg border border-border bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">
                Import a Twenty JSON export (people, companies, opportunities)
              </p>
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                aria-label="Close import"
                className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <textarea
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder='Paste Twenty JSON here, e.g. {"people": [...], "companies": [...], "opportunities": [...]}'
              rows={6}
              className="w-full rounded border border-border bg-muted/30 p-2 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              aria-label="Twenty JSON payload"
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleImport}
                disabled={!importText.trim() || isMutating}
                className="flex h-9 items-center gap-1 rounded bg-primary px-3 text-xs text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-primary"
              >
                <TableIcon className="h-3.5 w-3.5" />
                Import records
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-9 items-center rounded border border-border px-3 text-xs transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-primary"
              >
                Choose file…
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleImportFile(file);
                  event.target.value = "";
                }}
              />
            </div>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && !notice ? (
          <EmptyState onCreate={() => openCreate("people")} />
        ) : isEmpty && notice ? (
          <p className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No records yet.
          </p>
        ) : view === "pipeline" ? (
          <Pipeline
            groups={pipelineGroups}
            onSelect={(record) => handleSelect("opportunities", record)}
            onMove={moveOpportunity}
          />
        ) : (
          <TableView
            entityType={tableEntity}
            records={tableRecords}
            sort={sort}
            onSort={handleSort}
            onSelect={(record) => handleSelect(tableEntity, record)}
            onDelete={(id) => void handleDelete(tableEntity, id)}
          />
        )}
      </div>

      {/* Root-level overlays */}
      {detailOpen && selectedRecord && selected && (
        <RecordDetail
          entityType={selected.entityType}
          record={selectedRecord}
          notes={notesForRecord(data.notes, selectedRecord)}
          companies={data.companies}
          people={data.people}
          onClose={() => setDetailOpen(false)}
          onEdit={() => openEdit(selected.entityType, selected.id)}
          onDelete={() => void handleDelete(selected.entityType, selected.id)}
          onMoveStage={(stage) => void moveOpportunity(selectedRecord.id, stage)}
          onAddNote={(body) =>
            addNote(
              selected.entityType === "people"
                ? { body, personId: selectedRecord.id }
                : selected.entityType === "companies"
                  ? { body, companyId: selectedRecord.id }
                  : { body, opportunityId: selectedRecord.id }
            )
          }
        />
      )}
      {modal && (
        <RecordModal
          entityType={modal.entityType}
          record={modal.id !== null ? recordFor(modal.entityType, modal.id) : null}
          companies={data.companies}
          people={data.people}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}

      {/* Toast */}
      {toast.visible && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 right-4 z-50 rounded-md border px-4 py-2 text-xs shadow-lg ${
            toast.tone === "error"
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-border bg-card text-foreground"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

function notesForRecord(notes: Note[], record: CrmRecord): Note[] {
  return notes.filter(
    (note) =>
      (record.kind === "person" && note.personId === record.id) ||
      (record.kind === "company" && note.companyId === record.id) ||
      (record.kind === "opportunity" && note.opportunityId === record.id)
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-base font-semibold text-foreground">{value}</div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  title,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={`h-9 rounded-full border px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:bg-muted/50"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
      <p className="text-sm font-medium text-foreground">No records yet</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Create your first person, company, or opportunity — or import a Twenty
        JSON export from the Import button above.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-4 flex h-11 items-center gap-1 rounded bg-primary px-4 text-xs text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Plus className="h-3.5 w-3.5" />
        Add a person
      </button>
    </div>
  );
}

