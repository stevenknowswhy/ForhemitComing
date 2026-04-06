"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface EarlyAccessFormProps {
  variant?: "inline" | "card";
  onClose?: () => void;
  source?: string;
}

export function EarlyAccessForm({ variant = "inline", onClose, source = "website" }: EarlyAccessFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submitEarlyAccess = useMutation(api.earlyAccessSignups.submit);

  const handleClose = React.useCallback(() => {
    setEmail("");
    setStatus("idle");
    setMessage("");
    onClose?.();
  }, [onClose]);

  // Auto-close modal after successful submission
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, handleClose]);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const result = await submitEarlyAccess({
        email: email.trim(),
        source,
      });

      setIsSubmitting(false);

      if (result.isDuplicate) {
        setStatus("success");
        setMessage("You're already on our list! We'll be in touch soon.");
      } else {
        setStatus("success");
        setMessage("Thank you! We'll be in touch soon.");
      }

      // Clear email after successful submission
      setEmail("");

      // Auto-close after 2 seconds on success
      // Auto-close timer moved to useEffect
    } catch (err) {
      setIsSubmitting(false);
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "An error occurred. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleClose();
    }
  };

  if (variant === "card") {
    return (
      <div className="email-input-container">
        {status !== "idle" && (
          <div 
            className="form-status-message"
            style={{
              marginBottom: "12px",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "14px",
              background: status === "success" ? "var(--color-success-bg)" : "var(--color-error-bg)",
              border: status === "success" ? "1px solid var(--color-success-border)" : "1px solid var(--color-error-border)",
              color: status === "success" ? "var(--color-success)" : "var(--color-error)",
            }}
          >
            {message}
          </div>
        )}
        <div className="email-input-wrapper">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            autoFocus
          />
          <button
            className="email-clear-btn"
            onClick={handleClose}
            aria-label="Close"
            disabled={isSubmitting}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <button 
          className="email-submit-btn" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="spinner" style={{ display: "inline-block", width: "20px", height: "20px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" style={{ animation: "spin 1s linear infinite" }}>
                  <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                </circle>
              </svg>
            </span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="email-reveal">
      {status !== "idle" && (
        <div 
          className="form-status-message"
          style={{
            marginBottom: "12px",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "14px",
            background: status === "success" ? "var(--color-success-bg)" : "var(--color-error-bg)",
            border: status === "success" ? "1px solid var(--color-success-border)" : "1px solid var(--color-error-border)",
            color: status === "success" ? "var(--color-success)" : "var(--color-error)",
          }}
        >
          {message}
        </div>
      )}
      <div className="email-input-wrapper">
        <input
          type="email"
          id="email-input"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          autoFocus
        />
        <button
          className="email-clear-btn"
          onClick={handleClose}
          aria-label="Close"
          disabled={isSubmitting}
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
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="spinner" style={{ display: "inline-block", width: "20px", height: "20px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
              </circle>
            </svg>
          </span>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        )}
      </button>
    </div>
  );
}
