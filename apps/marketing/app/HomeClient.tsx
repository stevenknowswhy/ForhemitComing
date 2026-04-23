"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EarlyAccessForm } from "./components/forms/EarlyAccessForm";
import { ClientOnly } from "@/components/ClientOnly";
import { HomeHeroSection, HomePersuasionSections } from "./home";
import type { IntakeRole } from "./home/intake";
import "./styles/home-page.css";

const ApplicationModal = lazy(() =>
  import("./components/forms/application/ApplicationModal").then((mod) => ({
    default: mod.ApplicationModal,
  }))
);

const ClassificationIntakeModal = lazy(() =>
  import("./home/intake").then((mod) => ({ default: mod.ClassificationIntakeModal }))
);

const TwoMinuteCheckModal = lazy(() =>
  import("./home/intake").then((mod) => ({ default: mod.TwoMinuteCheckModal }))
);

export function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinParam = searchParams?.get("join");
  const earlyParam = searchParams?.get("early");

  const [showApplicationModal, setShowApplicationModal] = useState(joinParam === "true");
  const [showClassificationIntake, setShowClassificationIntake] = useState(false);
  const [classificationRole, setClassificationRole] = useState<IntakeRole | null>(null);
  const [showTwoMinuteCheck, setShowTwoMinuteCheck] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(earlyParam === "true");

  useEffect(() => {
    setShowApplicationModal(joinParam === "true");
    setShowEmailInput(earlyParam === "true");
  }, [joinParam, earlyParam]);

  return (
    <div className="home-wrapper">
      <div className="background-mesh"></div>

      <HomeHeroSection
        onStartTwoMinuteCheck={() => setShowTwoMinuteCheck(true)}
        onStartIntake={(role) => {
          setClassificationRole(role);
          setShowClassificationIntake(true);
        }}
      />

      <HomePersuasionSections onStartTwoMinuteCheck={() => setShowTwoMinuteCheck(true)} />

      {showEmailInput && (
        <section className="home-inline-early" aria-label="Early access">
          <ClientOnly fallback={<div style={{ height: "48px" }} />}>
            <EarlyAccessForm variant="inline" onClose={() => setShowEmailInput(false)} />
          </ClientOnly>
        </section>
      )}

      <ClientOnly fallback={null}>
        {showApplicationModal && (
          <Suspense fallback={null}>
            <ApplicationModal
              isOpen={showApplicationModal}
              onClose={() => setShowApplicationModal(false)}
            />
          </Suspense>
        )}
        {showTwoMinuteCheck && (
          <Suspense fallback={null}>
            <TwoMinuteCheckModal
              isOpen={showTwoMinuteCheck}
              onClose={() => setShowTwoMinuteCheck(false)}
              onPassProceed={() => {
                setShowTwoMinuteCheck(false);
                router.push("/four-month-path");
              }}
            />
          </Suspense>
        )}
        {showClassificationIntake && classificationRole && (
          <Suspense fallback={null}>
            <ClassificationIntakeModal
              isOpen={showClassificationIntake}
              initialRole={classificationRole}
              onClose={() => {
                setShowClassificationIntake(false);
                setClassificationRole(null);
              }}
            />
          </Suspense>
        )}
      </ClientOnly>
    </div>
  );
}
