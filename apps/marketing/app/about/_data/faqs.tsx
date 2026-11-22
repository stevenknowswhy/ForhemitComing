import { FAQ } from "@/types";

// The ruled For Owners question set (also carried on the Business Owners page).
export const aboutFaqs: FAQ[] = [
  {
    question: "Do I have to sell 100% of the company?",
    answer: (
      <p>
        Yes — a Forhemit transition is a 100% sale to your employees through an ESOP. If a partial
        sale would fit you better, we&apos;ll say so honestly and point you to advisors who do
        that work.
      </p>
    ),
  },
  {
    question: "How is the price for my company set?",
    answer: (
      <p>
        By an independent, qualified appraiser — never by Forhemit, and never by the owner alone.
        The ESOP&apos;s independent trustee must conclude the price is no more than fair market
        value, and the valuation has to be defensible to the IRS, the Department of Labor, and
        your family.
      </p>
    ),
  },
  {
    question: "What is the Section 1042 deferral, in plain terms?",
    answer: (
      <p>
        If your company is a C corporation and the ESOP owns at least 30% after the sale, federal
        law may let you defer the capital-gains tax on the sale — potentially indefinitely — by
        reinvesting the proceeds in qualified replacement property within the legal window. It is
        a deferral, not forgiveness, and your own tax advisor confirms how it applies to you.
      </p>
    ),
  },
  {
    question: "Am I personally guaranteeing anything?",
    answer: (
      <p>
        Our standard is no personal guarantees &mdash; a term sheet demanding one is flagged as off-standard. The financing rests on the business itself and its future earnings.
      </p>
    ),
  },
  {
    question: "What do my employees actually receive?",
    answer: (
      <p>
        Shares in the ESOP trust, allocated to their individual accounts over time, on top of
        their regular pay. There is no buy-in and no personal debt for them; the value of their
        accounts grows as the acquisition financing is repaid.
      </p>
    ),
  },
];
