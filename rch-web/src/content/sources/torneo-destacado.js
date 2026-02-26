import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // 1 min

export default async function torneoDestacado() {
	try {
		const response = await axios.get(`${API_URL}/api/torneos/destacado`);
		return response?.data ?? null;
	} catch (err) {
		console.error(`[torneo-destacado] fetch failed: ${err.message}`);
		return null;
	}
}
