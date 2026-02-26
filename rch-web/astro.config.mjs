import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	site: "https://www.rugbychampagneweb.com",
	output: "server",
	adapter: cloudflare({
		platformProxy: { enabled: true },
	}),
	ssr: {
		noExternal: true,
	},
	image: {
		service: passthroughImageService(),
	},
	integrations: [react(), sitemap()],
});
