const env = () => process.env;

export function equipoImage(clubId: number | null, paisId: number | null): string {
	const base = env().IMAGE_PATH_EQUIPOS ?? "";
	if (clubId && clubId !== 0) return `${base}${clubId}.png`;
	if (paisId) return `${base}p_${paisId}.png`;
	return `${base}0.png`;
}

export function equipoErrorImage(): string {
	return `${env().IMAGE_PATH_EQUIPOS ?? ""}0.png`;
}

export function noticiaImage(nombreImagen: string | null): string {
	return `${env().IMAGE_PATH_NOTICIAS ?? ""}${nombreImagen ?? ""}`;
}

export function publicidadImage(nombreImagen: string | null): string {
	return `${env().IMAGE_PATH_PUBLICIDADES ?? ""}${nombreImagen ?? ""}`;
}

export function sponsorImage(id: number): string {
	return `${env().IMAGE_PATH_SPONSORS ?? ""}${id}.gif`;
}

export function revistaImage(anio: number, mes: number): string {
	return `${env().IMAGE_PATH_REVISTAS ?? ""}RevistaRCH-${anio}-${mes}.jpg`;
}
