# Documentación de la API de Ship Quote

Este documento describe la API REST del servicio `Ship Quote`, su estructura, endpoints, modelos de datos y la lógica de negocio que maneja la comparación de tarifas.

## 1. ¿Qué es esta API?

`Ship Quote` es un backend que permite:

- Registrar agencias logísticas y su configuración de tarifas.
- Crear zonas de cálculo para cada agencia.
- Definir tipos de pallet asociados a cada agencia.
- Comparar tarifas de envío entre agencias activas.
- Integrar proveedores externos mediante adaptadores de API.

La implementación actual está construida con:

- `Node.js` + `Express 5`
- `MongoDB` con `mongoose`
- `fetch` nativo para llamadas a proveedores externos

## 2. Estructura principal

La API se organiza en varios componentes:

- `app.js`: entrada principal del servidor.
- `src/api/index.js`: router principal de la API.
- `src/api/controllers/`: controladores de cada recurso.
- `src/api/middlewares/`: validación y manejo de errores.
- `src/api/services/`: lógica de negocio y motor de tarifas.
- `src/lib/models/`: esquemas de MongoDB.
- `src/lib/configs/`: configuración de base de datos y arranque.

## 3. Arranque del servidor

Al iniciar la aplicación, `app.js` hace lo siguiente:

- Configura `morgan` para registro de peticiones.
- Activa `express.json()` para parsear JSON.
- Monta el router principal bajo `/api/v1`.
- Lanza el servidor en el puerto `PORT` o `3000`.

El inicio de la base de datos se realiza en `src/lib/configs/server.config.js`:

- `connectDB()` conecta con MongoDB.
- `initLocations()` carga las provincias de España si no existe la colección `locations`.

## 4. Enrutado disponible

Todos los endpoints se exponen con prefijo:

```
/api/v1
```

### 4.1 `/api/v1/agencies`

- `POST /api/v1/agencies`
  - Crea una agencia.
  - Controlador: `src/api/controllers/agencies.controller.js`
  - Valida que exista body en la petición.

- `GET /api/v1/agencies`
  - Lista todas las agencias.

- `PATCH /api/v1/agencies/:agencyId`
  - Alterna el estado `active` de la agencia.

### 4.2 `/api/v1/locations`

- `POST /api/v1/locations`
  - Crea una nueva ubicación/provincia.

- `GET /api/v1/locations`
  - Obtiene todas las ubicaciones.

- `GET /api/v1/locations/:locationId`
  - Obtiene los detalles de una ubicación.

### 4.3 `/api/v1/pallets`

- `POST /api/v1/pallets`
  - Crea un tipo de pallet.

- `GET /api/v1/pallets`
  - Lista todos los tipos de pallet.

- `GET /api/v1/pallets/:palletTypeId`
  - Detalle de un tipo de pallet.

- `DELETE /api/v1/pallets/:palletTypeId`
  - Elimina un tipo de pallet.

### 4.4 `/api/v1/zones`

- `POST /api/v1/zones`
  - Crea una zona de cálculo.

- `GET /api/v1/zones`
  - Lista todas las zonas.

- `GET /api/v1/zones/:zoneId`
  - Obtiene una zona por id.

### 4.5 `/api/v1/rates/compare`

- `POST /api/v1/rates/compare`
  - Compara tarifas de todas las agencias activas.
  - Controlador: `src/api/controllers/rates.controller.js`
  - Valida que `destinationPostalCode`, `province` y `items` estén presentes.

## 5. Modelos y esquemas de datos

### 5.1 Agency

Definición en: `src/lib/models/agency.model.js`

Campos principales:

- `name`: nombre legible.
- `code`: código generado desde el nombre, normalizado.
- `type`: `static` o `api`.
- `active`: estado de la agencia.
- `rules`: reglas de negocio específicas.
- `apiConfig`: configuración para agencias de tipo `api`.

### 5.2 Location

Definición en: `src/lib/models/location.model.js`

Campos principales:

- `country_code`
- `country_name`
- `admin_code`
- `admin_full_code`
- `name`
- `normalized_name`
- `type`

### 5.3 PalletType

Definición en: `src/lib/models/palletType.model.js`

Campos principales:

- `agencyId`: referencia a `Agency`.
- `name`: descripción.
- `constraints`: máximos de peso y dimensiones.

### 5.4 Zone

Definición en: `src/lib/models/zone.model.js`

