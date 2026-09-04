# Ship Quote

Plataforma fullstack para consultar, comparar y administrar tarifas de transporte entre distintas agencias. El proyecto separa una API REST de un cliente Web administrativo, con MongoDB como persistencia y un stack opcional de observabilidad basado en Loki, Promtail y Grafana.

## Estado del proyecto

- Rama funcional actual: `feature/admin-panel`
- API: `2.0.0`
- Web: `1.1.0`
- Licencia: `ISC`
- Entorno recomendado: Node.js 24 LTS o superior

## Contenido

- [Qué resuelve](#qué-resuelve)
- [Arquitectura](#arquitectura)
- [API](#api)
- [Web](#web)
- [Puesta en marcha](#puesta-en-marcha)
- [Docker y observabilidad](#docker-y-observabilidad)
- [Documentación](#documentación)
- [Calidad y pruebas](#calidad-y-pruebas)
- [Contribución](#contribución)

## Qué resuelve

Ship Quote centraliza la configuración de agencias y sus tarifas, normaliza el origen y destino de un envío y devuelve una comparación entre proveedores. El dominio contempla:

- Agencias de tipo `static`, `api` o `hybrid`.
- Comparación por código postal y por provincia.
- Tarifas para pallets y reglas asociadas a zonas.
- Suplemento de combustible configurable por agencia.
- Ubicaciones por país, provincia y código postal.
- Autenticación basada en sesiones, protección de rutas y auditoría de operaciones.
- Dashboard operativo con estadísticas, actividad reciente y estado de agencias.
- Detalle de auditorías y estados de carga mediante skeletons.

## Arquitectura

```text
ship-quote/
├── api/                 # Servicio Node.js + Express y aplicación servida
│   ├── src/api/         # Rutas, controladores, servicios y middleware
│   ├── src/lib/         # Configuración, modelos, datos, utilidades y logging
│   └── tests/           # Pruebas unitarias y de integración
├── web/                 # Cliente React + Vite
│   └── src/             # Páginas, componentes, hooks, contextos y servicios HTTP
├── docs/                # Contrato y especificaciones funcionales
├── infra/               # Configuración Loki y Promtail
├── Dockerfile           # Build de Web y ejecución de API en una imagen
├── docker-compose.yml   # App, MongoDB, Loki, Promtail y Grafana
└── README.md
```

En desarrollo, `web` se ejecuta como cliente independiente en Vite y consume `api`. En producción, el `Dockerfile` compila la Web y copia su `dist` dentro de la aplicación Node; el contenedor `app` sirve la API y los recursos del frontend.

## API

### Responsabilidad

La API está construida con Node.js, Express 5 y Mongoose. `app.js` registra CORS, logging HTTP, JSON, documentación OpenAPI, las rutas `/api/v1` y la aplicación Web. `server.js` inicializa la configuración y la conexión antes de escuchar en el puerto configurado.

### Capas principales

```text
api/src/
├── api/
│   ├── controllers/      # Auth, agencias, tarifas, zonas, ubicaciones, auditorías...
│   ├── middlewares/      # Auth, validación, auditoría y errores
│   ├── services/         # Casos de uso y motor de comparación
│   ├── docs/             # Swagger/OpenAPI
│   └── index.js          # Composición de rutas
└── lib/
    ├── models/           # Modelos Mongoose
    ├── configs/          # Servidor y base de datos
    ├── bootstrap/        # Carga de datos iniciales
    ├── data/             # Datos de referencia
    ├── constants/        # Constantes del dominio
    ├── logger/           # Winston y Morgan
    └── utils/            # Utilidades compartidas
```

### Rutas públicas

Estas rutas no requieren autenticación y permiten preparar el formulario y realizar la comparación:

| Método | Endpoint | Uso |
| --- | --- | --- |
| `POST` | `/api/v1/auth/login` | Iniciar sesión |
| `GET` | `/api/v1/releases/latest` | Obtener la última release |
| `GET` | `/api/v1/locations/countries` | Listar países |
| `GET` | `/api/v1/locations/provinces` | Listar provincias |
| `GET` | `/api/v1/locations/countries/:countryCode/provinces` | Provincias de un país |
| `GET` | `/api/v1/locations/countries/:countryCode/provinces/:postalCode` | Resolver provincia por código postal |
| `POST` | `/api/v1/rates/compare/postal-code` | Comparar tarifas por código postal |

### Rutas protegidas

El middleware de autenticación protege las operaciones de administración y sesión:

| Método | Endpoint | Uso |
| --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | Registrar usuario |
| `DELETE` | `/api/v1/auth/logout` | Cerrar sesión |
| `GET` | `/api/v1/auth/verify` | Verificar sesión |
| `GET` | `/api/v1/agencies` | Listar agencias |
| `POST` | `/api/v1/agencies` | Crear agencia |
| `GET` | `/api/v1/agencies/:agencyId` | Consultar detalle de agencia |
| `PATCH` | `/api/v1/agencies/:agencyId` | Actualizar agencia |
| `PATCH` | `/api/v1/agencies/:agencyId/active` | Activar o desactivar agencia |
| `PATCH` | `/api/v1/agencies/:agencyId/supplements/fuel-surcharge` | Actualizar suplemento de combustible |
| `DELETE` | `/api/v1/agencies/:agencyId` | Eliminar agencia |
| `GET` | `/api/v1/agencies/:agencyId/pallets` | Pallets de una agencia |
| `POST` | `/api/v1/locations` | Crear ubicación |
| `GET` | `/api/v1/pallets` | Listar tipos de pallet |
| `POST` | `/api/v1/pallets` | Crear tipo de pallet |
| `GET` | `/api/v1/pallets/:palletTypeId` | Detalle de pallet |
| `DELETE` | `/api/v1/pallets/:palletTypeId` | Eliminar pallet |
| `GET` | `/api/v1/zones` | Listar zonas |
| `POST` | `/api/v1/zones` | Crear zona |
| `POST` | `/api/v1/zones/with-rules` | Crear zona con reglas |
| `GET` | `/api/v1/zones/:zoneId` | Detalle de zona |
| `POST` | `/api/v1/zones/:zoneId/rules` | Añadir regla a una zona |
| `GET` | `/api/v1/zones/:zoneId/rules` | Consultar reglas de una zona |
| `POST` | `/api/v1/rates` | Crear tarifa |
| `POST` | `/api/v1/rates/compare/province` | Comparar tarifas por provincia |
| `GET` | `/api/v1/audits` | Listar auditorías |
| `GET` | `/api/v1/audits/recent-activity` | Actividad reciente |
| `GET` | `/api/v1/audits/most-queried-postal` | Códigos postales más consultados |
| `GET` | `/api/v1/audits/stats` | Estadísticas del panel |
| `GET` | `/api/v1/audits/:activityId` | Detalle de una actividad |

La documentación interactiva está disponible en `/api-docs` cuando la aplicación está levantada. La referencia ampliada se encuentra en [docs/API-ENDPOINTS.md](docs/API-ENDPOINTS.md).

### Flujo de comparación

1. El cliente envía origen, destino y elementos del envío.
2. Los middlewares validan el esquema, el destino y los elementos.
3. La API resuelve ubicación y alcance nacional o internacional.
4. Los proveedores consultan tarifas estáticas o integraciones externas.
5. Se aplican reglas, suplementos y restricciones de la agencia.
6. La respuesta se normaliza para que la Web pueda ordenar y presentar los servicios comparados.

## Web

### Responsabilidad

La Web es una SPA construida con React 19, Vite, React Router, Tailwind CSS y `react-hook-form`. Ofrece una experiencia operativa para consultar envíos y administrar la configuración del sistema.

### Rutas de usuario

| Ruta | Página | Acceso |
| --- | --- | --- |
| `/` | Home y comparación de tarifas | Pública |
| `/login` | Inicio de sesión | Pública |
| `/admin/dashboard` | Panel de operaciones | Protegida |
| `/admin/agencies/overview` | Resumen de agencias | Protegida |
| `/admin/agencies/new` | Alta de agencia | Protegida |
| `/admin/agencies/:agencyId` | Detalle y edición de agencia | Protegida |
| `/admin/audits` | Panel de auditorías | Protegida |
| `/admin/audits/:activityId` | Detalle de auditoría | Protegida |

### Organización del frontend

```text
web/src/
├── pages/                 # Home, login, dashboard, agencias y auditorías
├── components/
│   ├── auth/              # Formulario de login y validación
│   ├── layouts/           # Layout público y layout administrativo
│   ├── entities/shipping/ # Agencia, items, provincias y servicios
│   ├── ship-quote/        # Comparación de tarifas y panel admin
│   └── ui/                # Alertas, navegación, loaders y controles
├── hooks/                 # Agencias, auditorías, ubicaciones y comparación
├── services/              # Axios, autenticación y mapeadores de dominio
├── contexts/              # Sesión de usuario y alertas globales
├── guards/                # PrivateRouter para rutas administrativas
└── utils/                 # Constantes, navegación, fechas y conversiones
```

El panel administrativo incluye tarjetas de métricas, actividad reciente, estado de agencias, listado de auditorías, detalle de cambios y estados de carga mediante skeletons. La comparación de tarifas utiliza componentes específicos para el formulario, resultados, agencias, servicios, provincias y elementos del envío.

### Scripts Web

```bash
cd web
npm run dev       # Servidor Vite con hot reload
npm run build     # Build de producción en dist/
npm run preview   # Servir el build localmente
npm run lint      # ESLint
```

## Puesta en marcha

### Requisitos

- Node.js 18 o superior; se recomienda Node.js 24.
- npm.
- MongoDB local o accesible desde `MONGODB_URI`.
- Docker y Docker Compose para el despliegue containerizado.

### Instalación local

```bash
git clone <url-del-repositorio>
cd ship-quote

cd api
npm install
cp .env.example .env

cd ../web
npm install
cp .env.example .env
```

Configura como mínimo la conexión a MongoDB en `api/.env` y las URLs que consume el cliente en `web/.env`. Los archivos `.env.example` contienen la plantilla oficial. Las variables principales son:

```env
# api/.env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
COOKIE_SECURE=false
MONGODB_URI=mongodb://127.0.0.1:27017/shipQuote-db
MONGODB_URI_TEST=mongodb://127.0.0.1:27017/shipQuote-db_test
DEFAULT_COUNTRY=ES

# web/.env
VITE_NODE_ENV=development
VITE_API_URL_DEV=http://localhost:3000/api/v1
VITE_API_URL_PROD=/api/v1
VITE_API_URL_LOG=http://localhost:3001/
```

Arranca cada aplicación en una terminal independiente:

```bash
# Terminal 1
cd api
npm run dev

# Terminal 2
cd web
npm run dev
```

La API queda disponible en `http://localhost:3000`, la documentación en `http://localhost:3000/api-docs` y Vite normalmente en `http://localhost:5173`.

### Scripts API

```bash
cd api
npm run dev            # Desarrollo con nodemon
npm start              # Ejecución con configuración de producción
npm run seed           # Bootstrap de datos iniciales
npm test               # Pruebas unitarias e integración
npm run test:watch     # Vitest en modo watch
npm run test:coverage  # Cobertura con V8
```

## Docker y observabilidad

El `Dockerfile` utiliza dos etapas: primero instala dependencias y compila `web`; después instala la API en una imagen Node Alpine y copia el build frontend a `api/web/build`.

```bash
docker compose up -d
docker compose ps
docker compose logs -f app
```

Servicios publicados por `docker-compose.yml`:

| Servicio | Contenedor | Acceso |
| --- | --- | --- |
| Aplicación API + Web | `ship-quote-app` | `http://localhost:8080` |
| MongoDB | `ship-mongo` | Red interna, puerto 27017 |
| Loki | `ship-loki` | `http://localhost:3100` |
| Grafana | `ship-grafana` | `http://localhost:3001` |
| Promtail | `ship-promtail` | Agente interno de logs |

La aplicación usa Winston y Morgan. Promtail recoge logs de Docker y los envía a Loki; Grafana permite consultarlos y construir dashboards. Las credenciales iniciales de Grafana definidas en Compose son `admin` / `admin`; deben cambiarse antes de un despliegue real.

Para detener el entorno:

```bash
docker compose down
docker compose down -v  # Elimina también los volúmenes persistentes
```

## Documentación

- [API-ENDPOINTS.md](docs/API-ENDPOINTS.md): endpoints, cuerpos y respuestas de la API.
- [DOCUMENTATION.md](docs/DOCUMENTATION.md): documentación funcional y técnica.
- [SPEC.md](docs/SPEC.md): especificación del dominio y cálculo de tarifas.
- [ShipQuote API.postman_collection.json](docs/ShipQuote%20API.postman_collection.json): colección para probar la API desde Postman.

## Calidad y pruebas

La API cuenta con pruebas unitarias y de integración en `api/tests`, ejecutadas con Vitest y Supertest. La Web incorpora ESLint como validación estática.

Antes de abrir una pull request:

```bash
cd api && npm test
cd ../web && npm run lint && npm run build
```

Las variables de entorno, claves de proveedores y secretos nunca deben versionarse. Usa los archivos `.env.example` como plantilla y valores seguros en cada entorno.

## Contribución

1. Crea una rama descriptiva desde la rama de trabajo.
2. Mantén separados los cambios de API, Web y documentación cuando sea posible.
3. Usa Conventional Commits, por ejemplo `feat(web:admin-panel): add audit details`.
4. Ejecuta las pruebas de API, el lint y el build de Web.
5. Abre una pull request explicando el comportamiento añadido y las comprobaciones realizadas.

## Licencia

Este proyecto se distribuye bajo la licencia ISC.
