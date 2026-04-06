"use client";

import React, { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import "./BrokerTearSheet.css";

interface FormData {
  brokerFirstName: string;
  brokerLastName: string;
  brokerEmail: string;
  brokerFirm: string;
  brokerMarket: string;
  dealRef: string;
  senderName: string;
  senderTitle: string;
  senderEmail: string;
  senderPhone: string;
}

interface PreviewData {
  to: string;
  subject: string;
  message: string;
}

const DEFAULT_DATA: FormData = {
  brokerFirstName: "",
  brokerLastName: "",
  brokerEmail: "",
  brokerFirm: "",
  brokerMarket: "",
  dealRef: "",
  senderName: "Stefano Stokes",
  senderTitle: "Founder",
  senderEmail: "stefano.stokes@forhemit.com",
  senderPhone: "424-253-4019",
};

// Helper component for editable fields with print fallback
function EditableField({
  value,
  onChange,
  placeholder,
  className,
  type = "text",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  className?: string;
  type?: "text" | "email";
}) {
  return (
    <>
      <input
        type={type}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="bts-print-value">
        {value || placeholder}
      </span>
    </>
  );
}

export default function BrokerTearSheet() {
  const [formData, setFormData] = useState<FormData>(DEFAULT_DATA);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfBase64, setPdfBase64] = useState<string>("");
  
  // Editable preview data
  const [previewData, setPreviewData] = useState<PreviewData>({
    to: "",
    subject: "Forhemit — Broker Tear Sheet",
    message: "",
  });

  const sendBrokerEmail = useAction(api.emails.sendBrokerTearSheet);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setFormData(DEFAULT_DATA);
    setSendStatus(null);
    setPdfBase64("");
  };

  const generateDefaultEmailBody = () => {
    return `Hi ${formData.brokerFirstName || "there"},

I'm reaching out from Forhemit Transition Stewardship regarding potential acquisition opportunities in ${formData.brokerMarket || "your market"}.

Forhemit helps companies buy themselves through employee ownership transitions. I've attached our tear sheet which includes:

• Deal criteria ($3M–$15M EBITDA, 20+ employees)
• The real math on ESOP vs conventional buyers
• How everyone gets paid (broker, seller, Forhemit)
• Our 120-day process and post-close stewardship

If you have a listing that fits, I'd love to connect. We confirm fit within 48 hours.

Best regards,

${formData.senderName}
${formData.senderTitle}
Forhemit Transition Stewardship
${formData.senderEmail}
${formData.senderPhone}
forhemit.com`;
  };

  const handleOpenPreview = async () => {
    if (!formData.brokerEmail) {
      setSendStatus("Please enter a broker email address");
      return;
    }

    setIsSending(true);
    setSendStatus("Generating PDF...");

    try {
      // Get the page element HTML content
      const pageElement = document.querySelector('.bts-page');
      if (!pageElement) {
        throw new Error('Could not find page element');
      }

      // Clone the page to modify for PDF
      const clonedPage = pageElement.cloneNode(true) as HTMLElement;
      
      // Hide all inputs in the clone
      const inputs = clonedPage.querySelectorAll('input');
      inputs.forEach(input => input.style.display = 'none');
      
      // Show all print values in the clone
      const printValues = clonedPage.querySelectorAll('.bts-print-value');
      printValues.forEach(span => {
        (span as HTMLElement).style.display = 'inline';
      });

      const htmlContent = clonedPage.outerHTML;
      const cssContent = `
        .bts-print-value { display: inline !important; }
        input { display: none !important; }
      `;

      // Generate PDF
      const pdfResponse = await fetch('/api/pdf-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateName: 'Broker-Tear-Sheet',
          htmlContent,
          cssContent,
          formData,
        }),
      });

      if (!pdfResponse.ok) {
        const errorText = await pdfResponse.text();
        console.error('PDF generation error:', errorText);
        throw new Error(`Failed to generate PDF: ${errorText}`);
      }

      const pdfBlob = await pdfResponse.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(pdfBlob);
      });

      setPdfBase64(base64);
      
      // Initialize preview data with current values
      const defaultMessage = generateDefaultEmailBody();
      setPreviewData({
        to: formData.brokerEmail,
        subject: "Forhemit — Broker Tear Sheet",
        message: defaultMessage,
      });
      
      setShowPreview(true);
      setSendStatus(null);
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSendStatus(`PDF Error: ${errorMessage.substring(0, 100)}`);
      setPdfBase64("");
      
      // Still open preview even if PDF fails
      const defaultMessage = generateDefaultEmailBody();
      setPreviewData({
        to: formData.brokerEmail,
        subject: "Forhemit — Broker Tear Sheet",
        message: defaultMessage,
      });
      setShowPreview(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendEmail = async () => {
    if (!pdfBase64) {
      setSendStatus("Please generate PDF first");
      return;
    }

    setIsSending(true);
    setSendStatus("Sending email...");

    try {
      const result = await sendBrokerEmail({
        brokerEmail: previewData.to,
        brokerFirstName: formData.brokerFirstName,
        brokerLastName: formData.brokerLastName,
        brokerFirm: formData.brokerFirm,
        brokerMarket: formData.brokerMarket,
        dealRef: formData.dealRef,
        senderName: formData.senderName,
        senderTitle: formData.senderTitle,
        senderEmail: formData.senderEmail,
        senderPhone: formData.senderPhone,
        pdfBase64: pdfBase64,
        subject: previewData.subject,
        customMessage: previewData.message,
      });

      if (result.success) {
        setSendStatus("Email sent successfully!");
        setShowPreview(false);
        setTimeout(() => setSendStatus(null), 5000);
      } else {
        setSendStatus(`Failed: ${result.email?.error || result.telegram?.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSendStatus("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bts-container">
      {/* Screen controls */}
      <div className="bts-app-header">
        <div>
          <div className="bts-app-wordmark">Forhemit Transition Stewardship</div>
          <div className="bts-app-sub">Broker Tear Sheet — Fillable Form</div>
        </div>
        <div className="bts-header-actions">
          {sendStatus && (
            <span className={`bts-status-message ${sendStatus.includes("success") ? "success" : sendStatus.includes("Failed") ? "error" : ""}`}>
              {sendStatus}
            </span>
          )}
          <button className="bts-btn-clear" onClick={handleClear} disabled={isSending}>
            Clear
          </button>
          <button className="bts-btn-email" onClick={handleOpenPreview} disabled={isSending}>
            {isSending ? "Preparing..." : "✉ Preview & Send"}
          </button>
          <button className="bts-btn-print" onClick={() => window.print()} disabled={isSending}>
            ⎙ Print / Save PDF
          </button>
        </div>
      </div>

      {/* Email Preview Modal with Editable Fields */}
      {showPreview && (
        <div className="bts-modal-overlay" onClick={() => !isSending && setShowPreview(false)}>
          <div className="bts-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="bts-modal-header">
              <h2>Preview & Edit Email</h2>
              <button 
                className="bts-modal-close" 
                onClick={() => setShowPreview(false)}
                disabled={isSending}
              >
                ✕
              </button>
            </div>
            
            <div className="bts-modal-body">
              {/* Editable Recipient */}
              <div className="bts-preview-section">
                <label className="bts-preview-label">To:</label>
                <input
                  type="email"
                  className="bts-preview-input"
                  value={previewData.to}
                  onChange={(e) => setPreviewData(prev => ({ ...prev, to: e.target.value }))}
                  disabled={isSending}
                />
              </div>
              
              {/* Editable Subject */}
              <div className="bts-preview-section">
                <label className="bts-preview-label">Subject:</label>
                <input
                  type="text"
                  className="bts-preview-input"
                  value={previewData.subject}
                  onChange={(e) => setPreviewData(prev => ({ ...prev, subject: e.target.value }))}
                  disabled={isSending}
                />
              </div>

              {/* PDF Attachment Info */}
              <div className="bts-preview-section bts-attachment-info">
                <span className="bts-attachment-label">
                  📎 PDF Attachment: Forhemit-Broker-Tear-Sheet.pdf
                </span>
                {!pdfBase64 && (
                  <span className="bts-attachment-warning">PDF generation failed. Please try again.</span>
                )}
              </div>

              {/* Editable Email Body */}
              <div className="bts-preview-section">
                <label className="bts-preview-label">Message:</label>
                <textarea
                  className="bts-preview-textarea"
                  value={previewData.message}
                  onChange={(e) => setPreviewData(prev => ({ ...prev, message: e.target.value }))}
                  disabled={isSending}
                  rows={16}
                />
              </div>
            </div>

            <div className="bts-modal-footer">
              <button 
                className="bts-btn-cancel" 
                onClick={() => setShowPreview(false)}
                disabled={isSending}
              >
                Cancel
              </button>
              <button 
                className="bts-btn-send" 
                onClick={handleSendEmail}
                disabled={isSending || !pdfBase64}
              >
                {isSending ? "Sending..." : "✉ Send PDF"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tear Sheet Page */}
      <div className="bts-page">
        {/* Header */}
        <div className="bts-header">
          <div>
            <div className="bts-wordmark">Forhemit</div>
            <div className="bts-tagline">Transition Stewardship</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="bts-category-pill">Broker Introduction</div>
            <div className="bts-contact-line">deals@forhemit.com &nbsp;·&nbsp; forhemit.com</div>
          </div>
        </div>
        <div className="bts-brass-rule"></div>

        {/* Meta / addressing strip */}
        <div className="bts-meta-strip">
          <div className="bts-meta-item">
            <span className="bts-meta-label">First</span>
            <EditableField
              value={formData.brokerFirstName}
              onChange={(v) => updateField("brokerFirstName", v)}
              placeholder="First name"
              className="bts-name-field"
            />
          </div>
          <div className="bts-meta-item">
            <span className="bts-meta-label">Last</span>
            <EditableField
              value={formData.brokerLastName}
              onChange={(v) => updateField("brokerLastName", v)}
              placeholder="Last name"
              className="bts-name-field"
            />
          </div>
          <div className="bts-meta-item">
            <span className="bts-meta-label">Firm</span>
            <EditableField
              value={formData.brokerFirm}
              onChange={(v) => updateField("brokerFirm", v)}
              placeholder="Brokerage / firm name"
              className="bts-firm-field"
            />
          </div>
          <div className="bts-meta-item">
            <span className="bts-meta-label">Market</span>
            <EditableField
              value={formData.brokerMarket}
              onChange={(v) => updateField("brokerMarket", v)}
              placeholder="City / region"
              className="bts-city-field"
            />
          </div>
          <div className="bts-meta-item">
            <span className="bts-meta-label">Re</span>
            <EditableField
              value={formData.dealRef}
              onChange={(v) => updateField("dealRef", v)}
              placeholder="Deal reference"
              className="bts-ref-field"
            />
          </div>
          <div className="bts-meta-item bts-meta-item-email">
            <span className="bts-meta-label">Email</span>
            <EditableField
              value={formData.brokerEmail}
              onChange={(v) => updateField("brokerEmail", v)}
              placeholder="broker@email.com"
              className="bts-email-field"
              type="email"
            />
          </div>
        </div>

        {/* Body */}
        <div className="bts-body">
          {/* LEFT */}
          <div className="bts-col bts-col-left">
            <div>
              <div className="bts-headline">We help companies<br /><em>buy themselves.</em></div>
              <div className="bts-sec-body" style={{ marginTop: '.08in', color: 'var(--bts-muted)', fontSize: '7.5pt' }}>
                Forhemit is a transaction stewardship firm. We facilitate employee ownership transitions — coordinating the full deal team, managing the 120-day process, and staying on post-close to protect the seller&apos;s note and the continuity of the business.
              </div>
            </div>

            <div>
              <div className="bts-sec-label">Deal Criteria</div>
              <div className="bts-criteria-grid">
                <div className="bts-crit-label">EBITDA</div>
                <div className="bts-crit-val"><strong>$3M – $15M</strong></div>
                <div className="bts-crit-label">Employees</div>
                <div className="bts-crit-val"><strong>20+</strong> W-2 employees</div>
                <div className="bts-crit-label">Entity</div>
                <div className="bts-crit-val">C-corp preferred; S-corp considered (conversion req.)</div>
                <div className="bts-crit-label">Industry</div>
                <div className="bts-crit-val">Any — generalist buyer</div>
                <div className="bts-crit-label">Markets</div>
                <div className="bts-crit-val"><strong>FL, TX, TN</strong> — other states considered</div>
                <div className="bts-crit-label">Seller</div>
                <div className="bts-crit-val">Founder-led, 3+ yr consistent financials, exit in 1–3 yrs</div>
                <div className="bts-crit-label">Workforce</div>
                <div className="bts-crit-val">All ESOP participants: U.S. citizens or permanent residents</div>
              </div>
            </div>

            <div>
              <div className="bts-sec-label">How We Close</div>
              <div className="bts-steps">
                <div className="bts-step">
                  <div className="bts-step-num">1</div>
                  <div className="bts-step-text"><strong>Pre-Qualification</strong>Deal screened, lender engaged, team identified before the seller signs anything.</div>
                </div>
                <div className="bts-step">
                  <div className="bts-step-num">2</div>
                  <div className="bts-step-text"><strong>Team Assembly</strong>SBA lender, ESOP trustee, ERISA counsel, TPA, and appraiser — pre-vetted, coordinated by Forhemit.</div>
                </div>
                <div className="bts-step">
                  <div className="bts-step-num">3</div>
                  <div className="bts-step-text"><strong>120-Day Process</strong>Five phases with hard gates. The owner runs the business. We run the deal.</div>
                </div>
                <div className="bts-step">
                  <div className="bts-step-num">4</div>
                  <div className="bts-step-text"><strong>Post-Close Stewardship</strong>12–24 months of operational monitoring protects the seller&apos;s note and the transition.</div>
                </div>
              </div>
            </div>

            <div>
              <div className="bts-sec-label">What We Bring</div>
              <div className="bts-diff-list">
                <div className="bts-diff-item">
                  <div className="bts-diff-dot"></div>
                  <div className="bts-diff-text"><strong>Pre-positioned deal team.</strong> Trustee, lender, and counsel identified before the LOI — no discovery surprises in diligence.</div>
                </div>
                <div className="bts-diff-item">
                  <div className="bts-diff-dot"></div>
                  <div className="bts-diff-text"><strong>COOP pre-assessment.</strong> Key-person and operational risk documented before close — the single biggest lender and trustee concern on ESOP deals.</div>
                </div>
                <div className="bts-diff-item">
                  <div className="bts-diff-dot"></div>
                  <div className="bts-diff-text"><strong>Transaction vs. transition.</strong> A conventional buyer closes in 120 days with a loan. We close in 120 days with a fully documented, operationally stable transition.</div>
                </div>
              </div>
            </div>

            <div>
              <div className="bts-sec-label">Send Us a Deal</div>
              <div className="bts-sec-body">
                Email a teaser or NDA-protected CIM to <strong style={{ fontFamily: 'var(--bts-ff-m)', fontSize: '7pt' }}>deals@forhemit.com</strong>. We confirm fit within 48 hours. No commitment required for the first conversation.
              </div>
            </div>
          </div>

          {/* MID */}
          <div className="bts-col bts-col-mid">
            <div>
              <div className="bts-sec-label">$3M EBITDA Deal — The Real Math</div>
              <table className="bts-deal-table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="bts-pe-head">PE / Conv. Buyer</th>
                    <th className="bts-esop-head">Forhemit ESOP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Valuation multiple</td>
                    <td>6.0× EBITDA</td>
                    <td className="bts-esop-col">4.5× EBITDA</td>
                  </tr>
                  <tr className="bts-subtotal">
                    <td>Gross purchase price</td>
                    <td>$18,000,000</td>
                    <td className="bts-esop-col">$13,500,000</td>
                  </tr>
                  <tr>
                    <td>Broker commission (5%)</td>
                    <td style={{ color: 'var(--bts-red)' }}>− $900,000</td>
                    <td className="bts-esop-col" style={{ color: 'var(--bts-red)' }}>− $675,000</td>
                  </tr>
                  <tr className="bts-subtotal">
                    <td>Net of broker</td>
                    <td>$17,100,000</td>
                    <td className="bts-esop-col">$12,825,000</td>
                  </tr>
                  <tr className="bts-tax-row">
                    <td>Federal cap gains (23.8%)</td>
                    <td>− $4,069,800</td>
                    <td className="bts-esop-col">$0 &nbsp;<span style={{ fontSize: '6pt', fontFamily: 'var(--bts-ff-b)' }}>§1042</span></td>
                  </tr>
                  <tr className="bts-tax-row">
                    <td>Florida state income tax</td>
                    <td style={{ color: 'var(--bts-muted)' }}>$0</td>
                    <td className="bts-esop-col">$0</td>
                  </tr>
                  <tr className="bts-bottom-line">
                    <td>Seller walks with</td>
                    <td>$13,030,200</td>
                    <td className="bts-esop-col">$12,825,000</td>
                  </tr>
                  <tr className="bts-note-row">
                    <td colSpan={3}>PE wins by only $205,200 after tax — on a $4,500,000 higher headline price</td>
                  </tr>
                </tbody>
              </table>
              <div className="bts-table-footnote" style={{ marginTop: '0.08in', background: 'rgba(154,117,64,0.07)', borderLeft: '2px solid var(--bts-brass)', padding: '0.07in 0.1in', fontStyle: 'normal', color: 'var(--bts-ink)' }}>
                That $205K PE advantage assumes the seller collects every dollar as stated. PE deals at this size typically include <strong style={{ color: 'var(--bts-navy)' }}>earn-outs tied to post-close performance and restrictive covenants</strong> lasting 2–5 years. The Forhemit seller note carries <strong style={{ color: 'var(--bts-navy)' }}>no earn-outs, no performance conditions, and no restrictive covenants</strong> — a fixed obligation with a mandatory refinance trigger. <em style={{ color: 'var(--bts-muted)' }}>The PE number is a ceiling. The ESOP number is a floor.</em>
              </div>
              <div className="bts-table-footnote" style={{ marginTop: '0.05in' }}>
                FL domicile, C-corp, zero cost basis, full §1042 election. ESOP proceeds: ~$10.1M cash at close + ~$3.4M seller note (mandatory refinance trigger Mo. 14–18). Forhemit&apos;s fee is paid by the ESOP trust — not a line item here or on the seller&apos;s closing statement. Seller&apos;s CPA must model actual basis and §1042 eligibility.
              </div>
            </div>

            <div>
              <div className="bts-sec-label">The Closing Statement</div>
              <div className="bts-callout">
                <strong>Forhemit does not appear as a line item on the seller&apos;s closing statement.</strong> Our fee is paid by the ESOP trust — the buyer entity — as a tax-deductible business expense. The seller receives their full negotiated purchase price. The broker receives their full commission from proceeds. Neither number is adjusted, reduced, or deferred by our engagement.
              </div>
            </div>

            <div>
              <div className="bts-sec-label">Side by Side</div>
              <table className="bts-deal-table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="bts-pe-head">Conv. / PE</th>
                    <th className="bts-esop-head">Forhemit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Close timeline</td>
                    <td>90–180 days</td>
                    <td className="bts-esop-col" style={{ color: 'var(--bts-green)' }}>120 days</td>
                  </tr>
                  <tr>
                    <td>Federal cap gains</td>
                    <td style={{ color: 'var(--bts-red)' }}>Full rate</td>
                    <td className="bts-esop-col" style={{ color: 'var(--bts-green)' }}>Deferred §1042</td>
                  </tr>
                  <tr>
                    <td>Employees post-close</td>
                    <td>Restructure risk</td>
                    <td className="bts-esop-col" style={{ color: 'var(--bts-green)' }}>Become owners</td>
                  </tr>
                  <tr>
                    <td>Financing contingency</td>
                    <td>Yes</td>
                    <td className="bts-esop-col" style={{ color: 'var(--bts-green)' }}>Trust is the buyer</td>
                  </tr>
                  <tr>
                    <td>Seller note protection</td>
                    <td>Unsupported</td>
                    <td className="bts-esop-col" style={{ color: 'var(--bts-green)' }}>COOP 12–24 mo.</td>
                  </tr>
                  <tr>
                    <td>On seller&apos;s closing stmt</td>
                    <td style={{ color: 'var(--bts-muted)' }}>n/a</td>
                    <td className="bts-esop-col" style={{ color: 'var(--bts-green)' }}>Not a line item</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bts-col bts-col-right">
            <div>
              <div className="bts-sec-label">Who Gets Paid What</div>
              <div className="bts-closing-stmt">
                <div className="bts-closing-title">Compensation — All Three Parties</div>
                <div className="bts-fee-row">
                  <div className="bts-fee-who bts-broker">Broker</div>
                  <div className="bts-fee-detail"><strong>Full commission at closing from proceeds.</strong> Same rate as any other buyer. We do not renegotiate, defer, or share your fee. Existing agreements with the seller are honored.</div>
                </div>
                <div className="bts-fee-row">
                  <div className="bts-fee-who bts-seller">Seller</div>
                  <div className="bts-fee-detail"><strong>Full negotiated purchase price.</strong> ~75% cash at close; ~25% seller note. §1042 defers federal cap gains. Forhemit&apos;s fee does not appear on the closing statement — the seller&apos;s number is the seller&apos;s number.</div>
                </div>
                <div className="bts-fee-row">
                  <div className="bts-fee-who bts-forhemit">Forhemit</div>
                  <div className="bts-fee-detail"><strong>Paid by the ESOP trust</strong> — the buyer entity — as a tax-deductible business expense. Structuring retainer ($25K, earned at engagement) + transaction fee at close. We do not take equity. We are never the buyer.</div>
                </div>
              </div>
            </div>

            <div>
              <div className="bts-sec-label">What to Know Before You Send a Deal</div>
              <div className="bts-gotcha-box">
                <div className="bts-gotcha-title">Honest Disclosures</div>
                <div className="bts-gotcha-list">
                  <div className="bts-gotcha-item">S-corp sellers must convert to C-corp before closing for §1042 to apply — flag this at intake, before any conversion happens.</div>
                  <div className="bts-gotcha-item">Cash at close is ~75% of price. The seller note carries the balance with a mandatory refinance trigger at Mo. 14–18.</div>
                  <div className="bts-gotcha-item">Timeline can extend to 150–180 days for licensing, landlord consents, or successor hiring. This is not a failure state.</div>
                  <div className="bts-gotcha-item">All ESOP participants must be U.S. citizens or permanent residents — confirm workforce at intake.</div>
                  <div className="bts-gotcha-item">Forhemit is completing its first transaction. Our credential is a pre-positioned team and lender-validated process structure, not a closed deal count.</div>
                </div>
              </div>
            </div>

            <div>
              <div className="bts-sec-label">Running a Parallel Buyer Process?</div>
              <div className="bts-sec-body" style={{ color: 'var(--bts-muted)', fontSize: '7.5pt', lineHeight: '1.65' }}>
                We are two-track friendly. If you&apos;re also showing the deal to conventional buyers, ask us for our two-track cost analysis. One critical flag: <strong style={{ color: 'var(--bts-ink)' }}>an S-corp that converts to C-corp and then sells conventionally faces Built-In Gains tax exposure.</strong> That conversation belongs with the seller&apos;s CPA before conversion — not after.
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '.09in', borderTop: '1px solid var(--bts-rule)' }}>
              <div className="bts-sec-body" style={{ fontSize: '6.5pt', color: 'var(--bts-muted)', fontStyle: 'italic', lineHeight: '1.6' }}>
                Tax figures assume C-corp, zero basis, full §1042 election, Florida domicile. §1042 requires reinvestment in Qualified Replacement Property within 12 months. This is not tax or legal advice. Seller&apos;s CPA must confirm eligibility and model actual exposure.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bts-footer">
          <div className="bts-footer-mark">Forhemit</div>
          <div className="bts-footer-contact">
            <div className="bts-footer-item">
              <div className="bts-footer-label">Deal Intake</div>
              <div className="bts-footer-val">deals@forhemit.com</div>
            </div>
            <div className="bts-footer-item">
              <div className="bts-footer-label">Web</div>
              <div className="bts-footer-val">forhemit.com</div>
            </div>
            <div className="bts-footer-item">
              <div className="bts-footer-label">Direct</div>
              <EditableField
                value={formData.senderEmail}
                onChange={(v) => updateField("senderEmail", v)}
                placeholder="sender@forhemit.com"
                className="bts-footer-val-input"
                type="email"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
