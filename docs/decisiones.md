# Decisiones técnicas

## D-01 · API de clima: Open-Meteo

**Contexto.** Necesito pronóstico diario a 7 días con temperatura máxima,
mínima y condición climática para 9 coordenadas fijas. Las llamadas salen de
una función serverless propia (ver D-09), no del navegador, con caché de 30
minutos — unos 48 refrescos al día como máximo.

**Alternativas consideradas.** OpenWeather (One Call 3.0), WeatherAPI.com y
Meteosource, comparadas contra documentación oficial.

**Decisión.** Open-Meteo.

**Razón.** Con el backend en medio, la exposición de la clave y el CORS dejan de
discriminar, así que la decisión se apoya en tres hechos medibles:

1. **Cobertura del requisito.** WeatherAPI ofrece solo 3 días de pronóstico
   diario en su plan gratuito; el desafío pide 7. Queda descartada por no
   cumplir el requisito, no por preferencia.
2. **Holgura de cuota.** Open-Meteo resuelve las 9 ciudades en una sola
   petición: 48 llamadas diarias sobre un límite de 10 000. OpenWeather exige
   una petición por ciudad — 432 diarias sobre 1 000, el 43 % de la cuota.
   Meteosource, con el mismo patrón, necesitaría 432 sobre un límite de 400:
   **lo excede**.
3. **Superficie operativa.** Sin clave, sin cuenta que mantener y sin secreto
   que rotar. Una petición dentro del proxy en lugar de nueve significa menos
   puntos de fallo parcial que manejar.

**Consecuencia.** La API devuelve códigos WMO numéricos en lugar de
descripciones, así que la traducción al español la mantengo yo (ver D-07). Y
una limitación real: **el uso gratuito es no comercial, bajo licencia CC-BY
4.0**. Para un uso comercial haría falta su plan de pago, o reevaluar
OpenWeather con proxy — que ya tengo montado.

**Umbrales que cambiarían la decisión.** Superar las 10 000 llamadas diarias, o
que el proyecto pase a uso comercial.

**Verificado el.** 15-09-2026, contra open-meteo.com/en/docs,
open-meteo.com/en/terms, openweathermap.org/api/one-call-3,
weatherapi.com/pricing.aspx y meteosource.com/pricing.

**Pendiente de confirmar.** Si «One Call by Call» exige registrar un método de
pago para acceder a su cuota gratuita. La documentación consultada respalda las
1 000 llamadas diarias gratuitas, pero no cita textualmente el requisito de
tarjeta. Se redacta como modelo de pago por uso, que es lo documentado.

**Petición de referencia.** La respuesta guardada en `docs/api-sample.json`
procede de esta llamada, ejecutada el 15-09-2026:

```
https://api.open-meteo.com/v1/forecast?latitude=-19.0333,-16.5,-17.3895,-17.9833,-19.5836,-21.5355,-17.7833,-14.8333,-11.0267&longitude=-65.2627,-68.15,-66.1568,-67.15,-65.7531,-64.7296,-63.1821,-64.9,-68.7692&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/La_Paz&forecast_days=7
```

El orden de las coordenadas **es el mismo que el de `src/data/cities.ts`** y no
debe cambiarse: la respuesta llega como array en el orden de la petición, así
que un desajuste asignaría a cada ciudad el pronóstico de otra sin fallar.

---

## D-02 · Stack: React + Vite + TypeScript

**Contexto.** Una sola vista, sin rutas, sin autenticación, sin estado compartido
y sin escrituras de usuario. El frontend es estático y se sirve desde CDN; los
datos llegan de una función serverless propia (D-09). Lo construye una persona
en menos de diez horas y tiene que poder explicar cada línea.

**Alternativas consideradas.** Vanilla JS sin build, Vue 3 + Vite, Svelte,
Astro, Next.js y Angular.

**Decisión.** React 19 + Vite + TypeScript.

**Razón.** Lo primero que hay que decir es que **cinco de los criterios clásicos
no discriminan a esta escala**:

| Criterio | Por qué es indiferente |
|---|---|
| Añadir la función serverless | El directorio `api/` de Vercel es agnóstico del framework — su documentación incluye una variante explícita `framework=other`. Coste idéntico en los siete. |
| Rendimiento percibido | La red hacia el proxy domina el presupuesto. La diferencia entre 2 KB y 90 KB de runtime son decenas de milisegundos sobre unos ~500 ms, y menos aún con caché de CDN. |
| Escalabilidad de carga | Frontend estático servido por CDN. Idéntico en todos. |
| Seguridad | Ninguno expone secretos: si hubiera clave, viviría en la función. |
| Coste | Los siete caben en el plan gratuito de la plataforma. |

