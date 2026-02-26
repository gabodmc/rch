import type { FastifyInstance } from "fastify";
import * as service from "./torneos.service.js";

export default async function torneosRoutes(app: FastifyInstance) {
	app.get("/api/torneos/destacado", async () => {
		const torneo = await service.obtenerDestacado();
		if (!torneo) return { data: null };
		return torneo;
	});

	app.get<{ Params: { id: string } }>(
		"/api/torneos/:id/fixture",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			return service.obtenerFixture(id);
		},
	);

	app.get("/api/fixture-integrado", async () => {
		return service.obtenerFixtureIntegrado();
	});
}
