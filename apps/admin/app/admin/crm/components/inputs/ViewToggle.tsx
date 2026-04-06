"use client";

import { LayoutGrid, Table2, Calendar, BarChart3 } from "lucide-react";
import { CrmView } from "../../types";

// ============================================
// View Toggle Component
// ============================================

interface ViewToggleProps {
  currentView: CrmView;
  onChange: (view: CrmView) => void;
}

const VIEWS: { id: CrmView; label: string; icon: typeof Table2 }[] = [
  { id: "table", label: "List", icon: Table2 },
  { id: "kanban", label: "Pipeline", icon: LayoutGrid },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function ViewToggle({ currentView, onChange }: ViewToggleProps) {
  return (
    <div className="flex flex-nowrap bg-[var(--surface2)] border border-[var(--border)] rounded-md p-0.5 max-[375px]:p-px w-max max-w-full">
      {VIEWS.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.id;

        return (
          <button
            key={view.id}
            onClick={() => onChange(view.id)}
            className={`
              flex items-center gap-1.5 max-[375px]:gap-1 px-2.5 max-[375px]:px-2 sm:px-3 py-1.5 max-[375px]:py-1 rounded text-[11px] max-[375px]:text-[10px] font-mono shrink-0
              transition-all min-h-[36px] max-[375px]:min-h-[32px]
              ${
                isActive
                  ? "bg-emerald-100 text-emerald-900 shadow-sm"
                  : "text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
              }
            `}
          >
            <Icon size={12} className="shrink-0" />
            {view.label}
          </button>
        );
      })}
    </div>
  );
}