Lo que sí decide son tres cosas, y por ellas quedan fuera cuatro candidatos:

1. **Encaje del modelo con el problema.** Astro optimiza páginas mayormente
   estáticas con islas de interactividad; esta app es una sola vista
   interactiva, así que la isla sería la página entera — se paga el modelo y se
   recibe su beneficio a cero. Angular está diseñado para aplicaciones grandes
   con equipos grandes.
2. **Superficie que hay que poder explicar.** Next.js dejaría sin usar el
   enrutado por archivos, el renderizado en servidor, los componentes de
   servidor, el middleware, la optimización de imágenes y el streaming: seis
   conceptos que no aportan nada y sí hay que justificar.
3. **Demostrar componentización y tipado.** Es el único criterio que descarta
   vanilla JS, que técnicamente sería viable y el más ligero.

Entre los tres finalistas —React, Vue y Svelte— la diferencia técnica real es
el peso del runtime, y es invisible a esta escala. **Svelte es el más limpio de
los tres** (~2-5 KB frente a ~42 KB de React); se elige React por familiaridad
y por reconocibilidad para quien evalúa, no por superioridad técnica. Decirlo
así es más honesto que fabricar una ventaja que no existe.

**TypeScript** se justifica aparte: tipar la respuesta de la API convierte un
error de mapeo en un fallo de compilación en lugar de en una pantalla en
blanco. En un proyecto que consume una estructura externa, eso se amortiza el
primer día.

**Consecuencia.** El `package.json` queda corto y defendible. La contrapartida
es asumir ~42 KB de runtime que Svelte no cobraría.

**Verificado el.** 15-09-2026, contra vercel.com/docs/functions/quickstart y
vercel.com/docs/functions/configuring-functions/region.

**Medición real (15-09-2026).** Tras el andamiaje, `npm run build` de una app
vacía con React 19 da **68,60 KB gzip** (219,63 KB sin comprimir). La cifra de
~42 KB que citaban las comparativas de terceros se queda **un 38 % corta**: era
para el núcleo de React 18, no para React 19 más el arranque de la aplicación.

Esto **no cambia la decisión** —sigue siendo irrelevante frente a los ~500 ms
de red— pero sí cambia lo que se puede afirmar por escrito. En el README va
68,60 KB, medido aquí, y no un número copiado de un artículo.

**Caveat que queda.** Los pesos de Vue, Svelte, Astro, Next.js y Angular siguen
siendo de comparativas de terceros y sin medir. Si la de React estaba un 38 %
corta, las demás probablemente también: sirven como orden de magnitud para
descartar, no como medida.

---

## D-03 · Sin dependencias de producción adicionales

**Contexto.** Diez archivos, un `fetch`, una vista.

**Decisión.** Sin router, sin gestor de estado, sin cliente HTTP, sin librería
de CSS ni de iconos. `fetch` nativo, `useState`, CSS propio y emoji.

**Razón.** Cada dependencia es una decisión que hay que defender y una
superficie que explicar. Un router para una sola vista, un gestor de estado
para tres variables o un cliente HTTP para una petición son complejidad sin
beneficio. **La ausencia también es una decisión**, y se documenta como tal.

**Consecuencia.** Algunas cosas se escriben a mano: el formateo de fechas con
`Intl.DateTimeFormat`, el manejo de estados de carga y error, y los estilos.
Son unas decenas de líneas y todas explicables.

**Aclaración importante.** Esta decisión habla de **dependencias de
producción**. Las de prueba —Vitest, Testing Library, jsdom— viven en
`devDependencies`, no entran en el bundle y no llegan al usuario. Su presencia
es señal de calidad, no de complejidad, y no contradice esta decisión.

---

## D-04 · Coordenadas fijas en el código, sin geocoding

**Contexto.** Nueve ciudades conocidas y que no van a cambiar.

**Alternativas consideradas.** Resolver los nombres contra una API de geocoding
al arrancar.

**Decisión.** Coordenadas literales en `src/data/cities.ts`.

