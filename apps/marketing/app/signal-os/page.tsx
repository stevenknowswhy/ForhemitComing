import type { Metadata } from "next";
import {
  buildProductJsonLd,
  canonicalUrl,
  isFoundingPricingActive,
  SignalOsPage,
} from "./index";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal OS | AEO & GEO AI Visibility Audits",
  description:
    "Evidence-first, local-first AEO and GEO audit workstation for consultants and agencies that turns dated AI-answer evidence into transparent priorities and client-ready deliverables.",
  keywords: [
    "AEO audit",
    "GEO audit",
    "AI visibility audit",
    "answer engine optimization",
    "generative engine optimization",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Signal OS | AEO & GEO AI Visibility Audits",
    description:
      "Capture dated AI-answer evidence, citations, competitors, factual gaps, and next actions without pretending a sample is a customer result.",
    type: "website",
    url: canonicalUrl,
  },
};

export default function SignalOsRoute() {
  const foundingActive = isFoundingPricingActive(Date.now());

  return (
    <SignalOsPage
      foundingActive={foundingActive}
      productJsonLd={JSON.stringify(buildProductJsonLd(foundingActive))}
    />
  );
}
