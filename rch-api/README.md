# RCH API

Backend REST API para el portal Rugby Champagne. Construido con **Fastify 5** y **TypeScript**, conecta a una base de datos SQL Server existente a través de stored procedures.

## Requisitos

- Node.js >= 18
- SQL Server (local via Docker o remoto)
- npm

## Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de DB

# 3. Iniciar en desarrollo (con hot-reload)
npm run dev
```

La API arranca en `http://localhost:3001` por defecto.

### SQL Server con Docker (Apple Silicon)

```bash
docker run -e "ACCEPT_EULA=1" \
  -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \
  -p 1433:1433 \
  --name rch-sql \
  mcr.microsoft.com/azure-sql-edge:latest

# Para Intel/AMD:
# mcr.microsoft.com/mssql/server:2022-latest
```

Restaurar el backup desde Azure Data Studio o script:
```sql
RESTORE DATABASE rugby_champagne
FROM DISK = '/backups/rugby_champagne_19-12-2025.bak'
WITH MOVE 'rugby_champagne' TO '/var/opt/mssql/data/rugby_champagne.mdf',
     MOVE 'rugby_champagne_log' TO '/var/opt/mssql/data/rugby_champagne_log.ldf',
     REPLACE;
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo con hot-reload (tsx watch) |
| `npm run build` | Compilar TypeScript a `dist/` |
| `npm start` | Ejecutar build compilado |

## Arquitectura

```
src/
├── app.ts                  ← Entry point: registra plugins y rutas
├── plugins/
│   ├── db.ts               ← Plugin Fastify: conecta pool al inicio, cierra al shutdown
│   └── cors.ts             ← Plugin Fastify: CORS desde env variable
├── modules/
│   ├── noticias/           ← Cada módulo tiene:
│   │   ├── noticias.routes.ts    │  routes  → define endpoints HTTP
│   │   ├── noticias.service.ts   │  service → lógica de negocio + llamadas a SP
│   │   └── noticias.schema.ts    │  schema  → JSON Schema para validación
│   ├── publicidades/
│   ├── sponsors/
│   ├── revistas/
│   ├── torneos/
│   └── clubes/
└── shared/
    ├── db.ts               ← Connection pool + helpers (execSp, execSpSingle, execQuery)
    ├── image.ts            ← Generación de URLs de imágenes
    └── utils.ts            ← Utilidades (getUrlFriendly, mes, intNull)
```

### Patrón de un módulo

Cada módulo sigue la misma estructura:

**`service.ts`** — Lógica de negocio. Llama stored procedures y enriquece datos.
```typescript
// Ejemplo: noticias.service.ts
export async function obtenerNoticias() {
    const rows = await execSp<Noticia>("NoticiaObtenerListado");
    return rows.map(enrichNoticia); // agrega imagen_url, slug
}
```

**`routes.ts`** — Define endpoints HTTP. Delega al service.
```typescript
// Ejemplo: noticias.routes.ts
export default async function noticiasRoutes(app: FastifyInstance) {
    app.get("/api/noticias", async () => service.obtenerNoticias());
    app.get("/api/noticias/:id", async (req, reply) => { ... });
}
```

**`schema.ts`** — JSON Schema para request/response validation (opcional).

### Helper de Base de Datos (`shared/db.ts`)

La API usa un connection pool singleton de `mssql`. Los helpers principales:

```typescript
execSp<T>(spName, params?)        // → T[]         Ejecuta SP, retorna array
execSpSingle<T>(spName, params?)  // → T | null    Ejecuta SP, retorna primer row o null
execSpVoid(spName, params?)       // → void        Ejecuta SP sin retorno
execQuery<T>(query, params?)      // → T[]         Ejecuta query SQL directo
```

Los parámetros se pasan como `Record<string, unknown>` y se mapean a `request.input()` del driver mssql.

### Enriquecimiento de Imágenes

La API agrega campos `imagen_url` a las respuestas. Las URLs base se configuran en `.env`:

```
IMAGE_PATH_NOTICIAS=https://rugbychampagneweb.com/archivos/novedades/
IMAGE_PATH_SPONSORS=https://rch.devzone.com.ar/archivos/sponsors/
IMAGE_PATH_EQUIPOS=http://rch.devzone.com.ar/files/teams/
```

Funciones en `shared/image.ts`:
- `noticiaImage(nombreImagen)` → URL completa de imagen de noticia
- `equipoImage(clubId, paisId)` → Logo de club o bandera de país
- `sponsorImage(id)` → `{base}{id}.gif`
- `publicidadImage(nombreImagen)` → URL de banner publicitario
- `revistaImage(anio, mes)` → `RevistaRCH-{anio}-{mes}.jpg`

## Endpoints

### Noticias

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/noticias` | Listado completo de noticias |
| GET | `/api/noticias/destacada` | Noticia destacada (home) |
| GET | `/api/noticias/:id` | Detalle de una noticia |
| GET | `/api/noticias/:id/galeria` | Galería de fotos de una noticia |
| POST | `/api/noticias/:id/lectura` | Registrar lectura (tracking) |
| GET | `/api/noticias/tag/:tag?pag=1&activo=1` | Buscar por tag con paginación |

### Torneos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/torneos/destacado` | Torneo destacado |
| GET | `/api/torneos/:id/fixture` | Fixture de un torneo |
| GET | `/api/fixture-integrado` | Fixture integrado de todos los torneos (home) |

### Otros

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/publicidades` | Banners publicitarios |
| GET | `/api/sponsors` | Lista de sponsors |
| GET | `/api/revistas/ultima` | Última revista publicada |
| GET | `/api/clubes` | Todos los clubes |
| GET | `/api/health` | Health check |

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3001` | Puerto del servidor |
| `HOST` | `0.0.0.0` | Host de escucha |
| `DB_SERVER` | `localhost` | Host de SQL Server |
| `DB_DATABASE` | `rugby_champagne` | Nombre de la base de datos |
| `DB_USER` | `sa` | Usuario de SQL Server |
| `DB_PASSWORD` | — | Password de SQL Server |
| `DB_PORT` | `1433` | Puerto de SQL Server |
| `CORS_ORIGIN` | `http://localhost:4321` | Origen permitido para CORS |
| `IMAGE_PATH_EQUIPOS` | — | Base URL para imágenes de equipos |
| `IMAGE_PATH_NOTICIAS` | — | Base URL para imágenes de noticias |
| `IMAGE_PATH_PUBLICIDADES` | — | Base URL para imágenes de publicidades |
| `IMAGE_PATH_SPONSORS` | — | Base URL para imágenes de sponsors |
| `IMAGE_PATH_REVISTAS` | — | Base URL para imágenes de revistas |

## Notas Importantes

### Column names de stored procedures

Los stored procedures de SQL Server pueden retornar columnas con nombres inconsistentes (PascalCase vs snake_case). Ejemplo:

- `TorneoObtenerFixture` retorna `local`, `visitante` (lowercase)
- `TorneosObtenerFixtureIntegrado` retorna `Local`, `Visitante` (PascalCase)

Cuando se agrega un nuevo endpoint, **siempre verificar los nombres reales** de las columnas:

```typescript
const result = await pool.request().execute('NombreDelSP');
console.log(Object.keys(result.recordset[0]));
```

Si hay diferencias, crear una interface `Raw` con los nombres reales y normalizar en el service (ver `FixtureIntegradoRow` en `torneos.service.ts` como ejemplo).

### club_id vs pais_id

En partidos, un equipo puede ser un club (`club_id > 0`) o una selección nacional (`club_id = 0/null, pais_id > 0`). La función `equipoImage()` maneja ambos casos.