**Razón.** Geocodificar añadiría latencia de arranque y un punto más de fallo a
cambio de nada: las coordenadas de nueve capitales departamentales son un dato
estable.

**Consecuencia.** Añadir una ciudad es editar una línea. Y una precaución que
importa: **el orden del array es significativo** (ver D-05).

---

## D-05 · Una sola petición para las nueve ciudades

**Contexto.** Open-Meteo acepta coordenadas separadas por coma y devuelve un
array con una entrada por ubicación.

**Alternativas consideradas.** Nueve peticiones en paralelo.

**Decisión.** Una petición con las nueve coordenadas.

**Razón.** Es la decisión de rendimiento más grande del proyecto, porque actúa
sobre el cuello de botella real, que es la red y no el framework. Además evita
el problema de los fallos parciales: con nueve peticiones hay que decidir qué
hacer cuando siete responden y dos no.

**Consecuencia — y es la trampa del proyecto.** La respuesta llega **en el orden
de la petición**, y Open-Meteo ajusta las coordenadas a su malla de modelo (se
pidió La Paz en -16.5000 y devuelve -16.56), así que no se pueden emparejar
comparando coordenadas. **La única garantía es que el orden de `cities.ts` y el
de la URL sean el mismo.** Un desajuste no produce ningún error: simplemente
muestra el pronóstico de una ciudad bajo el nombre de otra.

**Prueba de humo.** Potosí y Santa Cruz deben dar temperaturas muy distintas.
En la muestra del 15-09-2026: La Paz mínima -2.3 °C y Cobija máxima 32.2 °C el
mismo día. Si todas se parecen, el orden está mal.

**Añadido al implementar (16-09-2026).** La respuesta de Open-Meteo incluye un
campo `elevation` por ubicación: la altitud real del punto de modelo. Se usa
esa cifra —verificada por la misma fuente que ya consumimos— en vez de
cualquier valor buscado aparte. Difiere ligeramente de las cifras aproximadas
usadas en la fase de planificación (Oruro 3706→3925 m, Potosí 4067→3962 m):
las de la API son las correctas y las que se citan de aquí en adelante.
`elevationM` se guarda como campo estático en `City` (D-06), igual que las
coordenadas — no se vuelve a pedir en cada carga.

---

## D-06 · Separación entre la respuesta de la API y el modelo de la aplicación

**Contexto.** La API devuelve `daily` como arrays paralelos con nombres propios
del proveedor: `temperature_2m_max`, `weather_code`.

**Decisión.** `weatherApi.ts` traduce esa forma a un `CityForecast[]` propio.
Ningún componente ve jamás un nombre de la API.

**Razón.** Aísla el proveedor en un solo archivo. Es la decisión más barata de
tomar y la que más se paga después.

**Consecuencia — ya cobrada dos veces.** Cuando el cliente pase a llamar al
proxy en lugar de a Open-Meteo (D-09), cambia **una constante** y ni los
componentes ni las pruebas se enteran. Y si mañana hubiera que cambiar de
proveedor de clima, se toca un archivo.

---

## D-07 · Agrupación de los códigos WMO en siete categorías

**Contexto.** Open-Meteo devuelve el estándar WMO 4677: unos treinta códigos
numéricos, sin descripción textual.

**Decisión.** Agruparlos en siete categorías legibles, con un valor neutro por
defecto para códigos desconocidos.

**Razón.** Es una decisión de producto, no técnica: un usuario no necesita
distinguir «llovizna helada ligera» de «llovizna helada densa». Las siete
categorías son despejado, parcialmente nublado, nublado, niebla, llovizna,
lluvia, nieve y tormenta.

**Consecuencia.** La traducción al español la mantengo yo — es la contrapartida
de haber elegido una API sin descripciones (D-01). El valor por defecto evita
que un código nuevo del proveedor rompa una tarjeta.

---

## D-08 · Referencia visual generada, implementación propia

**Contexto.** Se usó una herramienta de generación de interfaces para producir
la referencia visual antes de codificar.

**Decisión.** Se adopta el resultado como **especificación visual** —paleta,
escala tipográfica, espaciado, composición y comportamiento responsive— y se
descarta el código que genera.

**Razón.** El export incluye Tailwind CSS, lo que contradiría directamente D-03,
más una librería de iconos y una estructura de DOM que no coincide con el modelo
de componentes decidido aquí. Y algo más importante: serían cientos de líneas de
marcado que no podría explicar clase por clase.

