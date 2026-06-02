"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";

interface ActivityLogEntry {
	id: string;
	event_type: string;
	event_date: string;
	phase: string;
	title: string;
	description: string | null;
}

interface PhaseChecklist {
	id: string;
	phase: string;
	phase_name: string;
	total_tasks: number;
	completed_tasks: number;
	in_progress_tasks: number;
	tasks: Array<{
		title: string;
		status: string;
		category: string;
		completedAt?: string;
	}>;
}

interface JournalMetrics {
	week_starting: string;
	total_entries: number;
	touchpoints: {
		calls: number;
		emails: number;
		documents: number;
		meetings: number;
		total: number;
	};
	milestones: number;
	active_phase: string;
	days_in_current_phase: number;
}

const PHASE_LABELS: Record<string, string> = {
	ignition: "Ignition",
	build: "Build",
	validate: "Validate",
	"close-prep": "Close Prep",
	closing: "Closing",
	"post-close": "Post-Close",
};

const PHASE_COLORS: Record<string, string> = {
	ignition: "#3b82f6",
	build: "#f59e0b",
	validate: "#8b5cf6",
	"close-prep": "#ec4899",
	closing: "#10b981",
	"post-close": "#6b7280",
};

const STATUS_ICONS: Record<string, string> = {
	completed: "✅",
	in_progress: "🔄",
	pending: "⏳",
};

const EVENT_ICONS: Record<string, string> = {
	entry_created: "📝",
	chapter_started: "🚀",
	chapter_completed: "🎉",
	narrative_published: "📄",
	checklist_updated: "📋",
	document_uploaded: "📎",
};

