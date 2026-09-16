# Clima Bolivia — Pronóstico de 7 días

Aplicación web que muestra el pronóstico de los próximos siete días para las
nueve capitales departamentales de Bolivia.

**Aplicación desplegada:** <https://clima-bolivia-theta.vercel.app/>
**Repositorio:** <https://github.com/MarlonTMF/Clima_Bolivia>

![Vista de escritorio de la aplicación](docs/img/captura-escritorio.png)

<details>
<summary><strong>&#9660; Ver la vista móvil (390 px)</strong></summary>

<img src="docs/img/captura-movil.png" alt="Vista móvil de la aplicación" width="390">

</details>

---

## Cómo ejecutar el proyecto

**Requisitos:** Node.js 20 o superior (desarrollado con la 24.14.0) y npm.
No hace falta ninguna clave de API ni archivo `.env`: la API elegida no pide
autenticación.

```bash
git clone https://github.com/MarlonTMF/Clima_Bolivia.git
cd Clima_Bolivia
npm install
npm run dev          # http://localhost:5173
```

### Todos los comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila tipos y genera `dist/` para producción |
| `npm run preview` | Sirve el `dist/` ya compilado |
| `npm run test` | 19 pruebas con Vitest |
| `npm run typecheck` | Comprobación de tipos |
| `npm run lint` | oxlint |
| `npm run audit` | Auditoría propia de fallos silenciosos (ver más abajo) |
| **`npm run check`** | **Los cinco anteriores en orden. Es el que se ejecuta antes de cada commit** |

Una nota sobre `typecheck`: usa `tsc -b --noEmit`, no `tsc --noEmit`. El
`tsconfig.json` raíz es un archivo de referencias sin archivos propios, así
que `tsc --noEmit` **devuelve éxito aunque haya errores de tipos**. Se
descubrió introduciendo un error a propósito para comprobar que el hook de
verificación servía de algo, y no servía.

---

## Tecnologías

| Pieza | Elección | Por qué |
|---|---|---|
| Framework | React 19 | Componentización y tipado, y es lo más reconocible para quien evalúa. Svelte habría sido más ligero; se eligió React por familiaridad, no por superioridad técnica |
| Lenguaje | TypeScript | Tipar la respuesta de la API convierte un error de mapeo en un fallo de compilación en vez de en una pantalla en blanco |
| Build | Vite | Un comando para arrancar y para compilar, sin configuración |
| Estilos | CSS plano | Sin framework: son unas 970 líneas que se pueden explicar una a una |
| Pruebas | Vitest + Testing Library | 19 pruebas: lógica, mapeo de la API, los cinco casos de error y los cuatro estados de la interfaz |
| Linter | oxlint | Viene con la plantilla de Vite |
| Despliegue | Vercel (plan gratuito) | Sitio estático servido desde CDN |

### Dependencias de producción: dos

```json
"dependencies": { "react": "^19.2.8", "react-dom": "^19.2.8" }
```

**Eso es todo.** Sin router, sin gestor de estado, sin cliente HTTP, sin
librería de CSS, sin librería de iconos, sin librería de fechas. Para una
sola pantalla, cada dependencia sería una decisión más que defender y una
superficie más que explicar:

- **Sin router**, porque no hay rutas: una vista con cuatro estados.
- **Sin gestor de estado**, porque el estado son cuatro `useState` en el
  componente raíz.
- **Sin cliente HTTP**: `fetch` nativo cubre el caso, incluido el timeout con
  `AbortController`.
- **Sin librería de iconos**: los iconos meteorológicos son SVG escritos a
  mano, unas pocas líneas cada uno. Empezaron siendo emoji y se retiraron
  porque se renderizan distinto en cada sistema operativo.
- **Sin librería de fechas**: el formato lo resuelve `Intl.DateTimeFormat`,
  que está en el navegador.

Las dependencias de **desarrollo** sí existen —Vitest, Testing Library,
jsdom, TypeScript— y no contradicen lo anterior: no entran en el paquete
final ni llegan al usuario.

