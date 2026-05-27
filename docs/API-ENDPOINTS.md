# Ship Quote API — Documentación de Endpoints

Este documento proporciona la documentación completa de todos los endpoints de la API, con ejemplos curl para cada uno.

**Base URL:** `http://localhost:3000/api/v1`

**Tabla de Contenidos**
- [Agencias](#agencias)
- [Ubicaciones](#ubicaciones)
- [Pallets](#pallets)
- [Zonas](#zonas)
- [Comparación de Tarifas](#comparación-de-tarifas)
- [Respuestas de Error](#respuestas-de-error)

---

## Agencias

### POST /agencies — Crear agencia

Crea una nueva agencia para gestionar tarifas.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/agencies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dachser",
    "type": "static",
    "rules": {
      "hasAndaluciaRule": false,
      "supportsPallets": true,
      "supportsParcels": false
    }
  }'
```

**Body (campos):**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Sí | Nombre de la agencia (3-14 caracteres) |
| `type` | string | No | `static`, `api`, `hybrid` (defecto: `static`) |
| `rules` | object | No | Configuración de reglas y soporte |
| `apiConfig` | object | No | Requerido si `type` es `api` o `hybrid` |

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Dachser",
  "code": "dachser",
  "type": "static",
  "active": true,
  "rules": {
    "hasAndaluciaRule": false,
    "supportsPallets": true,
    "supportsParcels": false
  }
}
```

---

### GET /agencies — Listar agencias

Obtiene todas las agencias registradas.

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/agencies
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Dachser",
    "code": "dachser",
    "type": "static",
    "active": true
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "Cayco",
    "code": "cayco",
    "type": "static",
    "active": true
  }
]
```

---

### PATCH /agencies/{agencyId} — Alternar estado

Activa o desactiva una agencia (alterna el campo `active`).

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/v1/agencies/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `agencyId` | string (path) | ID de MongoDB de la agencia |

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Dachser",
  "active": false
}
```

---

## Ubicaciones

### POST /locations — Crear ubicación

Registra una nueva provincia o región.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/locations \
  -H "Content-Type: application/json" \
  -d '{
    "countryCode": "ES",
    "countryName": "Spain",
    "adminCode": "08",
    "name": "Barcelona",
    "type": "province"
  }'
```

**Body (campos):**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `countryCode` | string | Sí | Código ISO (2 letras, ej. "ES") |
| `countryName` | string | Sí | Nombre del país |
| `adminCode` | string | Sí | Código de provincia/estado |
| `name` | string | Sí | Nombre de la provincia |
| `type` | string | No | `province`, `state`, `region` (defecto: `province`) |

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "countryCode": "ES",
  "countryName": "Spain",
  "adminCode": "08",
  "adminFullCode": "ES-08",
  "name": "Barcelona",
  "normalizedName": "barcelona",
  "type": "province"
}
```

---

### GET /locations — Listar ubicaciones

Obtiene todas las ubicaciones. Soporta búsqueda con `?address=`.

**Request (sin filtro):**
```bash
curl -X GET http://localhost:3000/api/v1/locations
```

**Request (con búsqueda):**
```bash
curl -X GET "http://localhost:3000/api/v1/locations?address=barcelona"
```

**Query Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `address` | string | Búsqueda parcial por nombre normalizado (opcional) |

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "countryCode": "ES",
    "countryName": "Spain",
    "adminCode": "08",
    "name": "Barcelona",
    "normalizedName": "barcelona"
  }
]
```

---

### GET /locations/{locationId} — Detalle de ubicación

Obtiene los detalles de una ubicación específica.

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/locations/507f1f77bcf86cd799439013
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "countryCode": "ES",
  "countryName": "Spain",
  "adminCode": "08",
  "adminFullCode": "ES-08",
  "name": "Barcelona",
  "normalizedName": "barcelona",
  "type": "province"
}
```

---

### GET /locations/countries — Listar países

Obtiene la lista de países disponibles.

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/locations/countries
```

**Response (200 OK):**
```json
[
  { "code": "ES", "name": "Spain" },
  { "code": "FR", "name": "France" },
  { "code": "IT", "name": "Italy" }
]
```

---

## Pallets

### POST /pallets — Crear tipo de pallet

Registra un nuevo tipo de pallet para una agencia.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/pallets \
  -H "Content-Type: application/json" \
  -d '{
    "agencyId": "507f1f77bcf86cd799439011",
    "name": "Europeo",
    "constraints": {
      "maxWeight": 1000,
      "maxHeight": 150,
      "maxLength": 120,
      "maxWidth": 80
    }
  }'
```

**Body (campos):**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `agencyId` | string | Sí | ID MongoDB de la agencia |
| `name` | string | Sí | Nombre del tipo de pallet (máx. 60 caracteres) |
| `constraints` | object | Sí | Límites de dimensiones y peso |
| `constraints.maxWeight` | number | Sí | Peso máximo (kg) |
| `constraints.maxHeight` | number | No | Altura máxima (cm) |
| `constraints.maxLength` | number | No | Largo máximo (cm) |
| `constraints.maxWidth` | number | No | Ancho máximo (cm) |

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439014",
  "agencyId": "507f1f77bcf86cd799439011",
  "name": "Europeo",
  "constraints": {
    "maxWeight": 1000,
    "maxHeight": 150,
    "maxLength": 120,
    "maxWidth": 80
  }
}
```

---

### GET /pallets — Listar pallets

Obtiene todos los tipos de pallet registrados.

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/pallets
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439014",
    "agencyId": "507f1f77bcf86cd799439011",
    "name": "Europeo",
    "constraints": { "maxWeight": 1000, "maxHeight": 150 }
  }
]
```

---

### GET /pallets/{palletTypeId} — Detalle de pallet