**Consecuencia.** La implementación cuesta más tiempo que pegar el export, y a
cambio cada línea del proyecto es defendible.

**Resultado (15-09-2026).** Se generaron 4 pantallas: principal, cargando,
error y datos antiguos (esta última existe por D-09). Una vuelta de
corrección quitó del diseño generado lo que Stitch había añadido sin que se
pidiera — gráfico de barras, pestaña comparativa, icono de usuario, branding
de "red oficial" y "norma OMM", humedad y presión (ver D-11) — y añadió
sensación térmica y viento con datos reales. Confirmado que el `code.html`
exportado usa Tailwind CDN y Material Symbols, como se anticipaba: no se usa.
Tokens extraídos a `docs/design/tokens.md`.

---

## D-09 · Backend mínimo: función proxy con caché

**Contexto.** La aplicación se despliega públicamente y varios revisores pueden
abrirla en cualquier momento.

**Decisión inicial: NO construir backend.** El razonamiento era que ninguno de
los problemas que un backend resuelve estaba presente: sin clave que ocultar,
CORS habilitado, datos ya agregados, sin cuota que proteger y sin persistencia.

**Decisión final: SÍ, una función serverless de proxy con caché.** La revisión
de la decisión encontró dos fallos en ese razonamiento.

**Razón — fallo 1.** Trataba la disponibilidad del proveedor como un problema
ajeno. En una aplicación desplegada y evaluada es propio: si la API está caída
cuando alguien la abre, el que parece roto es este proyecto. Los términos de
Open-Meteo lo declinan por escrito: *«their uninterrupted provision are not
guaranteed»*, y se reservan bloquear IPs sin aviso previo.

**Razón — fallo 2.** La objeción de los arranques en frío describía a servicios
de contenedor que se suspenden por inactividad, no a funciones serverless, que
no tienen proceso que suspender. El argumento era válido para otra plataforma.

**Lo que sí se confirmó:** el riesgo no era el volumen. Open-Meteo permite
10 000 llamadas diarias, 5 000 por hora y 600 por minuto, y unos cuantos
revisores no se acercan. El problema era la **resiliencia**, que es otro
problema y pide otra solución: no un backend que escale, sino una capa que
sobreviva a una caída.

**Diseño.** Una función en `api/forecast.ts` con `Cache-Control:
public, s-maxage=1800, stale-while-revalidate=86400`. Con caché de 30 minutos,
N visitantes se convierten en ~1 llamada al proveedor por media hora, y una
caída del origen queda cubierta por lo cacheado. **Los fallos se devuelven con
`no-store`**: si una respuesta de error llegara a cachearse, la aplicación
quedaría rota durante toda la ventana de caché — el efecto contrario al
buscado. Como segunda capa, el cliente guarda la última respuesta correcta en
`localStorage` y la muestra con aviso de antigüedad si todo lo demás falla.

**Consecuencia.** Un archivo más y una latencia adicional en el camino sin
caché, a cambio de que una caída del proveedor sea invisible. Se mantiene en el
plan gratuito: fijar la región de la función más cercana vía `vercel.json`
recorta más latencia que pagar un plan, porque con acierto de caché la función
ni se invoca.

**Verificado el.** 15-09-2026, contra open-meteo.com/en/terms,
vercel.com/docs/functions/limitations y
vercel.com/docs/functions/configuring-functions/region.

**Pendiente de verificar.** Si el CDN sigue sirviendo contenido cacheado cuando
la revalidación **falla** — eso es `stale-if-error`, que no todos los CDN
implementan. Se comprueba apuntando el proxy a un host inválido (caso M-11 de
`docs/pruebas.md`). Hasta entonces, la garantía real es el `localStorage`.

---

## D-10 · Estrategia de pruebas

**Contexto.** «Manejar razonablemente errores de la API» es un requisito
explícito del desafío, y un `catch` que nunca se ha ejecutado es una suposición.

**Decisión.** Cuatro niveles, con lo que se deja fuera documentado.

**Qué se prueba:**

