"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type PhaseTag = { label: string; color: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  dateLabel: string;
  title: string;
  phaseTag: PhaseTag | null;
  children: React.ReactNode;
};

export function EsopCalendarDetailPanel({
  isOpen,
  onClose,
  dateLabel,
  title,
  phaseTag,
  children,
}: Props) {
  const headingId = useId();

  return (
    <>
      <div
        role="presentation"
        className={cn("etc-detail-backdrop", isOpen && "etc-detail-backdrop--open")}
        onClick={onClose}
        onKeyDown={undefined}
      />
      <div
        className={cn("etc-detail-panel", isOpen && "etc-detail-panel--open")}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby={headingId}
      >
        <div className="etc-dp-header">
          <button type="button" className="etc-dp-close" onClick={onClose} aria-label="Close panel">
            ✕
          </button>
          <div className="etc-dp-date-label">{dateLabel}</div>
          <h3 id={headingId} className="etc-dp-title">
            {title}
          </h3>
          {phaseTag ? (
            <span className="etc-dp-phase-tag" style={{ background: phaseTag.color }}>
              {phaseTag.label}
            </span>
          ) : null}
        </div>
        <div className="etc-dp-scroll">{children}</div>
      </div>
    </>
  );
}
