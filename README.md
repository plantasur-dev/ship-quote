# Ship Quote API 🚀

API de comparación de tarifas de envío basada en normalización de datos y motor de cálculo inteligente.

## 📋 Descripción

**Ship Quote** es un servicio backend que calcula y compara tarifas de envío de múltiples agencias logísticas. El sistema normaliza datos de entrada, clasifica paquetes/pallets y aplica reglas de tarificación específicas por agencia.

### Concepto Central: Normalización ✨

El sistema normaliza todos los envíos a un formato estándar antes de calcular tarifas:

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

---

## 🏗️ Estructura del Proyecto

```
api/
├── app.js                      # Configuración principal
├── package.json                # Dependencias
├── bin/                        # Scripts de inicialización
│   ├── seed.js                 # Seed general
│   ├── caycoPalletTypes.js     # Tipos de pallets Cayco
│   ├── caycoRates.v2.seed.js   # Tarifas Cayco v2
│   └── caycoZones.seed.js      # Zonas Cayco
├── config/
│   ├── db.config.js            # Configuración base de datos
│   └── routes.config.js        # Rutas principales
├── controllers/                # Lógica de endpoints
│   ├── agency.controller.js
│   ├── rates.controller.js
├── middlewares/
│   └── errors.middleware.js    # Manejo de errores
├── models/                     # Esquemas MongoDB
│   ├── agency.model.js
│   ├── palletType.model.js
│   ├── rate.model.js
│   └── zone.model.js
├── services/                   # Lógica de negocio
│   ├── rateEngine.service.js   # Motor de cálculo v1
│   └── rateEnginev2.service.js # Motor de cálculo v2
└── web/                        # Cliente frontend
```

---

## 📦 Modelos de Datos

### Agency (Agencia)

```json
{
  "name": "String",
  "code": "String",
  "type": {
    "type": "String",
    "enum": ["static", "api"],
    "default": "static"
  },
  "rules": {
    "hasAndaluciaRule": "Boolean",
    "supportsPallets": "Boolean",
    "supportsParcels": "Boolean"
  }
}
```

**Tipo `api`:** Integración futura con APIs externas de agencias.

---

### Zone (Zona)

```json
{
  "agencyId": "ObjectId",
  "name": "String",                    // "Nacional", "Andalucía"
  "provinces": ["String"],
  "calculationMode": {
    "type": "String",
    "enum": ["pallet", "weight_volume"]
  },
  "postalCodeExceptions": [...]
}
```

**Modos de cálculo:**
- `pallet`: Por tipo de pallet y cantidad
- `weight_volume`: Por peso/volumen total (ej: Andalucía)

---

### PalletType (Tipo de Pallet)

```json
{
  "agencyId": "ObjectId",
  "name": "String",                    // "Europeo", "Americano"
  "constraints": {
    "maxWeight": "Number",
    "maxHeight": "Number",
    "maxLength": "Number",
    "maxWidth": "Number"
  }
}
```

Cada agencia clasifica pallets de forma distinta → modelos desacoplados por agencia.

---

### Rate (Tarifa)

```json
{
  "agencyId": "ObjectId",
  "type": {
    "type": "String",
    "enum": ["pallet", "parcel"]
  },
  "zoneName": "String",
  "palletTypeId": "ObjectId",          // null si es paquete
  "priceBreaks": [
    {
      "min": "Number",
      "max": "Number",
      "price": "Number"
    }
  ]
}
```

**priceBreaks:** Interpretación según zona
- **Pallets (Nacional):** `min`/`max` = cantidad de pallets
- **Andalucía:** `min`/`max` = peso (kg) o volumen (dm³)

---

## ⚙️ Motor de Cálculo (rateEngine.service.js)

### Flujo Principal

```
1. Normalizar envío
   ├─ Separar items (pallets vs parcels)
   └─ Extraer datos estándar

2. Para cada agencia:
   ├─ Resolver zona destino
   ├─ Clasificar pallet(s) por tipo
   ├─ Buscar tarifa aplicable
   └─ Calcular precio

3. Devolver comparativa ordenada
```

---

### 1️⃣ Resolver Zona

```js
function resolveZone(agency, postalCode) {
  // 1. Comprobar excepciones postal
  // 2. Fallback a provincia
  // 3. Retornar zona o null
}
```

---

### 2️⃣ Clasificar Pallet

```js
function classifyPallet(item, palletTypes) {
  return palletTypes.find(type => {
    return (
      item.weight <= type.constraints.maxWeight &&
      item.height <= type.constraints.maxHeight
    );
  });
}
```

---

### 3️⃣ Agrupar Pallets por Tipo

```js
function groupPallets(items, palletTypes) {
  const groups = {};

  items.forEach(item => {
    const type = classifyPallet(item, palletTypes);
    if (!type) return;

    if (!groups[type._id]) {
      groups[type._id] = {
        palletType: type,
        quantity: 0
      };
    }

    groups[type._id].quantity += 1;
  });

  return Object.values(groups);
}
```

---

### 4️⃣ Calcular Precios

**Para Pallets (NACIONAL)**

```js
function calculatePalletGroupRate(rate, quantity) {
  const match = rate.priceBreaks.find(b =>
    quantity >= b.min && quantity <= b.max
  );

  return match ? match.price : null;
}
```

**Para Andalucía (PESO/VOLUMEN)**

```js
function calculateWeightVolume(items) {
  let totalWeight = 0;
  let totalVolume = 0;

  items.forEach(i => {
    totalWeight += i.weight;
    totalVolume += (i.length * i.width * i.height) / 1000000;
  });

  return Math.max(totalWeight, totalVolume);
}
```

---

## 🚀 Endpoint Principal

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

### Motor adaptable

```js
if (agency.type === "api") {
  return callExternalAPI(agency.apiEndpoint, shipment);
} else {
  return calculateLocal(agency, shipment);
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