| Nivel | Qué cubre | Herramienta |
|---|---|---|
| Lógica de dominio | Traducción de códigos WMO, formato de fechas con zona horaria | Vitest |
| Mapeo de la API | Respuesta real → `CityForecast[]`, usando `docs/api-sample.json` como fixture | Vitest |
| Casos de error | Red caída, HTTP 500, timeout abortado, JSON incompleto, camino feliz | Vitest + fetch simulado |
| Componentes | Renderizado de un día, cambio de ciudad, estado de error visible | Testing Library |
| Manual sobre producción | Matriz de once casos, dos navegadores y un teléfono real | `docs/pruebas.md` |

**Qué NO se prueba, y por qué:**

- **Sin pruebas de extremo a extremo.** Una sola pantalla; el recorrido crítico
  queda cubierto por las pruebas de componente y por la matriz manual. La
  infraestructura costaría más que el valor que aporta.
- **Sin pruebas de instantánea.** Se rompen con cada ajuste de estilo sin
  afirmar nada sobre el comportamiento.
- **Sin objetivo de cobertura porcentual.** Perseguir el número lleva a probar
  código trivial. Declaro qué módulos están cubiertos y cuáles no.
- **Sin pruebas de carga.** Sitio estático servido por CDN, sin escrituras.
- **Sin probar React ni `fetch`.** Son dependencias, no código propio.

**Razón.** Una suite más grande que la aplicación sería la misma
sobre-ingeniería que el desafío penaliza, solo que con bata de laboratorio. El
trabajo de calidad no es acumular pruebas: es decidir dónde se concentra el
riesgo y justificar el resto.

**Consecuencia.** El fixture de las pruebas es la respuesta real de la API,
no un JSON inventado — así verifican contra datos verdaderos en lugar de
contra las propias suposiciones.

**Corrección al implementar (16-09-2026).** El fixture original de
`docs/api-sample.json`, guardado en el bloque 02, solo tenía los 3 campos de
D-01 (weather_code, max, min) — D-11 llegó después y añadió sensación
térmica y viento a la petición real, pero nadie regeneró el fixture. La
primera ejecución de las pruebas del bloque 08 lo detectó de inmediato: el
mapeo fallaba con `feelsLikeMax` undefined, porque el fixture no tenía esos
campos y `weatherApi.ts` sí los pide. Se regeneró el fixture con las 6
variables reales. Es la razón por la que un fixture guardado en disco puede
quedar obsoleto silenciosamente cuando el código que lo consume cambia
después: no hay ningún mecanismo automático que los mantenga sincronizados,
solo la prueba que falla al ejecutarse.

---

# Arquitectura

## Tres capas

```
Datos        src/data/cities.ts       las 9 capitales, orden significativo
   ↓
API          api/forecast.ts          proxy con caché (servidor)
             src/lib/weatherApi.ts    fetch, validación y mapeo (cliente)
   ↓
Presentación src/components/*.tsx     nunca ven la forma cruda de la API
```

## Árbol de archivos

```
api/
└── forecast.ts            proxy con caché ante Open-Meteo
src/
├── data/cities.ts         9 ciudades — fuente única de verdad del orden
├── lib/
│   ├── weatherApi.ts      fetch + validación + mapeo al modelo propio
│   ├── weatherCodes.ts    WMO → { label, icon }
│   └── formatDate.ts      "2026-09-15" → "Mar 15 sep"
├── components/
│   ├── CityList.tsx       las 9 ciudades, con selección
│   ├── ForecastGrid.tsx   los 7 días de la ciudad activa
│   ├── ForecastCard.tsx   un día: fecha, máxima, mínima, condición
│   ├── LoadingState.tsx
│   └── ErrorState.tsx     mensaje accionable + reintento
├── types.ts               City, DayForecast, CityForecast
└── App.tsx                estado: cargando | datos | error
vercel.json                región de la función
```

## Modelo de datos

```ts
type City = {
  id: string;
  name: string;
  department: string;
  latitude: number;
  longitude: number;
};

type Condition = { label: string; icon: string };

type DayForecast = {
  date: string;      // ISO "2026-09-15"
  maxTemp: number;   // °C, redondeada
  minTemp: number;   // °C, redondeada
  condition: Condition;
};

type CityForecast = {
  city: City;
  days: DayForecast[];
};
```

Escrito antes de codificarlo, a propósito: definir el modelo propio antes de ver
la forma de la API es lo que evita que la segunda contamine al primero.

---

## Apéndice · Lo que el andamiaje contradijo

Tres cosas que el plan daba por supuestas y la realidad corrigió al ejecutar
`npm create vite`, el 15-09-2026:

