import type { FastifyInstance } from "fastify";
import * as service from "./sponsors.service.js";

export default async function sponsorsController(app: FastifyInstance) {
	app.get("/api/sponsors", async () => {
		return service.obtenerSponsors();
	});
}
