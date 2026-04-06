"use client";

import "./accounting-firms.css";

export default function Loading() {
  return (
    <div className="accounting-wrapper">
      <div className="accounting-background"></div>
      <header className="accounting-firms-logo-header">
        <a href="/" className="accounting-firms-logo-link">
          <span className="accounting-firms-logo-text">Forhemit</span>
        </a>
      </header>
      <main className="accounting-main">
        <div className="container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '80vh' 
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid rgba(255,107,0,0.2)',
            borderTopColor: '#FF6B00',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </main>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
