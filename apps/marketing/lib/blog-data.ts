export type Pathway = 'all' | 'founders' | 'attorneys' | 'lenders' | 'cpas' | 'employees';

export interface Author {
  name: string;
  title: string;
  credentials: string;
  photo: string;
  nextAvailability: string;
}

export interface Article {
  imageUrl?: string;
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  pathway: Pathway;
  category: string;
  readTime: {
    overview: number;
    deepDive: number;
    methodology: number;
  };
  depthLevel: 'overview' | 'detailed' | 'comprehensive';
  resilienceSummary: string[];
  author: Author;
  reviewedBy?: {
    name: string;
    title: string;
    credentials: string;
  };
  hasDossierDownload: boolean;
  dossierContents?: string[];
  citations?: string[];
  relatedPathways?: Pathway[];
  caseStudy?: {
    companyType: string;
    employeesRetained: string;
    transitionType: string;
    anonymized: boolean;
  };
  excerpt: string;
  content?: string;
  publishedAt: string;
}

export const pathways: { value: Pathway; label: string; context: string }[] = [
  { value: 'all', label: 'All Perspectives', context: 'All insights across disciplines' },
  { value: 'founders', label: 'Founders', context: 'For business owners navigating transitions' },
  { value: 'attorneys', label: 'Attorneys', context: 'For legal counsel advising family enterprises' },
  { value: 'lenders', label: 'Lenders', context: 'For capital providers assessing transition risk' },
  { value: 'cpas', label: 'CPAs', context: 'For accountants managing transition tax implications' },
  { value: 'employees', context: 'For team members impacted by transitions', label: 'Employees' },
];

/**
 * Legacy demo articles — not used by the live blog (Convex `posts` is the source of truth).
 * Kept for `scripts/seed-blog-posts.ts` one-time import.
 */
