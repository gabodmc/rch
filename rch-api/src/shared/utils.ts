export function getUrlFriendly(url: string): string {
	return url
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^A-Za-z0-9_.~]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function intNull(value: number | null | undefined): number | null {
	if (value == null || value <= 0) return null;
	return value;
}

const MESES = [
	"", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
	"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const MESES_3 = [
	"", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
	"JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

export function mes(n: number): string {
	return MESES[n] ?? "";
}

export function mes3(n: number): string {
	return MESES_3[n] ?? "";
}
