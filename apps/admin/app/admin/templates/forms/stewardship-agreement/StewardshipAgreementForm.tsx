"use client";

/**
 * Stewardship Agreement — Data-entry form + jsPDF-based PDF generation.
 * Mirrors the legacy forhemit_stewardship_form_REVISED.html.
 * 12 sections with progress tracking and shared field sync.
 */

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
import { STATES } from "../engagement-letter/constants";
import { DEFAULT_PILLARS } from "./constants";
import { calcStewardshipFee, fmtCurrency } from "./calculations";
import { generateStewardshipPDF } from "./pdf-generator";
import type {
  SAData,
  TermOption,
  LiabilityCap,
  VarianceThreshold,
  LenderNotify,
  TermConvNotice,
  CurePeriod,
  LateInterest,
  ConfidentialitySurvival,
  MediationTimeline,
  ArbitrationRules,
  EbitdaSource,
} from "./types";

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

const INITIAL: SAData = {
  s_company: "", s_ref: "", s_date: "",
  closing_date: "", agreement_date: isoToday(), post_officer: "", company_email: "",
  term: null,
  ebitda: "", ebitda_source: "QofE — adjusted EBITDA (recommended)", ack_fee: false,
  pillars: DEFAULT_PILLARS.map((p) => ({ ...p })),
  lender_name: "", lender_rm: "", trustee_name: "", trustee_contact: "", ack_disclosure: false,
  gov_law: "", venue_county: "", liability_cap: "12 months of fees paid",
  variance_threshold: "±15% (standard)", lender_notify: "5 business days after Company non-response (standard)",
  term_conv_notice: "Company 60 days / Forhemit 90 days", special_terms: "",
  ack_standard: false,
  term_cure_period: "30 days (standard) / 10 days for payment", late_interest: "1.5% per month (or maximum permitted by law)", ack_termination: false,
  confidentiality_survival: "3 years after termination", permitted_disclosure: "", ack_confidentiality: false,
  ack_indemnification: false,
  mediation_timeline: "45 days to conclude", arbitration_rules: "AAA Commercial Arbitration Rules", ack_dispute: false,
  fhm_signer: "", fhm_title: "Founder & Managing Director", ack_final: false,
};

