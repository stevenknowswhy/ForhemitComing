/**
 * Template Renderer - Template Processing Utilities
 *
 * Handles template variable replacement and conditional logic rendering.
 * Extracted from templateGenerator.ts for better separation of concerns.
 */

interface TemplateData {
  [key: string]: string | undefined;
}

/**
 * Replace {{placeholder}} with actual values from data.
 * Handles:
 * - Simple: {{companyName}}
 * - Conditionals: {{#if var}}...{{/if}}
 * - Conditionals with else: {{#if var}}...{{else}}...{{/if}}
 */
export function renderTemplate(template: string, data: TemplateData): string {
  let result = template;

  // Step 1: Handle {{#if var}}...{{/if}} and {{#if var}}...{{else}}...{{/if}}
  // Process nested conditionals from innermost to outermost
  const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  let maxIterations = 50; // Prevent infinite loops
  let previousResult = "";

  while (result !== previousResult && maxIterations > 0) {
    previousResult = result;
    result = result.replace(ifRegex, (_match, varName: string, block: string) => {
      const value = data[varName];
      const isTruthy = value !== undefined && value !== "" && value !== "0" && value !== "false";

      // Check for {{else}} inside the block
      const elseIndex = block.indexOf("{{else}}");
      if (elseIndex !== -1) {
        const ifBlock = block.substring(0, elseIndex);
        const elseBlock = block.substring(elseIndex + 8); // 8 = "{{else}}".length
        return isTruthy ? ifBlock : elseBlock;
      }

      return isTruthy ? block : "";
    });
    maxIterations--;
  }

  // Step 2: Replace simple {{placeholder}} with values
  result = result.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = data[key];
    return value !== undefined ? value : `{{${key}}}`; // Keep unreplaced placeholders
  });

  return result;
}

/**
 * Simple template placeholder replacement - exported for external use
 */
export function fillTemplate(html: string, data: Record<string, string>): string {
  for (const [key, value] of Object.entries(data)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }
  return html;
}

/**
 * Escape HTML for use in email bodies
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generate a filename-safe string from a template name
 */
export function safeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 60);
}

/**
 * Build the complete data object with defaults for template rendering
 */
export function buildTemplateData(
  dealData: Record<string, string>,
  recipientName: string,
  recipientEmail: string,
  ref?: string
): TemplateData {
  return {
    ...dealData,
    recipientName,
    recipientEmail,
    generatedDate: dealData.generatedDate || new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    ref: ref || dealData.ref || "FHH-XXXX",
  };
}