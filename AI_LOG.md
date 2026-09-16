# Registro de uso de IA

Bitácora de cada intervención relevante de herramientas de IA durante el
desafío. Se escribe **mientras ocurre**, no al final: la sección AI Usage del
README sale de aquí, y un ejemplo concreto de algo que hubo que corregir no se
puede reconstruir de memoria tres días después.

**Qué se registra:** una afirmación que no se sostuvo al verificarla, una
decisión tomada en contra de lo que sugirió la herramienta, una búsqueda propia
que cambió el rumbo, una sugerencia descartada con su razón, o un dato
confirmado contra la fuente oficial —aunque saliera correcto.

**Qué no se registra:** cada prompt escrito, erratas triviales, o cosas
aceptadas sin pensar. Un registro de cuarenta entradas irrelevantes esconde las
cinco que importan.

---

## Plantilla

```
## E-NN · [título: qué se discutió, en una frase]
- **Fecha / bloque:**
- **Tipo:** corrección · descarte · verificación · divergencia · criterio propio
- **Herramienta:**
- **Qué propuso la IA:**
- **Qué encontré o decidí yo:**
- **Cómo se resolvió:**
- **Por qué:**            ← el campo que importa. El razonamiento, no el hecho.
- **Fuente:**
- **Quién tenía razón:**  yo · la IA · ambos en parte · pendiente
- **¿Va al README?**      sí/no — y a qué punto de AI Usage responde
```

---

## Paradas planificadas

Cinco momentos donde ya se sabe que habrá algo que anotar. Los identificadores
son indicativos: las entradas se numeran por orden de aparición, y si surge
algo fuera de estas paradas se registra igual.

| Entrada | Bloque | Qué se espera registrar |
|---------|--------|-------------------------|
| E-01 | 02 · Investigación de API | Qué afirmó la IA sobre los límites del plan gratuito de OpenWeather antes de verificar, y qué decía la página oficial. |
| E-02 | 05 · Diseño con Stitch | Qué se adoptó de la referencia visual y qué se descartó (el código con Tailwind), con la razón. |
| E-03 | 07 · Capa de API | Si la primera versión generada del `fetch` omitía alguno de los cinco casos de error, y cuál. |
| E-04 | 08 · Pruebas | Qué pruebas generadas se aceptaron, cuáles hubo que reescribir, y si alguna «pasaba» sin verificar nada real. |
| E-05 | 13 · Revisión delegada | Qué encontró el subagente revisor, qué se aplicó y —sobre todo— qué se descartó y por qué. |

---

## Entradas

## E-00 · Arranque del proyecto
- **Fecha / bloque:** 15-09-2026 · Bloque 01
- **Tipo:** criterio propio
- **Herramienta:** —
- **Qué propuso la IA:** —
- **Qué encontré o decidí yo:** Empezar por investigar y decidir la API y el
  stack antes de escribir código, en lugar de arrancar por el andamiaje. Los
  cuatro primeros commits del proyecto son de documentación.
- **Cómo se resolvió:** El plan de trabajo reserva los bloques 02 y 03
  —95 minutos— a comparar alternativas y escribir las decisiones con su razón,
  antes de crear el primer archivo de código.
- **Por qué:** El enunciado pregunta explícitamente «por qué elegiste esa API».
  Una justificación construida después de la decisión no menciona las
  alternativas descartadas, y esa ausencia se nota al leerla. Escribir las
  decisiones cuando están frescas cuesta la mitad y sale más preciso.
- **Fuente:** —
- **Quién tenía razón:** —
- **¿Va al README?** Sí — «qué parte requirió más razonamiento de tu parte».

---

## E-01 · La versión de One Call estaba desactualizada y la tarjeta no estaba probada
- **Fecha / bloque:** 15-09-2026 · Bloque 02
- **Tipo:** verificación / corrección
- **Herramienta:** Claude (búsqueda web)
- **Qué propuso la IA:** Un párrafo para el README afirmando que «el endpoint de
  7 días de OpenWeather (One Call 3.0) exige registrar tarjeta de crédito».
- **Qué encontré o decidí yo:** Al revisar la afirmación contra la tabla de
  precios oficial aparecieron dos problemas. Primero, la versión vigente es
  **One Call API 4.0**, no la 3.0 que citaba. Segundo, la página describe el
  plan como *pay as you call* con **1 000 llamadas diarias gratuitas** y no
  menciona en ningún punto que se exija tarjeta: la afirmación era más fuerte
  que la evidencia disponible.
