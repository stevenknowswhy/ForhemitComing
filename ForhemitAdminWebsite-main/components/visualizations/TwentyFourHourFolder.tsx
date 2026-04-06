"use client";

import { useState, useRef, useEffect } from "react";

const documents = [
  { name: "Financials.pdf", status: "VERIFIED", icon: "📊" },
  { name: "SOPs.pdf", status: "VERIFIED", icon: "📋" },
  { name: "Risk Assessment", status: "VERIFIED", icon: "⚡" },
  { name: "COOP Framework", status: "VERIFIED", icon: "🛡️" },
];

export function TwentyFourHourFolder() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && progress === 0) {
          setTimeout(() => setIsOpen(true), 500);
          let current = 0;
          const interval = setInterval(() => {
            current += 2;
            setProgress(Math.min(current, 100));
            if (current >= 100) clearInterval(interval);
          }, 40);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [progress]);

  return (
    <div ref={ref} className="folder-container">
      <div className={`folder ${isOpen ? "open" : ""}`}>
        <div className="folder-front">
          <div className="folder-tab">
            <span className="folder-label">COOP</span>
          </div>
          <div className="folder-title">
            <span className="folder-icon">📁</span>
            <span>24-HOUR FOLDER</span>
          </div>
          <div className="folder-seal">MUNICIPAL GRADE</div>
        </div>

        <div className="folder-contents">
          {documents.map((doc, i) => (
            <div
              key={doc.name}
              className="folder-document"
              style={{ transitionDelay: `${i * 150 + 300}ms` }}
            >
              <span className="doc-icon">{doc.icon}</span>
              <span className="doc-name">{doc.name}</span>
              <span className="doc-status">{doc.status}</span>
            </div>
          ))}
        </div>

        <div className="folder-back" />
      </div>

      <div className="folder-metrics">
        <div className="metric">
          <span className="metric-label">Readiness</span>
          <div className="metric-bar">
            <div className="metric-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="metric-value">{progress}%</span>
        </div>
        <div className="metric-badge">
          <span className="badge-icon">⚡</span>
          <span>Audit Ready</span>
        </div>
      </div>
    </div>
  );
}