El resultado compilado son **99 KB comprimidos**, de los que unos 68 KB son
React. Ese peso es la contrapartida asumida de la decisión.

---

## La API: Open-Meteo, y por qué

Se compararon cuatro opciones contra su documentación oficial **antes** de
elegir, no después.

| API | 7 días diarios en plan gratuito | Clave | Peticiones para 9 ciudades | Veredicto |
|---|---|---|---|---|
| **Open-Meteo** | Sí | **No requiere** | **1** | **Elegida** |
| OpenWeather | Vía *One Call*, modelo de pago por uso con 1 000 llamadas diarias gratis | Sí | 9 | Descartada |
| WeatherAPI.com | **No: sólo 3 días** | Sí | 9 | Descartada por no cumplir el requisito |
| Meteosource | Sí | Sí | 9 | Descartada: 9 llamadas por carga sobre un límite de 400 diarias |

Las tres razones de la elección:

1. **Cobertura del requisito.** WeatherAPI ofrece tres días en su plan
   gratuito y el desafío pide siete. Queda fuera por no cumplir, no por
   preferencia.
2. **Una petición en lugar de nueve.** Open-Meteo acepta varias coordenadas
   en la misma llamada. Es la decisión de rendimiento más grande del
   proyecto y sale gratis.
3. **Superficie operativa cero.** Sin clave, sin cuenta que mantener, sin
   secreto que rotar y sin backend necesario para ocultarlo.

**La limitación real, dicha por delante:** el uso gratuito de Open-Meteo es
**no comercial**, bajo licencia CC-BY 4.0. Si este proyecto pasara a uso
comercial habría que pagar su plan o reevaluar OpenWeather — que además
exigiría un backend propio para no exponer la clave en el navegador.

---

## Ventajas y limitaciones

### Ventajas

- **Carga completa en 1,5–1,9 s** hasta ver datos en pantalla, medido sobre
  el despliegue real: mediana de cinco cargas, 1 896 ms en Chromium y
  1 463 ms en Firefox. First Contentful Paint de 1,4–1,7 s.
- **Lighthouse 99-100 en rendimiento, 100 en accesibilidad, 100 en prácticas
  recomendadas y 100 en SEO**, medido en producción.
- **Cumulative Layout Shift de 0**: la página no da ningún salto al llegar
  los datos, porque el estado de carga reserva el espacio exacto que
  ocupará el contenido.
- **Funciona sin conexión a la API** si ya se había cargado antes: muestra la
  última lectura guardada avisando de su antigüedad.
- **Cambiar de proveedor de clima costaría tocar un archivo**, porque la
  respuesta cruda nunca sale de `weatherApi.ts`.
- **Añadir ciudades es una línea** en `src/data/cities.ts`.

### Limitaciones

- **No hay temperatura actual.** La API entrega pronóstico diario, no
  lecturas instantáneas. El número grande del panel es la **máxima de hoy** y
  está etiquetado como tal: inventar una «temperatura actual» a partir de un
  máximo diario habría sido presentar un dato que no se tiene.
- **Los datos se piden una sola vez, al abrir la página.** No hay refresco
  automático, y el pie lo dice literalmente. La copia local es un respaldo
  ante fallos, no una caché que evite peticiones.
- **Sólo nueve ciudades, fijas en el código.** No hay buscador ni geocoding:
  el enunciado pide exactamente esas nueve y son un dato estable.
- **Sin backend.** Se diseñó un proxy con caché y **se decidió no
  construirlo**; el razonamiento completo está en D-09 de
  [`docs/decisiones.md`](docs/decisiones.md).
- **No probado en un teléfono físico.** Se verificó a 375 px en navegadores
  de escritorio, que no reproduce el táctil ni la red móvil.
- **El orden de `cities.ts` está acoplado al de la petición.** Es
  deliberado y está documentado, pero es una trampa real para quien lo toque
  sin leer: hay una prueba que la vigila.

---

## Calidad y pruebas

`npm run test` ejecuta **19 pruebas** repartidas en cinco archivos:

