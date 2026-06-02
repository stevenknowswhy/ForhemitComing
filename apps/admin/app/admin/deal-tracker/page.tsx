"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { DealTracker } from "@/components/deal-tracker";
import { Building2, Search, X } from "lucide-react";

// Role filter options
const ROLE_FILTERS = [
	{ value: "all", label: "All Roles" },
	{ value: "Forhemit", label: "Forhemit" },
	{ value: "Owner/Seller", label: "Owner/Seller" },
	{ value: "Lender", label: "Lender" },
	{ value: "Trustee", label: "Trustee" },
	{ value: "CPA", label: "CPA" },
	{ value: "Broker", label: "Broker" },
	{ value: "Legal", label: "Legal" },
	{ value: "All Parties", label: "All Parties" },
];

export default function DealTrackerPage() {
	const companies = useQuery(api.crmCompanies.list);
	const [selectedCompanyId, setSelectedCompanyId] =
		useState<Id<"crmCompanies"> | null>(null);
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");

	// Get tracker state for role counts
	const trackerState = useQuery(
		api.dealTracker.getTrackerState,
		selectedCompanyId ? { companyId: selectedCompanyId } : "skip",
	);

	const selectedCompany = companies?.find((c) => c._id === selectedCompanyId);

	// Calculate role-based task counts
	const roleCounts = useMemo(() => {
		if (!trackerState?.tasks) return {};

		const counts: Record<string, { total: number; completed: number }> = {};
		for (const task of trackerState.tasks) {
			if (!counts[task.role]) counts[task.role] = { total: 0, completed: 0 };
			counts[task.role].total += task.subtasks.length;
			counts[task.role].completed += task.subtasks.filter(
				(s) => s.completed,
			).length;
		}
		return counts;
	}, [trackerState?.tasks]);

	return (
		<div className="space-y-6">
			<div className="page-header-stitch">
				<div className="header-top">
					<div>
						<h1 className="page-title">Deal Tracker</h1>
						<p className="page-subtitle">120-day ESOP transaction roadmap</p>
					</div>
				</div>
			</div>

			{/* Company Selector */}
			<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2521] p-4">
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Select Client
				</label>
				<div className="relative">
					<div className="flex items-center gap-3">
						<Building2 className="w-5 h-5 text-gray-400" />
						<select
							value={selectedCompanyId ?? ""}
							onChange={(e) =>
								setSelectedCompanyId(
									e.target.value
										? (e.target.value as Id<"crmCompanies">)
										: null,
								)
							}
							className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2A3028] px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
						>
							<option value="">Choose a business...</option>
							{companies?.map((company) => (
								<option key={company._id} value={company._id}>
									{company.name}
									{company.ref ? ` (${company.ref})` : ""} — {company.stage}
								</option>
							))}
						</select>
					</div>
				</div>
				{selectedCompany && (
					<div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
						<span>
							Stage:{" "}
							<strong className="text-gray-700 dark:text-gray-300">
								{selectedCompany.stage}
							</strong>
						</span>
						{selectedCompany.industry && (
							<span>
								Industry:{" "}
								<strong className="text-gray-700 dark:text-gray-300">
									{selectedCompany.industry}
								</strong>
							</span>
						)}
						{selectedCompany.revenue && (
							<span>
								Revenue:{" "}
								<strong className="text-gray-700 dark:text-gray-300">
									{selectedCompany.revenue}
								</strong>
							</span>
						)}
						{selectedCompany.ebitda && (
							<span>
								EBITDA:{" "}
								<strong className="text-gray-700 dark:text-gray-300">
									{selectedCompany.ebitda}
								</strong>
							</span>
						)}
					</div>
				)}
			</div>

			{/* Role Filter Pills */}
			{selectedCompanyId && (
				<div className="space-y-2">
					<div className="flex flex-wrap gap-2">
						{ROLE_FILTERS.map((role) => {
							const count =
								role.value === "all"
									? Object.values(roleCounts).reduce(
											(sum, c) => sum + c.total,
											0,
										)
									: (roleCounts[role.value]?.total ?? 0);
							const completed =
								role.value === "all"
									? Object.values(roleCounts).reduce(
											(sum, c) => sum + c.completed,
											0,
										)
									: (roleCounts[role.value]?.completed ?? 0);

							return (
								<button
									key={role.value}
									onClick={() => setRoleFilter(role.value)}
									className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
										roleFilter === role.value
											? "bg-[#FF6B00] text-white"
											: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
									}`}
								>
									{role.label}
									{count > 0 && (
										<span
											className={`text-[10px] ${roleFilter === role.value ? "text-white/80" : "text-gray-400 dark:text-gray-500"}`}
										>
											{completed}/{count}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>
			)}

			{/* Search Bar */}
			{selectedCompanyId && (
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
					<input
						type="text"
						placeholder="Search tasks..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2521] pl-10 pr-10 py-2.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
						>
							<X className="w-4 h-4" />
						</button>
					)}
				</div>
			)}

			{/* Deal Tracker */}
			{selectedCompanyId ? (
				<DealTracker
					companyId={selectedCompanyId}
					roleFilter={roleFilter}
					searchQuery={searchQuery}
				/>
			) : (
				<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-[#F0EBE3] dark:bg-[#2A3028] p-8 text-center">
					<Building2 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Select a client above to view their 120-day deal tracker
					</p>
				</div>
			)}
		</div>
	);
}
