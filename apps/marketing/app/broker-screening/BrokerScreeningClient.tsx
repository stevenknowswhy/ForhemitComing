"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, ArrowLeft, RotateCcw, AlertCircle } from "lucide-react";
import "./broker-screening.css";

// Section configuration with questions
type QuestionType = "pass" | "fail" | "signal";

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  note?: string;
}

interface Section {
  id: string;
  badge: string;
  badgeVariant?: "default" | "fail" | "check";
  title: string;
  subtitle: string;
  questions: Question[];
}

const SECTIONS: Section[] = [
  {
    id: "profile",
    badge: "Section 1",
    title: "Quick Reference — The Ideal Client",
    subtitle: "Confirm your client matches this baseline profile before continuing.",
    questions: [
      {
        id: "p1",
        type: "pass",
        title: "Business type qualifies",
        description: "Professional services, healthcare services, construction & trades, engineering, government contracting, or specialty manufacturing.",
      },
      {
        id: "p2",
        type: "pass",
        title: "EBITDA is $3M or above",
        description: "$5M–$10M is preferred. $3M is the minimum to make the deal math work.",
      },
      {
        id: "p3",
        type: "pass",
        title: "20 or more full-time W-2 employees",
        description: "15 is the absolute floor. 20+ is strongly preferred for plan participation and ownership culture.",
      },
      {
        id: "p4",
        type: "pass",
        title: "No single customer above 35% of revenue",
        description: "20% or below is preferred. Above 35% is a hard disqualifier.",
      },
      {
        id: "p5",
        type: "pass",
        title: "Owner is motivated by legacy, willing to stay 12–24 months",
        description: "Realistic about after-tax total proceeds vs. Day 1 cash. Not purely price-driven.",
      },
      {
        id: "p6",
        type: "pass",
        title: "Management exists beyond the owner",
        description: "Someone other than the owner is already running day-to-day operations.",
      },
      {
        id: "p7",
        type: "pass",
        title: "7+ years of operating history",
        description: "3+ years of tax returns and reviewed or audited financial statements available.",
      },
    ],
  },
  {
    id: "signals",
    badge: "Section 2",
    title: "Priority Signals",
    subtitle: "Not required to submit — but 3 or more moves your client to the top of the queue.",
    questions: [
      {
        id: "s1",
        type: "signal",
        title: "EBITDA is $5M or above",
        description: "More capital structure options, lower relative transaction costs, stronger debt service cushion.",
      },
      {
        id: "s2",
        type: "signal",
        title: "Profit-sharing, bonuses, or employee incentives already in place",
        description: "Companies with existing employee financial participation convert to ownership culture faster.",
      },
      {
        id: "s3",
        type: "signal",
        title: "Owner has owned the business 15+ years",
        description: "Deeper institutional knowledge, more loyal client relationships, stronger legacy motivation.",
      },
      {
        id: "s4",
        type: "signal",
        title: "Seasoned second-in-command (5+ years tenure)",
        description: "The single most de-risking factor for trustees and lenders in a small-business ESOP.",
      },
      {
        id: "s5",
        type: "signal",
        title: "Revenue has grown in 2 of the last 3 years",
        description: "Organic growth signals market demand, pricing power, and management competence.",
      },
      {
        id: "s6",
        type: "signal",
        title: "Business is in Florida, Texas, or Tennessee",
        description: "Forhemit Phase 1 target states — facilitates faster trustee engagement and legal review.",
      },
      {
        id: "s7",
        type: "signal",
        title: "Government contract, MSA, or long-term service agreement",
        description: "Contracted revenue reduces valuation risk and strengthens lender underwriting significantly.",
      },
    ],
  },
  {
    id: "financials",
    badge: "Section 3",
    title: "Financial Profile",
    subtitle: "Every item confirmed here is a strong positive signal. Aim for all five.",
    questions: [
      {
        id: "f1",
        type: "pass",
        title: "EBITDA $3M–$10M, stable or growing for 3+ years",
        description: "Trailing twelve-month adjusted EBITDA confirmed in range with a flat or positive three-year trend.",
        note: "Declining EBITDA is not an automatic disqualifier but requires explanation. Flag it.",
      },
      {
        id: "f2",
        type: "pass",
        title: "EBITDA margin is 15% or higher",
        description: "Higher margins mean more cushion for debt service and repurchase obligations.",
        note: "Below 10% is very difficult to structure.",
      },
      {
        id: "f3",
        type: "pass",
        title: "No single customer above 20% of revenue",
        description: "20% or below is what lenders and trustees prefer. This is stronger than the 35% threshold that disqualifies.",
      },
      {
        id: "f4",
        type: "pass",
        title: "40%+ recurring or contractual revenue",
        description: "Contracts, subscriptions, repeat relationships, or government/insurance payers. Dramatically improves DSCR projections.",
      },
      {
        id: "f5",
        type: "pass",
        title: "Existing debt is less than 2× EBITDA",
        description: "Ensures borrowing capacity for the ESOP transaction without immediately over-leveraging the company.",
      },
    ],
  },
  {
    id: "operations",
    badge: "Section 4",
    title: "Business Operations",
    subtitle: "These items assess whether the business can survive and thrive without the founder.",
    questions: [
      {
        id: "o1",
        type: "pass",
        title: "Management team exists beyond the owner",
        description: "At least one senior manager (GM, COO, department head) is actively running day-to-day operations and is known to key clients.",
        note: "Founder dependency is the single biggest deal-killer in small business ESOPs.",
      },
      {
        id: "o2",
        type: "pass",
        title: "Client relationships are not exclusively personal to the owner",
        description: "Key clients have meaningful relationships with other staff members.",
        note: 'Ask yourself: "If the owner left tomorrow, would your top 5 clients stay?" If uncertain, flag it.',
      },
      {
        id: "o3",
        type: "pass",
        title: "7+ years of operating history",
        description: "Longevity indicates market durability, repeat customer relationships, and having survived at least one economic cycle.",
      },
      {
        id: "o4",
        type: "pass",
        title: "Maintenance capex is less than 10% of EBITDA",
        description: "High capex businesses struggle to service ESOP debt and fund repurchase obligations simultaneously.",
      },
      {
        id: "o5",
        type: "pass",
        title: "Business operates in a stable or growing industry",
        description: "Healthcare, professional services, construction, engineering, government contracting, and specialty trades all qualify.",
        note: "Structurally declining industries face trustee and lender resistance regardless of current financials.",
      },
      {
        id: "o6",
        type: "pass",
        title: "20+ full-time W-2 employees (excluding owner)",
        description: "Preferred floor — not the absolute minimum. More employees means better plan participation and a more robust ownership culture.",
      },
    ],
  },
  {
    id: "disqualifiers",
    badge: "Section 5",
    badgeVariant: "fail",
    title: "Instant Disqualifiers",
    subtitle: "If any single item applies, this business is not eligible at this time. These cannot be waived.",
    questions: [
      {
        id: "d1",
        type: "fail",
        title: "EBITDA is below $3M",
        description: "Transaction costs and ongoing ESOP administration require minimum sustainable cash flow. Below $3M the deal math does not work.",
      },
      {
        id: "d2",
        type: "fail",
        title: "A single customer represents more than 35% of revenue",
        description: "Trustee and lender will require this. A customer this concentrated makes the business impossible to value without a steep discount.",
      },
      {
        id: "d3",
        type: "fail",
        title: "Owner plans full exit within 12 months with no named successor",
        description: "Seller must stay in a defined transition role for 12–24 months, OR a qualified successor is already running day-to-day operations.",
        note: "Immediate exit with no successor kills the deal. Lenders won't fund it. Trustees won't approve it.",
      },
      {
        id: "d4",
        type: "fail",
        title: "Fewer than 15 full-time W-2 employees",
        description: "ESOP administration costs, 409(p) anti-abuse rules, and plan participation minimums require a sufficient employee base.",
      },
      {
        id: "d5",
        type: "fail",
        title: "No financial statements for the past 3 years",
        description: "Must have 3 years of tax returns and reviewed or audited statements. Without them, no Quality of Earnings can be conducted and no lender will engage.",
      },
      {
        id: "d6",
        type: "fail",
        title: "S-Corporation AND owner unwilling to consider converting",
        description: "Most Forhemit transactions use C-Corp structure for §1042 tax deferral. If the business is an S-Corp and the owner firmly refuses to consider converting, the primary tax advantage disappears.",
      },
      {
        id: "d7",
        type: "fail",
        title: "Active PE or strategic buyer offer, prioritizing headline price",
        description: "An ESOP cannot close competitively on Day 1 cash against a cash buyer at or above FMV. The ESOP advantage is total after-tax proceeds over time, not headline price.",
      },
      {
        id: "d8",
        type: "fail",
        title: "Active litigation, tax liens, or undisclosed liabilities above $250K",
        description: "Any unresolved legal matter, IRS or state tax lien, or undisclosed liability above $250,000 is a disqualifier until fully resolved.",
        note: "These surface immediately in due diligence and will cause the trustee to walk away.",
      },
    ],
  },
];

