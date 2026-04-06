"use client";

/** Data-entry UI + off-screen contract DOM for PDF/print (see EngagementContractDocument). */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { TemplateFormHandle } from "../../registry";
import EngagementContractDocument from "./EngagementContractDocument";
import { calcFee } from "./calculations";
import { generateEngagementPDF } from "./pdf-generator";
import type { ELData, RetainerMethod, TailOption } from "./types";
import { STATES } from "./constants";
import "@/app/admin/templates/styles/forms/engagement-letter-form-base.css";

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Component ────────────────────────────────────────────────────────────────

const EngagementLetterForm = forwardRef<
  TemplateFormHandle,
  { initialData?: Record<string, unknown>; isStandalone?: boolean }
>(function EngagementLetterForm({ initialData, isStandalone }, ref) {
  /** Contract-only DOM: html2canvas + server PDF + browser print target (not the data-entry UI). */
  const contractRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState<string>("sec1");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [d, setD] = useState<ELData>(() => {
    const base: ELData = {
      s_company: "", s_ref: "", s_date: isoToday(),
      state: "", officer_name: "", officer_title: "", company_email: "",
      retainer_date: "", retainer_method: "Wire Transfer", ack_retainer: false,
      ev: "", ev_source: "Preliminary seller estimate", ack_fee: false,
      tax_struct: "", emp_count: "", erisa_elig: "", other_loi: "", ack_reps: false,
      has_broker: "", broker_name: "", broker_firm: "", broker_email: "",
      gov_law: "", venue_county: "", tail: "", exclusivity: "Standard — duration of engagement", special_terms: "",
      ack_arbitration: false, ack_liability: false, ack_indemnity: false,
      fhm_signer: "Stefano Stokes", fhm_title: "Founder & Managing Director", ack_final: false,
    };
    if (!initialData) return base;
    return { ...base, ...(initialData as Partial<ELData>) };
  });

  // Pull shared fields from localStorage (same key as the standalone HTML)
  useEffect(() => {
    if (isStandalone) return;
    try {
      const raw = localStorage.getItem("fhm_shared");
      if (!raw) return;
      const p = JSON.parse(raw) as { company?: string; ref?: string; date?: string };
      setD((prev) => ({
        ...prev,
        s_company: prev.s_company || p.company || "",
        s_ref: prev.s_ref || p.ref || "",
        s_date: prev.s_date || p.date || isoToday(),
      }));
    } catch { /* ignore */ }
  }, []);

  // Write shared fields back so stewardship form picks them up
  useEffect(() => {
    if (isStandalone) return;
    try {
      localStorage.setItem("fhm_shared", JSON.stringify({ company: d.s_company, ref: d.s_ref, date: d.s_date }));
    } catch { /* ignore */ }
  }, [d.s_company, d.s_ref, d.s_date]);

  const fee = useMemo(() => calcFee(d.ev), [d.ev]);
  const showScorp = d.tax_struct === "S-Corporation" || d.tax_struct === "LLC (taxed as S-corp)";

  const complete = useMemo(() => ({
    sec1: !!(d.s_company.trim() && d.s_ref.trim() && d.state && d.officer_name.trim() && d.officer_title.trim() && d.company_email.trim()),
    sec2: true,
    sec3: !!(d.retainer_date && d.ack_retainer),
    sec4: !!(parseFloat(d.ev) > 0 && d.ack_fee),
    sec5: !!(d.tax_struct && d.emp_count.trim() && d.erisa_elig && d.other_loi && d.ack_reps),
    sec6: d.has_broker === "yes" || d.has_broker === "no",
    sec7: !!(d.gov_law && d.tail),
    sec8: d.ack_arbitration,
    sec9: d.ack_liability,
    sec10: d.ack_indemnity,
    sec11: !!(d.fhm_signer.trim() && d.ack_final),
  }), [d]);

  const progressDone = Object.values(complete).filter(Boolean).length;
  const progressTotal = 11;
  const progressPct = Math.round((progressDone / progressTotal) * 100);

  const toggle = useCallback((id: string) => setOpen((p) => (p === id ? "" : id)), []);

  useImperativeHandle(ref, () => ({
    getFormData: () => d as unknown as Record<string, unknown>,
    getContainerRef: () => contractRef.current,
    generatePDF: () => generateEngagementPDF(d),
    printContract: () => {
      // Open the off-screen contract in a print-friendly window
      const contractEl = contractRef.current;
      if (!contractEl) return;
      const printWindow = window.open("", "_blank", "width=816,height=1056");
      if (!printWindow) return;
      printWindow.document.write(`<!DOCTYPE html><html><head>
        <title>Forhemit Engagement Letter</title>
        <style>
          @page { size: letter; margin: 0.5in; }
          body { margin: 0; padding: 48px 56px; font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; line-height: 1.55; color: #1c1510; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .el-cd-cover { text-align: center; margin-bottom: 2.5rem; page-break-after: always; }
          .el-cd-brand { font-size: 28pt; font-weight: 700; color: #1b2a4a; letter-spacing: 0.08em; margin-bottom: 0.25rem; }
          .el-cd-tag { font-size: 11pt; color: #9a7540; margin-bottom: 2rem; }
          .el-cd-title { font-size: 18pt; font-weight: 700; color: #1b2a4a; margin-bottom: 0.35rem; }
          .el-cd-subtitle { font-size: 10pt; font-style: italic; color: #7a7068; margin-bottom: 1.5rem; }
          .el-cd-rule { border: none; border-top: 1px solid #d6d0c4; margin: 1.25rem 0; }
          .el-cd-meta { text-align: left; max-width: 420px; margin: 0 auto; }
          .el-cd-meta div { display: grid; grid-template-columns: 160px 1fr; gap: 0.5rem 1rem; margin-bottom: 0.65rem; font-size: 10pt; }
          .el-cd-meta dt { font-weight: 700; color: #7a7068; text-transform: uppercase; font-size: 8pt; letter-spacing: 0.06em; }
          .el-cd-meta dd { margin: 0; color: #1c1510; }
          .el-cd-footer-note { font-size: 8pt; color: #7a7068; font-style: italic; margin-top: 1rem; }
          .el-cd-section { margin-bottom: 1.35rem; break-inside: auto; }
          .el-cd-section h3 { font-size: 11pt; font-weight: 700; color: #1b2a4a; border-bottom: 2px solid #9a7540; padding-bottom: 0.35rem; margin-bottom: 0.75rem; break-after: avoid; }
          .el-cd-section p { margin: 0 0 0.65rem; text-align: justify; orphans: 3; widows: 3; }
          .el-cd-signatures { margin-top: 2rem; page-break-before: always; }
          .el-cd-signatures h3 { font-size: 11pt; color: #1b2a4a; margin-bottom: 1rem; }
          .el-cd-sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
          .el-cd-sig-party { font-size: 8pt; font-weight: 700; letter-spacing: 0.08em; color: #1b2a4a; margin-bottom: 0.25rem; }
          .el-cd-sig-sub { font-size: 7.5pt; color: #7a7068; margin: 0 0 0.5rem; }
          .el-cd-sig-line { border-bottom: 1px solid #d6d0c4; height: 28px; margin-bottom: 0.2rem; }
          .el-cd-sig-label { font-size: 8pt; color: #7a7068; font-style: italic; margin: 0 0 0.65rem; }
          .el-cd-broker { margin-top: 1.75rem; break-inside: avoid; }
          .el-cd-broker h4 { font-size: 8pt; letter-spacing: 0.06em; text-transform: uppercase; color: #7a7068; margin-bottom: 0.5rem; }
          .el-cd-broker-note { font-size: 7.5pt; font-style: italic; color: #7a7068; margin-bottom: 0.75rem; line-height: 1.45; }
          .el-cd-doc-footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #d6d0c4; font-size: 7.5pt; color: #7a7068; text-align: center; break-inside: avoid; }
          .el-cd-doc-footer p { margin: 0.25rem 0; }
          .el-cd-terms { break-inside: auto; }
        </style>
      </head><body>${contractEl.innerHTML}</body></html>`);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => { printWindow.print(); printWindow.close(); }, 400);
    },
  }), [d]);

  const upd = useCallback(<K extends keyof ELData>(key: K, val: ELData[K]) => setD((p) => ({ ...p, [key]: val })), []);

  // ── Render helpers ──────────────────────────────────────────────────────────

  const SectionHead = ({ id, num, title }: { id: string; num: string; title: string }) => (
    <div className="el-section-head" onClick={() => toggle(id)}>
      <span className="el-section-num">{num}</span>
      <span className="el-section-title">{title}</span>
      <span className={`el-section-status ${complete[id as keyof typeof complete] ? "complete" : ""}`}>
        {complete[id as keyof typeof complete] ? "Complete" : "Incomplete"}
      </span>
      <span className="el-section-chevron">▾</span>
    </div>
  );

  const Ack = ({ id, text }: { id: keyof ELData; text: React.ReactNode }) => (
    <div className="el-ack">
      <label className="el-ack-check">
        <input type="checkbox" checked={d[id] as boolean} onChange={(e) => upd(id, e.target.checked as ELData[typeof id])} />
        <span className="el-ack-text">{text}</span>
      </label>
    </div>
  );

  // ── JSX ──────────────────────────────────────────────────────────────────────

  return (
    <div className="el-root">
      <div className="el-no-print">
      <div className="el-shell">
        {/* Top bar */}
        <div className="el-topbar">
          <span className="el-topbar-mark">Forhemit Transition Stewardship</span>
          <div className="el-topbar-right">
            <span className="el-topbar-label">Document</span>
            <span className="el-topbar-doc">10 — Engagement Letter (REVISED v1.1)</span>
          </div>
        </div>

        {/* Page header */}
        <div style={{ marginBottom: 20, marginTop: 12 }}>
          <p style={{ fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--brass)", marginBottom: 8, fontFamily: "var(--ff-b)" }}>Admin — Contract Generation</p>
          <h1 style={{ fontFamily: "var(--ff-d)", fontSize: 38, fontWeight: 300, color: "var(--navy)", lineHeight: 1.1, marginBottom: 8 }}>Engagement Letter</h1>
          <p style={{ fontSize: 13, fontWeight: 300, color: "var(--muted)", lineHeight: 1.7, maxWidth: 520 }}>Complete all required fields to generate and execute the client engagement letter. Revised version incorporates attorney recommendations including clarified tail provisions, ERISA disclaimers, and expanded protections for both parties.</p>
        </div>

        {/* Progress */}
        <div className="el-progress-wrap">
          <div className="el-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="el-progress-label">{progressDone} of {progressTotal} sections complete</p>

        {/* Shared fields banner */}
        <div className="el-banner">
          <p className="el-banner-label">Shared Fields — auto-populate into both documents</p>
          <div className="el-banner-grid">
            <div className="el-banner-field">
              <label>Company Legal Name</label>
              <input value={d.s_company} placeholder="Acme Medical Group, LLC" onChange={(e) => upd("s_company", e.target.value)} />
            </div>
            <div className="el-banner-field">
              <label>Engagement Reference #</label>
              <input value={d.s_ref} placeholder="FHM-2025-001" onChange={(e) => upd("s_ref", e.target.value)} />
            </div>
            <div className="el-banner-field">
              <label>Effective Date</label>
              <input type="date" value={d.s_date} onChange={(e) => upd("s_date", e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── SECTION 1: Parties ─────────────────────────────────────────────── */}
        <div className={`el-section ${open === "sec1" ? "open" : ""}`}>
          <SectionHead id="sec1" num="01" title="Parties & Authorized Officer" />
          <div className="el-section-body">
            <div className="el-field-grid">
              <div className="el-field">
                <label>Company Legal Name <span className="req">*</span></label>
                <input className="prefilled" value={d.s_company} readOnly placeholder="Auto-filled from shared fields" />
              </div>
              <div className="el-field">
                <label>State of Incorporation / Organization <span className="req">*</span></label>
                <select value={d.state} onChange={(e) => upd("state", e.target.value)}>
                  <option value="">Select state…</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="el-field">
                <label>Authorized Officer — Full Name <span className="req">*</span></label>
                <input value={d.officer_name} placeholder="Dr. Jane Smith" onChange={(e) => upd("officer_name", e.target.value)} />
              </div>
              <div className="el-field">
                <label>Authorized Officer — Title <span className="req">*</span></label>
                <input value={d.officer_title} placeholder="Chief Executive Officer / Managing Member" onChange={(e) => upd("officer_title", e.target.value)} />
              </div>
              <div className="el-field">
                <label>Company Email (for document delivery) <span className="req">*</span></label>
                <input type="email" value={d.company_email} placeholder="officer@company.com" onChange={(e) => upd("company_email", e.target.value)} />
              </div>
              <div className="el-field">
                <label>Engagement Reference # <span className="req">*</span></label>
                <input className="prefilled" value={d.s_ref} readOnly placeholder="Auto-filled from shared fields" />
              </div>
            </div>
            <div className="el-note">The authorized officer signs in their capacity as an officer of the Company only — not in their individual personal capacity. Forhemit's fees are obligations of the Company, not the individual.</div>
          </div>
        </div>

        {/* ── SECTION 2: Scope ───────────────────────────────────────────────── */}
        <div className={`el-section ${open === "sec2" ? "open" : ""}`}>
          <SectionHead id="sec2" num="02" title="Scope Confirmation & No Results Disclaimer" />
          <div className="el-section-body">
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14, lineHeight: 1.7 }}>Confirm the services included in this engagement. Standard scope is pre-selected.</p>
            <div className="el-check-group">
              {[
                "Transaction coordination — team assembly and management",
                "COOP pre-assessment — operational continuity documentation",
                "Lender package preparation — SBA underwriting materials",
                "Capital stack structuring support",
                "120-day timeline management",
                "Broker and advisor coordination",
                "Closing coordination and post-close stewardship handoff",
              ].map((item) => (
                <label key={item} className="el-check-opt selected">
                  <input type="checkbox" defaultChecked />
                  <div><div className="el-radio-opt-label">{item}</div></div>
                </label>
              ))}
            </div>
            <div className="el-note" style={{ marginTop: 10 }}>Scope confirmed. Any modifications must be made by written amendment signed by both parties.</div>
            <div className="el-alert" style={{ marginTop: 14 }}>
              <strong>NO RESULTS DISCLAIMER:</strong> Company acknowledges that Forhemit does not and cannot guaranty any specific transaction outcome, including successful closing, financing terms, valuation, purchase price, or timing. The ultimate success of any transaction depends on numerous factors outside Forhemit's control, including market conditions, lender decisions, regulatory requirements, and economic conditions. The success fee is earned upon consummation of a transaction, not upon achievement of any particular terms or valuation.
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Retainer ────────────────────────────────────────────── */}
        <div className={`el-section ${open === "sec3" ? "open" : ""}`}>
          <SectionHead id="sec3" num="03" title="Retainer" />
          <div className="el-section-body">
            <div className="el-computed">
              <div className="el-computed-label">Retainer Amount</div>
              <div className="el-computed-val">$25,000.00</div>
              <div className="el-computed-note">Paid from Company operating account within 5 business days of execution. Does not apply toward any other fee. <strong>Non-refundable except as set forth below.</strong></div>
            </div>
            <div className="el-field-grid">
              <div className="el-field">
                <label>Expected Payment Date <span className="req">*</span></label>
                <input type="date" value={d.retainer_date} onChange={(e) => upd("retainer_date", e.target.value)} />
              </div>
              <div className="el-field">
                <label>Payment Method</label>
                <select value={d.retainer_method} onChange={(e) => upd("retainer_method", e.target.value as RetainerMethod)}>
                  <option>Wire Transfer</option>
                  <option>ACH</option>
                  <option>Check</option>
                </select>
              </div>
            </div>
            <div className="el-note">
              <strong>LIMITED REFUND EXCEPTION:</strong> The Retainer is non-refundable except in the event that Forhemit materially breaches this Agreement, fails to substantially perform the services contemplated herein, or the Agreement is terminated by Company prior to Forhemit's commencement of material services. In any such event, the Retainer shall be pro-rated based on services actually rendered and the unearned portion shall be refunded to the Company.
            </div>
            <Ack id="ack_retainer" text="I confirm that the authorized officer has read and understood Section 3 of the Engagement Letter: the $25,000 retainer is non-refundable under the circumstances described above, does not apply toward any closing fee, and compensates Forhemit for work that begins immediately upon execution." />
          </div>
        </div>

        {/* ── SECTION 4: Success Fee ─────────────────────────────────────────── */}
        <div className={`el-section ${open === "sec4" ? "open" : ""}`}>
          <SectionHead id="sec4" num="04" title="Transition Success Fee" />
          <div className="el-section-body">
            <div className="el-field-grid">
              <div className="el-field">
                <label>Estimated Enterprise Value <span className="req">*</span></label>
                <input type="number" value={d.ev} placeholder="10000000" onChange={(e) => upd("ev", e.target.value)} />
                <div className="el-field-hint">From LOI or preliminary valuation. Used to determine applicable fee tier.</div>
              </div>
              <div className="el-field">
                <label>EV Source</label>
                <select value={d.ev_source} onChange={(e) => upd("ev_source", e.target.value)}>
                  <option>Preliminary seller estimate</option>
                  <option>Broker opinion of value</option>
                  <option>LOI / term sheet</option>
                  <option>QofE-adjusted</option>
                </select>
              </div>
            </div>
            <div className="el-computed">
              <div className="el-computed-label">Applicable Success Fee Tier</div>
              <div className="el-computed-val">{fee.fee}</div>
              <div className="el-computed-note">{fee.label}</div>
            </div>
            <table className="el-fee-table">
              <thead>
                <tr><th>Enterprise Value</th><th>Success Fee</th><th>Payment Trigger</th></tr>
              </thead>
              <tbody>
                <tr className={fee.tier === 1 ? "active-row" : ""}><td>Under $8M</td><td>$25,000</td><td>At Closing Date</td></tr>
                <tr className={fee.tier === 2 ? "active-row" : ""}><td>$8M – $12M</td><td>$35,000</td><td>At Closing Date</td></tr>
                <tr className={fee.tier === 3 ? "active-row" : ""}><td>Above $12M</td><td>$45,000</td><td>At Closing Date</td></tr>
              </tbody>
            </table>
            <div className="el-note">The success fee is paid by the Company from operating funds. It does not appear on the closing statement. It does not reduce seller proceeds. Forhemit invoices the Company directly within 2 business days of close; payment due within 10 business days.</div>
            <div className="el-note" style={{ marginTop: 8 }}>
              <strong>FEE ADJUSTMENT:</strong> The Transition Success Fee shall be calculated based on the Enterprise Value reflected in the final closing statement. If the actual Enterprise Value at closing differs by more than 10% from the initial estimate, the parties agree to negotiate in good faith an appropriate adjustment to the Transition Success Fee prior to closing.
            </div>
            <div className="el-note" style={{ marginTop: 8 }}>
              <strong>LATE PAYMENT:</strong> If the Transition Success Fee is not paid when due, it shall accrue interest at the rate of 1.5% per month (or the maximum rate permitted by applicable law) from the due date until paid in full. In the event of collection action, Company shall be liable for all costs of collection, including reasonable attorneys' fees.
            </div>
            <Ack id="ack_fee" text={<>I confirm the estimated enterprise value entered above and acknowledge the applicable success fee tier, including the adjustment mechanism if actual EV differs by more than 10%. The fee is payable by the Company at closing and <strong>does not reduce seller proceeds or broker commission.</strong></>} />
          </div>
        </div>

        {/* ── SECTION 5: Company Representations ────────────────────────────── */}
        <div className={`el-section ${open === "sec5" ? "open" : ""}`}>
          <SectionHead id="sec5" num="05" title="Company Representations" />
          <div className="el-section-body">
            <div className="el-field-grid">
              <div className="el-field">
                <label>Current Tax Structure <span className="req">*</span></label>
                <select value={d.tax_struct} onChange={(e) => upd("tax_struct", e.target.value)}>
                  <option value="">Select…</option>
                  <option>C-Corporation</option>
                  <option>S-Corporation</option>
                  <option>LLC (taxed as C-corp)</option>
                  <option>LLC (taxed as S-corp)</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="el-field">
                <label>Approximate Employee Count <span className="req">*</span></label>
                <input type="number" value={d.emp_count} placeholder="45" onChange={(e) => upd("emp_count", e.target.value)} />
              </div>
            </div>
            {showScorp && (
              <div className="el-alert">
                <strong>⚠ SECTION 1042 ROLLOVER WARNING:</strong> Section 1042 of the Internal Revenue Code may allow qualifying sellers to defer capital gains tax by reinvesting sale proceeds in Qualified Replacement Property (QRP). HOWEVER, this election is ONLY available if the selling entity is a C-Corporation at the time of sale. S-Corporations DO NOT qualify.{"\n\n"}Converting from S-Corp to C-Corp to access §1042 has PERMANENT tax consequences: (1) double taxation on all future earnings; (2) built-in gains tax may apply; (3) pass-through losses eliminated; (4) state tax treatment changes. This conversion is IRREVERSIBLE. Company MUST consult with qualified tax counsel BEFORE executing any Letter of Intent. Forhemit does NOT provide tax advice and makes NO recommendation regarding §1042 election or S-Corp conversion.
              </div>
            )}
            <div className="el-field-grid" style={{ marginTop: 14 }}>
              <div className="el-field">
                <label>ERISA Workforce Eligibility Confirmed? <span className="req">*</span></label>
                <select value={d.erisa_elig} onChange={(e) => upd("erisa_elig", e.target.value)}>
                  <option value="">Select…</option>
                  <option>Yes — all employees are US citizens or lawful permanent residents</option>
                  <option>Needs review — some employees may not qualify</option>
                  <option>Unknown — flagged for ERISA counsel review</option>
                </select>
              </div>
              <div className="el-field">
                <label>Pending LOI / Exclusive Agreement with Another Buyer? <span className="req">*</span></label>
                <select value={d.other_loi} onChange={(e) => upd("other_loi", e.target.value)}>
                  <option value="">Select…</option>
                  <option>No — no pending LOI or exclusive agreement</option>
                  <option>Yes — disclosed in writing to Forhemit</option>
                </select>
              </div>
            </div>
            <Ack id="ack_reps" text={<>The authorized officer confirms that all financial statements and operational disclosures provided to Forhemit are <strong>accurate and complete in all material respects</strong>, and that no material liabilities, pending litigation, or regulatory actions have been withheld. These representations shall survive termination of this Agreement for a period of three (3) years.</>} />
          </div>
        </div>

        {/* ── SECTION 6: Broker ──────────────────────────────────────────────── */}
        <div className={`el-section ${open === "sec6" ? "open" : ""}`}>
          <SectionHead id="sec6" num="06" title="Broker / M&A Advisor" />
          <div className="el-section-body">
            <div className="el-radio-group" style={{ marginBottom: 14 }}>
              <label className={`el-radio-opt ${d.has_broker === "yes" ? "selected" : ""}`}>
                <input type="radio" name="el_has_broker" value="yes" checked={d.has_broker === "yes"} onChange={() => upd("has_broker", "yes")} />
                <div>
                  <div className="el-radio-opt-label">Yes — a broker / M&A advisor is engaged</div>
                  <div className="el-radio-opt-sub">Broker will sign as witness on this document</div>
                </div>
              </label>
              <label className={`el-radio-opt ${d.has_broker === "no" ? "selected" : ""}`}>
                <input type="radio" name="el_has_broker" value="no" checked={d.has_broker === "no"} onChange={() => upd("has_broker", "no")} />
                <div>
                  <div className="el-radio-opt-label">No — no broker engaged</div>
                  <div className="el-radio-opt-sub">Seller is navigating the process directly</div>
                </div>
              </label>
            </div>
            {d.has_broker === "yes" && (
              <>
                <div className="el-field-grid three">
                  <div className="el-field">
                    <label>Broker Full Name</label>
                    <input value={d.broker_name} placeholder="John Advisor" onChange={(e) => upd("broker_name", e.target.value)} />
                  </div>
                  <div className="el-field">
                    <label>Broker Firm</label>
                    <input value={d.broker_firm} placeholder="Firm Name" onChange={(e) => upd("broker_firm", e.target.value)} />
                  </div>
                  <div className="el-field">
                    <label>Broker Email</label>
                    <input type="email" value={d.broker_email} placeholder="broker@firm.com" onChange={(e) => upd("broker_email", e.target.value)} />
                  </div>
                </div>
                <div className="el-note"><strong>ROLE DELINEATION:</strong> Any broker or M&A advisor identified by Company acts independently of Forhemit. Forhemit's role is limited to transaction stewardship and coordination services. The broker is responsible for: (i) identifying potential buyers; (ii) negotiating purchase price and terms; (iii) managing the sale process. Forhemit is NOT compensated based on transaction price and Forhemit's fees are NOT calculated as a percentage of transaction value. The broker's signature on this document acknowledges review of fee terms only and creates NO joint venture, partnership, or agency relationship between Forhemit and the broker.</div>
              </>
            )}
          </div>
        </div>

        {/* ── SECTION 7: Governing Law & Tail ───────────────────────────────── */}
        <div className={`el-section ${open === "sec7" ? "open" : ""}`}>
          <SectionHead id="sec7" num="07" title="Governing Law & Tail Provision" />
          <div className="el-section-body">
            <div className="el-field-grid">
              <div className="el-field">
                <label>Governing Law State <span className="req">*</span></label>
                <select value={d.gov_law} onChange={(e) => upd("gov_law", e.target.value)}>
                  <option value="">Select…</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="el-field">
                <label>Venue County (for disputes)</label>
                <input value={d.venue_county} placeholder="e.g., Santa Clara" onChange={(e) => upd("venue_county", e.target.value)} />
              </div>
            </div>
            <div className="el-field-grid">
              <div className="el-field">
                <label>180-Day Tail Provision <span className="req">*</span></label>
                <select value={d.tail} onChange={(e) => upd("tail", e.target.value as TailOption)}>
                  <option value="">Select…</option>
                  <option>Include — standard with notice requirement (recommended)</option>
                  <option>Include — with termination for cause exception</option>
                  <option>Waive — by written agreement only</option>
                </select>
                <div className="el-field-hint">REVISED: Tail only applies if Forhemit introduced the buyer/investor AND provided written notice prior to termination. Does NOT apply if terminated for Forhemit's material breach.</div>
              </div>
              <div className="el-field">
                <label>Exclusivity Window</label>
                <select value={d.exclusivity} onChange={(e) => upd("exclusivity", e.target.value)}>
                  <option>Standard — duration of engagement</option>
                  <option>Extended — 12 months from execution</option>
                </select>
              </div>
            </div>
            <div className="el-field-grid">
              <div className="el-field" style={{ gridColumn: "1 / -1" }}>
                <label>Special Terms or Notes</label>
                <textarea value={d.special_terms} placeholder="Any modifications to standard terms agreed between parties…" onChange={(e) => upd("special_terms", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 8: Dispute Resolution ─────────────────────────────────── */}
        <div className={`el-section ${open === "sec8" ? "open" : ""}`}>
          <SectionHead id="sec8" num="08" title="Dispute Resolution" />
          <div className="el-section-body">
            <div className="el-note">
              <strong>ARBITRATION AGREEMENT:</strong> Any dispute arising under this Agreement shall be resolved by binding arbitration administered by JAMS pursuant to its Comprehensive Arbitration Rules and Procedures. The arbitration shall be conducted in the county specified in Section 7 and heard by a single arbitrator with experience in commercial services disputes. The arbitrator may award costs and reasonable attorneys' fees to the prevailing party. Either Party may seek injunctive relief in court to protect confidential information or proprietary rights.
            </div>
            <Ack id="ack_arbitration" text="Company acknowledges and agrees to the dispute resolution provisions set forth above, including binding arbitration and waiver of class action participation." />
          </div>
        </div>

        {/* ── SECTION 9: Limitation of Liability ────────────────────────────── */}
        <div className={`el-section ${open === "sec9" ? "open" : ""}`}>
          <SectionHead id="sec9" num="09" title="Limitation of Liability" />
          <div className="el-section-body">
            <div className="el-alert">
              <strong>LIABILITY CAP:</strong> EXCEPT FOR BREACH OF CONFIDENTIALITY, WILLFUL MISCONDUCT, OR GROSS NEGLIGENCE, FORHEMIT'S TOTAL AGGREGATE LIABILITY TO COMPANY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES ACTUALLY PAID TO FORHEMIT HEREUNDER.{"\n\n"}IN NO EVENT SHALL FORHEMIT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE.{"\n\n"}FORHEMIT SHALL NOT BE LIABLE FOR ANY DECISIONS MADE BY COMPANY, ANY THIRD PARTY (INCLUDING LENDERS, INVESTORS, OR ADVISORS), OR ANY TRANSACTION OUTCOMES.
            </div>
            <Ack id="ack_liability" text="Company acknowledges and agrees to the limitation of liability provisions set forth above." />
          </div>
        </div>

        {/* ── SECTION 10: Indemnification ────────────────────────────────────── */}
        <div className={`el-section ${open === "sec10" ? "open" : ""}`}>
          <SectionHead id="sec10" num="10" title="Indemnification" />
          <div className="el-section-body">
            <div className="el-note">
              <strong>MUTUAL INDEMNIFICATION:</strong> Each Party agrees to indemnify the other for losses arising from third-party claims caused by its own gross negligence, willful misconduct, or material breach. Company additionally indemnifies Forhemit for claims arising from Company's material breach, fraud, or intellectual property infringement caused by Company's materials.
            </div>
            <Ack id="ack_indemnity" text="Company acknowledges and agrees to the mutual indemnification provisions set forth above." />
          </div>
        </div>

        {/* ── SECTION 11: Final Acknowledgment ──────────────────────────────── */}
        <div className={`el-section ${open === "sec11" ? "open" : ""}`}>
          <SectionHead id="sec11" num="11" title="Final Acknowledgment & Additional Disclaimers" />
          <div className="el-section-body">
            <div className="el-field-grid">
              <div className="el-field">
                <label>Forhemit Authorized Signatory <span className="req">*</span></label>
                <input value={d.fhm_signer} placeholder="Stefano Stokes" onChange={(e) => upd("fhm_signer", e.target.value)} />
              </div>
              <div className="el-field">
                <label>Forhemit Signatory Title</label>
                <input value={d.fhm_title} onChange={(e) => upd("fhm_title", e.target.value)} />
              </div>
            </div>
            <div className="el-alert" style={{ marginTop: 10 }}>
              <strong>ERISA DISCLAIMER:</strong> Forhemit is NOT an ERISA fiduciary and does NOT provide ERISA legal advice. All matters relating to ESOP plan qualification, employee eligibility, prohibited transactions, and fiduciary duties must be reviewed by independent ERISA counsel. Company represents that it has retained or will retain such counsel prior to signing any Letter of Intent.
            </div>
            <div className="el-alert" style={{ marginTop: 8 }}>
              <strong>TAX ADVICE DISCLAIMER:</strong> Forhemit does NOT provide tax, accounting, or financial advisory services. All tax matters must be reviewed by independent qualified tax professionals. Forhemit makes NO representations or warranties regarding any tax consequences of any transaction structure.
            </div>
            <div className="el-note" style={{ marginTop: 8 }}>
              <strong>INDEPENDENT CONTRACTOR:</strong> The Parties are independent contractors. This Agreement does not create a partnership, joint venture, or employer-employee relationship. Forhemit shall have no authority to bind Company except as expressly provided.
            </div>
            <Ack id="ack_final" text={<>I confirm all information entered is accurate. The generated document will be downloaded as a PDF. <strong>This form does not constitute execution — wet or electronic signatures are still required.</strong></>} />

            {/* Preview panel */}
            <div style={{ marginTop: 16 }}>
              <button className="el-preview-toggle" type="button" onClick={() => setPreviewOpen((p) => !p)}>
                {previewOpen ? "▼ Hide preview" : "▶ Preview document summary"}
              </button>
              <div className={`el-preview-panel ${previewOpen ? "open" : ""}`}>
                <h3>Engagement Letter — Preview</h3>
                <p>
                  <strong>Company:</strong> <span className="el-preview-field">{d.s_company || "—"}</span><br />
                  <strong>Authorized Officer:</strong> <span className="el-preview-field">{d.officer_name}{d.officer_title ? `, ${d.officer_title}` : ""}</span><br />
                  <strong>Effective Date:</strong> <span className="el-preview-field">{d.s_date || "—"}</span><br />
                  <strong>Reference:</strong> <span className="el-preview-field">{d.s_ref || "—"}</span>
                </p>
                <p>
                  <strong>Retainer:</strong> $25,000 — non-refundable (with breach exception), paid from Company operating account<br />
                  <strong>Success Fee:</strong> <span className="el-preview-field">{fee.fee}</span><br />
                  <strong>Governing Law:</strong> <span className="el-preview-field">{d.gov_law || "—"}</span><br />
                  <strong>Tax Structure:</strong> <span className="el-preview-field">{d.tax_struct || "—"}</span>
                </p>
                <p style={{ fontSize: 11, color: "var(--muted)" }}>This preview is for confirmation only. Review the full generated document before obtaining signatures. This revised version includes expanded protections, clarified tail provisions, and additional disclaimers.</p>
              </div>
            </div>

            {/* Signature blocks */}
            <div className="el-sig-grid" style={{ marginTop: 20 }}>
              <div className="el-sig-block">
                <div className="el-sig-party">Forhemit Transition Stewardship</div>
                <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>California Public Benefit Corporation</p>
                <div className="el-sig-line" />
                <div className="el-sig-line-label">Signature</div>
                <div className="el-sig-line" />
                <div className="el-sig-line-label">Printed Name &amp; Title: {d.fhm_signer}, {d.fhm_title}</div>
                <div className="el-sig-line" />
                <div className="el-sig-line-label">Date</div>
              </div>
              <div className="el-sig-block">
                <div className="el-sig-party">Company (Client)</div>
                <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>Authorized Officer — signing on behalf of Company</p>
                <div className="el-sig-line" />
                <div className="el-sig-line-label">Signature</div>
                <div className="el-sig-line" />
                <div className="el-sig-line-label">Printed Name &amp; Title: {d.officer_name}{d.officer_title ? `, ${d.officer_title}` : ""}</div>
                <div className="el-sig-line" />
                <div className="el-sig-line-label">Date</div>
              </div>
            </div>

            {d.has_broker === "yes" && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 500 }}>Broker Acknowledgment (Witness — Not a Party)</p>
                <p style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", margin: "6px 0 10px", lineHeight: 1.6 }}>The undersigned broker acknowledges having reviewed the fee and retainer terms with the authorized officer prior to execution. This creates no agency relationship between Forhemit and the broker.</p>
                <div style={{ borderBottom: "1px solid var(--rule)", marginBottom: 4 }} />
                <p style={{ fontSize: 12 }}>Broker: {d.broker_name || "_______________"} &nbsp;&nbsp; Firm: {d.broker_firm || "_______________"}</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(27,42,74,.05)", border: "1px solid rgba(27,42,74,.12)", fontSize: 12, color: "var(--muted)" }}>
          When all 11 sections are complete, use the <strong>Download PDF</strong> button in the header to generate the document.
        </div>
      </div>
      </div>

      <div
        ref={contractRef}
        className="el-contract-capture"
        data-engagement-letter-contract="true"
      >
        <EngagementContractDocument d={d} fee={fee} />
      </div>
    </div>
  );
});

export default EngagementLetterForm;
