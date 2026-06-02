"use client";

/**
 * Registers IconPlaceholder as a global so efferd block components
 * can use it without explicit imports.
 *
 * Import this file once in your root layout or dashboard page:
 *   import "@/lib/icon-placeholder-global";
 */
import type { ComponentProps, JSX } from "react";
import {
	ActivityIcon,
	ArrowRightIcon,
	BarChart3Icon,
	Building2Icon,
	CalendarIcon,
	CheckCircleIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	DollarSignIcon,
	EllipsisIcon,
	FileTextIcon,
	HelpCircleIcon,
	LayoutGridIcon,
	ListChecksIcon,
	LoaderIcon,
	MailIcon,
	MessageCircleIcon,
	MessageSquareTextIcon,
	MinusIcon,
	PlugIcon,
	SendIcon,
	SettingsIcon,
	TrendingDownIcon,
	TrendingUpIcon,
	UserPlusIcon,
	UsersIcon,
	type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
	ArrowRightIcon,
	ArrowUpIcon: ChevronUpIcon,
	ArrowDownIcon: ChevronDownIcon,
	ChevronUpIcon,
	ChevronDownIcon,
	TrendingUpIcon,
	TrendingDownIcon,
	TrendUpIcon: TrendingUpIcon,
	TrendDownIcon: TrendingDownIcon,
	LayoutGridIcon,
	ListChecksIcon,
	BarChart3Icon,
	ChartBarIcon: BarChart3Icon,
	SettingsIcon,
	GearIcon: SettingsIcon,
	HelpCircleIcon,
	QuestionIcon: HelpCircleIcon,
	ActivityIcon,
	PulseIcon: ActivityIcon,
	PlugIcon,
	EllipsisIcon,
	DotsIcon: EllipsisIcon,
	MinusIcon,
	SubtractIcon: MinusIcon,
	MailIcon,
	EnvelopeIcon: MailIcon,
	SendIcon,
	PaperPlaneTiltIcon: SendIcon,
	MessageCircleIcon,
	ChatIcon: MessageCircleIcon,
	MessageSquareTextIcon,
	MessageIcon: MessageCircleIcon,
	UsersIcon,
	UsersThreeIcon: UsersIcon,
	UsersRoundIcon: UsersIcon,
	UsersGroupIcon: UsersIcon,
	GroupIcon: UsersIcon,
	Building2Icon,
	BuildingIcon: Building2Icon,
	CheckCircleIcon,
	ShieldCheckIcon: CheckCircleIcon,
	LoaderIcon,
	CalendarIcon,
	FileTextIcon,
	DocumentIcon: FileTextIcon,
	DollarSignIcon,
	CurrencyDollarIcon: DollarSignIcon,
	UserPlusIcon,
	UserAddIcon: UserPlusIcon,
	BellIcon: ActivityIcon,
	MoreHorizontalCircle01Icon: EllipsisIcon,
	MagicWand01Icon: ActivityIcon,
	WandIcon: ActivityIcon,
	Layers01Icon: FileTextIcon,
	StackIcon: FileTextIcon,
	Analytics02Icon: BarChart3Icon,
	DashboardSquare01Icon: LayoutGridIcon,
	CheckListIcon: ListChecksIcon,
	MailSend01Icon: SendIcon,
	Plug01Icon: PlugIcon,
	Settings01Icon: SettingsIcon,
	ShieldCheck: CheckCircleIcon,
	MoreHorizontalCircle01: EllipsisIcon,
	TradeUpIcon: TrendingUpIcon,
	TradeDownIcon: TrendingDownIcon,
};

type IconPlaceholderProps = {
	hugeicons?: string;
	lucide?: string;
	phosphor?: string;
	remixicon?: string;
	tabler?: string;
} & Omit<ComponentProps<"svg">, "ref">;

function IconPlaceholder({
	lucide,
	...svgProps
}: IconPlaceholderProps): JSX.Element | null {
	const iconName = lucide;
	if (!iconName) return null;

	const Icon = ICON_MAP[iconName];
	if (!Icon) {
		// Fallback: partial match
		const cleanName = iconName.replace(/Icon$/, "").toLowerCase();
		const fallback = Object.entries(ICON_MAP).find(([key]) =>
			key.toLowerCase().replace(/icon$/, "").includes(cleanName),
		);
		if (fallback) {
			const FallbackIcon = fallback[1];
			return (
				<FallbackIcon {...(svgProps as ComponentProps<typeof FallbackIcon>)} />
			);
		}
		return null;
	}

	return <Icon {...(svgProps as ComponentProps<typeof Icon>)} />;
}

// Register globally so efferd components can use <IconPlaceholder> without import
(globalThis as unknown as Record<string, unknown>).IconPlaceholder =
	IconPlaceholder;

// Also register as a React global for JSX resolution
if (typeof window !== "undefined") {
	(window as unknown as Record<string, unknown>).IconPlaceholder =
		IconPlaceholder;
}
