"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface BoxLinkPanelProps {
	companyId: Id<"crmCompanies">;
	companyName: string;
}

export default function BoxLinkPanel({
	companyId,
	companyName,
}: BoxLinkPanelProps) {
	const [creating, setCreating] = useState(false);
	const [rawToken, setRawToken] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const sessions = useQuery(api.boxLogSessions.findByCompany, {
		companyId,
	});
	const createSession = useMutation(api.boxLogSessions.createSession);
	const revokeSession = useMutation(api.boxLogSessions.revokeSession);

	const handleGenerate = async () => {
		setCreating(true);
		try {
			const result = await createSession({
				companyId,
				capabilities: ["read", "acknowledge"],
				expiresInDays: 30,
				createdBy: "admin",
			});
			const url = `${window.location.origin}/embed/box/activity?token=${result.rawToken}`;
			setRawToken(url);
			setCopied(false);
		} catch (err) {
			console.error("Failed to create Box session", err);
		} finally {
			setCreating(false);
		}
	};

	const handleCopy = async () => {
		if (rawToken) {
			await navigator.clipboard.writeText(rawToken);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleRevoke = async (sessionId: Id<"boxLogSessions">) => {
		await revokeSession({ sessionId });
	};

	return (
		<div
			style={{
				background: "var(--bg-glass)",
				border: "1px solid var(--border-subtle)",
				borderRadius: "12px",
				padding: "1.5rem",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "1rem",
				}}
			>
				<h3
					style={{
						fontFamily: "var(--font-cormorant)",
						fontSize: "1.25rem",
						fontWeight: 400,
						color: "var(--text-primary)",
						margin: 0,
					}}
				>
					Box Embed — {companyName}
				</h3>
				<button
					className="btn-primary"
					disabled={creating}
					onClick={handleGenerate}
				>
					{creating ? "Generating..." : "Generate Link"}
				</button>
			</div>

			{/* Newly generated token */}
			{rawToken && (
				<div
					style={{
						padding: "1rem",
						background: "var(--color-success-bg)",
						border: "1px solid var(--color-success-border)",
						borderRadius: "8px",
						marginBottom: "1rem",
					}}
				>
					<div
						style={{
							fontFamily: "var(--font-dm-mono)",
							fontSize: "0.7rem",
							color: "var(--text-secondary)",
							marginBottom: "0.5rem",
						}}
					>
						New Box embed URL (copy now — shown only once):
					</div>
					<div
						style={{
							display: "flex",
							gap: "0.5rem",
							alignItems: "center",
						}}
					>
						<input
							readOnly
							value={rawToken}
							style={{
								flex: 1,
								fontFamily: "var(--font-dm-mono)",
								fontSize: "0.75rem",
								padding: "0.5rem",
								background: "var(--bg-primary)",
								border: "1px solid var(--border-subtle)",
								borderRadius: "4px",
								color: "var(--text-primary)",
							}}
						/>
						<button className="btn-secondary" onClick={handleCopy}>
							{copied ? "Copied!" : "Copy"}
						</button>
					</div>
				</div>
			)}

			{/* Existing sessions */}
			{!sessions ? (
				<div className="admin-loading" style={{ minHeight: "100px" }}>
					Loading sessions...
				</div>
			) : sessions.length === 0 ? (
				<div
					style={{
						fontFamily: "var(--font-dm-mono)",
						fontSize: "0.8rem",
						color: "var(--text-secondary)",
						textAlign: "center",
						padding: "1.5rem",
					}}
				>
					No Box embed links yet. Generate one above.
				</div>
			) : (
				<div
					style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
				>
					{sessions.map(
						(session: {
							_id: string;
							_creationTime: number;
							expiresAt: number;
							revokedAt?: number;
							exchangedAt?: number;
							viewerEmail?: string;
							exchangeCount: number;
						}) => (
							<div
								key={session._id}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "0.75rem",
									background: "var(--shadow-color)",
									borderRadius: "6px",
									border: "1px solid var(--border-subtle)",
									opacity: session.revokedAt ? 0.5 : 1,
								}}
							>
								<div>
									<div
										style={{
											fontFamily: "var(--font-dm-mono)",
											fontSize: "0.75rem",
											color: "var(--text-primary)",
										}}
									>
										{session.viewerEmail || "Anonymous"}
									</div>
									<div
										style={{
											fontFamily: "var(--font-dm-mono)",
											fontSize: "0.65rem",
											color: "var(--text-secondary)",
										}}
									>
										{session.revokedAt
											? "Revoked"
											: session.exchangedAt
												? `Exchanged · Session active`
												: `Created · Pending exchange`}
										{" · "}
										Expires {new Date(session.expiresAt).toLocaleDateString()}
									</div>
								</div>
								{!session.revokedAt && (
									<button
										className="btn-secondary"
										style={{
											color: "var(--color-error)",
											borderColor: "var(--color-error-border)",
											fontSize: "0.7rem",
										}}
										onClick={() =>
											handleRevoke(session._id as Id<"boxLogSessions">)
										}
									>
										Revoke
									</button>
								)}
							</div>
						),
					)}
				</div>
			)}
		</div>
	);
}
