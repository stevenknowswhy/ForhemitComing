"use client";

import type { ReactNode } from "react";
import { useHomeModals } from "./HomeModalProvider";

type AssessmentCtaProps = {
  className?: string;
  children: ReactNode;
};

/** Server-rendered CTA button that opens the 2-Minute Check via context. */
export function AssessmentCta({ className, children }: AssessmentCtaProps) {
  const { openTwoMinuteCheck } = useHomeModals();

  return (
    <button type="button" className={className} onClick={openTwoMinuteCheck}>
      {children}
    </button>
  );
}
