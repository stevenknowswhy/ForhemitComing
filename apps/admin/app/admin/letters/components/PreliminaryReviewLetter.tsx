"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import "./PreliminaryReviewLetter.css";

// ── Types ───────────────────────────────────────────────

interface FormData {
	firstName: string;
	companyName: string;
	brokerFirstName: string;
	brokerLastName: string;
	valuationAmount: string;
	senderFirstName: string;
	senderLastName: string;
	senderTitle: string;
	senderCompany: string;
	senderEmail: string;
	senderPhone: string;
}

const DEFAULT_DATA: FormData = {
	firstName: "",
	companyName: "",
	brokerFirstName: "",
	brokerLastName: "",
	valuationAmount: "",
	senderFirstName: "Stefano",
	senderLastName: "Stokes",
	senderTitle: "Senior Managing Partner",
	senderCompany: "Forhemit Transition Stewardship",
	senderEmail: "stefano.stokes@forhemit.com",
	senderPhone: "424-253-4019",
};

// ── Helpers ─────────────────────────────────────────────

function todayFormatted() {
	return new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

// ── PDF HTML (inline styles for Puppeteer) ──────────────

function buildPdfHtml(d: FormData, date: string) {
	const company = d.companyName || "[Company Name]";
	const broker =
		[d.brokerFirstName, d.brokerLastName].filter(Boolean).join(" ") ||
		"[Broker Name]";
	const valuation = d.valuationAmount || "$XX million";

	return `
<div style="font-family: 'Cormorant Garamond', Georgia, serif; background: #F8F5EF; color: #1C1510; margin: 0; padding: 0;">

  <!-- Letterhead -->
  <div style="background: #1A2238; padding: 1.5rem 2.6rem 1.3rem; display: flex; align-items: flex-end; justify-content: space-between;">
    <div>
      <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.6rem; font-weight: 300; letter-spacing: 0.26em; text-transform: uppercase; color: #F8F5EF; line-height: 1; margin-bottom: 0.22rem;">Forhemit</div>
      <div style="font-size: 0.58rem; font-weight: 300; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(248,245,239,0.38);">Transition Stewardship</div>
    </div>
    <div style="font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: #B89060; border: 1px solid rgba(184,144,96,0.4); padding: 0.2rem 0.55rem;">Preliminary Review</div>
  </div>
  <div style="height: 2px; background: linear-gradient(90deg, #9A7540 0%, #B89060 55%, transparent 100%);"></div>

  <!-- Meta Strip -->
  <div style="padding: 1.6rem 2.6rem 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0 2rem; align-items: start;">
    <div style="font-size: 0.75rem; color: #7A7060; letter-spacing: 0.05em;">${date}</div>
    <div style="font-size: 0.63rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #9A7540; padding-top: 0.6rem; margin-top: 0.5rem; border-top: 1px solid #D4CBBF;">RE: Initial Review and Alignment for <span style="color: #1A2238; font-weight: 500; text-transform: none; letter-spacing: normal; font-size: 0.85rem; font-family: 'Jost', system-ui, sans-serif;">${company}</span></div>
    <div style="grid-column: 1 / -1; height: 1px; background: #D4CBBF; margin-top: 1.2rem;"></div>
  </div>

  <!-- Body -->
  <div style="display: grid; grid-template-columns: 160px 1fr;">

    <!-- Our Role -->
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 160px 1fr; border-top: 1px solid #D4CBBF; margin-top: 0.2rem;">
      <div style="padding: 1.5rem 1.2rem 1.5rem 2.6rem; border-right: 1px solid #D4CBBF;">
        <span style="font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #9A7540;">Our Role</span>
        <p style="font-size: 0.7rem; font-weight: 300; color: #7A7060; line-height: 1.55; margin-top: 0.55rem; font-style: italic;">We are not the buyer. We are the facilitator.</p>
      </div>
      <div style="padding: 1.5rem 2.6rem 1.5rem 1.6rem;">
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0.9rem;">This letter is meant to do one thing: give you a clear, practical picture of where we believe <strong>${company}</strong> stands today and how a Forhemit engagement would work.</p>
        <div style="background: #EDE8DF; border-left: 3px solid #9A7540; padding: 0.9rem 1.1rem; margin: 0.8rem 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.05rem; font-weight: 400; color: #1A2238; line-height: 1.5; font-style: italic;">&ldquo;Forhemit is not acting as the buyer of your business &mdash; our role is to facilitate a fair, credible, and defensible purchase price and employee stock offering.&rdquo;</div>
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0;">We often describe the structure as a private IPO: ownership moves to the employees who helped build the company, while leadership, culture, and operations remain steady. Our incentives are tied to the success of the transition, not to moving the final price up or down.</p>
      </div>
    </div>

    <!-- Initial Valuation -->
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 160px 1fr; border-top: 1px solid #D4CBBF; margin-top: 0.2rem;">
      <div style="padding: 1.5rem 1.2rem 1.5rem 2.6rem; border-right: 1px solid #D4CBBF;">
        <span style="font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #9A7540;">Initial Valuation</span>
        <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; font-weight: 300; color: #1A2238; line-height: 1; margin-top: 0.5rem; display: block;">${valuation}</span>
        <span style="font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase; color: #7A7060; margin-top: 0.2rem; display: block;">Preliminary estimate</span>
        <p style="font-size: 0.7rem; font-weight: 300; color: #7A7060; line-height: 1.55; margin-top: 0.55rem; font-style: italic;">Final price set by independent FMV appraisal.</p>
      </div>
      <div style="padding: 1.5rem 2.6rem 1.5rem 1.6rem;">
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0.9rem;">After weeks of discussing your company with <strong>${broker}</strong> and conducting our own internal review, we anticipate a preliminary starting valuation of approximately <strong>${valuation}</strong>.</p>
        <div style="list-style: none; margin: 0.5rem 0; padding: 0;">
          <div style="display: flex; gap: 0.75rem; padding: 0.5rem 0; font-size: 0.86rem; line-height: 1.65; color: #1C1510; border-bottom: 1px solid rgba(212,203,191,0.4); border-top: 1px solid rgba(212,203,191,0.4);"><span style="color: #9A7540; font-weight: 600; flex-shrink: 0;">&mdash;</span>This is not a formal valuation and not the final purchase price</div>
          <div style="display: flex; gap: 0.75rem; padding: 0.5rem 0; font-size: 0.86rem; line-height: 1.65; color: #1C1510; border-bottom: 1px solid rgba(212,203,191,0.4);"><span style="color: #9A7540; font-weight: 600; flex-shrink: 0;">&mdash;</span>The official price is set by an independent, third-party FMV appraisal</div>
          <div style="display: flex; gap: 0.75rem; padding: 0.5rem 0; font-size: 0.86rem; line-height: 1.65; color: #1C1510;"><span style="color: #9A7540; font-weight: 600; flex-shrink: 0;">&mdash;</span>You review the FMV determination before deciding whether to proceed</div>
        </div>
      </div>
    </div>

    <!-- Fee Structure -->
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 160px 1fr; border-top: 1px solid #D4CBBF; margin-top: 0.2rem;">
      <div style="padding: 1.5rem 1.2rem 1.5rem 2.6rem; border-right: 1px solid #D4CBBF;">
        <span style="font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #9A7540;">Fee Structure</span>
        <p style="font-size: 0.7rem; font-weight: 300; color: #7A7060; line-height: 1.55; margin-top: 0.55rem; font-style: italic;">Milestone-tied. We only earn when you reach defined checkpoints.</p>
      </div>
      <div style="padding: 1.5rem 2.6rem 1.5rem 1.6rem;">
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0.9rem;">We believe our compensation should be tied to meaningful progress and successful outcomes. After an initial retainer, remaining fees are tied directly to specific milestones:</p>
        <div style="list-style: none; margin: 0.5rem 0; padding: 0;">
          <div style="display: flex; gap: 0.85rem; align-items: baseline; padding: 0.6rem 0; border-bottom: 1px solid rgba(212,203,191,0.55); border-top: 1px solid rgba(212,203,191,0.55); font-size: 0.86rem; line-height: 1.6; color: #1C1510;"><span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; font-weight: 600; color: #9A7540; min-width: 1.2rem;">1</span>When you approve the Fair Market Value determination letter</div>
          <div style="display: flex; gap: 0.85rem; align-items: baseline; padding: 0.6rem 0; border-bottom: 1px solid rgba(212,203,191,0.55); font-size: 0.86rem; line-height: 1.6; color: #1C1510;"><span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; font-weight: 600; color: #9A7540; min-width: 1.2rem;">2</span>When we secure a lender loan commitment acceptable to you</div>
          <div style="display: flex; gap: 0.85rem; align-items: baseline; padding: 0.6rem 0; font-size: 0.86rem; line-height: 1.6; color: #1C1510;"><span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; font-weight: 600; color: #9A7540; min-width: 1.2rem;">3</span>When the transaction successfully closes</div>
        </div>
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0;">This structure ensures that we are working toward the same goal: a successful transition that works for you, the company, and the employees who will carry it forward.</p>
      </div>
    </div>

    <!-- How We Are Paid -->
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 160px 1fr; border-top: 1px solid #D4CBBF; margin-top: 0.2rem;">
      <div style="padding: 1.5rem 1.2rem 1.5rem 2.6rem; border-right: 1px solid #D4CBBF;">
        <span style="font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #9A7540;">How We Are Paid</span>
        <p style="font-size: 0.7rem; font-weight: 300; color: #7A7060; line-height: 1.55; margin-top: 0.55rem; font-style: italic;">Company pays as a business expense &mdash; not deducted from your proceeds.</p>
      </div>
      <div style="padding: 1.5rem 2.6rem 1.5rem 1.6rem;">
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0.9rem;">Because Forhemit is providing transition and stewardship services, our fees are paid by the company as a business expense, subject to review by your tax and legal advisors.</p>
        <div style="list-style: none; margin: 0.5rem 0; padding: 0;">
          <div style="display: flex; gap: 0.85rem; align-items: baseline; padding: 0.6rem 0; border-bottom: 1px solid rgba(212,203,191,0.55); border-top: 1px solid rgba(212,203,191,0.55); font-size: 0.86rem; line-height: 1.6; color: #1C1510;"><span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; font-weight: 600; color: #9A7540; min-width: 1.2rem;">1</span>Our fees are <strong>not deducted</strong> from the amount you receive at closing</div>
          <div style="display: flex; gap: 0.85rem; align-items: baseline; padding: 0.6rem 0; border-bottom: 1px solid rgba(212,203,191,0.55); font-size: 0.86rem; line-height: 1.6; color: #1C1510;"><span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; font-weight: 600; color: #9A7540; min-width: 1.2rem;">2</span>Forhemit is not the buyer and is not reducing your purchase price</div>
          <div style="display: flex; gap: 0.85rem; align-items: baseline; padding: 0.6rem 0; font-size: 0.86rem; line-height: 1.6; color: #1C1510;"><span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; font-weight: 600; color: #9A7540; min-width: 1.2rem;">3</span>You retain the ability to consider outside offers while building a credible employee-ownership path &mdash; real optionality, not a closed process</div>
        </div>
      </div>
    </div>

    <!-- Closing -->
    <div style="grid-column: 1 / -1; padding: 1.8rem 5.2rem 1.6rem; font-size: 0.88rem; color: #1C1510; border-top: 1px solid #D4CBBF; line-height: 1.8;">
      We would welcome the opportunity to review this framework with you and answer any questions. If it feels aligned with your goals, the next step would be a brief call to discuss timing, priorities, and what would be needed to move forward.
    </div>
  </div>

  <!-- Signature -->
  <div style="border-top: 2px solid #D4CBBF; padding: 1.3rem 2.6rem 1.5rem; background: #EDE8DF; display: flex; align-items: flex-start; justify-content: space-between; gap: 2rem;">
    <div>
      <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.15rem; font-weight: 400; color: #1A2238; margin-bottom: 0.2rem;">${d.senderFirstName} ${d.senderLastName}</div>
      <div style="font-size: 0.7rem; font-weight: 300; color: #7A7060; line-height: 1.75;">${d.senderTitle} &middot; ${d.senderCompany}<br>A California Public Benefit Corporation</div>
    </div>
    <div style="font-size: 0.68rem; font-weight: 300; color: #7A7060; line-height: 1.9; text-align: right;">
      <a href="mailto:${d.senderEmail}" style="color: #9A7540; text-decoration: none;">${d.senderEmail}</a><br>${d.senderPhone}<br>forhemit.com
    </div>
  </div>

</div>`;
}

// ── Email body (plain text) ─────────────────────────────

function buildEmailBody(d: FormData) {
	const firstName = d.firstName || "[First Name]";
	const company = d.companyName || "[Company Name]";
	const valuation = d.valuationAmount || "$XX million";

	return `Initial Review and Alignment for ${company}

${firstName},

This letter is meant to do one thing: give you a clear, practical picture of where we believe ${company} stands today and how a Forhemit engagement would work.

An important distinction at the outset: Forhemit is not acting as the buyer of your business.

OUR ROLE
Our role is to facilitate a fair, credible, and defensible purchase price and employee stock offering. We often describe the structure as a private IPO: ownership moves to the employees who helped build the company, while leadership, culture, and operations remain steady.

INITIAL VALUATION
We anticipate a preliminary starting valuation of approximately ${valuation}. This is not a formal valuation — the official price is set by an independent, third-party FMV appraisal. You review the FMV determination before deciding whether to proceed.

FEE STRUCTURE
After an initial retainer, remaining fees are tied to specific milestones:
1. When you approve the Fair Market Value determination letter
2. When we secure a lender loan commitment acceptable to you
3. When the transaction successfully closes

HOW WE ARE PAID
Our fees are paid by the company as a business expense, subject to review by your tax and legal advisors.
- Our fees are not deducted from the amount you receive at closing
- Forhemit is not the buyer and is not reducing your purchase price
- You retain the ability to consider outside offers while building a credible employee-ownership path

We would welcome the opportunity to review this framework with you and answer any questions.

${d.senderFirstName} ${d.senderLastName}
${d.senderTitle}
${d.senderCompany}`;
}

// ── Component ───────────────────────────────────────────

interface LetterProps {
	companyId?: string;
	companyStage?: string;
}

export default function PreliminaryReviewLetter({
	companyId,
	companyStage,
}: LetterProps) {
	const [formData, _setFormData] = useState<FormData>(DEFAULT_DATA);
	const [isSending, setIsSending] = useState(false);
	const [sendStatus, setSendStatus] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [previewTo, setPreviewTo] = useState("");
	const [previewSubject, setPreviewSubject] = useState("");
	const [previewMessage, setPreviewMessage] = useState("");
	const [pdfBase64, setPdfBase64] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);

	const sendEmail = useAction(api.clientEmails.sendPreliminaryReviewEmail);
	const uploadToBox = useAction(api.box.uploadDealDocument);

	const today = todayFormatted();
	const company = formData.companyName || "[Company Name]";

	// ── Generate PDF ──────────────────────────────────────

	const handleGeneratePdf = async () => {
		setIsGenerating(true);
		try {
			const htmlContent = buildPdfHtml(formData, today);
			const res = await fetch("/api/pdf-generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					templateName: "Preliminary-Review-Letter",
					htmlContent,
					cssContent: "",
					formData,
				}),
			});
			if (!res.ok) throw new Error(`PDF failed: ${await res.text()}`);
			const blob = await res.blob();
			const base64 = await new Promise<string>((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(blob);
			});
			setPdfBase64(base64);
			setSendStatus("PDF generated");
		} catch (err) {
			console.error("PDF error:", err);
			setSendStatus("Failed to generate PDF");
			setPdfBase64("");
		} finally {
			setIsGenerating(false);
		}
	};

	// ── Open Preview Modal ────────────────────────────────

	const handleOpenModal = async () => {
		setPreviewSubject(`Initial Review and Alignment for ${company}`);
		setPreviewMessage(buildEmailBody(formData));
		setShowModal(true);
		setSendStatus(null);
		if (!pdfBase64) {
			await handleGeneratePdf();
		}
	};

	// ── Send Email ────────────────────────────────────────

	const handleSend = async () => {
		if (!previewTo) {
			setSendStatus("Please enter a recipient email");
			return;
		}
		setIsSending(true);
		setSendStatus("Sending...");
		try {
			const result = await sendEmail({
				to: previewTo,
				firstName: formData.firstName,
				companyName: formData.companyName,
				brokerFirstName: formData.brokerFirstName,
				brokerLastName: formData.brokerLastName,
				valuationAmount: formData.valuationAmount,
				senderFirstName: formData.senderFirstName,
				senderLastName: formData.senderLastName,
				senderTitle: formData.senderTitle,
				senderCompany: formData.senderCompany,
				senderEmail: formData.senderEmail,
				senderPhone: formData.senderPhone,
				subject: previewSubject,
				customMessage: previewMessage,
				pdfBase64: pdfBase64 || undefined,
			});
			if (result.success) {
				setSendStatus("Email sent successfully!");
				setShowModal(false);
				setTimeout(() => setSendStatus(null), 5000);
			} else {
				setSendStatus(
					`Failed: ${result.email?.error || result.telegram?.error || "Unknown error"}`,
				);
			}
		} catch (err) {
			console.error("Send error:", err);
			setSendStatus("Failed to send email");
		} finally {
			setIsSending(false);
		}
	};

	// ── Save to Box ────────────────────────────────────────

	const [isSavingToBox, setIsSavingToBox] = useState(false);

	const handleSaveToBox = async () => {
		if (!companyId) return;
		if (!pdfBase64) {
			await handleGeneratePdf();
		}
		if (!pdfBase64) return;

		setIsSavingToBox(true);
		setSendStatus("Saving to Box...");
		try {
			const base64Content = pdfBase64.split(",")[1] || pdfBase64;
			const fileName = `Forhemit-Preliminary-Review-${formData.companyName || "Company"}.pdf`;

			await uploadToBox({
				companyId: companyId as any,
				stage: companyStage || "First contact",
				fileName,
				contentBase64: base64Content,
			});

			setSendStatus("Saved to Box!");
			setTimeout(() => setSendStatus(null), 5000);
		} catch (err) {
			console.error("Box upload error:", err);
			setSendStatus("Failed to save to Box");
		} finally {
			setIsSavingToBox(false);
		}
	};

	// ── Render ────────────────────────────────────────────

	return (
		<div className="prl-container">
			{/* ── App Header ── */}
			<div className="prl-app-header">
				<div>
					<div className="prl-app-wordmark">Forhemit</div>
					<div className="prl-app-sub">Preliminary Review Letter</div>
				</div>
				<div className="prl-header-actions">
					{sendStatus && (
						<span
							className={`prl-status ${sendStatus.includes("success") ? "success" : sendStatus.includes("Failed") ? "error" : ""}`}
						>
							{sendStatus}
						</span>
					)}
					<button
						className="prl-btn prl-btn-print"
						onClick={() => window.print()}
					>
						⎙ Print / PDF
					</button>
					<button
						className="prl-btn prl-btn-send"
						onClick={handleOpenModal}
						disabled={isSending}
					>
						{isSending ? "Preparing…" : "✉ Preview & Send"}
					</button>
				</div>
			</div>

			{/* ── Letter ── */}
			<div className="prl-paper">
				<div className="prl-header">
					<div>
						<div className="prl-wordmark">Forhemit</div>
						<div className="prl-tagline">Transition Stewardship</div>
					</div>
					<div className="prl-category">Preliminary Review</div>
				</div>
				<div className="prl-brass-rule" />

				<div className="prl-meta">
					<div className="prl-date">{today}</div>
					<div className="prl-re">
						RE: Initial Review and Alignment for <strong>{company}</strong>
					</div>
					<div className="prl-meta-rule" />
				</div>

				<div className="prl-body">
					{/* Our Role */}
					<div className="prl-section">
						<div className="prl-rail">
							<span className="prl-rail-label">Our Role</span>
							<p className="prl-rail-note">
								We are not the buyer. We are the facilitator.
							</p>
						</div>
						<div className="prl-content">
							<p className="prl-para">
								This letter is meant to do one thing: give you a clear,
								practical picture of where we believe <strong>{company}</strong>{" "}
								stands today and how a Forhemit engagement would work.
							</p>
							<div className="prl-callout">
								&ldquo;Forhemit is not acting as the buyer of your business
								&mdash; our role is to facilitate a fair, credible, and
								defensible purchase price and employee stock offering.&rdquo;
							</div>
							<p className="prl-para">
								We often describe the structure as a private IPO: ownership
								moves to the employees who helped build the company, while
								leadership, culture, and operations remain steady. Our
								incentives are tied to the success of the transition, not to
								moving the final price up or down.
							</p>
						</div>
					</div>

					{/* Initial Valuation */}
					<div className="prl-section">
						<div className="prl-rail">
							<span className="prl-rail-label">Initial Valuation</span>
							<span className="prl-rail-number">
								{formData.valuationAmount || "$20M"}
							</span>
							<span className="prl-rail-number-label">
								Preliminary estimate
							</span>
							<p className="prl-rail-note">
								Final price set by independent FMV appraisal.
							</p>
						</div>
						<div className="prl-content">
							<p className="prl-para">
								After weeks of discussing your company with{" "}
								<strong>
									{formData.brokerFirstName
										? `${formData.brokerFirstName} ${formData.brokerLastName}`
										: "[Broker Name]"}
								</strong>{" "}
								and conducting our own internal review, we anticipate a
								preliminary starting valuation of approximately{" "}
								<strong>{formData.valuationAmount || "$XX million"}</strong>.
							</p>
							<ul className="prl-points">
								<li>
									This is not a formal valuation and not the final purchase
									price
								</li>
								<li>
									The official price is set by an independent, third-party FMV
									appraisal
								</li>
								<li>
									You review the FMV determination before deciding whether to
									proceed
								</li>
							</ul>
						</div>
					</div>

					{/* Fee Structure */}
					<div className="prl-section">
						<div className="prl-rail">
							<span className="prl-rail-label">Fee Structure</span>
							<p className="prl-rail-note">
								Milestone-tied. We only earn when you reach defined checkpoints.
							</p>
						</div>
						<div className="prl-content">
							<p className="prl-para">
								We believe our compensation should be tied to meaningful
								progress and successful outcomes. After an initial retainer,
								remaining fees are tied directly to specific milestones:
							</p>
							<ol className="prl-milestones">
								<li>
									<span className="prl-milestone-num">1</span>When you approve
									the Fair Market Value determination letter
								</li>
								<li>
									<span className="prl-milestone-num">2</span>When we secure a
									lender loan commitment acceptable to you
								</li>
								<li>
									<span className="prl-milestone-num">3</span>When the
									transaction successfully closes
								</li>
							</ol>
							<p className="prl-para">
								This structure ensures that we are working toward the same goal:
								a successful transition that works for you, the company, and the
								employees who will carry it forward.
							</p>
						</div>
					</div>

					{/* How We Are Paid */}
					<div className="prl-section">
						<div className="prl-rail">
							<span className="prl-rail-label">How We Are Paid</span>
							<p className="prl-rail-note">
								Company pays as a business expense — not deducted from your
								proceeds.
							</p>
						</div>
						<div className="prl-content">
							<p className="prl-para">
								Because Forhemit is providing transition and stewardship
								services, our fees are paid by the company as a business
								expense, subject to review by your tax and legal advisors.
							</p>
							<ol className="prl-milestones">
								<li>
									<span className="prl-milestone-num">1</span>Our fees are{" "}
									<strong>not deducted</strong> from the amount you receive at
									closing
								</li>
								<li>
									<span className="prl-milestone-num">2</span>Forhemit is not
									the buyer and is not reducing your purchase price
								</li>
								<li>
									<span className="prl-milestone-num">3</span>You retain the
									ability to consider outside offers while building a credible
									employee-ownership path — real optionality, not a closed
									process
								</li>
							</ol>
						</div>
					</div>

					<div className="prl-closing">
						We would welcome the opportunity to review this framework with you
						and answer any questions. If it feels aligned with your goals, the
						next step would be a brief call to discuss timing, priorities, and
						what would be needed to move forward.
					</div>
				</div>

				<div className="prl-sig">
					<div>
						<div className="prl-sig-name">
							{formData.senderFirstName} {formData.senderLastName}
						</div>
						<div className="prl-sig-meta">
							{formData.senderTitle} · {formData.senderCompany}
							<br />A California Public Benefit Corporation
						</div>
					</div>
					<div className="prl-sig-contact">
						<a href={`mailto:${formData.senderEmail}`}>
							{formData.senderEmail}
						</a>
						<br />
						{formData.senderPhone}
						<br />
						forhemit.com
					</div>
				</div>
			</div>

			{/* ── Preview & Send Modal ── */}
			{showModal && (
				<div
					className="prl-modal-overlay"
					onClick={() => !isSending && setShowModal(false)}
				>
					<div className="prl-modal" onClick={(e) => e.stopPropagation()}>
						<div className="prl-modal-header">
							<h2>Preview & Send</h2>
							<button
								className="prl-modal-close"
								onClick={() => setShowModal(false)}
								disabled={isSending}
							>
								✕
							</button>
						</div>
						<div className="prl-modal-body">
							<div className="prl-field">
								<label>To</label>
								<input
									type="email"
									value={previewTo}
									onChange={(e) => setPreviewTo(e.target.value)}
									placeholder="client@email.com"
									disabled={isSending}
								/>
							</div>
							<div className="prl-field">
								<label>Subject</label>
								<input
									type="text"
									value={previewSubject}
									onChange={(e) => setPreviewSubject(e.target.value)}
									disabled={isSending}
								/>
							</div>
							<div className="prl-field">
								<label>Message</label>
								<textarea
									value={previewMessage}
									onChange={(e) => setPreviewMessage(e.target.value)}
									rows={16}
									disabled={isSending}
								/>
							</div>
							<div
								style={{
									fontSize: "0.75rem",
									color: "var(--prl-muted)",
									marginTop: "0.5rem",
								}}
							>
								{isGenerating
									? "⏳ Generating PDF…"
									: pdfBase64
										? "✅ PDF attached"
										: "PDF will be generated on send"}
							</div>
						</div>
						<div className="prl-modal-footer">
							<button
								className="prl-btn prl-btn-print"
								onClick={() => setShowModal(false)}
								disabled={isSending}
							>
								Cancel
							</button>
							{companyId && (
								<button
									className="prl-btn prl-btn-print"
									onClick={handleSaveToBox}
									disabled={isSavingToBox || isGenerating}
								>
									{isSavingToBox ? "Saving…" : "📁 Save to Box"}
								</button>
							)}
							<button
								className="prl-btn prl-btn-send"
								onClick={handleSend}
								disabled={isSending || isGenerating}
							>
								{isSending
									? "Sending…"
									: isGenerating
										? "Generating…"
										: "✉ Send Email"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
