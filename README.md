# Ship Quote API 🚀

API de comparación de tarifas de envío basada en normalización de datos, cálculo inteligente y soporte para agencias estáticas y APIs externas.

## 📋 Resumen

`Ship Quote` es el backend que permite:
- Registrar agencias y su configuración de tarifas
- Crear zonas y tipos de pallet por agencia
- Guardar ubicaciones/provincias de España
- Comparar tarifas entre múltiples proveedores
- Integrar proveedores tipo `api` con adaptadores específicos

La API está implementada con `Node.js`, `Express 5` y `MongoDB`.

> Documentación técnica de la API disponible en [API.md](api/docs/API.md).

---

## 🚀 Estructura actual del proyecto

```
api/
├── app.js
├── package.json
├── src/
│   ├── api/
│   │   ├── index.js
│   │   ├── controllers/
│   │   │   ├── agencies.controller.js
│   │   │   ├── locations.controller.js
│   │   │   ├── palletTypes.controller.js
│   │   │   ├── rates.controller.js
│   │   │   └── zones.controller.js
│   │   ├── middlewares/
│   │   │   ├── errors.middleware.js
│   │   │   └── schemaValidation.middleware.js
│   │   ├── services/
│   │   │   ├── rateEnginev3.service.js
│   │   │   ├── compareRates/
│   │   │   │   ├── apiRates.service.js
│   │   │   │   ├── staticRates.service.js
│   │   │   │   ├── carriers/
│   │   │   │   │   ├── carriers.map.js
│   │   │   │   │   ├── carriers.service.js
│   │   │   │   │   ├── carriers.service.interface.js
│   │   │   │   │   └── externalCarriers/dascher.service.js
│   │   │   └── zoneLocation.service.js
│   │   └── utils/
│   │       ├── date.util.js
│   │       └── rateEngine.util.js
│   └── lib/
│       ├── configs/
│       │   ├── db.config.js
│       │   └── server.config.js
│       ├── models/
│       │   ├── agency.model.js
│       │   ├── location.model.js
│       │   ├── palletType.model.js
│       │   ├── rate.model.js
│       │   └── zone.model.js
│       └── storages/
│           └── location.storage.js
├── bin/
│   ├── agencies.seed.js
│   ├── seed.js
│   └── tecumSeeds/
│       ├── ...
└── web/
```

---

## ⚙️ Cómo ejecutar la API

1. Ir a la carpeta `api/`
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear `.env` con variables mínimas:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/shipQuote-db
   ```
4. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```
5. Iniciar en modo producción:
   ```bash
   npm start
   ```

> Al arrancar, `src/lib/configs/server.config.js` conecta con MongoDB y llama a `initLocations()` para poblar las provincias si la colección `locations` aún no existe.

---

## 🌐 Base de rutas

La API expone rutas bajo `/api/v1`.

Ejemplo base:
```bash
http://localhost:3000/api/v1
```

---

## 🧩 Endpoints disponibles

### Agencias

#### `POST /api/v1/agencies`
Crea una nueva agencia.

Request body:
```json
{
  "name": "Dachser",
  "type": "api",
  "rules": {
    "hasAndaluciaRule": false,
    "supportsPallets": true,
    "supportsParcels": false
  },
  "apiConfig": {
    "baseUrlApi": "https://api.example.com",
    "endpoints": {
      "quotations": "quotations"
    },
    "apiKey": "abcdef123456"
  }
}
```

Respuesta: `201 Created` con el registro de la agencia.

---

#### `GET /api/v1/agencies`
Lista todas las agencias.

Respuesta: `200 OK` con arreglo de agencias.

---

#### `PATCH /api/v1/agencies/:agencyId`
Activa o desactiva una agencia existente. Cambia el campo `active`.

Respuesta: `200 OK` con la agencia actualizada.

---

### Ubicaciones

#### `POST /api/v1/locations`
Crea una ubicación/provincia.

Request body:
```json
{
  "country_code": "ES",
  "country_name": "Spain",
  "admin_code": "08",
  "name": "Barcelona",
  "type": "province"
}
```

Respuesta: `201 Created`.

---

#### `GET /api/v1/locations`
Devuelve todas las ubicaciones.

#### `GET /api/v1/locations/:locationId`
Obtiene detalles de una ubicación por su id.

---

### Pallets

#### `POST /api/v1/pallets`
Crea un tipo de pallet para una agencia.

Request body:
```json
{
  "agencyId": "<agencyId>",
  "name": "Europeo",
  "constraints": {
    "maxWeight": 1000,
    "maxHeight": 150,
    "maxLength": 120,
    "maxWidth": 80
  }
}
```

#### `GET /api/v1/pallets`
Lista todos los tipos de pallets.

#### `GET /api/v1/pallets/:palletTypeId`
Detalle de un tipo de pallet.

#### `DELETE /api/v1/pallets/:palletTypeId`
Elimina un tipo de pallet existente.

---

### Zonas

#### `POST /api/v1/zones`
Crea una zona de cálculo para una agencia.

Request body:
```json
{
  "agencyId": "<agencyId>",
  "name": "Andalucía",
  "provinces": ["SE", "MA", "CA"],
  "calculationMode": "weight_volume",
  "postalCodeExceptions": [
    { "from": "41001", "to": "41080", "zoneName": "Sevilla" }
  ]
}
```

