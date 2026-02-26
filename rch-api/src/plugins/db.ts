import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { getPool, closePool } from "../shared/db.js";

export default fp(async function dbPlugin(app: FastifyInstance) {
	// Verify connection on startup
	await getPool();
	app.log.info("SQL Server connected");

	app.addHook("onClose", async () => {
		await closePool();
		app.log.info("SQL Server disconnected");
	});
});
