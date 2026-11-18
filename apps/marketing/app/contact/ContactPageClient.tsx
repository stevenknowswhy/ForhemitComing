"use client";

import { useState, lazy, Suspense } from "react";
import { ContactFormExperience } from "../components/contact/ContactFormExperience";
import "./contact-page.css";

const TwoMinuteCheckModal = lazy(() =>
  import("@/app/home/intake").then((mod) => ({ default: mod.TwoMinuteCheckModal }))
);

export function ContactPageClient() {
  const [showCheck, setShowCheck] = useState(false);

  return (
    <div className="contact-page-outer">
      <div className="contact-page-header">
        <p className="contact-page-eyebrow">Contact / Start assessment</p>
        <h1 className="contact-page-title">Two minutes to an honest answer.</h1>
        <p className="contact-page-intro">
          The free assessment is five yes-or-no questions — the same screen we
          apply to every business — followed by your contact details. It takes
          about two minutes. Your answers are confidential, saved for review by
          Stefano Stokes, and never shared.
        </p>
        <button
          type="button"
          className="form-btn form-btn-primary contact-page-assessment-btn"
          onClick={() => setShowCheck(true)}
        >
          Start the free assessment
        </button>
      </div>
      <div className="contact-page-shell">
        <ContactFormExperience source="contact-page" variant="page" />
      </div>
      {showCheck && (
        <Suspense fallback={null}>
          <TwoMinuteCheckModal
            isOpen={showCheck}
            onClose={() => setShowCheck(false)}
            onPassProceed={() => {
              setShowCheck(false);
              document
                .querySelector(".contact-page-shell")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
