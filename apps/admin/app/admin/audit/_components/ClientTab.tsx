"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface ClientEvent {
	id: string;
	occurredAt: number;
	eventType: string;
	category: string;
	severity: "info" | "warning" | "critical";
	summary: string;
	actorLabel: string;
	publicMetadata?: Record<string, unknown>;
	links?: Array<{ label: string; type: string; href?: string }>;
}

const CATEGORY_ICONS: Record<string, string> = {
	deal: "🤝",
	task: "📋",
	document: "📄",
	email: "📧",
	agent: "🤖",
	auth: "🔐",
	system: "⚙️",
	journal: "📔",
	tracker: "🗓️",
	box: "📦",
	client: "👤",
};

function formatTime(ts: number) {
	return new Date(ts).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function ClientTab() {
	const [selectedCompanyId, setSelectedCompanyId] =
		useState<Id<"crmCompanies"> | null>(null);
	const [severityFilter, setSeverityFilter] = useState("");

	// Fetch companies list for the dropdown
	const companies = useQuery(api.crmCompanies.list, {});

	const result = useQuery(
		api.businessLog.listClientPreview,
		selectedCompanyId
			? {
					companyId: selectedCompanyId,
					limit: 25,
					severity: severityFilter || undefined,
				}
			: "skip",
	);

	return (
		<div>
			{/* Company selector */}
			<div
				style={{
					display: "flex",
					gap: "0.75rem",
					flexWrap: "wrap",
					marginBottom: "1.5rem",
				}}
			>
				<select
					className="filter-select"
					value={selectedCompanyId ?? ""}
					onChange={(e) =>
						setSelectedCompanyId(
							(e.target.value || null) as Id<"crmCompanies"> | null,
						)
					}
				>
					<option value="">Select a company...</option>
					{companies?.map((c: { _id: string; name: string }) => (
						<option key={c._id} value={c._id}>
							{c.name}
						</option>
					))}
				</select>

				<select
					className="filter-select"
					value={severityFilter}
					onChange={(e) => setSeverityFilter(e.target.value)}
				>
					<option value="">All Severities</option>
					<option value="info">Info</option>
					<option value="warning">Warning</option>
					<option value="critical">Critical</option>
				</select>
			</div>

			{/* Read-only notice */}
			{selectedCompanyId && (
				<div
					style={{
						fontFamily: "var(--font-dm-mono)",
						fontSize: "0.7rem",
						color: "var(--text-secondary)",
						marginBottom: "1rem",
						padding: "0.5rem 0.75rem",
						background: "var(--shadow-color)",
						borderRadius: "6px",
						border: "1px solid var(--border-subtle)",
					}}
				>
					Preview mode — this is exactly what the client sees, with all internal
					data stripped.
				</div>
			)}

			{!selectedCompanyId ? (
				<div className="admin-empty-state">
					Select a company to preview the client feed
				</div>
			) : !result ? (
				<div className="admin-loading">Loading client preview...</div>
			) : (
				<div
					style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
				>
					{result.items.length === 0 ? (
						<div className="admin-empty-state">
							No client-visible events for this company
						</div>
					) : (
						result.items.map((event: ClientEvent) => (
							<div
								key={event.id}
								style={{
									background: "var(--bg-glass)",
									border: "1px solid var(--border-subtle)",
									borderRadius: "8px",
									padding: "1rem",
									borderLeft: `3px solid ${
										event.severity === "critical"
											? "var(--color-error)"
											: event.severity === "warning"
												? "var(--color-warning)"
												: "var(--color-success)"
									}`,
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.75rem",
									}}
								>
									<span style={{ fontSize: "1.25rem", flexShrink: 0 }}>
										{CATEGORY_ICONS[event.category] ?? "📌"}
									</span>
									<div style={{ flex: 1 }}>
										<div
											style={{
												fontFamily: "var(--font-inter)",
												fontSize: "0.875rem",
												color: "var(--text-primary)",
											}}
										>
											{event.summary}
										</div>
										<div
											style={{
												fontFamily: "var(--font-dm-mono)",
												fontSize: "0.65rem",
												color: "var(--text-secondary)",
												marginTop: "0.125rem",
											}}
										>
											by {event.actorLabel} · {formatTime(event.occurredAt)}
										</div>
									</div>
									{event.links?.map((link, i) => (
										<a
											key={i}
											href={link.href ?? "#"}
											style={{
												fontFamily: "var(--font-dm-mono)",
												fontSize: "0.65rem",
												color: "var(--color-success)",
												background: "var(--color-success-bg)",
												padding: "0.25rem 0.5rem",
												borderRadius: "4px",
												textDecoration: "none",
											}}
										>
											{link.label}
										</a>
									))}
								</div>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
}