| Nivel | Qué cubre |
|---|---|
| Lógica de dominio | Traducción de los 28 códigos WMO documentados y su valor neutro; formato de fecha sin desfase de zona horaria |
| Mapeo de la API | La respuesta real guardada en `docs/api-sample.json` → el modelo propio |
| Casos de error | Red caída, HTTP 500, timeout abortado, JSON con forma inesperada y camino correcto |
| Invariante de orden | Que la petición pida las coordenadas en el mismo orden que `CITIES` |
| Componentes | Tarjeta de día, cambio de ciudad, y los cuatro estados de la aplicación |

Además, **12 casos manuales ejecutados sobre el despliegue en producción**,
en Chromium y en Firefox, con el resultado real anotado en
[`docs/pruebas.md`](docs/pruebas.md) — incluidos los que hubo que
replantear porque no probaban lo que decían.

### La prueba que más importa

La API devuelve un array **en el orden de la petición**. Si ese orden se
rompiera, cada ciudad mostraría el clima de otra sin error, sin excepción y
sin pista: es el único fallo verdaderamente silencioso del proyecto. Hay una
prueba que compara los parámetros de la URL contra `CITIES`, y se comprobó
que sirve invirtiendo el orden a propósito — al hacerlo falla ella sola,
mientras las otras seis del archivo siguen en verde.

### `npm run audit`

Casi todos los errores reales de este proyecto fueron del mismo tipo: **código
válido que no falla y no hace nada**. Una regla CSS apuntando a una clase
inexistente, un contorno de foco sobre un elemento con `opacity: 0`, un
`flex-direction` en un contenedor que a ese ancho es `grid`. `tsc` y `oxlint`
no los ven porque comprueban sintaxis y tipos, no efecto.

`scripts/audit.mjs` cubre esas seis categorías. Cada una existe porque ese
error se cometió aquí, y se verificó reintroduciéndolos uno a uno en lugar de
dar la auditoría por buena por estar escrita.

### Qué se decidió NO probar

Sin pruebas de extremo a extremo permanentes (Playwright se usó como
herramienta puntual, no como dependencia), sin instantáneas, sin objetivo de
cobertura porcentual, sin pruebas de carga y sin probar React ni `fetch`. El
razonamiento de cada exclusión está en [`docs/pruebas.md`](docs/pruebas.md).

---

## Decisiones técnicas principales

Las catorce están razonadas en [`docs/decisiones.md`](docs/decisiones.md) con
su contexto, alternativas y consecuencia. En resumen:

| Decisión | Por qué |
|---|---|
| **Una sola petición** para las nueve ciudades | Nueve habrían sido nueve formas de fallar parcialmente y nueve veces la latencia |
| **El orden de `cities.ts` es significativo** | La respuesta llega en el orden pedido y las coordenadas vuelven ajustadas a la malla del modelo, así que no se pueden reemparejar. El acoplamiento es la solución correcta, y una prueba lo vigila |
| **La respuesta cruda no sale de `weatherApi.ts`** | Ningún componente ve un `temperature_2m_max`. Cambiar de proveedor sería tocar un archivo |
| **Ocho categorías de clima, no treinta códigos** | Nadie necesita distinguir «llovizna helada ligera» de «densa». Los códigos desconocidos caen en un valor neutro |
| **El diseño se generó con IA; su código, no** | El export traía Tailwind, iconos y cientos de líneas que no se podrían explicar. Se usó como especificación visual y se implementó a mano |
| **Cuatro estados, no tres** | Un fallo con copia guardada no es lo mismo que uno sin ella: hay datos reales, sólo que viejos |
| **Sin backend** | Se diseñó un proxy con caché y se decidió no construirlo: el problema de resiliencia era real, pero la solución desproporcionada para este alcance. El diseño se conserva escrito y sólo se implementó su capa cliente, la copia en el navegador |

---

## Estructura

