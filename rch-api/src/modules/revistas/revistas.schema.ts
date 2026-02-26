export const revistaSchema = {
	type: "object",
	properties: {
		id: { type: "integer" },
		link: { type: ["string", "null"] },
		anio: { type: "integer" },
		mes: { type: "integer" },
		imagen_url: { type: ["string", "null"] },
	},
} as const;
