"use client";

import { useState } from "react";

interface EventLink {
	label: string;
	type: string;
	href?: string;
	clientVisible?: boolean;
}

interface BusinessEvent {
	_id: string;
	_creationTime: number;
	eventType: string;
	category: string;
	severity: "info" | "warning" | "critical";
	summary: string;
	clientSummary?: string;
	actorLabel?: string;
	clientActorLabel?: string;
	occurredAt: number;
	metadata?: Record<string, unknown>;
	publicMetadata?: Record<string, unknown>;
	links?: EventLink[];
	retentionClass: string;
	source: string;
	visibility: string;
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

const SEVERITY_COLORS: Record<string, string> = {
	info: "var(--color-success)",
	warning: "var(--color-warning)",
	critical: "var(--color-error)",
};

function formatTime(ts: number) {
	return new Date(ts).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function timeAgo(ts: number) {
	const diff = Date.now() - ts;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}

interface EventRowProps {
	event: BusinessEvent;
	showClientSummary?: boolean;
}

export default function EventRow({
	event,
	showClientSummary = false,
}: EventRowProps) {
	const [expanded, setExpanded] = useState(false);

	const icon = CATEGORY_ICONS[event.category] ?? "📌";
	const severityColor =
		SEVERITY_COLORS[event.severity] ?? "var(--text-secondary)";

	return (
		<div
			className="event-row"
			style={{
				background: "var(--bg-glass)",
				border: "1px solid var(--border-subtle)",
				borderRadius: "8px",
				padding: "1rem",
				cursor: "pointer",
				transition: "all 0.2s ease",
				borderLeft: `3px solid ${severityColor}`,
			}}
			onClick={() => setExpanded(!expanded)}
		>
			{/* Main row */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.75rem",
				}}
			>
				{/* Category icon */}
				<span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{icon}</span>

				{/* Summary */}
				<div style={{ flex: 1, minWidth: 0 }}>
					<div
						style={{
							fontFamily: "var(--font-inter), 'Inter', sans-serif",
							fontSize: "0.875rem",
							color: "var(--text-primary)",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{event.summary}
					</div>
					{showClientSummary && event.clientSummary && (
						<div
							style={{
								fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
								fontSize: "0.7rem",
								color: "var(--text-secondary)",
								marginTop: "0.125rem",
							}}
						>
							Client: {event.clientSummary}
						</div>
					)}
				</div>

				{/* Actor */}
				<span
					style={{
						fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
						fontSize: "0.7rem",
						color: "var(--text-secondary)",
						flexShrink: 0,
					}}
				>
					{event.actorLabel ?? "System"}
				</span>

				{/* Severity badge */}
				{event.severity !== "info" && (
					<span
						style={{
							display: "inline-flex",
							alignItems: "center",
							padding: "0.125rem 0.5rem",
							fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
							fontSize: "0.6rem",
							textTransform: "uppercase",
							letterSpacing: "0.05em",
							color: severityColor,
							background: "var(--shadow-color)",
							borderRadius: "4px",
							flexShrink: 0,
						}}
					>
						{event.severity}
					</span>
				)}

				{/* Time */}
				<span
					style={{
						fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
						fontSize: "0.7rem",
						color: "var(--text-secondary)",
						flexShrink: 0,
						minWidth: "70px",
						textAlign: "right",
					}}
				>
					{timeAgo(event.occurredAt ?? event._creationTime)}
				</span>
			</div>

			{/* Expanded detail */}
			{expanded && (
				<div
					style={{
						marginTop: "1rem",
						paddingTop: "1rem",
						borderTop: "1px solid var(--border-subtle)",
					}}
				>
					{/* Metadata grid */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "0.5rem",
							marginBottom: "0.75rem",
						}}
					>
						<div
							style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem" }}
						>
							<span style={{ color: "var(--text-secondary)" }}>Type: </span>
							<span style={{ color: "var(--text-primary)" }}>
								{event.eventType}
							</span>
						</div>
						<div
							style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem" }}
						>
							<span style={{ color: "var(--text-secondary)" }}>Category: </span>
							<span style={{ color: "var(--text-primary)" }}>
								{event.category}
							</span>
						</div>
						<div
							style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem" }}
						>
							<span style={{ color: "var(--text-secondary)" }}>Source: </span>
							<span style={{ color: "var(--text-primary)" }}>
								{event.source}
							</span>
						</div>
						<div
							style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem" }}
						>
							<span style={{ color: "var(--text-secondary)" }}>
								Visibility:{" "}
							</span>
							<span style={{ color: "var(--text-primary)" }}>
								{event.visibility}
							</span>
						</div>
						<div
							style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem" }}
						>
							<span style={{ color: "var(--text-secondary)" }}>Occurred: </span>
							<span style={{ color: "var(--text-primary)" }}>
								{formatTime(event.occurredAt ?? event._creationTime)}
							</span>
						</div>
						<div
							style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem" }}
						>
							<span style={{ color: "var(--text-secondary)" }}>
								Retention:{" "}
							</span>
							<span style={{ color: "var(--text-primary)" }}>
								{event.retentionClass}
							</span>
						</div>
					</div>

					{/* Client summary comparison */}
					{event.clientSummary && event.clientSummary !== event.summary && (
						<div
							style={{
								marginBottom: "0.75rem",
								padding: "0.5rem",
								background: "var(--color-info-bg)",
								borderRadius: "4px",
								fontFamily: "var(--font-dm-mono)",
								fontSize: "0.7rem",
							}}
						>
							<span style={{ color: "var(--text-secondary)" }}>
								Client sees:{" "}
							</span>
							<span style={{ color: "var(--color-info)" }}>
								{event.clientSummary}
							</span>
						</div>
					)}

					{/* Metadata JSON */}
					{event.metadata && (
						<pre
							style={{
								fontFamily: "var(--font-dm-mono)",
								fontSize: "0.65rem",
								color: "var(--text-secondary)",
								background: "var(--shadow-color)",
								padding: "0.75rem",
								borderRadius: "4px",
								overflow: "auto",
								maxHeight: "200px",
								margin: 0,
							}}
						>
							{JSON.stringify(event.metadata, null, 2)}
						</pre>
					)}

					{/* Links */}
					{event.links && event.links.length > 0 && (
						<div
							style={{
								marginTop: "0.75rem",
								display: "flex",
								gap: "0.5rem",
								flexWrap: "wrap",
							}}
						>
							{event.links.map((link, i) => (
								<a
									key={i}
									href={link.href ?? "#"}
									onClick={(e) => e.stopPropagation()}
									style={{
										fontFamily: "var(--font-dm-mono)",
										fontSize: "0.7rem",
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
					)}
				</div>
			)}
		</div>
	);
}
