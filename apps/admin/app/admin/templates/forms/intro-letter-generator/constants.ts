/**
 * Introduction Letter Generator - Constants and Letter Templates
 */

import {
  LetterGeneratorInputs,
  RecipientOption,
  LetterTemplates,
} from "./types";

// ── Recipient Options ──────────────────────────────────────────────────────

export const RECIPIENT_OPTIONS: RecipientOption[] = [
  { value: "seller", label: "Sellers / Business Owners" },
  { value: "broker", label: "Business Brokers" },
  { value: "attorney", label: "Attorneys" },
  { value: "lender", label: "Lenders (SBA & Commercial)" },
  { value: "esop", label: "ESOP Administrators" },
  { value: "valuation", label: "Valuation Firms" },
  { value: "cpa", label: "CPAs" },
  { value: "wealth", label: "Wealth Advisors" },
  { value: "accountant", label: "Accountants" },
];

// ── Letter Templates ───────────────────────────────────────────────────────

export const LETTER_TEMPLATES: LetterTemplates = {
  seller: {
    subject: "A Trusted Partner for Your Business Transition",
    opening: `My name is {SENDER_NAME}, {SENDER_TITLE} at Forhemit. We are a stewardship management firm dedicated to one purpose: ensuring that when a business owner is ready to transition, that business — and the legacy it represents — is handled with care, discipline, and long-term vision.`,
    valueHeader: "Why Forhemit Is Different for You",
    value: [
      "We approach every engagement as stewards, not just advisors — protecting what you built while maximizing what you take forward",
      "We provide clarity through complexity: valuation, deal structure, buyer qualification, and post-close continuity — all coordinated under one roof",
      "We protect your employees, customers, and culture throughout the transition process",
      "You work directly with senior principals — no hand-offs to junior staff mid-process",
      "We have deep relationships with lenders, attorneys, and acquirers who respect our process and move efficiently",
    ],
    cta: `Whether you are actively exploring a sale, beginning to plan your exit, or simply want an honest conversation about your options, we would welcome the opportunity to sit down with you — no pressure, no obligation. A transition of this magnitude deserves the right guide. We believe Forhemit can be that for you.`,
  },
  broker: {
    subject: "A Collaborative Partnership with Forhemit",
    opening: `My name is {SENDER_NAME}, {SENDER_TITLE} at Forhemit, a stewardship management firm focused on business transitions, legacy continuity, and acquisition advisory. I am reaching out because we believe the strongest outcomes for sellers come when skilled professionals work in concert — and we would like to explore a collaborative relationship with you.`,
    valueHeader: "What We Bring to a Co-Advisory Relationship",
    value: [
      "We complement your origination and marketing strengths with deep operational due diligence and transition management",
      "Our lender and capital relationships accelerate buyer financing — keeping deals alive that might otherwise stall",
      "We assist with complex deal structures: earnouts, seller notes, ESOP alternatives, and management buyouts",
      "We do not compete with your listings — we add depth and credibility to transactions you are already running",
      "Referral arrangements available for introductions that result in closed engagements",
    ],
    cta: `We work with a select group of broker partners and take these relationships seriously. If you encounter a deal that could benefit from additional advisory depth — or a seller who needs transition planning before they are ready for market — we would be glad to be your call. Let's schedule a brief conversation to explore what this could look like.`,
  },
  attorney: {
    subject: "Forhemit — A Resource for Your Business Transition Clients",
    opening: `My name is {SENDER_NAME}, {SENDER_TITLE} at Forhemit, a stewardship management firm specializing in business transitions and ownership succession. I am writing to introduce our firm as a resource you can confidently refer clients to — and as a collaborative partner on transactions where our work intersects.`,
    valueHeader: "How We Work Alongside Counsel",
    value: [
      "We prepare clients thoroughly before they reach the negotiating table — reducing friction, surprises, and last-minute renegotiations",
      "We coordinate the financial, operational, and advisory workstreams so your legal work stays focused and efficient",
      "Our deal structures are documented with precision — we communicate in terms attorneys can work with directly",
      "We understand confidentiality, privilege, and timeline sensitivity — and we work accordingly",
      "We are a trusted referral source for business owners who need counsel before, during, and after a transaction",
    ],
    cta: `Many of your clients face ownership transitions without a clear roadmap — we provide that roadmap. If you have clients who are beginning to think about a sale, succession, or ownership restructuring, we would be honored to be on your referral list. I would welcome a brief introduction call at your convenience.`,
  },
  lender: {
    subject: "Forhemit — Bringing You Qualified, Structured Deals",
    opening: `My name is {SENDER_NAME}, {SENDER_TITLE} at Forhemit, a stewardship management firm that advises business owners through acquisitions, sales, and ownership transitions. I am reaching out to introduce our firm and explore a lender relationship built on well-prepared, thoroughly diligenced deal flow.`,
    valueHeader: "What You Can Expect From Our Referrals",
    value: [
      "Transactions that arrive fully packaged — CIMs, financials, valuation support, and deal rationale clearly documented",
      "Buyers who have been pre-qualified and educated on financing expectations before approaching your institution",
      "Deal structures designed with debt serviceability in mind — we model coverage ratios as part of our process",
      "SBA 7(a) and 504 familiarity — we understand your documentation requirements and timeline constraints",
      "Ongoing deal flow from our origination network across industries and transaction sizes",
    ],
    cta: `We want to be a lender's favorite source of referrals — because every deal we bring is ready for your review, not a work in progress. I would welcome the opportunity to learn more about your credit appetite and transaction preferences so we can direct the right opportunities your way. Let's connect.`,
  },
  esop: {
    subject: "Pre-Qualified ESOP Candidates — Reducing Friction in Your Fiduciary Process",
    opening: `As an ESOP trustee, you bear the ERISA fiduciary burden of determining that transactions are prudent for plan participants, ensuring fair market value is paid, and navigating the inherent conflict between selling shareholders seeking maximum price and the ESOP's duty to pay no more than adequate consideration. I am reaching out because Forhemit was built to serve as a fiduciary-minded filter in this ecosystem — ensuring that when a candidate reaches your desk, they arrive transaction-ready, valuation-realistic, and structurally sound.

My name is {SENDER_NAME}, {SENDER_TITLE} at Forhemit, a stewardship management firm specializing in ownership transitions. We identify and prepare ESOP candidates long before they engage your process — ensuring business owners understand cash flow sustainability requirements, repurchase obligation implications, and the technical constraints of Section 1042 elections before they ever request a valuation.`,
    valueHeader: "How We Protect Your Fiduciary Process",
    value: [
      "Feasibility-First Referrals: We conduct thorough feasibility analyses — examining debt service coverage, S-corp vs. C-corp implications, and repurchase obligation capacity — so you receive only viable, sustainable transaction candidates",
      "Valuation-Ready Financials: Our pre-transaction readiness work ensures sellers arrive with properly normalized financials and clean records, reducing your valuation firm's scrub time and producing more reliable initial appraisals for your review",
      "Fiduciary-Aligned Expectations: We prepare sellers on realistic valuation standards, Section 1042 eligibility (30% ownership threshold, 3-year holding period, 15-month QRP window), and the ESOP's limitations as an ERISA plan before you must have those difficult conversations",
      "Independent Trustee Respect: We maintain strict independence from valuation conclusions — we prepare businesses for scrutiny but never pressure appraisal outcomes, ensuring your fiduciary judgment regarding fair market value remains uncompromised",
      "Post-Close Governance Coordination: We assist with board composition planning and repurchase obligation modeling, supporting the ongoing circular relationship between you as the share-appointed fiduciary and the board you must monitor",
    ],
    cta: `ESOP transactions succeed when the seller is properly prepared and the advisory team is aligned. We act as your upstream quality control — ensuring that deals arriving at your desk are worth your time, meet baseline feasibility standards, and do not create unnecessary friction in your fiduciary determination process.

We would welcome the opportunity to learn more about your firm's specific criteria for qualified opportunities and explore how Forhemit can serve as a trusted source of pre-qualified, fiduciary-ready ESOP candidates. I look forward to connecting.`,
  },
  valuation: {
    subject: "Forhemit — A Consistent Source of Valuation Engagements",
    opening: `My name is {SENDER_NAME}, {SENDER_TITLE} at Forhemit, a stewardship management firm that guides business owners through ownership transitions and acquisitions. Quality valuation work is foundational to everything we do — and I am reaching out to explore a preferred partner relationship with your firm.`,
    valueHeader: "Why Valuation Firms Value Working With Forhemit",
    value: [
      "We provide consistent referral flow — owners at every stage of transition planning require credible, independent valuations",
      "Our clients arrive with clean financials and organized records — reducing your engagement time and improving deliverable quality",
      "We respect the independence of valuation work and never pressure conclusions — our clients need accurate numbers, not favorable ones",
      "We coordinate valuation timing within deal timelines so your work is used effectively, not shelved",
      "We are a trusted source of referrals for estate planning, gift tax, litigation support, and transaction purposes",
    ],
    cta: `We engage valuation professionals across a range of contexts — from early-stage exit planning to active deal support. If your firm is interested in becoming a preferred resource for our clients, I would welcome a conversation to understand your capabilities and engagement preferences. Let's connect.`,
  },
  cpa: {
    subject: "Forhemit — A Partner for Your Business-Owning Clients",
    opening: `My name is {SENDER_NAME}, {SENDER_TITLE} at Forhemit, a stewardship management firm specializing in business ownership transitions. CPAs are often the most trusted advisor in a business owner's life — and the first call when they begin thinking about an exit. I am writing to introduce Forhemit as a firm you can confidently bring into that conversation.`,
    valueHeader: "How We Serve Your Clients — and You",
    value: [
      "We handle the transaction advisory workstream so your focus stays on tax strategy and financial planning — not deal management",
      "We work closely with CPAs to structure transactions with maximum after-tax consideration for the seller",
      "Our pre-transaction readiness work often surfaces issues that inform proactive tax planning well before a sale",
      "We do not interfere with client relationships — we enhance them by delivering a smooth, professionally managed process",
      "Referral arrangements available for introductions that lead to closed engagements",
    ],
    cta: `Your clients trust you with their most significant financial decisions. When business transition comes up — and it will — we want to be the firm you feel confident recommending. Let's schedule a brief call to explore how Forhemit can become a natural extension of the service you already provide.`,
  },
  wealth: {
    subject: "Forhemit — Transition Advisory for Your HNW Business-Owner Clients",
    opening: `My name is {SENDER_NAME}, {SENDER_TITLE} at Forhemit, a stewardship management firm that advises business owners through ownership transitions and succession planning. For many of your high-net-worth clients, the business is their largest single asset — and its transition is the most consequential financial event of their lives. Forhemit exists to manage that event with the precision it deserves.`,
    valueHeader: "How We Complement Your Wealth Practice",
    value: [
      "We maximize net transaction proceeds — the more effectively the business is sold, the more capital enters your management",
      "We manage the transition process end-to-end, reducing client stress and protecting your relationship during a high-emotion period",
      "Our post-close liquidity planning coordination ensures proceeds are ready for deployment on a structured timeline",
      "We identify and resolve business-level issues before they erode enterprise value — protecting client net worth",
      "We are a discreet, professional firm that understands confidentiality and the standards of high-net-worth advisory",
    ],
    cta: `When your clients are ready to consider a transition, the outcome of that process will define the next chapter of their financial life. We would be honored to be your recommended partner for that journey. I would welcome a brief conversation to learn more about your clientele and how we can best serve them together.`,
  },
  accountant: {
    subject: "Forhemit — A Trusted Resource for Your Business Owner Clients",
    opening: `My name is {SENDER_NAME}, {SENDER_TITLE} at Forhemit, a stewardship management firm focused on business transitions, ownership succession, and acquisition advisory. Accountants hold a uniquely trusted position with business owners — often knowing the financial truth of a business better than anyone. I am writing to introduce Forhemit as a firm that complements your work and strengthens the outcomes you achieve for your clients.`,
    valueHeader: "Value We Bring to Your Client Relationships",
    value: [
      "We partner with accountants to ensure deal structures are built on clean, properly normalized financial statements — your work becomes the foundation of value",
      "We manage the transaction and advisory process so your clients are not navigating it alone or making costly mistakes",
      "We identify pre-sale operational improvements that can materially increase business value — giving your clients time to act",
      "We bring lender, legal, and buyer relationships that accelerate and de-risk the transaction process",
      "Referral arrangements available for introductions that result in successful engagements",
    ],
    cta: `Accountants who refer clients to Forhemit consistently tell us their clients come through transactions with better outcomes — and they get the credit for making the introduction. We would welcome the opportunity to earn that same trust with you. Let's schedule a brief call at a time that works for you.`,
  },
};

// ── Default Values ─────────────────────────────────────────────────────────

export const DEFAULT_INPUTS: LetterGeneratorInputs = {
  recipientType: "seller",
  contact: {
    firstName: "",
    lastName: "",
    title: "",
    company: "",
    cityState: "",
  },
  sender: {
    name: "",
    title: "",
    phone: "",
    email: "",
    website: "www.forhemit.com",
  },
  company: {
    address: "",
    letterDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  },
};

// ── Template Placeholders ──────────────────────────────────────────────────

export const PLACEHOLDERS = {
  contactFirst: "{{First Name}}",
  contactName: "{{Contact Name}}",
  contactTitle: "{{Title}}",
  contactCompany: "{{Company}}",
  contactCity: "{{City, State}}",
  senderName: "{{Your Name}}",
  senderTitle: "{{Your Title}}",
  senderPhone: "{{Phone}}",
  senderEmail: "{{Email}}",
  address: "{{Office Address}}",
};
