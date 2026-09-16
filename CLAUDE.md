# Clima Bolivia

Pronóstico de 7 días para las 9 ciudades capitales departamentales de Bolivia.
Desafío técnico: se evalúa **simplicidad y criterio**, no volumen de
funcionalidad. El enunciado dice explícitamente que buscan una solución «que
puedas explicar».

**Las decisiones están escritas en `docs/decisiones.md` (D-01 a D-12). Léelo
antes de proponer cambios de arquitectura; están cerradas y no se reabren sin
una razón nueva.**

## Stack

React 19 + TypeScript + Vite. CSS plano. `oxlint` como linter (viene con la
plantilla de Vite; no es ESLint). Despliegue en Vercel: **sitio estático, sin
backend**. El navegador llama a Open-Meteo directamente. Se diseñó una función
serverless de proxy con caché y finalmente **no se construyó** (D-09): no
existe `api/forecast.ts` ni `vercel.json`.

## Reglas del proyecto

**Dependencias.** No añadir ninguna de producción sin preguntar antes (D-03).
Sin router, sin gestor de estado, sin cliente HTTP, sin librería de CSS ni de
iconos. `fetch` nativo, `useState`, CSS propio y **SVG propios** para los
iconos — nada de emoji en la interfaz: se reemplazaron porque restaban
profesionalidad. Las de prueba
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

**Sin caché de ningún tipo.** `App.tsx` hace un solo `fetch` al montar y no
vuelve a pedir nada; no hay proxy, ni cabeceras de caché, ni `localStorage`
(D-09). Cualquier texto de interfaz que prometa una frecuencia de
actualización sería falso.

**Textos de interfaz.** En español, directos, sin disculpas. Un mensaje de error
dice qué pasó y qué hacer, nunca un código HTTP suelto.

## Comandos

```bash
npm run dev         # desarrollo
npm run check       # los cinco de abajo, en orden — usa este antes de comitear
npm run typecheck   # tsc -b --noEmit
npm run test        # vitest
npm run build       # tsc -b && vite build
npm run lint        # oxlint
npm run audit       # fallos silenciosos que tsc y oxlint no ven
```

**Importante:** para verificar tipos hay que usar `tsc -b --noEmit`, no
`tsc --noEmit`. El `tsconfig.json` raíz es un archivo de referencias sin
archivos propios, así que `tsc --noEmit` devuelve éxito aunque haya errores de
tipos. Verificado el 15-09-2026 introduciendo un error deliberado.

## La clase de error que más ha costado en este proyecto

Casi todos los errores reales tuvieron la misma forma: **código válido que no
produce ningún error y simplemente no hace nada**. No hay traza, no hay aviso,
y la herramienta sale con código 0. Ocurrieron:

| Qué se escribió | Qué pasó de verdad |
|---|---|
| `.city-selector__elevation` en el CSS | El componente usa `city-card__elevation`: regla muerta |
| `outline` en un `<select>` con `opacity: 0` | La opacidad se aplica también al contorno: foco invisible |
| `flex-direction: row` en una tarjeta | A ese ancho es `display: grid`: la propiedad se ignora (**pasó dos veces**) |
| `border-style: dashed` antes de la clase base | `border: 1px solid` gana por orden de cascada |
| Testing Library sin `cleanup()` | Nunca desmontó: las pruebas pasaban por casualidad |
| `tsc --noEmit` sin `-b` | Sale con éxito aunque haya errores de tipos |
| `defineConfig` de `vite` con campo `test` | Los tests pasan, el typecheck falla |
| `<title>scaffold</title>` | HTML válido, en producción cuatro días |

**La causa común: verificar el artefacto en vez del efecto.** Leer la regla CSS
en lugar de mirar el píxel; ejecutar el comando en lugar de comprobar qué hizo;
dar por buena una suite verde sin preguntar si podría fallar.

**La causa secundaria: verificar sólo el camino feliz.** Las pantallas de carga
y de error no se ven si la API responde, así que tres de las cuatro pantallas
del diseño estuvieron sin implementar durante cuatro bloques. Peor: las propias
comprobaciones con Playwright esperaban `.forecast-card`, es decir, **esperaban
a que el esqueleto desapareciera** — estaban construidas para saltarse justo lo
que faltaba.

### Qué hacer en consecuencia

1. **`npm run audit` antes de comitear** (va dentro de `npm run check`).
   Comprueba lo que `tsc` y `oxlint` no pueden: reglas CSS muertas, clases sin
   estilos, flex mezclado con grid, contornos de foco sobre elementos
   invisibles, la limpieza de Testing Library y textos que prometen una
   frecuencia que el código no cumple. Cada comprobación existe porque ese
   error se cometió de verdad aquí.
2. **Una prueba nueva no vale hasta verla fallar.** Romper a propósito lo que
   afirma y comprobar que se pone en rojo. Se hizo con la del orden de las
   ciudades: al invertirlo, las otras seis del archivo seguían en verde.
3. **Verificar estados, no páginas.** Al tocar la interfaz, provocar carga,
   error y datos antiguos interceptando la red, en escritorio y a 375 px.
   Comprobar `scrollWidth > clientWidth` en los cuatro estados, no sólo en el
   normal: el desbordamiento del esqueleto móvil sólo apareció así.
4. **Si un arreglo no funciona, no probar otro: aislar.** Con el `cleanup` de
   Testing Library, dos intentos basados en una hipótesis equivocada costaron
   más que mover la prueba a un archivo propio, que dio la respuesta exacta.
5. **Ninguna cifra sin medir.** El peso del bundle se estimó en ~42 KB y midió
   68,60; el tiempo de carga se estimó en 280–760 ms y midió ~1 680 ms.

## Forma de trabajo

- Antes de un cambio que toque más de un archivo, proponer el plan y esperar
  aprobación.
- Commits pequeños, uno por bloque de trabajo, con mensaje que describa lo que
  el commit realmente contiene.
- Al corregir algo que la IA generó mal, o al descartar una sugerencia,
  registrarlo en `AI_LOG.md` con el razonamiento — no solo el hecho.
- No escribir en el código ninguna cifra o afirmación que no se haya verificado
  contra su fuente.