Campos principales:

- `agencyId`: referencia a `Agency`.
- `name`: nombre de la zona.
- `provinces`: lista de provincias aplicables.
- `calculationMode`: `pallet` o `weight_volume`.
- `postalCodeExceptions`: excepciones por rango postal.

### 5.5 Rate

Definición en: `src/lib/models/rate.model.js`

Campos principales:

- `agencyId`: referencia a `Agency`.
- `type`: `pallet` o `parcel`.
- `zoneName`: zona asignada.
- `palletTypeId`: referencia para tarifas de pallet.
- `services`: lista de servicios y sus tramos de precio.

## 6. Lógica de cálculo de tarifas

El corazón del sistema está en `src/api/services/rateEnginev3.service.js`.

### 6.1 Flujo general

1. Cargar agencias activas.
2. Separar agencias `static` y `api`.
3. Calcular tarifas estáticas para agencias `static`.
4. Obtener tarifas de proveedores externos para agencias `api`.
5. Combinar resultados y devolverlos.

### 6.2 Tarifas estáticas

Implementado en: `src/api/services/compareRates/staticRates.service.js`

Pasos clave:

- Carga en bulk de `zones`, `rates` y `palletTypes` para todas las agencias.
- Agrupación por `agencyId`.
- Resolución de la zona con `resolveZone()`.
- Dependiendo de `calculationMode`:
  - `weight_volume`: calcula peso/volumen total.
  - `pallet`: agrupa pallets por tipo y busca tarifas por cantidad.

### 6.3 Tarifas con proveedores externos

Implementado en: `src/api/services/compareRates/apiRates.service.js`

- Cada agencia `api` obtiene un adaptador mediante `carrierFactory()`.
- Si no existe adaptador para la agencia, devuelve `available: false`.
- El adaptador llama al servicio externo y mapea la respuesta.

### 6.4 Adaptador de carrier

- Clase base: `src/api/services/carriers/carriers.service.interface.js`
- Adaptador concreto: `src/api/services/carriers/externalCarriers/dascher.service.js`

Funciones importantes:

- `buildRequestBody(input)` → payload para el proveedor.
- `buildRequestHeaders(apiKey)` → headers HTTP.
- `mapResponse(data)` → normaliza la respuesta al formato interno.

## 7. Validación y manejo de errores

### 7.1 `schemaValidation.middleware.js`

Valida que las peticiones `POST`, `PATCH` o `PUT` lleven cuerpo JSON.

### 7.2 `errors.middleware.js`

Transforma errores en respuestas JSON con códigos:

- `400`: validación o body inexistente.
- `404`: recurso o ruta no encontrada.
- `409`: duplicado de recurso.
- `500`: error interno del servidor.

## 8. Ejemplos de uso

### Crear agencia

```bash
curl -X POST http://localhost:3000/api/v1/agencies \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Dachser",
    "type": "api",
    "rules": {"supportsPallets": true, "supportsParcels": false},
    "apiConfig": {
      "baseUrlApi": "https://api.example.com",
      "endpoints": {"quotations": "quotations"},
      "apiKey": "abcdef123456"
    }
  }'
```

### Comparar tarifas

```bash
curl -X POST http://localhost:3000/api/v1/rates/compare \
  -H 'Content-Type: application/json' \
  -d '{
    "destinationPostalCode": "08001",
    "province": "BCN",
    "items": [
      {"type": "pallet", "length": 120, "width": 80, "height": 150, "weight": 300}
    ]
  }'
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
          {"type": "weight_volume", "totalWeight": 300, "price": 140}
        ]
      }
    ]
  }
]
```

## 9. Archivos clave

- `app.js`
- `src/api/index.js`
- `src/api/controllers/*.js`
- `src/api/middlewares/*.js`
- `src/api/services/rateEnginev3.service.js`
- `src/api/services/compareRates/*.js`
- `src/api/services/carriers/*.js`
- `src/lib/models/*.js`
- `src/lib/configs/*.js`

## 10. Notas adicionales

- La colección `locations` se carga automáticamente al iniciar si no existe.
- Todos los resources usan `MongoDB` y `mongoose`.
- El motor actual diferencia entre tarifas estáticas y tarifas de proveedores externos.
- Si quieres añadir un nuevo proveedor API, agrega un adaptador en `src/api/services/carriers/` y registra su código en `carrierMap`.
