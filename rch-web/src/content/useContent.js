const SOURCES = import.meta.glob("./sources/*.js");

const CACHE = new Map();
const IN_FLIGHT = new Map();

function stableStringify(value) {
	const seen = new WeakSet();

	const normalize = (v) => {
		if (v === null || typeof v !== "object") return v;
		if (seen.has(v)) return "[Circular]";
		seen.add(v);

		if (Array.isArray(v)) return v.map(normalize);

		const out = {};
		for (const k of Object.keys(v).sort()) out[k] = normalize(v[k]);
		return out;
	};

	return JSON.stringify(normalize(value));
}

function defaultCacheKey(source, query) {
	return `${source}::${stableStringify(query)}`;
}

export async function useContent({ source, query } = {}) {
	if (!source || typeof source !== "string") {
		throw new Error("useContent: 'source' is required and must be a string");
	}

	const modPath = `./sources/${source}.js`;
	const loader = SOURCES[modPath];

	if (!loader) {
		const available = Object.keys(SOURCES)
			.map((k) => k.replace("./sources/", "").replace(".js", ""))
			.sort();
		throw new Error(
			`useContent: source "${source}" not found. Available: ${available.join(", ")}`,
		);
	}

	const mod = await loader();
	const fn = mod?.default;

	if (typeof fn !== "function") {
		throw new Error(
			`useContent: source "${source}" must default-export a function`,
		);
	}

	const ttl = typeof mod.ttl === "number" ? mod.ttl : 60000;
	const key = defaultCacheKey(source, query);

	if (ttl > 0) {
		const entry = CACHE.get(key);
		if (entry && entry.expiresAt > Date.now()) return entry.value;
		if (IN_FLIGHT.has(key)) return IN_FLIGHT.get(key);
	}

	const p = Promise.resolve(fn(query)).then((result) => {
		if (ttl > 0)
			CACHE.set(key, { value: result, expiresAt: Date.now() + ttl });
		return result;
	});

	if (ttl > 0) {
		IN_FLIGHT.set(
			key,
			p.finally(() => {
				IN_FLIGHT.delete(key);
			}),
		);
		return IN_FLIGHT.get(key);
	}

	return p;
}
