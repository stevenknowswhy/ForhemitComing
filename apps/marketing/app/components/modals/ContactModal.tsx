"use client";

import { ModalDialog } from "../ui/ModalDialog";
import { ContactFormExperience } from "../contact/ContactFormExperience";
import "./contact-modal.css";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export function ContactModal({ isOpen, onClose, source = "website" }: ContactModalProps) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Contact"
      overlayClassName="contact-modal-overlay"
      className="contact-modal-content"
      closeButtonClassName="contact-modal-close"
      closeButtonAriaLabel="Close contact"
      renderCloseButton={({ onClose: close, className, ariaLabel }) => (
        <button className={className} onClick={close} aria-label={ariaLabel} type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    >
      <ContactFormExperience source={source} variant="modal" onAfterSuccessDismiss={onClose} />
    </ModalDialog>
  );
}