- **Cómo se resolvió:** Se corrigió la versión (4.0, no 3.0) y se retiró la
  afirmación de la tarjeta por falta de evidencia. La investigación posterior
  encontró respaldo parcial: One Call se accede mediante la suscripción «One
  Call by Call», de modelo *pay-as-you-call* con 1 000 llamadas diarias
  gratuitas. La exigencia de tarjeta sigue sin estar citada textualmente, así
  que el README dirá lo que sí está documentado: un modelo de pago por uso con
  cuota gratuita, no un plan gratuito sin condiciones.
- **Matiz posterior:** al retirar la afirmación me pasé de frenada. Retirar algo
  a «no verificado» es correcto cuando falta evidencia, pero **no equivale a
  declararlo falso**, y la investigación posterior mostró que apuntaba en la
  dirección correcta. La lección no es «verifica más» sino **distinguir tres
  estados —confirmado, refutado y sin evidencia— y redactar cada uno con las
  palabras que le corresponden**.
- **Por qué:** Un número de versión y una condición comercial son exactamente la
  clase de dato que un modelo genera por patrón en lugar de consultar: suenan
  plausibles porque son lo que el dato *debería* ser. Además envejecen — 3.0 fue
  correcto en algún momento. El error no habría fallado en ninguna prueba ni en
  ningún compilador: habría llegado intacto al README y solo se habría caído si
  alguien lo cuestionaba en la entrevista.
- **Fuente:** https://openweathermap.org/full-price · https://open-meteo.com/en/docs
- **Quién tenía razón:** yo — la revisión detectó el error de la IA
- **¿Va al README?** Sí — «un ejemplo generado por IA que tuviste que revisar o corregir»

---

## E-02 · Decidí incluir un backend en contra de la recomendación
- **Fecha / bloque:** 15-09-2026 · Bloque 03
- **Tipo:** divergencia / criterio propio
- **Herramienta:** Claude
- **Qué propuso la IA:** No construir backend. El argumento era que ninguno de
  los problemas que un backend resuelve estaba presente: sin API key que
  ocultar, con CORS habilitado, sin datos que transformar, sin cuota que
  proteger y sin persistencia. Advertía además de latencia extra y arranques en
  frío.
- **Qué encontré o decidí yo:** El análisis trataba la disponibilidad de la API
  como «un problema de ellos, no tuyo». En una prueba técnica desplegada que
  varios revisores pueden abrir en cualquier momento, eso es falso: si la API
  está caída cuando el evaluador entra, el que parece roto es mi proyecto. Los
  términos de Open-Meteo lo confirman por escrito — no garantizan disponibilidad
  ni continuidad, y se reservan bloquear IPs sin aviso previo.
- **Cómo se resolvió:** Se añade una función serverless que actúa de proxy con
  caché de CDN y `stale-while-revalidate`, en el mismo despliegue. Sirve datos
  cacheados durante 30 minutos y, si el origen falla, sigue sirviendo la última
  respuesta buena hasta 24 horas: una caída de Open-Meteo se vuelve invisible
  para el revisor.
- **Por qué:** La objeción de los arranques en frío resultó no aplicar a la
  plataforma elegida — describe a servicios de contenedor que se suspenden por
  inactividad, como los de Render o Railway, no a funciones serverless de
  Vercel. Generalizar desde una plataforma distinta es un error más sutil que
  equivocarse en un dato: el razonamiento era válido, el contexto no. Y al
  medirlo se confirmó que el riesgo tampoco era el volumen — Open-Meteo permite
  10 000 llamadas al día, 5 000 por hora y 600 por minuto, y unos cuantos
  revisores no se acercan. Era la **resiliencia**, que es otro problema y pide
  otra solución: no un backend que escale, sino una capa que sobreviva a una
  caída.
- **Fuente:** https://open-meteo.com/en/terms · https://vercel.com/docs/functions/limitations
- **Quién tenía razón:** yo
- **¿Va al README?** Sí — «qué parte requirió más razonamiento de tu parte»

---

