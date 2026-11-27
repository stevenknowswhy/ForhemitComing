"use client";

// OD-13: views and partner types are list state, not navigation — they live in
// the page (tabs under the title; type chips beside the stage chips) instead of
// the admin rail. Counts and toggle behavior mirror the old rail sections.

import type { ViewMode } from "@forhemit/shared/features/esop-partners";

export interface ContactCounts {
	all: number;
	preferred: number;
	nudges: number;
	onboarding: number;
	byType: Record<string, number>;
}

const VIEW_ITEMS = [
	{ id: "all" as ViewMode, label: "All partners" },
	{ id: "preferred" as ViewMode, label: "Preferred" },
	{ id: "pipeline" as ViewMode, label: "Pipeline" },
	{ id: "nudges" as ViewMode, label: "Follow-up needed" },
	{ id: "onboarding" as ViewMode, label: "Onboarding" },
];

const TYPE_ITEMS = [
	{ id: "Lender", label: "Lenders" },
	{ id: "Attorney", label: "Attorneys" },
	{ id: "CPA", label: "CPAs" },
	{ id: "Administrator", label: "Administrators" },
	{ id: "Appraiser", label: "Appraisers" },
	{ id: "Trustee", label: "Trustees" },
];

function getViewCount(view: ViewMode, counts: ContactCounts): number {
	switch (view) {
		case "all":
			return counts.all;
		case "preferred":
			return counts.preferred;
		case "nudges":
			return counts.nudges;
		case "onboarding":
			return counts.onboarding;
		default:
			return 0;
	}
}

// Segmented control under the page title. Active styling is the light-token
// equivalent of the rail's bg-white/15 active state. With a type filter on, no
// view tab is active — same as the old rail.
export function ViewTabs({
	currentView,
	currentType,
	contactCounts,
	onSetView,
}: {
	currentView: ViewMode;
	currentType: string | null;
	contactCounts: ContactCounts;
	onSetView: (view: ViewMode) => void;
}) {
	return (
		<div
			className="flex flex-wrap items-center gap-1.5"
			role="tablist"
			aria-label="Partner views"
		>
			{VIEW_ITEMS.map((item) => {
				const isActive = currentView === item.id && !currentType;
				const count = getViewCount(item.id, contactCounts);
				return (
					<button
						key={item.id}
						role="tab"
						aria-selected={isActive}
						onClick={() => onSetView(item.id)}
						className={`flex items-center gap-1.5 rounded-md border px-3 py-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A5FA8] focus-visible:ring-offset-1 ${
							isActive
								? "border-[#0E1C2F] bg-[#0E1C2F] text-white"
								: "border-[#D0D9E6] bg-white text-[#526070] hover:border-[#1A5FA8] hover:text-[#1A5FA8]"
						}`}
					>
						{item.label}
						{count > 0 && (
							<span
								className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
									isActive
										? "bg-white/20 text-white/80"
										: "bg-[#F2F5F9] text-[#8298AE]"
								}`}
							>
								{count}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}

// Second chip group in the stage-chip row, styled like the stage chips.
// Clicking the active type clears the filter (same toggle as the old rail).
export function TypeChips({
	currentType,
	contactCounts,
	onFilterType,
}: {
	currentType: string | null;
	contactCounts: ContactCounts;
	onFilterType: (type: string | null) => void;
}) {
	return (
		<div
			className="flex flex-wrap items-center gap-1.5"
			aria-label="Filter by partner type"
		>
			<span className="text-[11px] font-medium text-[#8298AE]">Type</span>
			{TYPE_ITEMS.map((item) => {
				const isActive = currentType === item.id;
				const count = contactCounts.byType[item.id] || 0;
				return (
					<button
						key={item.id}
						aria-pressed={isActive}
						onClick={() => onFilterType(isActive ? null : item.id)}
						className={`text-[11px] font-medium px-3 py-1 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A5FA8] focus-visible:ring-offset-1 ${
							isActive
								? "bg-[#0E1C2F] text-white border-[#0E1C2F]"
								: "bg-white text-[#526070] border-[#D0D9E6] hover:border-[#1A5FA8] hover:text-[#1A5FA8]"
						}`}
					>
						{item.label} <span className="opacity-60">{count}</span>
					</button>
				);
			})}
		</div>
	);
}
