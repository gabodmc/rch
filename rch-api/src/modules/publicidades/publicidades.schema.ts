export const publicidadSchema = {
	type: "object",
	properties: {
		id: { type: "integer" },
		nombre: { type: ["string", "null"] },
		nombre_archivo: { type: ["string", "null"] },
		imagen_url: { type: ["string", "null"] },
		link: { type: ["string", "null"] },
		ancho: { type: "integer" },
		alto: { type: "integer" },
		fecha: { type: ["string", "null"] },
		orden: { type: "integer" },
		ubicacion: { type: "integer" },
		activo: { type: "integer" },
	},
} as const;
