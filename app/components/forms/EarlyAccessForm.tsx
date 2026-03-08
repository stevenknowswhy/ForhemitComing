"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EarlyAccessFormProps {
  variant?: "inline" | "card";
  onClose?: () => void;
}

export function EarlyAccessForm({ variant = "inline", onClose }: EarlyAccessFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleClose = () => {
    setEmail("");
    onClose?.();
  };

  const handleSubmit = () => {
    alert("Thank you! We'll be in touch soon.");
    handleClose();
  };

  if (variant === "card") {
    return (
      <div className="email-input-container">
        <div className="email-input-wrapper">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <button
            className="email-clear-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <button className="email-submit-btn" onClick={handleSubmit}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="email-reveal">
      <div className="email-input-wrapper">
        <input
          type="email"
          id="email-input"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <button
          className="email-clear-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <button
        id="submit-email"
        className="btn-icon"
        onClick={handleSubmit}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}
