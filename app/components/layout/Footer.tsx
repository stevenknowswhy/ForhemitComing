"use client";

interface FooterProps {
  onLegalClick?: () => void;
}

export function Footer({ onLegalClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div
        className="footer-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          color: "var(--muted-text)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        <span>&copy; {currentYear} Forhemit Capital</span>
        <span
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "var(--muted-text)",
            opacity: 0.6,
            flexShrink: 0,
          }}
        />
        <span style={{ whiteSpace: "nowrap" }}>All Rights Reserved</span>
        <span
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "var(--muted-text)",
            opacity: 0.6,
            flexShrink: 0,
          }}
        />
        <button
          className="footer-legal-btn"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted-text)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "all 0.3s ease",
            position: "relative",
            whiteSpace: "nowrap",
          }}
          onClick={onLegalClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--light-text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted-text)";
          }}
        >
          Legal
        </button>
      </div>
    </footer>
  );
}
