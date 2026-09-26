"use client";

import { useHomeModals } from "./HomeModalProvider";
import { HomePathSelectionSection } from "./HomePathSelectionSection";

/**
 * Client bridge for the path-selection section: renders the interactive
 * section with the modal opener from context so the server-rendered hero can
 * keep the section as a child without passing a function prop across the
 * server/client boundary. Used only when SHOW_HOME_PATH_SELECTION is enabled.
 */
export function HomePathSelectionBridge() {
  const { openIntake } = useHomeModals();

  return <HomePathSelectionSection onStartIntake={openIntake} />;
}
