"use client";

import { SlidersHorizontal, Upload, Download } from "lucide-react";
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
  /** Opens stage/NDA/due filters drawer on small screens */
  onOpenFilters?: () => void;
  onImportClick?: () => void;
  onExportClick?: () => void;
}

export function Toolbar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  rowCount,
  onOpenFilters,
  onImportClick,
  onExportClick,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 max-[375px]:gap-2 sm:flex-row sm:items-center sm:gap-3 px-3 max-[375px]:px-2 sm:px-5 py-3 max-[375px]:py-2 border-b border-[var(--border)] bg-[var(--surface2)] sticky top-0 z-10">
      <div className="flex items-center gap-2 max-[375px]:gap-1.5 w-full min-w-0 sm:flex-1">
        {onOpenFilters && (
          <button
            type="button"
            onClick={onOpenFilters}
            className="btn btn-ghost shrink-0 px-2.5 max-[375px]:px-2 max-[375px]:min-h-[38px] sm:px-3 lg:hidden"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={16} className="shrink-0" />
          </button>
        )}
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search companies..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 max-[375px]:gap-1.5 w-full min-w-0 sm:w-auto sm:flex-nowrap sm:ml-auto sm:justify-end">
        <span className="text-[10px] sm:text-[11px] text-[var(--text3)] whitespace-nowrap shrink-0">
          {rowCount}
        </span>
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
      </div>
    </div>
  );
}
