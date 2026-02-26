import type { FastifyInstance } from "fastify";
import * as service from "./clubes.service.js";

export default async function clubesController(app: FastifyInstance) {
	app.get("/api/clubes", async () => {
		return service.obtenerClubes();
	});
}
