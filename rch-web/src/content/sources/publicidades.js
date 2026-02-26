import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 300000; // 5 min

export default async function publicidades() {
	try {
		const response = await axios.get(`${API_URL}/api/publicidades`);
		return response?.data ?? [];
	} catch (err) {
		console.error(`[publicidades] fetch failed: ${err.message}`);
		return [];
	}
}
