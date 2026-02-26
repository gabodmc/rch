import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // 1 min

export default async function instanciaZonas(query) {
	const { instancia_id } = query ?? {};
	if (!instancia_id) return [];

	try {
		const response = await axios.get(`${API_URL}/api/instancias/${instancia_id}/zonas`);
		return response?.data ?? [];
	} catch (err) {
		console.error(`[instancia-zonas] fetch failed: ${err.message}`);
		return [];
	}
}
