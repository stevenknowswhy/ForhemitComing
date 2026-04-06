"use client";

import { useState, useCallback } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { NDA_STEPS, NON_NDA_STEPS } from "../constants";
import {
  PathStep,
  NdaStep,
  ContactStep,
  BusinessStep,
  FinancialsStep,
  SituationStep,
  DoneStep,
} from "./intake-steps";

interface ConfidentialIntakeModalProps {
  isOpen: boolean;
  defaultPath?: "nda" | "light" | null;
  onClose: () => void;
}

export function ConfidentialIntakeModal({
  isOpen,
  defaultPath,
  onClose,
}: ConfidentialIntakeModalProps) {
  const [path, setPath] = useState<"nda" | "light" | null>(defaultPath ?? null);
  const [stepIdx, setStepIdx] = useState(defaultPath ? 1 : 0);
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [ebitdaIdx, setEbitdaIdx] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContact = useMutation(api.contactSubmissions.submit);
  const sendIntakeNotification = useAction(api.emails.sendConfidentialIntakeNotification);

  const steps = path === "nda" ? NDA_STEPS : NON_NDA_STEPS;
  const currentStep = steps[stepIdx];

  const handleClose = () => {
    setPath(defaultPath ?? null);
    setStepIdx(defaultPath ? 1 : 0);
    setForm({});
    setAgreed(false);
    setSigned(false);
    setEbitdaIdx(2);
    setIsSubmitting(false);
    onClose();
  };

  const setField = useCallback(
    (k: string, v: string) => setForm((f) => ({ ...f, [k]: v })),
    [],
  );

  const canAdvance = () => {
    if (isSubmitting) return false;
    if (!currentStep) return false;
    switch (currentStep.id) {
      case "path":
        return !!path;
      case "nda":
        return agreed && signed;
      case "contact":
        return !!(form.name && form.email && form.phone);
      case "business":
        return !!(form.bizName && form.industry && form.employees);
      case "financials":
      case "situation":
        return currentStep.id === "financials" || !!form.timeline;
      default:
        return true;
    }
  };

  const submitIntake = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const nameParts = (form.name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const intakePath = path || "light";
    const messageLines = [
      `Intake path: ${intakePath === "nda" ? "Confidential (NDA signed)" : "Light intake"}`,
      form.bizName ? `Business: ${form.bizName}` : "",
      form.state ? `State: ${form.state}` : "",
      form.industry ? `Industry: ${form.industry}` : "",
      form.employees ? `Employees: ${form.employees}` : "",
      form.years ? `Years: ${form.years}` : "",
      form.ebitda ? `EBITDA: ${form.ebitda}` : "",
      form.entity ? `Entity: ${form.entity}` : "",
      form.timeline ? `Timeline: ${form.timeline}` : "",
      form.notes ? `Notes: ${form.notes}` : "",
    ].filter(Boolean).join("\n");

    try {
      await submitContact({
        contactType: "business-owner",
        firstName,
        lastName,
        email: form.email || "",
        phone: form.phone,
        company: form.bizName,
        interest: "esop-transition",
        message: messageLines,
        source: `business-owners-intake-${intakePath}`,
      });
    } catch (err) {
      console.error("Convex submission error:", err);
    }

    try {
      await sendIntakeNotification({
        path: intakePath,
        name: form.name || "",
        email: form.email || "",
        phone: form.phone || "",
        role: form.role || undefined,
        bizName: form.bizName || undefined,
        state: form.state || undefined,
        industry: form.industry || undefined,
        employees: form.employees || undefined,
        years: form.years || undefined,
        ebitda: form.ebitda || undefined,
        entity: form.entity || undefined,
        timeline: form.timeline || undefined,
        notes: form.notes || undefined,
        ndaSigned: intakePath === "nda" ? true : undefined,
      });
    } catch (err) {
      console.error("Notification error:", err);
    }

    setIsSubmitting(false);
  };

  const advance = async () => {
    if (stepIdx >= steps.length - 1) return;

    const nextStep = steps[stepIdx + 1];
    if (nextStep?.id === "done") {
      await submitIntake();
    }
    setStepIdx((i) => i + 1);
  };

  const back = () => {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const selectPath = (p: "nda" | "light") => {
    setPath(p);
    setStepIdx(1);
  };

  const totalActiveSteps = steps.filter(
    (s) => s.id !== "path" && s.id !== "done",
  ).length;
  const currentActiveIdx = steps
    .slice(0, stepIdx)
    .filter((s) => s.id !== "path" && s.id !== "done").length;

  if (!isOpen) return null;

  const modalTitle = (() => {
    switch (currentStep?.id) {
      case "path":
        return "How would you like to start?";
      case "nda":
        return "A quick confidentiality agreement";
      case "contact":
        return "Let\u2019s start with you";
      case "business":
        return "Tell us about the business";
      case "financials":
        return "Financial snapshot";
      case "situation":
        return "Your situation";
      case "done":
        return "We\u2019ll be in touch";
      default:
        return "";
    }
  })();

  const headerLabel =
    currentStep?.id === "done"
      ? "All done"
      : path === "nda"
        ? "Confidential Intake"
        : "Quick Overview";

  return (
    <div
      className="ci-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="ci-modal" role="dialog" aria-modal="true">
        <div className="ci-header">
          <div>
            <p className="ci-header-label">{headerLabel}</p>
            <h2 className="ci-header-title">{modalTitle}</h2>
          </div>
          <button
            className="ci-close"
            onClick={handleClose}
            type="button"
            aria-label="Close"
          >
            &#10005;
          </button>
        </div>

        <div className="ci-body">
          {currentStep?.id !== "path" && currentStep?.id !== "done" && (
            <div className="ci-step-prog">
              {Array.from({ length: totalActiveSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`ci-step-seg ${i < currentActiveIdx ? "ci-seg-done" : i === currentActiveIdx ? "ci-seg-active" : ""}`}
                />
              ))}
            </div>
          )}

          {currentStep?.id === "path" && !path && (
            <PathStep path={path} onSelect={selectPath} />
          )}

          {currentStep?.id === "nda" && (
            <NdaStep
              agreed={agreed}
              signed={signed}
              onAgreeToggle={() => setAgreed((a) => !a)}
              onSign={() => setSigned(true)}
              onClearSig={() => setSigned(false)}
              onBack={back}
              onAdvance={advance}
              canAdvance={canAdvance()}
            />
          )}

          {currentStep?.id === "contact" && (
            <ContactStep
              form={form}
              setField={setField}
              onBack={back}
              onAdvance={advance}
              canAdvance={canAdvance()}
            />
          )}

          {currentStep?.id === "business" && (
            <BusinessStep
              form={form}
              setField={setField}
              onBack={back}
              onAdvance={advance}
              canAdvance={canAdvance()}
            />
          )}

          {currentStep?.id === "financials" && (
            <FinancialsStep
              form={form}
              setField={setField}
              ebitdaIdx={ebitdaIdx}
              onEbitdaChange={setEbitdaIdx}
              onBack={back}
              onAdvance={advance}
              canAdvance={canAdvance()}
            />
          )}

          {currentStep?.id === "situation" && (
            <SituationStep
              form={form}
              setField={setField}
              onBack={back}
              onAdvance={advance}
              canAdvance={canAdvance()}
            />
          )}

          {currentStep?.id === "done" && (
            <DoneStep
              path={path}
              name={form.name}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
