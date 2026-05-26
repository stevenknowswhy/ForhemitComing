import type { Company, CompanyFilters, SortConfig } from "../types";
import { PIPELINE_STAGES } from "../types";
import { daysUntil } from "./formatters";

// ============================================
// Company Filtering
// ============================================

/**
 * Filter companies based on active filters
 */
export function filterCompanies(
	companies: Company[],
	filters: CompanyFilters,
): Company[] {
	return companies.filter((company) => {
		// Stage filter
		if (filters.stage !== "all" && company.stage !== filters.stage) {
			return false;
		}

		// NDA filter
		if (
			filters.ndaStatus !== "all" &&
			company.ndaStatus !== filters.ndaStatus
		) {
			return false;
		}

		// Due date filter
		if (filters.dueFilter && filters.dueFilter !== "all") {
			const days = daysUntil(company.nextStepDate);

			switch (filters.dueFilter) {
				case "overdue":
					if (days === null || days >= 0) return false;
					break;
				case "today":
					if (days !== 0) return false;
					break;
				case "week":
					if (days === null || days < 0 || days > 7) return false;
					break;
			}
		}

		// Search query filter
		if (filters.searchQuery) {
			const query = filters.searchQuery.toLowerCase();
			const searchableText = [
				company.name,
				company.industry,
				company.advisor,
				company.stage,
				company.notes,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();

			if (!searchableText.includes(query)) {
				return false;
			}
		}

		return true;
	});
}

// ============================================
// Company Sorting
// ============================================

/**
 * Sort companies based on sort configuration
 */
export function sortCompanies(
	companies: Company[],
	sort: SortConfig,
): Company[] {
	return [...companies].sort((a, b) => {
		let comparison: number;

		switch (sort.field) {
			case "company":
				comparison = a.name.localeCompare(b.name);
				break;
			case "stage":
				comparison =
					PIPELINE_STAGES.indexOf(a.stage) - PIPELINE_STAGES.indexOf(b.stage);
				break;
			case "lastContact":
				comparison = compareDates(a.lastContactDate, b.lastContactDate);
				break;
			case "nextDate":
				comparison = compareDates(a.nextStepDate, b.nextStepDate);
				break;
			case "createdAt":
				comparison = (a.createdAt ?? 0) - (b.createdAt ?? 0);
				break;
			default:
				comparison = a.name.localeCompare(b.name);
		}

		return sort.direction === "asc" ? comparison : -comparison;
	});
}

/**
 * Compare two date strings
 */
function compareDates(a: string | undefined, b: string | undefined): number {
	const da = a || undefined;
	const db = b || undefined;
	if (!da && !db) return 0;
	if (!da) return 1;
	if (!db) return -1;
	return da.localeCompare(db);
}

// ============================================
// Grouping
// ============================================

/**
 * Group companies by stage (for kanban view)
 */
export function groupByStage(companies: Company[]): Record<string, Company[]> {
	const grouped: Record<string, Company[]> = {};

	// Initialize all stages
	PIPELINE_STAGES.forEach((stage) => {
		grouped[stage] = [];
	});

	// Group companies
	companies.forEach((company) => {
		if (!grouped[company.stage]) {
			grouped[company.stage] = [];
		}
		grouped[company.stage].push(company);
	});

	return grouped;
}

/**
 * Group companies by due date (for calendar view)
 */
export function groupByDueDate(
	companies: Company[],
): Record<string, Company[]> {
	const grouped: Record<string, Company[]> = {};

	companies.forEach((company) => {
		if (company.nextStepDate) {
			if (!grouped[company.nextStepDate]) {
				grouped[company.nextStepDate] = [];
			}
			grouped[company.nextStepDate].push(company);
		}
	});

	return grouped;
}
