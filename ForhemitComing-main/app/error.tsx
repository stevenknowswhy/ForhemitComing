"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Home, Mail } from "lucide-react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    // Report error to Sentry
    if (error && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Application error:", error);
    }
  }, [error]);

  const handleReport = async () => {
    setIsReporting(true);
    if (error) {
      await Sentry.captureException(error);
    }
    setIsReporting(false);
    alert("Thank you! The error has been reported.");
  };

  return (
    <div className="home-wrapper">
      <div className="background-mesh"></div>

      <main className="hero error-hero">
        <div className="container">
          <div className="error-content">
            <div className="error-icon">
              <AlertTriangle size={48} />
            </div>
            
            <h2 className="error-title">Something Went Wrong</h2>
            
            <p className="error-message">
              We apologize for the inconvenience. An unexpected error occurred.
              {error?.message && (
                <span className="error-details">
                  <br />
                  <code>{error.message}</code>
                </span>
              )}
            </p>

            {error?.digest && (
              <p className="error-digest">
                Error ID: <code>{error.digest}</code>
              </p>
            )}

            <div className="error-actions">
              <button 
                onClick={reset} 
                className="error-button primary"
              >
                <RefreshCw size={18} />
                <span>Try Again</span>
              </button>
              
              <Link href="/" className="error-button secondary">
                <Home size={18} />
                <span>Go Home</span>
              </Link>
            </div>

            <div className="error-help">
              <p className="error-help-text">
                If this problem persists, please contact us:
              </p>
              <a href="mailto:support@forhemit.com" className="error-email">
                <Mail size={16} />
                <span>support@forhemit.com</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .error-hero {
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 1.5rem;
        }

        .error-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .error-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 107, 0, 0.1);
          color: var(--color-primary-orange);
          margin-bottom: 1.5rem;
        }

        .error-title {
          font-family: var(--font-cormorant);
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 400;
          color: var(--color-text-primary);
          margin: 0 0 1rem;
        }

        .error-message {
          font-family: var(--font-outfit);
          font-size: 1.0625rem;
          color: var(--color-text-muted);
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .error-details {
          display: block;
          margin-top: 1rem;
        }

        .error-details code {
          font-family: var(--font-dm-mono);
          font-size: 0.8125rem;
          background: rgba(255, 107, 0, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          color: var(--color-primary-orange);
        }

        .error-digest {
          font-family: var(--font-dm-mono);
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-bottom: 2rem;
        }

        .error-digest code {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .error-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          font-family: var(--font-outfit);
          font-size: 0.9375rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          border: none;
        }

        .error-button.primary {
          background: linear-gradient(135deg, var(--color-primary-orange) 0%, var(--color-primary-red) 100%);
          color: white;
        }

        .error-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 0, 0.3);
        }

        .error-button.secondary {
          background: transparent;
          color: var(--color-text-primary);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .error-button.secondary:hover {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.05);
        }

        .error-help {
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .error-help-text {
          font-family: var(--font-outfit);
          font-size: 0.875rem;
          color: var(--color-text-muted);
          margin-bottom: 0.75rem;
        }

        .error-email {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-outfit);
          font-size: 0.9375rem;
          color: var(--color-primary-orange);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .error-email:hover {
          color: var(--color-primary-red);
        }

        @media (max-width: 480px) {
          .error-hero {
            min-height: calc(100vh - 280px);
            padding: 2rem 1rem;
          }

          .error-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .error-button {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
