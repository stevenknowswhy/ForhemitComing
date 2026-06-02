"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import "./ClientIntroductionLetter.css";

// ── Types ───────────────────────────────────────────────

interface FormData {
	firstName: string;
	senderFirstName: string;
	senderLastName: string;
	senderTitle: string;
	senderCompany: string;
	senderEmail: string;
	senderPhone: string;
}

const DEFAULT_DATA: FormData = {
	firstName: "",
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
	return `
<div style="font-family: 'Cormorant Garamond', Georgia, serif; background: #F8F5EF; color: #1C1510; margin: 0; padding: 0;">

  <!-- Letterhead -->
  <div style="background: #1A2238; padding: 1.5rem 2.6rem 1.3rem; display: flex; align-items: flex-end; justify-content: space-between;">
    <div>
      <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.6rem; font-weight: 300; letter-spacing: 0.26em; text-transform: uppercase; color: #F8F5EF; line-height: 1; margin-bottom: 0.22rem;">Forhemit</div>
      <div style="font-size: 0.58rem; font-weight: 300; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(248,245,239,0.38);">Transition Stewardship</div>
    </div>
    <div style="font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: #B89060; border: 1px solid rgba(184,144,96,0.4); padding: 0.2rem 0.55rem;">Introduction</div>
  </div>
  <div style="height: 2px; background: linear-gradient(90deg, #9A7540 0%, #B89060 55%, transparent 100%);"></div>

  <!-- Meta Strip -->
  <div style="padding: 1.6rem 2.6rem 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0 2rem; align-items: start;">
    <div style="font-size: 0.75rem; color: #7A7060; letter-spacing: 0.05em;">${date}</div>
    <div style="font-size: 0.63rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #9A7540; padding-top: 0.6rem; margin-top: 0.5rem; border-top: 1px solid #D4CBBF;">RE: An Introduction to Forhemit Transition Stewardship</div>
    <div style="grid-column: 1 / -1; height: 1px; background: #D4CBBF; margin-top: 1.2rem;"></div>
  </div>

  <!-- Body -->
  <div style="display: grid; grid-template-columns: 160px 1fr;">

    <!-- Your Story -->
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 160px 1fr; border-top: 1px solid #D4CBBF; margin-top: 0.2rem;">
      <div style="padding: 1.5rem 1.2rem 1.5rem 2.6rem; border-right: 1px solid #D4CBBF;">
        <span style="font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #9A7540;">Your Story</span>
        <p style="font-size: 0.7rem; font-weight: 300; color: #7A7060; line-height: 1.55; margin-top: 0.55rem; font-style: italic;">Beyond the Purchase Price.</p>
      </div>
      <div style="padding: 1.5rem 2.6rem 1.5rem 1.6rem;">
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0.9rem;">Most business owners who reach this stage have spent years &mdash; sometimes decades &mdash; building something that cannot be fully captured on a spreadsheet.</p>
        <div style="background: #EDE8DF; border-left: 3px solid #9A7540; padding: 0.9rem 1.1rem; margin: 0.8rem 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.05rem; font-weight: 400; color: #1A2238; line-height: 1.5; font-style: italic;">&ldquo;The financial results are there, but they tell only part of the story.&rdquo;</div>
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0;">The team you kept together through difficult years, the reputation you built one relationship at a time, and the decisions you made when no one was watching are all part of the value you&rsquo;ve created. They deserve to be treated that way.</p>
      </div>
    </div>

    <!-- What We Do -->
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 160px 1fr; border-top: 1px solid #D4CBBF; margin-top: 0.2rem;">
      <div style="padding: 1.5rem 1.2rem 1.5rem 2.6rem; border-right: 1px solid #D4CBBF;">
        <span style="font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #9A7540;">What We Do</span>
        <p style="font-size: 0.7rem; font-weight: 300; color: #7A7060; line-height: 1.55; margin-top: 0.55rem; font-style: italic;">A private-market version of an IPO &mdash; without the unknown buyer.</p>
      </div>
      <div style="padding: 1.5rem 2.6rem 1.5rem 1.6rem;">
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0.9rem;">We help facilitate and transition a private market IPO (initial public offering) to your employees.</p>
        <div style="background: #EDE8DF; border-left: 3px solid #9A7540; padding: 0.9rem 1.1rem; margin: 0.8rem 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.05rem; font-weight: 400; color: #1A2238; line-height: 1.5; font-style: italic;">&ldquo;You receive full fair market value (FMV) for your business.&rdquo;</div>
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0;">You receive the financial benefits of a sale, but instead of transferring ownership to an unknown outside buyer, ownership passes to the employees who helped build the company. Leadership remains in place, the culture stays intact, and the business continues serving the customers and communities that helped make it successful.</p>
      </div>
    </div>

    <!-- How We Work -->
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 160px 1fr; border-top: 1px solid #D4CBBF; margin-top: 0.2rem;">
      <div style="padding: 1.5rem 1.2rem 1.5rem 2.6rem; border-right: 1px solid #D4CBBF;">
        <span style="font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #9A7540;">How We Work</span>
        <span style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; font-weight: 300; color: #1A2238; line-height: 1; margin-top: 0.5rem; display: block;">120</span>
        <span style="font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase; color: #7A7060; margin-top: 0.2rem; display: block;">Day structured timeline</span>
      </div>
      <div style="padding: 1.5rem 2.6rem 1.5rem 1.6rem;">
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0.9rem;">We operate on a structured timeline designed to create clarity and momentum without disrupting the day-to-day operation of your business.</p>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin: 0.8rem 0; border: 1px solid #D4CBBF;">
          <div style="padding: 0.75rem 0.8rem; border-right: 1px solid #D4CBBF;"><div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.4rem; font-weight: 300; color: #B89060; line-height: 1; margin-bottom: 0.2rem;">01</div><span style="font-size: 0.62rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #1A2238; display: block;">Valuation</span><span style="font-size: 0.7rem; font-weight: 300; color: #7A7060;">Independent FMV appraisal</span></div>
          <div style="padding: 0.75rem 0.8rem; border-right: 1px solid #D4CBBF;"><div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.4rem; font-weight: 300; color: #B89060; line-height: 1; margin-bottom: 0.2rem;">02</div><span style="font-size: 0.62rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #1A2238; display: block;">Financing</span><span style="font-size: 0.7rem; font-weight: 300; color: #7A7060;">Capital stack assembly</span></div>
          <div style="padding: 0.75rem 0.8rem; border-right: 1px solid #D4CBBF;"><div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.4rem; font-weight: 300; color: #B89060; line-height: 1; margin-bottom: 0.2rem;">03</div><span style="font-size: 0.62rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #1A2238; display: block;">Design</span><span style="font-size: 0.7rem; font-weight: 300; color: #7A7060;">Transaction structure</span></div>
          <div style="padding: 0.75rem 0.8rem;"><div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.4rem; font-weight: 300; color: #B89060; line-height: 1; margin-bottom: 0.2rem;">04</div><span style="font-size: 0.62rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #1A2238; display: block;">Close</span><span style="font-size: 0.7rem; font-weight: 300; color: #7A7060;">Implementation &amp; transfer</span></div>
        </div>
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0.9rem;">Throughout the engagement, you will have access to a live project dashboard that shows exactly where we are at any given time. We meet regularly to review progress, discuss upcoming milestones, and answer questions as they arise.</p>
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0;">Our job is to manage the complexity so that you can remain focused on your business, your people, and your future.</p>
      </div>
    </div>

    <!-- Why It Matters -->
    <div style="grid-column: 1 / -1; display: grid; grid-template-columns: 160px 1fr; border-top: 1px solid #D4CBBF; margin-top: 0.2rem;">
      <div style="padding: 1.5rem 1.2rem 1.5rem 2.6rem; border-right: 1px solid #D4CBBF;">
        <span style="font-size: 0.58rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #9A7540;">Why It Matters</span>
        <p style="font-size: 0.7rem; font-weight: 300; color: #7A7060; line-height: 1.55; margin-top: 0.55rem; font-style: italic;">Legacy, people, and continuity &mdash; not just the price.</p>
      </div>
      <div style="padding: 1.5rem 2.6rem 1.5rem 1.6rem;">
        <p style="font-size: 0.88rem; line-height: 1.82; color: #1C1510; margin-bottom: 0.9rem;">A business transition is rarely just a financial decision. It is a decision about people, legacy, and what happens to something you spent years building.</p>
        <div style="list-style: none; margin: 0.5rem 0; padding: 0;">
          <div style="display: flex; gap: 0.75rem; padding: 0.5rem 0; font-size: 0.86rem; line-height: 1.65; color: #1C1510; border-bottom: 1px solid rgba(212,203,191,0.4);"><span style="color: #9A7540; font-weight: 600; flex-shrink: 0;">&mdash;</span>Employees who helped build the company benefit directly from its success</div>
          <div style="display: flex; gap: 0.75rem; padding: 0.5rem 0; font-size: 0.86rem; line-height: 1.65; color: #1C1510; border-bottom: 1px solid rgba(212,203,191,0.4);"><span style="color: #9A7540; font-weight: 600; flex-shrink: 0;">&mdash;</span>Leadership, culture, and customer relationships stay intact</div>
          <div style="display: flex; gap: 0.75rem; padding: 0.5rem 0; font-size: 0.86rem; line-height: 1.65; color: #1C1510; border-bottom: 1px solid rgba(212,203,191,0.4);"><span style="color: #9A7540; font-weight: 600; flex-shrink: 0;">&mdash;</span>Communities that depend on the business are protected</div>
          <div style="display: flex; gap: 0.75rem; padding: 0.5rem 0; font-size: 0.86rem; line-height: 1.65; color: #1C1510;"><span style="color: #9A7540; font-weight: 600; flex-shrink: 0;">&mdash;</span>Your legacy is preserved &mdash; not absorbed into a portfolio</div>
        </div>
      </div>
    </div>

    <!-- Closing -->
    <div style="grid-column: 1 / -1; padding: 1.8rem 5.2rem 1.6rem; font-size: 0.88rem; color: #1C1510; border-top: 1px solid #D4CBBF; line-height: 1.8;">
      We appreciate the opportunity to introduce ourselves and would welcome a conversation to learn more about your goals and explore whether this approach may be a good fit for you and your company.
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
	const n = d.firstName || "[First Name]";
	return `An Introduction to Forhemit Transition Stewardship

${n},

Most business owners who reach this stage have spent years — sometimes decades — building something that cannot be fully captured on a spreadsheet.

The financial results are there, but they tell only part of the story. The team you kept together through difficult years, the reputation you built one relationship at a time, and the decisions you made when no one was watching are all part of the value you've created. They deserve to be treated that way.

Our firm exists for exactly this moment.

WHAT WE DO
We help facilitate and transition a private market IPO (initial public offering) to your employees. You receive full fair market value (FMV) for your business.

HOW WE WORK
We operate on a structured 120-day timeline: Valuation → Financing → Design → Close. You'll have access to a live project dashboard and regular progress meetings.

WHY IT MATTERS
A business transition is rarely just a financial decision. It is a decision about people, legacy, and what happens to something you spent years building.

We appreciate the opportunity to introduce ourselves and would welcome a conversation to learn more about your goals.

${d.senderFirstName} ${d.senderLastName}
${d.senderTitle}
${d.senderCompany}`;
}

// ── Component ───────────────────────────────────────────

interface LetterProps {
	companyId?: string;
	companyStage?: string;
}

export default function ClientIntroductionLetter({
	companyId,
	companyStage,
}: LetterProps) {
	const [formData, _setFormData] = useState<FormData>(DEFAULT_DATA);
	const [isSending, setIsSending] = useState(false);
	const [sendStatus, setSendStatus] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [previewTo, setPreviewTo] = useState("");
	const [previewSubject, setPreviewSubject] = useState(
		"An Introduction to Forhemit Transition Stewardship",
	);
	const [previewMessage, setPreviewMessage] = useState("");
	const [pdfBase64, setPdfBase64] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);

	const sendEmail = useAction(api.clientEmails.sendClientIntroductionEmail);
	const uploadToBox = useAction(api.box.uploadDealDocument);

	const today = todayFormatted();

	// ── Generate PDF ──────────────────────────────────────

	const handleGeneratePdf = async () => {
		setIsGenerating(true);
		try {
			const htmlContent = buildPdfHtml(formData, today);
			const res = await fetch("/api/pdf-generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					templateName: "Client-Introduction-Letter",
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
		setPreviewMessage(buildEmailBody(formData));
		setShowModal(true);
		setSendStatus(null);
		// Auto-generate PDF if not already done
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
			// Strip the data URL prefix to get raw base64
			const base64Content = pdfBase64.split(",")[1] || pdfBase64;
			const fileName = `Forhemit-Introduction-Letter-${formData.firstName || "Client"}.pdf`;

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
		<div className="cil-container">
			{/* ── App Header ── */}
			<div className="cil-app-header">
				<div>
					<div className="cil-app-wordmark">Forhemit</div>
					<div className="cil-app-sub">Client Introduction Letter</div>
				</div>
				<div className="cil-header-actions">
					{sendStatus && (
						<span
							className={`cil-status ${sendStatus.includes("success") ? "success" : sendStatus.includes("Failed") ? "error" : ""}`}
						>
							{sendStatus}
						</span>
					)}
					<button
						className="cil-btn cil-btn-print"
						onClick={() => window.print()}
					>
						⎙ Print / PDF
					</button>
					<button
						className="cil-btn cil-btn-send"
						onClick={handleOpenModal}
						disabled={isSending}
					>
						{isSending ? "Preparing…" : "✉ Preview & Send"}
					</button>
				</div>
			</div>

			{/* ── Letter ── */}
			<div className="cil-paper">
				<div className="cil-header">
					<div>
						<div className="cil-wordmark">Forhemit</div>
						<div className="cil-tagline">Transition Stewardship</div>
					</div>
					<div className="cil-category">Introduction</div>
				</div>
				<div className="cil-brass-rule" />

				<div className="cil-meta">
					<div className="cil-date">{today}</div>
					<div className="cil-re">
						RE: An Introduction to Forhemit Transition Stewardship
					</div>
					<div className="cil-meta-rule" />
				</div>

				<div className="cil-body">
					{/* Your Story */}
					<div className="cil-section">
						<div className="cil-rail">
							<span className="cil-rail-label">Your Story</span>
							<p className="cil-rail-note">Beyond the Purchase Price.</p>
						</div>
						<div className="cil-content">
							<p className="cil-para">
								Most business owners who reach this stage have spent years —
								sometimes decades — building something that cannot be fully
								captured on a spreadsheet.
							</p>
							<div className="cil-callout">
								&ldquo;The financial results are there, but they tell only part
								of the story.&rdquo;
							</div>
							<p className="cil-para">
								The team you kept together through difficult years, the
								reputation you built one relationship at a time, and the
								decisions you made when no one was watching are all part of the
								value you&rsquo;ve created. They deserve to be treated that way.
							</p>
						</div>
					</div>

					{/* What We Do */}
					<div className="cil-section">
						<div className="cil-rail">
							<span className="cil-rail-label">What We Do</span>
							<p className="cil-rail-note">
								A private-market version of an IPO — without the unknown buyer.
							</p>
						</div>
						<div className="cil-content">
							<p className="cil-para">
								We help facilitate and transition a private market IPO (initial
								public offering) to your employees.
							</p>
							<div className="cil-callout">
								&ldquo;You receive full fair market value (FMV) for your
								business.&rdquo;
							</div>
							<p className="cil-para">
								You receive the financial benefits of a sale, but instead of
								transferring ownership to an unknown outside buyer, ownership
								passes to the employees who helped build the company. Leadership
								remains in place, the culture stays intact, and the business
								continues serving the customers and communities that helped make
								it successful.
							</p>
						</div>
					</div>

					{/* How We Work */}
					<div className="cil-section">
						<div className="cil-rail">
							<span className="cil-rail-label">How We Work</span>
							<span className="cil-rail-number">120</span>
							<span className="cil-rail-number-label">
								Day structured timeline
							</span>
						</div>
						<div className="cil-content">
							<p className="cil-para">
								We operate on a structured timeline designed to create clarity
								and momentum without disrupting the day-to-day operation of your
								business.
							</p>
							<div className="cil-steps">
								<div className="cil-step">
									<div className="cil-step-num">01</div>
									<span className="cil-step-label">Valuation</span>
									<span className="cil-step-detail">
										Independent FMV appraisal
									</span>
								</div>
								<div className="cil-step">
									<div className="cil-step-num">02</div>
									<span className="cil-step-label">Financing</span>
									<span className="cil-step-detail">
										Capital stack assembly
									</span>
								</div>
								<div className="cil-step">
									<div className="cil-step-num">03</div>
									<span className="cil-step-label">Design</span>
									<span className="cil-step-detail">Transaction structure</span>
								</div>
								<div className="cil-step">
									<div className="cil-step-num">04</div>
									<span className="cil-step-label">Close</span>
									<span className="cil-step-detail">
										Implementation &amp; transfer
									</span>
								</div>
							</div>
							<p className="cil-para">
								Throughout the engagement, you will have access to a live
								project dashboard that shows exactly where we are at any given
								time. We meet regularly to review progress, discuss upcoming
								milestones, and answer questions as they arise.
							</p>
							<p className="cil-para">
								Our job is to manage the complexity so that you can remain
								focused on your business, your people, and your future.
							</p>
						</div>
					</div>

					{/* Why It Matters */}
					<div className="cil-section">
						<div className="cil-rail">
							<span className="cil-rail-label">Why It Matters</span>
							<p className="cil-rail-note">
								Legacy, people, and continuity — not just the price.
							</p>
						</div>
						<div className="cil-content">
							<p className="cil-para">
								A business transition is rarely just a financial decision. It is
								a decision about people, legacy, and what happens to something
								you spent years building.
							</p>
							<ul className="cil-points">
								<li>
									Employees who helped build the company benefit directly from
									its success
								</li>
								<li>
									Leadership, culture, and customer relationships stay intact
								</li>
								<li>Communities that depend on the business are protected</li>
								<li>
									Your legacy is preserved — not absorbed into a portfolio
								</li>
							</ul>
						</div>
					</div>

					<div className="cil-closing">
						We appreciate the opportunity to introduce ourselves and would
						welcome a conversation to learn more about your goals and explore
						whether this approach may be a good fit for you and your company.
					</div>
				</div>

				<div className="cil-sig">
					<div>
						<div className="cil-sig-name">
							{formData.senderFirstName} {formData.senderLastName}
						</div>
						<div className="cil-sig-meta">
							{formData.senderTitle} · {formData.senderCompany}
							<br />A California Public Benefit Corporation
						</div>
					</div>
					<div className="cil-sig-contact">
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
					className="cil-modal-overlay"
					onClick={() => !isSending && setShowModal(false)}
				>
					<div className="cil-modal" onClick={(e) => e.stopPropagation()}>
						<div className="cil-modal-header">
							<h2>Preview & Send</h2>
							<button
								className="cil-modal-close"
								onClick={() => setShowModal(false)}
								disabled={isSending}
							>
								✕
							</button>
						</div>
						<div className="cil-modal-body">
							<div className="cil-field">
								<label>To</label>
								<input
									type="email"
									value={previewTo}
									onChange={(e) => setPreviewTo(e.target.value)}
									placeholder="client@email.com"
									disabled={isSending}
								/>
							</div>
							<div className="cil-field">
								<label>Subject</label>
								<input
									type="text"
									value={previewSubject}
									onChange={(e) => setPreviewSubject(e.target.value)}
									disabled={isSending}
								/>
							</div>
							<div className="cil-field">
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
									color: "var(--cil-muted)",
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
						<div className="cil-modal-footer">
							<button
								className="cil-btn cil-btn-print"
								onClick={() => setShowModal(false)}
								disabled={isSending}
							>
								Cancel
							</button>
							{companyId && (
								<button
									className="cil-btn cil-btn-print"
									onClick={handleSaveToBox}
									disabled={isSavingToBox || isGenerating}
								>
									{isSavingToBox ? "Saving…" : "📁 Save to Box"}
								</button>
							)}
							<button
								className="cil-btn cil-btn-send"
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
