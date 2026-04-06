"use client";

import "./wealth-managers.css";

export default function Loading() {
  return (
    <div className="wealth-wrapper">
      <div className="wealth-background"></div>
      <header className="wealth-logo-header">
        <a href="/" className="wealth-logo-link">
          <span className="wealth-logo-text">Forhemit</span>
        </a>
      </header>
      <main className="wealth-main">
        <div style={{ 
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
