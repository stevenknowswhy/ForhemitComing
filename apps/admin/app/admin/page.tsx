"use client";

import { useEffect, useMemo, useId, useState } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { isSuperAdmin } from "@/lib/clerk";
import Link from "next/link";
import { Building2 } from "lucide-react";

// Recharts
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { LabelList, Pie, PieChart } from "recharts";
import { Bar, BarChart, Cell, Rectangle, XAxis as BarXAxis } from "recharts";

// Phase Cards
import { PhaseRadialChart } from "@/components/phase-radial-chart";

// shadcn/ui
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Utilities
import { IconPlaceholder } from "@/components/icon-placeholder";
import {
	formatChartAxisTick,
	formatChartTooltipDate,
	parseIsoCalendarDate,
} from "@/components/formater";

// ─── Shared dark-mode class tokens ──────────────────────────────
const C = {
	// Card surface
	card: "bg-[#F0EBE3] dark:bg-[#2A3028]",
	// Primary text (headings, values)
	primary: "text-[#1A1A1A] dark:text-[#E8E6E1]",
	// Secondary text (descriptions, labels)
	secondary: "text-[#5A5A5A] dark:text-[#A8A5A0]",
	// Muted text (footnotes, timestamps)
	muted: "text-[#7A7A7A] dark:text-[#8A8580]",
	// Borders
	border: "border-[var(--border-light)] dark:border-[#3A423A]",
	// Stat card surface
	statCard: "bg-[#F0EBE3] dark:bg-[#2A3028]",
	// Hover surface
	hover: "hover:bg-[var(--bg-hover)] dark:hover:bg-[#3A423A]",
} as const;

// ─── Forhemit Chart Palette ────────────────────────────────────
const PALETTE = {
	sage: "#5A7A5A",
	clay: "#B87D5E",
	amber: "#C49A3C",
	stone: "#8A8580",
	brand: "#D4763A",
} as const;

// ─── Types ──────────────────────────────────────────────────────

interface GhostDashboardData {
	success: boolean;
	total: number;
	errorCount: number;
	dailyVolume: { day: string; count: number }[];
	typeBreakdown: { type: string; count: number }[];
	recentDocs: {
		company: string;
		type: string;
		fileName: string;
		createdAt: string;
	}[];
}

type PeriodDays = 7 | 30 | 60;

// ─── Stat Cards ─────────────────────────────────────────────────

// ─── Document Volume Area Chart ─────────────────────────────────

const volumeChartConfig = {
	generated: {
		label: "Documents",
		color: PALETTE.sage,
	},
} satisfies ChartConfig;

