"use client";

import {
  createContext,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EarlyAccessForm } from "../../components/forms/EarlyAccessForm";
import { ClientOnly } from "@/components/ClientOnly";
import { ClassificationIntakeModal, TwoMinuteCheckModal } from "../intake";
import type { IntakeRole } from "../intake";
import "../../styles/home-page.css";

const ApplicationModal = lazy(() =>
  import("../../components/forms/application/ApplicationModal").then((mod) => ({
    default: mod.ApplicationModal,
  }))
);

export type HomeModalsContextValue = {
  /** Opens the 2-Minute Check qualifier modal. */
  openTwoMinuteCheck: () => void;
  /** Opens classification intake modal for the given role. */
  openIntake: (role: IntakeRole) => void;
};

const HomeModalsContext = createContext<HomeModalsContextValue | null>(null);

/** Access the home modal openers from within server-rendered CTA islands. */
export function useHomeModals(): HomeModalsContextValue {
  const ctx = useContext(HomeModalsContext);
  if (!ctx) {
    throw new Error("useHomeModals must be used within HomeModalProvider");
  }
  return ctx;
}

/**
 * Client island wrapping the home page: owns modal state and exposes openers
 * to the server-rendered sections via context. The static marketing content
 * passes through as `children` and never re-renders on the client — only the
 * modals and the early-access slot hydrate.
 */
export function HomeModalProvider({ children }: { children: ReactNode }) {
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

  const openTwoMinuteCheck = () => setShowTwoMinuteCheck(true);
  const openIntake = (role: IntakeRole) => {
    setClassificationRole(role);
    setShowClassificationIntake(true);
  };

  return (
    <HomeModalsContext.Provider value={{ openTwoMinuteCheck, openIntake }}>
      {children}

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
    </HomeModalsContext.Provider>
  );
}
