# RCH Web

Frontend del portal Rugby Champagne. Construido con **Astro 5 SSR**, desplegado en **Cloudflare Workers**. Consume datos de la API Fastify (`rch-api`).

## Requisitos

- Node.js >= 18
- npm
- API corriendo en `localhost:3001` (ver `rch-api/`)

## Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# PUBLIC_API_URL=http://localhost:3001

# 3. Iniciar en desarrollo
npm run dev    # → http://localhost:4321
```

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Desarrollo con hot-reload |
| `npm run build` | Build para produccion |
| `npm run preview` | Build + preview con Wrangler (Cloudflare local) |
| `npm run deploy` | Build + deploy a Cloudflare Workers |

## Arquitectura

```
src/
├── content/
│   ├── useContent.js           ← Hook central: cache + dedup de requests
│   └── sources/                ← Un archivo por tipo de dato
│       ├── noticias-list.js
│       ├── noticias-destacada.js
│       ├── noticias-detail.js
│       ├── noticias-galeria.js
│       ├── publicidades.js
│       ├── sponsors.js
│       ├── revista-ultima.js
│       ├── torneo-destacado.js
│       └── fixture-integrado.js
├── components/
│   ├── Header/                 ← Nav + theme toggle + menu mobile
│   ├── Footer/                 ← Footer + sponsors + social
│   ├── NoticiaCard/            ← Card de noticia reutilizable
│   ├── NoticiaDetalle/         ← Articulo completo con slots
│   ├── GaleriaFotos/           ← Grid de imagenes
│   ├── TopFixtures/            ← Barra horizontal de partidos
│   ├── Publicidad/             ← Banner publicitario (filtra por tamaño)
│   ├── Sponsors/               ← Marquee infinito de logos
│   ├── Revista/                ← Box de ultima revista
│   ├── Posiciones/             ← Tabla de posiciones (preparado para Fase 2)
│   └── Pagination/             ← Paginador numerico
├── layouts/
│   └── MainLayout.astro        ← SEO: meta tags, OG, JSON-LD, fonts, theme
├── pages/
│   ├── index.astro             ← Home
│   ├── noticias/
│   │   ├── index.astro         ← Listado con filtros
│   │   └── [slug].astro        ← Detalle (URL amigable)
│   └── 404.astro
├── styles/
│   ├── _variables.scss         ← Tipografia, breakpoints, spacing
│   ├── _palette.scss           ← Colores de marca, dark/light mode
│   └── global.scss             ← Reset, layout, utilities
└── public/
    ├── fonts/                  ← Inter, Helvetica (.woff2)
    ├── images/                 ← Logos, iconos
    └── robots.txt
```

## Data Fetching: `useContent()`

Hook central para obtener datos. Importado de `src/content/useContent.js`.

```astro
---
import { useContent } from "../content/useContent.js";

const noticias = await useContent({ source: "noticias-list" });
const detalle = await useContent({ source: "noticias-detail", query: { id: 123 } });
---
```

### Como funciona

1. Recibe `{ source, query }` donde `source` es el nombre del archivo en `sources/`
2. Carga dinamicamente el modulo via `import.meta.glob`
3. Genera una cache key estable basada en `source + JSON.stringify(query)`
4. Si hay cache valido (TTL no expirado), lo retorna
5. Si hay un request identico en vuelo, reutiliza la promise (dedup)
6. Si no, ejecuta la funcion del source y cachea el resultado

### Crear un nuevo content source

```javascript
// src/content/sources/mi-nuevo-source.js
import axios from "axios";

const API_URL = import.meta.env.PUBLIC_API_URL;

export const ttl = 60000; // Cache TTL en ms (1 minuto)

