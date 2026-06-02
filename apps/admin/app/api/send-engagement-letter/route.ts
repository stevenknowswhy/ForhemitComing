import { type NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { strictLimiter, getClientIp, checkRateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const isProduction =
	process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

/**
 * POST /api/send-engagement-letter
 *
 * Generates a PDF from the Engagement Letter v3 HTML template.
 * Injects CRM/form data into the interactive template's config fields,
 * calls the template's own sync() to bind data-dv attributes,
 * then prints to PDF (print CSS hides the config panel).
 */
export async function POST(request: NextRequest) {
	const rateLimitResponse = await checkRateLimit(
		strictLimiter,
		getClientIp(request),
	);
	if (rateLimitResponse) return rateLimitResponse;

	try {
		const body = await request.json();
		const { fields, companyId, boxFolderId } = body as {
			fields: Record<string, string>;
			companyId?: string;
			boxFolderId?: string;
		};

		if (!fields?.co) {
			return NextResponse.json(
				{ success: false, error: "Missing required field: company name (co)" },
				{ status: 400 },
			);
		}

		// ── 1. Load the v3 HTML template ───────────────────────────
		const { readFile } = await import("node:fs/promises");
		const { resolve } = await import("node:path");

		let templateHtml: string;
		const templatePaths = [
			resolve(process.cwd(), "public/templates/engagement-letter-v3.html"),
			resolve(
				process.cwd(),
				"apps/admin/public/templates/engagement-letter-v3.html",
			),
			resolve(
				process.cwd(),
				"app/admin/public/templates/engagement-letter-v3.html",
			),
		];
		for (const p of templatePaths) {
			try {
				templateHtml = await readFile(p, "utf-8");
				break;
			} catch {
				/* try next */
			}
		}
		if (!templateHtml!) {
			return NextResponse.json(
				{ success: false, error: "Engagement letter template not found" },
				{ status: 500 },
			);
		}

		// ── 2. Launch Puppeteer ────────────────────────────────────
		let browser;
		try {
			if (isProduction) {
				browser = await puppeteer.launch({
					args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
					executablePath: await chromium.executablePath(),
					headless: true,
				});
			} else {
				const possiblePaths = [
					"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
					"/usr/bin/google-chrome",
					"/usr/bin/chromium-browser",
					"/usr/bin/chromium",
				];
				const { existsSync } = await import("node:fs");
				let executablePath = "";
				for (const p of possiblePaths) {
					if (existsSync(p)) {
						executablePath = p;
						break;
					}
				}
				if (!executablePath) {
					return NextResponse.json(
						{
							success: false,
							error:
								"Chrome not found. Install Chrome for local PDF generation.",
						},
						{ status: 500 },
					);
				}
				browser = await puppeteer.launch({
					args: ["--no-sandbox", "--disable-setuid-sandbox"],
					executablePath,
					headless: true,
				});
			}
		} catch (err) {
			return NextResponse.json(
				{
					success: false,
					error: `Browser launch failed: ${err instanceof Error ? err.message : String(err)}`,
				},
				{ status: 500 },
			);
		}

		try {
			const page = await browser.newPage();
			await page.setViewport({
				width: 900,
				height: 1200,
				deviceScaleFactor: 2,
			});

			// ── 3. Load HTML and wait for scripts ───────────────────
			await page.setContent(templateHtml, {
				waitUntil: ["networkidle0", "domcontentloaded"],
			});
			await page.evaluate(() => document.fonts.ready);
			await new Promise((r) => setTimeout(r, 600));

			// ── 4. Inject field values via the template's own config fields ──
			await page.evaluate((f: Record<string, string>) => {
				function $(id: string) {
					return document.getElementById(id);
				}

				function setVal(id: string, val: string) {
					const el = $(id);
					if (!el) return;
					if (el instanceof HTMLSelectElement) {
						// Check if the option exists
						const opt = Array.from(el.options).find((o) => o.value === val);
						if (opt) {
							el.value = val;
						}
					} else if (el instanceof HTMLInputElement) {
						el.value = val;
					} else if (el instanceof HTMLTextAreaElement) {
						el.value = val;
					}
				}

				// Parties & Engagement
				setVal("f-co", f.co || "");
				setVal("f-of-name", f.ofName || "");
				setVal("f-ref", f.ref || "");
				setVal("f-dt", f.dt || "");
				setVal("f-gs", f.gs || "CA");
				setVal("f-ac", f.ac || "");
				setVal("f-tl", f.tl || "180");

				// Officer title (handle custom)
				const titleSel = $("f-of-title-sel") as HTMLSelectElement | null;
				const titleCustom = $("f-of-title-custom") as HTMLInputElement | null;
				if (titleSel && f.ofTitle) {
					const match = Array.from(titleSel.options).find(
						(o) => o.value === f.ofTitle,
					);
					if (match) {
						titleSel.value = f.ofTitle;
						if (titleCustom) titleCustom.classList.add("hidden-field");
					} else {
						titleSel.value = "_other";
						if (titleCustom) {
							titleCustom.classList.remove("hidden-field");
							titleCustom.value = f.ofTitle;
						}
					}
				}

				// Fees & Retainer
				setVal("f-eb", f.eb || "");
				setVal("f-ti", f.ti || "");
				setVal("f-ra", f.ra || "");
				setVal("f-pm", f.pm || "wire");
				setVal("f-pd", f.pd || "");

				// Banking
				setVal("f-bank", f.bank || "novo");
				if (f.bank === "_other") {
					const sec = $("wire-custom");
					if (sec) {
						sec.classList.remove("hidden");
						sec.classList.add("visible");
					}
					setVal("f-bank-name", f.bankName || "");
					setVal("f-acct-name", f.acctName || "");
					setVal("f-routing", f.routing || "");
					setVal("f-acct-num", f.acctNum || "");
					setVal("f-swift", f.swift || "");
					setVal("f-bank-addr", f.bankAddr || "");
				}

				// Broker
				const brokerTog = $("f-broker-tog") as HTMLInputElement | null;
				if (brokerTog && f.brokerTog === "true") {
					brokerTog.checked = true;
					brokerTog.dispatchEvent(new Event("change"));
					setVal("f-bn", f.bn || "");
					setVal("f-bf", f.bf || "");
				}

				// Retainer mode
				const retTog = $("tog-ret") as HTMLInputElement | null;
				if (retTog && f.retMode === "refundable") {
					retTog.checked = true;
					retTog.dispatchEvent(new Event("change"));
				}

				// Additional terms
				setVal("f-ad", f.ad || "");

				// Fire all change events to ensure reactive binding
				const inputs = document.querySelectorAll(
					".cp-body input, .cp-body select, .cp-body textarea",
				);
				inputs.forEach((el) => {
					el.dispatchEvent(new Event("input", { bubbles: true }));
					el.dispatchEvent(new Event("change", { bubbles: true }));
				});

				// Call the template's sync() to update all data-dv elements
				if (typeof (window as any).sync === "function") {
					(window as any).sync();
				}
			}, fields);

			// Small delay for DOM updates
			await new Promise((r) => setTimeout(r, 300));

			// ── 5. Generate PDF ─────────────────────────────────────
			// Print CSS already hides config panel, control bar, toast, progress
			const pdf = await page.pdf({
				format: "Letter",
				printBackground: true,
				margin: {
					top: "0.75in",
					right: "0.75in",
					bottom: "0.75in",
					left: "0.75in",
				},
				preferCSSPageSize: false,
			});

			const pdfBase64 = Buffer.from(pdf).toString("base64");
			const pdfSize = pdf.byteLength;

			// ── 6. Optional Box upload ──────────────────────────────
			let boxFileId: string | null = null;
			if (companyId && boxFolderId) {
				try {
					const { getBoxAccessToken } = await import("@/lib/box");
					const accessToken = await getBoxAccessToken();

					const binaryString = atob(pdfBase64);
					const bytes = new Uint8Array(binaryString.length);
					for (let i = 0; i < binaryString.length; i++) {
						bytes[i] = binaryString.charCodeAt(i);
					}

					const ref = fields.ref || "document";
					const fileName = `Forhemit-Engagement-Letter-${ref}.pdf`;

					const formData = new FormData();
					formData.append(
						"attributes",
						JSON.stringify({
							name: fileName,
							parent: { id: boxFolderId },
						}),
					);
					formData.append(
						"file",
						new Blob([bytes], { type: "application/pdf" }),
						fileName,
					);

					const uploadRes = await fetch(
						"https://upload.box.com/api/2.0/files/content",
						{
							method: "POST",
							headers: { Authorization: `Bearer ${accessToken}` },
							body: formData,
						},
					);

					if (uploadRes.ok) {
						const uploadData = await uploadRes.json();
						boxFileId = uploadData.entries?.[0]?.id ?? null;
					}
				} catch (err) {
					console.error("Box upload failed:", err);
					// Don't fail the request — PDF was generated successfully
				}
			}

			await browser.close();

			return NextResponse.json({
				success: true,
				pdfBase64,
				pdfSize,
				boxFileId,
			});
		} catch (pageError) {
			await browser.close();
			return NextResponse.json(
				{
					success: false,
					error: `PDF generation failed: ${pageError instanceof Error ? pageError.message : String(pageError)}`,
				},
				{ status: 500 },
			);
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}
