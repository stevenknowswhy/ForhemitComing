"use client";

import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { deriveClientType, getRoadmap, hasLenderTrack, buildPreCOOP } from "./lib/derivations";
import { getVisible, isComplete } from "./lib/steps";
import { saveClassification } from "./lib/mockApi";
import { ClassificationIntakeResult } from "./components/ClassificationIntakeResult";
import type { IntakeAnswers, IntakePhase, IntakeResultState, IntakeRole } from "./types";

type Props = {
  initialRole: IntakeRole;
  onRequestClose: () => void;
};

export function ClassificationIntakeFlow({ initialRole, onRequestClose }: Props) {
  const [committed, setCommitted] = useState<IntakeAnswers>({ role: initialRole });
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<string | string[] | null>(null);
  const [phase, setPhase] = useState<IntakePhase>("intake");
  const [result, setResult] = useState<IntakeResultState | null>(null);
  const sendNotification = useAction(api.emails.sendClassificationIntakeNotification);

  const visible = getVisible(committed);
  const step = visible[idx] ?? null;
  const isLender = step?.lender === true;

  useEffect(() => {
    if (!step) return;
    const cur = committed[step.field];
    setSel(step.multi ? (Array.isArray(cur) ? cur : []) : cur ?? null);
  }, [idx, step, committed]);

  function reset() {
    setCommitted({ role: initialRole });
    setIdx(0);
    setSel(null);
    setPhase("intake");
    setResult(null);
  }

  const advance = async () => {
    if (!step) return;
    const selEmpty = step.multi ? (sel as string[] | undefined)?.length === 0 : !sel;
    if (selEmpty) return;
    const next: IntakeAnswers = { ...committed, [step.field]: sel as never };

    if (isComplete(next)) {
      setCommitted(next);
      setPhase("loading");
      const type = deriveClientType(next);
      const res = await saveClassification({ ...next, clientType: type?.type }, sendNotification);
      const roadmap = getRoadmap(type?.type, next);
      const preCOOP = hasLenderTrack(next) ? buildPreCOOP(next, res.clientId) : null;
      setResult({
        type: type?.type,
        label: type?.label,
        clientId: res.clientId,
        closeUrgency: next.closeUrgency,
        roadmap,
        preCOOP,
      });
      setPhase("result");
    } else {
      setCommitted(next);
      setIdx((i) => i + 1);
    }
  };

  const back = () => {
    if (idx > 0) {
      setIdx((i) => i - 1);
    } else {
      onRequestClose();
    }
  };

  const hasSelection = step?.multi ? ((sel as string[] | undefined)?.length ?? 0) > 0 : !!sel;
  const pendingAnswers = step ? { ...committed, [step.field]: sel as never } : committed;
  const btnLabel = hasSelection && isComplete(pendingAnswers) ? "See Your Roadmap" : "Continue";

  const headerStepLabel =
    phase === "result" ? "Complete" : step ? `${idx + 1} / ${visible.length}` : "";

  return (
    <div className="ci-flow">
      <header className="ci-hd">
        <span className="ci-hd-mark">Forhemit</span>
        <span className="ci-hd-step">{headerStepLabel}</span>
      </header>

      <div className="ci-body">
        {phase === "intake" && step && (
          <div className="ci-frame" key={step.id}>
            <div className="ci-prog">
              {visible.map((_, i) => (
                <div
                  key={i}
                  className={`ci-prog-seg ${i < idx ? "ci-done" : i === idx ? "ci-active" : ""}`}
                />
              ))}
            </div>

            {isLender && <p className="ci-q-eyebrow">Lender Track</p>}
            {!isLender && <p className="ci-q-eyebrow">Your situation</p>}

            <h2 className="ci-q-text">{step.label}</h2>

            <div className="ci-opts">
              {step.options.map((o) => {
                const isSelected = step.multi
                  ? (sel as string[] | undefined)?.includes(o.value)
                  : sel === o.value;
                const handleClick = () => {
                  if (step.multi) {
                    const current = (sel as string[]) ?? [];
                    setSel(
                      current.includes(o.value) ? current.filter((v) => v !== o.value) : [...current, o.value]
                    );
                  } else {
                    setSel(o.value);
                  }
                };
                return (
                  <button
                    key={o.value}
                    type="button"
                    className={`ci-opt ${isSelected ? "ci-sel" : ""}`}
                    onClick={handleClick}
                  >
                    <span className="ci-opt-left">
                      <span className="ci-opt-label">{o.label}</span>
                      <span className="ci-opt-sub">{o.sub}</span>
                    </span>
                    <span className="ci-opt-arrow">{isSelected ? "→" : "↗"}</span>
                  </button>
                );
              })}
            </div>

            {step.hint && <p className="ci-hint">{step.hint}</p>}

            <div className="ci-nav">
              <button type="button" className="ci-btn-back" onClick={back}>
                ← Back
              </button>
              <button type="button" className="ci-btn-go" disabled={!hasSelection} onClick={advance}>
                {btnLabel}
              </button>
            </div>
          </div>
        )}

        {phase === "loading" && (
          <div className="ci-load">
            <div className="ci-load-line" />
            <p className="ci-load-label">Preparing your roadmap</p>
            <p className="ci-load-sub">
              {committed.closeUrgency === "fast"
                ? "Configuring fast-close track — prioritizing financials and lender package"
                : committed.selling === "yes" || committed.role === "broker"
                  ? "Building lender profile and pre-COOP document"
                  : "Assembling your continuity plan"}
            </p>
          </div>
        )}

        {phase === "result" && result && (
          <ClassificationIntakeResult result={result} onRestart={reset} />
        )}
      </div>

      <footer className="ci-ft">
        <span className="ci-ft-note">Your information is encrypted and never shared without consent.</span>
        <span className="ci-ft-note">© Forhemit</span>
      </footer>
    </div>
  );
}
