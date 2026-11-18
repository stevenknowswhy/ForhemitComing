export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  eyebrow: string;
  items: FAQItem[];
}

export const faqSections: FAQSection[] = [
  {
    title: "For Business Owners & Founders",
    eyebrow: "Selling Your Business",
    items: [
      {
        question: "Do I have to sell 100% of the company?",
        answer:
          "Forhemit's model is a 100% transition — the full company moves into employee ownership. That completeness is what unlocks the strongest tax treatment, the cleanest financing, and an unambiguous new chapter for the business. If a partial sale fits you better, we will tell you honestly and point you to advisors who do that work.",
      },
      {
        question: "How is the price for my company set?",
        answer:
          "By an independent, qualified appraiser engaged for the transaction — never by Forhemit and never by you alone. The trustee reviews the valuation on behalf of employees and must conclude the price is no more than fair market value. That independence protects you as much as it protects them: the price can be defended to the IRS, the DOL, and your own family.",
      },
      {
        question: "What is the Section 1042 deferral, in plain terms?",
        answer:
          "If your company is a C corporation and the ESOP ends up owning at least 30% of the company, Section 1042 of the tax code lets you defer the capital-gains tax on the sale — potentially indefinitely — by reinvesting the proceeds in qualified replacement property. On a lifetime's worth of gains, that deferral can be worth more than a nominally higher offer from a taxable buyer. Your tax advisor confirms how it applies to you; we structure the deal so it can.",
      },
      {
        question: "Am I personally guaranteeing anything?",
        answer:
          "No. Sellers in a Forhemit transition do not put personal guarantees or personal assets at risk to finance the sale. Financing is carried by the transaction structure and the company's future earnings — that is precisely why the business must be profitable and of sufficient scale to qualify.",
      },
      {
        question: "What do my employees actually receive?",
        answer:
          "Shares in the company, held in the ESOP trust and allocated to their individual accounts over time, on top of their regular pay. They do not buy in and they do not take on the company's debts. As the company performs and the acquisition financing is repaid, the value of what they hold grows — which is the point: the people doing the work share in what the work creates.",
      },
      {
        question: "What does Forhemit charge?",
        answer:
          "Total transition fees typically run 3–5% of valuation — one figure, covering the whole transition, set in writing before you sign anything.",
      },
    ],
  },
  {
    title: "For Brokers",
    eyebrow: "Introductions",
    items: [
      {
        question: "How long does the process take?",
        answer:
          "About four months from first review to the closing table — against the 12 to 18 months a traditional sale process commonly runs, when it closes at all. What can stretch it is readiness: the work in Month 1 exists to surface that early, not at the closing table.",
      },
      {
        question: "What if my client doesn't qualify?",
        answer:
          "You hear it fast, with the reasons — in terms you can take back to your client, along with what would have to change. The standard we screen against is published on our Brokers page, so there are no surprises in either direction.",
      },
      {
        question: "What does an introduction earn me?",
        answer:
          "We are asked, fairly, what a broker gets for an introduction. We do not receive any money or anything else of value — monetary or non-monetary — from any of our professional partners. We do not pay referral fees or anything else of value for introductions, and we do not promise reciprocal referrals. What we offer is a clean handoff, a founder who actually transacts, and a broker who is kept informed at every phase.",
      },
      {
        question: "Do you work with my client's existing deal team?",
        answer:
          "Yes — alongside them, never instead of them. The founder's attorney, CPA, and wealth manager stay in their roles; we coordinate the transition work with them and keep you informed at every phase, with your client's authorisation.",
      },
    ],
  },
  {
    title: "For Attorneys, CPAs & Wealth Managers",
    eyebrow: "Advisors",
    items: [
      {
        question: "What does our firm get for an introduction?",
        answer:
          "We are asked, fairly, what a partner gets for an introduction. We do not receive any money or anything else of value — monetary or non-monetary — from any of our professional partners. We do not pay referral fees or anything else of value for introductions, and we do not promise reciprocal referrals. What we offer is a clean handoff, a client who stays yours, and a partner who is kept informed at every phase.",
      },
      {
        question: "Is Forhemit a law firm? Do you compete with us?",
        answer:
          "No. Forhemit is not a law firm, provides no legal services, and enters into no referral-fee or fee-splitting arrangements. You stay counsel of record; we coordinate the transition around your counsel, never instead of it. We coordinate — never replace — the legal work of an ESOP transition: plan and trust documents with ERISA counsel, transaction documents, and the compliance calendar for DOL and IRS requirements.",
      },
      {
        question: "How quickly will we know whether a client fits?",
        answer:
          "Fast. If a business you send us is not a fit, we say so quickly and say why, in terms you can take back to your client, along with what would have to change. The standard we screen against is published on our Attorneys page.",
      },
      {
        question: "What does our client pay?",
        answer:
          "One transition fee: total transition fees typically run 3 to 5% of the valuation, agreed in advance. The full breakdown is on our How It Works page, so you can answer your client's question before they ever talk to us.",
      },
      {
        question: "What does an introduction earn me?",
        answer:
          "Nothing between firms. There are no referral fees or compensation arrangements for introductions. We do not receive any money or anything else of value — monetary or non-monetary — from any of our professional partners. We do not pay referral fees or anything else of value for introductions, and we do not promise reciprocal referrals. What we offer is a clean handoff, a client who stays yours, and a partner who is kept informed at every phase.",
      },
      {
        question: "Do you manage assets, or compete for my client?",
        answer:
          "No. Forhemit does not manage assets, and does not provide investment, legal, tax, or accounting advice: we do not compete for the relationship you built, and we do not solicit it. The wealth relationship continues through the transition and beyond it — with you.",
      },
      {
        question: "What is Section 1042, in one paragraph?",
        answer:
          "Where Section 1042 applies, a qualifying sale into employee ownership can provide tax-deferred treatment for the seller's gain — deferral, not forgiveness, and never automatic. The deferral is not forgiveness: the deferred gain reduces the seller's basis in the qualified replacement property, and tax comes due when that property is sold. Eligibility itself stays where it belongs: with you and your client's tax and legal professionals. Forhemit coordinates; it does not give tax advice.",
      },
      {
        question: "Which of my clients fit?",
        answer:
          "The standard we screen against is published on our Wealth Managers page: profitable and founder-led, $3M or more in revenue, 20 or more verifiable U.S. employees, an owner holding 51% or more who can allow about four months and be available on call for 4 to 12 months after close. If a client of yours clears this standard, a first conversation costs nothing and commits no one. If they don't, we will tell you quickly — and tell you what would have to change.",
      },
    ],
  },
];
