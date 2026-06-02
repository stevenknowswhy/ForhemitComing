"use client";

interface EventFiltersProps {
	categoryFilter: string;
	severityFilter: string;
	roleFilter: string;
	onCategoryChange: (v: string) => void;
	onSeverityChange: (v: string) => void;
	onRoleChange: (v: string) => void;
	showRoleFilter?: boolean;
}

const CATEGORIES = [
	"deal",
	"task",
	"document",
	"email",
	"agent",
	"auth",
	"system",
	"journal",
	"tracker",
	"box",
	"client",
];

const SEVERITIES = ["info", "warning", "critical"];

const ROLES = [
	"Forhemit",
	"Owner/Seller",
	"CPA",
	"Legal",
	"Lender",
	"Broker",
	"Trustee",
];

export default function EventFilters({
	categoryFilter,
	severityFilter,
	roleFilter,
	onCategoryChange,
	onSeverityChange,
	onRoleChange,
	showRoleFilter = false,
}: EventFiltersProps) {
	return (
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
				value={categoryFilter}
				onChange={(e) => onCategoryChange(e.target.value)}
			>
				<option value="">All Categories</option>
				{CATEGORIES.map((c) => (
					<option key={c} value={c}>
						{c.charAt(0).toUpperCase() + c.slice(1)}
					</option>
				))}
			</select>

			<select
				className="filter-select"
				value={severityFilter}
				onChange={(e) => onSeverityChange(e.target.value)}
			>
				<option value="">All Severities</option>
				{SEVERITIES.map((s) => (
					<option key={s} value={s}>
						{s.charAt(0).toUpperCase() + s.slice(1)}
					</option>
				))}
			</select>

			{showRoleFilter && (
				<select
					className="filter-select"
					value={roleFilter}
					onChange={(e) => onRoleChange(e.target.value)}
				>
					<option value="">All Roles</option>
					{ROLES.map((r) => (
						<option key={r} value={r}>
							{r}
						</option>
					))}
				</select>
			)}
		</div>
	);
}
