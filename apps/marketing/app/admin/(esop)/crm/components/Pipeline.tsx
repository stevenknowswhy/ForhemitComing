"use client";

// Pipeline (OD-13 D4) — the kanban view.
//
// HTML5 drag-and-drop moves opportunities between stage columns; the drop
// handler calls the optimistic moveOpportunity from useCrm, so the card jumps
// columns immediately and rolls back on failure. A keyboard-accessible stage
// select on each card is the a11y fallback (mirrors the detail panel's move).

import { useState } from "react";
import {
  STAGE_META,
  STAGE_ORDER,
  displayName,
  formatAmount,
  sourceLabel,
} from "@forhemit/shared/features/crm/records";
import type {
  Opportunity,
  OpportunityStage,
} from "@forhemit/shared/features/crm/records";

interface PipelineProps {
  groups: Record<OpportunityStage, Opportunity[]>;
  onSelect: (record: Opportunity) => void;
  onMove: (id: string, stage: OpportunityStage) => Promise<boolean>;
}

export function Pipeline({ groups, onSelect, onMove }: PipelineProps) {
  const [dragOverStage, setDragOverStage] = useState<OpportunityStage | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (stage: OpportunityStage) => {
    setDragOverStage(null);
    setDraggedId(null);
    if (!draggedId) return;
    void onMove(draggedId, stage);
  };

  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">
        Drag a card to a new column to change its stage — or open it and pick a
        stage there.
      </p>
      <div className="flex gap-3 overflow-x-auto pb-3">
        {STAGE_ORDER.map((stage) => {
          const stageRecords = groups[stage];
          const isOver = dragOverStage === stage;
          return (
            <div
              key={stage}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverStage(stage);
              }}
              onDragLeave={(event) => {
                if (event.currentTarget.contains(event.relatedTarget as Node)) return;
                setDragOverStage((current) => (current === stage ? null : current));
              }}
              onDrop={() => handleDrop(stage)}
              aria-label={`${STAGE_META[stage].label} column`}
              className={`min-w-[220px] max-w-[220px] shrink-0 rounded-xl border p-3 transition-colors ${
                isOver
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">
                  {STAGE_META[stage].label}
                </span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {stageRecords.length}
                </span>
              </div>

              <div className="space-y-2">
                {stageRecords.map((record) => (
                  <div
                    key={record.id}
                    role="button"
                    tabIndex={0}
                    draggable
                    onDragStart={() => setDraggedId(record.id)}
                    onDragEnd={() => {
                      setDraggedId(null);
                      setDragOverStage(null);
                    }}
                    onClick={() => onSelect(record)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(record);
                      }
                    }}
                    className={`cursor-pointer rounded-lg border bg-card p-2.5 transition-all hover:shadow-sm focus-visible:outline-2 focus-visible:outline-primary ${
                      draggedId === record.id ? "opacity-50" : "border-border"
                    }`}
                  >
                    <div className="mb-0.5 flex items-start justify-between gap-1">
                      <span className="text-xs font-semibold text-foreground">
                        {displayName(record)}
                      </span>
                      {record.source === "twenty" && (
                        <span className="shrink-0 rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-medium text-violet-700">
                          {sourceLabel(record)}
                        </span>
                      )}
                    </div>
                    <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{formatAmount(record.amount)}</span>
                    </div>
                    {/* Keyboard/AT fallback for the drag interaction. */}
                    <label className="sr-only" htmlFor={`stage-${record.id}`}>
                      Change stage for {displayName(record)}
                    </label>
                    <select
                      id={`stage-${record.id}`}
                      value={record.stage}
                      onChange={(event) =>
                        void onMove(record.id, event.target.value as OpportunityStage)
                      }
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                      className="h-9 w-full rounded border border-border bg-card px-1 text-[11px] text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {STAGE_ORDER.map((option) => (
                        <option key={option} value={option}>
                          {STAGE_META[option].label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                {stageRecords.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border py-4 text-center text-[11px] text-muted-foreground">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