type Answers = Record<string, boolean>;

interface Results {
  failCount: number;
  signalCount: number;
  corePassCount: number;
  coreTotal: number;
  verdict: "submit" | "discuss" | "hold" | "disqualified";
  verdictClass: "green" | "amber" | "red";
  verdictLabel: string;
  verdictTitle: string;
  verdictSub: string;
  checkedFails: string[];
  checkedSignals: string[];
}

interface ScoreStatus {
  coreChecked: number;
  coreTotal: number;
  signalsChecked: number;
  signalsTotal: number;
  failsChecked: number;
  percentage: number;
  isPassing: boolean;
  statusText: string;
  statusClass: "passing" | "warning" | "failing";
}

// Calculate real-time score status
function calculateScoreStatus(answers: Answers): ScoreStatus {
  const profileSection = SECTIONS.find((s) => s.id === "profile")!;
  const financialsSection = SECTIONS.find((s) => s.id === "financials")!;
  const operationsSection = SECTIONS.find((s) => s.id === "operations")!;
  const signalsSection = SECTIONS.find((s) => s.id === "signals")!;
  const disqualifiersSection = SECTIONS.find((s) => s.id === "disqualifiers")!;

  const coreQuestions = [
    ...profileSection.questions,
    ...financialsSection.questions,
    ...operationsSection.questions,
  ];

  const coreChecked = coreQuestions.filter((q) => answers[q.id]).length;
  const coreTotal = coreQuestions.length;

  const signalsChecked = signalsSection.questions.filter((q) => answers[q.id]).length;
  const signalsTotal = signalsSection.questions.length;

  const failsChecked = disqualifiersSection.questions.filter((q) => answers[q.id]).length;

  const percentage = Math.round((coreChecked / coreTotal) * 100);

  let isPassing = failsChecked === 0 && coreChecked >= 13;
  let statusText: string;
  let statusClass: ScoreStatus["statusClass"];

  if (failsChecked >= 2) {
    statusText = "Does Not Qualify";
    statusClass = "failing";
  } else if (failsChecked === 1) {
    statusText = "On Hold - Issue to Resolve";
    statusClass = "warning";
  } else if (coreChecked >= 13) {
    statusText = "Strong Candidate";
    statusClass = "passing";
  } else if (coreChecked >= 9) {
    statusText = "Possible - Gaps Present";
    statusClass = "warning";
  } else {
    statusText = "Early - Keep Going";
    statusClass = "warning";
  }

  return {
    coreChecked,
    coreTotal,
    signalsChecked,
    signalsTotal,
    failsChecked,
    percentage,
    isPassing,
    statusText,
    statusClass,
  };
}

