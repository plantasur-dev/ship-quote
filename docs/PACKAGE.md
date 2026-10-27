# Paquetes JSON de agencias

Los paquetes estáticos de tarifas son ficheros JSON en
`api/src/lib/data/rate.packages/`. Cada fichero describe los datos tarifarios
de una agencia: tipos de pallet, zonas, excepciones postales y tarifas. El
bootstrap descubre todos los ficheros `.json` de la carpeta; no se mantiene un
registro de nombres en código.

Esta guía refleja el flujo implementado por el bootstrap y el motor de tarifas.
El módulo `schema.package.js` contiene utilidades de expansión de tarifas, pero
la carga actual no ejecuta una normalización general del paquete ni valida
estrictamente todos los tipos, importes y rangos del JSON.

## Flujo de sincronización

Al arrancar el bootstrap:

1. Lee y analiza cada JSON de `rate.packages`.
2. Valida que existan `agency`, `palletTypes`, `zones`, `exceptions` y `rates`;
   que las zonas tengan nombres únicos; y que las excepciones y tarifas hagan
   referencia a zonas existentes. También comprueba que las provincias de las
   excepciones estén enumeradas en la zona y que los tipos de pallet de las
   tarifas tengan un nombre conocido.
3. Busca la agencia por `agency.code`. Si no existe, crea la agencia usando
   `agency` del paquete. El modelo deriva el código del nombre; por ello, el
   código generado debe coincidir con `agency.code`.
4. Calcula un hash del contenido de pallets, zonas, excepciones y tarifas. Si el
   hash coincide con la última sincronización y los recuentos persistidos también
   coinciden, no vuelve a aplicar el paquete.
5. Si hay que aplicarlo, reemplaza las zonas, reglas, tipos de pallet y tarifas
   de esa agencia. Si falla la escritura, intenta restaurar los documentos
   anteriores.
6. Guarda el estado de sincronización y refresca la caché de tarifas.

La aplicación del paquete es una sustitución completa de los datos tarifarios
de esa agencia, no una fusión. Antes de editar un paquete existente, considera
que las zonas, reglas, pallets y tarifas que no estén en el JSON también se
eliminarán cuando se aplique.

Si la agencia ya existe, el bootstrap conserva sus datos operativos y no los
actualiza con el JSON. Esto incluye, entre otros, `active`, el suplemento de
combustible, `apiConfig` y `rules`. Además, el hash de sincronización excluye
`agency`, `source` y otros metadatos; cambiar solo esos campos no fuerza una
reaplicación. Usa el panel o la API administrativa para cambiar la configuración
operativa de una agencia existente.

## Estructura del paquete

El ejemplo siguiente es un esqueleto orientativo. Los nombres de servicio,
modalidades y propiedades deben ajustarse al cálculo de la agencia y a los
valores aceptados por los modelos de la aplicación.

```json
{
  "schemaVersion": 1,
  "agency": {
    "name": "Agencia Demo",
    "code": "agencia_demo",
    "type": "static",
    "active": true,
    "rules": {
      "hasAndaluciaRule": false,
      "supportsPallets": true,
      "supportsParcels": false,
      "coverage": ["national"]
    },
    "volumetric": {
      "enabled": true,
      "factor": 300
    },
    "supplements": {
      "fuelSurcharge": {
        "enabled": false,
        "type": "percentage",
        "value": 0
      }
    }
  },
  "palletTypes": [
    {
      "name": "EURO PALLET",
      "constraints": {
        "maxWeight": 900,
        "maxLength": 120,
        "maxWidth": 80,
        "maxHeight": 220
      }
    }
  ],
  "zones": [
    {
      "name": "PENINSULA",
      "provinces": ["ES-M"],
      "calculationMode": "pallet",
      "pricingMode": {
        "type": "pallet_classification"
      }
    }
  ],
  "exceptions": [],
  "rates": [
    {
      "zoneName": "PENINSULA",
      "type": "pallet",
      "palletType": "EURO PALLET",
      "calculationType": "unit",
      "services": [
        {
          "service": "basic",
          "priceBreaks": [
            { "min": 1, "max": 1, "price": 35 },
            { "min": 2, "max": 4, "price": 30 }
          ],
          "fallbackToLastPrice": false
        }
      ]
    }
  ],
  "source": {
    "description": "Origen o referencia de los datos"
  }
}
```

