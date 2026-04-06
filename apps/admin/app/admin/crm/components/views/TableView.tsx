"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Company, SortConfig } from "../../types";
import {
  StageBadge,
  NdaBadge,
  DueDateTag,
  AdvisorChip,
} from "../shared";
import {
  formatDate,
  getRelativeDate,
  truncateText,
} from "../../lib";

// ============================================
// Table View Component
// ============================================

interface TableViewProps {
  companies: Company[];
  sort: SortConfig;
  onSort: (field: string) => void;
  onSelect: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function TableView({
  companies,
  sort,
  onSort,
  onSelect,
  onEdit,
  onDelete,
}: TableViewProps) {
  const handleSort = (field: string) => {
    onSort(field);
  };

  const getSortIndicator = (field: string) => {
    if (sort.field !== field) return "↕";
    return sort.direction === "asc" ? "↑" : "↓";
  };

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] max-[375px]:h-[min(45vh,300px)] px-4 text-[var(--text3)] text-center">
        <span className="text-5xl mb-4 opacity-30">🔍</span>
        <h3 className="font-serif text-lg text-[var(--text)] mb-2">No companies found</h3>
        <p className="text-[13px] max-w-[22rem] leading-relaxed">
          Try adjusting your filters or add a new company
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[var(--surface)] sticky top-0 z-[5]">
            <SortHeader field="company" label="Company" sort={sort} onSort={handleSort} />
            <th className="px-3.5 py-3 text-left text-[9px] uppercase tracking-[1.5px] text-[var(--text3)] font-medium border-b border-[var(--border)]">
              Contact
            </th>
            <SortHeader field="stage" label="Stage" sort={sort} onSort={handleSort} />
            <th className="px-3.5 py-3 text-left text-[9px] uppercase tracking-[1.5px] text-[var(--text3)] font-medium border-b border-[var(--border)]">
              NDA
            </th>
            <th className="px-3.5 py-3 text-left text-[9px] uppercase tracking-[1.5px] text-[var(--text3)] font-medium border-b border-[var(--border)]">
              Advisor
            </th>
            <SortHeader field="lastContact" label="Last Contact" sort={sort} onSort={handleSort} />
            <SortHeader field="nextDate" label="Next Step" sort={sort} onSort={handleSort} />
            <th className="px-3.5 py-3 text-left text-[9px] uppercase tracking-[1.5px] text-[var(--text3)] font-medium border-b border-[var(--border)]">
              Notes
            </th>
            <th className="px-3.5 py-3 border-b border-[var(--border)] w-10"></th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <TableRow
              key={company._id}
              company={company}
              onSelect={() => onSelect(company)}
              onEdit={() => onEdit(company)}
              onDelete={() => onDelete(company)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// Sort Header Component
// ============================================

interface SortHeaderProps {
  field: string;
  label: string;
  sort: SortConfig;
  onSort: (field: string) => void;
}

function SortHeader({ field, label, sort, onSort }: SortHeaderProps) {
  const isActive = sort.field === field;

  return (
    <th
      onClick={() => onSort(field)}
      className={`
        px-3.5 py-3 text-left text-[9px] uppercase tracking-[1.5px] font-medium
        border-b border-[var(--border)] cursor-pointer select-none whitespace-nowrap
        transition-colors
        ${isActive ? "text-[var(--green)]" : "text-[var(--text3)] hover:text-[var(--text2)]"}
      `}
    >
      {label}
      <span className={`ml-1 ${isActive ? "opacity-100" : "opacity-30"}`}>
        {isActive ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </th>
  );
}

// ============================================
// Table Row Component
// ============================================

interface TableRowProps {
  company: Company;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function TableRow({ company, onSelect, onEdit, onDelete }: TableRowProps) {
  return (
    <tr
      onClick={onSelect}
      className="border-b border-[var(--border)] cursor-pointer transition-colors hover:bg-[var(--surface2)] group"
    >
      {/* Company */}
      <td className="px-3.5 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[var(--text)] text-[13px]">{company.name}</span>
          <span className="text-[10px] text-[var(--text3)]">
            {company.industry}
            {company.size && ` · ${company.size}`}
          </span>
        </div>
      </td>

      {/* Contact - Placeholder, would need contact data */}
      <td className="px-3.5 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[var(--text)]">-</span>
        </div>
      </td>

      {/* Stage */}
      <td className="px-3.5 py-3">
        <StageBadge stage={company.stage} size="sm" />
      </td>

      {/* NDA */}
      <td className="px-3.5 py-3">
        <NdaBadge status={company.ndaStatus} size="sm" />
      </td>

      {/* Advisor */}
      <td className="px-3.5 py-3">
        <AdvisorChip advisor={company.advisor} />
      </td>

      {/* Last Contact */}
      <td className="px-3.5 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] text-[var(--text2)]">
            {formatDate(company.lastContactDate)}
          </span>
          <span className="text-[10px] text-[var(--text3)]">
            {getRelativeDate(company.lastContactDate)}
          </span>
        </div>
      </td>

      {/* Next Step */}
      <td className="px-3.5 py-3">
        {company.nextStep ? (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[var(--text2)] truncate max-w-[150px]">
              {company.nextStep}
            </span>
            <DueDateTag date={company.nextStepDate} />
          </div>
        ) : (
          <span className="text-[var(--text3)]">—</span>
        )}
      </td>

      {/* Notes */}
      <td className="px-3.5 py-3">
        <div className="text-[11px] text-[var(--text3)] truncate max-w-[180px]">
          {company.notes ? truncateText(company.notes, 50) : "—"}
        </div>
      </td>

      {/* Actions */}
      <td className="px-3.5 py-3">
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="px-2 py-1 text-[11px] bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text3)] hover:text-[var(--green)] hover:border-[var(--green-dim)] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="px-2 py-1 text-[11px] bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text3)] hover:text-[#ff5f5f] hover:border-[#ff5f5f] transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
