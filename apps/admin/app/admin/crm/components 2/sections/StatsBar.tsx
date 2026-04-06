"use client";

import { PipelineStats, DueFilter } from "../../types";
import { StatsCard } from "../shared";

// ============================================
// Stats Bar Component
// ============================================

interface StatsBarProps {
  stats: PipelineStats | undefined;
  activeDueFilter: DueFilter;
  onFilterChange: (filter: DueFilter) => void;
}

export function StatsBar({ stats, activeDueFilter, onFilterChange }: StatsBarProps) {
  if (!stats) {
    return (
      <div className="flex border-b border-[var(--border)] bg-[var(--surface2)] h-[72px]">
        <div className="flex-1 animate-pulse bg-[var(--surface3)] m-2 rounded" />
        <div className="flex-1 animate-pulse bg-[var(--surface3)] m-2 rounded" />
        <div className="flex-1 animate-pulse bg-[var(--surface3)] m-2 rounded" />
        <div className="flex-1 animate-pulse bg-[var(--surface3)] m-2 rounded" />
        <div className="flex-1 animate-pulse bg-[var(--surface3)] m-2 rounded" />
      </div>
    );
  }

  return (
    <div className="flex border-b border-[var(--border)] bg-[var(--surface2)] overflow-x-auto scrollbar-hide">
      <StatsCard
        label="Total Pipeline"
        value={stats.total}
        subtitle={`${stats.active} active engagements`}
        color="#2dd882"
        active={activeDueFilter === "all"}
        onClick={() => onFilterChange("all")}
      />
      <StatsCard
        label="Overdue Tasks"
        value={stats.overdue}
        subtitle="require immediate attention"
        color={stats.overdue > 0 ? "#ff5f5f" : "var(--text2)"}
        active={activeDueFilter === "overdue"}
        onClick={() => onFilterChange("overdue")}
      />
      <StatsCard
        label="Due This Week"
        value={stats.thisWeek}
        subtitle="upcoming deadlines"
        color="#f5a623"
        active={activeDueFilter === "week"}
        onClick={() => onFilterChange("week")}
      />
      <StatsCard
        label="NDA Signed"
        value={stats.ndaSigned}
        subtitle={`${Math.round((stats.ndaSigned / stats.total) * 100) || 0}% of pipeline`}
        color="#4d9eff"
      />
      <StatsCard
        label="Closed Deals"
        value={stats.closed}
        subtitle="won engagements"
        color="#e2e8f0"
      />
    </div>
  );
}
