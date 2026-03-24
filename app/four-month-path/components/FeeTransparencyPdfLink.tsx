"use client";

import { trackFeeTransparencyPdfDownload } from "@/lib/analytics/highIntent";
import { FEE_TRANSPARENCY_PDF_HREF } from "../constants";

type Props = {
  className?: string;
  children: React.ReactNode;
  surface: string;
};

export function FeeTransparencyPdfLink({ className, children, surface }: Props) {
  return (
    <a
      href={FEE_TRANSPARENCY_PDF_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackFeeTransparencyPdfDownload(surface)}
    >
      {children}
    </a>
  );
}