`agency.volumetric` es opcional y tiene la misma forma que `zone.volumetric`.
Cuando está habilitado, define el factor general de cubicaje de la agencia en
kg/m³. Se usa únicamente en las zonas `weight_volume` que no tengan habilitado
un factor propio. Si el factor de agencia y el de zona están deshabilitados o
no existen, el cálculo usa el peso real. El bootstrap actualiza este campo en
agencias existentes cuando el paquete lo declara, sin reemplazar sus demás
ajustes operativos.

## Campos y comportamiento

### `agency`

- `name` y `code` son obligatorios. El código se deriva al crear la agencia:
  minúsculas, sin diacríticos y palabras separadas por `_`. La longitud del
  nombre está limitada por el modelo.
- `type` admite `static`, `api` o `hybrid`. En el flujo de comparación actual,
  `static` y `hybrid` se procesan por el proveedor estático; `api` se envía al
  proveedor de carriers. Que un paquete incluya `apiConfig` no implementa por sí
  mismo una integración externa: el carrier debe existir en el código.
- `rules.supportsPallets` y `supportsParcels` determinan qué agencias participan
  para las unidades incluidas en el envío. `coverage` acepta `national` e
  `international` y se usa para filtrar agencias por país destino.
- `supplements.fuelSurcharge` puede añadir un importe fijo o porcentual a los
  conceptos tarifarios calculados.
- Los valores de `agency` solo se usan como datos iniciales si la agencia no
  existe todavía.

### `palletTypes`

Cada elemento declara un nombre y `constraints`: `maxWeight`, `maxLength`,
`maxWidth` y `maxHeight`. El clasificador revisa los pallets en orden ascendente
de peso máximo y altura máxima, y asigna cada envío al primer tipo cuyos límites
no se exceden. Un límite igual a `0` se trata como no limitado.

Puede haber varias variantes con el mismo `name` y límites distintos. Una tarifa
referenciada por ese nombre se expande a todas las variantes, por lo que esas
variantes reciben el mismo precio. Si necesitan precios distintos, deben tener
referencias distintas en el contrato; duplicar el nombre no basta.

El expansor permite agrupar tipos con `tariffGroup`: para una tarifa, busca los
tipos cuyo `tariffGroup` —o nombre si no se define— coincide con `rate.palletType`.
Sin embargo, el validador actual comprueba referencias contra los nombres de
`palletTypes`, no contra `tariffGroup`. Para evitar referencias no detectadas o
tarifas descartadas, usa como `rate.palletType` un nombre de pallet presente en
el paquete y prueba explícitamente los grupos antes de depender de ellos.

### `zones`

Cada zona debe tener un nombre único, una lista `provinces`, un
`calculationMode` y un `pricingMode`.

- `calculationMode`: `pallet` o `parcel`. Debe coincidir con el tipo de las
  tarifas asociadas.
- Para `pallet`, `pricingMode.type` puede ser `pallet_classification` o
  `weight_volume`.
- Para `parcel`, `pricingMode.type` puede ser `real_weight` o `weight_volume`.
- `volumetric`, cuando aplique, contiene `enabled` y `factor` en kg/m³. En los
  modos `weight_volume` de pallets y paquetes, las dimensiones en centímetros
  se convierten a m³ (`largo × ancho × alto / 1.000.000`); ese volumen se
  multiplica por el factor activo de la zona o, si no está activo, por el
  factor general de `agency.volumetric`. Se compara el peso volumétrico con el
  real y se factura el mayor. Si no hay factor activo, se usa el peso real.
- Para paquetes, `real_weight` conserva el comportamiento de usar el peso
  real total e ignora ambos factores volumétricos.
- `pricingMode.tonnagePricingRule` es aplicable al cálculo de pallets por
  `weight_volume`; si está habilitado y se alcanza el umbral, calcula el precio
  por toneladas a partir del precio del tramo.

