export type TwoMinuteCheckStepId =
  | "revenue"
  | "headcount"
  | "profitability"
  | "timeline"
  | "transition";

export type TwoMinuteCheckStep = {
  id: TwoMinuteCheckStepId;
  question: string;
  /**
   * Why this criterion exists. Shown under the question while answering
   * and, when the answer is "No", in the result's list of what would
   * need to change.
   */
  fix: string;
};

export const TWO_MINUTE_CHECK_STEPS: TwoMinuteCheckStep[] = [
  {
    id: "revenue",
    question: "Does your company generate $3M or more in annual revenue?",
    fix: "Revenue of $3M or more — the structure's fixed costs need that scale to pay off for you.",
  },
  {
    id: "headcount",
    question: "Does your company have 20 or more verifiable U.S. employees — people on U.S. payroll (W-2), not contractors or overseas staff?",
    fix: "A team of 20 or more verifiable U.S. employees (W-2 payroll, not contractors or overseas staff) — the ownership and trustee structure needs a broader base, and the count has to be documentable.",
  },
  {
    id: "profitability",
    question: "Has your company been profitable for 3 years or more?",
    fix: "Profitable for at least 3 years — the purchase is financed from the company's earnings, and lenders underwrite a track record, not a good year.",
  },
  {
    id: "timeline",
    question: "Can you allow 120 days for the transition to be structured and closed?",
    fix: "A 120-day runway — a compliant, well-financed close cannot be rushed into 30 days.",
  },
  {
    id: "transition",
    question: "After the sale closes, can you be available to the company for a transition period of 4 to 12 months — not working hands-on, but reachable for agreed check-ins, introductions, and questions as the new owners settle in?",
    fix: "Some availability after closing — 4 to 12 months on call for check-ins, introductions, and questions. Zero availability is the only fail: the new owners need a bridge to you, not your daily presence.",
  },
];

export function getFailedSteps(
  answers: Partial<Record<TwoMinuteCheckStepId, "yes" | "no">>
): TwoMinuteCheckStep[] {
  return TWO_MINUTE_CHECK_STEPS.filter((s) => answers[s.id] === "no");
}

export function allYes(answers: Partial<Record<TwoMinuteCheckStepId, "yes" | "no">>): boolean {
  return TWO_MINUTE_CHECK_STEPS.every((s) => answers[s.id] === "yes");
}
