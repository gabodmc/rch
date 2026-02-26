import sql from "mssql";

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
	if (pool?.connected) return pool;

	pool = await new sql.ConnectionPool({
		server: process.env.DB_SERVER!,
		database: process.env.DB_DATABASE!,
		user: process.env.DB_USER!,
		password: process.env.DB_PASSWORD!,
		port: Number(process.env.DB_PORT) || 1433,
		options: {
			encrypt: false,
			trustServerCertificate: true,
		},
		pool: {
			max: 10,
			min: 0,
			idleTimeoutMillis: 30_000,
		},
	}).connect();

	return pool;
}

export async function execSp<T>(
	spName: string,
	params?: Record<string, unknown>,
): Promise<T[]> {
	const db = await getPool();
	const request = db.request();

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			request.input(key, value);
		}
	}

	const result = await request.execute(spName);
	return result.recordset as T[];
}

export async function execSpSingle<T>(
	spName: string,
	params?: Record<string, unknown>,
): Promise<T | null> {
	const rows = await execSp<T>(spName, params);
	return rows[0] ?? null;
}

export async function execSpVoid(
	spName: string,
	params?: Record<string, unknown>,
): Promise<void> {
	const db = await getPool();
	const request = db.request();

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			request.input(key, value);
		}
	}

	await request.execute(spName);
}

export async function execQuery<T>(
	query: string,
	params?: Record<string, unknown>,
): Promise<T[]> {
	const db = await getPool();
	const request = db.request();

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			request.input(key, value);
		}
	}

	const result = await request.query(query);
	return result.recordset as T[];
}

export async function closePool(): Promise<void> {
	if (pool) {
		await pool.close();
		pool = null;
	}
}
