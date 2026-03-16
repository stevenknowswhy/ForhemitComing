"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { useSearchParams } from "next/navigation";
import { EarlyAccessForm } from "./components/forms/EarlyAccessForm";
import { ClientOnly } from "@/components/ClientOnly";
import "./styles/home-page.css";

// Lazy load the modal for better performance (code splitting)
const ApplicationModal = lazy(() => 
  import("./components/forms/application/ApplicationModal").then((mod) => ({ 
    default: mod.ApplicationModal 
  }))
);

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

      <ClientOnly fallback={null}>
        {showApplicationModal && (
          <Suspense fallback={null}>
            <ApplicationModal 
              isOpen={showApplicationModal} 
              onClose={() => setShowApplicationModal(false)} 
            />
          </Suspense>
        )}
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
