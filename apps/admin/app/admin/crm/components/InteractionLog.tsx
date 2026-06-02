"use client";

import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { useCrmInteractions } from "../hooks";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// ============================================================================
// InteractionLog — Activity timeline + new entry form
// ============================================================================

interface InteractionLogProps {
	companyId: Id<"crmCompanies">;
}

const INTERACTION_TYPES = [
	{ value: "Call", icon: "📞" },
	{ value: "Meeting", icon: "🤝" },
	{ value: "Email", icon: "📧" },
	{ value: "Text", icon: "💬" },
	{ value: "Note", icon: "📝" },
	{ value: "Event", icon: "🎉" },
	{ value: "Introduction", icon: "🔗" },
	{ value: "Referral Given", icon: "🎁" },
	{ value: "Referral Received", icon: "📬" },
	{ value: "Nurture Touch", icon: "🌱" },
	{ value: "Document Sent", icon: "📄" },
	{ value: "Document Received", icon: "📥" },
];

const SENTIMENT_OPTIONS = [
	{ value: "positive", label: "😊 Positive", color: "#22c55e" },
	{ value: "neutral", label: "😐 Neutral", color: "#a3a3a3" },
	{ value: "negative", label: "😟 Negative", color: "#ef4444" },
];

export function InteractionLog({ companyId }: InteractionLogProps) {
	const { interactions } = useCrmInteractions(companyId);
	const createInteraction = useMutation(api.crmInteractions.create);

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [type, setType] = useState("Note");
	const [subject, setSubject] = useState("");
	const [notes, setNotes] = useState("");
	const [sentiment, setSentiment] = useState("");
	const [nextAction, setNextAction] = useState("");
	const [nextActionDate, setNextActionDate] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async () => {
		if (!subject.trim()) return;
		setIsSaving(true);
		try {
			await createInteraction({
				companyId,
				date: new Date().toISOString().split("T")[0],
				type,
				summary: subject.trim(),
				sentiment: sentiment || undefined,
				nextAction: nextAction || undefined,
				nextActionDate: nextActionDate || undefined,
			});
			// Reset form
			setSubject("");
			setNotes("");
			setSentiment("");
			setNextAction("");
			setNextActionDate("");
			setIsFormOpen(false);
		} finally {
			setIsSaving(false);
		}
	};

	const formatDate = (dateStr: string) => {
		try {
			const d = new Date(dateStr + "T00:00:00");
			return d.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		} catch {
			return dateStr;
		}
	};

	const getTypeIcon = (t: string) =>
		INTERACTION_TYPES.find((i) => i.value === t)?.icon || "📝";

	return (
		<div>
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-[13px] font-semibold text-[var(--text)] uppercase tracking-wide">
					Interaction Log
				</h3>
				<button
					onClick={() => setIsFormOpen(!isFormOpen)}
					className="text-[11px] px-2.5 py-1 rounded-md bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
				>
					{isFormOpen ? "Cancel" : "+ Log Interaction"}
				</button>
			</div>

			{/* New Interaction Form */}
			{isFormOpen && (
				<div className="bg-[var(--surface2)] border border-[var(--border)] rounded-md p-3 mb-3 space-y-3">
					{/* Type selector */}
					<div className="flex flex-wrap gap-1.5">
						{INTERACTION_TYPES.map((t) => (
							<button
								key={t.value}
								onClick={() => setType(t.value)}
								className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
									type === t.value
										? "bg-[var(--primary)] text-white border-[var(--primary)]"
										: "bg-[var(--bg)] text-[var(--text2)] border-[var(--border)] hover:border-[var(--text3)]"
								}`}
							>
								{t.icon} {t.value}
							</button>
						))}
					</div>

					{/* Subject */}
					<input
						type="text"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						placeholder="Subject / summary..."
						className="w-full text-[13px] px-3 py-2 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-none focus:border-[var(--primary)]"
					/>

					{/* Notes */}
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Details, key takeaways, their words..."
						rows={3}
						className="w-full text-[13px] px-3 py-2 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-none focus:border-[var(--primary)] resize-none"
					/>

					{/* Sentiment */}
					<div className="flex items-center gap-2">
						<span className="text-[11px] text-[var(--text3)]">Sentiment:</span>
						{SENTIMENT_OPTIONS.map((s) => (
							<button
								key={s.value}
								onClick={() =>
									setSentiment(sentiment === s.value ? "" : s.value)
								}
								className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
									sentiment === s.value
										? `border-[${s.color}] bg-[${s.color}]/10 text-[${s.color}]`
										: "border-[var(--border)] text-[var(--text3)] hover:border-[var(--text3)]"
								}`}
								style={
									sentiment === s.value
										? {
												borderColor: s.color,
												backgroundColor: `${s.color}15`,
												color: s.color,
											}
										: undefined
								}
							>
								{s.label}
							</button>
						))}
					</div>

					{/* Next Action */}
					<div className="grid grid-cols-2 gap-2">
						<input
							type="text"
							value={nextAction}
							onChange={(e) => setNextAction(e.target.value)}
							placeholder="Next action..."
							className="text-[13px] px-3 py-2 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-none focus:border-[var(--primary)]"
						/>
						<input
							type="date"
							value={nextActionDate}
							onChange={(e) => setNextActionDate(e.target.value)}
							className="text-[13px] px-3 py-2 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
						/>
					</div>

					{/* Save */}
					<button
						onClick={handleSave}
						disabled={!subject.trim() || isSaving}
						className="w-full btn btn-primary text-[12px] disabled:opacity-50"
					>
						{isSaving ? "Saving..." : "Save Interaction"}
					</button>
				</div>
			)}

			{/* Timeline */}
			<div className="flex flex-col">
				{!interactions || interactions.length === 0 ? (
					<div className="text-[var(--text3)] text-[12px] py-3">
						No interactions recorded yet.
					</div>
				) : (
					interactions.map((interaction) => (
						<div
							key={interaction._id}
							className="flex gap-3 py-2.5 border-b border-[var(--border)] last:border-0"
						>
							{/* Icon */}
							<div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center text-[12px]">
								{getTypeIcon(interaction.type)}
							</div>

							{/* Content */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-0.5">
									<span className="text-[12px] font-medium text-[var(--text)] truncate">
										{interaction.summary}
									</span>
									<span className="text-[10px] text-[var(--text3)] flex-shrink-0">
										{formatDate(interaction.date)}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface2)] text-[var(--text3)]">
										{interaction.type}
									</span>
									{interaction.sentiment && (
										<span
											className="text-[10px] px-1.5 py-0.5 rounded"
											style={{
												backgroundColor:
													interaction.sentiment === "positive"
														? "#22c55e15"
														: interaction.sentiment === "negative"
															? "#ef444415"
															: "#a3a3a315",
												color:
													interaction.sentiment === "positive"
														? "#22c55e"
														: interaction.sentiment === "negative"
															? "#ef4444"
															: "#a3a3a3",
											}}
										>
											{interaction.sentiment}
										</span>
									)}
									{interaction.withWhomName && (
										<span className="text-[10px] text-[var(--text3)]">
											with {interaction.withWhomName}
										</span>
									)}
								</div>

								{interaction.nextAction && (
									<div className="text-[11px] text-[var(--text3)] mt-1">
										→ {interaction.nextAction}
										{interaction.nextActionDate &&
											` (${formatDate(interaction.nextActionDate)})`}
									</div>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
