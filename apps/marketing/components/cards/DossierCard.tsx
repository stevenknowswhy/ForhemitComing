"use client";

import { useState, useRef, useEffect } from "react";
import { DossierCardProps } from "@/types";

interface DossierCardComponentProps extends DossierCardProps {
  delay?: number;
}

export function DossierCard({
  number,
  headline,
  title,
  copy,
  cta,
  icon,
  delay = 0,
}: DossierCardComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`dossier-card ${isVisible ? "visible" : ""} ${isHovered ? "hovered" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="dossier-tab">
        <span className="dossier-number">{number}</span>
        <span className="dossier-classification">CLASSIFIED</span>
      </div>

      <div className="dossier-content">
        <div className="dossier-stamp">APPROVED</div>
        <div className="dossier-icon">{icon}</div>
        <span className="dossier-headline">{headline}</span>
        <h3>{title}</h3>
        <p>{copy}</p>
        <button className="dossier-cta">
          <span className="cta-icon">↓</span>
          <span className="cta-text">{cta}</span>
        </button>
      </div>

      <div className="dossier-folds">
        <div className="fold fold-1" />
        <div className="fold fold-2" />
      </div>

      <div className={`dossier-highlight ${isHovered ? "active" : ""}`} />
    </div>
  );
}
