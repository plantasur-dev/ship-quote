# 📦 Ship Quote — Plataforma de Comparación de Tarifas de Envíos

> Sistema integral para cotizar y comparar tarifas de envío con múltiples proveedores (agencias). Combina datos estáticos almacenados con consultas a APIs externas en tiempo real.

---

## 🚀 Quick Start

```bash
# API (Backend)
cd api
npm install
cp .env.example .env  # Configura tus variables
npm run dev           # http://localhost:3000

# Web (Frontend)
cd web
npm install
npm run dev           # http://localhost:5173
```

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Guía de Instalación](#-guía-de-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [API - Endpoints y Ejemplos](#-api---endpoints-y-ejemplos)
- [Motor de Tarifas](#-motor-de-tarifas)
- [Modelos de Datos](#-modelos-de-datos)
- [Docker](#-docker)
- [Centro de Documentación](#-centro-de-documentación)

---

## ✨ Características Principales

### 🎯 Motor de Comparación Inteligente

- **Dual Provider**: Consume tarifas tanto de bases de datos estáticas como de APIs externas
- **Scope Dinámico**: Distingue automáticamente entre tarifas nacionales e internacionales
- **Validación Rigurosa**: Valida peso, dimensiones y características del envío
- **Manejo de Errores**: Captura y reporta errores de APIs externas sin afectar otros proveedores

### 🏢 Gestión de Agencias

- **Tipos Flexibles**: Static (BD), API (externas) o Hybrid (ambas)
- **Configuración por Agencia**: Reglas de cobertura, suplementos y restricciones personalizadas
- **Control de Actividad**: Activar/desactivar agencias sin eliminarlas

### 📍 Gestión de Ubicaciones

- **Base de Datos Geográfica**: Países y provincias almacenadas
- **Búsqueda por Código Postal**: Asociación automática de códigos postales a provincias
- **Cobertura Nacional e Internacional**: Soporte para envíos domésticos y al extranjero

### 📦 Tipos de Envío

- **Pallets**: Envíos de carga con restricciones de peso y dimensiones
- **Parcelas**: Paquetes estándar con validaciones básicas
- **Recargos Dinámicos**: Suplementos por exceso de peso, dimensiones especiales, etc.
- **Observabilidad Integrada**: Logging adaptado para enviar peticiones a Loki/Promtail y visualizar tráfico en Grafana

---

## 🏗️ Arquitectura del Proyecto

```
ship-quote/
├── api/                          # Backend Node.js + Express
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/      # Lógica de negocio por endpoint
│   │   │   ├── middlewares/      # Validaciones y manejo de errores
│   │   │   ├── services/         # Motor de tarifas y servicios
|   |   |   ├── docs/             # Documentación OpenAPI
│   │   │   │   ├── rates.service.js         # Orquestador principal
│   │   │   │   ├── rates/
│   │   │   │   │   ├── domains/            # Lógica de construcción de resultados
│   │   │   │   │   ├── presenters/         # Formateo de respuestas
│   │   │   │   │   └── providers/          # Static y API providers
│   │   │   │   ├── agencies.service.js
│   │   │   │   ├── countries.service.js
│   │   │   │   ├── provinces.service.js
│   │   │   │   └── cache.service.js        # Caché de datos
│   │   │   └── index.js              # Definición de rutas
│   │   └── lib/
│   │       ├── models/             # Esquemas Mongoose
│   │       ├── constants/           # Constantes globales
│   │       │   └── scope.const.js          # Tipos y etiquetas de scope
│   │       ├── utils/               # Utilidades reutilizables
│   │       ├── configs/             # Configuración de BD y servidor
│   │       ├── data/                # Datos de bootstrap
│   │       └── logger/              # Logging (Winston + Morgan)
│   ├── app.js                    # Punto de entrada
│   └── package.json
├── web/                          # Frontend React + Vite
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   ├── pages/                # Páginas principales
│   │   ├── hooks/                # Custom hooks
│   │   ├── services/             # Llamadas a API
│   │   └── assets/               # Recursos estáticos
│   └── package.json
├── docs/                         # Documentación técnica
│   ├── API-ENDPOINTS.md
│   ├── DOCUMENTATION.md
│   ├── SPEC.md
│   └── rate/                     # Especificaciones de cálculo de tarifas
├── infra/                        # Configuración de infraestructura
│   └── monitoring/               # Loki + Promtail + Grafana
├── docker-compose.yml            # Configuración de entorno completo para API, web, DB y observabilidad
└── README.md                     # Este archivo
```

---

## 📦 Guía de Instalación

### Requisitos Previos

- **Node.js**: v18+ con npm/yarn
- **MongoDB**: Versión 4.4+ (local o remoto)
- **Docker** (opcional): Para ejecutar con containers

### Instalación Paso a Paso

#### 1️⃣ Clonar repositorio

```bash
git clone <repo-url>
cd ship-quote
```

#### 2️⃣ Configurar variables de entorno

**API (.env)**

```bash
cd api
cp .env.example .env
```

Edita `.env` con tus valores:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://127.0.0.1:27017/shipQuote-db
MONGODB_URI_TEST=mongodb://127.0.0.1:27017/shipQuote-test

# Configuración
DEFAULT_COUNTRY=ES
LOG_LEVEL=info

# APIs Externas (si aplica)
DACHSER_API_KEY=your_key_here
DHL_API_KEY=your_key_here
FEDEX_API_KEY=your_key_here
```

**Web (.env)**

```bash
cd web
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_TITLE=Ship Quote
```

#### 3️⃣ Instalar dependencias

```bash
# API
cd api
npm install

# Web
cd web
npm install
```

#### 4️⃣ Ejecutar aplicación

**Desarrollo**

```bash
# Terminal 1 - API
cd api && npm run dev

# Terminal 2 - Web
cd web && npm run dev
```

**Producción**

```bash
# API
npm start

# Web
npm run build && npm run preview
```

#### 5️⃣ Cargar datos iniciales (Bootstrap)

```bash
cd api
npm run seed
```

---

## 🔐 Variables de Entorno

### API

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `PORT` | number | 3000 | Puerto del servidor Express |
| `NODE_ENV` | string | development | Entorno (development/production) |
| `MONGODB_URI` | string | *(requerido)* | Cadena conexión MongoDB |
| `DEFAULT_COUNTRY` | string | ES | Código de país por defecto (ISO-2) |
| `LOG_LEVEL` | string | info | Nivel de logging (info/debug/error) |

### Web

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `VITE_API_URL` | string | http://localhost:3000/api/v1 | URL base de la API |
| `VITE_APP_TITLE` | string | Ship Quote | Nombre de la aplicación |

---

## 🔌 API - Endpoints y Ejemplos

Base URL: `http://localhost:3000/api/v1`

### 📌 Agencias

#### **POST** `/agencies` — Crear agencia

Crea una nueva agencia configurada para consumir tarifas.

**Request Body**

```json
{
  "name": "Dachser",
  "code": "dachser",
  "type": "api",
  "rules": {
    "hasAndaluciaRule": false,
    "supportsPallets": true,
    "supportsParcels": false,
    "coverage": ["national", "international"]
  },
  "apiConfig": {
    "baseUrlApi": "https://api.dachser.com",
    "timeout": 5000,
    "apiKey": "sk_live_xxxxx",
    "endpoints": {
      "quotations": "/v2/quotations",
      "transportOrders": "/v2/orders"
    }
  },
  "supplements": {
    "fuelSurcharge": {
      "enabled": true,
      "type": "percentage",
      "value": 5.5
    }
  }
}
```

**Response** `201 Created`

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Dachser",
  "code": "dachser",
  "type": "api",
  "active": true,
  "rules": { ... },
  "createdAt": "2026-06-18T10:30:00Z",
  "updatedAt": "2026-06-18T10:30:00Z"
}
```

---

#### **GET** `/agencies` — Listar agencias

Obtiene todas las agencias configuradas (activas e inactivas).

**Query Parameters**

| Parámetro | Tipo | Descripción |
|-----------|------|------------|
| `active` | boolean | Filtrar por estado (true/false) |

**Ejemplo**

```bash
curl -X GET "http://localhost:3000/api/v1/agencies?active=true"
```

**Response** `200 OK`

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dachser",
    "code": "dachser",
    "type": "api",
    "active": true,
    "rules": { ... }
  },
  { ... }
]
```

---

#### **PATCH** `/agencies/:agencyId` — Actualizar estado

Activa o desactiva una agencia (toggle).

**Request Body**

```json
{
  "active": false
}
```

**Response** `200 OK`

---

### 📍 Ubicaciones

#### **POST** `/locations` — Crear ubicación

Registra un país o provincia en la base de datos geográfica.

**Request Body**

```json
{
  "countryCode": "ES",
  "countryName": "España",
  "adminCode": "28",
  "adminFullCode": "ES-28",
  "name": "Madrid",
  "type": "province"
}
```

**Response** `201 Created`

---

#### **GET** `/locations/countries` — Listar países

Obtiene todos los países registrados sin duplicados. Sin query params obtienes los paises en idioma Español por defecto. 

**Query Parameters**

| Parámetro | Tipo | Descripción |
|-----------|------|------------|
| `countryCode` | string | Filtrar por país (ISO-2) |

**Ejemplo**

`/locations/countries?lang=IT`

Idiomas permitidos: (US | ES | IT | FR)

```json
[
  {
    "countryCode": "ES",
    "countryName": "España"
  },
  {
    "countryCode": "FR",
    "countryName": "Francia"
  }
]
```

**Response** `200 OK`

---

#### **GET** `/locations/provinces` — Listar provincias

Obtiene todas las provincias con sus códigos asociados.

```json
[
  {
      "_id": "6a33f09ea7b22b51721309a5",
      "countryCode": "ES",
      "countryName": "Spain",
      "adminCode": "VI",
      "adminFullCode": "ES-VI",
      "name": "Álava",
      "normalizedName": "alava",
      "postalCode": "01",
      "type": "province",
      "createdAt": "2026-06-18T13:20:30.436Z",
      "updatedAt": "2026-06-18T13:20:30.436Z"
  },
  {
      "_id": "6a33f09ea7b22b51721309a6",
      "countryCode": "ES",
      "countryName": "Spain",
      "adminCode": "AB",
      "adminFullCode": "ES-AB",
      "name": "Albacete",
      "normalizedName": "albacete",
      "postalCode": "02",
      "type": "province",
      "createdAt": "2026-06-18T13:20:30.440Z",
      "updatedAt": "2026-06-18T13:20:30.440Z"
  },
  ...
]
```

**Response** `200 OK`

**Ejemplo**

```bash
curl -X GET "http://localhost:3000/api/v1/locations/provinces?countryCode=ES"
```


---

#### **GET** `/locations/provincesByPostalCode/:postalCode` — Obtener provincia

Obtiene todas las provincias con sus códigos asociados.

**Ejemplo**

```json
{
  "_id": "6a33f09ea7b22b51721309bc",
  "countryCode": "ES",
  "countryName": "Spain",
  "adminCode": "J",
  "adminFullCode": "ES-J",
  "name": "Jaén",
  "normalizedName": "jaen",
  "postalCode": "23",
  "type": "province",
  "createdAt": "2026-06-18T13:20:30.442Z",
  "updatedAt": "2026-06-18T13:20:30.442Z"
}
```

**Response** `200 OK`

```bash
curl -X GET "http://localhost:3000/api/v1/locations/provinces?countryCode=ES"
```

---

### 📦 Pallets

#### **POST** `/pallets` — Crear tipo de pallet

Define un nuevo tipo de pallet con sus restricciones.

**Request Body**

```json
{
  "agencyId": "507f1f77bcf86cd799439011",
  "name": "Euro Pallet",
  "constraints": {
    "maxWeight": 1000,
    "maxLength": 1200,
    "maxWidth": 800,
    "maxHeight": 1600
  }
}
```

**Response** `201 Created`

---

#### **GET** `/pallets` — Listar tipos de pallets

Obtiene todos los tipos de pallets definidos.

**Response** `200 OK`

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "agencyId": "507f1f77bcf86cd799439012",
    "name": "Euro Pallet",
    "constraints": { ... }
  }
]
```

---

### 💰 Tarifas (Endpoint Principal)

#### **POST** `/rates/compareByPostalCode` — Comparar tarifas

**Este es el endpoint más importante**. Compara tarifas de todas las agencias configuradas para un envío específico.

**Request Body**

```json
{
  "destinationPostalCode": "28001",
  "countryCode": "ES",
  "items": [
    {
      "typeServices": "pallet",
      "weight": 250,
      "length": 120,
      "width": 80,
      "height": 150
    },
    {
      "typeServices": "parcel",
      "weight": 25,
      "length": 12,
      "width": 20,
      "height": 15
    }
  ]
}
```

**Parámetros Explicados**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|------------|
| `destinationPostalCode` | string | ✅ | Código postal destino |
| `countryCode` | string | ✅ | Código de país (ISO-2, ej: ES, FR) |
| `items` | array | ✅ | Lista de artículos a enviar |
| `items[].typeServices` | string | ✅ | Tipo: "pallet" o "parcel" |
| `items[].weight` | number | ✅ | Peso en kg |
| `items[].length` | number | ✅ | Largo en cm (si es pallet) |
| `items[].width` | number | ✅ | Ancho en cm (si es pallet) |
| `items[].height` | number | ✅ | Alto en cm (si es pallet) |

**Response** `200 OK`

```json
[
    {
        "agency": "Cayco",
        "available": true,
        "zone": "ZONA 3",
        "services": [
            {
                "service": "economy",
                "total": 41.43,
                "itemCount": 1,
                "breakdown": [
                    {
                        "type": "Tarifa base",
                        "price": 41.43,
                        "palletType": "CUARTO",
                        "quantity": 1,
                        "unitPrice": 41.43,
                        "items": [
                            {
                                "typeServices": "pallet",
                                "weight": 215,
                                "large": 80,
                                "width": 90,
                                "height": 80
                            }
                        ]
                    }
                ],
                "incidents": []
            }
        ]
    },
    {
        "agency": "Tecum",
        "available": true,
        "zone": "ZONA 1",
        "services": [
            {
                "service": "premium",
                "total": 43.48,
                "itemCount": 1,
                "breakdown": [
                    {
                        "type": "Tarifa base",
                        "price": 43.48,
                        "palletType": "QUARTER PALLET",
                        "quantity": 1,
                        "unitPrice": 43.48,
                        "items": [
                            {
                                "typeServices": "pallet",
                                "weight": 215,
                                "large": 80,
                                "width": 90,
                                "height": 80
                            }
                        ]
                    }
                ],
                "incidents": []
            },
            {
                "service": "economy",
                "total": 43.5,
                "itemCount": 1,
                "breakdown": [
                    {
                        "type": "Tarifa base",
                        "price": 43.5,
                        "palletType": "QUARTER PALLET",
                        "quantity": 1,
                        "unitPrice": 43.5,
                        "items": [
                            {
                                "typeServices": "pallet",
                                "weight": 215,
                                "large": 80,
                                "width": 90,
                                "height": 80
                            }
                        ]
                    }
                ],
                "incidents": []
            }
        ]
    },
    {
        "agency": "Correosexpress",
        "available": false,
        "zone": "NACIONAL",
        "services": [
            {
                "service": "Sin tarifa disponible",
                "total": 0,
                "itemCount": 0,
                "breakdown": [],
                "incidents": [
                    {
                        "type": "Sin tarifa disponible",
                        "message": ""
                    }
                ]
            }
        ]
    },
    {
        "agency": "Mrw",
        "available": false,
        "zone": "NACIONAL",
        "services": [
            {
                "service": "Sin tarifa disponible",
                "total": 0,
                "itemCount": 0,
                "breakdown": [],
                "incidents": [
                    {
                        "type": "Sin tarifa disponible",
                        "message": ""
                    }
                ]
            }
        ]
    },
    {
        "agency": "Dachser",
        "available": true,
        "zone": "NACIONAL",
        "services": [
            {
                "service": "targoflex (500380)",
                "total": 51.27,
                "itemCount": 1,
                "breakdown": [
                    {
                        "type": "freight ex works to place of destination",
                        "price": 45.1
                    },
                    {
                        "type": "fuel surcharge",
                        "price": 6.17
                    }
                ],
                "incidents": []
            },
            {
                "service": "targospeed (500379)",
                "total": 56.27,
                "itemCount": 1,
                "breakdown": [
                    {
                        "type": "freight ex works to place of destination",
                        "price": 45.1
                    },
                    {
                        "type": "fuel surcharge",
                        "price": 6.17
                    },
                    {
                        "type": "Product surcharge",
                        "price": 5
                    }
                ],
                "incidents": []
            },
            {
                "service": "targospeed 12 (500381)",
                "total": 66.27,
                "itemCount": 1,
                "breakdown": [
                    {
                        "type": "freight ex works to place of destination",
                        "price": 45.1
                    },
                    {
                        "type": "fuel surcharge",
                        "price": 6.17
                    },
                    {
                        "type": "Product surcharge",
                        "price": 15
                    }
                ],
                "incidents": []
            }
        ]
    }
]
```

**Códigos HTTP**

| Código | Descripción |
|--------|-------------|
| `200` | Comparación exitosa (al menos un proveedor respondió) |
| `400` | Error de validación en los parámetros |
| `404` | Provincia/ubicación no encontrada |
| `500` | Error interno del servidor |

---

#### **POST** `/rates/compareByProvinceCode` — Comparar tarifas

**Endpoint de comparación de rate**. Compara tarifas de todas las agencias configuradas para un envío específico, recibiendo como parámetro el código postal y código de provincia obtenidos del endpoint /locations/provinces (Solo provincia españolas).

**Request Body**

```json
{
  "destinationPostalCode": "28001",
  "countryCode": "ES",
  "province": "ES-GR",
  "items": [
    {
      "typeServices": "pallet",
      "weight": 250,
      "length": 120,
      "width": 80,
      "height": 150
    },
    {
      "typeServices": "parcel",
      "weight": 25,
      "length": 12,
      "width": 20,
      "height": 15
    }
  ]
}
```

**Parámetros Explicados**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|------------|
| `destinationPostalCode` | string | ✅ | Código postal destino |
| `countryCode` | string | ✅ | Código de país (ISO-2, ej: ES) |
| `province` | string | ✅ | Código de provincia (ej: ES-GR, ES-M) |
| `items` | array | ✅ | Lista de artículos a enviar |
| `items[].typeServices` | string | ✅ | Tipo: "pallet" o "parcel" |
| `items[].weight` | number | ✅ | Peso en kg |
| `items[].length` | number | ✅ | Largo en cm (si es pallet) |
| `items[].width` | number | ✅ | Ancho en cm (si es pallet) |
| `items[].height` | number | ✅ | Alto en cm (si es pallet) |

---

#### **POST** `/rates/compare` — Comparar tarifas (Eliminado)

**Endpoint de comparación de rate**. Compara tarifas de todas las agencias configuradas para un envío específico, recibiendo como parámetro el código postal y código de provincia obtenidos del endpoint /locations/provinces.

**Request Body**

```json
{
  "destinationPostalCode": "28001",
  "province": "ES-GR",
  "items": [
    {
      "typeServices": "pallet",
      "weight": 250,
      "length": 120,
      "width": 80,
      "height": 150
    },
    {
      "typeServices": "parcel",
      "weight": 5,
      "quantity": 2
    }
  ]
}
```
---

## ⚙️ Motor de Tarifas

### Flujo de Procesamiento

```
1. ENTRADA: Usuario envía datos del envío
          ↓
2. VALIDACIÓN: Verifica parámetros y ubicación
          ↓
3. SCOPE DETECTION: Determina si es nacional o internacional
          ↓
4. FILTRADO DE AGENCIAS: Selecciona agencias que cumplen scope
          ↓
5. PARALLELIZACIÓN: Consulta estáticas (BD) y APIs en paralelo
          ↓
6. PROCESAMIENTO:
   - Estáticas: Busca en zona configurada, calcula recargos
   - APIs: Envía solicitud, parsea respuesta
          ↓
7. NORMALIZACIÓN: Convierte resultados a formato estándar
          ↓
8. RESPUESTA: Retorna precios de todos los proveedores
```

### Sistema de Scope (Alcance)

El sistema determina automáticamente si es un envío nacional o internacional:

```javascript
// Archivo: api/src/lib/constants/zone.scope.js

export const SCOPE_TYPES = {
    NATIONAL: 'national',
    INTERNATIONAL: 'international'
};

export const SCOPE_LABELS = {
    [SCOPE_TYPES.NATIONAL]: 'NACIONAL',
    [SCOPE_TYPES.INTERNATIONAL]: 'INTERNACIONAL'
};

export function getScope(countryCode) {
    return countryCode === process.env.DEFAULT_COUNTRY 
        ? SCOPE_TYPES.NATIONAL 
        : SCOPE_TYPES.INTERNATIONAL;
}
```

**Cómo funciona:**
- Si `countryCode === DEFAULT_COUNTRY` (ej: ES) → **NATIONAL**
- Si `countryCode !== DEFAULT_COUNTRY` → **INTERNATIONAL**

Las agencias se filtran según su cobertura configurada (`rules.coverage`).

### Validación de Envíos

Cada artículo se valida antes de ser procesado:

```javascript
// Validaciones ejecutadas:
✓ Peso positivo
✓ Dimensiones positivas (si es pallet)
✓ Tipo de artículo válido ("pallet" o "parcel")
✓ Ubicación/provincia existe
✓ Al menos una agencia coincide con el scope
```

### Optimización de Búsqueda

La API se ha refactorizado para cargar datos críticos en `Map` durante el arranque del servidor. Esto incluye:
- zonas
- tarifas
- países
- provincias

Estos datos se cargan en memoria cuando el servidor inicia, usando claves de búsqueda directas para acceder a las estructuras en tiempo aproximado **O(1)**.

El resultado es una reducción significativa de la complejidad de consulta y una respuesta más rápida frente a búsquedas secuenciales en listas o arrays.

### Recargos (Surcharges)

El sistema calcula automáticamente recargos adicionales:

| Recargo | Condición |
|---------|-----------|
| **Exceso de peso** | Peso > umbral configurado |
| **Dimensiones especiales** | Largo o alto > límites |
| **Bloques adicionales** | Peso en múltiplos de bloques |
| **Combustible** | Porcentaje o cantidad fija |

---

## 🗄️ Modelos de Datos

### Agency (Agencia)

```javascript
{
  _id: ObjectId,
  name: String,              // "Dachser", "MRW", etc.
  code: String,              // "dachser" (normalizado)
  type: "static" | "api" | "hybrid",
  active: Boolean,           // true (activa)
  
  rules: {
    hasAndaluciaRule: Boolean,
    supportsPallets: Boolean,
    supportsParcels: Boolean,
    coverage: ["national", "international"]
  },
  
  supplements: {
    fuelSurcharge: {
      enabled: Boolean,
      type: "percentage" | "fixed",
      value: Number              // 5.5 o 2.50
    }
  },
  
  apiConfig: {               // Solo si type = "api" o "hybrid"
    baseUrlApi: String,
    timeout: Number,         // ms
    apiKey: String,
    endpoints: {
      quotations: String,
      transportOrders: String
    }
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Location (Ubicación)

```javascript
{
  _id: ObjectId,
  countryCode: String,       // "ES", "FR"
  countryName: String,       // "España", "Francia"
  adminCode: String,         // "28", "75"
  adminFullCode: String,     // "ES-28", "FR-75"
  name: String,              // "Madrid", "París"
  type: "country" | "province",
  postalCodes: [String],     // ["28001", "28002", ...]
  
  createdAt: Date,
  updatedAt: Date
}
```

### PalletType (Tipo de Pallet)

```javascript
{
  _id: ObjectId,
  agencyId: ObjectId,        // Referencia a agencia
  name: String,              // "Euro Pallet"
  constraints: {
    maxWeight: Number,       // kg
    maxLength: Number,       // cm
    maxWidth: Number,        // cm
    maxHeight: Number        // cm
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Rate (Tarifa)

Estructura interna de respuesta:

```javascript
{
  agency: String,            // Nombre de la agencia
  zone: String,              // "NACIONAL" o "INTERNACIONAL"
  services: [
    {
      serviceName: String,   // "24H Express"
      basePrice: Number,
      surcharges: [
        {
          label: String,
          amount: Number
        }
      ],
      totalPrice: Number,
      currency: String,      // "EUR"
      deliveryDays: Number
    }
  ]
}
```

---

## 🐳 Docker

### Requisitos

- Docker Desktop instalado
- Docker Compose v2+

### Ejecutar con Docker Compose

```bash
docker-compose up -d
```

Esto levanta el entorno completo del proyecto:
- **API**: http://localhost:3000
- **Web**: http://localhost:5173
- **MongoDB**: mongodb://localhost:27017
- **Loki**: http://localhost:3100
- **Grafana**: http://localhost:3001
- **Promtail**: captura logs de Docker y los envía a Loki

La configuración en `docker-compose.yml` monta las máquinas necesarias para el proyecto completo y permite capturar, almacenar y analizar tráfico, métricas y logs en tiempo real.

El backend fue adaptado para que su logger principal funcione con esta infraestructura y pueda alimentar el stack de monitoreo.

**Ver logs**

```bash
docker-compose logs -f api    # Logs de API
docker-compose logs -f web    # Logs de Web
docker-compose logs -f mongo  # Logs de MongoDB
```

**Detener servicios**

```bash
docker-compose down
```

---

## 📚 Centro de Documentación

Para profundizar en temas específicos:

| Documento | Descripción |
|-----------|------------|
| [📖 DOCUMENTATION.md](docs/DOCUMENTATION.md) | Índice completo y guía de navegación |
| [🔌 API-ENDPOINTS.md](docs/API-ENDPOINTS.md) | Todos los endpoints con ejemplos curl |
| [📋 OpenAPI YAML](api/docs/openapi.yaml) | Especificación interactiva (Swagger) |
| [📋 OpenAPI JSON](api/docs/openapi.json) | Formato JSON de OpenAPI |

---

## 🤝 Contribuir

```bash
# 1. Crear rama feature
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios y commit
git add .
git commit -m "feat: descripción clara"

# 3. Push y crear PR
git push origin feature/nueva-funcionalidad
```

---

## 📝 Licencia

ISC

---

## 👨‍💻 Equipo

**Ship Quote v2.0** — Plataforma moderna de comparación de tarifas construida con:

- **Backend**: Node.js 18+, Express 5, MongoDB, Mongoose
- **Frontend**: React 18+, Vite, CSS3
- **Infra**: Docker, Docker Compose, Loki, Promtail
- **Documentación**: OpenAPI 3.0

---

**Última actualización**: 18 de Junio de 2026
- GET /api/v1/pallets — Listar pallets
- GET /api/v1/pallets/:palletTypeId — Detalle
- POST /api/v1/pallets/compare — Comparación/validación de dimensiones (body: { item })
- DELETE /api/v1/pallets/:palletTypeId — Eliminar

- POST /api/v1/zones — Crear zona
  - Body: `agencyId`, `name`, `provinces` (array de códigos), `calculationMode` (`pallet` | `parcel`), `postalCodeExceptions` (array de {from,to,zoneName})
- GET /api/v1/zones — Listar
- GET /api/v1/zones/:zoneId — Detalle

- POST /api/v1/rates/compareByPostalCode — Comparar tarifas (motor principal)
  - Validaciones aplicadas: `schemaValidation` (req.body presente) y `rateValidation` (estructura de `items`)
  - Body mínimo:
    ```json
    {
      "destinationPostalCode": "08001",
      "countryCode": "ES",
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
  "countryCode": "ES",
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