## E-03 · Pagar un plan no compraba lo que parecía comprar
- **Fecha / bloque:** 15-09-2026 · Bloque 14
- **Tipo:** verificación
- **Herramienta:** Claude (búsqueda web)
- **Qué propuso la IA:** Al aceptar el backend pedí explícitamente «un despliegue
  que no se duerma, aun si tengo que pagar un plan». Antes de recomendar el
  gasto, la herramienta verificó los límites reales del plan gratuito.
- **Qué encontré o decidí yo:** Las funciones de Vercel **no se duermen** en el
  plan gratuito. Lo que el plan de pago añade —cinco regiones en vez de una,
  límites más altos y duración de función más larga— no cambia nada en este
  caso. Mi preocupación era legítima, pero nacía de una advertencia mal
  calibrada de la propia IA en la iteración anterior.
- **Cómo se resolvió:** Se queda en el plan gratuito. En su lugar se fija la
  región de la función en la sudamericana más cercana vía `vercel.json`: Hobby
  permite una sola región, pero se elige, y por defecto corre en Washington.
  Eso recorta latencia real sin costar nada.
- **Por qué:** Dos razones. La primera es de hecho: «dormirse» describe
  contenedores siempre-activos que se suspenden por inactividad, no funciones
  serverless, que no tienen proceso que suspender. La segunda es de diseño: con
  caché de CDN, si la respuesta está cacheada la función ni se invoca, así que
  no hay arranque en frío posible — **la arquitectura resuelve el problema mejor
  que el gasto**. Lo registro porque la dirección es la contraria a las demás
  entradas: aquí la verificación evitó un gasto que la propia herramienta había
  provocado.
- **Fuente:** https://vercel.com/docs/functions/configuring-functions/region
- **Quién tenía razón:** la IA — tras corregir su propio error anterior
- **¿Va al README?** Sí — «cómo validas los resultados»

---

## E-04 · La comparativa se hizo bajo una premisa que ya no se cumplía
- **Fecha / bloque:** 15-09-2026 · Bloque 02
- **Tipo:** divergencia
- **Herramienta:** Claude (prompt de comparación) + investigación propia
- **Qué propuso la IA:** El prompt del bloque 02 estaba redactado para «una
  aplicación puramente frontend sin backend», y no se actualizó cuando en la
  misma sesión decidimos añadir el proxy. La comparativa resultante es sólida,
  pero descansa sobre dos criterios que el backend neutraliza.
- **Qué encontré o decidí yo:** Comparé cuatro APIs contra documentación oficial,
  separando lo documentado de lo inferido, y concluí —correctamente para esa
  premisa— que «el cuello de botella real no es el volumen sino la key expuesta
  y el CORS». Con las llamadas saliendo del servidor, ninguno de los dos
  discrimina ya.
- **Cómo se resolvió:** Open-Meteo se mantiene, pero **la justificación se
  reescribe**. Con caché de 30 minutos son 48 refrescos diarios: Open-Meteo
  gasta 48 llamadas de 10 000; OpenWeather gastaría 432 de 1 000 (43 % de la
  cuota) al necesitar 9 peticiones por refresco; y Meteosource **excede** su
  límite de 400/día. Las razones pasan a ser holgura de cuota, una petición en
  lugar de nueve, y ninguna clave que gestionar.
- **Por qué:** Una decisión puede sobrevivir a un cambio de premisa y aun así
  necesitar que se reescriba su razonamiento. Mantener la justificación vieja
  sería defender la respuesta correcta con argumentos que ya no aplican, y un
  entrevistador que pregunte «si tienes backend, ¿por qué te importaba el
  CORS?» lo detecta en una frase. El fallo de proceso fue de la IA: cambiamos la
  arquitectura y no revisó qué otras decisiones dependían de la premisa anterior.
- **Beneficio inesperado:** el descarte de Meteosource mejora. Ya no se apoya en
  un directorio de terceros que afirma ausencia de CORS, sino en su propia tabla
  de precios: 432 llamadas diarias contra un límite de 400.
- **Fuente:** https://www.meteosource.com/pricing · https://open-meteo.com/en/terms
- **Quién tenía razón:** ambos en parte
- **¿Va al README?** Sí — «qué parte requirió más razonamiento de tu parte»

---

