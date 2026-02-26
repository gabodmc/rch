import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // 1 min

export default async function torneoInstancias(query) {
	const { torneo_id } = query ?? {};
	if (!torneo_id) return [];

	try {
		const response = await axios.get(`${API_URL}/api/torneos/${torneo_id}/instancias`);
		return response?.data ?? [];
	} catch (err) {
		console.error(`[torneo-instancias] fetch failed: ${err.message}`);
		return [];
	}
}