const StewardshipAgreementForm = forwardRef<TemplateFormHandle, { initialData?: Record<string, unknown>; isStandalone?: boolean }>(
  function StewardshipAgreementForm({ initialData, isStandalone }, ref) {
    const [d, setD] = useState<SAData>(() => (initialData ? { ...INITIAL, ...initialData } as SAData : { ...INITIAL }));
    const [openSections, setOpen] = useState<Record<string, boolean>>({ sec1: true });
    const dummyRef = useRef<HTMLDivElement>(null);

    // Load shared fields from localStorage
    useEffect(() => {
      if (isStandalone) return;
      try {
        const raw = localStorage.getItem("fhm_shared");
        if (!raw) return;
        const shared = JSON.parse(raw) as { company?: string; ref?: string; date?: string };
        setD((prev) => ({
          ...prev,
          s_company: shared.company || prev.s_company,
          s_ref: shared.ref || prev.s_ref,
          s_date: shared.date || prev.s_date,
        }));
      } catch { /* ignore */ }
    }, [isStandalone]);

    useImperativeHandle(ref, () => ({
      getFormData: () => d as unknown as Record<string, unknown>,
      getContainerRef: () => dummyRef.current,
      generatePDF: () => generateStewardshipPDF(d),
    }), [d]);

    const upd = useCallback(<K extends keyof SAData>(key: K, val: SAData[K]) => setD((p) => ({ ...p, [key]: val })), []);
    const toggle = useCallback((id: string) => setOpen((p) => ({ ...p, [id]: !p[id] })), []);

    // Section validation
    const sectionComplete = useMemo(() => {
      const fee = calcStewardshipFee(d.ebitda);
      return {
        sec1: !!(d.closing_date && d.agreement_date && d.post_officer.trim() && d.company_email.trim()),
        sec2: d.term !== null,
        sec3: fee.ebitda > 0 && d.ack_fee,
        sec4: d.pillars.some((p) => p.checked),
        sec5: !!(d.lender_name.trim() && d.trustee_name.trim() && d.ack_disclosure),
        sec6: !!d.gov_law,
        sec7: d.ack_standard,
        sec8: d.ack_termination,
        sec9: d.ack_confidentiality,
        sec10: d.ack_indemnification,
        sec11: d.ack_dispute,
        sec12: !!(d.fhm_signer.trim() && d.ack_final),
      };
    }, [d]);

    const completedCount = Object.values(sectionComplete).filter(Boolean).length;
    const totalSections = 12;
    const progressPct = Math.round((completedCount / totalSections) * 100);

    const fee = calcStewardshipFee(d.ebitda);

    // ── Render helpers ──────────────────────────────────────────────────
    const SectionHead = ({ id, num, title }: { id: string; num: string; title: string }) => (
      <div className="el-section-head" onClick={() => toggle(id)} style={{ cursor: "pointer" }}>
        <span className="el-section-num">{num}</span>
        <span className="el-section-title">{title}</span>
        <span className={`el-section-status${sectionComplete[id as keyof typeof sectionComplete] ? " complete" : ""}`}>
          {sectionComplete[id as keyof typeof sectionComplete] ? "Complete" : "Incomplete"}
        </span>
        <span className="el-section-chevron">{openSections[id] ? "▴" : "▾"}</span>
      </div>
    );

    const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
      <div className="el-field">
        <label className="el-label">{label}{required && <span className="el-req"> *</span>}</label>
        {children}
      </div>
    );

    const Ack = ({ id, label, checked }: { id: string; label: string; checked: boolean }) => (
      <div className="el-ack">
        <label className="el-ack-label">
          <input type="checkbox" checked={checked} onChange={(e) => upd(id as keyof SAData, e.target.checked as never)} />
          <span dangerouslySetInnerHTML={{ __html: label }} />
        </label>
      </div>
    );

    return (
      <div className="el-root sa-stewardship" ref={dummyRef}>
        <div className="el-no-print">
          {/* Header */}
          <div style={{ marginBottom: 20, marginTop: 12 }}>
            <p style={{ fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--brass)", marginBottom: 8, fontFamily: "var(--ff-b)" }}>Admin — Contract Generation</p>
            <h1 style={{ fontFamily: "var(--ff-d)", fontSize: 38, fontWeight: 300, color: "var(--navy)", lineHeight: 1.1, marginBottom: 8 }}>Transition Stewardship Agreement</h1>
            <p style={{ fontSize: 13, fontWeight: 300, color: "var(--muted)", lineHeight: 1.7, maxWidth: 520 }}>Post-close 12–24 month stewardship services. Shared fields are pre-populated from the Engagement Letter.</p>
          </div>

          {/* Progress */}
          <div className="el-progress-wrap">
            <div className="el-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="el-progress-label">{completedCount} of {totalSections} sections complete</p>

          {/* Shared Banner */}
          {!isStandalone && (
            <div className="el-shared-banner">
              <p className="el-shared-label">Shared Fields — populated from Engagement Letter</p>
              <div className="el-shared-grid">
                <div className="el-shared-item"><span className="el-shared-dt">Company</span><span className="el-shared-dd">{d.s_company || <em style={{ color: "rgba(255,255,255,.3)" }}>Not set</em>}</span></div>
                <div className="el-shared-item"><span className="el-shared-dt">Reference</span><span className="el-shared-dd">{d.s_ref || "—"}</span></div>
                <div className="el-shared-item"><span className="el-shared-dt">Effective Date</span><span className="el-shared-dd">{d.s_date || "—"}</span></div>
              </div>
            </div>
          )}

          {/* ── Section 1: Parties & Closing ── */}
          <div className="el-section">
            <SectionHead id="sec1" num="01" title="Parties & Closing Details" />
            {openSections.sec1 && (
              <div className="el-section-body">
                <div className="el-field-grid">
                  <Field label="Company Legal Name" required>
                    <input 
                      className={isStandalone ? "el-input" : "el-input prefilled"} 
                      value={d.s_company} 
                      readOnly={!isStandalone} 
                      onChange={(e) => isStandalone && upd("s_company", e.target.value)} 
                      placeholder={isStandalone ? "Company Legal Name" : "Auto-filled"} 
                    />
                  </Field>
                  <Field label="Engagement Reference" required>
                    <input 
                      className={isStandalone ? "el-input" : "el-input prefilled"} 
                      value={d.s_ref} 
                      readOnly={!isStandalone} 
                      onChange={(e) => isStandalone && upd("s_ref", e.target.value)} 
                      placeholder={isStandalone ? "Reference Number" : "Auto-filled"} 
                    />
                  </Field>
                  <Field label="Closing Date (ESOP trust funded)" required><input type="date" className="el-input" value={d.closing_date} onChange={(e) => upd("closing_date", e.target.value)} /></Field>
                  <Field label="Agreement Date" required><input type="date" className="el-input" value={d.agreement_date} onChange={(e) => upd("agreement_date", e.target.value)} /></Field>
                  <Field label="Post-Close Authorized Officer" required><input className="el-input" value={d.post_officer} onChange={(e) => upd("post_officer", e.target.value)} placeholder="Name, Title" /></Field>
                  <Field label="Company Email" required><input type="email" className="el-input" value={d.company_email} onChange={(e) => upd("company_email", e.target.value)} placeholder="manager@company.com" /></Field>
                </div>
                <div className="el-note">The post-close authorized officer may differ from the pre-close seller. After closing, the ESOP trustee-appointed manager or board-designated officer has authority to execute on behalf of the Company.</div>
              </div>
            )}
          </div>

          {/* ── Section 2: Stewardship Term ── */}
          <div className="el-section">
            <SectionHead id="sec2" num="02" title="Stewardship Term" />
            {openSections.sec2 && (
              <div className="el-section-body">
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14, lineHeight: 1.7 }}>Select the initial term. Extension tranches are elected separately by both parties.</p>
                <div className="el-term-opts">
                  {([12, 18, 24] as const).map((m) => (
                    <div key={m} className={`el-term-opt${d.term === m ? " selected" : ""}`} onClick={() => upd("term", m as TermOption)}>
                      <div className="el-term-months">{m}</div>
                      <div className="el-term-label">{m === 24 ? "Month Full Term" : "Month Initial Term"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Section 3: EBITDA & Fee ── */}
          <div className="el-section">
            <SectionHead id="sec3" num="03" title="EBITDA Baseline & Annual Fee" />
            {openSections.sec3 && (
              <div className="el-section-body">
                <div className="el-field-grid">
                  <Field label="QofE Adjusted EBITDA" required>
                    <input type="number" className="el-input" value={d.ebitda} onChange={(e) => upd("ebitda", e.target.value)} placeholder="3500000" />
                  </Field>
                  <Field label="EBITDA Source">
                    <select className="el-input" value={d.ebitda_source} onChange={(e) => upd("ebitda_source", e.target.value as EbitdaSource)}>
                      <option>QofE — adjusted EBITDA (recommended)</option>
                      <option>Unaudited management accounts</option>
                      <option>Reviewed financial statements</option>
                      <option>Audited financial statements</option>
                    </select>
                  </Field>
                </div>
                {fee.ebitda > 0 && (
                  <div className="el-fee-calc">
                    <p style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Fee Calculation — 2.5% of EBITDA</p>
                    <div className="el-fee-grid">
                      <div><span className="el-fee-label">Annual Fee</span><span className="el-fee-val brass">{fmtCurrency(fee.annual)}</span></div>
                      <div><span className="el-fee-label">Quarterly</span><span className="el-fee-val">{fmtCurrency(fee.quarterly)}/qtr</span></div>
                      <div><span className="el-fee-label">Mo. 1–6 (60%)</span><span className="el-fee-val">{fmtCurrency(fee.t1)}</span></div>
                      <div><span className="el-fee-label">Mo. 7–12 (20%)</span><span className="el-fee-val">{fmtCurrency(fee.t2)}</span></div>
                    </div>
                  </div>
                )}
                <Ack id="ack_fee" checked={d.ack_fee} label={`I confirm the EBITDA baseline. The annual Stewardship Fee of <strong>${fee.annual > 0 ? fmtCurrency(fee.annual) : "2.5% of stated EBITDA"}</strong> is payable from operating cash flow.`} />
              </div>
            )}
          </div>

          {/* ── Section 4: Pillars ── */}
          <div className="el-section">
            <SectionHead id="sec4" num="04" title="Stewardship Service Pillars" />
            {openSections.sec4 && (
              <div className="el-section-body">
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14, lineHeight: 1.7 }}>Confirm the service pillars included. All six are standard.</p>
                <div className="el-pillar-list">
                  {d.pillars.map((p, i) => (
                    <label key={p.id} className="el-pillar-item">
                      <input type="checkbox" checked={p.checked} onChange={(e) => {
                        const next = [...d.pillars];
                        next[i] = { ...next[i], checked: e.target.checked };
                        upd("pillars", next);
                      }} />
                      <div>
                        <div className="el-pillar-title">{p.id} — {p.title}</div>
                        <div className="el-pillar-desc">{p.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Section 5: Lender & Trustee ── */}
          <div className="el-section">
            <SectionHead id="sec5" num="05" title="Lender & Trustee Disclosure" />
            {openSections.sec5 && (
              <div className="el-section-body">
                <div className="el-field-grid">
                  <Field label="SBA Lender Name" required><input className="el-input" value={d.lender_name} onChange={(e) => upd("lender_name", e.target.value)} placeholder="Live Oak Bank" /></Field>
                  <Field label="SBA Lender RM"><input className="el-input" value={d.lender_rm} onChange={(e) => upd("lender_rm", e.target.value)} placeholder="Name, title" /></Field>
                  <Field label="ESOP Trustee Name" required><input className="el-input" value={d.trustee_name} onChange={(e) => upd("trustee_name", e.target.value)} placeholder="Kaplan Fiduciary Group" /></Field>
                  <Field label="Trustee Contact"><input className="el-input" value={d.trustee_contact} onChange={(e) => upd("trustee_contact", e.target.value)} placeholder="Name, email" /></Field>
                </div>
                <Ack id="ack_disclosure" checked={d.ack_disclosure} label="I confirm this Agreement <strong>will be provided in full to the SBA lender and ESOP trustee</strong> as a disclosed document prior to the Closing Date." />
              </div>
            )}
          </div>

          {/* ── Section 6: Governing Terms ── */}
          <div className="el-section">
            <SectionHead id="sec6" num="06" title="Governing Terms & Liability" />
            {openSections.sec6 && (
              <div className="el-section-body">
                <div className="el-field-grid">
                  <Field label="Governing Law State" required>
                    <select className="el-input" value={d.gov_law} onChange={(e) => upd("gov_law", e.target.value)}>
                      <option value="">Select…</option>
                      {STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Arbitration Venue County"><input className="el-input" value={d.venue_county} onChange={(e) => upd("venue_county", e.target.value)} placeholder="County" /></Field>
                  <Field label="Liability Cap">
                    <select className="el-input" value={d.liability_cap} onChange={(e) => upd("liability_cap", e.target.value as LiabilityCap)}>
                      <option>12 months of fees paid</option><option>$25,000 fixed cap</option><option>$50,000 fixed cap</option><option>$100,000 fixed cap</option>
                    </select>
                  </Field>
                  <Field label="EBITDA Variance Threshold">
                    <select className="el-input" value={d.variance_threshold} onChange={(e) => upd("variance_threshold", e.target.value as VarianceThreshold)}>
                      <option>±15% (standard)</option><option>±10% (tighter)</option><option>±20% (looser)</option>
                    </select>
                  </Field>
                  <Field label="Lender RM Notification">
                    <select className="el-input" value={d.lender_notify} onChange={(e) => upd("lender_notify", e.target.value as LenderNotify)}>
                      <option>5 business days after Company non-response (standard)</option><option>10 business days after Company non-response</option><option>Immediate — concurrent with Company notification</option>
                    </select>
                  </Field>
                  <Field label="Termination for Convenience Notice">
                    <select className="el-input" value={d.term_conv_notice} onChange={(e) => upd("term_conv_notice", e.target.value as TermConvNotice)}>
                      <option>Company 60 days / Forhemit 90 days</option><option>60 days both parties</option><option>30 days both parties</option>
                    </select>
                  </Field>
                </div>
                <Field label="Special Terms or Notes"><textarea className="el-input" value={d.special_terms} onChange={(e) => upd("special_terms", e.target.value)} placeholder="Any modifications…" rows={3} /></Field>
              </div>
            )}
          </div>

          {/* ── Sections 7–11: Acknowledgment sections ── */}
          {([
            ["sec7", "07", "Standard of Care", "ack_standard", "I acknowledge that <strong>Forhemit does not guarantee any specific financial results, covenant compliance, ESOP plan performance, or business outcomes.</strong>"],
            ["sec8", "08", "Termination", "ack_termination", "I acknowledge the termination provisions. If any invoice remains unpaid for 30 days, Forhemit may suspend services."],
            ["sec9", "09", "Confidentiality", "ack_confidentiality", "I acknowledge the confidentiality obligations. Upon termination, each party shall return or destroy the other's confidential information."],
            ["sec10", "10", "Indemnification", "ack_indemnification", "I acknowledge the mutual indemnification provisions."],
            ["sec11", "11", "Dispute Resolution", "ack_dispute", "I acknowledge the dispute resolution provisions. Disputes will be resolved through negotiation, mediation, then binding arbitration. Jury trial is waived."],
          ] as const).map(([secId, num, title, ackKey, ackLabel]) => (
            <div className="el-section" key={secId}>
              <SectionHead id={secId} num={num} title={title} />
              {openSections[secId] && (
                <div className="el-section-body">
                  {secId === "sec8" && (
                    <div className="el-field-grid">
                      <Field label="Cure Period">
                        <select className="el-input" value={d.term_cure_period} onChange={(e) => upd("term_cure_period", e.target.value as CurePeriod)}>
                          <option>30 days (standard) / 10 days for payment</option><option>15 days (all breaches)</option><option>Immediate for material breach</option>
                        </select>
                      </Field>
                      <Field label="Late Payment Interest">
                        <select className="el-input" value={d.late_interest} onChange={(e) => upd("late_interest", e.target.value as LateInterest)}>
                          <option>1.5% per month (or maximum permitted by law)</option><option>1% per month</option><option>Federal prime rate + 3%</option>
                        </select>
                      </Field>
                    </div>
                  )}
                  {secId === "sec9" && (
                    <div className="el-field-grid">
                      <Field label="Confidentiality Survival">
                        <select className="el-input" value={d.confidentiality_survival} onChange={(e) => upd("confidentiality_survival", e.target.value as ConfidentialitySurvival)}>
                          <option>3 years after termination</option><option>2 years after termination</option><option>5 years after termination</option>
                        </select>
                      </Field>
                      <Field label="Permitted Disclosure"><input className="el-input" value={d.permitted_disclosure} onChange={(e) => upd("permitted_disclosure", e.target.value)} placeholder="Employees, advisors, agents" /></Field>
                    </div>
                  )}
                  {secId === "sec11" && (
                    <div className="el-field-grid">
                      <Field label="Mediation Timeline">
                        <select className="el-input" value={d.mediation_timeline} onChange={(e) => upd("mediation_timeline", e.target.value as MediationTimeline)}>
                          <option>45 days to conclude</option><option>30 days to conclude</option><option>60 days to conclude</option>
                        </select>
                      </Field>
                      <Field label="Arbitration Rules">
                        <select className="el-input" value={d.arbitration_rules} onChange={(e) => upd("arbitration_rules", e.target.value as ArbitrationRules)}>
                          <option>AAA Commercial Arbitration Rules</option><option>JAMS Comprehensive Arbitration Rules</option>
                        </select>
                      </Field>
                    </div>
                  )}
                  <Ack id={ackKey} checked={d[ackKey as keyof SAData] as boolean} label={ackLabel} />
                </div>
              )}
            </div>
          ))}

          {/* ── Section 12: Final ── */}
          <div className="el-section">
            <SectionHead id="sec12" num="12" title="Final Acknowledgment & Delivery" />
            {openSections.sec12 && (
              <div className="el-section-body">
                <div className="el-field-grid">
                  <Field label="Forhemit Authorized Signatory" required><input className="el-input" value={d.fhm_signer} onChange={(e) => upd("fhm_signer", e.target.value)} placeholder="Stefano Stokes" /></Field>
                  <Field label="Forhemit Signatory Title"><input className="el-input" value={d.fhm_title} onChange={(e) => upd("fhm_title", e.target.value)} /></Field>
                </div>
                <Ack id="ack_final" checked={d.ack_final} label="I confirm all information is accurate. <strong>Wet or electronic signatures are still required before this Agreement is effective.</strong> The trustee acknowledgment signature must be obtained separately." />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default StewardshipAgreementForm;
