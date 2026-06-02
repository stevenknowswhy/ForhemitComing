"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import "./QuickSendEngagementLetter.css";

// ── Types ───────────────────────────────────────────────

interface EngagementLetterFields {
	co: string;
	ofName: string;
	ofTitle: string;
	ref: string;
	dt: string;
	gs: string;
	ac: string;
	tl: string;
	eb: string;
	ti: string;
	ra: string;
	pm: string;
	pd: string;
	bank: string;
	bankName: string;
	acctName: string;
	routing: string;
	acctNum: string;
	swift: string;
	bankAddr: string;
	brokerTog: string;
	bn: string;
	bf: string;
	brokerEmail: string;
	brokerPhone: string;
	retMode: string;
	ad: string;
}

const DEFAULT_FIELDS: EngagementLetterFields = {
	co: "",
	ofName: "",
	ofTitle: "",
	ref: "FHH-0023",
	dt: new Date().toISOString().slice(0, 10),
	gs: "CA",
	ac: "San Francisco, CA",
	tl: "180",
	eb: "",
	ti: "",
	ra: "",
	pm: "wire",
	pd: "",
	bank: "novo",
	bankName: "",
	acctName: "",
	routing: "",
	acctNum: "",
	swift: "",
	bankAddr: "",
	brokerTog: "false",
	bn: "",
	bf: "",
	brokerEmail: "",
	brokerPhone: "",
	retMode: "nonrefundable",
	ad: "",
};

const STATES: Record<string, string> = {
	CA: "California",
	FL: "Florida",
	TX: "Texas",
	TN: "Tennessee",
	DE: "Delaware",
	NY: "New York",
	NV: "Nevada",
};

const TIERS: Record<
	string,
	{ label: string; total: number; retainer: number }
> = {
	"1": { label: "Tier 1 — < $5M EBITDA", total: 75000, retainer: 15000 },
	"2": { label: "Tier 2 — $5M–$10M EBITDA", total: 100000, retainer: 25000 },
	"3": { label: "Tier 3 — $10M–$15M EBITDA", total: 125000, retainer: 25000 },
};

// ── Helpers ─────────────────────────────────────────────

function fmt$(n: number): string {
	return "$" + n.toLocaleString("en-US");
}

// ── Component ───────────────────────────────────────────

interface LetterProps {
	companyId?: string;
	companyStage?: string;
}