1. **La plantilla trae React 19**, no 18, con TypeScript 6 y Vite 8.
2. **El linter es `oxlint`, no ESLint.** Viene configurado de fábrica en
   `.oxlintrc.json`. No se cambia: funciona y es una dependencia menos que
   justificar. D-10 hablaba de ESLint por costumbre, no por haberlo elegido.
3. **`tsc --noEmit` no verifica nada en este proyecto.** El `tsconfig.json`
   raíz es un archivo de referencias sin archivos propios, así que devuelve
   éxito aunque haya errores de tipos. Verificado introduciendo un error
   deliberado: `tsc --noEmit` salió con código 0, `tsc -b --noEmit` con código
   2 y el error correcto. **El hook y el script `typecheck` usan `-b`.**

El tercero es el importante: un hook con el comando equivocado no falla, pasa
—y da confianza falsa durante todo el proyecto, que es peor que no tener hook.

---

## D-11 · Variables diarias ampliadas: sensación térmica y viento sí, humedad y presión no

**Contexto.** Al revisar el diseño generado en Stitch, aparecieron cuatro
métricas nuevas en la pantalla: sensación térmica, viento, humedad y presión.
Se pidió investigar cuáles de las cuatro admite Open-Meteo a granularidad
diaria antes de decidir si se incorporan.

**Decisión.** Se añaden `apparent_temperature_max/min` (sensación térmica) y
`wind_speed_10m_max` (viento) a la petición de D-01. **Humedad y presión
quedan fuera** de esta iteración.

**Razón.** Verificado contra open-meteo.com/en/docs: `apparent_temperature_*`
y `wind_speed_10m_max` sí existen como variables `daily`, mismo endpoint y
mismo formato que las que ya usamos — coste marginal cero. Humedad
(`relative_humidity_2m`) y presión (`surface_pressure`, `pressure_msl`) **solo
existen a granularidad horaria**. Para mostrarlas por día habría que pedir 24
valores por ciudad y promediarlos nosotros, lo que añade una transformación de
datos que D-06 evita deliberadamente (la API entrega los datos ya agregados
por día; no queremos ser nosotros quienes agreguemos).

**Consecuencia.** `DayForecast` (D-06) gana dos campos opcionales:
`feelsLikeMax`, `feelsLikeMin` y `windMax`. El prompt de diseño para Stitch
pide estos dos datos con valores reales; humedad y presión se retiran del
diseño.

**Verificado el.** 15-09-2026, contra open-meteo.com/en/docs.

---

## Despliegue

**URL de producción:** https://clima-bolivia-theta.vercel.app/

**Desplegado el.** 16-09-2026, bloque 09. Plataforma Vercel, plan Hobby
(ver D-09 sobre por qué no hace falta pagar). Framework detectado
automáticamente (Vite), sin variables de entorno.

**Verificado tras el despliegue** (Playwright headless, no solo mirar la
pantalla): 9 ciudades, 7 días cada una, sin errores de consola, sin scroll
horizontal a 375 px, primer día correcto (2026-09-16, sin desfase de zona
horaria) — en escritorio y en viewport móvil.

**Dato curioso, sin sobre-interpretar.** La cabecera `X-Vercel-Id` de la
respuesta muestra `gru1` (São Paulo): el CDN de Vercel ya sirve el HTML
estático desde el borde más cercano a Sudamérica por defecto, sin que se
haya configurado nada. Esto es distinto de la región de la *función*
serverless (D-09), que se fija explícitamente en `vercel.json` y solo
importa cuando exista `api/forecast.ts` (bloque 14) — no confundir las dos
cosas.

---

## Nota para el bloque 12

Verificado con Playwright tras el bloque 10 (16-09-2026): con el CSS mínimo
actual hay **scroll horizontal tanto a 375px como a 900px** — la grilla de 7
tarjetas y el `<select>` con "Santa Cruz de la Sierra — Santa Cruz" no caben
en el ancho disponible. Es esperado en este punto: el pase completo de
`docs/design/tokens.md` (responsive, apilado vertical en móvil según la
referencia de Stitch) es el bloque 12, no se adelantó aquí para no duplicar
trabajo. La lógica y los datos ya están verificados correctos — cambio de
ciudad, jerarquía máx/mín, altitud, sensación térmica — solo falta el estilo.

---

## Nota de accesibilidad (bloque 12)

