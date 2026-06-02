"use client";

import { useState, useMemo, useId, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
	RadialBarChart,
	RadialBar,
	Tooltip,
	Cell,
	ResponsiveContainer,
} from "recharts";
import {
	PHASE_CHART_CONFIG,
	normalizePhaseKey,
	gateStatusLabel,
	gateDotColor,
} from "@forhemit/shared/lib/phaseChartConfig";
import type {
	RingConfig,
	GateConfig,
} from "@forhemit/shared/lib/phaseChartConfig";

// ─── Types ──────────────────────────────────────────────────────

/** Aggregate mode — existing shape from pipelinePhases.getPhaseStats */
interface Category {
	name: string;
	done: number;
	total: number;
}

interface PhaseData {
	key: string;
	label: string;
	subtitle: string;
	color: string;
	count: number;
	categories: Category[];
}

/** Per-deal mode — shape from dealTracker.getPhaseChartStats */
interface RingData {
	phase: string;
	ringIndex: number;
	taskId: string;
	label: string;
	completedSubs: number;
	totalSubs: number;
	fillPercent: number;
	isGate: boolean;
}

interface GateData {
	gateIndex: number;
	label: string;
	dayTarget: number;
	status: "cleared" | "pending" | "blocked";
}

interface SummaryData {
	completedItems: number;
	totalItems: number;
	percent: number;
}

/** Union props — component infers mode from which data is provided */
interface PhaseRadialChartProps {
	/** Aggregate mode data (existing pipelinePhases shape) */
	aggregatePhases?: PhaseData[];
	/** Per-deal mode data */
	rings?: RingData[];
	gates?: GateData[];
	summary?: SummaryData;
	/** State flags */
	isLoading?: boolean;
	hasData?: boolean;
	/** Display */
	showTooltips?: boolean;
	/** Link wrapping the card */
	href?: string;
}

// ─── Ring Color Palettes ────────────────────────────────────────

const RING_PALETTES: Record<string, { light: string[]; dark: string[] }> = {
	ignition: {
		light: ["#E85D75", "#FF8F6B", "#FFD166", "#4ECDC4", "#6C63FF"],
		dark: ["#F07A93", "#FFA88A", "#FFE08A", "#6EDDD6", "#8B83FF"],
	},
	build: {
		light: ["#FF6B6B", "#FFA07A", "#48D1CC", "#9B59B6", "#F39C12"],
		dark: ["#FF8A8A", "#FFB899", "#6DE0D8", "#B07CC8", "#F5B041"],
	},
	validate: {
		light: ["#E74C3C", "#F1C40F", "#2ECC71", "#3498DB", "#9B59B6"],
		dark: ["#F06B5D", "#F5D33B", "#58D890", "#5DADE2", "#B07CC8"],
	},
	closeprep: {
		light: ["#E85D75", "#FF6F61", "#FFD666", "#2EC4B6", "#7C5CFC"],
		dark: ["#F07A93", "#FF8F81", "#FFE48A", "#56D8CB", "#9B7DFE"],
	},
	closing: {
		light: ["#D4763A", "#FFD166", "#06D6A0", "#118AB2", "#7C5CFC"],
		dark: ["#E09A62", "#FFE08A", "#3AE0BC", "#3AA8CC", "#9B7DFE"],
	},
};

const TRACK_COLOR = "var(--phase-track, #e5e7eb)";

// Shared background for blob + content panel (must match for gooey merge)
const GOOEY_SURFACE = "var(--chart-surface)";

// ─── Dark Mode Hook ─────────────────────────────────────────────

