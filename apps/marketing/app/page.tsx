import type { Metadata } from "next";
import { ogMetadata } from "@/lib/og";
import { HomeModalProvider } from "./home/components/HomeModalProvider";
import { HomeHeroSection, HomePersuasionSections } from "./home";

export const metadata: Metadata = ogMetadata({
  file: "og-home.png",
  title:
    "Forhemit | 100% Employee Ownership Succession for Founder-Led Businesses",
  description:
    "Transition your business to 100% employee ownership. Preserve your legacy, unlock Section 1042 tax benefits, and steward your company's future with Forhemit.",
  path: "/",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Forhemit PBC",
  url: "https://www.forhemit.com",
  description:
    "Forhemit helps founder-led businesses pursue 100% employee-ownership succession with ESOP structuring and post-close stewardship support.",
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
      {/* Static sections render on the server and appear in view-source; the
          provider hydrates only the modal islands and CTA openers. */}
      <HomeModalProvider>
        <div className="home-wrapper home-wrapper--interactive">
          <div className="background-mesh" />
          <HomeHeroSection />
          <HomePersuasionSections />
        </div>
      </HomeModalProvider>
    </>
  );
}
