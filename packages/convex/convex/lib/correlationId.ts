/**
 * Collision-resistant correlation ID for linking businessLog ↔ auditLogs.
 *
 * Format: {prefix}_{base36_timestamp}_{6_char_random}
 * Example: "deal_stage_lk3m2n_x4r9f2"
 *
 * Unique under concurrent writes because of the random suffix.
 */
export function makeCorrelationId(prefix: string): string {
	const timestamp = Date.now().toString(36);
	const random = Math.random().toString(36).slice(2, 8);
	return `${prefix}_${timestamp}_${random}`;
}
