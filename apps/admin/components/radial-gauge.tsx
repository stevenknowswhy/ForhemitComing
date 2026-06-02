"use client";

import { Pie, PieChart, Cell } from "recharts";

interface RingData {
	/** Value 0-100 (percentage) */
	percent: number;
	/** Ring color */
	color: string;
}

interface ActivityRingsProps {
	/** Array of rings, outermost first */
	rings: RingData[];
	/** Size in pixels */
	size?: number;
	/** Thickness of each ring */
	thickness?: number;
	/** Gap between rings */
	gap?: number;
	/** Track color */
	trackColor?: string;
}

export function ActivityRings({
	rings,
	size = 160,
	thickness = 10,
	gap = 4,
	trackColor = "var(--bg-tertiary, #e5e7eb)",
}: ActivityRingsProps) {
	const outerRadius = size / 2 - 4;

	return (
		<PieChart width={size} height={size}>
			{rings.map((ring, i) => {
				const ringOuter = outerRadius - i * (thickness + gap);
				const ringInner = ringOuter - thickness;
				const filled = Math.min(Math.max(ring.percent, 0), 100);
				const data = [
					{ name: "filled", value: filled },
					{ name: "empty", value: 100 - filled },
				];

				return (
					<Pie
						key={i}
						data={data}
						cx={size / 2}
						cy={size / 2}
						startAngle={90}
						endAngle={-270}
						innerRadius={ringInner}
						outerRadius={ringOuter}
						dataKey="value"
						strokeLinejoin="round"
						cornerRadius={thickness / 2}
						isAnimationActive
						animationDuration={800}
						animationEasing="ease-out"
						stroke="none"
					>
						<Cell fill={ring.color} />
						<Cell fill={trackColor} />
					</Pie>
				);
			})}
		</PieChart>
	);
}