export const mockArticles: Article[] = [
  {
    id: '1',
    slug: 'navigating-regulatory-complexity-succession',
    title: 'Navigating Regulatory Complexity in Multi-Generational Stewardship',
    subtitle: 'How fiduciary duties expand when advising transitions across three or more stakeholder classes',
    pathway: 'attorneys',
    category: 'Stewardship Assessment',
    readTime: { overview: 90, deepDive: 8, methodology: 20 },
    depthLevel: 'comprehensive',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    resilienceSummary: [
      'Fiduciary duties expand significantly when advising multi-generational transitions involving 3+ stakeholder classes',
      'Recent Delaware Chancery rulings establish new precedents for minority shareholder protections in family enterprises',
      'The Stewardship Covenant framework reduces litigation risk by 34% compared to traditional exit structures',
    ],
    author: {
      name: 'Margaret Chen',
      title: 'Partner, Stewardship Advisory',
      credentials: 'JD, LLM Taxation, 142 transitions advised',
      photo: '/authors/mchen.jpg',
      nextAvailability: 'Tuesday 3:00 PM ET',
    },
    reviewedBy: {
      name: 'James Morrison',
      title: 'Senior Counsel',
      credentials: 'Former SEC Enforcement, 28 years regulatory practice',
    },
    hasDossierDownload: true,
    dossierContents: [
      'Regulatory Compliance Checklist (PDF)',
      'Multi-Gen Governance Matrix (Excel)',
      'Delaware Precedent Analysis (BibTeX)',
    ],
    citations: [
      'In re Trados Inc. Shareholder Litigation, 73 A.3d 17 (Del. Ch. 2013)',
      'Rev. Rul. 2023-15, I.R.B. 2023-32',
    ],
    relatedPathways: ['cpas', 'founders'],
    excerpt: 'The regulatory landscape for family enterprise transitions has shifted dramatically. What worked a decade ago may now expose counsel to significant liability.',
    publishedAt: '2024-03-15',
  },
  {
    id: '2',
    slug: 'debt-coverage-stewardship-lenders',
    title: 'Debt-Service Coverage in Stewardship Transitions',
    subtitle: 'A framework for lenders assessing continuity risk in founder-led transitions',
    pathway: 'lenders',
    category: 'Risk Assessment',
    readTime: { overview: 60, deepDive: 6, methodology: 15 },
    depthLevel: 'detailed',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    resilienceSummary: [
      'Traditional DSCR models fail to account for continuity premium in founder-led transitions',
      'Stewardship covenants reduce default probability by 22% in first 24 months post-transition',
      'Collateral continuity clauses require specific language to maintain perfection under UCC Article 9',
    ],
    author: {
      name: 'Robert Kincaid',
      title: 'Managing Director, Capital Markets',
      credentials: 'Former SVP Credit, Top 10 Regional Bank, 89 transitions advised',
      photo: '/authors/rkincaid.jpg',
      nextAvailability: 'Thursday 10:00 AM ET',
    },
    hasDossierDownload: true,
    relatedPathways: ['founders', 'cpas'],
    excerpt: 'When a founder steps back, the financial metrics that lenders rely upon tell an incomplete story. Here is what the numbers miss.',
    publishedAt: '2024-02-28',
  },
  {
    id: '3',
    slug: 'founder-dilemma-legacy-liquidity',
    title: "The Founder's Dilemma: Legacy vs. Liquidity",
    subtitle: 'Why emotional readiness correlates more strongly with transition success than financial optimization',
    pathway: 'founders',
    category: 'Continuity Planning',
    readTime: { overview: 120, deepDive: 12, methodology: 25 },
    depthLevel: 'comprehensive',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    resilienceSummary: [
      'Emotional readiness correlates more strongly with transition success than financial optimization',
      'Employee retention drops 40% when founders exit without Stewardship Covenant structure',
      'The Continuity Bond mechanism aligns founder legacy with operational stability',
    ],
    author: {
      name: 'Sarah Whitmore',
      title: 'Principal, Founder Advisory',
      credentials: 'Former CEO, $50M Manufacturing, 67 transitions advised',
      photo: '/authors/swhitmore.jpg',
      nextAvailability: 'Monday 2:00 PM ET',
    },
    hasDossierDownload: true,
    caseStudy: {
      companyType: '$28M Pacific Northwest Manufacturer',
      employeesRetained: '92%',
      transitionType: 'ESOP with Stewardship Covenant',
      anonymized: true,
    },
    relatedPathways: ['employees', 'attorneys'],
    excerpt: 'The question is not whether you can afford to transition. The question is whether you have prepared your organization to thrive without you.',
    publishedAt: '2024-01-15',
  },
  {
    id: '4',
    slug: 'esop-tax-2026',
    title: 'ESOP Tax Implications: What Changes in 2026',
    subtitle: 'Preparing for the sunset of current tax advantages and structuring proactively',
    pathway: 'cpas',
    category: 'Tax Strategy',
    readTime: { overview: 45, deepDive: 5, methodology: 12 },
    depthLevel: 'detailed',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    resilienceSummary: [
      'Current ESOP tax deferral provisions sunset December 31, 2025 unless renewed',
      'Forward planning can capture benefits before legislative changes take effect',
      'Alternative structures may provide equivalent tax treatment under new rules',
    ],
    author: {
      name: 'David Harrington',
      title: 'Director, Tax Advisory',
      credentials: 'CPA, MST, 112 ESOP transitions advised',
      photo: '/authors/dharrington.jpg',
      nextAvailability: 'Wednesday 11:00 AM ET',
    },
    hasDossierDownload: true,
    relatedPathways: ['founders', 'attorneys'],
    excerpt: 'The window for locking in current ESOP tax treatment is closing. Here is what you need to know to act before the year-end.',
    publishedAt: '2024-03-01',
  },
  {
    id: '5',
    slug: 'employee-equity-transitions',
    title: 'Protecting Employee Equity Through Stewardship Covenants',
    subtitle: 'Ensuring your team is protected when ownership changes hands',
    pathway: 'employees',
    category: 'Rights Protection',
    readTime: { overview: 60, deepDive: 7, methodology: 15 },
    depthLevel: 'detailed',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    resilienceSummary: [
      'Employee equity often gets diluted or eliminated in traditional exit structures',
      'Stewardship Covenants can mandate equity preservation provisions',
      'Understanding your rights before a transition is essential for protecting your financial future',
    ],
    author: {
      name: 'Lisa Nakamura',
      title: 'Employee Rights Advocate',
      credentials: 'Former Labor Counsel, 45 equity transitions reviewed',
      photo: '/authors/lnakamura.jpg',
      nextAvailability: 'Friday 9:00 AM ET',
    },
    hasDossierDownload: true,
    relatedPathways: ['founders', 'attorneys'],
    excerpt: 'When a company changes hands, employees are often the last to know and the first to lose. Here is how to protect what you have earned.',
    publishedAt: '2024-02-10',
  },
  {
    id: '6',
    slug: 'governance-gap-analysis',
    title: 'The Governance Gap: Where Family Enterprises Fail',
    subtitle: 'Identifying structural weaknesses before they become liabilities',
    pathway: 'attorneys',
    category: 'Governance',
    readTime: { overview: 45, deepDive: 6, methodology: 14 },
    depthLevel: 'detailed',
    imageUrl: 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    resilienceSummary: [
      '87% of family enterprise governance documents contain at least one critical gap',
      'Board composition requirements often conflict with ownership structure',
      'Succession provisions frequently fail under stress testing scenarios',
    ],
    author: {
      name: 'William Hartwell',
      title: 'Senior Partner, Corporate Governance',
      credentials: 'JD, 93 transitions advised',
      photo: '/authors/whartwell.jpg',
      nextAvailability: 'Tuesday 9:00 AM ET',
    },
    hasDossierDownload: true,
    relatedPathways: ['founders', 'cpas'],
    excerpt: 'The documents that govern your enterprise may contain hidden weaknesses that only become apparent when transitions occur.',
    publishedAt: '2024-01-28',
  },
  {
    id: '7',
    slug: 'valuation-409a-challenges',
    title: '409A Valuation in Transition Scenarios',
    subtitle: 'Navigating the complexities of fair market value when control changes',
    pathway: 'cpas',
    category: 'Valuation',
    readTime: { overview: 55, deepDive: 7, methodology: 18 },
    depthLevel: 'comprehensive',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    resilienceSummary: [
      'Standard 409A methodologies often undervalue companies in transition scenarios',
      'Control premiums and marketability discounts require careful documentation',
      'Retrospective valuations can trigger significant tax penalties if not properly structured',
    ],
    author: {
      name: 'Michael Torres',
      title: 'Managing Director, Valuation Services',
      credentials: 'ASA, CVA, 78 transition valuations',
      photo: '/authors/mtorres.jpg',
      nextAvailability: 'Thursday 2:00 PM ET',
    },
    hasDossierDownload: true,
    relatedPathways: ['founders', 'attorneys', 'lenders'],
    excerpt: 'Getting valuation wrong at the point of transition can trigger IRS scrutiny and significant penalties. Here is how to protect your position.',
    publishedAt: '2024-02-20',
  },
  {
    id: '8',
    slug: 'lender-confidence-transitions',
    title: 'Building Lender Confidence in Continuity Transitions',
    subtitle: 'How to present transition plans that secure favorable financing terms',
    pathway: 'lenders',
    category: 'Credit Analysis',
    readTime: { overview: 40, deepDive: 5, methodology: 10 },
    depthLevel: 'overview',
    imageUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    resilienceSummary: [
      'Lenders view founder transitions as high-risk events without proper documentation',
      'Stewardship Covenant structures can reduce interest spreads by 50-100 basis points',
      'Cash flow projections must account for leadership transition disruption periods',
    ],
    author: {
      name: 'Jennifer Walsh',
      title: 'VP, Commercial Lending',
      credentials: 'Former Senior Credit Officer, $2B portfolio',
      photo: '/authors/jwalsh.jpg',
      nextAvailability: 'Wednesday 3:00 PM ET',
    },
    hasDossierDownload: true,
    relatedPathways: ['founders'],
    excerpt: 'Your transition plan is only as good as the confidence it creates in your lenders. Here is what they are looking for.',
    publishedAt: '2024-03-05',
  },
];

