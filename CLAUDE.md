# Clima Bolivia

Pronóstico de 7 días para las 9 ciudades capitales departamentales de Bolivia.
Desafío técnico: se evalúa **simplicidad y criterio**, no volumen de
funcionalidad. El enunciado dice explícitamente que buscan una solución «que
puedas explicar».

**Las decisiones están escritas en `docs/decisiones.md` (D-01 a D-10). Léelo
antes de proponer cambios de arquitectura; están cerradas y no se reabren sin
una razón nueva.**

## Stack

React 19 + TypeScript + Vite. CSS plano. `oxlint` como linter (viene con la
plantilla de Vite; no es ESLint). Despliegue en Vercel: frontend estático más
una función serverless en `api/`.

## Reglas del proyecto

**Dependencias.** No añadir ninguna de producción sin preguntar antes (D-03).
Sin router, sin gestor de estado, sin cliente HTTP, sin librería de CSS ni de
iconos. `fetch` nativo, `useState`, CSS propio y emoji. Las de prueba
(`devDependencies`) sí están permitidas: no llegan al bundle.

**La API.** No inventar nombres de parámetros. Los verificados son
`temperature_2m_max`, `temperature_2m_min` y `weather_code`. Si hace falta uno
nuevo, comprobarlo en https://open-meteo.com/en/docs antes de escribirlo.

**El orden de las ciudades es significativo.** La respuesta llega como array en
el orden de la petición y las coordenadas devueltas están ajustadas a la malla
del modelo, así que no se pueden emparejar comparándolas. El orden de
`src/data/cities.ts` y el de la URL deben coincidir siempre (D-05). Un
desajuste no da error: muestra el pronóstico de una ciudad bajo el nombre de
otra.

**Aislamiento del proveedor.** Ningún componente puede ver nombres crudos de la
API como `temperature_2m_max`. `weatherApi.ts` traduce a `CityForecast[]` y los
componentes solo conocen ese modelo (D-06).

**Errores.** Siempre comprobar `response.ok` — `fetch` no lanza en 4xx/5xx — y
siempre usar `AbortController` con timeout. Los cinco casos cubiertos son: red
caída, HTTP no-OK, timeout, JSON con forma inesperada y código WMO desconocido.

**La caché del proxy.** En `api/forecast.ts`, las respuestas correctas llevan
cabeceras de caché; **los fallos van siempre con `no-store`** (D-09). Cachear un
error dejaría la aplicación rota durante toda la ventana de caché.

**Textos de interfaz.** En español, directos, sin disculpas. Un mensaje de error
dice qué pasó y qué hacer, nunca un código HTTP suelto.

## Comandos

```bash
npm run dev         # desarrollo
npm run typecheck   # tsc -b --noEmit
npm run build       # tsc -b && vite build
npm run lint        # oxlint
npm run test        # vitest (desde el bloque 08)
```

**Importante:** para verificar tipos hay que usar `tsc -b --noEmit`, no
`tsc --noEmit`. El `tsconfig.json` raíz es un archivo de referencias sin
archivos propios, así que `tsc --noEmit` devuelve éxito aunque haya errores de
tipos. Verificado el 15-09-2026 introduciendo un error deliberado.

## Forma de trabajo

- Antes de un cambio que toque más de un archivo, proponer el plan y esperar
  aprobación.
- Commits pequeños, uno por bloque de trabajo, con mensaje que describa lo que
  el commit realmente contiene.
- Al corregir algo que la IA generó mal, o al descartar una sugerencia,
  registrarlo en `AI_LOG.md` con el razonamiento — no solo el hecho.
- No escribir en el código ninguna cifra o afirmación que no se haya verificado
  contra su fuente.
