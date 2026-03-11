"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EarlyAccessForm } from "../components/forms/EarlyAccessForm";
import "./page.css";

// Sub-options for Business Introductions
const businessSubOptions = [
  {
    id: "accounting",
    title: "Accounting Firms",
    description: "Connect with us to explore partnership opportunities for financial and accounting services",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    hasSubMenu: false,
  },
  {
    id: "legal",
    title: "Legal Practices",
    description: "Connect with us to explore how we can work together on legal and advisory services",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    hasSubMenu: false,
    href: "/legal-practices",
  },
  {
    id: "lending",
    title: "Lending Institutions",
    description: "Connect with us to explore financing partnerships and collaborative opportunities",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    hasSubMenu: false,
  },
  {
    id: "other",
    title: "Other Services",
    description: "Business Appraisers, Business Brokers, Wealth Managers & more",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    hasSubMenu: true,
  },
];

// Sub-options for Other Services
const otherServicesSubOptions = [
  {
    id: "appraisers",
    title: "Business Appraisers",
    description: "Partner with us for valuation and business appraisal services",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    id: "brokers",
    title: "Business Brokers",
    description: "Collaborate with us on business sales and M&A transactions",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: "wealth-managers",
    title: "Wealth Managers",
    description: "Work with us to serve business owners through ESOP transitions",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    id: "others",
    title: "Others",
    description: "Have a different professional service? Let's discuss how we can collaborate",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
    ),
  },
];

export default function Introduction() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showBusinessOptions, setShowBusinessOptions] = useState(false);
  const [showOtherServices, setShowOtherServices] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCloseEmail = () => {
    setShowEmailInput(false);
    router.push("/introduction", { scroll: false });
  };

  const handleBusinessClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Small delay to allow the fall animation to start
    setTimeout(() => {
      setShowBusinessOptions(true);
      setIsAnimating(false);
    }, 300);
  };

  const handleBackClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      if (showOtherServices) {
        setShowOtherServices(false);
      } else {
        setShowBusinessOptions(false);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleOtherServicesClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Wait for fall animation to complete before switching views
    setTimeout(() => {
      setShowOtherServices(true);
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showEmailInput) {
        handleCloseEmail();
      }
      if (e.key === "Escape" && showOtherServices) {
        handleBackClick();
      } else if (e.key === "Escape" && showBusinessOptions) {
        handleBackClick();
      }
    };

    if (showEmailInput || showBusinessOptions || showOtherServices) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showEmailInput, showBusinessOptions, showOtherServices]);

  return (
    <div className="intro-wrapper">
      <div className="intro-background"></div>

      <div className={`intro-panel ${isVisible ? "visible" : ""}`}>
        <Link href="/" className="intro-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </Link>

        <div className="intro-content">
          {!showBusinessOptions ? (
            // Main Selection View
            <>
              <h1 className="intro-title">Select Your Path</h1>
              <p className="intro-subtitle">
                Choose how you&apos;d like to connect with Forhemit
              </p>

              <div className={`intro-cards ${isAnimating ? "cards-fall" : ""}`}>
                {/* Business Introductions - Now Clickable */}
                <button 
                  className="intro-card" 
                  onClick={handleBusinessClick}
                  disabled={isAnimating}
                >
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
                      Service providers: Connect with us to explore partnership opportunities
                    </p>
                  </div>
                  <span className="card-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </button>

                {/* Early Access */}
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
                        <EarlyAccessForm variant="card" onClose={handleCloseEmail} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Join Our Movement */}
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
                    <h2 className="card-title">Join Our Movement</h2>
                    <p className="card-description">
                      Become part of our team and help shape the future of stewardship management
                    </p>
                  </div>
                  <span className="card-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </Link>
              </div>
            </>
          ) : !showOtherServices ? (
            // Business Sub-Options View
            <div className={`business-options options-wide ${!isAnimating ? "options-rise" : ""}`}>
              {/* Back Button */}
              <button className="back-button" onClick={handleBackClick}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>Back to Selection</span>
              </button>

              <h1 className="intro-title">Business Introductions</h1>
              <p className="intro-subtitle">
                Select the area you&apos;d like to explore
              </p>

              <div className={`intro-cards sub-options ${isAnimating ? "cards-fall" : ""}`}>
                {businessSubOptions.map((option) => {
                  const cardContent = (
                    <>
                      <div className="card-icon">{option.icon}</div>
                      <div className="card-text">
                        <h2 className="card-title">{option.title}</h2>
                        <p className="card-description">{option.description}</p>
                      </div>
                      <span className="card-arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </>
                  );

                  // If option has href, render as Link
                  if (option.href) {
                    return (
                      <Link
                        key={option.id}
                        href={option.href}
                        className="intro-card sub-option-card"
                      >
                        {cardContent}
                      </Link>
                    );
                  }

                  // Otherwise render as button with click handler
                  return (
                    <button 
                      key={option.id} 
                      className="intro-card sub-option-card"
                      onClick={option.hasSubMenu ? handleOtherServicesClick : undefined}
                      disabled={isAnimating}
                    >
                      {cardContent}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Other Services Sub-Options View
            <div className={`business-options options-wide ${!isAnimating ? "options-rise" : ""}`}>
              {/* Back Button */}
              <button className="back-button" onClick={handleBackClick}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>Back to Business Introductions</span>
              </button>

              <h1 className="intro-title">Other Services</h1>
              <p className="intro-subtitle">
                Select your professional category
              </p>

              <div className="intro-cards sub-options">
                {otherServicesSubOptions.map((option) => (
                  <button 
                    key={option.id} 
                    className="intro-card sub-option-card"
                  >
                    <div className="card-icon">{option.icon}</div>
                    <div className="card-text">
                      <h2 className="card-title">{option.title}</h2>
                      <p className="card-description">{option.description}</p>
                    </div>
                    <span className="card-arrow">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