## E-05 · La firma de la función serverless estaba desactualizada
- **Fecha / bloque:** 15-09-2026 · Bloque 03
- **Tipo:** verificación / corrección
- **Herramienta:** Claude (búsqueda web)
- **Qué propuso la IA:** El código del proxy con la firma
  `export default async function handler(): Promise<Response>`.
- **Qué encontré o decidí yo:** Al verificar cómo se añade una función
  serverless en cada framework —parte de la comparativa de stacks— la
  documentación oficial mostró que para proyectos que no son Next.js la variante
  vigente es un objeto con método `fetch`:
  `export default { async fetch(request) { ... } }`.
- **Cómo se resolvió:** Se corrigió antes de escribir el archivo. De paso,
  esa misma página aportó el hallazgo más decisivo de la comparativa: el
  directorio `api/` es **agnóstico del framework** (variante `framework=other`),
  así que añadir el proxy cuesta lo mismo en los siete candidatos y ese criterio
  no discrimina.
- **Por qué:** Es el mismo patrón que E-01, en código en vez de en prosa: una
  firma que se lee perfectamente bien, que nadie había ejecutado, y que no
  habría fallado hasta el despliegue. **Verificar la forma de una API contra su
  documentación cuesta una búsqueda; descubrirlo en producción cuesta el bloque
  entero.**
- **Fuente:** https://vercel.com/docs/functions/quickstart
- **Quién tenía razón:** la IA, tras corregirse a sí misma al verificar
- **¿Va al README?** Sí — «un ejemplo generado por IA que tuviste que revisar»

---

## E-06 · El hook del plan habría pasado en silencio sobre todos los errores
- **Fecha / bloque:** 15-09-2026 · Bloque 04
- **Tipo:** corrección
- **Herramienta:** Claude
- **Qué propuso la IA:** Un hook `PostToolUse` que ejecuta `npx tsc --noEmit`
  después de cada edición de archivo, presentado como la pieza que «separa lo
  probabilístico de lo determinista».
- **Qué encontré o decidí yo:** Antes de escribirlo, probé el comando
  introduciendo un error de tipos deliberado. `npx tsc --noEmit` **salió con
  código 0**: el `tsconfig.json` de la plantilla de Vite es un archivo de
  referencias sin archivos propios, así que no comprueba nada.
  `npx tsc -b --noEmit` sí detectó el error y salió con código 2.
- **Cómo se resolvió:** El hook y el script `typecheck` usan `tsc -b --noEmit`.
  Queda anotado en `CLAUDE.md` y en el apéndice de `docs/decisiones.md` para no
  volver a caer.
- **Por qué:** Es el peor modo de fallo posible para una salvaguarda: **no
  falla, pasa**. Un hook roto que devuelve verde da confianza falsa durante todo
  el proyecto, y el error aparece mucho más tarde y más caro. La lección es
  concreta: **una verificación automática hay que verificarla haciéndola
  fallar**, no comprobando que pasa. Que pase no prueba nada.
- **Fuente:** —
- **Quién tenía razón:** yo — probar el comando antes de confiar en él
- **¿Va al README?** Sí — «un ejemplo generado por IA que tuviste que corregir»

---

## E-07 · El diseño generado incluía una afirmación de autoridad que no podíamos sostener
- **Fecha / bloque:** 15-09-2026 · Bloque 05
- **Tipo:** verificación
- **Herramienta:** Stitch (generación) + revisión propia
- **Qué propuso la IA (Stitch):** La primera generación incluyó branding de
  "RED OFICIAL DE MONITOREO ATMOSFÉRICO · ESTADO PLURINACIONAL DE BOLIVIA" y
  "NORMA OMM REGIÓN III", además de datos de humedad, presión y sensación
  térmica que no verificamos si la API los daba.
- **Qué encontré o decidí yo:** Revisé la captura contra lo que realmente
  podemos mostrar. El branding de "servicio oficial" es engañoso para un
  proyecto personal; la afirmación de "norma OMM" es un cumplimiento
  normativo no verificado. Antes de pedir su eliminación, verifiqué también
  cuáles de los cuatro datos meteorológicos extra admite la API a
  granularidad diaria (D-11): sensación térmica y viento sí, humedad y
  presión no.
- **Cómo se resolvió:** Prompt de corrección a Stitch quitando el branding
  falso y los dos datos no disponibles, añadiendo los dos que sí lo están con
  cifras reales de la API. Segunda generación correcta en los 4 estados.