Los códigos provinciales deben ser los códigos `adminFullCode` presentes en el
catálogo de ubicaciones, por ejemplo `ES-M` o `PT-LIS`. El motor de ubicaciones
español identifica la provincia a partir de los dos primeros dígitos del CP;
varias islas comparten prefijo. Comprueba qué provincia efectiva devuelve ese
lookup antes de construir excepciones insulares.

### `exceptions`

Cada regla tiene esta forma:

```json
{
  "zoneName": "ZONA 11",
  "province": "ES-TF-EH",
  "from": "38000",
  "to": "38699",
  "kind": "exception"
}
```

- `zoneName` debe coincidir exactamente con una zona.
- `province` debe estar incluida en `zones[].provinces` de esa zona.
- `from` y `to` son códigos postales representados como cadenas. Conserva los
  ceros iniciales y mantén rangos sin solapamientos para una misma provincia.
- `kind: "exception"` resuelve códigos postales concretos del rango, incluidos
  los extremos. El cargador expande el rango en la caché; rechaza rangos cuya
  diferencia entre extremos supere 2500.
- `kind: "prefix"` no representa un intervalo arbitrario: el cargador usa los
  dos primeros caracteres de `from` como prefijo. No lo uses para expresar
  excepciones exactas o rangos parciales.

La resolución busca primero una excepción postal exacta, luego una regla de
prefijo y finalmente la regla predeterminada de la provincia; si no hay una
regla predeterminada, usa la primera regla de esa provincia. Si se declara una
excepción para una combinación zona/provincia, el bootstrap no crea además la
regla predeterminada de esa misma combinación. Asegúrate de que las excepciones
cubran todos los códigos postales que deban resolverse a esa zona y de que las
reglas alternativas no se contradigan.

### `rates`

Cada tarifa relaciona una zona, unidad y, para clasificación de pallets, un
tipo de pallet:

- `type`: `pallet` o `parcel`.
- `zoneName`: nombre exacto de una zona existente.
- `palletType`: nombre de un tipo de pallet, o `null` para tarifas sin
  clasificación de pallet.
- `calculationType`: el modelo admite `unit` o `quantity` y usa `unit` por
  defecto. La selección del cálculo del proveedor estático depende del tipo de
  tarifa, la zona y el modo de precio; no asumas que este campo modifica por sí
  solo la fórmula.
- `services`: uno o más servicios con nombre, tramos, límites y recargos.

`priceBreaks` usa `{ "min", "max", "price" }`. En tarifas por clasificación de
pallet, el tramo se busca por cantidad de pallets y su precio se multiplica por
la cantidad. En cálculo por peso/volumen o paquetería, los tramos se consultan
por el peso calculado. Revisa ejemplos completos en los paquetes existentes,
como `tecum.json`, `cayco.json` y `mrw.json`.

Opciones de servicio que consume el cálculo:

- `fallbackToLastPrice`: en tarifas de pallet por clasificación permite usar el
  último tramo para cantidades superiores a su máximo.
- `limits`: `maxWeight`, `maxLength` y `maxSumDimensions` restringen cada bulto
  de paquetería.
- `surcharges.extraKg`: recargo por peso que excede el último tramo de peso.
- `surcharges.multiParcelExcess`: recargo por bloques por encima de un umbral de
  peso.
- `surcharges.dimensionRanges`: recargos por intervalos de suma de dimensiones
  (`large + width + height`).
- `surcharges.fixedSurcharge`: importe fijo o calculado por cantidad.

Los servicios y modos de cálculo están sujetos a enums de los modelos. Los
nombres de servicio aceptados actualmente son `basic`, `economy`, `premium` y
`express`. Evita tramos ambiguos o solapados: el motor selecciona el primer
tramo que contiene el valor.

Para pallets con precio por peso, la tarifa no se asocia a un tipo concreto:

```json
{
  "zoneName": "PENINSULA",
  "type": "pallet",
  "palletType": null,
  "calculationType": "unit",
  "services": [
    {
      "service": "basic",
      "priceBreaks": [
        { "min": 0, "max": 1000, "price": 0.18 },
        { "min": 1001, "max": 5000, "price": 0.15 }
      ]
    }
  ]
}
```

