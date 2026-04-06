"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ProgressBar } from "./components/ProgressBar";
import { IntroStep, PositionsStep, NameStep, EmailStep, PhoneStep, PositionStep, PreviewStep, SuccessStep } from "./steps";
import { ApplicationData, TOTAL_STEPS } from "./types";
import { ModalDialog } from "../../ui/ModalDialog";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitApplication = useMutation(api.jobApplications.submit);
  const sendEmailNotification = useAction(api.emails.sendJobApplicationNotification);

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS + 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleClose = () => {
    setStep(1);
    setSelectedPosition("");
    setFormData(INITIAL_FORM_DATA);
    setSubmitWithoutResume(false);
    setError(null);
    setIsSubmitting(false);
    onClose();
    router.push("/", { scroll: false });
  };

  const updateFormField = <K extends keyof ApplicationData>(field: K, value: ApplicationData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user makes changes
    if (error) setError(null);
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

  const handleDialogKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter") return;
      if (step < 3 || step > 5) return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "textarea") return;

      e.preventDefault();
      if (canProceed()) nextStep();
    },
    [step, canProceed]
  );

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitApplication({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.replace(/\D/g, ""),
        position: formData.position,
        otherPosition: formData.position === "Other" ? formData.otherPosition.trim() : undefined,
        resumeUrl: formData.resumeUrl || undefined,
      });

      // Send email notification (fire and forget)
      try {
        await sendEmailNotification({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.replace(/\D/g, ""),
          position: formData.position,
          otherPosition: formData.position === "Other" ? formData.otherPosition.trim() : undefined,
          resumeUrl: formData.resumeUrl || undefined,
        });
      } catch {
        // Silent fail - don't show error to user if email fails
        console.error("Failed to send email notification");
      }

      setIsSubmitting(false);
      nextStep(); // Go to success step
    } catch (err) {
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Join Forhemit"
      overlayClassName="modal-overlay"
      className="modal-content"
      closeButtonClassName="modal-close"
      closeButtonAriaLabel="Close application"
      onKeyDown={handleDialogKeyDown}
    >
      <ProgressBar currentStep={step} />

        {error && step === 7 && (
          <div 
            className="form-error"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              padding: "12px 16px",
              borderRadius: "8px",
              margin: "0 24px 16px",
              fontSize: "14px",
              textAlign: "center"
            }}
          >
            {error}
          </div>
        )}

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
                onSubmit={handleSubmit}
                onBack={prevStep}
                isSubmitting={isSubmitting}
              />
            )}

          {step === 8 && <SuccessStep onClose={handleClose} />}
        </div>
      </div>
    </ModalDialog>
  );
}
