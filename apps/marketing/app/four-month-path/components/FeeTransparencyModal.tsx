"use client";

import { ModalDialog } from "@/app/components/ui/ModalDialog";
import { FeeTransparencyContent } from "./FeeTransparencyContent";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function FeeTransparencyModal({ isOpen, onClose }: Props) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="What it costs, said plainly"
      overlayClassName="modal-overlay"
      className="classification-modal-content ft-modal-size"
      contentClassName="classification-modal-scroll"
      closeButtonClassName="modal-close"
      closeButtonAriaLabel="Close fee panel"
    >
      <FeeTransparencyContent />
    </ModalDialog>
  );
}
