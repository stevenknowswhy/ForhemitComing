"use client";

interface FooterProps {
  onLegalClick?: () => void;
}

export function Footer({ onLegalClick }: FooterProps) {
  return (
    <footer className="footer">
      <button className="footer-link" onClick={onLegalClick}>
        Legal
      </button>
    </footer>
  );
}