function useIsDark() {
	const [isDark, setIsDark] = useState(false);
	useEffect(() => {
		const root = document.documentElement;
		setIsDark(root.classList.contains("dark"));
		const observer = new MutationObserver(() => {
			setIsDark(root.classList.contains("dark"));
		});
		observer.observe(root, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);
	return isDark;
}

// ─── Tooltip ────────────────────────────────────────────────────

interface TooltipPayloadItem {
	name?: string;
	value?: number;
	payload?: Record<string, unknown>;
}

function PhaseTooltip({
	active,
	payload,
	mode,
}: {
	active?: boolean;
	payload?: TooltipPayloadItem[];
	mode: "aggregate" | "per-deal";
}) {
	if (!active || !payload?.length) return null;
	const item = payload[0];
	const label = (item.payload?.displayName as string) ?? item.name ?? "";
	const value = item.value ?? 0;
	const completed = (item.payload?.completed as number) ?? 0;
	const total = (item.payload?.total as number) ?? 0;
	const isGate = (item.payload?.isGate as boolean) ?? false;
	const gateStatus = item.payload?.gateStatus as string | undefined;

	return (
		<div
			className="rounded-lg px-3 py-2 shadow-lg text-xs bg-[#F0EBE3] dark:bg-[#3A4A3A]"
			style={{ border: "1px solid var(--border-light)" }}
		>
			<div className="flex items-center gap-2">
				<div
					className="h-2 w-2 rounded-full"
					style={{ backgroundColor: item.payload?.fill as string }}
				/>
				<span style={{ color: "var(--stone)" }}>{label}</span>
			</div>
			<div className="mt-1 text-[10px]" style={{ color: "var(--stone-light)" }}>
				{mode === "aggregate"
					? `${completed} of ${total} deals completed`
					: `${completed} of ${total} subtasks complete`}
			</div>
			{isGate && gateStatus && (
				<div
					className="mt-1 flex items-center gap-1 text-[10px] font-medium"
					style={{
						color: gateDotColor(
							gateStatus as "cleared" | "pending" | "blocked",
						),
					}}
				>
					<span>●</span>
					{gateStatusLabel(gateStatus as "cleared" | "pending" | "blocked")}
				</div>
			)}
		</div>
	);
}

// ─── Gate Status Row ────────────────────────────────────────────

function GateStatusRow({ gates }: { gates: GateData[] }) {
	return (
		<div className="mt-3 grid grid-cols-4 gap-2">
			{gates.map((gate) => {
				const color = gateDotColor(gate.status);
				const label = gateStatusLabel(gate.status);
				return (
					<div
						key={gate.gateIndex}
						className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1.5"
						style={{ backgroundColor: "var(--bg-hover, rgba(0,0,0,0.03))" }}
					>
						<span
							className="text-[9px] font-medium uppercase tracking-wider"
							style={{ color: "var(--stone-light)" }}
						>
							{gate.label}
						</span>
						<span className="text-[9px]" style={{ color: "var(--stone)" }}>
							Day {gate.dayTarget}
						</span>
						<span
							className="flex items-center gap-1 text-[10px] font-medium"
							style={{ color }}
						>
							<span style={{ fontSize: 8 }}>●</span>
							{label}
						</span>
					</div>
				);
			})}
		</div>
	);
}

// ─── Loading Skeleton ───────────────────────────────────────────

function ChartSkeleton() {
	return (
		<div className="flex items-center justify-center" style={{ height: 260 }}>
			<div className="flex flex-col items-center gap-2 opacity-30">
				<div
					className="rounded-full animate-pulse"
					style={{
						width: 160,
						height: 160,
						background: "var(--stone-light)",
					}}
				/>
				<span
					className="text-xs animate-pulse"
					style={{ color: "var(--stone-light)" }}
				>
					Loading...
				</span>
			</div>
		</div>
	);
}

// ─── Legend Entry ───────────────────────────────────────────────

interface LegendEntry {
	displayName: string;
	fill: string;
	value: number;
	completed: number;
	total: number;
	isGate: boolean;
	gateStatus?: string;
}

// ─── Component ──────────────────────────────────────────────────

export function PhaseRadialChart({
	aggregatePhases,
	rings,
	gates,
	summary,
	isLoading = false,
	hasData = true,
	showTooltips = true,
	href,
}: PhaseRadialChartProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const chartId = useId().replace(/:/g, "");
	const gooeyId = useId().replace(/:/g, "");
	const isDark = useIsDark();

	// Determine mode
	const mode: "aggregate" | "per-deal" = rings ? "per-deal" : "aggregate";

	// ── Tab labels ──────────────────────────────────────────────

	const tabs = useMemo(() => {
		if (mode === "aggregate" && aggregatePhases) {
			return aggregatePhases.map((p) => ({
				key: p.key,
				label: p.label,
			}));
		}
		return PHASE_CHART_CONFIG.phases.map((p) => ({
			key: p.key,
			label: p.label,
		}));
	}, [mode, aggregatePhases]);

	// Clamp active index
	const safeIndex = Math.min(activeIndex, tabs.length - 1);
	if (safeIndex !== activeIndex) {
		// Will re-render with clamped value
	}

	const activeTab = tabs[safeIndex];

	// ── Ring data for active tab ────────────────────────────────

	const { chartData, legendEntries, gradients, glowFilters, rightColumn } =
		useMemo(() => {
			const data: Record<string, unknown>[] = [];
			const legends: LegendEntry[] = [];
			const grads: { id: string; color: string }[] = [];
			const glows: { id: string; color: string }[] = [];

			const palette =
				RING_PALETTES[activeTab?.key ?? "ignition"] ?? RING_PALETTES.ignition;
			const ringColors = isDark ? palette.dark : palette.light;

			if (mode === "aggregate" && aggregatePhases) {
				// ── Aggregate mode ──────────────────────────────
				const phase = aggregatePhases[safeIndex];
				if (!phase)
					return {
						chartData: [],
						legendEntries: [],
						gradients: [],
						glowFilters: [],
						rightColumn: { top: "0", bottom: "deals" },
					};

				const cats = [...phase.categories].reverse();
				cats.forEach((cat, i) => {
					const key = `cat-${i}`;
					const completion =
						cat.total > 0 ? Math.round((cat.done / cat.total) * 100) : 0;
					const colorIdx = phase.categories.length - 1 - i;
					const color = ringColors[colorIdx % ringColors.length];

					data.push({
						name: key,
						displayName: cat.name,
						completion,
						fill: `url(#${chartId}-grad-${key})`,
						completed: cat.done,
						total: cat.total,
						isGate: false,
					});
					legends.push({
						displayName: cat.name,
						fill: color,
						value: completion,
						completed: cat.done,
						total: cat.total,
						isGate: false,
					});
					grads.push({ id: `${chartId}-grad-${key}`, color });
					glows.push({ id: `${chartId}-glow-${key}`, color });
				});

				return {
					chartData: data,
					legendEntries: legends,
					gradients: grads,
					glowFilters: glows,
					rightColumn: { top: String(phase.count), bottom: "deals" },
				};
			}

			if (mode === "per-deal" && rings) {
				// ── Per-deal mode ───────────────────────────────
				const phaseKey = activeTab?.key ?? "ignition";
				const phaseRings = rings.filter(
					(r) => normalizePhaseKey(r.phase) === phaseKey,
				);

				// Match config order
				const configPhase = PHASE_CHART_CONFIG.phases.find(
					(p) => p.key === phaseKey,
				);
				const orderedRings = configPhase
					? configPhase.rings
							.map((cfg) => phaseRings.find((r) => r.taskId === cfg.taskId))
							.filter(Boolean)
					: phaseRings;

				// Reverse for visual (inner ring = last)
				const reversed = [...orderedRings].reverse();

				reversed.forEach((ring, i) => {
					if (!ring) return;
					const key = `ring-${i}`;
					const colorIdx = orderedRings.length - 1 - i;
					const color = ringColors[colorIdx % ringColors.length];

					// Find gate status if this ring is a gate
					let gateStatus: string | undefined;
					if (ring.isGate && gates) {
						const gateConfig = configPhase?.rings.find(
							(r) => r.taskId === ring.taskId,
						);
						if (gateConfig?.isGate && gateConfig.gateIndex !== undefined) {
							const gate = gates.find(
								(g) => g.gateIndex === gateConfig.gateIndex,
							);
							gateStatus = gate?.status;
						}
					}

					data.push({
						name: key,
						displayName: ring.label,
						completion: ring.fillPercent,
						fill: `url(#${chartId}-grad-${key})`,
						completed: ring.completedSubs,
						total: ring.totalSubs,
						isGate: ring.isGate,
						gateStatus,
					});
					legends.push({
						displayName: ring.label,
						fill: color,
						value: ring.fillPercent,
						completed: ring.completedSubs,
						total: ring.totalSubs,
						isGate: ring.isGate,
						gateStatus,
					});
					grads.push({ id: `${chartId}-grad-${key}`, color });
					glows.push({ id: `${chartId}-glow-${key}`, color });
				});

				// Phase summary for right column
				const phaseTotal = phaseRings.reduce((s, r) => s + r.totalSubs, 0);
				const phaseCompleted = phaseRings.reduce(
					(s, r) => s + r.completedSubs,
					0,
				);
				const phasePercent =
					phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0;

				return {
					chartData: data,
					legendEntries: legends,
					gradients: grads,
					glowFilters: glows,
					rightColumn: {
						top: `${phasePercent}%`,
						bottom: `${phaseCompleted} of ${phaseTotal} items`,
					},
				};
			}

			return {
				chartData: [],
				legendEntries: [],
				gradients: [],
				glowFilters: [],
				rightColumn: { top: "0", bottom: "deals" },
			};
		}, [
			mode,
			aggregatePhases,
			rings,
			gates,
			safeIndex,
			activeTab,
			chartId,
			isDark,
		]);

	// ── Empty / Loading states ──────────────────────────────────

	if (isLoading) {
		return (
			<div className="relative rounded-lg bg-[#F0EBE3] dark:bg-[#2A3028] border border-[var(--border-light)] dark:border-[#3A423A] p-4">
				<ChartSkeleton />
			</div>
		);
	}

	if (!hasData && mode === "per-deal") {
		return (
			<div className="relative rounded-lg bg-[#F0EBE3] dark:bg-[#2A3028] border border-[var(--border-light)] dark:border-[#3A423A] p-4">
				<div
					className="flex flex-col items-center justify-center gap-2"
					style={{ height: 260 }}
				>
					<span
						className="text-sm font-medium"
						style={{ color: "var(--stone)" }}
					>
						Tracker not yet initialized
					</span>
					<span className="text-xs" style={{ color: "var(--stone-light)" }}>
						No tracker data exists for this company
					</span>
				</div>
			</div>
		);
	}

	if (!activeTab) return null;

	// ── Content ─────────────────────────────────────────────────

	const content = (
		<div className="relative rounded-lg bg-[#F0EBE3] dark:bg-[#2A3028] border border-[var(--border-light)] dark:border-[#3A423A] p-4">
			{/* Gooey SVG filter — positioned offscreen, NOT display:none */}
			<svg
				style={{ position: "absolute", width: 0, height: 0 }}
				aria-hidden="true"
			>
				<defs>
					<filter id={`gooey-${gooeyId}`}>
						<feGaussianBlur
							in="SourceGraphic"
							stdDeviation={15}
							result="blur-sm"
						/>
						<feColorMatrix
							in="blur-sm"
							type="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
							result="goo"
						/>
						<feComposite in="SourceGraphic" in2="goo" operator="atop" />
					</filter>
				</defs>
			</svg>

			{/* Filtered layer: in normal flow, determines card height */}
			<div style={{ filter: `url(#gooey-${gooeyId})` }}>
				{/* Tab row with blob */}
				<div className="flex w-full">
					{tabs.map((tab, i) => (
						<div
							key={tab.key}
							className="relative flex-1"
							style={{ height: 36 }}
						>
							{safeIndex === i && (
								<motion.div
									layoutId="phase-tab-blob"
									className="absolute inset-0 rounded-lg"
									style={{ backgroundColor: GOOEY_SURFACE }}
									transition={{
										type: "spring",
										bounce: 0.0,
										duration: 0.4,
									}}
								/>
							)}
						</div>
					))}
				</div>

				{/* Content panel — same bg as blob, gooey merges them */}
				<div
					className="w-full overflow-hidden"
					style={{ backgroundColor: GOOEY_SURFACE }}
				>
					<AnimatePresence mode="popLayout">
						<motion.div
							key={safeIndex}
							initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="p-4"
						>
							<div className="flex gap-4">
								{/* LEFT: Category legend */}
								<div
									className="flex flex-col justify-center gap-2 pr-2"
									style={{ minWidth: 140 }}
								>
									{legendEntries.map((entry) => (
										<div
											key={entry.displayName}
											className="flex items-center gap-2"
										>
											<div
												className="h-2 w-2 shrink-0 rounded-[2px]"
												style={{ backgroundColor: entry.fill }}
											/>
											<span
												className="text-[10px] leading-tight"
												style={{ color: "var(--ink)" }}
											>
												{entry.displayName}
											</span>
											<span
												className="ml-auto text-[10px] tabular-nums"
												style={{ color: "var(--stone)" }}
											>
												{entry.value}%
											</span>
										</div>
									))}
								</div>

								{/* CENTER: Chart */}
								<div className="flex-1">
									<ResponsiveContainer width="100%" height={224}>
										<RadialBarChart
											cx="50%"
											cy="50%"
											innerRadius="30%"
											outerRadius="100%"
											startAngle={90}
											endAngle={-270}
											data={chartData}
										>
											<defs>
												{gradients.map((g) => (
													<linearGradient
														key={g.id}
														id={g.id}
														x1="0"
														y1="0"
														x2="1"
														y2="1"
													>
														<stop offset="0%" stopColor={g.color} />
														<stop
															offset="100%"
															stopColor={g.color}
															stopOpacity={0.7}
														/>
													</linearGradient>
												))}
												{glowFilters.map((g) => (
													<filter
														key={g.id}
														id={g.id}
														x="-50%"
														y="-50%"
														width="200%"
														height="200%"
													>
														<feGaussianBlur
															in="SourceGraphic"
															stdDeviation="4"
															result="blur"
														/>
														<feColorMatrix
															in="blur"
															type="matrix"
															values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0"
															result="glow"
														/>
														<feMerge>
															<feMergeNode in="glow" />
															<feMergeNode in="SourceGraphic" />
														</feMerge>
													</filter>
												))}
											</defs>

											<RadialBar
												dataKey="completion"
												cornerRadius={6}
												background={{ fill: TRACK_COLOR }}
												isAnimationActive
												animationDuration={800}
												animationEasing="ease-out"
											>
												{chartData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.fill as string}
														filter={`url(#${glowFilters[index]?.id})`}
													/>
												))}
											</RadialBar>

											{showTooltips && (
												<Tooltip content={<PhaseTooltip mode={mode} />} />
											)}
										</RadialBarChart>
									</ResponsiveContainer>
								</div>

								{/* RIGHT: Stats */}
								<div
									className="flex flex-col items-center justify-center pl-2"
									style={{ minWidth: 80 }}
								>
									<p
										className="font-semibold text-2xl tabular-nums"
										style={{ color: "var(--ink)" }}
									>
										{rightColumn.top}
									</p>
									<p
										className="text-[10px] font-medium text-center"
										style={{ color: "var(--stone-light)" }}
									>
										{rightColumn.bottom}
									</p>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>

			{/* Text overlay: absolute on top of tab row, no filter */}
			<div
				className="absolute top-1 left-0 right-0 z-10 flex"
				style={{ height: 36 }}
			>
				{tabs.map((tab, i) => (
					<button
						key={tab.key}
						type="button"
						className="flex-1"
						style={{ height: 36 }}
						onClick={() => setActiveIndex(i)}
					>
						<span
							className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase tracking-wider transition-colors"
							style={{
								color: safeIndex === i ? "var(--ink)" : "var(--stone-light)",
							}}
						>
							{tab.label}
						</span>
					</button>
				))}
			</div>

			{/* Gate status row — per-deal mode only */}
			{mode === "per-deal" && gates && gates.length > 0 && (
				<GateStatusRow gates={gates} />
			)}
		</div>
	);

	if (href) {
		return (
			<Link href={href} className="no-underline">
				{content}
			</Link>
		);
	}

	return content;
}
