"use client";

import { useState, useRef, useEffect } from "react";

export function SignatureAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAnimating) {
          setIsAnimating(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isAnimating]);

  return (
    <div ref={ref} className="signature-container">
      <div className="contract-paper">
        <div className="contract-lines">
          <div className="contract-line" />
          <div className="contract-line" />
          <div className="contract-line short" />
        </div>
        <div className="signature-block">
          <span className="signature-label">Authorized Signature</span>
          <svg className={`signature-svg ${isAnimating ? "animate" : ""}`} viewBox="0 0 200 60">
            <path
              className="signature-path"
              d="M10,45 Q30,20 50,35 T90,30 T130,35 T170,25 T190,30"
              fill="none"
              stroke="#FF6B00"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="contract-stamp">
          <span>APPROVED</span>
        </div>
      </div>
    </div>
  );
}
