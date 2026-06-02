"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import {
	ChevronDown,
	CheckCircle2,
	XCircle,
	Clock,
	AlertTriangle,
} from "lucide-react";

// Import phase map from seed data
const PHASE_MAP: Record<string, { name: string; days: string; color: string }> =
	{
		ignition: {
			name: "Phase 1 — Ignition",
			days: "Days 1–14",
			color: "#185FA5",
		},
		build: { name: "Phase 2 — Build", days: "Days 15–45", color: "#3B6D11" },
		validate: {
			name: "Phase 3 — Validate",
			days: "Days 46–75",
			color: "#854F0B",
		},
		"close-prep": {
			name: "Phase 4 — Close Prep",
			days: "Days 76–105",
			color: "#D4763A",
		},
		closing: {
			name: "Phase 5 — Closing",
			days: "Days 106–120",
			color: "#A32D2D",
		},
	};

// ─── Types ──────────────────────────────────────────────────────

interface Task {
	id: string;
	day: string;
	role: string;
	type: "milestone" | "action" | "deadline" | "deliverable" | "gate";
	title: string;
	subs: string[];
}

interface Phase {
	id: string;
	name: string;
	days: string;
	color: string;
	tasks: Task[];
}

interface Gate {
	id: string;
	day: string;
	name: string;
	phase: string;
}

type GateStatus = "pending" | "cleared" | "blocked";

interface TrackerState {
	subs: Record<string, boolean>;
	gates: Record<string, GateStatus>;
	expanded: Record<string, boolean>;
}

// ─── Data ───────────────────────────────────────────────────────

const GATES: Gate[] = [
	{ day: "Day 45", name: "FMV adequacy letter", phase: "Phase 2", id: "g1" },
	{ day: "Day 60", name: "Lender commitment letter", phase: "Phase 3", id: "g2" },
	{ day: "Day 75", name: "QofE EBITDA validation", phase: "Phase 3", id: "g3" },
	{ day: "Day 90", name: "Trustee COOP sign-off", phase: "Phase 4", id: "g4" },
];

// ─── Badge ──────────────────────────────────────────────────────

const TYPE_STYLES: Record<
	string,
	{ bg: string; text: string; label: string; icon: string }
> = {
	milestone: {
		bg: "bg-emerald-100 dark:bg-emerald-900/30",
		text: "text-emerald-700 dark:text-emerald-400",
		label: "milestone",
		icon: "✓",
	},
	action: {
		bg: "bg-amber-100 dark:bg-amber-900/30",
		text: "text-amber-700 dark:text-amber-400",
		label: "action required",
		icon: "⚡",
	},
	deadline: {
		bg: "bg-red-100 dark:bg-red-900/30",
		text: "text-red-700 dark:text-red-400",
		label: "hard deadline",
		icon: "⏰",
	},
	deliverable: {
		bg: "bg-indigo-100 dark:bg-indigo-900/30",
		text: "text-indigo-700 dark:text-indigo-400",
		label: "deliverable",
		icon: "📄",
	},
	gate: {
		bg: "bg-red-600",
		text: "text-white",
		label: "hard stop gate",
		icon: "🚫",
	},
};

function Badge({
	type,
	role,
	day,
}: {
	type: string;
	role: string;
	day: string;
}) {
	const style = TYPE_STYLES[type] ?? TYPE_STYLES.action;
	return (
		<div className="flex flex-wrap gap-1 mt-1">
			<span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
				D{day.replace("D.", "")}
			</span>
			<span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
				{role}
			</span>
			<span
				className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}
			>
				{style.icon} {style.label}
			</span>
		</div>
	);
}

// ─── Gate Card ──────────────────────────────────────────────────

function GateCard({
	gate,
	status,
	onToggle,
}: {
	gate: Gate;
	status: GateStatus;
	onToggle: () => void;
}) {
	const colors = {
		cleared: {
			border: "border-l-emerald-500",
			icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
			text: "text-emerald-700 dark:text-emerald-400",
			label: "cleared",
		},
		blocked: {
			border: "border-l-red-500",
			icon: <XCircle className="w-3.5 h-3.5 text-red-600" />,
			text: "text-red-700 dark:text-red-400",
			label: "blocked",
		},
		pending: {
			border: "border-l-amber-500",
			icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
			text: "text-amber-700 dark:text-amber-400",
			label: "pending",
		},
	};
	const c = colors[status];

	return (
		<button
			onClick={onToggle}
			className={`text-left rounded-lg border border-gray-200 dark:border-gray-700 ${c.border} border-l-[3px] p-3.5 bg-white dark:bg-[#1F2521] hover:border-gray-300 dark:hover:border-gray-600 transition-colors`}
		>
			<div className="flex items-center justify-between mb-1">
				<div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
					Gate {gate.id.replace("g", "")}
				</div>
				<div className="text-[10px] text-gray-400 dark:text-gray-500">
					{gate.day}
				</div>
			</div>
			<div className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-snug">
				{gate.name}
			</div>
			<div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
				{gate.phase}
			</div>
			<div
				className={`flex items-center gap-1 mt-2 text-[10px] font-medium ${c.text}`}
			>
				{c.icon}
				{c.label}
			</div>
		</button>
	);
}

