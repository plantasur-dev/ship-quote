# Ship Quote — Centro de Documentación

Aquí encontrarás toda la documentación del proyecto Ship Quote, organizada por tema.

---

## 📚 Documentación Disponible

### 📖 Guía Principal del Proyecto
- **[README.md](../README.md)** — Visión general, estructura, cómo ejecutar API y Web, variables de entorno, y Docker

### 🔌 Especificación de API (OpenAPI)
- **[openapi.yaml](../api/openapi.yaml)** — Especificación OpenAPI en formato YAML
- **[openapi.json](../api/openapi.json)** — Especificación OpenAPI en formato JSON (compatible con herramientas automáticas)

### 📋 Documentación de Endpoints
- **[API-ENDPOINTS.md](./API-ENDPOINTS.md)** — Referencia completa de todos los endpoints con:
  - Descripción de cada ruta
  - Ejemplos curl para cada endpoint
  - Campos de request y response
  - Códigos de error
  - Notas de validación

### 📊 Especificación Técnica (legado)
- **[SPEC.md](./SPEC.md)** — Documentación técnica del proyecto
- **[SPEC_v2.md](./SPEC_v2.md)** — Documentación v2
- **[SPEC_v4.md](./SPEC_v4.md)** — Documentación v4 (actual)

### 💱 Documentación de Tarifas
- **[rate/SPEC.md](./rate/SPEC.md)** — Especificación de motor de tarifas
- **[rate/SPEC_v2.md](./rate/SPEC_v2.md)** — Versión 2 del motor
- **[rate/SPEC_v4.md](./rate/SPEC_v4.md)** — Versión 4 (actual)
- **[rate/BOILERPLATE.md](./rate/BOILERPLATE.md)** — Plantilla para nuevas integraciones

---

## 🎯 ¿Por dónde empezar?

**Si eres nuevo en el proyecto:**
1. Lee [README.md](../README.md) para entender la estructura general
2. Consulta [API-ENDPOINTS.md](./API-ENDPOINTS.md) para ver qué endpoints están disponibles
3. Explora los ejemplos curl en [API-ENDPOINTS.md](./API-ENDPOINTS.md#ejemplos)

**Si quieres integrar la API en una aplicación:**
1. Consulta la especificación OpenAPI: [openapi.yaml](../api/openapi.yaml) o [openapi.json](../api/openapi.json)
2. Lee los detalles de los endpoints en [API-ENDPOINTS.md](./API-ENDPOINTS.md)
3. Usa los ejemplos curl para probar

**Si trabajas con el motor de tarifas:**
1. Lee [rate/SPEC_v4.md](./rate/SPEC_v4.md) para entender el cálculo
2. Consulta [rate/BOILERPLATE.md](./rate/BOILERPLATE.md) para nuevas integraciones

**Si necesitas ejecutar localmente:**
1. Sigue las instrucciones en [README.md](../README.md#parte-1--api-backend)
2. Usa Docker Compose si prefieres: `docker-compose up --build`

---

## 🔍 Búsqueda Rápida de Endpoints

| Recurso | Métodos | Rutas |
|---------|---------|-------|
| **Agencias** | POST, GET, PATCH | `/agencies`, `/agencies/{id}` |
| **Ubicaciones** | POST, GET | `/locations`, `/locations/{id}`, `/locations/countries` |
| **Pallets** | POST, GET, DELETE | `/pallets`, `/pallets/{id}`, `/pallets/compare` |
| **Zonas** | POST, GET | `/zones`, `/zones/{id}` |
| **Tarifas** | POST | `/rates/compare` (endpoint principal) |

---

## 🛠️ Herramientas Recomendadas

### Para Explorar la API
- **Postman:** Importa `openapi.json` o `openapi.yaml` directamente
- **Insomnia:** Igual que Postman, importa el archivo OpenAPI
- **curl:** Usa los ejemplos de [API-ENDPOINTS.md](./API-ENDPOINTS.md)
- **Thunder Client (VS Code):** Extensión para probar endpoints

### Para Generar Código
- **OpenAPI Generator:** `openapi-generator` para generar clientes en múltiples lenguajes
- **Swagger Codegen:** Alternativa a OpenAPI Generator

### Para Documentación
- **Swagger UI:** Carga el `openapi.yaml` en una instancia de Swagger UI
- **ReDoc:** Alternativa moderna a Swagger UI

---

## 📝 Ejemplos

### Crear una agencia
```bash
curl -X POST http://localhost:3000/api/v1/agencies \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi Agencia", "type": "static"}'
```

### Listar agencias
```bash
curl -X GET http://localhost:3000/api/v1/agencies
```

### Comparar tarifas (endpoint principal)
```bash
curl -X POST http://localhost:3000/api/v1/rates/compare \
  -H "Content-Type: application/json" \
  -d '{
    "destinationPostalCode": "08001",
    "province": "BCN",
    "items": [{"typeServices": "pallet", "weight": 300, "large": 120, "width": 80, "height": 150}]
  }'
```

Para más ejemplos, ve a [API-ENDPOINTS.md](./API-ENDPOINTS.md).

---

## 🚀 Ejecución Rápida

```bash
# Clonar y entrar al proyecto
cd /Users/rafacruiz/Documents/Projects/ship-quote

# Opción 1: Levantar con Docker
docker-compose up --build

# Opción 2: Levantar manualmente
# Terminal 1 - API
cd api && npm install && npm run dev

# Terminal 2 - Web (opcional)
cd web && npm install && npm run dev
```

Acceso:
- API: http://localhost:3000/api/v1
- Web (dev): http://localhost:5173
- Web (prod en Docker): http://localhost:8080

---

## 📞 Soporte

Si necesitas más información:
- Consulta los archivos de especificación en `/docs/rate/`
- Revisa los modelos en `api/src/lib/models/`
- Explora los controladores en `api/src/api/controllers/`

---

**Documentación actualizada:** 26 de mayo de 2026
