"use client";

import { trackRoadmapPdfDownload } from "@/lib/analytics/highIntent";
import { ROADMAP_PDF_HREF } from "../constants";

type Props = {
  className?: string;
  children: React.ReactNode;
  /** Where on the site the click happened (analytics) */
  surface: string;
};

export function RoadmapLink({ className, children, surface }: Props) {
  return (
    <a
      href={ROADMAP_PDF_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackRoadmapPdfDownload(surface)}
    >
      {children}
    </a>
  );
}
