"use client";

import { STAGE_OPTIONS, FILTER_LABELS } from "../../constants";
import { CompanyFilters, DueFilter, PipelineStage, STAGE_STYLES } from "../../types";

// ============================================
// Filter Sidebar Component
// ============================================

interface FilterSidebarProps {
  filters: CompanyFilters;
  onFilterChange: (filters: Partial<CompanyFilters>) => void;
  stageCounts: Record<string, number>;
  ndaCounts: Record<string, number>;
  /** When false on small viewports, drawer is off-canvas; desktop (lg+) always visible */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function FilterSidebar({
  filters,
  onFilterChange,
  stageCounts,
  ndaCounts,
  mobileOpen = false,
  onMobileClose,
}: FilterSidebarProps) {
  const handleReset = () => {
    onFilterChange({
      stage: "all",
      ndaStatus: "all",
      searchQuery: "",
      dueFilter: "all",
    });
  };

  return (
    <aside
      className={`
        flex flex-col border-r border-[var(--border)] bg-[var(--surface)] overflow-y-auto shrink-0
        fixed z-[120] top-0 bottom-0 left-0 w-[min(300px,92vw)] max-w-[300px] shadow-lg lg:shadow-none
        lg:relative lg:top-auto lg:bottom-auto lg:left-auto lg:z-auto lg:w-[260px] lg:max-w-none
        transition-transform duration-200 ease-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {onMobileClose && (
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface2)] shrink-0">
          <span className="text-[13px] font-semibold text-[var(--text)]">Filters</span>
          <button
            type="button"
            onClick={onMobileClose}
            className="w-9 h-9 flex items-center justify-center rounded-md text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface3)] transition-colors text-lg"
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>
      )}
      {/* Stage Filters */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[9px] uppercase tracking-[2px] text-[var(--text3)]">
            Stage Filter
          </h3>
          <button
            onClick={handleReset}
            className="text-[10px] text-[var(--text3)] hover:text-[var(--text)] transition-colors"
          >
            Reset
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          {/* All Stages */}
          <FilterItem
            label="All Stages"
            count={Object.values(stageCounts).reduce((a, b) => a + b, 0)}
            active={filters.stage === "all"}
            onClick={() => onFilterChange({ stage: "all" })}
          />
          {/* Individual Stages */}
          {STAGE_OPTIONS.map((stage) => {
            const style = STAGE_STYLES[stage.value];
            return (
              <FilterItem
                key={stage.value}
                label={stage.label}
                count={stageCounts[stage.value] || 0}
                active={filters.stage === stage.value}
                onClick={() => onFilterChange({ stage: stage.value })}
                dot={style.color}
              />
            );
          })}
        </div>
      </div>

      {/* NDA Status Filters */}
      <div className="p-4 border-b border-[var(--border)]">
        <h3 className="text-[9px] uppercase tracking-[2px] text-[var(--text3)] mb-2.5">
          NDA Status
        </h3>
        <div className="flex flex-col gap-0.5">
          <FilterItem
            label="All"
            count={ndaCounts.all || 0}
            active={filters.ndaStatus === "all"}
            onClick={() => onFilterChange({ ndaStatus: "all" })}
          />
          <FilterItem
            label="✓ Signed"
            count={ndaCounts.Signed || 0}
            active={filters.ndaStatus === "Signed"}
            onClick={() => onFilterChange({ ndaStatus: "Signed" })}
          />
          <FilterItem
            label="⟳ Pending"
            count={ndaCounts.Pending || 0}
            active={filters.ndaStatus === "Pending"}
            onClick={() => onFilterChange({ ndaStatus: "Pending" })}
          />
          <FilterItem
            label="— None"
            count={ndaCounts.None || 0}
            active={filters.ndaStatus === "None"}
            onClick={() => onFilterChange({ ndaStatus: "None" })}
          />
        </div>
      </div>

      {/* Due Date Filters */}
      <div className="p-4 border-b border-[var(--border)]">
        <h3 className="text-[9px] uppercase tracking-[2px] text-[var(--text3)] mb-2.5">
          Due Date
        </h3>
        <div className="flex flex-col gap-0.5">
          <FilterItem
            label="All"
            active={filters.dueFilter === "all"}
            onClick={() => onFilterChange({ dueFilter: "all" as DueFilter })}
          />
          <FilterItem
            label="⚠ Overdue"
            active={filters.dueFilter === "overdue"}
            onClick={() => onFilterChange({ dueFilter: "overdue" })}
            labelColor="#ff5f5f"
          />
          <FilterItem
            label="◉ Today"
            active={filters.dueFilter === "today"}
            onClick={() => onFilterChange({ dueFilter: "today" })}
            labelColor="#f5a623"
          />
          <FilterItem
            label="◎ This Week"
            active={filters.dueFilter === "week"}
            onClick={() => onFilterChange({ dueFilter: "week" })}
            labelColor="#2dd882"
          />
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-4 flex-1 border-b-0">
        <h3 className="text-[9px] uppercase tracking-[2px] text-[var(--text3)] mb-2.5">
          Keyboard Shortcuts
        </h3>
        <div className="text-[11px] text-[var(--text3)] leading-7 px-2">
          <div className="flex justify-between">
            <span>Cmd/Ctrl + K</span>
            <span>Search</span>
          </div>
          <div className="flex justify-between">
            <span>N</span>
            <span>New company</span>
          </div>
          <div className="flex justify-between">
            <span>ESC</span>
            <span>Close</span>
          </div>
          <div className="flex justify-between">
            <span>?</span>
            <span>Help</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ============================================
// Filter Item Component
// ============================================

interface FilterItemProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  dot?: string;
  labelColor?: string;
}

function FilterItem({ label, count, active, onClick, dot, labelColor }: FilterItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-between px-2.5 py-1.5 rounded text-[12px] transition-all
        ${active ? "bg-emerald-100 text-emerald-900" : "text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"}
      `}
    >
      <span className="flex items-center gap-2">
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
        )}
        <span style={{ color: !active && labelColor ? labelColor : undefined }}>{label}</span>
      </span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            active ? "bg-emerald-200 text-emerald-900" : "bg-[var(--surface2)] text-[var(--text3)]"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
