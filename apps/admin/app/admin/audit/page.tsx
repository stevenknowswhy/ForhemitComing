"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Activity, Users, Eye, Link2 } from "lucide-react";
import "../admin.css";
import AllActivityTab from "./_components/AllActivityTab";
import TeamTab from "./_components/TeamTab";
import ClientTab from "./_components/ClientTab";
import BoxLinkPanel from "./_components/BoxLinkPanel";
import type { Id } from "@/convex/_generated/dataModel";

type TabKey = "all" | "team" | "client" | "box";

const TABS: { key: TabKey; label: string; icon: typeof Activity }[] = [
	{ key: "all", label: "All Activity", icon: Activity },
	{ key: "team", label: "Team", icon: Users },
	{ key: "client", label: "Client Preview", icon: Eye },
	{ key: "box", label: "Box Links", icon: Link2 },
];

export default function AuditPage() {
	const [activeTab, setActiveTab] = useState<TabKey>("all");
	const [boxCompanyId, setBoxCompanyId] = useState<Id<"crmCompanies"> | null>(
		null,
	);

	const stats = useQuery(api.businessLog.getStats);
	const companies = useQuery(api.crmCompanies.list, {});

	return (
		<div className="admin-page-container">
			{/* Header */}
			<div className="admin-page-header">
				<h1 className="admin-page-title">Insights</h1>
				<p className="admin-page-subtitle">
					Unified activity feed across all deals, tasks, and documents
				</p>
			</div>

			{/* Stats cards */}
			{stats && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
						gap: "1rem",
						marginBottom: "2rem",
					}}
				>
					<StatCard
						label="Total Events"
						value={stats.total}
						color="var(--text-primary)"
					/>
					<StatCard
						label="Today"
						value={stats.today}
						color="var(--color-brand)"
					/>
					<StatCard
						label="Warnings"
						value={stats.warnings}
						color="var(--color-warning)"
					/>
					<StatCard
						label="Critical"
						value={stats.criticals}
						color="var(--color-error)"
					/>
				</div>
			)}

			{/* Tabs */}
			<div className="admin-tabs">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						className={`admin-tab ${activeTab === tab.key ? "active" : ""}`}
						onClick={() => setActiveTab(tab.key)}
					>
						<tab.icon size={14} />
						{tab.label}
					</button>
				))}
			</div>

			{/* Tab content */}
			<div className="admin-content">
				{activeTab === "all" && <AllActivityTab />}
				{activeTab === "team" && <TeamTab />}
				{activeTab === "client" && <ClientTab />}
				{activeTab === "box" && (
					<div>
						{/* Company selector for Box panel */}
						<div
							style={{
								display: "flex",
								gap: "0.75rem",
								marginBottom: "1.5rem",
							}}
						>
							<select
								className="filter-select"
								value={boxCompanyId ?? ""}
								onChange={(e) =>
									setBoxCompanyId(
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
						</div>

						{boxCompanyId ? (
							<BoxLinkPanel
								companyId={boxCompanyId}
								companyName={
									companies?.find(
										(c: { _id: string }) => c._id === boxCompanyId,
									)?.name ?? "Unknown"
								}
							/>
						) : (
							<div className="admin-empty-state">
								Select a company to manage Box embed links
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

// ── Stat card component ──────────────────────────────────

function StatCard({
	label,
	value,
	color,
}: {
	label: string;
	value: number;
	color: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "0.25rem",
				padding: "1rem 1.25rem",
				background: "var(--bg-glass)",
				border: "1px solid var(--border-subtle)",
				borderRadius: "8px",
			}}
		>
			<span
				style={{
					fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
					fontSize: "2rem",
					fontWeight: 400,
					color,
					lineHeight: 1,
				}}
			>
				{value.toLocaleString()}
			</span>
			<span
				style={{
					fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
					fontSize: "0.65rem",
					color: "var(--text-secondary)",
					textTransform: "uppercase",
					letterSpacing: "0.05em",
				}}
			>
				{label}
			</span>
		</div>
	);
}
