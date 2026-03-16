"use client";

import "./brokers.css";

export default function Loading() {
  return (
    <div className="brokers-wrapper">
      <div className="brokers-background"></div>
      <main className="brokers-main">
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
