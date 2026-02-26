export interface Noticia {
	id: number;
	nro: number;
	categoria_id: number | null;
	categoria: string | null;
	fecha_str: string;
	titulo: string;
	copete: string;
	nombre_imagen: string | null;
	cantidad_lecturas: number | null;
	clubes: string | null;
	equipos: string | null;
	clubes2: string | null;
	equipos2: string | null;
	entidad_id: number | null;
	division_id: number | null;
	torneo_id: number | null;
	partido_id: number | null;
}

export interface NoticiaDetalle {
	id: number;
	categoria_id: number;
	categoria: string | null;
	subcategoria_id: number;
	subcategoria: string | null;
	tipo_noticia_id: number;
	torneo_id: number | null;
	torneo_desc: string | null;
	partido_id: number | null;
	partido_desc: string | null;
	fecha: string | null;
	fecha_str: string | null;
	usuario_id: number;
	titulo: string | null;
	copete: string | null;
	contenido: string | null;
	fotografo: string | null;
	fuente: string | null;
	activo: number;
	desc_activo: string | null;
	prioridad: number;
	nombre_imagen: string | null;
	cant_imagenes: number;
	cant_videos: number;
	usuario: string | null;
}

export interface NoticiaImagen {
	id: number;
	nombre_imagen: string | null;
}
