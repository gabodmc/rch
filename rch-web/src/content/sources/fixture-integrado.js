import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // 1 min

export default async function fixtureIntegrado() {
	try {
		const response = await axios.get(`${API_URL}/api/fixture-integrado`);
		return response?.data ?? [];
	} catch (err) {
		console.error(`[fixture-integrado] fetch failed: ${err.message}`);
		return [];
	}
}
