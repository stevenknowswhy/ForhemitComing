import type { Metadata } from "next";
import {
  buildProductJsonLd,
  canonicalUrl,
  isFoundingPricingActive,
  SignalOsPage,
} from "./index";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal OS | Evidence-First AI Visibility Audits",
  description:
    "A local-first audit workstation for consultants and agencies that turns dated AI-answer evidence into transparent priorities and client-ready deliverables.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "Signal OS | Evidence-First AI Visibility Audits",
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
