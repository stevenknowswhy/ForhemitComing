/**
 * Export Utilities
 * CSV and JSON export functions for form data
 */

/**
 * Flattens a nested object into a single-level object with dot notation keys
 */
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value === null || value === undefined) {
        result[newKey] = '';
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
      } else if (Array.isArray(value)) {
        result[newKey] = JSON.stringify(value);
      } else {
        result[newKey] = value as string | number | boolean;
      }
    }
  }
  
  return result;
}

/**
 * Escapes a value for CSV format
 */
function escapeCSV(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (/[\",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Converts form data to CSV format
 */
export function exportToCSV(formData: Record<string, unknown>, templateId: string): void {
  const flattened = flattenObject(formData);
  
  const headers = Object.keys(flattened);
  const values = headers.map(key => escapeCSV(String(flattened[key])));
  
  const csv = [
    headers.join(','),
    values.join(',')
  ].join('\n');
  
  downloadFile(csv, `${templateId}-${Date.now()}.csv`, 'text/csv');
}

/**
 * Converts form data to JSON format
 */
export function exportToJSON(formData: Record<string, unknown>, templateId: string): void {
  const json = JSON.stringify(formData, null, 2);
  downloadFile(json, `${templateId}-${Date.now()}.json`, 'application/json');
}

/**
 * Triggers a file download
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Exports form data as a formatted text report
 */
export function exportToText(formData: Record<string, unknown>, templateName: string): void {
  const timestamp = new Date().toLocaleString();
  let text = `${templateName}\n`;
  text += `Generated: ${timestamp}\n`;
  text += `${'='.repeat(50)}\n\n`;
  
  function formatValue(value: unknown, indent = 0): string {
    const spacing = '  '.repeat(indent);
    
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>;
      return Object.entries(obj)
        .map(([k, v]) => `${spacing}${k}: ${formatValue(v, indent + 1)}`)
        .join('\n');
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None';
      return '\n' + value.map((item, i) => `${spacing}[${i + 1}] ${formatValue(item, indent + 1)}`).join('\n');
    }
    
    return String(value);
  }
  
  for (const [key, value] of Object.entries(formData)) {
    text += `${key}:\n${formatValue(value, 1)}\n\n`;
  }
  
  downloadFile(text, `${templateName.replace(/\s+/g, '-')}-${Date.now()}.txt`, 'text/plain');
}

/**
 * Exports form data to Excel-compatible format (TSV with .xls extension)
 * Note: This creates a simple tab-separated file that Excel can open
 */
export function exportToExcel(formData: Record<string, unknown>, templateId: string): void {
  const flattened = flattenObject(formData);
  
  const headers = Object.keys(flattened);
  const values = headers.map(key => {
    const val = String(flattened[key]);
    // Escape tabs and newlines for TSV
    return val.replace(/\t/g, ' ').replace(/\n/g, ' ');
  });
  
  const tsv = [
    headers.join('\t'),
    values.join('\t')
  ].join('\n');
  
  // Use .xls extension for Excel compatibility
  downloadFile(tsv, `${templateId}-${Date.now()}.xls`, 'application/vnd.ms-excel');
}
