import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import { PipelineStats } from "../types";

// ============================================
// CRM Stats Hook
// ============================================

interface UseCrmStatsReturn {
  stats: PipelineStats | undefined;
  isLoading: boolean;
  stageData: { name: string; count: number; color: string }[];
  ndaData: { name: string; count: number; color: string }[];
}

export function useCrmStats(): UseCrmStatsReturn {
  // Query stats from Convex
  const stats = useQuery(api.crmCompanies.getStats, {});

  // Process stage data for charts
  const stageData = useMemo(() => {
    if (!stats?.stageDistribution) return [];

    const stageColors: Record<string, string> = {
      "First contact": "#4d9eff",
      "Intro call": "#a78bfa",
      "NDA sent": "#f5a623",
      Feasibility: "#2dd882",
      "Term sheet": "#00d4aa",
      "LOI signed": "#a3e635",
      Closed: "#e2e8f0",
      "On hold": "#94a3b8",
      Dead: "#ff5f5f",
    };

    return Object.entries(stats.stageDistribution)
      .map(([name, count]) => ({
        name,
        count,
        color: stageColors[name] || "#94a3b8",
      }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [stats?.stageDistribution]);

  // Process NDA data for charts
  const ndaData = useMemo(() => {
    if (!stats?.ndaDistribution) return [];

    return [
      { name: "Signed", count: stats.ndaDistribution.Signed, color: "#2dd882" },
      { name: "Pending", count: stats.ndaDistribution.Pending, color: "#f5a623" },
      { name: "None", count: stats.ndaDistribution.None, color: "#94a3b8" },
    ].filter((d) => d.count > 0);
  }, [stats?.ndaDistribution]);

  return {
    stats: stats || undefined,
    isLoading: stats === undefined,
    stageData,
    ndaData,
  };
}
