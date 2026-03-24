/**
 * High-intent marketing events (PDF downloads, schedule clicks).
 * Extend with GTM/GA4 by pushing consistent `event` names to dataLayer.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackHighIntentEvent(
  event: string,
  params?: Record<string, string | undefined>
): void {
  if (typeof window === "undefined") return;
  const payload = { event, ...params };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("forhemit:analytics", { detail: payload }));
}

export function trackRoadmapPdfDownload(surface: string): void {
  trackHighIntentEvent("roadmap_pdf_download", { surface });
}

export function trackFeeTransparencyPdfDownload(surface: string): void {
  trackHighIntentEvent("fee_transparency_pdf_download", { surface });
}

export function trackBrokerFirstCallChecklistPdfDownload(surface: string): void {
  trackHighIntentEvent("broker_first_call_checklist_pdf_download", { surface });
}

export function trackScheduleCallClick(surface: string): void {
  trackHighIntentEvent("schedule_call_click", { surface });
}
