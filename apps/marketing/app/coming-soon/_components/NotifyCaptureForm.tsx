"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { normalizeEmail, validateEmail } from "./lib/validateEmail";

import { withTimeout } from "./lib/withTimeout";

/**
 * "Get notified" capture for visitors without an invitation code (P1-8).
 * Persists to the notifySignups Convex collection; duplicates are treated
 * as a friendly confirmation, not an error.
 */

/** Convex mutations queue and retry through outages — bound the UI wait so a
 * hung connection surfaces a recovery action instead of a dead spinner. */
const NOTIFY_SUBMIT_TIMEOUT_MS = 15_000;
export function NotifyCaptureForm({
  sourcePage = "/coming-soon",
  onDismiss,
}: {
  sourcePage?: string;
  onDismiss?: () => void;
}) {
  const submitNotifySignup = useMutation(api.notifySignups.submit);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedDuplicate, setConfirmedDuplicate] = useState<boolean | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setPending(true);
    try {
      const result = await withTimeout(
        submitNotifySignup({
          email: normalizeEmail(email),
          sourcePage,
        }),
        NOTIFY_SUBMIT_TIMEOUT_MS,
        "The request timed out.",
      );
      setConfirmedDuplicate(result.isDuplicate);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  if (confirmedDuplicate !== null) {
    return (
      <div
        className="coming-soon-notify-form"
        role="status"
        aria-live="polite"
        data-testid="notify-confirm"
      >
        <p className="coming-soon-success">
          {confirmedDuplicate
            ? "You're already on the list — we'll be in touch."
            : "You're on the list. We'll let you know when Forhemit opens."}
        </p>
      </div>
    );
  }

  return (
    <form
      className="coming-soon-notify-form"
      onSubmit={handleSubmit}
      noValidate
      data-testid="notify-form"
    >
      <p className="coming-soon-form-intro">
        No invitation code? Leave your email and we&apos;ll tell you when
        public access opens.
      </p>
      <label htmlFor="notify-email" className="sr-only">
        Email address
      </label>
      <input
        id="notify-email"
        name="email"
        type="email"
        autoComplete="email"
        className="coming-soon-input"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError(null);
        }}
        disabled={pending}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "notify-email-error" : undefined}
      />
      {error ? (
        <p id="notify-email-error" className="coming-soon-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="coming-soon-form-actions">
        <button type="submit" className="coming-soon-submit" disabled={pending}>
          {pending ? "Joining…" : "Get notified"}
        </button>
        {onDismiss ? (
          <button
            type="button"
            className="coming-soon-back"
            onClick={onDismiss}
            disabled={pending}
          >
            Back
          </button>
        ) : null}
      </div>
    </form>
  );
}
