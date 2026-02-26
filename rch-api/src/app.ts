import "dotenv/config";
import Fastify from "fastify";

import dbPlugin from "./plugins/db.js";
import corsPlugin from "./plugins/cors.js";

import noticiasRoutes from "./modules/noticias/noticias.routes.js";
import publicidadesRoutes from "./modules/publicidades/publicidades.routes.js";
import sponsorsRoutes from "./modules/sponsors/sponsors.routes.js";
import revistasRoutes from "./modules/revistas/revistas.routes.js";
import torneosRoutes from "./modules/torneos/torneos.routes.js";
import clubesRoutes from "./modules/clubes/clubes.routes.js";

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

// Routes
await app.register(noticiasRoutes);
await app.register(publicidadesRoutes);
await app.register(sponsorsRoutes);
await app.register(revistasRoutes);
await app.register(torneosRoutes);
await app.register(clubesRoutes);

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
