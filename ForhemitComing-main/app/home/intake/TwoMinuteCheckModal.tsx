"use client";

import { ModalDialog } from "@/app/components/ui/ModalDialog";
import { TwoMinuteCheckFlow } from "./TwoMinuteCheckFlow";

export type TwoMinuteCheckModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPassProceed: () => void;
};

export function TwoMinuteCheckModal({ isOpen, onClose, onPassProceed }: TwoMinuteCheckModalProps) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="2-Minute Check"
      overlayClassName="modal-overlay"
      className="classification-modal-content"
      contentClassName="classification-modal-scroll"
      closeButtonClassName="modal-close"
      closeButtonAriaLabel="Close 2-Minute Check"
    >
      <TwoMinuteCheckFlow onRequestClose={onClose} onPassProceed={onPassProceed} />
    </ModalDialog>
  );
}