- **Por qué:** Una herramienta de diseño no tiene forma de saber qué datos
  provee nuestra fuente real ni qué afirmaciones institucionales son
  apropiadas para el proyecto — genera lo que es visualmente convincente, no
  lo que es cierto. La revisión tuvo que aportar ambas cosas: criterio sobre
  qué se puede afirmar, y verificación de qué se puede mostrar.
- **Fuente:** open-meteo.com/en/docs (D-11)
- **Quién tenía razón:** yo — la revisión detectó ambos problemas antes de
  implementar
- **¿Va al README?** Sí — «qué parte requirió más razonamiento de tu parte»

---

## E-08 · La vista móvil trajo una pantalla entera fuera de alcance
- **Fecha / bloque:** 15-09-2026 · Bloque 05 (cierre)
- **Tipo:** descarte
- **Herramienta:** Stitch (generación) + revisión propia
- **Qué propuso la IA (Stitch):** Cinco pantallas móviles, sin que se le
  pidiera. Cuatro correctas (selector desplegable, cargando, error, datos en
  caché); la quinta es un pop-up de "detalle del día" que no estaba en
  ningún prompt, con índice UV, probabilidad de precipitación, ráfagas de
  viento y de nuevo humedad y presión — los dos datos que D-11 ya había
  descartado por no existir a granularidad diaria en la API.
- **Qué encontré o decidí yo:** El pop-up es una funcionalidad completa fuera
  del alcance del desafío (vista expandida por día), construida sobre datos
  que ni siquiera hemos verificado que existan. El estado de error móvil
  repite además "comprueba tu conexión a internet" (mismo problema que en
  desktop) y añade un código de estación inventado ("SLLP / Estación El
  Alto") que no tenemos. El selector desplegable trae una barra de
  navegación inferior de 4 secciones (Resumen/Capitales/Radar/Alertas) que
  no existen en una app de una sola pantalla.
- **Cómo se resolvió:** Se descarta el pop-up de detalle completo. Se
  descarta la barra de navegación inferior. El texto de error y el código de
  estación se corrigen al implementar, igual que en desktop. El selector
  desplegable en sí (sin la barra de navegación) se adopta como referencia
  para simplificar la grilla de 9 ciudades — resuelve algo que iba a hacer a
  mano.
- **Por qué:** Cuantas más pantallas se le piden a una herramienta generativa
  sin acotar el alcance, más funcionalidad inventa para "completar" la
  experiencia — es su forma de ser útil, pero cada pantalla nueva es
  superficie que hay que revisar, justificar o descartar. La disciplina no
  es "generar menos", es revisar cada pantalla contra qué pedimos realmente
  antes de aceptar nada.
- **Fuente:** —
- **Quién tenía razón:** yo — el pop-up y sus datos no sobrevivieron la
  revisión
- **¿Va al README?** Sí — «una sugerencia que decidiste no utilizar»

---

## E-09 · Un archivo de captura llegó corrupto
- **Fecha / bloque:** 15-09-2026 · Bloque 05 (cierre)
- **Tipo:** verificación
- **Herramienta:** revisión propia (comando `file`)
- **Qué propuso la IA:** —
- **Qué encontré o decidí yo:** `screen.png` del estado de carga móvil no era
  una imagen: eran 34 bytes de texto plano, `<FIFE Image failed to fetch>`.
  La descarga desde Stitch falló y guardó el mensaje de error del CDN en
  lugar del PNG.
- **Cómo se resolvió:** Se volvió a guardar la captura y se re-verificó con
  `file`: ahora es un PNG válido de 585×1497, consistente con el criterio de
  la versión de escritorio (armazón visible desde el primer frame, valores
  en skeleton, sin spinner sobre pantalla vacía). Confirmado también que la
  carpeta del pop-up de "detalle del día" (descartado en E-08) ya no está
  presente.
- **Por qué:** Antes de abrir cualquier archivo de un proveedor externo,
  vale la pena confirmar que es lo que dice ser. `file` sobre el archivo
  tardó dos segundos, evitó tratar un mensaje de error como un diseño
  válido la primera vez, y confirmó la corrección la segunda.
- **Fuente:** —
- **Quién tenía razón:** —
- **¿Va al README?** No — detalle operativo menor, no aporta a los 6 puntos
