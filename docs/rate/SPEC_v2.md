# 📦 Shipping Pricing App – Especificación Técnica v2

## 🧱 1. Arquitectura General

### Stack

* Frontend: React + Vite
* Backend: Node.js + Express
* Base de datos: MongoDB (Mongoose)

### Estructura Backend

```
src/
├── modules/
│   ├── carriers/
│   │   ├── carrier.model.js
│   │   ├── carrier.controller.js
│   │   ├── carrier.routes.js
│   │
│   ├── tariffs/
│   │   ├── tariff.model.js
│   │   ├── tariff.controller.js
│   │   ├── tariff.routes.js
│   │
│   ├── zones/
│   │   ├── zone.model.js
│   │   ├── zone.controller.js
│   │   ├── zone.routes.js
│   │
│   ├── quotes/
│   │   ├── quote.controller.js
│   │   ├── quote.routes.js
│   │
│   ├── pricing/
│   │   ├── pricing.service.js
│   │   ├── volumetric.service.js
│   │   ├── zone.service.js
│   │
├── adapters/
│   ├── mrw.adapter.js
│   ├── correos.adapter.js
│
├── utils/
├── app.js
```

---

## 🔄 2. Flujo de Cotización

### Modo A: Mejor opción

1. Input usuario
2. Normalización
3. Cálculo de peso (real vs volumétrico)
4. Resolución de zona
5. Consulta:

   * APIs
   * Tarifas internas
6. Unificación resultados
7. Orden por precio

### Modo B: Por transportista

* Filtrado previo por carrier

---

## 📦 3. Modelos (MongoDB)

---

### 3.1 Carrier

```js
{
  name: String,
  type: "api" | "manual" | "hybrid",

  config: {
    volumetricFactor: Number,
    hasVolumetricWeight: Boolean,
    maxDimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },

  active: Boolean
}
```

---

### 3.2 Tariff (adaptado a CSV tipo Cayco)

```js
{
  carrierId: ObjectId,

  scope: "national" | "international",
  serviceType: "parcel" | "pallet",

  rows: [
    {
      zone: String,

      destination: {
        province: String,
        country: String,
        cp: String
      },

      pallet: {
        type: String, // MINI, MEDIO, EURO, etc.
        length: Number,
        width: Number,
        height: Number
      },

      weight: Number,
      volumetricWeight: Number,

      price: Number,

      serviceName: String
    }
  ]
}
```

📌 Nota: Este modelo permite almacenar directamente datos del CSV sin perder información.

---

### 3.3 Zone

```js
{
  carrierId: ObjectId,

  name: "ZONA 1",

  mapping: [
    {
      country: "ES",
      cpRanges: [
        { from: "15000", to: "15999" }
      ]
    }
  ]
}
```

---

### 3.4 Shipment (input)

```js
{
  origin: {
    country: String,
    cp: String
  },

  destination: {
    country: String,
    cp: String
  },

  packages: [
    {
      weight: Number,
      length: Number,
      width: Number,
      height: Number
    }
  ],

  type: "parcel" | "pallet",

  palletType: String,

  isDropshipping: Boolean
}
```

---

## ⚙️ 4. Motor de Pricing

Ubicación:

```
modules/pricing/
```

---

### 4.1 Flujo interno

```
normalize → calculateWeight → resolveZone → getRates → applyRules → returnResults
```

---

### 4.2 Peso final

```js
pesoFinal = Math.max(pesoReal, pesoVolumetrico)
```

---

### 4.3 Peso volumétrico

```js
volumetricWeight = (largo * ancho * alto) / factor
```

---

### 4.4 Resolución de zona

```js
getZone(destinationCP, carrierId)
```

---

### 4.5 Cálculo con tarifas CSV

Para Cayco y similares:

```js
1. Filtrar por zona
2. Filtrar por tipo de pallet
3. Filtrar por dimensiones compatibles
4. Buscar coincidencia más cercana en peso
```

---

### 4.6 Selección de tarifa

```js
const match = rows.find(row =>
  row.zone === zone &&
  row.pallet.type === shipment.palletType
)
```

---

### 4.7 Recargos

```js
if (isDropshipping) {
  price += FIXED_SURCHARGE
}
```

---

## 🔌 5. Adaptadores de Transportistas

Estructura:

```js
class CarrierAdapter {
  async getQuote(shipment) {}
}
```

Ejemplo:

```js
class MRWAdapter extends CarrierAdapter {
  async getQuote(shipment) {
    // llamada API
  }
}
```

---

## 🌐 6. API REST

---

### 6.1 Cotización

#### POST `/api/quotes`

```json
{
  "origin": {...},
  "destination": {...},
  "packages": [...],
  "type": "pallet"
}
```

---

### 6.2 Filtrar por carrier

```
POST /api/quotes?carrier=mrw
```

---

### 6.3 Carriers

```
GET /api/carriers
POST /api/carriers
PUT /api/carriers/:id
DELETE /api/carriers/:id
```

---

### 6.4 Tarifas

```
GET /api/tariffs
POST /api/tariffs
POST /api/tariffs/import-csv
```

---

### 6.5 Zonas

```
GET /api/zones
POST /api/zones
```

---

## 📊 7. Importador CSV (clave)

Ubicación:

```
modules/tariffs/tariff.importer.js
```

---

### Flujo

1. Subida CSV
2. Parseo
3. Transformación → JSON
4. Guardado en Mongo

---

### Ejemplo transformación

CSV:

```
Madrid,ZONA 1,120,80,80,...,44.51€
```

→

```js
{
  zone: "ZONA 1",
  destination: { province: "Madrid" },
  pallet: {
    length: 120,
    width: 80,
    height: 80
  },
  price: 44.51
}
```

---

## 🧠 8. Casos de Negocio

---

### Paletería

* Basado en tipo de pallet
* Dimensiones fijas
* No siempre volumétrico

---

### Paquetería

* Peso o volumétrico según carrier
* Reglas especiales (MRW dimensiones)

---

### Internacional

* Por país + CP
* Puede no usar zonas

---

## 🛠 9. Panel Admin (MVP)

* Gestión de carriers
* Subida de tarifas CSV
* Gestión de zonas
* Configuración básica

---

## 🚀 10. Roadmap

### Fase 1

* Motor de tarifas manuales
* API básica
* Importador CSV

### Fase 2

* Integración APIs transportistas

### Fase 3

* Panel admin completo

### Fase 4

* Caché
* Histórico
* Optimización

---

## ⚠️ 11. Decisiones clave

* Motor desacoplado ✅
* Soporte CSV real ✅
* Multi-bulto desde inicio ✅
* Sistema híbrido API + tarifa ✅

---

## 🔮 Futuro

* Integración con ERP
* Generación de envíos
* Etiquetas
* Tracking
* Cache Redis

---
