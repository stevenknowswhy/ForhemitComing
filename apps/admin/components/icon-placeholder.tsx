"use client";

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

/**
 * Efferd icon resolver.
 * Maps icon library prop names to actual lucide-react icons.
 * The efferd blocks pass props like `lucide="ArrowRightIcon"` —
 * this component resolves them to the actual icon component.
 */
const ICON_MAP: Record<string, LucideIcon> = {
	// Arrows & navigation
	ArrowRightIcon,
	ArrowUpIcon: ChevronUpIcon,
	ArrowDownIcon: ChevronDownIcon,
	ChevronUpIcon,
	ChevronDownIcon,

	// Trending
	TrendingUpIcon,
	TrendingDownIcon,
	TrendUpIcon: TrendingUpIcon,
	TrendDownIcon: TrendingDownIcon,

	// UI
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

	// Communication
	MailIcon,
	EnvelopeIcon: MailIcon,
	SendIcon,
	PaperPlaneTiltIcon: SendIcon,
	MessageCircleIcon,
	ChatIcon: MessageCircleIcon,
	MessageSquareTextIcon,
	MessageIcon: MessageCircleIcon,

	// Entities
	UsersIcon,
	UsersThreeIcon: UsersIcon,
	UsersRoundIcon: UsersIcon,
	UsersGroupIcon: UsersIcon,
	GroupIcon: UsersIcon,
	Building2Icon,
	BuildingIcon: Building2Icon,

	// Status
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
};

type IconPlaceholderProps = {
	hugeicons?: string;
	lucide?: string;
	phosphor?: string;
	remixicon?: string;
	tabler?: string;
} & Omit<ComponentProps<"svg">, "ref">;

export function IconPlaceholder({
	hugeicons: _hi,
	lucide,
	phosphor: _ph,
	remixicon: _ri,
	tabler: _tb,
	...svgProps
}: IconPlaceholderProps): JSX.Element | null {
	const iconName = lucide;
	if (!iconName) return null;

	const Icon = ICON_MAP[iconName];
	if (!Icon) {
		// Fallback: try to find by partial match
		const fallback = Object.entries(ICON_MAP).find(([key]) =>
			key.toLowerCase().includes(iconName.toLowerCase().replace("icon", "")),
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
