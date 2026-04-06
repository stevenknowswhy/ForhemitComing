"use client";

import { useState, useEffect } from "react";

const stages = [
  { name: "Introduction", icon: "🤝" },
  { name: "Diligence", icon: "🔍" },
  { name: "Structure", icon: "🏗️" },
  { name: "Close", icon: "✓" },
];

export function DealFlowSimulator() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s + 1) % stages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="deal-flow">
      <div className="flow-track">
        {stages.map((s, i) => (
          <div
            key={s.name}
            className={`flow-stage ${i === stage ? "active" : ""} ${i < stage ? "complete" : ""}`}
          >
            <div className="stage-node">
              <span className="stage-icon">{s.icon}</span>
              {i === stage && <div className="stage-pulse" />}
            </div>
            <span className="stage-name">{s.name}</span>
          </div>
        ))}
      </div>
      <div className="flow-progress">
        <div className="progress-fill" style={{ width: `${((stage + 1) / stages.length) * 100}%` }} />
      </div>
    </div>
  );
}