Verificado con la fórmula de luminancia relativa de WCAG 2.1, no a ojo: el
acento extraído (`#0284C7`) da **4.10:1** contra blanco — pasa el umbral de
3:1 para bordes y foco, pero **no llega al 4.5:1** que exige texto pequeño.
El badge "HOY" (texto blanco, ~11px) usa un tono un 15% más oscuro,
`--color-accent-text: #0270A9` (5.39:1), solo para ese caso. El resto de
la interfaz conserva el acento original de `tokens.md` sin modificar. El
texto secundario (`#64748B`) ya daba 4.76:1 sin necesidad de ajuste.

---

## Corrección de fidelidad al diseño (bloque 12, segunda vuelta)

La primera pasada aplicó los tokens (color, tipografía, espaciado) pero no
la **composición** real de la referencia de Stitch. Reconstruido tras
comparar de nuevo contra `PantallaPrincipal/screen.png` y
`stitch_Mobile/.../selector_desplegable/screen.png`:

- **`TodayHero.tsx`**, nuevo: el panel "hoy" que faltaba por completo —
  ciudad grande, altitud/departamento, condición, número grande.
  **Diferencia honesta:** el diseño original mostraba una lectura
  instantánea ("11.4°"); no tenemos temperatura actual, solo pronóstico
  diario (D-01). El número grande es la **máxima de hoy**, dato real.
- Tarjetas: se añadieron las etiquetas **MÁX/MÍN** que se habían omitido,
  y el icono pasa a estar centrado y grande, como en la referencia.
- Encabezado y pie: replican la franja de marca ("BOLIVIA CLIMA" + etiqueta
  + hora) y el pie ("Datos: Open-Meteo" · frecuencia de actualización).
- Móvil: la fila de 7 días se simplifica a fecha + condición + máx/mín en
  una línea, **sin sensación ni viento repetidos** — esos datos solo
  aparecen una vez, en el panel "hoy". No es una simplificación mía: es la
  densidad de información que el propio diseño de Stitch eligió para esa
  vista.

**Dos bugs reales encontrados verificando a 375px, no asumidos:**
1. `.city-selector__control` tenía `max-width: 26rem` (416px), más ancho
   que el propio viewport de 375px.
2. Aun corrigiendo eso, el `<select>` seguía desbordando: fijar el
   `max-width` del contenedor no basta si los hijos no pueden encogerse
   (`min-width:0` + `text-overflow:ellipsis` en el select).

**Aspiracional, a validar en el bloque 14:** el pie dice "Actualización
cada 30 minutos", que es la ventana de caché planeada para el proxy de
D-09. Hoy el cliente carga una sola vez al montar; el texto describe la
arquitectura completa, que todavía no existe. Revisar que siga siendo
cierto cuando el proxy se implemente.

---

## Fidelidad al diseño, tercera vuelta: mapa y encabezado oscuro

Segunda ronda de revisión (16-09-2026), contra una captura nueva que el
usuario compartió del diseño original en Stitch — más detallada que la
primera referencia guardada. Faltaban dos piezas grandes:

**`CountryMap.tsx`, nuevo.** Habíamos simplificado el mapa a un `<select>`
plano (ver nota anterior de fidelidad y `docs/design/tokens.md`); se trae
de vuelta, pero con una regla: la silueta es **ilustrativa, no un contorno
geográfico preciso** — mismo criterio que D-08 aplicó al descartar el
`code.html` de Stitch. Lo único que sí es exacto son las **posiciones de
los 9 puntos**: se calcularon proyectando la latitud/longitud real de
`cities.ts` sobre el panel (ver script de proyección en el historial de
comandos), no se dibujaron a ojo. La interacción vive en botones HTML
reales superpuestos (`country-map__hotspots`), no en hit-areas dentro del
propio SVG — más simple de hacer accesible.

**Tarjeta rica de ciudad seleccionada.** Avatar con iniciales, badge
"Activo", capital + elevación + departamento. El `<select>` nativo sigue
siendo el control real (D-03: sin librería de listbox), superpuesto
invisible sobre toda la tarjeta — un clic en cualquier punto la abre, y
el teclado/lector de pantalla usan el control real sin trabajo adicional.

**Encabezado oscuro** (gradiente navy), no blanco — contraste verificado
con la misma fórmula de WCAG: texto blanco sobre el fondo más claro del
degradado da ~11.8:1, sin problema.

