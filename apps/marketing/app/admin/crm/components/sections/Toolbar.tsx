"use client";

import type { ReactNode } from "react";
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
  /** e.g. mobile filter button — sits before the search field */
  leading?: ReactNode;
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
  leading,
}: ToolbarProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface2)] px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-5">
      <div className="flex min-w-0 w-full items-center gap-2 sm:flex-1">
        {leading}
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search companies..."
        />
      </div>

      <div className="flex w-full min-w-0 flex-col gap-2 sm:ml-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 lg:flex-nowrap lg:w-auto">
        <div className="flex min-w-0 w-full items-center gap-2 sm:max-w-md sm:flex-1 lg:max-w-none lg:w-auto lg:min-w-[220px] lg:flex-initial">
          <span className="shrink-0 text-[10px] text-[var(--text3)] sm:text-[11px]">{rowCount}</span>
          <SortSelect value={sortValue} onChange={onSortChange} className="min-w-0 flex-1" />
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
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
            className="btn btn-primary flex min-h-[44px] flex-1 items-center justify-center gap-1.5 text-[12px] sm:min-h-0 sm:flex-initial"
          >
            <Plus size={14} />
            Add Company
            <kbd className="ml-1.5 hidden rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 text-[10px] sm:inline">
              N
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
