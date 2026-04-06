"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import "../styles/home-page.css";
import "./coming-soon.css";

function safeInternalPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}

export function ComingSoonGate() {
  const searchParams = useSearchParams();
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/preview-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not verify code. Try again.");
        setPending(false);
        return;
      }
      const dest = safeInternalPath(searchParams.get("next"));
      window.location.assign(dest);
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  };

  return (
    <div className="home-wrapper">
      <div className="background-mesh"></div>

      <main className="hero coming-soon-hero">
        <div className="container">
          <p className="coming-soon-text">Coming Soon</p>
          <h1 className="brand-title">FORHEMIT</h1>
          <p className="brand-corporation">A Public Benefit Corporation</p>
          <p className="brand-subtitle">STEWARDSHIP MANAGEMENT</p>

          <div className="coming-soon-divider"></div>

          {!showCodeEntry ? (
            <>
              <p className="coming-soon-message">
                We&apos;re building something extraordinary.
                <br />
                Public access isn&apos;t open yet—use an invitation code to preview the site.
              </p>
              <button
                type="button"
                className="coming-soon-cta"
                onClick={() => setShowCodeEntry(true)}
              >
                Enter invitation code
              </button>
            </>
          ) : (
            <form className="coming-soon-code-form" onSubmit={handleSubmit}>
              <p className="coming-soon-form-intro">Enter the code you were given to continue.</p>
              <label htmlFor="invite-code" className="sr-only">
                Invitation code
              </label>
              <input
                id="invite-code"
                name="code"
                type="password"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="coming-soon-input"
                placeholder="Invitation code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={pending}
              />
              {error ? <p className="coming-soon-error">{error}</p> : null}
              <div className="coming-soon-form-actions">
                <button type="submit" className="coming-soon-submit" disabled={pending}>
                  {pending ? "Checking…" : "Continue to site"}
                </button>
                <button
                  type="button"
                  className="coming-soon-back"
                  onClick={() => {
                    setShowCodeEntry(false);
                    setError(null);
                    setCode("");
                  }}
                  disabled={pending}
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="coming-soon-footer">
        <span className="coming-soon-footer-copy">&copy; {new Date().getFullYear()} Forhemit PBC</span>
      </footer>
    </div>
  );
}
