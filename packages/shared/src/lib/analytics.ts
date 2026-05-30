/**
 * Lightweight analytics tracking stub.
 * Replace with real analytics provider (PostHog, Mixpanel, etc.) when ready.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function trackEvent(
	_event: string,
	_properties?: Record<string, unknown>,
): void {
	// No-op in production. Wire up your analytics provider here.
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function trackCRM(
	_action: string,
	_data?: Record<string, unknown>,
): void {
	// No-op in production. Wire up your CRM event tracking here.
}
