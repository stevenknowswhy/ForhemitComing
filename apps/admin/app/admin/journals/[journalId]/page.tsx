"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { RichTextEditor } from "../../components/RichTextEditor";

// ── Constants ───────────────────────────────────────────────────────────────

const ENTRY_TYPES = [
	"work",
	"call",
	"meeting",
	"email",
	"document",
	"signature",
	"notification",
	"due_item",
	"milestone",
	"issue",
	"decision",
	"note",
] as const;

const THEMES = [
	"legal",
	"finance",
	"trustee_bank",
	"hr_comms",
	"governance",
	"tax",
	"signing",
	"admin",
] as const;

const EFFORT_BANDS = ["low", "medium", "high", "spike"] as const;

const EFFORT_WEIGHTS: Record<string, number> = {
	low: 1,
	medium: 2,
	high: 3,
	spike: 5,
};

const THEME_COLORS: Record<string, string> = {
	legal: "#6366f1",
	finance: "#f59e0b",
	trustee_bank: "#06b6d4",
	hr_comms: "#ec4899",
	governance: "#8b5cf6",
	tax: "#10b981",
	signing: "#f97316",
	admin: "#6b7280",
};

// ── Entry Templates ─────────────────────────────────────────────────────────

interface EntryTemplate {
	id: string;
	name: string;
	icon: string;
	description: string;
	entryType: (typeof ENTRY_TYPES)[number];
	theme: (typeof THEMES)[number];
	titleTemplate: string;
	descriptionTemplate: string;
	clientDescriptionTemplate?: string;
	defaultVisibility: "client" | "internal";
}

const ENTRY_TEMPLATES: EntryTemplate[] = [
	{
		id: "trustee-call",
		name: "Trustee Call",
		icon: "📞",
		description: "Call with trustee or bank representative",
		entryType: "call",
		theme: "trustee_bank",
		titleTemplate: "Call with Trustee",
		descriptionTemplate:
			"Discussed [topic] with [trustee name]. Key outcomes: [outcomes].",
		clientDescriptionTemplate: "Spoke with your trustee regarding [topic].",
		defaultVisibility: "client",
	},
	{
		id: "document-review",
		name: "Document Review",
		icon: "📄",
		description: "Reviewing legal or financial documents",
		entryType: "document",
		theme: "legal",
		titleTemplate: "Document Review",
		descriptionTemplate: "Reviewed [document name]. Findings: [findings].",
		clientDescriptionTemplate: "Reviewed and analyzed [document name].",
		defaultVisibility: "client",
	},
	{
		id: "valuation-meeting",
		name: "Valuation Meeting",
		icon: "💰",
		description: "Meeting about company valuation",
		entryType: "meeting",
		theme: "finance",
		titleTemplate: "Valuation Discussion",
		descriptionTemplate:
			"Met with [participants] to discuss valuation approach. Key decisions: [decisions].",
		clientDescriptionTemplate:
			"Met to discuss the company valuation process and methodology.",
		defaultVisibility: "client",
	},
	{
		id: "tax-discussion",
		name: "Tax Discussion",
		icon: "🏛️",
		description: "Meeting about tax structure or implications",
		entryType: "meeting",
		theme: "tax",
		titleTemplate: "Tax Strategy Discussion",
		descriptionTemplate:
			"Discussed [topic] with [participants]. Recommendations: [recommendations].",
		clientDescriptionTemplate:
			"Reviewed tax structure and identified optimization opportunities.",
		defaultVisibility: "client",
	},
	{
		id: "legal-review",
		name: "Legal Review",
		icon: "⚖️",
		description: "Legal review or compliance check",
		entryType: "meeting",
		theme: "legal",
		titleTemplate: "Legal Review Session",
		descriptionTemplate:
			"Reviewed [topic] for compliance. Issues found: [issues]. Next steps: [next steps].",
		clientDescriptionTemplate: "Conducted legal review of [topic].",
		defaultVisibility: "client",
	},
	{
		id: "board-meeting",
		name: "Board Meeting",
		icon: "🏢",
		description: "Board or governance meeting",
		entryType: "meeting",
		theme: "governance",
		titleTemplate: "Board Meeting",
		descriptionTemplate:
			"Board meeting with [attendees]. Agenda items: [items]. Resolutions: [resolutions].",
		clientDescriptionTemplate:
			"Board meeting conducted to review progress and approve key decisions.",
		defaultVisibility: "client",
	},
	{
		id: "signature-request",
		name: "Signature Request",
		icon: "✍️",
		description: "Sending documents for signature",
		entryType: "signature",
		theme: "signing",
		titleTemplate: "Signature Request Sent",
		descriptionTemplate:
			"Sent [document name] for signature to [signers]. Deadline: [date].",
		clientDescriptionTemplate: "Sent [document name] for your signature.",
		defaultVisibility: "client",
	},
	{
		id: "due-diligence",
		name: "Due Diligence",
		icon: "🔍",
		description: "Due diligence research or analysis",
		entryType: "work",
		theme: "finance",
		titleTemplate: "Due Diligence Work",
		descriptionTemplate:
			"Conducted due diligence on [area]. Findings: [findings]. Risk level: [low/medium/high].",
		clientDescriptionTemplate: "Completed due diligence review of [area].",
		defaultVisibility: "client",
	},
	{
		id: "compliance-check",
		name: "Compliance Check",
		icon: "✅",
		description: "Compliance verification or audit",
		entryType: "work",
		theme: "governance",
		titleTemplate: "Compliance Verification",
		descriptionTemplate:
			"Verified compliance for [area]. Status: [compliant/gaps found]. Remediation: [actions].",
		clientDescriptionTemplate: "Completed compliance review of [area].",
		defaultVisibility: "client",
	},
	{
		id: "internal-note",
		name: "Internal Note",
		icon: "📝",
		description: "Internal note not visible to client",
		entryType: "note",
		theme: "admin",
		titleTemplate: "Internal Note",
		descriptionTemplate: "[Your notes here]",
		defaultVisibility: "internal",
	},
];

