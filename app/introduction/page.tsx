"use client";

import Link from "next/link";
import "./page.css";

export default function Introduction() {
  return (
    <div className="intro-wrapper">
      <div className="intro-background"></div>
      
      <nav className="minimal-nav">
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/about" className="nav-link">About</Link>
      </nav>
      
      <main className="intro-content">
        <div className="intro-container">
          <h1 className="intro-title">Introduction</h1>
          <p className="intro-message">
            Coming soon. We are crafting something exceptional.
          </p>
          <Link href="/" className="intro-back">
            Return Home
          </Link>
        </div>
      </main>
    </div>
  );
}
