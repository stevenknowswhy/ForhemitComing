"use client";

import { ModalDialog } from "@/app/components/ui/ModalDialog";
import { ClassificationIntakeFlow } from "./ClassificationIntakeFlow";
import type { IntakeRole } from "./types";

export type ClassificationIntakeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialRole: IntakeRole;
};

export function ClassificationIntakeModal({ isOpen, onClose, initialRole }: ClassificationIntakeModalProps) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Free assessment and roadmap"
      overlayClassName="modal-overlay"
      className="classification-modal-content"
      contentClassName="classification-modal-scroll"
      closeButtonClassName="modal-close"
      closeButtonAriaLabel="Close assessment"
    >
      <ClassificationIntakeFlow initialRole={initialRole} onRequestClose={onClose} />
    </ModalDialog>
  );
}
