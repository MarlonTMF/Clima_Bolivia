# Pruebas y calidad

Ejecutado el **16-09-2026** contra el despliegue de producción,
<https://clima-bolivia-theta.vercel.app/>, no en local.

## Automatizadas

`npm run test` — **19 pruebas en 5 archivos**. Cubren la traducción de códigos
WMO, el formato de fechas con zona horaria, el mapeo de la respuesta real de
la API, los cinco casos de error, el orden de la petición, el renderizado de
una tarjeta y los cuatro estados de la aplicación.

`npm run check` encadena las cinco comprobaciones que deben pasar antes de
cualquier commit: `typecheck`, `test`, `build`, `lint` y `audit`.

`npm run audit` es propio del proyecto y comprueba la clase de error que más
ha costado aquí: código válido que no falla y no hace nada. Reglas CSS que
apuntan a clases inexistentes, clases usadas sin estilos, propiedades de flex
en contenedores grid, contornos de foco sobre elementos con `opacity: 0`, la
limpieza de Testing Library y textos de interfaz que prometen una frecuencia
de actualización que el código no cumple. Cada comprobación existe porque ese
error se cometió de verdad en este proyecto.

## Matriz manual

Los doce casos se ejecutaron **en Chromium y en Firefox** conduciendo el
navegador con Playwright contra la URL de producción. La columna «obtenido»
recoge el valor real observado, no una marca de aprobado.

| ID | Caso | Pasos | Esperado | Obtenido | Estado |
|------|------|-------|----------|----------|--------|
| M-01 | Carga inicial | Abrir la URL | 9 ciudades en menos de 2 s | 9 ciudades. Mediana de 5 cargas: **1 896 ms** en Chromium, **1 463 ms** en Firefox. Rango 1 358–2 381 ms | Pasa con matiz |
| M-02 | Selección de ciudad | Elegir Potosí | 7 días con datos de Potosí | «Potosí», 7 tarjetas | Pasa |
| M-03 | Rango extremo | Comparar Potosí y Santa Cruz | Temperaturas muy distintas, sin desbordes | Potosí 17° · Santa Cruz 26° (9° de diferencia), sin desborde | Pasa |
| M-04 | Primera fecha | Mirar el primer día | Es hoy, no ayer | «Mié 16 sep» con distintivo HOY; hoy en Bolivia era 2026-09-16 | Pasa |
| M-05 | Sin conexión | Red caída con la app abierta | Mensaje de error y botón Reintentar | «No se pudo actualizar el pronóstico de Sucre» con su botón | Pasa |
| M-06 | Reintento | Restaurar red y pulsar Reintentar | Carga los datos correctamente | Recupera los 7 días | Pasa |
| M-07 | Servicio caído | La API responde HTTP 500 | Mensaje claro, nunca pantalla en blanco | Pantalla de error; sin pantalla en blanco; **el texto técnico no se filtra** | Pasa |
| M-08 | Móvil 375 px | Abrir a 375 px de ancho | Sin scroll horizontal, texto legible | Sin scroll horizontal; mapa visible. La fuente más pequeña era de 8,8 px — **se corrigió a 10,4 px** | Pasa tras corrección |
| M-09 | Navegación por teclado | Enfocar el selector | Foco visible, se alcanza todo | El contorno se dibuja en la tarjeta (`solid 2px`); 10 elementos alcanzables | Pasa |
| M-10 | Temperatura negativa | Ver las mínimas de Potosí | Se muestran sin romper la tarjeta | Mínimas 2° 3° 3° 0° 0° 2° 3°. **Ninguna negativa ese día**: el caso queda cubierto por la prueba automática de `ForecastCard`, que usa −2° y −6° | Pasa parcialmente |
| M-11 | Estado de carga | Retener la respuesta de la API | Esqueleto con la estructura completa | Esqueleto de 7 tarjetas; el selector sigue utilizable durante la carga | Pasa |
| M-12 | Datos antiguos | Envejecer la copia y cortar la API | Aviso de antigüedad con los datos visibles | «Mostrando datos de hace 2 horas», 7 días aún visibles | Pasa |

**23 de 24 comprobaciones pasaron en la primera ejecución completa** (doce
casos × dos navegadores). La única discrepancia fue M-01 en Chromium con
2 015 ms frente al umbral de 2 000: quince milisegundos, que es ruido y no un
fallo. Repetir la medición cinco veces dio una mediana de 1 896 ms.

