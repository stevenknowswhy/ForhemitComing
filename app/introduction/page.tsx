"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./page.css";

export default function Introduction() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
            <Link href="/?join=true" className="intro-card">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h2 className="card-title">Join the Movement</h2>
              <p className="card-description">
                Become part of our team and help shape the future of private equity
              </p>
              <span className="card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </Link>

            <div className="intro-card disabled">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h2 className="card-title">Business Introductions</h2>
              <p className="card-description">
                Connect with us for partnership and business opportunities
              </p>
              <span className="card-badge">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
