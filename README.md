# Ship Quote — Documentación del proyecto

Este documento ofrece una visión completa del proyecto y la documentación técnica dividida en dos partes: **API** (backend) y **Web** (frontend). Está redactado en español y contiene instrucciones de arranque, variables de entorno, endpoints, esquemas de recursos y ejemplos de uso.

## 📚 Centro de Documentación

Para una documentación completa y organizada, consulta:
- **[📖 Centro de Documentación](docs/DOCUMENTATION.md)** — Índice de toda la documentación disponible
- **[🔌 Referencia de Endpoints](docs/API-ENDPOINTS.md)** — Todos los endpoints con ejemplos curl
- **[📋 OpenAPI YAML](api/openapi.yaml)** — Especificación en formato YAML
- **[📋 OpenAPI JSON](api/openapi.json)** — Especificación en formato JSON

---

Índice
- **API** — Cómo ejecutar, endpoints, modelos y ejemplos
- **Web** — Cómo ejecutar, variables y notas de integración
- **Docker** — Arranque con Docker Compose

---

**PARTE 1 — API (backend)**

Resumen
Ship Quote ofrece un motor de comparación de tarifas que puede consumir datos estáticos (almacenados en MongoDB) o consultar APIs externas configuradas por agencia. Está implementado con Node.js (ES Modules), Express 5 y MongoDB (mongoose).

Estructura relevante (resumida)
```
api/
├─ app.js                 # Entrada del servidor
├─ package.json
└─ src/
   ├─ api/
   │  ├─ index.js         # Ruteo principal (/api/v1)
   │  ├─ controllers/     # Lógica por recurso
   │  ├─ middlewares/     # Validaciones y errores
   │  └─ services/        # Motor de tarifas y providers
   └─ lib/
      ├─ configs/         # Conexión DB + bootstrap
      └─ models/          # Esquemas mongoose
```

Requisitos previos
- Node.js 18+ / npm
- MongoDB (local o remoto)

Variables de entorno clave (API)
- `PORT` — puerto del servidor (por defecto 3000)
- `MONGODB_URI` — cadena de conexión a MongoDB
- `MONGODB_URI_TEST` — cadena para entorno de test (opcional)

Arranque local (API)
```bash
cd api
npm install
# crear .env con al menos:
# PORT=3000
# MONGODB_URI=mongodb://127.0.0.1:27017/shipQuote-db
npm run dev    # desarrollo (nodemon)
npm start      # producción
```

Bootstrap de datos
```bash
cd api
npm run seed
```

Base URL
Todos los endpoints están montados bajo: `/api/v1` (ej. `http://localhost:3000/api/v1`).

Endpoints principales
Nota: las rutas siguientes se extraen de `api/src/api/index.js` y de los controladores.

- POST /api/v1/agencies — Crear agencia
  - Body (ejemplo):
    ```json
    {
      "name": "Dachser",
      "type": "api", // "static" | "api" | "hybrid"
      "rules": { "hasAndaluciaRule": false, "supportsPallets": true },
      "apiConfig": { "baseUrlApi": "https://...", "apiKey": "..." }
    }
    ```
  - Respuestas: `201` con el recurso creado; `400` validación; `409` duplicado.

- GET /api/v1/agencies — Listar agencias

- PATCH /api/v1/agencies/:agencyId — Alternar `active` (activa/desactiva)

- POST /api/v1/locations — Crear ubicación/provincia
  - Body (campos principales): `countryCode` (2), `countryName`, `adminCode`, `name`, `type`
  - Respuesta: `201` con el recurso.

- GET /api/v1/locations — Listar ubicaciones (opcional query `?address=` para búsqueda)
- GET /api/v1/locations/:locationId — Detalle por id
- GET /api/v1/locations/countries — Lista de países (servicio)

- POST /api/v1/pallets — Crear tipo de pallet
  - Body: `agencyId`, `name`, `constraints` ({ maxWeight, maxHeight, maxLength, maxWidth })
