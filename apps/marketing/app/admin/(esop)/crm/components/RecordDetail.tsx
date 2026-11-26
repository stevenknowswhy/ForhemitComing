"use client";

// RecordDetail (OD-13 D4) — the record-detail slide-over.
//
// Shows the record's fields, the stage mover for opportunities (the
// keyboard-accessible DnD fallback), and the notes log with an add-note
// form. Mirrors ESOP's DetailPanel as a right-side overlay.

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  STAGE_META,
  STAGE_ORDER,
  displayName,
  formatAmount,
  formatCrmDate,
  sourceLabel,
} from "@forhemit/shared/features/crm/records";
import type {
  Company,
  CrmRecord,
  Note,
  OpportunityStage,
  Person,
  RecordEntityType,
} from "@forhemit/shared/features/crm/records";

interface RecordDetailProps {
  entityType: RecordEntityType;
  record: CrmRecord;
  notes: Note[];
  companies: Company[];
  people: Person[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveStage: (stage: OpportunityStage) => void;
  onAddNote: (body: string) => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

export function RecordDetail({
  entityType,
  record,
  notes,
  companies,
  people,
  onClose,
  onEdit,
  onDelete,
  onMoveStage,
  onAddNote,
}: RecordDetailProps) {
  const [noteText, setNoteText] = useState("");

  const submitNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setNoteText("");
  };

  const companyOf = (companyId: string | null | undefined) =>
    companies.find((company) => company.id === companyId) ?? null;
  const personOf = (personId: string | null | undefined) =>
    people.find((person) => person.id === personId) ?? null;

  const company =
    record.kind === "person"
      ? companyOf(record.companyId)
      : record.kind === "opportunity"
        ? companyOf(record.companyId)
        : null;
  const person = record.kind === "opportunity" ? personOf(record.personId) : null;

  const submitLabel = entityType === "people" ? "person" : entityType === "companies" ? "company" : "opportunity";

  return (
    <div
      className="fixed inset-0 z-40 bg-black/30"
      onClick={onClose}
      role="presentation"
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${displayName(record)} details`}
        onClick={(event) => event.stopPropagation()}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-card shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="font-serif text-base text-foreground">{displayName(record)}</h2>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge variant={record.source === "twenty" ? "secondary" : "outline"}>
                {sourceLabel(record)}
              </Badge>
              {record.kind === "opportunity" && (
                <Badge variant="outline">{STAGE_META[record.stage].label}</Badge>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-11 w-11 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Fields */}
          <dl className="grid grid-cols-2 gap-3">
            {record.kind === "person" && (
              <>
                <Field label="First name" value={record.firstName} />
                <Field label="Last name" value={record.lastName ?? "—"} />
                <Field label="Email" value={record.email ?? "—"} />
                <Field label="Phone" value={record.phone ?? "—"} />
                <Field label="Job title" value={record.jobTitle ?? "—"} />
                <Field label="Company" value={company?.name ?? "—"} />
              </>
            )}
            {record.kind === "company" && (
              <>
                <Field label="Domain" value={record.domain ?? "—"} />
                <Field label="Industry" value={record.industry ?? "—"} />
                <Field label="City" value={record.city ?? "—"} />
                <Field label="State" value={record.state ?? "—"} />
              </>
            )}
            {record.kind === "opportunity" && (
              <>
                <Field label="Amount" value={formatAmount(record.amount)} />
                <Field label="Close date" value={formatCrmDate(record.closeDate)} />
                <Field label="Person" value={person ? displayName(person) : "—"} />
                <Field label="Company" value={company?.name ?? "—"} />
              </>
            )}
            <Field label="Created" value={formatCrmDate(record.createdAt)} />
            <Field label="Updated" value={formatCrmDate(record.updatedAt)} />
          </dl>

          {/* Stage mover (opportunities) — the drag-and-drop a11y fallback */}
          {record.kind === "opportunity" && (
            <div className="mt-4 rounded-lg border border-border p-3">
              <label
                htmlFor="detail-stage"
                className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground"
              >
                Stage
              </label>
              <select
                id="detail-stage"
                value={record.stage}
                onChange={(event) => onMoveStage(event.target.value as OpportunityStage)}
                className="h-11 w-full rounded border border-border bg-card px-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-primary"
              >
                {STAGE_ORDER.map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGE_META[stage].label} — {STAGE_META[stage].description}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div className="mt-4">
            <h3 className="mb-2 text-xs font-semibold text-foreground">
              Notes <span className="font-mono text-[10px] text-muted-foreground">({notes.length})</span>
            </h3>
            <div className="space-y-2">
              {notes.length === 0 && (
                <p className="text-xs text-muted-foreground">No notes yet.</p>
              )}
              {notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-border bg-muted/30 p-2">
                  <p className="text-xs text-foreground">{note.body}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {formatCrmDate(note.createdAt)}
                    {note.source === "twenty" ? " · imported from Twenty" : ""}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <label htmlFor="new-note" className="sr-only">
                Add a note
              </label>
              <textarea
                id="new-note"
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                rows={2}
                placeholder="Add a note…"
                className="w-full rounded border border-border bg-muted/30 p-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={submitNote}
                disabled={!noteText.trim()}
                className="mt-1.5 flex h-11 items-center rounded bg-primary px-3 text-xs text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-primary"
              >
                Add note
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-11 items-center rounded bg-primary px-4 text-xs text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-primary"
          >
            Edit {submitLabel}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-11 items-center rounded border border-border px-4 text-xs text-muted-foreground transition-colors hover:text-red-600 focus-visible:outline-2 focus-visible:outline-primary"
          >
            Delete {submitLabel}
          </button>
        </div>
      </aside>
    </div>
  );
}
