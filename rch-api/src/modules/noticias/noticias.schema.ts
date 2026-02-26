export const noticiaSchema = {
	type: "object",
	properties: {
		id: { type: "integer" },
		nro: { type: "integer" },
		categoria_id: { type: ["integer", "null"] },
		categoria: { type: ["string", "null"] },
		fecha_str: { type: "string" },
		titulo: { type: "string" },
		copete: { type: "string" },
		nombre_imagen: { type: ["string", "null"] },
		imagen_url: { type: ["string", "null"] },
		cantidad_lecturas: { type: ["integer", "null"] },
		clubes: { type: ["string", "null"] },
		equipos: { type: ["string", "null"] },
		slug: { type: "string" },
	},
} as const;

export const noticiaDetalleSchema = {
	type: "object",
	properties: {
		id: { type: "integer" },
		categoria_id: { type: "integer" },
		categoria: { type: ["string", "null"] },
		subcategoria_id: { type: "integer" },
		subcategoria: { type: ["string", "null"] },
		tipo_noticia_id: { type: "integer" },
		torneo_id: { type: ["integer", "null"] },
		torneo_desc: { type: ["string", "null"] },
		partido_id: { type: ["integer", "null"] },
		partido_desc: { type: ["string", "null"] },
		fecha: { type: ["string", "null"] },
		fecha_str: { type: ["string", "null"] },
		usuario_id: { type: "integer" },
		titulo: { type: ["string", "null"] },
		copete: { type: ["string", "null"] },
		contenido: { type: ["string", "null"] },
		fotografo: { type: ["string", "null"] },
		fuente: { type: ["string", "null"] },
		activo: { type: "integer" },
		prioridad: { type: "integer" },
		nombre_imagen: { type: ["string", "null"] },
		imagen_url: { type: ["string", "null"] },
		cant_imagenes: { type: "integer" },
		cant_videos: { type: "integer" },
		slug: { type: "string" },
	},
} as const;

export const noticiaImagenSchema = {
	type: "object",
	properties: {
		id: { type: "integer" },
		nombre_imagen: { type: ["string", "null"] },
		imagen_url: { type: ["string", "null"] },
	},
} as const;

export const noticiasListQuerySchema = {
	type: "object",
	properties: {
		pag: { type: "integer", default: 1 },
		categoria_id: { type: "integer" },
		filtro: { type: "string" },
		club_id: { type: "integer" },
		limit: { type: "integer", default: 12 },
	},
} as const;

export const noticiasByTagQuerySchema = {
	type: "object",
	properties: {
		pag: { type: "integer", default: 1 },
		activo: { type: "integer", default: 1 },
	},
} as const;