export default function QuickSendEngagementLetter({
	companyId: initialCompanyId,
}: LetterProps) {
	// ── State ────────────────────────────────────────────
	const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
		initialCompanyId || "",
	);
	const [fields, setFields] = useState<EngagementLetterFields>(DEFAULT_FIELDS);
	const [status, setStatus] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [pdfBase64, setPdfBase64] = useState<string | null>(null);

	// Email modal state
	const [showEmailModal, setShowEmailModal] = useState(false);
	const [emailTo, setEmailTo] = useState("");
	const [emailSubject, setEmailSubject] = useState(
		"Forhemit — Engagement Letter for Your Review",
	);
	const [emailMessage, setEmailMessage] = useState("");

	// Box Sign modal state
	const [showSignModal, setShowSignModal] = useState(false);
	const [signerEmail, setSignerEmail] = useState("");
	const [signerName, setSignerName] = useState("");

	// Broker state
	const [brokerMode, setBrokerMode] = useState<"crm" | "other">("crm");
	const [selectedBrokerId, setSelectedBrokerId] = useState<string>("");
	const [addBrokerToCrm, setAddBrokerToCrm] = useState(false);

	// ── Convex queries & actions ─────────────────────────
	const companies = useQuery(api.crmCompanies.list);
	const brokerContactsEnabled =
		fields.brokerTog === "true" && brokerMode === "crm";
	const brokerContacts = useQuery(
		(brokerContactsEnabled ? api.crmContacts.listByType : "skip") as any,
		brokerContactsEnabled ? { contactType: "broker", limit: 50 } : "skip",
	);
	const companyData = useQuery(
		(selectedCompanyId
			? api.clientEmails.getCompanyForEngagementLetter
			: "skip") as any,
		selectedCompanyId
			? { companyId: selectedCompanyId as Id<"crmCompanies"> }
			: "skip",
	);

	const sendEmailAction = useAction(api.clientEmails.sendEngagementLetterEmail);
	const createSignRequest = useAction(api.box.createSignRequest);
	const uploadToBox = useAction(api.box.uploadDealDocument);
	const createBrokerContact = useMutation(api.crmContacts.createBrokerContact);

	// ── Auto-fill from CRM ──────────────────────────────
	const applyCrmData = useCallback(() => {
		if (!companyData) return;
		const c = companyData;
		const seller = c.seller;
		const broker = c.broker;

		setFields((prev) => ({
			...prev,
			co: c.name || prev.co,
			ref: c.ref || prev.ref,
			eb: c.ebitda || prev.eb,
			ofName: seller ? `${seller.firstName} ${seller.lastName}` : prev.ofName,
			ofTitle: seller?.role || prev.ofTitle,
			brokerTog: broker ? "true" : "false",
			bn: broker ? `${broker.firstName} ${broker.lastName}` : prev.bn,
			bf: broker?.firm || prev.bf,
		}));

		// Set broker mode based on CRM data
		if (broker?.contactId) {
			setBrokerMode("crm");
			setSelectedBrokerId(broker.contactId);
		} else if (broker) {
			setBrokerMode("other");
		}

		// Auto-set tier from EBITDA
		if (c.ebitda) {
			const ebitdaNum = parseFloat(c.ebitda);
			if (!isNaN(ebitdaNum)) {
				let tier = "1";
				if (ebitdaNum >= 10_000_000) tier = "3";
				else if (ebitdaNum >= 5_000_000) tier = "2";
				setFields((prev) => ({
					...prev,
					ti: tier,
					ra: String(TIERS[tier]?.retainer || ""),
				}));
			}
		}

		setStatus("Auto-filled from CRM");
		setTimeout(() => setStatus(null), 3000);
	}, [companyData]);

	useEffect(() => {
		if (companyData) {
			applyCrmData();
		}
	}, [companyData, applyCrmData]);

	// ── Update helper ───────────────────────────────────
	const upd = useCallback(
		<K extends keyof EngagementLetterFields>(
			key: K,
			val: EngagementLetterFields[K],
		) => {
			setFields((prev) => ({ ...prev, [key]: val }));
		},
		[],
	);

	// ── Auto-tier from EBITDA input ─────────────────────
	const handleEbitdaChange = useCallback((val: string) => {
		setFields((prev) => {
			const num = parseFloat(val);
			let tier = prev.ti;
			let retainer = prev.ra;
			if (!isNaN(num) && num > 0) {
				if (num < 5_000_000) tier = "1";
				else if (num < 10_000_000) tier = "2";
				else tier = "3";
				retainer = String(TIERS[tier]?.retainer || "");
			}
			return { ...prev, eb: val, ti: tier, ra: retainer };
		});
	}, []);

	// ── Broker CRM creation helper ───────────────────────
	const maybeCreateBrokerInCrm = useCallback(async () => {
		if (!addBrokerToCrm || brokerMode !== "other" || !selectedCompanyId) return;
		if (!fields.bn.trim()) return;

		const nameParts = fields.bn.trim().split(/\s+/);
		const firstName = nameParts[0] || "";
		const lastName = nameParts.slice(1).join(" ") || "";

		try {
			await createBrokerContact({
				companyId: selectedCompanyId as Id<"crmCompanies">,
				firstName,
				lastName,
				email: fields.brokerEmail || undefined,
				phone: fields.brokerPhone || undefined,
				firm: fields.bf || undefined,
			});
			setStatus((prev) =>
				prev ? `${prev} — Broker added to CRM` : "Broker added to CRM",
			);
		} catch (err) {
			console.error("Failed to create broker contact:", err);
		}
	}, [
		addBrokerToCrm,
		brokerMode,
		selectedCompanyId,
		fields.bn,
		fields.bf,
		fields.brokerEmail,
		fields.brokerPhone,
		createBrokerContact,
	]);

	// ── PDF Generation ──────────────────────────────────
	const generatePdf = useCallback(async (): Promise<string | null> => {
		setIsGenerating(true);
		setStatus("Generating PDF…");
		try {
			const res = await fetch("/api/send-engagement-letter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fields,
					companyId: (selectedCompanyId || undefined) as
						| Id<"crmCompanies">
						| undefined,
					boxFolderId: companyData?.boxFolderId || undefined,
				}),
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || `PDF failed (${res.status})`);
			}
			const data = await res.json();
			setPdfBase64(data.pdfBase64);
			setStatus("PDF generated successfully");
			setTimeout(() => setStatus(null), 4000);
			return data.pdfBase64;
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setStatus(`PDF generation failed: ${msg}`);
			setPdfBase64(null);
			return null;
		} finally {
			setIsGenerating(false);
		}
	}, [fields, selectedCompanyId, companyData]);

	// ── Preview in new tab ──────────────────────────────
	const handlePreview = useCallback(() => {
		const preview = window.open(
			"/templates/engagement-letter-v3.html",
			"engagement-letter-preview",
		);
		if (!preview) {
			setStatus("Pop-up blocked — allow pop-ups for this site");
			return;
		}
		// Send data once the template loads
		const sendData = () => {
			preview.postMessage(
				{
					type: "FORHEMIT_ENGAGEMENT_LETTER_DATA",
					fields,
				},
				window.location.origin,
			);
		};
		// Try immediately and on load
		sendData();
		preview.addEventListener("load", sendData);
	}, [fields]);

	// ── Send Email ──────────────────────────────────────
	const handleSendEmail = useCallback(async () => {
		if (!emailTo) {
			setStatus("Enter a recipient email");
			return;
		}
		setIsSending(true);
		setStatus("Sending email…");
		try {
			let pdf = pdfBase64;
			if (!pdf) {
				pdf = await generatePdf();
				if (!pdf) {
					setIsSending(false);
					return;
				}
			}

			const result = await sendEmailAction({
				to: emailTo,
				companyName: fields.co,
				officerName: fields.ofName,
				engagementRef: fields.ref,
				subject: emailSubject,
				customMessage: emailMessage,
				pdfBase64: pdf,
				companyId: (selectedCompanyId || undefined) as
					| Id<"crmCompanies">
					| undefined,
			});

			if (result?.success) {
				setStatus("Email sent successfully!");
				setShowEmailModal(false);
				await maybeCreateBrokerInCrm();
			} else {
				setStatus(
					`Email failed: ${result?.email?.error || result?.telegram?.error || "Unknown error"}`,
				);
			}
		} catch (err) {
			setStatus(
				`Email failed: ${err instanceof Error ? err.message : String(err)}`,
			);
		} finally {
			setIsSending(false);
		}
	}, [
		emailTo,
		emailSubject,
		emailMessage,
		pdfBase64,
		fields,
		selectedCompanyId,
		generatePdf,
		sendEmailAction,
	]);

	// ── Box Sign ────────────────────────────────────────
	const handleBoxSign = useCallback(async () => {
		if (!signerEmail || !signerName) {
			setStatus("Enter signer name and email");
			return;
		}
		if (!selectedCompanyId) {
			setStatus("Select a company first");
			return;
		}
		if (!companyData?.boxFolderId) {
			setStatus("Company has no Box folder — create one first");
			return;
		}

		setIsSending(true);
		setStatus("Uploading to Box and creating signature request…");
		try {
			let pdf = pdfBase64;
			if (!pdf) {
				pdf = await generatePdf();
				if (!pdf) {
					setIsSending(false);
					return;
				}
			}

			// Upload PDF to Box
			const base64Content = pdf.split(",")[1] || pdf;
			const ref = fields.ref || "document";
			const fileName = `Forhemit-Engagement-Letter-${ref}.pdf`;

			const uploadResult = await uploadToBox({
				companyId: selectedCompanyId as Id<"crmCompanies">,
				stage: companyData.stage || "First contact",
				fileName,
				contentBase64: base64Content,
			});

			// Create Sign request
			const signResult = await createSignRequest({
				companyId: selectedCompanyId as Id<"crmCompanies">,
				boxFileId: uploadResult.fileId,
				signerEmail,
				signerName,
				emailSubject: `Please sign: Forhemit Engagement Letter — ${fields.co}`,
				emailMessage: `${signerName},\n\nPlease review and sign the attached engagement letter for ${fields.co}.\n\nReference: ${fields.ref}`,
			});

			setStatus(
				`Signature request sent! ID: ${signResult.signRequestId} (${signResult.status})`,
			);
			setShowSignModal(false);
			await maybeCreateBrokerInCrm();
		} catch (err) {
			setStatus(
				`Box Sign failed: ${err instanceof Error ? err.message : String(err)}`,
			);
		} finally {
			setIsSending(false);
		}
	}, [
		signerEmail,
		signerName,
		selectedCompanyId,
		companyData,
		pdfBase64,
		fields,
		generatePdf,
		uploadToBox,
		createSignRequest,
	]);

	// ── Save to Box ─────────────────────────────────────
	const handleSaveToBox = useCallback(async () => {
		if (!selectedCompanyId) {
			setStatus("Select a company first");
			return;
		}
		if (!companyData?.boxFolderId) {
			setStatus("Company has no Box folder");
			return;
		}

		setIsSending(true);
		setStatus("Saving to Box…");
		try {
			let pdf = pdfBase64;
			if (!pdf) {
				pdf = await generatePdf();
				if (!pdf) {
					setIsSending(false);
					return;
				}
			}

			const base64Content = pdf.split(",")[1] || pdf;
			const ref = fields.ref || "document";
			const fileName = `Forhemit-Engagement-Letter-${ref}.pdf`;

			await uploadToBox({
				companyId: selectedCompanyId as Id<"crmCompanies">,
				stage: companyData.stage || "First contact",
				fileName,
				contentBase64: base64Content,
			});

			setStatus("Saved to Box!");
		} catch (err) {
			setStatus(
				`Box upload failed: ${err instanceof Error ? err.message : String(err)}`,
			);
		} finally {
			setIsSending(false);
		}
	}, [
		selectedCompanyId,
		companyData,
		pdfBase64,
		fields,
		generatePdf,
		uploadToBox,
	]);

	// ── Selected company info for display ───────────────
	const selectedCompany = companies?.find(
		(c: any) => c._id === selectedCompanyId,
	);

	// ── Tier info ───────────────────────────────────────
	const tier = TIERS[fields.ti];
	const completionFields = [
		fields.co,
		fields.ofName,
		fields.dt,
		fields.ref,
		fields.eb,
		fields.ti,
		fields.ra,
		fields.pd,
	];
	const filledCount = completionFields.filter((v) => v && v.trim()).length;
	const isComplete = filledCount === completionFields.length;

	// ── Render ──────────────────────────────────────────
	return (
		<div className="qsel-container">
			{/* ── Header ── */}
			<div className="qsel-header">
				<div className="qsel-header-left">
					<div className="qsel-wordmark">Forhemit</div>
					<div className="qsel-subtitle">Engagement Letter — Quick Send</div>
				</div>
				<div className="qsel-header-right">
					{status && (
						<span
							className={`qsel-status ${
								status.includes("success") ||
								status.includes("sent") ||
								status.includes("Saved")
									? "success"
									: status.includes("failed") || status.includes("Failed")
										? "error"
										: ""
							}`}
						>
							{status}
						</span>
					)}
					<span className={`qsel-completion ${isComplete ? "complete" : ""}`}>
						{filledCount}/{completionFields.length} required
					</span>
				</div>
			</div>

			{/* ── Company Selector ── */}
			<div className="qsel-section">
				<div className="qsel-section-label">Select Company</div>
				<div className="qsel-company-row">
					<select
						className="qsel-company-select"
						value={selectedCompanyId}
						onChange={(e) => setSelectedCompanyId(e.target.value)}
					>
						<option value="">— Select a company —</option>
						{companies?.map((c: any) => (
							<option key={c._id} value={c._id}>
								{c.name} {c.ref ? `(${c.ref})` : ""}
							</option>
						))}
					</select>
					{selectedCompanyId && (
						<button
							className="qsel-btn qsel-btn-ghost"
							onClick={applyCrmData}
							type="button"
						>
							↻ Re-fill from CRM
						</button>
					)}
				</div>
				{selectedCompany && (
					<div className="qsel-company-info">
						<span>{selectedCompany.name}</span>
						<span className="qsel-dot">·</span>
						<span>{selectedCompany.stage}</span>
						{selectedCompany.ebitda && (
							<>
								<span className="qsel-dot">·</span>
								<span>EBITDA: {selectedCompany.ebitda}</span>
							</>
						)}
						{selectedCompany.boxFolderId ? (
							<span className="qsel-box-ok">Box ✓</span>
						) : (
							<span className="qsel-box-missing">No Box folder</span>
						)}
					</div>
				)}
			</div>

			{/* ── Form Fields ── */}
			<div className="qsel-form">
				{/* Parties & Engagement */}
				<div className="qsel-form-section">
					<div className="qsel-form-section-title">Parties & Engagement</div>
					<div className="qsel-field-grid">
						<div className="qsel-field">
							<label>
								Company (Client) <span className="qsel-req">*</span>
							</label>
							<input
								type="text"
								value={fields.co}
								onChange={(e) => upd("co", e.target.value)}
								placeholder="Legal entity name"
							/>
						</div>
						<div className="qsel-field">
							<label>
								Authorized Officer <span className="qsel-req">*</span>
							</label>
							<input
								type="text"
								value={fields.ofName}
								onChange={(e) => upd("ofName", e.target.value)}
								placeholder="Full name"
							/>
						</div>
						<div className="qsel-field">
							<label>Officer Title</label>
							<input
								type="text"
								value={fields.ofTitle}
								onChange={(e) => upd("ofTitle", e.target.value)}
								placeholder="CEO, Owner, etc."
							/>
						</div>
						<div className="qsel-field">
							<label>Engagement Reference</label>
							<input
								type="text"
								value={fields.ref}
								onChange={(e) => upd("ref", e.target.value)}
								style={{ fontFamily: "var(--ff-mono)" }}
							/>
						</div>
						<div className="qsel-field">
							<label>
								Effective Date <span className="qsel-req">*</span>
							</label>
							<input
								type="date"
								value={fields.dt}
								onChange={(e) => upd("dt", e.target.value)}
							/>
						</div>
						<div className="qsel-field">
							<label>Governing State</label>
							<select
								value={fields.gs}
								onChange={(e) => upd("gs", e.target.value)}
							>
								{Object.entries(STATES).map(([code, name]) => (
									<option key={code} value={code}>
										{name}
									</option>
								))}
							</select>
						</div>
						<div className="qsel-field">
							<label>Arbitration County</label>
							<input
								type="text"
								value={fields.ac}
								onChange={(e) => upd("ac", e.target.value)}
								placeholder="City, State"
							/>
						</div>
						<div className="qsel-field">
							<label>Tail Provision</label>
							<select
								value={fields.tl}
								onChange={(e) => upd("tl", e.target.value)}
							>
								<option value="90">90 days</option>
								<option value="180">180 days</option>
								<option value="270">270 days</option>
								<option value="365">365 days</option>
							</select>
						</div>
					</div>
				</div>

				{/* Fees & Retainer */}
				<div className="qsel-form-section">
					<div className="qsel-form-section-title">Fees & Retainer</div>
					<div className="qsel-field-grid">
						<div className="qsel-field">
							<label>
								QofE-Normalized TTM EBITDA <span className="qsel-req">*</span>
							</label>
							<div className="qsel-money-input">
								<span className="qsel-money-prefix">$</span>
								<input
									type="number"
									value={fields.eb}
									onChange={(e) => handleEbitdaChange(e.target.value)}
									placeholder="e.g. 4500000"
									min="0"
									step="50000"
								/>
							</div>
						</div>
						<div className="qsel-field">
							<label>
								Fee Tier <span className="qsel-req">*</span>
							</label>
							<select
								value={fields.ti}
								onChange={(e) => {
									upd("ti", e.target.value);
									const t = TIERS[e.target.value];
									if (t) upd("ra", String(t.retainer));
								}}
							>
								<option value="">— Select —</option>
								<option value="1">Tier 1 — &lt; $5M</option>
								<option value="2">Tier 2 — $5M–$10M</option>
								<option value="3">Tier 3 — $10M–$15M</option>
							</select>
						</div>
						<div className="qsel-field">
							<label>
								Retainer Amount <span className="qsel-req">*</span>
							</label>
							<div className="qsel-money-input">
								<span className="qsel-money-prefix">$</span>
								<input
									type="number"
									value={fields.ra}
									onChange={(e) => upd("ra", e.target.value)}
									min="0"
									step="1000"
								/>
							</div>
						</div>
						<div className="qsel-field">
							<label>Payment Method</label>
							<select
								value={fields.pm}
								onChange={(e) => upd("pm", e.target.value)}
							>
								<option value="wire">Wire Transfer</option>
								<option value="ach">ACH / Stripe</option>
								<option value="check">Business Check</option>
							</select>
						</div>
						<div className="qsel-field qsel-field-wide">
							<label>Payment Due Date</label>
							<input
								type="date"
								value={fields.pd}
								onChange={(e) => upd("pd", e.target.value)}
							/>
						</div>
					</div>
					{tier && (
						<div className="qsel-tier-summary">
							<span className="qsel-tier-label">{tier.label}</span>
							<span className="qsel-tier-total">Total: {fmt$(tier.total)}</span>
							<span className="qsel-tier-detail">
								Retainer {fmt$(tier.retainer)} → Validation → Commitment →
								Success
							</span>
						</div>
					)}
				</div>

				{/* Broker */}
				<div className="qsel-form-section">
					<div className="qsel-form-section-title">Broker (Optional)</div>
					<div className="qsel-field-grid">
						<div className="qsel-field qsel-field-wide">
							<label className="qsel-toggle-label">
								<input
									type="checkbox"
									checked={fields.brokerTog === "true"}
									onChange={(e) => {
										const on = e.target.checked;
										upd("brokerTog", on ? "true" : "false");
										if (on && brokerContacts && brokerContacts.length > 0) {
											setBrokerMode("crm");
										}
									}}
								/>
								<span>Broker involved</span>
							</label>
						</div>
						{fields.brokerTog === "true" && (
							<>
								{/* Source selector */}
								<div className="qsel-field qsel-field-wide">
									<label>Broker Source</label>
									<div className="qsel-broker-source">
										<label
											className={`qsel-radio-opt ${brokerMode === "crm" ? "active" : ""}`}
										>
											<input
												type="radio"
												name="brokerSource"
												checked={brokerMode === "crm"}
												onChange={() => setBrokerMode("crm")}
											/>
											<span>Select from CRM</span>
										</label>
										<label
											className={`qsel-radio-opt ${brokerMode === "other" ? "active" : ""}`}
										>
											<input
												type="radio"
												name="brokerSource"
												checked={brokerMode === "other"}
												onChange={() => setBrokerMode("other")}
											/>
											<span>Other (manual entry)</span>
										</label>
									</div>
								</div>

								{/* CRM dropdown */}
								{brokerMode === "crm" && (
									<div className="qsel-field qsel-field-wide">
										<label>Select Broker</label>
										<select
											value={selectedBrokerId}
											onChange={(e) => {
												const id = e.target.value;
												setSelectedBrokerId(id);
												const brk = brokerContacts?.find(
													(b: any) => b._id === id,
												);
												if (brk) {
													upd("bn", `${brk.firstName} ${brk.lastName}`);
													upd("bf", brk.firm || "");
												}
											}}
										>
											<option value="">— Select a broker —</option>
											{brokerContacts?.map((b: any) => (
												<option key={b._id} value={b._id}>
													{b.firstName} {b.lastName}
													{b.firm ? ` — ${b.firm}` : ""}
												</option>
											))}
										</select>
										{brokerContacts && brokerContacts.length === 0 && (
											<span className="qsel-field-hint">
												No brokers in CRM yet. Use "Other" to add one.
											</span>
										)}
									</div>
								)}

								{/* Manual entry fields */}
								{brokerMode === "other" && (
									<>
										<div className="qsel-field">
											<label>Broker Name</label>
											<input
												type="text"
												value={fields.bn}
												onChange={(e) => upd("bn", e.target.value)}
												placeholder="First and last name"
											/>
										</div>
										<div className="qsel-field">
											<label>Broker Firm</label>
											<input
												type="text"
												value={fields.bf}
												onChange={(e) => upd("bf", e.target.value)}
												placeholder="Brokerage firm"
											/>
										</div>
										<div className="qsel-field">
											<label>Broker Email</label>
											<input
												type="email"
												value={fields.brokerEmail}
												onChange={(e) => upd("brokerEmail", e.target.value)}
												placeholder="broker@firm.com"
											/>
										</div>
										<div className="qsel-field">
											<label>Broker Phone</label>
											<input
												type="tel"
												value={fields.brokerPhone}
												onChange={(e) => upd("brokerPhone", e.target.value)}
												placeholder="(555) 555-5555"
											/>
										</div>
										<div className="qsel-field qsel-field-wide">
											<label className="qsel-toggle-label">
												<input
													type="checkbox"
													checked={addBrokerToCrm}
													onChange={(e) => setAddBrokerToCrm(e.target.checked)}
												/>
												<span>Add broker to CRM after sending</span>
											</label>
											{addBrokerToCrm && !selectedCompanyId && (
												<span className="qsel-field-hint qsel-warn">
													Select a company first to link the broker
												</span>
											)}
										</div>
									</>
								)}
							</>
						)}
					</div>
				</div>

				{/* Retainer Mode */}
				<div className="qsel-form-section">
					<div className="qsel-form-section-title">Retainer Terms</div>
					<div className="qsel-field-grid">
						<div className="qsel-field qsel-field-wide">
							<label className="qsel-toggle-label">
								<input
									type="checkbox"
									checked={fields.retMode === "refundable"}
									onChange={(e) =>
										upd(
											"retMode",
											e.target.checked ? "refundable" : "nonrefundable",
										)
									}
								/>
								<span>Refundable retainer (30-day window)</span>
							</label>
						</div>
					</div>
				</div>

				{/* Additional Terms */}
				<div className="qsel-form-section">
					<div className="qsel-form-section-title">Additional Terms</div>
					<textarea
						className="qsel-textarea"
						value={fields.ad}
						onChange={(e) => upd("ad", e.target.value)}
						placeholder="Deal-specific terms, conditions, or modifications…"
						rows={2}
					/>
				</div>
			</div>

			{/* ── Action Bar ── */}
			<div className="qsel-actions">
				<button
					className="qsel-btn qsel-btn-ghost"
					onClick={handlePreview}
					type="button"
				>
					⎙ Preview
				</button>
				<button
					className="qsel-btn qsel-btn-secondary"
					onClick={generatePdf}
					disabled={isGenerating}
					type="button"
				>
					{isGenerating
						? "Generating…"
						: pdfBase64
							? "↻ Regenerate PDF"
							: "↓ Generate PDF"}
				</button>
				<button
					className="qsel-btn qsel-btn-primary"
					onClick={() => {
						setEmailMessage(
							`Please find attached the Engagement Letter for ${fields.co || "your company"}.\n\nReference: ${fields.ref || "—"}\n\nThis letter outlines the scope of services, fee structure, and terms of the proposed engagement. Please review with your counsel and CPA.\n\nIf you have any questions, please don't hesitate to reach out.`,
						);
						setShowEmailModal(true);
					}}
					disabled={isSending}
					type="button"
				>
					✉ Send Email
				</button>
				<button
					className="qsel-btn qsel-btn-sign"
					onClick={() => {
						if (companyData?.seller) {
							setSignerEmail(companyData.seller.email || "");
							setSignerName(
								`${companyData.seller.firstName} ${companyData.seller.lastName}`,
							);
						}
						setShowSignModal(true);
					}}
					disabled={isSending || !selectedCompanyId}
					type="button"
				>
					✍ Send for Signature
				</button>
				<button
					className="qsel-btn qsel-btn-ghost"
					onClick={handleSaveToBox}
					disabled={isSending || !selectedCompanyId}
					type="button"
				>
					📁 Save to Box
				</button>
			</div>

			{/* ── Email Modal ── */}
			{showEmailModal && (
				<div
					className="qsel-modal-overlay"
					onClick={() => !isSending && setShowEmailModal(false)}
				>
					<div className="qsel-modal" onClick={(e) => e.stopPropagation()}>
						<div className="qsel-modal-header">
							<h3>Send Engagement Letter via Email</h3>
							<button
								className="qsel-modal-close"
								onClick={() => setShowEmailModal(false)}
								disabled={isSending}
							>
								✕
							</button>
						</div>
						<div className="qsel-modal-body">
							<div className="qsel-modal-field">
								<label>To</label>
								<input
									type="email"
									value={emailTo}
									onChange={(e) => setEmailTo(e.target.value)}
									placeholder="client@company.com"
									disabled={isSending}
								/>
							</div>
							<div className="qsel-modal-field">
								<label>Subject</label>
								<input
									type="text"
									value={emailSubject}
									onChange={(e) => setEmailSubject(e.target.value)}
									disabled={isSending}
								/>
							</div>
							<div className="qsel-modal-field">
								<label>Message</label>
								<textarea
									value={emailMessage}
									onChange={(e) => setEmailMessage(e.target.value)}
									rows={8}
									disabled={isSending}
								/>
							</div>
							<div className="qsel-modal-note">
								{pdfBase64
									? "✅ PDF attached"
									: "PDF will be generated on send"}
							</div>
						</div>
						<div className="qsel-modal-footer">
							<button
								className="qsel-btn qsel-btn-ghost"
								onClick={() => setShowEmailModal(false)}
								disabled={isSending}
							>
								Cancel
							</button>
							<button
								className="qsel-btn qsel-btn-primary"
								onClick={handleSendEmail}
								disabled={isSending}
							>
								{isSending ? "Sending…" : "✉ Send Email"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ── Box Sign Modal ── */}
			{showSignModal && (
				<div
					className="qsel-modal-overlay"
					onClick={() => !isSending && setShowSignModal(false)}
				>
					<div className="qsel-modal" onClick={(e) => e.stopPropagation()}>
						<div className="qsel-modal-header">
							<h3>Send for Signature via Box Sign</h3>
							<button
								className="qsel-modal-close"
								onClick={() => setShowSignModal(false)}
								disabled={isSending}
							>
								✕
							</button>
						</div>
						<div className="qsel-modal-body">
							<div className="qsel-modal-field">
								<label>Signer Name</label>
								<input
									type="text"
									value={signerName}
									onChange={(e) => setSignerName(e.target.value)}
									placeholder="Authorized officer name"
									disabled={isSending}
								/>
							</div>
							<div className="qsel-modal-field">
								<label>Signer Email</label>
								<input
									type="email"
									value={signerEmail}
									onChange={(e) => setSignerEmail(e.target.value)}
									placeholder="signer@company.com"
									disabled={isSending}
								/>
							</div>
							<div className="qsel-modal-note">
								Box Sign will send an email to the signer with a link to review
								and sign the engagement letter. The signed document will be
								saved to the company's Box folder.
							</div>
						</div>
						<div className="qsel-modal-footer">
							<button
								className="qsel-btn qsel-btn-ghost"
								onClick={() => setShowSignModal(false)}
								disabled={isSending}
							>
								Cancel
							</button>
							<button
								className="qsel-btn qsel-btn-sign"
								onClick={handleBoxSign}
								disabled={isSending}
							>
								{isSending ? "Sending…" : "✍ Send for Signature"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
