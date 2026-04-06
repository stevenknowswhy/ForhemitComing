"use client";

import "../styles/home-page.css";
import "./coming-soon.css";

export default function ComingSoon() {
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
          
          <p className="coming-soon-message">
            We&apos;re building something extraordinary.
            <br />
            Check back soon.
          </p>
        </div>
      </main>
    </div>
  );
}
