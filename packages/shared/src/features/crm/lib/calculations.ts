import { Company, PipelineStats } from "../types";
import { daysUntil } from "./formatters";

// ============================================
// Pipeline Statistics
// ============================================

/**
 * Calculate pipeline statistics from companies
 */
export function calculateStats(companies: Company[]): PipelineStats {
  const total = companies.length;

  const active = companies.filter(
    (c) => !["Closed", "Dead", "On hold"].includes(c.stage)
  ).length;

  const closed = companies.filter((c) => c.stage === "Closed").length;
  const ndaSigned = companies.filter((c) => c.ndaStatus === "Signed").length;

  // Calculate overdue tasks
  const today = new Date().toISOString().split("T")[0];
  const overdue = companies.filter(
    (c) => c.nextStepDate && c.nextStepDate < today
  ).length;

  // Calculate due this week
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];
  const thisWeek = companies.filter((c) => {
    if (!c.nextStepDate) return false;
    return c.nextStepDate >= today && c.nextStepDate <= nextWeekStr;
  }).length;

  // Stage distribution
  const stageDistribution: Record<string, number> = {};
  companies.forEach((c) => {
    stageDistribution[c.stage] = (stageDistribution[c.stage] || 0) + 1;
  });

  // NDA distribution
  const ndaDistribution = {
    Signed: companies.filter((c) => c.ndaStatus === "Signed").length,
    Pending: companies.filter((c) => c.ndaStatus === "Pending").length,
    None: companies.filter((c) => c.ndaStatus === "None").length,
  };

  // Win rate calculation
  const totalFinished = closed + companies.filter((c) => c.stage === "Dead").length;
  const winRate = totalFinished > 0 ? Math.round((closed / totalFinished) * 100) : 0;

  return {
    total,
    active,
    closed,
    ndaSigned,
    overdue,
    thisWeek,
    stageDistribution,
    ndaDistribution,
    winRate,
  };
}

// ============================================
// Stage Metrics
// ============================================

/**
 * Calculate conversion metrics between stages
 */
export function calculateConversionMetrics(companies: Company[]) {
  const stages = [
    "First contact",
    "Intro call",
    "NDA sent",
    "Feasibility",
    "Term sheet",
    "LOI signed",
    "Closed",
  ];

  const stageCounts = stages.map((stage) => ({
    stage,
    count: companies.filter((c) => c.stage === stage).length,
  }));

  // Calculate conversion rates
  const conversions: { from: string; to: string; rate: number }[] = [];

  for (let i = 0; i < stageCounts.length - 1; i++) {
    const current = stageCounts[i];
    const next = stageCounts[i + 1];

    const rate = current.count > 0 ? Math.round((next.count / current.count) * 100) : 0;

    conversions.push({
      from: current.stage,
      to: next.stage,
      rate,
    });
  }

  return {
    stageCounts,
    conversions,
  };
}

// ============================================
// Time-Based Metrics
// ============================================

/**
 * Calculate average days in each stage
 */
export function calculateAvgDaysInStage(companies: Company[]) {
  // This is a simplified calculation
  // In a real implementation, you'd track stage entry/exit dates
  const stageDays: Record<string, number[]> = {};

  companies.forEach((company) => {
    if (company.lastContactDate && company.createdAt) {
      const created = new Date(company.createdAt);
      const lastContact = new Date(company.lastContactDate);
      const days = Math.round((lastContact.getTime() - created.getTime()) / 86400000);

      if (!stageDays[company.stage]) {
        stageDays[company.stage] = [];
      }
      stageDays[company.stage].push(days);
    }
  });

  const averages: Record<string, number> = {};
  Object.entries(stageDays).forEach(([stage, days]) => {
    averages[stage] = Math.round(days.reduce((a, b) => a + b, 0) / days.length);
  });

  return averages;
}

// ============================================
// Activity Metrics
// ============================================

/**
 * Calculate activity frequency metrics
 */
export function calculateActivityMetrics(companies: Company[]) {
  const withActivity = companies.filter((c) => c.lastContactDate).length;
  const withoutActivity = companies.length - withActivity;

  const activityByMonth: Record<string, number> = {};

  companies.forEach((company) => {
    if (company.lastContactDate) {
      const month = company.lastContactDate.substring(0, 7); // YYYY-MM
      activityByMonth[month] = (activityByMonth[month] || 0) + 1;
    }
  });

  return {
    withActivity,
    withoutActivity,
    activityByMonth,
  };
}

// ============================================
// Priority Scoring
// ============================================

/**
 * Calculate priority score for a company
 * Higher score = higher priority
 */
export function calculatePriorityScore(company: Company): number {
  let score = 0;

  // Stage weight (later stages = higher priority)
  const stageWeights: Record<string, number> = {
    "First contact": 1,
    "Intro call": 2,
    "NDA sent": 3,
    Feasibility: 5,
    "Term sheet": 8,
    "LOI signed": 10,
    Closed: 0,
    "On hold": 1,
    Dead: 0,
  };
  score += stageWeights[company.stage] || 1;

  // Due date weight
  const days = daysUntil(company.nextStepDate);
  if (days !== null) {
    if (days < 0) score += 15; // Overdue
    else if (days === 0) score += 10; // Due today
    else if (days <= 3) score += 8; // Due soon
    else if (days <= 7) score += 5; // Due this week
  }

  // NDA status weight
  if (company.ndaStatus === "Signed") score += 3;
  else if (company.ndaStatus === "Pending") score += 2;

  return score;
}

/**
 * Sort companies by priority score
 */
export function sortByPriority(companies: Company[]): Company[] {
  return [...companies].sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);
    return scoreB - scoreA; // Descending
  });
}
