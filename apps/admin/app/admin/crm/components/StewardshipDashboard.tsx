"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// ============================================================================
// Stewardship Dashboard — Daily questions, alerts, pipeline overview
// ============================================================================

export function StewardshipDashboard() {
	const companies = useQuery(api.crmCompanies.list);
	const upcomingActions = useQuery(api.crmInteractions.getUpcomingActions, {
		today: new Date().toISOString().split("T")[0],
	});

	const overdueContacts = useMemo(() => {
		if (!companies) return [];
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		const cutoff = thirtyDaysAgo.toISOString().split("T")[0];

		return companies
			.filter((c) => {
				const isActive = !["Closed", "Lost", "Not a Fit"].includes(c.stage);
				const hasDate = c.lastContactDate;
				const isOverdue = !hasDate || hasDate < cutoff;
				return isActive && isOverdue;
			})
			.sort((a, b) => {
				if (!a.lastContactDate) return -1;
				if (!b.lastContactDate) return 1;
				return a.lastContactDate.localeCompare(b.lastContactDate);
			})
			.slice(0, 10);
	}, [companies]);

	const stageCounts = useMemo(() => {
		if (!companies) return {};
		const counts: Record<string, number> = {};
		for (const c of companies) {
			counts[c.stage] = (counts[c.stage] || 0) + 1;
		}
		return counts;
	}, [companies]);

	const activeCompanies = useMemo(() => {
		if (!companies) return 0;
		return companies.filter(
			(c) => !["Closed", "Lost", "Not a Fit"].includes(c.stage),
		).length;
	}, [companies]);

	const totalCompanies = companies?.length || 0;

	const formatDate = (dateStr: string) => {
		try {
			const d = new Date(dateStr + "T00:00:00");
			return d.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
		} catch {
			return dateStr;
		}
	};

	const daysSince = (dateStr: string) => {
		const d = new Date(dateStr + "T00:00:00");
		const now = new Date();
		return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
	};

	return (
		<div className="space-y-6 p-1">
			{/* Header */}
			<div>
				<h2 className="text-lg font-semibold text-[var(--text)]">
					Stewardship Dashboard
				</h2>
				<p className="text-[13px] text-[var(--text3)] mt-1">
					Your relationship health at a glance
				</p>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-4 gap-3">
				<StatCard
					label="Total Companies"
					value={totalCompanies}
					color="var(--text)"
				/>
				<StatCard
					label="Active Pipeline"
					value={activeCompanies}
					color="var(--primary)"
				/>
				<StatCard
					label="Overdue (30+ days)"
					value={overdueContacts.length}
					color={overdueContacts.length > 0 ? "#ef4444" : "#22c55e"}
				/>
				<StatCard
					label="Upcoming Actions"
					value={upcomingActions?.length || 0}
					color="#3b82f6"
				/>
			</div>

			{/* Overdue Nurture Alerts */}
			<Card
				title="🌱 Who haven't you contacted in 30+ days?"
				subtitle="These relationships need attention"
				badge={
					overdueContacts.length > 0 ? `${overdueContacts.length}` : undefined
				}
				badgeColor="#ef4444"
			>
				{overdueContacts.length === 0 ? (
					<div className="text-[13px] text-[var(--text3)] py-4 text-center">
						🎉 All active contacts are within 30 days. Great stewardship!
					</div>
				) : (
					<div className="space-y-2">
						{overdueContacts.map((company) => (
							<div
								key={company._id}
								className="flex items-center justify-between py-2 px-3 rounded-md bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--text3)] transition-colors"
							>
								<div className="flex-1 min-w-0">
									<div className="text-[13px] font-medium text-[var(--text)] truncate">
										{company.name}
									</div>
									<div className="text-[11px] text-[var(--text3)]">
										{company.stage}
										{company.industry && ` · ${company.industry}`}
									</div>
								</div>
								<div className="flex-shrink-0 text-right">
									{company.lastContactDate ? (
										<>
											<div className="text-[12px] font-medium text-[#ef4444]">
												{daysSince(company.lastContactDate)} days ago
											</div>
											<div className="text-[10px] text-[var(--text3)]">
												{formatDate(company.lastContactDate)}
											</div>
										</>
									) : (
										<div className="text-[12px] font-medium text-[#ef4444]">
											Never contacted
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</Card>

			{/* Upcoming Actions */}
			<Card
				title="📋 Upcoming Actions"
				subtitle="Next actions from your interaction log"
				badge={
					upcomingActions && upcomingActions.length > 0
						? `${upcomingActions.length}`
						: undefined
				}
				badgeColor="#3b82f6"
			>
				{!upcomingActions || upcomingActions.length === 0 ? (
					<div className="text-[13px] text-[var(--text3)] py-4 text-center">
						No upcoming actions logged.
					</div>
				) : (
					<div className="space-y-2">
						{upcomingActions.map((action) => (
							<div
								key={action._id}
								className="flex items-center justify-between py-2 px-3 rounded-md bg-[var(--bg)] border border-[var(--border)]"
							>
								<div className="flex-1 min-w-0">
									<div className="text-[13px] text-[var(--text)] truncate">
										{action.nextAction}
									</div>
									<div className="text-[11px] text-[var(--text3)] truncate">
										{action.summary}
									</div>
								</div>
								{action.nextActionDate && (
									<div className="flex-shrink-0 text-[12px] font-medium text-[#3b82f6] ml-3">
										{formatDate(action.nextActionDate)}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</Card>

			{/* Pipeline Overview */}
			<Card title="📊 Pipeline Overview" subtitle="Companies by stage">
				<div className="grid grid-cols-2 gap-2">
					{[
						"Identified",
						"Connected",
						"Nurturing",
						"Exploring",
						"Engaged",
						"Committed",
						"In Process",
						"Closed",
						"Recycled",
					].map((stage) => (
						<div
							key={stage}
							className="flex items-center justify-between py-2 px-3 rounded-md bg-[var(--bg)] border border-[var(--border)]"
						>
							<span className="text-[12px] text-[var(--text2)]">{stage}</span>
							<span className="text-[13px] font-semibold text-[var(--text)]">
								{stageCounts[stage] || 0}
							</span>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}

// ============================================================================
// Sub-components
// ============================================================================

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
		<div className="bg-[var(--surface2)] border border-[var(--border)] rounded-lg p-3">
			<div className="text-[20px] font-bold" style={{ color }}>
				{value}
			</div>
			<div className="text-[11px] text-[var(--text3)] mt-0.5">{label}</div>
		</div>
	);
}

function Card({
	title,
	subtitle,
	badge,
	badgeColor,
	children,
}: {
	title: string;
	subtitle?: string;
	badge?: string;
	badgeColor?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="bg-[var(--surface2)] border border-[var(--border)] rounded-lg overflow-hidden">
			<div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
				<div>
					<div className="text-[14px] font-semibold text-[var(--text)] flex items-center gap-2">
						{title}
						{badge && (
							<span
								className="text-[11px] font-medium px-1.5 py-0.5 rounded-full text-white"
								style={{ backgroundColor: badgeColor }}
							>
								{badge}
							</span>
						)}
					</div>
					{subtitle && (
						<div className="text-[11px] text-[var(--text3)] mt-0.5">
							{subtitle}
						</div>
					)}
				</div>
			</div>
			<div className="p-4">{children}</div>
		</div>
	);
}
