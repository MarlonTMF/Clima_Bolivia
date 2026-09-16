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

---

## 4 · Corrección tras la primera generación

Pégalo en el **mismo chat** de Stitch donde generaste la versión 1, para que
ajuste el diseño existente en vez de generar uno nuevo.

```
Ajusta el diseño con estos cambios:

QUITAR POR COMPLETO
- El gráfico de barras "Rango Térmico Semanal" y la pestaña "Comparativa 9
  Capitales". No hay gráficos en esta aplicación.
- El icono de usuario / perfil de la esquina superior derecha. No hay cuentas
  ni login.
- Todo el texto de "RED OFICIAL DE MONITOREO ATMOSFÉRICO", "ESTADO
  PLURINACIONAL DE BOLIVIA" y "NORMA OMM REGIÓN III". No es un servicio
  gubernamental; sustitúyelo por un pie de página simple: "Datos: Open-Meteo".
- "Actualización continua cada 60 min" — cámbialo por "Actualización cada 30
  minutos" (es el dato real).
- Humedad (%) y presión (hPa). No están disponibles en nuestra fuente de
  datos a granularidad diaria.

MANTENER, PERO SIMPLIFICAR
- El selector de ciudades con la ilustración de Bolivia: no es un mapa
  geográfico real, es una IMAGEN ilustrativa del país con las 9 siluetas
  departamentales como zonas clicables. Consérvalo así, pero simplifica la
  lista de accesos rápidos de la derecha: en vez de 9 tarjetas grandes en
  grilla, usa una lista compacta o un desplegable, porque hoy ocupa demasiado
  espacio vertical para lo que es (elegir 1 de 9 opciones).

AÑADIR — con datos reales
El pronóstico incluye dos datos más por día, además de máxima, mínima y
condición: sensación térmica (máxima y mínima) y viento máximo. Añádelos a
cada tarjeta del día de forma compacta y secundaria — no deben competir
visualmente con la máxima, que sigue siendo el dato dominante.

DATOS REALES DE LA PAZ para las 7 tarjetas (reemplaza los que ya tenías):
  Mar 15 sep | máx 18° (sensación 15°) · mín -2° (sensación -6°) | viento 17 km/h | Parcialmente nublado
  Mié 16 sep | máx 17° (sensación 15°) · mín  1° (sensación -2°) | viento 14 km/h | Llovizna
  Jue 17 sep | máx 16° (sensación 13°) · mín  1° (sensación -1°) | viento 19 km/h | Nublado
  Vie 18 sep | máx 15° (sensación 14°) · mín  2° (sensación  0°) | viento 15 km/h | Nieve
  Sáb 19 sep | máx 16° (sensación 13°) · mín  2° (sensación  0°) | viento 15 km/h | Nieve
  Dom 20 sep | máx 16° (sensación 16°) · mín -2° (sensación -6°) | viento  9 km/h | Despejado
  Lun 21 sep | máx 17° (sensación 15°) · mín  0° (sensación -3°) | viento 18 km/h | Parcialmente nublado

Nota: la sensación térmica puede ser bastante más baja que la temperatura del
aire en el Altiplano (por el viento y la altitud) — el diseño debe aguantar
diferencias de hasta 6-7 grados entre ambas sin verse desordenado.

En el panel de resumen superior (donde antes decía "Sensación 11° · 48%
Humedad · 14 km/h Viento · 660 hPa Presión"), dejar solo la sensación térmica
y el viento del día actual, quitando humedad y presión.
```
