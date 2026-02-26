import fp from "fastify-plugin";
import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

export default fp(async function corsPlugin(app: FastifyInstance) {
	await app.register(cors, {
		origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:4321"],
		methods: ["GET", "POST"],
	});
});
