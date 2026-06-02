import type { Metadata, Viewport } from "next";
import { Outfit, Libre_Baskerville, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./components/providers/ConvexProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { WebVitalsReporter } from "./components/WebVitalsReporter";
import { env } from "@/lib/env";
import { THEME_SCRIPT } from "@/components/theme-provider";

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
	subsets: ["latin"],
	variable: "--font-libre-baskerville",
	display: "swap",
	weight: ["400", "700"],
	style: ["normal", "italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	variable: "--font-ibm-plex-mono",
	display: "swap",
	weight: ["400", "500", "600"],
});

const baseUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://www.forhemit.com";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "Forhemit Admin | CRM & Template Management",
		template: "%s | Forhemit Admin",
	},
	description:
		"Internal CRM and document template management system for Forhemit PBC.",
	robots: {
		index: false,
		follow: false,
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	themeColor: "#1a1a1a",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider
			afterSignOutUrl="/sign-in"
			appearance={{
				layout: {
					socialButtonsPlacement: "bottom",
					socialButtonsVariant: "iconButton",
					shimmer: false,
				},
				variables: {
					colorPrimary: "#0A0A0A",
					colorText: "#1a1a1a",
					colorBackground: "#ffffff",
					colorInputBackground: "#fafafa",
					colorInputBorder: "#e5e5e5",
					borderRadius: "0.5rem",
				},
			}}
		>
			<html
				lang="en"
				className={`${outfit.variable} ${libreBaskerville.variable} ${ibmPlexMono.variable}`}
				suppressHydrationWarning
			>
				<head>
					<script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
				</head>
				<body
					suppressHydrationWarning
					className="min-h-screen bg-[var(--canvas)] transition-colors duration-300"
				>
					<WebVitalsReporter />
					<ErrorBoundary>
						<ConvexClientProvider convexUrl={env.NEXT_PUBLIC_CONVEX_URL}>
							{children}
						</ConvexClientProvider>
					</ErrorBoundary>
				</body>
			</html>
		</ClerkProvider>
	);
}
