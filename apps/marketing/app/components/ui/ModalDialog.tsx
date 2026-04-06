"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

type ModalDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  closeButtonClassName?: string;
  closeButtonAriaLabel?: string;
  renderCloseButton?: (args: {
    onClose: () => void;
    className?: string;
    ariaLabel: string;
  }) => React.ReactNode;
  shouldCloseOnOverlayClick?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return nodes.filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
}

export function ModalDialog({
  isOpen,
  onClose,
  title,
  children,
  className,
  overlayClassName,
  contentClassName,
  closeButtonClassName,
  closeButtonAriaLabel = "Close",
  renderCloseButton,
  shouldCloseOnOverlayClick = true,
  onKeyDown,
}: ModalDialogProps) {
  const reactTitleId = useId();
  const titleId = useMemo(() => `dialog-title-${reactTitleId}`, [reactTitleId]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    lastActiveElementRef.current =
      typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus something inside the dialog (prefer first focusable)
    queueMicrotask(() => {
      const focusables = getFocusable(contentRef.current);
      (focusables[0] ?? contentRef.current)?.focus?.();
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      lastActiveElementRef.current?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);

    if (e.defaultPrevented) return;

    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key !== "Tab") return;

    const focusables = getFocusable(contentRef.current);
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? focusables.indexOf(active) : -1;
    const nextIndex = (() => {
      if (e.shiftKey) return currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
      return currentIndex === focusables.length - 1 ? 0 : currentIndex + 1;
    })();

    e.preventDefault();
    focusables[nextIndex]?.focus();
  };

  return createPortal(
    <div
      className={overlayClassName}
      onMouseDown={(e) => {
        if (!shouldCloseOnOverlayClick) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
      >
        {renderCloseButton ? (
          renderCloseButton({ onClose, className: closeButtonClassName, ariaLabel: closeButtonAriaLabel })
        ) : (
          <button
            type="button"
            className={closeButtonClassName}
            onClick={onClose}
            aria-label={closeButtonAriaLabel}
          >
            &times;
          </button>
        )}

        <div ref={contentRef} className={contentClassName} tabIndex={-1}>
          <h2 id={titleId} style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