const TYPE_COLORS: Record<string, string> = {
	milestone: "bg-yellow-100 text-yellow-800",
	signature: "bg-green-100 text-green-800",
	issue: "bg-red-100 text-red-800",
	document: "bg-blue-100 text-blue-800",
	email: "bg-purple-100 text-purple-800",
	call: "bg-cyan-100 text-cyan-800",
	meeting: "bg-indigo-100 text-indigo-800",
	work: "bg-gray-100 text-gray-800",
	notification: "bg-pink-100 text-pink-800",
	due_item: "bg-orange-100 text-orange-800",
	decision: "bg-emerald-100 text-emerald-800",
	note: "bg-slate-100 text-slate-800",
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function getWeekStarting(date: Date = new Date()): number {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1);
	d.setDate(diff);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

function formatLabel(s: string): string {
	return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(timestamp?: number): string {
	if (!timestamp) return "";
	const seconds = Math.floor((Date.now() - timestamp) / 1000);
	if (seconds < 60) return "just now";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days === 1) return "yesterday";
	if (days < 7) return `${days}d ago`;
	if (days < 30) return `${Math.floor(days / 7)}w ago`;
	return `${Math.floor(days / 30)}mo ago`;
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function JournalDetailPage() {
	const params = useParams();
	const journalId = params.journalId as Id<"clientJournals">;

	const journal = useQuery(api.clientJournals.get, { id: journalId });
	const entries = useQuery(api.journalEntries.listByJournal, { journalId });
	const milestones = useQuery(api.journalEntries.listMilestones, { journalId });
	const chapters = useQuery(api.journalChapters.listByJournal, { journalId });
	const weekStarting = getWeekStarting();
	const narrative = useQuery(api.journalNarratives.getByJournalAndWeek, {
		journalId,
		weekStarting,
	});

	const createNarrative = useMutation(api.journalNarratives.create);
	const updateNarrative = useMutation(api.journalNarratives.update);
	const markReady = useMutation(api.journalNarratives.markReady);
	const createEntry = useMutation(api.journalEntries.create);
	const updateEntryStatus = useMutation(api.journalEntries.updateStatus);

	// Narrative state
	const [narrativeText, setNarrativeText] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (narrative?.narrativeText) {
			setNarrativeText(narrative.narrativeText);
		}
	}, [narrative?.narrativeText]);

	// Entry form state
	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState({
		title: "",
		description: "",
		clientDescription: "",
		outcome: "",
		entryType: "work" as string,
		theme: "admin" as string,
		effortBand: "" as string,
		visibility: "client" as "client" | "internal",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Filter state
	const [filters, setFilters] = useState({
		theme: "all",
		entryType: "all",
		source: "all", // all | auto | manual
		visibility: "all", // all | client | internal
	});

	// Filtered entries
	const filteredEntries = useMemo(() => {
		if (!entries) return [];
		return entries.filter((e) => {
			if (filters.theme !== "all" && e.theme !== filters.theme) return false;
			if (filters.entryType !== "all" && e.entryType !== filters.entryType)
				return false;
			if (filters.source === "auto" && !e.isAutoGenerated) return false;
			if (filters.source === "manual" && e.isAutoGenerated) return false;
			if (filters.visibility === "client" && !e.visibleToClient) return false;
			if (filters.visibility === "internal" && e.visibleToClient) return false;
			return true;
		});
	}, [entries, filters]);

	const visibleEntries = filteredEntries.filter((e) => e.visibleToClient);
	const internalEntries = filteredEntries.filter((e) => !e.visibleToClient);
	const hasActiveFilters = Object.values(filters).some((v) => v !== "all");

	// Action items: entries with dueDate populated
	const now = Date.now();
	const endOfWeek = (() => {
		const d = new Date();
		const day = d.getDay();
		const daysUntilSunday = day === 0 ? 0 : 7 - day;
		d.setDate(d.getDate() + daysUntilSunday);
		d.setHours(23, 59, 59, 999);
		return d.getTime();
	})();

	const actionItems = useMemo(() => {
		if (!entries)
			return { overdue: [], thisWeek: [], upcoming: [], completed: [] };
		const withDue = entries.filter(
			(e) => e.dueDate !== undefined && e.dueDate !== null,
		);
		const isCompleted = (e: (typeof withDue)[number]) =>
			e.status === "completed" || e.status === "canceled";
		const overdue = withDue.filter((e) => !isCompleted(e) && e.dueDate! < now);
		const thisWeek = withDue.filter(
			(e) => !isCompleted(e) && e.dueDate! >= now && e.dueDate! <= endOfWeek,
		);
		const upcoming = withDue.filter(
			(e) => !isCompleted(e) && e.dueDate! > endOfWeek,
		);
		const completed = withDue.filter(isCompleted);
		return { overdue, thisWeek, upcoming, completed };
	}, [entries, now, endOfWeek]);

	const totalActionItems =
		actionItems.overdue.length +
		actionItems.thisWeek.length +
		actionItems.upcoming.length;

	const handleMarkComplete = async (entryId: string) => {
		await updateEntryStatus({
			id: entryId as Id<"journalEntries">,
			status: "completed",
		});
	};

	// Effort distribution by theme
	const effortDistribution = useMemo(() => {
		if (!entries)
			return {
				rows: [],
				totalEffort: 0,
				entriesWithEffort: 0,
				totalEntries: 0,
			};
		const entriesWithEffort = entries.filter((e) => e.effortBand);
		const grouped: Record<string, number> = {};
		for (const entry of entriesWithEffort) {
			const weight = EFFORT_WEIGHTS[entry.effortBand!] ?? 0;
			grouped[entry.theme] = (grouped[entry.theme] ?? 0) + weight;
		}
		const totalEffort = Object.values(grouped).reduce((s, v) => s + v, 0);
		const rows = Object.entries(grouped)
			.map(([theme, effort]) => ({
				theme,
				effort,
				percentage: totalEffort > 0 ? (effort / totalEffort) * 100 : 0,
			}))
			.sort((a, b) => b.effort - a.effort);
		return {
			rows,
			totalEffort,
			entriesWithEffort: entriesWithEffort.length,
			totalEntries: entries.length,
		};
	}, [entries]);

	// ── Handlers ─────────────────────────────────────────────────────────

	const handleCreateNarrative = async () => {
		if (!journal) return;
		await createNarrative({
			journalId: journal._id,
			clientId: journal.clientId,
			weekStarting,
			weekEnding: weekStarting + 6 * 86400000,
			narrativeText: "",
			authorId: "admin",
			authorName: "Account Lead",
		});
	};

	const handleSaveNarrative = async () => {
		if (!narrative) return;
		setIsSaving(true);
		try {
			await updateNarrative({ id: narrative._id, narrativeText });
		} finally {
			setIsSaving(false);
		}
	};

	const handleMarkReady = async () => {
		if (!narrative) return;
		await markReady({ id: narrative._id });
	};

	const handleSubmitEntry = async () => {
		if (!journal || !form.title || !form.description) return;
		setIsSubmitting(true);
		try {
			await createEntry({
				journalId: journal._id,
				clientId: journal.clientId,
				title: form.title,
				description: form.description,
				clientDescription: form.clientDescription || undefined,
				outcome: form.outcome || undefined,
				entryType: form.entryType as (typeof ENTRY_TYPES)[number],
				theme: form.theme as (typeof THEMES)[number],
				status: "completed",
				effortBand: form.effortBand
					? (form.effortBand as (typeof EFFORT_BANDS)[number])
					: undefined,
				performedBy: "account-lead",
				visibleToClient: form.visibility === "client",
				sensitivity: form.visibility === "internal" ? "high" : "low",
				chapter: journal.currentChapter,
				chapterNumber: journal.chapterNumber,
				occurredAt: Date.now(),
			});
			// Reset form
			setForm({
				title: "",
				description: "",
				clientDescription: "",
				outcome: "",
				entryType: "work",
				theme: "admin",
				effortBand: "",
				visibility: "client",
			});
			setShowForm(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	// ── Loading ──────────────────────────────────────────────────────────

	if (journal === undefined || entries === undefined) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="w-8 h-8 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
			</div>
		);
	}

	if (journal === null) {
		return (
			<div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
				<p className="text-gray-500">Journal not found.</p>
			</div>
		);
	}

	// ── Render ───────────────────────────────────────────────────────────

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-semibold text-gray-900">
					{journal.journalType === "transition" ? "Transition" : "Stewardship"}{" "}
					Journal
				</h1>
				<p className="text-sm text-gray-500 mt-1">
					Chapter {journal.chapterNumber}: {journal.currentChapter}
				</p>
				<div className="flex items-center gap-4 mt-2">
					{journal.lastEmailOpenedAt && (
						<span className="text-xs text-gray-500">
							📧 Email opened {timeAgo(journal.lastEmailOpenedAt)}
						</span>
					)}
					{journal.lastFileViewedAt && (
						<span className="text-xs text-gray-500">
							📄 PDF viewed {timeAgo(journal.lastFileViewedAt)}
						</span>
					)}
					{journal.emailOpenCount !== undefined &&
						journal.emailOpenCount > 0 && (
							<span className="text-xs text-gray-400">
								({journal.emailOpenCount} opens)
							</span>
						)}
				</div>
			</div>

			{/* Chapter History */}
			{chapters && chapters.length > 0 && (
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h2 className="text-lg font-medium text-gray-900 mb-4">
						Chapter History
					</h2>
					<div className="relative">
						<div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
						<div className="space-y-4">
							{chapters.map((chapter) => (
								<div
									key={chapter._id}
									className="relative flex items-start gap-4 pl-10"
								>
									<div
										className={`absolute left-2.5 w-3 h-3 rounded-full border-2 z-10 ${
											chapter.status === "active"
												? "bg-orange-500 border-orange-500"
												: chapter.status === "completed"
													? "bg-green-500 border-green-500"
													: "bg-white border-gray-300"
										}`}
									/>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium text-gray-900">
												Chapter {chapter.chapterNumber}: {chapter.title}
											</span>
											<span
												className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
													chapter.status === "active"
														? "bg-orange-100 text-orange-800"
														: chapter.status === "completed"
															? "bg-green-100 text-green-800"
															: "bg-gray-100 text-gray-600"
												}`}
												>
													{chapter.status}
												</span>
											{chapter.closeSummaryGenerated && (
												<span className="text-xs text-green-600">
													✓ Close summary generated
												</span>
											)}
										</div>
										{chapter.description && (
											<p className="text-xs text-gray-500 mt-0.5">
												{chapter.description}
											</p>
										)}
										<div className="flex items-center gap-3 mt-1">
											{chapter.startedAt && (
												<span className="text-xs text-gray-400">
													Started {new Date(chapter.startedAt).toLocaleDateString()}
												</span>
											)}
											{chapter.completedAt && (
												<span className="text-xs text-gray-400">
													Completed {new Date(chapter.completedAt).toLocaleDateString()}
												</span>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Milestone Progress */}
			<MilestoneProgress milestones={milestones ?? []} />

			{/* Narrative Editor */}
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<h2 className="text-lg font-medium text-gray-900 mb-4">
					Weekly Narrative — Week of{" "}
					{new Date(weekStarting).toLocaleDateString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
					})}
				</h2>

				{narrative === undefined ? (
					<div className="animate-pulse h-32 bg-gray-100 rounded" />
				) : narrative === null ? (
					<div className="text-center py-8">
						<p className="text-gray-500 mb-4">
							No narrative for this week yet.
						</p>
						<button
							type="button"
							onClick={handleCreateNarrative}
							className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
						>
							Create Narrative
						</button>
					</div>
				) : (
					<div className="space-y-4">
						<RichTextEditor
							value={narrativeText}
							onChange={setNarrativeText}
							placeholder="Write the weekly narrative for the client..."
						/>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={handleSaveNarrative}
								disabled={isSaving}
								className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50"
							>
								{isSaving ? "Saving..." : "Save Draft"}
							</button>
							<button
								type="button"
								onClick={handleMarkReady}
								disabled={
									narrative.status === "ready" || narrative.status === "sent"
								}
								className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
							>
								{narrative.status === "ready"
									? "Ready to Send ✓"
									: narrative.status === "sent"
										? "Sent ✓"
										: "Mark Ready to Send"}
							</button>
							<span className="text-sm text-gray-800">
								Status: {narrative.status}
							</span>
						</div>
					</div>
				)}
			</div>

			{/* Manual Entry Form */}
			<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<button
					type="button"
					onClick={() => setShowForm(!showForm)}
					className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
				>
					<span className="text-lg font-medium text-gray-900">
						Add Manual Entry
					</span>
					<span className="text-gray-400">{showForm ? "▲" : "▼"}</span>
				</button>

				{showForm && (
					<div className="px-6 pb-6 space-y-4 border-t border-gray-100">
						{/* Template Selector */}
						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-800 mb-2">
								Quick Templates
							</label>
							<div className="flex flex-wrap gap-2">
								{ENTRY_TEMPLATES.map((template) => (
									<button
										key={template.id}
										type="button"
										onClick={() =>
											setForm({
												...form,
												title: template.titleTemplate,
												description: template.descriptionTemplate,
												clientDescription:
													template.clientDescriptionTemplate || "",
												entryType: template.entryType,
												theme: template.theme,
												visibility: template.defaultVisibility,
											})
										}
										className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition-colors text-gray-800"
										title={template.description}
									>
										{template.icon} {template.name}
									</button>
								))}
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4 mt-4">
							<div>
								<label className="block text-sm font-medium text-gray-800 mb-1">
									Title *
								</label>
								<input
									type="text"
									value={form.title}
									onChange={(e) => setForm({ ...form, title: e.target.value })}
									placeholder="e.g., Met with Trustee"
									className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-800 mb-1">
									Visibility
								</label>
								<div className="flex gap-4 mt-2">
									<label className="flex items-center gap-2">
										<input
											type="radio"
											name="visibility"
											value="client"
											checked={form.visibility === "client"}
											onChange={() =>
												setForm({ ...form, visibility: "client" })
											}
											className="text-orange-500"
										/>
										<span className="text-sm text-gray-800">
											Client-visible
										</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="radio"
											name="visibility"
											value="internal"
											checked={form.visibility === "internal"}
											onChange={() =>
												setForm({ ...form, visibility: "internal" })
											}
											className="text-orange-500"
										/>
										<span className="text-sm text-gray-800">Internal only</span>
									</label>
								</div>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-800 mb-1">
								Description *
							</label>
							<textarea
								value={form.description}
								onChange={(e) =>
									setForm({ ...form, description: e.target.value })
								}
								placeholder="Full internal detail..."
								rows={3}
								className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
							/>
						</div>

						{form.visibility === "client" && (
							<div>
								<label className="block text-sm font-medium text-gray-800 mb-1">
									Client Description
								</label>
								<textarea
									value={form.clientDescription}
									onChange={(e) =>
										setForm({ ...form, clientDescription: e.target.value })
									}
									placeholder="What the client sees (if different from description)..."
									rows={2}
									className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-500"
								/>
							</div>
						)}

						<div>
							<label className="block text-sm font-medium text-gray-800 mb-1">
								Outcome / Value
							</label>
							<input
								type="text"
								value={form.outcome}
								onChange={(e) => setForm({ ...form, outcome: e.target.value })}
								placeholder='e.g., "Identified $47K in tax savings"'
								className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
							/>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-800 mb-1">
									Type
								</label>
								<select
									value={form.entryType}
									onChange={(e) =>
										setForm({ ...form, entryType: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
								>
									{ENTRY_TYPES.map((t) => (
										<option key={t} value={t}>
											{formatLabel(t)}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-800 mb-1">
									Theme
								</label>
								<select
									value={form.theme}
									onChange={(e) => setForm({ ...form, theme: e.target.value })}
									className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
								>
									{THEMES.map((t) => (
										<option key={t} value={t}>
											{formatLabel(t)}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-800 mb-1">
									Effort
								</label>
								<select
									value={form.effortBand}
									onChange={(e) =>
										setForm({ ...form, effortBand: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
								>
									<option value="">Not set</option>
									{EFFORT_BANDS.map((b) => (
										<option key={b} value={b}>
											{formatLabel(b)}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="flex justify-end">
							<button
								type="button"
								onClick={handleSubmitEntry}
								disabled={isSubmitting || !form.title || !form.description}
								className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
							>
								{isSubmitting ? "Saving..." : "Add Entry"}
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Entry Filters */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<div className="flex items-center gap-4 flex-wrap">
					<span className="text-sm font-medium text-gray-800">Filter:</span>
					<select
						value={filters.theme}
						onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
						className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
					>
						<option value="all">All themes</option>
						{THEMES.map((t) => (
							<option key={t} value={t}>
								{formatLabel(t)}
							</option>
						))}
					</select>
					<select
						value={filters.entryType}
						onChange={(e) =>
							setFilters({ ...filters, entryType: e.target.value })
						}
						className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
					>
						<option value="all">All types</option>
						{ENTRY_TYPES.map((t) => (
							<option key={t} value={t}>
								{formatLabel(t)}
							</option>
						))}
					</select>
					<select
						value={filters.source}
						onChange={(e) => setFilters({ ...filters, source: e.target.value })}
						className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
					>
						<option value="all">All sources</option>
						<option value="auto">Auto-generated</option>
						<option value="manual">Manual</option>
					</select>
					<select
						value={filters.visibility}
						onChange={(e) =>
							setFilters({ ...filters, visibility: e.target.value })
						}
						className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900"
					>
						<option value="all">All visibility</option>
						<option value="client">Client-visible</option>
						<option value="internal">Internal only</option>
					</select>
					{hasActiveFilters && (
						<button
							type="button"
							onClick={() =>
								setFilters({
									theme: "all",
									entryType: "all",
									source: "all",
									visibility: "all",
								})
							}
							className="px-3 py-1.5 text-sm text-orange-600 hover:text-orange-800"
						>
							Clear filters
						</button>
					)}
					<span className="text-sm text-gray-600 ml-auto">
						{filteredEntries.length} of {entries?.length ?? 0} entries
					</span>
				</div>
			</div>

			{/* Action Items */}
			{totalActionItems > 0 && (
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h2 className="text-lg font-medium text-gray-900 mb-4">
						Action Items ({totalActionItems})
					</h2>
					<div className="space-y-6">
						{actionItems.overdue.length > 0 && (
							<div>
								<h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
									<span className="inline-block w-2 h-2 rounded-full bg-red-500" />
									Overdue ({actionItems.overdue.length})
								</h3>
								<div className="space-y-2">
									{actionItems.overdue.map((entry) => (
										<ActionItemRow
											key={entry._id}
											entry={entry}
											isOverdue
											onMarkComplete={handleMarkComplete}
										/>
									))}
								</div>
							</div>
						)}
						{actionItems.thisWeek.length > 0 && (
							<div>
								<h3 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
									<span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
									Due This Week ({actionItems.thisWeek.length})
								</h3>
								<div className="space-y-2">
									{actionItems.thisWeek.map((entry) => (
										<ActionItemRow
											key={entry._id}
											entry={entry}
											onMarkComplete={handleMarkComplete}
										/>
									))}
								</div>
							</div>
						)}
						{actionItems.upcoming.length > 0 && (
							<div>
								<h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
									<span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
									Upcoming ({actionItems.upcoming.length})
								</h3>
								<div className="space-y-2">
									{actionItems.upcoming.map((entry) => (
										<ActionItemRow
											key={entry._id}
											entry={entry}
											onMarkComplete={handleMarkComplete}
										/>
									))}
								</div>
							</div>
						)}
					</div>
					{actionItems.completed && actionItems.completed.length > 0 && (
						<details className="mt-4 pt-4 border-t border-gray-100">
							<summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
								Completed ({actionItems.completed.length})
							</summary>
							<div className="mt-2 space-y-2">
								{actionItems.completed.map((entry) => (
									<ActionItemRow
										key={entry._id}
										entry={entry}
										onMarkComplete={handleMarkComplete}
									/>
								))}
							</div>
						</details>
					)}
				</div>
			)}

			{/* Client-Visible Entries */}
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<h2 className="text-lg font-medium text-gray-900 mb-4">
					Client-Visible Entries ({visibleEntries.length})
				</h2>

				{visibleEntries.length === 0 ? (
					<p className="text-gray-500 text-center py-4">
						{hasActiveFilters
							? "No entries match the current filters."
							: "No client-visible entries yet."}
					</p>
				) : (
					<div className="space-y-3">
						{visibleEntries.map((entry) => (
							<EntryCard key={entry._id} entry={entry} />
						))}
					</div>
				)}
			</div>

			{/* Internal Entries */}
			{internalEntries.length > 0 && (
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h2 className="text-lg font-medium text-gray-900 mb-4">
						Internal Only ({internalEntries.length})
					</h2>
					<div className="space-y-3">
						{internalEntries.map((entry) => (
							<EntryCard key={entry._id} entry={entry} />
						))}
					</div>
				</div>
			)}

			{/* Effort Distribution */}
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<h2 className="text-lg font-medium text-gray-900 mb-4">
					Effort Distribution
				</h2>
				{effortDistribution.rows.length === 0 ? (
					<p className="text-gray-500 text-center py-4">
						No entries with effort bands set.
					</p>
				) : (
					<div className="space-y-3">
						{effortDistribution.rows.map((row) => (
							<div key={row.theme} className="flex items-center gap-3">
								<span className="w-32 text-sm text-gray-800 text-right shrink-0">
									{formatLabel(row.theme)}
								</span>
								<div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
									<div
										className="h-full rounded-full transition-all duration-500"
										style={{
											width: `${row.percentage}%`,
											backgroundColor: THEME_COLORS[row.theme] ?? "#6b7280",
											minWidth: row.percentage > 0 ? "2rem" : undefined,
										}}
									/>
								</div>
								<span className="w-24 text-sm text-gray-900 shrink-0">
									{row.effort} ({Math.round(row.percentage)}%)
								</span>
							</div>
						))}
					</div>
				)}
				<div className="mt-4 pt-4 border-t border-gray-100">
					<p className="text-sm text-gray-800">
						{effortDistribution.entriesWithEffort} of{" "}
						{effortDistribution.totalEntries} entries have effort set
						{effortDistribution.totalEffort > 0 && (
							<span className="text-gray-900 font-medium">
								{" · Total effort: "}
								{effortDistribution.totalEffort}
							</span>
						)}
					</p>
				</div>
			</div>
		</div>
	);
}

// ── Milestone Progress ───────────────────────────────────────────────────────

function MilestoneProgress({
	milestones,
}: {
	milestones: {
		_id: string;
		title: string;
		status: string;
		occurredAt: number;
	}[];
}) {
	if (milestones.length === 0) return null;

	const total = milestones.length;
	const completed = milestones.filter((m) => m.status === "completed").length;
	const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6">
			<h2 className="text-lg font-medium text-gray-900 mb-4">
				Milestone Progress
			</h2>
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-gray-800">
						{completed} of {total} milestones completed
					</span>
					<span className="text-sm font-medium text-gray-900">
						{percentage}%
					</span>
				</div>
				<div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
					<div
						className="h-full bg-orange-500 rounded-full transition-all duration-500"
						style={{ width: `${percentage}%` }}
					/>
				</div>
			</div>
			<div className="relative">
				<div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200" />
				<div className="relative flex items-start justify-between">
					{milestones.map((milestone) => {
						const isCompleted = milestone.status === "completed";
						return (
							<div
								key={milestone._id}
								className="flex flex-col items-center"
								style={{ flex: 1 }}
							>
								<div
									className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${
										isCompleted
											? "bg-orange-500 border-orange-500"
											: "bg-white border-gray-300"
									}`}
								>
									{isCompleted && (
										<svg
											className="w-3.5 h-3.5 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={3}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									)}
								</div>
								<div className="mt-2 text-center max-w-[120px]">
									<p className="text-xs font-medium text-gray-900 leading-tight">
										{milestone.title}
									</p>
									<p className="text-xs text-gray-500 mt-0.5">
										{new Date(milestone.occurredAt).toLocaleDateString(
											"en-US",
											{
												month: "short",
												day: "numeric",
											},
										)}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

// ── Entry Card ──────────────────────────────────────────────────────────────

function EntryCard({
	entry,
}: {
	entry: {
		_id: string;
		entryType: string;
		theme: string;
		title: string;
		description: string;
		clientDescription?: string;
		outcome?: string;
		isAutoGenerated: boolean;
		occurredAt: number;
		status: string;
		effortBand?: string;
	};
}) {
	return (
		<div
			className={`p-4 rounded-lg border ${
				entry.isAutoGenerated
					? "border-blue-100 bg-blue-50"
					: "border-gray-200 bg-white"
			}`}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-center gap-2 flex-wrap">
						<span
							className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
								TYPE_COLORS[entry.entryType] || "bg-gray-100 text-gray-800"
							}`}
						>
							{formatLabel(entry.entryType)}
						</span>
						<span className="text-xs text-gray-500">
							{formatLabel(entry.theme)}
						</span>
						{entry.isAutoGenerated && (
							<span className="text-xs text-blue-600">auto</span>
						)}
						{entry.effortBand && (
							<span className="text-xs text-gray-400">
								effort: {entry.effortBand}
							</span>
						)}
						<span
							className={`text-xs ${
								entry.status === "completed"
									? "text-green-600"
									: entry.status === "blocked"
										? "text-red-600"
										: "text-gray-400"
							}`}
						>
							{entry.status}
						</span>
					</div>
					<p className="mt-1 font-medium text-gray-900">{entry.title}</p>
					<p className="mt-1 text-sm text-gray-600">
						{entry.clientDescription || entry.description}
					</p>
					{entry.outcome && (
						<p className="mt-2 text-sm font-medium text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded">
							→ {entry.outcome}
						</p>
					)}
				</div>
				<span className="text-xs text-gray-400 ml-4">
					{new Date(entry.occurredAt).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					})}
				</span>
			</div>
		</div>
	);
}

// ── Action Item Row ─────────────────────────────────────────────────────────

function ActionItemRow({
	entry,
	isOverdue = false,
	onMarkComplete,
}: {
	entry: {
		_id: string;
		title: string;
		description: string;
		dueDate?: number;
		dueFrom?: string[];
		status: string;
	};
	isOverdue?: boolean;
	onMarkComplete: (id: string) => void;
}) {
	const isDone = entry.status === "completed" || entry.status === "canceled";
	const formattedDate = entry.dueDate
		? new Date(entry.dueDate).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: "—";
	const assignee = entry.dueFrom?.[0] ?? null;

	return (
		<div
			className={`flex items-center gap-4 p-3 rounded-lg border ${
				isDone
					? "border-gray-100 bg-gray-50"
					: isOverdue
						? "border-red-200 bg-red-50"
						: "border-gray-200 bg-white"
			}`}
		>
			<div className="flex-1 min-w-0">
				<p
					className={`font-medium ${isDone ? "text-gray-500 line-through" : "text-gray-900"}`}
				>
					{entry.title}
				</p>
				<div className="flex items-center gap-3 mt-1">
					<span
						className={`text-sm ${
							isOverdue && !isDone
								? "text-red-600 font-medium"
								: "text-gray-800"
						}`}
					>
						{formattedDate}
					</span>
					{assignee && (
						<span className="text-sm text-gray-800">· {assignee}</span>
					)}
					<span
						className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
							isDone
								? "bg-green-100 text-green-800"
								: entry.status === "blocked"
									? "bg-red-100 text-red-800"
									: entry.status === "in_progress"
										? "bg-blue-100 text-blue-800"
										: "bg-amber-100 text-amber-800"
						}`}
					>
						{isDone ? "Completed" : formatLabel(entry.status)}
					</span>
				</div>
			</div>
			{!isDone && (
				<button
					type="button"
					onClick={() => onMarkComplete(entry._id)}
					className="shrink-0 px-3 py-1.5 text-sm border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
				>
					✓ Complete
				</button>
			)}
		</div>
	);
}
