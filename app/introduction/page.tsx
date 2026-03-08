"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";

export default function Introduction() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const closeEmailInput = () => {
    setEmail("");
    setShowEmailInput(false);
    router.push("/introduction", { scroll: false });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && showEmailInput) {
      closeEmailInput();
    }
  };

  useEffect(() => {
    if (showEmailInput) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showEmailInput, handleKeyDown]);

  return (
    <div className="intro-wrapper">
      <div className="intro-background"></div>

      {/* Slide-up Panel */}
      <div className={`intro-panel ${isVisible ? "visible" : ""}`}>
        {/* Close Button */}
        <Link href="/" className="intro-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </Link>

        {/* Content */}
        <div className="intro-content">
          <h1 className="intro-title">Select Your Path</h1>
          <p className="intro-subtitle">
            Choose how you'd like to connect with Forhemit
          </p>

          {/* Action Cards */}
          <div className="intro-cards">
            <div className="intro-card disabled">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div className="card-text">
                <h2 className="card-title">Business Introductions</h2>
                <p className="card-description">
                  Connect with us for partnership and business opportunities
                </p>
              </div>
              <span className="card-badge">Coming Soon</span>
            </div>

            <div className="early-access-wrapper">
              {!showEmailInput ? (
                <button className="intro-card" onClick={() => setShowEmailInput(true)}>
                  <div className="card-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8l7.89 5.26a2 2 0 0 1 2.22 0L21 8M5 19h14M5 19l6.5-6.5M17 19l-6.5-6.5"/>
                      <circle cx="12" cy="9" r="2"/>
                    </svg>
                  </div>
                  <div className="card-text">
                    <h2 className="card-title">Get Early Access</h2>
                    <p className="card-description">
                      Stay updated on our launch and get exclusive early access
                    </p>
                  </div>
                  <span className="card-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </button>
              ) : (
                <div className="intro-card email-reveal-card">
                  <div className="card-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8l7.89 5.26a2 2 0 0 1 2.22 0L21 8M5 19h14M5 19l6.5-6.5M17 19l-6.5-6.5"/>
                      <circle cx="12" cy="9" r="2"/>
                    </svg>
                  </div>
                  <div className="card-text">
                    <h2 className="card-title">Get Early Access</h2>
                    <div className="email-input-container">
                      <div className="email-input-wrapper">
                        <input
                          type="email"
                          placeholder="Your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                          className="email-clear-btn"
                          onClick={closeEmailInput}
                          aria-label="Close"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                      <button
                        className="email-submit-btn"
                        onClick={() => {
                          alert("Thank you! We'll be in touch soon.");
                          closeEmailInput();
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <span className="card-badge">Add Email</span>
                </div>
              )}
            </div>

            <Link href="/?join=true" className="intro-card">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="card-text">
                <h2 className="card-title">Join the Movement</h2>
                <p className="card-description">
                  Become part of our team and help shape the future of private equity
                </p>
              </div>
              <span className="card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