// Score indicator component
function ScoreIndicator({ status }: { status: ScoreStatus }) {
  return (
    <div className={`bsp-score-indicator bsp-score-${status.statusClass}`}>
      <div className="bsp-score-bar">
        <div 
          className="bsp-score-progress" 
          style={{ width: `${status.percentage}%` }}
        />
      </div>
      <div className="bsp-score-details">
        <span className="bsp-score-status">{status.statusText}</span>
        <span className="bsp-score-count">
          {status.coreChecked}/{status.coreTotal} core items
        </span>
        {status.signalsChecked > 0 && (
          <span className="bsp-score-signals">
            +{status.signalsChecked} signals
          </span>
        )}
        {status.failsChecked > 0 && (
          <span className="bsp-score-fails">
            {status.failsChecked} disqualifier{status.failsChecked > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

export function BrokerScreeningClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const totalSteps = SECTIONS.length;

  const scoreStatus = useMemo(() => calculateScoreStatus(answers), [answers]);

  const handleToggle = useCallback((questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, totalSteps]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleViewResults = useCallback(() => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const results: Results = useMemo(() => {
    const disqualifiersSection = SECTIONS.find((s) => s.id === "disqualifiers")!;
    const signalsSection = SECTIONS.find((s) => s.id === "signals")!;
    
    const checkedFails = disqualifiersSection.questions
      .filter((q) => answers[q.id])
      .map((q) => q.title);
    
    const checkedSignals = signalsSection.questions
      .filter((q) => answers[q.id])
      .map((q) => q.title);

    const failCount = checkedFails.length;
    const signalCount = checkedSignals.length;

    // Core pass items: profile (7), financials (5), operations (6) = 18
    const profileSection = SECTIONS.find((s) => s.id === "profile")!;
    const financialsSection = SECTIONS.find((s) => s.id === "financials")!;
    const operationsSection = SECTIONS.find((s) => s.id === "operations")!;

    const corePassCount = [
      ...profileSection.questions,
      ...financialsSection.questions,
      ...operationsSection.questions,
    ].filter((q) => answers[q.id]).length;
    const coreTotal = 18;

    let verdict: Results["verdict"];
    let verdictClass: Results["verdictClass"];
    let verdictLabel: string;
    let verdictTitle: string;
    let verdictSub: string;

    if (failCount >= 2) {
      verdict = "disqualified";
      verdictClass = "red";
      verdictLabel = "Result: Do Not Submit";
      verdictTitle = "This deal does not qualify.";
      verdictSub = `${failCount} instant disqualifiers are present. This business is not eligible for the Forhemit program at this time. Review the flagged items with your client before reconsidering.`;
    } else if (failCount === 1) {
      verdict = "hold";
      verdictClass = "amber";
      verdictLabel = "Result: Hold — One Disqualifier Present";
      verdictTitle = "Do not submit until the disqualifier is resolved.";
      verdictSub = "One deal-stopping item is present. If you believe it is resolvable before LOI, contact Forhemit directly before proceeding. Some single FAIL items are addressable — call us first.";
    } else if (corePassCount >= 13) {
      verdict = "submit";
      verdictClass = "green";
      verdictLabel = "Result: Strong Candidate";
      verdictTitle = "This deal is worth a conversation.";
      verdictSub = "Zero disqualifiers and strong core indicators. Submit a brief deal overview to deals@forhemit.com — Forhemit will respond within 48 business hours.";
    } else {
      verdict = "discuss";
      verdictClass = "amber";
      verdictLabel = "Result: Possible Candidate";
      verdictTitle = "Gaps are present but may be addressable.";
      verdictSub = "No instant disqualifiers, but several indicators were not confirmed. This deal may warrant a preliminary conversation before submission — contact Forhemit to discuss.";
    }

    return {
      failCount,
      signalCount,
      corePassCount,
      coreTotal,
      verdict,
      verdictClass,
      verdictLabel,
      verdictTitle,
      verdictSub,
      checkedFails,
      checkedSignals,
    };
  }, [answers]);

  const currentSection = SECTIONS[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  // Count checked items for current section
  const failCheckedCount = currentSection.id === "disqualifiers" 
    ? currentSection.questions.filter((q) => answers[q.id]).length 
    : 0;

  if (showResults) {
    return (
      <main className="bsp-page">
        <div className="bsp-bg" aria-hidden />
        
        <div className="bsp-wrapper">
          {/* Header */}
          <header className="bsp-header">
            <Link href="/" className="bsp-logo">
              Forhemit
            </Link>
            <span className="bsp-logo-sub">Broker Deal Screening</span>
          </header>

          {/* Results */}
          <div className={`bsp-results-card bsp-verdict-${results.verdictClass}`}>
            <div className="bsp-results-header">
              <span className="bsp-verdict-label">{results.verdictLabel}</span>
              <h1 className="bsp-verdict-title">{results.verdictTitle}</h1>
              <p className="bsp-verdict-sub">{results.verdictSub}</p>
            </div>

            <div className="bsp-score-grid">
              <div className="bsp-score-cell">
                <div className={`bsp-score-number ${results.failCount === 0 ? "bsp-green" : "bsp-red"}`}>
                  {results.failCount}
                </div>
                <div className="bsp-score-label">Disqualifiers</div>
              </div>
              <div className="bsp-score-cell">
                <div className="bsp-score-number bsp-amber">{results.signalCount}/7</div>
                <div className="bsp-score-label">Priority Signals</div>
              </div>
              <div className="bsp-score-cell">
                <div className={`bsp-score-number ${results.corePassCount >= 13 ? "bsp-green" : results.corePassCount >= 9 ? "bsp-amber" : "bsp-red"}`}>
                  {results.corePassCount}/{results.coreTotal}
                </div>
                <div className="bsp-score-label">Core Indicators</div>
              </div>
            </div>

            <div className="bsp-results-body">
              {results.checkedFails.length > 0 && (
                <>
                  <h2 className="bsp-results-section-title">Disqualifiers Present</h2>
                  <ul className="bsp-fail-list">
                    {results.checkedFails.map((title, idx) => (
                      <li key={idx}>{title}</li>
                    ))}
                  </ul>
                </>
              )}

              {results.checkedSignals.length > 0 && (
                <>
                  <h2 className="bsp-results-section-title">Priority Signals Confirmed</h2>
                  <ul className="bsp-pass-list">
                    {results.checkedSignals.map((title, idx) => (
                      <li key={idx}>{title}</li>
                    ))}
                  </ul>
                </>
              )}

              <div className="bsp-cta-box">
                {results.verdict === "submit" && (
                  <>
                    <h3>Ready to submit?</h3>
                    <p>
                      Send a brief email to{" "}
                      <a href="mailto:deals@forhemit.com">deals@forhemit.com</a> with: (1) business type 
                      and state, (2) approximate EBITDA, (3) number of employees, (4) owner&apos;s timeline, 
                      and (5) a note on any priority signals that apply. Do not include the seller&apos;s 
                      name or business name in the first email.
                    </p>
                  </>
                )}
                {results.verdict === "discuss" && (
                  <>
                    <h3>Worth a preliminary conversation?</h3>
                    <p>
                      If you believe the gaps are addressable, reach out to{" "}
                      <a href="mailto:deals@forhemit.com">deals@forhemit.com</a> before submitting. 
                      Forhemit can often help you identify what to work through with your client pre-LOI.
                    </p>
                  </>
                )}
                {results.verdict === "hold" && (
                  <>
                    <h3>One item may be resolvable.</h3>
                    <p>
                      If the disqualifying item is in process of resolution (S-Corp conversion underway, 
                      litigation recently settled, succession candidate identified), call Forhemit before 
                      moving on. Reach out at <a href="mailto:deals@forhemit.com">deals@forhemit.com</a>.
                    </p>
                  </>
                )}
                {results.verdict === "disqualified" && (
                  <>
                    <h3>Not the right fit at this time.</h3>
                    <p>
                      Two or more disqualifiers means this deal cannot proceed until the underlying issues 
                      are resolved. If circumstances change — financials improve, succession is in place, 
                      litigation resolves — reach out to <a href="mailto:deals@forhemit.com">deals@forhemit.com</a>{" "}
                      to revisit.
                    </p>
                  </>
                )}
              </div>

              <button className="bsp-restart-btn" onClick={handleRestart}>
                <RotateCcw size={14} />
                Start Over
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="bsp-footer">
            <p>
              <Link href="/brokers">← Back to Brokers Page</Link>
            </p>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="bsp-page">
      <div className="bsp-bg" aria-hidden />
      
      <div className="bsp-wrapper">
        {/* Privacy Banner */}
        <div className="bsp-privacy-banner">
          <span>🔒</span>
          <p>
            This tool collects no personal information. No names, business names, or contact details 
            are requested or stored. This is a qualification reference only.
          </p>
        </div>

        {/* Header */}
        <header className="bsp-header">
          <Link href="/" className="bsp-logo">
            Forhemit
          </Link>
          <span className="bsp-logo-sub">Broker Deal Screening</span>
        </header>

        {/* Intro */}
        <div className="bsp-intro">
          <h1>
            Is your client a <em>fit</em> for an ESOP transaction?
          </h1>
          <p>
            This is the same checklist Forhemit uses internally to evaluate every deal submission. 
            Work through it with your client&apos;s listing in front of you — no personal information 
            is collected or stored at any point.
          </p>
        </div>

        {/* Live Score Indicator */}
        <ScoreIndicator status={scoreStatus} />

        {/* Progress Track */}
        <div className="bsp-progress-track">
          {SECTIONS.map((section, index) => (
            <div key={section.id} className="bsp-step-wrapper">
              <div className="bsp-step-node">
                <div
                  className={`bsp-step-circle ${
                    index < currentStep
                      ? "bsp-done"
                      : index === currentStep
                      ? "bsp-active"
                      : ""
                  }`}
                >
                  {index < currentStep ? <Check size={12} /> : index + 1}
                </div>
                <div
                  className={`bsp-step-label ${
                    index < currentStep ? "bsp-done" : index === currentStep ? "bsp-active" : ""
                  }`}
                >
                  {section.id === "profile" && "Profile"}
                  {section.id === "signals" && "Signals"}
                  {section.id === "financials" && "Financials"}
                  {section.id === "operations" && "Operations"}
                  {section.id === "disqualifiers" && "Disqualifiers"}
                </div>
              </div>
              {index < SECTIONS.length - 1 && (
                <div className={`bsp-step-line ${index < currentStep ? "bsp-done" : ""}`} />
              )}
            </div>
          ))}
        </div>

        {/* Section Card */}
        <div className="bsp-card">
          <div className="bsp-card-header">
            <span className={`bsp-section-badge ${currentSection.badgeVariant === "fail" ? "bsp-fail" : ""}`}>
              {currentSection.badge}
            </span>
            <div className="bsp-card-header-text">
              <h2>{currentSection.title}</h2>
              <p>{currentSection.subtitle}</p>
            </div>
          </div>

          <div className="bsp-items-list">
            {currentSection.questions.map((question) => (
              <div
                key={question.id}
                className="bsp-checklist-item"
                onClick={() => handleToggle(question.id)}
              >
                <div className="bsp-item-main">
                  <div
                    className={`bsp-custom-check ${
                      answers[question.id]
                        ? question.type === "fail"
                          ? "bsp-checked-fail"
                          : "bsp-checked-pass"
                        : ""
                    }`}
                  >
                    {question.type === "fail" ? (
                      <X size={10} strokeWidth={3} />
                    ) : (
                      <Check size={12} strokeWidth={3} />
                    )}
                  </div>
                  <div className="bsp-item-content">
                    <div className="bsp-item-label">
                      <span className={`bsp-item-type bsp-type-${question.type}`}>
                        {question.type === "fail" && "Disqualifier"}
                        {question.type === "pass" && "Pass"}
                        {question.type === "signal" && "Signal"}
                      </span>
                    </div>
                    <div className="bsp-item-title">{question.title}</div>
                    <div className="bsp-item-desc">{question.description}</div>
                    {question.note && (
                      <div className="bsp-item-note">
                        <strong>Note:</strong> {question.note}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentSection.id === "disqualifiers" && failCheckedCount > 0 && (
            <div className="bsp-fail-alert">
              <AlertCircle size={14} />
              {failCheckedCount === 1
                ? "1 disqualifying item is checked. Review before proceeding to results."
                : `${failCheckedCount} disqualifying items are checked. This deal cannot be submitted.`}
            </div>
          )}

          <div className="bsp-card-footer">
            {currentStep > 0 ? (
              <button className="bsp-btn bsp-btn-back" onClick={handleBack}>
                <ArrowLeft size={14} />
                Back
              </button>
            ) : (
              <span className="bsp-progress-hint">Step {currentStep + 1} of {totalSteps}</span>
            )}
            
            {currentStep === 0 && <span />}

            {isLastStep ? (
              <button className="bsp-btn bsp-btn-submit" onClick={handleViewResults}>
                View Results
                <ArrowRight size={14} />
              </button>
            ) : (
              <button className="bsp-btn bsp-btn-next" onClick={handleNext}>
                Continue
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bsp-footer">
          <p>
            <Link href="/brokers">← Back to Brokers Page</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
