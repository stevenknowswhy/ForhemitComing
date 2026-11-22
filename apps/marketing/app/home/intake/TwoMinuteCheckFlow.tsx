"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  TWO_MINUTE_CHECK_STEPS,
  allYes,
  getFailedSteps,
  type TwoMinuteCheckStep,
  type TwoMinuteCheckStepId,
} from "./lib/twoMinuteCheck";

/* ── Anonymous metadata questions (spec 2026-11-18) ──────────────────────
   Asked before the five criteria. The answers are recorded anonymously —
   see the footer note and packages/convex/convex/checkResponses.ts.
   No name, email, phone, company name, or free text is ever collected
   by this flow. */

type CheckRole = "founder" | "professional";
type ProfessionalType = "broker" | "cpa" | "attorney" | "wealth_manager" | "other";
type Industry =
  | "construction"
  | "manufacturing"
  | "healthcare"
  | "professional_services"
  | "retail_food_hospitality"
  | "technology"
  | "transportation_logistics"
  | "other";

type MetaAnswers = {
  role?: CheckRole;
  professionalType?: ProfessionalType;
  industry?: Industry;
};

type MetaOption = { value: string; label: string; sub?: string };
type MetaStep = {
  id: "role" | "professionalType" | "industry";
  question: string;
  options: MetaOption[];
};

const ROLE_STEP: MetaStep = {
  id: "role",
  question: "Are you a founder or a professional?",
  options: [
    { value: "founder", label: "Founder", sub: "I own the business" },
    { value: "professional", label: "Professional", sub: "I advise business owners" },
  ],
};

const PROFESSIONAL_TYPE_STEP: MetaStep = {
  id: "professionalType",
  question: "Which best describes you?",
  options: [
    { value: "broker", label: "Broker" },
    { value: "cpa", label: "CPA" },
    { value: "attorney", label: "Attorney" },
    { value: "wealth_manager", label: "Wealth Manager" },
    { value: "other", label: "Other" },
  ],
};

const INDUSTRY_STEP: MetaStep = {
  id: "industry",
  question: "What industry is the business in?",
  options: [
    { value: "construction", label: "Construction & specialty trades" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "healthcare", label: "Healthcare" },
    { value: "professional_services", label: "Professional services" },
    { value: "retail_food_hospitality", label: "Retail, food & hospitality" },
    { value: "technology", label: "Technology" },
    { value: "transportation_logistics", label: "Transportation & logistics" },
    { value: "other", label: "Other" },
  ],
};