export default async function miNuevoSource(query) {
    const response = await axios.get(`${API_URL}/api/mi-endpoint`, {
        params: query,
    });
    return response?.data ?? [];
}
```

- `default export`: funcion async que recibe `query` y retorna datos
- `export const ttl`: TTL del cache en milisegundos (default: 60000)

## Componentes

### Patron general

Cada componente vive en su propia carpeta con su SCSS companion:

```
ComponentName/
├── ComponentName.astro
└── component-name.scss
```

El SCSS se importa en el frontmatter del componente:

```astro
---
// ComponentName.astro
import "./component-name.scss";
---
```

### Componentes principales

| Componente | Descripcion | Props principales |
|------------|-------------|-------------------|
| `Header` | Navegacion, theme toggle, menu mobile | — |
| `Footer` | Footer con sponsors | — |
| `NoticiaCard` | Card de noticia | `id, titulo, copete, categoria, fecha_str, imagen_url, slug` |
| `NoticiaDetalle` | Articulo completo | `noticia` + slots: `aside-top, ad-fullscreen, galeria, aside-bottom` |
| `TopFixtures` | Barra de partidos | `partidos` (array de PartidoDTO) |
| `Publicidad` | Banner de publicidad | `publicidad` (con `imagen_url, link, ancho, alto`) |
| `Sponsors` | Marquee de logos | — (fetch propio) |
| `Revista` | Box de revista | `revista` |
| `GaleriaFotos` | Grid de fotos | `images` (array con `imagen_url`) |
| `Posiciones` | Tabla de posiciones | `posiciones, zonas` |
| `Pagination` | Paginador numerico | `currentPage, totalPages, baseUrl` |

## Paginas

### Home (`/`)

Carga en paralelo: noticias, destacada, publicidades, revista, fixture-integrado. Muestra:
- Barra de fixtures (TopFixtures)
- Noticia destacada con imagen grande
- Grid de 12 noticias
- Sidebar: publicidades, revista, newsletter

### Listado de noticias (`/noticias`)

Muestra todas las noticias con filtro por categoria y paginacion.

### Detalle de noticia (`/noticias/[slug]`)

URL pattern: `/noticias/titulo-del-articulo-{id}`

El ID se extrae del final del slug con regex: `slug.match(/-(\d+)$/)`

Incluye:
- Articulo completo (titulo, copete, contenido, fotógrafo, fuente)
- Galeria de fotos
- Publicidades en slots
- Noticias relacionadas (misma categoria + ultimas)
- JSON-LD `NewsArticle` schema
- Tracking de lectura (POST a la API)

## Estilos

### Variables SCSS

```scss
// _palette.scss — Colores de marca
$col-azul: #003E7E;
$col-azul-claro: #006fd6;
$col-dorado: #ff9b00;

// _variables.scss — Tipografia y spacing
$font-primary: "Inter", sans-serif;
$font-secondary: "Helvetica Condensed Bold", sans-serif;
```

### Dark/Light Mode

Implementado con CSS variables en `:root` y `[data-theme="dark"]`. El toggle esta en el Header con un `<script>` inline que lee/escribe en `localStorage`.

```scss
:root {
    --col-fondo: #f5f5f5;
    --col-texto: #19191a;
}
[data-theme="dark"] {
    --col-fondo: #19191a;
    --col-texto: #f5f5f5;
}
```

## SEO

Implementado en `MainLayout.astro`:
- Meta tags dinamicos (title, description)
- Open Graph tags (og:title, og:image, og:type)
- Twitter Cards
- Canonical URLs
- JSON-LD schemas: `WebSite`, `NewsMediaOrganization`, `NewsArticle`
- `@astrojs/sitemap` para sitemap.xml automatico
- `robots.txt` con Allow + Disallow `/api/`

## Deploy

```bash
# Build + deploy a Cloudflare Workers
npm run deploy
```

Configuracion en `wrangler.jsonc`. Requiere cuenta de Cloudflare y `wrangler` login.

## Variables de Entorno

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `PUBLIC_API_URL` | `http://localhost:3001` | URL base de la API |
