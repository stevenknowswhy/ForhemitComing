"use client";

import { useState, useMemo, useId } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
	RadialBarChart,
	RadialBar,
	Tooltip,
	Cell,
	ResponsiveContainer,
} from "recharts";

// ─── Types ──────────────────────────────────────────────────────

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

interface PhaseRadialChartProps {
	phases: PhaseData[];
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
// MUST differ from card bg in both themes:
//   light: card #F0EBE3 vs surface var(--sage-muted) #c5cebd
//   dark:  card #2A3028 vs surface var(--sage-muted) #3d4a3d
const GOOEY_SURFACE = "var(--chart-surface)";

// ─── Custom Tooltip ────────────────────────────────────────────

interface TooltipPayloadItem {
	name?: string;
	value?: number;
	payload?: Record<string, unknown>;
}

function PhaseTooltip({
	active,
	payload,
}: {
	active?: boolean;
	payload?: TooltipPayloadItem[];
}) {
	if (!active || !payload?.length) return null;
	const item = payload[0];
	const label = (item.payload?.displayName as string) ?? item.name ?? "";
	const value = item.value ?? 0;

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
				<span
					className="ml-auto font-mono font-medium tabular-nums"
					style={{ color: "var(--ink)" }}
				>
					{Math.round(value)}%
				</span>
			</div>
		</div>
	);
}

// ─── Legend Entry Type ──────────────────────────────────────────

interface LegendEntry {
	displayName: string;
	fill: string;
	value: number;
}

// ─── Component ──────────────────────────────────────────────────

export function PhaseRadialChart({ phases, href }: PhaseRadialChartProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const active = phases[activeIndex];
	const chartId = useId().replace(/:/g, "");
	const gooeyId = useId().replace(/:/g, "");

	if (!active) return null;

	const palette = RING_PALETTES[active.key] ?? RING_PALETTES.ignition;

	// Detect dark mode for chart ring colors
	const isDark =
		typeof window !== "undefined" &&
		(document.documentElement.classList.contains("dark") ||
			window.matchMedia("(prefers-color-scheme: dark)").matches);
	const ringColors = isDark ? palette.dark : palette.light;

	const { chartData, legendEntries, gradients, glowFilters } = useMemo(() => {
		const data: Record<string, unknown>[] = [];
		const legends: LegendEntry[] = [];
		const grads: { id: string; color: string }[] = [];
		const glows: { id: string; color: string }[] = [];

		const cats = [...active.categories].reverse();
		cats.forEach((cat, i) => {
			const key = `cat-${i}`;
			const completion =
				cat.total > 0 ? Math.round((cat.done / cat.total) * 100) : 0;
			const colorIdx = active.categories.length - 1 - i;
			const color = ringColors[colorIdx % ringColors.length];

			data.push({
				name: key,
				displayName: cat.name,
				completion,
				fill: `url(#${chartId}-grad-${key})`,
			});
			legends.push({ displayName: cat.name, fill: color, value: completion });
			grads.push({ id: `${chartId}-grad-${key}`, color });
			glows.push({ id: `${chartId}-glow-${key}`, color });
		});

		return {
			chartData: data,
			legendEntries: legends,
			gradients: grads,
			glowFilters: glows,
		};
	}, [active.categories, palette, chartId, active.key, ringColors]);

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

			{/* ── Filtered layer: in normal flow, determines card height ── */}
			<div style={{ filter: `url(#gooey-${gooeyId})` }}>
				{/* Tab row with blob */}
				<div className="flex w-full">
					{phases.map((_, i) => (
						<div
							key={phases[i].key}
							className="relative flex-1"
							style={{ height: 36 }}
						>
							{activeIndex === i && (
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
							key={activeIndex}
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

											<Tooltip content={<PhaseTooltip />} />
										</RadialBarChart>
									</ResponsiveContainer>
								</div>

								{/* RIGHT: Phase count + subtitle */}
								<div
									className="flex flex-col items-center justify-center pl-2"
									style={{ minWidth: 80 }}
								>
									<p
										className="font-semibold text-2xl tabular-nums"
										style={{ color: "var(--ink)" }}
									>
										{active.count}
									</p>
									<p
										className="text-[10px] font-medium"
										style={{ color: "var(--stone-light)" }}
									>
										{active.subtitle}
									</p>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>

			{/* ── Text overlay: absolute on top of tab row, no filter ── */}
			<div
				className="absolute top-1 left-0 right-0 z-10 flex"
				style={{ height: 36 }}
			>
				{phases.map((phase, i) => (
					<button
						key={phase.key}
						type="button"
						className="flex-1"
						style={{ height: 36 }}
						onClick={() => setActiveIndex(i)}
					>
						<span
							className={`flex h-full w-full items-center justify-center text-[10px] font-medium uppercase tracking-wider transition-colors ${
								activeIndex === i ? "" : ""
							}`}
							style={{
								color: activeIndex === i ? "var(--ink)" : "var(--stone-light)",
							}}
						>
							{phase.label}
						</span>
					</button>
				))}
			</div>
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
