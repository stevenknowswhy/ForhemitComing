"use client";

import { Plus, Upload, Download } from "lucide-react";
import { SearchInput, SortSelect } from "../inputs";

// ============================================
// Toolbar Component
// ============================================

interface ToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  rowCount: string;
  onAddClick: () => void;
  onImportClick?: () => void;
  onExportClick?: () => void;
}

export function Toolbar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  rowCount,
  onAddClick,
  onImportClick,
  onExportClick,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)] bg-[var(--surface2)] sticky top-0 z-10">
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search company, contact, advisor..."
      />

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-[11px] text-[var(--text3)]">{rowCount}</span>
        <SortSelect value={sortValue} onChange={onSortChange} />

        {onImportClick && (
          <button
            onClick={onImportClick}
            className="btn btn-ghost flex items-center gap-1.5 text-[12px]"
          >
            <Upload size={14} />
            Import
          </button>
        )}

        {onExportClick && (
          <button
            onClick={onExportClick}
            className="btn btn-ghost flex items-center gap-1.5 text-[12px]"
          >
            <Download size={14} />
            Export
          </button>
        )}

        <button
          onClick={onAddClick}
          className="btn btn-primary flex items-center gap-1.5 text-[12px]"
        >
          <Plus size={14} />
          Add Company
          <kbd className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-[var(--bg)] border border-[var(--border)] rounded">
            N
          </kbd>
        </button>
      </div>
    </div>
  );
}
