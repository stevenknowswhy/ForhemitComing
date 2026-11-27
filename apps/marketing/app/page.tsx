import type { Metadata } from "next";
import { ogMetadata } from "@/lib/og";
import { HomeModalProvider } from "./home/components/HomeModalProvider";
import {
  HomeInkEffects,
  HomeInkFooter,
  HomeInkHeader,
  HomeInkHero,
  HomeInkSections,
} from "./home";
import "./home/styles/home-ink.css";

export const metadata: Metadata = ogMetadata({
  file: "og-home.png",
  title:
    "Forhemit | 100% Employee Ownership Succession for Founder-Led Businesses",
  description:
    "Transition your business to 100% employee ownership. Preserve your legacy and steward your company's future with Forhemit — Section 1042 tax-deferred treatment may be available to qualifying sellers.",
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Forhemit PBC",
  url: "https://www.forhemit.com",
  description:
    "Forhemit helps founder-led businesses pursue 100% employee-ownership succession with ESOP structuring and post-close support.",
  "@id": "https://www.forhemit.com/#organization",
  sameAs: [],
  areaServed: "US",
  knowsAbout: [
    "ESOP structuring",
    "Employee ownership succession",
    "Section 1042 tax deferral",
    "Business succession planning",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Forhemit",
  url: "https://www.forhemit.com",
  publisher: {
    "@id": "https://www.forhemit.com/#organization",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* DeepBook-ink homepage (2026-11-27): static sections render on the
          server and appear in view-source; the provider hydrates only the
          modal islands and CTA openers, and HomeInkEffects runs the muted
          motion system. The global header/nav/footer hide on "/" (blog /
          admin pattern) — HomeInkHeader/HomeInkFooter are this page's
          chrome. */}
      <HomeModalProvider>
        <div className="home-ink">
          <HomeInkHeader />
          <HomeInkHero />
          <HomeInkSections />
          <HomeInkFooter />
          <HomeInkEffects />
        </div>
      </HomeModalProvider>
    </>
  );
}