export const glossaryTerms = [
  { term: 'Stewardship Covenant', definition: 'A binding agreement that ensures operational continuity, employee protection, and legacy preservation during ownership transitions.' },
  { term: 'Continuity Transition', definition: 'A planned transfer of ownership or leadership that maintains operational integrity and stakeholder relationships.' },
  { term: 'Legacy Bond', definition: 'The alignment of stakeholders around shared values and long-term objectives during transition periods.' },
  { term: 'Stewardship Assessment', definition: 'Comprehensive due diligence focused on evaluating transition readiness, governance strength, and stakeholder alignment.' },
  { term: 'Dossier', definition: 'A comprehensive document package containing transition frameworks, compliance checklists, and supporting materials.' },
  { term: 'Continuity Bond', definition: 'A financial instrument that aligns founder incentives with long-term operational stability.' },
  { term: '409A Valuation', definition: 'Fair market value determination required by the IRS for stock compensation and ownership transfers.' },
  { term: 'DSCR', definition: 'Debt Service Coverage Ratio - a metric lenders use to assess ability to repay debt obligations.' },
  { term: 'UCC Article 9', definition: 'Uniform Commercial Code section governing secured transactions and collateral perfection.' },
  { term: 'ESOP', definition: 'Employee Stock Ownership Plan - a qualified retirement plan that owns company stock.' },
];
