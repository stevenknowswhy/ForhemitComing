"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  TWO_MINUTE_CHECK_STEPS,
  allYes,
  getFirstNoStep,
  type TwoMinuteCheckStep,
  type TwoMinuteCheckStepId,
} from "./lib/twoMinuteCheck";

type Props = {
  onRequestClose: () => void;
  /** User passed — continue to congratulations / 4-month path (e.g. navigate) */
  onPassProceed: () => void;
};

type Phase = "questions" | "result";

export function TwoMinuteCheckFlow({ onRequestClose, onPassProceed }: Props) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<"yes" | "no" | null>(null);
  const [answers, setAnswers] = useState<Partial<Record<TwoMinuteCheckStepId, "yes" | "no">>>({});
  /** Snapshot when finishing Q5 — avoids stale state when rendering the result view */
  const [resultAnswers, setResultAnswers] = useState<Partial<
    Record<TwoMinuteCheckStepId, "yes" | "no">
  > | null>(null);
  const [phase, setPhase] = useState<Phase>("questions");

  const step: TwoMinuteCheckStep | undefined = TWO_MINUTE_CHECK_STEPS[idx];

  useEffect(() => {
    if (!step) return;
    setSel(answers[step.id] ?? null);
  }, [idx, step, answers]);

  function reset() {
    setIdx(0);
    setSel(null);
    setAnswers({});
    setResultAnswers(null);
    setPhase("questions");
  }

  const back = () => {
    if (phase === "result") {
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
      setPhase("result");
      return;
    }
    setAnswers(nextAnswers);
    setIdx((i) => i + 1);
  };

  const outcome = resultAnswers ?? {};
  const passed = phase === "result" && allYes(outcome);
  const pendingFirstNo = phase === "result" ? getFirstNoStep(outcome) : null;

  const headerStepLabel =
    phase === "result" ? "Complete" : step ? `${idx + 1} / ${TWO_MINUTE_CHECK_STEPS.length}` : "";

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

            <p className="ci-hint">{step.hint}</p>

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

        {phase === "result" && (
          <div className="ci-frame ci-result">
            <p className="ci-r-type">2-Minute Check</p>
            {passed ? (
              <>
                <h2 className="ci-r-headline">Congratulations — you&apos;re a strong fit.</h2>
                <p className="ci-r-sub">
                  Based on your answers, you could likely close in about four months. Next, see the same
                  month-by-month path we use with owners—plain English, no surprises.
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
                <h2 className="ci-r-headline">
                  This path works best for businesses with{" "}
                  <span className="ci-brass">
                    {pendingFirstNo?.noThresholdPhrase ?? "these qualifiers"}
                  </span>
                  . You may need a traditional sale.
                </h2>
                <div className="ci-r-actions">
                  <Link href="/brokers" className="ci-cta-primary">
                    Find a Broker →
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
        <span className="ci-ft-note">Your answers stay private and are not stored unless you continue.</span>
        <span className="ci-ft-note">© Forhemit</span>
      </footer>
    </div>
  );
}
