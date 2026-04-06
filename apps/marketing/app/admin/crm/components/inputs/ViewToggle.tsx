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
    <div className="flex bg-[var(--bg)] border border-[var(--border)] rounded-md p-0.5">
      {VIEWS.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.id;

        return (
          <button
            key={view.id}
            onClick={() => onChange(view.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono
              transition-all
              ${
                isActive
                  ? "bg-[#0d4a2a] text-[#2dd882]"
                  : "text-[var(--text3)] hover:text-[var(--text)]"
              }
            `}
          >
            <Icon size={12} />
            {view.label}
          </button>
        );
      })}
    </div>
  );
}
