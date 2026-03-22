"use client";

import { Company, PipelineStage, STAGE_STYLES } from "../../types";
import { StageBadge, NdaBadge } from "../shared";
import { daysUntil } from "../../lib";

// ============================================
// Kanban View Component
// ============================================

interface KanbanViewProps {
  companies: Company[];
  onSelect: (company: Company) => void;
}

const STAGES: PipelineStage[] = [
  "First contact",
  "Intro call",
  "NDA sent",
  "Feasibility",
  "Term sheet",
  "LOI signed",
  "Closed",
  "On hold",
  "Dead",
];

export function KanbanView({ companies, onSelect }: KanbanViewProps) {
  // Group companies by stage
  const byStage: Record<string, Company[]> = {};
  STAGES.forEach((stage) => {
    byStage[stage] = companies.filter((c) => c.stage === stage);
  });

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-5 flex gap-4 bg-[var(--bg)]">
      {STAGES.map((stage) => (
        <KanbanColumn
          key={stage}
          stage={stage}
          companies={byStage[stage] || []}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

// ============================================
// Kanban Column Component
// ============================================

interface KanbanColumnProps {
  stage: PipelineStage;
  companies: Company[];
  onSelect: (company: Company) => void;
}

function KanbanColumn({ stage, companies, onSelect }: KanbanColumnProps) {
  const style = STAGE_STYLES[stage];

  return (
    <div
      className="min-w-[280px] max-w-[280px] flex flex-col max-h-full rounded-lg border border-[var(--border)] bg-[var(--surface)]"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] rounded-t-lg"
        style={{ backgroundColor: "var(--surface2)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: style.color }}
          />
          <span className="text-[12px] font-medium">{stage}</span>
        </div>
        <span className="text-[10px] text-[var(--text3)] bg-[var(--surface)] px-2 py-0.5 rounded-full">
          {companies.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {companies.length === 0 ? (
          <div className="text-center text-[var(--text3)] py-8 text-[11px]">
            No companies
          </div>
        ) : (
          companies.map((company) => (
            <KanbanCard
              key={company._id}
              company={company}
              onClick={() => onSelect(company)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ============================================
// Kanban Card Component
// ============================================

interface KanbanCardProps {
  company: Company;
  onClick: () => void;
}

function KanbanCard({ company, onClick }: KanbanCardProps) {
  const style = STAGE_STYLES[company.stage as PipelineStage];
  const days = daysUntil(company.nextStepDate);

  // Due date indicator
  let dueIndicator = null;
  if (company.nextStepDate) {
    if (days !== null && days < 0) {
      dueIndicator = (
        <span className="text-[9px] text-[#ff5f5f]">⚠ {Math.abs(days)}d overdue</span>
      );
    } else if (days === 0) {
      dueIndicator = <span className="text-[9px] text-[#f5a623]">◉ Due today</span>;
    } else if (days !== null && days <= 3) {
      dueIndicator = <span className="text-[9px] text-[#2dd882]">◎ {days}d</span>;
    }
  }

  return (
    <div
      onClick={onClick}
      className="bg-[var(--bg)] border border-[var(--border)] rounded-md p-3 cursor-pointer
        transition-all hover:border-[var(--border2)] hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderLeftWidth: 3, borderLeftColor: style.color }}
    >
      {/* Title */}
      <div className="font-medium text-[13px] mb-1.5">{company.name}</div>

      {/* Meta */}
      <div className="text-[10px] text-[var(--text3)] mb-2">
        {company.industry || "Unknown industry"}
        {company.advisor && ` · ${company.advisor}`}
      </div>

      {/* Next Step */}
      {company.nextStep && (
        <div className="text-[11px] text-[var(--text2)] my-2">{company.nextStep}</div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border)]">
        <span
          className={`
            text-[9px] px-1.5 py-0.5 rounded uppercase
            ${company.ndaStatus === "Signed" ? "bg-[#0d4a2a] text-[#2dd882]" : ""}
            ${company.ndaStatus === "Pending" ? "bg-[#7a4f0a] text-[#f5a623]" : ""}
            ${company.ndaStatus === "None" ? "bg-[var(--surface2)] text-[var(--text3)]" : ""}
          `}
        >
          {company.ndaStatus}
        </span>
        {dueIndicator}
      </div>
    </div>
  );
}
