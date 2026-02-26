import { execSp } from "../../shared/db.js";

export interface Club {
	id: number;
	nombre: string | null;
	entidad_id: number | null;
	pais_id: number | null;
}

export async function obtenerClubes() {
	return execSp<Club>("ClubObtenerTodos", {
		entidad_id: 0,
		pais_id: 0,
		perfil_id: 0,
		usuario_id: 0,
	});
}