#### `GET /api/v1/zones`
Lista todas las zonas.

#### `GET /api/v1/zones/:zoneId`
Detalle de una zona.

---

### Comparación de tarifas

#### `POST /api/v1/rates/compare`
Compara tarifas disponibles para todas las agencias activas.

Request body mínimo:
```json
{
  "destinationPostalCode": "08001",
  "province": "BCN",
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

Respuesta esperada:
```json
[
  {
    "agency": "Dachser",
    "available": true,
    "zone": "Nacional",
    "services": [
      {
        "service": "economy",
        "total": 140,
        "breakdown": [
          {
            "type": "weight_volume",
            "totalWeight": 300,
            "price": 140
          }
        ]
      }
    ]
  },
  {
    "agency": "Cayco",
    "available": false,
    "reason": "No hay tarifa disponible"
  }
]
```

---

## 🧠 Lógica de negocio clave

### 1. Control de tipos de agencia

- `static`: tarifas calculadas desde datos internos (`zones`, `rates`, `palletTypes`).
- `api`: tarifas obtenidas desde un proveedor externo usando `apiConfig`.

### 2. Proveedores externos

La integración de proveedores se basa en un `CarrierService` abstracto:

- `fetchApi()` realiza la llamada HTTP con tiempo de espera y abort signal.
- `buildRequestBody()` crea el payload específico del carrier.
- `buildRequestHeaders()` arma encabezados con API key.
- `mapResponse()` normaliza la respuesta.

Actualmente existe un adaptador para:
- `dachser` → `DascherService`

Si una agencia API no tiene adaptador registrado, la respuesta es:
```json
{
  "agency": "MiAgencia",
  "available": false,
  "reason": "API Error: Not Implemented"
}
```

### 3. Cálculo de tarifas estáticas

Para agencias `static`, el proceso es:

1. Cargar zonas, tarifas y tipos de pallet en bulk.
2. Agrupar datos por `agencyId`.
3. Resolver la zona válida usando excepciones de códigos postales o provincias.
4. Calcular tarifas según `calculationMode`:
   - `weight_volume`: usa peso volumétrico / efectivo.
   - `pallet`: clasifica pallets y calcula por cantidad.

### 4. Funciones de utilidad importantes

- `calculateVolume(item)` → m³
- `calculateVolumetricWeight(item)` → peso volumétrico
- `getEffectiveWeight(item)` → peso mayor entre real y volumétrico
- `classifyPallet(item, palletTypes)` → encuentra el pallet que entra en las restricciones
- `resolveZone(zones, postalCode, province)` → determina la zona destino
- `groupByAgency(collection)` → agrupa documentos por agencia

---

## 🗃️ Esquemas MongoDB y validaciones

### `Agency`
- `name`: requerido, mín 3, máx 14 caracteres.
- `code`: generado desde `name`, lowercase y normalizado.
- `type`: `static` o `api`.
- `rules`: controles de soporte para Andalucía, pallets y parcels.
- `apiConfig`: solo obligatorio para `type: api`.

### `Location`
- `country_code`, `country_name`, `admin_code`, `admin_full_code`, `name`, `normalized_name`.
- `normalized_name` se guarda en minúsculas y sin acentos.
- Índices para búsquedas rápidas por provincia.

### `PalletType`
- `agencyId`: referencia a `Agency`.
- `constraints`: máximos de peso y dimensiones.

### `Zone`
- `agencyId` referencia a `Agency`.
- `provinces`: lista de provincias.
- `calculationMode`: `pallet` o `weight_volume`.
- `postalCodeExceptions`: reglas de excepción de zona.

### `Rate`
- `type`: `pallet` o `parcel`.
- `zoneName`: zona aplicada.
- `palletTypeId`: usado para tarifas de pallet.
- `services`: listas de `service` y `priceBreaks`.

---

## 🔧 Manejo de errores y validaciones

### Validación de solicitudes
`schemaValidation.middleware.js` obliga a que los métodos `POST`, `PATCH` y `PUT` reciban un cuerpo.

### Manejo de errores global
`errors.middleware.js` transforma errores a respuestas JSON con estados:
- `400` → error de validación o cuerpo faltante
- `404` → recurso no encontrado / ruta no encontrada
- `409` → duplicados (`E11000`)
- `502` → error en proveedor externo
- `500` → error interno del servidor

---

## 📌 Cambios, mejoras y añadidos

- Documentación exhaustiva de la API y su arquitectura actual.
- Actualización de la estructura real de `api/` y rutas disponibles.
- Descripción de cada controlador y su responsabilidad.
- Explicación del motor de cálculo moderno en `rateEnginev3.service.js`.
- Cobertura de la integración de carriers externos via `CarrierService` y `DascherService`.
- Aclaración del proceso de arranque del servidor y la inicialización de `locations`.
- Inclusión de ejemplos de request/response para reducir la barrera para desarrolladores nuevos.

---

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

## 📊 Seed de Datos

Inicializar base de datos:

```bash
npm run seed
```

Scripts disponibles:
- `seed.js` - Seed general
- `caycoPalletTypes.js` - Tipos de pallets Cayco
- `caycoRates.v2.seed.js` - Tarifas Cayco v2
- `caycoZones.seed.js` - Zonas Cayco

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