"use client";

import DOMPurify from "isomorphic-dompurify";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../ui/Toast";
import "./infrastructure-audit.css";

interface InfrastructureAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Lane = "resilience" | "stewardship" | "competitive" | null;

interface Answers {
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
}

const TOTAL_STEPS = 6; // Lane selection + 5 questions

type ResultTab = "summary" | "diagnostic" | "scorecard";

const RESULT_TABS: ResultTab[] = ["summary", "diagnostic", "scorecard"];

export function InfrastructureAuditModal({ isOpen, onClose }: InfrastructureAuditModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [lane, setLane] = useState<Lane>(null);
  const [answers, setAnswers] = useState<Answers>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
  });
  const [showResults, setShowResults] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<ResultTab>("summary");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, removeToast, success, error: showError } = useToast();

  const submitAudit = useMutation(api.contactSubmissions.submit);

  if (!isOpen) return null;

  const currentScore = Object.values(answers).reduce((sum, val) => sum + (val || 0), 0);
  const signalBars = Math.ceil(currentScore / 20);

  const handleLaneSelect = (selectedLane: Lane) => {
    setLane(selectedLane);
  };

  const handleAnswer = (question: keyof Answers, value: number) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const canProceed = () => {
    if (currentStep === 0) return lane !== null;
    const qKey = `q${currentStep}` as keyof Answers;
    return answers[qKey] !== null;
  };

  const handleNext = () => {
    if (!canProceed()) {
      showError("Please make a selection to continue");
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateResults = () => {
    if (!lane) return null;

    const score = currentScore;
    let status: "optimal" | "warning" | "critical";
    let statusLabel: string;
    let ctaText: string;

    if (score >= 80) {
      status = "optimal";
      statusLabel = "Resilient Infrastructure";
      ctaText = "Build My Architecture →";
    } else if (score >= 50) {
      status = "warning";
      statusLabel = "Critical Node Dependency";
      ctaText = "Start the Retrofit Process →";
    } else {
      status = "critical";
      statusLabel = "Structural Instability";
      ctaText = "Build My Foundation →";
    }

    return { score, status, statusLabel, ctaText };
  };

  const getDiagnosticText = (lane: Lane, status: string) => {
    const diagnostics: Record<string, Record<string, string>> = {
      resilience: {
        optimal: `Your business can already survive a <strong>3-Month Controlled Shutdown</strong>. However, "survival" is not the same as "thriving." To build true <strong>Succession Resilience</strong>, we need to engineer the <strong>Emergency Transition Protocols</strong>—the legal and operational infrastructure that triggers automatically if you step away permanently, not just temporarily.<br><br>
        <strong>What we build:</strong> The Business Continuity Grid—legal succession triggers, distributed leadership authority, and automated governance that activates without your input.`,
        warning: `Your business currently functions because you are the <strong>load-bearing wall</strong>. If you exit unexpectedly, the structure collapses within 90 days. For Lane 1 operators, this is an existential vulnerability.<br><br>
        <strong>What we build:</strong> The Dependency Retrofit—we distribute your decision-rights across the Human Grid, document your tacit knowledge into Standard Operating Procedures, and install leadership redundancies so the business doesn't just survive your absence, but maintains velocity.`,
        critical: `Your business is currently <strong>founder-fragile</strong>. If you cannot operate, there is no business to inherit. For owners who want to keep their company, this is the highest priority vulnerability.<br><br>
        <strong>What we build:</strong> The Resilience Foundation—we harden your cash flow stability, install basic continuity documentation, and build the minimum viable leadership structure required for business survival during a founder crisis.`,
      },
      stewardship: {
        optimal: `You have the load-bearing capacity for a <strong>Stewardship Transition</strong>. Cash flow, autonomy, and culture density are sufficient. The engineering challenge now is conversion: transforming a privately-held structure into an employee-owned trust without destabilizing operations.<br><br>
        <strong>What we build:</strong> The ESOP Architecture—trustee selection, valuation methodology, repurchase liability modeling, and the 3-year transition roadmap that converts your equity to employee hands while you step back gradually.`,
        warning: `You have the <strong>cultural foundation</strong> for employee ownership, but the <strong>technical infrastructure</strong> isn't ready. High founder dependency means if you transfer ownership now, the new owners (employees) inherit a system that only you know how to run.<br><br>
        <strong>What we build:</strong> The Pre-ESOP Retrofit—we install the operational autonomy and distributed leadership required <em>before</em> the legal transfer. Think of it as reinforcing the structure before changing the deed.`,
        critical: `Your business does not currently meet the structural requirements for ESOP feasibility. Either scale, stability, or autonomy is insufficient for a tax-efficient, sustainable employee ownership model.<br><br>
        <strong>What we build:</strong> The Eligibility Roadmap—we calculate exactly which benchmarks (headcount, tenure, cash flow) you need to hit to become ESOP-ready, then engineer the 24-month hardening process to get you there. We don't disqualify you—we prepare you.`,
      },
      competitive: {
        optimal: `You possess a <strong>viable ESOP alternative</strong> that serves as powerful negotiating leverage against third-party buyers. Your infrastructure is strong enough that selling to employees is genuinely competitive with selling to PE.<br><br>
        <strong>What we build:</strong> The BATNA (Best Alternative To Negotiated Agreement) Package—a professionally engineered ESOP feasibility study and preliminary valuation that you can present to buyers as a credible walk-away option. This forces external bidders to beat the employee-owned number or lose the deal.`,
        warning: `Your business <em>could</em> be employee-owned, but buyers will see through the weak points (founder dependency, thin management). To use the ESOP as leverage, we need to make it <strong>credible enough to be a believable threat</strong>.<br><br>
        <strong>What we build:</strong> The 90-Day Credibility Sprint—we rapidly retrofit your leadership gaps and document critical systems to produce a legitimate ESOP feasibility analysis. This isn't about actually doing the ESOP (unless you want to); it's about making buyers believe you could, forcing their bid up.`,
        critical: `An ESOP is not currently a <strong>credible competitive alternative</strong> to a third-party sale. If you present this to buyers, they will recognize it as a bluff, weakening your position.<br><br>
        <strong>What we build:</strong> Honest Intelligence—we assess whether rapid retrofitting can create credible leverage in your timeline, or if we should advise different negotiation tactics (earn-out structures, management buy-in options) that better fit your current infrastructure. Sometimes the best "build" is a reality check that saves you from weak positioning.`,
      },
    };

    if (!lane || !status) return "";
    return diagnostics[lane][status] || "";
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const results = calculateResults();
      if (!results) return;

      const diagnostic = getDiagnosticText(lane, results.status);

      await submitAudit({
        contactType: "business-owner",
        firstName: "Infrastructure",
        lastName: "Audit",
        email: `audit-${lane}-${results.score}@forhemit.com`,
        interest: "esop-transition",
        message: `INFRASTRUCTURE AUDIT RESULTS:
Lane: ${lane}
Score: ${results.score}/100
Status: ${results.statusLabel}

Answers:
Q1 (Cash Flow): ${answers.q1}/20
Q2 (Personnel): ${answers.q2}/20
Q3 (Autonomy): ${answers.q3}/20
Q4 (Tenure): ${answers.q4}/20
Q5 (Documentation): ${answers.q5}/20

Diagnostic: ${diagnostic}`,
        source: "infrastructure-audit",
      });

      setShowResults(true);
      success("Audit completed! Review your results below.");
    } catch (err) {
      showError("Failed to submit audit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setLane(null);
    setAnswers({ q1: null, q2: null, q3: null, q4: null, q5: null });
    setShowResults(false);
    setActiveResultTab("summary");
    onClose();
  };

  const handleScheduleCall = () => {
    window.location.href = "/introduction";
  };

  const handleResultContinue = () => {
    const currentIndex = RESULT_TABS.indexOf(activeResultTab);
    if (currentIndex < RESULT_TABS.length - 1) {
      setActiveResultTab(RESULT_TABS[currentIndex + 1]);
    }
  };

  const results = calculateResults();

  // Question configurations
  const questions = [
    {
      key: "q1" as const,
      number: 1,
      title: "Cash Flow Structural Integrity",
      description: "Does your business demonstrate 5+ years of structural integrity (consistent profitability with stable cash flow)?",
      options: [
        { value: 20, label: "Yes - 5+ years of consistent, stable profitability", points: "20 pts" },
        { value: 10, label: "Partial - 3-5 years with minor volatility", points: "10 pts" },
        { value: 0, label: "No - Less than 3 years or inconsistent cash flow", points: "0 pts" },
      ],
    },
    {
      key: "q2" as const,
      number: 2,
      title: "Personnel Grid Capacity",
      description: "What is the current capacity of your Human Grid (total full-time employees)? ESOPs typically require critical mass for tax efficiency.",
      options: [
        { value: 20, label: "20+ FTEs (Optimal for ESOP mechanics)", points: "20 pts" },
        { value: 10, label: "10-19 FTEs (Viable but less efficient)", points: "10 pts" },
        { value: 5, label: "Under 10 FTEs (Below critical mass)", points: "5 pts" },
      ],
    },
    {
      key: "q3" as const,
      number: 3,
      title: "Autonomous Operations (The 3-Month Test)",
      description: "If you initiated a 3-Month Controlled Shutdown (zero contact), would operational systems maintain autonomous function?",
      options: [
        { value: 20, label: "Yes - The business runs without my daily input", points: "20 pts" },
        { value: 10, label: "Partial - Major decisions still require me, but operations continue", points: "10 pts" },
        { value: 0, label: "No - I am the load-bearing wall; systems fail without me", points: "0 pts" },
      ],
    },
    {
      key: "q4" as const,
      number: 4,
      title: "Institutional Memory Depth",
      description: "Does your average employee tenure exceed 5 years? (High tenure proves there is legacy worth protecting through ownership)",
      options: [
        { value: 20, label: "Yes - 5+ years average tenure", points: "20 pts" },
        { value: 10, label: "Mixed - 3-5 years, some turnover", points: "10 pts" },
        { value: 0, label: "No - High turnover, mostly under 3 years", points: "0 pts" },
      ],
    },
    {
      key: "q5" as const,
      number: 5,
      title: "Knowledge Documentation Status",
      description: "Are critical business processes documented in SOPs, or do they exist only in your head (tribal knowledge)?",
      options: [
        { value: 20, label: "Documented - Critical knowledge is written, accessible, and trainable", points: "20 pts" },
        { value: 10, label: "Partial - Some documentation, but gaps in key areas", points: "10 pts" },
        { value: 0, label: "Tribal - I am the primary repository of critical business knowledge", points: "0 pts" },
      ],
    },
  ];

  const currentQuestion = currentStep > 0 && currentStep <= 5 ? questions[currentStep - 1] : null;

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="audit-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
        <div className="audit-modal-content">
          <button className="audit-modal-close" onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <div className="audit-header">
            <h1 className="audit-title">The Infrastructure Audit</h1>
            <p className="audit-subtitle">
              Determine if your business can support a succession event
            </p>

            <div className="signal-meter" style={{ opacity: currentScore > 0 ? 1 : 0.3 }}>
              <span>Signal Strength:</span>
              <div className="signal-bars">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`signal-bar ${bar <= signalBars ? "active" : ""} ${
                      currentScore < 40 ? "critical" : currentScore < 60 ? "warning" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="audit-progress">
              <div className="audit-progress-bar">
                <div 
                  className="audit-progress-fill" 
                  style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                />
              </div>
              <span className="audit-progress-text">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
            </div>
          </div>

          <div className="audit-form-container">
            {!showResults ? (
              <div className="audit-form">
                {/* Step 0: Lane Selection */}
                {currentStep === 0 && (
                  <div className="audit-step">
                    <div className="step-header-large">
                      <span className="step-number-badge">START</span>
                      <h3 className="step-title-large">Select Your Infrastructure Path</h3>
                    </div>
                    <p className="step-description-large">
                      This determines what we build together. Choose the lane that matches your current strategic position.
                    </p>

                    <div className="lane-grid-large">
                      <button
                        type="button"
                        className={`lane-card-large ${lane === "resilience" ? "selected" : ""}`}
                        onClick={() => handleLaneSelect("resilience")}
                      >
                        <span className="lane-title-large">Lane 1: Resilience</span>
                        <span className="lane-desc-large">
                          I plan to keep running my business, but need a failsafe infrastructure 
                          if I can no longer operate.
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`lane-card-large ${lane === "stewardship" ? "selected" : ""}`}
                        onClick={() => handleLaneSelect("stewardship")}
                      >
                        <span className="lane-title-large">Lane 2: Stewardship</span>
                        <span className="lane-desc-large">
                          I intend to exit completely and transfer 100% ownership to my employees 
                          within 3–5 years.
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`lane-card-large ${lane === "competitive" ? "selected" : ""}`}
                        onClick={() => handleLaneSelect("competitive")}
                      >
                        <span className="lane-title-large">Lane 3: Competitive</span>
                        <span className="lane-desc-large">
                          I intend to sell to a third party, but want a credible ESOP alternative 
                          to maximize negotiating power.
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Steps 1-5: Questions */}
                {currentQuestion && (
                  <div className="audit-step">
                    <div className="step-header-large">
                      <span className="step-number-badge">{currentQuestion.number}</span>
                      <h3 className="step-title-large">{currentQuestion.title}</h3>
                    </div>
                    <p className="step-description-large">{currentQuestion.description}</p>

                    <div className="options-grid-large">
                      {currentQuestion.options.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`option-button-large ${answers[currentQuestion.key] === opt.value ? "selected" : ""}`}
                          onClick={() => handleAnswer(currentQuestion.key, opt.value)}
                        >
                          <div className="option-radio">
                            <div className={`radio-dot ${answers[currentQuestion.key] === opt.value ? "active" : ""}`} />
                          </div>
                          <div className="option-content">
                            <span className="option-label-large">{opt.label}</span>
                          </div>
                          <span className="option-points-large">{opt.points}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="audit-navigation">
                  <button
                    type="button"
                    className="audit-nav-btn audit-nav-back"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                  </button>

                  {currentStep < TOTAL_STEPS ? (
                    <button
                      type="button"
                      className="audit-nav-btn audit-nav-next"
                      onClick={handleNext}
                    >
                      Continue
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="audit-nav-btn audit-nav-submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Calculating..." : "View Results"}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="audit-results">
                {results && (
                  <>
                    {/* Results Header - Always Visible */}
                    <div className="results-header-compact">
                      <div className="results-top-row">
                        <div className="lane-badge">
                          {lane === "resilience" && "Lane 1: Resilience"}
                          {lane === "stewardship" && "Lane 2: Stewardship"}
                          {lane === "competitive" && "Lane 3: Competitive"}
                        </div>
                        <div className={`status-badge ${results.status}`}>{results.statusLabel}</div>
                      </div>
                      <div className="results-score-row">
                        <div className={`score-display ${results.status}`}>{results.score}</div>
                        <div className="signal-meter">
                          <span>Signal:</span>
                          <div className="signal-bars">
                            {[1, 2, 3, 4, 5].map((bar) => (
                              <div
                                key={bar}
                                className={`signal-bar ${bar <= Math.ceil(results.score / 20) ? "active" : ""} ${
                                  results.score < 40 ? "critical" : results.score < 60 ? "warning" : ""
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Results Tabs */}
                    <div className="results-tabs">
                      <button
                        className={`result-tab ${activeResultTab === "summary" ? "active" : ""}`}
                        onClick={() => setActiveResultTab("summary")}
                      >
                        Summary
                      </button>
                      <button
                        className={`result-tab ${activeResultTab === "diagnostic" ? "active" : ""}`}
                        onClick={() => setActiveResultTab("diagnostic")}
                      >
                        Diagnostic
                      </button>
                      <button
                        className={`result-tab ${activeResultTab === "scorecard" ? "active" : ""}`}
                        onClick={() => setActiveResultTab("scorecard")}
                      >
                        Scorecard
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="results-tab-content">
                      {activeResultTab === "summary" && (
                        <div className="tab-panel summary-panel">
                          <div className="summary-cta">
                            <p className="summary-intro">
                              Your infrastructure score of <strong>{results.score}/100</strong> indicates 
                              <strong> {results.statusLabel}</strong>.
                            </p>
                          </div>
                        </div>
                      )}

                      {activeResultTab === "diagnostic" && (
                        <div className="tab-panel diagnostic-panel">
                          <div
                            className="diagnostic-text"
                            dangerouslySetInnerHTML={{
                              __html: getDiagnosticText(lane, results.status),
                            }}
                          />
                        </div>
                      )}

                      {activeResultTab === "scorecard" && (
                        <div className="tab-panel scorecard-panel">
                          <div className="technical-breakdown">
                            <div className="breakdown-row">
                              <span>Q1: Cash Flow Integrity:</span>
                              <span>{answers.q1}/20</span>
                            </div>
                            <div className="breakdown-row">
                              <span>Q2: Personnel Grid:</span>
                              <span>{answers.q2}/20</span>
                            </div>
                            <div className="breakdown-row">
                              <span>Q3: Operational Autonomy:</span>
                              <span>{answers.q3}/20</span>
                            </div>
                            <div className="breakdown-row">
                              <span>Q4: Institutional Memory:</span>
                              <span>{answers.q4}/20</span>
                            </div>
                            <div className="breakdown-row">
                              <span>Q5: Documentation Status:</span>
                              <span>{answers.q5}/20</span>
                            </div>
                            <div className="breakdown-row total">
                              <span>Total Infrastructure Score:</span>
                              <span>{results.score}/100</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Results Navigation */}
                    <div className="results-navigation">
                      {activeResultTab === "scorecard" ? (
                        <button
                          type="button"
                          className="audit-nav-btn audit-nav-submit"
                          onClick={handleScheduleCall}
                        >
                          Start the Retrofit Process
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="audit-nav-btn audit-nav-next"
                          onClick={handleResultContinue}
                        >
                          Continue
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
