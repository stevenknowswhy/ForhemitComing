"use client";

import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import EventRow from "./EventRow";
import EventFilters from "./EventFilters";

export default function AllActivityTab() {
	const [categoryFilter, setCategoryFilter] = useState("");
	const [severityFilter, setSeverityFilter] = useState("");
	const [cursor, setCursor] = useState<string | null>(null);
	const [cursors, setCursors] = useState<string[]>([]);

	const result = useQuery(api.businessLog.listAll, {
		limit: 50,
		cursor: cursor ?? undefined,
		category: categoryFilter || undefined,
		severity: severityFilter || undefined,
	});

	const handleNext = useCallback(() => {
		if (result?.cursor) {
			setCursors((prev) => [...prev, cursor ?? ""]);
			setCursor(result.cursor);
		}
	}, [result?.cursor, cursor]);

	const handlePrev = useCallback(() => {
		setCursors((prev) => {
			const next = [...prev];
			const prevCursor = next.pop();
			setCursor(prevCursor || null);
			return next;
		});
	}, []);

	return (
		<div>
			<EventFilters
				categoryFilter={categoryFilter}
				severityFilter={severityFilter}
				roleFilter=""
				onCategoryChange={setCategoryFilter}
				onSeverityChange={setSeverityFilter}
				onRoleChange={() => {}}
			/>

			{!result ? (
				<div className="admin-loading">Loading activity...</div>
			) : (
				<>
					<div
						style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
					>
						{result.items.length === 0 ? (
							<div className="admin-empty-state">No events found</div>
						) : (
							result.items.map((event) => (
								<EventRow
									key={event._id}
									event={
										event as unknown as Parameters<typeof EventRow>[0]["event"]
									}
								/>
							))
						)}
					</div>

					{/* Pagination */}
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							gap: "1rem",
							marginTop: "1.5rem",
						}}
					>
						<button
							className="btn-secondary"
							disabled={cursors.length === 0}
							onClick={handlePrev}
						>
							Previous
						</button>
						<button
							className="btn-secondary"
							disabled={!result.hasMore}
							onClick={handleNext}
						>
							Next
						</button>
					</div>
				</>
			)}
		</div>
	);
}
