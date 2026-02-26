import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // 1 min

export default async function instanciaPosiciones(query) {
	const { instancia_id, zona_id, torneo_id } = query ?? {};
	if (!instancia_id || !torneo_id) return [];

	try {
		const params = new URLSearchParams();
		params.set("torneo_id", String(torneo_id));
		if (zona_id) params.set("zona_id", String(zona_id));
		const url = `${API_URL}/api/instancias/${instancia_id}/posiciones?${params}`;
		const response = await axios.get(url);
		return response?.data ?? [];
	} catch (err) {
		console.error(`[instancia-posiciones] fetch failed: ${err.message}`);
		return [];
	}
}