Cuando la regla por tonelaje está habilitada en la zona, `price` se interpreta
como precio por kilogramo por debajo del umbral y se escala por toneladas a
partir de este. Confirma siempre la unidad del dato de origen antes de definir
los tramos.

Para paquetería, las tarifas se definen también por zona y servicio; los recargos
se configuran dentro de cada servicio:

```json
{
  "zoneName": "NACIONAL",
  "type": "parcel",
  "palletType": null,
  "calculationType": "unit",
  "services": [
    {
      "service": "basic",
      "priceBreaks": [
        { "min": 0, "max": 5, "price": 6.5 },
        { "min": 6, "max": 20, "price": 9 }
      ],
      "limits": {
        "maxWeight": 40,
        "maxLength": 300,
        "maxSumDimensions": 300
      },
      "surcharges": {
        "extraKg": {
          "enabled": true,
          "pricePerKg": 0.5
        },
        "dimensionRanges": [
          { "min": 150, "max": 200, "price": 2.5 }
        ],
        "multiParcelExcess": {
          "enabled": false,
          "thresholdKg": 40,
          "divisor": 5,
          "pricePerBlock": 4
        },
        "fixedSurcharge": {
          "enabled": false,
          "calculateByQuantity": false,
          "price": 0
        }
      }
    }
  ]
}
```

En paquetes, el peso seleccionado es real o volumétrico según el modo de la
zona. Si el peso supera el último tramo, se parte del último precio y se pueden
añadir los recargos habilitados. Comprueba también si los límites y tarifas
recibidos por la agencia se aplican por bulto o sobre el total: el motor valida
los límites por paquete y calcula los tramos sobre el peso agregado.

## Añadir una nueva agencia estática

1. Copia un paquete existente que se acerque al cálculo requerido; usa `tecum`
   o `cayco` como referencia de pallets y `mrw` o `correosexpress` para
   paquetería.
2. Crea `api/src/lib/data/rate.packages/<codigo>.json`. Incluye comillas en
   todas las claves y asegúrate de que el archivo sea JSON válido.
3. Elige un `agency.name` cuyo código derivado coincida exactamente con
   `agency.code`. Define cobertura y unidades soportadas.
4. Define zonas y códigos provinciales. Añade las excepciones postales usando la
   provincia que realmente devuelve el lookup, especialmente en países donde
   varias regiones comparten prefijo postal.
5. Añade los tipos de pallet y las tarifas. Comprueba que cada tarifa referencia
   una zona y que cada `palletType` referencia un nombre existente.
6. Ejecuta el test focalizado de bootstrap y luego el conjunto de tests de API:

   ```bash
   cd api
   npm test -- tests/unit/bootstrap/agencies/agency-data.initializer.test.js
   npm test
   ```

7. Revisa los resultados del bootstrap y las tarifas persistidas en una base
   local antes de desplegar. La sincronización del paquete sustituye todos los
   documentos tarifarios de esa agencia.

El bootstrap no integra automáticamente un nuevo carrier de tipo `api`: para
ello también hay que implementar y registrar el carrier en el código.

## Estado del contrato y precauciones

- `schemaVersion` aparece en los paquetes, pero el validador actual no verifica
  su valor. Mantén `1` por consistencia; no confíes en que versiones
  incompatibles se rechacen.
- El flujo actual no ejecuta `normalizePackage`; escribe importes, cadenas y
  rangos tal como llegan del JSON. Usa tipos JSON correctos (números como
  números, códigos postales como cadenas) y no dependas de conversiones
  implícitas.
- La validación actual no detecta todos los errores semánticos, como rangos
  numéricos invertidos, huecos en tarifas, solapamientos de excepciones o
  incompatibilidad de todos los modos de cálculo. Valida esos casos manualmente
  y con pruebas de resolución/cálculo.
- `source` sirve como metadato de procedencia en el registro de sincronización;
  no sustituye los datos de tarifa ni actualiza la agencia.
- Los paquetes canónicos no deben contener claves, tokens ni secretos.
