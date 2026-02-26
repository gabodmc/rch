import type { FastifyInstance } from "fastify";
import * as service from "./torneos.service.js";

export default async function torneosController(app: FastifyInstance) {
	app.get("/api/torneos", async () => {
		return service.obtenerTorneos();
	});

	app.get("/api/torneos/destacado", async () => {
		const torneo = await service.obtenerDestacado();
		if (!torneo) return { data: null };
		return torneo;
	});

	app.get<{ Params: { id: string } }>(
		"/api/torneos/:id",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			const torneo = await service.obtenerTorneo(id);
			if (!torneo) return reply.code(404).send({ error: "Torneo not found" });
			return torneo;
		},
	);

	app.get<{ Params: { id: string } }>(
		"/api/torneos/:id/instancias",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			return service.obtenerInstancias(id);
		},
	);

	app.get<{ Params: { id: string } }>(
		"/api/torneos/:id/desempates",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			return service.obtenerDesempates(id);
		},
	);

	app.get<{ Params: { id: string } }>(
		"/api/torneos/:id/fixture",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			return service.obtenerFixture(id);
		},
	);

	app.get<{ Params: { id: string }; Querystring: { zona_id?: string } }>(
		"/api/instancias/:id/zonas",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			return service.obtenerZonas(id);
		},
	);

	app.get<{ Params: { id: string }; Querystring: { zona_id?: string } }>(
		"/api/instancias/:id/rondas",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			const zonaId = request.query.zona_id ? Number(request.query.zona_id) : undefined;
			return service.obtenerRondas(id, zonaId);
		},
	);

	app.get<{ Params: { id: string }; Querystring: { zona_id?: string; ronda?: string } }>(
		"/api/instancias/:id/partidos",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			const zonaId = request.query.zona_id ? Number(request.query.zona_id) : undefined;
			const ronda = request.query.ronda ? Number(request.query.ronda) : undefined;
			return service.obtenerPartidos(id, zonaId, ronda);
		},
	);

	app.get<{ Params: { id: string }; Querystring: { zona_id?: string; torneo_id?: string } }>(
		"/api/instancias/:id/posiciones",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			const zonaId = request.query.zona_id ? Number(request.query.zona_id) : null;
			const torneoId = request.query.torneo_id ? Number(request.query.torneo_id) : null;

			if (!torneoId) {
				return reply.code(400).send({ error: "torneo_id query param required" });
			}

			const desempates = await service.obtenerDesempates(torneoId);
			return service.obtenerPosiciones(id, zonaId, desempates);
		},
	);

	app.get("/api/fixture-integrado", async () => {
		return service.obtenerFixtureIntegrado();
	});
}
