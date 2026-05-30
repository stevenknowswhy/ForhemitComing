"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Web Vitals metric shape (matches next/dist/compiled/web-vitals Metric type).
 * Defined locally because the compiled module ships without .d.ts.
 */
interface WebVitalMetric {
	name: string;
	value: number;
	rating: "good" | "needs-improvement" | "poor";
	delta: number;
	id: string;
	navigationType: string;
	entries: PerformanceEntry[];
}

/**
 * Maps web-vitals metric names to Sentry measurement units.
 */
const METRIC_UNITS: Record<string, string> = {
	CLS: "", // unitless
	FID: "millisecond",
	INP: "millisecond",
	LCP: "millisecond",
	TTFB: "millisecond",
	FCP: "millisecond",
};

/**
 * Client component that reports Core Web Vitals to Sentry (when configured)
 * and logs to console in development.
 *
 * Tracks: LCP, FID, CLS, TTFB, INP (plus FCP as bonus).
 */
export function WebVitalsReporter() {
	useReportWebVitals((metric: WebVitalMetric) => {
		const { name, value, rating } = metric;

		// Report to Sentry when DSN is configured
		if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
			reportToSentry(metric);
		}
	});

	return null;
}

/**
 * Sends a web vital metric to Sentry as a custom measurement.
 * Uses dynamic import to avoid bundling Sentry when DSN is absent.
 */
async function reportToSentry(metric: WebVitalMetric) {
	try {
		const Sentry = await import("@sentry/nextjs");
		const { name, value, rating } = metric;
		const unit = METRIC_UNITS[name] ?? "millisecond";

		// setMeasurement attaches to the current span or next event
		Sentry.setMeasurement(name, value, unit);

		// Tag the breadcrumb with the rating for search/filtering
		Sentry.addBreadcrumb({
			category: "web-vitals",
			message: `${name}: ${value.toFixed(2)} (${rating})`,
			level: rating === "poor" ? "warning" : "info",
			data: {
				metric: name,
				value,
				rating,
				delta: metric.delta,
				navigationType: metric.navigationType,
			},
		});
	} catch {
		// Silently swallow — Sentry should never break the page
	}
}
