export type TwoMinuteCheckStepId =
  | "revenue"
  | "headcount"
  | "profitability"
  | "timeline"
  | "transition";

export type TwoMinuteCheckStep = {
  id: TwoMinuteCheckStepId;
  question: string;
  hint: string;
  /** Shown when this question is the first "No" in the flow */
  noThresholdPhrase: string;
};

export const TWO_MINUTE_CHECK_STEPS: TwoMinuteCheckStep[] = [
  {
    id: "revenue",
    question: "Does your business make at least $3 million per year?",
    hint: "Hard floor for the math to work—below this, closing costs eat the deal",
    noThresholdPhrase: "at least $3 million in annual revenue",
  },
  {
    id: "headcount",
    question: "Do you have at least 20 people working for you?",
    hint: "Need enough participants for the ownership structure; 15 is absolute minimum, 20 is safe",
    noThresholdPhrase: "at least about 20 employees for a viable ESOP bench",
  },
  {
    id: "profitability",
    question: "Does your business make steady profit for the past 3 years?",
    hint: "The business must afford loan payments to buy you out. If it's not profitable, banks won't finance it",
    noThresholdPhrase: "steady profit in each of the past 3 years",
  },
  {
    id: "timeline",
    question:
      "Can you wait at least 120 days to close and be paid fair market value for your business?",
    hint: 'Separates "I need cash this week" from "I\'m ready to sell." Filters out distressed liquidation',
    noThresholdPhrase:
      "at least 120 days to close and fair market value—not an emergency or same-week liquidity need",
  },
  {
    id: "transition",
    question:
      "Are you willing to offer guidance when needed for at least the first 12 months to help the business continue to succeed?",
    hint: "Lenders and employee-ownership transitions expect meaningful seller support early on. If you want zero involvement, this path is harder",
    noThresholdPhrase:
      "willingness to offer guidance when needed for at least the first 12 months post-close",
  },
];

export function getFirstNoStep(
  answers: Partial<Record<TwoMinuteCheckStepId, "yes" | "no">>
): TwoMinuteCheckStep | null {
  for (const step of TWO_MINUTE_CHECK_STEPS) {
    if (answers[step.id] === "no") return step;
  }
  return null;
}

export function allYes(answers: Partial<Record<TwoMinuteCheckStepId, "yes" | "no">>): boolean {
  return TWO_MINUTE_CHECK_STEPS.every((s) => answers[s.id] === "yes");
}
