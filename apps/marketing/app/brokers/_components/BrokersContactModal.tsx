"use client";

import { useEffect, useMemo, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ModalDialog } from "../../components/ui/ModalDialog";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/ui/Toast";
import "./brokers-contact-modal.css";

type BrokersContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
};

type FormData = {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email: string;
  messageType: string;
  message: string;
};

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  email: "",
  messageType: "",
  message: "",
};

export function BrokersContactModal({
  isOpen,
  onClose,
  source = "brokers_footer_modal",
}: BrokersContactModalProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submitContact = useMutation(api.contactSubmissions.submit);
  const sendContactNotification = useAction(api.emails.sendContactFormNotification);
  const { toasts, removeToast, success, error: showError } = useToast();

  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()),
    [formData.email]
  );
  const canGoStepTwo = useMemo(() => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.company.trim() !== ""
    );
  }, [formData.firstName, formData.lastName, formData.company]);
  const canGoStepThree = useMemo(() => {
    return formData.email.trim() !== "" && isValidEmail;
  }, [formData.email, isValidEmail]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM);
      setCurrentStep(1);
      setIsSubmitting(false);
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleChange =
    (field: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const company = formData.company.trim();
    const email = formData.email.trim().toLowerCase();
    const messageType = formData.messageType.trim();
    const message = formData.message.trim();

    if (!firstName || !lastName || !company || !email || !messageType || !message) {
      showError("Please complete all required fields.");
      return;
    }

    if (!isValidEmail) {
      showError("Please enter a valid email address.");
      return;
    }

    const composedMessage = `Message type: ${messageType}\n\n${message}`;

    setIsSubmitting(true);
    try {
      await submitContact({
        contactType: "partner",
        interest: "broker",
        firstName,
        lastName,
        email,
        phone: formData.phone.trim() || undefined,
        company,
        message: composedMessage,
        source,
      });

      await sendContactNotification({
        firstName,
        lastName,
        email,
        phone: formData.phone.trim() || undefined,
        company,
        contactType: "partner",
        interest: "broker",
        message: composedMessage,
        source,
      });

      setSubmitted(true);
      success("Message sent. Our team will follow up shortly.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unable to send your message right now.";
      if (errorMessage.includes("Duplicate submission")) {
        showError("You recently submitted this form. Please wait a moment and try again.");
      } else {
        showError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <ModalDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Broker introduction"
        overlayClassName="brk-modal-overlay"
        className="classification-modal-content brk-contact-modal-content"
        contentClassName="classification-modal-scroll"
        closeButtonClassName="modal-close"
        closeButtonAriaLabel="Close broker form"
      >
        <div className="brk-contact-flow">
          <header className="brk-contact-header">
            <p className="brk-contact-eyebrow">Broker outreach</p>
            <h3 className="brk-contact-title">Send us a confidential seller note</h3>
            <p className="brk-contact-subtitle">
              Fast intake, styled like our 2-minute flow. Your message is delivered to our inbox and Telegram.
            </p>
          </header>

          {submitted ? (
            <div className="brk-contact-success">
              <p className="brk-contact-success-title">Message received.</p>
              <p className="brk-contact-success-body">
                We will respond quickly with next steps for your listing.
              </p>
              <div className="brk-contact-actions">
                <button
                  type="button"
                  className="brk-contact-btn brk-contact-btn-secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(1);
                    setFormData(INITIAL_FORM);
                  }}
                >
                  Send another
                </button>
                <button type="button" className="brk-contact-btn brk-contact-btn-primary" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form className="brk-contact-form" onSubmit={handleSubmit}>
              <div className="brk-contact-progress-wrap" aria-label="Form progress">
                <p className="brk-contact-progress-label">Step {currentStep} of 3</p>
                <div className="brk-contact-progress">
                  {[1, 2, 3].map((step) => (
                    <span
                      key={step}
                      className={`brk-contact-progress-seg ${step < currentStep ? "is-done" : ""} ${
                        step === currentStep ? "is-active" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {currentStep === 1 ? (
                <div className="brk-contact-grid">
                  <label className="brk-contact-field">
                    <span>First name *</span>
                    <input value={formData.firstName} onChange={handleChange("firstName")} autoComplete="given-name" />
                  </label>
                  <label className="brk-contact-field">
                    <span>Last name *</span>
                    <input value={formData.lastName} onChange={handleChange("lastName")} autoComplete="family-name" />
                  </label>
                  <label className="brk-contact-field brk-contact-field-full">
                    <span>Company *</span>
                    <input value={formData.company} onChange={handleChange("company")} autoComplete="organization" />
                  </label>
                </div>
              ) : null}

              {currentStep === 2 ? (
                <div className="brk-contact-grid">
                  <label className="brk-contact-field">
                    <span>Phone</span>
                    <input type="tel" value={formData.phone} onChange={handleChange("phone")} autoComplete="tel" />
                  </label>
                  <label className="brk-contact-field">
                    <span>Email *</span>
                    <input type="email" value={formData.email} onChange={handleChange("email")} autoComplete="email" />
                  </label>
                </div>
              ) : null}

              {currentStep === 3 ? (
                <div className="brk-contact-grid">
                  <label className="brk-contact-field brk-contact-field-full">
                    <span>Type of message *</span>
                    <select value={formData.messageType} onChange={handleChange("messageType")}>
                      <option value="">Select message type</option>
                      <option value="New listing introduction">New listing introduction</option>
                      <option value="Dual-track question">Dual-track question</option>
                      <option value="Confidential fit read request">Confidential fit read request</option>
                      <option value="Partnership question">Partnership question</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="brk-contact-field brk-contact-field-full">
                    <span>Message *</span>
                    <textarea
                      rows={6}
                      value={formData.message}
                      onChange={handleChange("message")}
                      placeholder="Share listing context, timing, and what help you want from us."
                    />
                  </label>
                </div>
              ) : null}

              <div className="brk-contact-footer">
                <p className="brk-contact-note">
                  Prefer direct email?{" "}
                  <a href="mailto:brokers@forhemit.com?subject=Broker%20introduction%20%E2%80%94%20dual-track%20ESOP">
                    brokers@forhemit.com
                  </a>
                </p>
                <div className="brk-contact-actions">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      className="brk-contact-btn brk-contact-btn-secondary"
                      onClick={() => setCurrentStep((currentStep - 1) as 1 | 2 | 3)}
                    >
                      Back
                    </button>
                  ) : null}

                  {currentStep === 1 ? (
                    <button
                      type="button"
                      className="brk-contact-btn brk-contact-btn-primary"
                      onClick={() => setCurrentStep(2)}
                      disabled={!canGoStepTwo}
                    >
                      Continue
                    </button>
                  ) : null}

                  {currentStep === 2 ? (
                    <button
                      type="button"
                      className="brk-contact-btn brk-contact-btn-primary"
                      onClick={() => setCurrentStep(3)}
                      disabled={!canGoStepThree}
                    >
                      Continue
                    </button>
                  ) : null}

                  {currentStep === 3 ? (
                    <button
                      type="submit"
                      className="brk-contact-btn brk-contact-btn-primary"
                      disabled={isSubmitting || formData.messageType.trim() === "" || formData.message.trim() === ""}
                    >
                      {isSubmitting ? "Sending..." : "Send message"}
                    </button>
                  ) : null}
                </div>
              </div>
            </form>
          )}
        </div>
      </ModalDialog>
    </>
  );
}
