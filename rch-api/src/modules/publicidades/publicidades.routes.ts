import type { FastifyInstance } from "fastify";
import * as service from "./publicidades.service.js";

export default async function publicidadesRoutes(app: FastifyInstance) {
	app.get("/api/publicidades", async () => {
		return service.obtenerPublicidades();
	});
}
