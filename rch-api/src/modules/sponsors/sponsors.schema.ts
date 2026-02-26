export const sponsorSchema = {
	type: "object",
	properties: {
		id: { type: "integer" },
		nombre: { type: ["string", "null"] },
		link: { type: ["string", "null"] },
		imagen_url: { type: ["string", "null"] },
		fecha: { type: ["string", "null"] },
		orden: { type: "integer" },
	},
} as const;
