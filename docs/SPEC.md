## 🏗️ ARQUITECTURA BACKEND

```
/src
  /modules
    /agencies
    /rates
    /zones
    /shipments
    /calculations
  /services
    rateEngine.service.js
    agencyResolver.service.js
  /models
  /controllers
  /routes
```

---

## 🎯 CONCEPTO CENTRAL: “NORMALIZACIÓN”

Antes de calcular tarifas:

👉 Convertimos el input del usuario a un formato estándar:

```json
{
  "originPostalCode": "27001",
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

## 🧩 MODELOS DE DATOS

### Agency

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

---

### Zones (por agencia)

```json
{
  "agencyId": "ObjectId",

  "name": "String", // "Nacional", "Andalucia"

  "provinces": ["String"],

  "calculationMode": {
    "type": "String",
    "enum": ["pallet", "weight_volume"]
  },

  "postalCodeExceptions": [...]
}
```

---

### PalletTypes (por agencia)

Cada agencia clasifica distinto → desacoplamos:

```json
{
  "agencyId": "ObjectId",

  "name": "Europeo",

  "constraints": {
    "maxWeight": 1000,
    "maxHeight": 200,
    "maxLength": 120,
    "maxWidth": 80
  }
}
```

---

### Rate

#### Caso general (por pallet + zona)

```json
{
  "agencyId": "ObjectId",

  "type": {
    "type": "String",
    "enum": ["pallet", "parcel"]
  },

  "zoneName": "String",

  "palletTypeId": "ObjectId", // null si es parcel

  "priceBreaks": [
    {
      "min": "Number",
      "max": "Number",
      "price": "Number"
    }
  ]
}
```

---

#### Caso especial (tipo CAYCO)

Tarifa depende de:

* Tipo pallet específico
* Zona
* Nº pallets (1–7)
* Precio distinto por cantidad

👉 **El modelo anterior ya lo cubre** 💡

```json
"prices": [
  { "quantity": 1, "price": 50 },
  { "quantity": 2, "price": 90 },
  { "quantity": 3, "price": 120 }
]
```
---
## INTERPRETACIÓN DE priceBreaks

** Para pallets **

```json

{ "min": 1, "max": 1, "price": 50 }
{ "min": 2, "max": 3, "price": 90 }

```

** Para Andalucía (peso/volumen): **

```json

{ "min": 0, "max": 100, "price": 30 }
{ "min": 101, "max": 300, "price": 70 }

```
---

## ⚙️ MOTOR DE CÁLCULO (CORE)

**Archivo:** `rateEngine.service.js`

### Flujo:

1. Normalizar envío
    * Separar items:
        - pallets
        - parcels
2. Para cada agencia:
    * Resolver zona destino
    * Clasificar pallet(s)
        - Según zona.calculationMode:
            A) pallet
            B) weight_volume

    * Buscar tarifa
    * Calcular precio
3. Devolver comparativa

---

### 1️⃣ Resolver zona

```js
function resolveZone(agency, postalCode) {
  // 1. comprobar excepciones
  // 2. fallback a provincia
}
```

---

### 2️⃣ Clasificar pallet

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

### IMPLEMENTACIÓN CLAVE
📦 Agrupar pallets por tipo

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

### 3️⃣ Calcular precio

**Calcular pallets (NACIONAL)**

```js

function calculatePalletGroupRate(rate, quantity) {
  const match = rate.priceBreaks.find(b =>
    quantity >= b.min && quantity <= b.max
  );

  return match ? match.price : null;
}

```

**Calcular Andalucía (peso/volumen)**

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

**Aplicar tarifa Andalucía**

```js

function calculateAndaluciaRate(rate, value) {
  const match = rate.priceBreaks.find(b =>
    value >= b.min && value <= b.max
  );

  return match ? match.price : null;
}

```

```js
function calculateRate({ rates, quantity }) {
  const match = rates.prices.find(p => p.quantity === quantity);

  if (!match) return null;

  return match.price;
}
```

**Respuesta final del endpoint**

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
    "agency": "Otra",
    "available": false,
    "reason": "No hay tarifa disponible"
  }
]

```

### OPTIMIZACIÓN REAL (IMPORTANTE)

**1. Evitar N consultas por agencia**

**Cargar todo de golpe:**

```js
const rates = await Rate.find({
    agencyId: { $in: agencyIds }
});

```

**Indexes**
```js
    { agencyId: 1, type: 1, zoneName: 1 }

```

---

## 🚀 ENDPOINT PRINCIPAL

### `POST /rates/compare`

### Input

```json
    {
    "destinationPostalCode": "08001",
    "items": [...]
    }
```

---

### Output

```json
[
  {
    "agency": "Cayco",
    "price": 120,
    "zone": "Zona 1",
    "details": {
      "palletType": "Europeo",
      "quantity": 3
    }
  },
  {
    "agency": "Otra",
    "price": 135
  }
]
```

---

## ⚡ OPTIMIZACIÓN (IMPORTANTE)

### En Rates:

```js
{ agencyId: 1, palletTypeId: 1, zoneName: 1 }
```

### En Zones:

```js
{ agencyId: 1, provinces: 1 }
```

---

## 🔌 PREPARADO PARA FUTURAS APIs

```js
agency.type = "api" | "static";
```

En el motor:

```js
if (agency.type === "api") {
  return callExternalAPI(...);
} else {
  return calculateLocal(...);
}
```