// ─── Task Item ──────────────────────────────────────────────────

function TaskItem({
	task,
	state,
	onToggleSub,
	onMarkAll,
	onToggleExpand,
}: {
	task: Task;
	state: TrackerState;
	onToggleSub: (idx: number) => void;
	onMarkAll: () => void;
	onToggleExpand: () => void;
}): React.ReactNode {
	const allDone = task.subs.every((_, i) => state.subs[`${task.id}_${i}`]);
	const isExpanded = state.expanded[task.id];
	const isGate = task.type === "gate";

	return (
		<div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
			<div
				className="flex items-start gap-2.5 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
				onClick={onToggleExpand}
			>
				<button
					onClick={(e) => {
						e.stopPropagation();
						onMarkAll();
					}}
					className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-colors ${
						allDone
							? "bg-emerald-500 border-emerald-500"
							: "border-gray-300 dark:border-gray-600"
					}`}
				>
					{allDone && <CheckCircle2 className="w-3 h-3 text-white" />}
				</button>
				<div className="flex-1 min-w-0">
					<div
						className={`text-[13px] font-medium leading-snug ${allDone ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-200"}`}
					>
						{task.title}
					</div>
					<Badge type={task.type} role={task.role} day={task.day} />
				</div>
				<span className="flex-shrink-0 text-xs text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">
					{isExpanded ? "−" : "+"}
				</span>
			</div>
			{isExpanded && (
				<div className="px-4 pb-3 pl-11 space-y-1.5">
					{task.subs.map((sub, i) => {
						const subDone = state.subs[`${task.id}_${i}`];
						return (
							<div key={i} className="flex items-start gap-2">
								<button
									onClick={() => onToggleSub(i)}
									className={`mt-1 flex-shrink-0 w-3.5 h-3.5 rounded-[3px] border-[1.5px] flex items-center justify-center transition-colors ${
										subDone
											? "bg-emerald-400 border-emerald-400"
											: "border-gray-300 dark:border-gray-600"
									}`}
								/>
								<span
									className={`text-xs leading-relaxed ${subDone ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-400"}`}
								>
									{sub}
								</span>
							</div>
						);
					})}
					{isGate && (
						<div className="flex items-center gap-2 mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
							<AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
							<span className="text-[11px] font-medium text-red-700 dark:text-red-400">
								Hard stop — no downstream work proceeds until this gate is
								cleared
							</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

// ─── Phase Block ────────────────────────────────────────────────

function PhaseBlock({
	phase,
	state,
	onAction,
}: {
	phase: Phase;
	state: TrackerState;
	onAction: (action: string, taskId?: string, idx?: number) => void;
}) {
	const isOpen = state.expanded[phase.id];
	const totalSubs = phase.tasks.reduce((sum, t) => sum + t.subs.length, 0);
	const doneSubs = phase.tasks.reduce(
		(sum, t) =>
			sum + t.subs.filter((_, i) => state.subs[`${t.id}_${i}`]).length,
		0,
	);
	const pct = totalSubs > 0 ? Math.round((doneSubs / totalSubs) * 100) : 0;

	return (
		<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2521] overflow-hidden">
			<button
				onClick={() => onAction("togglePhase", phase.id)}
				className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
			>
				<div
					className="w-2.5 h-2.5 rounded-full flex-shrink-0"
					style={{ backgroundColor: phase.color }}
				/>
				<div className="flex-1 text-left">
					<div className="text-sm font-medium text-gray-800 dark:text-gray-200">
						{phase.name}
					</div>
					<div className="text-[11px] text-gray-400 dark:text-gray-500">
						{phase.days}
					</div>
				</div>
				<div className="flex items-center gap-2.5">
					<span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
						{doneSubs}/{totalSubs}
					</span>
					<div className="w-14 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							className="h-full rounded-full transition-all"
							style={{ width: `${pct}%`, backgroundColor: phase.color }}
						/>
					</div>
				</div>
				<ChevronDown
					className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>
			{isOpen && (
				<div className="border-t border-gray-100 dark:border-gray-800">
					{phase.tasks.map((task) => (
						<TaskItem
							key={task.id}
							task={task}
							state={state}
							onToggleSub={(idx) => onAction("toggleSub", task.id, idx)}
							onMarkAll={() => onAction("markAll", task.id)}
							onToggleExpand={() => onAction("toggleTask", task.id)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

// ─── Main Component ─────────────────────────────────────────────

interface DealTrackerProps {
	companyId?: string;
	roleFilter?: string;
	searchQuery?: string;
}

export function DealTracker({
	companyId,
	roleFilter = "all",
	searchQuery = "",
}: DealTrackerProps) {
	const { user } = useUser();
	const userEmail = user?.emailAddresses[0]?.emailAddress;

	// Convex queries and mutations
	const trackerState = useQuery(
		api.dealTracker.getTrackerState,
		companyId ? { companyId: companyId as Id<"crmCompanies"> } : "skip",
	);
	const toggleSubtaskMutation = useMutation(api.dealTracker.toggleSubtask);
	const toggleAllSubtasksMutation = useMutation(
		api.dealTracker.toggleAllSubtasks,
	);
	const toggleGateMutation = useMutation(api.dealTracker.toggleGate);

	// Local UI state for expand/collapse
	const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>(
		{},
	);
	const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
		{},
	);

	// Transform Convex data to component format
	const tasksByPhase = useMemo(() => {
		if (!trackerState?.tasks) return {};

		const grouped: Record<string, typeof trackerState.tasks> = {};
		for (const task of trackerState.tasks) {
			if (!grouped[task.phase]) grouped[task.phase] = [];
			grouped[task.phase].push(task);
		}
		// Sort by order
		for (const phase of Object.keys(grouped)) {
			grouped[phase].sort((a, b) => a.order - b.order);
		}
		return grouped;
	}, [trackerState?.tasks]);

	// Get gate statuses from tasks
	const gateStatuses = useMemo(() => {
		if (!trackerState?.tasks) return {} as Record<string, GateStatus>;

		const gates: Record<string, GateStatus> = {};
		for (const task of trackerState.tasks) {
			if (task.taskType === "gate" && task.gateStatus) {
				gates[task.taskId] = task.gateStatus as GateStatus;
			}
		}
		return gates;
	}, [trackerState?.tasks]);

	// Handle actions
	const handleAction = useCallback(
		(action: string, taskId?: string, idx?: number) => {
			if (!companyId) return;

			if (action === "togglePhase" && taskId) {
				setExpandedPhases((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
			} else if (action === "toggleTask" && taskId) {
				setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
			} else if (action === "toggleSub" && taskId && idx !== undefined) {
				toggleSubtaskMutation({
					companyId: companyId as Id<"crmCompanies">,
					taskId,
					subtaskIndex: idx,
					toggledBy: userEmail,
				});
			} else if (action === "markAll" && taskId) {
				toggleAllSubtasksMutation({
					companyId: companyId as Id<"crmCompanies">,
					taskId,
					toggledBy: userEmail,
				});
			} else if (action === "toggleGate" && taskId) {
				toggleGateMutation({
					companyId: companyId as Id<"crmCompanies">,
					gateId: taskId,
					toggledBy: userEmail,
				});
			}
		},
		[
			companyId,
			userEmail,
			toggleSubtaskMutation,
			toggleAllSubtasksMutation,
			toggleGateMutation,
		],
	);

	// Filter phases by role and search
	const phaseKeys = [
		"ignition",
		"build",
		"validate",
		"close-prep",
		"closing",
	] as const;

	const searchLower = searchQuery.toLowerCase().trim();

	const filteredPhases = useMemo(() => {
		return phaseKeys
			.map((phaseKey) => {
				const tasks = tasksByPhase[phaseKey] || [];

				// Filter by role
				let filteredTasks =
					roleFilter === "all"
						? tasks
						: tasks.filter(
								(t) => t.role === roleFilter || t.role === "All Parties",
							);

				// Filter by search query
				if (searchLower) {
					filteredTasks = filteredTasks.filter((t) => {
						// Search in task title
						if (t.taskTitle.toLowerCase().includes(searchLower)) return true;
						// Search in subtask labels
						if (
							t.subtasks.some((s) =>
								s.label.toLowerCase().includes(searchLower),
							)
						)
							return true;
						// Search in role
						if (t.role.toLowerCase().includes(searchLower)) return true;
						return false;
					});
				}

				return {
					id: phaseKey,
					...PHASE_MAP[phaseKey],
					tasks: filteredTasks.map((t) => ({
						id: t.taskId,
						day: t.dayTarget,
						role: t.role,
						type: t.taskType,
						title: t.taskTitle,
						subs: t.subtasks.map((s) => s.label),
					})),
				};
			})
			.filter((phase) => phase.tasks.length > 0);
	}, [tasksByPhase, roleFilter, searchLower]);

	// Phase stats for filtered view
	const filteredTotalSubs = filteredPhases.reduce(
		(sum, p) => sum + p.tasks.reduce((s, t) => s + t.subs.length, 0),
		0,
	);
	const filteredDoneSubs = filteredPhases.reduce((sum, p) => {
		return (
			sum +
			p.tasks.reduce((s, t) => {
				const taskData = trackerState?.tasks?.find((td) => td.taskId === t.id);
				if (!taskData) return s;
				return s + taskData.subtasks.filter((st) => st.completed).length;
			}, 0)
		);
	}, 0);
	const filteredPct =
		filteredTotalSubs > 0
			? Math.round((filteredDoneSubs / filteredTotalSubs) * 100)
			: 0;

	// Expand/Collapse all handler
	const handleExpandAll = useCallback(() => {
		const allExpanded: Record<string, boolean> = {};
		for (const phase of filteredPhases) {
			allExpanded[phase.id] = true;
		}
		setExpandedPhases(allExpanded);
	}, [filteredPhases]);

	const handleCollapseAll = useCallback(() => {
		setExpandedPhases({});
	}, []);

	return (
		<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-[#F0EBE3] dark:bg-[#2A3028] p-4">
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div>
					<div className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
						120-Day Deal Tracker
					</div>
					<div className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
						ESOP Transaction Roadmap
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={handleExpandAll}
						className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
					>
						Expand All
					</button>
					<span className="text-gray-300 dark:text-gray-600">|</span>
					<button
						onClick={handleCollapseAll}
						className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
					>
						Collapse All
					</button>
					<div className="text-right ml-4">
						<div className="text-xl font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
							{filteredPct}%
						</div>
						<div className="text-[11px] text-gray-500 dark:text-gray-400">
							{filteredDoneSubs} of {filteredTotalSubs} items
						</div>
					</div>
				</div>
			</div>

			{/* Progress Bar */}
			<div className="mb-4">
				<div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
					<div
						className="h-full bg-emerald-600 rounded-full transition-all duration-500"
						style={{ width: `${filteredPct}%` }}
					/>
				</div>
			</div>

			{/* Phase Color Legend */}
			<div className="flex flex-wrap gap-3 mb-4">
				{Object.entries(PHASE_MAP).map(([key, phase]) => (
					<div key={key} className="flex items-center gap-1.5">
						<div
							className="w-2.5 h-2.5 rounded-full"
							style={{ backgroundColor: phase.color }}
						/>
						<span className="text-[10px] text-gray-500 dark:text-gray-400">
							{phase.name}
						</span>
					</div>
				))}
			</div>

			{/* Gate Cards */}
			<div className="grid grid-cols-2 gap-2 lg:grid-cols-4 mb-4">
				{GATES.map((g) => (
					<GateCard
						key={g.id}
						gate={g}
						status={gateStatuses[g.id] ?? "pending"}
						onToggle={() => handleAction("toggleGate", g.id)}
					/>
				))}
			</div>

			{/* Phase List */}
			<div className="space-y-2">
				{filteredPhases.length > 0 ? (
					filteredPhases.map((phase) => (
						<PhaseBlock
							key={phase.id}
							phase={phase}
							state={{
								subs: Object.fromEntries(
									(trackerState?.tasks || [])
										.filter((t) => t.phase === phase.id)
										.flatMap((t) =>
											t.subtasks.map((s, i) => [
												`${t.taskId}_${i}`,
												s.completed,
											]),
										),
								),
								gates: gateStatuses,
								expanded: { ...expandedPhases, ...expandedTasks },
							}}
							onAction={handleAction}
						/>
					))
				) : (
					<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2521] p-8 text-center">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{searchQuery
								? `No tasks matching "${searchQuery}"`
								: `No ${roleFilter} tasks in this tracker`}
						</p>
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
				<p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
					<strong className="text-gray-700 dark:text-gray-300">
						Hard stop gates are non-negotiable.
					</strong>{" "}
					No downstream work proceeds past a gate until the condition is met.
					Gate 1 (Day 45) = FMV adequacy letter. Gate 2 (Day 60) = Lender
					commitment letter. Gate 3 (Day 75) = QofE EBITDA within 15% of LOI.
					Gate 4 (Day 90) = Trustee COOP sign-off.
				</p>
			</div>
		</div>
	);
}
