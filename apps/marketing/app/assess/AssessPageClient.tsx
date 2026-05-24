"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PROMPT_URL = "/prompts/esop-feasibility.txt";

export function AssessPageClient() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(PROMPT_URL);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback: open the prompt page so user can manually copy
      window.open(PROMPT_URL, "_blank");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--canvas)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Brand label */}
        <p
          style={{
            fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--sage)",
            marginBottom: "1.5rem",
          }}
        >
          Forhemit
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)",
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            fontWeight: 400,
            lineHeight: 1.2,
            color: "var(--ink)",
            marginBottom: "1rem",
          }}
        >
          ESOP Feasibility Assessment
        </h1>

        {/* Subhead */}
        <p
          style={{
            fontFamily: "var(--font-inter, 'Inter', system-ui, sans-serif)",
            fontSize: "1.0625rem",
            lineHeight: 1.7,
            color: "var(--stone)",
            marginBottom: "2.5rem",
          }}
        >
          Copy the prompt below and paste it into any AI assistant
          — ChatGPT, Claude, Gemini, or others. The AI will walk you through a
          15–20 minute assessment and produce a personalised feasibility report
          you can share with your CPA or attorney.
        </p>

        {/* Copy Button */}
        <Button
          onClick={handleCopy}
          disabled={loading}
          size="lg"
          style={{
            fontSize: "1rem",
            padding: "1rem 2.5rem",
            height: "auto",
            borderRadius: "6px",
            marginBottom: "1.25rem",
            cursor: loading ? "wait" : "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {copied ? (
            <>
              <CheckIcon /> Copied to Clipboard
            </>
          ) : loading ? (
            "Loading…"
          ) : (
            <>
              <CopyIcon /> Copy Prompt
            </>
          )}
        </Button>

        {/* View link */}
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--stone-light, var(--stone))",
            marginBottom: "3rem",
          }}
        >
          or{" "}
          <Link
            href={PROMPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--sage)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            view the full prompt text
          </Link>{" "}
          before copying
        </p>

        {/* How it works */}
        <div
          style={{
            borderTop: "1px solid var(--border-light, #E0D9D0)",
            paddingTop: "2rem",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)",
              fontSize: "1.25rem",
              fontWeight: 400,
              color: "var(--ink)",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            How It Works
          </h2>

          <ol
            style={{
              listStyle: "none",
              counterReset: "step",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {steps.map((step, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  fontFamily: "var(--font-inter, 'Inter', system-ui, sans-serif)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.6,
                  color: "var(--stone)",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--sage)",
                    color: "var(--canvas)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)",
                  }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Disclaimers */}
        <p
          style={{
            marginTop: "2.5rem",
            fontSize: "0.75rem",
            lineHeight: 1.6,
            color: "var(--stone-light, var(--stone))",
            borderTop: "1px solid var(--border-light, #E0D9D0)",
            paddingTop: "1.5rem",
          }}
        >
          This tool produces AI-generated estimates based on your inputs. It is
          not financial, tax, or legal advice. All figures require independent
          appraisal and professional review. Large language models make mistakes
          — do not make financial decisions based solely on this output.
        </p>

        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.75rem",
            color: "var(--stone-light, var(--stone))",
          }}
        >
          Forhemit Stewardship Management Co. · California Public Benefit
          Corporation ·{" "}
          <a
            href="https://forhemit.com"
            style={{ color: "var(--sage)", textDecoration: "underline", textUnderlineOffset: "2px" }}
          >
            forhemit.com
          </a>
        </p>
      </div>
    </main>
  );
}

/* ── Step content ── */
const steps = [
  "Click the button above to copy the full prompt to your clipboard.",
  "Open any AI assistant — ChatGPT, Claude, Gemini, or others — and paste the prompt.",
  "Answer the questions one at a time. The AI gives you colour-coded feedback after each answer.",
  "At the end, you'll receive a personalised feasibility report with your estimated proceeds, tax analysis, and a one-page summary you can share with your advisors.",
];

/* ── Inline SVG icons (no extra dependency) ── */

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginRight: 8 }}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginRight: 8 }}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
