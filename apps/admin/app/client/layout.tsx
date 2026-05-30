"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isLoaded, isSignedIn, user } = useUser();
	const pathname = usePathname();

	if (!isLoaded) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					fontFamily: "Jost, sans-serif",
					color: "#6b7280",
				}}
			>
				Loading…
			</div>
		);
	}

	if (!isSignedIn) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					fontFamily: "Jost, sans-serif",
					gap: "24px",
				}}
			>
				<div style={{ textAlign: "center" }}>
					<h1
						style={{
							fontSize: "24px",
							fontWeight: 600,
							color: "#1B2A4A",
							marginBottom: "8px",
						}}
					>
						Forhemit Client Portal
					</h1>
					<p style={{ color: "#6b7280", fontSize: "14px" }}>
						Sign in to access your documents
					</p>
				</div>
				<a
					href="/sign-in"
					style={{
						padding: "12px 32px",
						background: "#FF6B00",
						color: "white",
						borderRadius: "8px",
						textDecoration: "none",
						fontWeight: 500,
						fontSize: "14px",
					}}
				>
					Sign In
				</a>
			</div>
		);
	}

	return (
		<div style={{ minHeight: "100vh", fontFamily: "Jost, sans-serif" }}>
			{/* Header */}
			<header
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "16px 32px",
					borderBottom: "1px solid #e5e7eb",
					background: "white",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
					<Link
						href="/client"
						style={{
							fontSize: "18px",
							fontWeight: 600,
							color: "#1B2A4A",
							textDecoration: "none",
						}}
					>
						Forhemit
					</Link>
					<nav style={{ display: "flex", gap: "16px" }}>
						<Link
							href="/client/documents"
							style={{
								fontSize: "14px",
								color: pathname.startsWith("/client/documents")
									? "#FF6B00"
									: "#6b7280",
								textDecoration: "none",
								fontWeight: pathname.startsWith("/client/documents")
									? 600
									: 400,
							}}
						>
							Documents
						</Link>
					</nav>
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
					<span style={{ fontSize: "13px", color: "#6b7280" }}>
						{user.primaryEmailAddress?.emailAddress}
					</span>
					<UserButton />
				</div>
			</header>

			{/* Content */}
			<main style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
				{children}
			</main>
		</div>
	);
}
