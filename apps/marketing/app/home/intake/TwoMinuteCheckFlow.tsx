"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  TWO_MINUTE_CHECK_STEPS,
  allYes,
  getFailedSteps,
  type TwoMinuteCheckStep,
  type TwoMinuteCheckStepId,
} from "./lib/twoMinuteCheck";

type Props = {
  onRequestClose: () => void;
  /** User passed — continue to congratulations / 4-month path (e.g. navigate) */
  onPassProceed: () => void;
};

type Phase = "questions" | "analyzing" | "result";

/** Hard Effect — rotating analysis labels to show perceived work */
const ANALYSIS_LABELS = [
  "Reviewing your answers…",
  "Checking the five criteria…",
  "Confirming the details…",
  "Preparing your result…",
] as const;

export function TwoMinuteCheckFlow({ onRequestClose, onPassProceed }: Props) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<"yes" | "no" | null>(null);
  const [answers, setAnswers] = useState<Partial<Record<TwoMinuteCheckStepId, "yes" | "no">>>({});
  /** Snapshot when finishing Q5 — avoids stale state when rendering the result view */
  const [resultAnswers, setResultAnswers] = useState<Partial<
    Record<TwoMinuteCheckStepId, "yes" | "no">
  > | null>(null);
  const [phase, setPhase] = useState<Phase>("questions");
  const [analysisIdx, setAnalysisIdx] = useState(0);

  const step: TwoMinuteCheckStep | undefined = TWO_MINUTE_CHECK_STEPS[idx];

  useEffect(() => {
    if (!step) return;
    setSel(answers[step.id] ?? null);
  }, [idx, step, answers]);

  /* Hard Effect — cycle analysis labels then transition to result */
  useEffect(() => {
    if (phase !== "analyzing") return;
    const labelTimer = setInterval(() => {
      setAnalysisIdx((prev) => {
        if (prev >= ANALYSIS_LABELS.length - 1) {
          clearInterval(labelTimer);
          setTimeout(() => setPhase("result"), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 750);
    return () => clearInterval(labelTimer);
  }, [phase]);

  function reset() {
    setIdx(0);
    setSel(null);
    setAnswers({});
    setResultAnswers(null);
    setPhase("questions");
    setAnalysisIdx(0);
  }

  const back = () => {
    if (phase === "result" || phase === "analyzing") {
      reset();
      return;
    }
    if (idx > 0) {
      setIdx((i) => i - 1);
    } else {
      onRequestClose();
    }
  };

  const advance = () => {
    if (!step || !sel) return;
    const nextAnswers = { ...answers, [step.id]: sel };
    if (idx >= TWO_MINUTE_CHECK_STEPS.length - 1) {
      setAnswers(nextAnswers);
      setResultAnswers(nextAnswers);
      setAnalysisIdx(0);
      setPhase("analyzing");
      return;
    }
    setAnswers(nextAnswers);
    setIdx((i) => i + 1);
  };

  const outcome = resultAnswers ?? {};
  const passed = phase === "result" && allYes(outcome);
  const failedSteps = phase === "result" ? getFailedSteps(outcome) : [];

  const headerStepLabel =
    phase === "result"
      ? "Complete"
      : phase === "analyzing"
        ? "Analyzing"
        : step
          ? `${idx + 1} / ${TWO_MINUTE_CHECK_STEPS.length}`
          : "";

  const isLastStep = idx === TWO_MINUTE_CHECK_STEPS.length - 1;
  const btnLabel = isLastStep ? "See results" : "Continue";

  return (
    <div className="ci-flow">
      <header className="ci-hd">
        <span className="ci-hd-mark">Forhemit</span>
        <span className="ci-hd-step">{headerStepLabel}</span>
      </header>

      <div className="ci-body">
        {phase === "questions" && step && (
          <div className="ci-frame" key={step.id}>
            <div className="ci-prog">
              {TWO_MINUTE_CHECK_STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`ci-prog-seg ${i < idx ? "ci-done" : i === idx ? "ci-active" : ""}`}
                />
              ))}
            </div>

            <p className="ci-q-eyebrow">2-Minute Check</p>
            <h2 className="ci-q-text">{step.question}</h2>

            <div className="ci-opts">
              <button
                type="button"
                className={`ci-opt ${sel === "yes" ? "ci-sel" : ""}`}
                onClick={() => setSel("yes")}
              >
                <span className="ci-opt-left">
                  <span className="ci-opt-label">Yes</span>
                </span>
                <span className="ci-opt-arrow">{sel === "yes" ? "→" : "↗"}</span>
              </button>
              <button
                type="button"
                className={`ci-opt ${sel === "no" ? "ci-sel" : ""}`}
                onClick={() => setSel("no")}
              >
                <span className="ci-opt-left">
                  <span className="ci-opt-label">No</span>
                </span>
                <span className="ci-opt-arrow">{sel === "no" ? "→" : "↗"}</span>
              </button>
            </div>

            <p className="ci-hint">{step.fix}</p>

            <div className="ci-nav">
              <button type="button" className="ci-btn-back" onClick={back}>
                ← Back
              </button>
              <button type="button" className="ci-btn-go" disabled={!sel} onClick={advance}>
                {btnLabel}
              </button>
            </div>
          </div>
        )}

        {/* ── Hard Effect: Analyzing animation ── */}
        {phase === "analyzing" && (
          <div className="ci-frame ci-load">
            <div className="ci-load-line" />
            <p className="ci-load-label">Analyzing your business…</p>
            <p className="ci-load-sub" key={analysisIdx}>
              {ANALYSIS_LABELS[analysisIdx]}
            </p>
          </div>
        )}

        {phase === "result" && (
          <div className="ci-frame ci-result">
            <p className="ci-r-type">2-Minute Check</p>
            {passed ? (
              <>
                {/* Peak-End Rule: celebratory result */}
                <div className="ci-r-check" aria-hidden>✓</div>
                <h2 className="ci-r-headline">You may qualify for a Section 1042 tax-deferred exit.</h2>
                <p className="ci-r-sub">
                  Your answers meet every element of the Forhemit standard. A full
                  review — independent valuation, financing, your own advisors —
                  confirms it. Section 1042 is a tax deferral, not an exemption;
                  your tax advisor confirms how it applies to you. Next, see the
                  same month-by-month path we use with owners — plain English, no
                  surprises.
                </p>
                <div className="ci-r-actions">
                  <button type="button" className="ci-cta-primary" onClick={onPassProceed}>
                    Let&apos;s take a look at the process →
                  </button>
                  <button type="button" className="ci-cta-ghost" onClick={reset}>
                    Start over
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="ci-r-headline">Not yet a fit — and here is exactly why.</h2>
                <p className="ci-r-sub">
                  An employee-ownership transition would not serve your business
                  today. What would need to change:
                </p>
                {failedSteps.map((s) => (
                  <p key={s.id} className="ci-r-sub">
                    — {s.fix}
                  </p>
                ))}
                <p className="ci-r-sub">
                  Circumstances change. If yours do, run the check again — or
                  contact us, and we will keep the door open. No pressure, and no
                  list.
                </p>
                <div className="ci-r-actions">
                  <Link href="/contact" className="ci-cta-primary">
                    Contact us →
                  </Link>
                  <button type="button" className="ci-cta-secondary" onClick={onRequestClose}>
                    Close
                  </button>
                  <button type="button" className="ci-cta-ghost" onClick={reset}>
                    Start over
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <footer className="ci-ft">
        <span className="ci-ft-note">Confidential. Your answers are used only to show your result — never sold, never shared, never added to a marketing list.</span>
        <span className="ci-ft-note">© Forhemit</span>
      </footer>
    </div>
  );
}
