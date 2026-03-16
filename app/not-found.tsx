"use client";

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import './not-found.css';

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="home-wrapper">
      <div className="background-mesh"></div>

      <main className="hero not-found-hero">
        <div className="container">
          <div className="not-found-content">
            <h1 className="not-found-code">404</h1>
            <h2 className="not-found-title">Page Not Found</h2>
            <p className="not-found-message">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            
            <div className="not-found-actions">
              <Link href="/" className="not-found-button primary">
                <Home size={18} />
                <span>Go Home</span>
              </Link>
              <button 
                onClick={handleGoBack} 
                className="not-found-button secondary"
              >
                <ArrowLeft size={18} />
                <span>Go Back</span>
              </button>
            </div>

            <div className="not-found-links">
              <p className="not-found-hint">Or explore:</p>
              <nav className="not-found-nav">
                <Link href="/about">About</Link>
                <Link href="/faq">FAQ</Link>
                <Link href="/business-owners">Business Owners</Link>
                <Link href="/brokers">Brokers</Link>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