**Bug real encontrado al construir las iniciales:** un filtro por longitud
de palabra (descartar palabras de ≤2 letras como conectores) le quitaba a
"La Paz" su "La" y dejaba solo "P". El error: "La" es parte del nombre en
"La Paz", pero "de"/"la" SÍ son conectores en "Santa Cruz de la Sierra" —
la misma palabra cumple los dos roles según el caso, así que ningún
filtro genérico distingue ambos correctamente. Se reemplazó por una tabla
explícita de 9 entradas (mismo criterio que D-04 aplica a las coordenadas:
con datos fijos y pocos, una tabla es más simple y más correcta que una
heurística).

---

## Mapa real y atribución (tercera revisión de fidelidad)

El usuario rechazó la silueta ilustrativa dibujada a mano del intento
anterior y pidió el contorno real de Bolivia delimitado por departamentos,
con el seleccionado resaltado — como en su diseño de Stitch.

**Fuente.** "Bolivia, administrative divisions - es - colored.svg",
Wikimedia Commons, © TUBS, licencia **CC BY-SA 4.0**.
https://commons.wikimedia.org/wiki/File:Bolivia,_administrative_divisions_-_es_-_colored.svg
Se requiere atribución y compartir bajo licencia compatible si se modifica
— cumplido: la atribución está aquí, en el comentario de cabecera de
`CountryMap.tsx`, y se listará en el README.

**Cómo se extrajeron los 9 departamentos, sin adivinar nada:**
1. El archivo trae un grupo `Departments` con exactamente 9 `<path>`, cada
   uno la forma real de un departamento — pero sin id ni nombre.
2. Se cargó el SVG en un navegador real (Playwright) y se pidió el
   `getBBox()` de cada path — un cálculo manual con regex sobre el
   atributo `d` dio resultados absurdos porque no distinguía comandos de
   path relativos de absolutos; el navegador sí los resuelve bien.
3. El archivo también trae una capa de **etiquetas de texto con los
   nombres reales** de 8 de los 9 departamentos (Cochabamba no tiene
   etiqueta propia en este archivo). Se extrajo la posición x/y de cada
   nombre real.
4. Se emparejó cada path con su nombre real por **distancia euclidiana**
   entre su centro (bbox) y la posición de la etiqueta — no por
   apariencia ni por memoria geográfica. Los 8 emparejamientos son
   inequívocos (la segunda opción más cercana queda 100-350 unidades más
   lejos que la elegida). El noveno (Cochabamba) se dedujo por
   eliminación y se confirmó visualmente: posición central, coherente.
5. Verificado visualmente coloreando los 9 departamentos con colores
   distintos y comparando contra un mapa real de Bolivia antes de
   integrarlo — no se integró a ciegas.

**Interacción.** Cada `<path>` de departamento es el elemento interactivo
real (`role="button"`, `tabIndex`, `aria-label`, `aria-pressed`, clic y
teclado) — no hay overlay de botones invisibles como en el intento
anterior; ahora las formas reales ya son áreas de clic razonables.

**Coste.** El bundle sube de ~72&nbsp;KB a ~98&nbsp;KB gzip por los datos del
mapa (coordenadas redondeadas a 1 decimal: 87&nbsp;KB → 67&nbsp;KB sin
cambio visible, verificado). Es el precio de un mapa real en vez de una
aproximación — se acepta porque el usuario lo pidió explícitamente tras
rechazar la alternativa ligera.

## Iconos propios en vez de emoji

Pedido explícito: los emoji (☀️🌦️💨📍) se leen inconsistentes entre
sistemas operativos y poco profesionales. Se reemplazaron por SVG propios
en `src/components/icons/WeatherIcon.tsx` — trazo simple, un solo color
(`currentColor`, hereda del CSS), viewBox 24×24, sin librería externa
(D-03 intacto: son componentes propios, no Material Symbols ni ningún
paquete de iconos).

`Condition.icon` cambió de un carácter emoji a una clave semántica
tipada (`WeatherIconKey`): `"clear" | "partly-cloudy" | "cloudy" | "fog" |
"drizzle" | "rain" | "snow" | "storm" | "unknown"`. TypeScript garantiza
en tiempo de compilación que `weatherCodes.ts` solo puede devolver una de
esas 9 claves — un error tipográfico en la clave ya no puede llegar a
producción silenciosamente, como sí podía pasar con un string de emoji
suelto.
