"use client";

import "./page.css";
import {
  HeroSection,
  IntroSection,
  PhilosophySection,
  ComparisonSection,
  CommitmentsSection,
  CTASection
} from "./sections";

export default function About() {
  return (
    <div className="about-wrapper">
      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">Forhemit</a>
        <ul className="nav-links">
          <li><a href="/about">About</a></li>
          <li><a href="#model">Our Model</a></li>
          <li><a href="#commitments">Commitments</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <HeroSection />
      <IntroSection />
      <PhilosophySection />
      <ComparisonSection />
      <CommitmentsSection />
      <CTASection />

      {/* FOOTER */}
      <footer>
        <span>© 2026 Forhemit Capital. All rights reserved.</span>
        <span>
          <a href="#">Privacy Policy</a> &nbsp;·&nbsp;
          <a href="#">Terms</a> &nbsp;·&nbsp;
          <a href="#">Contact</a>
        </span>
      </footer>
    </div>
  );
}
