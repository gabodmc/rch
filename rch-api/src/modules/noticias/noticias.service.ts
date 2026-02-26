import { execSp, execSpSingle, execSpVoid } from "../../shared/db.js";
import { noticiaImage } from "../../shared/image.js";
import { getUrlFriendly } from "../../shared/utils.js";

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

function enrichNoticia<T extends { nombre_imagen: string | null; titulo?: string | null }>(
	item: T,
): T & { imagen_url: string; slug: string } {
	return {
		...item,
		imagen_url: noticiaImage(item.nombre_imagen),
		slug: getUrlFriendly(item.titulo ?? ""),
	};
}

export async function obtenerNoticias() {
	const rows = await execSp<Noticia>("NoticiaObtenerListado");
	return rows.map(enrichNoticia);
}

export async function obtenerDestacada() {
	const row = await execSpSingle<Noticia>("NoticiaObtenerDestacada");
	return row ? enrichNoticia(row) : null;
}

export async function obtener(id: number) {
	const row = await execSpSingle<NoticiaDetalle>("NoticiaObtener", { id });
	return row ? enrichNoticia(row) : null;
}

export async function obtenerGaleria(noticiaId: number) {
	const rows = await execSp<NoticiaImagen>("NoticiaGaleriaObtenerTodos", {
		noticia_id: noticiaId,
		grupo: 1,
	});
	return rows.map((r) => ({
		...r,
		imagen_url: noticiaImage(r.nombre_imagen),
	}));
}

export async function nuevaLectura(id: number) {
	await execSpVoid("NoticiaNuevaLectura", { id });
}

export async function obtenerPorTag(tag: string, pag = 1, activo = 1) {
	const rows = await execSp<Noticia>("NoticiaObtenerPorFiltroYPagina", {
		pag,
		activo,
		tag,
	});
	return rows.map(enrichNoticia);
}
