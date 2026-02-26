import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // 1 min

export default async function noticiasDetail(query) {
	const { id } = query ?? {};
	if (!id) return null;

	try {
		const response = await axios.get(`${API_URL}/api/noticias/${id}`);
		return response?.data ?? null;
	} catch (err) {
		console.error(`[noticias-detail] fetch failed: ${err.message}`);
		return null;
	}
}
