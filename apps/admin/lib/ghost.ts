import { Pool } from "pg";

let pool: Pool | null = null;

export function getGhostPool(): Pool {
	if (!pool) {
		// Fail fast on first use rather than at module init: Next evaluates route
		// module chunks while collecting page data during `next build`, so a
		// top-level throw would break builds wherever the env var is not set.
		const connectionString = process.env.GHOST_CONNECTION_STRING;
		if (!connectionString) {
			throw new Error("GHOST_CONNECTION_STRING is required");
		}
		pool = new Pool({
			connectionString,
			ssl: { rejectUnauthorized: false },
			max: 5,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 10000,
		});
	}
	return pool;
}

export async function queryGhost<T = Record<string, unknown>>(
	sql: string,
	params?: unknown[],
): Promise<T[]> {
	const client = await getGhostPool().connect();
	try {
		const result = await client.query(sql, params);
		return result.rows as T[];
	} finally {
		client.release();
	}
}
