"use client";

import React from "react";
import { RenderedLetter } from "../../types";

interface LetterPreviewProps {
  letter: RenderedLetter;
}

export function LetterPreview({ letter }: LetterPreviewProps) {
  return (
    <div className="ilg-letter">
      {/* Letter Header */}
      <div className="ilg-letter-header">
        <div className="ilg-letter-logo-block">
          <div className="ilg-letter-company">Forhemit</div>
          <div className="ilg-letter-tagline">Stewardship Management</div>
        </div>
        <div
          className="ilg-letter-contact-info"
          dangerouslySetInnerHTML={{
            __html: `${letter.addressHtml}<br>${letter.senderPhone} &nbsp;|&nbsp; ${letter.senderEmail}<br>${letter.senderWeb}`,
          }}
        />
      </div>

      {/* Date */}
      <div className="ilg-letter-date">{letter.date}</div>

      {/* Recipient */}
      <div className="ilg-letter-recipient">
        <div className="ilg-contact-name">{letter.contactName}</div>
        <div className="ilg-contact-title">{letter.contactTitle}</div>
        <div className="ilg-contact-company">{letter.contactCompany}</div>
        <div className="ilg-contact-company">{letter.contactCity}</div>
      </div>

      {/* Subject */}
      <div className="ilg-letter-subject">{letter.subject}</div>

      {/* Body */}
      <div className="ilg-letter-body">
        <p>{letter.greeting}</p>

        <p dangerouslySetInnerHTML={{ __html: letter.opening.replace(/\n/g, "<br>") }} />

        <div className="ilg-section-header">What We Do</div>
        <p>
          Forhemit is a stewardship management firm that guides business owners through the full
          lifecycle of ownership transitions. We combine transaction advisory, operational
          readiness, and relationship management to deliver outcomes that are financially sound
          and legacy-conscious. Our work spans acquisitions, divestitures, management buyouts,
          ESOP advisory, and succession planning — always with the goal of protecting what was
          built while positioning what comes next.
        </p>

        <div className="ilg-section-header">{letter.valueHeader}</div>
        <ul>
          {letter.valuePoints.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>

        <p dangerouslySetInnerHTML={{ __html: letter.cta.replace(/\n/g, "<br>") }} />
      </div>

      {/* Sign-off */}
      <div className="ilg-letter-sign-off">
        <div className="ilg-sign-close">With appreciation,</div>
        <div className="ilg-sign-name">{letter.senderName}</div>
        <div className="ilg-sign-title">
          {letter.senderTitle} &nbsp;·&nbsp; Forhemit
        </div>
        <div className="ilg-sign-contact">
          {letter.senderPhone}
          <br />
          {letter.senderEmail}
        </div>
      </div>

      {/* Footer */}
      <div className="ilg-letter-footer">
        <span>Forhemit · Stewardship Management</span>
        <span>Confidential Introduction</span>
      </div>
    </div>
  );
}
