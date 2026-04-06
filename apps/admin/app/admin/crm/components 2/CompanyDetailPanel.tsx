"use client";

import { useState } from "react";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { Company } from "../types";
import { useCrmCompany, useCrmActivities, useCrmContacts } from "../hooks";

// ============================================
// Company Detail Panel Component
// ============================================

interface CompanyDetailPanelProps {
  companyId: Id<"crmCompanies">;
  onClose: () => void;
  onEdit: (company: Company) => void;
}

export function CompanyDetailPanel({ companyId, onClose, onEdit }: CompanyDetailPanelProps) {
  const { data, isLoading } = useCrmCompany(companyId);
  const { activities } = useCrmActivities({ companyId });
  const { contacts } = useCrmContacts({ companyId });
  const { logNote } = useCrmActivities();

  const [noteInput, setNoteInput] = useState("");

  const handleAddNote = async () => {
    if (!noteInput.trim()) return;
    await logNote(companyId, noteInput);
    setNoteInput("");
  };

  if (isLoading || !data) {
    return (
      <div className="crm-detail-panel">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[var(--surface2)] rounded" />
            <div className="h-32 bg-[var(--surface2)] rounded" />
            <div className="h-48 bg-[var(--surface2)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  const { company } = data;
  const primaryContact = contacts?.find((c) => c.isPrimary) || contacts?.[0];

  return (
    <div className="crm-detail-panel crm-animate-slide-in">
      {/* Header */}
      <div className="crm-detail-header">
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-1.5 text-[var(--text)]">{company.name}</h2>
          <div className="text-[12px] text-[var(--text3)] flex gap-3 flex-wrap">
            <span>{company.industry || "Unknown industry"}</span>
            {company.size && <span>·</span>}
            {company.size && <span>{company.size} employees</span>}
            {company.revenue && <span>·</span>}
            {company.revenue && <span>{company.revenue}</span>}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="crm-detail-body">
        {/* Stage & Status */}
        <Section title="Stage & Status">
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)]">
              {company.stage}
            </span>
            <span className={`crm-nda-badge ${
              company.ndaStatus === "Signed" ? "crm-nda-signed" :
              company.ndaStatus === "Pending" ? "crm-nda-pending" : "crm-nda-none"
            }`}>
              {company.ndaStatus} NDA
            </span>
            {company.advisor && (
              <span className="crm-advisor-chip">{company.advisor}</span>
            )}
          </div>
        </Section>

        {/* Contact Info */}
        <Section title="Contact Information">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" value={primaryContact ? `${primaryContact.firstName} ${primaryContact.lastName}` : "—"} />
            <Field label="Role" value={primaryContact?.role || "—"} />
            <Field
              label="Email"
              value={
                primaryContact?.email ? (
                  <a href={`mailto:${primaryContact.email}`} className="text-[var(--blue)] no-underline hover:underline">
                    {primaryContact.email}
                  </a>
                ) : (
                  "—"
                )
              }
            />
            <Field
              label="Phone"
              value={
                primaryContact?.phone ? (
                  <a href={`tel:${primaryContact.phone}`} className="text-[var(--blue)] no-underline hover:underline">
                    {primaryContact.phone}
                  </a>
                ) : (
                  "—"
                )
              }
            />
          </div>
        </Section>

        {/* Next Step */}
        {company.nextStep && (
          <Section title="Next Step">
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-md p-3">
              <div className="text-[var(--text)] mb-1.5 text-[14px]">{company.nextStep}</div>
              {company.nextStepDate && (
                <div className="text-[11px] text-[var(--text3)]">
                  Due: {company.nextStepDate}
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Notes */}
        {company.notes && (
          <Section title="Notes">
            <div className="text-[13px] text-[var(--text2)] leading-7 bg-[var(--surface2)] border border-[var(--border)] rounded-md p-3 whitespace-pre-wrap">
              {company.notes}
            </div>
          </Section>
        )}

        {/* Activity Timeline */}
        <Section title="Activity Timeline">
          <div className="flex flex-col">
            {activities?.length === 0 ? (
              <div className="text-[var(--text3)] text-[12px] py-3">No activity recorded yet.</div>
            ) : (
              activities?.map((activity) => (
                <TimelineItem key={activity._id} activity={activity} />
              ))
            )}
          </div>

          {/* Add Note Input */}
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddNote()}
              placeholder="Log a call, meeting, or note..."
              className="flex-1"
            />
            <button
              onClick={handleAddNote}
              className="btn btn-primary"
            >
              Add
            </button>
          </div>
        </Section>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit(company)}
            className="flex-1 btn btn-ghost"
          >
            Edit Company
          </button>
          <button
            onClick={onClose}
            className="flex-1 btn btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Section Component
// ============================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="flex items-center justify-between text-[9px] uppercase tracking-[2px] text-[var(--text3)] mb-3 pb-2 border-b border-[var(--border)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ============================================
// Field Component
// ============================================

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-[1px] text-[var(--text3)] block mb-1.5">
        {label}
      </label>
      <span className="text-[13px] text-[var(--text)] break-words">{value}</span>
    </div>
  );
}

// ============================================
// Timeline Item Component
// ============================================

function TimelineItem({ activity }: { activity: Doc<"crmActivities"> }) {
  const icons: Record<string, string> = {
    note: "📝",
    call: "📞",
    email: "✉",
    meeting: "🤝",
    stage_change: "➜",
    task: "✓",
  };

  const dotColors: Record<string, string> = {
    stage_change: "var(--blue)",
    call: "var(--amber)",
    email: "var(--amber)",
    meeting: "var(--amber)",
    note: "var(--text3)",
    task: "var(--green)",
  };

  const borderColors: Record<string, string> = {
    stage_change: "border-l-[var(--blue)]",
    call: "border-l-[var(--amber)]",
    email: "border-l-[var(--amber)]",
    meeting: "border-l-[var(--amber)]",
    note: "border-l-[var(--text3)]",
    task: "border-l-[var(--green)]",
  };

  return (
    <div className={`flex gap-4 py-3 border-l-2 border-[var(--border)] pl-5 relative ${borderColors[activity.type] || ""}`}>
      <div
        className="absolute left-[-5px] top-3.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--surface)]"
        style={{ backgroundColor: dotColors[activity.type] || "var(--text3)" }}
      />
      <div className="text-[11px] text-[var(--text3)] whitespace-nowrap min-w-[80px] font-medium">
        {activity.date}
      </div>
      <div className="text-[13px] text-[var(--text2)] leading-relaxed flex-1">
        <strong className="text-[var(--text)]">
          {icons[activity.type] || "•"} {activity.type.replace("_", " ")}
        </strong>
        <br />
        {activity.description}
      </div>
    </div>
  );
}