function DocumentVolumeChart({
	data,
}: {
	data: { day: string; count: number }[];
}) {
	const chartUid = useId().replace(/:/g, "");
	const idGradient = `doc-vol-${chartUid}`;
	const [periodDays, setPeriodDays] = useState<PeriodDays>(30);

	const chartRows = useMemo(() => {
		if (data.length === 0) return [];
		const refDate = parseIsoCalendarDate(data[data.length - 1].day);
		const startDate = new Date(refDate);
		startDate.setDate(startDate.getDate() - periodDays);
		return data
			.filter((item) => parseIsoCalendarDate(item.day) >= startDate)
			.map((item) => ({ date: item.day, generated: item.count }));
	}, [data, periodDays]);

	const totalDocs = useMemo(
		() => chartRows.reduce((sum, r) => sum + r.generated, 0),
		[chartRows],
	);

	let tickGap: number | undefined;
	if (periodDays <= 7) tickGap = undefined;
	else if (periodDays >= 60) tickGap = 20;
	else tickGap = 28;

	return (
		<Card
			className={`${C.border} ${C.card} shadow-none md:col-span-2 lg:col-span-3`}
		>
			<CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
				<div className="min-w-0 space-y-0.5">
					<CardTitle
						className={`text-base font-medium tracking-tight ${C.primary}`}
					>
						Documents Generated
					</CardTitle>
					<CardDescription className={`text-xs ${C.secondary}`}>
						{totalDocs} total in selected window
					</CardDescription>
				</div>
				<Select
					onValueChange={(v) => setPeriodDays(Number(v) as PeriodDays)}
					value={String(periodDays)}
				>
					<SelectTrigger aria-label="Time range" className="h-7 w-fit text-xs">
						<SelectValue placeholder="Range" />
					</SelectTrigger>
					<SelectContent align="end">
						<SelectItem value="7">7 days</SelectItem>
						<SelectItem value="30">30 days</SelectItem>
						<SelectItem value="60">60 days</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="pt-0">
				{chartRows.length === 0 ? (
					<div
						className={`flex h-40 items-center justify-center text-sm ${C.secondary}`}
					>
						No generation data in this window.
					</div>
				) : (
					<ChartContainer
						className="aspect-[22/8] w-full"
						config={volumeChartConfig}
					>
						<AreaChart
							accessibilityLayer
							data={chartRows}
							margin={{ left: 0, right: 8, top: 4, bottom: 0 }}
						>
							<defs>
								<linearGradient id={idGradient} x1="0" x2="0" y1="0" y2="1">
									<stop
										offset="0%"
										stopColor={PALETTE.sage}
										stopOpacity={0.2}
									/>
									<stop
										offset="100%"
										stopColor={PALETTE.sage}
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								className="stroke-[var(--border-light)] dark:stroke-[#3A423A]"
								vertical={false}
							/>
							<XAxis
								axisLine={false}
								dataKey="date"
								interval={periodDays <= 7 ? 0 : "preserveStartEnd"}
								minTickGap={tickGap}
								tickFormatter={(v) =>
									formatChartAxisTick(String(v), periodDays)
								}
								tickLine={false}
								tickMargin={6}
							/>
							<YAxis
								axisLine={false}
								tick={{ className: "tabular-nums text-[10px]" }}
								tickLine={false}
								tickMargin={4}
								width={28}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										className="min-w-32"
										indicator="line"
										labelFormatter={(_, payload) => {
											const row = payload?.[0]?.payload as
												| { date: string }
												| undefined;
											if (!row?.date) return "";
											return formatChartTooltipDate(row.date, "long");
										}}
									/>
								}
								cursor={false}
							/>
							<Area
								dataKey="generated"
								dot={false}
								fill={`url(#${idGradient})`}
								stroke={PALETTE.sage}
								strokeWidth={1.5}
								type="monotone"
							/>
						</AreaChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}

// ─── Document Type Pie Chart ────────────────────────────────────

function DocumentTypeChart({
	data,
}: {
	data: { type: string; count: number }[];
}) {
	const colorKeys = [
		PALETTE.sage,
		PALETTE.clay,
		PALETTE.amber,
		PALETTE.stone,
		PALETTE.brand,
	];

	const chartData = useMemo(
		() =>
			data.slice(0, 5).map((d, i) => ({
				type: d.type
					.split("-")
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
					.join(" "),
				rawType: d.type,
				count: d.count,
				fill: colorKeys[i % colorKeys.length],
			})),
		[data],
	);

	const chartConfig = useMemo(() => {
		const config: ChartConfig = { count: { label: "Documents" } };
		for (const d of chartData) {
			config[d.rawType] = { label: d.type, color: d.fill };
		}
		return config;
	}, [chartData]);

	return (
		<Card className={`${C.border} ${C.card} shadow-none`}>
			<CardHeader className="pb-0">
				<CardTitle
					className={`text-base font-medium tracking-tight ${C.primary}`}
				>
					By Type
				</CardTitle>
				<CardDescription className={`text-xs ${C.secondary}`}>
					Distribution of generated documents
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-2">
				{chartData.length === 0 ? (
					<div
						className={`flex h-40 items-center justify-center text-sm ${C.secondary}`}
					>
						No data yet.
					</div>
				) : (
					<ChartContainer
						className="mx-auto aspect-square max-h-56 w-full"
						config={chartConfig}
					>
						<PieChart accessibilityLayer>
							<Pie
								cornerRadius={4}
								data={chartData}
								dataKey="count"
								innerRadius={40}
								nameKey="rawType"
								outerRadius="80%"
								stroke="var(--parchment)"
								strokeWidth={2}
							>
								<LabelList
									className="fill-[#F0EBE3] dark:fill-[#2A3028] text-[10px] font-medium"
									dataKey="count"
									position="inside"
									stroke="none"
								/>
							</Pie>
							<ChartLegend
								content={
									<ChartLegendContent
										className="text-[11px]"
										nameKey="rawType"
									/>
								}
							/>
						</PieChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}

// ─── Recent Documents Table ─────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	if (diffMin < 1) return "Just now";
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	const diffDay = Math.floor(diffHr / 24);
	if (diffDay === 1) return "Yesterday";
	if (diffDay < 7) return `${diffDay}d ago`;
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function RecentDocuments({
	docs,
}: {
	docs: {
		company: string;
		type: string;
		fileName: string;
		createdAt: string;
	}[];
}) {
	return (
		<Card
			className={`gap-0 ${C.border} ${C.card} shadow-none md:col-span-2 lg:col-span-1`}
		>
			<CardHeader className={`${C.border} border-b pb-3`}>
				<CardTitle
					className={`text-base font-medium tracking-tight ${C.primary}`}
				>
					Recent Documents
				</CardTitle>
				<CardDescription className={`text-xs ${C.secondary}`}>
					Latest from the Ghost pipeline
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className={`hover:bg-transparent ${C.border}`}>
							<TableHead
								className={`pl-4 text-[11px] font-medium uppercase tracking-wider ${C.secondary}`}
							>
								Company
							</TableHead>
							<TableHead
								className={`hidden sm:table-cell text-[11px] font-medium uppercase tracking-wider ${C.secondary}`}
							>
								File
							</TableHead>
							<TableHead
								className={`text-[11px] font-medium uppercase tracking-wider ${C.secondary}`}
							>
								Type
							</TableHead>
							<TableHead
								className={`pr-4 text-right text-[11px] font-medium uppercase tracking-wider ${C.secondary}`}
							>
								When
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{docs.map((doc) => (
							<TableRow
								className={`h-12 ${C.border} ${C.hover}`}
								key={`${doc.fileName}-${doc.createdAt}`}
							>
								<TableCell
									className={`max-w-32 truncate pl-4 text-sm font-medium ${C.primary}`}
								>
									{doc.company}
								</TableCell>
								<TableCell className="hidden max-w-40 sm:table-cell">
									<span className={`line-clamp-1 text-xs ${C.secondary}`}>
										{doc.fileName}
									</span>
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className={`${C.border} text-[10px] font-normal capitalize ${C.primary}`}
									>
										{doc.type.replace(/-/g, " ")}
									</Badge>
								</TableCell>
								<TableCell
									className={`pr-4 text-right text-xs tabular-nums ${C.secondary}`}
								>
									{formatRelativeTime(doc.createdAt)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className={`flex justify-center border-t ${C.border} py-2.5`}>
					<Button
						asChild
						size="sm"
						variant="ghost"
						className={`text-xs ${C.secondary} hover:text-[#1A1A1A] dark:hover:text-[#E8E6E1]`}
					>
						<Link href="/admin/audit">
							View all
							<IconPlaceholder
								aria-hidden="true"
								lucide="ArrowRightIcon"
								className="size-3"
							/>
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

// ─── Document Type Bar Chart ────────────────────────────────────

const BAR_RADIUS = 3;

function ColumnHoverCursor(props: React.ComponentProps<typeof Rectangle>) {
	return (
		<Rectangle
			fill="var(--bg-hover)"
			radius={BAR_RADIUS}
			stroke="none"
			{...props}
		/>
	);
}

function DocumentsByTypeBarChart({
	typeData,
}: {
	typeData: { type: string; count: number }[];
}) {
	const colorKeys = [
		PALETTE.sage,
		PALETTE.clay,
		PALETTE.amber,
		PALETTE.stone,
		PALETTE.brand,
	];

	const chartData = useMemo(
		() =>
			typeData.slice(0, 5).map((d, i) => ({
				type: d.type
					.split("-")
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
					.join(" "),
				count: d.count,
				fill: colorKeys[i % colorKeys.length],
			})),
		[typeData],
	);

	const chartConfig = { count: { label: "Documents" } } satisfies ChartConfig;

	return (
		<Card className={`${C.border} ${C.card} shadow-none`}>
			<CardHeader className="pb-2">
				<CardTitle
					className={`text-base font-medium tracking-tight ${C.primary}`}
				>
					Generation Counts
				</CardTitle>
				<CardDescription className={`text-xs ${C.secondary}`}>
					Total documents per type
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<ChartContainer className="aspect-video w-full" config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={chartData}
						margin={{ left: -8, right: 4, top: 4, bottom: 40 }}
					>
						<BarXAxis
							axisLine={false}
							dataKey="type"
							interval={0}
							minTickGap={8}
							tickLine={false}
							tickMargin={8}
							angle={-35}
							textAnchor="end"
							tick={{ className: "text-[10px]" }}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ className: "tabular-nums text-[10px]" }}
							width={24}
						/>
						<ChartTooltip
							content={<ChartTooltipContent hideLabel />}
							cursor={<ColumnHoverCursor />}
						/>
						<Bar
							barSize={20}
							dataKey="count"
							radius={[BAR_RADIUS, BAR_RADIUS, 0, 0]}
						>
							{chartData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.fill} />
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

// ─── Main Dashboard Page ────────────────────────────────────────

export default function AdminDashboardPage() {
	const { user } = useUser();
	const userEmail = user?.emailAddresses[0]?.emailAddress;
	const isSuperAdminUser = isSuperAdmin(userEmail);

	// ── Chart mode state ───────────────────────────────────────
	const [selectedCompanyId, setSelectedCompanyId] =
		useState<Id<"crmCompanies"> | null>(null);

	// Aggregate data (default)
	const phaseData = useQuery(api.pipelinePhases.getPhaseStats);

	// Per-deal data (only when company selected)
	const perDealData = useQuery(
		api.dealTrackerChart.getPhaseChartStats,
		selectedCompanyId ? { companyId: selectedCompanyId } : "skip",
	);

	// Company list for dropdown (active deals only)
	const companies = useQuery(api.crmCompanies.list);
	const activeCompanies = useMemo(
		() =>
			companies?.filter((c) => c.stage !== "Dead" && c.stage !== "On hold") ??
			[],
		[companies],
	);

	const [ghostData, setGhostData] = useState<GhostDashboardData | null>(null);
	useEffect(() => {
		fetch("/api/ghost/dashboard")
			.then((r) => r.json())
			.then(setGhostData)
			.catch(() => setGhostData(null));
	}, []);

	const quickLinks = useMemo(
		() => [
			...(isSuperAdminUser
				? [
						{
							title: "Users",
							description: "Manage access",
							icon: <IconPlaceholder lucide="UsersIcon" className="size-4" />,
							href: "/admin/users",
						},
					]
				: []),
			{
				title: "CRM",
				description: "Companies & deals",
				icon: <IconPlaceholder lucide="Building2Icon" className="size-4" />,
				href: "/admin/crm",
			},
			{
				title: "Templates",
				description: "Document templates",
				icon: <IconPlaceholder lucide="FileTextIcon" className="size-4" />,
				href: "/admin/templates",
			},
			{
				title: "Journals",
				description: "Client progress",
				icon: <IconPlaceholder lucide="CalendarIcon" className="size-4" />,
				href: "/admin/journals",
			},
			{
				title: "Compliance",
				description: "SOC 2 audit log",
				icon: <IconPlaceholder lucide="CheckCircleIcon" className="size-4" />,
				href: "/admin/compliance",
			},
			{
				title: "Audit Log",
				description: "System changes",
				icon: <IconPlaceholder lucide="ActivityIcon" className="size-4" />,
				href: "/admin/audit",
			},
		],
		[isSuperAdminUser],
	);

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="page-header-stitch">
				<div className="header-top">
					<div>
						<h1 className="page-title">Dashboard</h1>
						<p className="page-subtitle">Forhemit admin overview</p>
					</div>
				</div>
			</div>

			{/* Pipeline Phase Card */}
			<section>
				{/* Company selector — always visible */}
				<div
					className={`mb-3 flex items-center gap-3 rounded-lg border ${C.border} ${C.card} px-4 py-3`}
				>
					<Building2
						className="w-4 h-4 shrink-0"
						style={{ color: "var(--stone)" }}
					/>
					<Select
						value={selectedCompanyId ?? "__all__"}
						onValueChange={(v) =>
							setSelectedCompanyId(
								v === "__all__" ? null : (v as Id<"crmCompanies">),
							)
						}
					>
						<SelectTrigger className={`w-full max-w-xs h-9 text-sm ${C.primary}`}>
							<SelectValue placeholder="All Deals" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="__all__">All Deals</SelectItem>
							{activeCompanies.map((company) => (
								<SelectItem key={company._id} value={company._id}>
									{company.name}
									{company.ref ? ` (${company.ref})` : ""}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Chart — switches between aggregate and per-deal */}
				{selectedCompanyId ? (
					<PhaseRadialChart
						rings={perDealData?.rings}
						gates={perDealData?.gates}
						summary={perDealData?.summary}
						hasData={perDealData?.hasData}
						isLoading={perDealData === undefined}
					/>
				) : (
					phaseData?.phases && (
						<PhaseRadialChart aggregatePhases={phaseData.phases} />
					)
				)}
			</section>

			{/* Charts */}
			<section>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
					<DocumentVolumeChart data={ghostData?.dailyVolume ?? []} />
					<DocumentTypeChart data={ghostData?.typeBreakdown ?? []} />
					<DocumentsByTypeBarChart typeData={ghostData?.typeBreakdown ?? []} />
					<RecentDocuments docs={ghostData?.recentDocs ?? []} />
				</div>
			</section>

			{/* Quick Links */}
			<section>
				<h2
					className={`mb-3 text-sm font-medium uppercase tracking-wider ${C.secondary}`}
				>
					Quick Links
				</h2>
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{quickLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`group flex items-center gap-3 rounded-lg border ${C.border} ${C.statCard} px-4 py-3 no-underline transition-colors hover:border-[var(--color-brand-border)]`}
						>
							<span
								className={`${C.secondary} transition-colors group-hover:text-[var(--color-brand)]`}
							>
								{link.icon}
							</span>
							<div className="min-w-0 flex-1">
								<span className={`block text-sm font-medium ${C.primary}`}>
									{link.title}
								</span>
								<span className={`block text-[11px] ${C.secondary}`}>
									{link.description}
								</span>
							</div>
							<IconPlaceholder
								lucide="ArrowRightIcon"
								className={`size-3 ${C.secondary} transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-brand)]`}
							/>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