```
src/
├── data/cities.ts          las 9 ciudades — el orden es significativo
├── lib/
│   ├── weatherApi.ts       fetch, validación y mapeo al modelo propio
│   ├── weatherCodes.ts     códigos WMO → etiqueta e icono
│   ├── forecastCache.ts    copia local de la última respuesta correcta
│   └── formatDate.ts       fechas sin desfase de zona horaria
├── components/             nunca ven la forma cruda de la API
├── types.ts                el modelo de la aplicación
└── index.css               todos los estilos

docs/
├── decisiones.md           las 14 decisiones, con alternativas y consecuencias
├── pruebas.md              matriz manual, navegadores y Lighthouse
├── api-sample.json         respuesta real de la API, usada como fixture
└── design/                 la referencia visual generada y sus tokens

scripts/audit.mjs           auditoría de fallos silenciosos
AI_LOG.md                   bitácora de uso de IA, con las correcciones
```

---

## AI Usage

Todo lo que sigue sale de [`AI_LOG.md`](AI_LOG.md), una bitácora con **21
entradas** escritas durante el desarrollo, no reconstruidas al final. Cada
una registra qué propuso la herramienta, qué encontré al comprobarlo, cómo se
resolvió y por qué. Esta sección es un resumen; el detalle está allí.

### Qué herramientas y para qué

| Herramienta | Uso |
|---|---|
| **Claude Code** | Asistente principal durante todo el desarrollo: código, documentación y verificación conduciendo un navegador real |
| **Google Stitch** | Referencia visual de las cuatro pantallas. **Su código no entró al proyecto** |
| **Subagente revisor propio** | Definido en `.claude/agents/revisor.md`, con permisos de sólo lectura, para revisar `src/` antes de entregar |
| **Búsqueda web** | Verificar contra documentación oficial cada dato de API, límites y precios |

### Cómo la usé

Con una regla de fondo: **la IA propone, yo verifico, y lo que entra al
repositorio es responsabilidad mía**. En la práctica eso fue:

- Escribir las decisiones cuando se tomaban, con contexto y alternativas, en
  vez de justificar al final lo ya hecho.
- Comprobar contra la fuente todo dato de versiones, límites o precios.
- Verificar el **efecto** y no el artefacto: mirar el píxel, no la regla CSS;
  comprobar qué hizo el comando, no que terminara sin error.
- Registrar en la bitácora cada corrección **y también los casos en que la
  herramienta tenía razón y yo no**. Un registro donde la persona siempre
  acierta se lee como fabricado.

### Un ejemplo que tuve que corregir

Para justificar la elección de API, la herramienta redactó este párrafo:

> «El endpoint de 7 días de OpenWeather (One Call 3.0) exige registrar tarjeta
> de crédito.»

Suena plausible y **tenía dos problemas**. La versión vigente es **One Call
API 4.0**, no la 3.0. Y la página oficial de precios describe un modelo *pay
as you call* con 1 000 llamadas diarias gratuitas, **sin mencionar en ningún
punto la exigencia de tarjeta**: la afirmación era más fuerte que la
evidencia.

Un número de versión y una condición comercial son justo la clase de dato que
un modelo genera por patrón en vez de consultar — suenan bien porque son lo
que el dato *debería* ser, y además envejecen: la 3.0 fue correcta en algún
momento. **Ningún compilador ni prueba habría detectado ese error**; habría
llegado intacto al README y sólo se habría caído si alguien lo cuestionaba.

Hay un matiz que también quedó registrado: al retirar la afirmación me pasé
de frenada. Retirar algo por falta de evidencia es correcto, pero **no
equivale a declararlo falso**, y la investigación posterior mostró que
apuntaba en la dirección correcta. La lección no fue «verifica más» sino
distinguir tres estados —confirmado, refutado y sin evidencia— y redactar
cada uno con las palabras que le corresponden.

### Una sugerencia que decidí no utilizar

