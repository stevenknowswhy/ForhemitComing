"use client";

import { useState, useEffect, useCallback } from "react";

interface AuditEvent {
	id: string;
	company_id: string | null;
	task_id: string | null;
	document_type: string;
	action: string;
	actor: string;
	metadata: unknown;
	created_at: string;
}

interface AuditStats {
	total: number;
	generated: number;
	uploaded: number;
	shared: number;
	signed: number;
	viewed: number;
	downloaded: number;
}

interface RetentionPolicy {
	id: string;
	document_type: string;
	retention_days: number;
	description: string;
	auto_delete: boolean;
}

const ACTION_COLORS: Record<string, string> = {
	generated: "#10b981",
	uploaded: "#3b82f6",
	shared: "#8b5cf6",
	signed: "#f59e0b",
	declined: "#ef4444",
	expired: "#6b7280",
	viewed: "#06b6d4",
	downloaded: "#14b8a6",
	emailed: "#ec4899",
};

function formatDate(iso: string): string {
	return new Date(iso).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function CompliancePage() {
	const [events, setEvents] = useState<AuditEvent[] | null>(null);
	const [stats, setStats] = useState<AuditStats | null>(null);
	const [policies, setPolicies] = useState<RetentionPolicy[] | null>(null);
	const [filter, setFilter] = useState<string>("all");
	const [days, setDays] = useState(90);
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const [auditResp, retentionResp] = await Promise.all([
				fetch(
					`/api/ghost/audit?limit=200&days=${days}${filter !== "all" ? `&action=${filter}` : ""}`,
				),
				fetch("/api/ghost/retention"),
			]);

			const auditData = await auditResp.json();
			const retentionData = await retentionResp.json();

			if (auditData.success) {
				setEvents(auditData.events);
				setStats(auditData.stats);
			}
			if (retentionData.success) {
				setPolicies(retentionData.policies);
			}
		} catch (err) {
			console.error("Failed to load compliance data:", err);
		} finally {
			setLoading(false);
		}
	}, [days, filter]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div style={{ fontFamily: "Jost, sans-serif", maxWidth: "1200px" }}>
			<div style={{ marginBottom: "32px" }}>
				<h1
					style={{
						fontSize: "24px",
						fontWeight: 600,
						color: "#1B2A4A",
						marginBottom: "4px",
					}}
				>
					Compliance & Audit
				</h1>
				<p style={{ color: "#6b7280", fontSize: "14px" }}>
					SOC 2 audit trail, document retention policies, and compliance events.
				</p>
			</div>

			{/* Stats cards */}
			{stats && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
						gap: "12px",
						marginBottom: "24px",
					}}
				>
					{[
						{ label: "Total Events", value: stats.total, color: "#1B2A4A" },
						{
							label: "Generated",
							value: stats.generated,
							color: ACTION_COLORS.generated,
						},
						{
							label: "Uploaded",
							value: stats.uploaded,
							color: ACTION_COLORS.uploaded,
						},
						{
							label: "Shared",
							value: stats.shared,
							color: ACTION_COLORS.shared,
						},
						{
							label: "Signed",
							value: stats.signed,
							color: ACTION_COLORS.signed,
						},
						{
							label: "Viewed",
							value: stats.viewed,
							color: ACTION_COLORS.viewed,
						},
					].map((card) => (
						<div
							key={card.label}
							style={{
								padding: "16px",
								border: "1px solid #e5e7eb",
								borderRadius: "8px",
								background: "white",
							}}
						>
							<div
								style={{ fontSize: "24px", fontWeight: 700, color: card.color }}
							>
								{card.value}
							</div>
							<div
								style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}
							>
								{card.label}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Filters */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					marginBottom: "16px",
					flexWrap: "wrap",
				}}
			>
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					style={{
						padding: "8px 12px",
						border: "1px solid #e5e7eb",
						borderRadius: "6px",
						fontSize: "13px",
						background: "white",
					}}
				>
					<option value="all">All actions</option>
					<option value="generated">Generated</option>
					<option value="uploaded">Uploaded</option>
					<option value="shared">Shared</option>
					<option value="signed">Signed</option>
					<option value="viewed">Viewed</option>
					<option value="downloaded">Downloaded</option>
				</select>

				<select
					value={days}
					onChange={(e) => setDays(parseInt(e.target.value))}
					style={{
						padding: "8px 12px",
						border: "1px solid #e5e7eb",
						borderRadius: "6px",
						fontSize: "13px",
						background: "white",
					}}
				>
					<option value={7}>Last 7 days</option>
					<option value={30}>Last 30 days</option>
					<option value={90}>Last 90 days</option>
					<option value={365}>Last year</option>
					<option value={2555}>Last 7 years</option>
				</select>

				<button
					type="button"
					onClick={fetchData}
					style={{
						padding: "8px 16px",
						background: "#1B2A4A",
						color: "white",
						border: "none",
						borderRadius: "6px",
						fontSize: "13px",
						cursor: "pointer",
					}}
				>
					Refresh
				</button>
			</div>

			{/* Audit log table */}
			{loading && (
				<div style={{ textAlign: "center", padding: "48px", color: "#6b7280" }}>
					Loading audit log…
				</div>
			)}

			{events && events.length > 0 && (
				<div
					style={{
						border: "1px solid #e5e7eb",
						borderRadius: "8px",
						overflow: "hidden",
						marginBottom: "32px",
					}}
				>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr
								style={{
									background: "#f9fafb",
									borderBottom: "1px solid #e5e7eb",
								}}
							>
								{["Time", "Action", "Document", "Actor", "Company"].map((h) => (
									<th
										key={h}
										style={{
											padding: "10px 14px",
											textAlign: "left",
											fontSize: "11px",
											fontWeight: 600,
											color: "#6b7280",
											textTransform: "uppercase",
											letterSpacing: "0.05em",
										}}
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{events.map((ev) => (
								<tr key={ev.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
									<td
										style={{
											padding: "10px 14px",
											fontSize: "13px",
											color: "#6b7280",
										}}
									>
										{formatDate(ev.created_at)}
									</td>
									<td style={{ padding: "10px 14px" }}>
										<span
											style={{
												display: "inline-block",
												padding: "2px 8px",
												borderRadius: "4px",
												fontSize: "12px",
												fontWeight: 500,
												background: `${ACTION_COLORS[ev.action] || "#6b7280"}15`,
												color: ACTION_COLORS[ev.action] || "#6b7280",
											}}
										>
											{ev.action}
										</span>
									</td>
									<td
										style={{
											padding: "10px 14px",
											fontSize: "13px",
											color: "#1f2937",
										}}
									>
										{ev.document_type}
									</td>
									<td
										style={{
											padding: "10px 14px",
											fontSize: "13px",
											color: "#6b7280",
										}}
									>
										{ev.actor}
									</td>
									<td
										style={{
											padding: "10px 14px",
											fontSize: "13px",
											color: "#6b7280",
											fontFamily: "DM Mono, monospace",
										}}
									>
										{ev.company_id ? ev.company_id.slice(0, 8) + "…" : "—"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{events && events.length === 0 && !loading && (
				<div style={{ textAlign: "center", padding: "48px" }}>
					<div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
					<h2
						style={{ fontSize: "18px", color: "#1B2A4A", marginBottom: "8px" }}
					>
						No audit events
					</h2>
					<p style={{ color: "#6b7280", fontSize: "14px" }}>
						Audit events will appear here as documents are generated, shared,
						and signed.
					</p>
				</div>
			)}

			{/* Retention policies */}
			{policies && policies.length > 0 && (
				<div>
					<h2
						style={{
							fontSize: "18px",
							fontWeight: 600,
							color: "#1B2A4A",
							marginBottom: "16px",
						}}
					>
						Retention Policies
					</h2>
					<div
						style={{
							border: "1px solid #e5e7eb",
							borderRadius: "8px",
							overflow: "hidden",
						}}
					>
						<table style={{ width: "100%", borderCollapse: "collapse" }}>
							<thead>
								<tr
									style={{
										background: "#f9fafb",
										borderBottom: "1px solid #e5e7eb",
									}}
								>
									{[
										"Document Type",
										"Retention",
										"Auto-Delete",
										"Description",
									].map((h) => (
										<th
											key={h}
											style={{
												padding: "10px 14px",
												textAlign: "left",
												fontSize: "11px",
												fontWeight: 600,
												color: "#6b7280",
												textTransform: "uppercase",
												letterSpacing: "0.05em",
											}}
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{policies.map((p) => (
									<tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
										<td
											style={{
												padding: "10px 14px",
												fontSize: "13px",
												color: "#1f2937",
												fontWeight: 500,
											}}
										>
											{p.document_type}
										</td>
										<td
											style={{
												padding: "10px 14px",
												fontSize: "13px",
												color: "#6b7280",
											}}
										>
											{p.retention_days >= 365
												? `${Math.round(p.retention_days / 365)} years`
												: `${p.retention_days} days`}
										</td>
										<td style={{ padding: "10px 14px", fontSize: "13px" }}>
											<span
												style={{
													display: "inline-block",
													padding: "2px 8px",
													borderRadius: "4px",
													fontSize: "12px",
													background: p.auto_delete ? "#fef2f2" : "#f0fdf4",
													color: p.auto_delete ? "#ef4444" : "#16a34a",
												}}
											>
												{p.auto_delete ? "Yes" : "No"}
											</span>
										</td>
										<td
											style={{
												padding: "10px 14px",
												fontSize: "13px",
												color: "#6b7280",
											}}
										>
											{p.description}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
