"use client";

import { useState, useEffect } from "react";

function DealBlip({ angle, delay }: { angle: number; delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    const hideTimer = setTimeout(() => setVisible(false), delay + 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [delay]);

  const radius = 35 + Math.random() * 25;
  const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
  const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

  return (
    <div className={`deal-blip ${visible ? "visible" : ""}`} style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="blip-ring" />
      <div className="blip-dot" />
    </div>
  );
}

export function DealRadar() {
  const [rotation, setRotation] = useState(0);
  const [pulses, setPulses] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((r) => (r + 0.5) % 360);
    }, 16);

    const pulseInterval = setInterval(() => {
      setPulses((prev) => {
        const newPulses = [...prev, Date.now()];
        return newPulses.slice(-5);
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <div className="deal-radar">
      <div className="radar-grid">
        <div className="radar-ring ring-1" />
        <div className="radar-ring ring-2" />
        <div className="radar-ring ring-3" />
        <div className="radar-ring ring-4" />
        <div className="radar-crosshair horizontal" />
        <div className="radar-crosshair vertical" />
        <div className="radar-sweep" style={{ transform: `rotate(${rotation}deg)` }} />
        <div className="radar-center">
          <div className="center-pulse" />
          <div className="center-core">
            SAFE
            <br />
            CLOSE
          </div>
        </div>
        {pulses.map((pulse, i) => (
          <DealBlip key={pulse} angle={i * 72 + 45} delay={i * 200} />
        ))}
        <div className="radar-zone zone-risk">RISK ZONE</div>
        <div className="radar-zone zone-safe">SAFE HARBOR</div>
      </div>
    </div>
  );
}
