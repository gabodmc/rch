import "dotenv/config";
import Fastify from "fastify";

import dbPlugin from "./plugins/db.js";
import corsPlugin from "./plugins/cors.js";

import noticiasController from "./modules/noticias/noticias.controller.js";
import publicidadesController from "./modules/publicidades/publicidades.controller.js";
import sponsorsController from "./modules/sponsors/sponsors.controller.js";
import revistasController from "./modules/revistas/revistas.controller.js";
import torneosController from "./modules/torneos/torneos.controller.js";
import clubesController from "./modules/clubes/clubes.controller.js";

const app = Fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: { translateTime: "HH:MM:ss Z", ignore: "pid,hostname" },
		},
	},
});

// Plugins
await app.register(corsPlugin);
await app.register(dbPlugin);

// Controllers
await app.register(noticiasController);
await app.register(publicidadesController);
await app.register(sponsorsController);
await app.register(revistasController);
await app.register(torneosController);
await app.register(clubesController);

// Health check
app.get("/api/health", async () => ({ status: "ok" }));

// Start
const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || "0.0.0.0";

try {
	await app.listen({ port, host });
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
