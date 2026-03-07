"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./page.css";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    position: "",
    otherPosition: ""
  });

  const positions = [
    "Investment Analyst",
    "Portfolio Manager",
    "Operations Director",
    "Legal Counsel",
    "Business Development",
    "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setFormData({ fullName: "", phone: "", email: "", position: "", otherPosition: "" });
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showModal]);

  return (
    <div className="home-wrapper">
      <div className="background-mesh"></div>
      
      <nav className="minimal-nav">
        <Link href="/about" className="nav-link">About</Link>
        <Link href="/introduction" className="nav-link">Introduction</Link>
      </nav>
      
      <main className="hero">
        <div className="container">
          <div className="logo-wrapper">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" id="logo">
              <rect width="100" height="100" rx="20" fill="url(#logo-gradient)"/>
              <path d="M35 75V25H65V35H45V45H60V55H45V75H35Z" fill="white"/>
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF6B00"/>
                  <stop offset="1" stopColor="#FF3D00"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <h1 className="brand-title">FORHEMIT</h1>
          <p className="brand-subtitle">PRIVATE EQUITY</p>
          
          <div className="cta-group">
            <button 
              id="join-btn" 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Join the Movement
            </button>
            <div className="early-access-wrapper">
              {!showEmailInput ? (
                <button 
                  id="early-access-btn" 
                  className="btn btn-secondary"
                  onClick={() => setShowEmailInput(true)}
                >
                  Get Early Access
                </button>
              ) : (
                <div id="email-reveal" className="email-reveal">
                  <input 
                    type="email" 
                    id="email-input" 
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button 
                    id="submit-email" 
                    className="btn-icon"
                    onClick={() => {
                      alert("Thank you! We'll be in touch soon.");
                      setEmail("");
                      setShowEmailInput(false);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Overlay */}
      {showModal && (
        <div id="modal-overlay" className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <div className="modal-grid">
              <div className="modal-form-side">
                {/* Step 1 */}
                {step === 1 && (
                  <div id="step-1" className="form-step active">
                    <h2>Join the Movement</h2>
                    <p>We are looking for visionary minds to reshape the landscape of private equity. Are you ready to lead?</p>
                    <button 
                      className="btn btn-primary next-step"
                      onClick={() => setStep(2)}
                    >
                      Continue
                    </button>
                  </div>
                )}
                
                {/* Step 2 */}
                {step === 2 && (
                  <div id="step-2" className="form-step active">
                    <h2>Personal Details</h2>
                    <form id="recruitment-form" onSubmit={handleSubmit}>
                      <div className="input-group">
                        <label htmlFor="full-name">Full Name</label>
                        <input 
                          type="text" 
                          id="full-name" 
                          required 
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          required 
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          required 
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="position">Position Interest</label>
                        <select 
                          id="position" 
                          required
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                        >
                          <option value="" disabled>Select a position</option>
                          {positions.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                      {formData.position === "Other" && (
                        <div id="other-position-wrapper" className="input-group">
                          <label htmlFor="other-position">Specify Position</label>
                          <input 
                            type="text" 
                            id="other-position" 
                            placeholder="Please specify"
                            value={formData.otherPosition}
                            onChange={(e) => setFormData({...formData, otherPosition: e.target.value})}
                          />
                        </div>
                      )}
                      <button type="submit" className="btn btn-primary">Submit Application</button>
                    </form>
                  </div>
                )}
                
                {/* Step 3 */}
                {step === 3 && (
                  <div id="step-3" className="form-step active">
                    <div className="success-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                    <h2>Thank You!</h2>
                    <p>Your application has been received. Our team will review your profile and get back to you shortly.</p>
                    <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                  </div>
                )}
              </div>
              <div className="modal-image-side">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/recruit-face.jpg" alt="Join Forhemit" className="portrait-img"/>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
