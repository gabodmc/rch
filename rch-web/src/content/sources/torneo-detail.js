import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // 1 min

export default async function torneoDetail(query) {
	const { id } = query ?? {};
	if (!id) return null;

	try {
		const response = await axios.get(`${API_URL}/api/torneos/${id}`);
		return response?.data ?? null;
	} catch (err) {
		console.error(`[torneo-detail] fetch failed: ${err.message}`);
		return null;
	}
}
