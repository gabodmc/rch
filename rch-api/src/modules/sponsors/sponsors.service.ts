import { execSp } from "../../shared/db.js";
import { sponsorImage } from "../../shared/image.js";

export interface Sponsor {
	id: number;
	nombre: string | null;
	link: string | null;
	fecha: string | null;
	orden: number;
}

export async function obtenerSponsors() {
	const rows = await execSp<Sponsor>("SponsorObtenerTodos");
	return rows.map((r) => ({
		...r,
		imagen_url: sponsorImage(r.id),
	}));
}
