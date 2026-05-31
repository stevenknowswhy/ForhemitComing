"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { isAllowedEmail } from "@/lib/clerk";
import { AdminMobileShellProvider } from "./AdminMobileShell";
import { AdminDock } from "@/components/dock/AdminDock";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoIcon } from "@/components/logo";
import { AlertCircle } from "lucide-react";
import "@/app/admin/admin-stitch.css";
import { ThemeProvider } from "@/components/theme-provider";

function AdminLayoutBody({
	children,
	userButton,
}: {
	children: React.ReactNode;
	userButton: React.ReactNode;
}) {
	return (
		<div className="admin-layout-stitch">
			<main className="admin-main-stitch">
				{/* Header: F logo + Theme toggle + Clerk user button */}
				<header className="admin-dock-header">
					<a href="/admin" className="admin-dock-header-logo">
						<LogoIcon />
						<span className="admin-dock-header-title hidden sm:inline">
							Forhemit
						</span>
					</a>
					<div className="admin-dock-header-actions">
						<ThemeToggle />
						{userButton}
					</div>
				</header>

				{/* Main content — pb-24 clears the fixed dock */}
				<div className="admin-main-content-stitch pb-24">{children}</div>
			</main>

			{/* Fixed bottom navigation dock */}
			<AdminDock />
		</div>
	);
}

interface AdminClientLayoutProps {
	children: React.ReactNode;
}

export function AdminClientLayout({ children }: AdminClientLayoutProps) {
	const { isLoaded, user } = useUser();

	// Show loading state while Clerk loads
	if (!isLoaded) {
		return (
			<main className="min-h-screen bg-white dark:bg-[#2A3028] flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-8 h-8 border-2 border-gray-200 dark:border-[#3A423A] border-t-orange-500 rounded-full animate-spin" />
					<p className="text-gray-500 dark:text-[#A8A5A0] text-sm">
						Loading...
					</p>
				</div>
			</main>
		);
	}

	// If not authenticated, this should not render due to proxy
	if (!user) {
		return (
			<main className="min-h-screen bg-white dark:bg-[#2A3028] flex items-center justify-center">
				<p className="text-gray-500 dark:text-[#A8A5A0]">
					Please sign in to access the admin panel.
				</p>
			</main>
		);
	}

	const userEmail = user.emailAddresses[0]?.emailAddress;
	const isAllowed = userEmail ? isAllowedEmail(userEmail) : false;

	// If email is not from allowed domain, show error
	if (!isAllowed) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-[#1F2521] flex items-center justify-center px-4">
				<div className="max-w-md w-full bg-white dark:bg-[#2A3028] rounded-xl shadow-lg border border-gray-200 dark:border-[#3A423A] p-8">
					<div className="flex items-center gap-3 mb-4">
						<AlertCircle className="w-8 h-8 text-red-500" />
						<h1 className="text-2xl font-semibold text-gray-900 dark:text-[#E8E6E1]">
							Access Denied
						</h1>
					</div>

					<p className="text-gray-600 dark:text-[#A8A5A0] mb-4">
						Your email{" "}
						<strong className="text-gray-900 dark:text-[#E8E6E1]">
							{userEmail}
						</strong>{" "}
						is not authorized to access this application.
					</p>

					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
						<p className="text-sm text-red-700">
							Only <strong>@forhemit.com</strong> email addresses are allowed.
						</p>
					</div>

					<div className="space-y-3">
						<UserButton
							appearance={{
								elements: {
									userButtonTrigger:
										"w-full justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600",
								},
							}}
						/>
						<p className="text-xs text-gray-500 dark:text-[#A8A5A0] text-center">
							Click above to sign out and use a different account
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Show admin content with dock navigation
	return (
		<ThemeProvider>
			{/* AdminMobileShellProvider kept for useAdminMobileShell() compatibility */}
			<AdminMobileShellProvider>
				<AdminLayoutBody userButton={<UserButton />}>
					{children}
				</AdminLayoutBody>
			</AdminMobileShellProvider>
		</ThemeProvider>
	);
}
