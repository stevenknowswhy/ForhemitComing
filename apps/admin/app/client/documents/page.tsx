"use client";

import { useState, useEffect, useCallback } from "react";

interface BoxItem {
	id: string;
	type: "file" | "folder" | "web_link";
	name: string;
	size?: number;
	modifiedAt?: string;
	extension?: string;
}

interface DocumentsResponse {
	success: boolean;
	company?: { name: string; ref: string };
	folderId?: string;
	items?: BoxItem[];
	error?: string;
}

function formatFileSize(bytes?: number): string {
	if (!bytes) return "—";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso?: string): string {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function fileIcon(type: string, extension?: string): string {
	if (type === "folder") return "📁";
	if (extension === "pdf") return "📄";
	if (extension === "docx" || extension === "doc") return "📝";
	if (extension === "xlsx" || extension === "xls") return "📊";
	if (extension === "png" || extension === "jpg" || extension === "jpeg")
		return "🖼️";
	return "📎";
}

export default function ClientDocumentsPage() {
	const [items, setItems] = useState<BoxItem[] | null>(null);
	const [company, setCompany] = useState<{ name: string; ref: string } | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
	const [folderStack, setFolderStack] = useState<
		Array<{ id: string; name: string }>
	>([]);
	const [downloading, setDownloading] = useState<string | null>(null);

	const fetchDocuments = useCallback(async (folderId?: string) => {
		try {
			const url = folderId
				? `/api/client/documents?folderId=${folderId}`
				: "/api/client/documents";

			const resp = await fetch(url);
			const data: DocumentsResponse = await resp.json();

			if (!data.success) {
				setError(data.error || "Failed to load documents");
				return;
			}

			setItems(data.items ?? []);
			setCompany(data.company ?? null);
			setCurrentFolderId(data.folderId ?? null);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load documents");
		}
	}, []);

	useEffect(() => {
		fetchDocuments();
	}, [fetchDocuments]);

	const handleFolderClick = (folder: BoxItem) => {
		setFolderStack((prev) => [
			...prev,
			{ id: currentFolderId!, name: company?.name || "Documents" },
		]);
		fetchDocuments(folder.id);
	};

	const handleBreadcrumbClick = (index: number) => {
		const target = folderStack[index];
		if (!target) return;
		setFolderStack((prev) => prev.slice(0, index));
		fetchDocuments(target.id);
	};

	const handleDownload = async (fileId: string, _fileName: string) => {
		setDownloading(fileId);
		try {
			const resp = await fetch(`/api/client/documents/${fileId}/download`);
			const data = await resp.json();

			if (data.success && data.downloadUrl) {
				window.open(data.downloadUrl, "_blank");
			} else {
				alert("Download failed: " + (data.error || "Unknown error"));
			}
		} catch (err) {
			alert("Download failed");
		} finally {
			setDownloading(null);
		}
	};

	if (error) {
		return (
			<div style={{ textAlign: "center", padding: "48px" }}>
				<div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
				<h2 style={{ fontSize: "18px", color: "#1B2A4A", marginBottom: "8px" }}>
					Unable to load documents
				</h2>
				<p style={{ color: "#6b7280", fontSize: "14px" }}>{error}</p>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div style={{ marginBottom: "24px" }}>
				<h1
					style={{
						fontSize: "24px",
						fontWeight: 600,
						color: "#1B2A4A",
						marginBottom: "4px",
					}}
				>
					{company ? `${company.name} Documents` : "Your Documents"}
				</h1>
				{company?.ref && (
					<p style={{ color: "#6b7280", fontSize: "13px" }}>
						Reference: {company.ref}
					</p>
				)}
			</div>

			{/* Breadcrumb */}
			{folderStack.length > 0 && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						marginBottom: "16px",
						fontSize: "13px",
					}}
				>
					<button
						type="button"
						onClick={() => {
							setFolderStack([]);
							fetchDocuments();
						}}
						style={{
							background: "none",
							border: "none",
							color: "#FF6B00",
							cursor: "pointer",
							fontSize: "13px",
							padding: 0,
						}}
					>
						Home
					</button>
					{folderStack.map((folder, i) => (
						<span
							key={folder.id}
							style={{ display: "flex", alignItems: "center", gap: "8px" }}
						>
							<span style={{ color: "#9ca3af" }}>/</span>
							<button
								type="button"
								onClick={() => handleBreadcrumbClick(i)}
								style={{
									background: "none",
									border: "none",
									color: "#FF6B00",
									cursor: "pointer",
									fontSize: "13px",
									padding: 0,
								}}
							>
								{folder.name}
							</button>
						</span>
					))}
					<span style={{ color: "#9ca3af" }}>/</span>
					<span style={{ color: "#6b7280" }}>…</span>
				</div>
			)}

			{/* Loading */}
			{items === null && (
				<div style={{ textAlign: "center", padding: "48px", color: "#6b7280" }}>
					Loading documents…
				</div>
			)}

			{/* Empty state */}
			{items && items.length === 0 && (
				<div style={{ textAlign: "center", padding: "48px" }}>
					<div style={{ fontSize: "48px", marginBottom: "16px" }}>📂</div>
					<h2
						style={{ fontSize: "18px", color: "#1B2A4A", marginBottom: "8px" }}
					>
						No documents yet
					</h2>
					<p style={{ color: "#6b7280", fontSize: "14px" }}>
						Documents will appear here as they are generated during your
						transaction.
					</p>
				</div>
			)}

			{/* File list */}
			{items && items.length > 0 && (
				<div
					style={{
						border: "1px solid #e5e7eb",
						borderRadius: "8px",
						overflow: "hidden",
					}}
				>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr
								style={{
									background: "#f9fafb",
									borderBottom: "1px solid #e5e7eb",
								}}
							>
								<th
									style={{
										padding: "12px 16px",
										textAlign: "left",
										fontSize: "12px",
										fontWeight: 600,
										color: "#6b7280",
										textTransform: "uppercase",
										letterSpacing: "0.05em",
									}}
								>
									Name
								</th>
								<th
									style={{
										padding: "12px 16px",
										textAlign: "right",
										fontSize: "12px",
										fontWeight: 600,
										color: "#6b7280",
										textTransform: "uppercase",
										letterSpacing: "0.05em",
									}}
								>
									Size
								</th>
								<th
									style={{
										padding: "12px 16px",
										textAlign: "right",
										fontSize: "12px",
										fontWeight: 600,
										color: "#6b7280",
										textTransform: "uppercase",
										letterSpacing: "0.05em",
									}}
								>
									Modified
								</th>
								<th
									style={{
										padding: "12px 16px",
										textAlign: "right",
										fontSize: "12px",
										fontWeight: 600,
										color: "#6b7280",
										textTransform: "uppercase",
										letterSpacing: "0.05em",
										width: "100px",
									}}
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<tr
									key={item.id}
									style={{
										borderBottom: "1px solid #f3f4f6",
										cursor: item.type === "folder" ? "pointer" : "default",
									}}
									onClick={
										item.type === "folder"
											? () => handleFolderClick(item)
											: undefined
									}
								>
									<td
										style={{
											padding: "12px 16px",
											display: "flex",
											alignItems: "center",
											gap: "10px",
										}}
									>
										<span style={{ fontSize: "18px" }}>
											{fileIcon(item.type, item.extension)}
										</span>
										<span style={{ fontSize: "14px", color: "#1f2937" }}>
											{item.name}
										</span>
									</td>
									<td
										style={{
											padding: "12px 16px",
											textAlign: "right",
											fontSize: "13px",
											color: "#6b7280",
											fontFamily: "DM Mono, monospace",
										}}
									>
										{item.type === "file" ? formatFileSize(item.size) : "—"}
									</td>
									<td
										style={{
											padding: "12px 16px",
											textAlign: "right",
											fontSize: "13px",
											color: "#6b7280",
										}}
									>
										{formatDate(item.modifiedAt)}
									</td>
									<td style={{ padding: "12px 16px", textAlign: "right" }}>
										{item.type === "file" && (
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													handleDownload(item.id, item.name);
												}}
												disabled={downloading === item.id}
												style={{
													padding: "6px 12px",
													background: "#FF6B00",
													color: "white",
													border: "none",
													borderRadius: "6px",
													fontSize: "12px",
													fontWeight: 500,
													cursor: downloading === item.id ? "wait" : "pointer",
													opacity: downloading === item.id ? 0.6 : 1,
												}}
											>
												{downloading === item.id ? "…" : "Download"}
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
