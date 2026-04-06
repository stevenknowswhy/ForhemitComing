"use client";

import { PipelineStats, STAGE_STYLES } from "../../types";

// ============================================
// Analytics View Component
// ============================================

interface AnalyticsViewProps {
  stats: PipelineStats | undefined;
}

export function AnalyticsView({ stats }: AnalyticsViewProps) {
  if (!stats) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg)]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 animate-pulse h-[300px]"
            />
          ))}
        </div>
      </div>
    );
  }

  // Prepare stage data for chart
  const stageData = Object.entries(stats.stageDistribution)
    .map(([name, count]) => ({
      name,
      count,
      color: STAGE_STYLES[name as keyof typeof STAGE_STYLES]?.color || "#94a3b8",
    }))
    .filter((s) => s.count > 0);

  const maxStageCount = Math.max(...stageData.map((s) => s.count), 1);

  // Prepare NDA data
  const ndaData = [
    { name: "Signed", count: stats.ndaDistribution.Signed, color: "#2dd882" },
    { name: "Pending", count: stats.ndaDistribution.Pending, color: "#f5a623" },
    { name: "None", count: stats.ndaDistribution.None, color: "#94a3b8" },
  ].filter((d) => d.count > 0);

  const maxNdaCount = Math.max(...ndaData.map((d) => d.count), 1);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg)]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Pipeline Distribution */}
        <ChartCard title="Pipeline Distribution">
          <div className="flex flex-col gap-3">
            {stageData.map((stage) => (
              <BarRow
                key={stage.name}
                label={stage.name}
                value={stage.count}
                max={maxStageCount}
                color={stage.color}
              />
            ))}
          </div>
        </ChartCard>

        {/* NDA Status */}
        <ChartCard title="NDA Status Overview">
          <div className="flex flex-col gap-3">
            {ndaData.map((nda) => (
              <BarRow
                key={nda.name}
                label={nda.name}
                value={nda.count}
                max={maxNdaCount}
                color={nda.color}
              />
            ))}
          </div>
        </ChartCard>

        {/* Conversion Metrics */}
        <ChartCard title="Conversion Metrics">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <MetricCard value={`${stats.winRate}%`} label="Win Rate" color="#2dd882" />
            <MetricCard value={stats.active} label="Active Deals" color="#4d9eff" />
            <MetricCard value={stats.thisWeek} label="Due This Week" color="#f5a623" />
            <MetricCard value={stats.overdue} label="Overdue" color="#ff5f5f" />
          </div>
        </ChartCard>

        {/* Stage Distribution Summary */}
        <ChartCard title="Stage Breakdown" className="md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {stageData.map((stage) => (
              <div
                key={stage.name}
                className="text-center p-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg"
              >
                <div
                  className="text-2xl font-semibold font-serif"
                  style={{ color: stage.color }}
                >
                  {stage.count}
                </div>
                <div className="text-[11px] text-[var(--text3)] mt-1">{stage.name}</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

// ============================================
// Chart Card Component
// ============================================

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function ChartCard({ title, children, className = "" }: ChartCardProps) {
  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 ${className}`}
    >
      <h3 className="text-[11px] uppercase tracking-[1.5px] text-[var(--text3)] mb-5">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ============================================
// Bar Row Component
// ============================================

interface BarRowProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

function BarRow({ label, value, max, color }: BarRowProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-right text-[11px] text-[var(--text2)] truncate">{label}</div>
      <div className="flex-1 h-6 bg-[var(--bg)] rounded overflow-hidden">
        <div
          className="h-full rounded flex items-center justify-end pr-2 text-[10px] font-medium transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: `${color}20`,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          {value > 0 && value}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Metric Card Component
// ============================================

interface MetricCardProps {
  value: string | number;
  label: string;
  color: string;
}

function MetricCard({ value, label, color }: MetricCardProps) {
  return (
    <div className="text-center p-5 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
      <div className="text-3xl font-semibold font-serif" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] text-[var(--text3)] mt-1">{label}</div>
    </div>
  );
}