- GET /api/v1/pallets — Listar pallets
- GET /api/v1/pallets/:palletTypeId — Detalle
- POST /api/v1/pallets/compare — Comparación/validación de dimensiones (body: { item })
- DELETE /api/v1/pallets/:palletTypeId — Eliminar

- POST /api/v1/zones — Crear zona
  - Body: `agencyId`, `name`, `provinces` (array de códigos), `calculationMode` (`pallet` | `parcel`), `postalCodeExceptions` (array de {from,to,zoneName})
- GET /api/v1/zones — Listar
- GET /api/v1/zones/:zoneId — Detalle

- POST /api/v1/rates/compare — Comparar tarifas (motor principal)
  - Validaciones aplicadas: `schemaValidation` (req.body presente) y `rateValidation` (estructura de `items`)
  - Body mínimo:
    ```json
    {
      "destinationPostalCode": "08001",
      "province": "BCN",
      "items": [
        {
          "typeServices": "pallet", // "pallet" o "parcel"
          "weight": 300,
          "large": 120,
          "width": 80,
          "height": 150
        }
      ]
    }
    ```
  - Comportamiento:
    - El servicio consulta agencias activas y lanza dos flujos en paralelo: tarifas estáticas y tarifas vía API (según `agency.type`).
    - Para `static` usa `zones`, `rates` y `palletTypes` para calcular costos.
    - Para `api` invoca adaptadores/carriers (si existen) y normaliza la respuesta.

Validaciones y errores comunes
- `schemaValidation.middleware.js`: fuerza que POST/PATCH/PUT tenga body.
- `rateValidation.middleware.js`: valida `destinationPostalCode` y `province` como strings, `items` como array no vacío y cada item con `typeServices`, `weight`, `large`, `width`, `height` > 0.
- `errors.middleware.js`: mapea errores a códigos HTTP (400, 404, 409, 500) y maneja errores de cast y duplicados.

Modelos (resumen de campos importantes)
- Agency (`api/src/lib/models/agency.model.js`)
  - `name`, `code`, `type` (static|api|hybrid), `active`, `rules`, `supplements`, `apiConfig` (timeout, baseUrlApi, endpoints, apiKey)

- Location (`location.model.js`)
  - `countryCode`, `countryName`, `adminCode`, `adminFullCode`, `name`, `normalizedName`, `postalCode`, `type`

- PalletType (`palletType.model.js`)
  - `agencyId`, `name`, `constraints` (maxWeight, maxHeight, maxLength, maxWidth)

- Zone (`zone.model.js`)
  - `agencyId`, `name`, `provinces`, `calculationMode`, `pricingMode`, `postalCodeExceptions`

- Rate (`rate.model.js`)
  - `agencyId`, `type` (pallet|parcel), `zoneName`, `palletTypeId`, `services` (service, priceBreaks, surcharges, limits)

Notas de arquitectura / lógica
- Soporta agencias `static`, `api` y `hybrid`.
- Para agencias `api` existe una fábrica de carriers (`carrierFactory`) que crea adaptadores para cada proveedor.
- El flujo principal junta resultados (arrays) de proveedores estáticos y APIs externas y devuelve un array plano de resultados por agencia.

---

**PARTE 2 — WEB (frontend)**

Resumen
La carpeta `web/` contiene una aplicación React (Vite) que consume la API (`/api/v1`) para mostrar la UI de comparación de tarifas. Está configurada para usar `VITE_API_URL` como variable para apuntar a la API.

Estructura relevante
```
web/
├─ package.json
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ services/api-services.js  # cliente axios con baseURL
│  └─ components/ ...
```

Instalación y arranque (desarrollo)
```bash
cd web
npm install
npm run dev
```

Variables de entorno (frontend)
- `VITE_API_URL` — URL base de la API (ej. `http://localhost:3000/api/v1`). Si no está, el cliente usa `http://localhost:3000/api/v1` por defecto.

Peticiones desde el frontend
El cliente axios está en `web/src/services/api-services.js`. Los endpoints usados son:
- `GET /locations` → `locationsProvinces()`
- `GET /locations/countries` → `locationsCountries()`
- `POST /rates/compare` → `compareRate(data)`

