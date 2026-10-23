# Documentación de Ship Quote

Índice de los documentos y recursos mantenidos en este repositorio.

## Guías

- [README principal](../README.md): arquitectura general, ejecución local, Docker
  y comandos de desarrollo.
- [Paquetes JSON de agencias](./PACKAGE.md): contrato, reglas postales, tarifas,
  sincronización y pasos para incorporar una agencia estática.
- [API-ENDPOINTS.md](./API-ENDPOINTS.md): referencia de rutas y ejemplos de uso.
- [SPEC.md](./SPEC.md): especificación funcional y técnica del dominio.

## Recursos

- [Colección Postman](./ShipQuote%20API.postman_collection.json): requests para
  explorar la API.
- [Dashboard de Ship Quote](./ship-dashboard.json): definición de dashboard
  incluida en el repositorio.

La documentación interactiva de OpenAPI se sirve desde `/api-docs` con la API
en ejecución. Para preparar o cambiar las tarifas estáticas de una agencia,
empieza por [PACKAGE.md](./PACKAGE.md) y revisa los paquetes actuales en
`api/src/lib/data/rate.packages/`.
