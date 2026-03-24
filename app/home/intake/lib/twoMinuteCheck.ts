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
    noThresholdPhrase: "at least 20 employees (15 is an absolute minimum)",
  },
  {
    id: "profitability",
    question: "Does your business make steady profit every year—not just breaking even?",
    hint: "The business must afford loan payments to buy you out. If it's not profitable, banks won't finance it",
    noThresholdPhrase: "consistent annual profitability",
  },
  {
    id: "timeline",
    question: "Can you wait about 4 months to close the deal and get paid?",
    hint: 'Separates "I need cash this week" from "I\'m ready to sell." Filters out distressed liquidation',
    noThresholdPhrase: "about 4 months to close—not an emergency or same-week liquidity need",
  },
  {
    id: "transition",
    question: "Are you willing to stick around for at least 12 months after selling to help the new owners learn the ropes?",
    hint: "Banks and buyers require seller transition. If you want to disappear immediately, this doesn't work",
    noThresholdPhrase: "willingness to stay at least 12 months post-close to support transition",
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
