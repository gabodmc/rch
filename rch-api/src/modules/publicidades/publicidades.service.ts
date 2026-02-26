import { execSp } from "../../shared/db.js";
import { publicidadImage } from "../../shared/image.js";

export interface Publicidad {
	id: number;
	nombre: string | null;
	nombre_archivo: string | null;
	link: string | null;
	ancho: number;
	alto: number;
	fecha: string | null;
	orden: number;
	ubicacion: number;
	activo: number;
}

export async function obtenerPublicidades() {
	const rows = await execSp<Publicidad>("PublicidadObtenerTodos");
	return rows.map((r) => ({
		...r,
		imagen_url: publicidadImage(r.nombre_archivo),
	}));
}
