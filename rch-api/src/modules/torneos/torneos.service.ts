import { execSp, execSpSingle } from "../../shared/db.js";
import { equipoImage } from "../../shared/image.js";

export interface Torneo {
	id: number;
	nombre: string | null;
	fecha_desde: string | null;
	fecha_hasta: string | null;
	entidad_desc: string | null;
	division_desc: string | null;
	categoria_desc: string | null;
	modalidad_desc: string | null;
	genero_desc: string | null;
	tipo_equipo_desc: string | null;
	ciudad: string | null;
	mostrar_web: boolean;
	periodo: number;
	noticia_subcategoria_id: number | null;
}

export interface PartidoDTO {
	id: number;
	local_id: number;
	local: string | null;
	goles_local: number | null;
	visitante_id: number;
	visitante: string | null;
	goles_visitante: number | null;
	fecha: string;
	nro_fecha: number;
	nro_partido: number;
	club_local_id: number | null;
	pais_local_id: number | null;
	club_visitante_id: number | null;
	pais_visitante_id: number | null;
	zona_desc: string | null;
	instancia: string | null;
	torneo: string | null;
	torneo_id: number;
	cantidad_rondas: number;
	estado: number;
	desc_estado: string | null;
	periodo: string | null;
}

/** Raw shape from TorneosObtenerFixtureIntegrado (PascalCase columns) */
interface FixtureIntegradoRow {
	partido_id: number;
	local_id: number;
	Local: string | null;
	goles_local: number | null;
	visitante_id: number;
	Visitante: string | null;
	goles_visitante: number | null;
	fecha: string;
	nro_fecha: number;
	NroPartido: number;
	club_local_id: number | null;
	pais_local_id: number | null;
	club_visitante_id: number | null;
	pais_visitante_id: number | null;
	zona_desc: string | null;
	torneo: string | null;
	torneo_id: number;
	noticia_subcategoria_id: number | null;
	hora: string | null;
	tiene_hitos: number;
	goles_local_hitos: number;
	goles_visitante_hitos: number;
	estado_hitos: number;
}

function enrichPartido(p: PartidoDTO) {
	return {
		...p,
		imagen_local: equipoImage(p.club_local_id, p.pais_local_id),
		imagen_visitante: equipoImage(p.club_visitante_id, p.pais_visitante_id),
	};
}

export async function obtenerDestacado() {
	return execSpSingle<Torneo>("TorneoObtenerDestacado");
}

export async function obtenerFixture(torneoId: number) {
	const rows = await execSp<PartidoDTO>("TorneoObtenerFixture", { id: torneoId });
	return rows.map(enrichPartido);
}

export async function obtenerFixtureIntegrado() {
	const rows = await execSp<FixtureIntegradoRow>("TorneosObtenerFixtureIntegrado");
	return rows.map((r) => {
		const normalized: PartidoDTO = {
			id: r.partido_id,
			local_id: r.local_id,
			local: r.Local?.trim() ?? null,
			goles_local: r.goles_local,
			visitante_id: r.visitante_id,
			visitante: r.Visitante?.trim() ?? null,
			goles_visitante: r.goles_visitante,
			fecha: r.fecha,
			nro_fecha: r.nro_fecha,
			nro_partido: r.NroPartido,
			club_local_id: r.club_local_id,
			pais_local_id: r.pais_local_id,
			club_visitante_id: r.club_visitante_id,
			pais_visitante_id: r.pais_visitante_id,
			zona_desc: r.zona_desc,
			torneo: r.torneo,
			torneo_id: r.torneo_id,
			instancia: null,
			cantidad_rondas: 0,
			estado: 0,
			desc_estado: null,
			periodo: null,
		};
		return {
			...enrichPartido(normalized),
			hora: r.hora,
			tiene_hitos: r.tiene_hitos,
			goles_local_hitos: r.goles_local_hitos,
			goles_visitante_hitos: r.goles_visitante_hitos,
			estado_hitos: r.estado_hitos,
		};
	});
}
