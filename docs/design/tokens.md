# Tokens de diseño

Extraídos de `Stich resultado/*/DESIGN.md` (idéntico en las 4 pantallas
generadas) y de inspección visual de `screen.png`. **Solo se extraen valores**
— ver D-08: el `code.html` generado (Tailwind + Material Symbols) no se usa
como fuente.

## Color

```css
--color-accent:       #0284C7;  /* activo, foco, selección */
--color-ink:          #0F172A;  /* texto principal */
--color-ink-soft:     #64748B;  /* metadatos, unidades, etiquetas */
--color-ground:       #F8FAFC;  /* fondo de página */
--color-surface:      #FFFFFF;  /* tarjetas */
--color-line:         #E2E8F0;  /* bordes */

/* estados semánticos, uso puntual (aviso de caché, error) */
--color-warn:         #D97706;
--color-critical:     #DC2626;
--color-ok:           #16A34A;
```

## Tipografía

Dos familias con roles distintos — **Inter** para prosa e interfaz, **mono**
para cualquier cifra, para que los números no salten al cambiar de ciudad.

```css
--font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", monospace;
```

Escala (tamaño / peso / interlineado):

| Rol | Tamaño | Peso | Familia |
|---|---|---|---|
| Nombre de ciudad (hero) | 32px / 26px móvil | 600 | sans |
| Título de sección | 20-24px | 600 | sans |
| Cuerpo | 14-16px | 400 | sans |
| Etiqueta (MÁX, MÍN, HOY) | 11-13px, mayúsculas, tracking 0.04em | 500-600 | sans |
| Temperatura grande (dato dominante) | 36px | 500 | **mono** |
| Temperatura tarjeta de día | 22px | 500 | **mono** |
| Cifras secundarias (sensación, viento) | 12-14px | 400-500 | **mono** |

## Espaciado y radios

```css
--space-xs:  0.25rem;
--space-sm:  0.5rem;
--space-md:  1rem;
--space-lg:  1.5rem;
--space-xl:  2.5rem;

--gutter:          1rem;     /* móvil */
--gutter-desktop:  1.5rem;

--radius-sm:  0.125rem;
--radius:     0.25rem;
--radius-md:  0.375rem;
--radius-lg:  0.5rem;
--radius-xl:  0.75rem;
```

## Composición (de la tarjeta de día)

De arriba a abajo: fecha abreviada + badge "HOY" en la de hoy → icono de
condición + texto de condición → **máxima grande, dominante** (mono 22px) y
mínima secundaria en la misma línea, menor tamaño y `--color-ink-soft` →
sensación térmica en una fila secundaria, más pequeña → viento con icono, al
pie. La tarjeta activa/seleccionada lleva borde de 2px en `--color-accent`.

## Móvil (5 pantallas generadas aparte, set completo y verificado)

Confirmado en `stitch_Mobile/`: el **selector desplegable** resuelve la
simplificación de la grilla de 9 ciudades que se dejaba pendiente — chevron,
ciudad activa con altitud, compacto. Se adopta como referencia directa.

**Se descarta del set móvil:**
- El **pop-up de "detalle del día"**: pantalla completa no pedida, con índice
  UV, probabilidad de precipitación, ráfagas de viento y de nuevo humedad y
  presión (ya descartadas en D-11). Fuera de alcance — ver AI_LOG E-08.
- La **barra de navegación inferior** (Resumen/Capitales/Radar/Alertas): esta
  app es una sola pantalla, no cuatro secciones.
- El código de estación inventado ("SLLP / Estación El Alto") en el estado de
  error.
- El archivo del estado de carga móvil llegó corrupto en la primera
  descarga (ver AI_LOG E-09); ya se corrigió y es consistente con el
  criterio de escritorio.

## Lo que se ajusta al implementar, no del diseño generado

1. **Selector de 9 ciudades** → desplegable, según la referencia móvil de
   arriba. Ya no es una decisión pendiente.
2. **Texto de error**: no asumir problema de conexión del usuario — el fallo
   real más probable es el proveedor (Open-Meteo o el proxy D-09), no la red
   del visitante. Ni inventar códigos de estación meteorológica.
3. **Avisos de "datos antiguos"**: el diseño ofrece tres (banner, badge,
   nota de pie); la implementación usa uno o dos, no los tres.
4. **Ilustración de Bolivia**: se conserva como zona interactiva (aclarado
   explícitamente en el prompt de corrección: no es un mapa geográfico real).

## Lo que NO se usa del `code.html` generado

Tailwind CSS (CDN), Material Symbols (librería de iconos), y toda la
estructura de `div`. Contradicen D-03 y D-08. El CSS de este proyecto se
escribe a mano sobre estos tokens.
