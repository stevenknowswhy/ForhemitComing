"use client";

import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--color-brand)" }}>
              Something went wrong
            </h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "500px" }}>
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                background: "transparent",
                border: "1px solid var(--color-brand)",
                color: "var(--color-brand)",
                cursor: "pointer",
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Reload Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
