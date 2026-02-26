import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // 1 min

export default async function noticiasGaleria(query) {
	const { id } = query ?? {};
	if (!id) return [];

	try {
		const response = await axios.get(`${API_URL}/api/noticias/${id}/galeria`);
		return response?.data ?? [];
	} catch (err) {
		console.error(`[noticias-galeria] fetch failed: ${err.message}`);
		return [];
	}
}
