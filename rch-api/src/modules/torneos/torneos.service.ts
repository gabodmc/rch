import { execSp, execSpSingle, execQuery } from "../../shared/db.js";
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

export interface InstanciaDTO {
	id: number;
	nombre: string | null;
	cantidad_zonas: number;
	calcular_posiciones: boolean;
}

export interface ZonaDTO {
	id: number;
	nombre: string | null;
}

export interface PosicionDTO {
	Nro: number;
	Equipo: string | null;
	equipo_id: number;
	club_id: number;
	pais_id: number;
	Puntos: number;
	Jugados: number;
	Ganados: number;
	Empatados: number;
	Perdidos: number;
	GF: number;
	GC: number;
	zona_desc: string | null;
}

export interface TorneoDesempate {
	id: number;
	torneo_id: number;
	desempate_id: number;
	formula: string | null;
	orden: number;
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

export async function obtenerTorneos() {
	return execSp<Torneo>("TorneosObtener", { mostrar_web: 1 });
}

export async function obtenerTorneo(id: number) {
	return execSpSingle<Torneo>("TorneoObtener", { id });
}

export async function obtenerInstancias(torneoId: number) {
	return execSp<InstanciaDTO>("InstanciasObtener", { torneo_id: torneoId });
}

export async function obtenerZonas(instanciaId: number) {
	return execSp<ZonaDTO>("InstanciaObtenerZonas", { instancia_id: instanciaId });
}

export async function obtenerRondas(instanciaId: number, zonaId?: number) {
	return execSp<{ nro_fecha: number }>("InstanciaObtenerRondas", {
		instancia_id: instanciaId,
		zona_id: zonaId ?? null,
	});
}

export async function obtenerPartidos(instanciaId: number, zonaId?: number, ronda?: number) {
	const rows = await execSp<PartidoDTO>("InstanciaObtenerPartidos", {
		instancia_id: instanciaId,
		zona_id: zonaId ?? null,
		ronda: ronda ?? null,
	});
	return rows.map(enrichPartido);
}

export async function obtenerDesempates(torneoId: number) {
	return execSp<TorneoDesempate>("TorneoDesempatesObtener", { torneo_id: torneoId });
}

/** Allowed column references for desempate formulas (whitelist) */
const ALLOWED_FORMULA_TOKENS = new Set([
	"puntos", "puntos_dif_res", "puntos_dif_tries", "puntos_cant_tries",
	"jugados", "ganados", "empatados", "perdidos",
	"goles_favor", "goles_contra", "grupo_puntos", "grupo_goles",
	"grupo_difgoles", "grupo_ganados", "tries_favor", "tries_contra",
	"isnull", "ir.", "desc", "asc", ",", "(", ")", "+", "-", "*", "/",
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " ",
]);

function sanitizeFormula(formula: string): string {
	// Only allow known SQL tokens — reject anything else
	const cleaned = formula.replace(
		/[a-z_]+\.?[a-z_]*/gi,
		(match) => {
			const lower = match.toLowerCase();
			if (
				lower.startsWith("ir.") ||
				ALLOWED_FORMULA_TOKENS.has(lower) ||
				lower === "isnull"
			) {
				return match;
			}
			return "";
		},
	);
	// Strip any remaining suspicious chars (semicolons, quotes, dashes)
	return cleaned.replace(/[;'"\\-]{2,}/g, "");
}

export async function obtenerPosiciones(
	instanciaId: number,
	zonaId: number | null,
	desempates: TorneoDesempate[],
) {
	const ordenParts: string[] = [];

	if (zonaId == null) ordenParts.push("isnull(ir.zona_id,0)");

	if (desempates.length === 0) {
		ordenParts.push("puntos+isnull(puntos_dif_res,0)+isnull(puntos_dif_tries,0) desc");
		ordenParts.push("isnull(ir.goles_favor,0)-isnull(ir.goles_contra,0) desc");
		ordenParts.push("isnull(grupo_puntos,0) desc");
		ordenParts.push("isnull(grupo_goles,0) desc");
	} else {
		ordenParts.push("puntos+isnull(puntos_dif_res,0)+isnull(puntos_dif_tries,0) desc");
		for (const d of desempates) {
			if (d.formula) {
				ordenParts.push(sanitizeFormula(d.formula) + " desc");
			}
		}
	}

	const strOrden = ordenParts.join(",");
	const whereZona = zonaId != null ? " and isnull(ir.zona_id,0)=@zona_id" : "";

	const sql = `
		select
			ROW_NUMBER() OVER(ORDER BY ${strOrden}) AS Nro,
			isnull(ir.zona_id,0) as zona_id,
			z.nombre as zona_desc,
			e.nombre as Equipo,
			e.id as equipo_id,
			isnull(cl.id,0) as club_id,
			isnull(pa.id,0) as pais_id,
			puntos+isnull(puntos_dif_res,0)+isnull(puntos_dif_tries,0)+isnull(puntos_cant_tries,0) as Puntos,
			ir.jugados as Jugados,
			ir.ganados as Ganados,
			ir.empatados as Empatados,
			ir.perdidos as Perdidos,
			ir.goles_favor as GF,
			ir.goles_contra as GC
		from instancia_resumen ir
		inner join equipo e on ir.equipo_id = e.id
		left join club cl on e.club_id = cl.id
		left join pais pa on e.pais_id = pa.id
		left join zona z on isnull(ir.zona_id,0)=z.id
		where ir.instancia_id = @instancia_id
		and ir.jugados > 0
		${whereZona}
		order by ${strOrden}
	`;

	const rows = await execQuery<PosicionDTO>(sql, {
		instancia_id: instanciaId,
		...(zonaId != null ? { zona_id: zonaId } : {}),
	});

	return rows.map((r) => ({
		...r,
		imagen_equipo: equipoImage(r.club_id, r.pais_id),
	}));
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
