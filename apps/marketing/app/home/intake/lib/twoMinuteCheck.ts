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
    question: "Does your company have 20 or more employees?",
    fix: "A team of 20 or more — the ownership and trustee structure needs a broader base.",
  },
  {
    id: "profitability",
    question: "Is your company profitable?",
    fix: "Consistent profitability — the acquisition is financed from the company's future earnings.",
  },
  {
    id: "timeline",
    question: "Can you allow four months for the transition to be structured and closed?",
    fix: "A four-month runway — a compliant, well-financed close cannot be rushed into 30 days.",
  },
  {
    id: "transition",
    question: "Are you willing to stay involved for at least 12 months after closing to support the handoff?",
    fix: "Your commitment to stay at least 12 months after closing — your endorsement carries the transition.",
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
