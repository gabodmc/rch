import type { FastifyInstance } from "fastify";
import * as service from "./revistas.service.js";

export default async function revistasController(app: FastifyInstance) {
	app.get("/api/revistas/ultima", async () => {
		const revista = await service.obtenerUltima();
		if (!revista) return { data: null };
		return revista;
	});
}
