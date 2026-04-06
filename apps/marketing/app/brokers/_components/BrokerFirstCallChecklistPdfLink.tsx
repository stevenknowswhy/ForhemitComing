"use client";

import { trackBrokerFirstCallChecklistPdfDownload } from "@/lib/analytics/highIntent";
import { BROKER_FIRST_CALL_CHECKLIST_PDF_HREF } from "../constants";

type Props = {
  className?: string;
  children: React.ReactNode;
  /** Where on the site the click happened (analytics) */
  surface: string;
};

export function BrokerFirstCallChecklistPdfLink({ className, children, surface }: Props) {
  return (
    <a
      href={BROKER_FIRST_CALL_CHECKLIST_PDF_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackBrokerFirstCallChecklistPdfDownload(surface)}
    >
      {children}
    </a>
  );
}
