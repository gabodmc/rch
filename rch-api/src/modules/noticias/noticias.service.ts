import { execSp, execSpSingle, execSpVoid } from "../../shared/db.js";
import { noticiaImage } from "../../shared/image.js";
import { getUrlFriendly } from "../../shared/utils.js";
import type { Noticia, NoticiaDetalle, NoticiaImagen } from "./noticias.model.js";

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
