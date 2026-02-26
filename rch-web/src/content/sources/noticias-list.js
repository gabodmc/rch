import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // 1 min

export default async function noticiasList() {
	try {
		const response = await axios.get(`${API_URL}/api/noticias`);
		return response?.data ?? [];
	} catch (err) {
		console.error(`[noticias-list] fetch failed: ${err.message}`);
		return [];
	}
}
