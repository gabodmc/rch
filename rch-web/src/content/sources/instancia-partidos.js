import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // 1 min

export default async function instanciaPartidos(query) {
	const { instancia_id, zona_id, ronda } = query ?? {};
	if (!instancia_id) return [];

	try {
		const params = new URLSearchParams();
		if (zona_id) params.set("zona_id", String(zona_id));
		if (ronda) params.set("ronda", String(ronda));
		const qs = params.toString();
		const url = `${API_URL}/api/instancias/${instancia_id}/partidos${qs ? `?${qs}` : ""}`;
		const response = await axios.get(url);
		return response?.data ?? [];
	} catch (err) {
		console.error(`[instancia-partidos] fetch failed: ${err.message}`);
		return [];
	}
}
