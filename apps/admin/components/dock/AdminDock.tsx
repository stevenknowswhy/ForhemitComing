"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
	BarChart3,
	Bell,
	BookOpen,
	ClipboardCheck,
	FileCode,
	FileText,
	Handshake,
	History,
	House,
	Inbox,
	Mail,
	Network,
	PenTool,
	Phone,
	Settings,
	Shield,
	Users,
	UserCog,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { isSuperAdmin } from "@/lib/clerk";
import { Dock, type DockTabItem } from "./Dock";

export function AdminDock() {
	const { isLoaded, user } = useUser();
	const userEmail = user?.emailAddresses[0]?.emailAddress;
	const isSuperAdminUser = isSuperAdmin(userEmail);

	/* ---- Badge data from Convex ---- */
	const contacts = useQuery(
		api.contactSubmissions.list,
		isLoaded && user ? { limit: 100 } : "skip",
	);
	const earlyAccess = useQuery(
		api.earlyAccessSignups.list,
		isLoaded && user ? { limit: 100 } : "skip",
	);
	const applications = useQuery(
		api.jobApplications.list,
		isLoaded && user ? { limit: 100 } : "skip",
	);

	const contactCount = contacts?.length ?? 0;
	const earlyAccessCount = earlyAccess?.length ?? 0;
	const applicationCount = applications?.length ?? 0;
	const totalInbox = contactCount + earlyAccessCount + applicationCount;

	/* ---- Dock configuration ---- */
	const items: DockTabItem[] = [
		{
			id: "home",
			label: "Home",
			icon: House,
			href: "/admin",
		},
		{
			id: "deals",
			label: "Deals",
			icon: Handshake,
			subItems: [
				{
					label: "Deal Tracker",
					href: "/admin/deal-tracker",
					icon: ClipboardCheck,
				},
				{
					label: "Business Tracker",
					href: "/admin/crm",
					icon: Users,
				},
				{
					label: "ESOP Partners",
					href: "/admin/esop-partners",
					icon: Network,
				},
			],
		},
		{
			id: "docs",
			label: "Docs",
			icon: FileText,
			subItems: [
				{
					label: "Letters",
					href: "/admin/letters",
					icon: PenTool,
				},
				{
					label: "Templates",
					href: "/admin/templates",
					icon: FileCode,
				},
			],
		},
		{
			id: "inbox",
			label: "Inbox",
			icon: Inbox,
			badge: totalInbox > 0 ? totalInbox : undefined,
			subItems: [
				{
					label: "Contacts",
					href: "/admin/contacts",
					icon: Mail,
					badge: contactCount > 0 ? contactCount : undefined,
				},
				{
					label: "Early Access",
					href: "/admin/early-access",
					icon: Bell,
					badge: earlyAccessCount > 0 ? earlyAccessCount : undefined,
				},
				{
					label: "Phone Messages",
					href: "/admin/phone-messages",
					icon: Phone,
				},
				{
					label: "Applications",
					href: "/admin/applications",
					icon: FileText,
					badge: applicationCount > 0 ? applicationCount : undefined,
				},
			],
		},
		{
			id: "insights",
			label: "Insights",
			icon: BarChart3,
			subItems: [
				{
					label: "Statistics",
					href: "/admin/stats",
					icon: BarChart3,
				},
				{
					label: "Audit Log",
					href: "/admin/audit",
					icon: History,
				},
				{
					label: "Journals",
					href: "/admin/journals",
					icon: BookOpen,
				},
				{
					label: "Compliance",
					href: "/admin/compliance",
					icon: Shield,
				},
			],
		},
		{
			id: "settings",
			label: "Settings",
			icon: Settings,
			subItems: [
				...(isSuperAdminUser
					? [
							{
								label: "User Management",
								href: "/admin/users",
								icon: UserCog,
							},
						]
					: []),
			],
		},
	];

	// If Settings has no sub-items (non-admin user), don't render it
	const filteredItems = items.filter(
		(item) => !item.subItems || item.subItems.length > 0 || item.href,
	);

	return <Dock items={filteredItems} />;
}