Build y producción
```bash
cd web
npm run build   # genera /dist
```
En el Dockerfile del proyecto la carpeta `web/dist` se copia dentro del contenedor de la API (`/opt/ship-api/web/build`) y el servidor sirve el frontend.

---

Docker
El proyecto incluye `Dockerfile` y `docker-compose.yml` para levantar la API y MongoDB.

Levantar con Docker Compose
```bash
docker-compose up --build
```
El `docker-compose.yml` expone el servicio `app` en `localhost:8080` (mappeado a `3000` interno) y una instancia de `mongo`.

Notas útiles
- La imagen multi-stage construye y compila la app frontend dentro del contenedor y la copia al contenedor de la API.
- Si trabajas localmente y quieres usar la UI de desarrollo (`vite`), ejecuta `npm run dev` dentro de `web`.

Comandos rápidos
- API dev: `cd api && npm install && npm run dev`
- API prod: `cd api && npm start`
- Web dev: `cd web && npm install && npm run dev`
- Docker: `docker-compose up --build`

---

Documento generado (endpoints y modelos consultados el 26/05/2026).

## 📍 Notas finales

- La ruta base es `/api/v1`.
- El motor actual es compatible con tarifas estáticas y con APIs de proveedores externos.
- La colección `locations` se popula automáticamente al iniciar si no existe.
- Utiliza `npm run seed` para cargar datos de ejemplo cuando sea necesario.

---

## 📚 Referencias

- `api/app.js`
- `api/src/api/index.js`
- `api/src/lib/configs/server.config.js`
- `api/src/api/services/rateEnginev3.service.js`
- `api/src/api/services/compareRates/staticRates.service.js`
- `api/src/api/services/compareRates/apiRates.service.js`
- `api/src/api/services/carriers/carriers.service.interface.js`
- `api/src/lib/models/*.js`

### `POST /rates/compare`

Calcula y compara tarifas de todas las agencias.

#### Request

```json
{
  "destinationPostalCode": "08001",
  "items": [
    {
      "type": "pallet",
      "length": 120,
      "width": 80,
      "height": 150,
      "weight": 300
    }
  ]
}
```

#### Response

```json
[
  {
    "agency": "Cayco",
    "available": true,
    "total": 140,
    "breakdown": [
      {
        "type": "pallet",
        "palletType": "Europeo",
        "quantity": 1,
        "price": 40
      },
      {
        "type": "pallet",
        "palletType": "Americano",
        "quantity": 3,
        "price": 100
      }
    ]
  },
  {
    "agency": "Otra Agencia",
    "available": false,
    "reason": "No hay tarifa disponible"
  }
]
```

---

## ⚡ Optimizaciones

### Indexes MongoDB

```js
// En Rates
{ agencyId: 1, type: 1, zoneName: 1 }
{ agencyId: 1, palletTypeId: 1, zoneName: 1 }

// En Zones
{ agencyId: 1, provinces: 1 }
```

### Bulk Loading de Tarifas

En lugar de N consultas por agencia, cargamos todo en una:

```js
const rates = await Rate.find({
  agencyId: { $in: agencyIds }
});
```

---

## 🔌 Preparado para APIs Externas

### Agencias Tipo "API"

```json
{
  "name": "MiAgencia",
  "type": "api",
  "apiEndpoint": "https://api.miagencia.com/rates"
}
```

---

## 📊 Bootstrap de Datos

Inicializar base de datos:

```bash
npm run seed
```

Scripts disponibles:
- `bootstrap.js` - Bootstrap general

---

## 📝 Notas Importantes

1. **Normalización primero:** Todo input se normaliza antes de procesar
2. **Desacoplamiento por agencia:** Cada agencia tiene sus propios palletTypes y zonas
3. **Bulk queries:** Usar índices y consultas bulk para performance
4. **Extensible:** Estructura lista para APIs externas de agencias

---

## 🛠️ Tecnología

- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Rate Engine:** Lógica de cálculo personalizada
- **Frontend:** Web (en `/web`)

---

## 📄 Documentación Técnica

Ver [SPEC.md](SPEC.md) para detalles de arquitectura, modelos de datos y algoritmos