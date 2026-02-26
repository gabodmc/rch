import { execSpSingle } from "../../shared/db.js";
import { revistaImage } from "../../shared/image.js";

export interface Revista {
	id: number;
	link: string | null;
	anio: number;
	mes: number;
}

export async function obtenerUltima() {
	const row = await execSpSingle<Revista>("RevistaObtenerUltima");
	if (!row) return null;
	return {
		...row,
		imagen_url: revistaImage(row.anio, row.mes),
	};
}
