import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 300000; // 5 min

export default async function revistaUltima() {
	try {
		const response = await axios.get(`${API_URL}/api/revistas/ultima`);
		return response?.data ?? null;
	} catch (err) {
		console.error(`[revista-ultima] fetch failed: ${err.message}`);
		return null;
	}
}
