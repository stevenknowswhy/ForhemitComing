"use client";

import { useState, useEffect } from "react";

const dataPoints = [
  { label: "STATUS", value: "ACTIVE", type: "good" },
  { label: "COOP READY", value: "100%", type: "good" },
  { label: "PBC CERT", value: "VERIFIED", type: "good" },
  { label: "ESOP STRUCT", value: "PRE-VETTED", type: "good" },
  { label: "SECURE COMMS", value: "ENCRYPTED", type: "good" },
  { label: "DILIGENCE", value: "24-HOUR", type: "good" },
];

export function DataTicker() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 10);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="data-ticker">
      <div className="ticker-label">SYSTEM STATUS</div>
      <div className="ticker-items">
        {dataPoints.map((point, i) => (
          <div key={point.label} className={`ticker-item ${tick === i ? "active" : ""}`}>
            <span className="ticker-label-sm">{point.label}</span>
            <span className={`ticker-value ${point.type}`}>{point.value}</span>
          </div>
        ))}
      </div>
      <div className="ticker-time">{new Date().toISOString().split("T")[1].split(".")[0]} UTC</div>
    </div>
  );
}