function metaStepsFor(role: CheckRole | undefined): MetaStep[] {
  const steps: MetaStep[] = [ROLE_STEP];
  if (role === "professional") steps.push(PROFESSIONAL_TYPE_STEP);
  steps.push(INDUSTRY_STEP);
  return steps;
}

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
  const [stage, setStage] = useState<"meta" | "criteria">("meta");
  const [metaIdx, setMetaIdx] = useState(0);
  const [metaSel, setMetaSel] = useState<string | null>(null);
  const [meta, setMeta] = useState<MetaAnswers>({});
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<"yes" | "no" | null>(null);
  const [answers, setAnswers] = useState<Partial<Record<TwoMinuteCheckStepId, "yes" | "no">>>({});
  /** Snapshot when finishing Q5 — avoids stale state when rendering the result view */
  const [resultAnswers, setResultAnswers] = useState<Partial<
    Record<TwoMinuteCheckStepId, "yes" | "no">
  > | null>(null);
  const [phase, setPhase] = useState<Phase>("questions");
  const [analysisIdx, setAnalysisIdx] = useState(0);

  const recordResponse = useMutation(api.checkResponses.record);

  /* W8 funnel: the flow only mounts when the check is opened. */
  useEffect(() => {
    track("check_started");
  }, []);

  const metaSteps = metaStepsFor(meta.role);
  const metaStep: MetaStep | undefined = stage === "meta" ? metaSteps[metaIdx] : undefined;
  const step: TwoMinuteCheckStep | undefined =
    stage === "criteria" ? TWO_MINUTE_CHECK_STEPS[idx] : undefined;

  useEffect(() => {
    if (!step) return;
    setSel(answers[step.id] ?? null);
  }, [idx, step, answers]);

  useEffect(() => {
    if (stage !== "meta") return;
    const s = metaSteps[metaIdx];
    if (s) setMetaSel(meta[s.id] ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, metaIdx, meta]);

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
    setStage("meta");
    setMetaIdx(0);
    setMetaSel(null);
    setMeta({});
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
    if (stage === "meta") {
      if (metaIdx > 0) {
        setMetaIdx((i) => i - 1);
      } else {
        onRequestClose();
      }
      return;
    }
    if (idx > 0) {
      setIdx((i) => i - 1);
    } else {
      setStage("meta");
      setMetaIdx(metaSteps.length - 1);
    }
  };

  const advanceMeta = () => {
    if (!metaStep || !metaSel) return;
    const nextMeta = { ...meta, [metaStep.id]: metaSel } as MetaAnswers;
    setMeta(nextMeta);
    const steps = metaStepsFor(nextMeta.role);
    if (metaIdx >= steps.length - 1) {
      setStage("criteria");
      return;
    }
    setMetaIdx((i) => i + 1);
  };

  const advance = () => {
    if (!step || !sel) return;
    const nextAnswers = { ...answers, [step.id]: sel };
    if (idx >= TWO_MINUTE_CHECK_STEPS.length - 1) {
      setAnswers(nextAnswers);
      setResultAnswers(nextAnswers);
      /* Anonymous metadata capture (spec 2026-11-18): fire-and-forget —
         a failed write must never block or delay the result. */
      const failed = getFailedSteps(nextAnswers);
      /* W8 funnel: anonymous outcome only — same fields as the metadata
         capture, nothing that identifies the visitor or the company. */
      track("check_completed", {
        result: failed.length === 0 ? "pass" : "not_yet",
        role: meta.role ?? "founder",
      });
      void recordResponse({
        role: meta.role ?? "founder",
        ...(meta.role === "professional" && meta.professionalType
          ? { professionalType: meta.professionalType }
          : {}),
        industry: meta.industry ?? "other",
        answers: {
          revenue: nextAnswers.revenue === "yes",
          headcount: nextAnswers.headcount === "yes",
          profitability: nextAnswers.profitability === "yes",
          timeline: nextAnswers.timeline === "yes",
          transition: nextAnswers.transition === "yes",
        },
        result: failed.length === 0 ? ("pass" as const) : failed.map((s) => s.id),
      }).catch(() => undefined);
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

  const totalSteps = metaSteps.length + TWO_MINUTE_CHECK_STEPS.length;
  const globalPos = stage === "meta" ? metaIdx : metaSteps.length + idx;
  const segments = Array.from({ length: totalSteps }, (_, i) => i);

  const headerStepLabel =
    phase === "result"
      ? "Complete"
      : phase === "analyzing"
        ? "Analyzing"
        : `${globalPos + 1} / ${totalSteps}`;

  const isLastStep = idx === TWO_MINUTE_CHECK_STEPS.length - 1;
  const btnLabel = isLastStep ? "See results" : "Continue";

  const metaHint =
    metaStep?.id === "industry" && meta.role === "professional"
      ? "Answer for the business you're thinking of — the five questions after this are about that business too."
      : undefined;

  return (
    <div className="ci-flow">
      <header className="ci-hd">
        <span className="ci-hd-mark">Forhemit</span>
        <span className="ci-hd-step">{headerStepLabel}</span>
      </header>

      <div className="ci-body">
        {phase === "questions" && stage === "meta" && metaStep && (
          <div className="ci-frame" key={metaStep.id}>
            <div className="ci-prog">
              {segments.map((i) => (
                <div
                  key={i}
                  className={`ci-prog-seg ${i < globalPos ? "ci-done" : i === globalPos ? "ci-active" : ""}`}
                />
              ))}
            </div>

            <p className="ci-q-eyebrow">2-Minute Check</p>
            <h2 className="ci-q-text">{metaStep.question}</h2>

            <div className="ci-opts">
              {metaStep.options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`ci-opt ${metaSel === o.value ? "ci-sel" : ""}`}
                  onClick={() => setMetaSel(o.value)}
                >
                  <span className="ci-opt-left">
                    <span className="ci-opt-label">{o.label}</span>
                    {o.sub && <span className="ci-opt-sub">{o.sub}</span>}
                  </span>
                  <span className="ci-opt-arrow">{metaSel === o.value ? "→" : "↗"}</span>
                </button>
              ))}
            </div>

            {metaHint && <p className="ci-hint">{metaHint}</p>}

            <div className="ci-nav">
              <button type="button" className="ci-btn-back" onClick={back}>
                ← Back
              </button>
              <button type="button" className="ci-btn-go" disabled={!metaSel} onClick={advanceMeta}>
                Continue
              </button>
            </div>
          </div>
        )}

        {phase === "questions" && stage === "criteria" && step && (
          <div className="ci-frame" key={step.id}>
            <div className="ci-prog">
              {segments.map((i) => (
                <div
                  key={i}
                  className={`ci-prog-seg ${i < globalPos ? "ci-done" : i === globalPos ? "ci-active" : ""}`}
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
        <span className="ci-ft-note">We don&apos;t collect anything that identifies you — no name, no email, no phone. We do record anonymous information: whether you&apos;re a founder or a professional, the kind of work you do, your industry, and your answers — so we can understand who this check serves. Nothing here can be traced back to you or your company.</span>
        <span className="ci-ft-note">© Forhemit</span>
      </footer>
    </div>
  );
}
