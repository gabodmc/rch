import type { FastifyInstance } from "fastify";
import * as service from "./noticias.service.js";

export default async function noticiasRoutes(app: FastifyInstance) {
	app.get("/api/noticias", async () => {
		return service.obtenerNoticias();
	});

	app.get("/api/noticias/destacada", async () => {
		const noticia = await service.obtenerDestacada();
		if (!noticia) return { data: null };
		return noticia;
	});

	app.get<{ Params: { id: string } }>(
		"/api/noticias/:id",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });

			const noticia = await service.obtener(id);
			if (!noticia) return reply.code(404).send({ error: "Not found" });
			return noticia;
		},
	);

	app.get<{ Params: { id: string } }>(
		"/api/noticias/:id/galeria",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			return service.obtenerGaleria(id);
		},
	);

	app.post<{ Params: { id: string } }>(
		"/api/noticias/:id/lectura",
		async (request, reply) => {
			const id = Number(request.params.id);
			if (isNaN(id)) return reply.code(400).send({ error: "Invalid id" });
			await service.nuevaLectura(id);
			return { ok: true };
		},
	);

	app.get<{ Params: { tag: string }; Querystring: { pag?: number; activo?: number } }>(
		"/api/noticias/tag/:tag",
		async (request) => {
			const { tag } = request.params;
			const pag = Number(request.query.pag) || 1;
			const activo = Number(request.query.activo) || 1;
			return service.obtenerPorTag(tag, pag, activo);
		},
	);
}
