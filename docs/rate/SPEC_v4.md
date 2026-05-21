# 📦 Shipping Pricing App – Backend Spec (v5)

---

# 🧱 1. Arquitectura Backend (Express estándar)

## 📁 Estructura de carpetas

```bash
src/
├── config/
│   ├── db.js
│   ├── routes.js
│
├── middleware/
│   ├── error.middleware.js
│   ├── auth.middleware.js
│
├── modules/
│
│   ├── carriers/
│   │   ├── carrier.model.js
│   │   ├── carrier.controller.js
│   │   ├── carrier.routes.js
│
│   ├── tariffs/
│   │   ├── tariff.model.js
│   │   ├── tariff.controller.js
│   │   ├── tariff.importer.js
│   │   ├── tariff.routes.js
│
│   ├── quotes/
│   │   ├── quote.controller.js
│   │   ├── quote.routes.js
│
│   ├── pricing/
│   │   ├── pricing.service.js
│   │   ├── strategyFactory.js
│   │   │
│   │   ├── strategies/
│   │   │   ├── cayco.strategy.js
│   │   │   ├── tecum.strategy.js
│   │   │   ├── api.strategy.js
│   │   │
│   │   ├── dataResolvers/
│   │   │   ├── db.resolver.js
│   │   │   ├── api.resolver.js
│
├── adapters/
│   ├── adapterFactory.js
│   ├── mrw.adapter.js
│   ├── correos.adapter.js
│
├── utils/
│   ├── csvParser.js
│   ├── helpers.js
│
├── app.js
├── server.js
```

---

# ⚙️ 2. Configuración

## config/db.js

```js
import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};
```

---

## config/routes.js

```js
import express from "express";

import carrierRoutes from "../modules/carriers/carrier.routes.js";
import tariffRoutes from "../modules/tariffs/tariff.routes.js";
import quoteRoutes from "../modules/quotes/quote.routes.js";

const router = express.Router();

router.use("/carriers", carrierRoutes);
router.use("/tariffs", tariffRoutes);
router.use("/quotes", quoteRoutes);

export default router;
```

---

# 🔄 3. Flujo de Cotización

```text
Frontend → POST /api/quotes
        → quote.controller
        → pricing.service
        → strategy (según carrier)
        → dataResolver (DB o API)
        → cálculo
        → respuesta unificada
```

---

# 📦 4. Modelos MongoDB

---

## Carrier

```js
{
  name: String,

  type: "api" | "manual" | "hybrid",

  dataSource: "database" | "api" | "hybrid",

  pricingStrategy: "cayco" | "tecum" | "api",

  config: {
    volumetricFactor: Number,
    hasVolumetricWeight: Boolean
  },

  active: Boolean
}
```

---

## Tariff

```js
{
  carrierId: ObjectId,

  strategy: String,

  rawData: {
    rows: []
  },

  meta: {
    importedAt: Date,
    fileName: String
  }
}
```

---

## (Opcional futuro) Quote

```js
{
  shipment,
  results,
  selectedOption,
  createdAt
}
```

---

# 🧠 5. Motor de Pricing

---

## pricing.service.js

```js
export const getQuote = async (shipment) => {
  const carriers = await Carrier.find({ active: true });

  const results = [];

  for (const carrier of carriers) {
    const strategy = getStrategy(carrier.pricingStrategy);

    const result = await strategy.calculate({
      shipment,
      carrier
    });

    if (result) results.push(result);
  }

  return results.sort((a, b) => a.price - b.price);
};
```

---

## Strategy Pattern

Cada carrier tiene su lógica:

* cayco.strategy.js
* tecum.strategy.js
* api.strategy.js

---

# 🌐 6. API REST

---

## POST /api/quotes

```json
{
  "origin": { "country": "ES", "cp": "15001" },
  "destination": { "country": "ES", "cp": "28001" },
  "packages": [
    {
      "weight": 100,
      "length": 120,
      "width": 80,
      "height": 100
    }
  ],
  "type": "pallet"
}
```

---

## Response

```json
[
  {
    "carrier": "CAYCO",
    "price": 44.51,
    "source": "database"
  }
]
```

---

## Carriers

* GET /api/carriers
* POST /api/carriers
* PUT /api/carriers/:id

---

## Tarifas

* POST /api/tariffs/import
* GET /api/tariffs

---

# 🧩 7. Casos de Negocio

---

## Paletería

* Matching por dimensiones
* Selección mejor pallet
* Precio directo

---

## Paquetería

* Peso vs volumétrico
* Reglas por carrier

---

## Internacional

* Por país + CP
* Sin zonas en algunos casos

---

## Dropshipping

```js
if (shipment.isDropshipping) {
  price += FIXED_FEE;
}
```

---

# 🛠 8. Panel Admin (MVP)

---

## Funcionalidades

* CRUD carriers
* Importación tarifas CSV/Excel
* Listado tarifas
* Activar/desactivar carriers

---

## Flujo

```text
Admin sube Excel → backend parsea → guarda en Mongo → listo para cotizar
```

---

# 🚀 9. Roadmap Detallado

---

## 🟢 Fase 1 – Base Backend

### 1.1 Setup

* Express
* Mongo
* Estructura carpetas

### 1.2 Modelos

* Carrier
* Tariff

### 1.3 API básica

* /carriers
* /tariffs

---

## 🟡 Fase 2 – Importador

### 2.1 Parser CSV/Excel

* Cayco
* Tecum

### 2.2 Guardado en BD

### 2.3 Validación datos

---

## 🟠 Fase 3 – Motor de Pricing

### 3.1 Strategy pattern

### 3.2 CAYCO strategy

* matching dimensiones
* selección óptima

### 3.3 TECUM strategy

* peso / volumen

---

## 🔵 Fase 4 – API Cotización

### 4.1 Endpoint /quotes

### 4.2 Respuesta unificada

### 4.3 Ordenación resultados

---

## 🟣 Fase 5 – Mejora Motor

### 5.1 Multi-bulto

### 5.2 Peso volumétrico real

### 5.3 Reglas avanzadas

---

## ⚫ Fase 6 – Integración APIs

### 6.1 Adapter pattern

### 6.2 MRW / Correos

---

## ⚪ Fase 7 – Optimización

### 7.1 Caché (Redis)

### 7.2 Logs

### 7.3 Histórico

---

# 🔥 10. Conclusión

Este backend queda preparado para:

✅ Tarifas complejas (Excel reales)
✅ Múltiples transportistas
✅ Migración futura a APIs
✅ Escalabilidad sin rehacer código

---

# 👉 Siguiente paso recomendado

Implementar:

👉 **CAYCO strategy PRO + parser real**

Porque eso te desbloquea todo el sistema.

---
