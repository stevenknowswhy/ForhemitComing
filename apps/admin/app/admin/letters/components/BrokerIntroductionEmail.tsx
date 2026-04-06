"use client";

import React, { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import "./BrokerIntroductionEmail.css";

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
      <span className="bie-print-value">
        {value || placeholder}
      </span>
    </>
  );
}

// Helper function to create page header for PDF
const createPageHeader = (formData: FormData) => `
  <div style="background: #1A2238; padding: 0.9rem 2.8rem 0.7rem; display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;">
    <div>
      <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase; color: #F8F5EF; line-height: 1; margin-bottom: 0.1rem;">Forhemit</div>
      <div style="font-size: 0.55rem; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(248,245,239,0.4);">Transition Stewardship</div>
    </div>
    <div style="font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; color: #B89060; border: 1px solid rgba(184,144,96,0.4); padding: 0.15rem 0.45rem; text-align: right;">Broker Introduction</div>
  </div>
  <div style="height: 2px; background: linear-gradient(90deg, #9A7540 0%, #B89060 55%, transparent 100%);"></div>
  <div style="background: #EDE8DF; padding: 0.4rem 2.8rem 0.45rem; display: flex; gap: 2rem; align-items: center; border-bottom: 1px solid #D4CBBF; flex-wrap: wrap;">
    <div style="display: flex; align-items: baseline; gap: 0.4rem;">
      <span style="font-size: 0.55rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #7A7060; white-space: nowrap;">Firm</span>
      <span style="font-size: 0.75rem; color: #1A2238; font-weight: 400;">${formData.brokerFirm || 'Brokerage / firm'}</span>
    </div>
    <div style="display: flex; align-items: baseline; gap: 0.4rem;">
      <span style="font-size: 0.55rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #7A7060; white-space: nowrap;">Market</span>
      <span style="font-size: 0.75rem; color: #1A2238; font-weight: 400;">${formData.brokerMarket || 'City / region'}</span>
    </div>
    <div style="display: flex; align-items: baseline; gap: 0.4rem;">
      <span style="font-size: 0.55rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #7A7060; white-space: nowrap;">Re</span>
      <span style="font-size: 0.75rem; color: #1A2238; font-weight: 400;">${formData.dealRef || 'Deal reference'}</span>
    </div>
  </div>
`;

