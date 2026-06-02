"use client";

import { useState, useEffect, useCallback } from "react";

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

const SEVERITY_COLORS: Record<string, string> = {
	info: "#16a34a",
	warning: "#d97706",
	critical: "#dc2626",
};

function formatTime(ts: number) {
	return new Date(ts).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function BoxActivityEmbed() {
	const [events, setEvents] = useState<ClientEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [cursor, setCursor] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [acknowledging, setAcknowledging] = useState<string | null>(null);

	const fetchEvents = useCallback(
		async (loadMore = false) => {
			try {
				const params = new URLSearchParams({ limit: "25" });
				if (loadMore && cursor) params.set("cursor", cursor);

				const resp = await fetch(`/api/embed/box-log/events?${params}`);
				if (!resp.ok) {
					if (resp.status === 401) {
						setError("Session expired. Please use a new link.");
						return;
					}
					throw new Error("Failed to load events");
				}

				const data = await resp.json();
				setEvents((prev) => (loadMore ? [...prev, ...data.items] : data.items));
				setCursor(data.cursor);
				setHasMore(data.hasMore);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load");
			} finally {
				setLoading(false);
			}
		},
		[cursor],
	);

	useEffect(() => {
		fetchEvents();
	}, []);

	const handleAcknowledge = async (eventId: string) => {
		setAcknowledging(eventId);
		try {
			await fetch("/api/embed/box-log/interactions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "acknowledge", eventId }),
			});
		} catch {
			// Silent fail — best-effort
		} finally {
			setAcknowledging(null);
		}
	};

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "200px",
					fontFamily: "'DM Mono', monospace",
					fontSize: "0.875rem",
					color: "#6b7280",
				}}
			>
				Loading activity...
			</div>
		);
	}

	if (error) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "200px",
					fontFamily: "'DM Mono', monospace",
					fontSize: "0.875rem",
					color: "#dc2626",
				}}
			>
				{error}
			</div>
		);
	}

	return (
		<div
			style={{
				fontFamily: "'Jost', 'Inter', sans-serif",
				maxWidth: "600px",
				margin: "0 auto",
				padding: "1rem",
			}}
		>
			{/* Header */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "1.5rem",
					paddingBottom: "1rem",
					borderBottom: "1px solid #e5e7eb",
				}}
			>
				<h1
					style={{
						fontSize: "1.25rem",
						fontWeight: 500,
						color: "#111827",
						margin: 0,
					}}
				>
					Deal Activity
				</h1>
				<span
					style={{
						fontFamily: "'DM Mono', monospace",
						fontSize: "0.7rem",
						color: "#9ca3af",
					}}
				>
					Forhemit
				</span>
			</div>

			{/* Events */}
			{events.length === 0 ? (
				<div
					style={{
						textAlign: "center",
						padding: "2rem",
						color: "#9ca3af",
						fontSize: "0.875rem",
					}}
				>
					No activity yet
				</div>
			) : (
				<div
					style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
				>
					{events.map((event) => (
						<div
							key={event.id}
							style={{
								display: "flex",
								alignItems: "flex-start",
								gap: "0.75rem",
								padding: "0.75rem",
								border: "1px solid #e5e7eb",
								borderLeft: `3px solid ${SEVERITY_COLORS[event.severity] ?? "#6b7280"}`,
								borderRadius: "6px",
								background: "#fff",
							}}
						>
							<span style={{ fontSize: "1.1rem", flexShrink: 0 }}>
								{CATEGORY_ICONS[event.category] ?? "📌"}
							</span>

							<div style={{ flex: 1, minWidth: 0 }}>
								<div
									style={{
										fontSize: "0.8rem",
										color: "#111827",
										lineHeight: 1.4,
									}}
								>
									{event.summary}
								</div>
								<div
									style={{
										fontFamily: "'DM Mono', monospace",
										fontSize: "0.65rem",
										color: "#9ca3af",
										marginTop: "0.25rem",
									}}
								>
									{event.actorLabel} · {formatTime(event.occurredAt)}
								</div>

								{/* Links */}
								{event.links && event.links.length > 0 && (
									<div
										style={{
											display: "flex",
											gap: "0.375rem",
											marginTop: "0.5rem",
											flexWrap: "wrap",
										}}
									>
										{event.links.map((link, i) => (
											<a
												key={i}
												href={link.href ?? "#"}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													fontFamily: "'DM Mono', monospace",
													fontSize: "0.6rem",
													color: "#16a34a",
													background: "#f0fdf4",
													padding: "0.125rem 0.375rem",
													borderRadius: "3px",
													textDecoration: "none",
												}}
											>
												{link.label}
											</a>
										))}
									</div>
								)}
							</div>

							{/* Acknowledge button */}
							{event.severity !== "info" && (
								<button
									type="button"
									disabled={acknowledging === event.id}
									onClick={() => handleAcknowledge(event.id)}
									style={{
										fontFamily: "'DM Mono', monospace",
										fontSize: "0.6rem",
										padding: "0.25rem 0.5rem",
										border: "1px solid #d1d5db",
										borderRadius: "4px",
										background: acknowledging === event.id ? "#f3f4f6" : "#fff",
										color: "#374151",
										cursor: "pointer",
										flexShrink: 0,
									}}
								>
									{acknowledging === event.id ? "..." : "Ack"}
								</button>
							)}
						</div>
					))}
				</div>
			)}

			{/* Load more */}
			{hasMore && (
				<div style={{ textAlign: "center", marginTop: "1rem" }}>
					<button
						type="button"
						onClick={() => fetchEvents(true)}
						style={{
							fontFamily: "'DM Mono', monospace",
							fontSize: "0.75rem",
							padding: "0.5rem 1rem",
							border: "1px solid #d1d5db",
							borderRadius: "6px",
							background: "#fff",
							color: "#374151",
							cursor: "pointer",
						}}
					>
						Load more
					</button>
				</div>
			)}

			{/* Footer */}
			<div
				style={{
					textAlign: "center",
					marginTop: "1.5rem",
					paddingTop: "1rem",
					borderTop: "1px solid #e5e7eb",
					fontFamily: "'DM Mono', monospace",
					fontSize: "0.6rem",
					color: "#9ca3af",
				}}
			>
				Powered by Forhemit Transition Stewardship
			</div>
		</div>
	);
}
