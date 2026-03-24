export const NDA_TEXT = `
<p><strong>MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT</strong></p>
<p>This Mutual Non-Disclosure Agreement ("Agreement") is entered into between Forhemit Stewardship Management Co., a California Public Benefit Corporation ("Forhemit"), and the business owner identified below ("Owner"), collectively the "Parties."</p>
<p><strong>1. Purpose.</strong> The Parties wish to explore a potential ESOP transaction, management services, or succession planning engagement (the "Purpose"). In connection with the Purpose, each Party may disclose certain confidential and proprietary information to the other Party.</p>
<p><strong>2. Definition of Confidential Information.</strong> "Confidential Information" means any non-public information disclosed by either Party to the other, either directly or indirectly, in writing, orally, or by inspection of tangible objects, including but not limited to: financial statements, business plans, customer lists, employee information, valuation data, deal structures, and operational details.</p>
<p><strong>3. Obligations.</strong> Each Party agrees to: (a) hold the other Party's Confidential Information in strict confidence; (b) use the Confidential Information solely for the Purpose; (c) not disclose the Confidential Information to any third party without the prior written consent of the disclosing Party, except to its own employees, advisors, or agents with a need to know who are bound by equivalent confidentiality obligations.</p>
<p><strong>4. Exclusions.</strong> Obligations do not apply to information that: (a) is or becomes publicly available through no breach of this Agreement; (b) was rightfully known to the receiving Party prior to disclosure; (c) is rightfully received from a third party without restriction; or (d) is required to be disclosed by law or court order.</p>
<p><strong>5. Term.</strong> This Agreement shall remain in effect for three (3) years from the date of execution, or until a formal engagement agreement supersedes it.</p>
<p><strong>6. No Obligation.</strong> This Agreement does not obligate either Party to proceed with any transaction or business relationship.</p>
<p><strong>7. Governing Law.</strong> This Agreement shall be governed by the laws of the State of Florida for matters arising in Florida, and California for all other matters.</p>
`;

export interface IntakeStep {
  id: string;
  label: string;
}

export const NON_NDA_STEPS: IntakeStep[] = [
  { id: "contact", label: "Let's start with you" },
  { id: "business", label: "Tell us about the business" },
  { id: "done", label: "" },
];

export const NDA_STEPS: IntakeStep[] = [
  { id: "path", label: "" },
  { id: "nda", label: "A quick confidentiality agreement" },
  { id: "contact", label: "Let's start with you" },
  { id: "business", label: "Tell us about the business" },
  { id: "financials", label: "Financial snapshot" },
  { id: "situation", label: "Your situation" },
  { id: "done", label: "" },
];

export const EBITDA_LABELS = [
  "< $500K",
  "$500K–$1M",
  "$1M–$2M",
  "$2M–$3M",
  "$3M–$5M",
  "$5M–$10M",
  "$10M+",
];

export const TIMELINE_OPTS = [
  { value: "asap", label: "As soon as possible", sub: "Exploring options actively" },
  { value: "1yr", label: "Within 12 months", sub: "Planning ahead, not rushed" },
  { value: "2yr", label: "1–3 years out", sub: "Early-stage thinking" },
  { value: "exploring", label: "Just exploring", sub: "No specific timeline yet" },
];

export const INDUSTRY_OPTS = [
  "Medical / Healthcare",
  "Dental",
  "Veterinary",
  "Engineering / Architecture",
  "Legal / Accounting",
  "Technology / SaaS",
  "Manufacturing",
  "Construction / Trades",
  "Food & Beverage",
  "Other",
];

export const STATE_OPTS = [
  "Florida",
  "Texas",
  "Tennessee",
  "Georgia",
  "North Carolina",
  "Arizona",
  "Nevada",
  "Colorado",
  "Other",
];

export const EMPLOYEE_RANGES = ["5–19", "20–49", "50–99", "100+"];

export const YEAR_RANGES = ["3–5 years", "6–10 years", "11–20 years", "20+ years"];

export const ENTITY_TYPES = [
  { value: "C-Corporation", sub: "Best position for §1042 tax exclusion" },
  { value: "S-Corporation", sub: "Conversion to C-corp may be required" },
  { value: "LLC", sub: undefined },
  { value: "Partnership", sub: undefined },
  { value: "Not sure", sub: undefined },
];

export const ROLE_OPTS = [
  { value: "owner-sole", label: "Sole owner" },
  { value: "owner-partner", label: "Partner / co-owner" },
  { value: "advisor", label: "Advisor acting on behalf of owner" },
];
