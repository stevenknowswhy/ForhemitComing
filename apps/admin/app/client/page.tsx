"use client";

import Link from "next/link";

export default function ClientPortalPage() {
	return (
		<div>
			<h1 style={{ fontSize: "24px", fontWeight: 600, color: "#1B2A4A", marginBottom: "8px" }}>
				Welcome to your Client Portal
			</h1>
			<p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "32px" }}>
				Access your transaction documents, track progress, and manage your engagement.
			</p>

			<div style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
				gap: "16px",
			}}>
				<Link
					href="/client/documents"
					style={{
						display: "block",
						padding: "24px",
						border: "1px solid #e5e7eb",
						borderRadius: "12px",
						textDecoration: "none",
						transition: "border-color 0.2s",
					}}
				>
					<div style={{ fontSize: "32px", marginBottom: "12px" }}>📁</div>
					<h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1B2A4A", marginBottom: "4px" }}>
						Documents
					</h2>
					<p style={{ fontSize: "13px", color: "#6b7280" }}>
						View and download your transaction documents, agreements, and reports.
					</p>
				</Link>
			</div>
		</div>
	);
}
