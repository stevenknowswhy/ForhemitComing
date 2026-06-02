"use client";

import { useState } from "react";
import Link from "next/link";
import { ActivityRings } from "@/components/radial-gauge";

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

interface PhaseCardProps {
	phases: PhaseData[];
	href?: string;
}

// Ring color palettes per phase
const RING_PALETTES: Record<string, string[]> = {
	ignition: ["#E85D75", "#FF8F6B", "#FFD166", "#4ECDC4", "#6C63FF"],
	build: ["#FF6B6B", "#FFA07A", "#48D1CC", "#9B59B6", "#F39C12"],
	validate: ["#E74C3C", "#F1C40F", "#2ECC71", "#3498DB", "#9B59B6"],
	closeprep: ["#E85D75", "#FF6F61", "#FFD666", "#2EC4B6", "#7C5CFC"],
	closing: ["#D4763A", "#FFD166", "#06D6A0", "#118AB2", "#7C5CFC"],
};

export function PhaseCard({ phases, href }: PhaseCardProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const active = phases[activeIndex];

	if (!active) return null;

	const ringColors = RING_PALETTES[active.key] ?? RING_PALETTES.ignition;

	const rings = active.categories.map((cat, i) => ({
		percent: cat.total > 0 ? Math.round((cat.done / cat.total) * 100) : 0,
		color: ringColors[i] ?? active.color,
	}));

	const content = (
		<div className="rounded-lg border border-[var(--border-light)] dark:border-[#3A423A] bg-[#F0EBE3] dark:bg-[#2A3028] p-4 transition-colors hover:border-[var(--color-brand-border)]">
			{/* Phase Tabs */}
			<div className="mb-3 flex gap-1 overflow-x-auto">
				{phases.map((phase, i) => (
					<button
						key={phase.key}
						onClick={() => setActiveIndex(i)}
						className={`flex-shrink-0 rounded-md px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
							i === activeIndex
								? "text-white"
								: "text-[#7A7A7A] dark:text-[#8A8580] hover:text-[#1A1A1A] dark:hover:text-[#E8E6E1]"
						}`}
						style={
							i === activeIndex ? { backgroundColor: phase.color } : undefined
						}
					>
						{phase.label}
					</button>
				))}
			</div>

			{/* Active Phase Content */}
			<div className="flex flex-col items-center gap-3">
				<ActivityRings rings={rings} size={200} thickness={12} gap={4} />

				<div className="text-center">
					<p className="font-semibold text-lg tabular-nums text-[#1A1A1A] dark:text-[#E8E6E1]">
						{active.count}
					</p>
					<p className="text-[10px] font-medium text-[#7A7A7A] dark:text-[#8A8580]">
						{active.subtitle}
					</p>
				</div>

				{/* Category Legend */}
				<div className="w-full space-y-1">
					{active.categories.map((cat, i) => {
						const pct =
							cat.total > 0 ? Math.round((cat.done / cat.total) * 100) : 0;
						return (
							<div key={cat.name} className="flex items-center gap-2">
								<div
									className="h-2 w-2 flex-shrink-0 rounded-full"
									style={{ backgroundColor: ringColors[i] }}
								/>
								<span className="min-w-0 flex-1 truncate text-[10px] text-[#7A7A7A] dark:text-[#8A8580]">
									{cat.name}
								</span>
								<span className="w-7 text-right text-[10px] tabular-nums text-[#5A5A5A] dark:text-[#A8A5A0]">
									{pct}%
								</span>
							</div>
						);
					})}
				</div>
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