export default function BrokerIntroductionEmail() {
  const [formData, setFormData] = useState<FormData>(DEFAULT_DATA);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [attachIntroPdf, setAttachIntroPdf] = useState(false);
  const [attachTearSheetPdf, setAttachTearSheetPdf] = useState(false);
  const [introPdfBase64, setIntroPdfBase64] = useState<string>("");
  const [tearSheetPdfBase64, setTearSheetPdfBase64] = useState<string>("");
  const [generatingIntro, setGeneratingIntro] = useState(false);
  const [generatingTearSheet, setGeneratingTearSheet] = useState(false);

  // Editable preview data
  const [previewData, setPreviewData] = useState<PreviewData>({
    to: "",
    subject: "Forhemit Transition Stewardship — Broker Introduction",
    message: "",
  });

  const sendBrokerEmail = useAction(api.emails.sendBrokerIntroductionEmail);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setFormData(DEFAULT_DATA);
    setSendStatus(null);
    setIntroPdfBase64("");
    setTearSheetPdfBase64("");
  };

  const generateDefaultEmailBody = () => {
    return `Hi ${formData.brokerFirstName || "there"},

I hope this email finds you well. I'm reaching out from Forhemit Transition Stewardship regarding potential acquisition opportunities.

Forhemit is actively looking for founder-owned businesses to acquire. What makes us different: the company buys itself. The seller exits at fair market value, employees become owners, and the business stays in the community.

What We're Looking For:
• EBITDA of $3M – $15M
• 20 or more W-2 employees
• Any industry — we are generalist buyers
• Primary markets: Florida, Texas, Tennessee
• C-corp preferred; S-corp deals require pre-close conversion
• Founder-led with consistent 3+ year financial history

I've attached a detailed introduction document that explains our process, how everyone gets paid, and why sellers take a second look at our ESOP structure.

If you have a listing that fits, I'd love to connect. If you're not sure, send it anyway — we confirm fit within 48 hours.

What We Bring:
• Fully vetted partners (Lenders, Trustees, ERISA Counsel) ready to go
• 120-day closing roadmap
• Fully protected commission
• Seller gets full fair market value
• We do not appear on the closing documents`;
  };

  const handleOpenPreview = async () => {
    if (!formData.brokerEmail) {
      setSendStatus("Please enter a broker email address");
      return;
    }

    // Reset PDF states
    setIntroPdfBase64("");
    setTearSheetPdfBase64("");
    setAttachIntroPdf(false);
    setAttachTearSheetPdf(false);
    setGeneratingIntro(false);
    setGeneratingTearSheet(false);

    // Initialize preview data with current values
    const defaultMessage = generateDefaultEmailBody();
    setPreviewData({
      to: formData.brokerEmail,
      subject: "Forhemit Transition Stewardship — Broker Introduction",
      message: defaultMessage,
    });

    setShowPreview(true);
    setSendStatus(null);
  };

  const handleToggleIntroPdf = async (checked: boolean) => {
    setAttachIntroPdf(checked);

    if (checked && !introPdfBase64) {
      setGeneratingIntro(true);
      try {
        const introHtml = `
          <div style="font-family: 'Cormorant Garamond', Georgia, serif; background: #F8F5EF; color: #1C1510; margin: 0; padding: 0;">
            <div style="background: #1A2238; padding: 1.2rem 2.8rem 1rem; display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;">
              <div>
                <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.35rem; font-weight: 300; letter-spacing: 0.22em; text-transform: uppercase; color: #F8F5EF; line-height: 1; margin-bottom: 0.15rem;">Forhemit</div>
                <div style="font-size: 0.6rem; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(248,245,239,0.4);">Transition Stewardship</div>
              </div>
              <div style="font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; color: #B89060; border: 1px solid rgba(184,144,96,0.4); padding: 0.18rem 0.5rem; text-align: right;">Broker Introduction</div>
            </div>
            <div style="height: 2px; background: linear-gradient(90deg, #9A7540 0%, #B89060 55%, transparent 100%);"></div>
            <div style="background: #EDE8DF; padding: 0.55rem 2.8rem; display: flex; gap: 2rem; align-items: center; border-bottom: 1px solid #D4CBBF; flex-wrap: wrap;">
              <div style="display: flex; align-items: baseline; gap: 0.5rem;">
                <span style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #7A7060; white-space: nowrap;">Firm</span>
                <span style="font-size: 0.8rem; color: #1A2238; font-weight: 400;">${formData.brokerFirm || 'Brokerage / firm'}</span>
              </div>
              <div style="display: flex; align-items: baseline; gap: 0.5rem;">
                <span style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #7A7060; white-space: nowrap;">Market</span>
                <span style="font-size: 0.8rem; color: #1A2238; font-weight: 400;">${formData.brokerMarket || 'City / region'}</span>
              </div>
              <div style="display: flex; align-items: baseline; gap: 0.5rem;">
                <span style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #7A7060; white-space: nowrap;">Re</span>
                <span style="font-size: 0.8rem; color: #1A2238; font-weight: 400;">${formData.dealRef || 'Deal reference'}</span>
              </div>
            </div>

            <div style="padding: 0.8rem 2.8rem 0.5rem; font-size: 0.9rem; line-height: 1.65; color: #1C1510;">
              <div style="margin-bottom: 1rem;">Hi ${formData.brokerFirstName || 'there'},</div>
              <div style="margin-bottom: 1rem;"><strong>I'll keep this short.</strong> Forhemit Transition Stewardship is actively looking for founder-owned businesses to acquire, and brokers are how we find them. I want to introduce us and be direct about how everyone gets paid.</div>
              <div style="margin-bottom: 1rem;">What makes us different from the PE firms and strategic buyers in your deal flow: <strong>the company buys itself.</strong> The seller exits at fair market value. The employees become the owners. The business stays in the community it was built in.</div>
              <div style="height: 1px; background: #D4CBBF; margin: 1rem 0;"></div>
              <div style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #9A7540; display: block; margin-bottom: 0.5rem;">How Everyone Gets Paid</div>
              <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 0.2rem;">
                <div style="border-left: 2px solid #B89060; padding-left: 0.8rem;">
                  <div style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.15rem; color: #9A7540;">Broker</div>
                  <div style="font-size: 0.84rem; font-weight: 300; line-height: 1.65; color: #1C1510;">Your commission is paid at closing from proceeds — same rate as any other buyer. We do not renegotiate, defer, or share your fee. Existing agreements with the seller are honored.</div>
                </div>
                <div style="border-left: 2px solid #3E6B4A; padding-left: 0.8rem;">
                  <div style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.15rem; color: #3E6B4A;">Seller</div>
                  <div style="font-size: 0.84rem; font-weight: 300; line-height: 1.65; color: #1C1510;">The seller receives their full negotiated purchase price. Approximately 75% arrives as cash at close; the remaining 25% is a seller note with a mandatory refinance trigger at months 14–18. <strong>Forhemit does not appear as a line item on the seller's closing statement</strong> — our fee does not reduce the seller's proceeds.</div>
                </div>
                <div style="border-left: 2px solid #243048; padding-left: 0.8rem;">
                  <div style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 0.15rem; color: #243048;">Forhemit Transition Stewardship</div>
                  <div style="font-size: 0.84rem; font-weight: 300; line-height: 1.65; color: #1C1510;">We are paid by the ESOP trust — the buyer entity — as a <strong>tax-deductible business expense</strong>. A structuring retainer ($25,000, earned at engagement) plus a transaction fee at closing. We do not take equity. We are never the buyer. We do not appear on anyone's closing statement.</div>
                </div>
              </div>

              <div style="height: 1px; background: #D4CBBF; margin: 1rem 0;"></div>
              <div style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #9A7540; display: block; margin-bottom: 0.5rem;">Why the Seller Takes a Second Look — $3M EBITDA Example</div>
              <div style="margin-bottom: 0.5rem;">The headline number will be at fair market value, not a PE premium. Here is what the comparison looks like after tax:</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; margin-bottom: 0.8rem;">
                <thead>
                  <tr style="border-bottom: 1px solid #D4CBBF;">
                    <th style="text-align: left; padding: 0.3rem 0.2rem; font-weight: 500; color: #7A7060;"></th>
                    <th style="text-align: right; padding: 0.3rem 0.2rem; font-weight: 600; color: #1A2238;">PE / Conv.</th>
                    <th style="text-align: right; padding: 0.3rem 0.2rem; font-weight: 600; color: #9A7540;">ESOP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #E8E4DC;">
                    <td style="padding: 0.25rem 0.2rem; color: #7A7060;">Valuation</td>
                    <td style="text-align: right; padding: 0.25rem 0.2rem; color: #1A2238;">6.0× EBITDA</td>
                    <td style="text-align: right; padding: 0.25rem 0.2rem; color: #1A2238;">4.5× EBITDA</td>
                  </tr>
                  <tr style="background: rgba(26,34,56,0.04);">
                    <td style="padding: 0.25rem 0.2rem; color: #1A2238; font-weight: 500;">Gross price</td>
                    <td style="text-align: right; padding: 0.25rem 0.2rem; color: #1A2238; font-weight: 600;">$18,000,000</td>
                    <td style="text-align: right; padding: 0.25rem 0.2rem; color: #1A2238; font-weight: 600;">$13,500,000</td>
                  </tr>
                  <tr>
                    <td style="padding: 0.25rem 0.2rem; color: #7A7060;">Broker (5%)</td>
                    <td style="text-align: right; padding: 0.25rem 0.2rem; color: #B91C1C;">− $900,000</td>
                    <td style="text-align: right; padding: 0.25rem 0.2rem; color: #B91C1C;">− $675,000</td>
                  </tr>
                  <tr style="background: rgba(26,34,56,0.04);">
                    <td style="padding: 0.25rem 0.2rem; color: #1A2238; font-weight: 500;">Net of broker</td>
                    <td style="text-align: right; padding: 0.25rem 0.2rem; color: #1A2238; font-weight: 600;">$17,100,000</td>
                    <td style="text-align: right; padding: 0.25rem 0.2rem; color: #1A2238; font-weight: 600;">$12,825,000</td>
                  </tr>
                  <tr>
                    <td style="padding: 0.25rem 0.2rem; color: #7A7060;">Fed cap gains (23.8%)</td>
                    <td style="text-align: right; padding: 0.25rem 0.2rem; color: #B91C1C;">− $4,069,800</td>
                    <td style="text-align: right; padding: 0.25rem 0.2rem; color: #15803D;">$0 <span style="font-size: 0.6rem;">§1042</span></td>
                  </tr>
                  <tr style="background: rgba(154,117,64,0.12); border-top: 2px solid #9A7540;">
                    <td style="padding: 0.3rem 0.2rem; color: #1A2238; font-weight: 600;">Seller walks with</td>
                    <td style="text-align: right; padding: 0.3rem 0.2rem; color: #1A2238; font-weight: 600;">$13,030,200</td>
                    <td style="text-align: right; padding: 0.3rem 0.2rem; color: #9A7540; font-weight: 700;">$12,825,000</td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-bottom: 0.5rem; padding: 0.3rem; background: rgba(154,117,64,0.07); border-left: 2px solid #9A7540; font-size: 0.75rem; line-height: 1.5; color: #1C1510;">PE wins by only $205K after tax — on a $4.5M higher headline. But PE deals include <strong>earn-outs and covenants</strong>. The ESOP number is a floor, not a ceiling.</div>

              <div style="height: 1px; background: #D4CBBF; margin: 1rem 0;"></div>
              <div style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #9A7540; display: block; margin-bottom: 0.5rem;">How It Works</div>
              <div style="margin-bottom: 0.8rem;">Forhemit Transition Stewardship coordinates the full deal team — SBA lender, ESOP trustee, ERISA counsel, TPA, and appraiser. We manage the process from intake through closing across a structured 120-day timeline. The owner runs the business. We run the deal.</div>
              <div style="margin-bottom: 0.8rem;">After closing, we remain engaged 12–24 months to protect the seller's note and ensure the operational transition is real — not just a filing. A conventional buyer closes with a transaction. We close with a transition.</div>
              <div style="margin-bottom: 0.8rem; padding: 0.5rem; background: rgba(26,34,56,0.04); border-left: 2px solid #1A2238;"><strong>Forhemit does not appear as a line item in the seller's closing documents.</strong> Our fee is paid by the ESOP trust as a tax-deductible business expense. The seller receives their full purchase price. The broker receives their full commission from proceeds.</div>

              <div style="height: 1px; background: #D4CBBF; margin: 1rem 0;"></div>
              <div style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #9A7540; display: block; margin-bottom: 0.5rem;">One Honest Disclosure</div>
              <div style="margin-bottom: 0.8rem;">Forhemit Transition Stewardship is completing its first transaction. Our credential is not a closed deal count — it is a pre-positioned deal team, a lender-validated process structure, and a 120-day roadmap with hard gates at every milestone. We do not ask a seller to sign anything they have not reviewed with their own counsel.</div>
              <div style="margin-bottom: 1rem;">If you have something that might fit — or want to understand the structure before bringing it to a seller — I am glad to spend 20 minutes on the phone. <strong>Tear sheet attached.</strong></div>
            </div>

            <div style="border-top: 1px solid #D4CBBF; padding: 1.2rem 2.8rem 1.4rem; background: #EDE8DF;">
              <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; font-weight: 400; color: #1A2238; margin-bottom: 0.2rem;">${formData.senderName}</div>
              <div style="font-size: 0.72rem; font-weight: 300; color: #7A7060; line-height: 1.7;">
                ${formData.senderTitle} · Forhemit Transition Stewardship<br/>
                ${formData.senderEmail} · ${formData.senderPhone} · forhemit.com
              </div>
            </div>
          </div>
        `;

        const pdfResponse = await fetch('/api/pdf-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateName: 'Broker-Introduction',
            htmlContent: introHtml,
            cssContent: '',
            formData,
          }),
        });

        if (!pdfResponse.ok) {
          const errorText = await pdfResponse.text();
          throw new Error(`Failed to generate PDF: ${errorText}`);
        }

        const pdfBlob = await pdfResponse.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(pdfBlob);
        });

        setIntroPdfBase64(base64);
      } catch (error) {
        console.error('Error generating Introduction PDF:', error);
        setIntroPdfBase64("");
        setAttachIntroPdf(false);
        setSendStatus("Failed to generate Introduction PDF");
      } finally {
        setGeneratingIntro(false);
      }
    } else if (!checked) {
      // Clear PDF when unchecked
      setIntroPdfBase64("");
    }
  };

  const handleToggleTearSheetPdf = async (checked: boolean) => {
    setAttachTearSheetPdf(checked);

    if (checked && !tearSheetPdfBase64) {
      // Generate PDF on demand
      setGeneratingTearSheet(true);
      try {
        // Build tear sheet HTML inline
        const tearSheetHtml = `
          <div class="bts-page" style="font-family: Georgia, serif; background: #F8F5EF; padding: 0.4in; width: 8.5in; min-height: 11in; box-sizing: border-box; color: #1A2238;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.15in;">
              <div>
                <div style="font-family: 'Newsreader', Georgia, serif; font-size: 22pt; font-weight: 500; letter-spacing: -0.01em; color: #1A2238;">Forhemit</div>
                <div style="font-size: 9pt; color: #6F6A63; letter-spacing: 0.02em; margin-top: 0.02in;">Transition Stewardship</div>
              </div>
              <div style="text-align: right;">
                <div style="display: inline-block; background: #1A2238; color: #F8F5EF; font-size: 7pt; padding: 0.06in 0.14in; border-radius: 999px; font-family: 'Inter', system-ui, sans-serif; font-weight: 600; letter-spacing: 0.04em;">BROKER INTRODUCTION</div>
                <div style="font-size: 7.5pt; color: #6F6A63; margin-top: 0.08in; font-family: 'Inter', system-ui, sans-serif;">deals@forhemit.com · forhemit.com</div>
              </div>
            </div>
            <div style="height: 2px; background: linear-gradient(90deg, #9A7540 0%, rgba(154,117,64,0.3) 100%); margin: 0.15in 0;"></div>

            <div style="display: flex; flex-wrap: wrap; gap: 0.12in; background: #F0EBE3; padding: 0.1in 0.12in; border-radius: 6px; margin-bottom: 0.2in; font-family: 'Inter', system-ui, sans-serif;">
              <div style="display: flex; flex-direction: column; gap: 0.02in;">
                <span style="font-size: 6pt; color: #6F6A63; text-transform: uppercase; letter-spacing: 0.04em;">First</span>
                <span style="font-size: 8pt; color: #1A2238; font-weight: 500;">${formData.brokerFirstName || 'First name'}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.02in;">
                <span style="font-size: 6pt; color: #6F6A63; text-transform: uppercase; letter-spacing: 0.04em;">Last</span>
                <span style="font-size: 8pt; color: #1A2238; font-weight: 500;">${formData.brokerLastName || 'Last name'}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.02in;">
                <span style="font-size: 6pt; color: #6F6A63; text-transform: uppercase; letter-spacing: 0.04em;">Firm</span>
                <span style="font-size: 8pt; color: #1A2238; font-weight: 500;">${formData.brokerFirm || 'Brokerage / firm'}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.02in;">
                <span style="font-size: 6pt; color: #6F6A63; text-transform: uppercase; letter-spacing: 0.04em;">Market</span>
                <span style="font-size: 8pt; color: #1A2238; font-weight: 500;">${formData.brokerMarket || 'City / region'}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.02in;">
                <span style="font-size: 6pt; color: #6F6A63; text-transform: uppercase; letter-spacing: 0.04em;">Re</span>
                <span style="font-size: 8pt; color: #1A2238; font-weight: 500;">${formData.dealRef || 'Deal reference'}</span>
              </div>
            </div>

            <div style="display: flex; gap: 0.2in;">
              <div style="flex: 1.1; display: flex; flex-direction: column; gap: 0.18in;">
                <div>
                  <div style="font-family: 'Newsreader', Georgia, serif; font-size: 16pt; font-weight: 400; line-height: 1.2; color: #1A2238;">We help companies<br/><em style="font-style: italic;">buy themselves.</em></div>
                  <div style="margin-top: 0.08in; color: #6F6A63; font-size: 7.5pt; line-height: 1.5;">Forhemit is a transaction stewardship firm. We facilitate employee ownership transitions — coordinating the full deal team, managing the 120-day process, and staying on post-close to protect the seller's note and the continuity of the business.</div>
                </div>

                <div>
                  <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9A7540; margin-bottom: 0.08in;">Deal Criteria</div>
                  <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.05in 0.1in; font-size: 7.5pt;">
                    <span style="color: #6F6A63;">EBITDA</span><span style="color: #1A2238;"><strong>$3M – $15M</strong></span>
                    <span style="color: #6F6A63;">Employees</span><span style="color: #1A2238;"><strong>20+</strong> W-2 employees</span>
                    <span style="color: #6F6A63;">Entity</span><span style="color: #1A2238;">C-corp preferred; S-corp considered</span>
                    <span style="color: #6F6A63;">Industry</span><span style="color: #1A2238;">Any — generalist buyer</span>
                    <span style="color: #6F6A63;">Markets</span><span style="color: #1A2238;"><strong>FL, TX, TN</strong> — other states considered</span>
                    <span style="color: #6F6A63;">Seller</span><span style="color: #1A2238;">Founder-led, 3+ yr consistent financials</span>
                    <span style="color: #6F6A63;">Workforce</span><span style="color: #1A2238;">All ESOP participants: U.S. citizens</span>
                  </div>
                </div>

                <div>
                  <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9A7540; margin-bottom: 0.08in;">How Everyone Gets Paid</div>
                  <div style="font-size: 7.5pt; color: #1A2238; line-height: 1.5; margin-bottom: 0.08in;">
                    <strong style="color: #1A2238;">Broker:</strong> Commission paid at closing from proceeds — same rate as any buyer.
                  </div>
                  <div style="font-size: 7.5pt; color: #1A2238; line-height: 1.5; margin-bottom: 0.08in;">
                    <strong style="color: #1A2238;">Seller:</strong> Receives full negotiated price. ~75% cash at close; ~25% seller note with mandatory refinance at months 14–18.
                  </div>
                  <div style="font-size: 7.5pt; color: #1A2238; line-height: 1.5;">
                    <strong style="color: #1A2238;">Forhemit:</strong> Paid by ESOP trust as tax-deductible expense. Not on seller's closing statement.
                  </div>
                </div>

                <div>
                  <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9A7540; margin-bottom: 0.08in;">Send Us a Deal</div>
                  <div style="font-size: 7.5pt; color: #1A2238; line-height: 1.5;">Email a teaser or CIM to <strong style="font-family: 'Inter', sans-serif; font-size: 7pt;">deals@forhemit.com</strong>. We confirm fit within 48 hours.</div>
                </div>
              </div>

              <div style="flex: 1.2; display: flex; flex-direction: column; gap: 0.18in;">
                <div>
                  <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9A7540; margin-bottom: 0.1in;">$3M EBITDA Deal — The Real Math</div>
                  <table style="width: 100%; border-collapse: collapse; font-size: 7.5pt;">
                    <thead>
                      <tr style="border-bottom: 1px solid #D4CBBF;">
                        <th style="text-align: left; padding: 0.06in 0.04in; font-weight: 500; color: #6F6A63;"></th>
                        <th style="text-align: right; padding: 0.06in 0.04in; font-weight: 600; color: #1A2238;">PE / Conv.</th>
                        <th style="text-align: right; padding: 0.06in 0.04in; font-weight: 600; color: #9A7540;">ESOP</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 1px solid #E8E4DC;">
                        <td style="padding: 0.05in 0.04in; color: #6F6A63;">Valuation</td>
                        <td style="text-align: right; padding: 0.05in 0.04in; color: #1A2238;">6.0× EBITDA</td>
                        <td style="text-align: right; padding: 0.05in 0.04in; color: #1A2238;">4.5× EBITDA</td>
                      </tr>
                      <tr style="background: rgba(26,34,56,0.04);">
                        <td style="padding: 0.05in 0.04in; color: #1A2238; font-weight: 500;">Gross price</td>
                        <td style="text-align: right; padding: 0.05in 0.04in; color: #1A2238; font-weight: 600;">$18,000,000</td>
                        <td style="text-align: right; padding: 0.05in 0.04in; color: #1A2238; font-weight: 600;">$13,500,000</td>
                      </tr>
                      <tr>
                        <td style="padding: 0.05in 0.04in; color: #6F6A63;">Broker (5%)</td>
                        <td style="text-align: right; padding: 0.05in 0.04in; color: #B91C1C;">− $900,000</td>
                        <td style="text-align: right; padding: 0.05in 0.04in; color: #B91C1C;">− $675,000</td>
                      </tr>
                      <tr style="background: rgba(26,34,56,0.04);">
                        <td style="padding: 0.05in 0.04in; color: #1A2238; font-weight: 500;">Net of broker</td>
                        <td style="text-align: right; padding: 0.05in 0.04in; color: #1A2238; font-weight: 600;">$17,100,000</td>
                        <td style="text-align: right; padding: 0.05in 0.04in; color: #1A2238; font-weight: 600;">$12,825,000</td>
                      </tr>
                      <tr>
                        <td style="padding: 0.05in 0.04in; color: #6F6A63;">Fed cap gains (23.8%)</td>
                        <td style="text-align: right; padding: 0.05in 0.04in; color: #B91C1C;">− $4,069,800</td>
                        <td style="text-align: right; padding: 0.05in 0.04in; color: #15803D;">$0 <span style="font-size: 6pt;">§1042</span></td>
                      </tr>
                      <tr style="background: rgba(154,117,64,0.12); border-top: 2px solid #9A7540;">
                        <td style="padding: 0.06in 0.04in; color: #1A2238; font-weight: 600;">Seller walks with</td>
                        <td style="text-align: right; padding: 0.06in 0.04in; color: #1A2238; font-weight: 600;">$13,030,200</td>
                        <td style="text-align: right; padding: 0.06in 0.04in; color: #9A7540; font-weight: 700;">$12,825,000</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style="margin-top: 0.1in; padding: 0.08in; background: rgba(154,117,64,0.07); border-left: 2px solid #9A7540; font-size: 7pt; line-height: 1.5; color: #1A2238;">
                    PE wins by only $205K after tax — on a $4.5M higher headline. But PE deals include <strong>earn-outs and covenants</strong>. The ESOP number is a floor, not a ceiling.
                  </div>
                </div>

                <div style="background: #1A2238; color: #F8F5EF; padding: 0.12in; border-radius: 6px;">
                  <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9A7540; margin-bottom: 0.06in;">The Closing Statement</div>
                  <div style="font-size: 7.5pt; line-height: 1.5;"><strong>Forhemit does not appear on the seller's closing statement.</strong> Our fee is paid by the ESOP trust as a business expense. The seller receives their full price. The broker receives their full commission.</div>
                </div>
              </div>

              <div style="flex: 0.9; display: flex; flex-direction: column; gap: 0.18in;">
                <div>
                  <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9A7540; margin-bottom: 0.08in;">How We Close</div>
                  <div style="display: flex; flex-direction: column; gap: 0.1in;">
                    <div style="display: flex; gap: 0.08in;">
                      <div style="width: 18px; height: 18px; background: #1A2238; color: #F8F5EF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7pt; font-weight: 700; flex-shrink: 0;">1</div>
                      <div style="font-size: 7.5pt; line-height: 1.4;"><strong>Pre-Qualification</strong><br/><span style="color: #6F6A63;">Deal screened, lender engaged before LOI.</span></div>
                    </div>
                    <div style="display: flex; gap: 0.08in;">
                      <div style="width: 18px; height: 18px; background: #1A2238; color: #F8F5EF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7pt; font-weight: 700; flex-shrink: 0;">2</div>
                      <div style="font-size: 7.5pt; line-height: 1.4;"><strong>Team Assembly</strong><br/><span style="color: #6F6A63;">SBA lender, trustee, ERISA counsel, TPA.</span></div>
                    </div>
                    <div style="display: flex; gap: 0.08in;">
                      <div style="width: 18px; height: 18px; background: #1A2238; color: #F8F5EF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7pt; font-weight: 700; flex-shrink: 0;">3</div>
                      <div style="font-size: 7.5pt; line-height: 1.4;"><strong>120-Day Process</strong><br/><span style="color: #6F6A63;">Five phases with hard gates.</span></div>
                    </div>
                    <div style="display: flex; gap: 0.08in;">
                      <div style="width: 18px; height: 18px; background: #1A2238; color: #F8F5EF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7pt; font-weight: 700; flex-shrink: 0;">4</div>
                      <div style="font-size: 7.5pt; line-height: 1.4;"><strong>Post-Close</strong><br/><span style="color: #6F6A63;">12–24 months stewardship.</span></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9A7540; margin-bottom: 0.08in;">What We Bring</div>
                  <div style="display: flex; flex-direction: column; gap: 0.08in; font-size: 7.5pt; line-height: 1.5;">
                    <div><strong>Pre-positioned deal team.</strong> No discovery surprises.</div>
                    <div><strong>COOP pre-assessment.</strong> Key-person risk documented.</div>
                    <div><strong>Transition vs. transaction.</strong> We close with stability.</div>
                  </div>
                </div>

                <div>
                  <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9A7540; margin-bottom: 0.08in;">Side by Side</div>
                  <div style="font-size: 7.5pt; display: flex; flex-direction: column; gap: 0.06in;">
                    <div style="display: flex; justify-content: space-between;"><span style="color: #6F6A63;">Timeline</span><span style="color: #1A2238;">120 days</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #6F6A63;">Cap gains tax</span><span style="color: #15803D;">$0 (§1042)</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #6F6A63;">Seller note</span><span style="color: #1A2238;">~25%</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #6F6A63;">Earn-outs</span><span style="color: #B91C1C;">None</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #6F6A63;">Post-close</span><span style="color: #1A2238;">12–24 mo</span></div>
                  </div>
                </div>

                <div>
                  <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 7pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9A7540; margin-bottom: 0.08in;">Disclosures</div>
                  <div style="font-size: 7pt; color: #6F6A63; line-height: 1.5;">Forhemit is completing its first transaction. This is not an offer to buy or sell securities. ESOP transactions involve regulatory complexity. Seller's counsel must review all documents.</div>
                </div>
              </div>
            </div>

            <div style="margin-top: 0.2in; padding-top: 0.15in; border-top: 1px solid #D4CBBF; display: flex; justify-content: space-between; font-size: 7pt; color: #6F6A63;">
              <div>${formData.senderName} · ${formData.senderTitle}</div>
              <div>${formData.senderEmail} · ${formData.senderPhone}</div>
            </div>
          </div>
        `;

        const pdfResponse = await fetch('/api/pdf-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateName: 'Broker-Tear-Sheet',
            htmlContent: tearSheetHtml,
            cssContent: '',
            formData,
          }),
        });

        if (!pdfResponse.ok) {
          const errorText = await pdfResponse.text();
          throw new Error(`Failed to generate PDF: ${errorText}`);
        }

        const pdfBlob = await pdfResponse.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(pdfBlob);
        });

        setTearSheetPdfBase64(base64);
      } catch (error) {
        console.error('Error generating Tear Sheet PDF:', error);
        setTearSheetPdfBase64("");
        setAttachTearSheetPdf(false);
        setSendStatus("Failed to generate Tear Sheet PDF");
      } finally {
        setGeneratingTearSheet(false);
      }
    } else if (!checked) {
      // Clear PDF when unchecked
      setTearSheetPdfBase64("");
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    setSendStatus("Sending email...");

    try {
      const payload = {
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
        subject: previewData.subject,
        customMessage: previewData.message,
        ...(attachIntroPdf && introPdfBase64 ? { introPdfBase64 } : {}),
        ...(attachTearSheetPdf && tearSheetPdfBase64 ? { tearSheetPdfBase64 } : {}),
      };

      const result = await sendBrokerEmail(payload);

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
    <div className="bie-container">
      {/* Screen controls */}
      <div className="bie-app-header">
        <div>
          <div className="bie-app-wordmark">Forhemit Transition Stewardship</div>
          <div className="bie-app-sub">Broker Introduction Email — Fillable Form</div>
        </div>
        <div className="bie-header-actions">
          {sendStatus && (
            <span className={`bie-status-message ${sendStatus.includes("success") ? "success" : sendStatus.includes("Failed") ? "error" : ""}`}>
              {sendStatus}
            </span>
          )}
          <button className="bie-btn-clear" onClick={handleClear} disabled={isSending}>
            Clear
          </button>
          <button className="bie-btn-email" onClick={handleOpenPreview} disabled={isSending}>
            {isSending ? "Preparing..." : "✉ Preview & Send"}
          </button>
          <button className="bie-btn-print" onClick={() => window.print()} disabled={isSending}>
            ⎙ Print / Save PDF
          </button>
        </div>
      </div>

      {/* Email Preview Modal with Editable Fields */}
      {showPreview && (
        <div className="bie-modal-overlay" onClick={() => !isSending && setShowPreview(false)}>
          <div className="bie-modal-content bie-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="bie-modal-header">
              <h2>Preview & Edit Email</h2>
              <button
                className="bie-modal-close"
                onClick={() => setShowPreview(false)}
                disabled={isSending}
              >
                ✕
              </button>
            </div>

            <div className="bie-modal-body">
              {/* Editable Recipient */}
              <div className="bie-preview-section">
                <label className="bie-preview-label">To:</label>
                <input
                  type="email"
                  className="bie-preview-input"
                  value={previewData.to}
                  onChange={(e) => setPreviewData(prev => ({ ...prev, to: e.target.value }))}
                  disabled={isSending}
                />
              </div>

              {/* Editable Subject */}
              <div className="bie-preview-section">
                <label className="bie-preview-label">Subject:</label>
                <input
                  type="text"
                  className="bie-preview-input"
                  value={previewData.subject}
                  onChange={(e) => setPreviewData(prev => ({ ...prev, subject: e.target.value }))}
                  disabled={isSending}
                />
              </div>

              {/* PDF Attachments */}
              <div className="bie-preview-section bie-attachment-toggle">
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--bie-ink)' }}>
                  PDF Attachments:
                </div>

                {/* Introduction Letter PDF Toggle */}
                <label className="bie-toggle-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={attachIntroPdf}
                    onChange={(e) => handleToggleIntroPdf(e.target.checked)}
                    disabled={generatingIntro || isSending}
                  />
                  <span className="bie-toggle-text">
                    {generatingIntro ? (
                      <>
                        ⏳ Generating Introduction Letter...
                      </>
                    ) : (
                      <>
                        📄 Introduction Letter
                        {introPdfBase64 && <span className="bie-file-name"> (Forhemit-Broker-Introduction.pdf) ✓</span>}
                      </>
                    )}
                  </span>
                </label>

                {/* Tear Sheet PDF Toggle */}
                <label className="bie-toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={attachTearSheetPdf}
                    onChange={(e) => handleToggleTearSheetPdf(e.target.checked)}
                    disabled={generatingTearSheet || isSending}
                  />
                  <span className="bie-toggle-text">
                    {generatingTearSheet ? (
                      <>
                        ⏳ Generating Tear Sheet...
                      </>
                    ) : (
                      <>
                        📊 Broker Tear Sheet
                        {tearSheetPdfBase64 && <span className="bie-file-name"> (Forhemit-Broker-Tear-Sheet.pdf) ✓</span>}
                      </>
                    )}
                  </span>
                </label>
              </div>

              {/* Editable Email Body */}
              <div className="bie-preview-section">
                <label className="bie-preview-label">Message:</label>
                <textarea
                  className="bie-preview-textarea"
                  value={previewData.message}
                  onChange={(e) => setPreviewData(prev => ({ ...prev, message: e.target.value }))}
                  disabled={isSending}
                  rows={20}
                />
              </div>
            </div>

            <div className="bie-modal-footer">
              <button
                className="bie-btn-cancel"
                onClick={() => setShowPreview(false)}
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                className="bie-btn-send"
                onClick={handleSendEmail}
                disabled={isSending || generatingIntro || generatingTearSheet}
              >
                {isSending ? "Sending..." : generatingIntro || generatingTearSheet ? "Generating PDFs..." : "✉ Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paper */}
      <div className="bie-paper">
        {/* Header band */}
        <div className="bie-email-header">
          <div>
            <div className="bie-email-wordmark">Forhemit</div>
            <div className="bie-email-tagline">Transition Stewardship</div>
          </div>
          <div className="bie-email-category">Broker Introduction</div>
        </div>
        <div className="bie-brass-rule"></div>

        {/* Meta / addressing strip */}
        <div className="bie-meta-strip">
          <div className="bie-meta-item">
            <span className="bie-meta-label">First</span>
            <EditableField
              value={formData.brokerFirstName}
              onChange={(v) => updateField("brokerFirstName", v)}
              placeholder="First name"
              className="bie-name-field"
            />
          </div>
          <div className="bie-meta-item">
            <span className="bie-meta-label">Last</span>
            <EditableField
              value={formData.brokerLastName}
              onChange={(v) => updateField("brokerLastName", v)}
              placeholder="Last name"
              className="bie-name-field"
            />
          </div>
          <div className="bie-meta-item">
            <span className="bie-meta-label">Firm</span>
            <EditableField
              value={formData.brokerFirm}
              onChange={(v) => updateField("brokerFirm", v)}
              placeholder="Brokerage / firm name"
              className="bie-firm-field"
            />
          </div>
          <div className="bie-meta-item">
            <span className="bie-meta-label">Market</span>
            <EditableField
              value={formData.brokerMarket}
              onChange={(v) => updateField("brokerMarket", v)}
              placeholder="City / region"
              className="bie-city-field"
            />
          </div>
          <div className="bie-meta-item">
            <span className="bie-meta-label">Re</span>
            <EditableField
              value={formData.dealRef}
              onChange={(v) => updateField("dealRef", v)}
              placeholder="Deal name / reference (optional)"
              className="bie-ref-field"
            />
          </div>
          <div className="bie-meta-item bie-meta-item-email">
            <span className="bie-meta-label">Email</span>
            <EditableField
              value={formData.brokerEmail}
              onChange={(v) => updateField("brokerEmail", v)}
              placeholder="broker@email.com"
              className="bie-email-field"
              type="email"
            />
          </div>
        </div>

        {/* Body */}
        <div className="bie-email-wrap">
          <div className="bie-email-body">
            <div className="bie-para">
              Hi{" "}
              <EditableField
                value={formData.brokerFirstName}
                onChange={(v) => updateField("brokerFirstName", v)}
                placeholder="First name"
                className="bie-name-field"
              />
              ,
            </div>

            <div className="bie-para">
              <strong>I'll keep this short.</strong> Forhemit Transition Stewardship
              is actively looking for founder-owned businesses to acquire, and
              brokers are how we find them. I want to introduce us, tell you
              exactly what we're looking for, and be direct about how everyone
              gets paid.
            </div>

            <div className="bie-para">
              What makes us different from the PE firms and strategic buyers in
              your deal flow: <strong>the company buys itself.</strong> The
              seller exits at fair market value. The employees become the owners.
              The business stays in the community it was built in.
            </div>

            <div className="bie-sec-divider"></div>
            <span className="bie-sec-label-inline">What We're Looking For</span>

            <ul className="bie-bullet-list">
              <li>
                <strong>EBITDA of $3M – $15M</strong>
              </li>
              <li>20 or more W-2 employees</li>
              <li>Any industry — we are generalist buyers</li>
              <li>
                Primary markets: <strong>Florida, Texas, Tennessee</strong> —
                other states considered
              </li>
              <li>
                C-corp preferred; S-corp deals require a pre-close conversion we
                coordinate
              </li>
              <li>Founder-led, consistent 3+ year financial history, exit in 1–3 years</li>
            </ul>

            <div className="bie-para">
              If you have a listing that fits, send it. If you're not sure, send
              it anyway — we confirm fit within 48 hours and give you a clear yes
              or no.
            </div>

            <div className="bie-sec-divider"></div>
            <span className="bie-sec-label-inline">What We Bring</span>

            <ul className="bie-bullet-list">
              <li>Fully vetted partners (Lenders, Trustees, ERISA Counsel) ready to go</li>
              <li>120-day closing roadmap</li>
              <li>Fully protected commission</li>
              <li>Seller gets full fair market value</li>
              <li>We do not appear on the closing documents</li>
            </ul>

            <div className="bie-sec-divider"></div>
            <span className="bie-sec-label-inline">How Everyone Gets Paid</span>

            <div className="bie-pay-grid">
              <div className="bie-pay-block bie-broker">
                <div className="bie-pay-who bie-broker">Broker</div>
                <div className="bie-pay-detail">
                  Your commission is paid at closing from proceeds — same rate as
                  any other buyer. We do not renegotiate, defer, or share your
                  fee. Existing agreements with the seller are honored.
                </div>
              </div>
              <div className="bie-pay-block bie-seller">
                <div className="bie-pay-who bie-seller">Seller</div>
                <div className="bie-pay-detail">
                  The seller receives their full negotiated purchase price.
                  Approximately 75% arrives as cash at close; the remaining 25%
                  is a seller note with a mandatory refinance trigger at months
                  14–18.{" "}
                  <strong>
                    Forhemit does not appear as a line item on the seller's
                    closing statement
                  </strong>{" "}
                  — our fee does not reduce the seller's proceeds.
                </div>
              </div>
              <div className="bie-pay-block bie-forhemit">
                <div className="bie-pay-who bie-forhemit">Forhemit Transition Stewardship</div>
                <div className="bie-pay-detail">
                  We are paid by the ESOP trust — the buyer entity — as a{" "}
                  <strong>tax-deductible business expense</strong>. A structuring
                  retainer ($25,000, earned at engagement) plus a transaction fee
                  at closing. We do not take equity. We are never the buyer. We
                  do not appear on anyone's closing statement.
                </div>
              </div>
            </div>

            <div className="bie-sec-divider"></div>
            <span className="bie-sec-label-inline">
              Why the Seller Takes a Second Look — $3M EBITDA Example
            </span>

            <div
              className="bie-para bie-footnote"
              style={{ marginBottom: "0.5rem" }}
            >
              The headline number will be at fair market value, not a PE premium.
              Here is what the comparison looks like after tax:
            </div>

            <div className="bie-deal-table-wrap">
              <table className="bie-deal-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>PE / Conv. Buyer</th>
                    <th className="bie-esop-head">Forhemit ESOP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Valuation multiple</td>
                    <td>6.0× EBITDA</td>
                    <td className="bie-esop-col">4.5× EBITDA</td>
                  </tr>
                  <tr className="bie-subtotal">
                    <td>Gross purchase price</td>
                    <td>$18,000,000</td>
                    <td className="bie-esop-col">$13,500,000</td>
                  </tr>
                  <tr>
                    <td>Broker commission (5%)</td>
                    <td style={{ color: "var(--bie-red)" }}>− $900,000</td>
                    <td className="bie-esop-col" style={{ color: "var(--bie-red)" }}>
                      − $675,000
                    </td>
                  </tr>
                  <tr className="bie-subtotal">
                    <td>Net of broker</td>
                    <td>$17,100,000</td>
                    <td className="bie-esop-col">$12,825,000</td>
                  </tr>
                  <tr className="bie-tax-row">
                    <td>Federal cap gains (23.8%)</td>
                    <td>− $4,069,800</td>
                    <td className="bie-esop-col">$0 (§1042 election)</td>
                  </tr>
                  <tr className="bie-tax-row">
                    <td>Florida state income tax</td>
                    <td style={{ color: "var(--bie-muted)" }}>$0</td>
                    <td className="bie-esop-col">$0</td>
                  </tr>
                  <tr className="bie-winner">
                    <td>Seller walks with</td>
                    <td>$13,030,200</td>
                    <td className="bie-esop-col">$12,825,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bie-win-note">
              PE wins by only $205,200 after tax — on a $4,500,000 higher
              headline price.
            </div>

            <div className="bie-callout" style={{ marginTop: "0.7rem" }}>
              <p>
                That $205,200 PE advantage assumes the seller collects every
                dollar as stated. In practice, PE deals at this size typically
                include <strong>earn-outs tied to post-close performance</strong>{" "}
                and <strong>restrictive covenants</strong> that constrain the
                seller for 2–5 years. The Forhemit seller note carries{" "}
                <strong>
                  no earn-outs, no performance conditions, and no restrictive
                  covenants
                </strong>{" "}
                — just a fixed obligation with a mandatory refinance trigger at
                months 14–18. The PE number is a ceiling. The ESOP number is a
                floor.
              </p>
            </div>

            <div className="bie-footnote" style={{ marginTop: "0.5rem" }}>
              Assumes C-corp seller, zero cost basis, full §1042 election,
              Florida domicile. ESOP proceeds: ~$10.1M cash at close + ~$3.4M
              seller note (mandatory refinance trigger Mo. 14–18). Seller's CPA
              must model actual basis and confirm §1042 eligibility. Not tax or
              legal advice.
            </div>

            <div className="bie-sec-divider"></div>
            <span className="bie-sec-label-inline">How It Works</span>

            <div className="bie-para">
              Forhemit Transition Stewardship coordinates the full deal team —
              SBA lender, ESOP trustee, ERISA counsel, TPA, and appraiser. We
              manage the process from intake through closing across a structured
              120-day timeline. The owner runs the business. We run the deal.
            </div>

            <div className="bie-para">
              After closing, we remain engaged 12–24 months to protect the
              seller's note and ensure the operational transition is real — not
              just a filing. A conventional buyer closes with a transaction. We
              close with a transition.
            </div>

            <div className="bie-callout">
              <p>
                <strong>
                  Forhemit does not appear as a line item in the seller's closing
                  documents.
                </strong>{" "}
                Our fee is paid by the ESOP trust as a tax-deductible business
                expense. The seller receives their full purchase price. The
                broker receives their full commission from proceeds. Neither
                number is adjusted, reduced, or deferred by our engagement.
              </p>
            </div>

            <div className="bie-sec-divider"></div>
            <span className="bie-sec-label-inline">One Honest Disclosure</span>

            <div className="bie-para">
              Forhemit Transition Stewardship is completing its first
              transaction. Our credential is not a closed deal count — it is a
              pre-positioned deal team, a lender-validated process structure,
              and a 120-day roadmap with hard gates at every milestone. We do
              not ask a seller to sign anything they have not reviewed with
              their own counsel.
            </div>

            <div className="bie-para">
              If you have something that might fit — or want to understand the
              structure before bringing it to a seller — I am glad to spend 20
              minutes on the phone. <strong>Tear sheet attached.</strong>
            </div>
          </div>
        </div>

        {/* Signature block */}
        <div className="bie-sig-block">
          <div className="bie-sig-name">
            <EditableField
              value={formData.senderName}
              onChange={(v) => updateField("senderName", v)}
              placeholder="Your full name"
              className="bie-sender-name"
            />
          </div>
          <div className="bie-sig-meta" style={{ marginTop: "0.3rem" }}>
            <EditableField
              value={formData.senderTitle}
              onChange={(v) => updateField("senderTitle", v)}
              placeholder="Title / role"
              className="bie-sender-title"
            />
            &nbsp;·&nbsp; Forhemit Transition Stewardship
          </div>
          <div className="bie-sig-meta" style={{ marginTop: "0.2rem" }}>
            <EditableField
              value={formData.senderEmail}
              onChange={(v) => updateField("senderEmail", v)}
              placeholder="your@forhemit.com"
              className="bie-sender-email"
              type="email"
            />
            &nbsp;·&nbsp;
            <EditableField
              value={formData.senderPhone}
              onChange={(v) => updateField("senderPhone", v)}
              placeholder="Phone"
              className="bie-sender-phone"
            />
            &nbsp;·&nbsp; forhemit.com
          </div>
        </div>
      </div>
    </div>
  );
}
