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
export interface FixtureIntegradoRow {
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
