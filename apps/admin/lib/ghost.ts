import { Pool } from "pg";

const GHOST_CONNECTION_STRING =
	process.env.GHOST_CONNECTION_STRING ||
	"postgresql://tsdbadmin:j3nvynekex3cvlo5@jxkcqq6yua.nhbh1fxcou.tsdb.cloud.timescale.com:5432/tsdb";

let pool: Pool | null = null;

export function getGhostPool(): Pool {
	if (!pool) {
		pool = new Pool({
			connectionString: GHOST_CONNECTION_STRING,
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
