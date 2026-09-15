# Prompts para generar la referencia visual

Herramienta: Google Stitch. **El resultado se usa como especificación visual, no
como fuente de código** (D-08): de él se extraen paleta, escala tipográfica,
espaciado y composición; el markup que genera —con Tailwind— no entra en `src/`
porque contradiría D-03.

Los datos de ejemplo son **reales**, tomados de `docs/api-sample.json`
(15-09-2026). Un prompt con valores genéricos produce un diseño genérico.

---

## 1 · Pantalla principal, escritorio

```
Diseña la pantalla principal de una aplicación web de pronóstico del clima
para las 9 ciudades capitales departamentales de Bolivia.

CONTENIDO
- Un selector con las 9 ciudades: Sucre, La Paz, Cochabamba, Oruro, Potosí,
  Tarija, Santa Cruz de la Sierra, Trinidad y Cobija. Los nombres son de
  longitud muy dispar: "Oruro" tiene 5 caracteres y "Santa Cruz de la Sierra"
  tiene 23. El selector debe aguantar ambos sin romperse ni truncar.
- Para la ciudad seleccionada, el pronóstico de los próximos 7 días.
- Cada día muestra cuatro datos: fecha abreviada en español, temperatura
  máxima, temperatura mínima y la condición climática.

DATOS DE EJEMPLO — son reales, úsalos tal cual
La Paz está seleccionada.
  Mar 15 sep · máx 18° · mín -2° · Parcialmente nublado
  Mié 16 sep · máx 16° · mín  2° · Llovizna
  Jue 17 sep · máx 18° · mín  3° · Llovizna
  Vie 18 sep · máx 15° · mín  3° · Lluvia
  Sáb 19 sep · máx 14° · mín  2° · Lluvia
  Dom 20 sep · máx 17° · mín -2° · Parcialmente nublado
  Lun 21 sep · máx 17° · mín  0° · Parcialmente nublado

JERARQUÍA Y RESTRICCIONES
- La temperatura máxima es el dato dominante de cada día; la mínima es
  claramente secundaria. Deben distinguirse de un vistazo, sin leer etiquetas.
- Los 7 días en una fila horizontal, visibles a la vez, sin scroll.
- El diseño tiene que aguantar dos dígitos con signo negativo: en el mismo día
  La Paz marca -2° y Cobija 32°, y dentro de una sola tarjeta hay saltos de 20
  grados entre máxima y mínima.
- Las condiciones climáticas son exactamente estas 7 categorías, ni una más:
  Despejado, Parcialmente nublado, Nublado, Niebla, Llovizna, Lluvia, Nieve,
  Tormenta. Muestra el icono JUNTO al texto, nunca en lugar del texto: el
  icono no puede ser el único portador de la información.
- Los iconos deben ser representables con emoji o con un SVG simple de una
  sola forma. NO uses una librería de iconos.
- Todos los textos en español.
- Paleta sobria con un solo color de acento. Fondo claro.
- Tipografía legible, sin fuentes display ni decorativas.
- Sin fotografías ni ilustraciones grandes.
- El diseño debe poder implementarse con CSS plano: sin efectos que necesiten
  librerías, sin animaciones complejas.

NO INCLUYAS
Buscador de ciudades del mundo, mapas, gráficos de líneas, pronóstico por
horas, publicidad, pantallas de configuración, ni autenticación.
```

## 2 · Pantalla principal, móvil

El mismo prompt, sustituyendo las dos restricciones de composición por:

```
- Diseño para pantalla de 375 px de ancho.
- Los 7 días apilados verticalmente, cada uno en una fila compacta que muestre
  fecha, máxima, mínima y condición en una sola línea legible.
- El selector de 9 ciudades no puede ocupar media pantalla: resuélvelo sin
  ocultar cuál está seleccionada.
```

## 3 · Estados de fallo *(el que más importa para este proyecto)*

La aplicación tiene **una pantalla con cuatro estados**, no cuatro pantallas.
El tercero y el cuarto existen por la decisión D-09 —backend con caché y
respaldo local— y son los que demuestran que el diseño contempla el fallo:

```
Diseña tres variantes de estado de la misma pantalla de pronóstico:

A) CARGANDO — aparece en el primer frame, antes de que lleguen los datos.
   La estructura de la página ya está: el selector de ciudades y el espacio de
   los 7 días. Solo faltan los números. No uses un spinner centrado en pantalla
   vacía: el armazón debe verse desde el principio.

B) ERROR — no se pudo obtener el pronóstico.
   Un mensaje que diga qué pasó y qué hacer, en español, sin códigos HTTP ni
   disculpas, más un botón "Reintentar". Nunca una pantalla en blanco.

C) DATOS ANTIGUOS — el servicio falló pero hay una copia guardada.
   Se muestran los 7 días con normalidad MÁS un aviso discreto de antigüedad,
   del tipo "Datos de hace 2 horas". El aviso debe leerse sin competir con los
   datos ni alarmar: la información sigue siendo útil, solo no es fresca.
```

---

## Entrega

```
docs/design/
├── 01-principal-escritorio.html + .png
├── 02-principal-movil.html      + .png
├── 03-estado-cargando.png
├── 04-estado-error.png
├── 05-estado-datos-antiguos.png
└── tokens.md          paleta, tipografía, espaciado y radios extraídos
```

Al entregarlo, cuenta cuatro cosas: **cuál es la versión definitiva** y por qué
descartaste las otras, **qué ajustaste a mano**, **qué no te convence** del
resultado, y **qué es innegociable**.

## Qué se extrae y qué no

| Sí se extrae | No se copia |
|---|---|
| Los valores hexadecimales de la paleta | El markup generado |
| Tamaños, pesos y familia tipográfica | Las clases de Tailwind |
| La escala de espaciado | La librería de iconos |
| La composición de la tarjeta de día | Las fuentes externas |
| El comportamiento responsive | Cualquier JavaScript del export |
| Radios de borde y sombras (los valores) | |
