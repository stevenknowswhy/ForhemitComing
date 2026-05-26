/**
 * PDF Generator - PDF Generation Utilities
 *
 * Handles PDF generation from HTML templates via external API.
 * Extracted from templateGenerator.ts for better separation of concerns.
 */

import { v } from "convex/values";
import { action } from "./_generated/server";

/**
 * Generate PDF from HTML content via external API
 */
export const generatePdf = action({
  args: {
    formData: v.record(v.string(), v.string()),
    templateId: v.id("templates"),
    templateName: v.string(),
    htmlContent: v.string(),
    mode: v.string(),
  },
  handler: async (ctx, args): Promise<{ pdfBase64: string; pdfSize: number }> => {
    const { htmlContent, templateName } = args;

    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const pdfEndpoint = `${siteUrl}/api/pdf-generate`;

    try {
      const pdfResponse = await fetch(pdfEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });

      if (!pdfResponse.ok) {
        const errorText = await pdfResponse.text();
        console.error(`PDF generation failed (${pdfResponse.status}):`, errorText);
        throw new Error(`PDF generation failed: ${pdfResponse.status} ${errorText.substring(0, 200)}`);
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");
      const pdfSize = pdfBuffer.byteLength;

      return { pdfBase64, pdfSize };
    } catch (fetchError: unknown) {
      console.error("PDF generation fetch error:", fetchError);
      throw new Error(`Could not reach PDF generation endpoint at ${pdfEndpoint}. Is the Next.js server running?`, { cause: fetchError });
    }
  },
});

/**
 * Generate PDF filename from template config and data
 */
export function generatePdfFilename(
  templateFilename: string,
  data: Record<string, string>
): string {
  // Simple filename generation - can be enhanced with templateRenderer if needed
  return templateFilename.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = data[key];
    return value ? value : "unknown";
  });
}