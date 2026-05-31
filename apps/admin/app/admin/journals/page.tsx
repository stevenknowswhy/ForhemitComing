"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const DEMO_CLIENTS = [
	{
		name: "Sunrise Manufacturing Co.",
		industry: "Manufacturing",
		size: "180 employees",
		revenue: "$28M",
		stage: "Feasibility" as const,
		journalType: "transition" as const,
	},
	{
		name: "Pacific Coast Logistics",
		industry: "Transportation & Logistics",
		size: "95 employees",
		revenue: "$14M",
		stage: "Term sheet" as const,
		journalType: "transition" as const,
	},
	{
		name: "Greenfield Engineering",
		industry: "Engineering Services",
		size: "320 employees",
		revenue: "$45M",
		stage: "Closed" as const,
		journalType: "stewardship" as const,
	},
];

export default function JournalsPage() {
	const journals = useQuery(api.clientJournals.listActiveEnriched);
	const companies = useQuery(api.crmCompanies.list);
	const createJournal = useMutation(api.clientJournals.create);
	const createCompany = useMutation(api.crmCompanies.create);
	const [showCreate, setShowCreate] = useState(false);
	const [creating, setCreating] = useState(false);
	const [seeding, setSeeding] = useState(false);

	const handleCreate = async (
		companyId: Id<"crmCompanies">,
		journalType: "transition" | "stewardship",
	) => {
		setCreating(true);
		try {
			await createJournal({
				clientId: companyId,
				journalType,
				currentChapter:
					journalType === "transition" ? "First Contact" : "Active",
				chapterNumber: 1,
				clientTimezone: "America/New_York",
				deliveryDay: "Tuesday",
				deliveryHour: 9,
			});
			setShowCreate(false);
		} catch (err) {
			console.error("Failed to create journal:", err);
			alert("Failed to create journal. Check console for details.");
		} finally {
			setCreating(false);
		}
	};

	const handleSeed = async () => {
		setSeeding(true);
		try {
			for (const demo of DEMO_CLIENTS) {
				const company = await createCompany({
					name: demo.name,
					industry: demo.industry,
					size: demo.size,
					revenue: demo.revenue,
					stage: demo.stage,
					ndaStatus: "Signed",
				});
				if (!company) throw new Error(`Failed to create ${demo.name}`);
				await createJournal({
					clientId: company._id,
					journalType: demo.journalType,
					currentChapter:
						demo.journalType === "transition" ? demo.stage : "Active",
					chapterNumber: 1,
					clientTimezone: "America/New_York",
					deliveryDay: "Tuesday",
					deliveryHour: 9,
				});
			}
		} catch (err) {
			console.error("Failed to seed:", err);
			alert("Failed to seed demo clients. Check console.");
		} finally {
			setSeeding(false);
		}
	};

	if (journals === undefined) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="w-8 h-8 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">
						Client Journals
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Manage client transparency journals for transition and stewardship
						phases.
					</p>
				</div>
				<button
					onClick={() => setShowCreate(true)}
					className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					New Journal
				</button>
			</div>

			{journals.length === 0 ? (
				<div className="space-y-4">
					{/* Seed Demo Banner */}
					<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
						<div className="flex items-center gap-3">
							<div className="flex-1">
								<p className="text-sm font-medium text-amber-800">Quick Demo</p>
								<p className="text-xs text-amber-600 mt-0.5">
									Add 3 mock clients with journals to explore the feature.
								</p>
							</div>
							<button
								onClick={handleSeed}
								disabled={seeding}
								className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors"
							>
								{seeding ? "Adding..." : "Add Demo Clients"}
							</button>
						</div>
					</div>

					<div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
						<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg
								className="w-6 h-6 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
						</div>
						<p className="text-gray-500 mb-4">No active journals.</p>
						<button
							onClick={() => setShowCreate(true)}
							className="text-orange-600 hover:text-orange-800 text-sm font-medium"
						>
							Create your first journal →
						</button>
					</div>
				</div>
			) : (
				<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Client
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Type
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Current Chapter
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Created
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{journals.map((journal) => (
								<tr key={journal._id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<Link
											href={`/admin/journals/${journal._id}`}
											className="text-orange-600 hover:text-orange-800 font-medium"
										>
											{journal.companyName}
										</Link>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												journal.journalType === "transition"
													? "bg-blue-100 text-blue-800"
													: "bg-green-100 text-green-800"
											}`}
										>
											{journal.journalType}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{journal.chapterNumber}. {journal.currentChapter}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{new Date(journal.createdAt).toLocaleDateString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Create Journal Modal */}
			{showCreate && (
				<CreateJournalModal
					companies={companies ?? []}
					onClose={() => setShowCreate(false)}
					onCreate={handleCreate}
					creating={creating}
				/>
			)}
		</div>
	);
}

function CreateJournalModal({
	companies,
	onClose,
	onCreate,
	creating,
}: {
	companies: Array<{
		_id: Id<"crmCompanies">;
		name: string;
		stage?: string;
	}>;
	onClose: () => void;
	onCreate: (
		companyId: Id<"crmCompanies">,
		journalType: "transition" | "stewardship",
	) => void;
	creating: boolean;
}) {
	const [selectedCompany, setSelectedCompany] =
		useState<Id<"crmCompanies"> | null>(null);
	const [journalType, setJournalType] = useState<"transition" | "stewardship">(
		"transition",
	);
	const [search, setSearch] = useState("");

	const filtered = companies.filter((c) =>
		c.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/40"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
			/>
			<div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-lg font-semibold text-gray-900">
						New Client Journal
					</h2>
					<p className="text-sm text-gray-500 mt-1">
						Select a client and journal type.
					</p>
				</div>

				<div className="p-6 space-y-4">
					{/* Journal Type */}
					<div>
						<label
							htmlFor="journal-type"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Journal Type
						</label>
						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setJournalType("transition")}
								className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
									journalType === "transition"
										? "border-blue-500 bg-blue-50 text-blue-700"
										: "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
								}`}
							>
								🔄 Transition
							</button>
							<button
								type="button"
								onClick={() => setJournalType("stewardship")}
								className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
									journalType === "stewardship"
										? "border-green-500 bg-green-50 text-green-700"
										: "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
								}`}
							>
								🤝 Stewardship
							</button>
						</div>
					</div>

					{/* Company Search */}
					<div>
						<label
							htmlFor="company-search"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Client
						</label>
						<input
							id="company-search"
							type="text"
							placeholder="Search companies..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
						/>
					</div>

					{/* Company List */}
					<div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
						{filtered.length === 0 ? (
							<div className="px-4 py-3 text-sm text-gray-400 text-center">
								No companies found.
							</div>
						) : (
							filtered.map((c) => (
								<button
									key={c._id}
									type="button"
									onClick={() => setSelectedCompany(c._id)}
									className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
										selectedCompany === c._id
											? "bg-orange-50 text-orange-700"
											: "bg-white text-gray-700 hover:bg-gray-50"
									}`}
								>
									<span className="font-medium">{c.name}</span>
									{c.stage && (
										<span className="ml-2 text-xs text-gray-400">
											{c.stage}
										</span>
									)}
								</button>
							))
						)}
					</div>
				</div>

				<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
					>
						Cancel
					</button>
					<button
						onClick={() =>
							selectedCompany && onCreate(selectedCompany, journalType)
						}
						disabled={!selectedCompany || creating}
						className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{creating ? "Creating..." : "Create Journal"}
					</button>
				</div>
			</div>
		</div>
	);
}
