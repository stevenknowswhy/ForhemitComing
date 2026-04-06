import { FAQ } from "@/types";

// Section 1: The Vision & The Model
export const visionFaqs: FAQ[] = [
  {
    question: "How is this different from a traditional Private Equity (PE) buyout?",
    answer: (
      <>
        <p className="answer-intro">
          <strong>The Structural Difference:</strong>
        </p>
        <p>
          Private equity firms typically operate with fund lifecycles of approximately 10 years and
          target hold periods averaging 5-6 years (up from the historical 3-5 year standard). This
          creates structural incentives to prioritize exit timing and returns to limited partners.
        </p>

        <div className="comparison-table">
          <div className="table-row table-header">
            <span>Aspect</span>
            <span>Traditional PE</span>
            <span>Our Stewardship Model</span>
          </div>
          <div className="table-row">
            <span>Hold Period</span>
            <span>5-6 years (target)</span>
            <span>No predetermined timeline</span>
          </div>
          <div className="table-row">
            <span>Fund Structure</span>
            <span>10-year fund life</span>
            <span>Permanent capital</span>
          </div>
          <div className="table-row">
            <span>Exit Pressure</span>
            <span>High - must return capital to LPs</span>
            <span>None - timing based on readiness</span>
          </div>
          <div className="table-row">
            <span>Value Creation</span>
            <span>Focus on exit multiples</span>
            <span>Focus on sustainable cash flow</span>
          </div>
          <div className="table-row">
            <span>Employee Impact</span>
            <span>Variable - depends on strategy</span>
            <span>Core mission - broad-based ownership</span>
          </div>
        </div>

        <p className="answer-summary">
          We operate on a &quot;Continuity&quot; model. We reinvest in the foundation, keep the
          existing team intact, and transition the company to a 100% Employee Stock Ownership Plan
          (ESOP). Our goal is multi-generational endurance, not a quick exit.
        </p>
        <p className="answer-source">
          Sources: Private Equity Info 2025; Bain & Company 2025; Preqin 2023
        </p>
      </>
    ),
  },
  {
    question: 'What does "Stewardship Management" actually mean in practice?',
    answer: (
      <>
        <p>
          It means we don&apos;t view your company as a &quot;deal&quot; to be flipped, but as an
          institution to be preserved. While traditional firms install new management and cut costs
          for short-term gains, our role is to act as a specialized holding entity that
          &quot;hardens&quot; your existing success.
        </p>

        <div className="two-column-list">
          <div className="column">
            <h4>What We Provide:</h4>
            <ul>
              <li>Structural systems for long-term operational resilience</li>
              <li>Succession frameworks that develop internal leadership</li>
              <li>Governance oversight that maintains accountability</li>
              <li>Regulatory compliance management for ESOP requirements</li>
              <li>Ownership culture development that engages employees</li>
            </ul>
          </div>
          <div className="column">
            <h4>What We Don&apos;t Do:</h4>
            <ul>
              <li>Replace your management team</li>
              <li>Interfere in day-to-day operations</li>
              <li>Impose arbitrary cost-cutting targets</li>
              <li>Set artificial exit timelines</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    question: "Why do I need a Stewardship PBC? Can't I just set up an ESOP on my own?",
    answer: (
      <>
        <p>
          While any owner can technically start an ESOP, the process involves significant
          complexity that benefits from specialized expertise:
        </p>

        <h4>Regulatory Complexity:</h4>
        <ul>
          <li>ERISA compliance requirements</li>
          <li>IRS qualification standards</li>
          <li>Annual valuation requirements</li>
          <li>Form 5500 reporting obligations</li>
          <li>Department of Labor oversight</li>
        </ul>

        <h4>Ongoing Administration:</h4>
        <ul>
          <li>Repurchase obligation management</li>
          <li>Participant communication and education</li>
          <li>Trustee oversight and fiduciary responsibilities</li>
          <li>Distribution processing and compliance</li>
        </ul>

        <h4>The PBC Difference:</h4>
        <p>
          As a Public Benefit Corporation, we are legally required to balance financial returns with
          our stated public benefit mission. Our charter commits us to employee well-being and
          community impact—not just profit maximization. This creates structural alignment with your
          goals for your people and your legacy.
        </p>

        <h4>The Data Supports ESOP Success:</h4>
        <ul className="stats-list">
          <li>ESOP companies are <strong>50% less likely to fail</strong> than comparable non-ESOP companies</li>
          <li>ESOP participants have <strong>2x the retirement savings</strong> of non-ESOP employees</li>
          <li>ESOP companies experience <strong>2.3% faster sales growth</strong> than peers</li>
          <li>Employee-owners are <strong>40-50% less likely</strong> to look for new jobs</li>
        </ul>
        <p className="answer-source">
          Sources: NCEO 2014; Rutgers/Blasi & Kruse Studies; NCEO 2021 Retirement Savings Study
        </p>
      </>
    ),
  },
];

// Section 2: Financials & Risk Mitigation
export const financialsFaqs: FAQ[] = [
  {
    question: "My employees don't have millions of dollars; how can they \"buy\" the company?",
    answer: (
      <>
        <p>
          Employees do not use their personal savings. Instead, ESOP transactions are structured so
          that employees earn equity through continued service, not direct purchase.
        </p>

        <h4>How It Works:</h4>
        <ol>
          <li>
            <strong>Leveraged ESOP Structure:</strong> The company borrows funds from lenders to
            acquire shares on behalf of employees
          </li>
          <li>
            <strong>Tax-Deductible Repayment:</strong> The company repays the loan using
            tax-deductible contributions to the ESOP trust
          </li>
          <li>
            <strong>Employee Allocation:</strong> Shares are allocated to employee accounts based on
            compensation or years of service
          </li>
          <li>
            <strong>Vesting:</strong> Employees earn full ownership rights over time through
            vesting schedules
          </li>
        </ol>

        <p>
          <strong>The Result:</strong> Employees become owners without contributing personal
          capital. The company&apos;s cash flow services the debt, and tax benefits often offset much
          of the cost.
        </p>

        <p className="highlight-box">
          <strong>Key Advantage:</strong> In a 100% ESOP-owned S-corporation, the company pays no
          federal income tax at the corporate level, preserving significantly more cash flow for
          debt service, reinvestment, and growth.
        </p>
        <p className="answer-source">Sources: IRS; Berman Skinner 2026; NCEO</p>
      </>
    ),
  },
  {
    question: "Will I or my employees have to sign a personal guarantee for the debt?",
    answer: (
      <>
        <p>
          ESOP transactions typically avoid personal guarantees for sellers and employees because
          the loan is made to the company, not to individuals.
        </p>

        <div className="two-column-list">
          <div className="column">
            <h4>Traditional Business Sale:</h4>
            <ul>
              <li>Seller financing often requires personal guarantees</li>
              <li>SBA loans mandate personal guarantees from 20%+ owners</li>
              <li>Buyers typically must pledge personal assets</li>
            </ul>
          </div>
          <div className="column">
            <h4>ESOP Structure:</h4>
            <ul>
              <li>Loan is made to the corporation</li>
              <li>Repayment comes from company cash flow</li>
              <li>Tax-deductible contributions fund repayment</li>
              <li>No personal assets at risk for sellers or employees</li>
            </ul>
          </div>
        </div>

        <p className="note">
          <strong>Important Note:</strong> Specific guarantee requirements depend on the financing
          structure, lender policies, and company financial strength. While ESOP structures
          typically avoid personal guarantees, we evaluate each transaction individually.
        </p>
        <p className="answer-source">Sources: NCEO ESOP Financing Guidelines; SBA Loan Requirements</p>
      </>
    ),
  },
  {
    question: "Can you really offer a competitive purchase price compared to a PE firm?",
    answer: (
      <>
        <p>
          Yes. A 100% ESOP-owned S-corporation pays no federal income tax at the corporate level,
          allowing the company to retain significantly more cash flow for debt service,
          reinvestment, and growth.
        </p>

        <h4>The Math:</h4>
        <div className="comparison-table simple">
          <div className="table-row table-header">
            <span>Factor</span>
            <span>Traditional Sale</span>
            <span>ESOP Sale</span>
          </div>
          <div className="table-row">
            <span>Corporate Tax Rate</span>
            <span>21% federal</span>
            <span>0% (100% ESOP S-corp)</span>
          </div>
          <div className="table-row">
            <span>Cash Flow Retention</span>
            <span>79% of earnings</span>
            <span>100% of earnings</span>
          </div>
          <div className="table-row">
            <span>Debt Service Capacity</span>
            <span>Lower</span>
            <span>Higher</span>
          </div>
          <div className="table-row">
            <span>Growth Capital</span>
            <span>Reduced</span>
            <span>Enhanced</span>
          </div>
        </div>

        <h4>Additional Tax Benefits for Sellers (C-Corps):</h4>
        <ul>
          <li>Section 1042 rollover allows capital gains tax deferral</li>
          <li>Sellers can reinvest proceeds in Qualified Replacement Property</li>
          <li>Potential for permanent tax elimination if held until death</li>
        </ul>

        <p>
          <strong>The Result:</strong> The tax efficiency of the ESOP model supports competitive
          valuations while preserving the company&apos;s financial strength post-transition.
        </p>
        <p className="answer-source">Sources: IRS Section 1042; Berman Skinner 2026; NCEO</p>
      </>
    ),
  },
  {
    question: "How do you get paid if you aren't flipping the company?",
    answer: (
      <>
        <p>We are compensated through a transparent management fee (typically 2-3%) for:</p>
        <ul>
          <li>Transition oversight and project management</li>
          <li>ESOP implementation and plan administration</li>
          <li>Ongoing fiduciary governance and compliance</li>
          <li>Ownership culture development and employee engagement</li>
          <li>Repurchase obligation planning and management</li>
        </ul>
        <p>
          Our incentives are aligned with the company&apos;s long-term health—we only succeed if the
          company endures and thrives under employee ownership.
        </p>
        <p className="answer-source">
          Source: Financial Models Lab ESOP Administration Cost Analysis 2026
        </p>
      </>
    ),
  },
];

// Section 3: Operational Resilience
export const operationalFaqs: FAQ[] = [
  {
    question: 'How does the "Resilience Framework" protect my company?',
    answer: (
      <>
        <p>
          Drawing from federal Continuity of Operations (COOP) standards—originally developed for
          government agencies and now applied to critical infrastructure—we implement resilience
          planning that secures your operation against disruption.
        </p>

        <h4>Federal COOP Standards (PPD-40, FCD-1, FCD-2):</h4>
        <ul>
          <li>
            <strong>Essential Functions Identification:</strong> What must continue, no matter what
          </li>
          <li>
            <strong>Orders of Succession:</strong> Deep leadership bench (typically 3+ levels)
          </li>
          <li>
            <strong>Delegations of Authority:</strong> Clear decision-making authority
          </li>
          <li>
            <strong>Continuity Facilities:</strong> Backup operational capabilities
          </li>
          <li>
            <strong>Vital Records Management:</strong> Secure data and document access
          </li>
          <li>
            <strong>Communication Systems:</strong> Redundant communication channels
          </li>
        </ul>

        <h4>Application to Your Business:</h4>
        <p>
          We adapt these proven frameworks to private company needs, creating operational
          &quot;hardening&quot; that protects against:
        </p>
        <ul>
          <li>Market volatility and economic downturns</li>
          <li>Leadership transitions and key person risk</li>
          <li>Supply chain disruptions</li>
          <li>Technology and cybersecurity threats</li>
          <li>Natural disasters and external shocks</li>
        </ul>
        <p className="answer-source">Source: FEMA Federal Continuity Directives; Presidential Policy Directive 40</p>
      </>
    ),
  },
  {
    question: "What happens to my current management team?",
    answer: (
      <>
        <p>
          You control what your succession looks like. We prioritize &quot;hiring from within&quot;
          and stabilizing the leaders you&apos;ve already built.
        </p>

        <h4>Our Approach:</h4>
        <ul>
          <li>Assess current leadership capabilities and development needs</li>
          <li>Create succession plans for key positions</li>
          <li>Provide governance oversight without operational interference</li>
          <li>Support leadership development and ownership mindset training</li>
          <li>Maintain continuity of relationships with customers, suppliers, and stakeholders</li>
        </ul>

        <p>
          <strong>The Goal:</strong> Transform your current team from employees into long-term
          stewards of the business.
        </p>
      </>
    ),
  },
  {
    question: "Why should I sell to my employees instead of a strategic buyer?",
    answer: (
      <>
        <h4>Legacy Preservation:</h4>
        <p>
          A strategic buyer often acquires to &quot;absorb&quot;—meaning your brand, local office,
          and culture may disappear. Selling to your employees preserves your legacy and maintains
          the identity you spent decades building.
        </p>

        <h4>Financial Advantages:</h4>
        <ul>
          <li>
            <strong>Tax Efficiency:</strong> 100% S-corp ESOP pays zero federal income tax
          </li>
          <li>
            <strong>Cash Flow:</strong> More internal capital for growth than under traditional
            corporate ownership
          </li>
          <li>
            <strong>Competitive Price:</strong> Tax benefits support competitive valuations
          </li>
        </ul>

        <h4>Employee Benefits:</h4>
        <ul>
          <li>
            <strong>Wealth Building:</strong> ESOP participants accumulate 2x the retirement savings
          </li>
          <li>
            <strong>Job Security:</strong> ESOP companies are 50% less likely to fail
          </li>
          <li>
            <strong>Engagement:</strong> Employee-owners are more productive and less likely to
            leave
          </li>
        </ul>

        <h4>Community Impact:</h4>
        <ul>
          <li>Local ownership maintained</li>
          <li>Jobs preserved</li>
          <li>Community investment continues</li>
        </ul>
        <p className="answer-source">Sources: NCEO; Rutgers Studies; Mathematica Research</p>
      </>
    ),
  },
];

// Section 4: Legacy & The Transition
export const legacyFaqs: FAQ[] = [
  {
    question: "Will my brand and my name stay on the building?",
    answer: (
      <>
        <p>
          Yes. Our model is designed to preserve local identity. Because the employees become the
          owners, they have a vested interest in maintaining the reputation and brand you spent
          decades building.
        </p>

        <h4>What Stays:</h4>
        <ul>
          <li>Company name and brand identity</li>
          <li>Local office locations and facilities</li>
          <li>Customer relationships and contracts</li>
          <li>Supplier partnerships</li>
          <li>Community presence and involvement</li>
        </ul>

        <p>You are being cemented in your community, not folded into a conglomerate.</p>
      </>
    ),
  },
  {
    question: "How do we announce this to the staff without causing a panic?",
    answer: (
      <>
        <p>We frame the transition as an &quot;evolution and a gift.&quot;</p>

        <p>
          <strong>Research shows:</strong> Most employees receive this news with deep gratitude
          because it offers them a path to wealth-building they never thought possible.
        </p>

        <h4>Our Communication Strategy:</h4>
        <ul>
          <li>
            <strong>Leadership First:</strong> Brief key leaders before broader announcement
          </li>
          <li>
            <strong>Positive Framing:</strong> Emphasize stability, opportunity, and legacy
            preservation
          </li>
          <li>
            <strong>Transparency:</strong> Clear explanation of what changes and what stays the
            same
          </li>
          <li>
            <strong>Education:</strong> Comprehensive ESOP education to build ownership mindset
          </li>
          <li>
            <strong>Ongoing Engagement:</strong> Regular communication and updates throughout
            transition
          </li>
        </ul>

        <h4>Key Messages:</h4>
        <ul>
          <li>&quot;The company you helped build will remain independent&quot;</li>
          <li>&quot;You will share in the future success you help create&quot;</li>
          <li>&quot;Jobs, culture, and community presence are preserved&quot;</li>
          <li>&quot;This is an evolution, not a disruption&quot;</li>
        </ul>
      </>
    ),
  },
  {
    question: "What is your commitment to the workers?",
    answer: (
      <>
        <p>
          As a PBC, we have a fiduciary duty to balance stakeholder interests. Our stewardship
          model includes specific commitments to employee well-being:
        </p>

        <h4>Governance Safeguards:</h4>
        <ul>
          <li>Independent ESOP trustee representing employee interests</li>
          <li>Annual valuations by independent appraisers</li>
          <li>Transparent financial reporting to employees</li>
          <li>Employee participation in governance (e.g., ESOP committee)</li>
        </ul>

        <h4>Wealth Building Focus:</h4>
        <ul>
          <li>Broad-based ownership (not just executives)</li>
          <li>Vesting schedules that reward tenure</li>
          <li>Diversification options as accounts grow</li>
          <li>Retirement education and financial wellness programs</li>
        </ul>

        <h4>Job Quality:</h4>
        <ul>
          <li>Competitive wages and benefits</li>
          <li>Professional development opportunities</li>
          <li>Safe and inclusive workplace</li>
          <li>Voice in workplace decisions</li>
        </ul>
        <p className="answer-source">Source: NCEO Corporate Governance Guidelines; DOL ESOP Regulations</p>
      </>
    ),
  },
  {
    question: "What happens to my role after the sale?",
    answer: (
      <>
        <p>
          Your role shifts from <strong>Operator</strong> to <strong>Sage</strong>.
        </p>

        <h4>Immediate Post-Sale (0-12 months):</h4>
        <ul>
          <li>Continue in operational role with gradual responsibility transfer</li>
          <li>Mentor incoming leadership team</li>
          <li>Transfer &quot;tribal knowledge&quot; and historical context</li>
          <li>Maintain customer and supplier relationships</li>
        </ul>

        <h4>Medium-Term (1-3 years):</h4>
        <ul>
          <li>Transition to board advisor or strategic consultant</li>
          <li>Available for major decisions and crisis management</li>
          <li>Focus on high-level wisdom and industry relationships</li>
          <li>Reduced day-to-day involvement</li>
        </ul>

        <h4>Long-Term (3+ years):</h4>
        <ul>
          <li>Honorary role as &quot;founder emeritus&quot;</li>
          <li>Optional ongoing board seat</li>
          <li>Legacy preservation and storytelling</li>
          <li>Freedom to pursue other interests</li>
        </ul>

        <p>
          <strong>The Goal:</strong> You get to step back from the daily grind while remaining the
          honorary protector of the mission—without the stress of payroll, firefighting, or
          singular risk.
        </p>
      </>
    ),
  },
];
