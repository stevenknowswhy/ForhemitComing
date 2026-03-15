"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EarlyAccessForm } from "./components/forms/EarlyAccessForm";
import { ApplicationModal } from "./components/forms/application/ApplicationModal";
import { ClientOnly } from "@/components/ClientOnly";
import "./styles/home-page.css";

function HomeContent() {
  const searchParams = useSearchParams();
  const joinParam = searchParams?.get("join");
  const earlyParam = searchParams?.get("early");

  const [showApplicationModal, setShowApplicationModal] = useState(joinParam === "true");
  const [showEmailInput, setShowEmailInput] = useState(earlyParam === "true");

  useEffect(() => {
    setShowApplicationModal(joinParam === "true");
    setShowEmailInput(earlyParam === "true");
  }, [joinParam, earlyParam]);

  return (
    <div className="home-wrapper">
      <div className="background-mesh"></div>

      <main className="hero">
        <div className="container">
          <h1 className="brand-title">FORHEMIT</h1>
          <p className="brand-corporation">A Public Benefit Corporation</p>
          <p className="brand-subtitle">STEWARDSHIP MANAGEMENT</p>

          {showEmailInput && (
            <ClientOnly fallback={<div style={{ height: "48px" }} />}>
              <EarlyAccessForm
                variant="inline"
                onClose={() => setShowEmailInput(false)}
              />
            </ClientOnly>
          )}
        </div>
      </main>

      <ClientOnly>
        <ApplicationModal 
          isOpen={showApplicationModal} 
          onClose={() => setShowApplicationModal(false)} 
        />
      </ClientOnly>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="home-wrapper" />}>
      <HomeContent />
    </Suspense>
  );
}