El subagente revisor señaló que `Math.round(-2.5)` devuelve `-2` y no `-3`,
porque JavaScript redondea hacia +∞. **Es cierto, y lo comprobé.** Aun así no
lo apliqué: el caso sólo se dispara en un empate exacto de medio grado, el
desvío es de medio grado, y corregirlo pedía una función de redondeo propia.
Añadir código para eso es exactamente la sobre-ingeniería que el enunciado
pide evitar.

Es el descarte que mejor ilustra el criterio, precisamente porque **la
sugerencia era técnicamente correcta**: rechazarla no fue detectar un error
suyo, fue decidir que el arreglo costaba más de lo que valía.

El otro descarte grande fue estructural: el código que exportó Stitch. Traía
Tailwind, una librería de iconos y cientos de líneas de marcado que no podría
explicar clase por clase. Se tomó el diseño como especificación visual y se
implementó a mano.

### Qué requirió más razonamiento propio

**La decisión del backend, que cambió tres veces.** Primero se descartó, luego
se revirtió al encontrar dos fallos reales en ese razonamiento —tratar la
disponibilidad del proveedor como problema ajeno, y una objeción sobre
arranques en frío que describía otra plataforma—, se diseñó por completo, y
finalmente **se decidió no construirlo**: el problema de resiliencia era real,
pero la solución desproporcionada para este alcance. Cada vuelta incorporó
información que la anterior no tenía, y la tercera fue la propia aplicación
terminada y verificada.

**Y decidir qué NO probar, qué NO añadir y qué NO construir.** Es donde la
herramienta ayuda menos: siempre puede proponer una prueba más, una
abstracción más o una capa más, y ninguna de esas propuestas viene marcada
como innecesaria.

### Cómo valido los resultados

Al revisar la bitácora entera apareció que los errores del proyecto **no eran
variados: eran ocho instancias del mismo tipo**. Código válido que no produce
ningún error y simplemente no hace nada — una clase CSS inexistente, un
contorno de foco sobre `opacity: 0`, un `flex-direction` en un contenedor
`grid`, Testing Library que nunca desmontaba y hacía que las pruebas pasaran
por casualidad.

La causa común era **verificar el artefacto en vez del efecto**. La
consecuencia fue `npm run audit`, seis comprobaciones automáticas, una por
cada categoría que se dio aquí — y verificadas reintroduciendo los errores
uno a uno para comprobar que la auditoría los detecta de verdad.

Las otras tres reglas que salieron de ahí:

1. **Una prueba no vale hasta verla fallar.** La del orden de las ciudades se
   comprobó invirtiéndolo a propósito: al hacerlo, las otras seis del archivo
   seguían en verde. Esa era exactamente la razón de escribirla.
2. **Ninguna cifra sin medir.** El peso del paquete se estimó en ~42 KB y
   midió 68,60. El tiempo de carga se estimó en 280–760 ms y midió ~1 700.
3. **Si un arreglo no funciona, aislar en vez de encadenar otro.** Con el
   fallo de Testing Library, dos intentos basados en una hipótesis equivocada
   costaron más que mover la prueba a un archivo propio, que dio la respuesta
   exacta en dos minutos.

### Qué salió mal, dicho sin adornos

Tres de las cuatro pantallas del diseño estuvieron **sin implementar durante
cuatro bloques** y lo detecté mirando la aplicación, no ninguna verificación.
El motivo es instructivo: todas las comprobaciones esperaban a que
aparecieran los datos, así que **se saltaban por construcción los estados de
carga y de error**. Y el título de la pestaña estuvo diciendo `scaffold` —el
valor de la plantilla de Vite— hasta que lo encontró el revisor delegado, con
la aplicación ya en producción.

Ninguna de las dos cosas la encontró una herramienta automática. Las dos están
en la bitácora con su fecha.

---

## Créditos

- Datos meteorológicos: [Open-Meteo](https://open-meteo.com/), CC-BY 4.0.
- Mapa de departamentos: derivado de
  [«Bolivia, administrative divisions»](https://commons.wikimedia.org/wiki/File:Bolivia,_administrative_divisions_-_es_-_colored.svg)
  de TUBS en Wikimedia Commons, CC BY-SA 4.0.