export default function ClientJournalPage() {
	const { user } = useUser();
	const [activity, setActivity] = useState<ActivityLogEntry[]>([]);
	const [checklists, setChecklists] = useState<PhaseChecklist[]>([]);
	const [metrics, setMetrics] = useState<JournalMetrics[]>([]);
	const [boxSharedLink, setBoxSharedLink] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<
		"activity" | "checklists" | "documents"
	>("activity");

	const fetchData = useCallback(async () => {
		try {
			const email = user?.primaryEmailAddress?.emailAddress;
			if (!email) return;

			const [activityRes, checklistsRes, metricsRes, boxRes] =
				await Promise.all([
					fetch(
						`/api/client/journal/activity?email=${encodeURIComponent(email)}`,
					),
					fetch(
						`/api/client/journal/checklists?email=${encodeURIComponent(email)}`,
					),
					fetch(
						`/api/client/journal/metrics?email=${encodeURIComponent(email)}`,
					),
					fetch(
						`/api/client/journal/box-link?email=${encodeURIComponent(email)}`,
					),
				]);

			if (activityRes.ok) {
				const data = await activityRes.json();
				setActivity(data.entries || []);
			}
			if (checklistsRes.ok) {
				const data = await checklistsRes.json();
				setChecklists(data.checklists || []);
			}
			if (metricsRes.ok) {
				const data = await metricsRes.json();
				setMetrics(data.metrics || []);
			}
			if (boxRes.ok) {
				const data = await boxRes.json();
				setBoxSharedLink(data.sharedLink || null);
			}
		} catch (err) {
			console.error("Failed to load journal data:", err);
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		if (user) fetchData();
	}, [user, fetchData]);

	if (loading) {
		return (
			<div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
				Loading your journal…
			</div>
		);
	}

	const currentPhase =
		checklists.find((c) => c.in_progress_tasks > 0)?.phase ||
		checklists[0]?.phase;

	return (
		<div>
			{/* Hero */}
			<div style={{ marginBottom: "32px" }}>
				<h1
					style={{
						fontSize: "28px",
						fontWeight: 600,
						color: "#1B2A4A",
						marginBottom: "8px",
					}}
				>
					Your ESOP Transition Journal
				</h1>
				<p style={{ color: "#6b7280", fontSize: "15px", maxWidth: "600px" }}>
					Track your deal progress, view activity updates, and access your
					documents — all in one place.
				</p>
			</div>

			{/* Phase Progress Bar */}
			{checklists.length > 0 && (
				<div
					style={{
						background: "white",
						border: "1px solid #e5e7eb",
						borderRadius: "12px",
						padding: "24px",
						marginBottom: "24px",
					}}
				>
					<h2
						style={{
							fontSize: "16px",
							fontWeight: 600,
							color: "#1B2A4A",
							marginBottom: "16px",
						}}
					>
						Phase Progress
					</h2>
					<div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
						{checklists.map((cl) => {
							const pct =
								cl.total_tasks > 0
									? Math.round((cl.completed_tasks / cl.total_tasks) * 100)
									: 0;
							const isActive = cl.phase === currentPhase;
							return (
								<div
									key={cl.phase}
									style={{
										flex: 1,
										textAlign: "center",
										position: "relative",
									}}
								>
									<div
										style={{
											height: "8px",
											borderRadius: "4px",
											background: "#e5e7eb",
											overflow: "hidden",
											marginBottom: "8px",
											border: isActive
												? `2px solid ${PHASE_COLORS[cl.phase]}`
												: "2px solid transparent",
										}}
									>
										<div
											style={{
												height: "100%",
												width: `${pct}%`,
												background: PHASE_COLORS[cl.phase],
												borderRadius: "2px",
												transition: "width 0.5s ease",
											}}
										/>
									</div>
									<span
										style={{
											fontSize: "11px",
											color: isActive ? PHASE_COLORS[cl.phase] : "#9ca3af",
											fontWeight: isActive ? 600 : 400,
										}}
									>
										{PHASE_LABELS[cl.phase] || cl.phase}
									</span>
									<br />
									<span style={{ fontSize: "10px", color: "#9ca3af" }}>
										{cl.completed_tasks}/{cl.total_tasks}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Latest Metrics */}
			{metrics.length > 0 && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(4, 1fr)",
						gap: "16px",
						marginBottom: "24px",
					}}
				>
					{[
						{
							label: "Total Activities",
							value: metrics.reduce((s, m) => s + m.total_entries, 0),
							icon: "📊",
						},
						{
							label: "Touchpoints",
							value: metrics.reduce((s, m) => s + m.touchpoints.total, 0),
							icon: "🤝",
						},
						{
							label: "Milestones",
							value: metrics.reduce((s, m) => s + m.milestones, 0),
							icon: "🎯",
						},
						{
							label: "Days Active",
							value: metrics[0]?.days_in_current_phase || 0,
							icon: "📅",
						},
					].map((stat) => (
						<div
							key={stat.label}
							style={{
								background: "white",
								border: "1px solid #e5e7eb",
								borderRadius: "10px",
								padding: "20px",
								textAlign: "center",
							}}
						>
							<div style={{ fontSize: "24px", marginBottom: "8px" }}>
								{stat.icon}
							</div>
							<div
								style={{ fontSize: "28px", fontWeight: 700, color: "#1B2A4A" }}
							>
								{stat.value}
							</div>
							<div
								style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}
							>
								{stat.label}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Tab Navigation */}
			<div
				style={{
					display: "flex",
					gap: "4px",
					marginBottom: "24px",
					borderBottom: "2px solid #e5e7eb",
					paddingBottom: "0",
				}}
			>
				{(["activity", "checklists", "documents"] as const).map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						style={{
							padding: "10px 20px",
							fontSize: "14px",
							fontWeight: activeTab === tab ? 600 : 400,
							color: activeTab === tab ? "#FF6B00" : "#6b7280",
							background: "none",
							border: "none",
							borderBottom:
								activeTab === tab
									? "2px solid #FF6B00"
									: "2px solid transparent",
							marginBottom: "-2px",
							cursor: "pointer",
							transition: "all 0.2s",
						}}
					>
						{tab === "activity" && "📋 Activity Log"}
						{tab === "checklists" && "✅ Checklists"}
						{tab === "documents" && "📁 Documents"}
					</button>
				))}
			</div>

			{/* Activity Tab */}
			{activeTab === "activity" && (
				<div>
					{activity.length === 0 ? (
						<p
							style={{ color: "#9ca3af", textAlign: "center", padding: "40px" }}
						>
							No activity recorded yet.
						</p>
					) : (
						<div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
							{activity.map((entry) => {
								const eventDate = new Date(entry.event_date);
								return (
									<div
										key={entry.id}
										style={{
											display: "flex",
											gap: "16px",
											padding: "16px 0",
											borderBottom: "1px solid #f3f4f6",
										}}
									>
										<div
											style={{
												width: "48px",
												height: "48px",
												borderRadius: "50%",
												background: `${PHASE_COLORS[entry.phase] || "#6b7280"}15`,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontSize: "20px",
												flexShrink: 0,
											}}
										>
											{EVENT_ICONS[entry.event_type] || "📌"}
										</div>
										<div style={{ flex: 1 }}>
											<div
												style={{
													fontSize: "14px",
													fontWeight: 500,
													color: "#1B2A4A",
													marginBottom: "4px",
												}}
											>
												{entry.title}
											</div>
											{entry.description && (
												<p
													style={{
														fontSize: "13px",
														color: "#6b7280",
														margin: "0 0 6px",
														lineHeight: "1.5",
													}}
												>
													{entry.description}
												</p>
											)}
											<div
												style={{
													display: "flex",
													gap: "12px",
													fontSize: "12px",
													color: "#9ca3af",
												}}
											>
												<span>
													{eventDate.toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</span>
												<span
													style={{
														background: `${PHASE_COLORS[entry.phase] || "#6b7280"}15`,
														color: PHASE_COLORS[entry.phase] || "#6b7280",
														padding: "1px 8px",
														borderRadius: "10px",
														fontSize: "11px",
														fontWeight: 500,
													}}
												>
													{PHASE_LABELS[entry.phase] || entry.phase}
												</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}

			{/* Checklists Tab */}
			{activeTab === "checklists" && (
				<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
					{checklists.map((cl) => {
						const pct =
							cl.total_tasks > 0
								? Math.round((cl.completed_tasks / cl.total_tasks) * 100)
								: 0;
						return (
							<div
								key={cl.phase}
								style={{
									background: "white",
									border: "1px solid #e5e7eb",
									borderRadius: "12px",
									padding: "24px",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										marginBottom: "16px",
									}}
								>
									<div>
										<h3
											style={{
												fontSize: "16px",
												fontWeight: 600,
												color: "#1B2A4A",
												margin: "0 0 4px",
											}}
										>
											{cl.phase_name}
										</h3>
										<span style={{ fontSize: "13px", color: "#6b7280" }}>
											{cl.completed_tasks} of {cl.total_tasks} tasks complete (
											{pct}%)
										</span>
									</div>
									<div
										style={{
											width: "56px",
											height: "56px",
											borderRadius: "50%",
											background: `conic-gradient(${PHASE_COLORS[cl.phase]} ${pct * 3.6}deg, #e5e7eb 0deg)`,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											position: "relative",
										}}
									>
										<div
											style={{
												width: "44px",
												height: "44px",
												borderRadius: "50%",
												background: "white",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontSize: "14px",
												fontWeight: 600,
												color: PHASE_COLORS[cl.phase],
											}}
										>
											{pct}%
										</div>
									</div>
								</div>

								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "8px",
									}}
								>
									{cl.tasks.map((task) => (
										<div
											key={task.title}
											style={{
												display: "flex",
												alignItems: "center",
												gap: "10px",
												padding: "8px 12px",
												background:
													task.status === "completed"
														? "#f0fdf4"
														: task.status === "in_progress"
															? "#fffbeb"
															: "#f9fafb",
												borderRadius: "8px",
												fontSize: "13px",
											}}
										>
											<span style={{ fontSize: "16px" }}>
												{STATUS_ICONS[task.status] || "⏳"}
											</span>
											<span
												style={{
													flex: 1,
													color:
														task.status === "completed" ? "#6b7280" : "#1B2A4A",
													textDecoration:
														task.status === "completed"
															? "line-through"
															: "none",
												}}
											>
												{task.title}
											</span>
											<span
												style={{
													fontSize: "11px",
													color: "#9ca3af",
													background: "#f3f4f6",
													padding: "2px 8px",
													borderRadius: "4px",
												}}
											>
												{task.category}
											</span>
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Documents Tab */}
			{activeTab === "documents" && (
				<div>
					{boxSharedLink ? (
						<div>
							<div
								style={{
									background: "#f0f7ff",
									border: "1px solid #bfdbfe",
									borderRadius: "10px",
									padding: "16px 20px",
									marginBottom: "20px",
									display: "flex",
									alignItems: "center",
									gap: "12px",
								}}
							>
								<span style={{ fontSize: "20px" }}>📦</span>
								<div>
									<p
										style={{
											fontSize: "14px",
											fontWeight: 500,
											color: "#1e40af",
											margin: "0 0 4px",
										}}
									>
										Secure Document Storage
									</p>
									<p style={{ fontSize: "12px", color: "#3b82f6", margin: 0 }}>
										Your documents are stored securely on Box.com with
										enterprise-grade encryption.
									</p>
								</div>
								<a
									href={boxSharedLink}
									target="_blank"
									rel="noopener noreferrer"
									style={{
										marginLeft: "auto",
										padding: "8px 16px",
										background: "#1e40af",
										color: "white",
										borderRadius: "6px",
										fontSize: "13px",
										fontWeight: 500,
										textDecoration: "none",
										whiteSpace: "nowrap",
									}}
								>
									Open in Box ↗
								</a>
							</div>
							<iframe
								src={boxSharedLink}
								style={{
									width: "100%",
									height: "600px",
									border: "1px solid #e5e7eb",
									borderRadius: "10px",
								}}
								title="Box Documents"
							/>
						</div>
					) : (
						<p
							style={{ color: "#9ca3af", textAlign: "center", padding: "40px" }}
						>
							Document storage is being set up. Check back soon.
						</p>
					)}
				</div>
			)}
		</div>
	);
}