### El caso M-11 anterior, retirado

La matriz planificada tenía un caso M-11 distinto: comprobar si el CDN seguía
sirviendo contenido cacheado con el origen caído. Se retiró al descartarse el
proxy (D-09): sin CDN propio no hay comportamiento de caché que comprobar. El
M-11 actual es otro caso, nacido de los estados de D-13.

### Dos casos que hubo que replantear

**M-05 no era verificable como estaba escrito.** Decía «desactivar red y
recargar», pero sin red no llega ni el HTML: lo que se ve entonces es la
pantalla de error del navegador, no la de la aplicación. El caso se
reformuló a lo que sí prueba el manejo de errores: la red se cae **con la
aplicación ya cargada**.

**M-09 no comprobaba lo que decía.** La primera versión pulsaba Tab dos veces
y miraba dónde caía el foco — que resultó ser un departamento del mapa, no el
selector. Se cambió a enfocar el control explícitamente y comprobar el
contorno.

### Un fallo de la propia verificación

Al ejecutar la matriz, las esperas por `.forecast-card` se cumplían **con el
esqueleto de carga**, porque sus tarjetas comparten esa clase para heredar los
estilos. Estaban midiendo el tiempo hasta que aparece el esqueleto, no hasta
que hay datos. Se corrigió esperando por `.today-hero__city`, que sólo existe
cuando hay datos reales. Es el mismo patrón que `npm run audit` vigila: algo
que parece correcto y mide otra cosa.

## Navegadores

| Navegador | Versión | Resultado |
|-----------|---------|-----------|
| Chromium (Playwright) | 143 | 12 de 12 casos |
| Firefox (Playwright) | 155.0 | 12 de 12 casos |
| Teléfono real | — | **Pendiente**: sólo se probó a 375 px en un navegador de escritorio, que no es lo mismo |

**Una incidencia no reproducida:** durante una tanda de mediciones, una carga
en Firefox superó los 25 s de espera. No volvió a ocurrir en ocho intentos
posteriores, y la API respondía con normalidad (HTTP 200 en ~0,9 s) al
comprobarlo. Queda anotado sin explicación en lugar de omitirlo.

## Lighthouse (producción)

| Métrica | Objetivo | Obtenido |
|---------|----------|----------|
| Rendimiento | ≥ 90 | **100** |
| Accesibilidad | ≥ 95 | **100** |
| Prácticas recomendadas | ≥ 95 | **100** |
| SEO | ≥ 90 | **90** en la primera pasada — faltaba la `meta description`. Corregida y añadido `robots.txt`; el número de la segunda medición está más abajo |

Métricas de carga: First Contentful Paint 1,4 s · Largest Contentful Paint
1,4 s · Total Blocking Time 60 ms · **Cumulative Layout Shift 0**.

El CLS en cero merece una nota: es la consecuencia medible del esqueleto de
carga. Como reserva el mismo espacio que ocupará el contenido, la página no
da ningún salto cuando llegan los datos.

Las 21 auditorías de accesibilidad pasan. El único punto que restaba era la
ausencia de `meta description`, corregida.

## Qué NO se prueba, y por qué

- **Sin pruebas de extremo a extremo permanentes** (Playwright, Cypress como
  dependencia): una sola pantalla. El recorrido crítico queda cubierto por
  las pruebas de componente y por los casos M-01 a M-06. Playwright se usa
  como herramienta de verificación puntual —se instala, se conduce el
  navegador y se desinstala— pero no forma parte del proyecto: mantener esa
  infraestructura costaría más que el valor que aporta a esta escala.
- **Sin pruebas de instantánea**: se rompen con cada ajuste de estilo y no
  afirman nada sobre el comportamiento.
- **Sin objetivo de cobertura porcentual**: perseguir el número lleva a
  probar código trivial. Se declara qué está cubierto y qué no.
- **Sin pruebas de carga**: sitio estático servido por CDN, sin escrituras y
  con un techo fijo de 9 ciudades × 7 días.
- **Sin probar React ni `fetch`**: son dependencias, no código propio.
- **Sin probar en un teléfono real**, que es la única fila de la tabla de
  navegadores que queda abierta. Un viewport de 375 px en un navegador de
  escritorio no reproduce el táctil, la densidad de píxeles ni la red móvil.