Obtiene los detalles de un tipo de pallet.

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/pallets/507f1f77bcf86cd799439014
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439014",
  "agencyId": "507f1f77bcf86cd799439011",
  "name": "Europeo",
  "constraints": {
    "maxWeight": 1000,
    "maxHeight": 150,
    "maxLength": 120,
    "maxWidth": 80
  }
}
```

---

### POST /pallets/compare — Comparar dimensiones

Valida o compara dimensiones de un artículo contra pallets existentes.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/pallets/compare \
  -H "Content-Type: application/json" \
  -d '{
    "item": {
      "weight": 300,
      "large": 100,
      "width": 80,
      "height": 120
    }
  }'
```

**Body:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `item` | object | Objeto con dimensiones y peso |

**Response (200 OK):**
```json
{
  "valid": true,
  "matchingPallets": ["507f1f77bcf86cd799439014"]
}
```

---

### DELETE /pallets/{palletTypeId} — Eliminar pallet

Elimina un tipo de pallet.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/pallets/507f1f77bcf86cd799439014
```

**Response (204 No Content):**
```
(sin contenido)
```

---

## Zonas

### POST /zones — Crear zona

Registra una zona de cálculo para una agencia.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/zones \
  -H "Content-Type: application/json" \
  -d '{
    "agencyId": "507f1f77bcf86cd799439011",
    "name": "Andalucía",
    "provinces": ["SE", "MA", "CA", "CO"],
    "calculationMode": "pallet",
    "postalCodeExceptions": [
      { "from": "41001", "to": "41080", "zoneName": "Sevilla" }
    ]
  }'
```

**Body (campos):**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `agencyId` | string | Sí | ID MongoDB de la agencia |
| `name` | string | Sí | Nombre de la zona |
| `provinces` | array | No | Códigos de provincias incluidas |
| `calculationMode` | string | No | `pallet` o `parcel` (defecto: `pallet`) |
| `postalCodeExceptions` | array | No | Excepciones por rango de códigos postales |

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439015",
  "agencyId": "507f1f77bcf86cd799439011",
  "name": "Andalucía",
  "provinces": ["SE", "MA", "CA", "CO"],
  "calculationMode": "pallet",
  "postalCodeExceptions": [
    { "from": "41001", "to": "41080", "zoneName": "Sevilla" }
  ]
}
```

---

### GET /zones — Listar zonas

Obtiene todas las zonas registradas.

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/zones
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439015",
    "agencyId": "507f1f77bcf86cd799439011",
    "name": "Andalucía",
    "provinces": ["SE", "MA", "CA", "CO"],
    "calculationMode": "pallet"
  }
]
```

---

### GET /zones/{zoneId} — Detalle de zona

Obtiene los detalles de una zona.

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/zones/507f1f77bcf86cd799439015
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439015",
  "agencyId": "507f1f77bcf86cd799439011",
  "name": "Andalucía",
  "provinces": ["SE", "MA", "CA", "CO"],
  "calculationMode": "pallet",
  "postalCodeExceptions": [
    { "from": "41001", "to": "41080", "zoneName": "Sevilla" }
  ]
}
```

---

## Comparación de Tarifas

### POST /rates/compare — Comparar tarifas

**Endpoint principal del motor de tarifas.** Compara disponibilidad y precios entre todas las agencias activas.

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/rates/compare \
  -H "Content-Type: application/json" \
  -d '{
    "destinationPostalCode": "08001",
    "province": "BCN",
    "items": [
      {
        "typeServices": "pallet",
        "weight": 300,
        "large": 120,
        "width": 80,
        "height": 150
      }
    ]
  }'
```

**Body (campos):**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `destinationPostalCode` | string | Sí | Código postal destino |
| `province` | string | Sí | Provincia/código de destino |
| `items` | array | Sí | Array no vacío de artículos a enviar |
| `items[].typeServices` | string | Sí | `pallet` o `parcel` |
| `items[].weight` | number | Sí | Peso en kg (> 0) |
| `items[].large` | number | Sí | Largo en cm (> 0) |
| `items[].width` | number | Sí | Ancho en cm (> 0) |
| `items[].height` | number | Sí | Alto en cm (> 0) |

**Validaciones:**
- `destinationPostalCode` y `province` deben ser strings
- `items` debe ser un array no vacío
- Cada item debe tener `typeServices`, `weight`, `large`, `width`, `height` como números positivos

**Response (200 OK):**
```json
[
  {
    "agency": "Dachser",
    "available": true,
    "zone": "Nacional",
    "services": [
      {
        "service": "economy",
        "total": 140.50,
        "breakdown": [
          {
            "type": "weight_volume",
            "totalWeight": 300,
            "price": 140.50
          }
        ]
      }
    ]
  },
  {
    "agency": "Cayco",
    "available": false,
    "reason": "ZONE_NOT_FOUND"
  }
]
```

---

## Respuestas de Error

### 400 — Bad Request
```json
{
  "message": "The request does not comply with the schema"
}
```

### 404 — Not Found
```json
{
  "message": "Resource not found"
}
```

### 409 — Conflict (Duplicado)
```json
{
  "message": "Resource duplicate"
}
```

### 500 — Internal Server Error
```json
{
  "message": "Error internal server"
}
```

---

## Notas

- **Base URL:** `http://localhost:3000/api/v1`
- **Content-Type:** `application/json` para todas las solicitudes
- **Timestamps:** Todos los recursos incluyen `createdAt` y `updatedAt`
- **IDs:** Los IDs son ObjectIds de MongoDB (strings en formato hexadecimal)

---

Documento generado basado en el esquema OpenAPI. Para más detalles, consulta [openapi.yaml](./openapi.yaml) o [openapi.json](./openapi.json).
