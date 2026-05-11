### 1. Flujo principal de la app

Quiero confirmar el flujo base.

¿Este sería correcto?

1. Usuario introduce datos del envío:

- origen

- destino

- peso / volumen

- dimensiones

- tipo de servicio

2. El sistema:

- consulta APIs de transportistas que tienen API

- calcula precio usando tarifas internas para los que no tienen API

3. El sistema devuelve:

- lista de opciones de envío

- transportista

- servicio

- precio coste

- precio final (si hay margen)

4. El usuario selecciona una opción.

¿Es así o hay algo más? (por ejemplo crear etiqueta, reservar envío, etc.)

> En principio esos serían los pasos, el tipo de servicio en 
> la entrada de datos tengo dudas. Podemos tener dos formas de búsqueda, una que 
> nos de cual es la mejor tarifa y transportista, y otra consultar por
> transportista.
>
> Palleteria nacional : Destino ( suele ir por zonas ),  peso  , tipo de pallet  ( largo, ancho y alto )..  no el volumen  
> 
> Paqueteria nacional :  aqui es mas facil. utilizamos  una tarifa para peninsula y diferentes para islas . peso o volumen en correos.   en mrw solo peso, pero si pasa de unas dimensiones tienes suplemento..  tengo hecha un excel para la gente de ventas y se lo calcula directamebnte
> 
>En internacional :  va por pais y codigo postal ,   volumen o peso   ( tanto paqueteria como paleteria )
>
> Por el momento, so va a ser visualizar los datos obtenidos, pero un futuro es posible conectar con ERP mediante API
 

### 2. Tipos de transportista

¿Los transportistas pueden ser de tres tipos?

1️⃣ API directa
Ej: DHL, UPS, etc.

2️⃣ Tarifa manual
Tabla de precios que cargáis vosotros.

3️⃣ Híbrido
API pero con recargo propio.

> Sí, porque puede que algunas tarifas se han personalizadas y aun teniendo API no se tenga acceso y se añadan a la bd y se consulte ahí
> Empresas con las que trabajamos, Correos Express, Mrw, Cayco, dhasher, 

### 3. Datos de envío

¿Qué campos exactos tiene un envío?

Ejemplo típico:

origen:
  pais
  cp
  ciudad

destino:
  pais
  cp
  ciudad

bultos:
  peso
  largo
  ancho
  alto

valor mercancía
tipo servicio (standard / express)

¿Se envían múltiples bultos o solo uno?
> Ambos casos

Se envían un bulto o multiples en un mismo pedido
> Se pueden dar ambos casos

### 4. Reglas de cálculo

Esto es muy importante.

Las tarifas manuales dependen de:

peso

peso volumétrico y dimensiones (alto, ancho)

zona (según CP o país)

~~servicio (24h, 48h...)~~

recargos
> Puede ser que se den casos y algunas excepciones

Ejemplo:

zona 1
0-5kg = 5€
5-10kg = 7€

¿Las tarifas funcionan así?

> Las empresas que no tenemos o no tienen api suelen trabajar de esa forma.
Ej Cayco:
Asturias	ZONA 5	120	80	70	0,672	47	31,584	MINI	ZONA 5-MINI	35,71 €	EXTRA LIGHT
Barcelona 	ZONA 6	80	61	80	0,3904	120	46,848	MINI	ZONA 6-MINI	37,94 €	EXTRA LIGHT
Madrid	ZONA 1	120	80	80	0,768	600	460,8	PLUMA	ZONA 1-PLUMA	44,51 €	SUPER EURO
Madrid	ZONA 1	120	80	190	1,824	488	890,112	MEDIO	ZONA 1-MEDIO	44,10 €	HALF
Madrid	ZONA 1	120	80	50	0,48	500	240	CUARTO	ZONA 1-CUARTO	35,71 €	QUARTER
Barcelona 	ZONA 6	120	100	90	1,08	300	324	MEDIO	ZONA 6-MEDIO	56,52 €	QUARTER
Caceres 	ZONA 7	120	100	160	1,92	525	1008	LIGERO	ZONA 7-LIGERO	67,72 €	HALF
Caceres 	ZONA 7	120	100	190	2,28	900	2052	SUPER	ZONA 7-SUPER	90,27 €	FULL
Orense 	ZONA 7	120	100	80	0,96	143	137,28	CUARTO	ZONA 7-CUARTO	48,13 €	MINI CUARTER
Asturias	ZONA 5	120	100	170	2,04	867	1768,68	SUPER	ZONA 5-SUPER	74,60 €	EURO
Asturias	ZONA 5	120	100	165	1,98	155	306,9	MEDIO	ZONA 5-MEDIO	51,94 €	QUARTER
Asturias	ZONA 5	120	100	170	2,04	260	530,4	PLUMA	ZONA 5-PLUMA	51,23 €	SUPER EURO

### 5. Zonas

Muchos transportistas usan zonas por país o CP.

Ejemplo:

zona 1 -> España península
zona 2 -> Portugal
zona 3 -> Francia

¿Tenéis tablas de zonas o vienen con la tarifa?

> En nacional suele ir por zonas e internacional por país y código postal.
> Como puedes ver en tabla de arriba y otras haciendo la peticion a la api introduciendo el destino(CP) más peso y dimensiones te devuelven el coste de envío

### 6. Usuarios

¿La app tiene usuarios?

Opciones:

sin login (solo interno)

login simple

multiempresa

> Por el momento es uso interno, la parte de consulta sin loguien. La parte de administrador con loguin

### 7. Margen / markup

¿La app calcula precio final para cliente?

Ejemplo:

coste transportista = 10€
precio cliente = 12€

Si es así:

margen fijo

margen por transportista

margen por cliente

> Solo necesitamos el precio final, no se suma precio al transporte para el cliente. El precio que obtenemos es el que repercute.
> Únicamente se hace un incremento fijo cuando es un envío de dropshipng.

### 8. Histórico

¿Necesitáis guardar historial?

Ejemplo:

cotizacion
fecha
opciones devueltas
precio elegido

Esto es muy útil para:

analytics

debugging

> Se puede añadir al desarrollo, aunque ahora mismo no es lo más importante.

### 9. Panel de administración

¿Necesitáis interfaz para:

gestionar transportistas

subir tarifas

gestionar zonas

configurar recargos

?
> Si, por si hay que cambiar costes fijos o lo que describes anteriormente.

### 10. Tarifa manual

Las tarifas manuales las vais a cargar:

manualmente desde UI

importando Excel / CSV

> Desde ambas es posible. Elige la mejor opción

### 11. APIs de transportistas

¿Las APIs normalmente devuelven?

service
delivery_time
price
currency

o algo más?

> Aún no hemos podido tener acceso a las apis de los transportistas.
> Es algo que todavía queda por determinar.

### 12. Volumen esperado

Para decidir arquitectura.

¿Cuántas consultas de precio al día?

100

1000

10000+

> Suelen existir entre 80 y 130 pedidos al día

### 13. Moneda

¿Siempre euros?

> Si

### 14. Países

¿Solo España o internacional?

> Ambos

### 15. ¿Queréis caché?

Algunos sistemas cachean cotizaciones por unos minutos.

Ej:

misma consulta
mismo resultado

> Por el momento no, pero deja el desarrollo anotado para más adelante

Si necesitas algo más preguntame