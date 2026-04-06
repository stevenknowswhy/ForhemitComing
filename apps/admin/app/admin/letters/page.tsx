"use client";

import { useState } from "react";
import { LetterGeneratorForm } from "../templates/forms/intro-letter-generator";
import BrokerIntroductionEmail from "./components/BrokerIntroductionEmail";
import BrokerTearSheet from "./components/BrokerTearSheet";
import "../templates.css";
import "./letters.css";

interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "draft" | "archived";
  version: string;
  component: React.ComponentType;
}

const letterTemplates: LetterTemplate[] = [
  {
    id: "intro-letter",
    name: "Introduction Letter",
    description: "Generate professional introduction letters for prospects, partners, and stakeholders",
    category: "Correspondence",
    status: "active",
    version: "1.0",
    component: LetterGeneratorForm,
  },
  {
    id: "broker-intro",
    name: "Broker Introduction Email",
    description: "Email template for introducing Forhemit to business brokers with deal structure and economics",
    category: "Brokers",
    status: "active",
    version: "1.0",
    component: BrokerIntroductionEmail,
  },
  {
    id: "broker-tear-sheet",
    name: "Broker Tear Sheet",
    description: "One-page tear sheet with deal criteria, economics, and process overview — sent as PDF",
    category: "Brokers",
    status: "active",
    version: "1.0",
    component: BrokerTearSheet,
  },
];

export default function LettersPage() {
  const [activeLetterId, setActiveLetterId] = useState<string | null>(null);

  const activeLetter = letterTemplates.find((l) => l.id === activeLetterId);
  const ActiveComponent = activeLetter?.component;

  const openLetter = (id: string) => {
    setActiveLetterId(id);
  };

  const closeLetter = () => {
    setActiveLetterId(null);
  };

  return (
    <div className="admin-page-container letters-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Letters</h1>
        <p className="admin-page-subtitle">
          Generate professional introduction and correspondence letters
        </p>
      </div>

      {/* Letter Cards Grid - Uses same classes as templates */}
      <div className="templates-grid">
        {letterTemplates.map((letter) => (
          <div key={letter.id} className="template-card">
            <div className="template-card-header">
              <div className="template-card-badge">{letter.category}</div>
              <div className={`template-card-status template-status-${letter.status}`}>
                {letter.status}
              </div>
            </div>

            <h3 className="template-card-name">{letter.name}</h3>
            <p className="template-card-desc">{letter.description}</p>

            <div className="template-card-meta">
              <span>v{letter.version}</span>
            </div>

            <div className="template-card-actions">
              <button
                type="button"
                className="template-btn template-btn-primary"
                onClick={() => openLetter(letter.id)}
              >
                📝 Create Letter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Letter Modal - Uses same classes as template modal */}
      {activeLetterId && ActiveComponent && (
        <div className="template-modal-overlay" onClick={closeLetter}>
          <div
            className="template-modal-content letter-modal-wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="template-modal-header">
              <h2 className="template-modal-title">{activeLetter?.name}</h2>
              <button
                type="button"
                className="template-modal-close"
                onClick={closeLetter}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="template-modal-body letter-modal-body">
              <ActiveComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
