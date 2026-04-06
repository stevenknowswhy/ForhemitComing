// ── ESOP DEAL FLOW SYSTEM CALCULATIONS ───────────────────────────────────────

import type { FeasibilityScores } from "../types";
import { SCORE_MAX, SCORE_MIN, TOTAL_MAX_SCORE, SCORE_THRESHOLDS } from "../constants";

// ═════════════════════════════════════════════════════════════════════════════
// SCORING CALCULATIONS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Calculate total feasibility score from individual criteria
 */
export function calculateTotalScore(scores: FeasibilityScores): number {
  const { ownerCommitment, financialViability, employeeEngagement, legalCompliance } = scores;
  
  const validScores = [
    ownerCommitment,
    financialViability,
    employeeEngagement,
    legalCompliance,
  ].filter((s) => s >= SCORE_MIN && s <= SCORE_MAX);
  
  if (validScores.length === 0) return 0;
  
  return validScores.reduce((sum, score) => sum + score, 0);
}

/**
 * Calculate score percentage (0-100)
 */
export function calculateScorePercentage(totalScore: number): number {
  return Math.round((totalScore / TOTAL_MAX_SCORE) * 100);
}

/**
 * Determine recommendation based on total score
 */
export function getScoreRecommendation(
  totalScore: number
): "proceed" | "conditional" | "pass" {
  if (totalScore >= SCORE_THRESHOLDS.proceed) return "proceed";
  if (totalScore >= SCORE_THRESHOLDS.conditional) return "conditional";
  return "pass";
}

/**
 * Get recommendation label for display
 */
export function getRecommendationLabel(
  recommendation: "proceed" | "conditional" | "pass"
): string {
  switch (recommendation) {
    case "proceed":
      return "Proceed to Due Diligence";
    case "conditional":
      return "Fix Issues First";
    case "pass":
      return "Pass / Consider Alternatives";
    default:
      return "Score Required";
  }
}

/**
 * Get color for score display
 */
export function getScoreColor(
  totalScore: number
): "success" | "warning" | "danger" {
  if (totalScore >= SCORE_THRESHOLDS.proceed) return "success";
  if (totalScore >= SCORE_THRESHOLDS.conditional) return "warning";
  return "danger";
}

// ═════════════════════════════════════════════════════════════════════════════
// PROGRESS CALCULATIONS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Calculate stage progress percentage
 */
export function calculateStageProgress(stage: number): number {
  switch (stage) {
    case 1:
      return 33;
    case 2:
      return 66;
    case 3:
      return 100;
    default:
      return 0;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Validate that a score is within acceptable range
 */
export function isValidScore(score: number): boolean {
  return score >= SCORE_MIN && score <= SCORE_MAX;
}

/**
 * Clamp score to valid range
 */
export function clampScore(score: number): number {
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, score));
}

// ═════════════════════════════════════════════════════════════════════════════
// FORMATTING HELPERS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Format score for display
 */
export function formatScore(totalScore: number): string {
  return `${totalScore} / ${TOTAL_MAX_SCORE}`;
}

/**
 * Get score bar color based on value
 */
export function getScoreBarGradient(score: number): string {
  if (score >= SCORE_THRESHOLDS.proceed) {
    return "linear-gradient(90deg, #27ae60, #2ecc71)";
  }
  if (score >= SCORE_THRESHOLDS.conditional) {
    return "linear-gradient(90deg, #f39c12, #f1c40f)";
  }
  return "linear-gradient(90deg, #e74c3c, #c0392b)";
}
