"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "./components/ProgressBar";
import { IntroStep, PositionsStep, NameStep, EmailStep, PhoneStep, PositionStep, PreviewStep, SuccessStep } from "./steps";
import { ApplicationData, TOTAL_STEPS } from "./types";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM_DATA: ApplicationData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  position: "",
  otherPosition: "",
  resumeUrl: ""
};

export function ApplicationModal({ isOpen, onClose }: ApplicationModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [formData, setFormData] = useState<ApplicationData>(INITIAL_FORM_DATA);
  const [submitWithoutResume, setSubmitWithoutResume] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS + 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleClose = () => {
    setStep(1);
    setSelectedPosition("");
    setFormData(INITIAL_FORM_DATA);
    setSubmitWithoutResume(false);
    onClose();
    router.push("/", { scroll: false });
  };

  const updateFormField = <K extends keyof ApplicationData>(field: K, value: ApplicationData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = useCallback(() => {
    switch (step) {
      case 3: return !!(formData.firstName.trim() && formData.lastName.trim());
      case 4: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 5: return formData.phone.replace(/\D/g, "").length === 10;
      default: return true;
    }
  }, [step, formData]);

  const canSubmit = useCallback(() => {
    return !!(formData.position && 
      (formData.position !== "Other" || formData.otherPosition.trim()) && 
      (submitWithoutResume || formData.resumeUrl));
  }, [formData, submitWithoutResume]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
    if (e.key === "Enter" && step >= 3 && step <= 5) {
      e.preventDefault();
      if (canProceed()) nextStep();
    }
  }, [step, canProceed]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <button className="modal-close" onClick={handleClose}>&times;</button>
      <div className="modal-content">
        <ProgressBar currentStep={step} />

        <div className={`modal-grid ${step === 2 ? 'image-top' : ''}`}>
          <div className="modal-image-side">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/recruit-face.jpg" alt="Join Forhemit" className="portrait-img"/>
          </div>

          <div className="modal-form-side">
            {step === 1 && <IntroStep onContinue={nextStep} />}

            {step === 2 && (
              <PositionsStep
                onBack={prevStep}
                onContinue={nextStep}
                onSelectPosition={(position) => {
                  setSelectedPosition(position);
                  // Map position names to match POSITIONS array
                  const mappedPosition = position.replace(" (COO)", "");
                  setFormData(prev => ({ ...prev, position: mappedPosition }));
                  nextStep();
                }}
              />
            )}

            {step === 3 && (
              <NameStep
                firstName={formData.firstName}
                lastName={formData.lastName}
                onChange={(field, value) => updateFormField(field, value)}
                onContinue={nextStep}
                onBack={prevStep}
                canProceed={canProceed()}
              />
            )}

            {step === 4 && (
              <EmailStep
                email={formData.email}
                onChange={(value) => updateFormField("email", value)}
                onContinue={nextStep}
                onBack={prevStep}
                canProceed={canProceed()}
              />
            )}

            {step === 5 && (
              <PhoneStep
                phone={formData.phone}
                onChange={(value) => updateFormField("phone", value)}
                onContinue={nextStep}
                onBack={prevStep}
                canProceed={canProceed()}
              />
            )}

            {step === 6 && (
              <PositionStep
                position={formData.position}
                otherPosition={formData.otherPosition}
                resumeUrl={formData.resumeUrl}
                submitWithoutResume={submitWithoutResume}
                onPositionChange={(value) => updateFormField("position", value)}
                onOtherPositionChange={(value) => updateFormField("otherPosition", value)}
                onResumeUpload={(url) => updateFormField("resumeUrl", url)}
                onResumeRemove={() => updateFormField("resumeUrl", "")}
                onToggleWithoutResume={setSubmitWithoutResume}
                onContinue={nextStep}
                onBack={prevStep}
                canSubmit={canSubmit()}
              />
            )}

            {step === 7 && (
              <PreviewStep
                formData={formData}
                onSubmit={nextStep}
                onBack={prevStep}
              />
            )}

            {step === 8 && <SuccessStep onClose={handleClose} />}
          </div>
        </div>
      </div>
    </div>
  );
}
